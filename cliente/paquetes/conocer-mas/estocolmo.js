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


// Clase para manejar el menú desplegable de monedas
class CurrencyDropdown {
    constructor() {
      this.dropdown = document.getElementById('currencyDropdown');
      this.btn = document.getElementById('currencyBtn');
      this.menu = document.getElementById('currencyMenu');
      this.currentFlag = document.getElementById('currentFlag');
      this.currentCode = document.getElementById('currentCode');
      this.options = document.querySelectorAll('.currency-option');
      
      this.init();
    }
  
    init() {
      // Evento para abrir/cerrar el menú
      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
  
      // Eventos para seleccionar moneda
      this.options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectCurrency(option);
        });
      });
  
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!this.dropdown.contains(e.target)) {
          this.closeMenu();
        }
      });
  
      // Cerrar menú con tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMenu();
        }
      });
    }
  
    toggleMenu() {
      if (this.dropdown.classList.contains('open')) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
  
    openMenu() {
      this.dropdown.classList.add('open');
    }
  
    closeMenu() {
      this.dropdown.classList.remove('open');
    }
  
    selectCurrency(option) {
      const flag = option.dataset.flag;
      const code = option.dataset.code;
      
      // Actualizar la visualización del botón
      this.currentFlag.textContent = flag;
      this.currentCode.textContent = code;
      
      // Actualizar las clases de selección
      this.options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      // Cerrar el menú
      this.closeMenu();
      
      // Opcional: Disparar evento personalizado para notificar el cambio
      const event = new CustomEvent('currencyChanged', {
        detail: { flag, code, name: option.dataset.name }
      });
      document.dispatchEvent(event);
    }
  }
  
  // Inicializar ambas funcionalidades cuando el documento esté listo
  document.addEventListener('DOMContentLoaded', () => {
    new CurrencyDropdown();
    
    // Opcional: Escuchar cambios de moneda
    document.addEventListener('currencyChanged', (e) => {
      console.log('Moneda cambiada a:', e.detail);
      // Aquí puedes agregar lógica adicional cuando cambie la moneda
    });
  });