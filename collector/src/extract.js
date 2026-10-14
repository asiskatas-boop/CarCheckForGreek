/*
 * Reads car posts from the Facebook page the user is looking at.
 * Only what is already on screen: it never clicks, opens or scrolls anything.
 * Facebook's class names change constantly, so this relies on roles,
 * aria labels and link shapes instead.
 */
(function (root) {
  'use strict';

  // Facebook UI text that is not part of the ad.
  const UI_LINE = /^(μου αρέσει|like|σχόλιο|σχολιάστε|comment|κοινοποίηση|share|απάντηση|reply|αποστολή|send|δείτε περισσότερα|see more|δείτε λιγότερα|see less|δείτε τη μετάφραση|see translation|όλες οι αντιδράσεις.*|all reactions.*|\d+\s*(σχόλια|σχόλιο|comments?|κοινοποιήσεις|shares?)|γράψτε (ένα )?σχόλιο.*|write a (public )?comment.*|πιο σχετικά|most relevant|συντάκτης|author|επεξεργάστηκε|edited|·|follow|ακολουθήστε|join|συμμετοχή|\d+\s*(λ|ω|ημ|εβδ|μ|m|h|d|w|y|λεπτά?|λεπτό|ώρες|ώρα|ημέρες|ημέρα|εβδομάδες|εβδομάδα|μήνες|μήνα|mins?|hrs?|hours?|days?|weeks?)\.?|χθες|yesterday|\d{1,2}\s+(ιανουαρίου|φεβρουαρίου|μαρτίου|απριλίου|μαΐου|ιουνίου|ιουλίου|αυγούστου|σεπτεμβρίου|οκτωβρίου|νοεμβρίου|δεκεμβρίου|january|february|march|april|may|june|july|august|september|october|november|december)(\s+\d{4})?(\s+(στις|at)\s+\d{1,2}:\d{2})?|just now|μόλις τώρα|message|μήνυμα|αποστολή μηνύματος|send message)$/i;

  function pageType(loc) {
    const p = loc.pathname;
    if (/\/marketplace\/item\/\d+/.test(p) || /\/commerce\/listing\/\d+/.test(p)) return 'marketplace-item';
    if (/^\/marketplace/.test(p)) return 'marketplace';
    if (/^\/groups\/[^/]+/.test(p)) return 'group';
    return null;
  }

  function groupIdFrom(path) {
    const m = /\/groups\/([^/?#]+)/.exec(path || '');
    return m ? m[1] : null;
  }

  function inView(el, margin) {
    const r = el.getBoundingClientRect();
    const h = root.innerHeight || document.documentElement.clientHeight;
    return r.bottom > -(margin || 0) && r.top < h + (margin || 0) && r.height > 0;
  }

  function cleanLines(text) {
    return String(text || '')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !UI_LINE.test(l) && !l.startsWith('ChekCAReto:'))
      .join('\n');
  }

  function postIdFrom(el) {
    for (const a of el.querySelectorAll('a[href]')) {
      const h = a.getAttribute('href');
      let m =
        /\/groups\/[^/]+\/(?:posts|permalink)\/(\d+)/.exec(h) ||
        /[?&](?:story_fbid|multi_permalinks|post_id)=(\d+)/.exec(h) ||
        /\/commerce\/listing\/(\d+)/.exec(h) ||
        /\/marketplace\/item\/(\d+)/.exec(h) ||
        /\/posts\/(\d+)/.exec(h);
      if (m) return m[1];
    }
    return null;
  }

  function isCommentNode(el) {
    const label = (el.getAttribute('aria-label') || '').toLowerCase();
    return /^(comment|reply|σχόλιο|απάντηση)/.test(label);
  }

  // Post containers in a group feed (top-level only, comments excluded).
  function groupPosts(doc) {
    const cand = new Set([
      ...doc.querySelectorAll('[role="feed"] > div'),
      ...doc.querySelectorAll('[aria-posinset]'),
      ...doc.querySelectorAll('[role="article"]'),
    ]);
    const posts = [];
    for (const el of cand) {
      if (isCommentNode(el)) continue;
      const up = el.parentElement && el.parentElement.closest('[aria-posinset], [role="article"]');
      if (up && cand.has(up) && !isCommentNode(up)) continue;
      if (posts.some((p) => p.contains(el))) continue;
      for (let i = posts.length - 1; i >= 0; i--) if (el.contains(posts[i])) posts.splice(i, 1);
      posts.push(el);
    }
    // A single opened post (permalink page) has no feed: use the main area.
    if (!posts.length) {
      const main = doc.querySelector('[role="main"]');
      if (main && /\/(posts|permalink)\//.test(location.pathname)) posts.push(main);
    }
    return posts;
  }

  function commentAuthor(el) {
    const label = el.getAttribute('aria-label') || '';
    const m = /^(?:comment by|reply by|σχόλιο από|απάντηση από)\s+(.+?)(?:\s+(?:πριν|\d|a |an |about|σε απάντηση|in reply).*)?$/i.exec(label);
    return m ? m[1].trim() : '';
  }

  function commentText(el, author) {
    const parts = [...el.querySelectorAll('[dir="auto"]')]
      .filter((n) => !n.closest('[role="article"]') || n.closest('[role="article"]') === el)
      .map((n) => n.innerText.trim())
      .filter(Boolean);
    let t = parts.length ? [...new Set(parts)].join('\n') : el.innerText;
    if (author) t = t.split(author).join('');
    return cleanLines(t);
  }

  function readGroupPost(el, doc) {
    const comments = [...el.querySelectorAll('[role="article"]')].filter((c) => c !== el);
    let text = el.innerText || '';
    for (const c of comments) {
      const ct = c.innerText || '';
      if (ct) text = text.split(ct).join('\n');
    }
    text = cleanLines(text);
    const authorEl = el.querySelector('h2, h3, h4, strong');
    const author = authorEl ? authorEl.innerText.split('\n')[0].trim() : '';
    // Drop the author's name from the text we keep.
    if (author) text = text.split(author).join('').trim();
    const truncated = /(^|\n)(δείτε περισσότερα|see more)\s*$/im.test(el.innerText || '') || /…\s*(δείτε περισσότερα|see more)/i.test(el.innerText || '');

    const cm = comments.map((c) => {
      const who = commentAuthor(c);
      const raw = c.innerText || '';
      const bySeller = (!!author && !!who && who === author) || /(^|\n)(συντάκτης|author|δημιουργός)(\n|$)/i.test(raw);
      return { text: commentText(c, who), bySeller };
    });

    return {
      source: 'fb-group',
      postId: postIdFrom(el),
      groupId: groupIdFrom(location.pathname),
      groupName: (doc.querySelector('h1') || {}).innerText || null,
      text,
      truncated,
      comments: cm.filter((c) => c.text),
      el,
    };
  }

  function marketplaceCards(doc) {
    const seen = new Set();
    const out = [];
    for (const a of doc.querySelectorAll('a[href*="/marketplace/item/"]')) {
      const m = /\/marketplace\/item\/(\d+)/.exec(a.getAttribute('href'));
      if (!m || seen.has(m[1])) continue;
      seen.add(m[1]);
      out.push({ source: 'fb-marketplace', postId: m[1], groupId: null, groupName: null, text: cleanLines(a.innerText), truncated: false, comments: [], el: a });
    }
    return out;
  }

  function marketplaceItem(doc) {
    const m = /\/(?:marketplace\/item|commerce\/listing)\/(\d+)/.exec(location.pathname);
    const main = doc.querySelector('[role="main"]') || doc.body;
    let text = main.innerText || '';
    const cut = text.search(/\n(today's picks|σημερινές επιλογές|related listings|παρόμοι|sponsored|χορηγούμεν|more from|περισσότερα από)/i);
    if (cut > 0) text = text.slice(0, cut);
    return [{ source: 'fb-marketplace', postId: m ? m[1] : null, groupId: null, groupName: null, text: cleanLines(text).slice(0, 4000), truncated: false, comments: [], el: main }];
  }

  /** Everything readable on screen right now. */
  function scan(doc) {
    doc = doc || document;
    const type = pageType(location);
    if (!type) return [];
    if (type === 'marketplace-item') return marketplaceItem(doc);
    if (type === 'marketplace') return marketplaceCards(doc).filter((c) => inView(c.el, 200));
    return groupPosts(doc)
      .filter((el) => inView(el, 100))
      .map((el) => readGroupPost(el, doc))
      .filter((p) => p.text.length > 10);
  }

  root.CCExtract = { scan, pageType, cleanLines };
})(typeof globalThis !== 'undefined' ? globalThis : this);
