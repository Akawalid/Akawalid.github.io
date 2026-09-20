// Draws the profile portrait as a Fourier series of rotating circles
// (epicycles). The source is the same raster "signal" as the waveform
// version - one continuous sweep across every scanline of the (background
// removed) photo, each row wobbling with its real brightness - flattened
// into a single closed path and decomposed by a discrete Fourier transform.
// Each term is a circle whose center rides the circumference of the
// previous one, spinning at its own constant speed; summed together, the
// last circle's tip retraces that whole signal, not just its outline.
//
// images/signal-epicycles.bin holds that decomposition: for each term, its
// integer frequency (turns per loop), radius (amplitude) and starting phase
// - the real math behind the drawing, not a picture of it. This script
// fetches it, then animates the chain live on a canvas.

(function () {
  var canvas = document.getElementById("signal-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var PERIOD_MS = 3000; // one full lap - faster spin

  fetch("images/signal-epicycles.bin")
    .then(function (res) { return res.arrayBuffer(); })
    .then(boot)
    .catch(function () { /* no data, no canvas - fails quietly */ });

  function boot(buf) {
    var view = new DataView(buf);
    var magic = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
    );
    if (magic !== "EPIC") return;

    var offset = 4;
    var count = view.getUint16(offset, true); offset += 2;
    var halfW = view.getFloat32(offset, true); offset += 4;
    var halfH = view.getFloat32(offset, true); offset += 4;

    var terms = [];
    for (var i = 0; i < count; i++) {
      var freq = view.getInt16(offset, true); offset += 2;
      var amp = view.getFloat32(offset, true); offset += 4;
      var phase = view.getFloat32(offset, true); offset += 4;
      terms.push({ freq: freq, amp: amp, phase: phase });
    }
    // largest circle first, so each next one visibly rides the last
    terms.sort(function (a, b) { return b.amp - a.amp; });

    var PAD = 22;
    var span = 2 * Math.max(halfW, halfH);
    var scale = (460 - PAD * 2) / span;
    var w = Math.round(2 * halfW * scale + PAD * 2);
    var h = Math.round(2 * halfH * scale + PAD * 2);
    canvas.width = w;
    canvas.height = h;
    var originX = w / 2;
    var originY = h / 2;

    // precompute the full closed signal once - it's exactly periodic, so
    // this is the real, complete traced path, always fully visible
    var TRAIL_STEPS = 2600;
    var trail = new Path2D();
    for (var s = 0; s <= TRAIL_STEPS; s++) {
      var tt = (2 * Math.PI * s) / TRAIL_STEPS;
      var p = sumAt(terms, tt);
      var px = originX + p.re * scale;
      var py = originY - p.im * scale;
      if (s === 0) trail.moveTo(px, py); else trail.lineTo(px, py);
    }

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

    var start = performance.now();

    function frame(now) {
      var t = ((now - start) % PERIOD_MS) / PERIOD_MS * 2 * Math.PI;

      ctx.clearRect(0, 0, w, h);

      // the finished outline - always fully drawn
      ctx.strokeStyle = "rgba(20,20,20,0.92)";
      ctx.lineWidth = 1.6;
      ctx.stroke(trail);

      // the rotating chain of circles, tracing it live
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
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,40,40,0.9)";
      ctx.fill();

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
