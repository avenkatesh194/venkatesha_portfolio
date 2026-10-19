(function () {
  var EMAIL = "avenkatesh194@gmail.com";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.add("js");

  document.querySelectorAll("[data-email]").forEach(function (node) {
    node.textContent = EMAIL;
    if (node.tagName === "A") {
      node.setAttribute("href", "mailto:" + EMAIL);
    }
  });

  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(closeNav, 0);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var filterRoot = document.querySelector("[data-filters]");
  if (filterRoot) {
    var buttons = filterRoot.querySelectorAll("button");
    var cards = document.querySelectorAll("[data-work]");
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");
        buttons.forEach(function (item) {
          var active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        cards.forEach(function (card) {
          var show = filter === "all" || card.getAttribute("data-work") === filter;
          card.hidden = !show;
        });
      });
    });
  }

  setupCarousel();
  setupRoles();
  setupReveal();

  var form = document.querySelector("[data-contact-form]");
  if (form) setupForm(form);

  function setupRoles() {
    var node = document.querySelector("[data-roles]");
    if (!node || reduceMotion) return;
    var roles = node.getAttribute("data-roles").split("|");
    var index = 0;
    window.setInterval(function () {
      index = (index + 1) % roles.length;
      node.textContent = roles[index];
    }, 2200);
  }

  function setupCarousel() {
    var root = document.querySelector("[data-carousel]");
    if (!root) return;
    var track = root.querySelector("[data-carousel-track]");
    var slides = Array.prototype.slice.call(track.children);
    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    var index = 0;
    var timer = 0;
    var startX = 0;
    var dragging = false;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", "Show project " + (i + 1));
      dot.addEventListener("click", function () { go(i, true); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(nextIndex, user) {
      index = (nextIndex + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (dot, n) {
        var on = n === index;
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      slides.forEach(function (slide, n) {
        var active = n === index;
        slide.setAttribute("aria-hidden", active ? "false" : "true");
        slide.querySelectorAll("a").forEach(function (link) {
          if (active) link.removeAttribute("tabindex");
          else link.setAttribute("tabindex", "-1");
        });
      });
      if (user) restart();
    }

    function stop() {
      window.clearInterval(timer);
    }

    function start() {
      stop();
      if (reduceMotion || document.hidden) return;
      timer = window.setInterval(function () { go(index + 1); }, 5500);
    }

    function restart() {
      stop();
      start();
    }

    prev.addEventListener("click", function () { go(index - 1, true); });
    next.addEventListener("click", function () { go(index + 1, true); });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) start();
    });
    root.addEventListener("pointerdown", function (event) {
      if (event.target.closest("a, button")) return;
      dragging = true;
      startX = event.clientX;
    });
    root.addEventListener("pointerup", function (event) {
      if (!dragging) return;
      dragging = false;
      var delta = event.clientX - startX;
      if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1), true);
    });
    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") go(index - 1, true);
      if (event.key === "ArrowRight") go(index + 1, true);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    go(0);
    start();
  }

  function setupReveal() {
    var nodes = document.querySelectorAll(".stat, .service-row, .step, .region-card, .panel, .faq, .cta-band, .section-head, .portrait, .carousel, .tech-card, .pg-card, .pg-step, .pg-pack, .pg-faq, .pg-quote");
    if (!nodes.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

    nodes.forEach(function (node, i) {
      node.classList.add("reveal");
      if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
        node.classList.add("is-visible");
        return;
      }
      node.style.transitionDelay = (i % 4) * 70 + "ms";
      observer.observe(node);
    });
  }

  function setupForm(form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var names = ["name", "email", "service", "message"];
      var valid = true;

      names.forEach(function (name) {
        var input = form.elements[name];
        var error = form.querySelector('[data-error-for="' + name + '"]');
        var message = validate(input);
        if (error) error.textContent = message;
        input.setAttribute("aria-invalid", message ? "true" : "false");
        if (message) valid = false;
      });

      var status = form.querySelector("[data-form-status]");
      if (!valid) {
        if (status) status.textContent = "Please correct the highlighted fields.";
        var firstInvalid = form.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      var button = form.querySelector("[type='submit']");
      if (button) button.disabled = true;
      if (status) status.textContent = "Sending your message…";

      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(EMAIL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          service: data.get("service"),
          message: data.get("message"),
          site: "https://avenkatesh.vercel.app",
          page: window.location.href,
          _subject: "Project inquiry from " + data.get("name") + " — avenkatesh.vercel.app",
          _template: "table",
          _captcha: "false",
          _replyto: data.get("email"),
          _next: "https://avenkatesh.vercel.app/contact"
        })
      }).then(function (response) {
        return response.json().then(function (payload) {
          var ok = response.ok && String(payload.success) !== "false";
          if (!ok) {
            var failure = new Error(payload.message || "Send failed");
            failure.activation = /activ/i.test(String(payload.message || ""));
            throw failure;
          }
          form.reset();
          if (status) status.textContent = "Message sent. You will get a reply within two business days.";
        });
      }).catch(function (error) {
        if (status) {
          status.textContent = error && error.activation
            ? "Almost ready. Open the activation email in avenkatesh194@gmail.com, confirm the form, then send this message again."
            : "The message could not be sent. Please try again in a moment.";
        }
      }).then(function () {
        if (button) button.disabled = false;
      });
    });

    function validate(input) {
      var value = input.value.trim();
      if (input.required && !value) return "This field is required.";
      if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Enter a valid email address.";
      }
      if (input.name === "message" && value && value.length < 20) {
        return "Please add a little more detail (at least a sentence).";
      }
      return "";
    }
  }
})();
