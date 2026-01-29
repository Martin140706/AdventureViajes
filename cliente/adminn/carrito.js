document.addEventListener("DOMContentLoaded", () => {
  // 🔽 MENU HAMBURGUESA (si existe)
  const menuDropdown = document.getElementById("menuDropdown");
  const menuBtn = document.getElementById("menuBtn");

  if (menuDropdown && menuBtn) {
    document.addEventListener("click", (e) => {
      if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        menuDropdown.style.display = "none";
      }
    });
  }

  // 👤 DROPDOWN USUARIO
  const userBtn = document.querySelector(".user-item");
  const userDropdown = document.getElementById("user-itemDropdown");

  if (userBtn && userDropdown) {
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userDropdown.style.display =
        userDropdown.style.display === "flex" ? "none" : "flex";
    });
  }

  // 💱 MONEDA - CLASE DROPDOWN
  class CurrencyDropdown {
    constructor() {
      this.dropdown = document.getElementById("currencyDropdown");
      this.btn = document.getElementById("currencyBtn");
      this.menu = document.getElementById("currencyMenu");
      this.currentFlag = document.getElementById("currentFlag");
      this.currentCode = document.getElementById("currentCode");
      this.options = document.querySelectorAll(".currency-option");
      this.init();
    }

    init() {
      if (!this.btn || !this.dropdown) return;

      this.btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      this.options.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          this.selectCurrency(option);
        });
      });

      document.addEventListener("click", (e) => {
        if (!this.dropdown.contains(e.target)) {
          this.closeMenu();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeMenu();
      });
    }

    toggleMenu() {
      this.dropdown.classList.toggle("open");
    }

    closeMenu() {
      this.dropdown.classList.remove("open");
    }

    selectCurrency(option) {
      const flag = option.dataset.flag;
      const code = option.dataset.code;

      this.currentFlag.textContent = flag;
      this.currentCode.textContent = code;

      this.options.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      this.closeMenu();

      const event = new CustomEvent("currencyChanged", {
        detail: { flag, code, name: option.dataset.name },
      });
      document.dispatchEvent(event);
    }
  }

  // Inicializar dropdown de moneda
  new CurrencyDropdown();

  // Event listener para cambio de moneda (opcional)
  document.addEventListener("currencyChanged", (e) => {
    console.log("Moneda cambiada a:", e.detail);
    // Podés agregar lógica acá si lo necesitás
  });

  // 🛒 Enviar pedido al backend
  const enviarBtn = document.getElementById("enviarPedidoBtn");
  if (enviarBtn) {
    enviarBtn.addEventListener("click", async () => {
      console.log("Botón 'Enviar pedido' fue presionado");

      try {
        const resUsuario = await fetch("/obtener-nombre", {
          credentials: "include",
        });

        if (!resUsuario.ok) {
          alert("Debes iniciar sesión para enviar el pedido.");
          return;
        }

        const dataUsuario = await resUsuario.json();
        const email = dataUsuario.nombre; // Usar 'email' si lo devuelve así

        const totalTexto = document.getElementById("total").textContent;
        const soloNumeros = totalTexto
          .replace(/[^\d.,]/g, "")
          .replace(".", "")
          .replace(",", ".");
        const total = parseFloat(soloNumeros);

        if (isNaN(total) || total <= 0) {
          alert("El carrito está vacío o el total es inválido.");
          return;
        }

        const res = await fetch("/enviar-pedido", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, total }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          alert("Error al enviar el pedido: " + errorText);
          return;
        }

        const resultado = await res.json();
        alert("Pedido enviado correctamente. ID: " + resultado.id_pedido);

        // Limpieza visual del carrito
        if (typeof cargarCarrito === "function") {
          cargarCarrito();
        }
        document.getElementById("total").textContent = "AR$ 0";
      } catch (err) {
        console.error("Error al enviar pedido:", err);
        alert("Error inesperado al enviar pedido.");
      }
    });
  }
});
