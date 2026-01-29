class AuthSystem {
    constructor() {
        this.loginTab = document.getElementById('loginTab');
        this.registerTab = document.getElementById('registerTab');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        this.init();
    }

    init() {
        // Add event listeners for tab navigation
        this.loginTab.addEventListener('click', () => this.showLogin());
        this.registerTab.addEventListener('click', () => this.showRegister());

        // Add form submission handlers
        this.setupFormHandlers();

        // Set initial state (register form active)
        this.showRegister();
    }

    showLogin() {
        // Update tab states
        this.loginTab.classList.add('active');
        this.registerTab.classList.remove('active');

        // Update form visibility with smooth transition
        this.registerForm.classList.remove('active');
        
        setTimeout(() => {
            this.loginForm.classList.add('active');
        }, 200);

        // Add subtle animation effect
        this.addTransitionEffect();
    }

    showRegister() {
        // Update tab states
        this.registerTab.classList.add('active');
        this.loginTab.classList.remove('active');

        // Update form visibility with smooth transition
        this.loginForm.classList.remove('active');
        
        setTimeout(() => {
            this.registerForm.classList.add('active');
        }, 200);

        // Add subtle animation effect
        this.addTransitionEffect();
    }

    addTransitionEffect() {
        const authCard = document.querySelector('.auth-card');
        authCard.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            authCard.style.transform = 'scale(1)';
        }, 150);
    }

    setupFormHandlers() {
        // Login form handler
        const loginFormElement = this.loginForm.querySelector('.auth-form');
        loginFormElement.addEventListener('submit', (e) => this.handleLogin(e));

        // Register form handler
        const registerFormElement = this.registerForm.querySelector('.auth-form');
        registerFormElement.addEventListener('submit', (e) => this.handleRegister(e));

        // Add input focus effects
        this.setupInputEffects();
    }

    setupInputEffects() {
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });

            // Add floating label effect
            input.addEventListener('input', () => {
                if (input.value) {
                    input.parentElement.classList.add('has-value');
                } else {
                    input.parentElement.classList.remove('has-value');
                }
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Add loading state
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Ingresando...';

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Success handling
            this.showSuccessMessage('¡Inicio de sesión exitoso!');
            
            // Reset form
            e.target.reset();
            
        } catch (error) {
            this.showErrorMessage('Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Ingresar';
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');

        // Basic validation
        if (!this.validateRegistrationData(fullName, email, password)) {
            return;
        }

        // Add loading state
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Registrando...';

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Success handling
            this.showSuccessMessage('¡Registro exitoso! Bienvenido a Adventure Viajes.');
            
            // Reset form
            e.target.reset();
            
            // Optionally switch to login after successful registration
            setTimeout(() => {
                this.showLogin();
            }, 2000);
            
        } catch (error) {
            this.showErrorMessage('Error al registrarse. Inténtalo de nuevo.');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Registrarse';
        }
    }

    validateRegistrationData(fullName, email, password) {
        if (fullName.length < 2) {
            this.showErrorMessage('El nombre debe tener al menos 2 caracteres.');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showErrorMessage('Por favor, ingresa un email válido.');
            return false;
        }

        if (password.length < 6) {
            this.showErrorMessage('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;

        // Add styles
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            ${type === 'success' 
                ? 'background: #48bb78; color: white;' 
                : 'background: #f56565; color: white;'
            }
        `;

        // Add CSS animation
        if (!document.querySelector('#message-styles')) {
            const style = document.createElement('style');
            style.id = 'message-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add to DOM
        document.body.appendChild(messageElement);

        // Remove after 4 seconds
        setTimeout(() => {
            messageElement.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => messageElement.remove(), 300);
        }, 4000);
    }
}

// Enhanced interaction effects
class InteractionEffects {
    constructor() {
        this.setupHoverEffects();
        this.setupClickEffects();
    }

    setupHoverEffects() {
        // Logo hover effect
        const logoCircle = document.querySelector('.logo-circle');
        logoCircle.addEventListener('mouseenter', () => {
            logoCircle.style.transform = 'scale(1.05) rotate(5deg)';
        });
        
        logoCircle.addEventListener('mouseleave', () => {
            logoCircle.style.transform = 'scale(1) rotate(0deg)';
        });

        // Input hover effects
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('mouseenter', () => {
                if (!input.matches(':focus')) {
                    input.style.background = '#cbd5e0';
                }
            });
            
            input.addEventListener('mouseleave', () => {
                if (!input.matches(':focus')) {
                    input.style.background = '#e2e8f0';
                }
            });
        });
    }

    setupClickEffects() {
        // Button click ripple effect
        const buttons = document.querySelectorAll('.submit-btn, .tab-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
    new InteractionEffects();
    
    // Add smooth entrance animation
    const authCard = document.querySelector('.auth-card');
    authCard.style.opacity = '0';
    authCard.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        authCard.style.transition = 'all 0.6s ease';
        authCard.style.opacity = '1';
        authCard.style.transform = 'translateY(0)';
    }, 100);
});