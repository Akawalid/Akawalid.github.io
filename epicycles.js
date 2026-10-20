// Draws the profile portrait as a Fourier series of rotating circles
// (epicycles): the silhouette's outline is one closed path, decomposed by a
// discrete Fourier transform into circular terms - each term a circle whose
// center rides on the circumference of the previous one, spinning at its
// own constant speed. Summed together, the last circle's tip traces the
// original outline.
//
// images/signal-epicycles.bin holds that decomposition: for each term, its
// integer frequency (how many turns per loop), radius (amplitude) and
// starting phase - the real math behind the drawing, not a picture of it.
//
// Inside that FFT-drawn contour, images/signal-waveform.bin adds the actual
// analog signal: real per-scanline brightness samples from the same photo,
// each row redrawn as a wavy trace (same idea as an oscilloscope / video
// waveform monitor). It shares the outline's exact center point, so it sits
// correctly inside it rather than needing to be clipped.

(function () {
  var canvas = document.getElementById("signal-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  // colours come from the stylesheet's palette (--ink-rgb / --accent-rgb),
  // re-read whenever the light / dark theme changes
  var INK, ACCENT;
  function readColors() {
    var rootStyle = getComputedStyle(document.documentElement);
    INK = rootStyle.getPropertyValue("--ink-rgb").trim() || "231, 229, 225";
    ACCENT = rootStyle.getPropertyValue("--accent-rgb").trim() || "255, 123, 71";
  }
  readColors();
  window.addEventListener("themechange", readColors);
  function rgba(rgb, alpha) { return "rgba(" + rgb + "," + alpha + ")"; }

  var PERIOD_MS = 9000; // one full lap of the outline
  var WAVE_AMP = 20; // px (native image space), vertical deflection per sample

  var geometry = null;   // { originX, originY, scale } - set once EPIC loads
  var waveRows = null;   // interior signal Path2D list, built once both are ready
  var waveCxCy = null;

  Promise.all([
    fetch("images/signal-epicycles.bin").then(function (res) { return res.arrayBuffer(); }),
    fetch("images/signal-waveform.bin").then(function (res) { return res.arrayBuffer(); }).catch(function () { return null; })
  ]).then(function (results) {
    bootContour(results[0]);
    if (results[1]) bootWaveform(results[1]);
  }).catch(function () { /* no data, no canvas - fails quietly */ });

  var terms, trail, w, h, originX, originY, scale;

  function bootContour(buf) {
    var view = new DataView(buf);
    var magic = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
    );
    if (magic !== "EPIC") return;

    var offset = 4;
    var count = view.getUint16(offset, true); offset += 2;
    offset += 8; // stored half width / height - the traced outline's own box is used instead

    terms = [];
    for (var i = 0; i < count; i++) {
      var freq = view.getInt16(offset, true); offset += 2;
      var amp = view.getFloat32(offset, true); offset += 4;
      var phase = view.getFloat32(offset, true); offset += 4;
      terms.push({ freq: freq, amp: amp, phase: phase });
    }
    // largest circle first, so each next one visibly rides the last
    terms.sort(function (a, b) { return b.amp - a.amp; });

    // sample the full closed outline once - it's exactly periodic, so this
    // is the real, complete traced path - and fit the canvas to its box
    var TRAIL_STEPS = 500;
    var pts = [];
    var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (var s = 0; s <= TRAIL_STEPS; s++) {
      var p = sumAt(terms, (2 * Math.PI * s) / TRAIL_STEPS);
      pts.push(p);
      minX = Math.min(minX, p.re); maxX = Math.max(maxX, p.re);
      minY = Math.min(minY, -p.im); maxY = Math.max(maxY, -p.im);
    }

    var PAD = 22;
    scale = (460 - PAD * 2) / Math.max(maxX - minX, maxY - minY);
    w = Math.round((maxX - minX) * scale + PAD * 2);
    h = Math.round((maxY - minY) * scale + PAD * 2);
    canvas.width = w;
    canvas.height = h;
    originX = PAD - minX * scale;
    originY = PAD - minY * scale;
    geometry = { originX: originX, originY: originY, scale: scale };

    trail = new Path2D();
    pts.forEach(function (p, k) {
      var px = originX + p.re * scale;
      var py = originY - p.im * scale;
      if (k === 0) trail.moveTo(px, py); else trail.lineTo(px, py);
    });

    requestAnimationFrame(frame);
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

  function bootWaveform(buf) {
    var view = new DataView(buf);
    var magic = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
    );
    if (magic !== "WAV3" || !geometry) return;

    var offset = 4;
    var cx = view.getFloat32(offset, true); offset += 4;
    var cy = view.getFloat32(offset, true); offset += 4;
    var rowCount = view.getUint16(offset, true); offset += 2;
    var step = view.getUint8(offset); offset += 1;
    waveCxCy = { cx: cx, cy: cy };

    var rows = [];
    for (var i = 0; i < rowCount; i++) {
      var x0 = view.getUint16(offset, true); offset += 2;
      var len = view.getUint16(offset, true); offset += 2;
      var values = new Uint8Array(buf, offset, len);
      offset += len;
      if (!len) continue;

      var path = new Path2D();
      for (var j = 0; j < len; j++) {
        var px = x0 + j;
        var py = i * step + (values[j] / 255 - 0.5) * 2 * WAVE_AMP;
        var cxOut = geometry.originX + (px - cx) * geometry.scale;
        var cyOut = geometry.originY + (py - cy) * geometry.scale;
        if (j === 0) path.moveTo(cxOut, cyOut); else path.lineTo(cxOut, cyOut);
      }
      rows.push({ path: path, seed: Math.random() * Math.PI * 2 });
    }
    waveRows = rows;
  }

  var start = performance.now();

  function frame(now) {
    var elapsed = (now - start) / 1000;
    var t = ((now - start) % PERIOD_MS) / PERIOD_MS * 2 * Math.PI;

    ctx.clearRect(0, 0, w, h);

    // the analog signal, live inside the contour
    if (waveRows) {
      ctx.strokeStyle = rgba(INK, 0.42);
      ctx.lineWidth = 1;
      waveRows.forEach(function (row) {
        var wobble = Math.sin(elapsed * 1.1 + row.seed) * (0.35 * scale);
        ctx.save();
        ctx.translate(0, wobble);
        ctx.stroke(row.path);
        ctx.restore();
      });
    }

    // the finished outline - always fully drawn
    ctx.strokeStyle = rgba(INK, 0.9);
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
        ctx.strokeStyle = rgba(ACCENT, 0.28);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = rgba(ACCENT, 0.6);
      ctx.stroke();

      x = nx; y = ny;
    }

    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = rgba(ACCENT, 1);
    ctx.fill();

    requestAnimationFrame(frame);
  }
})();
