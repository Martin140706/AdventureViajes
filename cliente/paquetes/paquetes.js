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

// Definición de la clase TravelCarousel que manejará el carrusel de imágenes
class TravelCarousel {
  constructor() {
    // Elementos del DOM que necesitamos:
    this.track = document.getElementById('carouselTrack'); // El contenedor de las diapositivas
    this.indicators = document.querySelectorAll('.indicator'); // Los puntos indicadores
    this.currentSlide = 0; // La diapositiva actual (comienza en 0)
    this.totalSlides = document.querySelectorAll('.carousel-slide').length; // Número total de diapositivas
    
    // Inicializar el carrusel
    this.init();
  }

  // Método para inicializar el carrusel
  init() {
    // 1. Configurar los eventos para los indicadores (puntos)
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index); // Al hacer clic en un punto, ir a esa diapositiva
      });
    });

    // 2. Iniciar el cambio automático de diapositivas
    this.startAutoPlay();
    
    // 3. Pausar el cambio automático cuando el mouse está sobre el carrusel
    const container = document.querySelector('.carousel-container');
    container.addEventListener('mouseenter', () => this.stopAutoPlay());
    container.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  // Método para ir a una diapositiva específica
  goToSlide(slideIndex) {
    // Actualizar la diapositiva actual
    this.currentSlide = slideIndex;
    
    // Mover el carrusel usando transformación CSS
    const translateX = -slideIndex * 100; // Calcula el porcentaje de desplazamiento
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Actualizar los indicadores para mostrar cuál está activo
    this.updateIndicators();
  }

  // Método para actualizar los indicadores (puntos)
  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      // Añade la clase 'active' al indicador correspondiente a la diapositiva actual
      indicator.classList.toggle('active', index === this.currentSlide);
    });
  }

  // Método para avanzar a la siguiente diapositiva
  nextSlide() {
    // Calcula el índice de la siguiente diapositiva (vuelve a 0 después de la última)
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  // Método para iniciar el cambio automático de diapositivas
  startAutoPlay() {
    // Configura un intervalo que cambia de diapositiva cada 4 segundos
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  // Método para detener el cambio automático
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval); // Limpia el intervalo
    }
  }
}

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
  new TravelCarousel();
  new CurrencyDropdown();
  
  // Opcional: Escuchar cambios de moneda
  document.addEventListener('currencyChanged', (e) => {
    console.log('Moneda cambiada a:', e.detail);
    // Aquí puedes agregar lógica adicional cuando cambie la moneda
  });
});