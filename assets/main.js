// Lightbox: any .shot button opens its image full size, with the figure caption beneath.
(() => {
  const box = document.querySelector('dialog.lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  const img = box.querySelector('img');
  const cap = box.querySelector('p');
  document.querySelectorAll('.shot').forEach((btn) => {
    btn.addEventListener('click', () => {
      const thumb = btn.querySelector('img');
      img.src = thumb.currentSrc || thumb.src;
      img.alt = thumb.alt;
      const fc = btn.closest('figure') && btn.closest('figure').querySelector('figcaption');
      cap.textContent = fc ? fc.innerText.trim() : '';   // innerText skips the hidden language
      box.showModal();
    });
  });
  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.closest('button')) box.close();
  });
  box.addEventListener('close', () => img.removeAttribute('src'));
})();

// Language switch (EN / 한국어). Every string sits in the page twice, as
// <span lang="en"> and <span lang="ko">; the stylesheet hides the one not in use.
// Pick order: ?lang= in the URL, then the visitor's saved choice, then the browser language.
(() => {
  const root = document.documentElement;
  const buttons = document.querySelectorAll('[data-set-lang]');
  let saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* storage blocked */ }
  let fromUrl = null;
  try { fromUrl = new URLSearchParams(location.search).get('lang'); } catch (e) { /* no URL API */ }
  const browserKo = (navigator.language || '').toLowerCase().indexOf('ko') === 0;

  const apply = (lang) => {
    if (lang === 'ko') root.dataset.lang = 'ko'; else delete root.dataset.lang;
    root.lang = lang;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
    document.dispatchEvent(new Event('langchange'));
  };
  apply((fromUrl || saved || (browserKo ? 'ko' : 'en')) === 'ko' ? 'ko' : 'en');

  buttons.forEach((b) => b.addEventListener('click', () => {
    const lang = b.dataset.setLang;
    apply(lang);
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage blocked */ }
    try {   // keep the address shareable: ?lang=ko opens straight in Korean
      const url = new URL(location.href);
      if (lang === 'ko') url.searchParams.set('lang', 'ko'); else url.searchParams.delete('lang');
      history.replaceState(null, '', url);
    } catch (e) { /* sandboxed frame */ }
  }));
})();

// Light/dark toggle, remembered per visitor when storage is available.
(() => {
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  if (!btn) return;
  const current = () => root.dataset.theme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const label = () => {
    const ko = root.dataset.lang === 'ko';
    btn.textContent = current() === 'dark' ? (ko ? '라이트 모드' : 'Light mode') : (ko ? '다크 모드' : 'Dark mode');
  };
  label();
  document.addEventListener('langchange', label);
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    label();
  });
})();
