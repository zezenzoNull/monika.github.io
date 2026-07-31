/* ============================================================
   Happy Girlfriend Day — Monika
   Plain ES2018. No dependencies, no build step.
   ============================================================ */

/* ------------------------------------------------------------------
   1 · CONFIG — everything you'd want to change lives here
   ------------------------------------------------------------------ */
const CONFIG = {
  herName:   'Monika',
  signature: '— Ujjwal',

  // Put the day you two got together here, e.g. '2021-11-14'.
  // Leave it as null and that tile quietly shows something else instead.
  togetherSince: null,

  batteriesToUnlock: 2,   // battery rows she must scratch before "next" unlocks
  balloonsToUnlock:  4,   // balloons she must pop before "next" unlocks
};

/* what the balloons are holding */
const BALLOON_NOTES = [
  'You make ordinary days feel like plans',
  "I'd pick you in every version of this life",
  'Your stubbornness is my favourite thing about you',
  'Home is you, on a call, first thing in the morning',
  'Thank you for laughing at my jokes',
  'The easiest decision I never had to think about',
  "I'm proud of you. Constantly. Loudly.",
  'Thank you for putting up with me',
];

/* the polaroid deck */
const PHOTOS = [
  { src:'./photos/01-fairylights.jpg', cap:'All those lights,\nand I was looking at you' },
  { src:'./photos/02-graduation.jpg',  cap:'Dr. Monika Godara.\nI have never clapped harder.' },
  { src:'./photos/03-cafe.jpg',        cap:'Cold hands,\nwarm everything else' },
  { src:'./photos/04-mountains.jpg',   cap:'You gave an entire\nmountain a thumbs up' },
  { src:'./photos/05-snowfall.jpg',    cap:'Freezing out.\nYou were still the warmest thing there.' },
  { src:'./photos/06-snowplay.jpg',    cap:'In my defence,\nyou started it' },
  { src:'./photos/07-snowsuits.jpg',   cap:'Two marshmallows,\nvery much in love' },
  { src:'./photos/08-dinner.jpg',      cap:'Dressed up and still goofy' },
  { src:'./photos/09-noodles.jpg',     cap:'That smile.\nThat is the whole reason.' },
];

/* "completely accurate statistics" */
const STATS = [
  { to:1,  suffix:'', label:'doctor in this relationship (not me)' },
  { to:12, suffix:'', label:'times you said "last photo"' },
  { to:0,  suffix:'', label:'regrets' },
];

/* No hard line breaks — let it wrap to whatever screen she opens it on.
   Blank lines separate paragraphs. */
const LETTER = `Monika,

Thank you for being my girlfriend for such a long time, and for dealing with me through all of it. You make me the happiest man alive.

I know things are hectic right now — starting work in OS, new on-calls squeezed in between, all while shifting rooms to a different hostel. But seriously, everything is going to be alright. I believe in you, and I'm here for you.

I'm looking forward to having a lot more fun with you.

Happy Girlfriend Day. You're stuck with me.

— Ujjwal`;

/* ------------------------------------------------------------------
   2 · little helpers
   ------------------------------------------------------------------ */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const clamp = (n,a,b) => Math.min(b, Math.max(a,n));
const rand  = (a,b) => a + Math.random()*(b-a);
const pick  = a => a[(Math.random()*a.length)|0];

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PALETTE = ['#f2809a','#f0b849','#9fd6c4','#a9cbe8','#c9b6e4','#ff9db2','#ffc98a'];

function buzz(ms){ if (navigator.vibrate) { try { navigator.vibrate(ms); } catch(e){} } }

function syncVh(){
  document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
}
syncVh();
addEventListener('resize', syncVh);
addEventListener('orientationchange', () => setTimeout(syncVh, 250));

/* ------------------------------------------------------------------
   3 · particle canvas (confetti + hearts)
   ------------------------------------------------------------------ */
const fx = (() => {
  const cv = $('#fx');
  const ctx = cv.getContext('2d');
  let parts = [], raf = null, dpr = 1;

  function resize(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width  = innerWidth  * dpr;
    cv.height = innerHeight * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener('resize', resize);

  function loop(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (let i = parts.length-1; i >= 0; i--){
      const p = parts[i];
      p.vy += p.g; p.vx *= 0.995;
      p.x += p.vx; p.y += p.vy;
      p.rot += p.vr; p.life--;

      if (p.life <= 0 || p.y > innerHeight + 60){ parts.splice(i,1); continue; }

      ctx.save();
      ctx.globalAlpha = clamp(p.life / 40, 0, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.kind === 'heart'){
        ctx.fillStyle = p.c;
        ctx.font = p.size + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText('♥', 0, 0);
      } else {
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      }
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(loop) : null;
    if (!parts.length) ctx.clearRect(0,0,innerWidth,innerHeight);
  }

  function emit(list){
    if (REDUCED) return;
    parts = parts.concat(list);
    if (parts.length > 500) parts = parts.slice(-500);
    if (!raf) raf = requestAnimationFrame(loop);
  }

  return {
    burst(x, y, n=26, kind='confetti'){
      const out = [];
      for (let i=0;i<n;i++){
        const a = rand(0, Math.PI*2), s = rand(2.5, 8.5);
        out.push({
          x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 2.5,
          g: 0.16, rot: rand(0,6), vr: rand(-.22,.22),
          size: kind==='heart' ? rand(12,22) : rand(6,12),
          c: pick(PALETTE), life: rand(60,110), kind,
        });
      }
      emit(out);
    },
    rain(n=90){
      const out = [];
      for (let i=0;i<n;i++){
        out.push({
          x: rand(0, innerWidth), y: rand(-innerHeight*0.5, -10),
          vx: rand(-1.4,1.4), vy: rand(1.5,4.5),
          g: 0.05, rot: rand(0,6), vr: rand(-.18,.18),
          size: rand(6,13), c: pick(PALETTE),
          life: rand(140,240), kind: Math.random()<.3 ? 'heart' : 'confetti',
        });
      }
      emit(out);
    },
  };
})();

/* ------------------------------------------------------------------
   4 · romantic background: balloons, hearts, roses, teddies, glitter
   ------------------------------------------------------------------ */
const SKY_EMOJI = ['💗','🌹','🧸','💛','🎀','💐','🌸','💖','🩷','🐻','💞','🌷'];

(function decorateSky(){
  if (REDUCED) return;
  const sky = $('#balloonSky');
  const small = innerWidth < 420;

  /* drifting balloons */
  for (let i = 0; i < (small ? 6 : 9); i++){
    const b = document.createElement('div');
    b.className = 'sky-balloon';
    b.style.left = rand(2, 92) + '%';
    b.style.setProperty('--w', rand(26, 52).toFixed(0) + 'px');
    b.style.setProperty('--c', pick(PALETTE));
    b.style.setProperty('--dur', rand(17, 34).toFixed(1) + 's');
    b.style.setProperty('--delay', (-rand(0, 30)).toFixed(1) + 's');
    b.innerHTML = '<div class="balloon__body"></div><span class="balloon__string"></span>';
    sky.appendChild(b);
  }

  /* hearts, roses, teddies and bows floating up with them */
  for (let i = 0; i < (small ? 12 : 18); i++){
    const s = document.createElement('div');
    s.className = 'sky-item';
    s.textContent = pick(SKY_EMOJI);
    s.style.left = rand(0, 94) + '%';
    s.style.setProperty('--sz', rand(17, 38).toFixed(0) + 'px');
    s.style.setProperty('--op', rand(.42, .82).toFixed(2));
    s.style.setProperty('--dur', rand(15, 32).toFixed(1) + 's');
    s.style.setProperty('--delay', (-rand(0, 32)).toFixed(1) + 's');
    sky.appendChild(s);
  }

  /* glitter */
  const field = $('#glitterField');
  for (let i = 0; i < (small ? 30 : 46); i++){
    const g = document.createElement('div');
    g.className = 'glitter';
    g.style.left = rand(0, 99) + '%';
    g.style.top  = rand(0, 99) + '%';
    g.style.setProperty('--sz', rand(4, 11).toFixed(1) + 'px');
    g.style.setProperty('--c', pick(['#ffb8cd','#ffd98a','#fff1a8','#e6c6f0','#ffffff']));
    g.style.setProperty('--dur', rand(2.2, 5.5).toFixed(1) + 's');
    g.style.setProperty('--delay', (-rand(0, 6)).toFixed(1) + 's');
    field.appendChild(g);
  }
})();

/* ------------------------------------------------------------------
   5 · scene machine
   ------------------------------------------------------------------ */
const scenes = $$('.scene');
const dotsEl = $('#dots');
let current = 0;
const entered = new Set();

scenes.forEach((s, i) => {
  const d = document.createElement('button');
  d.className = 'dots__dot';
  d.type = 'button';
  d.setAttribute('aria-label', s.dataset.label || ('Scene ' + (i+1)));
  d.addEventListener('click', () => { if (i <= current) go(i); });
  dotsEl.appendChild(d);
});
const dotEls = $$('.dots__dot');

function paintDots(){
  dotEls.forEach((d,i) => {
    d.classList.toggle('is-current', i === current);
    d.classList.toggle('is-done', i < current);
  });
  dotsEl.classList.toggle('is-visible', current > 0);
}

function go(i){
  if (i < 0 || i >= scenes.length || i === current) return;
  scenes[current].classList.remove('is-active');
  current = i;
  const s = scenes[current];
  s.classList.add('is-active');
  paintDots();
  const name = s.dataset.scene;
  if (ENTER[name]) ENTER[name](entered.has(name));
  entered.add(name);
}

function next(){ go(current + 1); }

document.addEventListener('click', e => {
  const t = e.target.closest('[data-next]');
  if (t && !t.disabled) next();
});

addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   go(current - 1);
});

/* ------------------------------------------------------------------
   6 · scene builders
   ------------------------------------------------------------------ */

/* --- envelope --------------------------------------------------- */
$$('.scene--open [data-next]').forEach(el => {
  el.addEventListener('click', () => {
    $('#envelope').classList.add('is-open');
    fx.burst(innerWidth/2, innerHeight*0.5, 30, 'heart');
    buzz(12);
  }, { once:true });
});

/* --- generic scratch-off panel ---------------------------------- */
/* Paints a scratchable cover over `host` on `cv`, calls onReveal() once
   enough of it has been rubbed away. */
function makeScratch(host, cv, onReveal, label){
  const ctx = cv.getContext('2d', { willReadFrequently:true });
  let dpr = 1, w = 0, h = 0;
  let drawing = false, revealed = false, tick = 0, last = null;

  function paintCover(){
    const r = host.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width  = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.globalCompositeOperation = 'source-over';

    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,   '#f6d7de');
    g.addColorStop(0.5, '#eec2cd');
    g.addColorStop(1,   '#e5b3c2');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    /* speckle so it reads as a real scratch panel */
    ctx.globalAlpha = 0.16;
    for (let i=0;i<Math.round(w*h/70);i++){
      ctx.fillStyle = Math.random() > .5 ? '#fff' : '#b98b98';
      ctx.fillRect(Math.random()*w, Math.random()*h, 1.6, 1.6);
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(140,74,94,.62)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 12px Quicksand, system-ui, sans-serif';
    ctx.fillText(label || 'SCRATCH ME', w/2, h/2 - 1);
    ctx.font = '15px serif';
    ctx.fillText('💗  👆  💗', w/2, h/2 + 16);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = ctx.lineJoin = 'round';
  }

  const pos = e => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function scratchTo(p){
    const radius = Math.max(16, Math.min(w,h) * 0.30);
    ctx.lineWidth = radius * 2;
    ctx.beginPath();
    if (last){ ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
    ctx.fill();
    last = p;
  }

  function cleared(){
    try {
      const d = ctx.getImageData(0,0,cv.width,cv.height).data;
      let clear = 0, total = 0;
      for (let y=0; y<cv.height; y+=8){
        for (let x=0; x<cv.width; x+=8){
          total++;
          if (d[(y*cv.width + x)*4 + 3] < 40) clear++;
        }
      }
      return total ? clear/total : 0;
    } catch(err){ return 0; }
  }

  function reveal(){
    if (revealed) return;
    revealed = true;
    host.classList.add('is-revealed');
    buzz(15);
    const r = host.getBoundingClientRect();
    fx.burst(r.left + r.width/2, r.top + r.height/2, 18, 'heart');
    onReveal();
  }

  cv.addEventListener('pointerdown', e => {
    if (revealed) return;
    drawing = true; last = null;
    try { cv.setPointerCapture(e.pointerId); } catch(err){}
    scratchTo(pos(e));
    e.preventDefault();
  });
  cv.addEventListener('pointermove', e => {
    if (!drawing || revealed) return;
    scratchTo(pos(e));
    if (++tick % 5 === 0 && cleared() > 0.42) reveal();
    e.preventDefault();
  });
  const end = () => {
    if (!drawing) return;
    drawing = false; last = null;
    if (!revealed && cleared() > 0.30) reveal();
  };
  cv.addEventListener('pointerup', end);
  cv.addEventListener('pointercancel', end);
  cv.addEventListener('pointerleave', end);

  host._repaint = () => { if (!revealed) paintCover(); };
  paintCover();
}

/* --- battery (scratch to reveal, then it charges) ---------------- */
let battFound = 0;

function buildBattery(){
  battFound = 0;
  $('#battCount').textContent = '0';
  const btn = $('#battNext');
  btn.disabled = true;
  btn.textContent = 'Scratch them first…';

  $$('.battery-row').forEach(row => {
    row.classList.remove('is-revealed','is-charged');
    $('.battery__fill', row).style.width = '0%';
    makeScratch(row, $('.battery-row__scratch', row), () => chargeRow(row), 'SCRATCH ME');
  });
}

function chargeRow(row){
  const fill = $('.battery__fill', row);
  setTimeout(() => { fill.style.width = row.dataset.level + '%'; }, 180);

  if (row.dataset.level === '100'){
    setTimeout(() => {
      row.classList.add('is-charged');
      buzz(18);
      const r = row.getBoundingClientRect();
      fx.burst(r.left + r.width/2, r.top + r.height/2, 20, 'heart');
    }, 1250);
  }

  battFound++;
  $('#battCount').textContent = String(battFound);
  const btn = $('#battNext');
  if (battFound >= CONFIG.batteriesToUnlock){
    btn.disabled = false;
    btn.textContent = battFound === 3 ? 'Keep going' : 'Next';
  }
  if (battFound === 3) fx.rain(50);
}

let battResizeTimer;
addEventListener('resize', () => {
  clearTimeout(battResizeTimer);
  battResizeTimer = setTimeout(() => {
    $$('.battery-row').forEach(r => r._repaint && r._repaint());
  }, 260);
});

/* --- balloon pop ------------------------------------------------ */
let popped = 0;

function buildBalloons(){
  const field = $('#popField');
  field.innerHTML = '';
  popped = 0;
  $('#popCount').textContent = '0';
  const btn = $('#popNext');
  btn.disabled = true;
  btn.textContent = 'Pop a few first…';
  $('#popNote').classList.remove('is-shown');

  BALLOON_NOTES.forEach((note, i) => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = (3 + (i % 4) * 21 + rand(-2,2)).toFixed(1) + '%';
    b.style.setProperty('--w', rand(50,72).toFixed(0) + 'px');
    b.style.setProperty('--c', PALETTE[i % PALETTE.length]);
    b.style.animationDuration = rand(11,17).toFixed(1) + 's';
    b.style.animationDelay = (-rand(0, 12)).toFixed(1) + 's';
    b.innerHTML =
      '<div class="balloon__inner">' +
        '<div class="balloon__body"></div>' +
        '<span class="balloon__string"></span>' +
      '</div>';
    b.addEventListener('click', () => popBalloon(b, note), { once:true });
    field.appendChild(b);
  });
}

let noteTimer;
function popBalloon(b, note){
  b.classList.add('is-popped');
  buzz(20);
  const r = b.getBoundingClientRect();
  fx.burst(r.left + r.width/2, r.top + r.height/3, 22, Math.random()<.5 ? 'heart' : 'confetti');
  setTimeout(() => b.remove(), 340);

  const noteEl = $('#popNote');
  noteEl.textContent = note;
  noteEl.classList.add('is-shown');
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => noteEl.classList.remove('is-shown'), 2600);

  popped++;
  $('#popCount').textContent = String(popped);
  const btn = $('#popNext');
  if (popped >= CONFIG.balloonsToUnlock){
    btn.disabled = false;
    btn.textContent = popped === BALLOON_NOTES.length ? 'That was all of them' : 'Next';
  }
  if (popped === BALLOON_NOTES.length) fx.rain(60);
}

/* --- polaroid deck ---------------------------------------------- */
let deckIdx = 0;

function buildDeck(){
  const deck = $('#deck');
  deck.innerHTML = '';

  PHOTOS.forEach((p, i) => {
    const el = document.createElement('figure');
    el.className = 'polaroid';
    el.innerHTML =
      '<img class="polaroid__img" src="' + p.src + '" alt="" ' +
        'loading="' + (i < 2 ? 'eager' : 'lazy') + '" decoding="async">' +
      '<figcaption class="polaroid__cap">' + p.cap.replace(/\n/g,'<br>') + '</figcaption>';
    deck.appendChild(el);
  });

  deckIdx = 0;
  layoutDeck();

  deck.addEventListener('click', () => showPhoto(deckIdx + 1));
  $('#deckNext').addEventListener('click', e => { e.stopPropagation(); showPhoto(deckIdx + 1); });
  $('#deckPrev').addEventListener('click', e => { e.stopPropagation(); showPhoto(deckIdx - 1); });

  let sx = 0, sy = 0, tracking = false;
  deck.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; tracking = true; });
  deck.addEventListener('pointerup', e => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){
      showPhoto(deckIdx + (dx < 0 ? 1 : -1));
    }
  });
}

function layoutDeck(){
  const cards = $$('#deck .polaroid');
  cards.forEach((el, i) => {
    const rel = i - deckIdx;
    if (rel < 0 || rel > 2){
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px) scale(.9)';
      el.style.zIndex = '0';
      el.style.pointerEvents = 'none';
    } else {
      const tilt = [0, 3.5, -3.5][rel];
      el.style.opacity = String(1 - rel*0.22);
      el.style.transform =
        'translateY(' + (rel*-9) + 'px) scale(' + (1 - rel*0.05) + ') rotate(' + tilt + 'deg)';
      el.style.zIndex = String(10 - rel);
      el.style.pointerEvents = rel === 0 ? 'auto' : 'none';
    }
  });
  $('#deckIndex').textContent = String(deckIdx + 1);
}

function showPhoto(i){
  deckIdx = (i + PHOTOS.length) % PHOTOS.length;
  layoutDeck();
  buzz(8);
}

/* --- stats ------------------------------------------------------ */
function buildStats(){
  const wrap = $('#stats');
  wrap.innerHTML = '';
  const items = STATS.slice();

  if (CONFIG.togetherSince){
    const days = Math.max(0,
      Math.floor((Date.now() - new Date(CONFIG.togetherSince).getTime()) / 86400000));
    items.push({ to: days, suffix:'', label:'days of you', wide:true });
  } else {
    items.push({ to: Infinity, suffix:'', label:'more of this, please', wide:true });
  }

  items.forEach(s => {
    const el = document.createElement('div');
    el.className = 'stat' + (s.wide ? ' stat--wide' : '');
    el.innerHTML =
      '<span class="stat__num">0</span>' +
      '<span class="stat__label">' + s.label + '</span>';
    wrap.appendChild(el);
    countUp($('.stat__num', el), s.to, s.suffix);
  });
}

function countUp(el, to, suffix){
  if (!isFinite(to)){ el.textContent = '∞'; return; }
  if (REDUCED || to === 0){ el.textContent = to + suffix; return; }
  const dur = 1100, t0 = performance.now();
  (function step(t){
    const k = clamp((t - t0) / dur, 0, 1);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(to * eased).toLocaleString() + suffix;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

/* --- letter ----------------------------------------------------- */
let letterTimer = null, letterDone = false;

function typeLetter(){
  const body = $('#letterBody');
  const hint = $('#letterHint');
  const btn  = $('#letterNext');

  clearInterval(letterTimer);
  letterDone = false;
  body.textContent = '';
  btn.hidden = true;
  hint.textContent = 'Tap to skip';
  hint.hidden = false;

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  const speed = REDUCED ? 0 : 18;
  let i = 0;

  function finish(){
    clearInterval(letterTimer);
    letterTimer = null;
    letterDone = true;
    body.textContent = LETTER;
    cursor.remove();
    hint.hidden = true;
    btn.hidden = false;
    body.parentElement.parentElement.removeEventListener('click', skip);
  }
  function skip(){ if (!letterDone) finish(); }

  if (speed === 0){ finish(); return; }

  body.appendChild(cursor);
  letterTimer = setInterval(() => {
    i = Math.min(LETTER.length, i + 2);
    body.textContent = LETTER.slice(0, i);
    body.appendChild(cursor);
    body.scrollTop = body.scrollHeight;
    if (i >= LETTER.length) finish();
  }, speed);

  body.parentElement.parentElement.addEventListener('click', skip);
}

/* --- finale ----------------------------------------------------- */
function buildFinale(seen){
  $('#signature').textContent = CONFIG.signature;
  if (!seen){
    fx.rain(120);
    setTimeout(() => fx.rain(70), 700);
    buzz([14, 60, 14]);
  }
}

(function heartHold(){
  const btn = $('#heartBtn');
  const ring = $('.heart-btn__ring', btn);
  const label = $('.heart-btn__label', btn);
  const HOLD = 1500;
  let start = 0, raf = null, done = false;

  function tick(t){
    const k = clamp((t - start) / HOLD, 0, 1);
    ring.style.setProperty('--p', (k*100).toFixed(1) + '%');
    if (k >= 1){ release(true); return; }
    raf = requestAnimationFrame(tick);
  }
  function begin(e){
    e.preventDefault();
    if (done) { boom(); return; }
    btn.classList.add('is-holding');
    start = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function boom(){
    const r = btn.getBoundingClientRect();
    fx.burst(r.left + r.width/2, r.top + r.height/2, 46, 'heart');
    fx.rain(70);
    buzz([12, 40, 12, 40, 24]);
  }
  function release(complete){
    cancelAnimationFrame(raf); raf = null;
    btn.classList.remove('is-holding');
    if (complete){
      done = true;
      ring.style.setProperty('--p', '100%');
      label.textContent = 'I love you';
      boom();
    } else if (!done){
      ring.style.setProperty('--p', '0%');
    }
  }
  btn.addEventListener('pointerdown', begin);
  btn.addEventListener('pointerup',     () => release(false));
  btn.addEventListener('pointercancel', () => release(false));
  btn.addEventListener('pointerleave',  () => release(false));
})();

$('#replayBtn').addEventListener('click', () => {
  entered.clear();
  $('#envelope').classList.remove('is-open');
  go(0);
});

/* ------------------------------------------------------------------
   7 · what runs when each scene opens
   ------------------------------------------------------------------ */
const ENTER = {
  battery:  seen => { if (!seen) buildBattery(); },
  balloons: seen => { if (!seen) buildBalloons(); },
  photos:   seen => { if (!seen) buildDeck(); },
  stats:    ()   => buildStats(),
  letter:   ()   => typeLetter(),
  finale:   seen => buildFinale(seen),
};

/* ------------------------------------------------------------------
   8 · music — a soft loop synthesised in the browser.
   No audio file needed, so nothing extra to upload.
   ------------------------------------------------------------------ */
const music = (() => {
  let ctx = null, master = null, timer = null, step = 0, nextTime = 0;

  const A = 440;
  const nt = n => A * Math.pow(2, (n - 9) / 12);
  const CHORDS = [
    [ 0, 4, 7, 12, 16 ],
    [ -5, 2, 7, 11, 14 ],
    [ -3, 0, 4, 9, 12 ],
    [ -7, 0, 5, 9, 12 ],
  ];
  const BEAT = 0.42;

  function voice(freq, at, dur, gain){
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(gain, at + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + dur + 0.05);
  }

  function schedule(){
    while (nextTime < ctx.currentTime + 0.35){
      const chord = CHORDS[(step >> 2) % CHORDS.length];
      const n = chord[step % chord.length];
      voice(nt(n) / 2, nextTime, BEAT * 1.6, 0.07);
      if (step % 4 === 0) voice(nt(chord[0]) / 4, nextTime, BEAT * 3.4, 0.05);
      if (step % 8 === 2) voice(nt(chord[2] + 12), nextTime, BEAT * 2.2, 0.03);
      nextTime += BEAT;
      step++;
    }
  }

  return {
    toggle(on){
      if (on){
        if (!ctx){
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return false;
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = 0.0001;
          master.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.55, ctx.currentTime + 0.8);
        nextTime = ctx.currentTime + 0.1;
        clearInterval(timer);
        timer = setInterval(schedule, 60);
        return true;
      }
      if (ctx){
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        clearInterval(timer); timer = null;
      }
      return false;
    },
  };
})();

(function musicButton(){
  const btn = $('#musicBtn');
  let on = false;
  btn.addEventListener('click', () => {
    on = music.toggle(!on);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Pause music' : 'Play music');
  });
})();

/* ------------------------------------------------------------------
   9 · boot
   ------------------------------------------------------------------ */
paintDots();

/* ?s=4 jumps straight to a scene — handy for previewing one screen */
(function jumpParam(){
  const n = parseInt(new URLSearchParams(location.search).get('s'), 10);
  if (!isNaN(n) && n > 0 && n <= scenes.length) go(n - 1);
})();

['./photos/01-fairylights.jpg', './photos/02-graduation.jpg'].forEach(src => {
  const im = new Image(); im.src = src;
});
