// Registro
const formRegistro = document.querySelector("#registro");
if (formRegistro) {
  formRegistro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formRegistro);
    const data = new URLSearchParams(formData);

    try {
      const response = await fetch("/registrar", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.ok) {
        alert("Registro exitoso");
        window.location.href = "/"; // o la página que quieras
      } else {
        const text = await response.text();
        alert("Error en el registro: " + text);
      }
    } catch (error) {
      alert("Error de red o servidor");
      console.error(error);
    }
  });
}

// Login
const formLogin = document.querySelector("#loginForm form");
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formLogin);
    const data = new URLSearchParams(formData);

    try {
      const response = await fetch("/login", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.ok) {
        alert("Inicio de sesión exitoso");
        const resultado = await response.json();
        window.location.href = resultado.redirect; // 🔁 Redirecciona según lo que devuelva el servidor
        // window.location.href = "../vuelos/vuelos.html"; // o dashboard
      } else if (response.status === 401) {
        alert("Credenciales incorrectas");
      } else {
        const text = await response.text();
        alert("Error en el inicio de sesión: " + text);
      }
    } catch (error) {
      alert("Error de red o servidor");
      console.error(error);
    }
  });
}
