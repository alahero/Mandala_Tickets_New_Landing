/**
 * MandalaTickets Redesign Scripts
 * 
 * Este archivo contiene todas las funciones JavaScript necesarias para:
 * - Carga dinámica de contenido (ciudades, venues, beach clubs)
 * - Manejo de interacciones del usuario (menú móvil, carruseles)
 * - Animaciones y efectos visuales
 * 
 * Dependencias:
 * - data.js: Contiene SITE_DATA con información de ciudades y venues
 * - Headroom.js: Para efectos de header al hacer scroll
 * 
 * @author MandalaTickets Development Team
 * @version 1.0
 */

/**
 * Quita el sufijo index.html de rutas de venue (SITE_DATA) para enlazar a URLs limpias de CodeIgniter.
 * @param {string} path Ruta relativa, p. ej. "en/cancun/disco/mandala/index.html"
 * @returns {string}
 */
function stripIndexHtmlFromVenuePath(path) {
    if (!path || typeof path !== 'string') return path;
    return path.replace(/\/?index\.html$/i, '');
}

document.addEventListener('DOMContentLoaded', () => {

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Dynamic Content Loading - Immediate Check
    const urlParams = new URLSearchParams(window.location.search);
    let cityId = urlParams.get('city');
    let venueId = urlParams.get('venue');

    // Auto-calculate assetsPath if not defined
    if (typeof window.assetsPath === 'undefined') {
        const path = window.location.pathname.toLowerCase();
        const segments = path.split('/').filter(s => s.length > 0 && !s.includes('.html'));

        // Find "en" segment to anchor the depth
        const enIndex = segments.indexOf('en');
        let depth = 0;

        if (enIndex !== -1) {
            // We are inside 'en/', so depth is the number of segments after (and including) 'en'
            // Example: /.../en/playa/ -> enIndex found. segments after: 'en', 'playa'. length is 2.
            // But we want path to root (parent of en). So ../../ is correct.
            depth = segments.length - enIndex;
        } else {
            // Assume we are at root /index.html or similar if 'en' is not found
            depth = 0;
        }

        let pathStr = '';
        for (let i = 0; i < depth; i++) {
            pathStr += '../';
        }
        window.assetsPath = pathStr;
    }

    // Auto-detect from path if params missing (from previous step)
    
    /* if (!cityId && !venueId) {
        const pathSegments = window.location.pathname.toLowerCase().split('/');

        // Check for specific city names in path
        for (const segment of pathSegments) {
            if (SITE_DATA && SITE_DATA.cities && SITE_DATA.cities[segment]) {
                cityId = segment;
            }
        }

        // Special check via 'disco' pattern for venues? 
        // Example: en/cancun/disco/rakata/index.html
        if (pathSegments.includes('disco')) {
            const discoIndex = pathSegments.indexOf('disco');
            if (discoIndex + 1 < pathSegments.length) {
                // Potentially venue name is next
                // But venue IDs in data are like 'rakata-cancun'. The path is just 'rakata'.
                // We need to map 'rakata' + 'cancun' to 'rakata-cancun'.
                const possibleVenueSlug = pathSegments[discoIndex + 1];
                // Search for this slug in city venues
                if (cityId && SITE_DATA.cities[cityId]) {
                    const foundVenue = SITE_DATA.cities[cityId].venues.find(v => v.id.includes(possibleVenueSlug) || v.customUrl.includes(possibleVenueSlug));
                    if (foundVenue) {
                        venueId = foundVenue.id;
                    }
                }
            }
        }
    } */



    if (typeof SITE_DATA === 'undefined') {
        // SITE_DATA no cargó (revisar data.js)
    } else {
        if (venueId) {
            loadVenue(venueId);
        } else if (cityId && SITE_DATA.cities[cityId]) {

            // Check if we are on a beach clubs page
            if (window.location.pathname.includes('beach-clubs')) {
                loadBeachClubs(cityId);
            } else {
                loadDestination(cityId);
            }
        }
    }

    // Header Scroll Effect - Updated for Unified Bootstrap Header
    const header = document.getElementById('unified-navbar');

    window.addEventListener('scroll', () => {
        if (!header) return;

        // With Bootstrap sticky-top, we don't strictly need class manipulation unless we want opacity changes.
        // For now, we just ensure it doesn't crash.
        if (window.scrollY > 50) {
            // Optional: Add custom class for scrolling state if defined in CSS
            // header.classList.add('scrolled'); 
        } else {
            // header.classList.remove('scrolled');
        }
    });

    // Events Carousel Navigation
    const carousel = document.querySelector('.events-carousel');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (carousel && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 350, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -350, behavior: 'smooth' });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if (menuToggle && mobileDrawer && mobileOverlay) {
        menuToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        const closeMobileMenu = () => {
            mobileDrawer.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeMenu) {
            closeMenu.addEventListener('click', closeMobileMenu);
        }

        mobileOverlay.addEventListener('click', closeMobileMenu);

        // Close on link click
        const mobileLinks = document.querySelectorAll('.mobile-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    /* --- Dynamic Content Loading --- */
    // Dynamic logic moved to top of DOMContentLoaded to ensure priority execution

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate sections on scroll
    // Las .event-card del carrusel no se ocultan: el peek lateral debe verse desde el inicio
    document.querySelectorAll('.section-title, .destination-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // New Header - Mobile Drawer Logic
    const venueDrawer = document.querySelector('.venue-drawer');
    const openMenuBtn = document.getElementById('JS-open-menu');
    const closeMenuBtn = document.getElementById('JS-close-menu');

    if (openMenuBtn && venueDrawer) {
        openMenuBtn.addEventListener('click', () => {
            venueDrawer.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenuBtn && venueDrawer) {
        closeMenuBtn.addEventListener('click', () => {
            venueDrawer.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Initialize Search
    initSearch();
});

/**
 * Carga y renderiza todos los venues de una ciudad específica
 * 
 * @param {string} cityId - ID de la ciudad (ej: "cancun", "tulum", "vallarta")
 * 
 * Funcionalidad:
 * 1. Busca datos de la ciudad en SITE_DATA.cities[cityId]
 * 2. Actualiza el hero section (título, breadcrumbs, imagen de fondo)
 * 3. Genera cards de venues dinámicamente en .venues-grid
 * 4. Actualiza sección "About" si existe
 * 
 * Elementos DOM que modifica:
 * - .page-title - Título del hero
 * - .breadcrumbs - Breadcrumbs
 * - .page-hero - Imagen de fondo
 * - .venues-grid - Grid de venues
 * - #destination-about - Texto descriptivo
 */
function loadDestination(cityId) {
    const cityData = SITE_DATA.cities[cityId];
    if (!cityData) {
        return;
    }

    // Define assetsPath early
    const assetsPath = window.assetsPath || '';

    // Update Hero
    const heroTitle = document.querySelector('.page-title');
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const heroSection = document.querySelector('.page-hero');
    if (heroTitle) heroTitle.textContent = cityData.name;
    if (breadcrumbs) breadcrumbs.textContent = `Home / Destinations / ${cityData.name}`;
    if (heroSection) heroSection.style.backgroundImage = `url('${assetsPath}${cityData.image}')`;

    // Update Grid
    const venuesGrid = document.querySelector('.venues-grid');
    if (venuesGrid) {
        venuesGrid.innerHTML = ''; // Clear static content

        cityData.venues.forEach(venue => {
            const card = document.createElement('a');
            const assetsPath = window.assetsPath || '';
            const linkHref = venue.customUrl ? (assetsPath + stripIndexHtmlFromVenuePath(venue.customUrl)) : `venue.html?venue=${venue.id}&city=${cityId}`;
            card.href = linkHref;
            card.className = 'venue-card glass-panel';

            let tagHtml = '';
            if (venue.tag) {
                tagHtml = `<div class="tag ${venue.tag === 'Day Party' ? 'day' : 'open'}">${venue.tag}</div>`;
            } else {
                tagHtml = `<div class="tag open">Open Tonight</div>`;
            }



            card.innerHTML = `
                <div class="venue-image">
                    ${venue.video ? `
                        <video autoplay muted loop playsinline class="venue-video" poster="${assetsPath}${venue.image}">
                            <source src="${venue.video.startsWith('http') ? venue.video : assetsPath + venue.video}" type="video/mp4">
                        </video>
                    ` : `<img src="${assetsPath}${venue.image}" alt="${venue.name}">`}
                    ${tagHtml}
                </div>
                <div class="venue-info">
                    <h3>${venue.name}</h3>
                    <div class="rating"><i class="fas fa-star text-warning"></i> ${venue.rating}</div>
                    <p class="desc">${venue.desc}</p>
                    <div class="venue-bottom">
                        <span class="price">From $${venue.price} USD</span>
                        <span class="btn-text">View <i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            `;
            venuesGrid.appendChild(card);
        });
    }

    // Update SEO Text - Only if container is empty (preserve hardcoded HTML content)
    const aboutContainer = document.getElementById('destination-about');
    if (aboutContainer) {
        // Check if container already has substantial content (more than just whitespace)
        const existingContent = aboutContainer.innerHTML.trim();
        const hasExistingContent = existingContent.length > 100; // Has meaningful content

        if (hasExistingContent) {
            // Preserve existing HTML content, just ensure it's visible
            aboutContainer.style.display = 'block';
        } else if (cityData.aboutText) {
            // Only fill from data.js if HTML is empty
            aboutContainer.innerHTML = `<h2 class="section-title text-left" style="margin-bottom: 20px;">About ${cityData.name} Nightlife</h2>` + cityData.aboutText;
            aboutContainer.style.display = 'block';
        } else {
            aboutContainer.style.display = 'none';
        }
    }
}

/**
 * Carga información de un venue específico y actualiza la página
 * 
 * @param {string} venueId - ID del venue (ej: "mandala-cancun", "dcave-cancun")
 * 
 * Funcionalidad:
 * 1. Busca el venue en todas las ciudades
 * 2. Actualiza título de página, hero, breadcrumbs
 * 3. Actualiza detalles del venue (dirección, horarios, dress code)
 * 4. Actualiza headers de tickets
 * 
 * Elementos DOM que modifica:
 * - document.title - Título de la página
 * - .page-title - Título del hero
 * - .hero-subtitle - Subtítulo
 * - .breadcrumbs - Breadcrumbs
 * - #v-address - Dirección
 * - #v-hours - Horarios
 * - #v-dresscode - Código de vestimenta
 * - .ticket-header h3 - Headers de tickets
 */
function loadVenue(venueId) {
    // Find venue data across all cities
    let venueData = null;
    let cityData = null; // Need cityData for the subtitle

    for (const cKey in SITE_DATA.cities) {
        const v = SITE_DATA.cities[cKey].venues.find(v => v.id === venueId);
        if (v) {
            venueData = v;
            cityData = SITE_DATA.cities[cKey];
            break;
        }
    }

    if (!venueData) return;

    // Update Page Details
    document.title = `${venueData.name} | ${cityData.name} | MandalaTickets`;

    // Updated Selectors for New HTML Structure (D-Cave Template Standard)
    const h1 = document.querySelector('h1.h1'); // Header Title
    const h2 = document.querySelector('h2.h2'); // Header Subtitle

    // Fallback legacy selectors just in case
    const heroTitle = document.querySelector('.page-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    const breadcrumbs = document.querySelector('.breadcrumbs');
    const heroBg = document.querySelector('.page-section__background'); // Correct hero container
    const assetsPath = window.assetsPath || '';

    // 1. Update Title
    if (h1) {
        h1.textContent = `${venueData.name}: WHERE THE NIGHT COMES ALIVE`;
    } else if (heroTitle) {
        heroTitle.textContent = venueData.name;
    }

    // 2. Update Subtitle
    if (h2) {
        h2.textContent = `${venueData.name.toUpperCase()} · ${cityData.name.toUpperCase()}, MÉXICO`;
    } else if (heroSubtitle) {
        heroSubtitle.textContent = venueData.desc;
    }

    if (breadcrumbs) breadcrumbs.textContent = `Home / ${cityData.name} / ${venueData.name}`;

    // 3. Update Hero Background (Video or Image)
    if (heroBg) {
        let videoEl = heroBg.querySelector('video');

        if (venueData.video) {
            // Ensure video element exists
            if (!videoEl) {
                videoEl = document.createElement('video');
                videoEl.autoplay = true;
                videoEl.loop = true;
                videoEl.muted = true;
                videoEl.playsInline = true;
                heroBg.appendChild(videoEl);
            }

            // Set src - Handle absolute vs relative paths
            const videoSrc = venueData.video.startsWith('http') ? venueData.video : (assetsPath + venueData.video);
            videoEl.src = videoSrc;

            // Set poster if image available
            if (venueData.image) {
                videoEl.poster = assetsPath + venueData.image;
            }

            videoEl.style.display = 'block';
            heroBg.style.backgroundImage = 'none'; // Clear bg image if video plays

            // Ensure the container is visible (fix for opacity: 0 css)
            heroBg.classList.add('page-section__background--loaded');
        } else {
            // No Video - Fallback to Image
            if (videoEl) videoEl.style.display = 'none';


            if (venueData.image) {
                heroBg.style.backgroundImage = `url('${assetsPath + venueData.image}')`;
                heroBg.style.backgroundSize = 'cover';
                heroBg.style.backgroundPosition = 'center';
            }
            // Ensure visibility for image fallback too
            heroBg.classList.add('page-section__background--loaded');
        }
    }

    // 4. Update Description
    const descText = document.querySelector('.content-block__text p');
    if (descText) {
        descText.textContent = venueData.desc;
    }

    // Update content box if exists (Legacy or other templates)
    const aboutHeader = document.querySelector('.content-box h2');
    const aboutText = document.querySelector('.about-text');
    const vName = document.querySelector('.venue-name-dynamic');

    if (aboutHeader) aboutHeader.innerHTML = `About <span class="text-primary">${venueData.name}</span>`;
    if (vName) vName.textContent = venueData.name;
    if (aboutText) aboutText.textContent = `${venueData.name} is the premier destination for nightlife in ${cityData.name}. Experience the best service, music, and atmosphere. ${venueData.desc}`;

    // Update Details
    const elAddress = document.getElementById('v-address');
    const elHours = document.getElementById('v-hours');
    const elDress = document.getElementById('v-dresscode');

    if (elAddress) elAddress.textContent = venueData.address || "Centrally Located";
    if (elHours) elHours.textContent = venueData.hours || "10:00 PM - 5:00 AM";
    if (elDress) elDress.textContent = venueData.dressCode || "Smart Casual";

    // Update Ticket Card Headers
    const ticketHeaders = document.querySelectorAll('.ticket-header h3');
    ticketHeaders.forEach(th => {
        if (th.textContent.includes('Pass') || th.textContent.includes('Ticket')) {
            th.textContent = `${venueData.name} Access Ticket`;
        }
    });
}

/**
 * Filtra y muestra solo los beach clubs de una ciudad
 * 
 * @param {string} cityId - ID de la ciudad (ej: "cancun", "tulum", "vallarta")
 * 
 * Funcionalidad:
 * 1. Filtra venues que son beach clubs (tag "Day Party", "Day & Night", o nombre contiene "beach")
 * 2. Genera cards dinámicamente en #beach-clubs-grid
 * 3. Muestra mensaje si no hay beach clubs disponibles
 * 
 * Elementos DOM que modifica:
 * - #beach-clubs-grid - Grid de beach clubs
 * 
 * Nota: Esta función debe ser llamada en páginas de beach-clubs
 */
function loadBeachClubs(cityId) {
    const cityData = SITE_DATA.cities[cityId];
    if (!cityData) {
        return;
    }

    // Filtrar venues que son beach clubs
    const beachClubs = cityData.venues.filter(venue =>
        venue.tag === "Day Party" ||
        venue.tag === "Day & Night" ||
        venue.name.toLowerCase().includes("beach") ||
        venue.customUrl.includes("beach")
    );

    const grid = document.getElementById('beach-clubs-grid');
    if (!grid) {
        return;
    }

    grid.innerHTML = '';

    if (beachClubs.length === 0) {
        grid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">No beach clubs available in this city.</p>';
        return;
    }

    // Crear cards para cada beach club
    beachClubs.forEach(venue => {
        const card = createVenueCard(venue, cityId);
        grid.appendChild(card);
    });
}

/**
 * Crea un elemento card HTML para un venue
 * 
 * @param {Object} venue - Objeto venue con toda su información
 * @param {string} cityId - ID de la ciudad para construir URLs
 * @returns {HTMLElement} - Elemento <a> con la card del venue
 * 
 * Estructura del venue object:
 * - id, name, image, video (opcional), price, rating, desc, tag (opcional)
 * - address, hours, dressCode, customUrl
 */
function createVenueCard(venue, cityId) {
    const card = document.createElement('a');
    const assetsPath = window.assetsPath || '';
    const linkHref = venue.customUrl ? (assetsPath + stripIndexHtmlFromVenuePath(venue.customUrl)) : `venue.html?venue=${venue.id}&city=${cityId}`;

    card.href = linkHref;
    card.className = 'venue-card glass-panel';

    // Generar tag HTML (Day Party, Night Party, etc.)
    let tagHtml = '';
    if (venue.tag) {
        const tagClass = venue.tag === 'Day Party' ? 'day' :
            venue.tag === 'Night Party' ? 'night' : 'open';
        tagHtml = `<div class="tag ${tagClass}">${venue.tag}</div>`;
    } else {
        tagHtml = `<div class="tag open">Open Tonight</div>`;
    }

    // Construir HTML de la card
    card.innerHTML = `
        <div class="venue-image">
            ${venue.video ? `
                <video autoplay muted loop playsinline class="venue-video" poster="${assetsPath}${venue.image}">
                    <source src="${venue.video}" type="video/mp4">
                </video>
            ` : `<img src="${assetsPath}${venue.image}" alt="${venue.name}" loading="lazy">`}
            ${tagHtml}
        </div>
        <div class="venue-info">
            <h3>${venue.name}</h3>
            <div class="rating"><i class="fas fa-star text-warning"></i> ${venue.rating}</div>
            <p class="desc">${venue.desc}</p>
            <div class="venue-bottom">
                <span class="price">From $${venue.price} USD</span>
                <span class="btn-text">View <i class="fas fa-arrow-right"></i></span>
            </div>
        </div>
    `;

    return card;
}

// Efecto hero parallax (divisiones verticales con “gatekeeper” de scroll)
document.addEventListener('DOMContentLoaded', () => {
    const parallaxContainer = document.getElementById('parallax-container');

    // Solo páginas que incluyen el contenedor de parallax
    if (!parallaxContainer) return;

    // Bloquear scroll del body hasta que el usuario indique avance hacia abajo
    document.body.style.overflow = 'hidden';

    // Franjas verticales del fondo
    const stripCount = 9;
    const strips = [];

    for (let i = 0; i < stripCount; i++) {
        const strip = document.createElement('div');
        strip.classList.add('parallax-strip');

        // Ancho y posición (solape ligero entre franjas)
        strip.style.width = `calc(100% / ${stripCount} + 2px)`;
        strip.style.left = `${(100 / stripCount) * i}%`;
        strip.style.backgroundPosition = `${i * 100 / (stripCount - 1)}% center`;

        // Duración de transición entre ~1.5s y 2s
        const duration = 1.5 + (Math.random() * 0.5);
        strip.style.setProperty('--duration', `${duration}s`);

        // Desplazamiento vertical objetivo (px)
        const direction = i % 2 === 0 ? 1 : -1;
        const distance = window.innerHeight * (1.5 + Math.random() * 0.5);
        const targetY = direction * distance;
        strip.style.setProperty('--target-y', `${targetY}px`);

        parallaxContainer.appendChild(strip);
        strips.push(strip);
    }

    let isLocked = true;
    let hasTriggered = false;
    let animationComplete = false;

    function triggerParallax() {
        if (hasTriggered) return;
        hasTriggered = true;

        parallaxContainer.classList.add('parallax-container-active');

        setTimeout(() => {
            document.body.style.overflow = '';
            isLocked = false;
            animationComplete = true;

            // Tras la animación, el hero en posición relativa permite scroll natural
            const heroSection = document.querySelector('.hero-section.sticky-hero');
            if (heroSection) {
                heroSection.style.position = 'relative';
            }
        }, 500);
    }

    // Rueda del mouse (escritorio)
    window.addEventListener('wheel', (e) => {
        if (isLocked && !animationComplete && e.deltaY > 0) {
            triggerParallax();
        }
    }, { passive: true });

    // Touch: gesto hacia arriba = intención de bajar (scroll hacia abajo)
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isLocked && !animationComplete) {
            const currentY = e.touches[0].clientY;
            if (touchStartY - currentY > 10) {
                triggerParallax();
            }
        }
    }, { passive: true });

    /**
     * Indica si el scroll está prácticamente en el tope (WebKit a veces no reporta exactamente 0).
     */
    function isScrolledToTop() {
        const winY = window.scrollY || window.pageYOffset || 0;
        const docEl = document.documentElement;
        const body = document.body;
        const top = Math.max(winY, docEl.scrollTop || 0, body.scrollTop || 0);
        return top <= 2;
    }

    // Al volver arriba: revertir franjas y volver a bloquear hasta el siguiente intento (móvil y escritorio)
    window.addEventListener('scroll', () => {
        if (!isLocked && animationComplete && isScrolledToTop()) {
            parallaxContainer.classList.remove('parallax-container-active');

            const heroSection = document.querySelector('.hero-section.sticky-hero');
            if (heroSection) {
                heroSection.style.position = '';
            }

            hasTriggered = false;
            isLocked = true;
            animationComplete = false;
            document.body.style.overflow = 'hidden';
        }
    }, { passive: true });

});

/**
 * Auto Media Carousel Functionality
 * Handles infinite scrolling, navigation buttons, and video playback
 */
function initMediaCarousel() {
    const carouselResult = document.querySelector('.auto-media-carousel');
    if (!carouselResult) {
        // Carousel not present on this page, which is fine.
        return;
    }

    const track = carouselResult.querySelector('.carousel-track');
    if (!track) {
        return;
    }

    // Controls
    const prevBtn = carouselResult.querySelector('.carousel-btn.prev');
    const nextBtn = carouselResult.querySelector('.carousel-btn.next');
    const playPauseBtn = carouselResult.querySelector('.carousel-btn.play-pause');

    // State
    let isPlaying = true;
    let scrollSpeed = 0.5; // Pixels per frame
    let position = 0;
    let animationId = null;
    let isHovering = false;

    // Clone content for infinite loop effect
    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;

    const cardWidth = originalCards[0].offsetWidth + 30; // Card width + gap (approx)
    const totalWidth = cardWidth * originalCards.length;


    // Ensure we have enough content to scroll
    if (originalCards.length > 0) {
        // Clone twice to ensure smooth infinite scroll even on wide screens
        for (let i = 0; i < 2; i++) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                // Remove ID from clones to avoid duplicates
                const insideVideo = clone.querySelector('video');
                if (insideVideo) insideVideo.removeAttribute('id');
                track.appendChild(clone);
            });
        }
    }

    // Animation Loop
    function animate() {
        if (isPlaying && !isHovering) {
            position -= scrollSpeed;

            // Limit position reset to avoid overflow or glitches
            // Reset when we've scrolled past the original set
            if (Math.abs(position) >= totalWidth) {
                position = 0;
            }

            track.style.transform = `translateX(${position}px)`;
        }
        animationId = requestAnimationFrame(animate);
    }

    // Start Animation
    animationId = requestAnimationFrame(animate);

    // Play/Pause Button Toggle
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playPauseBtn.classList.add('playing');
                playPauseBtn.setAttribute('aria-pressed', 'true');
            } else {
                playPauseBtn.classList.remove('playing');
                playPauseBtn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // Manual Navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            position += cardWidth;
            if (position > 0) {
                position = -totalWidth;
            }
            track.style.transform = `translateX(${position}px)`;
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            position -= cardWidth;
            if (Math.abs(position) >= totalWidth * 2) {
                position = 0;
            }
            track.style.transform = `translateX(${position}px)`;
        });
    }

    // Pause on Hover
    carouselResult.addEventListener('mouseenter', () => isHovering = true);
    carouselResult.addEventListener('mouseleave', () => isHovering = false);

    // Video Controls in Cards
    // Re-query all containers including clones
    const allMediaContainers = track.querySelectorAll('.media-container');
    allMediaContainers.forEach(container => {
        const video = container.querySelector('video');
        const toggleBtn = container.querySelector('.video-toggle');

        if (video && toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (video.paused) {
                    // Pause other videos? Optional.
                    video.play();
                    toggleBtn.classList.add('playing');
                    toggleBtn.setAttribute('aria-label', 'Pause video');
                    isPlaying = false; // Stop carousel
                    // Force hover state to true to prevent auto-start if mouse leaves
                    isHovering = true;
                } else {
                    video.pause();
                    toggleBtn.classList.remove('playing');
                    toggleBtn.setAttribute('aria-label', 'Play video');
                    isPlaying = true; // Resume carousel capability
                    isHovering = false; // Let hover logic take over
                }
            });

            video.addEventListener('ended', () => {
                toggleBtn.classList.remove('playing');
                toggleBtn.setAttribute('aria-label', 'Play video');
                isPlaying = true;
                isHovering = false;
            });
        }
    });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initMediaCarousel();
    //initReservationSystem();
    initSmartNavigation();
    if (window.location.pathname.includes('checkout.html')) {
        initCheckoutPageEnhanced();
    }

    // Attempt to hydrate events page if we are on one
    // Detect city from URL or default to 'cancun' for this specific file context
    // In a real router this would be dynamic.
    const isEventsPage = window.location.pathname.includes('/events/');
    if (isEventsPage || document.querySelector('.events-dynamic-grid') || document.querySelector('.weekly-events')) {
        // Extract city from URL path (e.g., /en/cancun/events/ -> cancun)
        const pathParts = window.location.pathname.split('/');
        const eventsIndex = pathParts.indexOf('events');
        const detectedCity = eventsIndex > 1 ? pathParts[eventsIndex - 1] : 'cancun';
        hydrateEventsPage(detectedCity);
    }
});

/**
 * Hydrate Events Page
 * Populates the events grid with data from SITE_DATA
 */
function hydrateEventsPage(cityId) {
    if (typeof SITE_DATA === 'undefined' || !SITE_DATA.cities[cityId]) {
        return;
    }

    const cityData = SITE_DATA.cities[cityId];
    const venues = cityData.venues || [];
    const eventsGrid = document.querySelector('.events-dynamic-grid');
    const weeklyGrid = document.querySelector('.weekly-events');
    const basePath = "../../../"; // Relative path to root from en/cancun/events/


    // Update Hero for Events Page (override loadDestination values)
    const heroTitle = document.querySelector('.page-title');
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (heroTitle) heroTitle.textContent = `Events in ${cityData.name}`;
    if (breadcrumbs) breadcrumbs.textContent = `Home / Events / ${cityData.name}`;

    if (eventsGrid) {
        // Clear existing template placeholders
        eventsGrid.innerHTML = '';

        // Take first 4 venues for main grid
        venues.slice(0, 4).forEach(venue => {
            const card = document.createElement('a');
            card.href = basePath + stripIndexHtmlFromVenuePath(venue.customUrl || '#');
            card.className = "event-card-square";

            // Handle image path
            let imgPath = venue.image;
            if (!imgPath.startsWith("http") && !imgPath.startsWith("../")) {
                imgPath = basePath + imgPath;
            }

            card.innerHTML = `
                <div class="event-card-media">
                <img src="${imgPath}" alt="${venue.name}" onerror="this.src='${basePath}images/2_n.png'">
                </div>
                <div class="event-overlay">
                    <div class="event-date">${venue.hours || "Open Daily"}</div>
                    <div class="event-title">${venue.name}</div>
                    <div class="event-venue">${venue.address || "Cancun"}</div>
                </div>
            `;
            eventsGrid.appendChild(card);
        });
    }

    if (weeklyGrid) {
        weeklyGrid.innerHTML = '';
        // Take next 3 venues for weekly grid (or just loop others)
        const weeklyVenues = venues.slice(0, 3); // Re-using first 3 or slicing 4-7? User mentioned "Weekly Events".
        // Let's use 4-7 if available, otherwise reuse first 3 to fill space.
        const sourceVenues = venues.length > 4 ? venues.slice(4, 7) : venues.slice(0, 3);

        sourceVenues.forEach(venue => {
            const card = document.createElement('a');
            card.href = basePath + stripIndexHtmlFromVenuePath(venue.customUrl || '#');
            card.className = "weekly-event-card";

            let imgPath = venue.image;
            if (!imgPath.startsWith("http") && !imgPath.startsWith("../")) {
                imgPath = basePath + imgPath;
            }

            card.innerHTML = `
                 <img src="${imgPath}" alt="${venue.name}" onerror="this.src='${basePath}images/2_n.png'">
            `;
            weeklyGrid.appendChild(card);
        });
    }
}


/**
 * Initialize Hero Search Functionality
 */
function initSearch() {
    const searchInput = document.getElementById('heroSearchInput');
    const searchBtn = document.getElementById('heroSearchBtn');
    const resultsContainer = document.getElementById('searchResults');

    if (!searchInput || !resultsContainer) return;

    const searchWrap = searchInput.closest('.hero-search');
    const heroSection = searchWrap ? searchWrap.closest('.hero-section') : null;

    function setSearchOpen(open) {
        resultsContainer.classList.toggle('active', open);
        if (searchWrap) {
            searchWrap.classList.toggle('is-open', open);
        }
        if (heroSection) {
            heroSection.classList.toggle('search-open', open);
        }
    }

    // Aggregate all venues
    let allVenues = [];
    if (typeof SITE_DATA !== 'undefined' && SITE_DATA.cities) {
        Object.keys(SITE_DATA.cities).forEach(cityKey => {
            const city = SITE_DATA.cities[cityKey];
            if (city.venues) {
                city.venues.forEach(venue => {
                    allVenues.push({
                        ...venue,
                        cityName: city.name,
                        cityId: cityKey
                    });
                });
            }
        });
    }

    // Filter function
    function performSearch(query) {
        if (!query || query.length < 2) {
            resultsContainer.innerHTML = '';
            setSearchOpen(false);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const matches = allVenues.filter(venue =>
            venue.name.toLowerCase().includes(lowerQuery) ||
            venue.cityName.toLowerCase().includes(lowerQuery)
        );

        renderResults(matches);
    }

    // Render function
    function renderResults(matches) {
        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div class="search-item"><div class="search-item-info"><h4 style="color: #bbb;">No parties found</h4></div></div>';
        } else {
            resultsContainer.innerHTML = matches.map(venue => {
                const assetsPath = window.assetsPath || ''; // Use global assets path if available
                // Fallback image handling
                const imgPath = venue.image.startsWith('http') ? venue.image : (assetsPath + venue.image);

                // Construct URL
                const linkHref = venue.customUrl ? (assetsPath + stripIndexHtmlFromVenuePath(venue.customUrl)) : `venue.html?venue=${venue.id}&city=${venue.cityId}`;

                return `
                    <a href="${linkHref}" class="search-item">
                        <img src="${imgPath}" alt="${venue.name}" onerror="this.src='${assetsPath}images/2_n.png'">
                        <div class="search-item-info">
                            <h4>${venue.name}</h4>
                            <p>${venue.cityName}</p>
                        </div>
                    </a>
                `;
            }).join('');
        }
        setSearchOpen(true);
    }

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value.trim());
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            setSearchOpen(false);
        }
    });

    // Focus opens if value exists
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            performSearch(searchInput.value.trim());
        }
    });

    // Search Button Click - Redirect to first result or search page (optional)
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (!query) return;

            const lowerQuery = query.toLowerCase();
            const matches = allVenues.filter(venue =>
                venue.name.toLowerCase().includes(lowerQuery) ||
                venue.cityName.toLowerCase().includes(lowerQuery)
            );

            if (matches.length > 0) {
                const assetsPath = window.assetsPath || '';
                const linkHref = matches[0].customUrl ? (assetsPath + stripIndexHtmlFromVenuePath(matches[0].customUrl)) : `venue.html?venue=${matches[0].id}&city=${matches[0].cityId}`;
                window.location.href = linkHref;
            }
        });
    }
}
// Share Link Functionality
function getlink() {
    var aux = document.createElement("input");
    aux.setAttribute("value", window.location.href);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    alert("URL copied to clipboard!\n" + window.location.href);
}

/**
 * Global Pricing Modal Handler
 * Applies to all pages with #pricingModal
 * Handles open/close, backdrop cleanup, and body class management
 */


/* --- Reservation System Logic --- */

/**
 * Handles "Get Tickets" button clicks in Reservation Modals
 * Captures selection data and redirects to checkout
 */
//function initReservationSystem() {
    // 1. Table Service Buttons
    /*document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn_prd_tab')) {
            e.preventDefault();
            const btn = e.target;
            const uniqueId = btn.value.replace('_identificador_tab_', '');

            // Target elements based on ID convention in HTML
            // Example ID: 29 (Diamond), yellow, green, etc.

            // Allow for non-numeric IDs like 'white', 'yellow'
            const suffix = uniqueId;

            // Extract Data
            const priceInput = document.getElementById(`precio_table_${suffix}`);
            const currencyInput = document.getElementById(`moneda_table_${suffix}`);
            const guestsSelect = document.getElementById(`${suffix}-guests`);
            const checkinSelect = document.getElementById(`${suffix}-checkin`);
            const quantityInput = document.getElementById(`cantidad-tables_${suffix}`); // Included/Max pax usually

            // Fallback for Category Name
            // Try to find the h5 title within the same container
            const container = btn.closest('.category-content');
            const titleEl = container ? container.querySelector('h5') : null;
            const ticketName = titleEl ? titleEl.textContent.trim() : `Table Reservation (${suffix})`;

            // Get Guest Count & calculated price
            // Option values are like "1-39000.00" (Guests-Price)
            let selectedGuests = 1;
            let totalPrice = 0;

            if (guestsSelect) {
                const valParts = guestsSelect.value.split('-');
                if (valParts.length >= 2) {
                    selectedGuests = parseInt(valParts[0]);
                    totalPrice = parseFloat(valParts[1]);
                } else {
                    // Fallback if formatting is different
                    selectedGuests = parseInt(guestsSelect.value);
                    totalPrice = parseFloat(priceInput ? priceInput.value : 0);
                }
            }

            const reservationData = {
                type: 'table',
                venueName: document.title.split('|')[0].trim() || 'Mandala Venue', // Fallback title
                ticketType: ticketName,
                price: totalPrice,
                currency: currencyInput ? currencyInput.value : 'MXN',
                guests: selectedGuests,
                checkin: checkinSelect ? checkinSelect.value : 'TBD',
                quantity: 1, // Tables are usually booked 1 at a time per click
                date: document.getElementById('fecha_texto-prop3') ? document.getElementById('fecha_texto-prop3').textContent : 'Selected Date'
            };

            saveAndRedirect(reservationData);
        }
    });*/

    // 2. Personal / Access Tickets Buttons
    /*document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn_prd_acc')) {
            e.preventDefault();
            const btn = e.target;
            // Value format: _identificador_acc_419
            const uniqueId = btn.value.replace('_identificador_acc_', '');

            // Extract Data
            const priceInput = document.getElementById(`precio_general_${uniqueId}`);
            const currencyInput = document.getElementById(`moneda_general_${uniqueId}`);
            const quantitySelect = document.getElementById(`cantidad-tickets_${uniqueId}`);

            // Find Title
            const container = btn.closest('.category-content');
            const titleEl = container ? container.querySelector('h5') : null;
            const ticketName = titleEl ? titleEl.textContent.trim() : `General Access (${uniqueId})`;

            let quantity = 1;
            let unitPrice = 0;

            if (quantitySelect) {
                quantity = parseInt(quantitySelect.value);
            }

            if (priceInput) {
                unitPrice = parseFloat(priceInput.value);
            }

            const reservationData = {
                type: 'ticket',
                venueName: document.title.split('|')[0].trim() || 'Mandala Venue',
                ticketType: ticketName,
                price: unitPrice * quantity,
                unitPrice: unitPrice,
                currency: currencyInput ? currencyInput.value : 'USD',
                guests: quantity, // For tickets, guests = tickets usually
                quantity: quantity,
                checkin: 'See Ticket',
                date: document.getElementById('fecha_texto-prop3') ? document.getElementById('fecha_texto-prop3').textContent : 'Selected Date'
            };

            saveAndRedirect(reservationData);
        }
    });*/

    /*function saveAndRedirect(data) {
        // Enforce specific logic for checkout redirect
        // Since we are likely in a subdirectory (en/cancun/disco/rakata/)
        // We need to go up to root checkout.html

        localStorage.setItem('pendingReservation', JSON.stringify(data));

        // Determine path to checkout
        // Using existing window.assetsPath logic or simple relative
        const cleanPath = window.location.pathname.replace('index.html', '');
        // Count depth
        const depth = (cleanPath.match(/\//g) || []).length - 1;
        // -1 because leading slash counts. root/en/city/vtype/venue/ -> 5 slashes? 
        // Better: user standard "../" repetition

        let pathToRoot = "";
        if (window.assetsPath) {
            pathToRoot = window.assetsPath;
        } else {
            // Fallback
            pathToRoot = "../../../../";
        }

        window.location.href = pathToRoot + "checkout.html?date=" + encodeURIComponent(data.date);
    }*/
//}

/**
 * Initializes Checkout Page
 * Populates data from LocalStorage
 */
function initCheckoutPage() {
    const dataStr = localStorage.getItem('pendingReservation');
    if (!dataStr) return; // No pending reservation

    try {
        const data = JSON.parse(dataStr);

        // Populate Summary
        const venueEl = document.getElementById('summary-venue');
        const ticketEl = document.getElementById('summary-ticket-type');
        const quantityEl = document.getElementById('summary-quantity-wrapper');
        const guestsEl = document.getElementById('summary-guests');
        const dateEl = document.getElementById('summary-date');

        // Populate Totals
        const totalMxnEl = document.getElementById('total_mxn'); // Subtotal
        const totalGlobalEl = document.getElementById('monto_total_mxn'); // Total text
        const totalUsdEl = document.getElementById('monto_total_usd');
        const btnPay = document.getElementById('texto_boton_pay');

        if (venueEl) venueEl.textContent = data.venueName;
        if (ticketEl) {
            ticketEl.firstChild.textContent = data.ticketType + " "; // Keep the span?
        }
        if (quantityEl) quantityEl.textContent = `x ${data.quantity}`;
        if (guestsEl) guestsEl.textContent = `${data.guests} guests`;
        if (dateEl) dateEl.textContent = `Date of visit: ${data.date}`;

        // Simple Currency formatting
        const formattedPrice = data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Update Pricing UI
        // Note: This logic assumes simple display. A real backend would need verification.
        if (data.currency === 'MXN') {
            if (totalGlobalEl) totalGlobalEl.textContent = `$ ${formattedPrice} MXN`;
            if (totalMxnEl) totalMxnEl.textContent = `$ ${formattedPrice} MXN`; // Using subtotal slot for now
            // Mock USD conversion ~ 17
            const usdPrice = (data.price / 17).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            if (totalUsdEl) totalUsdEl.textContent = `$ ${usdPrice} USD`;
            if (btnPay) btnPay.textContent = `PAY $ ${formattedPrice} MXN`;

        } else {
            // USD
            if (totalUsdEl) totalUsdEl.textContent = `$ ${formattedPrice} USD`;
            if (totalMxnEl) totalMxnEl.textContent = `$ ${formattedPrice} USD`;
            if (btnPay) btnPay.textContent = `PAY $ ${formattedPrice} USD`;

            // For Total MXN field (just hiding or showing same?)
            // Let's just show USD in valid fields for now
            if (totalGlobalEl) totalGlobalEl.textContent = `$ ${(data.price * 17).toLocaleString()} MXN (Approx)`;
        }

    } catch (e) {
        // Datos de reservación inválidos en localStorage
    }
}

/* --- Smart Navigation & Empty Cart Logic --- */

/**
 * Handles Global "Book Tickets" Logic
 * Redirects or scrolls based on page context
 */
function initSmartNavigation() {
    const bookButtons = document.querySelectorAll('.btn-book-tickets');

    bookButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const currentPath = window.location.pathname;

            // 1. If we have a pending reservation AND we are not already on checkout, 
            // maybe we want to go there? 
            // BUT user intent "Book Tickets" on global header usually means "I want to start valid flow"
            // So let's stick to context-aware navigation unless they are explicitly in a checkout flow.

            // Check Context
            if (currentPath.endsWith('index.html') && currentPath.includes('/disco/') || currentPath.includes('/beach-clubs/')) {
                // Venue Page -> Open Modal or Scroll to Pricing
                // Prefer opening modal if it exists
                if (typeof window.openPricingModal === 'function') {
                    window.openPricingModal();
                } else {
                    // Fallback to scrolling to tickets section
                    const ticketSection = document.querySelector('#pricingModal') || document.querySelector('.pricing-section') || document.querySelector('#tickets');
                    if (ticketSection) {
                        ticketSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            } else if (currentPath.includes('/cancun/') || currentPath.includes('/tulum/') || currentPath.includes('/vallarta/') || currentPath.includes('/cabos/') || currentPath.includes('/playa/')) {
                // City Page -> Scroll to Venues
                // If regex matches city root e.g. en/cancun/index.html
                const venuesGrid = document.querySelector('.venues-grid') || document.querySelector('#venues');
                if (venuesGrid) {
                    venuesGrid.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // If no grid (maybe subpage), go to city index
                    // Extract city root... simpler to just go to anchors if present
                }
            } else if (currentPath.endsWith('checkout.html')) {
                // Already on checkout, do nothing or reload
            } else {
                // Home or Generic -> Scroll to Destinations
                const destSection = document.querySelector('.destinations-section') || document.getElementById('destinations');
                if (destSection) {
                    destSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Fallback: If we are deep in structure but structure is unknown, go to home
                    // window.location.href = '/index.html#destinations'; // Careful with relative paths
                }
            }
        });
    });
}

/**
 * Enhanced Checkout Init
 * Handles empty state if no reservation found
 */
function initCheckoutPageEnhanced() {
    initCheckoutPage(); // Run basic population

    const dataStr = localStorage.getItem('pendingReservation');
    if (!dataStr) {
        // Show Empty State
        const orderSummary = document.querySelector('.widget-order-summary');
        const paymentForm = document.getElementById('payment-form');
        const contentContainer = document.querySelector('.contenido_checkout');

        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="text-center" style="padding: 100px 20px;">
                    <h2 style="color: #fff; margin-bottom: 20px;">Your Cart is Empty</h2>
                    <p style="color: #ccc; margin-bottom: 40px;">Select a venue and date to start your party.</p>
                    <a href="index.html" class="btn btn-primary" style="background: linear-gradient(90deg, #55BFEE 0%, #007bff 100%); border: none;">BROWSE VENUES</a>
                </div>
            `;
        }
    }
}
