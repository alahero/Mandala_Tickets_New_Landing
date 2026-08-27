/* Maquinas de estado del wordmark: reposo, hover (1-2) y click (2-3). */
(function () {
  "use strict";

  var PATH = "assets/lottie/logo.json?v=color-1";
  var machines = [];

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function markerTime(marker) {
    if (!marker) {
      return null;
    }
    if (typeof marker.time === "number") {
      return marker.time;
    }
    if (typeof marker.tm === "number") {
      return marker.tm;
    }
    return null;
  }

  function readPoints(anim) {
    var points = { rest: 0, hover: 60, click: 244 };
    var markers = anim.markers || [];
    var i;
    var marker;
    var name;
    var time;

    for (i = 0; i < markers.length; i += 1) {
      marker = markers[i];
      time = markerTime(marker);
      if (time === null) {
        continue;
      }
      name = (marker.payload && marker.payload.name) || marker.cm || "";
      if (name === "rest" || name === "hover" || name === "click") {
        points[name] = time;
      }
    }

    if (!points.rest && !points.hover && markers.length >= 3) {
      points.rest = markerTime(markers[0]) || 0;
      points.hover = markerTime(markers[1]) || 60;
      points.click = markerTime(markers[2]) || 244;
    }

    return points;
  }

  function bindMachine(container, anim) {
    var link = container.closest("a") || container;
    var points = readPoints(anim);
    var reduced = prefersReducedMotion();
    var mode = "rest";
    var hovered = false;
    var clickQueued = false;

    function goToRest() {
      mode = "rest";
      clickQueued = false;
      anim.loop = false;
      anim.goToAndStop(points.rest, true);
    }

    function playHoverCycle() {
      mode = "hover";
      anim.loop = false;
      anim.playSegments([points.rest, points.hover], true);
    }

    function playClick() {
      mode = "click";
      clickQueued = false;
      hovered = false;
      anim.loop = false;
      anim.playSegments([points.hover, points.click], true);
    }

    function onSegmentComplete() {
      if (mode === "click") {
        goToRest();
        return;
      }

      if (clickQueued) {
        playClick();
        return;
      }

      if (hovered) {
        playHoverCycle();
        return;
      }

      goToRest();
    }

    anim.addEventListener("complete", onSegmentComplete);

    link.addEventListener("pointerenter", function () {
      if (reduced || mode === "click" || clickQueued) {
        return;
      }
      hovered = true;
      if (mode === "rest") {
        playHoverCycle();
      }
    });

    link.addEventListener("pointerleave", function () {
      hovered = false;
    });

    link.addEventListener("click", function (event) {
      event.preventDefault();

      if (reduced) {
        return;
      }

      if (mode === "click") {
        return;
      }

      if (mode === "hover") {
        clickQueued = true;
        return;
      }

      playClick();
    });

    if (reduced) {
      goToRest();
    } else {
      goToRest();
    }

    return {
      anim: anim,
      points: points,
      getMode: function () {
        return mode;
      },
    };
  }

  function mount(container) {
    if (!container || !window.lottie) {
      return null;
    }

    var anim = window.lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: PATH,
      rendererSettings: {
        /* meet + viewBox recortado: el wordmark cabe entero en 160x30 */
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });

    anim.addEventListener("DOMLoaded", function () {
      var svg = container.querySelector("svg");
      if (svg) {
        /* Franja real del wordmark en el comp 1080x1080 (baseline ~710). */
        svg.setAttribute("viewBox", "30 540 1020 185");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      }
      machines.push(bindMachine(container, anim));
    });

    return anim;
  }

  function init() {
    var nodes = document.querySelectorAll("[data-brand-lottie]");
    var i;

    for (i = 0; i < nodes.length; i += 1) {
      mount(nodes[i]);
    }

    window.MandalaLogo = {
      machines: machines,
      reload: init,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
