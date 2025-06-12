// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Scroll effects for navbar
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation and submission
function initializeFormValidation() {
    const form = document.getElementById('registrationForm');
    const formInputs = form.querySelectorAll('input, select, textarea');

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        
        // Validate all fields
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            submitForm(formData);
        } else {
            showMessage('Please correct the errors below.', 'error');
        }
    });
}

// Validate individual field
function validateField(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';

    // Remove previous validation classes
    formGroup.classList.remove('error', 'success');

    // Validation rules
    switch (field.type) {
        case 'text':
            if (field.name === 'fullName') {
                if (field.value.trim().length < 2) {
                    message = 'Full name must be at least 2 characters long.';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(field.value.trim())) {
                    message = 'Full name should only contain letters and spaces.';
                    isValid = false;
                }
            }
            break;

        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                message = 'Please enter a valid email address.';
                isValid = false;
            }
            break;

        case 'tel':
            const phonePattern = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phonePattern.test(field.value.replace(/\s/g, ''))) {
                message = 'Please enter a valid phone number.';
                isValid = false;
            }
            break;

        default:
            if (field.hasAttribute('required') && !field.value.trim()) {
                message = 'This field is required.';
                isValid = false;
            }
    }

    // Update UI based on validation result
    if (isValid) {
        formGroup.classList.add('success');
        errorMessage.textContent = '';
    } else {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }

    return isValid;
}

// Submit form (simulate API call)
function submitForm(formData) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Registering...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Log form data (in real application, send to server)
        console.log('Form Data Submitted:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Show success message
        showMessage('Registration successful! We will contact you soon.', 'success');
        
        // Reset form
        document.getElementById('registrationForm').reset();
        
        // Remove validation classes
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error', 'success');
        });

        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;

    }, 2000);
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        padding: 15px;
        margin: 20px 0;
        border-radius: 10px;
        font-weight: 500;
        text-align: center;
        animation: slideIn 0.3s ease;
        ${type === 'success' 
            ? 'background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0;'
            : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
        }
    `;
    messageDiv.textContent = message;

    // Insert message
    const form = document.getElementById('registrationForm');
    form.insertBefore(messageDiv, form.firstChild);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Initialize scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.course-card, .contact-item, .hero-stats .stat');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Course card interactions
document.addEventListener('DOMContentLoaded', function() {
    const courseButtons = document.querySelectorAll('.btn-course');
    
    courseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseCard = this.closest('.course-card');
            const courseTitle = courseCard.querySelector('.course-title').textContent;
            
            // Auto-fill the course selection in registration form
            const courseSelect = document.getElementById('course');
            const courseOptions = {
                'Java Programming': 'java',
                'Web Technologies': 'web',
                'Software Testing': 'testing'
            };
            
            if (courseOptions[courseTitle]) {
                courseSelect.value = courseOptions[courseTitle];
            }
            
            // Scroll to registration form
            const registrationSection = document.getElementById('register');
            const offsetTop = registrationSection.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Highlight the form briefly
            setTimeout(() => {
                const formContainer = document.querySelector('.registration-form-container');
                formContainer.style.transform = 'scale(1.02)';
                formContainer.style.boxShadow = '0 25px 60px rgba(37, 99, 235, 0.2)';
                
                setTimeout(() => {
                    formContainer.style.transform = 'scale(1)';
                    formContainer.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.1)';
                }, 1000);
            }, 500);
        });
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Utility function to handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-intensive operations can go here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);