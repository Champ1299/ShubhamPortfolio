// ================= HERO PHOTO FALLBACK =================
// Shows the "SS" placeholder until assets/profile.png exists.
const heroPhoto = document.getElementById("hero-photo");
const photoWrap = heroPhoto.parentElement;
function checkPhoto() {
  if (!heroPhoto.complete) return;
  photoWrap.classList.toggle("no-photo", heroPhoto.naturalWidth === 0);
}
heroPhoto.addEventListener("error", () => photoWrap.classList.add("no-photo"));
heroPhoto.addEventListener("load", () => photoWrap.classList.remove("no-photo"));
checkPhoto();

// ================= TYPING EFFECT =================
const roles = ["HR Professional", "HR Helpdesk Expert", "People Coordinator", "Onboarding Specialist"];
const typedEl = document.getElementById("typed");
let roleIdx = 0;
let charIdx = 0;
let deleting = false;

function type() {
  const word = roles[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);

  if (!deleting && charIdx < word.length) {
    charIdx++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1800);
  } else if (charIdx > 0) {
    charIdx--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ================= NAVBAR =================
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.getElementById("menu-toggle");
const backTop = document.getElementById("back-top");
const links = navLinks.querySelectorAll("a");
const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open");
});
links.forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
  })
);

const timeline = document.querySelector(".timeline");
const timelineProgress = document.getElementById("timeline-progress");

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 30);
  backTop.classList.toggle("show", y > 600);

  // active link highlight
  let current = sections[0];
  sections.forEach((sec) => {
    if (sec && sec.offsetTop - 160 <= y) current = sec;
  });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current.id));

  // timeline progress line
  const rect = timeline.getBoundingClientRect();
  const progress = Math.min(Math.max((window.innerHeight * 0.7 - rect.top) / rect.height, 0), 1);
  timelineProgress.style.height = progress * 100 + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ================= SCROLL REVEAL + COUNTERS + BARS =================
function animateCount(el) {
  const target = +el.dataset.target;
  const duration = 1500;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      el.querySelectorAll(".count").forEach(animateCount);
      el.querySelectorAll(".bar-fill").forEach((b) => (b.style.width = b.dataset.width + "%"));
      observer.unobserve(el);
    });
  },
  { threshold: 0.15 }
);

// stagger siblings inside grids
document.querySelectorAll(".reveal").forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = Math.min(siblings.indexOf(el) * 0.08, 0.5) + "s";
  observer.observe(el);
});

// ================= 3D TILT + SPOTLIGHT =================
const canHover = window.matchMedia("(hover: hover)").matches;
if (canHover) {
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // cursor glow
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  // subtle parallax on hero visual
  const heroVisual = document.querySelector(".hero-visual");
  const floaters = heroVisual.querySelectorAll(".float-card, .float-chip, .photo-wrap");
  document.querySelector(".hero").addEventListener("mousemove", (e) => {
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    floaters.forEach((f, i) => {
      const depth = f.classList.contains("photo-wrap") ? 8 : 18 + i * 4;
      f.style.translate = `${dx * depth}px ${dy * depth}px`;
    });
  });
}

// ================= PARTICLE BACKGROUND =================
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const mouse = { x: -9999, y: -9999 };

function resize() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 16000), 90);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.6 + 0.6,
  }));
}
window.addEventListener("resize", resize);
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
resize();

function draw() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,107,29,0.55)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 120) {
        ctx.strokeStyle = `rgba(242,107,29,${0.12 * (1 - d / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (md < 160) {
      ctx.strokeStyle = `rgba(255,154,60,${0.35 * (1 - md / 160)})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) draw();

// ================= CONTACT FORM (mailto) =================
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("c-name").value.trim();
  const email = document.getElementById("c-email").value.trim();
  const msg = document.getElementById("c-msg").value.trim();
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  window.location.href = `mailto:singhshubham4558@gmail.com?subject=${subject}&body=${body}`;
});

// ================= FOOTER YEAR =================
document.getElementById("year").textContent = new Date().getFullYear();
