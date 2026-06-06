const STORAGE_KEY = 'travelmap_visits';

function loadVisits() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { subdivisions: {} };
  } catch {
    return { subdivisions: {} };
  }
}

function saveVisits(visits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
}

export function isSubdivisionVisited(isoA3, subdivName) {
  const visits = loadVisits();
  return !!(visits.subdivisions[isoA3]?.[subdivName]);
}

export function toggleSubdivisionVisit(isoA3, subdivName) {
  const visits = loadVisits();
  if (!visits.subdivisions[isoA3]) visits.subdivisions[isoA3] = {};
  
  if (visits.subdivisions[isoA3][subdivName]) {
    delete visits.subdivisions[isoA3][subdivName];
    saveVisits(visits);
    return false;
  } else {
    visits.subdivisions[isoA3][subdivName] = { date: '', note: '' };
    saveVisits(visits);
    return true;
  }
}

export function saveSubdivisionDetails(isoA3, subdivName, date, note) {
  const visits = loadVisits();
  if (!visits.subdivisions[isoA3]) visits.subdivisions[isoA3] = {};
  if (!visits.subdivisions[isoA3][subdivName]) {
    visits.subdivisions[isoA3][subdivName] = {};
  }
  visits.subdivisions[isoA3][subdivName].date = date;
  visits.subdivisions[isoA3][subdivName].note = note;
  saveVisits(visits);
}

export function getSubdivisionDetails(isoA3, subdivName) {
  const visits = loadVisits();
  return visits.subdivisions[isoA3]?.[subdivName] || null;
}

export function isCountryVisited(isoA3) {
  const visits = loadVisits();
  return !!(visits.subdivisions[isoA3] && Object.keys(visits.subdivisions[isoA3]).length > 0);
}

export function getVisitedSubdivisions(isoA3) {
  const visits = loadVisits();
  return Object.keys(visits.subdivisions[isoA3] || {});
}

export function getAllVisitedStats() {
  const visits = loadVisits();
  const countries = Object.keys(visits.subdivisions).filter(
    iso => Object.keys(visits.subdivisions[iso]).length > 0
  ).length;
  const subdivisions = Object.values(visits.subdivisions).reduce(
    (acc, subs) => acc + Object.keys(subs).length, 0
  );
  return { countries, subdivisions };
}