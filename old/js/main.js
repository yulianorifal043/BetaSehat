document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const age = document.getElementById("age").value;
  
    const userData = { name, gender, age };
  
    // Simpan ke localStorage
    localStorage.setItem("betaSehatUser", JSON.stringify(userData));
  
    // Arahkan ke halaman screening
    window.location.href = "screening.html";
  });
  