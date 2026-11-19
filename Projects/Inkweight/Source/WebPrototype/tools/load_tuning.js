// Node-only helper: read the shared tuning file. The core itself never reads
// files; it receives the parsed tuning object.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SHARED_DIR = fileURLToPath(new URL('../../Shared/', import.meta.url));
export const TUNING_PATH = SHARED_DIR + 'ink_tuning.json';

export function loadTuning() {
  return JSON.parse(readFileSync(TUNING_PATH, 'utf8'));
}

// Apply overrides like { 'stats.speedBase': 20 } to a tuning object (in place).
export function applyOverrides(tuning, overrides) {
  for (const key of Object.keys(overrides)) {
    const parts = key.split('.');
    let o = tuning;
    for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    const last = parts[parts.length - 1];
    if (!(last in o)) throw new Error('unknown tuning key ' + key);
    o[last] = overrides[key];
  }
  return tuning;
}
