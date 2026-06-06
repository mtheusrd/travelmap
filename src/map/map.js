import L from 'leaflet';
import { loadSubdivisions } from './subdivisions.js';
import { isCountryVisited, isSubdivisionVisited, toggleSubdivisionVisit } from '../data/visits.js';
import { initPanel, showPanel, updateVisitButton, hidePanel } from '../ui/panel.js';

const VISITED_COLOR = '#c9a84c';
const DEFAULT_COLOR = '#2a2a2a';
const HOVER_COLOR = '#3a3a3a';
const SUBDIVISION_COLOR = '#1a1a1a';
const SUBDIVISION_VISITED_COLOR = '#c9a84c';

let activeCountryLayer = null;
let activeSubdivisionLayer = null;
let currentCountryFeature = null;
const countryLayers = {};

function getCountryStyle(isVisited) {
  return {
    fillColor: isVisited ? VISITED_COLOR : DEFAULT_COLOR,
    fillOpacity: 1,
    color: '#c9a84c',
    weight: 0.5,
    opacity: 0.4,
  };
}

function getSubdivisionStyle(isVisited) {
  return {
    fillColor: isVisited ? SUBDIVISION_VISITED_COLOR : SUBDIVISION_COLOR,
    fillOpacity: isVisited ? 0.5 : 0.6,
    color: '#c9a84c',
    weight: 0.4,
    opacity: 0.5,
    dashArray: isVisited ? null : '3',
    stroke: true,
  };
}

async function showSubdivisionsForCountry(map, feature) {
  if (activeSubdivisionLayer) {
    map.removeLayer(activeSubdivisionLayer);
    activeSubdivisionLayer = null;
  }

  const isoA3 = feature.properties.ISO_A3;
  if (!isoA3 || isoA3 === '-99') return;

  const data = await loadSubdivisions(isoA3);
  if (!data) return;

  activeSubdivisionLayer = L.geoJSON(data, {
    style: (f) => {
      const name = f.properties.name || f.properties.NAME_1;
      return getSubdivisionStyle(isSubdivisionVisited(isoA3, name));
    },
    onEachFeature: (f, layer) => {
      const name = f.properties.name || f.properties.NAME_1;
      const countryName = feature.properties.ADMIN || feature.properties.name;

      layer.on('mouseover', () => {
        layer.setStyle({
          fillColor: isSubdivisionVisited(isoA3, name) ? '#e8d5a3' : '#2a2a2a',
          fillOpacity: 0.9,
          color: '#e8d5a3',
          weight: 0.8,
        });
        if (name) {
          layer.bindTooltip(name, {
            permanent: false,
            sticky: true,
            className: 'subdivision-tooltip',
          }).openTooltip();
        }
      });

      layer.on('mouseout', () => {
        layer.setStyle(getSubdivisionStyle(isSubdivisionVisited(isoA3, name)));
      });

      layer.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        showPanel(countryName, isoA3, name, isSubdivisionVisited(isoA3, name));
      });
    },
  }).addTo(map);
}

export function initMap() {
  const map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 10,
    zoomControl: true,
    worldCopyJump: false,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 1.0,
    renderer: L.canvas(),
  });

  initPanel((isoA3, subdivName) => {
    const isNowVisited = toggleSubdivisionVisit(isoA3, subdivName);
    updateVisitButton(isNowVisited);
    window.dispatchEvent(new CustomEvent('visits-updated'));

    // Actualizar estilo da subdivisão
    if (activeSubdivisionLayer) {
      activeSubdivisionLayer.eachLayer(l => {
        const n = l.feature?.properties?.name || l.feature?.properties?.NAME_1;
        if (n === subdivName) {
          l.setStyle(getSubdivisionStyle(isNowVisited));
        }
      });
    }

    // Actualizar cor do país
    const countryLayer = countryLayers[isoA3];
    if (countryLayer) {
      countryLayer.setStyle(getCountryStyle(isCountryVisited(isoA3)));
    }
  });

  fetch('/data/countries.geojson')
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, {
        style: (feature) => {
          const isoA3 = feature.properties.ISO_A3;
          return getCountryStyle(isCountryVisited(isoA3));
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties.ADMIN || feature.properties.name;
          const isoA3 = feature.properties.ISO_A3;

          if (isoA3) countryLayers[isoA3] = layer;

          layer.on('mouseover', () => {
            if (layer !== activeCountryLayer) {
              layer.setStyle({ fillColor: HOVER_COLOR, fillOpacity: 0.8 });
            }
            if (name) {
              layer.bindTooltip(name, {
                permanent: false,
                sticky: true,
                className: 'country-tooltip',
              }).openTooltip();
            }
          });

          layer.on('mouseout', () => {
            if (layer !== activeCountryLayer) {
              layer.setStyle(getCountryStyle(isCountryVisited(isoA3)));
            }
          });

          layer.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (activeCountryLayer && activeCountryLayer !== layer) {
              const prevIso = activeCountryLayer.feature?.properties?.ISO_A3;
              activeCountryLayer.setStyle(getCountryStyle(isCountryVisited(prevIso)));
            }
            activeCountryLayer = layer;
            currentCountryFeature = feature;
            layer.setStyle({ fillColor: HOVER_COLOR, fillOpacity: 0.9 });
            showSubdivisionsForCountry(map, feature);
            hidePanel();
          });
        },
      }).addTo(map);
    });

  map.on('click', () => {
    if (activeSubdivisionLayer) {
      map.removeLayer(activeSubdivisionLayer);
      activeSubdivisionLayer = null;
    }
    if (activeCountryLayer) {
      const isoA3 = activeCountryLayer.feature?.properties?.ISO_A3;
      activeCountryLayer.setStyle(getCountryStyle(isCountryVisited(isoA3)));
      activeCountryLayer = null;
    }
    hidePanel();
  });

  return map;
}