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
});
