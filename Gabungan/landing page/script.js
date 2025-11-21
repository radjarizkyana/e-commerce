document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Dummy akun
  const dummyAccounts = [
    { email: "admin@gmail.com", password: "admin123", role: "admin" },
    { email: "penjual@gmail.com", password: "penjual123", role: "penjual" },
  ];

  // Register user (pembeli)
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("fullname").value;
      const email = document.getElementById("email").value;
      const pass = document.getElementById("password").value;
      const confirm = document.getElementById("confirmPassword").value;

      if (pass !== confirm) {
        alert("Password tidak cocok!");
        return;
      }

      localStorage.setItem(
        `user_${email}`,
        JSON.stringify({ name, email, password: pass, role: "pembeli" })
      );
      alert("Akun berhasil dibuat! Silakan login.");
      window.location.href = "login.html";
    });
  }

  // Login user
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const pass = document.getElementById("password").value;

      // Cek dummy akun (admin & penjual)
      const dummy = dummyAccounts.find(
        (u) => u.email === email && u.password === pass
      );
      if (dummy) {
        localStorage.setItem("currentUser", JSON.stringify(dummy));
        alert(`Login berhasil sebagai ${dummy.role}`);

        if (dummy.role === "admin") {
          window.location.href = "../admin/index.html";
        } else if (dummy.role === "penjual") {
          window.location.href = "../penjual/dashboard/index.html";
        }
        return;
      }

      // Cek akun pembeli dari localStorage
      const user = localStorage.getItem(`user_${email}`);
      if (!user) {
        alert("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
        return;
      }

      const data = JSON.parse(user);
      if (data.password !== pass) {
        alert("Password salah.");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data));
      alert(`Login berhasil sebagai ${data.role}`);
      window.location.href = "../pembeli/dashboard/index.html"; 
    });
  }

  // Search produk
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = document.getElementById("searchInput").value;
      alert(`Pencarian produk untuk: ${query}`);
    });
  }
});
