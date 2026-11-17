/* =========================================================
   CHAPA BRANDING CO — SITE CONFIGURATION
   Edit the values below to rebrand the site. Nothing else in
   this file needs to change for a basic rebrand.
   ========================================================= */
const SITE_CONFIG = {
  BUSINESS_NAME: "Stravon Creative Group",
  BUSINESS_TAGLINE: "Built to Stand Apart.",
  PHONE_NUMBER: "+254 794 161 259", 
  WHATSAPP_NUMBER: "254750532102",
  EMAIL: "stravoncreative@outlook.com",
  LOCATION: "Nairobi, Kenya",
  TIKTOK_URL: "https://www.tiktok.com/@stravoncreative_g?_r=1&_t=ZS-9A9tBk3CJIS",
  INSTAGRAM_URL: "https://www.instagram.com/stravon_group?stkn=MTh3a3phMGlzcGdobw==",
  FACEBOOK_URL: "https://www.facebook.com/share/1Dqiqqk8jj/",
  WHATSAPP_URL: "", // leave blank to auto-generate from WHATSAPP_NUMBER
  LOGO_URL: "images/stravon-logo.jpg" // path to the uploaded logo file
};

// Build a wa.me link with a pre-filled message
function buildWhatsAppLink(message){
  const base = SITE_CONFIG.WHATSAPP_URL && SITE_CONFIG.WHATSAPP_URL.trim() !== ""
    ? SITE_CONFIG.WHATSAPP_URL
    : `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}`;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(message)}`;
}

/* =========================================================
   INJECT CONFIG INTO THE PAGE
   ========================================================= */
function applyConfig(){
  document.title = `${SITE_CONFIG.BUSINESS_NAME} | Custom Branding & Printing`;

  document.querySelectorAll("[data-cfg]").forEach(el => {
    const key = el.getAttribute("data-cfg");
    if (SITE_CONFIG[key] !== undefined) el.textContent = SITE_CONFIG[key];
  });

  document.querySelectorAll("[data-cfg-href]").forEach(el => {
    const key = el.getAttribute("data-cfg-href");
    if (key === "TEL") el.setAttribute("href", `tel:${SITE_CONFIG.PHONE_NUMBER.replace(/\s+/g,"")}`);
    else if (key === "MAILTO") el.setAttribute("href", `mailto:${SITE_CONFIG.EMAIL}`);
    else if (SITE_CONFIG[key] !== undefined) el.setAttribute("href", SITE_CONFIG[key]);
  });

  // Floating WhatsApp button + all WhatsApp CTAs
  const waMessage = "Hello, I would like to inquire about your branding services.";
  document.querySelectorAll("[data-wa-link]").forEach(el => {
    el.setAttribute("href", buildWhatsAppLink(waMessage));
  });

  // Full logo lockup: shown wherever a .logo-lockup slot exists (e.g. footer),
  // since the uploaded logo is a wide graphic + wordmark that would distort
  // if forced into the small 38px nav/footer monogram badge.
  if (SITE_CONFIG.LOGO_URL && SITE_CONFIG.LOGO_URL.trim() !== ""){
    document.querySelectorAll(".logo-lockup").forEach(el => {
      el.innerHTML = `<img src="${SITE_CONFIG.LOGO_URL}" alt="${SITE_CONFIG.BUSINESS_NAME} logo" style="width:100%;height:auto;display:block;">`;
    });
  }

  // Copyright year + business name
  const copyEl = document.getElementById("copyright-line");
  if (copyEl){
    copyEl.textContent = `© ${new Date().getFullYear()} ${SITE_CONFIG.BUSINESS_NAME}. All Rights Reserved.`;
  }
}

/* =========================================================
   MOBILE NAV DRAWER
   ========================================================= */
function initMobileNav(){
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("mobileDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (!hamburger || !drawer || !backdrop) return;

  function openDrawer(){
    drawer.classList.add("open");
    backdrop.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  function closeDrawer(){
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  hamburger.addEventListener("click", () => {
    drawer.classList.contains("open") ? closeDrawer() : openDrawer();
  });
  backdrop.addEventListener("click", closeDrawer);
  drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });
}

/* =========================================================
   QUOTE MODAL
   ========================================================= */
function initQuoteModal(){
  const overlay = document.getElementById("quoteModalOverlay");
  const openTriggers = document.querySelectorAll("[data-open-quote]");
  const closeBtn = document.getElementById("quoteModalClose");
  if (!overlay) return;

  function openModal(presetProduct){
    overlay.classList.add("open");
    document.body.classList.add("no-scroll");
    if (presetProduct){
      const select = document.getElementById("quoteProduct");
      if (select) select.value = presetProduct;
    }
  }
  function closeModal(){
    overlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  openTriggers.forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-product") || ""));
  });
  closeBtn && closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // Radio chip styling
  document.querySelectorAll("#quoteForm .radio-chip input").forEach(input => {
    input.addEventListener("change", () => {
      document.querySelectorAll("#quoteForm .radio-chip").forEach(chip => chip.classList.remove("checked"));
      input.closest(".radio-chip").classList.add("checked");
    });
  });

  // Submission (demo only — no backend wired up)
  const form = document.getElementById("quoteForm");
  if (form){
    form.addEventListener("submit", e => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type=submit]");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      setTimeout(() => {
        closeModal();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Quote Request";
        showToast("Thanks! Your quote request has been received. We'll get back to you shortly.");
      }, 700);
    });
  }
}

/* =========================================================
   CUSTOM ORDER FORM
   ========================================================= */
function initCustomOrderForm(){
  const form = document.getElementById("customOrderForm");
  const confirm = document.getElementById("customOrderConfirm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Request";
      if (confirm){
        confirm.classList.add("show");
        confirm.setAttribute("tabindex", "-1");
        confirm.focus();
      }
    }, 700);
  });
}

/* =========================================================
   FILE INPUT LABEL UPDATE
   ========================================================= */
function initFileInputs(){
  document.querySelectorAll(".field-file input[type=file]").forEach(input => {
    const labelSpan = input.closest(".field-file").querySelector("span");
    const defaultText = labelSpan ? labelSpan.textContent : "";
    input.addEventListener("change", () => {
      if (input.files && input.files.length > 0 && labelSpan){
        labelSpan.textContent = input.files.length === 1 ? input.files[0].name : `${input.files.length} files selected`;
      } else if (labelSpan){
        labelSpan.textContent = defaultText;
      }
    });
  });
}

/* =========================================================
   PORTFOLIO FILTER
   ========================================================= */
function initPortfolioFilter(){
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".masonry-item");
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      items.forEach(item => {
        const cats = item.getAttribute("data-category") || "";
        const show = filter === "all" || cats.split(" ").includes(filter);
        item.hidden = !show;
      });
    });
  });
}

/* =========================================================
   LIGHTBOX
   ========================================================= */
function initLightbox(){
  const items = Array.from(document.querySelectorAll(".masonry-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  if (!lightbox || !items.length) return;

  let currentIndex = 0;

  function visibleItems(){
    return items.filter(item => !item.hidden);
  }

  function openLightbox(item){
    const vis = visibleItems();
    currentIndex = vis.indexOf(item);
    render();
    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  }
  function render(){
    const vis = visibleItems();
    const item = vis[currentIndex];
    if (!item) return;
    const img = item.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
  }
  function closeLightbox(){
    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  function step(dir){
    const vis = visibleItems();
    currentIndex = (currentIndex + dir + vis.length) % vis.length;
    render();
  }

  items.forEach(item => item.addEventListener("click", () => openLightbox(item)));
  closeBtn && closeBtn.addEventListener("click", closeLightbox);
  prevBtn && prevBtn.addEventListener("click", () => step(-1));
  nextBtn && nextBtn.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}

/* =========================================================
   SCROLL REVEAL (single, lightweight)
   ========================================================= */
function initScrollReveal(){
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !targets.length){
    targets.forEach(t => t.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  targets.forEach(t => observer.observe(t));
}

/* =========================================================
   HEADER SHADOW ON SCROLL + SMOOTH ANCHOR OFFSET
   ========================================================= */
function initHeaderState(){
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8 ? "0 4px 16px rgba(23,23,27,0.08)" : "none";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   TOAST
   ========================================================= */
function showToast(message){
  let toast = document.getElementById("siteToast");
  if (!toast){
    toast = document.createElement("div");
    toast.id = "siteToast";
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "26px";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    toast.style.background = "#17171B";
    toast.style.color = "#F5F3EC";
    toast.style.padding = "0.9rem 1.4rem";
    toast.style.borderRadius = "10px";
    toast.style.fontFamily = "'Work Sans', sans-serif";
    toast.style.fontSize = "0.92rem";
    toast.style.maxWidth = "min(420px, 86vw)";
    toast.style.textAlign = "center";
    toast.style.zIndex = "1200";
    toast.style.opacity = "0";
    toast.style.transition = "opacity .3s ease, transform .3s ease";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 3200);
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initMobileNav();
  initQuoteModal();
  initCustomOrderForm();
  initFileInputs();
  initPortfolioFilter();
  initLightbox();
  initScrollReveal();
  initHeaderState();
});
