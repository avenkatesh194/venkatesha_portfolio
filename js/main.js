(function () {
  var EMAIL = "avenkatesh194@gmail.com";
  var SITE = "https://avenkatesh.vercel.app";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var wide = window.matchMedia("(min-width: 900px)").matches;

  document.documentElement.classList.add("js");

  var boot = document.querySelector("[data-boot]");
  if (boot) {
    window.setTimeout(function () { boot.remove(); }, reduceMotion ? 0 : 900);
  }

  document.querySelectorAll("[data-email]").forEach(function (node) {
    node.textContent = EMAIL;
    if (node.tagName === "A") node.setAttribute("href", "mailto:" + EMAIL);
  });

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var header = document.querySelector("[data-header]");
  var progress = document.querySelector("[data-progress]");
  var topLink = document.querySelector("[data-top]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    var label = toggle.querySelector(".sr-only");
    if (label) label.textContent = "Open menu";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      var label = toggle.querySelector(".sr-only");
      if (label) label.textContent = open ? "Close menu" : "Open menu";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { window.setTimeout(closeNav, 0); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  var sections = ["about", "services", "skills", "experience", "work", "contact"].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  function onScroll() {
    var scrolled = window.scrollY;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-solid", scrolled > 24);
    if (progress) progress.style.transform = "scaleX(" + (height > 0 ? scrolled / height : 0) + ")";
    if (topLink) topLink.hidden = scrolled < 700;
    var line = document.querySelector("[data-line]");
    var track = document.querySelector("[data-track]");
    if (line && track) {
      var rect = track.getBoundingClientRect();
      var seen = Math.min(rect.height, Math.max(0, window.innerHeight * 0.55 - rect.top));
      line.style.transform = "scaleY(" + (rect.height ? seen / rect.height : 0) + ")";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (sections.length && "IntersectionObserver" in window) {
    var currentId = "";
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) currentId = entry.target.id;
      });
      if (!nav) return;
      nav.querySelectorAll("a[href^='#']").forEach(function (link) {
        var active = link.getAttribute("href") === "#" + currentId;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  var reveals = document.querySelectorAll(".reveal");
  function showAll() { reveals.forEach(function (node) { node.classList.add("is-in"); }); }
  if (reduceMotion || !("IntersectionObserver" in window)) showAll();
  else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (node) { revealObserver.observe(node); });
    window.setTimeout(showAll, 2200);
  }

  var role = document.querySelector("[data-role]");
  if (role && !reduceMotion) {
    var roles = ["Senior Software Engineer", "React.js Developer", "React Native Developer", "Node.js Developer"];
    var roleIndex = 0;
    window.setInterval(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      role.textContent = roles[roleIndex];
    }, 2400);
  }

  var skills = document.querySelector("[data-skills]");
  if (skills) {
    var tabs = skills.querySelectorAll("[data-skill]");
    var panels = skills.querySelectorAll("[data-panel]");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var name = tab.getAttribute("data-skill");
        tabs.forEach(function (item) { item.setAttribute("aria-selected", String(item === tab)); });
        panels.forEach(function (panel) {
          var show = panel.getAttribute("data-panel") === name;
          panel.hidden = !show;
          panel.classList.toggle("is-on", show);
        });
      });
    });
  }

  var term = document.querySelector("[data-term-out]");
  if (term) {
    var script = [
      "$ whoami",
      "Venkatesh Arumugam",
      "",
      "$ role",
      "Senior Software Engineer",
      "",
      "$ expertise",
      "React.js | React Native | Node.js | AI",
      "",
      "$ mission",
      "Building useful digital products."
    ].join("\n");
    if (reduceMotion) term.textContent = script;
    else {
      var index = 0;
      var started = false;
      function type() {
        if (index <= script.length) {
          term.textContent = script.slice(0, index);
          index += 1;
          window.setTimeout(type, script.charAt(index - 1) === "\n" ? 40 : 16);
        }
      }
      if ("IntersectionObserver" in window) {
        var termObserver = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting && !started) { started = true; type(); termObserver.disconnect(); }
        }, { threshold: 0.4 });
        termObserver.observe(term);
      } else type();
    }
  }

  var stage = document.querySelector("[data-stage]");
  if (stage && finePointer && !reduceMotion) {
    var floats = stage.querySelectorAll("[data-float]");
    var tx = 0; var ty = 0; var cx = 0; var cy = 0; var frame = 0; var hovering = false;
    function paint() {
      floats.forEach(function (node, i) {
        var depth = (i + 1) * 6;
        node.style.transform = "translate3d(" + (cx * depth) + "px," + (cy * depth) + "px,0)";
      });
    }
    function tick() {
      cx += ((hovering ? tx : 0) - cx) * 0.08;
      cy += ((hovering ? ty : 0) - cy) * 0.08;
      paint();
      if (!hovering && Math.abs(cx) < 0.01 && Math.abs(cy) < 0.01) { frame = 0; return; }
      frame = window.requestAnimationFrame(tick);
    }
    stage.addEventListener("pointermove", function (event) {
      var rect = stage.getBoundingClientRect();
      tx = (event.clientX - rect.left) / rect.width - 0.5;
      ty = (event.clientY - rect.top) / rect.height - 0.5;
      hovering = true;
      if (!frame) frame = window.requestAnimationFrame(tick);
    });
    stage.addEventListener("pointerleave", function () {
      hovering = false;
      if (!frame) frame = window.requestAnimationFrame(tick);
    });
  }

  if (finePointer && !reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width - 0.5;
        var y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + (-y * 4) + "deg) rotateY(" + (x * 5) + "deg)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
    document.querySelectorAll("[data-magnetic]").forEach(function (node) {
      node.addEventListener("pointermove", function (event) {
        var rect = node.getBoundingClientRect();
        var x = event.clientX - (rect.left + rect.width / 2);
        var y = event.clientY - (rect.top + rect.height / 2);
        node.style.transform = "translate(" + (x * 0.18) + "px," + (y * 0.25) + "px)";
      });
      node.addEventListener("pointerleave", function () { node.style.transform = ""; });
    });
  }

  var canvas = document.querySelector("[data-field]");
  if (canvas && finePointer && wide && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var points = [];
    var mouse = { x: -9999, y: -9999 };
    var running = false;
    var raf = 0;
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      var count = rect.width < 800 ? 22 : 42;
      for (var i = 0; i < count; i += 1) {
        points.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32
        });
      }
    }
    function draw() {
      if (!running) return;
      var width = canvas.clientWidth;
      var height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < points.length; i += 1) {
        var point = points[i];
        var dx = mouse.x - point.x;
        var dy = mouse.y - point.y;
        var dist = Math.hypot(dx, dy);
        if (dist < 130) { point.x -= dx * 0.012; point.y -= dy * 0.012; }
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
        ctx.fillStyle = "rgba(126,231,255,0.75)";
        ctx.fillRect(point.x, point.y, 1.6, 1.6);
        for (var j = i + 1; j < points.length; j += 1) {
          var other = points[j];
          var gap = Math.hypot(point.x - other.x, point.y - other.y);
          if (gap < 110) {
            ctx.strokeStyle = "rgba(126,231,255," + ((1 - gap / 110) * 0.22) + ")";
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }
      raf = window.requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement.addEventListener("pointermove", function (event) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    if ("IntersectionObserver" in window) {
      var fieldObserver = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting && !document.hidden;
        if (running && !raf) raf = window.requestAnimationFrame(draw);
        if (!running) { window.cancelAnimationFrame(raf); raf = 0; }
      });
      fieldObserver.observe(canvas);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { running = false; window.cancelAnimationFrame(raf); raf = 0; }
    });
  }

  var cursor = document.querySelector("[data-cursor]");
  if (cursor && finePointer && wide && !reduceMotion) {
    document.documentElement.classList.add("has-cursor");
    cursor.hidden = false;
    var dot = cursor.querySelector(".cursor-dot");
    var ring = cursor.querySelector(".cursor-ring");
    var label = cursor.querySelector("[data-cursor-label]");
    var px = 0; var py = 0; var rx = 0; var ry = 0; var cursorFrame = 0;
    function moveCursor() {
      rx += (px - rx) * 0.18;
      ry += (py - ry) * 0.18;
      dot.style.left = px + "px";
      dot.style.top = py + "px";
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      cursorFrame = window.requestAnimationFrame(moveCursor);
    }
    window.addEventListener("pointermove", function (event) {
      px = event.clientX;
      py = event.clientY;
      if (!cursorFrame) cursorFrame = window.requestAnimationFrame(moveCursor);
      var target = event.target.closest("[data-cursor], a, button");
      var name = target && target.getAttribute("data-cursor");
      cursor.classList.toggle("is-hot", Boolean(target));
      label.textContent = name || "";
    }, { passive: true });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
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
      if (form.elements._honey && form.elements._honey.value) return;
      var data = new FormData(form);
      var button = form.querySelector("[type='submit']");
      if (button) button.disabled = true;
      if (status) status.textContent = "Sending your message…";
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(EMAIL), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          service: data.get("service"),
          message: data.get("message"),
          site: SITE,
          page: window.location.href,
          _subject: "Project inquiry from " + data.get("name") + " — avenkatesh.vercel.app",
          _template: "table",
          _captcha: "false",
          _replyto: data.get("email"),
          _honey: data.get("_honey") || ""
        })
      }).then(function (response) {
        return response.json().then(function (payload) {
          if (!(response.ok && String(payload.success) !== "false")) {
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
      }).then(function () { if (button) button.disabled = false; });
    });
  }

  function validate(input) {
    var value = input.value.trim();
    if (input.required && !value) return "This field is required.";
    if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    if (input.name === "message" && value && value.length < 20) return "Please add a little more detail (at least a sentence).";
    return "";
  }
})();
