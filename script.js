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
let GPT_MODEL = 'gpt-5'; // Fallback to gpt-5
let SYSTEM_MESSAGE = 'Tu es Guide France, un conseiller touristique virtuel pour toutes les régions de France. Tu aides les utilisateurs à découvrir les spécialités locales, les activités, et les meilleurs endroits où manger, dormir, ou visiter.';
let USE_ASSISTANT_API = false;
let ASSISTANT_ID = '';
let GPT_API_URL = 'https://api.openai.com/v1/chat/completions';

// Load config if available
if (typeof GPT_CONFIG !== 'undefined') {
    OPENAI_API_KEY = GPT_CONFIG.OPENAI_API_KEY || '';
    GPT_MODEL = GPT_CONFIG.GPT_MODEL || GPT_MODEL;
    SYSTEM_MESSAGE = GPT_CONFIG.SYSTEM_MESSAGE || SYSTEM_MESSAGE;
    USE_ASSISTANT_API = GPT_CONFIG.USE_ASSISTANT_API || false;
    ASSISTANT_ID = GPT_CONFIG.ASSISTANT_ID || '';
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

// Fonction pour extraire les noms de lieux depuis le texte
function extractPlaceNames(text) {
    const placePatterns = [
        /\*\*([^*]+)\*\*/g, // Markdown bold
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\(/gm, // Nom (Ville)
        /(?:restaurant|hôtel|plage|monument|château|musée|parc)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi
    ];
    
    const places = new Set();
    placePatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
            const name = match[1]?.trim();
            if (name && name.length > 2 && name.length < 50) {
                places.add(name);
            }
        }
    });
    
    return Array.from(places).slice(0, 5); // Max 5 images
}

// Fonction pour chercher une image via Unsplash
async function getImageForPlace(placeName) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(placeName + ' France')}&per_page=1&client_id=YOUR_UNSPLASH_KEY`);
        if (response.ok) {
            const data = await response.json();
            return data.results?.[0]?.urls?.small || null;
        }
    } catch (error) {
        console.log('Image search failed:', error);
    }
    return null;
}

// Fonction pour formater le contenu avec support markdown basique
function formatContent(content) {
    // Convertir markdown bold en HTML
    content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Détecter les listes
    content = content.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    
    // Wrapper les listes
    content = content.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Détecter les sections (titres)
    content = content.replace(/^([A-Z][^:]+):$/gm, '<h4 class="result-section-title">$1</h4>');
    
    // Diviser en paragraphes
    const paragraphs = content.split(/\n\n+/);
    
    return paragraphs.map(p => {
        p = p.trim();
        if (!p) return '';
        
        // Si c'est déjà du HTML (liste, titre), retourner tel quel
        if (p.startsWith('<')) {
            return p;
        }
        
        // Sinon, c'est un paragraphe normal
        return `<p>${p}</p>`;
    }).join('');
}

function displayResult(content) {
    // Extraire les noms de lieux pour les images
    const placeNames = extractPlaceNames(content);
    
    // Formater le contenu
    const formattedContent = formatContent(content);
    
    // Créer les placeholders d'images
    let imagesHTML = '';
    if (placeNames.length > 0) {
        imagesHTML = `
            <div class="gpt-result-images">
                ${placeNames.map(name => `
                    <div class="result-image-item" data-place="${name}">
                        <div class="image-placeholder">
                            <span class="image-loading">📷</span>
                        </div>
                        <p class="image-caption">${name}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    gptResults.innerHTML = `
        <div class="gpt-result-card">
            <div class="gpt-result-header">
                <span class="gpt-icon">🤖</span>
                <h3>Réponse du Guide IA</h3>
            </div>
            ${imagesHTML}
            <div class="gpt-result-content">
                ${formattedContent}
            </div>
        </div>
    `;
    
    // Charger les images de manière asynchrone
    if (placeNames.length > 0) {
        loadImagesForPlaces(placeNames);
    }
    
    gptResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Fonction pour charger les images des lieux
async function loadImagesForPlaces(placeNames) {
    placeNames.forEach(async (placeName) => {
        const imageItem = gptResults.querySelector(`[data-place="${placeName}"]`);
        if (!imageItem) return;
        
        const placeholder = imageItem.querySelector('.image-placeholder');
        if (!placeholder) return;
        
        // Utiliser un service d'images gratuit (Picsum avec recherche par mot-clé)
        // Alternative: utiliser Unsplash API si vous avez une clé
        try {
            // Pour l'instant, utiliser un placeholder avec une image générique
            // Vous pouvez remplacer par Unsplash API plus tard
            const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(placeName + ' France')}`;
            
            const img = new Image();
            img.onload = () => {
                placeholder.innerHTML = `<img src="${imageUrl}" alt="${placeName}" loading="lazy">`;
            };
            img.onerror = () => {
                // Si l'image ne charge pas, garder le placeholder
                placeholder.innerHTML = '<span class="image-loading">📷</span>';
            };
            img.src = imageUrl;
        } catch (error) {
            console.log('Image load error:', error);
        }
    });
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
        // Utiliser l'endpoint PHP backend
        const response = await fetch('api/gpt.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: query
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.content) {
            displayResult(data.content);
        } else {
            throw new Error(data.error || 'Aucune réponse reçue.');
        }
    } catch (error) {
        console.error('Erreur GPT:', error);
        displayError(`Erreur: ${error.message}. Veuillez réessayer.`);
    } finally {
        hideLoading();
    }
}

// Ancienne fonction avec API directe (désactivée, utilisée via backend PHP maintenant)
async function searchGPT_old(query) {
    if (!query.trim()) {
        displayError('Veuillez entrer une question.');
        return;
    }

    if (!OPENAI_API_KEY) {
        displayError('Clé API non configurée. Veuillez configurer config.js');
        return;
    }

    showLoading();
    gptResults.innerHTML = '';

    try {
        let response;
        
        if (USE_ASSISTANT_API && ASSISTANT_ID) {
            // Utiliser l'API Assistants (pour GPTs personnalisés)
            // Créer un thread et envoyer un message
            const threadResponse = await fetch('https://api.openai.com/v1/threads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });
            
            const threadData = await threadResponse.json();
            const threadId = threadData.id;
            
            // Ajouter un message au thread
            await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                },
                body: JSON.stringify({
                    role: 'user',
                    content: query
                })
            });
            
            // Lancer l'assistant
            const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                },
                body: JSON.stringify({
                    assistant_id: ASSISTANT_ID
                })
            });
            
            const runData = await runResponse.json();
            let runId = runData.id;
            let runStatus = runData.status;
            
            // Attendre que le run soit terminé
            while (runStatus === 'queued' || runStatus === 'in_progress') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2'
                    }
                });
                const statusData = await statusResponse.json();
                runStatus = statusData.status;
            }
            
            // Récupérer les messages
            response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'OpenAI-Beta': 'assistants=v2'
                }
            });
            
            const messagesData = await response.json();
            const assistantMessage = messagesData.data.find(msg => msg.role === 'assistant');
            const content = assistantMessage?.content[0]?.text?.value || 'Aucune réponse reçue.';
            displayResult(content);
            return;
        } else {
            // Utiliser l'API Chat Completions standard avec message système
            response = await fetch(GPT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: GPT_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: SYSTEM_MESSAGE
                        },
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
        }
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

