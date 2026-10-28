/* Liya Bridal Studio — front-end demo. Configure the studio WhatsApp number before launch. */
const WHATSAPP_NUMBER = ""; // Add country code + number, digits only, e.g. 919876543210

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

// Reveal sections as they enter the viewport.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Animated counters.
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll(".count-up").forEach(el => counterObserver.observe(el));

// Before/after slider.
const compareRange = document.getElementById("compareRange");
const comparison = document.getElementById("comparison");
function updateComparison() {
  const value = `${compareRange.value}%`;
  comparison.style.setProperty("--split", value);
}
compareRange?.addEventListener("input", updateComparison);
updateComparison();

// Demo shop cart.
const products = [
  { id: "1", name: "Daily Glow Serum", price: 699 },
  { id: "2", name: "Nourish Hair Oil", price: 449 },
  { id: "3", name: "Soft Touch Hand Cream", price: 299 }
];
const cart = new Map();
const money = amount => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartFeedback = document.getElementById("cartFeedback");
function renderCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + products.find(p => p.id === id).price * qty, 0);
  cartCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  cartTotal.textContent = money(total);
  if (!entries.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is waiting for a little something.</p>';
    return;
  }
  cartItems.innerHTML = entries.map(([id, qty]) => {
    const p = products.find(item => item.id === id);
    return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} each</small></div><div class="qty-controls"><button type="button" data-qty="${id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${qty}</span><button type="button" data-qty="${id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button></div></div>`;
  }).join("");
}
document.querySelectorAll("[data-add]").forEach(button => button.addEventListener("click", () => {
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast("Added to your bag");
}));
cartItems.addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");
  if (!button) return;
  const id = button.dataset.qty;
  const next = (cart.get(id) || 0) + Number(button.dataset.delta);
  if (next <= 0) cart.delete(id); else cart.set(id, next);
  renderCart();
});
function cartSummary() {
  const rows = [...cart.entries()].map(([id, qty]) => {
    const p = products.find(item => item.id === id);
    return { ...p, qty, subtotal: p.price * qty };
  });
  return { rows, total: rows.reduce((sum, row) => sum + row.subtotal, 0) };
}
function orderText() {
  const { rows, total } = cartSummary();
  return `Hello Liya Bridal Studio! I'd like to enquire about these products:\n\n${rows.map(r => `• ${r.name} × ${r.qty} — ${money(r.subtotal)}`).join("\n")}\n\nEstimated total: ${money(total)}\nPlease confirm availability and final prices.`;
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}
document.getElementById("pdfButton").addEventListener("click", () => {
  const { rows, total } = cartSummary();
  if (!rows.length) {
    cartFeedback.textContent = "Add at least one product before generating an order.";
    return;
  }
  // A clean print-ready order sheet can be saved as PDF using the browser print dialog.
  const printWindow = window.open("", "_blank", "width=760,height=800");
  if (!printWindow) {
    cartFeedback.textContent = "Please allow pop-ups to generate the order PDF.";
    return;
  }
  const bodyRows = rows.map(r => `<tr><td>${escapeHTML(r.name)}</td><td>${r.qty}</td><td>${money(r.price)}</td><td>${money(r.subtotal)}</td></tr>`).join("");
  printWindow.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Liya Studio Order Enquiry</title><style>body{font:14px Arial,sans-serif;color:#222;padding:35px}h1{font:32px Georgia;color:#8e6e32}p{color:#666}table{border-collapse:collapse;width:100%;margin-top:25px}th,td{padding:12px;border-bottom:1px solid #ddd;text-align:left}th{background:#f5f0e7}tfoot td{font-weight:bold}.note{margin-top:30px;font-size:12px}</style></head><body><h1>LIYA BRIDAL STUDIO</h1><p>Product Order Enquiry · Coimbatore</p><table><thead><tr><th>Product</th><th>Qty</th><th>Unit price</th><th>Subtotal</th></tr></thead><tbody>${bodyRows}</tbody><tfoot><tr><td colspan="3">Estimated total</td><td>${money(total)}</td></tr></tfoot></table><p class="note">Please confirm product availability, final prices and delivery/collection details with the studio. This is an enquiry, not a payment receipt.</p><script>window.onload=()=>window.print();<\/script></body></html>`);
  printWindow.document.close();
  cartFeedback.textContent = "Print dialog opened — choose “Save as PDF”.";
});
document.getElementById("whatsappButton").addEventListener("click", () => {
  if (!cart.size) {
    cartFeedback.textContent = "Add at least one product before creating an order enquiry.";
    return;
  }
  openWhatsApp(orderText());
});
function openWhatsApp(message) {
  if (!WHATSAPP_NUMBER) {
    alert("Before launch, add Liya Bridal Studio's WhatsApp number in script.js (WHATSAPP_NUMBER).");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

// Booking form prepares a message; it never submits personal data to a server.
document.getElementById("bookingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const lines = [
    "Hello Liya Bridal Studio! I'd like to enquire about an appointment.",
    "",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Service: ${data.get("service")}`,
    data.get("date") ? `Preferred date: ${data.get("date")}` : "",
    data.get("message") ? `Message: ${data.get("message")}` : ""
  ].filter(Boolean);
  openWhatsApp(lines.join("\n"));
});

document.querySelectorAll("[data-service]").forEach(link => link.addEventListener("click", () => {
  const service = link.dataset.service;
  const select = document.getElementById("clientService");
  const option = [...select.options].find(o => o.text.toLowerCase().includes(service.split(" ")[0].toLowerCase()));
  if (option) select.value = option.value;
}));
document.getElementById("year").textContent = new Date().getFullYear();

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}


// Floating booking assistant (self-contained; does not depend on getCurrentAppointment()).
(() => {
  const launcher = document.getElementById("floatingChatButton");
  const hint = document.getElementById("floatingChatHint");
  const modal = document.getElementById("bookingModal");
  const close = document.getElementById("closeBookingModal");
  const content = document.getElementById("modalBookingContent");
  const choices = document.getElementById("modalServiceChoices");
  const progress = document.getElementById("modalBookingProgress");
  if (!launcher || !modal || !content || !choices) return;

  const STORE_KEY = "liyaStudioAppointment_v1";
  const SLOTS_KEY = "liyaStudioBookedSlots_v1";
  const prices = {"Bridal Makeup":8000,"Facials & Skin Care":1200,"Hair Styling":800,"Manicure & Pedicure":700,"Hair & Scalp Care":1000,"Threading & Waxing":300};
  const slots = [{time:"10:00",label:"10:00 AM"},{time:"11:30",label:"11:30 AM"},{time:"13:00",label:"1:00 PM"},{time:"14:30",label:"2:30 PM"},{time:"16:00",label:"4:00 PM"}];
  let state = {service:"",date:"",slot:"",name:"",phone:"",extras:[],notes:""};
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const moneyFmt = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  const total = () => [state.service,...state.extras].reduce((sum,s) => sum + (prices[s]||0),0);
  const keyFor = (date,time) => `${date}_${time}`;
  const localDate = (d=new Date()) => { const x=new Date(d.getTime()-d.getTimezoneOffset()*60000); return x.toISOString().slice(0,10); };
  const open = () => { modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); launcher.setAttribute("aria-expanded","true"); if(hint)hint.classList.remove("show"); };
  const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); launcher.setAttribute("aria-expanded","false"); };
  launcher.addEventListener("click",open);
  close?.addEventListener("click",closeModal);
  modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeModal();});
  if(hint){setTimeout(()=>hint.classList.add("show"),2600);setTimeout(()=>hint.classList.remove("show"),6500);}
  function setStep(n){if(progress)progress.style.width=({1:"16%",2:"33%",3:"50%",4:"67%",5:"83%",6:"100%"}[n]||"16%");}
  function setContent(question){content.innerHTML="";const bubble=document.createElement("p");bubble.className="booking-modal-bubble";bubble.textContent=question;content.appendChild(bubble);}
  function addActions(buttons){const row=document.createElement("div");row.className="modal-actions";buttons.forEach(item=>{const b=document.createElement("button");b.type="button";b.className=`button ${item.primary?"button-gold":"button-outline"}`;b.textContent=item.label;b.onclick=item.action;row.appendChild(b);});content.appendChild(row);}
  function addField(label,type,value,placeholder=""){const wrap=document.createElement("div");wrap.className="modal-field";const l=document.createElement("label");l.textContent=label;const input=document.createElement(type==="textarea"?"textarea":"input");if(type!=="textarea")input.type=type;else input.rows=2;input.value=value||"";input.placeholder=placeholder;wrap.append(l,input);content.appendChild(wrap);return input;}
  function chooseService(service){state={service,date:"",slot:"",name:"",phone:"",extras:[],notes:""};showExtras();}
  choices.querySelectorAll("[data-modal-service]").forEach(b=>b.addEventListener("click",()=>chooseService(b.dataset.modalService)));
  function showExtras(){setStep(2);setContent(`Great choice: ${state.service}. Would you like to add another service?`);const extras=["Facials & Skin Care","Hair Styling","Manicure & Pedicure","Hair & Scalp Care","Threading & Waxing"].filter(s=>s!==state.service);const grid=document.createElement("div");grid.className="modal-service-grid";extras.forEach(s=>{const b=document.createElement("button");b.type="button";b.innerHTML=`${s}<small>${moneyFmt(prices[s])} estimate · tap to add</small>`;b.addEventListener("click",()=>{state.extras=state.extras.includes(s)?state.extras.filter(x=>x!==s):[...state.extras,s];b.style.borderColor=state.extras.includes(s)?"#e5cb91":"";});grid.appendChild(b);});content.appendChild(grid);addActions([{label:"Skip extras",action:showDate},{label:"Continue",primary:true,action:showDate}]);}
  function showDate(){setStep(3);setContent("What date would you like to visit? Choose a date to see the five time slots.");const input=addField("Appointment date","date",state.date||localDate(new Date(Date.now()+86400000)));input.min=localDate(new Date(Date.now()+86400000));addActions([{label:"Back",action:showExtras},{label:"Show time slots",primary:true,action:()=>{if(!input.value||input.value<input.min){alert("Please choose tomorrow or a later date.");return;}state.date=input.value;showSlots();}}]);}
  function showSlots(){setStep(4);setContent(`Available slots for ${new Date(state.date+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"})}.`);const grid=document.createElement("div");grid.className="modal-slot-grid";const booked=read(SLOTS_KEY,{});slots.forEach(s=>{const b=document.createElement("button");const isBooked=!!booked[keyFor(state.date,s.time)];const isPast=new Date(`${state.date}T${s.time}:00`)<=new Date();b.disabled=isBooked||isPast;b.className=state.slot===s.time?"chosen":"";b.textContent=`${s.label} · ${isBooked?"Booked":isPast?"Unavailable":state.slot===s.time?"Selected":"Available"}`;b.addEventListener("click",()=>{state.slot=s.time;showSlots();});grid.appendChild(b);});content.appendChild(grid);const note=document.createElement("p");note.className="booking-modal-note";note.textContent="Five sample slots per day. This availability is local to this browser, not shared with the salon.";content.appendChild(note);addActions([{label:"Change date",action:showDate},{label:"Continue",primary:true,action:()=>{if(!state.slot){alert("Please select an available slot.");return;}showDetails();}}]);}
  function showDetails(){setStep(5);setContent("Almost there! Please add your contact details.");const name=addField("Full name","text",state.name,"Your name");const phone=addField("Mobile number","tel",state.phone,"Your phone number");const notes=addField("Special requests (optional)","textarea",state.notes,"Any details for the studio?");addActions([{label:"Back",action:showSlots},{label:"Review package",primary:true,action:()=>{state.name=name.value.trim();state.phone=phone.value.trim();state.notes=notes.value.trim();if(!state.name||!state.phone){alert("Please enter your name and phone number.");return;}showReview();}}]);}
  function showReview(){setStep(6);setContent("Please check your appointment and package before saving it in this browser.");const sum=document.createElement("div");sum.className="modal-summary";const dateText=new Date(state.date+"T12:00:00").toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"});const timeText=slots.find(s=>s.time===state.slot)?.label||state.slot;sum.innerHTML=`<strong>${state.name}</strong><br>${dateText} · ${timeText}<br>${state.phone}<hr style="border-color:#393329">${[state.service,...state.extras].map(s=>`${s} — ${moneyFmt(prices[s])}`).join("<br>")}<hr style="border-color:#393329"><strong>Estimated total: ${moneyFmt(total())}</strong>${state.notes?`<br>Notes: ${escapeHtml(state.notes)}`:""}`;content.appendChild(sum);const note=document.createElement("p");note.className="booking-modal-note";note.textContent="Prices are illustrative. This prototype saves locally; it does not verify live salon availability or notify staff.";content.appendChild(note);addActions([{label:"Edit details",action:showDetails},{label:"Confirm & create PDF",primary:true,action:confirm}]);}
  function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function confirm(){const booked=read(SLOTS_KEY,{});const k=keyFor(state.date,state.slot);const datetime=new Date(`${state.date}T${state.slot}:00`);if(datetime<=new Date()){alert("That time has passed. Please select another slot.");showDate();return;}if(booked[k]){alert("That slot was just booked in this browser. Please choose another.");showSlots();return;}const appointment={id:"LIYA-"+Date.now().toString(36).toUpperCase(),service:state.service,extras:state.extras,services:[state.service,...state.extras],date:state.date,slot:state.slot,datetime:datetime.toISOString(),name:state.name,phone:state.phone,notes:state.notes,total:total()};booked[k]={id:appointment.id,name:appointment.name,datetime:appointment.datetime};write(SLOTS_KEY,booked);write(STORE_KEY,appointment);setContent("");const success=document.createElement("div");success.className="modal-success";success.innerHTML=`<strong>Appointment saved! ✨</strong>Thank you, ${escapeHtml(appointment.name)}. Your appointment is saved in this browser. Please generate the PDF and contact the salon to verify the booking.`;content.appendChild(success);addActions([{label:"Generate package PDF",primary:true,action:()=>makePdf(appointment)},{label:"Close",action:closeModal}]);showToast("Appointment saved in this browser");renderCountdown(appointment);}
  function makePdf(a){const w=window.open("","_blank","width=800,height=850");if(!w){alert("Please allow pop-ups to generate the PDF.");return;}const rows=a.services.map(s=>`<tr><td>${escapeHtml(s)}</td><td>${moneyFmt(prices[s])}</td></tr>`).join("");w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Liya Bridal Studio Package</title><style>body{font:14px Arial;padding:35px;color:#222}h1{font:italic 38px Georgia;color:#987331}h2{font:26px Georgia;font-weight:400}table{border-collapse:collapse;width:100%;margin-top:20px}td,th{padding:12px;border-bottom:1px solid #ddd;text-align:left}th{background:#f5f0e7}.total{font-size:18px;color:#987331;text-align:right;margin-top:20px}.note{font-size:11px;color:#666;line-height:1.7;margin-top:25px}</style></head><body><h1>LIYA</h1><p>BRIDAL STUDIO · COIMBATORE</p><hr><h2>Your custom beauty package</h2><p><b>Client:</b> ${escapeHtml(a.name)}<br><b>Phone:</b> ${escapeHtml(a.phone)}<br><b>Date:</b> ${escapeHtml(new Date(a.date+"T12:00:00").toLocaleDateString())}<br><b>Time:</b> ${escapeHtml(slots.find(s=>s.time===a.slot)?.label||a.slot)}<br><b>Reference:</b> ${escapeHtml(a.id)}</p><table><thead><tr><th>Service</th><th>Estimated amount</th></tr></thead><tbody>${rows}</tbody></table><p class="total">Estimated total: <b>${moneyFmt(a.total)}</b></p>${a.notes?`<p><b>Notes:</b> ${escapeHtml(a.notes)}</p>`:""}<p class="note">Demo estimate only. This PDF is not a confirmed salon booking or payment receipt. Appointment data is saved only in this browser. Please confirm service prices and slot availability directly with Liya Bridal Studio.</p><script>window.onload=()=>window.print();<\/script></body></html>`);w.document.close();}
  function renderCountdown(a){const old=document.getElementById("modalAppointmentCountdown");if(old)old.remove();const card=document.createElement("div");card.id="modalAppointmentCountdown";card.className="modal-summary";card.innerHTML=`<strong>Upcoming appointment</strong><br>${escapeHtml(a.service)} · ${escapeHtml(a.date)} ${escapeHtml(a.slot)}<br><span id="modalCountdownTimer"></span>`;const hero=document.querySelector(".hero-content");if(hero)hero.appendChild(card);const update=()=>{const remain=new Date(a.datetime)-Date.now();if(remain<=0){card.remove();return;}const d=Math.floor(remain/86400000),h=Math.floor(remain%86400000/3600000),m=Math.floor(remain%3600000/60000),s=Math.floor(remain%60000/1000);const el=document.getElementById("modalCountdownTimer");if(el)el.textContent=`${d}d ${h}h ${m}m ${s}s remaining`;};update();setInterval(update,1000);}
  const saved=read(STORE_KEY,null);if(saved&&new Date(saved.datetime)>new Date())renderCountdown(saved);
})();
