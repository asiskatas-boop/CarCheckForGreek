/*
 * Saves captured ads in the browser (chrome.storage.local), merges repeat
 * sightings of the same ad, keeps price history and sold signals,
 * and shows today's new count on the toolbar icon.
 */
'use strict';

const today = () => new Date().toISOString().slice(0, 10);

// Run storage updates one at a time so tabs don't overwrite each other.
let queue = Promise.resolve();
function serial(fn) {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

// Each ad is stored under its own key ("p:" + ad key) so a save only
// touches the ads in that batch, even with thousands saved.
async function load(keys) {
  const r = await chrome.storage.local.get(['stats', 'groups', ...keys.map((k) => 'p:' + k)]);
  let stats = r.stats || { day: today(), newToday: 0 };
  if (stats.day !== today()) stats = { day: today(), newToday: 0 };
  return { r, stats, groups: r.groups || {} };
}

function mergeParsed(oldP, newP) {
  const out = { ...oldP };
  for (const [k, v] of Object.entries(newP || {})) if (v != null) out[k] = v;
  return out;
}

function pushPrice(rec, price, from, now) {
  if (price == null) return;
  const last = rec.prices[rec.prices.length - 1];
  if (!last || last.price !== price) rec.prices.push({ price, from, at: now });
}

function merge(existing, item, now) {
  const d = today();
  if (!existing) {
    const rec = {
      key: item.key,
      source: item.source,
      groupId: item.groupId,
      groupName: item.groupName,
      postId: item.postId,
      url: item.url,
      firstSeen: now,
      lastSeen: now,
      days: [d],
      text: item.text,
      parsed: item.parsed,
      kind: item.kind,
      missing: item.missing,
      prices: [],
      sold: !!item.sold,
      soldAt: item.sold ? now : null,
      offers: [...new Set(item.comments.offers)],
      commentsSeen: item.comments.count,
    };
    pushPrice(rec, item.parsed.price, 'ad', now);
    for (const p of item.comments.sellerPrices) pushPrice(rec, p, 'seller-comment', now);
    return { rec, isNew: !!item.isCarAd };
  }
  const rec = existing;
  rec.lastSeen = now;
  if (!rec.days.includes(d)) rec.days.push(d);
  if (item.text && item.text.length >= (rec.text || '').length) rec.text = item.text;
  rec.parsed = mergeParsed(rec.parsed, item.parsed);
  rec.missing = ['make', 'year', 'km', 'price'].filter((k) => rec.parsed[k] == null);
  rec.groupName = rec.groupName || item.groupName;
  rec.url = rec.url || item.url;
  pushPrice(rec, item.parsed.price, 'ad', now);
  for (const p of item.comments.sellerPrices) pushPrice(rec, p, 'seller-comment', now);
  if (item.sold && !rec.sold) {
    rec.sold = true;
    rec.soldAt = now;
  }
  rec.offers = [...new Set([...(rec.offers || []), ...item.comments.offers])];
  rec.commentsSeen = Math.max(rec.commentsSeen || 0, item.comments.count);
  return { rec, isNew: false };
}

async function capture(items, scannedGroup) {
  const { r, stats, groups } = await load(items.map((i) => i.key));
  const now = new Date().toISOString();
  const out = {};
  let added = 0;
  for (const item of items) {
    const k = 'p:' + item.key;
    const existing = out[k] || r[k];
    // A sold-only post we never saw as an ad: keep it only if we know it already.
    if (!item.isCarAd && !existing) continue;
    const { rec, isNew } = merge(existing, item, now);
    out[k] = rec;
    if (isNew) added++;
  }
  if (scannedGroup) {
    const named = items.find((i) => i.groupName);
    groups[scannedGroup] = { lastScan: now, name: (named && named.groupName) || (groups[scannedGroup] || {}).name || null };
  }
  stats.newToday += added;
  await chrome.storage.local.set({ ...out, stats, groups });
  await badge(stats.newToday);
  return { added };
}

async function badge(n) {
  await chrome.action.setBadgeBackgroundColor({ color: '#000000' });
  await chrome.action.setBadgeText({ text: n ? String(n > 999 ? '999+' : n) : '' });
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg && msg.type === 'capture') {
    serial(() => capture(msg.items || [], msg.scannedGroup)).then(reply, (e) => reply({ error: String(e) }));
    return true;
  }
  if (msg && msg.type === 'clear') {
    serial(async () => {
      const all = await chrome.storage.local.get(null);
      await chrome.storage.local.remove(Object.keys(all).filter((k) => k.startsWith('p:') || k === 'groups'));
      await chrome.storage.local.set({ stats: { day: today(), newToday: 0 } });
      await badge(0);
    }).then(() => reply({ ok: true }));
    return true;
  }
  return false;
});

chrome.runtime.onStartup.addListener(async () => {
  const { stats } = await load([]);
  await badge(stats.newToday);
});

// Tabs that were already open before install/update don't get the content
// script automatically: add it to them so there's no need to reload Facebook.
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({ url: ['https://*.facebook.com/*'] });
  for (const t of tabs) {
    try {
      await chrome.scripting.insertCSS({ target: { tabId: t.id }, files: ['src/content.css'] });
      await chrome.scripting.executeScript({ target: { tabId: t.id }, files: ['src/parser.js', 'src/extract.js', 'src/content.js'] });
    } catch (e) {
      // Tab may be discarded or not allow scripts; it'll pick it up on reload.
    }
  }
});
