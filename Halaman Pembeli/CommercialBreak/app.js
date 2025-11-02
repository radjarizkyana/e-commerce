document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');
  const heroImg = document.getElementById('heroImg');
  const heroPlaceholder = document.getElementById('heroPlaceholder');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const url = URL.createObjectURL(f);
    setHeroImage(url);
  });

  // Buat naruh Image di landing page
  window.setHeroImage = function(url){
    if(!url) {
      heroImg.style.display = 'none';
      heroImg.src = '';
      heroPlaceholder.classList.remove('has-image');
      return;
    }
    heroImg.src = url;
    heroImg.onload = () => {
      heroImg.style.display = 'block';
      heroPlaceholder.classList.add('has-image');
      // placeholder hilang jika image sudah ada
      const pc = heroPlaceholder.querySelector('.placeholder-content');
      if(pc) pc.style.display = 'none';
    }
  }

  // Image sudah ada akan disimpan di localstorage
  const origSet = window.setHeroImage;
  window.setHeroImage = function(url){
    origSet(url);
    try{ if(url) localStorage.setItem('Hero', url); else localStorage.removeItem('Hero'); }catch(e){}
  }
});
