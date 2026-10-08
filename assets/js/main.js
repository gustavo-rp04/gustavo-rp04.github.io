/* Site interactions: header, menu, active nav, reveal, count-up, carousel,
   lightbox, back-to-top and contact form. No dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isSpanish = document.documentElement.lang === "es";
  var t = isSpanish
    ? { photo: "Mostrar foto", sending: "Enviando…", sent: "¡Gracias! Te responderé pronto.", error: "No se pudo enviar. Escríbeme directamente por email.", mail: "Se abrirá tu aplicación de correo para enviar el mensaje." }
    : { photo: "Show photo", sending: "Sending…", sent: "Thank you! I'll get back to you soon.", error: "Something went wrong. Please email me directly.", mail: "Your email app will open to send the message." };

  /* ---- Sticky header: compact + background once the page scrolls ---- */
  var header = document.querySelector(".site-header");
  var backToTop = document.querySelector(".back-to-top");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (backToTop) backToTop.classList.toggle("is-visible", y > window.innerHeight * 1.2);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---- Mobile menu ---- */
  var menu = document.getElementById("mobile-menu");
  var openBtn = document.querySelector(".nav__toggle");
  var closeBtn = menu && menu.querySelector(".mobile-menu__close");
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    (open ? closeBtn : openBtn).focus();
  }
  if (menu && openBtn) {
    openBtn.addEventListener("click", function () { setMenu(true); });
    closeBtn.addEventListener("click", function () { setMenu(false); });
    menu.querySelectorAll("a[href^='#']").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
    });
  }

  /* ---- Active section in the nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---- Reveal on scroll + highlighter draw + stat count-up ---- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target) || reduceMotion) return;
    var start = null;
    var duration = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  var revealTargets = document.querySelectorAll(".reveal, .highlight, [data-count]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        if (el.hasAttribute("data-count")) countUp(el);
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Timeline: coral line fills as you scroll, dots light up when reached ---- */
  document.querySelectorAll(".timeline-wrap").forEach(function (wrap) {
    var items = Array.prototype.slice.call(wrap.querySelectorAll(".timeline__item"));
    var ticking = false;
    function updateTimeline() {
      ticking = false;
      var line = window.innerHeight * 0.6; // the "reading line" at 60% of the viewport
      var box = wrap.getBoundingClientRect();
      var progress = Math.min(Math.max((line - box.top) / box.height, 0), 1);
      wrap.style.setProperty("--progress", progress.toFixed(4));
      items.forEach(function (item) {
        var dot = item.querySelector(".timeline__dot");
        item.classList.toggle("is-reached", dot.getBoundingClientRect().top < line);
      });
    }
    function requestUpdate() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateTimeline); }
    }
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    wrap.addEventListener("toggle", requestUpdate, true); // opening a role changes the height
    updateTimeline();
  });

  /* ---- Carousel: native scroll-snap track with arrows, dots and counter ---- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel__track");
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var counter = root.querySelector(".carousel__counter");
    var dotsWrap = root.querySelector(".carousel__dots");
    var total = slides.length;
    var pad = function (n) { return String(n).padStart(2, "0"); };

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot";
      b.setAttribute("aria-label", t.photo + " " + (i + 1));
      b.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(b);
      return b;
    });

    function step() { return slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth; }
    function perView() { return Math.max(1, Math.round(track.clientWidth / step())); }
    function current() { return Math.round(track.scrollLeft / step()); }
    function goTo(i) {
      var max = total - perView();
      var target = Math.max(0, Math.min(i, max));
      track.scrollTo({ left: target * step(), behavior: reduceMotion ? "auto" : "smooth" });
    }
    function update() {
      var i = current();
      var last = Math.min(i + perView(), total);
      counter.textContent = pad(i + 1) + (last > i + 1 ? "–" + pad(last) : "") + " / " + pad(total);
      dots.forEach(function (d, k) {
        if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      prev.disabled = i <= 0;
      next.disabled = i >= total - perView();
      prev.style.opacity = prev.disabled ? 0.35 : "";
      next.style.opacity = next.disabled ? 0.35 : "";
    }
    prev.addEventListener("click", function () { goTo(current() - 1); });
    next.addEventListener("click", function () { goTo(current() + 1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); }
    });
    window.addEventListener("resize", update);
    update();

    /* Lightbox */
    var dialog = document.getElementById("lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;
    var img = dialog.querySelector(".lightbox__img");
    var cap = dialog.querySelector(".lightbox__caption");
    var index = 0;
    function show(i) {
      index = (i + total) % total;
      var source = slides[index].querySelector("img");
      img.src = source.src;
      img.alt = source.alt;
      cap.textContent = slides[index].querySelector(".carousel__caption").textContent;
    }
    slides.forEach(function (slide, i) {
      slide.querySelector(".carousel__open").addEventListener("click", function () {
        show(i);
        dialog.showModal();
      });
    });
    dialog.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(index - 1); });
    dialog.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(index + 1); });
    dialog.querySelector(".lightbox__close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    });
    dialog.addEventListener("close", function () { goTo(index); });
  });

  /* ---- Contact form ----
     Set data-endpoint on the form to a Formspree URL (https://formspree.io/f/xxxx)
     to receive messages by email. Without it, the form opens the visitor's
     email app with the message filled in. */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var status = form.querySelector(".form__status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var endpoint = form.getAttribute("data-endpoint");
      if (!endpoint) {
        var body = data.get("message") + "\n\n— " + data.get("name") + " (" + data.get("email") + ")";
        status.textContent = t.mail;
        window.location.href = "mailto:" + form.getAttribute("data-mailto") +
          "?subject=" + encodeURIComponent((isSpanish ? "Contacto web — " : "Website contact — ") + data.get("name")) +
          "&body=" + encodeURIComponent(body);
        return;
      }
      status.textContent = t.sending;
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          status.textContent = t.sent;
        })
        .catch(function () { status.textContent = t.error; });
    });
  }

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
