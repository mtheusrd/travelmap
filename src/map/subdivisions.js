const cache = {};

export async function loadSubdivisions(isoA3) {
  if (!isoA3 || isoA3 === '-99') return null;
  if (cache[isoA3]) return cache[isoA3];

  try {
    const url = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson`;
    
    // Só carrega uma vez e filtra por país
    if (!cache['_all']) {
      const res = await fetch(url);
      if (!res.ok) return null;
      cache['_all'] = await res.json();
    }

    const all = cache['_all'];
    const filtered = {
      type: 'FeatureCollection',
      features: all.features.filter(f =>
        (f.properties.adm0_a3 || '').toUpperCase() === isoA3.toUpperCase()
      ),
    };

    cache[isoA3] = filtered;
    return filtered;
  } catch {
    return null;
  }
}