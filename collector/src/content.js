/*
 * Glue: watches the page while you scroll, reads car posts that are on screen,
 * turns them into rows and hands them to the background worker for saving.
 */
(function () {
  'use strict';
  // After an update, Chrome leaves the old copy of this script running in
  // open tabs. The newest copy takes over and older ones stop themselves.
  const me = chrome.runtime.getManifest().version + ':' + Math.random();
  globalThis.__ccCollectorActive = me;
  const superseded = () => globalThis.__ccCollectorActive !== me || !(chrome.runtime && chrome.runtime.id);
  const P = globalThis.CCParser;
  const X = globalThis.CCExtract;

  let enabled = true;
  let showChips = true;
  const sent = new Map(); // key -> fingerprint of what we last sent

  chrome.storage.local.get({ settings: { enabled: true, showChips: true } }, (r) => {
    enabled = r.settings.enabled !== false;
    showChips = r.settings.showChips !== false;
    schedule();
  });
  chrome.storage.onChanged.addListener((ch) => {
    if (ch.settings) {
      enabled = ch.settings.newValue.enabled !== false;
      showChips = ch.settings.newValue.showChips !== false;
      if (!showChips) document.querySelectorAll('.cc-chip').forEach((n) => n.remove());
      if (enabled) schedule();
    }
  });

  function fnv(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
  }

  function keyFor(item) {
    if (item.postId) return item.source + ':' + item.postId;
    // No id visible: fall back to the group plus the start of the text.
    return item.source + ':' + (item.groupId || '') + ':h' + fnv(P.norm(item.text).replace(/\s+/g, ' ').slice(0, 200));
  }

  function summarizeComments(comments) {
    const s = { sellerSold: false, sellerPrices: [], offers: [], count: comments.length };
    for (const c of comments) {
      const r = P.parseComment(c.text, c.bySeller);
      if (r.sold) s.sellerSold = true;
      if (r.newPrice) s.sellerPrices.push(r.newPrice);
      if (r.offer) s.offers.push(r.offer);
    }
    return s;
  }

  function fmt(n) {
    return n == null ? null : n.toLocaleString('el-GR');
  }

  const LABEL = { make: 'μάρκα', year: 'έτος', km: 'χλμ', price: 'τιμή' };

  function chip(item, rec) {
    if (!showChips || !item.el || !item.el.isConnected || item.el.tagName === 'A') return;
    let c = item.el.querySelector(':scope > .cc-chip, .cc-chip');
    if (!c) {
      c = document.createElement('div');
      c.className = 'cc-chip';
      item.el.prepend(c);
    }
    const f = rec.parsed;
    const bits = [
      [f.make, f.model].filter(Boolean).join(' '),
      f.year,
      f.km != null ? fmt(f.km) + ' χλμ' : null,
      f.price != null ? fmt(f.price) + ' €' : null,
    ].filter(Boolean);
    let txt = 'ChekCAReto: ' + (bits.join(', ') || 'αποθηκεύτηκε');
    if (rec.missing.length) txt += '. Λείπει: ' + rec.missing.map((k) => LABEL[k]).join(', ');
    if (rec.truncated) txt += '. Πάτα «Δείτε περισσότερα» για όλο το κείμενο';
    const state = rec.missing.length ? 'review' : 'ok';
    if (c.textContent !== txt) c.textContent = txt;
    if (c.dataset.state !== state) c.dataset.state = state;
  }

  function toRecord(item) {
    const text = P.scrub(item.text).slice(0, 2500);
    const r = P.parseAd(text);
    const comments = summarizeComments(item.comments.map((c) => ({ text: P.scrub(c.text), bySeller: c.bySeller })));
    return {
      key: keyFor(item),
      source: item.source,
      groupId: item.groupId,
      groupName: item.groupName ? item.groupName.split('\n')[0].slice(0, 120) : null,
      postId: item.postId,
      url: item.postId
        ? item.source === 'fb-marketplace'
          ? 'https://www.facebook.com/marketplace/item/' + item.postId + '/'
          : 'https://www.facebook.com/groups/' + item.groupId + '/posts/' + item.postId + '/'
        : null,
      text,
      truncated: item.truncated,
      parsed: r.fields,
      kind: r.kind,
      sold: r.sold || comments.sellerSold,
      isCarAd: r.isCarAd,
      missing: r.missing,
      comments,
    };
  }

  // What the last scan saw, for the popup's "this page" line and diagnostics.
  let lastStatus = { page: null, found: 0, carAds: 0, at: null, error: null };
  let lastItems = [];

  function scanNow() {
    if (superseded()) return;
    if (!enabled || document.hidden) return;
    let items;
    try {
      items = X.scan(document);
    } catch (e) {
      console.warn('[ChekCAReto] scan failed', e);
      lastStatus = { ...lastStatus, error: String(e), at: Date.now() };
      return;
    }
    lastItems = items;
    let carAds = 0;
    const batch = [];
    for (const item of items) {
      const rec = toRecord(item);
      if (rec.isCarAd) carAds++;
      if (!rec.isCarAd && !rec.sold) continue;
      const fp = fnv(JSON.stringify([rec.text, rec.comments, rec.sold]));
      if (sent.get(rec.key) !== fp) {
        sent.set(rec.key, fp);
        batch.push(rec);
      }
      if (rec.isCarAd) chip(item, rec);
    }
    lastStatus = { page: X.pageType(location), found: items.length, carAds, at: Date.now(), error: null };
    if (batch.length) {
      chrome.runtime.sendMessage({ type: 'capture', items: batch, scannedGroup: X.pageType(location) === 'group' ? batch[0].groupId : null }).catch(() => {});
    }
  }

  // Throttle, not debounce: Facebook changes the page constantly, so a
  // debounce would keep postponing the scan forever.
  let last = 0;
  let pending = null;
  function schedule() {
    if (pending) return;
    const wait = Math.max(250, 1200 - (Date.now() - last));
    pending = setTimeout(() => {
      pending = null;
      last = Date.now();
      scanNow();
    }, wait);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('click', schedule, true); // e.g. after "See more" or opening comments
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('visibilitychange', schedule);
  setInterval(() => {
    if (!document.hidden) schedule();
  }, 3000);
  schedule();

  // Popup asks what this page looks like.
  chrome.runtime.onMessage.addListener((msg, _s, reply) => {
    if (!msg) return false;
    if (msg.type === 'status') {
      reply({ ...lastStatus, enabled, url: location.pathname });
      return false;
    }
    if (msg.type === 'diagnose') {
      const q = (sel) => document.querySelectorAll(sel).length;
      reply({
        version: chrome.runtime.getManifest().version,
        url: location.pathname,
        page: X.pageType(location),
        counts: { feed: q('[role="feed"]'), feedChildren: q('[role="feed"] > div'), posinset: q('[aria-posinset]'), articles: q('[role="article"]'), messages: q('[data-ad-comet-preview="message"], [data-ad-preview="message"]'), marketplaceLinks: q('a[href*="/marketplace/item/"]') },
        status: lastStatus,
        samples: lastItems.slice(0, 8).map((it) => {
          const text = P.scrub(it.text);
          const r = P.parseAd(text);
          return { source: it.source, postId: it.postId, text: text.slice(0, 400), fields: r.fields, kind: r.kind, isCarAd: r.isCarAd, comments: it.comments.length };
        }),
      });
      return false;
    }
    return false;
  });
})();
