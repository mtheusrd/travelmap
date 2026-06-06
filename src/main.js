import './style.css';
import { initMap } from './map/map.js';
import { initCounter } from './ui/counter.js';
import { initLegend } from './ui/legend.js';
import { syncFromCloud } from './data/visits.js';
import { initAuth, hideAuth } from './ui/auth.js';
import { supabase } from './data/supabase.js';

async function startApp() {
  await syncFromCloud();
  initMap();
  initCounter();
  initLegend();
}

async function boot() {
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    initAuth(async () => {});
    hideAuth();
    await startApp();
  } else {
    initAuth(async () => {
      await startApp();
    });
  }
}

boot();