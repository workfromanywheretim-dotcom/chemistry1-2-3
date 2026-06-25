window.initPageExtras = function(){
  initAtomBuilder();
  initPeriodicTable();
  initTrendCharts();
  initTrendExplorer();
};

function getBySymbol(sym){
  return window.ELEMENTS.find(function(e){ return e.sym === sym; });
}

/* ---------------- Atom builder ---------------- */
function initAtomBuilder(){
  var stage = document.getElementById('atomStage');
  if (!stage) return;

  var state = { protons: 6, neutrons: 6, electrons: 6 };
  var limits = { protons: [0,36], neutrons: [0,48], electrons: [0,36] };

  var shellRadii = [60, 95, 128, 158];
  var shellDurations = [7, 11, 15, 19];

  function clamp(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); }

  function render(){
    stage.innerHTML = '';

    var total = state.protons + state.neutrons;
    var dotSize = clamp(70 / Math.sqrt(total || 1), 4, 11);
    var nucleusSize = clamp(40 + total * 1.1, 40, 130);

    var nucleus = document.createElement('div');
    nucleus.className = 'atom-nucleus';
    nucleus.style.width = nucleusSize + 'px';
    nucleus.style.height = nucleusSize + 'px';

    for (var p = 0; p < state.protons; p++){
      var pDot = document.createElement('span');
      pDot.className = 'nucleon proton';
      pDot.style.width = dotSize + 'px';
      pDot.style.height = dotSize + 'px';
      nucleus.appendChild(pDot);
    }
    for (var n = 0; n < state.neutrons; n++){
      var nDot = document.createElement('span');
      nDot.className = 'nucleon neutron';
      nDot.style.width = dotSize + 'px';
      nDot.style.height = dotSize + 'px';
      nucleus.appendChild(nDot);
    }
    stage.appendChild(nucleus);

    var shells = window.computeShells(state.electrons);
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    shells.forEach(function(count, idx){
      var r = shellRadii[idx] || (shellRadii[shellRadii.length-1] + 30*(idx-3));
      var ring = document.createElement('div');
      ring.className = 'atom-shell';
      ring.style.width = (r*2) + 'px';
      ring.style.height = (r*2) + 'px';
      stage.appendChild(ring);

      if (count <= 0) return;
      var orbit = document.createElement('div');
      orbit.className = 'electron-orbit';
      if (!prefersReduced){
        orbit.style.animationDuration = (shellDurations[idx] || 20) + 's';
      }
      for (var e = 0; e < count; e++){
        var angle = (360 / count) * e;
        var electron = document.createElement('span');
        electron.className = 'electron';
        electron.style.transform = 'translate(-50%,-50%) rotate(' + angle + 'deg) translateX(' + r + 'px)';
        orbit.appendChild(electron);
      }
      stage.appendChild(orbit);
    });

    updateReadout();
  }

  function updateReadout(){
    var el = window.getElementByZ(state.protons);
    var mass = state.protons + state.neutrons;
    var charge = state.protons - state.electrons;
    var chargeLabel = charge === 0 ? '0' : (charge > 0 ? '+' + charge : '−' + Math.abs(charge));

    var nameTh = el ? window.getElementNameTh(el.z) : '';
    document.getElementById('rdSymbol').textContent = el ? el.sym : '—';
    document.getElementById('rdName').innerHTML = el
      ? el.name + (nameTh ? ' <span class="lang-th">' + nameTh + '</span>' : '')
      : (state.protons === 0
          ? 'No element (0 protons)<span class="lang-th">ไม่มีธาตุ (ไม่มีโปรตอน)</span>'
          : 'Unknown<span class="lang-th">ไม่รู้จัก</span>');
    document.getElementById('rdAtomicNum').textContent = state.protons;
    document.getElementById('rdMassNum').textContent = mass;
    document.getElementById('rdCharge').textContent = chargeLabel;

    var summary = document.getElementById('rdSummary');
    if (state.protons === 0){
      summary.innerHTML = 'Every element is defined by its number of protons. Add at least one proton to build a recognizable atom.' +
        '<span class="lang-th">ธาตุทุกชนิดถูกกำหนดด้วยจำนวนโปรตอน เติมโปรตอนอย่างน้อยหนึ่งตัวเพื่อสร้างอะตอมที่จำแนกได้</span>';
    } else if (!el){
      summary.innerHTML = 'This module covers elements 1–36 (periods 1–4). ' + state.protons + ' protons is beyond that range.' +
        '<span class="lang-th">บทเรียนนี้ครอบคลุมธาตุที่ 1–36 (คาบที่ 1–4) ' + state.protons + ' โปรตอนอยู่นอกช่วงดังกล่าว</span>';
    } else {
      var standardNeutrons = Math.round(el.mass) - el.z;
      var partsEn = [];
      var partsTh = [];
      if (state.neutrons === standardNeutrons){
        partsEn.push(el.name + '-' + mass + ' is the most common form of ' + el.name + '.');
        partsTh.push(el.name + '-' + mass + ' เป็นรูปแบบที่พบมากที่สุดของ' + (nameTh || el.name) + '');
      } else {
        partsEn.push(el.name + '-' + mass + ' is an isotope of ' + el.name + ' (the most common form has ' + standardNeutrons + ' neutrons).');
        partsTh.push(el.name + '-' + mass + ' เป็นไอโซโทปของ' + (nameTh || el.name) + ' (รูปแบบที่พบมากที่สุดมีนิวตรอน ' + standardNeutrons + ' ตัว)');
      }
      if (charge !== 0){
        partsEn.push('With ' + state.electrons + ' electrons against ' + state.protons + ' protons, it carries a ' + chargeLabel + ' charge — it’s an ' + (charge > 0 ? 'cation' : 'anion') + ', not a neutral atom.');
        partsTh.push('มีอิเล็กตรอน ' + state.electrons + ' ตัว เทียบกับโปรตอน ' + state.protons + ' ตัว จึงมีประจุ ' + chargeLabel + ' — เป็น' + (charge > 0 ? 'ไอออนบวก (cation)' : 'ไอออนลบ (anion)') + ' ไม่ใช่อะตอมที่เป็นกลาง');
      } else {
        partsEn.push('Protons and electrons are equal, so it’s electrically neutral.');
        partsTh.push('โปรตอนและอิเล็กตรอนมีจำนวนเท่ากัน จึงเป็นกลางทางไฟฟ้า');
      }
      summary.innerHTML = partsEn.join(' ') + '<span class="lang-th">' + partsTh.join(' ') + '</span>';
    }
  }

  function wireStepper(name){
    var row = document.querySelector('[data-particle="' + name + '"]');
    var countEl = row.querySelector('.count');
    var minusBtn = row.querySelector('[data-step="-1"]');
    var plusBtn = row.querySelector('[data-step="1"]');

    function refreshButtons(){
      countEl.textContent = state[name];
      minusBtn.disabled = state[name] <= limits[name][0];
      plusBtn.disabled = state[name] >= limits[name][1];
    }
    minusBtn.addEventListener('click', function(){
      state[name] = clamp(state[name]-1, limits[name][0], limits[name][1]);
      refreshButtons(); render();
    });
    plusBtn.addEventListener('click', function(){
      state[name] = clamp(state[name]+1, limits[name][0], limits[name][1]);
      refreshButtons(); render();
    });
    refreshButtons();
  }

  ['protons','neutrons','electrons'].forEach(wireStepper);

  window.loadElementIntoBuilder = function(z){
    var el = window.getElementByZ(z);
    if (!el) return;
    state.protons = el.z;
    state.neutrons = Math.round(el.mass) - el.z;
    state.electrons = el.z;
    ['protons','neutrons','electrons'].forEach(function(name){
      document.querySelector('[data-particle="' + name + '"] .count').textContent = state[name];
      document.querySelector('[data-particle="' + name + '"] [data-step="-1"]').disabled = state[name] <= limits[name][0];
      document.querySelector('[data-particle="' + name + '"] [data-step="1"]').disabled = state[name] >= limits[name][1];
    });
    render();
    var builderSection = document.getElementById('atom-builder');
    if (builderSection) builderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  render();
}

/* ---------------- Periodic table ---------------- */
function initPeriodicTable(){
  var grid = document.getElementById('ptableGrid');
  if (!grid) return;

  var byPeriodGroup = {};
  window.ELEMENTS.forEach(function(e){ byPeriodGroup[e.period + '-' + e.group] = e; });

  for (var period = 1; period <= 4; period++){
    for (var group = 1; group <= 18; group++){
      var el = byPeriodGroup[period + '-' + group];
      var cell = document.createElement(el ? 'button' : 'div');
      if (el){
        cell.className = 'ptable-cell cat-' + el.category;
        cell.innerHTML = '<span class="pt-num">' + el.z + '</span><span class="pt-sym">' + el.sym + '</span>';
        cell.setAttribute('aria-label', el.name);
        cell.addEventListener('click', function(elem){
          return function(){ showElementDetail(elem); };
        }(el));
      } else {
        cell.className = 'ptable-cell is-empty';
      }
      grid.appendChild(cell);
    }
  }

  function showElementDetail(el){
    var detail = document.getElementById('ptableDetail');
    detail.classList.add('is-visible');
    detail.style.display = 'flex';
    var catLabel = window.ELEMENT_CATEGORY_LABEL[el.category];
    var catLabelTh = window.ELEMENT_CATEGORY_LABEL_TH[el.category];
    var nameTh = window.getElementNameTh(el.z);
    var valence = '—', valenceTh = '—';
    if (el.group <= 2){ valence = String(el.group); valenceTh = valence; }
    else if (el.group >= 13){ valence = String(el.group - 10); valenceTh = valence; }
    else { valence = 'variable (d-block)'; valenceTh = 'ไม่แน่นอน (กลุ่ม d-block)'; }

    detail.innerHTML =
      '<div class="pd-symbol">' + el.sym + '</div>' +
      '<div class="pd-meta">' +
        '<h4>' + el.name + ' · #' + el.z + (nameTh ? ' <span class="lang-th">' + nameTh + '</span>' : '') + '</h4>' +
        '<p>' + catLabel + ' · Period ' + el.period + ', Group ' + el.group +
          '<span class="lang-th">' + catLabelTh + ' · คาบที่ ' + el.period + ', หมู่ที่ ' + el.group + '</span></p>' +
      '</div>' +
      '<div class="pd-stats">' +
        '<div>Atomic mass<span class="lang-th">มวลอะตอม</span><strong>' + el.mass.toFixed(2) + '</strong></div>' +
        '<div>Atomic radius<span class="lang-th">รัศมีอะตอม</span><strong>' + el.radius + ' pm</strong></div>' +
        '<div>Electronegativity<span class="lang-th">อิเล็กโทรเนกาติวิตี</span><strong>' + (el.electroneg !== null ? el.electroneg.toFixed(2) : 'n/a') + '</strong></div>' +
        '<div>Valence electrons<span class="lang-th">อิเล็กตรอนวงนอก</span><strong>' + valence + '</strong></div>' +
      '</div>' +
      '<button class="btn btn-primary btn-sm" id="loadIntoBuilderBtn">Build this atom ↑<span class="lang-th">สร้างอะตอมนี้ ↑</span></button>';

    document.getElementById('loadIntoBuilderBtn').addEventListener('click', function(){
      window.loadElementIntoBuilder(el.z);
    });
  }

  showElementDetail(getBySymbol('C'));
}

/* ---------------- Trend charts ---------------- */
function initTrendCharts(){
  renderTrendChart('trendPeriod3Radius', ['Na','Mg','Al','Si','P','S','Cl','Ar'], 'radius', 'pm');
  renderTrendChart('trendGroup1Radius', ['Li','Na','K'], 'radius', 'pm');
  renderTrendChart('trendPeriod2Electroneg', ['Li','Be','B','C','N','O','F'], 'electroneg', '');
}

function renderTrendChart(containerId, symbols, key, unit){
  var container = document.getElementById(containerId);
  if (!container) return;
  var items = symbols.map(getBySymbol).filter(Boolean);
  var max = Math.max.apply(null, items.map(function(e){ return e[key] || 0; }));

  container.innerHTML = items.map(function(e){
    var val = e[key];
    var pct = val ? (val / max * 100) : 0;
    var display = val !== null && val !== undefined ? (Math.round(val*100)/100) + unit : 'n/a';
    return (
      '<div class="trend-row">' +
        '<span class="trend-label">' + e.name + ' (' + e.sym + ')</span>' +
        '<div class="trend-track"><div class="trend-fill" style="width:' + pct + '%;background:linear-gradient(90deg,var(--teal-mid),var(--amber));"></div></div>' +
        '<span style="width:64px;text-align:right;font-size:.8rem;color:var(--ink-soft);">' + display + '</span>' +
      '</div>'
    );
  }).join('');
}

/* ---------------- Trend explorer ---------------- */
function initTrendExplorer(){
  var slider = document.getElementById('trendSlider');
  var stage = document.getElementById('trendSizeAtom');
  var elLabel = document.getElementById('trendElLabel');
  var radiusVal = document.getElementById('trendRadiusVal');
  var enVal = document.getElementById('trendEnVal');
  var enMeterWrap = document.getElementById('trendEnMeterWrap');
  var graph = document.getElementById('trendGraph');
  var explain = document.getElementById('trendExplain');
  if (!slider || !graph) return;

  var W = 600, H = 170;
  var radii = window.ELEMENTS.map(function(e){ return e.radius; });
  var minR = Math.min.apply(null, radii), maxR = Math.max.apply(null, radii);
  var n = window.ELEMENTS.length;

  function xScale(z){ return ((z - 1) / (n - 1)) * W; }
  function yScale(r){ var t = (r - minR) / (maxR - minR); return H - t * H; }

  var d = window.ELEMENTS.map(function(e, i){
    return (i === 0 ? 'M' : 'L') + xScale(e.z).toFixed(1) + ',' + yScale(e.radius).toFixed(1);
  }).join(' ');

  graph.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  graph.innerHTML =
    '<line class="axis" x1="0" y1="' + H + '" x2="' + W + '" y2="' + H + '"></line>' +
    '<path class="line" d="' + d + '"></path>' +
    '<line class="guide" id="trendGuide" x1="0" y1="0" x2="0" y2="' + H + '"></line>' +
    '<circle class="marker" id="trendMarker" r="6" cx="0" cy="0"></circle>';
  var guide = document.getElementById('trendGuide');
  var marker = document.getElementById('trendMarker');

  var minSize = 28, maxSize = 140;

  function update(){
    var z = parseInt(slider.value, 10);
    var el = window.getElementByZ(z);
    if (!el) return;

    var size = minSize + (el.radius - minR) / (maxR - minR) * (maxSize - minSize);
    stage.style.width = size + 'px';
    stage.style.height = size + 'px';
    stage.style.background = 'var(--cat-' + el.category + ')';
    stage.style.color = (el.category === 'alkaline') ? 'var(--ink)' : 'var(--white)';
    stage.textContent = el.sym;

    elLabel.textContent = el.name + ' (' + el.sym + ') · Z=' + el.z;
    radiusVal.textContent = el.radius + ' pm';
    enVal.textContent = el.electroneg !== null ? el.electroneg.toFixed(2) : 'n/a';

    if (el.electroneg !== null){
      var minEN = 0.7, maxEN = 4.0;
      var pct = Math.max(0, Math.min(100, (el.electroneg - minEN) / (maxEN - minEN) * 100));
      enMeterWrap.innerHTML = '<div class="electroneg-meter"><div class="electroneg-pin" data-label="' +
        el.sym + ' ' + el.electroneg.toFixed(2) + '" style="left:' + pct + '%;background:var(--teal-deep);"></div></div>';
    } else {
      enMeterWrap.innerHTML = '<p style="color:var(--ink-soft);font-size:.82rem;margin:0;">Noble gases don’t form bonds in the usual sense, so electronegativity isn’t defined here.<span class="lang-th">แก๊สมีตระกูลไม่สร้างพันธะตามปกติ จึงไม่มีค่าอิเล็กโทรเนกาติวิตีที่กำหนดไว้สำหรับธาตุนี้</span></p>';
    }

    var x = xScale(z), y = yScale(el.radius);
    guide.setAttribute('x1', x); guide.setAttribute('x2', x);
    marker.setAttribute('cx', x); marker.setAttribute('cy', y);

    var prev = window.getElementByZ(z - 1);
    var explainEn, explainTh;
    if (z === 1){
      explainEn = 'Hydrogen has just one proton and one shell — the smallest possible atom.';
      explainTh = 'ไฮโดรเจนมีโปรตอนเพียงตัวเดียวและมีอิเล็กตรอนชั้นเดียว จึงเป็นอะตอมที่เล็กที่สุดที่เป็นไปได้';
    } else if (prev && el.period > prev.period){
      explainEn = 'New period, new outer shell: ' + el.name + ' starts filling a shell farther from the nucleus, so the radius jumps up compared to ' + prev.name + '.';
      explainTh = 'ขึ้นคาบใหม่ ได้ชั้นอิเล็กตรอนใหม่ ' + el.name + ' เริ่มเติมอิเล็กตรอนในชั้นที่ไกลจากนิวเคลียสมากขึ้น ทำให้รัศมีอะตอมเพิ่มขึ้นเมื่อเทียบกับ ' + prev.name;
    } else if (prev && el.period === prev.period){
      explainEn = 'Same shell as ' + prev.name + ', but one more proton pulling on it — the extra positive charge tugs the electron cloud in, so the radius shrinks a little.';
      explainTh = 'อยู่ในชั้นอิเล็กตรอนเดียวกับ ' + prev.name + ' แต่มีโปรตอนเพิ่มขึ้นอีกหนึ่งตัว แรงดึงดูดที่มากขึ้นทำให้กลุ่มอิเล็กตรอนถูกดึงเข้ามาใกล้ขึ้น รัศมีจึงเล็กลงเล็กน้อย';
    } else {
      explainEn = el.name + ' — drag the slider to compare its size with its neighbors.';
      explainTh = el.name + ' — ลองลากแถบเลื่อนเพื่อเปรียบเทียบขนาดกับธาตุข้างเคียง';
    }
    explain.innerHTML = explainEn + '<span class="lang-th">' + explainTh + '</span>';
  }

  slider.addEventListener('input', update);
  update();
}
