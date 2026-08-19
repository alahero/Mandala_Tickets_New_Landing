(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var viewer = document.getElementById("hero-spline");
  var revealControl = document.getElementById("reveal-control");
  var status = document.getElementById("hero-status");
  var search = document.querySelector(".party-search");

  if (!hero || !viewer || !revealControl) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var isLocked = false;
  var isRevealed = false;
  var isReleasing = false;
  var revealProgress = 0;
  var revealThreshold = Math.max(600, window.innerHeight * 0.9);
  var continueAfterReveal = false;
  var releaseTimer = 0;
  var loadTimer = 0;
  var readyTimer = 0;
  var touchStartY = 0;

  hero.dataset.splineState = reduceMotion.matches ? "fallback" : "loading";

  function setBodyLock(locked) {
    isLocked = locked;
    document.documentElement.classList.toggle("scroll-locked", locked);
    document.body.style.overflow = locked ? "hidden" : "";
  }

  function lockAtTop() {
    if (reduceMotion.matches || hero.dataset.splineState === "fallback") {
      setBodyLock(false);
      return;
    }

    isRevealed = false;
    isReleasing = false;
    revealProgress = 0;
    revealThreshold = Math.max(600, window.innerHeight * 0.9);
    continueAfterReveal = false;
    hero.style.setProperty("--reveal-progress", "0");
    hero.classList.remove("is-revealing");
    hero.classList.remove("is-revealed");
    revealControl.querySelector("span").textContent = "Scroll to reveal";
    revealControl.disabled = false;
    setBodyLock(true);
  }

  function emitSplineScroll(delta) {
    var event;

    try {
      event = new WheelEvent("wheel", {
        deltaY: delta,
        bubbles: true,
        cancelable: true,
      });
    } catch (error) {
      event = document.createEvent("Event");
      event.initEvent("wheel", true, true);
      event.deltaY = delta;
    }

    window.dispatchEvent(event);
  }

  function completeReveal() {
    if (!isLocked || isReleasing || isRevealed) {
      return;
    }

    isReleasing = true;
    hero.style.setProperty("--reveal-progress", "1");
    hero.classList.remove("is-revealing");
    hero.classList.add("is-revealed");
    revealControl.disabled = true;

    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(function () {
      isRevealed = true;
      isReleasing = false;
      setBodyLock(false);

      if (continueAfterReveal) {
        window.requestAnimationFrame(function () {
          document.getElementById("events-preview").scrollIntoView({
            behavior: reduceMotion.matches ? "auto" : "smooth",
            block: "start",
          });
        });
      }
    }, 1800);
  }

  function advanceReveal(delta) {
    if (!isLocked || isRevealed || isReleasing || delta <= 0) {
      return;
    }

    revealProgress = Math.min(revealThreshold, revealProgress + delta);
    var ratio = revealProgress / revealThreshold;

    hero.style.setProperty("--reveal-progress", String(ratio));
    hero.classList.add("is-revealing");
    revealControl.querySelector("span").textContent =
      "Keep scrolling " + Math.round(ratio * 100) + "%";

    if (revealProgress >= revealThreshold) {
      completeReveal();
    }
  }

  function runAutomaticReveal() {
    if (!isLocked || isRevealed || isReleasing) {
      return;
    }

    continueAfterReveal = true;
    emitSplineScroll(revealThreshold);
  }

  function enableFallback(message) {
    window.clearTimeout(loadTimer);
    window.clearInterval(readyTimer);
    hero.dataset.splineState = "fallback";
    status.textContent = message || "Video fallback active";
    setBodyLock(false);
    revealControl.hidden = true;
  }

  function handleSplineReady() {
    if (hero.dataset.splineState === "ready") {
      return;
    }

    window.clearTimeout(loadTimer);
    window.clearInterval(readyTimer);
    hero.dataset.splineState = "ready";
    status.textContent = "";

    if (window.scrollY <= 2) {
      lockAtTop();
    }
  }

  viewer.addEventListener("load", handleSplineReady, { once: true });
  viewer.addEventListener(
    "error",
    function () {
      enableFallback("The 3D scene could not load");
    },
    { once: true },
  );

  // El visor 1.12 puede terminar de cargar sin emitir un evento load en el host.
  readyTimer = window.setInterval(function () {
    if (viewer._spline && typeof viewer._spline.getAllObjects === "function") {
      handleSplineReady();
    }
  }, 100);

  loadTimer = window.setTimeout(function () {
    if (hero.dataset.splineState !== "ready") {
      enableFallback("The 3D scene timed out");
    }
  }, 15000);

  window.addEventListener(
    "wheel",
    function (event) {
      if (isLocked && event.deltaY > 0) {
        var multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        advanceReveal(event.deltaY * multiplier);
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "touchstart",
    function (event) {
      touchStartY = event.touches[0].clientY;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    function (event) {
      var currentY = event.touches[0].clientY;
      var delta = touchStartY - currentY;

      if (isLocked && delta > 0) {
        advanceReveal(delta * 2.2);
      }

      touchStartY = currentY;
    },
    { passive: true },
  );

  window.addEventListener("keydown", function (event) {
    var advanceKeys = ["ArrowDown", "PageDown", " ", "Enter"];

    if (isLocked && advanceKeys.indexOf(event.key) !== -1) {
      event.preventDefault();
      runAutomaticReveal();
    }
  });

  revealControl.addEventListener("click", function () {
    runAutomaticReveal();
  });

  window.addEventListener(
    "scroll",
    function () {
      if (!isLocked && isRevealed && window.scrollY <= 2) {
        lockAtTop();
      }
    },
    { passive: true },
  );

  reduceMotion.addEventListener("change", function (event) {
    if (event.matches) {
      enableFallback("Reduced motion mode");
    } else {
      window.location.reload();
    }
  });

  if (search) {
    search.addEventListener("submit", function (event) {
      event.preventDefault();
    });
  }

  if (reduceMotion.matches) {
    enableFallback("Reduced motion mode");
  } else {
    setBodyLock(true);
  }
})();
