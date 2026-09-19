// Draws the profile portrait live, from its actual signal data - not a picture.
//
// images/signal-matrix.bin holds the real luminance samples pulled from the
// source photo: one scanline per row, each row storing its raw 0-255
// brightness values across the full frame. This script fetches that data,
// turns each row back into a waveform trace - the same way Cheese's
// "Waveform" effect (GStreamer's revtv) draws a video signal as a scope
// readout - and paints it to a canvas. What's on the page is the underlying
// matrix itself, rendered, not a rendering of it baked into an image file.

(function () {
  var canvas = document.getElementById("signal-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var AMP = 9; // px, vertical deflection of the trace per brightness sample
  var STROKE = "rgba(20,20,20,0.9)"; // black traces, transparent background

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

    var start = performance.now();

    function frame(t) {
      var elapsed = (t - start) / 1000;

      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = STROKE;
      ctx.lineWidth = 1;
      rows.forEach(function (row) {
        var wobble = Math.sin(elapsed * 1.1 + row.seed) * 0.35;
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
