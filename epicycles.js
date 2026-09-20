// Draws the profile portrait as Fourier series of rotating circles
// (epicycles). Rather than one full raster signal, this traces just the
// meaningful contours from the (background-removed) photo - the outer
// silhouette, both eyes, the mouth - each its own closed path, each
// decomposed independently by a discrete Fourier transform. Every term is
// a circle whose center rides the circumference of the previous one,
// spinning at its own constant speed; summed together, a group's last
// circle retraces that one contour. All groups share one coordinate frame
// (the silhouette's centroid), so despite animating independently they
// stay correctly placed relative to each other.
//
// images/signal-epicycles.bin holds the decomposition: per group, its
// terms as (integer frequency, radius, starting phase) - the real math
// behind the drawing, not a picture of it. This script fetches it, then
// animates every chain live on a canvas.

(function () {
  var canvas = document.getElementById("signal-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var PERIOD_MS = 3000; // one full lap

  fetch("images/signal-epicycles.bin")
    .then(function (res) { return res.arrayBuffer(); })
    .then(boot)
    .catch(function () { /* no data, no canvas - fails quietly */ });

  function boot(buf) {
    var view = new DataView(buf);
    var magic = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
    );
    if (magic !== "EPI2") return;

    var offset = 4;
    var halfW = view.getFloat32(offset, true); offset += 4;
    var halfH = view.getFloat32(offset, true); offset += 4;
    var groupCount = view.getUint8(offset); offset += 1;

    var groups = [];
    for (var g = 0; g < groupCount; g++) {
      var count = view.getUint16(offset, true); offset += 2;
      var terms = [];
      for (var i = 0; i < count; i++) {
        var freq = view.getInt16(offset, true); offset += 2;
        var amp = view.getFloat32(offset, true); offset += 4;
        var phase = view.getFloat32(offset, true); offset += 4;
        terms.push({ freq: freq, amp: amp, phase: phase });
      }
      terms.sort(function (a, b) { return b.amp - a.amp; });
      groups.push(terms);
    }

    var PAD = 22;
    var span = 2 * Math.max(halfW, halfH);
    var scale = (460 - PAD * 2) / span;
    var w = Math.round(2 * halfW * scale + PAD * 2);
    var h = Math.round(2 * halfH * scale + PAD * 2);
    canvas.width = w;
    canvas.height = h;
    var originX = w / 2;
    var originY = h / 2;

    function sumAt(terms, t) {
      var re = 0, im = 0;
      for (var k = 0; k < terms.length; k++) {
        var term = terms[k];
        var ang = term.freq * t + term.phase;
        re += term.amp * Math.cos(ang);
        im += term.amp * Math.sin(ang);
      }
      return { re: re, im: im };
    }

    // precompute each group's full closed path once - exactly periodic,
    // so this is the real, complete contour, always fully visible
    var TRAIL_STEPS = 500;
    var trails = groups.map(function (terms) {
      var path = new Path2D();
      for (var s = 0; s <= TRAIL_STEPS; s++) {
        var tt = (2 * Math.PI * s) / TRAIL_STEPS;
        var p = sumAt(terms, tt);
        var px = originX + p.re * scale;
        var py = originY - p.im * scale;
        if (s === 0) path.moveTo(px, py); else path.lineTo(px, py);
      }
      return path;
    });

    var start = performance.now();

    function frame(now) {
      var t = ((now - start) % PERIOD_MS) / PERIOD_MS * 2 * Math.PI;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(20,20,20,0.92)";
      ctx.lineWidth = 1.4;
      trails.forEach(function (path) { ctx.stroke(path); });

      groups.forEach(function (terms) {
        var x = originX, y = originY;
        ctx.lineWidth = 1;
        for (var k = 0; k < terms.length; k++) {
          var term = terms[k];
          var r = term.amp * scale;
          var ang = term.freq * t + term.phase;
          var nx = x + r * Math.cos(ang);
          var ny = y - r * Math.sin(ang);

          if (r > 1) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(43,90,160,0.16)";
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = "rgba(43,90,160,0.35)";
          ctx.stroke();

          x = nx; y = ny;
        }

        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,40,40,0.9)";
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
