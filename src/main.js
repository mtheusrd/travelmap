import './style.css';
import { initMap } from './map/map.js';
import { initCounter } from './ui/counter.js';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  initCounter();
});