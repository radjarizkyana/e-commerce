document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("currentUser"));

  if (!userData) {
    alert("Kamu belum login. Silakan login dulu.");
    window.location.href = "../../halaman utama/login.html";
    return;
  }

  // Isi data profil ke elemen HTML
  document.getElementById("profileName").textContent = userData.name || "-";
  document.getElementById("profileEmail").textContent = userData.email || "-";
  document.getElementById("profileRole").textContent = userData.role || "pembeli";

  // Tombol logout (hapus data login)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("Berhasil logout!");
      window.location.href = "../../halaman utama/login.html";
    });
  }
});