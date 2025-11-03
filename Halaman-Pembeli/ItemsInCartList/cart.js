// cart.js
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const itemsContainer = document.getElementById('itemsContainer');
  const selectAllEl = document.getElementById('selectAll');
  const removeSelectedBtn = document.getElementById('removeSelected');
  const summaryCount = document.getElementById('summaryCount');
  const summaryTotal = document.getElementById('summaryTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  // helper: format number to Indonesian currency style
  function formatPrice(n){
    if(!n && n !== 0) return 'Rp0';
    return 'Rp' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Read saved cart from localStorage and apply to existing DOM rows (no innerHTML)
  function restoreFromStorage(){
    try {
      const raw = localStorage.getItem('demoCart');
      if(!raw) return;
      const saved = JSON.parse(raw);
      saved.forEach(item => {
        const row = itemsContainer.querySelector(`.item-row[data-id="${item.id}"]`);
        if(!row) return; // if product not present in HTML, skip
        // set attributes & visible fields
        row.dataset.qty = String(item.qty);
        const qtySpan = row.querySelector('.qty-num');
        if(qtySpan) qtySpan.textContent = String(item.qty);

        const checkbox = row.querySelector('.item-select');
        if(checkbox) checkbox.checked = !!item.selected;

        // update price displays if needed (we keep them in HTML but update to be safe)
        const priceNow = row.querySelector('.price-now');
        if(priceNow) priceNow.textContent = formatPrice(Number(item.price));
        if(item.oldPrice !== null && item.oldPrice !== undefined){
          const priceOld = row.querySelector('.price-old');
          if(priceOld) priceOld.textContent = formatPrice(Number(item.oldPrice));
        }
      });
    } catch(e){
      // ignore parse errors
      console.warn('restoreFromStorage error', e);
    }
  }

  // Save current DOM state to localStorage (array of items)
  function saveToStorage(){
    const arr = [];
    itemsContainer.querySelectorAll('.item-row').forEach(row => {
      const id = row.dataset.id;
      const price = Number(row.dataset.price || 0);
      const oldPrice = row.dataset.oldPrice ? Number(row.dataset.oldPrice) : null;
      const qty = Number(row.dataset.qty || row.querySelector('.qty-num').textContent || 1);
      const selected = !!row.querySelector('.item-select').checked;
      arr.push({ id, price, oldPrice, qty, selected });
    });
    try { localStorage.setItem('demoCart', JSON.stringify(arr)); } catch(e){}
  }

  // Update summary box based on selected items
  function updateSummary(){
    let totalQty = 0;
    let totalPrice = 0;
    itemsContainer.querySelectorAll('.item-row').forEach(row => {
      const checkbox = row.querySelector('.item-select');
      if(checkbox && checkbox.checked){
        const qty = Number(row.dataset.qty || row.querySelector('.qty-num').textContent || 1);
        const price = Number(row.dataset.price || 0);
        totalQty += qty;
        totalPrice += qty * price;
      }
    });
    summaryCount.textContent = `${totalQty} Produk`;
    summaryTotal.textContent = formatPrice(totalPrice);
    checkoutBtn.disabled = totalQty === 0;
    checkoutBtn.style.opacity = totalQty === 0 ? '0.6' : '1';
  }

  // sync selectAll checkbox with individual checkboxes
  function syncSelectAll(){
    const allRows = Array.from(itemsContainer.querySelectorAll('.item-row'));
    if(allRows.length === 0) { selectAllEl.checked = false; return; }
    const allChecked = allRows.every(row => !!row.querySelector('.item-select').checked);
    selectAllEl.checked = allChecked;
  }

  // Attach listeners to a given item row (no innerHTML)
  function attachRowListeners(row){
    const checkbox = row.querySelector('.item-select');
    const qtyNum = row.querySelector('.qty-num');
    const inc = row.querySelector('.qty-increase');
    const dec = row.querySelector('.qty-decrease');
    const del = row.querySelector('.btn-delete');
    const wish = row.querySelector('.btn-wishlist');

    // checkbox change
    if(checkbox) checkbox.addEventListener('change', () => {
      row.dataset.selected = checkbox.checked ? 'true' : 'false';
      saveToStorage();
      syncSelectAll();
      updateSummary();
    });

    // increase qty
    if(inc){
      inc.addEventListener('click', () => {
        const stock = Number(row.dataset.stock || 0);
        let qty = Number(row.dataset.qty || qtyNum.textContent || 1);
        if(stock && qty >= stock) return; // don't exceed stock
        qty += 1;
        row.dataset.qty = String(qty);
        qtyNum.textContent = String(qty);
        saveToStorage();
        updateSummary();
      });
    }

    // decrease qty
    if(dec){
      dec.addEventListener('click', () => {
        let qty = Number(row.dataset.qty || qtyNum.textContent || 1);
        if(qty <= 1) return;
        qty -= 1;
        row.dataset.qty = String(qty);
        qtyNum.textContent = String(qty);
        saveToStorage();
        updateSummary();
      });
    }

    // delete
    if(del){
      del.addEventListener('click', () => {
        if(!confirm('Hapus produk dari keranjang?')) return;
        row.remove();
        saveToStorage();
        syncSelectAll();
        updateSummary();
      });
    }

    // wishlist placeholder
    if(wish){
      wish.addEventListener('click', () => {
        alert('Ditambahkan ke wishlist (demo).');
      });
    }
  }

  // initial: restore data from storage (if any) and attach listeners to all rows
  restoreFromStorage();
  itemsContainer.querySelectorAll('.item-row').forEach(row => {
    // ensure dataset.qty exists and qty-num matches
    const qtyNum = row.querySelector('.qty-num');
    if(!row.dataset.qty && qtyNum) row.dataset.qty = qtyNum.textContent || '1';
    // update price texts from dataset if possible (no innerHTML)
    const priceNow = row.querySelector('.price-now');
    if(priceNow && row.dataset.price) priceNow.textContent = formatPrice(Number(row.dataset.price));
    const priceOld = row.querySelector('.price-old');
    if(priceOld && row.dataset.oldPrice) priceOld.textContent = formatPrice(Number(row.dataset.oldPrice));
    // set checkbox based on dataset.selected
    const checkbox = row.querySelector('.item-select');
    if(checkbox && row.dataset.selected) checkbox.checked = row.dataset.selected === 'true';
    attachRowListeners(row);
  });

  // selectAll behavior
  selectAllEl.addEventListener('change', () => {
    const target = selectAllEl.checked;
    itemsContainer.querySelectorAll('.item-select').forEach(cb => {
      cb.checked = target;
      // update dataset on parent row
      const row = cb.closest('.item-row');
      if(row) row.dataset.selected = target ? 'true' : 'false';
    });
    saveToStorage();
    updateSummary();
  });

  // remove selected items
  removeSelectedBtn.addEventListener('click', () => {
    const selectedRows = Array.from(itemsContainer.querySelectorAll('.item-row')).filter(r => r.querySelector('.item-select').checked);
    if(selectedRows.length === 0){ alert('Belum ada produk terpilih.'); return; }
    if(!confirm(`Hapus ${selectedRows.length} produk terpilih dari keranjang?`)) return;
    selectedRows.forEach(r => r.remove());
    saveToStorage();
    syncSelectAll();
    updateSummary();
  });

  // checkout action (demo)
  checkoutBtn.addEventListener('click', () => {
    const selected = Array.from(itemsContainer.querySelectorAll('.item-row')).filter(r => r.querySelector('.item-select').checked);
    if(selected.length === 0){ alert('Pilih produk terlebih dahulu.'); return; }
    const total = selected.reduce((s,r) => {
      const qty = Number(r.dataset.qty || r.querySelector('.qty-num').textContent || 1);
      const price = Number(r.dataset.price || 0);
      return s + qty * price;
    }, 0);
    if(confirm(`Checkout ${selected.length} item. Total ${formatPrice(total)}. Lanjut ke pembayaran?`)){
      // In a real app: send selected items to backend / start checkout flow
      window.location.href = 'checkout.html'; // placeholder
    }
  });

  // keep summary and selectAll synced on load
  syncSelectAll();
  updateSummary();
});
