// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'var(--nav-bg)';
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.background = 'var(--nav-bg)';
        navbar.style.boxShadow = 'none';
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skill progress bar animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger skill bar animation when skills section is visible
            if (entry.target.id === 'skills') {
                setTimeout(animateSkillBars, 500);
            }
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
sections.forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Typing effect for hero section
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100);
    }
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.onclick = scrollToTop;
document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollToTopBtn.style.display = 'block';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Add CSS for scroll to top button
const scrollToTopStyle = document.createElement('style');
scrollToTopStyle.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: var(--shadow);
    }
    
    .scroll-to-top:hover {
        background: var(--primary-dark);
        transform: translateY(-3px);
        box-shadow: var(--shadow-hover);
    }
`;
document.head.appendChild(scrollToTopStyle);

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Certification card hover effects
document.querySelectorAll('.certification-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.cert-icon i');
        icon.style.transform = 'scale(1.2) rotate(10deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.cert-icon i');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Preloader styles
const preloaderStyle = document.createElement('style');
preloaderStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-color);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
        transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(preloaderStyle);

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-send');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                contactForm.reset();
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    initContactForm();
    initHorizontalScrolling();
    initDragScrolling();
    
    initProjectsToggle();
    
    // Add some interactive elements
    const stats = document.querySelectorAll('.stat h3');
    stats.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(counter);
            }
            stat.textContent = Math.floor(currentValue) + (stat.textContent.includes('+') ? '+' : '');
        }, 50);
    });
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element with selector "${selector}" not found`);
    }
    return element;
}

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

// Use debounced scroll for better performance
const debouncedScroll = debounce(() => {
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Projects Show More/Less functionality
function initProjectsToggle() {
    const showMoreBtn = document.getElementById('show-more-projects');
    const projectCards = document.querySelectorAll('.project-card');
    let isExpanded = false;
    let isAnimating = false;

    // Hide all projects after the 4th by default
    projectCards.forEach((card, idx) => {
        if (idx > 3) {
            card.classList.add('hidden-project');
            card.classList.remove('show');
        } else {
            card.classList.remove('hidden-project');
            card.classList.remove('show');
        }
    });

    if (showMoreBtn && projectCards.length > 4) {
        showMoreBtn.style.display = '';
        showMoreBtn.onclick = function(e) {
            e.preventDefault();
            if (isAnimating) return;
            isAnimating = true;
            showMoreBtn.style.transform = 'scale(0.95)';
            setTimeout(() => { showMoreBtn.style.transform = 'scale(1)'; }, 150);

            const hiddenProjects = document.querySelectorAll('.project-card.hidden-project');
            if (!isExpanded) {
                hiddenProjects.forEach((project, index) => {
                    setTimeout(() => {
                        project.classList.add('show');
                        project.style.animationDelay = `${index * 0.1}s`;
                        if (index === hiddenProjects.length - 1) {
                            setTimeout(() => { isAnimating = false; }, 600);
                        }
                    }, index * 120);
                });
                setTimeout(() => {
                    showMoreBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less Projects';
                    showMoreBtn.classList.add('rotate-icon');
                }, 100);
                isExpanded = true;
            } else {
                const reversedProjects = Array.from(hiddenProjects).reverse();
                reversedProjects.forEach((project, index) => {
                    setTimeout(() => {
                        project.classList.remove('show');
                        if (index === reversedProjects.length - 1) {
                            setTimeout(() => { isAnimating = false; }, 600);
                        }
                    }, index * 80);
                });
                setTimeout(() => {
                    showMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Show More Projects';
                    showMoreBtn.classList.remove('rotate-icon');
                }, 100);
                isExpanded = false;
                setTimeout(() => {
                    showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        };
    } else if (showMoreBtn) {
        // Hide button if 4 or fewer projects
        showMoreBtn.style.display = 'none';
    }
}

// Netflix-style horizontal scrolling for projects and certifications
function initHorizontalScrolling() {
    // Projects scrolling
    const projectsGrid = document.getElementById('projects-grid');
    const projectsPrevBtn = document.getElementById('projects-prev');
    const projectsNextBtn = document.getElementById('projects-next');
    
    if (projectsGrid && projectsPrevBtn && projectsNextBtn) {
        projectsPrevBtn.addEventListener('click', () => {
            const scrollAmount = 370; // width of card + gap
            projectsGrid.scrollLeft -= scrollAmount;
            updateScrollButtons('projects');
        });
        
        projectsNextBtn.addEventListener('click', () => {
            const scrollAmount = 370;
            projectsGrid.scrollLeft += scrollAmount;
            updateScrollButtons('projects');
        });
        
        projectsGrid.addEventListener('scroll', () => {
            updateScrollButtons('projects');
        });
        
        // Initial button state
        updateScrollButtons('projects');
    }
    
    // Certifications scrolling
    const certificationsGrid = document.getElementById('certifications-grid');
    const certificationsPrevBtn = document.getElementById('certifications-prev');
    const certificationsNextBtn = document.getElementById('certifications-next');
    
    if (certificationsGrid && certificationsPrevBtn && certificationsNextBtn) {
        certificationsPrevBtn.addEventListener('click', () => {
            const scrollAmount = 300; // width of card + gap
            certificationsGrid.scrollLeft -= scrollAmount;
            updateScrollButtons('certifications');
        });
        
        certificationsNextBtn.addEventListener('click', () => {
            const scrollAmount = 300;
            certificationsGrid.scrollLeft += scrollAmount;
            updateScrollButtons('certifications');
        });
        
        certificationsGrid.addEventListener('scroll', () => {
            updateScrollButtons('certifications');
        });
        
        // Initial button state
        updateScrollButtons('certifications');
    }
}

// Update scroll button states
function updateScrollButtons(section) {
    const grid = document.getElementById(`${section}-grid`);
    const prevBtn = document.getElementById(`${section}-prev`);
    const nextBtn = document.getElementById(`${section}-next`);
    
    if (grid && prevBtn && nextBtn) {
        const isAtStart = grid.scrollLeft <= 0;
        const isAtEnd = grid.scrollLeft >= (grid.scrollWidth - grid.clientWidth);
        
        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;
    }
}

// Touch/mouse drag scrolling for mobile
function initDragScrolling() {
    const scrollContainers = document.querySelectorAll('.projects-grid, .certifications-grid');
    
    scrollContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
}
