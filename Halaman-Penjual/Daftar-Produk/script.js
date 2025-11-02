// ---------- DATA DUMMY ----------
const products = [
  { id:1, name:"Kaos Hitam Basic", sku:"TSHRT-BLK-M", category:"Kaos", price:99000, stock:12, status:"ACTIVE", updated:"2025-02-04", image:"https://picsum.photos/seed/t1/80/80" },
  { id:2, name:"Hoodie Abu Polos", sku:"HODD-GRY-L", category:"Hoodie", price:189000, stock:2, status:"ACTIVE", updated:"2025-02-03", image:"https://picsum.photos/seed/t2/80/80" },
  { id:3, name:"Topi Navy", sku:"CAP-NVY-OS", category:"Topi", price:59000, stock:5, status:"INACTIVE", updated:"2025-02-02", image:"https://picsum.photos/seed/t3/80/80" },
  { id:4, name:"Gelang Kulit", sku:"ACC-LEA-01", category:"Aksesoris", price:49000, stock:30, status:"ACTIVE", updated:"2025-02-05", image:"https://picsum.photos/seed/t4/80/80" },
  { id:5, name:"Kaos Putih Oversize", sku:"TSHRT-WHT-L", category:"Kaos", price:119000, stock:8, status:"ACTIVE", updated:"2025-02-05", image:"https://picsum.photos/seed/t5/80/80" },
  { id:6, name:"Hoodie Hitam Zip", sku:"HODD-BLK-ZIP", category:"Hoodie", price:219000, stock:0, status:"INACTIVE", updated:"2025-02-01", image:"https://picsum.photos/seed/t6/80/80" },
  { id:7, name:"Topi Trucker", sku:"CAP-TRK-OS", category:"Topi", price:69000, stock:16, status:"ACTIVE", updated:"2025-02-05", image:"https://picsum.photos/seed/t7/80/80" }
];

const state = {
  q: "",
  category: "",
  status: "",
  sort: "updated_desc",
  page: 1,
  perPage: 5,
};

const rupiah = n => new Intl.NumberFormat("id-ID", { style:"currency", currency:"IDR", maximumFractionDigits:0 }).format(n);

// ---------- RENDER ----------
function getFiltered() {
  let rows = [...products];

  // top search + filter search
  const q = (state.q || "").toLowerCase();
  if (q) {
    rows = rows.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }
  if (state.category) rows = rows.filter(p => p.category === state.category);
  if (state.status) rows = rows.filter(p => p.status === state.status);

  // sort
  rows.sort((a,b)=>{
    switch (state.sort) {
      case "price_asc": return a.price - b.price;
      case "price_desc": return b.price - a.price;
      case "stock_asc": return a.stock - b.stock;
      case "stock_desc": return b.stock - a.stock;
      case "updated_desc": default:
        return new Date(b.updated) - new Date(a.updated);
    }
  });

  return rows;
}

function renderTable() {
  const rows = getFiltered();
  const start = (state.page - 1) * state.perPage;
  const pageRows = rows.slice(start, start + state.perPage);

  const tbody = document.getElementById("tbodyProducts");
  tbody.innerHTML = "";

  pageRows.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><img class="img-thumb" src="${p.image}" alt="${p.name}"></td>
      <td class="fw-semibold">${p.name}</td>
      <td>${p.sku}</td>
      <td>${p.category}</td>
      <td class="text-end">${rupiah(p.price)}</td>
      <td class="text-end">${p.stock}</td>
      <td>
        <span class="status-badge ${p.status==='ACTIVE' ? 'status-active':'status-inactive'}">
          ${p.status==='ACTIVE' ? 'Aktif':'Nonaktif'}
        </span>
      </td>
      <td>${p.updated}</td>
      <td class="text-nowrap">
        <a href="../maintenance.html" class="action-btn me-1" title="Edit"><i class="bi bi-pencil"></i></a>
        <button class="action-btn me-1" title="${p.status==='ACTIVE'?'Nonaktifkan':'Aktifkan'}" data-id="${p.id}" data-action="toggle">
          <i class="bi ${p.status==='ACTIVE'?'bi-eye-slash':'bi-eye'}"></i>
        </button>
        <button class="action-btn" title="Hapus" data-id="${p.id}" data-action="delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // page info
  const pageInfo = document.getElementById("pageInfo");
  const end = Math.min(start + state.perPage, rows.length);
  pageInfo.textContent = rows.length
    ? `Menampilkan ${start + 1}–${end} dari ${rows.length} produk`
    : "Tidak ada produk";

  renderPagination(rows.length);
}

function renderPagination(total) {
  const totalPages = Math.max(1, Math.ceil(total / state.perPage));
  state.page = Math.min(state.page, totalPages);

  const ul = document.getElementById("pagination");
  ul.innerHTML = "";

  const makeItem = (label, page, disabled=false, active=false) => {
    const li = document.createElement("li");
    li.className = `page-item ${disabled?'disabled':''} ${active?'active':''}`;
    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label;
    a.addEventListener("click", e=>{
      e.preventDefault();
      if (!disabled && state.page !== page) {
        state.page = page; renderTable();
      }
    });
    li.appendChild(a); ul.appendChild(li);
  };

  makeItem("«", Math.max(1, state.page-1), state.page===1);
  for (let i=1;i<=totalPages;i++){
    if (i===1 || i===totalPages || Math.abs(i-state.page)<=1){
      makeItem(String(i), i, false, i===state.page);
    } else if (Math.abs(i-state.page)===2){
      const li = document.createElement("li");
      li.className = "page-item disabled";
      li.innerHTML = `<span class="page-link">…</span>`;
      ul.appendChild(li);
    }
  }
  makeItem("»", Math.min(totalPages, state.page+1), state.page===totalPages);
}

// ---------- EVENTS ----------
function hookFilters() {
  const $ = (id) => document.getElementById(id);

  $("q").addEventListener("input", e=>{ state.q = e.target.value.trim(); state.page=1; renderTable(); });
  $("topSearch").addEventListener("input", e=>{ state.q = e.target.value.trim(); state.page=1; renderTable(); });
  $("category").addEventListener("change", e=>{ state.category = e.target.value; state.page=1; renderTable(); });
  $("status").addEventListener("change", e=>{ state.status = e.target.value; state.page=1; renderTable(); });
  $("sort").addEventListener("change", e=>{ state.sort = e.target.value; state.page=1; renderTable(); });

  // Deleg act for btn in tables
  document.getElementById("tbodyProducts").addEventListener("click", (e)=>{
    const btn = e.target.closest("button[action-btn], button.action-btn");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;

    if (action === "toggle") {
      const p = products.find(x=>x.id===id);
      p.status = p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      p.updated = new Date().toISOString().slice(0,10);
      renderTable();
    }
    if (action === "delete") {
      if (confirm("Yakin hapus produk ini?")) {
        const idx = products.findIndex(x=>x.id===id);
        if (idx>=0) products.splice(idx,1);
        renderTable();
      }
    }
  });
}

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  hookFilters();
  renderTable();
});
