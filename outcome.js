<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>θ vector + four-sector figure-eight</title>
  <style>
    :root {
      --bg: #0e1116;
      --panel: #171c24;
      --ink: #e8edf4;
      --muted: #9aa6b5;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: var(--bg); color: var(--ink); }
    header { padding: 16px 20px 8px; }
    h1 { font-size: 18px; margin: 0 0 6px; }
    p.note { margin: 0; color: var(--muted); font-size: 13px; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; padding: 8px 20px 12px; }
    button { background: #243044; color: var(--ink); border: 1px solid #334155; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    #radian-circle { margin: 0 20px 12px; display: inline-block; padding: 8px 14px; border: 1px solid #3b82f6; border-radius: 999px; }
    #radian-circle .vec { color: #93c5fd; margin-left: 8px; }
    .wrap { margin: 0 20px 16px; }
    .panel { background: var(--panel); border: 1px solid #2a3342; border-radius: 12px; padding: 10px; margin-bottom: 12px; }
    .label { font-size: 11px; color: var(--muted); text-transform: uppercase; margin: 0 0 8px; }
    #svg-area, #eight-area, #sector-chart { display: block; width: 100%; background: #0b0f14; border-radius: 8px; }
    #svg-area { height: 220px; }
    #eight-area { height: 340px; }
    #sector-chart { height: 160px; }
    #output, #code-out { margin: 0 20px 16px; white-space: pre-wrap; background: #10151c; border: 1px solid #2a3342; border-radius: 8px; padding: 12px; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12.5px; }
    #code-out { color: #bbf7d0; }
    .sectors-dom { display: none; }
    .sector-path { cursor: pointer; }
    .sector-path.active { stroke: #fff; stroke-width: 2; }
  </style>
</head>
<body>
  <header>
    <h1>Type set square + θ vector + four-sector curve</h1>
    <p class="note">Figure-eight y² = x² − x⁴ sits under the θ vector. Click a sector to bind its div / script hook.</p>
  </header>

  <div class="row">
    <button data-action="select-type" data-type="1">TYPE SET 1</button>
    <button data-action="select-type" data-type="2">TYPE SET 2</button>
    <button data-action="select-type" data-type="3">TYPE SET 3</button>
    <button data-action="go-search">JR.CLOUD</button>
  </div>

  <div id="radian-circle">θ = — <span class="vec">vector ▸</span></div>

  <div class="wrap">
    <div class="panel">
      <p class="label">Type set square</p>
      <svg id="svg-area" viewBox="0 0 400 220"></svg>
    </div>
    <div class="panel">
      <p class="label">Sector chart (each enclosed lobe = 1/3)</p>
      <svg id="sector-chart" viewBox="0 0 400 160"></svg>
    </div>
  </div>

  <div class="wrap">
    <div class="panel">
      <p class="label">Cartesian field under θ — four interactive sectors</p>
      <svg id="eight-area" viewBox="0 0 440 340"></svg>
    </div>
  </div>

  <div class="sectors-dom">
    <div id="sector-q1" data-sector="Q1"><script type="application/json" id="script-q1">{"id":"sector-q1","loop":"right","sign":"+ +","area":"1/3"}</script></div>
    <div id="sector-q2" data-sector="Q2"><script type="application/json" id="script-q2">{"id":"sector-q2","loop":"left","sign":"− +","area":"1/3"}</script></div>
    <div id="sector-q3" data-sector="Q3"><script type="application/json" id="script-q3">{"id":"sector-q3","loop":"left","sign":"− −","area":"1/3"}</script></div>
    <div id="sector-q4" data-sector="Q4"><script type="application/json" id="script-q4">{"id":"sector-q4","loop":"right","sign":"+ −","area":"1/3"}</script></div>
  </div>

  <pre id="output">Select a TYPE SET, then click a sector on the figure-eight.</pre>
  <pre id="code-out">/* sector markup appears here */</pre>

<script>
/* keep the script from theta-figure-eight.html — same file you just opened */
</script>
</body>
</html>
