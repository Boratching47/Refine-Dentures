gsap.registerPlugin(ScrollTrigger);

// gsap.matchMedia() runs animations only when a condition matches,
// and cleans them up automatically if it stops matching (e.g. on resize).
const mm = gsap.matchMedia();
const MOTION = "(prefers-reduced-motion: no-preference)";
const DESKTOP = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

/* =========================================================
   SMOOTH SCROLL (Lenis), synced with GSAP
   ========================================================= */
let lenis = null;
mm.add(MOTION, () => {
  lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {               // cleanup if reduced motion gets switched on
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
});

// Make in-page links (#contact etc.) glide with Lenis
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target || !lenis) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -64 });
  });
});

/* =========================================================
   1. HERO: staggered fade-in on page load
   ========================================================= */
mm.add(MOTION, () => {
  gsap.from(".hero-in", {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: "power3.out",
    stagger: 0.12
  });
});

/* =========================================================
   2. PINNED STATEMENT: zoom in, hold, fade out
   ========================================================= */
mm.add(MOTION, () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: ".statement",
      start: "top top",
      end: "+=120%",
      pin: true,
      scrub: 1
      // markers: true   // <- uncomment to see start/end lines while debugging
    }
  })
  .from(".statement-text", { scale: 0.6, opacity: 0 })
  .to(".statement-text", { scale: 1.3, opacity: 0 }, "+=0.6");
});

/* =========================================================
   3. DENTURE SHOWCASE
   Desktop: section pins, photo starts enlarged in the centre,
   shrinks to the left, then each feature pops out one by one.
   Mobile: no pinning, features just fade in as you scroll.
   ========================================================= */
mm.add(DESKTOP, () => {
  const inner = document.querySelector(".showcase-inner");
  const media = document.querySelector(".showcase-media");
  const points = gsap.utils.toArray(".point");
  const hotspots = gsap.utils.toArray(".hotspot");

  // How far the photo must move to sit in the centre of the section
  const centreOffset = () => inner.offsetWidth / 2 - (media.offsetLeft + media.offsetWidth / 2);

  // Keep everything hidden until its turn
  gsap.set(points, { opacity: 0, y: 40 });
  gsap.set(hotspots, { opacity: 0, scale: 0 });

  const setActive = (i) => {
    points.forEach((p, n) => p.classList.toggle("is-active", n === i));
    hotspots.forEach((h, n) => h.classList.toggle("is-active", n === i));
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".showcase",
      start: "top top",
      end: "+=" + (points.length + 2) * 60 + "%",   // more points = longer scroll
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,   // re-measure on resize
      // Highlight whichever feature the scroll position has reached
      onUpdate: () => {
        const t = tl.time();
        let active = -1;
        points.forEach((_, i) => { if (t >= tl.labels["point" + i]) active = i; });
        if (t >= tl.labels.done) active = -1;
        setActive(active);
      }
    }
  });

  // Step A: photo starts big and centred, then shrinks into place
  tl.fromTo(media,
    { x: centreOffset, scale: 1.35 },
    { x: 0, scale: 1, duration: 1.5, ease: "power2.inOut" }
  );

  // Step B: each feature pops in with its matching hotspot
  points.forEach((point, i) => {
    const label = "point" + i;
    tl.addLabel(label, "+=0.3")
      .to(point, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }, label)
      .to(hotspots[i], { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, label);

    // Dim the previous feature slightly so the new one stands out
    if (i > 0) tl.to(points[i - 1], { opacity: 0.55, duration: 0.4 }, label);
  });

  // Step C: short hold at the end, all features visible, before moving on
  tl.addLabel("done", "+=0.6")
    .to(points, { opacity: 1, duration: 0.5 }, "done")
    .to({}, { duration: 0.6 });
});

// Mobile / small screens: simple reveals instead of pinning
mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
  gsap.from(".showcase-media", {
    scale: 0.9, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".showcase-media", start: "top 85%" }
  });
  gsap.utils.toArray(".point").forEach((point) => {
    gsap.from(point, {
      opacity: 0, y: 40, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: point, start: "top 88%" }
    });
  });
});

/* Click to enlarge the photo (works on every screen size) */
const lightbox = document.getElementById("lightbox");
document.querySelector(".enlarge-btn").addEventListener("click", () => lightbox.showModal());
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });   // click outside to close

/* =========================================================
   4. FADE-UP REVEALS for anything with class="reveal"
   ========================================================= */
mm.add(MOTION, () => {
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  // Comparison rows slide in one after another
  gsap.from(".compare-row:not(.compare-header)", {
    opacity: 0,
    x: -30,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.12,
    scrollTrigger: { trigger: ".compare", start: "top 75%" }
  });
});

/* =========================================================
   5. STAT COUNTERS: count up from 0 when they come into view
   ========================================================= */
document.querySelectorAll(".stat-num").forEach((el) => {
  const end = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const show = (v) => (el.textContent = v.toLocaleString("en-NZ", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }) + suffix);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    show(end);
    return;
  }
  const counter = { v: 0 };
  show(0);
  gsap.to(counter, {
    v: end,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => show(counter.v),
    scrollTrigger: { trigger: el, start: "top 90%", once: true }
  });
});

/* =========================================================
   6. JOURNEY: vertical scroll moves the steps sideways (desktop)
   ========================================================= */
mm.add(DESKTOP, () => {
  const track = document.querySelector(".track");
  const distance = () => track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: ".journey",
      start: "top top",
      end: () => "+=" + distance(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      // Fill the little progress bar as you go
      onUpdate: (self) => gsap.set(".journey-progress span", { scaleX: self.progress })
    }
  });
});

mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
  gsap.utils.toArray(".panel").forEach((panel) => {
    gsap.from(panel, {
      opacity: 0, y: 40, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: panel, start: "top 88%" }
    });
  });
});

/* =========================================================
   7. FAQ: only one answer open at a time
   ========================================================= */
const faqs = document.querySelectorAll(".faq details");
faqs.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (item.open) faqs.forEach((other) => { if (other !== item) other.open = false; });
    ScrollTrigger.refresh();   // page height changed, so re-measure pinned sections
  });
});

/* =========================================================
   8. ENQUIRY FORM (demo only: shows a thank-you message)
   In WordPress, swap the form for a WPForms / Contact Form 7 shortcode.
   ========================================================= */
const form = document.getElementById("enquiry");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.querySelector(".form-success").hidden = false;
  form.querySelector("button[type=submit]").disabled = true;
  form.querySelector(".form-note").hidden = true;
});

// Re-measure everything once images and fonts have loaded
window.addEventListener("load", () => ScrollTrigger.refresh());
