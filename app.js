/* ============================================================
   MARIA LUIZA — BRUTALISTA — JS
   Header scroll state · Accordion · PIP parallax · Count-up
   Form validation inline · Toast · Year/build
   ============================================================ */
(function () {
  "use strict";

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isCoarse = window.matchMedia("(pointer: coarse)").matches;

  /* ——— DATA: registro competitivo (8 conquistas) ——— */
  var CONQUISTAS = [
    { ano: 2022, comp: "Olympia Amateur Argentina", lugar: "Buenos Aires · AR", pos: "Top 4", thumb: "Principal_Olympia_Amateur_2022.webp" },
    { ano: 2022, comp: "Musclecontest Nacional",    lugar: "São Paulo · BR",      pos: "Campeã", thumb: "Pose_Olympia_Amateur_2022.jpg"   },
    { ano: 2021, comp: "Muscle World",              lugar: "Campinas · BR",       pos: "1º",     thumb: "pose_muscle_contest_ribeirao.jpg"},
    { ano: 2023, comp: "Musclecontest Ribeirão",     lugar: "Ribeirão Preto · BR", pos: "Top 3",  thumb: "Maria_sem_fundo_pose.png"        },
    { ano: 2020, comp: "ABBF Figure Nationals",      lugar: "Rio de Janeiro · BR", pos: "Overall",thumb: "foto_perfil.jpg"                 },
    { ano: 2019, comp: "IFBB Pro Qualifier",        lugar: "Assunção · PY",       pos: "Top 5",  thumb: "Arte_beijo_trofeu_olympia_amateur_2022.webp" },
    { ano: 2018, comp: "Musclecontest Figure",      lugar: "São Paulo · BR",      pos: "Campeã", thumb: "Pose_beigo_trofeus.png"         },
    { ano: 2017, comp: "CBFJ Figure State",         lugar: "Pedreira · BR",       pos: "1º",     thumb: "foto_pessoal_descontraida.png"  }
  ];

  /* ——— BUILD TIMELINE TRACK ——— */
  var track = $("#registroTrack");
  if (track) {
    CONQUISTAS.forEach(function (c, i) {
      var card = document.createElement("div");
      card.className = "track-card";
      card.innerHTML =
        '<div class="mono">CAP.' + String(i + 1).padStart(2, "0") + ' / ' + String(CONQUISTAS.length).padStart(2, "0") + '</div>' +
        '<div class="track-card__ano" data-ano="' + c.ano + '">0</div>' +
        '<div class="track-card__comp">' + c.comp + '</div>' +
        '<div class="track-card__lugar">' + c.lugar + '</div>' +
        '<div class="track-card__thumb" style="background-image:url(./imgs/' + c.thumb + ')"></div>' +
        '<div class="track-card__result"><span>colocação</span><span class="track-card__pos">' + c.pos + '</span></div>';
      track.appendChild(card);
    });
  }

  /* ——— HEADER scroll state ——— */
  var hdr = $("#hdr");
  function onScroll() {
    if (!hdr) return;
    if (window.scrollY > 60) hdr.classList.add("is-scrolled");
    else hdr.classList.remove("is-scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ——— Hambúrguer mobile ——— */
  var toggle = $(".hdr__toggle");
  var mobile = $(".hdr__mobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      var open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
  $$(".hdr__mobile-link, .hdr__nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (mobile) mobile.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ——— COUNT-UP dos anos (IntersectionObserver) ——— */
  var anoEls = $$("[data-ano]");
  function countUp(el) {
    var target = parseInt(el.dataset.ano, 10);
    var start = target - 30;
    var dur = 800;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if (!reducedMotion && "IntersectionObserver" in window) {
    var ioAno = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          countUp(e.target);
          ioAno.unobserve(e.target);
        }
      });
    }, { root: $("#trackViewport") || null, threshold: 0.6 });
    anoEls.forEach(function (el) { ioAno.observe(el); });
  } else {
    anoEls.forEach(function (el) { el.textContent = el.dataset.ano; });
  }

  /* ——— PIP PARALAX (inverted on some, direction-aware) ——— */
  var pips = $$(".pip");
  var viewRect = null;
  function onParallax() {
    if (reducedMotion || isCoarse) return;
    pips.forEach(function (pip) {
      var speed = parseFloat(pip.dataset.speed) || 0;
      var rect = pip.parentElement.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var dev = (center - window.innerHeight / 2) / window.innerHeight;
      var y = -dev * speed * 30;
      pip.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    });
  }
  if (!reducedMotion && !isCoarse) {
    window.addEventListener("scroll", onParallax, { passive: true });
    window.addEventListener("resize", onParallax, { passive: true });
    onParallax();
  }

  /* ——— ACCORDION MODALIDADES ——— */
  $$(".modalidade").forEach(function (mod) {
    var head = $(".modalidade__head", mod);
    head.addEventListener("click", function () {
      var open = mod.getAttribute("data-open") === "true";
      $$(".modalidade").forEach(function (m) {
        m.setAttribute("data-open", "false");
        $(".modalidade__head", m).setAttribute("aria-expanded", "false");
      });
      if (!open) {
        mod.setAttribute("data-open", "true");
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ——— TOAST ——— */
  var toastEl = $("#toast");
  var tTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2800);
  }

  /* ——— FORM SUBMIT INLINE ——— */
  $$(".form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.querySelector('input[name="nome"]');
      var wa   = form.querySelector('input[name="wa"]');

      function err(field, msg) {
        var gp = field.closest(".field");
        if (gp) gp.classList.add("has-error");
        var pe = gp ? gp.querySelector(".field__err") : null;
        if (!pe) {
          pe = document.createElement("p"); pe.className = "field__err";
          gp.appendChild(pe);
        }
        pe.textContent = msg;
      }
      function clearErr() {
        $$(".has-error", form).forEach(function (gp) {
          gp.classList.remove("has-error");
          var pe = gp.querySelector(".field__err");
          if (pe) pe.textContent = "";
        });
      }

      clearErr();
      var ok = true;
      if (nome && nome.value.trim().length < 2) { err(nome, "Nome obrigatório"); ok = false; }
      if (wa && wa.value.replace(/\D/g, "").length < 10) { err(wa, "WhatsApp inválido"); ok = false; }
      if (!ok) { toast("Confira os campos"); return; }

      var btn = $('button[type=submit]', form);
      btn.classList.add("is-loading");
      setTimeout(function () {
        btn.classList.remove("is-loading");
        btn.classList.add("is-success");
        toast("Briefing enviado · " + form.dataset.modalidade);
        setTimeout(function () {
          btn.classList.remove("is-success");
          form.reset();
        }, 2200);
      }, 750);
    });

    $$("input", form).forEach(function (input) {
      input.addEventListener("blur", function () {
        var gp = input.closest(".field");
        if (!gp) return;
        if (input.value.trim()) {
          gp.classList.remove("has-error");
          var pe = gp.querySelector(".field__err");
          if (pe) pe.textContent = "";
        }
      });
    });
  });

  /* ——— SOUND (mute por padrão — opt-in via IntersectionObserver opcional) ——— */
  // Removed intentionally — silent brutalist.

  /* ——— YEAR + BUILD TIMESTAMP ——— */
  var y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  var ts = $("#ts");
  if (ts) ts.textContent = new Date().toISOString().slice(0, 10);

  /* ——— TRACK scroll-snap accessibility ——— */
  var tv = $("#trackViewport");
  if (tv) {
    tv.setAttribute("tabindex", "0");
    tv.setAttribute("role", "group");
    tv.setAttribute("aria-label", "Linha do tempo — use as setas ← → para navegar");
  }

  /* ——— Smooth scroll anchor (incl. mobile menu close) ——— */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      var target = $(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (target.id === "capa" ? 0 : 64);
      window.scrollTo({ top: top, behavior: reducedMotion ? "auto" : "smooth" });
    });
  });

})();
