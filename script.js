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
});
