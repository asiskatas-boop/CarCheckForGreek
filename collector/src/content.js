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

  function chip(item, rec, note) {
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
    let txt = bits.join(', ') || 'Αποθηκεύτηκε';
    if (note) txt = (bits.length ? bits.join(', ') + '. ' : '') + note;
    if (!note && rec.missing.length) txt += '. Λείπει: ' + rec.missing.map((k) => LABEL[k]).join(', ');
    if (rec.truncated) txt += '. Πάτα «Δείτε περισσότερα» για όλο το κείμενο';
    if (rec.sold && !note) txt = 'Πουλήθηκε. ' + txt;
    const state = note ? 'skip' : rec.sold ? 'sold' : rec.missing.length ? 'review' : 'ok';
    // Shown through CSS so it never becomes part of the post text we read.
    if (c.dataset.label !== txt) c.dataset.label = txt;
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
  let lastCarKeys = []; // car ads on screen in the last scan

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
    const carKeys = [];
    for (const item of items) {
      const rec = toRecord(item);
      if (rec.isCarAd) {
        carAds++;
        carKeys.push(rec.key);
      }
      // Looks like a car for sale but has no price: say so, don't save it.
      if (!rec.isCarAd && rec.kind === 'sale' && rec.parsed.price == null && (rec.parsed.make || rec.parsed.km || rec.parsed.year)) {
        chip(item, rec, 'Δεν αποθηκεύτηκε: η ανάρτηση δεν γράφει τιμή');
      }
      if (!rec.isCarAd && !rec.sold) continue;
      const fp = fnv(JSON.stringify([rec.text, rec.comments, rec.sold]));
      if (sent.get(rec.key) !== fp) {
        sent.set(rec.key, fp);
        batch.push(rec);
      }
      if (rec.isCarAd) chip(item, rec);
    }
    lastCarKeys = carKeys;
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


  // ---------------- Auto-scroll ----------------
  // Scrolls the feed slowly while you watch, and stops by itself when:
  // Facebook shows a dialog or login/check page, you touch the page, the feed
  // ends, it reaches ads you already collected on an earlier day, or after
  // 20 minutes / 300 ads. Runs only while this tab is visible.
  const AUTO = { running: false, startedAt: 0, steps: 0, newAds: 0, oldStreak: 0, stillSteps: 0, timer: null, seen: new Set() };
  const LIMIT_MS = 20 * 60 * 1000;
  const LIMIT_ADS = 300;
  const rand = (a, b) => a + Math.random() * (b - a);
  const today0 = () => new Date(new Date().toDateString()).getTime();

  function overlay() {
    let o = document.getElementById('cc-auto');
    if (!o) {
      o = document.createElement('div');
      o.id = 'cc-auto';
      o.setAttribute('role', 'status');
      o.innerHTML = '<span class="cc-dot"></span><span class="cc-msg"></span><button type="button" class="cc-btn cc-primary"></button><button type="button" class="cc-btn cc-close" aria-label="Κλείσιμο">✕</button>';
      document.body.appendChild(o);
      o.querySelector('.cc-primary').addEventListener('click', () => (AUTO.running ? stopAuto('Σε παύση.', 'paused') : startAuto()));
      o.querySelector('.cc-close').addEventListener('click', () => {
        stopAuto('', 'off');
        o.remove();
      });
    }
    return o;
  }

  function showOverlay(state, msg) {
    const o = overlay();
    o.dataset.state = state;
    o.querySelector('.cc-msg').textContent = msg;
    o.querySelector('.cc-primary').textContent = AUTO.running ? 'Παύση' : 'Συνέχεια';
  }

  function chime() {
    try {
      const ctx = new AudioContext();
      [880, 660].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = f;
        g.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + i * 0.18 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.16);
        osc.connect(g).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.2);
      });
    } catch (e) {}
  }

  function stopAuto(reason, state, needsYou) {
    const was = AUTO.running;
    AUTO.running = false;
    clearTimeout(AUTO.timer);
    removeEventListener('wheel', onUserInput, true);
    removeEventListener('keydown', onUserInput, true);
    removeEventListener('touchstart', onUserInput, true);
    if (state !== 'off') showOverlay(state || 'paused', reason);
    if (was && needsYou) {
      chime();
      chrome.runtime.sendMessage({ type: 'notify', title: 'ChekCAReto: η κύλιση σταμάτησε', message: reason }).catch(() => {});
    }
  }

  function onUserInput(e) {
    if (e.isTrusted && AUTO.running) stopAuto('Σε παύση επειδή κύλησες ή πάτησες κάτι εσύ.', 'paused');
  }

  // Something on screen that needs a person.
  function blocker() {
    if (/\/(login|checkpoint|two_step|recover)/.test(location.pathname)) return 'Το Facebook ζητά σύνδεση ή επιβεβαίωση. Κάν’ το και πάτα Συνέχεια.';
    for (const d of document.querySelectorAll('[role="dialog"], [role="alertdialog"]')) {
      const r = d.getBoundingClientRect();
      if (r.width < 200 || r.height < 80) continue;
      const t = (d.innerText || '').toLowerCase();
      if (/προσωριν|temporarily|αποκλει|blocked|περιορισ|restrict|επιβεβαι|confirm|ασφαλ|security|captcha|robot|ρομπότ|ύποπτ|suspicious/.test(t)) return 'Το Facebook δείχνει προειδοποίηση. Σταμάτα για σήμερα και διάβασέ την.';
      return 'Άνοιξε ένα παράθυρο στο Facebook. Κλείσ’ το και πάτα Συνέχεια.';
    }
    return null;
  }

  async function countOld(keys) {
    const fresh = keys.filter((k) => !AUTO.seen.has(k));
    fresh.forEach((k) => AUTO.seen.add(k));
    if (!fresh.length) return { fresh: 0, old: 0 };
    const r = await chrome.storage.local.get(fresh.map((k) => 'p:' + k));
    let old = 0;
    for (const k of fresh) {
      const p = r['p:' + k];
      if (p && new Date(p.firstSeen).getTime() < today0()) old++;
    }
    return { fresh: fresh.length, old };
  }

  async function step() {
    if (!AUTO.running || superseded()) return;
    if (document.hidden) return stopAuto('Σε παύση: η καρτέλα δεν είναι ανοιχτή μπροστά σου.', 'paused');
    const b = blocker();
    if (b) return stopAuto(b, 'help', true);
    if (Date.now() - AUTO.startedAt > LIMIT_MS) return stopAuto('Τέλος για τώρα: 20 λεπτά συνεχόμενα. Ξαναπάτα αργότερα.', 'done', true);
    if (AUTO.newAds >= LIMIT_ADS) return stopAuto('Τέλος για τώρα: ' + AUTO.newAds + ' αγγελίες σε αυτή τη συνεδρία.', 'done', true);

    scanNow();
    const { fresh, old } = await countOld(lastCarKeys);
    AUTO.newAds += fresh - old;
    AUTO.oldStreak = fresh ? (old === fresh ? AUTO.oldStreak + old : 0) : AUTO.oldStreak;
    if (AUTO.oldStreak >= 12) return stopAuto('Έφτασες σε αγγελίες που είχες ήδη μαζέψει τις προηγούμενες μέρες. Τέλος για σήμερα.', 'done', true);

    const before = document.documentElement.scrollHeight;
    const atBottom = scrollY + innerHeight >= before - 40;
    AUTO.stillSteps = atBottom ? AUTO.stillSteps + 1 : 0;
    if (AUTO.stillSteps >= 5) return stopAuto('Η ροή τελείωσε ή δεν φορτώνει άλλες αναρτήσεις.', 'done', true);

    window.scrollBy({ top: Math.round(innerHeight * rand(0.55, 0.85)), behavior: 'smooth' });
    AUTO.steps++;
    showOverlay('running', 'Αυτόματη κύλιση: ' + AUTO.newAds + ' νέες αγγελίες');
    // Calm pace, with a longer break now and then.
    const wait = AUTO.steps % 12 === 0 ? rand(8000, 14000) : rand(2500, 5500);
    AUTO.timer = setTimeout(step, wait);
  }

  function startAuto() {
    if (superseded()) return;
    if (X.pageType(location) !== 'group' && X.pageType(location) !== 'marketplace') {
      showOverlay('help', 'Άνοιξε ένα γκρουπ αυτοκινήτων ή το Marketplace για αυτόματη κύλιση.');
      return;
    }
    if (!AUTO.running) {
      if (!AUTO.startedAt || Date.now() - AUTO.startedAt > LIMIT_MS) {
        Object.assign(AUTO, { startedAt: Date.now(), steps: 0, newAds: 0, oldStreak: 0, stillSteps: 0 });
      }
      AUTO.running = true;
      addEventListener('wheel', onUserInput, true);
      addEventListener('keydown', onUserInput, true);
      addEventListener('touchstart', onUserInput, true);
    }
    showOverlay('running', 'Αυτόματη κύλιση: ξεκινάει…');
    clearTimeout(AUTO.timer);
    AUTO.timer = setTimeout(step, 800);
  }

  // Popup asks what this page looks like.
  chrome.runtime.onMessage.addListener((msg, _s, reply) => {
    if (!msg) return false;
    if (superseded()) return false;
    if (msg.type === 'status') {
      reply({ ...lastStatus, enabled, url: location.pathname, auto: { running: AUTO.running, newAds: AUTO.newAds } });
      return false;
    }
    if (msg.type === 'autoscroll') {
      if (msg.on) startAuto();
      else stopAuto('Σε παύση.', 'paused');
      reply({ running: AUTO.running });
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
