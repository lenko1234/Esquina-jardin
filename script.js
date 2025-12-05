document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        }
    });

    // Hero Animation Logic
    const tallo = document.getElementById('tallo-principal');
    if (tallo) {
        const grupoHojas = document.getElementById('grupo-hojas');
        const longitudTallo = tallo.getTotalLength();

        gsap.set(tallo, { strokeDasharray: longitudTallo, strokeDashoffset: longitudTallo });

        // Restore original leaf count
        const numeroHojas = 14;
        const isMobile = window.innerWidth < 768;

        for (let i = 1; i < numeroHojas; i++) {
            const porcentaje = i / numeroHojas;
            const punto = tallo.getPointAtLength(porcentaje * longitudTallo);

            // Skip leaf if it covers the "E" (approximate x range 180-240)
            if (punto.x > 180 && punto.x < 240) continue;

            const hoja = document.createElementNS("http://www.w3.org/2000/svg", "use");
            hoja.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#hoja-fina");
            hoja.setAttribute("x", punto.x);
            hoja.setAttribute("y", punto.y);
            hoja.classList.add('hoja');

            // Adjust scale for mobile but keep count
            const baseScale = isMobile ? 0.5 : 0.7;
            const randomScale = isMobile ? 0.4 : 0.6;
            const escalaFinal = baseScale + Math.random() * randomScale;

            // Lógica de rotación mejorada para seguir la nueva curva
            const puntoSiguiente = tallo.getPointAtLength(Math.min(porcentaje * longitudTallo + 1, longitudTallo));
            const anguloTangente = Math.atan2(puntoSiguiente.y - punto.y, puntoSiguiente.x - punto.x) * 180 / Math.PI;

            const rotacionBase = (i % 2 === 0) ? -30 : 30;

            gsap.set(hoja, {
                // Rotamos la hoja basándonos en la dirección del tallo + la alternancia
                rotation: anguloTangente + rotacionBase + (Math.random() * 15 - 7.5),
                scale: 0,
                attr: { "data-scale": escalaFinal },
                svgOrigin: `${punto.x} ${punto.y}` // Pivot exactly at the stem attachment point in SVG space
            });

            grupoHojas.appendChild(hoja);
        }

        const tl = gsap.timeline({ delay: 0.5 });

        tl.to(tallo, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: "power1.inOut"
        })
            .to('.hoja', {
                opacity: 1,
                scale: (i, target) => target.getAttribute("data-scale"),
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.5)"
                // svgOrigin is already set, no need to repeat
            }, "-=2.0")
            .to('.flor', {
                scale: 1.8,
                opacity: 1,
                rotation: 180,
                duration: 1.2,
                ease: "elastic.out(1, 0.4)"
            }, "-=0.5")
            .to('.hoja, .flor', {
                rotation: "+=4",
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: { each: 0.15, from: "random" }
            }, "ambiente");
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Instagram Float Logic
    const footer = document.getElementById('contacto');
    const instaFloat = document.querySelector('.instagram-float');

    if (footer && instaFloat) {
        window.addEventListener('scroll', () => {
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Trigger when the footer enters the viewport (minus a small buffer for the button)
            // The button is at bottom: 40px. 
            // We want it to appear when the green zone is behind it.
            if (footerRect.top < windowHeight - 20) {
                instaFloat.classList.add('visible');
            } else {
                instaFloat.classList.remove('visible');
            }
        });
    }

    // Product Modal Logic
    const productImages = {
        'Plantas': [
            'WhatsApp Image 2025-12-04 at 8.33.09 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.10 PM (1).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.10 PM (2).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.10 PM (3).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.10 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.11 PM (1).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.11 PM (2).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.11 PM (3).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.11 PM.jpeg'
        ],
        'Macetas': [
            'WhatsApp Image 2025-12-04 at 8.33.40 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.41 PM (1).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.41 PM (2).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.41 PM (3).jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.41 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.33.42 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.34.46 PM.jpeg'
        ],
        'Sustratos': [
            'WhatsApp Image 2025-12-04 at 8.36.01 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.36.02 PM (1).jpeg',
            'WhatsApp Image 2025-12-04 at 8.36.02 PM (2).jpeg',
            'WhatsApp Image 2025-12-04 at 8.36.02 PM.jpeg'
        ],
        'Mascotas': [
            'WhatsApp Image 2025-12-04 at 8.32.36 PM (1).jpeg',
            'WhatsApp Image 2025-12-04 at 8.32.36 PM.jpeg',
            'WhatsApp Image 2025-12-04 at 8.32.37 PM (1).jpeg',
            'WhatsApp Image 2025-12-04 at 8.32.37 PM (2).jpeg',
            'WhatsApp Image 2025-12-04 at 8.32.37 PM (3).jpeg',
            'WhatsApp Image 2025-12-04 at 8.32.37 PM (4).jpeg',
            'WhatsApp Image 2025-12-04 at 8.32.37 PM.jpeg'
        ]
    };

    // Create Modal Elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">Galería</h3>
                <button class="modal-close"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
                <div class="modal-grid"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Create Lightbox Elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close"><i class="fa-solid fa-xmark"></i></button>
        <img src="" alt="Full view" class="lightbox-img">
    `;
    document.body.appendChild(lightbox);

    const modalGrid = modalOverlay.querySelector('.modal-grid');
    const modalTitle = modalOverlay.querySelector('.modal-title');
    const modalCloseBtn = modalOverlay.querySelector('.modal-close');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCloseBtn = lightbox.querySelector('.lightbox-close');

    // Open Modal
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (!category || !productImages[category]) return;

            modalTitle.textContent = category;
            modalGrid.innerHTML = '';

            productImages[category].forEach((img, index) => {
                const container = document.createElement('div');
                container.className = 'modal-image-container';
                container.style.animationDelay = `${index * 0.05}s`;

                const image = document.createElement('img');
                image.src = `assets/${category}/${img}`;
                image.className = 'modal-image';
                image.loading = 'lazy';

                container.appendChild(image);
                modalGrid.appendChild(container);

                // Lightbox click
                container.addEventListener('click', (e) => {
                    e.stopPropagation();
                    lightboxImg.src = image.src;
                    lightbox.classList.add('active');
                });
            });

            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('active')) {
                closeLightbox();
            } else if (modalOverlay.classList.contains('active')) {
                closeModal();
            }
        }
    });

});
