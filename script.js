/* ===========================================================
   Conceiving Victory - Vanilla JS with Setmore Integration
   =========================================================== */

/* ---------- Data ---------- */
const SESSIONS = [
  {
    id: "individual",
    name: "Individual Therapy OR Clinical Consultation",
    duration: "50 minutes",
    price: 180,
    desc: "A one-off conversation. Perfect to dip your toes in or talk through something specific.",
    features: ["Licensed therapist", "Private video room", "Session notes after"],
    featured: true,
    perMonth: false,
    footnote: "Clinical Supervision consult — free to ASWs, AMFTs.",
  },
  {
    id: "family",
    name: "Family Session",
    duration: "75 minutes",
    price: 200,
    desc: "The whole family in one room. Work through dynamics together with a trained family therapist.",
    features: ["Family dynamics expertise", "Communication frameworks", "Action plan together"],
    featured: false,
    perMonth: false,
  },
  {
    id: "couples",
    name: "Couples Session",
    duration: "75 minutes",
    price: 200,
    desc: "Two of you, one therapist, a shared space to actually be heard by each other.",
    features: ["Both partners on call", "Communication frameworks", "Follow-up plan"],
    featured: false,
    perMonth: false,
  },
];

const TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30", "21:00"];

const TESTIMONIALS = [
  {
    quote: "Marcene is an outstanding therapist -- extremely gifted, compassionate, professional, and caring. She has made a tremendous difference in my life, and taught me much, much more than I anticipated. I highly recommend her. She will absolutely deliver on what you are seeking.",
    name: "Kristen D.", role: "CEO",
  },
  {
    quote: "I consider myself extremely lucky to have encountered Marcene to guide me during a most difficult time. She is caring, illuminating and always knew exactly which direction to go. Yet, she was gentle enough to let me proceed as the way opened.",
    name: "R.", role: "Journeyman",
  },
  {
    quote: "Marcene Marcus is a truly outstanding family and individual counselor. She is knowledgeable, competent, and highly understanding. Her compassion is readily evident. Her 'getting to the heart of the matter' is quick and comprehensive. Highly recommend her to you.",
    name: "Clark", role: "Pastor",
  },
];

/* ---------- Render pricing ---------- */
const pricingGrid = document.getElementById("pricing-grid");
pricingGrid.innerHTML = SESSIONS.map(s => `
  <article class="price-card ${s.featured ? "featured" : ""}">
    ${s.featured ? '<span class="featured-badge">Most chosen</span>' : ''}
    <h3>${s.name}</h3>
    <p class="price-duration">${s.duration}</p>
    <div class="price-amount">
      <span class="num">$${s.price}</span>
      <span class="per">${s.perMonth ? "/month" : ""}</span>
    </div>
    <p class="price-desc">${s.desc}</p>
    <ul class="price-features">
      ${s.features.map(f => `<li>${f}</li>`).join("")}
    </ul>
    <button class="btn ${s.featured ? "btn-accent" : "btn-primary"}" data-open-booking data-session="${s.id}">
      Book this session
    </button>
    ${s.footnote ? `<p class="price-footnote${s.featured ? " price-footnote--on-dark" : ""}">${s.footnote}</p>` : ""}
  </article>
`).join("");

/* ---------- Render testimonials ---------- */
const testiGrid = document.getElementById("testimonials-grid");
testiGrid.innerHTML = TESTIMONIALS.map(t => `
  <figure class="testi-card">
    <span class="testi-quote">“</span>
    <blockquote>${t.quote}</blockquote>
    <figcaption>
      <p class="testi-name">${t.name}</p>
      <p class="testi-role">${t.role}</p>
    </figcaption>
  </figure>
`).join("");

/* ---------- Year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ===========================================================
   SETMORE BOOKING INTEGRATION
   =========================================================== */
const modal = document.getElementById("booking-modal");
const setmoreWidget = document.getElementById("setmore-booking-widget");

// Initialize Setmore widget when modal opens
function initializeSetmoreWidget() {
  // Clear any existing content
  setmoreWidget.innerHTML = '';
  
  // Create Setmore iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://conceivingvictoryincorporatec.setmore.com/';
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '0 0 0.5rem 0.5rem';
  setmoreWidget.appendChild(iframe);
}

function openBooking(sessionId) {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  initializeSetmoreWidget();
}

function closeBooking() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  // Clear widget when closed to free up resources
  setmoreWidget.innerHTML = '';
}

// Booking button listeners
document.querySelectorAll("[data-open-booking]").forEach(btn => {
  btn.addEventListener("click", () => openBooking(btn.dataset.session));
});

document.querySelectorAll("[data-close-booking]").forEach(btn => {
  btn.addEventListener("click", closeBooking);
});

// Re-bind dynamically created pricing buttons
document.querySelectorAll("#pricing-grid [data-open-booking]").forEach(btn => {
  btn.addEventListener("click", () => openBooking(btn.dataset.session));
});

// Escape key to close
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeBooking();
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}

/* ---------- Steps Section ---------- */
const STEPS_DATA = [
  {
    n: "01",
    title: "Choose your time",
    body: "Pick a slot that fits your week. Mornings, evenings, weekends - we keep it flexible.",
    icon: `<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v3M16 3v3"/><path d="M9.5 14l1.5 1.5 3.5-3.5"/></svg>`,
  },
  {
    n: "02",
    title: "Meet over video",
    body: "Join a private, secure video room from any device. No app downloads, no waiting rooms.",
    icon: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/></svg>`,
  },
  {
    n: "03",
    title: "Talk it through",
    body: "Share what's on your mind, in your heart and weighing down your spirit with a licensed psychotherapist who is honored to talk with you as often as you like.",
    icon: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg>`,
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("steps-grid");
  if (!grid) return;
  grid.innerHTML = STEPS_DATA.map(
    (s) => `
    <article class="step-card">
      <span class="step-number" aria-hidden="true">${s.n}</span>
      <div class="step-icon">${s.icon}</div>
      <h3 class="step-title">${s.title}</h3>
      <p class="step-body">${s.body}</p>
    </article>
  `
  ).join("");
});
