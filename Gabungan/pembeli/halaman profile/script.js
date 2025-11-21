document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const togglePass = document.getElementById('togglePass');

  const inputs = Array.from(document.querySelectorAll('#profileForm input'));
  const readonlyState = () => inputs.forEach(i => i.setAttribute('readonly', 'true'));

  // store original values for cancel
  let original = {};
  const saveOriginal = () => inputs.forEach(i => original[i.name] = i.value);

  // initialize
  readonlyState();
  saveOriginal();

  // toggle penglihatan password
  togglePass.addEventListener('click', () => {
    const p = document.getElementById('password');
    if (p.type === 'password') { p.type = 'text'; togglePass.setAttribute('aria-pressed','true'); }
    else { p.type = 'password'; togglePass.setAttribute('aria-pressed','false'); }
  });

  // Edit isi Profil
  editBtn.addEventListener('click', () => {
    inputs.forEach(i => i.removeAttribute('readonly'));
    editBtn.hidden = true;
    saveBtn.hidden = false;
    cancelBtn.hidden = false;
    // focus first editable field
    const first = inputs.find(i => i.name !== 'password' && i.offsetParent !== null);
    if (first) first.focus();
  });

  // Cancel
  cancelBtn.addEventListener('click', () => {
    inputs.forEach(i => {
      if (original[i.name] !== undefined) i.value = original[i.name];
      i.setAttribute('readonly','true');
    });
    editBtn.hidden = false;
    saveBtn.hidden = true;
    cancelBtn.hidden = true;
  });

  // Save 
  saveBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Masukkan alamat email yang valid.');
      document.getElementById('email').focus();
      return;
    }
    const data = {};
    inputs.forEach(i => data[i.name] = i.value);
    try { localStorage.setItem('Profile', JSON.stringify(data)); } catch(e){ }
    saveOriginal();
    readonlyState();
    editBtn.hidden = false;
    saveBtn.hidden = true;
    cancelBtn.hidden = true;
    alert('Perubahan tersimpan.');
  });

  // logout
  logoutBtn.addEventListener('click', () => {
    if (confirm('Anda yakin ingin logout?')) {
      try { localStorage.removeItem('Profile'); } catch(e){}
      window.location.href = '../../halaman utama/login.html';
    }
  });
  try {
    const saved = localStorage.getItem('Profile');
    if (saved) {
      const obj = JSON.parse(saved);
      inputs.forEach(i => { if (obj[i.name] !== undefined) i.value = obj[i.name]; });
    }
  } catch(e){}
});
