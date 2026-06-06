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
  return !!(visits.subdivisions[isoA3] && visits.subdivisions[isoA3].includes(subdivName));
}

export function toggleSubdivisionVisit(isoA3, subdivName) {
  const visits = loadVisits();
  if (!visits.subdivisions[isoA3]) visits.subdivisions[isoA3] = [];
  const idx = visits.subdivisions[isoA3].indexOf(subdivName);
  if (idx === -1) {
    visits.subdivisions[isoA3].push(subdivName);
  } else {
    visits.subdivisions[isoA3].splice(idx, 1);
  }
  saveVisits(visits);
  return idx === -1;
}

export function isCountryVisited(isoA3) {
  const visits = loadVisits();
  return !!(visits.subdivisions[isoA3] && visits.subdivisions[isoA3].length > 0);
}

export function getVisitedSubdivisions(isoA3) {
  return loadVisits().subdivisions[isoA3] || [];
}