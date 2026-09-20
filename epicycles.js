// Draws the profile portrait as Fourier series of rotating circles
// (epicycles), tracing the meaningful contours from the photo: the outer
// silhouette, both eyes, the nose, the mouth - real landmarks, smoothed
// into clean periodic curves, each its own closed path.
//
// Per the classic "two epicycle wheels" construction, each contour is
// decomposed into TWO independent real Fourier series - one reconstructing
// its X(t), one its Y(t) - rather than a single complex series. Each shared
// frequency k therefore carries its own (amplitude, phase) pair for X and
// for Y, so the term traces an ellipse in general (a circle only when the
// X/Y amplitudes and phases happen to match); chaining them the usual way
// (each term's center riding the previous one's rim) still sums to the
// exact original curve. All groups share one coordinate frame (the
// silhouette's centroid), so they stay correctly placed relative to each
// other despite animating independently.
//
// images/signal-epicycles.bin holds the decomposition: per group, per term,
// its integer frequency and its (ampX, phaseX, ampY, phaseY) - the real
// math behind the drawing, not a picture of it. This script fetches it,
// then animates every chain live on a canvas.

(function () {
  var canvas = document.getElementById("signal-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var PERIOD_MS = 4200; // one full lap

  fetch("images/signal-epicycles.bin")
    .then(function (res) { return res.arrayBuffer(); })
    .then(boot)
    .catch(function () { /* no data, no canvas - fails quietly */ });

  function boot(buf) {
    var view = new DataView(buf);
    var magic = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
    );
    if (magic !== "EPI4") return;

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
        var ampX = view.getFloat32(offset, true); offset += 4;
        var phaseX = view.getFloat32(offset, true); offset += 4;
        var ampY = view.getFloat32(offset, true); offset += 4;
        var phaseY = view.getFloat32(offset, true); offset += 4;
        terms.push({ freq: freq, ax: ampX, px: phaseX, ay: ampY, py: phaseY });
      }
      terms.sort(function (a, b) {
        return Math.max(Math.abs(b.ax), Math.abs(b.ay)) - Math.max(Math.abs(a.ax), Math.abs(a.ay));
      });
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
      var x = 0, y = 0;
      for (var k = 0; k < terms.length; k++) {
        var term = terms[k];
        x += term.ax * Math.cos(term.freq * t + term.px);
        y += term.ay * Math.cos(term.freq * t + term.py);
      }
      return { x: x, y: y };
    }

    // precompute each group's full closed contour once - exactly periodic,
    // so this is the real, complete curve, always fully visible
    var TRAIL_STEPS = 420;
    var trails = groups.map(function (terms) {
      var path = new Path2D();
      for (var s = 0; s <= TRAIL_STEPS; s++) {
        var tt = (2 * Math.PI * s) / TRAIL_STEPS;
        var p = sumAt(terms, tt);
        var px = originX + p.x * scale;
        var py = originY + p.y * scale;
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
          var rx = Math.abs(term.ax) * scale;
          var ry = Math.abs(term.ay) * scale;
          var ang = term.freq * t;
          var nx = x + term.ax * scale * Math.cos(ang + term.px);
          var ny = y + term.ay * scale * Math.cos(ang + term.py);

          if (rx > 1 || ry > 1) {
            ctx.beginPath();
            ctx.ellipse(x, y, Math.max(rx, 0.5), Math.max(ry, 0.5), 0, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(43,90,160,0.15)";
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = "rgba(43,90,160,0.32)";
          ctx.stroke();

          x = nx; y = ny;
        }

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,40,40,0.9)";
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
