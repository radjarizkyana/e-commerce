// app.js 
const categories = [
  { id: 'women', label: 'Wanita', href: 'category.html?cat=wanita' },
  { id: 'kids', label: 'Anak-anak', href: 'category.html?cat=anak-anak' },
  { id: 'men', label: 'Pria', href: 'category.html?cat=pria' },
  { id: 'jewelry', label: 'Perhiasan', href: 'category.html?cat=perhiasan' },
  { id: 'beauty', label: 'Kecantikan', href: 'category.html?cat=kecantikan' },
];

const products = [
  { id:1, title:'Dress', price:299000, oldPrice:399000, imgText:'Dress', category:'women', sale:true, bestseller:false },
  { id:2, title:'Sepatu', price:199000, oldPrice:null, imgText:'Sneakers', category:'kids', sale:false, bestseller:true },
  { id:3, title:'Kemeja', price:179000, oldPrice:249000, imgText:'Kemeja', category:'men', sale:true, bestseller:true },
  { id:4, title:'Kalung', price:499000, oldPrice:699000, imgText:'Kalung', category:'jewelry', sale:true, bestseller:false },
  { id:5, title:'Lipstik', price:99000, oldPrice:null, imgText:'Lipstik', category:'beauty', sale:false, bestseller:true },
  { id:6, title:'Kaos', price:79000, oldPrice:99000, imgText:'Kaos', category:'kids', sale:true, bestseller:false },
  { id:7, title:'Jeans', price:249000, oldPrice:null, imgText:'Jeans', category:'men', sale:false, bestseller:false },
];

document.addEventListener('DOMContentLoaded', () => {
  // common init
  document.getElementById('year').textContent = new Date().getFullYear();

  renderCategories();
  renderProductGrid();
  renderDiscounts();
  renderBestSellers();
  setupCartDemo();

  // hero image upload UI
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');
  const heroImg = document.getElementById('heroImg');
  const heroPlaceholder = document.getElementById('heroPlaceholder');

  if (uploadBtn) uploadBtn.addEventListener('click', () => fileInput.click());

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if(!f) return;
      const url = URL.createObjectURL(f);
      setHeroImage(url);
    });
  }

  // setHeroImage + persist
  window.setHeroImage = function(url){
    const heroImgEl = document.getElementById('heroImg');
    const placeholder = document.getElementById('heroPlaceholder');

    if(!url) {
      if(heroImgEl){ heroImgEl.style.display = 'none'; heroImgEl.src = ''; }
      if(placeholder) placeholder.classList.remove('has-image');
      return;
    }
    if(heroImgEl) heroImgEl.src = url;
    if(heroImgEl) heroImgEl.onload = () => {
      heroImgEl.style.display = 'block';
      if(placeholder) placeholder.classList.add('has-image');
      const pc = placeholder && placeholder.querySelector('.placeholder-content');
      if(pc) pc.style.display = 'none';
    }

    try {
      if(url) localStorage.setItem('Hero', url);
      else localStorage.removeItem('Hero');
    } catch(e) { /* ignore storage errors */ }
  }

  // restore hero if saved
  try {
    const saved = localStorage.getItem('Hero');
    if(saved) window.setHeroImage(saved);
  } catch(e){}

});

/* Render categories as clickable links */
function renderCategories(){
  const ul = document.getElementById('categoryList');
  if(!ul) return;
  ul.innerHTML = '';
  categories.forEach(cat => {
    const a = document.createElement('a');
    a.className = 'category-item';
    a.href = cat.href;
    a.setAttribute('role','link');
    a.innerHTML = `<span aria-hidden="true">🏷️</span><span>${cat.label}</span>`;
    a.addEventListener('keydown', (e) => { if(e.key === 'Enter') location.href = cat.href; });
    ul.appendChild(a);
  });
}

/* Product grid rendering */
function renderProductGrid(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  products.forEach(p => {
    const a = document.createElement('a');
    a.className = 'product-card';
    a.href = `product.html?id=${p.id}`;
    a.innerHTML = `
      <div class="product-thumb" role="img" aria-label="${p.title}">${p.imgText}</div>
      <h3 class="product-title">${p.title}</h3>
      <div class="price-row">
        <div class="price">Rp ${numberWithSep(p.price)}</div>
        ${p.oldPrice ? `<div class="price-old">Rp ${numberWithSep(p.oldPrice)}</div>` : ''}
      </div>
      <div aria-hidden="true">
        ${p.sale ? '<span class="badge sale">Diskon</span>' : ''}
        ${p.bestseller ? '<span class="badge best">Best</span>' : ''}
      </div>
    `;
    a.addEventListener('keydown', (e) => { if(e.key === 'Enter') location.href = a.href; });
    grid.appendChild(a);
  });
}

/* Discounts section */
function renderDiscounts(){
  const node = document.getElementById('discountList');
  if(!node) return;
  node.innerHTML = '';
  const list = products.filter(p => p.sale);
  list.forEach(p => {
    const a = document.createElement('a');
    a.className = 'product-card';
    a.href = `product.html?id=${p.id}`;
    a.innerHTML = `
      <div class="product-thumb">${p.imgText}</div>
      <h3 class="product-title">${p.title}</h3>
      <div class="price-row">
        <div class="price">Rp ${numberWithSep(p.price)}</div>
        ${p.oldPrice ? `<div class="price-old">Rp ${numberWithSep(p.oldPrice)}</div>` : ''}
      </div>
      <div aria-hidden="true"><span class="badge sale">Diskon</span></div>
    `;
    node.appendChild(a);
  });
}

/* Best sellers list */
function renderBestSellers(){
  const ul = document.getElementById('bestSellerList');
  if(!ul) return;
  ul.innerHTML = '';
  const best = products.filter(p => p.bestseller);
  best.forEach(p => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'best-item';
    a.href = `product.html?id=${p.id}`;
    a.innerHTML = `
      <div class="best-thumb" aria-hidden="true">${p.imgText}</div>
      <div>
        <div style="font-weight:600">${p.title}</div>
        <div style="font-size:13px;color:var(--muted)">Rp ${numberWithSep(p.price)}</div>
      </div>
    `;
    li.appendChild(a);
    ul.appendChild(li);
  });
}

/* cart counter */

function addToCart(id){
  if(!id) return;
  const arr = JSON.parse(localStorage.getItem('demoCart') || '[]');
  if(!arr.includes(id)) arr.push(id);
  localStorage.setItem('demoCart', JSON.stringify(arr));
}

/* helper */
function numberWithSep(x){
  if(x === null || x === undefined) return '';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
