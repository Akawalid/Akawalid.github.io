// Interactive demos shown on some project pages. Each demo mounts its own
// small UI into the box project.js gives it, reads its colours from the
// stylesheet (so it follows the light / dark theme) and stops animating
// once its canvas leaves the page.
//
//   kserver    - the k-server algorithms from the project, ported 1:1 from
//                its Python code, serving clicks or real test instances
//   diffusion  - DDPM's forward process on a digit you draw, next to the
//                trained model's own reverse-process outputs
//   catenary   - the power-line cable from the geographical simulation,
//                solved by Newton-Raphson while you drag the pylons
//   growth     - a small network that grows while it trains, its new neurons
//                computed the way Gromo computes them

(function () {
  var demos = {};

  // ---------------------------------------------------------------- helpers

  function lang() { return window.siteLang ? window.siteLang.getLang() : "en"; }
  // untranslated strings: Kabyle pages use French, Arabic pages English
  var FALLBACK = { kab: "fr", ar: "en" };
  function tr(strings) { return strings[lang()] || strings[FALLBACK[lang()]] || strings.en; }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function colors() {
    var s = getComputedStyle(document.documentElement);
    function v(name) { return s.getPropertyValue(name).trim(); }
    return {
      text: v("--text"), text2: v("--text-2"), muted: v("--muted"), border: v("--border"),
      accent: v("--accent"), bg: v("--bg"), panel: v("--code-bg"),
      ink: v("--ink-rgb"), accentRgb: v("--accent-rgb")
    };
  }
  function rgba(rgb, a) { return "rgba(" + rgb + "," + a + ")"; }
  function rgbList(rgb) { return rgb.split(",").map(function (v) { return parseFloat(v); }); }

  // size a canvas for its CSS width and the screen's pixel density
  function fitCanvas(canvas, cssWidth, cssHeight) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // keep receiving moves while dragging outside the canvas (not available everywhere)
  function capture(node, ev) {
    try { node.setPointerCapture(ev.pointerId); } catch (e) { /* drag still works inside the canvas */ }
  }

  function button(label, onClick, className) {
    var b = el("button", className || "", label);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }

  function select(options, value, onChange) {
    var s = el("select");
    options.forEach(function (o) {
      var opt = el("option", "", o[1]);
      opt.value = o[0];
      if (o[0] === value) opt.selected = true;
      s.appendChild(opt);
    });
    s.addEventListener("change", function () { onChange(s.value); });
    return s;
  }

  function labelled(text, control) {
    var l = el("label");
    l.appendChild(el("span", "", text));
    l.appendChild(control);
    return l;
  }

  // redraw on theme change and on resize, until the demo is removed
  function keepFresh(root, redraw) {
    function onChange() {
      if (!root.isConnected) {
        window.removeEventListener("themechange", onChange);
        window.removeEventListener("resize", onChange);
        return;
      }
      redraw();
    }
    window.addEventListener("themechange", onChange);
    window.addEventListener("resize", onChange);
  }

  // ================================================================ k-server

  var INSTANCES = {
    "N200_OPT221": { opt: 221, k: 5, sites: [[13,36],[7,51],[70,58],[97,94],[70,47],[37,79],[37,87],[15,76],[51,71],[33,11],[17,17],[60,91],[12,84],[5,1],[36,27]], requests: [10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14,6,10,14] },
    "N200_OPT5166": { opt: 5166, k: 5, sites: [[54,77],[17,94],[84,74],[92,90],[21,62],[11,85],[40,59],[62,20],[9,65],[8,25],[51,35],[92,87],[31,84],[84,8],[8,54]], requests: [5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2,1,3,12,13,14,4,7,0,10,6,5,11,9,8,2] },
    "N400_OPT398": { opt: 398, k: 10, sites: [[1,17],[48,87],[72,7],[61,85],[29,93],[93,77],[42,32],[77,72],[62,53],[13,52],[35,94],[84,44],[88,99],[53,62],[22,77],[70,54],[66,60],[39,38],[74,77],[60,64],[75,39],[61,38],[64,40],[8,25],[25,66]], requests: [5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5,14,10,5] }
  };

  function manhattan(p, q) { return Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]); }

  // from p, move by Manhattan distance d toward q (utilities.move_toward)
  function moveToward(p, q, d) {
    var m = manhattan(p, q);
    if (d >= m) return q;
    var dx = Math.min(d, Math.abs(q[0] - p[0]));
    var dy = Math.min(d - dx, Math.abs(q[1] - p[1]));
    return [p[0] + (q[0] >= p[0] ? 1 : -1) * dx, p[1] + (q[1] >= p[1] ? 1 : -1) * dy];
  }

  // balance score: distance + alpha * distance already travelled
  function balanceChoice(st, dists, alpha) {
    var best = 0, bestScore = dists[0] + alpha * st.total[0];
    for (var j = 1; j < dists.length; j++) {
      var score = dists[j] + alpha * st.total[j];
      if (score < bestScore) { bestScore = score; best = j; }
    }
    st.total[best] += dists[best];
    return best;
  }

  // each step(st, site, siteKey) returns the moves [[server, newPos], ...] and their cost
  var ALGOS = {
    greedy: {
      name: { en: "Greedy", fr: "Glouton", ar: "الخوارزمية الجشعة" },
      step: function (st, site) {
        var best = 0, bestD = manhattan(st.servers[0], site);
        for (var j = 1; j < st.servers.length; j++) {
          var d = manhattan(st.servers[j], site);
          if (d < bestD) { bestD = d; best = j; }
        }
        return { moves: [[best, site]], cost: bestD };
      }
    },
    balance: {
      name: { en: "Balance (α = 0.5)", fr: "Balance (α = 0,5)", ar: "Balance (α = 0.5)" },
      step: function (st, site) {
        var dists = st.servers.map(function (s) { return manhattan(s, site); });
        var j = balanceChoice(st, dists, 0.5);
        return { moves: [[j, site]], cost: dists[j] };
      }
    },
    decay: {
      name: { en: "Balance, time decay", fr: "Balance, décroissance", ar: "Balance، تناقص زمني" },
      step: function (st, site) {
        var alpha = 0.55 * Math.pow(0.9988, st.t);
        st.t += 1;
        var dists = st.servers.map(function (s) { return manhattan(s, site); });
        var j = balanceChoice(st, dists, alpha);
        return { moves: [[j, site]], cost: dists[j] };
      }
    },
    reuse: {
      name: { en: "Balance, reuse zero", fr: "Balance, réutilisation", ar: "Balance، إعادة الاستخدام بلا كلفة" },
      step: function (st, site, key) {
        var t = st.t;
        st.t += 1;
        var dists = st.servers.map(function (s) { return manhattan(s, site); });
        if (Math.min.apply(null, dists) === 0) {
          var last = st.lastFor[key];
          if (last !== undefined && dists[last] === 0) return { moves: [[last, site]], cost: 0 };
          for (var z = 0; z < dists.length; z++) {
            if (dists[z] === 0) { st.lastFor[key] = z; return { moves: [[z, site]], cost: 0 }; }
          }
        }
        var j = balanceChoice(st, dists, 0.55 * Math.pow(0.999, t));
        st.lastFor[key] = j;
        return { moves: [[j, site]], cost: dists[j] };
      }
    },
    dc: {
      name: { en: "Double Coverage", fr: "Double Coverage", ar: "Double Coverage" },
      step: function (st, site) {
        var order = st.servers.map(function (s, j) { return [manhattan(s, site), j]; });
        order.sort(function (a, b) { return a[0] - b[0]; });
        var d1 = order[0][0], j1 = order[0][1], j2 = order[1][1];
        return { moves: [[j1, site], [j2, moveToward(st.servers[j2], site, d1)]], cost: 2 * d1 };
      }
    },
    harmonic: {
      name: { en: "Harmonic (randomized)", fr: "Harmonic (randomisé)", ar: "Harmonic (عشوائية)" },
      step: function (st, site) {
        var dists = st.servers.map(function (s) { return manhattan(s, site); });
        var zero = [];
        dists.forEach(function (d, j) { if (d === 0) zero.push(j); });
        if (zero.length) return { moves: [[zero[Math.floor(Math.random() * zero.length)], site]], cost: 0 };
        var weights = dists.map(function (d) { return 1 / d; });
        var total = weights.reduce(function (a, b) { return a + b; }, 0);
        var r = Math.random() * total, acc = 0, pick = dists.length - 1;
        for (var j = 0; j < weights.length; j++) {
          acc += weights[j];
          if (r <= acc) { pick = j; break; }
        }
        return { moves: [[pick, site]], cost: dists[pick] };
      }
    }
  };

  function newState(k) {
    var servers = [];
    for (var i = 0; i < k; i++) servers.push([0, 0]);
    return { servers: servers, total: servers.map(function () { return 0; }), t: 0, lastFor: {}, cost: 0 };
  }

  function applyStep(algo, st, site, key) {
    var res = ALGOS[algo].step(st, site, key);
    res.moves.forEach(function (m) { st.servers[m[0]] = m[1]; });
    st.cost += res.cost;
    return res;
  }

  // run a whole instance without drawing (used to check the port against the project's results)
  function runInstance(algo, name) {
    var inst = INSTANCES[name], st = newState(inst.k);
    inst.requests.forEach(function (r) { applyStep(algo, st, inst.sites[r], r); });
    return st.cost;
  }

  demos.kserver = {
    run: runInstance,
    mount: function (box) {
      var S = {
        hint: { en: "Click or tap a grid to send a request: both algorithms serve it at once, starting with every server at (0, 0).", fr: "Cliquez ou touchez une grille pour envoyer une requête : les deux algorithmes la servent en même temps, tous les serveurs partant de (0, 0).", ar: "انقر أو المس إحدى الشبكتين لإرسال طلب: تخدمه الخوارزميتان في الوقت نفسه، وتنطلق كل الخوادم من (0, 0)." },
        scenario: { en: "Scenario", fr: "Scénario", ar: "السيناريو" },
        free: { en: "Free play — click the grid", fr: "Libre — cliquez sur la grille", ar: "لعب حرّ — انقر على الشبكة" },
        instance: { en: "Test instance", fr: "Instance de test", ar: "مثال اختبار" },
        servers: { en: "Servers", fr: "Serveurs", ar: "الخوادم" },
        play: { en: "Play", fr: "Lancer", ar: "تشغيل" }, pause: { en: "Pause", fr: "Pause", ar: "إيقاف مؤقت" },
        reset: { en: "Reset", fr: "Réinitialiser", ar: "إعادة الضبط" }, random: { en: "Random request", fr: "Requête au hasard", ar: "طلب عشوائي" },
        speed: { en: "Speed", fr: "Vitesse", ar: "السرعة" },
        cost: { en: "cost", fr: "coût", ar: "الكلفة" }, request: { en: "request", fr: "requête", ar: "الطلب" },
        ratio: { en: "ratio", fr: "ratio", ar: "النسبة" }
      };
      var algoOptions = Object.keys(ALGOS).map(function (k) { return [k, tr(ALGOS[k].name)]; });
      var scenarioOptions = [["free", tr(S.free)]].concat(Object.keys(INSTANCES).map(function (n) {
        return [n, tr(S.instance) + " " + n.replace("_OPT", " · OPT ")];
      }));

      var state = { scenario: "free", k: 3, algos: ["greedy", "reuse"], step: 0, playing: false, speed: 4, timer: null };
      var sides = [];

      var controls = el("div", "demo-controls");
      var scenarioSel = select(scenarioOptions, "free", function (v) { state.scenario = v; reset(); });
      controls.appendChild(labelled(tr(S.scenario), scenarioSel));
      var kSel = select([["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]], "3", function (v) { state.k = +v; reset(); });
      var kLabel = labelled(tr(S.servers), kSel);
      controls.appendChild(kLabel);
      var speedSel = select([["1", "1×"], ["4", "4×"], ["16", "16×"]], "4", function (v) { state.speed = +v; if (state.playing) { pause(); play(); } });
      var speedLabel = labelled(tr(S.speed), speedSel);
      controls.appendChild(speedLabel);
      var playBtn = button(tr(S.play), function () { state.playing ? pause() : play(); }, "primary");
      var randomBtn = button(tr(S.random), function () { sendRequest([Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]); });
      controls.appendChild(playBtn);
      controls.appendChild(randomBtn);
      controls.appendChild(button(tr(S.reset), reset));
      box.appendChild(controls);

      var grid = el("div", "demo-canvases");
      [0, 1].forEach(function (i) {
        var panel = el("div", "demo-panel");
        var sel = select(algoOptions, state.algos[i], function (v) { state.algos[i] = v; reset(); });
        panel.appendChild(sel);
        var canvas = el("canvas", "demo-canvas");
        canvas.setAttribute("aria-label", "k-server grid");
        panel.appendChild(canvas);
        var readout = el("p", "demo-readout");
        panel.appendChild(readout);
        grid.appendChild(panel);
        canvas.addEventListener("pointerdown", function (ev) {
          if (state.scenario !== "free") return;
          var r = canvas.getBoundingClientRect(), side = sides[i];
          var x = Math.round((ev.clientX - r.left - side.pad) / side.scale);
          var y = Math.round((side.size - (ev.clientY - r.top) - side.pad) / side.scale);
          if (x < 0 || y < 0 || x > 99 || y > 99) return;
          sendRequest([x, y]);
        });
        sides.push({ canvas: canvas, readout: readout, select: sel, st: null, anim: [], last: null, trail: [] });
      });
      box.appendChild(grid);
      var hint = el("p", "demo-hint", tr(S.hint));
      box.appendChild(hint);

      function instance() { return INSTANCES[state.scenario]; }

      function reset() {
        pause();
        state.step = 0;
        var k = state.scenario === "free" ? state.k : instance().k;
        sides.forEach(function (side) {
          side.st = newState(k);
          side.pos = side.st.servers.map(function (p) { return p.slice(); });
          side.anim = []; side.last = null; side.trail = [];
        });
        var free = state.scenario === "free";
        kLabel.style.display = free ? "" : "none";
        randomBtn.style.display = free ? "" : "none";
        speedLabel.style.display = free ? "none" : "";
        playBtn.style.display = free ? "none" : "";
        hint.style.display = free ? "" : "none";
        draw();
      }

      function sendRequest(site, key) {
        var now = performance.now();
        var duration = state.playing ? Math.min(260, 600 / state.speed) : 320;
        sides.forEach(function (side, i) {
          var before = side.st.servers.map(function (p) { return p.slice(); });
          var res = applyStep(state.algos[i], side.st, site, key === undefined ? site.join(",") : key);
          side.anim = res.moves.map(function (m) {
            return { j: m[0], from: before[m[0]], to: m[1], start: now, duration: duration };
          });
          side.last = site;
          side.trail = res.moves.map(function (m) { return { from: before[m[0]], to: m[1] }; });
        });
        animate();
      }

      function play() {
        if (state.scenario === "free") return;
        if (state.step >= instance().requests.length) reset();
        state.playing = true;
        playBtn.textContent = tr(S.pause);
        var interval = 600 / state.speed;
        state.timer = setInterval(function () {
          if (!box.isConnected) { pause(); return; }
          var inst = instance();
          if (state.step >= inst.requests.length) { pause(); draw(); return; }
          var r = inst.requests[state.step++];
          sendRequest(inst.sites[r], r);
        }, interval);
      }

      function pause() {
        state.playing = false;
        if (state.timer) clearInterval(state.timer);
        state.timer = null;
        playBtn.textContent = tr(S.play);
      }

      var raf = null;
      function animate() {
        if (raf) return;
        raf = requestAnimationFrame(function tick(now) {
          raf = null;
          if (!box.isConnected) return;
          var busy = false;
          sides.forEach(function (side) {
            side.pos = side.st.servers.map(function (p) { return p.slice(); });
            side.anim.forEach(function (a) {
              var u = Math.min(1, (now - a.start) / a.duration);
              if (u < 1) busy = true;
              side.pos[a.j] = lerpManhattan(a.from, a.to, ease(u));
            });
          });
          draw();
          if (busy) raf = requestAnimationFrame(tick);
        });
      }
      function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
      // travel along the Manhattan path: horizontal leg, then vertical leg
      function lerpManhattan(p, q, u) {
        var dx = q[0] - p[0], dy = q[1] - p[1], total = Math.abs(dx) + Math.abs(dy);
        if (!total) return q.slice();
        var d = u * total;
        if (d <= Math.abs(dx)) return [p[0] + Math.sign(dx) * d, p[1]];
        return [q[0], p[1] + Math.sign(dy) * (d - Math.abs(dx))];
      }

      function draw() {
        var c = colors();
        var width = grid.clientWidth;
        var cols = width > 520 ? 2 : 1;
        var size = Math.min(360, Math.floor((width - (cols - 1) * 14) / cols));
        var inst = state.scenario === "free" ? null : instance();
        sides.forEach(function (side, i) {
          var ctx = fitCanvas(side.canvas, size, size);
          side.canvas.style.width = size + "px";
          side.canvas.style.height = size + "px";
          side.size = size; side.pad = 14; side.scale = (size - 2 * side.pad) / 99;
          function X(x) { return side.pad + x * side.scale; }
          function Y(y) { return size - side.pad - y * side.scale; }

          ctx.fillStyle = c.bg;
          ctx.fillRect(0, 0, size, size);
          ctx.strokeStyle = c.border;
          ctx.lineWidth = 1;
          for (var g = 0; g <= 99; g += 11) {
            ctx.beginPath(); ctx.moveTo(X(g), Y(0)); ctx.lineTo(X(g), Y(99)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(X(0), Y(g)); ctx.lineTo(X(99), Y(g)); ctx.stroke();
          }

          if (inst) {
            ctx.strokeStyle = c.muted;
            inst.sites.forEach(function (p) {
              ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 3.5, 0, 2 * Math.PI); ctx.stroke();
            });
          }

          // the last moves, drawn along their Manhattan path
          ctx.strokeStyle = rgba(c.accentRgb, 0.55);
          ctx.lineWidth = 2;
          side.trail.forEach(function (m) {
            ctx.beginPath();
            ctx.moveTo(X(m.from[0]), Y(m.from[1]));
            ctx.lineTo(X(m.to[0]), Y(m.from[1]));
            ctx.lineTo(X(m.to[0]), Y(m.to[1]));
            ctx.stroke();
          });

          if (side.last) {
            ctx.strokeStyle = c.accent;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(X(side.last[0]), Y(side.last[1]), 8, 0, 2 * Math.PI); ctx.stroke();
          }

          ctx.font = "600 9px " + getComputedStyle(document.body).fontFamily;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          (side.pos || side.st.servers).forEach(function (p, j) {
            ctx.fillStyle = c.text;
            ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 7, 0, 2 * Math.PI); ctx.fill();
            ctx.fillStyle = c.bg;
            ctx.fillText(String(j + 1), X(p[0]), Y(p[1]) + 0.5);
          });

          var txt = tr(S.cost) + " " + side.st.cost;
          if (inst) {
            txt = tr(S.request) + " " + state.step + "/" + inst.requests.length + " · " + txt;
            if (state.step === inst.requests.length) {
              txt += " · OPT " + inst.opt + " · " + tr(S.ratio) + " " + (side.st.cost / inst.opt).toFixed(2);
            }
          }
          side.readout.textContent = txt;
        });
      }

      reset();
      keepFresh(box, draw);
    }
  };

  // ================================================================ diffusion

  var DIGITS = [
    "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"
  ];
  var REVERSE_STEPS = [999, 750, 500, 250, 100, 50, 10, 0];

  // linear beta schedule from the paper and the project: 1e-4 to 0.02 over T = 1000
  var T = 1000, ALPHA_BAR = [1];
  (function () {
    var prod = 1;
    for (var t = 1; t <= T; t++) {
      prod *= 1 - (1e-4 + (t - 1) / (T - 1) * (0.02 - 1e-4));
      ALPHA_BAR.push(prod);
    }
  })();

  function gaussian() {
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function decodeDigit(b64) {
    var raw = atob(b64), out = new Float32Array(784);
    for (var i = 0; i < 784; i++) out[i] = raw.charCodeAt(i) / 255;
    return out;
  }

  demos.diffusion = {
    mount: function (box) {
      var S = {
        yours: { en: "Your digit x₀ — draw on it", fr: "Votre chiffre x₀ — dessinez dessus", ar: "رقمك x₀ — ارسم عليه" },
        noised: { en: "Forward process: x_t", fr: "Processus direct : x_t", ar: "العملية الأمامية: x_t" },
        model: { en: "Trained model, reverse process", fr: "Modèle entraîné, processus inverse", ar: "النموذج المدرَّب، العملية العكسية" },
        clear: { en: "Clear", fr: "Effacer", ar: "مسح" }, digit: { en: "Model's digit", fr: "Chiffre du modèle", ar: "رقم من النموذج" },
        noise: { en: "New noise ε", fr: "Nouveau bruit ε", ar: "ضجيج جديد ε" }, sample: { en: "Next sample", fr: "Échantillon suivant", ar: "العيّنة التالية" },
        signal: { en: "signal kept", fr: "signal conservé", ar: "الإشارة المتبقية" },
        nearest: { en: "nearest saved step", fr: "étape enregistrée la plus proche", ar: "أقرب خطوة محفوظة" },
        hint: { en: "The x_t image is computed live in closed form, x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε, with the project's linear β schedule. The last image shows the trained U-Net's actual outputs at the saved timestep closest to t — going the other way, from noise to a digit.", fr: "L'image x_t est calculée en direct par la forme close x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε, avec le calendrier β linéaire du projet. La dernière image montre les vraies sorties du U-Net entraîné au pas de temps enregistré le plus proche de t — dans l'autre sens, du bruit vers un chiffre.", ar: "تُحسب صورة x_t مباشرةً بالصيغة المغلقة x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε، مع جدول β الخطي المستخدم في المشروع. وتعرض الصورة الأخيرة المخرجات الفعلية لشبكة U-Net المدرَّبة عند أقرب خطوة زمنية محفوظة إلى t — في الاتجاه المعاكس، من الضجيج إلى رقم." }
      };
      var state = { t: 250, digit: 0, sample: 0, x0: decodeDigit(DIGITS[0]), eps: null, sprite: null };
      function newNoise() {
        state.eps = new Float32Array(784);
        for (var i = 0; i < 784; i++) state.eps[i] = gaussian();
      }
      newNoise();

      var panels = el("div", "demo-canvases three");
      function panel(title) {
        var p = el("div", "demo-panel");
        p.appendChild(el("p", "demo-label", title));
        var cv = el("canvas", "demo-canvas pixel");
        p.appendChild(cv);
        panels.appendChild(p);
        return cv;
      }
      var drawCv = panel(tr(S.yours)), noisyCv = panel(tr(S.noised)), modelCv = panel(tr(S.model));
      box.appendChild(panels);

      var sliderRow = el("div", "demo-slider");
      var slider = el("input");
      slider.type = "range"; slider.min = "0"; slider.max = "1000"; slider.value = String(state.t);
      slider.dir = "ltr"; // t grows to the right, like the curve below, in every language
      slider.setAttribute("aria-label", "t");
      slider.addEventListener("input", function () { state.t = +slider.value; draw(); });
      sliderRow.appendChild(slider);
      var readout = el("p", "demo-readout");
      sliderRow.appendChild(readout);
      box.appendChild(sliderRow);

      var plot = el("canvas", "demo-plot");
      box.appendChild(plot);

      var controls = el("div", "demo-controls");
      controls.appendChild(button(tr(S.clear), function () { state.x0 = new Float32Array(784); draw(); }));
      controls.appendChild(button(tr(S.digit), function () {
        state.digit = (state.digit + 1) % DIGITS.length;
        state.x0 = decodeDigit(DIGITS[state.digit]); draw();
      }));
      controls.appendChild(button(tr(S.noise), function () { newNoise(); draw(); }));
      controls.appendChild(button(tr(S.sample), function () { state.sample = (state.sample + 1) % 4; draw(); }));
      box.appendChild(controls);
      box.appendChild(el("p", "demo-hint", tr(S.hint)));

      var sprite = new Image();
      sprite.onload = function () { state.sprite = sprite; draw(); };
      sprite.src = "images/demo-ddpm-reverse.png";

      // drawing: a soft round brush on the 28 x 28 grid
      var drawing = false;
      function paint(ev) {
        var r = drawCv.getBoundingClientRect();
        var cx = (ev.clientX - r.left) / r.width * 28, cy = (ev.clientY - r.top) / r.height * 28;
        for (var y = Math.floor(cy - 2); y <= Math.ceil(cy + 2); y++) {
          for (var x = Math.floor(cx - 2); x <= Math.ceil(cx + 2); x++) {
            if (x < 0 || y < 0 || x > 27 || y > 27) continue;
            var d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
            var add = Math.max(0, 1 - d / 1.7);
            state.x0[y * 28 + x] = Math.min(1, state.x0[y * 28 + x] + add);
          }
        }
        draw();
      }
      drawCv.addEventListener("pointerdown", function (ev) { drawing = true; capture(drawCv, ev); paint(ev); });
      drawCv.addEventListener("pointermove", function (ev) { if (drawing) paint(ev); });
      drawCv.addEventListener("pointerup", function () { drawing = false; });
      drawCv.addEventListener("pointercancel", function () { drawing = false; });

      var off = document.createElement("canvas");
      off.width = 28; off.height = 28;
      var offCtx = off.getContext("2d");
      function blit(cv, size, values) {
        var img = offCtx.createImageData(28, 28);
        for (var i = 0; i < 784; i++) {
          var g = Math.max(0, Math.min(255, Math.round(values[i] * 255)));
          img.data[4 * i] = img.data[4 * i + 1] = img.data[4 * i + 2] = g;
          img.data[4 * i + 3] = 255;
        }
        offCtx.putImageData(img, 0, 0);
        var ctx = fitCanvas(cv, size, size);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(off, 0, 0, size, size);
        cv.style.width = size + "px"; cv.style.height = size + "px";
      }

      function nearestStep(t) {
        var best = 0;
        REVERSE_STEPS.forEach(function (s, i) { if (Math.abs(s - t) < Math.abs(REVERSE_STEPS[best] - t)) best = i; });
        return best;
      }

      function draw() {
        var c = colors();
        var width = panels.clientWidth;
        var cols = width > 520 ? 3 : 1;
        var size = Math.min(220, Math.floor((width - (cols - 1) * 14) / cols));

        blit(drawCv, size, state.x0);
        var ab = ALPHA_BAR[state.t], sa = Math.sqrt(ab), sn = Math.sqrt(1 - ab);
        var xt = new Float32Array(784);
        for (var i = 0; i < 784; i++) {
          var x = sa * (2 * state.x0[i] - 1) + sn * state.eps[i];
          xt[i] = (x + 1) / 2;
        }
        blit(noisyCv, size, xt);

        var mctx = fitCanvas(modelCv, size, size);
        modelCv.style.width = size + "px"; modelCv.style.height = size + "px";
        mctx.fillStyle = "#000";
        mctx.fillRect(0, 0, size, size);
        var step = nearestStep(state.t);
        if (state.sprite) {
          mctx.imageSmoothingEnabled = false;
          mctx.drawImage(state.sprite, 28 * step, 28 * state.sample, 28, 28, 0, 0, size, size);
        }

        readout.textContent = "t = " + state.t + " · ᾱ_t = " + ab.toFixed(3) + " · " + tr(S.signal) +
          " √ᾱ_t = " + sa.toFixed(2) + " · " + tr(S.nearest) + ": t = " + REVERSE_STEPS[step];

        // ᾱ_t over the whole schedule, with the current t marked
        var pw = slider.clientWidth || width, ph = 64;
        var pctx = fitCanvas(plot, pw, ph);
        plot.style.width = pw + "px"; plot.style.height = ph + "px";
        pctx.strokeStyle = c.border;
        pctx.lineWidth = 1;
        pctx.beginPath(); pctx.moveTo(0, ph - 6); pctx.lineTo(pw, ph - 6); pctx.stroke();
        pctx.strokeStyle = c.accent;
        pctx.lineWidth = 2;
        pctx.beginPath();
        for (var t = 0; t <= T; t += 5) {
          var px = t / T * pw, py = 6 + (1 - ALPHA_BAR[t]) * (ph - 12);
          if (t === 0) pctx.moveTo(px, py); else pctx.lineTo(px, py);
        }
        pctx.stroke();
        var mx = state.t / T * pw;
        pctx.strokeStyle = c.muted;
        pctx.setLineDash([3, 3]);
        pctx.beginPath(); pctx.moveTo(mx, 0); pctx.lineTo(mx, ph); pctx.stroke();
        pctx.setLineDash([]);
        pctx.fillStyle = c.text;
        pctx.beginPath(); pctx.arc(mx, 6 + (1 - ab) * (ph - 12), 4, 0, 2 * Math.PI); pctx.fill();
        pctx.fillStyle = c.muted;
        pctx.font = "11px " + getComputedStyle(document.body).fontFamily;
        pctx.fillText("ᾱ_t", 4, 16);
      }

      draw();
      keepFresh(box, draw);
    }
  };

  // ================================================================ catenary

  // Solve the hanging cable through (x1, y1) and (x2, y2) with length L:
  // y(x) = a cosh((x - x0) / a) + c. With d = x2 - x1 and h = y2 - y1, the
  // length condition gives sqrt(L^2 - h^2) = 2a sinh(d / 2a), solved for
  // u = d / 2a by Newton-Raphson on sinh(u) - r u = 0; then
  // x0 = (x1 + x2) / 2 - a atanh(h / L) and c follows from the first endpoint.
  function solveCatenary(x1, y1, x2, y2, L) {
    var d = x2 - x1, h = y2 - y1;
    var r = Math.sqrt(L * L - h * h) / d;
    var u = r < 3 ? Math.sqrt(6 * (r - 1)) : Math.log(2 * r) + Math.log(Math.log(2 * r));
    var iterations = 0;
    for (; iterations < 60; iterations++) {
      var f = Math.sinh(u) - r * u, df = Math.cosh(u) - r;
      var next = u - f / df;
      if (!isFinite(next) || next <= 0) next = u / 2;
      var done = Math.abs(next - u) < 1e-12;
      u = next;
      if (done) { iterations++; break; }
    }
    var a = d / (2 * u);
    var x0 = (x1 + x2) / 2 - a * Math.atanh(h / L);
    var c = y1 - a * Math.cosh((x1 - x0) / a);
    return { a: a, x0: x0, c: c, iterations: iterations, y: function (x) { return a * Math.cosh((x - x0) / a) + c; } };
  }

  demos.catenary = {
    solve: solveCatenary,
    mount: function (box) {
      var S = {
        slack: { en: "Cable length (slack over the straight line)", fr: "Longueur du câble (mou par rapport à la ligne droite)", ar: "طول الكابل (الارتخاء مقارنة بالخط المستقيم)" },
        span: { en: "span", fr: "portée", ar: "المسافة" }, rise: { en: "height difference", fr: "dénivelé", ar: "فرق الارتفاع" },
        length: { en: "length", fr: "longueur", ar: "الطول" }, sag: { en: "sag", fr: "flèche", ar: "الترهّل" },
        newton: { en: "Newton-Raphson steps", fr: "itérations de Newton-Raphson", ar: "تكرارات نيوتن-رافسون" },
        hint: { en: "Drag the top of either pylon. The cable is re-solved on every move: the shape depends only on the two attachment points and the length, through a = C / (g · M/L) — the same catenary model as the simulation.", fr: "Faites glisser le sommet d'un pylône. Le câble est recalculé à chaque mouvement : sa forme ne dépend que des deux points d'attache et de sa longueur, via a = C / (g · M/L) — le même modèle de chaînette que la simulation.", ar: "اسحب قمة أيّ من البرجين. يُعاد حساب الكابل مع كل حركة: لا يتوقف شكله إلا على نقطتي التثبيت وطوله، عبر a = C / (g · M/L) — وهو نموذج السلسلة المعلّقة نفسه المستخدم في المحاكاة." }
      };
      // world units are metres; the view shows 220 m by 90 m
      var W = 220, H = 90;
      var state = { p: [[40, 48], [180, 34]], slack: 0.02, drag: -1 };

      var canvas = el("canvas", "demo-canvas wide");
      box.appendChild(canvas);
      var sliderRow = el("div", "demo-slider");
      var lab = el("p", "demo-label", tr(S.slack));
      sliderRow.appendChild(lab);
      var slider = el("input");
      slider.type = "range"; slider.min = "0.2"; slider.max = "25"; slider.step = "0.1"; slider.value = "2";
      slider.dir = "ltr";
      slider.setAttribute("aria-label", tr(S.slack));
      slider.addEventListener("input", function () { state.slack = +slider.value / 100; draw(); });
      sliderRow.appendChild(slider);
      var readout = el("p", "demo-readout");
      sliderRow.appendChild(readout);
      box.appendChild(sliderRow);
      box.appendChild(el("p", "demo-hint", tr(S.hint)));

      var view = { w: 0, h: 0, s: 1 };
      function X(x) { return x * view.s; }
      function Y(y) { return view.h - y * view.s; }

      function pick(ev) {
        var r = canvas.getBoundingClientRect();
        return [(ev.clientX - r.left) / view.s, (view.h - (ev.clientY - r.top)) / view.s];
      }
      canvas.addEventListener("pointerdown", function (ev) {
        var q = pick(ev), best = -1, bestD = 14 / view.s;
        state.p.forEach(function (p, i) {
          var d = Math.hypot(p[0] - q[0], p[1] - q[1]);
          if (d < bestD) { bestD = d; best = i; }
        });
        if (best < 0) return;
        state.drag = best;
        capture(canvas, ev);
      });
      canvas.addEventListener("pointermove", function (ev) {
        var q = pick(ev);
        if (state.drag < 0) {
          var near = state.p.some(function (p) { return Math.hypot(p[0] - q[0], p[1] - q[1]) < 14 / view.s; });
          canvas.style.cursor = near ? "grab" : "default";
          return;
        }
        var i = state.drag, other = state.p[1 - i];
        var x = Math.max(8, Math.min(W - 8, q[0]));
        x = i === 0 ? Math.min(x, other[0] - 30) : Math.max(x, other[0] + 30);
        state.p[i] = [x, Math.max(14, Math.min(H - 8, q[1]))];
        draw();
      });
      function release() { state.drag = -1; }
      canvas.addEventListener("pointerup", release);
      canvas.addEventListener("pointercancel", release);

      function pylon(ctx, p, c) {
        var x = p[0], top = p[1], base = 9 + top * 0.12;
        ctx.strokeStyle = c.text2;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(X(x - base / 2), Y(0)); ctx.lineTo(X(x - 1.5), Y(top));
        ctx.moveTo(X(x + base / 2), Y(0)); ctx.lineTo(X(x + 1.5), Y(top));
        // lattice bracing
        var n = Math.max(3, Math.round(top / 8));
        for (var k = 0; k < n; k++) {
          var y0 = top * k / n, y1 = top * (k + 1) / n;
          var w0 = base / 2 - (base / 2 - 1.5) * k / n, w1 = base / 2 - (base / 2 - 1.5) * (k + 1) / n;
          ctx.moveTo(X(x - w0), Y(y0)); ctx.lineTo(X(x + w1), Y(y1));
          ctx.moveTo(X(x + w0), Y(y0)); ctx.lineTo(X(x - w1), Y(y1));
        }
        // cross arm
        ctx.moveTo(X(x - 6), Y(top)); ctx.lineTo(X(x + 6), Y(top));
        ctx.stroke();
      }

      function draw() {
        var c = colors();
        view.w = sliderRow.clientWidth;
        view.s = view.w / W;
        view.h = H * view.s;
        var ctx = fitCanvas(canvas, view.w, view.h);
        canvas.style.width = view.w + "px"; canvas.style.height = view.h + "px";
        ctx.fillStyle = c.bg;
        ctx.fillRect(0, 0, view.w, view.h);

        ctx.strokeStyle = c.border;
        ctx.lineWidth = 1;
        for (var gy = 10; gy < H; gy += 10) {
          ctx.beginPath(); ctx.moveTo(0, Y(gy)); ctx.lineTo(view.w, Y(gy)); ctx.stroke();
        }
        ctx.strokeStyle = c.muted;
        ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(view.w, Y(0)); ctx.stroke();

        var p1 = state.p[0], p2 = state.p[1];
        pylon(ctx, p1, c);
        pylon(ctx, p2, c);

        var chord = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        var L = chord * (1 + state.slack);
        var sol = solveCatenary(p1[0], p1[1], p2[0], p2[1], L);

        ctx.strokeStyle = c.muted;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(X(p1[0]), Y(p1[1])); ctx.lineTo(X(p2[0]), Y(p2[1])); ctx.stroke();
        ctx.setLineDash([]);

        // the cable, and its largest vertical drop below the straight line
        var sag = 0, sagX = p1[0];
        ctx.strokeStyle = c.accent;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (var k = 0; k <= 200; k++) {
          var x = p1[0] + (p2[0] - p1[0]) * k / 200, y = sol.y(x);
          var lineY = p1[1] + (p2[1] - p1[1]) * k / 200;
          if (lineY - y > sag) { sag = lineY - y; sagX = x; }
          if (k === 0) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y));
        }
        ctx.stroke();

        if (sag > 0.3) {
          var sy = sol.y(sagX), ly = p1[1] + (p2[1] - p1[1]) * (sagX - p1[0]) / (p2[0] - p1[0]);
          ctx.strokeStyle = c.text2;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(X(sagX), Y(ly)); ctx.lineTo(X(sagX), Y(sy)); ctx.stroke();
        }

        state.p.forEach(function (p) {
          ctx.fillStyle = c.accent;
          ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 6, 0, 2 * Math.PI); ctx.fill();
          ctx.strokeStyle = c.bg;
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        readout.textContent = tr(S.span) + " " + (p2[0] - p1[0]).toFixed(0) + " m · " +
          tr(S.rise) + " " + (p2[1] - p1[1]).toFixed(1) + " m · " +
          tr(S.length) + " " + L.toFixed(1) + " m · " + tr(S.sag) + " " + sag.toFixed(1) + " m · a = " +
          sol.a.toFixed(1) + " m · " + sol.iterations + " " + tr(S.newton);
      }

      draw();
      keepFresh(box, draw);
    }
  };

  // ================================================================ growing network
  //
  // A small 2-input classifier, x -> tanh(W1 [x;1]) -> tanh(W2 [h1;1]) -> sigmoid,
  // trained by full-batch Adam and grown during training the way Gromo grows a
  // layer: from the activations b entering the new neurons and the gradients v
  // of the loss with respect to the next layer's pre-activations, build
  // S = E[b b^T] and N = E[b v^T]; the best new neurons come from the SVD of
  // S^{-1/2} N, and each singular value is that neuron's first-order loss
  // improvement. Neurons whose value clears a threshold are added (with a short
  // line search on their scale); growth stops once none does.

  // symmetric eigendecomposition by cyclic Jacobi rotations (matrices here are at most 13 x 13)
  function eigSym(A) {
    var n = A.length, a = A.map(function (r) { return r.slice(); });
    var V = a.map(function (r, i) { return r.map(function (_, j) { return i === j ? 1 : 0; }); });
    for (var sweep = 0; sweep < 60; sweep++) {
      var off = 0;
      for (var p = 0; p < n; p++) for (var q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
      if (off < 1e-22) break;
      for (p = 0; p < n; p++) {
        for (q = p + 1; q < n; q++) {
          if (Math.abs(a[p][q]) < 1e-300) continue;
          var theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
          var t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
          var c = 1 / Math.sqrt(t * t + 1), s = t * c;
          for (var k = 0; k < n; k++) {
            var akp = a[k][p], akq = a[k][q];
            a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq;
          }
          for (k = 0; k < n; k++) {
            var apk = a[p][k], aqk = a[q][k];
            a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk;
          }
          for (k = 0; k < n; k++) {
            var vkp = V[k][p], vkq = V[k][q];
            V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq;
          }
        }
      }
    }
    return { values: a.map(function (r, i) { return r[i]; }), vectors: V }; // column j of V is vector j
  }

  function makeData(kind, n) {
    var X = [], Y = [];
    function noise(s) { return (Math.random() * 2 - 1) * s; }
    for (var i = 0; i < n; i++) {
      var y = i % 2, x1, x2;
      if (kind === "circles") {
        var r = y ? 0.15 + 0.3 * Math.sqrt(Math.random()) : 0.62 + 0.28 * Math.random();
        var a = Math.random() * 2 * Math.PI;
        x1 = r * Math.cos(a); x2 = r * Math.sin(a);
      } else if (kind === "moons") {
        var u = Math.random() * Math.PI;
        if (y) { x1 = Math.cos(u) * 0.62 - 0.3; x2 = Math.sin(u) * 0.62 - 0.12; }
        else { x1 = 0.3 - Math.cos(u) * 0.62; x2 = 0.12 - Math.sin(u) * 0.62; }
        x1 += noise(0.07); x2 += noise(0.07);
      } else {
        var t = Math.random();
        var ang = t * 3.2 * Math.PI + (y ? Math.PI : 0), rad = 0.08 + 0.82 * t;
        x1 = rad * Math.cos(ang) + noise(0.03); x2 = rad * Math.sin(ang) + noise(0.03);
      }
      X.push([x1, x2]); Y.push(y);
    }
    return { X: X, Y: Y };
  }

  function randn() {
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // W1: n1 x 3, W2: n2 x (n1 + 1), w3: n2 + 1 - rows are neurons, last column is the bias
  function newNet() {
    var net = {
      W1: [[randn() * 0.8, randn() * 0.8, 0]],
      W2: [[randn() * 0.8, 0]],
      w3: [randn() * 0.8, 0],
      t: 0
    };
    net.m = zerosLike(net); net.v = zerosLike(net);
    return net;
  }
  function zerosLike(net) {
    return {
      W1: net.W1.map(function (r) { return r.map(function () { return 0; }); }),
      W2: net.W2.map(function (r) { return r.map(function () { return 0; }); }),
      w3: net.w3.map(function () { return 0; })
    };
  }

  function forward(net, x) {
    var b1 = [x[0], x[1], 1];
    var h1 = net.W1.map(function (w) { return Math.tanh(w[0] * b1[0] + w[1] * b1[1] + w[2]); });
    var b2 = h1.concat([1]);
    var h2 = net.W2.map(function (w) { var s = 0; for (var j = 0; j < b2.length; j++) s += w[j] * b2[j]; return Math.tanh(s); });
    var b3 = h2.concat([1]);
    var z = 0;
    for (var j = 0; j < b3.length; j++) z += net.w3[j] * b3[j];
    var p = 1 / (1 + Math.exp(-z));
    return { b1: b1, h1: h1, b2: b2, h2: h2, b3: b3, p: p };
  }

  // mean binary cross-entropy, accuracy, and (optionally) the gradients and growth statistics
  function evaluate(net, data, withGrad) {
    var n = data.X.length, loss = 0, correct = 0;
    var g = withGrad ? zerosLike(net) : null;
    var n1 = net.W1.length, n2 = net.W2.length;
    var S1 = null, N1 = null, S2 = null, N2 = null;
    if (withGrad) {
      S1 = mat(3, 3); N1 = mat(3, n2);
      S2 = mat(n1 + 1, n1 + 1); N2 = mat(n1 + 1, 1);
    }
    for (var i = 0; i < n; i++) {
      var f = forward(net, data.X[i]), y = data.Y[i];
      var p = Math.min(1 - 1e-9, Math.max(1e-9, f.p));
      loss -= y * Math.log(p) + (1 - y) * Math.log(1 - p);
      if ((f.p > 0.5 ? 1 : 0) === y) correct++;
      if (!withGrad) continue;
      var dz = (f.p - y) / n;
      for (var j = 0; j < f.b3.length; j++) g.w3[j] += dz * f.b3[j];
      var da2 = f.h2.map(function (h, k) { return dz * net.w3[k] * (1 - h * h); });
      for (var k = 0; k < n2; k++) for (j = 0; j < f.b2.length; j++) g.W2[k][j] += da2[k] * f.b2[j];
      var da1 = f.h1.map(function (h, a) {
        var s = 0; for (var k2 = 0; k2 < n2; k2++) s += net.W2[k2][a] * da2[k2];
        return s * (1 - h * h);
      });
      for (var a = 0; a < n1; a++) for (j = 0; j < 3; j++) g.W1[a][j] += da1[a] * f.b1[j];
      // growth statistics: a new neuron in layer 1 reads b1 and feeds layer 2's
      // pre-activations; a new neuron in layer 2 reads b2 and feeds the output
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) S1[r][c] += f.b1[r] * f.b1[c] / n;
        for (c = 0; c < n2; c++) N1[r][c] += f.b1[r] * da2[c];
      }
      for (r = 0; r <= n1; r++) {
        for (c = 0; c <= n1; c++) S2[r][c] += f.b2[r] * f.b2[c] / n;
        N2[r][0] += f.b2[r] * dz;
      }
    }
    return { loss: loss / n, acc: correct / n, grad: g, stats: withGrad ? [{ S: S1, N: N1 }, { S: S2, N: N2 }] : null };
  }
  function mat(r, c) { var m = []; for (var i = 0; i < r; i++) { m.push([]); for (var j = 0; j < c; j++) m[i].push(0); } return m; }

  function adamStep(net, g, lr) {
    net.t += 1;
    var b1 = 0.9, b2 = 0.999, c1 = 1 - Math.pow(b1, net.t), c2 = 1 - Math.pow(b2, net.t);
    function upd(w, m, v, gr) {
      for (var i = 0; i < w.length; i++) {
        m[i] = b1 * m[i] + (1 - b1) * gr[i];
        v[i] = b2 * v[i] + (1 - b2) * gr[i] * gr[i];
        w[i] -= lr * (m[i] / c1) / (Math.sqrt(v[i] / c2) + 1e-8);
      }
    }
    net.W1.forEach(function (w, i) { upd(w, net.m.W1[i], net.v.W1[i], g.W1[i]); });
    net.W2.forEach(function (w, i) { upd(w, net.m.W2[i], net.v.W2[i], g.W2[i]); });
    upd(net.w3, net.m.w3, net.v.w3, g.w3);
  }

  // the best new neurons for one layer: SVD of S^{-1/2} N (S: p x p, N: p x q)
  function proposeNeurons(S, N) {
    var p = S.length, q = N[0].length;
    var es = eigSym(S.map(function (r, i) { return r.map(function (x, j) { return x + (i === j ? 1e-4 : 0); }); }));
    var Sm = mat(p, p); // S^{-1/2}
    for (var r = 0; r < p; r++) for (var c = 0; c < p; c++) {
      var s = 0;
      for (var k = 0; k < p; k++) s += es.vectors[r][k] * es.vectors[c][k] / Math.sqrt(Math.max(es.values[k], 1e-6));
      Sm[r][c] = s;
    }
    var M = mat(p, q); // S^{-1/2} N
    for (r = 0; r < p; r++) for (c = 0; c < q; c++) { var t = 0; for (k = 0; k < p; k++) t += Sm[r][k] * N[k][c]; M[r][c] = t; }
    var MtM = mat(q, q);
    for (r = 0; r < q; r++) for (c = 0; c < q; c++) { var u = 0; for (k = 0; k < p; k++) u += M[k][r] * M[k][c]; MtM[r][c] = u; }
    var e = eigSym(MtM), out = [];
    for (var j = 0; j < q; j++) {
      var sigma = Math.sqrt(Math.max(e.values[j], 0));
      if (sigma < 1e-12) continue;
      var w = e.vectors.map(function (row) { return row[j]; });
      var uvec = M.map(function (row) { var z = 0; for (var c2 = 0; c2 < q; c2++) z += row[c2] * w[c2]; return z / sigma; });
      // incoming weights alpha = S^{-1/2} u, outgoing omega = -w (descent direction), both scaled by sqrt(sigma)
      var alpha = Sm.map(function (row) { var z = 0; for (var k2 = 0; k2 < p; k2++) z += row[k2] * uvec[k2]; return z * Math.sqrt(sigma); });
      var omega = w.map(function (x) { return -x * Math.sqrt(sigma); });
      out.push({ sigma: sigma, alpha: alpha, omega: omega });
    }
    out.sort(function (a, b) { return b.sigma - a.sigma; });
    return out;
  }

  function addNeuron(net, layer, alpha, omega) {
    if (layer === 0) {
      net.W1.push(alpha.slice()); net.m.W1.push([0, 0, 0]); net.v.W1.push([0, 0, 0]);
      net.W2.forEach(function (row, k) {
        row.splice(row.length - 1, 0, omega[k]);
        net.m.W2[k].splice(row.length - 2, 0, 0); net.v.W2[k].splice(row.length - 2, 0, 0);
      });
    } else {
      net.W2.push(alpha.slice());
      net.m.W2.push(alpha.map(function () { return 0; })); net.v.W2.push(alpha.map(function () { return 0; }));
      net.w3.splice(net.w3.length - 1, 0, omega[0]);
      net.m.w3.splice(net.m.w3.length - 1, 0, 0); net.v.w3.splice(net.v.w3.length - 1, 0, 0);
    }
  }
  function removeNeuron(net, layer) {
    if (layer === 0) {
      net.W1.pop(); net.m.W1.pop(); net.v.W1.pop();
      net.W2.forEach(function (row, k) { row.splice(row.length - 2, 1); net.m.W2[k].splice(row.length - 1, 1); net.v.W2[k].splice(row.length - 1, 1); });
    } else {
      net.W2.pop(); net.m.W2.pop(); net.v.W2.pop();
      net.w3.splice(net.w3.length - 2, 1); net.m.w3.splice(net.m.w3.length - 2, 1); net.v.w3.splice(net.v.w3.length - 2, 1);
    }
  }

  function scaled(v, gamma) { return v.map(function (x) { return x * gamma; }); }

  // one growth step on `layer`: add every proposed neuron whose first-order
  // gain clears `threshold` (at most `maxAdd`), each at the scale that lowers
  // the loss most; returns the gains that were added
  function growLayer(net, data, layer, stats, threshold, maxAdd, cap) {
    var size = layer === 0 ? net.W1.length : net.W2.length;
    var proposals = proposeNeurons(stats.S, stats.N), added = [];
    for (var i = 0; i < proposals.length && added.length < maxAdd && size + added.length < cap; i++) {
      var pr = proposals[i];
      if (pr.sigma < threshold) break;
      var base = evaluate(net, data, false).loss, best = null;
      [0.25, 0.5, 1, 2, 4, 8].forEach(function (gamma) {
        addNeuron(net, layer, scaled(pr.alpha, gamma), scaled(pr.omega, gamma));
        var l = evaluate(net, data, false).loss;
        removeNeuron(net, layer);
        if (l < base && (!best || l < best.loss)) best = { gamma: gamma, loss: l };
      });
      if (!best) break;
      addNeuron(net, layer, scaled(pr.alpha, best.gamma), scaled(pr.omega, best.gamma));
      added.push(pr.sigma);
    }
    return { added: added, best: proposals.length ? proposals[0].sigma : 0 };
  }

  // s selects neurons, u stops growth (the paper's two thresholds, at toy scale)
  var GROW_EVERY = 200, GROW_THRESHOLD = 0.005, GROW_STOP = 0.0005, MIN_STOP_STEP = 1000,
      GROW_MAX_ADD = 2, LAYER_CAP = 12, TOTAL_STEPS = 4000;

  demos.growth = {
    mount: function (box) {
      var S = {
        dataset: { en: "Dataset", fr: "Données", ar: "البيانات" },
        circles: { en: "Circles", fr: "Cercles", ar: "دوائر" }, moons: { en: "Moons", fr: "Lunes", ar: "أهلّة" }, spiral: { en: "Spiral", fr: "Spirale", ar: "حلزون" },
        play: { en: "Play", fr: "Lancer", ar: "تشغيل" }, pause: { en: "Pause", fr: "Pause", ar: "إيقاف مؤقت" }, reset: { en: "Restart", fr: "Recommencer", ar: "إعادة البدء" },
        speed: { en: "Speed", fr: "Vitesse", ar: "السرعة" },
        network: { en: "The network", fr: "Le réseau", ar: "الشبكة" }, boundary: { en: "What it predicts", fr: "Ce qu'il prédit", ar: "ما تتنبأ به" },
        layer: { en: "layer", fr: "couche", ar: "الطبقة" }, step: { en: "step", fr: "étape", ar: "الخطوة" }, loss: { en: "loss", fr: "perte", ar: "الخسارة" },
        acc: { en: "accuracy", fr: "précision", ar: "الدقة" }, neurons: { en: "neurons", fr: "neurones", ar: "العصبونات" }, params: { en: "parameters", fr: "paramètres", ar: "معاملات" },
        growing: { en: "growing", fr: "en croissance", ar: "في طور النمو" }, stopped: { en: "growth stopped at step", fr: "croissance arrêtée à l'étape", ar: "توقّف النمو عند الخطوة" },
        done: { en: "done", fr: "terminé", ar: "انتهى" }, stopMark: { en: "growth stops", fr: "fin de la croissance", ar: "توقّف النمو" },
        hint: {
          en: "A toy version of the idea, trained live in your browser. The network starts with one neuron per hidden layer. Every 200 training steps, one layer in turn is offered new neurons, computed the way Gromo does it: from the activations entering the layer and the gradients leaving it, the SVD of S^(-1/2) N gives the best new neurons, and each singular value is that neuron's first-order gain on the loss. A neuron is added only if its gain clears s = 0.005, and growth stops once neither layer offers even u = 0.0005 — the paper's pair of thresholds, at toy scale. Try the spiral: it ends up needing a much bigger network than the circles. (Simplified: the existing weights are not re-fitted before growing, and the real method grows convolutional cells, not a two-input toy.)",
          fr: "Une version jouet de l'idée, entraînée en direct dans votre navigateur. Le réseau commence avec un neurone par couche cachée. Toutes les 200 étapes d'entraînement, une couche à tour de rôle se voit proposer de nouveaux neurones, calculés comme le fait Gromo : à partir des activations qui entrent dans la couche et des gradients qui en sortent, la SVD de S^(-1/2) N donne les meilleurs nouveaux neurones, et chaque valeur singulière est le gain au premier ordre de ce neurone sur la perte. Un neurone n'est ajouté que si son gain dépasse s = 0,005, et la croissance s'arrête quand aucune couche n'offre plus même u = 0,0005 — le couple de seuils de l'article, à l'échelle d'un jouet. Essayez la spirale : elle finit par demander un réseau bien plus grand que les cercles. (Simplifié : les poids existants ne sont pas réajustés avant la croissance, et la vraie méthode fait croître des cellules convolutives, pas un réseau jouet à deux entrées.)",
          ar: "نسخة مبسّطة من الفكرة، تُدرَّب مباشرةً في متصفحك. تبدأ الشبكة بعصبون واحد في كل طبقة مخفية. كل 200 خطوة تدريب، تُعرض على إحدى الطبقتين بالتناوب عصبونات جديدة تُحسب بطريقة Gromo نفسها: انطلاقًا من التنشيطات الداخلة إلى الطبقة والتدرّجات الخارجة منها، يعطي تفكيك القيم المنفردة (SVD) للمصفوفة S^(-1/2) N أفضل العصبونات الجديدة، وكل قيمة منفردة هي ربح ذلك العصبون من الدرجة الأولى على الخسارة. لا يُضاف عصبون إلا إذا تجاوز ربحه s = 0.005، ويتوقف النمو حين لا تقدّم أيّ طبقة ولو u = 0.0005 — وهما زوج العتبات الوارد في المقال، على مقياس مصغّر. جرّب الحلزون: سيحتاج في النهاية إلى شبكة أكبر بكثير من الدوائر. (تبسيط: لا يُعاد ضبط الأوزان الموجودة قبل النمو، والطريقة الحقيقية تُنمّي خلايا التفافية، لا شبكة مصغّرة بمدخلين.)"
        }
      };

      var state = { kind: "spiral", speed: 1, playing: false, raf: null };
      var sim = null;

      var controls = el("div", "demo-controls");
      controls.appendChild(labelled(tr(S.dataset), select([["circles", tr(S.circles)], ["moons", tr(S.moons)], ["spiral", tr(S.spiral)]], state.kind, function (v) { state.kind = v; restart(); })));
      controls.appendChild(labelled(tr(S.speed), select([["1", "1×"], ["3", "3×"]], "1", function (v) { state.speed = +v; })));
      var playBtn = button(tr(S.play), function () { state.playing ? pause() : play(); }, "primary");
      controls.appendChild(playBtn);
      controls.appendChild(button(tr(S.reset), function () { restart(); play(); }));
      box.appendChild(controls);

      var panels = el("div", "demo-canvases");
      function panel(title) {
        var p = el("div", "demo-panel");
        p.appendChild(el("p", "demo-label", title));
        var cv = el("canvas", "demo-canvas wide");
        p.appendChild(cv);
        panels.appendChild(p);
        return cv;
      }
      var netCv = panel(tr(S.network)), mapCv = panel(tr(S.boundary));
      box.appendChild(panels);
      var lossCv = el("canvas", "demo-plot");
      box.appendChild(lossCv);
      var readout = el("p", "demo-readout");
      box.appendChild(readout);
      box.appendChild(el("p", "demo-hint", tr(S.hint)));

      function restart() {
        pause();
        sim = { data: makeData(state.kind, 300), net: newNet(), step: 0, layer: 0, lows: 0, stoppedAt: -1,
                history: [], events: [], fresh: [], loss: 0, acc: 0, frame: 0, map: null };
        var ev = evaluate(sim.net, sim.data, false);
        sim.loss = ev.loss; sim.acc = ev.acc; sim.history.push([0, ev.loss]);
        draw(true);
      }

      function trainSteps(k) {
        for (var i = 0; i < k && sim.step < TOTAL_STEPS; i++) {
          var ev = evaluate(sim.net, sim.data, true);
          adamStep(sim.net, ev.grad, 0.02);
          sim.step += 1;
          sim.loss = ev.loss; sim.acc = ev.acc;
          if (sim.step % 20 === 0) sim.history.push([sim.step, ev.loss]);
          if (sim.stoppedAt < 0 && sim.step % GROW_EVERY === 0) {
            var stats = evaluate(sim.net, sim.data, true).stats[sim.layer];
            var res = growLayer(sim.net, sim.data, sim.layer, stats, GROW_THRESHOLD, GROW_MAX_ADD, LAYER_CAP);
            // stop once both layers in a row offer less than u, after a warm-up
            sim.lows = res.added.length || res.best >= GROW_STOP ? 0 : sim.lows + 1;
            if (sim.lows >= 2 && sim.step >= MIN_STOP_STEP) sim.stoppedAt = sim.step;
            if (res.added.length) {
              sim.events.push({ step: sim.step, layer: sim.layer, count: res.added.length });
              var size = sim.layer === 0 ? sim.net.W1.length : sim.net.W2.length;
              for (var a = 0; a < res.added.length; a++) {
                sim.fresh.push({ layer: sim.layer, index: size - 1 - a, at: performance.now() });
              }
            }
            sim.layer = 1 - sim.layer;
          }
        }
      }

      function play() {
        if (sim.step >= TOTAL_STEPS) restart();
        state.playing = true;
        playBtn.textContent = tr(S.pause);
        state.raf = requestAnimationFrame(function tick() {
          if (!box.isConnected || !state.playing) return;
          trainSteps(3 * state.speed);
          draw(false);
          if (sim.step >= TOTAL_STEPS) { pause(); draw(true); return; }
          state.raf = requestAnimationFrame(tick);
        });
      }

      function pause() {
        state.playing = false;
        if (state.raf) cancelAnimationFrame(state.raf);
        state.raf = null;
        playBtn.textContent = tr(S.play);
      }

      function draw(full) {
        var c = colors(), net = sim.net, now = performance.now();
        var width = panels.clientWidth, cols = width > 520 ? 2 : 1;
        var w = Math.floor((width - (cols - 1) * 14) / cols), h = Math.min(300, Math.round(w * 0.8));
        sim.fresh = sim.fresh.filter(function (f) { return now - f.at < 1600; });

        // ---- the network: inputs, two growing hidden layers, output
        var ctx = fitCanvas(netCv, w, h);
        netCv.style.width = w + "px"; netCv.style.height = h + "px";
        ctx.fillStyle = c.bg; ctx.fillRect(0, 0, w, h);
        var sizes = [2, net.W1.length, net.W2.length, 1];
        var colX = [0.1, 0.38, 0.66, 0.9].map(function (f) { return f * w; });
        var top = 18, bottom = h - 30;
        function nodeY(layerIdx, i) {
          var n = sizes[layerIdx], gap = Math.min(24, (bottom - top) / Math.max(n, 1));
          return (top + bottom) / 2 + (i - (n - 1) / 2) * gap;
        }
        function edges(from, to, weight) {
          for (var j = 0; j < sizes[to]; j++) for (var i = 0; i < sizes[from]; i++) {
            var wv = weight(j, i), m = Math.min(1, Math.abs(wv) / 2.5);
            ctx.strokeStyle = wv >= 0 ? rgba(c.ink, 0.08 + 0.5 * m) : rgba(c.accentRgb, 0.08 + 0.55 * m);
            ctx.lineWidth = 0.6 + 2.2 * m;
            ctx.beginPath(); ctx.moveTo(colX[from], nodeY(from, i)); ctx.lineTo(colX[to], nodeY(to, j)); ctx.stroke();
          }
        }
        edges(0, 1, function (j, i) { return net.W1[j][i]; });
        edges(1, 2, function (j, i) { return net.W2[j][i]; });
        edges(2, 3, function (j, i) { return net.w3[i]; });
        for (var L = 0; L < 4; L++) {
          for (var i = 0; i < sizes[L]; i++) {
            var x = colX[L], y = nodeY(L, i);
            var fresh = sim.fresh.filter(function (f) { return f.layer + 1 === L && f.index === i; })[0];
            if (fresh) {
              var u = (now - fresh.at) / 1600;
              ctx.strokeStyle = rgba(c.accentRgb, 1 - u);
              ctx.lineWidth = 2;
              ctx.beginPath(); ctx.arc(x, y, 7 + 12 * u, 0, 2 * Math.PI); ctx.stroke();
            }
            ctx.fillStyle = fresh ? c.accent : c.bg;
            ctx.strokeStyle = c.text;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(x, y, 6.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
          }
        }
        ctx.fillStyle = c.muted;
        ctx.font = "11px " + getComputedStyle(document.body).fontFamily;
        ctx.textAlign = "center";
        ["x", tr(S.layer) + " 1 · " + sizes[1], tr(S.layer) + " 2 · " + sizes[2], "ŷ"].forEach(function (t, k) {
          ctx.fillText(t, colX[k], h - 10);
        });

        // ---- the decision map, recomputed every few frames
        var mctx = fitCanvas(mapCv, w, h);
        mapCv.style.width = w + "px"; mapCv.style.height = h + "px";
        mctx.fillStyle = c.bg; mctx.fillRect(0, 0, w, h);
        sim.frame += 1;
        var G = 44;
        if (full || !sim.map || sim.frame % 3 === 0) {
          sim.map = [];
          for (var gy = 0; gy < G; gy++) for (var gx = 0; gx < G; gx++) {
            sim.map.push(forward(net, [-1.05 + 2.1 * (gx + 0.5) / G, 1.05 - 2.1 * (gy + 0.5) / G]).p);
          }
        }
        // blend each class tint into the page colour on a G x G image, then let the browser smooth it up
        var side = Math.min(w, h), ox = (w - side) / 2;
        var bgRgb = rgbList(getComputedStyle(document.documentElement).getPropertyValue("--bg-rgb"));
        var inkRgb = rgbList(c.ink), accRgb = rgbList(c.accentRgb);
        if (!sim.mapCanvas) { sim.mapCanvas = document.createElement("canvas"); sim.mapCanvas.width = G; sim.mapCanvas.height = G; }
        var octx = sim.mapCanvas.getContext("2d"), img = octx.createImageData(G, G);
        for (var q = 0; q < G * G; q++) {
          var p = sim.map[q], strength = Math.abs(p - 0.5) * 2;
          var tint = p > 0.5 ? accRgb : inkRgb, alpha = p > 0.5 ? 0.1 + 0.4 * strength : 0.04 + 0.18 * strength;
          for (var ch = 0; ch < 3; ch++) img.data[4 * q + ch] = Math.round(bgRgb[ch] * (1 - alpha) + tint[ch] * alpha);
          img.data[4 * q + 3] = 255;
        }
        octx.putImageData(img, 0, 0);
        mctx.imageSmoothingEnabled = true;
        mctx.drawImage(sim.mapCanvas, ox, 0, side, side);
        sim.data.X.forEach(function (pt, k) {
          var px = ox + (pt[0] + 1.05) / 2.1 * side, py = (1.05 - pt[1]) / 2.1 * side;
          mctx.fillStyle = sim.data.Y[k] ? c.accent : c.text;
          mctx.beginPath(); mctx.arc(px, py, 2.4, 0, 2 * Math.PI); mctx.fill();
        });

        // ---- the training loss, with every growth step marked
        var lw = box.querySelector(".demo-readout").clientWidth || width, lh = 90;
        var lctx = fitCanvas(lossCv, lw, lh);
        lossCv.style.width = lw + "px"; lossCv.style.height = lh + "px";
        var maxLoss = Math.max(0.75, sim.history[0][1]);
        function LX(s) { return 4 + s / TOTAL_STEPS * (lw - 8); }
        function LY(v) { return 8 + (1 - Math.min(v, maxLoss) / maxLoss) * (lh - 22); }
        lctx.strokeStyle = c.border; lctx.lineWidth = 1;
        lctx.beginPath(); lctx.moveTo(0, LY(0)); lctx.lineTo(lw, LY(0)); lctx.stroke();
        sim.events.forEach(function (e) {
          lctx.strokeStyle = rgba(c.accentRgb, 0.7);
          lctx.beginPath(); lctx.moveTo(LX(e.step), 4); lctx.lineTo(LX(e.step), LY(0)); lctx.stroke();
          lctx.fillStyle = c.accent;
          lctx.font = "10px " + getComputedStyle(document.body).fontFamily;
          lctx.textAlign = "center";
          lctx.fillText("+" + e.count, LX(e.step), lh - 2);
        });
        if (sim.stoppedAt > 0) {
          lctx.strokeStyle = c.muted; lctx.setLineDash([3, 3]);
          lctx.beginPath(); lctx.moveTo(LX(sim.stoppedAt), 4); lctx.lineTo(LX(sim.stoppedAt), LY(0)); lctx.stroke();
          lctx.setLineDash([]);
          lctx.fillStyle = c.muted; lctx.textAlign = "left";
          lctx.fillText(tr(S.stopMark), LX(sim.stoppedAt) + 5, 14);
        }
        lctx.strokeStyle = c.text; lctx.lineWidth = 1.6;
        lctx.beginPath();
        sim.history.forEach(function (pt, k) { if (k === 0) lctx.moveTo(LX(pt[0]), LY(pt[1])); else lctx.lineTo(LX(pt[0]), LY(pt[1])); });
        lctx.lineTo(LX(sim.step), LY(sim.loss));
        lctx.stroke();
        lctx.fillStyle = c.muted; lctx.textAlign = "left";
        lctx.fillText(tr(S.loss), 6, 14);

        var params = net.W1.length * 3 + net.W2.length * (net.W1.length + 1) + net.w3.length;
        var status = sim.stoppedAt > 0 ? tr(S.stopped) + " " + sim.stoppedAt : tr(S.growing);
        if (sim.step >= TOTAL_STEPS) status += " · " + tr(S.done);
        readout.textContent = tr(S.step) + " " + sim.step + "/" + TOTAL_STEPS + " · " + tr(S.loss) + " " + sim.loss.toFixed(3) +
          " · " + tr(S.acc) + " " + Math.round(sim.acc * 100) + "% · " + tr(S.neurons) + " " + net.W1.length + " + " + net.W2.length +
          " · " + params + " " + tr(S.params) + " · " + status;
      }

      restart();
      keepFresh(box, function () { draw(true); });

      // start on its own the first time it scrolls into view, unless reduced motion is asked for
      var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!calm && window.IntersectionObserver) {
        var seen = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { seen.disconnect(); if (!state.playing && sim.step === 0) play(); }
        }, { threshold: 0.35 });
        seen.observe(box);
      }
    }
  };

  window.siteDemos = demos;
})();
