/* nayl-aSpace v2 · shared.js */

// ── CONFIG ──────────────────────────────────────────────
const SUPABASE_URL      = 'https://lbdonhwjewekgjdzirxp.supabase.co'; // Masukkan URL dari Settings > API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZG9uaHdqZXdla2dqZHppcnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDM3NzAsImV4cCI6MjA4ODg3OTc3MH0.uUcZR5hT6xacu3A-bBvfH3HwactmQW-be_sr3Vudfr0'; // Masukkan Anon Key dari Settings > API
let sb = null, sbReady = false;

function initSB() {
  // UPDATE YOUR SUPABASE CREDENTIALS HERE
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  sbReady = true;
  console.log('✅ Supabase Ready:', sbReady);
}

// ── STORAGE HELPERS ─────────────────────────────────────
// LS is Synchronous (Local Storage) - Fallback & Immediate UI
const LS = {
  get: (k, def=[]) => { try { return JSON.parse(localStorage.getItem('ns_'+k)) ?? def; } catch { return def; } },
  set: (k, v) => localStorage.setItem('ns_'+k, JSON.stringify(v)),
  del: k => localStorage.removeItem('ns_'+k),
};

// DB is Asynchronous (Supabase > LS Fallback)
const DB = {
  get: async (key) => {
    if (!sbReady) return LS.get(key);
    
  const map = {
'public_messages': { t:'public_messages', select: 'id,name,message,created_at', o:'created_at', d:false },
      'projects':        { t:'projects', o:'created_at', d:false },
      'interests':       { t:'interests', o:'created_at', d:false },
      'interests_manhwa':{ t:'interests', c:'manhwa' },
      'interests_anime': { t:'interests', c:'anime' },
      'interests_movies':{ t:'interests', c:'movies' },
      'interests_misc':  { t:'interests', c:'misc' }
    };
    
    const m = map[key];
    if (!m) return LS.get(key);

    let q = sb.from(m.t).select('*');
    if (m.c) q = q.eq('category', m.c);
    if (m.o) q = q.order(m.o, { ascending: m.d });
    else q = q.order('created_at', { ascending: false });

    const { data, error } = await q;
    if (error) {
      console.warn('Supabase error, using localStorage:', error);
      return LS.get(key);
    }
    return data || [];
  },
  
  add: async (key, item) => {
    // FIX: Auto-correct field mismatch ('text' -> 'message') untuk mencegah error PGRST204
    if (key === 'public_messages' && item.text) {
      if (!item.message) item.message = item.text;
      delete item.text; // Hapus properti 'text' agar tidak ditolak Supabase
    }

    if (!sbReady) {
      const d = LS.get(key);
      if (Array.isArray(d)) { d.unshift(item); LS.set(key, d); }
      return true;
    }
    
    // FIX: Hapus ID dan Date manual saat kirim ke Supabase
    // Biarkan database yang mengurus UUID dan created_at
    if (key === 'public_messages') {
      delete item.id;
      delete item.date;
    }

    const map = {
      'public_messages': 'public_messages',
      'projects': 'projects',
      'interests': 'interests', // Tambahan: Support save ke tabel interests umum
      'interests_manhwa':'interests',
      'interests_anime': 'interests',
      'interests_movies':'interests',
      'interests_misc':  'interests'
    };
    const table = map[key];
    if (!table) return false;

    const { error } = await sb.from(table).insert(item);
    if (error) console.error(error);
    return !error;
  },

  update: async (key, item) => {
    if (!sbReady) {
      // LocalStorage Fallback
      const d = LS.get(key);
      const idx = d.findIndex(x => x.id === item.id);
      if (idx !== -1) { d[idx] = item; LS.set(key, d); }
      return true;
    }

    // Mapping key ke nama tabel Supabase
    const map = {
      'projects': 'projects',
      'interests': 'interests'
    };
    const table = map[key];
    if (!table) return false;

    // Hapus id dari body update karena id dipakai sebagai identifier di query
    const updateData = { ...item };
    delete updateData.id; 

    const { error } = await sb.from(table).update(updateData).eq('id', item.id);
    if (error) console.error('Supabase update error:', error);
    return !error;
  },

  delete: async (key, id) => {
    if (!sbReady) {
      // LocalStorage Fallback
      let d = LS.get(key);
      d = d.filter(x => x.id !== id);
      LS.set(key, d);
      return true;
    }

    const map = {
      'public_messages': 'public_messages',
      'projects': 'projects',
      'interests': 'interests'
    };
    const table = map[key];
    if (!table) return false;

    const { error } = await sb.from(table).delete().eq('id', id);
    if (error) console.error('Supabase delete error:', error);
    return !error;
  }
};

// ── CURSOR ───────────────────────────────────────────────
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop() {
    rx += (mx-rx)*.13; ry += (my-ry)*.13;
    dot.style.cssText  = `left:${mx-4}px;top:${my-4}px`;
    ring.style.cssText = `left:${rx-16}px;top:${ry-16}px`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a,button,.gc,.title-card,.proj-card,.skill-chip,.tab-btn,.pill,.upload-zone,.img-preview-item');
    if (t) { dot.style.transform='scale(2.2)'; ring.style.width=ring.style.height='50px'; }
    else   { dot.style.transform='scale(1)';   ring.style.width=ring.style.height='32px'; }
  });
}

// ── PARTICLE CANVAS ──────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts=[];
  const resize=()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; };
  resize(); addEventListener('resize', resize);
  const isAdmin = document.body.classList.contains('admin-body');

  class P {
    r() {
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.s=Math.random()*1.3+.3;
      this.vx=(Math.random()-.5)*.25; this.vy=(Math.random()-.5)*.25;
      this.a=Math.random()*.4+.08;
      this.c = isAdmin
        ? (Math.random()>.55 ? '167,139,250' : '99,77,255')
        : (Math.random()>.55 ? '0,212,255' : '60,120,255');
    }
    constructor(){this.r()}
    tick(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.r(); }
    draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2); ctx.fillStyle=`rgba(${this.c},${this.a})`; ctx.fill(); }
  }
  for(let i=0;i<100;i++) pts.push(new P());

  const nebulas = isAdmin
    ? [[.3,.35,.5,'99,0,255,.05'],[.75,.65,.4,'167,139,250,.04']]
    : [[.28,.35,.55,'8,32,255,.055'],[.78,.7,.45,'8,32,255,.04'],[.6,.2,.35,'0,212,255,.03']];

  (function frame(){
    ctx.clearRect(0,0,W,H);
    nebulas.forEach(([x,y,r,c])=>{
      const g=ctx.createRadialGradient(W*x,H*y,0,W*x,H*y,W*r);
      g.addColorStop(0,`rgba(${c})`); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });
    pts.forEach(p=>{p.tick();p.draw()});
    requestAnimationFrame(frame);
  })();
}

// ── NAVBAR SCROLL ─────────────────────────────────────────
function initNav() {
  const nav = document.getElementById('user-nav');
  if (!nav) return;
  addEventListener('scroll', ()=> nav.classList.toggle('compact', scrollY>40));
  // Active link
  const cur = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href').split('/').pop()===cur) a.classList.add('active');
  });
}

// ── ADMIN NAV ACTIVE ──────────────────────────────────────
function initAdminNav() {
  const cur = location.pathname.split('/').pop();
  document.querySelectorAll('#admin-nav .admin-nav-tab').forEach(a=>{
    if(a.getAttribute('href')===cur || a.getAttribute('data-page')===cur) a.classList.add('active');
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} });
  }, {threshold:.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

// ── TOAST ─────────────────────────────────────────────────
function toast(msg, type='ok', icon='') {
  let t = document.getElementById('toast');
  if (!t) { t=document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  const icons = {ok:'fa-circle-check',err:'fa-circle-xmark',warn:'fa-triangle-exclamation'};
  const ic = icon || icons[type] || icons.ok;
  t.innerHTML = `<i class="fa-solid ${ic}"></i><span>${msg}</span>`;
  t.className = type==='err'?'err show': type==='warn'?'warn show':'show';
  clearTimeout(t._t);
  t._t = setTimeout(()=>t.classList.remove('show'), 3400);
}

// ── IMAGE UPLOAD HELPER ────────────────────────────────────
function initUploadZone(zoneEl, previewEl, state) {
  // state = { files: [] }
  if (!zoneEl) return;

  const input = zoneEl.querySelector('input[type=file]');

  const render = () => {
    previewEl.innerHTML = '';
    state.files.forEach((f, i) => {
      const item = document.createElement('div');
      item.className = 'img-preview-item';
      const img = document.createElement('img');
      img.src = f.dataUrl || f.url || '';
      img.alt = f.name||'img';
      const rm = document.createElement('button');
      rm.className='img-preview-remove';
      rm.innerHTML='<i class="fa-solid fa-xmark"></i>';
      rm.onclick = e => { e.stopPropagation(); state.files.splice(i,1); render(); };
      const ord = document.createElement('div');
      ord.className='img-preview-order';
      ord.textContent = `#${i+1}`;
      item.append(img, rm, ord);
      previewEl.appendChild(item);
    });
  };

  const addFiles = async (fileList) => {
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) continue;
      const dataUrl = await readFile(file);
      state.files.push({ file, dataUrl, name:file.name });
    }
    render();
  };

  input.addEventListener('change', e => addFiles(e.target.files));

  zoneEl.addEventListener('dragover', e => { e.preventDefault(); zoneEl.classList.add('drag-over'); });
  zoneEl.addEventListener('dragleave', () => zoneEl.classList.remove('drag-over'));
  zoneEl.addEventListener('drop', e => {
    e.preventDefault(); zoneEl.classList.remove('drag-over');
    addFiles(e.dataTransfer.files);
  });
}

function readFile(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}

// Store images as base64 in localStorage (demo mode)
// In Supabase mode, upload to storage bucket
async function uploadImages(stateFiles) {
  if (!sbReady) {
    // demo: just store base64
    return stateFiles.map(f => f.dataUrl || f.url || '');
  }
  const urls = [];
  for (const f of stateFiles) {
    if (f.url) { urls.push(f.url); continue; } // already uploaded
    // If it's a new file (File object present)
    if (!f.file) continue; 
    const ext = f.name.split('.').pop();
    const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await sb.storage.from('images').upload(path, f.file, { upsert:true });
    if (!error && data) {
      const { data:pubData } = sb.storage.from('images').getPublicUrl(path);
      urls.push(pubData.publicUrl);
    }
  }
  return urls;
}

// ── QUILL INIT ────────────────────────────────────────────
function initQuill(containerId, placeholder='Write something...') {
  if (!window.Quill || !document.getElementById(containerId)) return null;
  return new Quill('#'+containerId, {
    theme: 'snow',
    placeholder,
    modules: {
      toolbar: [
        [{ header: [1,2,3,false] }],
        ['bold','italic','underline','strike'],
        [{ list:'ordered' },{ list:'bullet' }],
        ['link'],
        ['clean'],
      ]
    }
  });
}

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCount(el, target, duration=1200) {
  const start = performance.now();
  const update = now => {
    const p = Math.min((now-start)/duration, 1);
    const ease = 1-Math.pow(1-p, 3);
    el.textContent = Math.round(ease*target);
    if (p<1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ── MOBILE MENU ───────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.innerHTML = nav.classList.contains('active') ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

// ── SMART SCROLL (AUTO HIDE NAV) ──────────────────────────
function initSmartScroll() {
  const navTop = document.getElementById('user-nav'); // Tetap ambil referensi, tapi tidak kita sembunyikan
  const navBot = document.getElementById('nav-links'); // Mobile bottom nav
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Selalu munculkan jika di paling atas
    if (currentScroll <= 10) {
      navTop?.classList.remove('nav-hidden'); // Munculkan navbar atas
      return;
    }

    // Deteksi Scroll
    if (currentScroll > lastScroll && currentScroll > 60) {
      // SCROLL DOWN -> SEMBUNYI
      navTop?.classList.add('nav-hidden'); // Sembunyikan navbar atas
    } else if (currentScroll < lastScroll) {
      // SCROLL UP -> MUNCUL
      navTop?.classList.remove('nav-hidden'); // Navbar atas muncul kembali
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

// ── FIX NAV STACKING CONTEXT ──────────────────────────────
function initNavLayout() {
  const nav = document.getElementById('user-nav');
  const links = document.getElementById('nav-links');
  if (!nav || !links) return;

  const update = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && links.parentElement === nav) {
      document.body.appendChild(links); // Move to body to detach from header transform
    } else if (!isMobile && links.parentElement !== nav) {
      nav.appendChild(links); // Move back to header for desktop layout
    }
  };
  window.addEventListener('resize', update);
  update();
}

// ── ADMIN EASTER EGG ─────────────────────────────────────
function initAdminTrigger() {
  let adminClickCount = 0;
  let adminClickTimer = null;

  const adminTrigger = Array.from(document.querySelectorAll('footer .accent'))
                            .find(el => el.textContent.includes('nayl-aSpace'));

  if (adminTrigger) {
    adminTrigger.style.cursor = 'pointer';
    adminTrigger.title = 'Click 3x to unlock Admin';

    adminTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      adminClickCount++;
      clearTimeout(adminClickTimer);
      adminClickTimer = setTimeout(() => { adminClickCount = 0; }, 2000);

      // Visual Feedback
      adminTrigger.style.opacity = '0.5';
      setTimeout(()=> adminTrigger.style.opacity = '1', 100);

      if (adminClickCount >= 3) {
        goToAdmin();
      }
    });
  }

  // Shortcut: Ctrl + Shift + A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      goToAdmin();
    }
  });
}

function goToAdmin() {
  const isIndex = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
  const isInPages = window.location.pathname.includes('/pages/');
  
  // Tentukan path relatif yang benar
  let adminPath = 'pages/admin.html';
  if (isInPages) adminPath = 'admin.html'; // jika dari pages/projects.html dll
  else if (isIndex) adminPath = 'pages/admin.html'; 
  
  toast('Opening Admin Portal...', 'ok', 'fa-unlock');
  setTimeout(() => { window.location.href = adminPath; }, 500);
}

// ── SOUND FX (SUBTLE POP) ─────────────────────────────────
function initNavSound() {
  // Menggunakan satu AudioContext untuk efisiensi
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  
  const playPop = () => {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine'; // Gelombang sinus halus
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12); // Pitch drop
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime); // Volume sangat rendah (subtle)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.12);

    // Haptic Feedback (Getaran Singkat 10ms)
    if (navigator.vibrate) navigator.vibrate(10);
  };

  document.querySelectorAll('.nav-links a').forEach(a => {
    // Gunakan pointerdown agar responsif di touch & mouse
    a.addEventListener('pointerdown', playPop);
  });
}

// ── INIT ALL ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSB();
  initCursor();
  initCanvas();
  initNav();
  initAdminNav();
  initMobileMenu();
  initNavLayout();
  initSmartScroll();
  initNavSound();
  initAdminTrigger();
  setTimeout(initReveal, 80);
});
