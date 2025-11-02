// Bisa diisi interaksi kecil nantinya, contoh highlight menu
const menuItems = document.querySelectorAll('.menu li');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.menu li.active').classList.remove('active');
    item.classList.add('active');
  });
});
