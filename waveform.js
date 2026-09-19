// Draws the profile portrait live, from its actual signal data - not a picture.
//
// images/signal-matrix.bin holds the real luminance samples pulled from the
// (background-removed) source photo: one scanline per row, each row storing
// where it starts and its raw 0-255 brightness values. This script fetches
// that data, turns each row back into a waveform trace (the same way an
// oscilloscope / video waveform monitor draws a signal), and paints it to a
// canvas - so what's on the page is the underlying matrix itself, rendered.

(function () {
  var canvas = document.getElementById("signal-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var AMP = 13; // px, vertical deflection of the trace per brightness sample

  fetch("images/signal-matrix.bin")
    .then(function (res) { return res.arrayBuffer(); })
    .then(boot)
    .catch(function () { /* no data, no canvas - fails quietly */ });

  function boot(buf) {
    var view = new DataView(buf);
    var magic = String.fromCharCode(
      view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)
    );
    if (magic !== "WAVF") return;

    var offset = 4;
    var w = view.getUint16(offset, true); offset += 2;
    var h = view.getUint16(offset, true); offset += 2;
    var rowCount = view.getUint16(offset, true); offset += 2;
    var step = view.getUint8(offset); offset += 1;

    var rows = [];
    for (var i = 0; i < rowCount; i++) {
      var x0 = view.getUint16(offset, true); offset += 2;
      var len = view.getUint16(offset, true); offset += 2;
      var values = new Uint8Array(buf, offset, len);
      offset += len;
      if (!len) continue;

      var path = new Path2D();
      for (var j = 0; j < len; j++) {
        var x = x0 + j;
        var y = i * step + (values[j] / 255 - 0.5) * 2 * AMP;
        if (j === 0) path.moveTo(x, y); else path.lineTo(x, y);
      }
      rows.push({ path: path, seed: Math.random() * Math.PI * 2 });
    }

    canvas.width = w;
    canvas.height = h;

    // Pre-render the soft glow layer once (expensive shadowBlur pass) -
    // the live loop below just redraws this plus the crisp core lines, so
    // per-frame cost stays cheap even though the trace itself is real data.
    var glow = document.createElement("canvas");
    glow.width = w;
    glow.height = h;
    var gctx = glow.getContext("2d");
    gctx.shadowColor = "rgba(70,255,150,0.95)";
    gctx.shadowBlur = 7;
    gctx.strokeStyle = "rgba(70,255,150,0.6)";
    gctx.lineWidth = 1;
    rows.forEach(function (row) { gctx.stroke(row.path); });

    var start = performance.now();

    function frame(t) {
      var elapsed = (t - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      ctx.drawImage(glow, 0, Math.sin(elapsed * 0.6) * 0.5);

      ctx.strokeStyle = "rgba(200,255,225,0.92)";
      ctx.lineWidth = 1;
      rows.forEach(function (row) {
        var wobble = Math.sin(elapsed * 1.3 + row.seed) * 0.5;
        ctx.save();
        ctx.translate(0, wobble);
        ctx.stroke(row.path);
        ctx.restore();
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
})();
