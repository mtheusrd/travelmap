let panelEl = null;
let onToggleVisit = null;

export function initPanel(onToggle) {
  onToggleVisit = onToggle;

  panelEl = document.createElement('div');
  panelEl.id = 'country-panel';
  document.getElementById('app').appendChild(panelEl);

  document.getElementById('app').addEventListener('click', (e) => {
    if (e.target.id === 'panel-close') hidePanel();
    if (e.target.id === 'panel-visit-btn') {
      const isoA3 = panelEl.dataset.isoA3;
      const subdivName = panelEl.dataset.subdivName;
      if (isoA3 && subdivName && onToggleVisit) onToggleVisit(isoA3, subdivName);
    }
  });
}

export function showPanel(countryName, isoA3, subdivName, isVisited) {
  panelEl.dataset.isoA3 = isoA3;
  panelEl.dataset.subdivName = subdivName;

  const flag = getFlag(isoA3);
  const visitedClass = isVisited ? 'visited' : '';
  const visitedText = isVisited ? '✓ Visitado' : '+ Marcar como visitado';

  panelEl.innerHTML = `
    <div class="panel-header">
      <span class="panel-flag">${flag}</span>
      <button id="panel-close">✕</button>
    </div>
    <div class="panel-body">
      <div class="panel-country">${countryName}</div>
      <div class="panel-divider"></div>
      <div class="panel-subdivision-label">REGIÃO</div>
      <div class="panel-subdivision-name">${subdivName}</div>
      <button id="panel-visit-btn" class="${visitedClass}">${visitedText}</button>
    </div>
  `;

  panelEl.classList.add('visible');
}

export function updateVisitButton(isVisited) {
  const btn = document.getElementById('panel-visit-btn');
  if (!btn) return;
  if (isVisited) {
    btn.textContent = '✓ Visitado';
    btn.classList.add('visited');
  } else {
    btn.textContent = '+ Marcar como visitado';
    btn.classList.remove('visited');
  }
}

export function hidePanel() {
  if (panelEl) panelEl.classList.remove('visible');
}

function getFlag(isoA3) {
  const iso3to2 = {
    PRT:'PT',BRA:'BR',ESP:'ES',FRA:'FR',ITA:'IT',DEU:'DE',GBR:'GB',
    USA:'US',JPN:'JP',CHN:'CN',ARG:'AR',MEX:'MX',CAN:'CA',AUS:'AU',
    IND:'IN',RUS:'RU',ZAF:'ZA',EGY:'EG',NGA:'NG',KEN:'KE',MAR:'MA',
    SAU:'SA',TUR:'TR',IRN:'IR',PAK:'PK',BGD:'BD',IDN:'ID',THA:'TH',
    VNM:'VN',PHL:'PH',KOR:'KR',PRK:'KP',MYS:'MY',SGP:'SG',NZL:'NZ',
    NOR:'NO',SWE:'SE',FIN:'FI',DNK:'DK',NLD:'NL',BEL:'BE',CHE:'CH',
    AUT:'AT',POL:'PL',CZE:'CZ',HUN:'HU',ROU:'RO',GRC:'GR',
    UKR:'UA',SRB:'RS',HRV:'HR',SVK:'SK',BGR:'BG',LTU:'LT',LVA:'LV',
    EST:'EE',ISL:'IS',IRL:'IE',COL:'CO',VEN:'VE',PER:'PE',CHL:'CL',
    ECU:'EC',BOL:'BO',PRY:'PY',URY:'UY',GTM:'GT',CUB:'CU',DOM:'DO',
    CRI:'CR',PAN:'PA',HND:'HN',SLV:'SV',NIC:'NI',JAM:'JM',HTI:'HT',
    DZA:'DZ',LBY:'LY',TUN:'TN',SDN:'SD',ETH:'ET',TZA:'TZ',UGA:'UG',
    MOZ:'MZ',ZMB:'ZM',ZWE:'ZW',AGO:'AO',CMR:'CM',GHA:'GH',CIV:'CI',
    SEN:'SN',MLI:'ML',BFA:'BF',NER:'NE',TCD:'TD',SOM:'SO',IRQ:'IQ',
    SYR:'SY',YEM:'YE',JOR:'JO',ISR:'IL',LBN:'LB',ARE:'AE',KWT:'KW',
    QAT:'QA',BHR:'BH',OMN:'OM',AFG:'AF',KAZ:'KZ',UZB:'UZ',TKM:'TM',
    AZE:'AZ',GEO:'GE',ARM:'AM',MNG:'MN',NPL:'NP',LKA:'LK',MMR:'MM',
    KHM:'KH',LAO:'LA',PNG:'PG',FJI:'FJ',
  };
  const iso2 = iso3to2[isoA3];
  if (!iso2) return '🌍';
  return iso2.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(c.charCodeAt(0) + 127397)
  );
}