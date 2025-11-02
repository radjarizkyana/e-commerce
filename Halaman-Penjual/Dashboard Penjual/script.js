const salesSeries = [
    { day: "01", sales: 3200000 },{ day: "04", sales: 2400000 },
    { day: "07", sales: 4800000 },{ day: "10", sales: 5200000 },
    { day: "13", sales: 4100000 },{ day: "16", sales: 6100000 },
    { day: "19", sales: 4300000 },{ day: "22", sales: 7500000 },
    { day: "25", sales: 6800000 },{ day: "28", sales: 8200000 },
];
const recentOrders = [
    { id: "INV-2025-0001", date: "2025-02-01", customer: "Ayu P.", total: 420000, status: "PAID", fulfillment: "PROCESSING" },
    { id: "INV-2025-0002", date: "2025-02-02", customer: "Dimas K.", total: 1299000, status: "PAID", fulfillment: "SHIPPED" },
    { id: "INV-2025-0003", date: "2025-02-03", customer: "Siti R.", total: 239000, status: "UNPAID", fulfillment: "PENDING" },
    { id: "INV-2025-0004", date: "2025-02-04", customer: "Rizky M.", total: 780000, status: "PAID", fulfillment: "DELIVERED" },
    { id: "INV-2025-0005", date: "2025-02-05", customer: "Nadia A.", total: 560000, status: "PAID", fulfillment: "PROCESSING" },
];
const lowStock = [
    { sku: "TSHRT-BLK-M", name: "Kaos Hitam - M", stock: 3 },
    { sku: "HODD-GRY-L", name: "Hoodie Abu - L", stock: 2 },
    { sku: "CAP-NVY-OS", name: "Topi Navy - All Size", stock: 5 },
];
const activeProductsCount = 34;

const rupiah = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function badge(el, type, text){
    const map = {
    PAID:    "border-success text-success bg-success-subtle",
    UNPAID:  "border-warning text-warning bg-warning-subtle",
    PROCESSING:"border-primary text-primary bg-primary-subtle",
    SHIPPED: "border-secondary text-secondary bg-secondary-subtle",
    DELIVERED:"border-success text-success bg-success-subtle",
    PENDING: "border-dark text-dark bg-light"
    };
    const span = document.createElement("span");
    span.className = `badge badge-soft rounded-pill px-2 py-1 ${map[type] || "bg-light"}`;
    span.textContent = text;
    el.appendChild(span);
}

// -------------------- KPI --------------------
function renderKpis(){
    const totalSales = salesSeries.reduce((a,b)=>a+b.sales,0);
    document.getElementById("kpiSales").textContent = rupiah(totalSales);
    const avg = Math.round(totalSales / Math.max(salesSeries.length,1));
    document.getElementById("kpiSalesSub").textContent = `Rata-rata harian: ${rupiah(avg)}`;

    document.getElementById("kpiOrders").textContent = recentOrders.length;
    document.getElementById("kpiActive").textContent = activeProductsCount;
    document.getElementById("kpiLow").textContent = lowStock.length;
}

// -------------------- TABLES --------------------
function renderOrders(){
    const tb = document.getElementById("ordersBody");
    tb.innerHTML = "";
    recentOrders.forEach(o=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><a href="#" class="text-decoration-none">${o.id}</a></td>
        <td>${o.date}</td>
        <td>${o.customer}</td>
        <td>${rupiah(o.total)}</td>
        <td class="status-cell"></td>
        <td class="fulfill-cell"></td>`;
    tb.appendChild(tr);
    badge(tr.querySelector(".status-cell"), o.status, o.status);
    badge(tr.querySelector(".fulfill-cell"), o.fulfillment, o.fulfillment);
    });
}

function renderLowStock(){
    const tb = document.getElementById("lowStockBody");
    tb.innerHTML = "";
    lowStock.forEach(p=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="text-nowrap">${p.sku}</td>
        <td>${p.name}</td>
        <td class="text-end fw-semibold">${p.stock}</td>`;
    tb.appendChild(tr);
    });
}

// -------------------- SVG LINE CHART (no libs) --------------------
function renderChart(){
    const wrap = document.getElementById("salesChart");
    wrap.innerHTML = ""; // reset
    const W = wrap.clientWidth || 800;
    const H = wrap.clientHeight || 240;
    const pad = {t:10,r:20,b:28,l:38};

    const maxVal = Math.max(...salesSeries.map(d=>d.sales), 1);
    const stepX = (W - pad.l - pad.r) / (salesSeries.length - 1);

    // SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);

    // Grid (5 rows)
    const gGrid = document.createElementNS(svg.namespaceURI,"g");
    gGrid.setAttribute("class","chart-grid");
    for(let i=0;i<=5;i++){
    const y = pad.t + (H - pad.t - pad.b) * (i/5);
    const line = document.createElementNS(svg.namespaceURI,"line");
    line.setAttribute("x1", pad.l);
    line.setAttribute("y1", y);
    line.setAttribute("x2", W - pad.r);
    line.setAttribute("y2", y);
    gGrid.appendChild(line);
    }
    svg.appendChild(gGrid);

    // Axis labels (Y)
    const gAxis = document.createElementNS(svg.namespaceURI,"g");
    gAxis.setAttribute("class","chart-axis");
    for(let i=0;i<=5;i++){
    const val = Math.round(maxVal*(1 - i/5));
    const y = pad.t + (H - pad.t - pad.b) * (i/5);
    const t = document.createElementNS(svg.namespaceURI,"text");
    t.setAttribute("x", 6);
    t.setAttribute("y", y+4);
    t.textContent = rupiah(val).replace(",00","");
    gAxis.appendChild(t);
    }
    // Axis labels (X)
    salesSeries.forEach((d,idx)=>{
    const x = pad.l + idx*stepX;
    const t = document.createElementNS(svg.namespaceURI,"text");
    t.setAttribute("x", x-6);
    t.setAttribute("y", H-8);
    t.textContent = d.day;
    gAxis.appendChild(t);
    });
    svg.appendChild(gAxis);

    // Polyline path
    const gLine = document.createElementNS(svg.namespaceURI,"g");
    const path = document.createElementNS(svg.namespaceURI,"path");
    const pathD = salesSeries.map((d,i)=>{
    const x = pad.l + i*stepX;
    const y = pad.t + (1 - d.sales/maxVal) * (H - pad.t - pad.b);
    return (i===0?`M ${x} ${y}`:` L ${x} ${y}`);
    }).join("");
    path.setAttribute("d", pathD);
    path.setAttribute("class","chart-line");
    gLine.appendChild(path);

    // Dots
    salesSeries.forEach((d,i)=>{
    const x = pad.l + i*stepX;
    const y = pad.t + (1 - d.sales/maxVal) * (H - pad.t - pad.b);
    const c = document.createElementNS(svg.namespaceURI,"circle");
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
    c.setAttribute("r", 4);
    c.setAttribute("class","chart-dot");
    c.addEventListener("mouseenter", ()=>{
        c.setAttribute("r", 6);
        c.setAttribute("stroke-width","3");
        c.title = `${d.day}: ${rupiah(d.sales)}`;
    });
    c.addEventListener("mouseleave", ()=>{
        c.setAttribute("r", 4);
        c.setAttribute("stroke-width","2");
    });
    gLine.appendChild(c);
    });

    svg.appendChild(gLine);
    wrap.appendChild(svg);
}

// -------------------- INIT --------------------
function initMonth(){
    const el = document.getElementById("monthPicker");
    const d = new Date();
    el.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    el.addEventListener("change", ()=> {
    // TODO: fetch data for selected month
    
    renderKpis(); renderChart();
    });
}

function init(){
    initMonth();
    renderKpis();
    renderOrders();
    renderLowStock();
    renderChart();
    // Responsive chart
    let resizeTimer;
    window.addEventListener("resize", ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderChart, 150);
    });
}
document.addEventListener("DOMContentLoaded", init);