document.querySelectorAll(".select-flight-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const card = btn.closest(".flight-card");

    const vuelo = {
      origen: card.dataset.origen,
      destino: card.dataset.destino,
      fecha: card.dataset.fecha,
      hora: card.dataset.hora, // <--- esto debe ser "08:45"
      precio: card.dataset.precio,
    };

    console.log("Hora seleccionada:", vuelo.hora); // <-- debería decir: 14:20

    const res = await fetch("/guardar-vuelo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vuelo),
    });

    if (res.ok) {
      alert("Vuelo agregado al carrito");
    } else {
      alert("Error al guardar el vuelo");
    }
  });
});
