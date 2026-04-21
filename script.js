/* ===========================================================
   Conceiving Victory — Vanilla JS
   Booking flow: session → datetime → details → payment → done
   =========================================================== */

/* ---------- Data ---------- */
const SESSIONS = [
  {
    id: "single",
    name: "Individual Therapy",
    duration: "50 minutes",
    price: 89,
    desc: "A one-off conversation. Perfect to dip your toes in or talk through something specific.",
    features: ["Licensed therapist", "Private video room", "Session notes after"],
    featured: true,
    perMonth: false,
  },
  {
    id: "family",
    name: "Family Session",
    duration: "75 minutes",
    price: 149,
    desc: "The whole family in one room. Work through dynamics together with a trained family therapist.",
    features: ["Family dynamics expertise", "Communication frameworks", "Action plan together"],
    featured: false,
    perMonth: false,
  },
  {
    id: "couples",
    name: "Couples Session",
    duration: "75 minutes",
    price: 129,
    desc: "Two of you, one therapist, a shared space to actually be heard by each other.",
    features: ["Both partners on call", "Communication frameworks", "Follow-up plan"],
    featured: false,
    perMonth: false,
  },
];

const TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30"];

const TESTIMONIALS = [
  {
    quote: "CEO Marcene is an outstanding therapist -- extremely gifted, compassionate, professional, and caring. She has made a tremendous difference in my life, and taught me much, much more than I anticipated. I highly recommend her. She will absolutely deliver on what you are seeking.",
    name: "Kristen D.", role: "Insider Pages Review",
  },
  {
    quote: "I consider myself extremely lucky to have encountered Marcene to guide me during a most difficult time. She is caring, illuminating and always knew exactly which direction to go. Yet, she was gentle enough to let me proceed as the way opened.",
    name: "R.", role: "Insider Pages Review",
  },
  {
    quote: "Marcene Marcus is a truly outstanding family and individual counselor. She is knowledgeable, competent, and highly understanding. Her compassion is readily evident. Her 'getting to the heart of the matter' is quick and comprehensive. Highly recommend her to you.",
    name: "Clark", role: "Insider Pages Review",
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
   BOOKING DIALOG
   =========================================================== */
const STEPS = ["session", "datetime", "details", "payment", "done"];
const TITLES = {
  session: "Choose a session",
  datetime: "Pick a time",
  details: "Your details",
  payment: "Confirm & pay",
};

const state = {
  step: "session",
  sessionId: "month",
  dayIndex: null,
  time: null,
  name: "",
  contact: "",
  contactType: "email",
  note: "",
  card: "",
  exp: "",
  cvc: "",
};

const modal = document.getElementById("booking-modal");
const stepCounter = document.getElementById("step-counter");
const titleEl = document.getElementById("booking-title");
const summaryName = document.getElementById("summary-name");
const summaryPrice = document.getElementById("summary-price");
const progressBar = document.getElementById("progress-bar");
const modalHead = document.getElementById("modal-head");
const modalFoot = document.getElementById("modal-foot");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");

function getSession() { return SESSIONS.find(s => s.id === state.sessionId); }

function getNextDays(count) {
  const out = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      date: d,
      label: d.toLocaleDateString(undefined, { weekday: "short" }),
      sub: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
    });
  }
  return out;
}
const DAYS = getNextDays(7);

/* ----- Session list ----- */
const sessionList = document.getElementById("session-list");
function renderSessionList() {
  sessionList.innerHTML = SESSIONS.map(s => `
    <button class="session-option ${state.sessionId === s.id ? "selected" : ""}" data-session-id="${s.id}">
      <div class="session-option-row">
        <div>
          <p class="name">${s.name}</p>
          <p class="dur">${s.duration}</p>
          <p class="desc">${s.desc}</p>
        </div>
        <span class="price">$${s.price}</span>
      </div>
    </button>
  `).join("");
  sessionList.querySelectorAll("[data-session-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.sessionId = btn.dataset.sessionId;
      renderSessionList();
      updateHeader();
      updateNextEnabled();
    });
  });
}

/* ----- Day & time grids ----- */
const dayGrid = document.getElementById("day-grid");
const timeGrid = document.getElementById("time-grid");
function renderDateTime() {
  dayGrid.innerHTML = DAYS.map((d, i) => `
    <button class="day-btn ${state.dayIndex === i ? "selected" : ""}" data-day="${i}">
      <p class="d-label">${d.label}</p>
      <p class="d-sub">${d.sub}</p>
    </button>
  `).join("");
  timeGrid.innerHTML = TIMES.map(t => `
    <button class="time-btn ${state.time === t ? "selected" : ""}" data-time="${t}">${t}</button>
  `).join("");
  dayGrid.querySelectorAll("[data-day]").forEach(b => b.addEventListener("click", () => {
    state.dayIndex = +b.dataset.day; renderDateTime(); updateNextEnabled();
  }));
  timeGrid.querySelectorAll("[data-time]").forEach(b => b.addEventListener("click", () => {
    state.time = b.dataset.time; renderDateTime(); updateNextEnabled();
  }));
}

/* ----- Form bindings ----- */
const fName = document.getElementById("f-name");
const fContact = document.getElementById("f-contact");
const fNote = document.getElementById("f-note");
const fCard = document.getElementById("f-card");
const fExp = document.getElementById("f-exp");
const fCvc = document.getElementById("f-cvc");

fName.addEventListener("input", e => { state.name = e.target.value; updateNextEnabled(); });
fContact.addEventListener("input", e => { state.contact = e.target.value; updateNextEnabled(); });
fNote.addEventListener("input", e => { state.note = e.target.value; });

const contactEmailBtn = document.getElementById("contact-email-btn");
const contactPhoneBtn = document.getElementById("contact-phone-btn");

contactEmailBtn.addEventListener("click", () => {
  state.contactType = "email";
  fContact.type = "email";
  fContact.placeholder = "you@example.com";
  contactEmailBtn.classList.add("active");
  contactPhoneBtn.classList.remove("active");
  contactEmailBtn.style.background = "white";
  contactPhoneBtn.style.background = "transparent";
  updateNextEnabled();
});

contactPhoneBtn.addEventListener("click", () => {
  state.contactType = "phone";
  fContact.type = "tel";
  fContact.placeholder = "(555) 123-4567";
  contactPhoneBtn.classList.add("active");
  contactEmailBtn.classList.remove("active");
  contactPhoneBtn.style.background = "white";
  contactEmailBtn.style.background = "transparent";
  updateNextEnabled();
});

fCard.addEventListener("input", e => {
  const v = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  e.target.value = v; state.card = v; updateNextEnabled();
});
fExp.addEventListener("input", e => {
  let d = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (d.length > 2) d = d.slice(0, 2) + "/" + d.slice(2);
  e.target.value = d; state.exp = d; updateNextEnabled();
});
fCvc.addEventListener("input", e => {
  const v = e.target.value.replace(/\D/g, "").slice(0, 4);
  e.target.value = v; state.cvc = v; updateNextEnabled();
});

/* ----- Open / close ----- */
function openBooking(sessionId) {
  if (sessionId) state.sessionId = sessionId;
  state.step = sessionId ? "datetime" : "session";
  state.dayIndex = null;
  state.time = null;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  renderSessionList();
  renderDateTime();
  showStep();
}
function closeBooking() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-booking]").forEach(btn => {
  btn.addEventListener("click", () => openBooking(btn.dataset.session));
});
document.querySelectorAll("[data-close-booking]").forEach(btn => {
  btn.addEventListener("click", closeBooking);
});
// Re-bind dynamically created pricing buttons (they got rendered before listeners above)
document.querySelectorAll("#pricing-grid [data-open-booking]").forEach(btn => {
  btn.addEventListener("click", () => openBooking(btn.dataset.session));
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeBooking();
});

/* ----- Step navigation ----- */
function showStep() {
  document.querySelectorAll(".step").forEach(el => {
    el.hidden = el.dataset.step !== state.step;
  });
  const isDone = state.step === "done";
  modalHead.style.display = isDone ? "none" : "";
  modalFoot.style.display = isDone ? "none" : "";

  if (!isDone) {
    const idx = STEPS.indexOf(state.step);
    stepCounter.textContent = `Step ${idx + 1} of 4`;
    titleEl.textContent = TITLES[state.step];
    progressBar.style.width = ((idx + 1) / 4 * 100) + "%";

    backBtn.disabled = state.step === "session";
    if (state.step === "payment") {
      nextBtn.textContent = `Pay $${getSession().price}`;
      nextBtn.classList.remove("btn-primary");
      nextBtn.classList.add("btn-accent");
    } else {
      nextBtn.textContent = "Continue →";
      nextBtn.classList.add("btn-primary");
      nextBtn.classList.remove("btn-accent");
    }

    if (state.step === "payment") fillPaymentSummary();
  }
  updateHeader();
  updateNextEnabled();
}

function updateHeader() {
  const s = getSession();
  summaryName.textContent = s.name;
  summaryPrice.textContent = `$${s.price}`;
}

function fillPaymentSummary() {
  const s = getSession();
  document.getElementById("pay-session").textContent = s.name;
  document.getElementById("pay-total").textContent = `$${s.price}.00`;
  const whenRow = document.getElementById("pay-when-row");
  if (state.dayIndex !== null && state.time) {
    const d = DAYS[state.dayIndex];
    document.getElementById("pay-when").textContent = `${d.label}, ${d.sub} · ${state.time}`;
    whenRow.style.display = "";
  } else {
    whenRow.style.display = "none";
  }
}

function canAdvance() {
  switch (state.step) {
    case "session": return !!state.sessionId;
    case "datetime": return state.dayIndex !== null && state.time !== null;
    case "details":
      return state.name.trim().length > 1 && state.contact.trim().length > 0;
    case "payment":
      return state.card.replace(/\s/g, "").length >= 12 && state.exp.length >= 4 && state.cvc.length >= 3;
    default: return false;
  }
}
function updateNextEnabled() { nextBtn.disabled = !canAdvance(); }

backBtn.addEventListener("click", () => {
  const i = STEPS.indexOf(state.step);
  if (i > 0) { state.step = STEPS[i - 1]; showStep(); }
});
nextBtn.addEventListener("click", () => {
  if (!canAdvance()) return;
  if (state.step === "payment") return processPayment();
  const i = STEPS.indexOf(state.step);
  state.step = STEPS[i + 1];
  showStep();
});

function processPayment() {
  nextBtn.disabled = true;
  nextBtn.textContent = "Processing…";
  setTimeout(() => {
    state.step = "done";
    const s = getSession();
    const whenStr = (state.dayIndex !== null && state.time)
      ? ` for ${DAYS[state.dayIndex].label}, ${DAYS[state.dayIndex].sub} at ${state.time}`
      : "";
    document.getElementById("done-msg").innerHTML =
      `We've booked your <strong>${s.name}</strong>${whenStr}. A confirmation is on its way to ${state.email || "your inbox"}.`;
    showStep();
    showToast("Session booked — confirmation sent.");
  }, 1500);
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}
