document.addEventListener('click', (e) => {
  if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
    menuDropdown.style.display = 'none';
  }
});
const userBtn = document.querySelector('.user-item');
const userDropdown = document.getElementById('user-itemDropdown');

userBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  userDropdown.style.display = (userDropdown.style.display === 'flex') ? 'none' : 'flex';
});

fetch("/obtener-nombre", {
  credentials: "include", // 🔥 Necesario para que se envíen las cookies
})
  .then((res) => {
    if (!res.ok) throw new Error("No autorizado");
    return res.json();
  })
  .then((data) => {
    document.getElementById("nombre").textContent = data.nombre;
  })
  .catch((error) => {
    console.error("Error al obtener el nombre:", error);
    document.getElementById("nombre").textContent = "Invitado";
  });
