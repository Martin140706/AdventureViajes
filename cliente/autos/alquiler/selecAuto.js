document.querySelectorAll(".btn-agregar-carrito").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".car-card");

    const auto = {
      modelo: card.dataset.modelo,
      ciudad: card.dataset.ciudad,
      plazas: card.dataset.plazas,
      precio_dia: Number(card.dataset.precio_dia),
    };

    fetch("/guardar-auto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auto),
    })
      .then((res) => {
        if (res.ok) {
          alert("Auto agregado al carrito correctamente");
        } else {
          alert("Error al agregar el auto");
        }
      })
      .catch(() => alert("Error en la conexión al servidor"));
  });
});
