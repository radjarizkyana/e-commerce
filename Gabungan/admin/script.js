const menuItems = document.querySelectorAll('.menu li');

menuItems.forEach(item => {
item.addEventListener('click', () => {
 const activeItem = document.querySelector('.menu li.active');
if (activeItem) {
 activeItem.classList.remove('active');
 }

 item.classList.add('active');

 console.log(`Menu diklik: ${item.textContent.trim()}`);
 });
});