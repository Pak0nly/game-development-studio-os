// The local gallery: drawings stay in this browser only. Every storage access
// is guarded; without storage the gallery lives in memory for the session.

import { W, H } from './tuning.js';

const KEY = 'inkweight.gallery.v1';
const BEST_KEY = 'inkweight.best.v1';
const SEEN_KEY = 'inkweight.seenHint.v2';
const MAX_ITEMS = 40;
let items = null;       // [{ id, kind: 'figure' | 'weapon', data: string of W*H digits }]
let storageWorks = true;
const memory = {};

function read(key) {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? (key in memory ? memory[key] : null) : v;
  } catch (e) { storageWorks = false; return key in memory ? memory[key] : null; }
}
function write(key, value) {
  memory[key] = value;
  try { window.localStorage.setItem(key, value); } catch (e) { storageWorks = false; }
}

export function storageOk() { read(KEY); return storageWorks; }

function encode(cells) { return cells.join(''); }
export function decode(data) {
  const cells = new Array(W * H);
  for (let i = 0; i < W * H; i++) {
    const v = data.charCodeAt(i) - 48;
    cells[i] = v >= 1 && v <= 4 ? v : 0;
  }
  return cells;
}

export function galleryAll() {
  if (items) return items;
  items = [];
  const raw = read(KEY);
  if (raw) {
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const it of list) {
          if (it && typeof it.data === 'string' && it.data.length === W * H) {
            items.push({ id: String(it.id), kind: it.kind === 'weapon' ? 'weapon' : 'figure', data: it.data });
          }
        }
      }
    } catch (e) { items = []; }
  }
  return items;
}

function persist() { write(KEY, JSON.stringify(items)); }

// Newest first. The same drawing is not stored twice.
export function galleryAdd(cells, kind) {
  const list = galleryAll();
  const data = encode(cells);
  const at = list.findIndex((it) => it.data === data);
  if (at !== -1) list.splice(at, 1);
  list.unshift({ id: Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36), kind: kind === 'weapon' ? 'weapon' : 'figure', data });
  while (list.length > MAX_ITEMS) list.pop();
  persist();
}
export function galleryRemove(id) {
  const list = galleryAll();
  const at = list.findIndex((it) => it.id === id);
  if (at !== -1) { list.splice(at, 1); persist(); }
}
export function galleryClear() { items = []; persist(); }

export function bestScore() { const v = parseInt(read(BEST_KEY) || '0', 10); return v > 0 ? v : 0; }
export function saveBestScore(score) { if (score > bestScore()) { write(BEST_KEY, String(score)); return true; } return false; }
export function hintSeen() { return read(SEEN_KEY) === '1'; }
export function markHintSeen() { write(SEEN_KEY, '1'); }
