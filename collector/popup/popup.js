'use strict';

const $ = (id) => document.getElementById(id);
const nf = new Intl.NumberFormat('el-GR');
const LABEL = { make: 'μάρκα', year: 'έτος', km: 'χλμ', price: 'τιμή' };
const DAY = 86400000;

async function loadAll() {
  const all = await chrome.storage.local.get(null);
  const posts = Object.keys(all).filter((k) => k.startsWith('p:')).map((k) => all[k]);
  const today = new Date().toISOString().slice(0, 10);
  const stats = all.stats && all.stats.day === today ? all.stats : { newToday: 0 };
  return { posts, stats, groups: all.groups || {}, settings: all.settings || { enabled: true, showChips: true } };
}

// Not seen for 3+ days although its group was scanned since: probably sold or removed.
function maybeGone(p, groups) {
  if (p.sold || p.source !== 'fb-group' || !p.groupId || !groups[p.groupId]) return false;
  return new Date(groups[p.groupId].lastScan) - new Date(p.lastSeen) >= 3 * DAY;
}

document.querySelector('.sub').textContent += ', έκδοση ' + chrome.runtime.getManifest().version;

async function render() {
  const { posts, stats, groups, settings } = await loadAll();
  $('enabled').checked = settings.enabled !== false;
  $('chips').checked = settings.showChips !== false;
  $('s-today').textContent = nf.format(stats.newToday || 0);
  $('s-total').textContent = nf.format(posts.length);
  $('s-review').textContent = nf.format(posts.filter((p) => p.missing && p.missing.length).length);
  $('s-sold').textContent = nf.format(posts.filter((p) => p.sold).length);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }).catch(() => []);
  const onFb = tab && /^https:\/\/([a-z]+\.)?facebook\.com\/(groups|marketplace|commerce)/.test(tab.url || '');
  await pageStatus(tab, onFb);

  const list = $('recent');
  list.textContent = '';
  const recent = posts.sort((a, b) => (b.lastSeen > a.lastSeen ? 1 : -1)).slice(0, 12);
  $('empty').hidden = recent.length > 0;
  for (const p of recent) {
    const f = p.parsed || {};
    const li = document.createElement('li');
    const wrap = document.createElement(p.url ? 'a' : 'div');
    if (p.url) {
      wrap.href = p.url;
      wrap.target = '_blank';
      wrap.rel = 'noopener';
    } else wrap.className = 'item';
    if (p.sold) wrap.classList.add('sold');
    else if (p.missing && p.missing.length) wrap.classList.add('review');
    const box = document.createElement('div');
    box.className = 'txt';
    const t = document.createElement('div');
    t.className = 't';
    t.textContent = [f.make, f.model, f.year].filter(Boolean).join(' ') || 'Χωρίς μάρκα';
    const d = document.createElement('div');
    d.className = 'd';
    const last = p.prices && p.prices.length ? p.prices[p.prices.length - 1].price : f.price;
    d.textContent = [last != null ? nf.format(last) + ' €' : null, f.km != null ? nf.format(f.km) + ' χλμ' : null, f.place].filter(Boolean).join(', ');
    let tag = null;
    if (p.sold) tag = 'Πουλήθηκε';
    else if (p.missing && p.missing.length) tag = 'Λείπει: ' + p.missing.map((k) => LABEL[k]).join(', ');
    if (tag) {
      const s = document.createElement('span');
      s.className = 'tag';
      s.textContent = (d.textContent ? '. ' : '') + tag;
      d.append(s);
    }
    box.append(t, d);
    wrap.append(box);
    li.append(wrap);
    list.append(li);
  }
  render.cache = { posts, groups };
}

async function pageStatus(tab, onFb) {
  const el = $('pagestatus');
  const auto = $('auto');
  auto.hidden = true;
  $('autohint').hidden = true;
  el.classList.remove('warn');
  if (!onFb) {
    el.textContent = 'Άνοιξε ένα γκρουπ αυτοκινήτων ή το Marketplace στο Facebook. Οι αγγελίες που βλέπεις αποθηκεύονται μόνες τους.';
    return;
  }
  let st = null;
  try {
    st = await chrome.tabs.sendMessage(tab.id, { type: 'status' });
  } catch (e) {
    st = null;
  }
  el.classList.toggle('warn', !st || !st.found || !st.carAds);
  if (!st) {
    el.textContent = 'Η επέκταση δεν τρέχει σε αυτή την καρτέλα. Ξαναφόρτωσε τη σελίδα του Facebook (F5) και κάνε λίγο scroll.';
  } else if (!st.enabled) {
    el.textContent = 'Η συλλογή είναι σε παύση.';
  } else if (!st.at) {
    el.textContent = 'Περιμένω να φορτώσει η σελίδα. Κάνε λίγο scroll.';
  } else if (!st.found) {
    el.textContent = 'Δεν βρίσκω αναρτήσεις σε αυτή τη σελίδα. Πάτα «Αντιγραφή διάγνωσης» και στείλ’ το μου.';
  } else {
    auto.hidden = false;
    $('autohint').hidden = !!(st.auto && st.auto.running);
    auto.dataset.tab = tab.id;
    auto.dataset.running = st.auto && st.auto.running ? '1' : '';
    auto.textContent = st.auto && st.auto.running ? 'Παύση αυτόματης κύλισης' : 'Έναρξη αυτόματης κύλισης';
    auto.classList.toggle('stop', !!(st.auto && st.auto.running));
    el.textContent = 'Σε αυτή τη σελίδα: ' + st.found + ' αναρτήσεις στην οθόνη, ' + st.carAds + ' αγγελίες αυτοκινήτων.' + (st.carAds ? '' : ' Αν βλέπεις αγγελίες, πάτα «Αντιγραφή διάγνωσης» και στείλ’ το μου.');
  }
}

function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function csvCell(v) {
  if (v == null) return '';
  const s = Array.isArray(v) ? v.join(' | ') : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const COLUMNS = [
  ['key', (p) => p.key],
  ['source', (p) => p.source],
  ['group_id', (p) => p.groupId],
  ['group_name', (p) => p.groupName],
  ['post_id', (p) => p.postId],
  ['url', (p) => p.url],
  ['first_seen', (p) => p.firstSeen],
  ['last_seen', (p) => p.lastSeen],
  ['days_seen', (p) => (p.days || []).length],
  ['make', (p) => p.parsed.make],
  ['model', (p) => p.parsed.model],
  ['year', (p) => p.parsed.year],
  ['km', (p) => p.parsed.km],
  ['price_first', (p) => (p.prices[0] || {}).price],
  ['price_last', (p) => (p.prices[p.prices.length - 1] || {}).price],
  ['price_min', (p) => (p.prices.length ? Math.min(...p.prices.map((x) => x.price)) : null)],
  ['price_changes', (p) => Math.max(0, p.prices.length - 1)],
  ['fuel', (p) => p.parsed.fuel],
  ['gearbox', (p) => p.parsed.gearbox],
  ['cc', (p) => p.parsed.cc],
  ['hp', (p) => p.parsed.hp],
  ['place', (p) => p.parsed.place],
  ['region', (p) => p.parsed.region],
  ['origin', (p) => p.parsed.origin],
  ['sold', (p) => (p.sold ? 1 : 0)],
  ['sold_at', (p) => p.soldAt],
  ['maybe_gone', (p, g) => (maybeGone(p, g) ? 1 : 0)],
  ['offers', (p) => p.offers],
  ['needs_review', (p) => (p.missing && p.missing.length ? 1 : 0)],
  ['missing', (p) => p.missing],
  ['text', (p) => p.text],
];

function stamp() {
  return new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
}

$('csv').addEventListener('click', async () => {
  const { posts, groups } = await loadAll();
  const rows = [COLUMNS.map((c) => c[0]).join(',')];
  for (const p of posts) rows.push(COLUMNS.map(([, fn]) => csvCell(fn(p, groups))).join(','));
  // BOM so Excel opens Greek text correctly.
  download('chekcareto-' + stamp() + '.csv', '﻿' + rows.join('\r\n'), 'text/csv;charset=utf-8');
});

$('json').addEventListener('click', async () => {
  const { posts, groups } = await loadAll();
  const out = posts.map((p) => ({ ...p, maybeGone: maybeGone(p, groups) }));
  download('chekcareto-' + stamp() + '.json', JSON.stringify({ exportedAt: new Date().toISOString(), groups, posts: out }, null, 1), 'application/json');
});

$('diag').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let d;
  try {
    d = await chrome.tabs.sendMessage(tab.id, { type: 'diagnose' });
  } catch (e) {
    d = { error: 'Η επέκταση δεν τρέχει σε αυτή την καρτέλα: ' + String(e), url: tab && tab.url ? new URL(tab.url).pathname : null };
  }
  await navigator.clipboard.writeText(JSON.stringify(d, null, 1));
  $('diag').textContent = 'Αντιγράφηκε. Κάνε επικόλληση στη συνομιλία';
  setTimeout(() => ($('diag').textContent = 'Αντιγραφή διάγνωσης σελίδας'), 4000);
});

$('clear').addEventListener('click', async () => {
  const { posts } = await loadAll();
  if (!posts.length) return;
  if (!confirm('Διαγραφή ' + posts.length + ' αγγελιών από αυτόν τον υπολογιστή; Κατέβασε πρώτα CSV αν τις θέλεις.')) return;
  await chrome.runtime.sendMessage({ type: 'clear' });
  render();
});

$('auto').addEventListener('click', async () => {
  const b = $('auto');
  const on = !b.dataset.running;
  try {
    await chrome.tabs.sendMessage(Number(b.dataset.tab), { type: 'autoscroll', on });
  } catch (e) {}
  if (on) window.close(); // get out of the way so the page is visible
  else render();
});

async function saveSettings() {
  await chrome.storage.local.set({ settings: { enabled: $('enabled').checked, showChips: $('chips').checked } });
}
$('enabled').addEventListener('change', saveSettings);
$('chips').addEventListener('change', saveSettings);

chrome.storage.onChanged.addListener(() => render());
render();
