window.initPageExtras = function(){
  initBondBuilder();
  initBondEnergySimulator();
};

var NETWORK_COVALENT = ['B', 'C', 'Si'];
var METAL_CATEGORIES = ['alkali', 'alkaline', 'transition', 'post'];
var METAL_CHARGE = { Li:1, Na:1, K:1, Mg:2, Ca:2, Al:3, Fe:2, Cu:2, Zn:2 };
var ANION_CHARGE = { H:-1, N:-3, P:-3, O:-2, S:-2, F:-1, Cl:-1, Br:-1 };

function gcd(a, b){ return b === 0 ? a : gcd(b, a % b); }

function ionicFormula(catSym, catCharge, anSym, anCharge){
  var anionAbs = Math.abs(anCharge);
  var g = gcd(catCharge, anionAbs) || 1;
  var catCount = anionAbs / g;
  var anCount = catCharge / g;
  return catSym + (catCount > 1 ? catCount : '') + anSym + (anCount > 1 ? anCount : '');
}

function classifyBond(a, b){
  var aNetwork = NETWORK_COVALENT.indexOf(a.sym) !== -1;
  var bNetwork = NETWORK_COVALENT.indexOf(b.sym) !== -1;
  var aMetal = METAL_CATEGORIES.indexOf(a.category) !== -1;
  var bMetal = METAL_CATEGORIES.indexOf(b.category) !== -1;

  if (!aNetwork && !bNetwork && aMetal && bMetal) return { kind: 'metallic' };
  if (!aNetwork && !bNetwork && aMetal !== bMetal){
    var metalEl = aMetal ? a : b;
    var nonmetalEl = aMetal ? b : a;
    return { kind: 'ionic', metalEl: metalEl, nonmetalEl: nonmetalEl };
  }
  var diff = Math.abs(a.electroneg - b.electroneg);
  return { kind: 'covalent', polar: diff >= 0.4, diff: diff };
}

function renderElectronegMeter(a, b){
  var wrap = document.getElementById('enMeterWrap');
  if (!wrap) return;
  var min = 0.7, max = 4.0;
  function pct(v){ return Math.max(0, Math.min(100, (v - min) / (max - min) * 100)); }
  wrap.innerHTML =
    '<div class="electroneg-meter">' +
      '<div class="electroneg-pin" data-label="' + a.sym + ' ' + a.electroneg.toFixed(2) + '" style="left:' + pct(a.electroneg) + '%;background:var(--teal-deep);"></div>' +
      '<div class="electroneg-pin" data-label="' + b.sym + ' ' + b.electroneg.toFixed(2) + '" style="left:' + pct(b.electroneg) + '%;background:var(--coral);"></div>' +
    '</div>' +
    '<div class="trend-arrow" style="justify-content:space-between;"><span>Low electronegativity</span><span>High electronegativity</span></div>';
}

function renderMetallic(a, b){
  var html = '<div class="electron-sea">';
  var positions = [[10,15],[55,10],[85,30],[20,55],[60,50],[90,68],[12,85],[50,82]];
  positions.forEach(function(pos, i){
    var sym = i % 2 === 0 ? a.sym : b.sym;
    html += '<div class="metal-ion" style="left:' + pos[0] + '%;top:' + pos[1] + '%;">' + sym + '</div>';
  });
  var ePositions = [[30,25],[70,20],[40,60],[75,75],[15,40],[60,40]];
  ePositions.forEach(function(pos, i){
    html += '<div class="sea-electron" style="left:' + pos[0] + '%;top:' + pos[1] + '%;animation-delay:' + (i*0.3) + 's;"></div>';
  });
  html += '</div>';
  return html;
}

function renderIonic(metalEl, nonmetalEl){
  var catCharge = METAL_CHARGE[metalEl.sym] || (metalEl.group <= 2 ? metalEl.group : 2);
  var anCharge = ANION_CHARGE[nonmetalEl.sym] || -1;
  var formula = ionicFormula(metalEl.sym, catCharge, nonmetalEl.sym, anCharge);

  var html = '<div style="width:100%;"><div class="lattice">';
  for (var i = 0; i < 8; i++){
    var isPos = i % 2 === 0;
    html += '<div class="lattice-ion ' + (isPos ? 'pos' : 'neg') + '">' +
      (isPos ? metalEl.sym + (catCharge>1? catCharge:'') + '+' : nonmetalEl.sym + (Math.abs(anCharge)>1?Math.abs(anCharge):'') + '−') +
      '</div>';
  }
  html += '</div><p style="text-align:center;color:rgba(246,250,249,.85);font-size:.85rem;margin-top:14px;">Repeating crystal lattice — formula unit <strong style="color:var(--amber);">' + formula + '</strong></p></div>';
  return html;
}

function renderCovalent(a, b){
  var html = '<div class="lewis-stage">' +
    '<div class="lewis-atom"><div class="lewis-core">' + a.sym + '</div></div>' +
    '<div class="bond-line" style="position:relative;">' +
      '<span class="lewis-dot" style="left:14px;top:-3px;"></span>' +
      '<span class="lewis-dot" style="left:14px;top:9px;"></span>' +
    '</div>' +
    '<div class="lewis-atom"><div class="lewis-core">' + b.sym + '</div></div>' +
  '</div>' +
  '<p style="text-align:center;color:rgba(246,250,249,.8);font-size:.82rem;margin-top:10px;">Simplified — shown as one shared pair. Some real bonds (like O=O) share two or three pairs.</p>';
  return html;
}

function initBondBuilder(){
  var selA = document.getElementById('bondElA');
  var selB = document.getElementById('bondElB');
  if (!selA || !selB) return;

  function update(){
    var a = window.getElementByZ(parseInt(selA.value, 10));
    var b = window.getElementByZ(parseInt(selB.value, 10));
    if (!a || !b) return;

    var result = classifyBond(a, b);
    var visual = document.getElementById('bondVisual');
    var explain = document.getElementById('bondExplain');
    var title = document.getElementById('bondTitle');

    renderElectronegMeter(a, b);

    if (result.kind === 'metallic'){
      title.innerHTML = 'Metallic bond<span class="lang-th">พันธะโลหะ</span>';
      visual.innerHTML = renderMetallic(a, b);
      explain.innerHTML = '<strong>' + a.name + '</strong> and <strong>' + b.name + '</strong> are both metals. Their outer electrons leave individual atoms and move freely through the whole structure — a "sea" of delocalized electrons shared by all the metal ions. That mobility is exactly why metals conduct electricity and heat, and why they bend and stretch instead of shattering.' +
        '<span class="lang-th"><strong>' + a.name + '</strong> และ <strong>' + b.name + '</strong> เป็นโลหะทั้งคู่ อิเล็กตรอนวงนอกของทั้งสองหลุดออกจากอะตอมเดี่ยวและเคลื่อนที่ได้อย่างอิสระทั่วทั้งโครงสร้าง กลายเป็น "ทะเลอิเล็กตรอน" ที่ไอออนโลหะทุกตัวใช้ร่วมกัน ความคล่องตัวนี้เองที่ทำให้โลหะนำไฟฟ้าและความร้อนได้ดี และโค้งงอ/ยืดได้โดยไม่แตกหัก</span>';
    } else if (result.kind === 'ionic'){
      title.innerHTML = 'Ionic bond<span class="lang-th">พันธะไอออนิก</span>';
      visual.innerHTML = renderIonic(result.metalEl, result.nonmetalEl);
      explain.innerHTML = '<strong>' + result.metalEl.name + '</strong> transfers one or more electrons to <strong>' + result.nonmetalEl.name + '</strong>. ' + result.metalEl.name + ' becomes a positive ion, ' + result.nonmetalEl.name + ' becomes a negative ion, and the opposite charges attract strongly in every direction — building a rigid crystal lattice rather than a single pair.' +
        '<span class="lang-th"><strong>' + result.metalEl.name + '</strong> ถ่ายโอนอิเล็กตรอนหนึ่งตัวหรือมากกว่าให้กับ <strong>' + result.nonmetalEl.name + '</strong> ' + result.metalEl.name + ' กลายเป็นไอออนบวก ส่วน ' + result.nonmetalEl.name + ' กลายเป็นไอออนลบ ประจุตรงข้ามดึงดูดกันอย่างแรงในทุกทิศทาง จนเกิดเป็นโครงผลึกที่แข็งแรง ไม่ใช่แค่คู่อะตอมเดี่ยว</span>';
    } else {
      title.innerHTML = (result.polar ? 'Polar covalent bond<span class="lang-th">พันธะโคเวเลนต์มีขั้ว</span>' : 'Nonpolar covalent bond<span class="lang-th">พันธะโคเวเลนต์ไม่มีขั้ว</span>');
      visual.innerHTML = renderCovalent(a, b);
      var diffText = 'Electronegativity difference: ' + result.diff.toFixed(2) + '.';
      var diffTextTh = 'ผลต่างอิเล็กโทรเนกาติวิตี: ' + result.diff.toFixed(2);
      if (a.sym === b.sym){
        explain.innerHTML = 'Two ' + a.name + ' atoms share a pair of electrons equally — identical atoms always pull with identical strength, so this bond is nonpolar. ' + diffText +
          '<span class="lang-th">อะตอม ' + a.name + ' สองตัวแบ่งอิเล็กตรอนคู่หนึ่งเท่า ๆ กัน เนื่องจากอะตอมที่เหมือนกันดึงดูดด้วยแรงเท่ากันเสมอ พันธะนี้จึงไม่มีขั้ว ' + diffTextTh + '</span>';
      } else if (result.polar){
        explain.innerHTML = '<strong>' + a.name + '</strong> and <strong>' + b.name + '</strong> share electrons, but ' + (a.electroneg > b.electroneg ? a.name : b.name) + ' pulls noticeably harder on the shared pair, giving the bond a slightly negative and slightly positive end. ' + diffText +
          '<span class="lang-th"><strong>' + a.name + '</strong> และ <strong>' + b.name + '</strong> ใช้อิเล็กตรอนร่วมกัน แต่ ' + (a.electroneg > b.electroneg ? a.name : b.name) + ' ดึงดูดคู่อิเล็กตรอนได้แรงกว่าอย่างเห็นได้ชัด ทำให้พันธะมีขั้วลบเล็กน้อยและขั้วบวกเล็กน้อย ' + diffTextTh + '</span>';
      } else {
        explain.innerHTML = '<strong>' + a.name + '</strong> and <strong>' + b.name + '</strong> share electrons fairly evenly — their electronegativities are close enough that neither atom dominates the shared pair. ' + diffText +
          '<span class="lang-th"><strong>' + a.name + '</strong> และ <strong>' + b.name + '</strong> ใช้อิเล็กตรอนร่วมกันอย่างค่อนข้างเท่าเทียม เพราะค่าอิเล็กโทรเนกาติวิตีใกล้เคียงกันมากจนไม่มีอะตอมใดครอบครองคู่อิเล็กตรอนเหนือกว่า ' + diffTextTh + '</span>';
      }
    }
  }

  selA.addEventListener('change', update);
  selB.addEventListener('change', update);
  update();
}

/* ---------------- Bond energy simulator ---------------- */
function initBondEnergySimulator(){
  var atomA = document.getElementById('beAtomA');
  var atomB = document.getElementById('beAtomB');
  var slider = document.getElementById('beSlider');
  var chart = document.getElementById('beChart');
  var distanceVal = document.getElementById('beDistanceVal');
  var energyVal = document.getElementById('beEnergyVal');
  var stateLabel = document.getElementById('beStateLabel');
  var explain = document.getElementById('beExplain');
  if (!slider || !chart) return;

  var W = 600, H = 200;
  var sigma = 130, rMin = 70, rMax = 420;

  function potential(r){
    var x = sigma / r, x6 = Math.pow(x, 6), x12 = x6 * x6;
    return 4 * (x12 - x6);
  }
  function sliderToR(v){ return rMin + (v / 100) * (rMax - rMin); }

  var points = [];
  for (var i = 0; i <= 120; i++){
    var r = rMin + (i / 120) * (rMax - rMin);
    points.push([r, potential(r)]);
  }
  var eMin = Math.min.apply(null, points.map(function(p){ return p[1]; }));
  var eMax = 2.2;
  function xScale(r){ return ((r - rMin) / (rMax - rMin)) * W; }
  function yScale(e){
    var clamped = Math.min(e, eMax);
    var t = (clamped - eMin) / (eMax - eMin);
    return H - t * H;
  }

  var d = points.map(function(p, i){
    return (i === 0 ? 'M' : 'L') + xScale(p[0]).toFixed(1) + ',' + yScale(p[1]).toFixed(1);
  }).join(' ');
  chart.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  chart.innerHTML =
    '<line class="axis" x1="0" y1="' + yScale(0) + '" x2="' + W + '" y2="' + yScale(0) + '"></line>' +
    '<path class="line" d="' + d + '"></path>' +
    '<line class="guide" id="beGuide" x1="0" y1="0" x2="0" y2="' + H + '"></line>' +
    '<circle class="marker" id="beMarker" r="6" cx="0" cy="0"></circle>';
  var guide = document.getElementById('beGuide');
  var marker = document.getElementById('beMarker');
  var trackWidth = 220;

  function update(){
    var v = parseInt(slider.value, 10);
    var r = sliderToR(v);
    var e = potential(r);
    var sepPx = 14 + (v / 100) * trackWidth;
    atomA.style.left = 'calc(50% - ' + (sepPx / 2 + 27) + 'px)';
    atomB.style.left = 'calc(50% + ' + (sepPx / 2 - 27) + 'px)';
    var x = xScale(r), y = yScale(e);
    guide.setAttribute('x1', x); guide.setAttribute('x2', x);
    marker.setAttribute('cx', x); marker.setAttribute('cy', y);
    distanceVal.textContent = Math.round(r) + ' pm';
    energyVal.textContent = (e >= 0 ? '+' : '') + e.toFixed(2) + ' ε';

    var state, stateTh, stateClass, explainEn, explainTh;
    if (r < sigma * 0.97){
      state = 'Repulsion';
      stateTh = 'แรงผลัก';
      stateClass = 'be-state-repel';
      explainEn = 'Push the atoms this close and their electron clouds (and nuclei) start to overlap — repulsion wins, and energy shoots upward fast.';
      explainTh = 'ถ้าผลักอะตอมให้ใกล้กันขนาดนี้ กลุ่มอิเล็กตรอน (และนิวเคลียส) จะเริ่มทับกัน แรงผลักจะชนะ ทำให้พลังงานพุ่งสูงขึ้นอย่างรวดเร็ว';
    } else if (r < sigma * 1.35){
      state = 'Equilibrium — the bond';
      stateTh = 'จุดสมดุล — พันธะเคมี';
      stateClass = 'be-state-bond';
      explainEn = 'This is the sweet spot: attraction and repulsion balance out at the lowest possible energy. This distance is the bond length.';
      explainTh = 'นี่คือจุดที่พอดี แรงดึงดูดและแรงผลักสมดุลกันที่พลังงานต่ำสุด ระยะนี้คือ "ความยาวพันธะ" นั่นเอง';
    } else {
      state = 'No real bond';
      stateTh = 'ไม่มีพันธะจริง';
      stateClass = 'be-state-none';
      explainEn = 'Too far apart for the attractive force to matter — the atoms barely notice each other, and energy flattens out near zero.';
      explainTh = 'ห่างกันเกินไปจนแรงดึงดูดแทบไม่มีผล อะตอมทั้งสองแทบไม่รู้สึกถึงกัน พลังงานจึงเข้าใกล้ศูนย์';
    }
    stateLabel.innerHTML = state + '<span class="lang-th">' + stateTh + '</span>';
    stateLabel.className = 'be-state-label ' + stateClass;
    explain.innerHTML = explainEn + '<span class="lang-th">' + explainTh + '</span>';
  }

  slider.addEventListener('input', update);
  update();
}
