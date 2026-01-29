document.querySelectorAll(".btn-agregar-carrito").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".package-card"); // o '.flight-card' para vuelos

    const paquete = {
      destino: card.dataset.destino,
      fecha: card.dataset.fecha,
      pasajeros: card.dataset.pasajeros,
      precioTotal: Number(card.dataset.precioTotal),
    };

    fetch("/guardar-paquete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paquete),
    })
      .then((res) => {
        if (res.ok) {
          alert("Paquete agregado al carrito correctamente");
        } else {
          alert("Error al agregar el paquete");
        }
      })
      .catch(() => alert("Error en la conexión al servidor"));
  });
});
