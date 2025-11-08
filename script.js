// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would normally send the data to a server
        // For now, we'll just show an alert
        alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        
        // Reset form
        contactForm.reset();
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe attraction cards
document.querySelectorAll('.attraction-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe info items
document.querySelectorAll('.info-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Add active class to nav link based on scroll position
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Add active class styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--secondary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// GPT Search functionality
// API configuration is loaded from config.js (not in git)
let OPENAI_API_KEY = '';
let GPT_MODEL = 'gpt-5-custom-id-de-guide-france';
let GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

// Load config if available
if (typeof GPT_CONFIG !== 'undefined') {
    OPENAI_API_KEY = GPT_CONFIG.OPENAI_API_KEY || '';
    GPT_MODEL = GPT_CONFIG.GPT_MODEL || GPT_MODEL;
}

const gptSearchInput = document.getElementById('gptSearchInput');
const gptSearchBtn = document.getElementById('gptSearchBtn');
const gptResults = document.getElementById('gptResults');

function showLoading() {
    const searchIcon = gptSearchBtn.querySelector('.search-icon');
    const loadingSpinner = gptSearchBtn.querySelector('.loading-spinner');
    if (searchIcon) searchIcon.style.display = 'none';
    if (loadingSpinner) loadingSpinner.style.display = 'inline';
    gptSearchBtn.disabled = true;
}

function hideLoading() {
    const searchIcon = gptSearchBtn.querySelector('.search-icon');
    const loadingSpinner = gptSearchBtn.querySelector('.loading-spinner');
    if (searchIcon) searchIcon.style.display = 'inline';
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    gptSearchBtn.disabled = false;
}

function displayResult(content) {
    gptResults.innerHTML = `
        <div class="gpt-result-card">
            <div class="gpt-result-header">
                <span class="gpt-icon">🤖</span>
                <h3>Réponse du Guide IA</h3>
            </div>
            <div class="gpt-result-content">
                ${content.split('\n').map(paragraph => 
                    paragraph.trim() ? `<p>${paragraph}</p>` : ''
                ).join('')}
            </div>
        </div>
    `;
    gptResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayError(message) {
    gptResults.innerHTML = `
        <div class="gpt-error-card">
            <span class="error-icon">⚠️</span>
            <p>${message}</p>
        </div>
    `;
}

async function searchGPT(query) {
    if (!query.trim()) {
        displayError('Veuillez entrer une question.');
        return;
    }

    showLoading();
    gptResults.innerHTML = '';

    try {
        const response = await fetch(GPT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: GPT_MODEL,
                messages: [
                    {
                        role: 'user',
                        content: query
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || 'Aucune réponse reçue.';
        displayResult(content);
    } catch (error) {
        console.error('Erreur GPT:', error);
        displayError(`Erreur: ${error.message}. Veuillez réessayer.`);
    } finally {
        hideLoading();
    }
}

// Event listeners for GPT search
if (gptSearchBtn && gptSearchInput) {
    gptSearchBtn.addEventListener('click', () => {
        const query = gptSearchInput.value.trim();
        searchGPT(query);
    });

    gptSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = gptSearchInput.value.trim();
            searchGPT(query);
        }
    });
}

