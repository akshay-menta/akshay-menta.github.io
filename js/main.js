/* ================================================================
   MAIN.JS — Portfolio: Sai Akshay Menta
   Ground-up rebuild — Recruiter-first layout
   ================================================================ */

/* ================================================================
   PARTICLE BACKGROUND (full-page, subtle)
   ================================================================ */
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, raf;

  const COLS  = ['#3b82f6', '#8b5cf6', '#22d3ee'];
  const COUNT = 50;
  const LINK  = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rnd(a, b) { return Math.random() * (b - a) + a; }

  function init() {
    particles = Array.from({ length: COUNT }, () => ({
      x:  rnd(0, W), y:  rnd(0, H),
      vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25),
      r:  rnd(1, 2.2),
      a:  rnd(0.2, 0.6),
      c:  COLS[Math.floor(Math.random() * COLS.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < LINK) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - d/LINK) * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    raf = requestAnimationFrame(draw);
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); init(); });
})();

/* ================================================================
   SIDEBAR SCROLL-SPY
   ================================================================ */
(function () {
  const sections = Array.from(document.querySelectorAll('.section[id]'));
  const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');

  function update() {
    const scrollY = window.scrollY + 160;
    let active = '';
    sections.forEach(s => { if (s.offsetTop <= scrollY) active = s.id; });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${active}`);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ================================================================
   SMOOTH SCROLL
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    const offset = window.innerWidth <= 860 ? 72 : 0;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    // Close mobile drawer
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.remove('open');
  });
});

/* ================================================================
   MOBILE MENU
   ================================================================ */
const mobBtn    = document.getElementById('mob-menu-btn');
const mobDrawer = document.getElementById('mobile-drawer');

if (mobBtn && mobDrawer) {
  mobBtn.addEventListener('click', () => {
    mobDrawer.classList.toggle('open');
    const open = mobDrawer.classList.contains('open');
    mobBtn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

/* ================================================================
   SCROLL REVEAL
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
});

/* ================================================================
   LAZY IMAGE LOADING
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const imgs = [].slice.call(document.querySelectorAll('img[data-src]'));
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.src = e.target.dataset.src;
          e.target.removeAttribute('data-src');
          obs.unobserve(e.target);
        }
      });
    });
    imgs.forEach(img => obs.observe(img));
  } else {
    imgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  }
});

/* ================================================================
   PROJECT ACCORDION (expand details inline)
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.closest('.project-card').querySelector('.project-details');
      const isOpen  = details.classList.contains('open');
      details.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
      btn.querySelector('.expand-text').textContent = isOpen ? 'Show details' : 'Hide details';
    });
  });
});

/* ================================================================
   EMAIL REVEAL
   ================================================================ */
const rot13 = msg =>
  msg.replace(/[a-z]/gi, l => {
    const a = 'abcdefghijklmnopqrstuvwxyzabcdefghijklm' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLM';
    return a[a.indexOf(l) + 13];
  });

let emailVisible = false;
const emailTrigger = document.getElementById('email-reveal-btn');
const emailBox     = document.getElementById('demail');

if (emailTrigger && emailBox) {
  emailTrigger.addEventListener('click', () => {
    const msg = "nxfunlzragn24" + "@" + "tznvy.pbz" + "  |  " + "zragn.fn@abegurnfgrea.rqh";
    emailBox.textContent = rot13(msg);
    emailBox.style.opacity = emailVisible ? '0' : '1';
    emailVisible = !emailVisible;
  });
}