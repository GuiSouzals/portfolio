document.getElementById("ano").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Revelação ao rolar ===== */
const observer = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("on");
        observer.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12 }
);

// Hero anima na carga da página (elementos clipados não disparam o observer)
document.querySelectorAll(".hero .reveal").forEach((el) => {
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
});

// Demais elementos animam ao entrar na tela
document.querySelectorAll(".reveal").forEach((el) => {
  if (!el.closest(".hero")) observer.observe(el);
});

// Sublinhado desenhado na palavra em destaque
const emWord = document.querySelector(".hero h1 em");
if (emWord) requestAnimationFrame(() => requestAnimationFrame(() => emWord.classList.add("draw")));

/* ===== Entrada escalonada nos grids ===== */
document.querySelectorAll(".serv-grid, .gallery, .steps, .xp-rows").forEach((group) => {
  Array.from(group.children).forEach((child, i) => {
    child.style.transitionDelay = (i * 0.09).toFixed(2) + "s";
  });
});

/* ===== Cortina nas imagens ===== */
document.querySelectorAll(".case-media, .gallery figure").forEach((el) => {
  el.classList.add("media-reveal");
  observer.observe(el);
});

/* ===== Barra de progresso de leitura ===== */
const progress = document.getElementById("progress");

/* ===== Navegação esconde ao descer, volta ao subir ===== */
const nav = document.querySelector(".nav");
let lastY = window.scrollY;

window.addEventListener(
  "scroll",
  () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";

    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle("nav-shadow", y > 8);
    if (y > 140 && y > lastY + 4) nav.classList.add("nav-hidden");
    else if (y < lastY - 4) nav.classList.remove("nav-hidden");
    lastY = y;
  },
  { passive: true }
);

/* ===== Parallax sutil nas imagens dos cases ===== */
if (!reduceMotion) {
  const medias = document.querySelectorAll(".case-media img");
  let ticking = false;

  function parallax() {
    for (const img of medias) {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const offset = (r.top + r.height / 2 - innerHeight / 2) * -0.04;
      img.style.translate = "0 " + offset.toFixed(1) + "px";
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(parallax);
      }
    },
    { passive: true }
  );
}

/* ===== Cursor personalizado ===== */
const cursor = document.getElementById("cursor");

if (cursor && !reduceMotion && matchMedia("(pointer: fine)").matches) {
  let cx = -100, cy = -100, tx = -100, ty = -100, visible = false;

  document.addEventListener("mousemove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) {
      visible = true;
      cursor.style.opacity = "1";
      cx = tx; cy = ty;
    }
  });
  document.addEventListener("mouseleave", () => {
    visible = false;
    cursor.style.opacity = "0";
  });

  (function follow() {
    cx += (tx - cx) * 0.16;
    cy += (ty - cy) * 0.16;
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("grow"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("grow"));
  });
}

/* ===== Menu mobile ===== */
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  function toggleMenu(force) {
    const open = force !== undefined ? force : !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", open);
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
    mobileMenu.setAttribute("aria-hidden", !open);
  }
  menuBtn.addEventListener("click", () => toggleMenu());
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
  window.addEventListener("scroll", () => { if (mobileMenu.classList.contains("open")) toggleMenu(false); }, { passive: true });
}

/* ===== Holofote nos cards (segue o cursor) ===== */
if (matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".serv, .steps li, .xp-row, .gallery figure").forEach((card) => {
    card.classList.add("spot");
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
}

/* ===== Inclinação 3D nas imagens dos cases ===== */
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".case-media").forEach((media) => {
    media.addEventListener("mousemove", (e) => {
      const r = media.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      media.classList.add("tilting");
      media.style.transform = "perspective(900px) rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 5).toFixed(2) + "deg) scale(1.015)";
    });
    media.addEventListener("mouseleave", () => {
      media.classList.remove("tilting");
      media.style.transform = "";
    });
  });
}

/* ===== Pontos interativos no hero ===== */
const dotsCanvas = document.getElementById("dots");

if (dotsCanvas && !reduceMotion) {
  const dctx = dotsCanvas.getContext("2d");
  const fine = matchMedia("(pointer: fine)").matches;
  let W = 0, H = 0, dots = [];
  let mx = -9999, my = -9999;
  let t = 0;

  function buildDots() {
    const r = dotsCanvas.parentElement.getBoundingClientRect();
    W = dotsCanvas.width = r.width;
    H = dotsCanvas.height = r.height;
    dots = [];
    const gap = 34;
    for (let x = gap / 2; x < W; x += gap) {
      for (let y = gap / 2; y < H; y += gap) {
        dots.push({ x, y });
      }
    }
  }

  if (fine) {
    document.addEventListener("mousemove", (e) => {
      const r = dotsCanvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
  }

  function drawDots() {
    dctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      const dx = d.x - mx, dy = d.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // brilho base ondulando devagar + reação à proximidade do mouse
      const wave = 0.05 + 0.04 * Math.sin(t * 0.012 + d.x * 0.02 + d.y * 0.018);
      const glow = dist < 160 ? (1 - dist / 160) * 0.55 : 0;
      const a = Math.min(0.65, wave + glow);
      const lift = dist < 160 ? (1 - dist / 160) * 3 : 0;
      dctx.beginPath();
      dctx.arc(d.x, d.y - lift, glow > 0 ? 1.7 : 1.2, 0, Math.PI * 2);
      dctx.fillStyle = "rgba(52, 201, 142," + a.toFixed(3) + ")";
      dctx.fill();
    }
    t++;
    requestAnimationFrame(drawDots);
  }

  buildDots();
  drawDots();
  window.addEventListener("resize", buildDots);
}

/* ===== Botões magnéticos ===== */
if (!reduceMotion && matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      btn.style.transform = "translate(" + (x * 4).toFixed(1) + "px," + (y * 3).toFixed(1) + "px)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}
