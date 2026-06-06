import L from 'leaflet';
import { loadSubdivisions } from './subdivisions.js';

const VISITED_COLOR = '#c9a84c';
const DEFAULT_COLOR = '#2a2a2a';
const HOVER_COLOR = '#3a3a3a';
const SUBDIVISION_COLOR = '#1a1a1a';

let activeCountryLayer = null;
let activeSubdivisionLayer = null;

function getCountryStyle(isVisited) {
  return {
    fillColor: isVisited ? VISITED_COLOR : DEFAULT_COLOR,
    fillOpacity: 1,
    color: '#c9a84c',
    weight: 0.5,
    opacity: 0.4,
  };
}

function getSubdivisionStyle() {
  return {
    fillColor: SUBDIVISION_COLOR,
    fillOpacity: 0.6,
    color: '#c9a84c',
    weight: 0.4,
    opacity: 0.5,
    dashArray: '3',
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
    style: getSubdivisionStyle(),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || feature.properties.NAME_1;

      layer.on('mouseover', () => {
        layer.setStyle({
          fillColor: '#2a2a2a',
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
        layer.setStyle(getSubdivisionStyle());
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

  fetch('/data/countries.geojson')
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, {
        style: () => getCountryStyle(false),
        onEachFeature: (feature, layer) => {
          const name = feature.properties.ADMIN || feature.properties.name;

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
              layer.setStyle(getCountryStyle(false));
            }
          });

          layer.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (activeCountryLayer && activeCountryLayer !== layer) {
              activeCountryLayer.setStyle(getCountryStyle(false));
            }
            activeCountryLayer = layer;
            layer.setStyle({ fillColor: HOVER_COLOR, fillOpacity: 0.9 });
            showSubdivisionsForCountry(map, feature);
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
      activeCountryLayer.setStyle(getCountryStyle(false));
      activeCountryLayer = null;
    }
  });

  return map;
}