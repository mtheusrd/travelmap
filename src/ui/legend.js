export function initLegend() {
  const legend = document.createElement('div');
  legend.id = 'map-legend';
  legend.innerHTML = `
    <div class="legend-title">LEGENDA</div>
    <div class="legend-item">
      <span class="legend-dot" style="background:#2a2a2a; border: 1px solid #c9a84c;"></span>
      <span class="legend-text">Não visitado</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot" style="background:#c9a84c;"></span>
      <span class="legend-text">Visitado</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot" style="background:#3a3a3a; border: 1px solid #c9a84c;"></span>
      <span class="legend-text">Seleccionado</span>
    </div>
  `;
  document.getElementById('app').appendChild(legend);
}