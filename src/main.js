import './style.css';
import { initMap } from './map/map.js';
import { initCounter } from './ui/counter.js';
import { initLegend } from './ui/legend.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initCounter();
  initLegend();
});