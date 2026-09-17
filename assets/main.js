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
      cap.textContent = fc ? fc.textContent : '';
      box.showModal();
    });
  });
  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.closest('button')) box.close();
  });
  box.addEventListener('close', () => img.removeAttribute('src'));
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
  const label = () => { btn.textContent = current() === 'dark' ? 'Light mode' : 'Dark mode'; };
  label();
  btn.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
    label();
  });
})();
