// Obtener nombre del usuario (si está autenticado)
fetch("/obtener-nombre", {
  credentials: "include",
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

// Función para formatear fecha
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Cargar productos en el carrito
async function cargarCarrito() {
  const contenedor = document.querySelector(".pedidos");
  contenedor.innerHTML = "";

  try {
    // Vuelos
    const resVuelos = await fetch("/obtener-vuelos");
    const vuelos = await resVuelos.json();

    vuelos.forEach((vuelo) => {
      const div = document.createElement("div");
      div.className = "pedido";
      div.dataset.tipo = "vuelo";
      div.dataset.id = vuelo.id_vuelo;

      div.innerHTML = `
        
        <h3>Pedido 1 </h3>
        <hr class="vertical-line" />
        <p>Aceptar<b>Salida:</b> ${formatearFecha(vuelo.fecha)}</p>
        <hr class="vertical-line" />
        <p class="precio" data-precio="${
          vuelo.precio
        }"><b>Precio:</b> AR$ ${Number(vuelo.precio).toLocaleString(
        "es-AR"
      )}</p>
      `;
      contenedor.appendChild(div);
    });

    // Paquetes
    const resPaquetes = await fetch("/obtener-paquetes");
    const paquetes = await resPaquetes.json();

    paquetes.forEach((paquete) => {
      const div = document.createElement("div");
      div.className = "pedido";
      div.dataset.tipo = "paquete";
      div.dataset.id = paquete.id_paquete;

      div.innerHTML = `
        <img src="https://i.ibb.co/v4z7Xw3T/X-circle.png" alt="X-circle" class="btn-borrar" style="cursor:pointer;" />
        <h3>${paquete.destino}</h3>
        <hr class="vertical-line" />
        <p><b>Fecha:</b> ${formatearFecha(paquete.fecha)}</p>
        <hr class="vertical-line" />
        <p><b>Pasajeros:</b> ${paquete.pasajeros}</p>
        <hr class="vertical-line" />
        <p class="precio" data-precio="${
          paquete.precio
        }"><b>Precio:</b> AR$ ${Number(paquete.precio).toLocaleString(
        "es-AR"
      )}</p>
      `;
      contenedor.appendChild(div);
    });

    // Autos
    const resAutos = await fetch("/obtener-autos");
    const autos = await resAutos.json();

    autos.forEach((auto) => {
      const div = document.createElement("div");
      div.className = "pedido";
      div.dataset.tipo = "auto";
      div.dataset.id = auto.id_auto;

      div.innerHTML = `
        <img src="https://i.ibb.co/v4z7Xw3T/X-circle.png" alt="X-circle" class="btn-borrar" style="cursor:pointer;" />
        <h3>${auto.modelo} - ${auto.ciudad}</h3>
        <hr class="vertical-line" />
        <p><b>Plazas:</b> ${auto.plazas}</p>
        <hr class="vertical-line" />
        <p class="precio" data-precio="${
          auto.precio_dia
        }"><b>Precio por día:</b> AR$ ${Number(auto.precio_dia).toLocaleString(
        "es-AR"
      )}</p>
      `;
      contenedor.appendChild(div);
    });

    // Aplicar moneda seleccionada
    const monedaGuardada = localStorage.getItem("moneda") || "AR$";
    actualizarMoneda(monedaGuardada);
    marcarMonedaSeleccionada(monedaGuardada);
  } catch (error) {
    console.error("Error al cargar carrito:", error);
  }
}

// Convertir precios según moneda seleccionada
function actualizarMoneda(moneda) {
  const tasas = {
    AR$: 1,
    USD: 0.0008403,
    R$: 0.004671,
    EU: 0.0007209,
  };

  const simbolos = {
    AR$: "AR$",
    USD: "USD $",
    R$: "R$",
    EU: "€",
  };

  let total = 0;

  document.querySelectorAll(".precio").forEach((p) => {
    const base = parseFloat(p.dataset.precio);
    const tasa = tasas[moneda];
    const simbolo = simbolos[moneda];
    const esPorDia = p.textContent.includes("por día");

    if (isNaN(base)) return;

    let texto;
    if (moneda === "AR$") {
      texto = base.toLocaleString("es-AR");
      total += base;
    } else {
      texto = (base * tasa).toFixed(2);
      total += parseFloat(texto);
    }

    p.innerHTML = esPorDia
      ? `<b>Precio por día:</b> ${simbolo} ${texto}`
      : `<b>Precio:</b> ${simbolo} ${texto}`;
  });

  const totalTexto =
    moneda === "AR$"
      ? `AR$ ${total.toLocaleString("es-AR")}`
      : `${simbolos[moneda]} ${total.toFixed(2)}`;

  document.getElementById("total").textContent = totalTexto;

  // Guardar moneda seleccionada
  localStorage.setItem("moneda", moneda);
}

// Recalcular total al borrar
function recalcularTotalSegunMoneda() {
  const moneda = localStorage.getItem("moneda") || "AR$";
  actualizarMoneda(moneda);
}

// Marcar moneda seleccionada visualmente
function marcarMonedaSeleccionada(moneda) {
  document
    .querySelectorAll(".currency-option")
    .forEach((el) => el.classList.remove("selected"));
  const activa = document.querySelector(
    `.currency-option[data-code="${moneda}"]`
  );
  if (activa) activa.classList.add("selected");
}

// Iniciar
window.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();

  // Eventos de cambio de moneda
  document.querySelectorAll(".currency-option").forEach((option) => {
    option.addEventListener("click", () => {
      const moneda = option.dataset.code;
      actualizarMoneda(moneda);
      marcarMonedaSeleccionada(moneda);
    });
  });
});

// Borrar ítems del carrito
document.querySelector(".pedidos").addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-borrar")) {
    const itemDiv = e.target.closest(".pedido");
    const tipo = itemDiv.dataset.tipo;
    const id = itemDiv.dataset.id;

    let url = "";
    let body = {};

    if (tipo === "vuelo") {
      url = "/borrar-vuelo";
      body = { id_vuelo: Number(id) };
    } else if (tipo === "paquete") {
      url = "/borrar-paquete";
      body = { id_paquete: Number(id) };
    } else if (tipo === "auto") {
      url = "/borrar-auto";
      body = { id_auto: Number(id) };
    } else {
      alert("Tipo de ítem desconocido para borrar");
      return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        itemDiv.remove();
        recalcularTotalSegunMoneda();
      } else {
        const errorText = await res.text();
        alert("Error al eliminar el ítem: " + errorText);
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
      alert("Fallo la conexión con el servidor");
    }
  }
});
