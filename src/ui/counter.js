import { getAllVisitedStats } from '../data/visits.js';

export function initCounter() {
  const counterEl = document.createElement('div');
  counterEl.id = 'travel-counter';
  document.getElementById('app').appendChild(counterEl);

  function update() {
    const { countries, subdivisions } = getAllVisitedStats();
    counterEl.innerHTML = `
      <div class="counter-item">
        <span class="counter-number">${countries}</span>
        <span class="counter-label">países</span>
      </div>
      <div class="counter-divider">✦</div>
      <div class="counter-item">
        <span class="counter-number">${subdivisions}</span>
        <span class="counter-label">regiões</span>
      </div>
    `;
  }

  update();
  window.addEventListener('visits-updated', update);
}