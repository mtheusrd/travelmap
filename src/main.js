import './style.css';
import { initMap } from './map/map.js';
import { initCounter } from './ui/counter.js';
import { initLegend } from './ui/legend.js';
import { syncFromCloud } from './data/visits.js';

document.addEventListener('DOMContentLoaded', async () => {
  await syncFromCloud(); // carrega dados da cloud primeiro
  initMap();
  initCounter();
  initLegend();
});