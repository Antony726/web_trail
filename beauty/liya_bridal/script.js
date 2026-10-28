/* ===== Liya Bridal Studio — script.js ===== */
const CONFIG = {
  whatsapp: '919999999999', // <-- CHANGE: country code + number, no + or spaces
  studio: 'Liya Bridal Studio',
  insta: 'https://www.instagram.com/liyabridalstudiobeautysalon',
  map: 'https://maps.app.goo.gl/umKqad4AdPV7cdjV6',
  phone: '+91 99999 99999',
  email: 'hello@liyabridalstudio.com',
  address: 'Liya Bridal Studio, Coimbatore, Tamil Nadu'
};

const PAGES = [
  ['index.html', 'Home'], ['about.html', 'About'], ['services.html', 'Services'],
  ['staff.html', 'Our Team'], ['shop.html', 'Shop'], ['contact.html', 'Contact']
];

/* ---------- Header / Footer injection ---------- */
const current = location.pathname.split('/').pop() || 'index.html';
document.body.insertAdjacentHTML('afterbegin', `<div id="loader"><span class="gold-text">LIYA</span></div>`);

const header = document.getElementById('site-header');
if (header) {
  header.innerHTML = `
  <header id="hdr"><div class="container nav">
    <a href="index.html" class="logo"><span class="gold-text">Liya</span> Bridal Studio<small>Beauty Salon</small></a>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="menu" id="menu">
      ${PAGES.map(p => `<a href="${p[0]}" class="${p[0] === current ? 'active' : ''}">${p[1]}</a>`).join('')}
      <a href="contact.html#book" class="btn btn-gold" style="padding:9px 22px">Book Now</a>
    </nav>
  </div></header>`;
}
const footer = document.getElementById('site-footer');
if (footer) {
  footer.innerHTML = `
  <footer><div class="container">
    <div class="foot">
      <div><a href="index.html" class="logo"><span class="gold-text">Liya</span> Bridal Studio<small>Beauty Salon</small></a>
        <p style="margin-top:16px">Where every bride becomes a masterpiece. Premium bridal makeup, hair, skin &amp; beauty services in Coimbatore.</p></div>
      <div><h4>Quick Links</h4><ul>${PAGES.map(p => `<li><a href="${p[0]}">${p[1]}</a></li>`).join('')}</ul></div>
      <div><h4>Services</h4><ul><li>Bridal Makeup</li><li>Hair Styling</li><li>Facial &amp; Skin</li><li>Mehendi &amp; Nails</li><li>Saree Draping</li></ul></div>
      <div><h4>Visit Us</h4><ul>
        <li>📍 <a href="${CONFIG.map}" target="_blank" rel="noopener">${CONFIG.address}</a></li>
        <li>📞 <a href="tel:${CONFIG.phone.replace(/\s/g, '')}">${CONFIG.phone}</a></li>
        <li>🕘 Mon–Sun: 9:30 AM – 8:00 PM</li>
        <li>📸 <a href="${CONFIG.insta}" target="_blank" rel="noopener">@liyabridalstudiobeautysalon</a></li></ul></div>
    </div>
    <div class="copy">© ${new Date().getFullYear()} Liya Bridal Studio. All rights reserved.</div>
  </div></footer>
  <a class="wa-float" target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi Liya Bridal Studio, I would like to know more about your services.')}">💬</a>
  <button class="to-top" id="toTop" aria-label="Top">↑</button>
  <div class="toast" id="toast"></div>`;
}

/* ---------- Header behaviour ---------- */
const hdr = document.getElementById('hdr');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const toTop = document.getElementById('toTop');
burger?.addEventListener('click', () => {
  burger.classList.toggle('open'); menu.classList.toggle('open');
});
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open'); menu.classList.remove('open');
}));
const onScroll = () => {
  hdr?.classList.toggle('scrolled', scrollY > 50);
  toTop?.classList.toggle('show', scrollY > 500);
};
addEventListener('scroll', onScroll); onScroll();
toTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
addEventListener('load', () => setTimeout(() => document.getElementById('loader')?.classList.add('hide'), 500));

function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Auto counters ---------- */
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, dur = 2200, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(end * ease).toLocaleString('en-IN') + (el.dataset.suffix || '');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick); co.unobserve(el);
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

/* ---------- Before / After slider ---------- */
const baImgs = {
  bridal: ['https://picsum.photos/seed/bridal-b/1000/625', 'https://picsum.photos/seed/bridal-a/1000/625'],
  skin: ['https://picsum.photos/seed/skin-b/1000/625', 'https://picsum.photos/seed/skin-a/1000/625'],
  hair: ['https://picsum.photos/seed/hair-b/1000/625', 'https://picsum.photos/seed/hair-a/1000/625']
};
const ba = document.getElementById('ba');
if (ba) {
  const after = ba.querySelector('.after'), before = ba.querySelector('.before');
  const handle = ba.querySelector('.ba-handle'), range = ba.querySelector('input');
  const set = v => { after.style.clipPath = `inset(0 0 0 ${v}%)`; handle.style.left = v + '%'; };
  range.addEventListener('input', e => set(e.target.value));
  document.querySelectorAll('.ba-tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.ba-tabs button').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    before.src = baImgs[b.dataset.k][0]; after.src = baImgs[b.dataset.k][1];
    range.value = 50; set(50);
  }));
  // gentle intro animation
  let v = 50, dir = 1, n = 0;
  const demo = setInterval(() => {
    v += dir * 1.2; if (v > 70 || v < 30) dir *= -1; set(v);
    if (++n > 90) { clearInterval(demo); set(50); }
  }, 20);
  range.addEventListener('pointerdown', () => clearInterval(demo), { once: true });
}

/* ---------- Testimonials slider ---------- */
const tItems = document.querySelectorAll('.t-item');
if (tItems.length) {
  const dots = document.getElementById('tdots'); let i = 0, timer;
  tItems.forEach((_, k) => { const s = document.createElement('span'); s.onclick = () => { show(k); reset(); }; dots.appendChild(s); });
  const show = k => {
    i = k;
    tItems.forEach((t, x) => t.classList.toggle('on', x === k));
    [...dots.children].forEach((d, x) => d.classList.toggle('on', x === k));
  };
  const reset = () => { clearInterval(timer); timer = setInterval(() => show((i + 1) % tItems.length), 5000); };
  show(0); reset();
}

/* ---------- Shop + Cart + PDF + WhatsApp ---------- */
const PRODUCTS = [
  { id: 1, name: 'Gold Glow Face Serum', cat: 'Skin', price: 899 },
  { id: 2, name: 'Bridal Matte Lipstick Set', cat: 'Makeup', price: 1499 },
  { id: 3, name: 'Argan Hair Oil', cat: 'Hair', price: 599 },
  { id: 4, name: 'Pro HD Foundation', cat: 'Makeup', price: 1299 },
  { id: 5, name: 'Rose Gold Brush Kit', cat: 'Tools', price: 1999 },
  { id: 6, name: 'Hydrating Face Mask Pack', cat: 'Skin', price: 449 },
  { id: 7, name: 'Keratin Shine Shampoo', cat: 'Hair', price: 699 },
  { id: 8, name: 'Nail Art Gel Collection', cat: 'Nails', price: 799 },
  { id: 9, name: 'Kajal & Eyeliner Duo', cat: 'Makeup', price: 349 },
  { id: 10, name: 'Sunscreen SPF 50', cat: 'Skin', price: 549 },
  { id: 11, name: 'Bridal Hair Accessories', cat: 'Hair', price: 1199 },
  { id: 12, name: 'Mehendi Cone (Pack of 6)', cat: 'Nails', price: 299 }
].map(p => ({ ...p, img: `https://picsum.photos/seed/liya-prod${p.id}/500/500` }));

const grid = document.getElementById('shop-grid');
if (grid) {
  let cart = JSON.parse(localStorage.getItem('liyaCart') || '[]');
  const fmt = n => '₹' + n.toLocaleString('en-IN');
  const save = () => localStorage.setItem('liyaCart', JSON.stringify(cart));

  const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
  const bar = document.getElementById('shop-bar');
  bar.innerHTML = cats.map((c, i) => `<button class="${i ? '' : 'on'}" data-c="${c}">${c}</button>`).join('');
  const render = c => {
    grid.innerHTML = PRODUCTS.filter(p => c === 'All' || p.cat === c).map(p => `
      <div class="card product reveal in"><div class="frame"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="info"><small style="color:var(--gold)">${p.cat}</small><h3>${p.name}</h3>
      <div class="pr"><b>${fmt(p.price)}</b><button class="add" data-id="${p.id}">+ Add</button></div></div></div>`).join('');
  };
  bar.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    bar.querySelectorAll('button').forEach(b => b.classList.remove('on')); e.target.classList.add('on');
    render(e.target.dataset.c);
  });
  render('All');

  const drawer = document.getElementById('drawer'), overlay = document.getElementById('overlay');
  const list = document.getElementById('cart-list'), count = document.getElementById('cart-count'), totalEl = document.getElementById('cart-total');
  const toggle = o => { drawer.classList.toggle('open', o); overlay.classList.toggle('show', o); };
  document.getElementById('cart-open').onclick = () => toggle(true);
  document.getElementById('cart-close').onclick = () => toggle(false);
  overlay.onclick = () => toggle(false);

  function drawCart() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    count.textContent = cart.reduce((s, i) => s + i.qty, 0);
    totalEl.textContent = fmt(total);
    list.innerHTML = cart.length ? cart.map(i => `
      <div class="ci"><img src="${i.img}" alt=""><div class="n">${i.name}<small>${fmt(i.price)}</small></div>
      <div class="qty"><button data-a="-" data-id="${i.id}">−</button><span>${i.qty}</span><button data-a="+" data-id="${i.id}">+</button></div></div>`).join('')
      : '<p style="color:var(--muted);text-align:center;margin-top:40px">Your cart is empty ✨</p>';
    save();
  }
  grid.addEventListener('click', e => {
    const b = e.target.closest('.add'); if (!b) return;
    const p = PRODUCTS.find(x => x.id == b.dataset.id), ex = cart.find(x => x.id === p.id);
    ex ? ex.qty++ : cart.push({ ...p, qty: 1 });
    drawCart(); toast(p.name + ' added');
  });
  list.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const it = cart.find(x => x.id == b.dataset.id);
    it.qty += b.dataset.a === '+' ? 1 : -1;
    if (it.qty <= 0) cart = cart.filter(x => x !== it);
    drawCart();
  });
  drawCart();

  document.getElementById('send-wa').addEventListener('click', async () => {
    if (!cart.length) return toast('Add some items first');
    const name = document.getElementById('cust-name').value.trim() || 'Customer';
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const text = `Hello ${CONFIG.studio}! I'd like to order:\n` +
      cart.map(i => `• ${i.name} x${i.qty} = Rs.${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n') +
      `\n\nTotal: Rs.${total.toLocaleString('en-IN')}\nName: ${name}`;

    // Build PDF
    const { jsPDF } = window.jspdf; const doc = new jsPDF();
    doc.setFillColor(10, 10, 10); doc.rect(0, 0, 210, 38, 'F');
    doc.setTextColor(201, 162, 74); doc.setFontSize(22); doc.text('LIYA BRIDAL STUDIO', 14, 18);
    doc.setFontSize(10); doc.text('Order Summary / Enquiry', 14, 28);
    doc.setTextColor(40); doc.setFontSize(11);
    doc.text(`Customer: ${name}`, 14, 50); doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 150, 50);
    let y = 64; doc.setFont(undefined, 'bold');
    doc.text('Item', 14, y); doc.text('Qty', 120, y); doc.text('Price', 142, y); doc.text('Amount', 220 - 30, y);
    doc.setFont(undefined, 'normal'); doc.line(14, y + 2, 196, y + 2); y += 10;
    cart.forEach(i => {
      doc.text(i.name, 14, y); doc.text(String(i.qty), 122, y);
      doc.text('Rs.' + i.price.toLocaleString('en-IN'), 142, y);
      doc.text('Rs.' + (i.price * i.qty).toLocaleString('en-IN'), 175, y); y += 9;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.line(14, y, 196, y); y += 9; doc.setFont(undefined, 'bold'); doc.setFontSize(13);
    doc.text('TOTAL: Rs.' + total.toLocaleString('en-IN'), 140, y);
    doc.setFont(undefined, 'normal'); doc.setFontSize(9); doc.setTextColor(120);
    doc.text(`${CONFIG.address}  |  ${CONFIG.phone}`, 14, 285);

    const blob = doc.output('blob');
    const file = new File([blob], 'Liya-Order.pdf', { type: 'application/pdf' });
    try {
      // Mobile: share PDF straight into WhatsApp
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text });
        return;
      }
    } catch (err) { if (err.name === 'AbortError') return; }
    // Desktop fallback: download PDF + open WhatsApp chat with order text
    doc.save('Liya-Order.pdf');
    toast('PDF downloaded — attach it in WhatsApp');
    setTimeout(() => window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank'), 900);
  });
}

/* ---------- Booking form -> WhatsApp ---------- */
document.getElementById('booking-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg = `Hello ${CONFIG.studio}! I'd like to book an appointment.\n\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nService: ${f.get('service')}\nDate: ${f.get('date')}\nTime: ${f.get('time')}\nNotes: ${f.get('notes') || '-'}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
});
const dateInput = document.querySelector('#booking-form [name=date]');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

/* ---------- Bridal Look Finder quiz (innovation) ---------- */
const quiz = document.getElementById('quiz');
if (quiz) {
  const Q = [
    { q: 'What kind of ceremony is it?', o: ['Traditional / Temple', 'Church / Western', 'Reception / Party'] },
    { q: 'Your preferred makeup vibe?', o: ['Soft & Natural', 'Classic Glam', 'Bold & Dramatic'] },
    { q: 'Skin type?', o: ['Dry', 'Oily', 'Normal / Combination'] }
  ];
  const results = {
    0: ['Royal Traditional Bride', 'Airbrush bridal makeup, temple jewellery styling, bun with gajra & mehendi.'],
    1: ['Modern Glam Bride', 'HD glam makeup, soft curls, gel nails & pre-wedding glow facial.'],
    2: ['Bold Reception Queen', 'Dramatic eyes, sleek hair, saree draping & long-wear base.']
  };
  let step = 0, score = [0, 0, 0];
  const draw = () => {
    if (step >= Q.length) {
      const best = score.indexOf(Math.max(...score)), r = results[best];
      quiz.innerHTML = `<h3 class="gold-text" style="font-family:var(--serif);font-size:1.8rem">${r[0]}</h3><p style="margin:12px 0 22px;color:var(--muted)">${r[1]}</p>
        <a class="btn btn-gold" target="_blank" href="https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Hi! My quiz result: ' + r[0] + '. I would like a bridal consultation.')}">Book This Look</a>
        <button class="btn btn-outline" id="redo" style="margin-left:8px">Retake</button>`;
      document.getElementById('redo').onclick = () => { step = 0; score = [0, 0, 0]; draw(); };
      return;
    }
    quiz.innerHTML = `<small style="color:var(--gold)">Question ${step + 1} / ${Q.length}</small><h3 style="font-family:var(--serif);margin:8px 0 18px">${Q[step].q}</h3>
      <div style="display:grid;gap:10px">${Q[step].o.map((o, i) => `<button class="btn btn-outline" data-i="${i}">${o}</button>`).join('')}</div>`;
    quiz.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { score[+b.dataset.i]++; step++; draw(); });
  };
  draw();
}
