// Función para formatear fecha a dd/mm/yyyy
function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  return `${dia}/${mes}/${año}`;
}

// Cargar pedidos y mostrarlos en el DOM
function formatearNumeroTextoATextoConPuntos(str) {
  let limpio = str.replace(/\./g, "").replace(/,/g, ".");
  const num = Number(limpio);
  if (isNaN(num)) return str;
  return num.toLocaleString("es-AR");
}

async function cargarPedidosAdmin() {
  const contenedor = document.querySelector(".pedidosAdmin");
  contenedor.innerHTML = "";

  try {
    const res = await fetch("/obtener-pedidos");
    if (!res.ok) throw new Error("Error al obtener pedidos");

    const pedidos = await res.json();

    if (pedidos.length === 0) {
      contenedor.innerHTML = "<p>No hay pedidos aún.</p>";
      return;
    }

    pedidos.forEach((pedido) => {
      const divPedido = document.createElement("div");
      divPedido.className = "pedido";

      const totalFormateado = formatearNumeroTextoATextoConPuntos(pedido.total);

      divPedido.innerHTML = `
        <h3>Pedido #${pedido.id_pedido}</h3>
        <hr class="vertical-line" />
        <p><strong>Cliente:</strong> ${pedido.email}</p>
        <p><strong>Total:</strong> AR$ ${totalFormateado}</p>
        <p><strong>Estado:</strong> ${pedido.estado}</p>
        <hr class="vertical-line" />
        <div class="botones-accion">
          <button class="acept" data-id="${pedido.id_pedido}">Aceptar</button>
          <button class="recha" data-id="${pedido.id_pedido}">Rechazar</button>
        </div>
      `;

      contenedor.appendChild(divPedido);
    });

    // Agregar event listeners a botones aceptar
    document.querySelectorAll(".acept").forEach((boton) => {
      boton.addEventListener("click", () => {
        const idPedido = boton.getAttribute("data-id");
        cambiarEstadoPedido(idPedido, "aceptado"); // o el estado que quieras poner
      });
    });

    // Agregar event listeners a botones rechazar
    document.querySelectorAll(".recha").forEach((boton) => {
      boton.addEventListener("click", () => {
        const idPedido = boton.getAttribute("data-id");
        cambiarEstadoPedido(idPedido, "rechazado"); // o el estado que quieras poner
      });
    });
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error al cargar pedidos.</p>";
  }
}

// Función para cambiar estado del pedido enviando POST al backend
async function cambiarEstadoPedido(idPedido, nuevoEstado) {
  try {
    const res = await fetch("/cambiar-estado-pedido", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_pedido: Number(idPedido),
        estado: nuevoEstado,
      }),
    });

    if (!res.ok) {
      const textoError = await res.text();
      alert("Error al cambiar estado: " + textoError);
      return;
    }

    alert(`Pedido #${idPedido} ${nuevoEstado}`);
    cargarPedidosAdmin(); // recargar la lista para actualizar estados
  } catch (err) {
    console.error(err);
    alert("Error inesperado al cambiar estado");
  }
}

// Cargar pedidos al iniciar la página
window.addEventListener("DOMContentLoaded", cargarPedidosAdmin);
