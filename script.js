// MIRAI COMPASS 仕事・お金LP（恋愛LPのscript.jsとは別ファイル）
document.addEventListener('DOMContentLoaded', () => {
  const data = window.WORK_LP || {};
  const links = data.links || {};

  const esc = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  // **太字** だけ許可
  const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // ---- 差し込み位置の目印（?preview=1 のときだけ表示）
  if (/[?&]preview=1\b/.test(location.search)) document.body.classList.add('is-preview');

  // ---- リンク
  document.querySelectorAll('.js-line').forEach((a) => {
    if (links.line) a.href = links.line; else a.hidden = true;
  });
  document.querySelectorAll('.js-apply').forEach((a) => {
    if (links.apply) { a.href = links.apply; a.hidden = false; }
  });

  // ---- お客様の声
  const voices = (data.voices || []).filter((v) => v && v.title && v.body && v.body.length);
  const voiceSection = document.getElementById('voice');
  const voiceList = document.getElementById('voice-list');
  if (voices.length && voiceSection && voiceList) {
    voiceList.innerHTML = voices.map((v, i) => `
      <article class="work-voice-card">
        <p class="work-voice-num" aria-hidden="true">VOICE ${String(i + 1).padStart(2, '0')}</p>
        <h3 class="work-voice-title">「${esc(v.title)}」</h3>
        <div class="work-voice-body">${v.body.map((p) => `<p>${rich(p)}</p>`).join('')}</div>
        ${v.name ? `<p class="work-voice-name">${esc(v.name)}</p>` : ''}
      </article>`).join('');
    voiceSection.hidden = false;
  } else {
    document.querySelectorAll('.js-nav-voice').forEach((a) => { a.hidden = true; });
  }

  // ---- プロフィール
  const profile = data.profile || {};
  const paras = (profile.paragraphs || []).filter(Boolean);
  const photos = (profile.photos || []).filter((p) => p && p.src);
  const profileSection = document.getElementById('profile');
  if (profileSection && (paras.length || photos.length)) {
    const story = document.getElementById('profile-story');
    if (paras.length) story.innerHTML = paras.map((p) => `<p>${rich(p)}</p>`).join('');
    else story.hidden = true;
    const box = document.getElementById('profile-photos');
    if (photos.length) {
      box.innerHTML = photos.map((p) => `
        <figure class="profile-photo">
          <img src="${esc(p.src)}" alt="${esc(p.alt || '')}" loading="lazy">
          ${p.caption ? `<figcaption>${esc(p.caption)}</figcaption>` : ''}
        </figure>`).join('');
    } else box.hidden = true;
    profileSection.hidden = false;
  } else {
    document.querySelectorAll('.js-nav-profile').forEach((a) => { a.hidden = true; });
  }

  // ---- フッター年号
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- スクロールでふわっと表示
  const targets = document.querySelectorAll('.section, .hero');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach((el) => { el.classList.add('fade-init'); io.observe(el); });
  }

  // ---- スマホ固定ボタン：ヒーローとフッターCTAが見えている間は隠す
  const sticky = document.getElementById('sticky-cta');
  const hero = document.getElementById('top');
  const finalCta = document.querySelector('.section-cta');
  if (sticky && hero && links.line && 'IntersectionObserver' in window) {
    const seen = new Map();
    const update = () => {
      const show = ![...seen.values()].some(Boolean);
      sticky.classList.toggle('is-shown', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
      sticky.querySelectorAll('a').forEach((a) => { a.tabIndex = show ? 0 : -1; });
    };
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting));
      update();
    });
    [hero, finalCta].filter(Boolean).forEach((el) => { seen.set(el, true); so.observe(el); });
  }
});
