console.log("OUTCOME.JS LOADED + substr()");
const FIELD = { width: 400, height: 300, limitY: 250, curveTop: 28, padX: 28 };
const curveSquareState = { t: 0.42, raf: null };
const SECTORS = {
  Q1: {
    fill: "#60a5fa88", solid: "#60a5fa", div: "sector-q1", x: 1, y: 1,
    word: "amplitude",
    prompt: "Would you like to replace one line of code with \"amplitude\"?"
  },
  Q2: {
    fill: "#34d39988", solid: "#34d399", div: "sector-q2", x: -1, y: 1,
    word: "angular momentum",
    prompt: "Would you like to replace one line of code with \"angular momentum\"?"
  },
  Q3: {
    fill: "#f472b688", solid: "#f472b6", div: "sector-q3", x: -1, y: -1,
    word: "atom",
    prompt: "Would you like to replace one line of code with \"atom\"?"
  },
  Q4: {
    fill: "#fbbf2488", solid: "#fbbf24", div: "sector-q4", x: 1, y: -1,
    word: "acceleration",
    prompt: "Would you like to replace one line of code with \"acceleration\"?"
  }
};
const sectorState = { active: null, counts: { Q1: 0, Q2: 0, Q3: 0, Q4: 0 } };
const TYPE_SETS = {
  "1": { id: "type-set-1", label: "TYPE SET 1", href: "https://jrxxyy.github.io/index.html" },
  "2": { id: "type-set-2", label: "TYPE SET 2", href: "https://jrxxyy.github.io/beta.html" },
  "3": { id: "type-set-3", label: "TYPE SET 3", href: "https://jrxxyy.github.io/visa.html" }
};
const ServerTypes = {
  circle: {
    dataType: "options",
    typeSet: "options",
    side: "server",
    items: ["toExponential-time"],
    onClick: "toExponential-time",
    negotiator: {
      op: "N/C",
      meaning: "not a circle",
      side: "server",
      apply: function (index) { return index % 2 === 0; }
    }
  },
  triangle: {
    dataType: "commands",
    typeSet: "commands",
    side: "server",
    items: [],
    onClick: "pending"
  }
};
window.__SERVER_TYPES__ = ServerTypes;
const SquareLiterals = [];
window.__SQUARE_LITERALS__ = SquareLiterals;

const SubstrState = {
  source: "y2=x2-x4",
  start: 0,
  length: 4,
  result: "",
  generated: false,
  lastCircles: [],
  thetaZeroChoice: null,
  zeroTbShown: false,
  spamScore: 0
};

function modelSourceString() {
  const el = document.getElementById("substr-source");
  if (el && el.value) return String(el.value);
  return SubstrState.source || "y2=x2-x4";
}

function substr(source, start, length) {
  const s = source == null ? "" : String(source);
  var a = Number(start);
  var n = Number(length);
  if (!isFinite(a)) a = 0;
  if (a < 0) a = 0;
  if (!isFinite(n) || n < 0) n = s.length - a;
  return s.substr(a, n);
}

function generateUserSubstr() {
  const srcEl = document.getElementById("substr-source");
  const stEl = document.getElementById("substr-start");
  const lnEl = document.getElementById("substr-len");
  const source = srcEl ? srcEl.value : "y2=x2-x4";
  const start = stEl ? Number(stEl.value) : 0;
  const length = lnEl ? Number(lnEl.value) : 4;
  const result = substr(source, start, length);
  SubstrState.source = source;
  SubstrState.start = start;
  SubstrState.length = length;
  SubstrState.result = result;
  SubstrState.generated = true;
  const out = document.getElementById("substr-result");
  if (out) {
    out.textContent = "substr(\"" + source + "\", " + start + ", " + length + ") → \"" + result + "\"";
  }
  drawClosestCircleLine();
  return result;
}

function eightY(x) {
  const v = x * x * (1 - x * x);
  return v > 0 ? Math.sqrt(v) : 0;
}

function substrBias(result) {
  if (!result) return 0;
  var sum = 0;
  for (var i = 0; i < result.length; i++) sum += result.charCodeAt(i);
  return sum;
}

function closestCirclePair(records, bias) {
  if (!records || records.length < 2) return null;
  var best = null;
  var bestD = Infinity;
  var i, j;
  for (i = 0; i < records.length; i++) {
    for (j = i + 1; j < records.length; j++) {
      const dx = records[i].x - records[j].x;
      const dy = records[i].y - records[j].y;
      var d = dx * dx + dy * dy;
      if (bias) d = d + ((records[i].index + records[j].index + bias) % 7) * 0.01;
      if (d < bestD) {
        bestD = d;
        best = [records[i], records[j], Math.sqrt(Math.max(0, dx * dx + dy * dy))];
      }
    }
  }
  return best;
}

function drawClosestCircleLine() {
  const svg = document.getElementById("svg-area");
  if (!svg) return;
  const old = svg.querySelectorAll("[data-substr-link='1']");
  for (var k = 0; k < old.length; k++) {
    if (old[k].parentNode) old[k].parentNode.removeChild(old[k]);
  }
  if (!SubstrState.generated) return;
  const pair = closestCirclePair(SubstrState.lastCircles, substrBias(SubstrState.result));
  if (!pair) return;
  const a = pair[0];
  const b = pair[1];
  const dist = pair[2];
  const NS = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(NS, "line");
  line.setAttribute("x1", String(a.x));
  line.setAttribute("y1", String(a.y));
  line.setAttribute("x2", String(b.x));
  line.setAttribute("y2", String(b.y));
  line.setAttribute("stroke", "#111");
  line.setAttribute("stroke-width", "1.6");
  line.setAttribute("data-substr-link", "1");
  line.setAttribute("data-substr", SubstrState.result);
  line.setAttribute("data-dist", String(dist.toFixed(2)));
  svg.appendChild(line);
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const lab = document.createElementNS(NS, "text");
  lab.setAttribute("x", String(midX));
  lab.setAttribute("y", String(midY - 6));
  lab.setAttribute("text-anchor", "middle");
  lab.setAttribute("font-size", "10");
  lab.setAttribute("fill", "#111");
  lab.setAttribute("data-substr-link", "1");
  lab.setAttribute("pointer-events", "none");
  lab.textContent = SubstrState.result || "substr";
  svg.appendChild(lab);
  writeTrLine("substr:" + SubstrState.result + " d=" + dist.toFixed(1));
}

const SpamState = { hits: [], windowMs: 5000, maxHits: 4 };

function simpleSpamDetection(eventName) {
  const now = Date.now();
  SpamState.hits = SpamState.hits.filter(function(t){
    return now - t < SpamState.windowMs;
  });
  SpamState.hits.push(now);
  SubstrState.spamScore = SpamState.hits.length;
  if (SpamState.hits.length > SpamState.maxHits) {
    console.warn("Spam detection blocked:", eventName);
    return false;
  }
  return true;
}

function serverSideSpamCheck(eventName) {
  return simpleSpamDetection(eventName);
}

function installThetaZeroStyles() {
  if (document.getElementById("theta-zero-styles")) return;

  const style = document.createElement("style");
  style.id = "theta-zero-styles";

  style.textContent =
    "@keyframes thetaTbLetterForm{" +
    "0%{opacity:0;transform:translateY(8px) scale(.85);letter-spacing:-8px}" +
    "55%{opacity:1;transform:translateY(-2px) scale(1.05);letter-spacing:2px}" +
    "100%{opacity:1;transform:translateY(0) scale(1);letter-spacing:0}" +
    "}" +
    "@keyframes thetaZeroPulse{" +
    "0%,100%{transform:scale(1)}" +
    "50%{transform:scale(1.12)}" +
    "}" +
    "#theta-zero-tb .theta-tb-title{" +
    "font-style:italic;font-weight:700;display:inline-block;" +
    "animation:thetaTbLetterForm 900ms ease-out both" +
    "}" +
    "#theta-zero-tb .theta-zero-display{" +
    "font-style:italic;font-size:30px;font-weight:700;" +
    "display:inline-block;" +
    "animation:thetaZeroPulse 1100ms ease-in-out infinite" +
    "}" +
    "#theta-zero-tb .theta-double-string{" +
    "display:inline-block;margin-left:6px;font-style:italic;" +
    "font-weight:700;" +
    "animation:thetaTbLetterForm 1100ms ease-out 150ms both" +
    "}";

  document.head.appendChild(style);
}

function ensureThetaZeroTB() {
  installThetaZeroStyles();

  if (document.getElementById("theta-zero-tb")) return;

  const modal = document.createElement("div");
  modal.id = "theta-zero-tb";
  modal.style.cssText =
    "display:none;position:fixed;inset:0;" +
    "background:rgba(0,0,0,.45);z-index:100001;" +
    "align-items:center;justify-content:center;";

  modal.innerHTML =
    '<div style="background:#fff;color:#111;max-width:420px;width:90%;padding:20px;border:2px solid #111;border-radius:12px;box-shadow:0 10px 35px rgba(0,0,0,.3);font-family:sans-serif;text-align:center;">' +
    '<div class="theta-tb-title" style="font-size:18px;">Double String TB</div>' +
    '<div style="margin:12px 0;">' +
    '<span class="theta-zero-display">0</span>' +
    '<span class="theta-double-string">→ double string tb</span>' +
    '</div>' +
    '<div style="margin:12px 0 16px;font-size:15px;">' +
    'Would you like to change this zero to a 1-5?' +
    '</div>' +
    '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">' +
    '<button type="button" id="theta-zero-no">Keep 0</button>' +
    '<button type="button" id="theta-zero-1">1</button>' +
    '<button type="button" id="theta-zero-2">2</button>' +
    '<button type="button" id="theta-zero-3">3</button>' +
    '<button type="button" id="theta-zero-4">4</button>' +
    '<button type="button" id="theta-zero-5">5</button>' +
    '</div>' +
    '<div id="theta-zero-status" style="margin-top:14px;min-height:20px;font-size:13px;"></div>' +
    '</div>';

  document.body.appendChild(modal);

  document.getElementById("theta-zero-no").onclick =
    function(){ finishThetaZeroTB("0"); };

  for (var i = 1; i <= 5; i++) {
    (function(v) {
      document.getElementById("theta-zero-" + v).onclick =
        function(){ finishThetaZeroTB(String(v)); };
    })(i);
  }
}

function openThetaZeroTB(sourceCircle) {
  if (!serverSideSpamCheck("theta-zero")) return;

  ensureThetaZeroTB();

  const m = document.getElementById("theta-zero-tb");
  const st = document.getElementById("theta-zero-status");

  if (st) st.textContent = "Waiting for a choice…";
  if (sourceCircle) m.setAttribute("data-source-circle", sourceCircle);

  m.style.display = "flex";
}

function finishThetaZeroTB(choice) {
  const m = document.getElementById("theta-zero-tb");
  const st = document.getElementById("theta-zero-status");

  SubstrState.thetaZeroChoice = choice;

  if (st) {
    st.textContent =
      choice === "0"
        ? "Zero kept."
        : "Zero changed to " + choice + ".";
  }

  const idx = m ? m.getAttribute("data-source-circle") : null;

  if (idx) {
    const t = document.querySelector(
      '[data-theta-zero-index="' + idx + '"]'
    );
    if (t) t.textContent = choice;
  }

  const out = document.getElementById("output");

  if (out) {
    out.textContent +=
      "\nTHETA ZERO TB: 0 → " +
      choice +
      "\nDOUBLE STRING TB: active";
  }

  setTimeout(function(){
    if (m) m.style.display = "none";
  }, 500);
}

function checkThetaZero(circleIndex, displayedValue) {
  if (
    String(displayedValue).indexOf("0") === -1 ||
    SubstrState.zeroTbShown
  ) return;

  SubstrState.zeroTbShown = true;

  setTimeout(function(){
    openThetaZeroTB(String(circleIndex));
  }, 120);
}

function resetThetaZeroCycle() {
  SubstrState.zeroTbShown = false;
}

function ensureHostNodes() {
  installThetaZeroStyles();
  ensureThetaZeroTB();

  const svgArea = document.getElementById("svg-area");
  const theta = document.getElementById("radian-circle");

  if (!document.getElementById("eight-area")) {
    const wrap = document.createElement("div");
    wrap.style.margin = "16px 0";

    const label = document.createElement("p");
    label.textContent =
      "Cartesian field under θ — four interactive sectors  y² = x² − x⁴";

    const eight = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    eight.setAttribute("id", "eight-area");
    eight.setAttribute("viewBox", "0 0 440 340");
    eight.setAttribute("width", "440");
    eight.setAttribute("height", "340");
    eight.style.border = "1px solid black";
    eight.style.display = "block";

    wrap.appendChild(label);
    wrap.appendChild(eight);

    if (theta && theta.parentNode)
      theta.parentNode.insertBefore(wrap, theta.nextSibling);
    else if (svgArea && svgArea.parentNode)
      svgArea.parentNode.insertBefore(wrap, svgArea);
    else
      document.body.appendChild(wrap);
  }

  if (!document.getElementById("sector-chart")) {
    const wrap = document.createElement("div");
    wrap.style.margin = "16px 0";

    const label = document.createElement("p");
    label.textContent =
      "Sector chart under type-set square (each lobe = 1/3)";

    const chart = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    chart.setAttribute("id", "sector-chart");
    chart.setAttribute("viewBox", "0 0 400 160");
    chart.setAttribute("width", "400");
    chart.setAttribute("height", "160");
    chart.style.border = "1px solid black";
    chart.style.display = "block";

    wrap.appendChild(label);
    wrap.appendChild(chart);

    const svg = document.getElementById("svg-area");

    if (svg && svg.parentNode)
      svg.parentNode.insertBefore(wrap, svg.nextSibling);
    else
      document.body.appendChild(wrap);
  }

  if (!document.getElementById("code-out")) {
    const pre = document.createElement("pre");
    pre.id = "code-out";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.border = "1px solid #333";
    pre.style.padding = "10px";
    pre.textContent =
      "Click Q1–Q4 on the figure-eight or the Q bars for a copyable block.";
    document.body.appendChild(pre);
  }

  if (!document.getElementById("call-box")) {
    const box = document.createElement("div");
    box.id = "call-box";
    box.style.cssText =
      "position:absolute;right:20px;top:340px;width:200px;" +
      "min-height:90px;border:1px solid #000;padding:10px;" +
      "background:#fff;font-family:sans-serif;font-size:13px;z-index:20;";

    box.innerHTML =
      "<strong>CALL BOX</strong>" +
      "<div id=\"call-box-line\">waiting for type set…</div>" +
      "<div id=\"call-box-id\"></div>" +
      "<div id=\"type-set-1\" data-type-set=\"1\" data-call=\"idle\" data-href=\"https://jrxxyy.github.io/index.html\" style=\"margin-top:8px;padding:4px;border:1px dashed #999;cursor:pointer;\">#type-set-1</div>" +
      "<div id=\"type-set-2\" data-type-set=\"2\" data-call=\"idle\" data-href=\"https://jrxxyy.github.io/beta.html\" style=\"margin-top:4px;padding:4px;border:1px dashed #999;cursor:pointer;\">#type-set-2</div>" +
      "<div id=\"type-set-3\" data-type-set=\"3\" data-call=\"idle\" data-href=\"https://jrxxyy.github.io/visa.html\" style=\"margin-top:4px;padding:4px;border:1px dashed #999;cursor:pointer;\">#type-set-3</div>";

    document.body.appendChild(box);
  }

  if (!document.getElementById("sector-modal")) {
    const modal = document.createElement("div");
    modal.id = "sector-modal";
    modal.style.cssText =
      "display:none;position:fixed;inset:0;" +
      "background:rgba(0,0,0,.45);z-index:99999;" +
      "align-items:center;justify-content:center;";

    modal.innerHTML =
      '<div style="background:#fff;color:#111;max-width:420px;width:90%;padding:20px;border-radius:10px;font-family:sans-serif;">' +
      '<p id="sector-modal-text" style="margin:0 0 16px;font-size:16px;"></p>' +
      '<div style="display:flex;gap:8px;justify-content:flex-end;">' +
      '<button type="button" id="sector-modal-no">No</button>' +
      '<button type="button" id="sector-modal-yes">Yes</button>' +
      "</div></div>";

    document.body.appendChild(modal);

    document.getElementById("sector-modal-yes").onclick =
      function () { finishSectorPrompt(true); };

    document.getElementById("sector-modal-no").onclick =
      function () { finishSectorPrompt(false); };
  }

  const go = document.getElementById("substr-go");

  if (go && !go.getAttribute("data-bound")) {
    go.setAttribute("data-bound", "1");
    go.addEventListener("click", function () {
      generateUserSubstr();
    });
  }
}

function gSvgX(svgY) {
  const t =
    (FIELD.limitY - svgY) /
    (FIELD.limitY - FIELD.curveTop);

  const clamped = Math.max(0, Math.min(1, t));
  const bend = clamped * clamped * (3 - 2 * clamped);

  return FIELD.padX +
    30 +
    bend * 240 +
    Math.sin(clamped * Math.PI) * 16;
}

function curvePathD() {
  let d = "";

  for (let i = 0; i <= 20; i++) {
    const svgY =
      FIELD.limitY -
      (i / 20) *
      (FIELD.limitY - FIELD.curveTop);

    d +=
      (i === 0
        ? "M " + gSvgX(svgY) + " " + svgY
        : " L " + gSvgX(svgY) + " " + svgY);
  }

  return d;
}

function constrainedY(type, size) {
  if (type === "circle")
    return 12 + Math.random() * 220;

  return 12 +
    Math.random() *
    Math.max(8, FIELD.limitY - size - 16);
}

function curvePointAtT(t) {
  const clamped = Math.max(0.06, Math.min(0.94, t));

  const svgY =
    FIELD.limitY -
    clamped *
    (FIELD.limitY - FIELD.curveTop);

  return {
    x: gSvgX(svgY) - 16,
    y: svgY - 16,
    t: clamped
  };
}

function targetTFromPlacements(placements) {
  if (!placements.length) return 0.42;

  const span = FIELD.limitY - FIELD.curveTop;
  let heightBias = 0;
  let crowdBias = 0;

  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    const midY = p.y + 16;

    heightBias += Math.max(
      0,
      Math.min(1, (FIELD.limitY - midY) / span)
    );

    const gx = gSvgX(
      Math.max(
        FIELD.curveTop,
        Math.min(FIELD.limitY, midY)
      )
    );

    const dx = (p.x + 16) - gx;

    if (Math.abs(dx) < 70)
      crowdBias += dx >= 0 ? -0.04 : 0.04;
  }

  return Math.max(
    0.08,
    Math.min(
      0.92,
      heightBias / placements.length * 0.75 +
      0.12 +
      crowdBias
    )
  );
}

function slideSquareAlongCurve(el, fromT, toT) {
  if (curveSquareState.raf)
    cancelAnimationFrame(curveSquareState.raf);

  const start = performance.now();
  const dur = 520;

  function frame(now) {
    const u = Math.min(1, (now - start) / dur);
    const ease = u * u * (3 - 2 * u);

    const t =
      fromT +
      (toT - fromT) * ease;

    const p = curvePointAtT(t);

    el.setAttribute(
      "transform",
      "translate(" + p.x + "," + p.y + ")"
    );

    curveSquareState.t = t;

    if (u < 1)
      curveSquareState.raf =
        requestAnimationFrame(frame);
  }

  curveSquareState.raf =
    requestAnimationFrame(frame);
}

document.addEventListener("click", function (e) {
  const typeBtn =
    e.target.closest("[data-action='select-type']");

  if (typeBtn) {
    const selectedType =
      typeBtn.getAttribute("data-type");

    const output =
      document.getElementById("output");

    if (output)
      output.textContent =
        "TYPE SET " +
        selectedType +
        " selected. Initializing protocol...";

    initializeTypeProtocol(selectedType);
    return;
  }

  const cloudBtn =
    e.target.closest("[data-action='go-search']");

  if (cloudBtn) {
    window.open(
      "https://www.mozilla.org/en-US/firefox/new/",
      "_blank",
      "noopener"
    );
    return;
  }

  const pane =
    e.target.closest("[data-type-set]");

  if (
    pane &&
    pane.id &&
    pane.id.indexOf("type-set-") === 0
  ) {
    const key =
      pane.getAttribute("data-type-set");

    const meta = TYPE_SETS[key];

    const url =
      (meta && meta.href) ||
      pane.getAttribute("data-href");

    if (url)
      window.location.href = url;
  }
});
        "translate(0,0)"
      );

      ncMark.setAttribute(
        "font-size",
        "10"
      );

      ncMark.setAttribute(
        "fill",
        "#111"
      );

      ncMark.setAttribute(
        "pointer-events",
        "none"
      );

      ncMark.textContent = "N/C";

      svg.appendChild(ncMark);
    }

    if (
      shape.type === "circle"
    ) {
      const thetaText =
        document.createElementNS(
          svgNS,
          "text"
        );

      thetaText.setAttribute(
        "font-size",
        "10"
      );

      thetaText.setAttribute(
        "fill",
        "#111"
      );

      thetaText.setAttribute(
        "pointer-events",
        "none"
      );

      thetaText.setAttribute(
        "data-theta-zero-index",
        String(shape._circleIndex)
      );

      thetaText.textContent =
        shape.theta === 0
          ? "0"
          : shape.theta.toFixed(2);

      const tr =
        el.getAttribute(
          "transform"
        ) ||
        "translate(0,0)";

      const mm =
        /translate\(([^,]+),([^)]+)\)/
        .exec(tr);

      const tx =
        mm
          ? parseFloat(mm[1])
          : 0;

      const ty =
        mm
          ? parseFloat(mm[2])
          : 0;

      thetaText.setAttribute(
        "x",
        String(tx + 20)
      );

      thetaText.setAttribute(
        "y",
        String(ty - 4)
      );

      svg.appendChild(
        thetaText
      );

      checkThetaZero(
        shape._circleIndex,
        thetaText.textContent
      );
    }
  }

  SubstrState.lastCircles =
    circleRecords;

  if (firstSquareEl) {
    const target =
      targetTFromPlacements(
        placements
      );

    slideSquareAlongCurve(
      firstSquareEl,
      curveSquareState.t,
      target
    );
  }

  if (SubstrState.generated)
    drawClosestCircleLine();
}

function drawFigureEight() {
  const svg =
    document.getElementById(
      "eight-area"
    );

  if (!svg) return;

  svg.innerHTML = "";

  const NS =
    "http://www.w3.org/2000/svg";

  const cx = 220;
  const cy = 170;
  const scale = 130;

  const axes =
    document.createElementNS(
      NS,
      "g"
    );

  const xAxis =
    document.createElementNS(
      NS,
      "line"
    );

  xAxis.setAttribute(
    "x1",
    "30"
  );

  xAxis.setAttribute(
    "y1",
    String(cy)
  );

  xAxis.setAttribute(
    "x2",
    "410"
  );

  xAxis.setAttribute(
    "y2",
    String(cy)
  );

  xAxis.setAttribute(
    "stroke",
    "#999"
  );

  axes.appendChild(
    xAxis
  );

  const yAxis =
    document.createElementNS(
      NS,
      "line"
    );

  yAxis.setAttribute(
    "x1",
    String(cx)
  );

  yAxis.setAttribute(
    "y1",
    "20"
  );

  yAxis.setAttribute(
    "x2",
    String(cx)
  );

  yAxis.setAttribute(
    "y2",
    "320"
  );

  yAxis.setAttribute(
    "stroke",
    "#999"
  );

  axes.appendChild(
    yAxis
  );

  svg.appendChild(
    axes
  );

  const path =
    document.createElementNS(
      NS,
      "path"
    );

  let d = "";

  for (
    let i = 0;
    i <= 160;
    i++
  ) {
    const t =
      -1 +
      2 * (i / 160);

    const y =
      eightY(t);

    const px =
      cx +
      t * scale;

    const py =
      cy -
      y * scale;

    d +=
      (i === 0
        ? "M "
        : " L ") +
      px +
      " " +
      py;
  }

  for (
    let i = 160;
    i >= 0;
    i--
  ) {
    const t =
      -1 +
      2 * (i / 160);

    const y =
      -eightY(t);

    const px =
      cx +
      t * scale;

    const py =
      cy -
      y * scale;

    d +=
      " L " +
      px +
      " " +
      py;
  }

  d += " Z";

  path.setAttribute(
    "d",
    d
  );

  path.setAttribute(
    "fill",
    "none"
  );

  path.setAttribute(
    "stroke",
    "#111"
  );

  path.setAttribute(
    "stroke-width",
    "2"
  );

  svg.appendChild(
    path
  );

  const sectorNames = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
  ];

  for (
    let i = 0;
    i < sectorNames.length;
    i++
  ) {
    const id =
      sectorNames[i];

    const spec =
      SECTORS[id];

    const polygon =
      document.createElementNS(
        NS,
        "path"
      );

    const start =
      i * Math.PI / 2;

    const end =
      (i + 1) * Math.PI / 2;

    const points = [];

    points.push(
      [cx, cy]
    );

    for (
      let j = 0;
      j <= 20;
      j++
    ) {
      const a =
        start +
        (end - start) *
        (j / 20);

      const x =
        Math.cos(a);

      const y =
        Math.sin(a);

      const px =
        cx +
        x * 150;

      const py =
        cy +
        y * 150;

      points.push(
        [px, py]
      );
    }

    let pd = "";

    for (
      let j = 0;
      j < points.length;
      j++
    ) {
      pd +=
        (j === 0
          ? "M "
          : " L ") +
        points[j][0] +
        " " +
        points[j][1];
    }

    pd += " Z";

    polygon.setAttribute(
      "d",
      pd
    );

    polygon.setAttribute(
      "fill",
      spec.fill
    );

    polygon.setAttribute(
      "stroke",
      spec.solid
    );

    polygon.setAttribute(
      "stroke-width",
      "1"
    );

    polygon.setAttribute(
      "data-sector",
      id
    );

    polygon.style.cursor =
      "pointer";

    polygon.addEventListener(
      "click",
      function(ev) {
        ev.stopPropagation();
        selectSector(id);
      }
    );

    svg.appendChild(
      polygon
    );

    const label =
      document.createElementNS(
        NS,
        "text"
      );

    const angle =
      start +
      Math.PI / 4;

    label.setAttribute(
      "x",
      String(
        cx +
        Math.cos(angle) *
        90
      )
    );

    label.setAttribute(
      "y",
      String(
        cy +
        Math.sin(angle) *
        90
      )
    );

    label.setAttribute(
      "text-anchor",
      "middle"
    );

    label.setAttribute(
      "font-size",
      "16"
    );

    label.setAttribute(
      "font-weight",
      "700"
    );

    label.setAttribute(
      "fill",
      "#111"
    );

    label.setAttribute(
      "pointer-events",
      "none"
    );

    label.textContent =
      id;

    svg.appendChild(
      label
    );
  }
}

function selectSector(id) {
  const spec =
    SECTORS[id];

  if (!spec) return;

  sectorState.active =
    id;

  const modal =
    document.getElementById(
      "sector-modal"
    );

  const text =
    document.getElementById(
      "sector-modal-text"
    );

  if (text)
    text.textContent =
      spec.prompt;

  if (modal)
    modal.style.display =
      "flex";

  const output =
    document.getElementById(
      "output"
    );

  if (output) {
    output.textContent +=
      "\nSECTOR: " +
      id +
      "\nWORD: " +
      spec.word;
  }
}

function finishSectorPrompt(
  accepted
) {
  const id =
    sectorState.active;

  const spec =
    SECTORS[id];

  const modal =
    document.getElementById(
      "sector-modal"
    );

  if (modal)
    modal.style.display =
      "none";

  if (!spec) return;

  if (!accepted) {
    sectorState.active =
      null;

    return;
  }

  sectorState.counts[id] += 1;

  applyWordToRandomLine(
    spec.word
  );

  const output =
    document.getElementById(
      "output"
    );

  if (output) {
    output.textContent +=
      "\n" +
      id +
      " ACCEPTED: " +
      spec.word;
  }

  sectorState.active =
    null;
}

function applyWordToRandomLine(
  word
) {
  const output =
    document.getElementById(
      "output"
    );

  if (!output || !word)
    return;

  const lines =
    output.textContent
      .split("\n");

  const usable = [];

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const line =
      lines[i].trim();

    if (
      line &&
      line.indexOf("SECTOR:") !== 0 &&
      line.indexOf("WORD:") !== 0
    ) {
      usable.push(i);
    }
  }

  if (!usable.length) {
    lines.push(word);
  } else {
    const index =
      usable[
        Math.floor(
          Math.random() *
          usable.length
        )
      ];

    lines[index] =
      word;
  }

  output.textContent =
    lines.join("\n");
}

function drawSectorChart() {
  const svg =
    document.getElementById(
      "sector-chart"
    );

  if (!svg) return;

  svg.innerHTML = "";

  const NS =
    "http://www.w3.org/2000/svg";

  const labels = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
  ];

  const barWidth = 70;
  const gap = 20;
  const baseY = 130;

  for (
    let i = 0;
    i < labels.length;
    i++
  ) {
    const id =
      labels[i];

    const spec =
      SECTORS[id];

    const count =
      sectorState.counts[id];

    const height =
      Math.min(
        100,
        20 +
        count * 12
      );

    const x =
      20 +
      i *
      (barWidth + gap);

    const rect =
      document.createElementNS(
        NS,
        "rect"
      );

    rect.setAttribute(
      "x",
      String(x)
    );

    rect.setAttribute(
      "y",
      String(baseY - height)
    );

    rect.setAttribute(
      "width",
      String(barWidth)
    );

    rect.setAttribute(
      "height",
      String(height)
    );

    rect.setAttribute(
      "fill",
      spec.solid
    );

    rect.setAttribute(
      "data-sector",
      id
    );

    rect.style.cursor =
      "pointer";

    rect.addEventListener(
      "click",
      function(ev) {
        ev.stopPropagation();
        selectSector(id);
      }
    );

    svg.appendChild(
      rect
    );

    const text =
      document.createElementNS(
        NS,
        "text"
      );

    text.setAttribute(
      "x",
      String(
        x + barWidth / 2
      )
    );

    text.setAttribute(
      "y",
      String(baseY + 18)
    );

    text.setAttribute(
      "text-anchor",
      "middle"
    );

    text.setAttribute(
      "font-size",
      "14"
    );

    text.textContent =
      id;

    svg.appendChild(
      text
    );

    const countText =
      document.createElementNS(
        NS,
        "text"
      );

    countText.setAttribute(
      "x",
      String(
        x + barWidth / 2
      )
    );

    countText.setAttribute(
      "y",
      String(
        baseY -
        height -
        6
      )
    );

    countText.setAttribute(
      "text-anchor",
      "middle"
    );

    countText.setAttribute(
      "font-size",
      "12"
    );

    countText.textContent =
      String(count);

    svg.appendChild(
      countText
    );
  }
}

function updateRadianCircle(
  theta
) {
  const circle =
    document.getElementById(
      "radian-circle"
    );

  if (!circle) return;

  const angle =
    Number(theta);

  if (!isFinite(angle))
    return;

  const cx = 100;
  const cy = 100;
  const r = 70;

  const x =
    cx +
    Math.cos(angle) * r;

  const y =
    cy -
    Math.sin(angle) * r;

  const line =
    circle.querySelector(
      "[data-radian-line]"
    );

  if (line) {
    line.setAttribute(
      "x1",
      String(cx)
    );

    line.setAttribute(
      "y1",
      String(cy)
    );

    line.setAttribute(
      "x2",
      String(x)
    );

    line.setAttribute(
      "y2",
      String(y)
    );
  }
}

function initializeTypeProtocol(
  typeNumber
) {
  const key =
    String(typeNumber);

  const typeSet =
    TYPE_SETS[key];

  if (!typeSet)
    return;

  const output =
    document.getElementById(
      "output"
    );

  if (output) {
    output.textContent =
      typeSet.label +
      " selected.";
  }

  const callLine =
    document.getElementById(
      "call-box-line"
    );

  if (callLine)
    callLine.textContent =
      typeSet.label;

  const callId =
    document.getElementById(
      "call-box-id"
    );

  if (callId)
    callId.textContent =
      typeSet.id;

  const shapes =
    generateTypeShapes(
      key
    );

  drawSVGShapes(
    shapes
  );

  drawSectorChart();

  const theta =
    shapes.length
      ? shapes[0].theta
      : Math.PI / 6;

  updateRadianCircle(
    theta
  );
}

function createRadianCircle() {
  const old =
    document.getElementById(
      "radian-circle"
    );

  if (old) return old;

  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

  svg.id =
    "radian-circle";

  svg.setAttribute(
    "viewBox",
    "0 0 200 200"
  );

  svg.setAttribute(
    "width",
    "200"
  );

  svg.setAttribute(
    "height",
    "200"
  );

  svg.style.display =
    "block";

  svg.style.border =
    "1px solid #333";

  const NS =
    "http://www.w3.org/2000/svg";

  const circle =
    document.createElementNS(
      NS,
      "circle"
    );

  circle.setAttribute(
    "cx",
    "100"
  );

  circle.setAttribute(
    "cy",
    "100"
  );

  circle.setAttribute(
    "r",
    "70"
  );

  circle.setAttribute(
    "fill",
    "none"
  );

  circle.setAttribute(
    "stroke",
    "#111"
  );

  svg.appendChild(
    circle
  );

  const line =
    document.createElementNS(
      NS,
      "line"
    );

  line.setAttribute(
    "data-radian-line",
    "1"
  );

  line.setAttribute(
    "stroke",
    "#d00"
  );

  line.setAttribute(
    "stroke-width",
    "2"
  );

  svg.appendChild(
    line
  );

  const parent =
    document.getElementById(
      "svg-area"
    );

  if (parent)
    parent.parentNode.insertBefore(
      svg,
      parent
    );
  else
    document.body.appendChild(
      svg
    );

  return svg;
}
function generateTypeShapes(
  typeNumber
) {
  const key =
    String(typeNumber);

  const shapes = [];

  if (key === "1") {
    shapes.push(
      {
        type: "circle",
        cx: 70,
        cy: 80,
        r: 18,
        theta: 0
      },
      {
        type: "circle",
        cx: 150,
        cy: 60,
        r: 22,
        theta: Math.PI / 4
      },
      {
        type: "circle",
        cx: 240,
        cy: 100,
        r: 16,
        theta: Math.PI / 2
      },
      {
        type: "square",
        x: 60,
        y: 170,
        size: 32
      }
    );
  } else if (key === "2") {
    shapes.push(
      {
        type: "circle",
        cx: 80,
        cy: 90,
        r: 20,
        theta: Math.PI / 6
      },
      {
        type: "circle",
        cx: 170,
        cy: 70,
        r: 18,
        theta: Math.PI / 3
      },
      {
        type: "circle",
        cx: 260,
        cy: 120,
        r: 24,
        theta: Math.PI
      },
      {
        type: "square",
        x: 100,
        y: 180,
        size: 30
      }
    );
  } else {
    shapes.push(
      {
        type: "circle",
        cx: 70,
        cy: 70,
        r: 16,
        theta: Math.PI / 8
      },
      {
        type: "circle",
        cx: 160,
        cy: 110,
        r: 21,
        theta: Math.PI / 2
      },
      {
        type: "circle",
        cx: 250,
        cy: 80,
        r: 19,
        theta: Math.PI * 1.5
      },
      {
        type: "square",
        x: 150,
        y: 180,
        size: 34
      }
    );
  }

  for (
    let i = 0;
    i < shapes.length;
    i++
  ) {
    shapes[i]._circleIndex =
      i;
  }

  return shapes;
}

function drawSVGShapes(
  shapes
) {
  const svg =
    document.getElementById(
      "svg-area"
    );

  if (!svg) return;

  svg.innerHTML = "";

  const NS =
    "http://www.w3.org/2000/svg";

  const placements = [];
  const circleRecords = [];

  let firstSquareEl = null;

  for (
    let i = 0;
    i < shapes.length;
    i++
  ) {
    const shape =
      shapes[i];

    if (
      shape.type ===
      "circle"
    ) {
      const el =
        document.createElementNS(
          NS,
          "circle"
        );

      el.setAttribute(
        "cx",
        String(shape.cx)
      );

      el.setAttribute(
        "cy",
        String(shape.cy)
      );

      el.setAttribute(
        "r",
        String(shape.r)
      );

      el.setAttribute(
        "fill",
        "none"
      );

      el.setAttribute(
        "stroke",
        "#111"
      );

      el.setAttribute(
        "stroke-width",
        "2"
      );

      el.setAttribute(
        "data-shape",
        "circle"
      );

      el.setAttribute(
        "data-index",
        String(i)
      );

      el.style.cursor =
        "pointer";

      el.addEventListener(
        "click",
        function(ev) {
          ev.stopPropagation();

          handleServerTypeClick(
            "circle",
            this
          );

          updateRadianCircle(
            shape.theta
          );

          if (
            shape.theta === 0
          ) {
            openThetaZeroTB(
              String(
                shape._circleIndex
              )
            );
          }
        }
      );

      svg.appendChild(
        el
      );

      circleRecords.push({
        index: i,
        x: shape.cx,
        y: shape.cy
      });

      placements.push({
        type: "circle",
        x: shape.cx - 16,
        y: shape.cy - 16
      });
    }

    if (
      shape.type ===
      "square"
    ) {
      const el =
        document.createElementNS(
          NS,
          "rect"
        );

      el.setAttribute(
        "x",
        "0"
      );

      el.setAttribute(
        "y",
        "0"
      );

      el.setAttribute(
        "width",
        String(shape.size)
      );

      el.setAttribute(
        "height",
        String(shape.size)
      );

      el.setAttribute(
        "fill",
        "none"
      );

      el.setAttribute(
        "stroke",
        "#111"
      );

      el.setAttribute(
        "stroke-width",
        "2"
      );

      el.setAttribute(
        "data-shape",
        "square"
      );

      el.setAttribute(
        "data-index",
        String(i)
      );

      el.style.cursor =
        "pointer";

      const p =
        curvePointAtT(
          curveSquareState.t
        );

      el.setAttribute(
        "transform",
        "translate(" +
        p.x +
        "," +
        p.y +
        ")"
      );

      el.addEventListener(
        "click",
        function(ev) {
          ev.stopPropagation();

          const nextT =
            Math.min(
              0.94,
              curveSquareState.t +
              0.08
            );

          slideSquareAlongCurve(
            this,
            curveSquareState.t,
            nextT
          );
        }
      );

      svg.appendChild(
        el
      );

      firstSquareEl =
        firstSquareEl ||
        el;

      placements.push({
        type: "square",
        x: p.x,
        y: p.y
      });

      SquareLiterals.push({
        x: p.x,
        y: p.y,
        size: shape.size
      });
    }
  }

  const curve =
    document.createElementNS(
      NS,
      "path"
    );

  curve.setAttribute(
    "d",
    curvePathD()
  );

  curve.setAttribute(
    "fill",
    "none"
  );

  curve.setAttribute(
    "stroke",
    "#555"
  );

  curve.setAttribute(
    "stroke-width",
    "1.5"
  );

  curve.setAttribute(
    "stroke-dasharray",
    "4 4"
  );

  curve.setAttribute(
    "data-curve",
    "1"
  );

  svg.appendChild(
    curve
  );

  const title =
    document.createElementNS(
      NS,
      "text"
    );

  title.setAttribute(
    "x",
    "20"
  );

  title.setAttribute(
    "y",
    "20"
  );

  title.setAttribute(
    "font-size",
    "12"
  );

  title.setAttribute(
    "fill",
    "#111"
  );

  title.textContent =
    "TYPE SET SHAPES";

  svg.appendChild(
    title
  );

  const ncMark =
    document.createElementNS(
      NS,
      "text"
    );

  ncMark.setAttribute(
    "x",
    "340"
  );

  ncMark.setAttribute(
    "y",
    "28"
  );

  ncMark.setAttribute(
    "font-size",
    "11"
  );

  ncMark.setAttribute(
    "fill",
    "#111"
  );

  ncMark.setAttribute(
    "data-nc-mark",
    "1"
  );

  ncMark.textContent =
    "N/C";

  svg.appendChild(
    ncMark
  );

  for (
    let i = 0;
    i < shapes.length;
    i++
  ) {
    const shape =
      shapes[i];

    if (
      shape.type ===
      "circle"
    ) {
      const thetaText =
        document.createElementNS(
          NS,
          "text"
        );

      thetaText.setAttribute(
        "font-size",
        "10"
      );

      thetaText.setAttribute(
        "fill",
        "#111"
      );

      thetaText.setAttribute(
        "pointer-events",
        "none"
      );

      thetaText.setAttribute(
        "data-theta-zero-index",
        String(
          shape._circleIndex
        )
      );

      thetaText.textContent =
        shape.theta === 0
          ? "0"
          : shape.theta.toFixed(2);

      thetaText.setAttribute(
        "x",
        String(shape.cx + shape.r + 4)
      );

      thetaText.setAttribute(
        "y",
        String(shape.cy - shape.r - 4)
      );

      svg.appendChild(
        thetaText
      );

      checkThetaZero(
        shape._circleIndex,
        thetaText.textContent
      );
    }
  }

  SubstrState.lastCircles =
    circleRecords;

  if (firstSquareEl) {
    const target =
      targetTFromPlacements(
        placements
      );

    slideSquareAlongCurve(
      firstSquareEl,
      curveSquareState.t,
      target
    );
  }

  if (
    SubstrState.generated
  ) {
    drawClosestCircleLine();
  }
}

function handleServerTypeClick(
  kind,
  el
) {
  const spec =
    ServerTypes[kind];

  if (!spec) return;

  if (
    kind === "circle"
  ) {
    writeTrLine(
      circleTimeExponential()
    );
  }
}

function circleTimeExponential() {
  const n =
    Math.max(
      1,
      SubstrState.result
        ? SubstrState.result.length
        : 1
    );

  n.toExponential();

  return (
    n.toFixed(1) +
    "^1"
  );
}

function writeTrLine(
  text
) {
  const output =
    document.getElementById(
      "output"
    );

  if (!output) return;

  output.textContent +=
    "\n" +
    String(text);
}

function updateCallBox(
  typeNumber
) {
  const key =
    String(typeNumber);

  const meta =
    TYPE_SETS[key];

  const line =
    document.getElementById(
      "call-box-line"
    );

  const id =
    document.getElementById(
      "call-box-id"
    );

  if (line) {
    line.textContent =
      meta
        ? meta.label
        : "unknown type";
  }

  if (id) {
    id.textContent =
      meta
        ? meta.id
        : "";
  }
}

function bindTypeButtons() {
  const buttons =
    document.querySelectorAll(
      "[data-action='select-type']"
    );

  for (
    let i = 0;
    i < buttons.length;
    i++
  ) {
    const btn =
      buttons[i];

    if (
      btn.getAttribute(
        "data-bound"
      )
    ) {
      continue;
    }

    btn.setAttribute(
      "data-bound",
      "1"
    );

    btn.addEventListener(
      "click",
      function(ev) {
        ev.stopPropagation();

        const type =
          this.getAttribute(
            "data-type"
          );

        initializeTypeProtocol(
          type
        );
      }
    );
  }
}

function bindServerTypeButtons() {
  const buttons =
    document.querySelectorAll(
      "[data-server-type]"
    );

  for (
    let i = 0;
    i < buttons.length;
    i++
  ) {
    const btn =
      buttons[i];

    if (
      btn.getAttribute(
        "data-bound"
      )
    ) {
      continue;
    }

    btn.setAttribute(
      "data-bound",
      "1"
    );

    btn.addEventListener(
      "click",
      function(ev) {
        ev.stopPropagation();

        const kind =
          this.getAttribute(
            "data-server-type"
          );

        handleServerTypeClick(
          kind,
          this
        );
      }
    );
  }
}

function refreshProtocolUI(
  typeNumber
) {
  updateCallBox(
    typeNumber
  );

  bindTypeButtons();
  bindServerTypeButtons();

  const output =
    document.getElementById(
      "output"
    );

  if (
    output &&
    !output.textContent
  ) {
    output.textContent =
      "Protocol ready.";
  }
}

function protocolTick() {
  const output =
    document.getElementById(
      "output"
    );

  if (!output) return;

  const now =
    new Date();

  const stamp =
    now.toLocaleTimeString();

  const line =
    "tick " +
    stamp;

  if (
    output.textContent.length >
    4000
  ) {
    output.textContent =
      output.textContent.slice(
        -3000
      );
  }

  output.textContent +=
    "\n" +
    line;
}

function startProtocolTicker() {
  if (
    window.__PROTOCOL_TICKER__
  ) {
    return;
  }

  window.__PROTOCOL_TICKER__ =
    setInterval(
      protocolTick,
      30000
    );
}

function stopProtocolTicker() {
  if (
    window.__PROTOCOL_TICKER__
  ) {
    clearInterval(
      window.__PROTOCOL_TICKER__
    );

    window.__PROTOCOL_TICKER__ =
      null;
  }
}

function exposeProtocolAPI() {
  window.OutcomeProtocol = {
    initialize:
      initializeTypeProtocol,

    selectSector:
      selectSector,

    generateSubstr:
      generateUserSubstr,

    resetTheta:
      resetThetaZeroCycle,

    getState:
      function() {
        return {
          sector:
            Object.assign(
              {},
              sectorState
            ),

          substr:
            Object.assign(
              {},
              SubstrState
            ),

          curveT:
            curveSquareState.t
        };
      }
  };
}

function initializeProtocol() {
  ensureHostNodes();
  createRadianCircle();

  const current =
    document.body.getAttribute(
      "data-type"
    ) ||
    "1";

  refreshProtocolUI(
    current
  );

  exposeProtocolAPI();
  startProtocolTicker();
}

function boot() {
  ensureHostNodes();
  drawFigureEight();
  drawSectorChart();
  initializeTypeProtocol("1");
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    boot
  );
} else {
  boot();
}
          y *
          scale
        );
    }

    d +=
      " Z";
  }

  return d;
}

function drawFigureEight() {
  const svg =
    document.getElementById(
      "eight-area"
    );

  if (!svg) return;

  svg.innerHTML = "";

  const NS =
    "http://www.w3.org/2000/svg";

  const ox = 220;
  const oy = 170;
  const scale = 140;

  const xA =
    document.createElementNS(
      NS,
      "line"
    );

  xA.setAttribute(
    "x1",
    "40"
  );

  xA.setAttribute(
    "x2",
    "400"
  );

  xA.setAttribute(
    "y1",
    String(oy)
  );

  xA.setAttribute(
    "y2",
    String(oy)
  );

  xA.setAttribute(
    "stroke",
    "#444"
  );

  svg.appendChild(xA);

  const yA =
    document.createElementNS(
      NS,
      "line"
    );

  yA.setAttribute(
    "x1",
    String(ox)
  );

  yA.setAttribute(
    "x2",
    String(ox)
  );

  yA.setAttribute(
    "y1",
    "24"
  );

  yA.setAttribute(
    "y2",
    "316"
  );

  yA.setAttribute(
    "stroke",
    "#444"
  );

  svg.appendChild(yA);

  const defs = [
    ["Q1", 1, 1],
    ["Q2", -1, 1],
    ["Q3", -1, -1],
    ["Q4", 1, -1]
  ];

  for (
    var i = 0;
    i < defs.length;
    i++
  ) {
    const id =
      defs[i][0];

    const sx =
      defs[i][1];

    const sy =
      defs[i][2];

    const meta =
      SECTORS[id];

    const p =
      document.createElementNS(
        NS,
        "path"
      );

    p.setAttribute(
      "d",
      sectorPath(
        sx,
        sy,
        ox,
        oy,
        scale
      )
    );

    p.setAttribute(
      "fill",
      meta.fill
    );

    p.setAttribute(
      "stroke",
      meta.solid
    );

    p.setAttribute(
      "stroke-width",
      "1.6"
    );

    p.style.cursor =
      "pointer";

    p.addEventListener(
      "click",
      (function(
        sectorId
      ) {
        return function() {
          selectSector(
            sectorId
          );
        };
      })(id)
    );

    svg.appendChild(p);

    const lab =
      document.createElementNS(
        NS,
        "text"
      );

    lab.setAttribute(
      "x",
      String(
        ox +
        sx *
        scale *
        0.55
      )
    );

    lab.setAttribute(
      "y",
      String(
        oy -
        sy *
        scale *
        0.28
      )
    );

    lab.setAttribute(
      "text-anchor",
      "middle"
    );

    lab.setAttribute(
      "font-size",
      "12"
    );

    lab.setAttribute(
      "pointer-events",
      "none"
    );

    lab.textContent =
      id;

    svg.appendChild(lab);
  }
}

function snippetFor(id) {
  const m =
    SECTORS[id];

  return [
    "<div id=\"" +
      m.div +
      "\" data-sector=\"" +
      id +
      "\" data-area=\"1/3\">",

    "  <script>",

    "    window.SECTORS = window.SECTORS || {};",

    "    window.SECTORS." +
      id +
      " = { id: \"" +
      m.div +
      "\", area: 1/3, signs: { x: " +
      m.x +
      ", y: " +
      m.y +
      " } };",

    "  </script>",

    "</div>"
  ].join("\n");
}

function drawSectorChart() {
  const svg =
    document.getElementById(
      "sector-chart"
    );

  if (!svg) return;

  svg.innerHTML = "";

  const NS =
    "http://www.w3.org/2000/svg";

  const keys = [
    "Q1",
    "Q2",
    "Q3",
    "Q4"
  ];

  const max =
    Math.max(
      1,
      sectorState.counts.Q1,
      sectorState.counts.Q2,
      sectorState.counts.Q3,
      sectorState.counts.Q4
    );

  for (
    var i = 0;
    i < keys.length;
    i++
  ) {
    const k =
      keys[i];

    const h =
      (
        sectorState.counts[k] /
        max
      ) * 100;

    const x =
      40 +
      i *
      90;

    const meta =
      SECTORS[k];

    const bar =
      document.createElementNS(
        NS,
        "rect"
      );

    bar.setAttribute(
      "x",
      String(x)
    );

    bar.setAttribute(
      "y",
      String(120 - h)
    );

    bar.setAttribute(
      "width",
      "48"
    );

    bar.setAttribute(
      "height",
      String(
        Math.max(h, 2)
      )
    );

    bar.setAttribute(
      "fill",
      sectorState.active === k
        ? meta.solid
        : meta.fill
    );

    bar.setAttribute(
      "stroke",
      meta.solid
    );

    bar.style.cursor =
      "pointer";

    bar.addEventListener(
      "click",
      (function(
        sectorId
      ) {
        return function() {
          selectSector(
            sectorId
          );
        };
      })(k)
    );

    svg.appendChild(bar);

    const lab =
      document.createElementNS(
        NS,
        "text"
      );

    lab.setAttribute(
      "x",
      String(x + 24)
    );

    lab.setAttribute(
      "y",
      "138"
    );

    lab.setAttribute(
      "text-anchor",
      "middle"
    );

    lab.setAttribute(
      "font-size",
      "11"
    );

    lab.textContent =
      k;

    svg.appendChild(lab);
  }
}

function applyWordToRandomLine(
  source,
  word
) {
  const lines =
    source.split("\n");

  const idxs = [];

  for (
    var i = 0;
    i < lines.length;
    i++
  ) {
    if (
      lines[i].trim()
    )
      idxs.push(i);
  }

  if (!idxs.length)
    return source;

  const pick =
    idxs[
      Math.floor(
        Math.random() *
        idxs.length
      )
    ];

  lines[pick] =
    word;

  return lines.join(
    "\n"
  );
}

var pendingSector =
  null;

function finishSectorPrompt(
  accepted
) {
  const modal =
    document.getElementById(
      "sector-modal"
    );

  if (modal)
    modal.style.display =
      "none";

  const id =
    pendingSector;

  pendingSector =
    null;

  if (!id) return;

  const m =
    SECTORS[id];

  sectorState.active =
    id;

  sectorState.counts[id] +=
    1;

  drawFigureEight();
  drawSectorChart();

  let snippet =
    snippetFor(id);

  if (accepted)
    snippet =
      applyWordToRandomLine(
        snippet,
        m.word
      );

  const output =
    document.getElementById(
      "output"
    );

  if (output) {
    output.textContent =
      "SECTOR " +
      id +
      " selected\n" +
      "host div: #" +
      m.div +
      "\n" +
      "enclosed area: 1/3   (full figure-eight = 4/3)\n" +
      "prompt word: " +
      m.word +
      "\n" +
      "replace line: " +
      (
        accepted
          ? "YES - one random line swapped for \"" +
            m.word +
            "\""
          : "NO - snippet unchanged"
      );
  }

  const codeOut =
    document.getElementById(
      "code-out"
    );

  if (codeOut)
    codeOut.textContent =
      snippet;
}

function selectSector(id) {
  const m =
    SECTORS[id];

  pendingSector =
    id;

  const text =
    document.getElementById(
      "sector-modal-text"
    );

  const modal =
    document.getElementById(
      "sector-modal"
    );

  if (!modal || !text) {
    finishSectorPrompt(
      window.confirm(
        m.prompt
      )
    );
    return;
  }

  text.textContent =
    m.prompt;

  modal.style.display =
    "flex";
}

function boot() {
  ensureHostNodes();
  drawFigureEight();
  drawSectorChart();
  initializeTypeProtocol("1");
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    boot
  );
} else {
  boot();
}
