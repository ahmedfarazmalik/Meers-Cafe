// Cart + checkout + page logic
const $=s=>document.querySelector(s), money=n=>`${CONFIG.currency} ${n.toLocaleString("en-PK")}`;
let cart=[],orderType="delivery";
try{cart=JSON.parse(sessionStorage.getItem("cart")||"[]")}catch(e){}
const save=()=>{try{sessionStorage.setItem("cart",JSON.stringify(cart))}catch(e){}};
cart=cart.filter(l=>findItem(l.id));

function isOpen(){
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:CONFIG.timezone,hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date());
  const h=+p.find(x=>x.type==="hour").value%24, m=h*60+(+p.find(x=>x.type==="minute").value);
  return m>=CONFIG.openHour*60 || m<CONFIG.lastOrderHour*60;
}
function renderStatus(){
  const o=isOpen(), el=$("#status");
  el.textContent=o?"Open now · taking orders until 3:00 AM":"Closed · orders open at 11:00 AM";
  el.className="status "+(o?"on":"off");
}

// Qty of a specific item+size currently in cart
function qtyOf(id, size=""){
  const l = cart.find(x=>x.id===id && x.size===(size||""));
  return l ? l.qty : 0;
}

// Category picture path: explicit c.img, otherwise <folder>/<category id>.<ext>
function catImgSrc(c){
  const ci=CONFIG.categoryImages||{};
  return c.img || `${ci.folder||"assets/images/categories"}/${c.id}.${ci.ext||"jpg"}`;
}
// Shows the real image if the file exists; otherwise the "Add Category Image Here" placeholder stays visible
function loadCategoryImages(){
  document.querySelectorAll(".cat-media").forEach(box=>{
    const c=MENU.find(x=>x.id===box.dataset.cat);
    if(!c) return;
    const probe=new Image();
    probe.onload=()=>{
      probe.alt=`${c.title} at ${CONFIG.name}`;
      probe.className="cat-img";
      probe.width=400; probe.height=300;
      probe.loading="lazy"; probe.decoding="async";
      box.appendChild(probe);
      box.classList.add("has-img");
    };
    probe.src=catImgSrc(c);
  });
}

function renderMenu(){
  $("#catnav").innerHTML=MENU.map(c=>`<a href="#${c.id}">${c.title}</a>`).join("");
  $("#menu-list").innerHTML=MENU.map(c=>{
    const count = c.items.length;
    return `<section class="cat reveal" id="${c.id}" aria-labelledby="h-${c.id}">
      <div class="cat-head">
        <figure class="cat-media" data-cat="${c.id}">
          <div class="cat-ph"><span class="cat-ph-msg">Add Category Image Here</span><span class="cat-ph-path">${catImgSrc(c)}</span></div>
        </figure>
        <div class="cat-titles">
          <h3 id="h-${c.id}">${c.title}</h3>
          <span class="cat-count">${count} item${count!==1?"s":""}</span>
        </div>
      </div>
      ${c.note?`<p class="note">${c.note}</p>`:""}
      <div class="grid">${c.items.map(i=>card(i)).join("")}</div>
    </section>`;
  }).join("");
  loadCategoryImages();
}

function card(i){
  const hasSizes = !!i.sizes;
  const sizeSelect = hasSizes
    ? `<select class="size-sel" id="sz-${i.id}" data-size-for="${i.id}" aria-label="Size for ${i.name}">
        ${Object.entries(i.sizes).map(([k,v])=>`<option value="${k}">${k} — ${money(v)}</option>`).join("")}
       </select>`
    : "";

  // For sized items we show qty for currently selected size; for simple items size=""
  const currentSize = hasSizes ? "" : ""; // will be read live
  const q = hasSizes ? 0 : qtyOf(i.id, ""); // initial; live update via renderCardActions

  const priceLabel = hasSizes
    ? `From ${money(Math.min(...Object.values(i.sizes)))}`
    : money(i.price);

  return `<article class="card" data-item="${i.id}">
    <div class="cb">
      <h4>${i.name}</h4>
      ${i.desc?`<p class="desc">${i.desc}</p>`:""}
      ${sizeSelect}
      <div class="card-bottom">
        <span class="price" data-price-for="${i.id}">${priceLabel}</span>
        <div class="actions" data-actions-for="${i.id}">${actionsHtml(i.id, hasSizes)}</div>
      </div>
    </div>
  </article>`;
}

function actionsHtml(id, hasSizes){
  // For items with sizes, qty depends on selected size — read current select value
  let size = "";
  if(hasSizes){
    const sel = document.getElementById("sz-"+id);
    size = sel ? sel.value : (findItem(id).sizes ? Object.keys(findItem(id).sizes)[0] : "");
  }
  const q = qtyOf(id, size);
  if(q > 0){
    return `<div class="qty-ctrl" data-id="${id}" data-size="${size}">
      <button type="button" class="qty-btn" data-delta="-1" aria-label="Decrease">−</button>
      <span class="qty-num">${q}</span>
      <button type="button" class="qty-btn" data-delta="1" aria-label="Increase">+</button>
    </div>`;
  }
  return `<button type="button" class="add-btn" data-add="${id}">ADD TO CART</button>`;
}

function refreshCardActions(id){
  const el = document.querySelector(`[data-actions-for="${id}"]`);
  if(!el) return;
  const item = findItem(id);
  if(!item) return;
  el.innerHTML = actionsHtml(id, !!item.sizes);
  // also update price label if sized
  if(item.sizes){
    const sel = document.getElementById("sz-"+id);
    const size = sel ? sel.value : Object.keys(item.sizes)[0];
    const priceEl = document.querySelector(`[data-price-for="${id}"]`);
    if(priceEl) priceEl.textContent = money(item.sizes[size]);
  }
}

function findItem(id){for(const c of MENU){const i=c.items.find(x=>x.id===id);if(i)return i}}
function priceOf(l){const i=findItem(l.id);return i.sizes?i.sizes[l.size]:i.price}

function changeQty(id, size, delta){
  size = size || "";
  let l = cart.find(x=>x.id===id && x.size===size);
  if(l){
    l.qty += delta;
    if(l.qty < 1) cart = cart.filter(x=>!(x.id===id && x.size===size));
  } else if(delta > 0){
    cart.push({id, size, qty:1});
  }
  save();
  renderCart();
  refreshCardActions(id);
  // pop cart button
  const b=$("#cartbtn");
  b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
}

function add(id){
  const i = findItem(id);
  let size = "";
  if(i.sizes){
    const sel = $("#sz-"+id);
    size = sel ? sel.value : Object.keys(i.sizes)[0];
  }
  changeQty(id, size, 1);
}

function totals(){
  const sub = cart.reduce((s,l)=>s+priceOf(l)*l.qty,0);
  const fee = cart.length && orderType==="delivery" ? CONFIG.deliveryFee : 0;
  return {sub, fee, total: sub+fee};
}

function renderCart(){
  const t = totals();
  $("#count").textContent = cart.reduce((s,l)=>s+l.qty,0);
  $("#lines").innerHTML = cart.length
    ? cart.map((l,n)=>{
        const i=findItem(l.id);
        return `<li>
          <div><b>${i.name}${l.size?` (${l.size})`:""}</b><small>${money(priceOf(l))} each</small></div>
          <div class="q">
            <button data-q="-1" data-n="${n}" aria-label="Decrease">−</button>
            <span>${l.qty}</span>
            <button data-q="1" data-n="${n}" aria-label="Increase">+</button>
            <button data-rm="${n}" aria-label="Remove" class="rm">✕</button>
          </div>
        </li>`;
      }).join("")
    : "<li class='small'>Your cart is empty.</li>";
  $("#sub").textContent = money(t.sub);
  $("#fee").textContent = money(t.fee);
  $("#total").textContent = money(t.total);
  $("#feeRow").style.display = orderType==="delivery" ? "flex" : "none";
  $("#sendBtn").disabled = !cart.length;
}

// ---- Pickup date helpers (uses the restaurant's timezone) ----
function todayISO(){
  return new Intl.DateTimeFormat("en-CA",{timeZone:CONFIG.timezone,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
}
function formatPickDate(iso){
  const [y,m,d]=iso.split("-").map(Number);
  return new Date(y,m-1,d).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}
function refreshPickDateMin(){
  const el=$("#pickDate"); if(!el) return;
  const t=todayISO();
  el.min=t;
  if(el.value && el.value<t) el.value="";
}
function openDatePicker(el){ try{ el.showPicker && el.showPicker(); }catch(e){} }

function setType(t){
  orderType = t;
  document.querySelectorAll(".seg button").forEach(b=>b.classList.toggle("on", b.dataset.t===t));
  $("#delFields").hidden = t!=="delivery";
  $("#pickFields").hidden = t!=="pickup";
  const areaEl=$("#area"), addrEl=$("#addr"), pickEl=$("#pick"), dateEl=$("#pickDate");
  if(areaEl) areaEl.required = t==="delivery";
  if(addrEl) addrEl.required = t==="delivery";
  if(pickEl) pickEl.required = t==="pickup";
  if(dateEl) dateEl.required = t==="pickup";
  refreshPickDateMin();
  renderCart();
}

function toggleSameWa(){
  const same = $("#sameWa").checked;
  const phone = $("#phone");
  phone.required = !same;
  phone.disabled = same;
  if(same){ phone.value=""; phone.placeholder="Same as WhatsApp"; }
  else { phone.placeholder="03XX XXXXXXX"; }
}

function send(e){
  e.preventDefault();
  if(!isOpen()){alert("Sorry, ordering is closed right now. We take orders from 11:00 AM to 3:00 AM.");return}
  if(!cart.length){alert("Your cart is empty.");return}

  const f=e.target, t=totals();
  const sameWa = $("#sameWa") && $("#sameWa").checked;
  const phoneVal = sameWa ? "Same as this WhatsApp" : (f.phone ? f.phone.value.trim() : "");
  if(!sameWa && !phoneVal){ alert("Please enter your call number or check 'Same as my WhatsApp number'."); return; }
  const whatsappVal = (f.whatsapp && f.whatsapp.value.trim()) || "";

  if(orderType==="pickup"){
    refreshPickDateMin();
    if(!f.pickDate.value){ alert("Please choose your pickup date from the calendar."); f.pickDate.focus(); return; }
  }

  const L = [];
  L.push(`*NEW ORDER — ${CONFIG.name}*`);
  L.push("");
  L.push(`*Name:* ${f.name.value.trim()}`);
  L.push(`*WhatsApp Number:* ${whatsappVal || "Not provided"}`);
  L.push(`*Call Number:* ${phoneVal}`);
  L.push(`*Order Type:* ${orderType==="delivery" ? "🛵 Home Delivery" : "🏪 Self Pickup"}`);

  if(orderType==="delivery"){
    L.push(`*Area:* ${$("#area").value}`);
    L.push(`*Address:* ${$("#addr").value.trim()}`);
    L.push(`*Delivery Fee:* ${money(t.fee)}`);
  } else {
    L.push(`*Pickup Date:* ${formatPickDate(f.pickDate.value)}`);
    L.push(`*Pickup Time:* ${f.pick.value.trim() || "As soon as ready"}`);
  }

  L.push("");
  L.push("*ITEMS*");
  cart.forEach(l=>{
    const i=findItem(l.id);
    L.push(`• ${i.name}${l.size?` (${l.size})`:""}  ×${l.qty}  = ${money(priceOf(l)*l.qty)}`);
  });

  L.push("");
  L.push(`*Subtotal:* ${money(t.sub)}`);
  if(orderType==="delivery") L.push(`*Delivery:* ${money(t.fee)}`);
  L.push(`*TOTAL:* ${money(t.total)}`);

  if(f.note && f.note.value.trim()){
    L.push("");
    L.push(`*Other Instructions:* ${f.note.value.trim()}`);
  }

  L.push("");
  L.push("_Please confirm this order. Thank you!_");

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(L.join("\n"))}`,"_blank");
  $("#sent").hidden=false;
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("[data-cfg]").forEach(el=>el.textContent=CONFIG[el.dataset.cfg]);
  $("#logo").src=CONFIG.images.logo;
  $("#hero").style.backgroundImage=`url(${CONFIG.images.hero})`;
  $("#fee-note").textContent=money(CONFIG.deliveryFee);

  const areaSelect = $("#area");
  if(areaSelect && CONFIG.deliveryAreas){
    areaSelect.innerHTML = `<option value="">Select area</option>` +
      CONFIG.deliveryAreas.map(a=>`<option value="${a}">${a}</option>`).join("");
  }

  renderMenu();
  // After menu is in DOM, refresh all action buttons so qty is correct
  MENU.forEach(c=>c.items.forEach(i=>refreshCardActions(i.id)));

  setType("delivery");
  renderStatus();
  setInterval(renderStatus,60000);

  const sameCb = $("#sameWa");
  if(sameCb) sameCb.addEventListener("change", toggleSameWa);

  document.addEventListener("click", e=>{
    const t = e.target;

    // ADD TO CART on card
    if(t.dataset.add){ add(t.dataset.add); return; }

    // +/- on card qty control
    if(t.dataset.delta){
      const ctrl = t.closest(".qty-ctrl");
      if(ctrl){
        changeQty(ctrl.dataset.id, ctrl.dataset.size||"", +t.dataset.delta);
      }
      return;
    }

    // size change → refresh that card's actions + price
    if(t.dataset.sizeFor || (t.classList && t.classList.contains("size-sel"))){
      const id = t.dataset.sizeFor || t.id.replace("sz-","");
      refreshCardActions(id);
      return;
    }

    // cart drawer qty
    if(t.dataset.q){
      const l = cart[+t.dataset.n];
      if(l){
        changeQty(l.id, l.size||"", +t.dataset.q);
      }
      return;
    }
    if(t.dataset.rm){
      const l = cart[+t.dataset.rm];
      if(l){
        cart = cart.filter((_,i)=>i!==+t.dataset.rm);
        save();
        renderCart();
        refreshCardActions(l.id);
      }
      return;
    }

    if(t.dataset.t) setType(t.dataset.t);
    if(t.closest("#cartbtn")){ $("#drawer").classList.add("open"); refreshPickDateMin(); }
    if(t.matches("#close,#scrim")) $("#drawer").classList.remove("open");
  });

  // size select change
  document.addEventListener("change", e=>{
    if(e.target.classList.contains("size-sel")){
      refreshCardActions(e.target.dataset.sizeFor || e.target.id.replace("sz-",""));
    }
  });

  const dateEl=$("#pickDate");
  if(dateEl){
    refreshPickDateMin();
    dateEl.addEventListener("click",()=>openDatePicker(dateEl));
    dateEl.addEventListener("keydown",e=>{
      if(e.key==="Tab") return;                       // keep keyboard navigation
      e.preventDefault();                             // no manual typing
      if(e.key==="Enter"||e.key===" ") openDatePicker(dateEl);
    });
    dateEl.addEventListener("paste",e=>e.preventDefault());
  }

  $("#form").addEventListener("submit", send);

  const io = new IntersectionObserver(es=>es.forEach(x=>{
    if(x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); }
  }),{threshold:.05});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
});
