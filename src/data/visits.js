import { supabase } from './supabase.js';

const STORAGE_KEY = 'travelmap_visits';

// ─── LocalStorage (cache local) ───────────────────────────────

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { subdivisions: {} };
  } catch {
    return { subdivisions: {} };
  }
}

function saveLocal(visits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
}

// ─── Supabase (cloud) ─────────────────────────────────────────

export async function syncFromCloud() {
  const { data, error } = await supabase.from('visits').select('*');
  if (error || !data) return;

  const visits = { subdivisions: {} };
  data.forEach(row => {
    if (!visits.subdivisions[row.iso_a3]) {
      visits.subdivisions[row.iso_a3] = {};
    }
    visits.subdivisions[row.iso_a3][row.subdivision_name] = {
      date: row.visited_date || '',
      note: row.note || '',
    };
  });

  saveLocal(visits);
  window.dispatchEvent(new CustomEvent('visits-updated'));
}

async function upsertToCloud(isoA3, subdivName, date, note) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('visits').upsert({
    iso_a3: isoA3,
    subdivision_name: subdivName,
    visited_date: date || null,
    note: note || null,
    user_id: user.id,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'iso_a3,subdivision_name' });
}

async function deleteFromCloud(isoA3, subdivName) {
  await supabase.from('visits')
    .delete()
    .eq('iso_a3', isoA3)
    .eq('subdivision_name', subdivName);
}

// ─── API pública ──────────────────────────────────────────────

export function isSubdivisionVisited(isoA3, subdivName) {
  const visits = loadLocal();
  return !!(visits.subdivisions[isoA3]?.[subdivName]);
}

export async function toggleSubdivisionVisit(isoA3, subdivName) {
  const visits = loadLocal();
  if (!visits.subdivisions[isoA3]) visits.subdivisions[isoA3] = {};

  const isVisited = !!visits.subdivisions[isoA3][subdivName];

  if (isVisited) {
    delete visits.subdivisions[isoA3][subdivName];
    saveLocal(visits);
    await deleteFromCloud(isoA3, subdivName);
    return false;
  } else {
    visits.subdivisions[isoA3][subdivName] = { date: '', note: '' };
    saveLocal(visits);
    await upsertToCloud(isoA3, subdivName, '', '');
    return true;
  }
}

export async function saveSubdivisionDetails(isoA3, subdivName, date, note) {
  const visits = loadLocal();
  if (!visits.subdivisions[isoA3]) visits.subdivisions[isoA3] = {};
  visits.subdivisions[isoA3][subdivName] = { date, note };
  saveLocal(visits);
  await upsertToCloud(isoA3, subdivName, date, note);
}

export function getSubdivisionDetails(isoA3, subdivName) {
  return loadLocal().subdivisions[isoA3]?.[subdivName] || null;
}

export function isCountryVisited(isoA3) {
  const visits = loadLocal();
  return !!(visits.subdivisions[isoA3] && Object.keys(visits.subdivisions[isoA3]).length > 0);
}

export function getVisitedSubdivisions(isoA3) {
  return Object.keys(loadLocal().subdivisions[isoA3] || {});
}

export function getAllVisitedStats() {
  const visits = loadLocal();
  const countries = Object.keys(visits.subdivisions).filter(
    iso => Object.keys(visits.subdivisions[iso]).length > 0
  ).length;
  const subdivisions = Object.values(visits.subdivisions).reduce(
    (acc, subs) => acc + Object.keys(subs).length, 0
  );
  return { countries, subdivisions };
}