document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================
    // 1. MENU MOBILE TOGGLE
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            
            // Animação do ícone do menu
            const icon = menuToggle.querySelector('i');
            if (isActive) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fechar menu ao clicar em um link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ========================================
    // 2. SCROLL SUAVE PARA LINKS INTERNOS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 3. ANIMAÇÃO DE CARDS AO ROLAR (FADE IN)
    // ========================================
    const cards = [...document.querySelectorAll('.service-card')];

    function checkVisibility() {
        const windowHeight = window.innerHeight;
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < windowHeight * 0.85) {
                setTimeout(() => {
                    card.classList.add('is-visible');
                }, index * 100);
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();

    // ========================================
    // 4. ANIMAÇÃO DE CONTADORES (STATS)
    // ========================================
    const statItems = document.querySelectorAll('.stat-item h3');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        
        const section = document.querySelector('#qualidade');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            
            statItems.forEach(counter => {
                const text = counter.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                let current = 0;
                const increment = number / 50;
                const duration = 2000;
                const stepTime = duration / 50;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        counter.textContent = '+' + number + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = '+' + Math.floor(current) + suffix;
                    }
                }, stepTime);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);

    // ========================================
    // 6. CARROSSEL DE TALENTOS

    const carousel = document.querySelector('.talent-carousel');
    const carouselTrack = document.querySelector('.carousel-track');
    const prevNav = document.querySelector('.carousel-prev');
    const nextNav = document.querySelector('.carousel-next');

    if (carousel && carouselTrack) {
        const scrollByCards = (count = 1) => {
            const card = carouselTrack.querySelector('.talent-card');
            if (!card) return;
            const gapStr = getComputedStyle(carouselTrack).gap || '20px';
            const gap = parseInt(gapStr, 10) || 20;
            const move = (card.offsetWidth + gap) * count;
            carousel.scrollBy({ left: move, behavior: 'smooth' });
        };

        if (nextNav) nextNav.addEventListener('click', () => scrollByCards(1));
        if (prevNav) prevNav.addEventListener('click', () => scrollByCards(-1));

        // Mouse drag on visible carousel container
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carouselTrack.classList.add('dragging');
            startX = e.pageX - carousel.getBoundingClientRect().left;
            scrollLeft = carousel.scrollLeft;
        });

        document.addEventListener('mouseup', () => {
            isDown = false;
            carouselTrack.classList.remove('dragging');
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.getBoundingClientRect().left;
            const walk = (x - startX) * 1; // scroll speed
            carousel.scrollLeft = scrollLeft - walk;
        });

    }

    // ========================================
    // 7. FAQ ACCORDION
    // ========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Keep one answer open at a time while allowing the modal to scroll.
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherQuestion = item.querySelector('.faq-question');
                    otherAnswer.style.maxHeight = '0';
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });

            if (isExpanded) {
                faqAnswer.style.maxHeight = '0';
                question.setAttribute('aria-expanded', 'false');
            } else {
                faqAnswer.style.maxHeight = `${faqAnswer.scrollHeight}px`;
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ========================================
    // 8. EFEITO PARALLAX NO HERO
    // ========================================
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        const updateHeroParallax = () => {
            if (window.matchMedia('(max-width: 768px)').matches) {
                heroContent.style.transform = '';
                heroContent.style.opacity = '1';
                return;
            }

            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        };

        window.addEventListener('scroll', updateHeroParallax);
        updateHeroParallax();
    }

    // ========================================
    // 9. BOTÃO WHATSAPP FLUTUANTE
    // ========================================
    const whatsappFloat = document.querySelector('.whatsapp-float');

    if (whatsappFloat) {
        // Mostrar botão após scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.transform = 'translateY(0)';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.transform = 'translateY(20px)';
            }
        });

        // Animação de pulso
        whatsappFloat.addEventListener('mouseenter', () => {
            whatsappFloat.style.transform = 'translateY(-5px) scale(1.1)';
        });

        whatsappFloat.addEventListener('mouseleave', () => {
            whatsappFloat.style.transform = 'translateY(0) scale(1)';
        });
    }

    // ========================================
    // 10. SCROLL REVEAL PARA SEÇÕES
    // ========================================
    const sections = document.querySelectorAll('.section');

    function revealOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight * 0.85) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Adicionar estilos iniciais
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ========================================
    // 11. EFEITO DE HOVER NOS CARDS
    // ========================================
    const allCards = document.querySelectorAll('.service-card');

    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });

    document.querySelectorAll('.services-carousel').forEach(carousel => {
        const track = carousel.querySelector('.services-grid');
        const cards = [...carousel.querySelectorAll('.service-card')];
        const dots = [...carousel.querySelectorAll('.service-carousel-dot')];

        if (!track || !cards.length || !dots.length) return;

        const updateControls = () => {
            const cardsPerPage = window.matchMedia('(max-width: 768px)').matches ? 2 : 1;
            const pageIndex = Math.min(dots.length - 1, Math.round(track.scrollLeft / track.clientWidth));

            dots.forEach((dot, index) => {
                const isActive = index === pageIndex;
                dot.classList.toggle('is-active', isActive);
                if (isActive) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                track.scrollTo({
                    left: index * track.clientWidth,
                    behavior: 'smooth'
                });
            });
        });

        track.addEventListener('scroll', updateControls, { passive: true });
        window.addEventListener('resize', updateControls);
        updateControls();
    });

    // ========================================
    // 12. LOADING SCREEN (OPCIONAL)
    // ========================================
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Carregando...</p>
        </div>
    `;

    document.body.appendChild(loadingScreen);

    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });

    // ========================================
    // 13. ANIMAÇÃO DE ENTRADA DO HEADER
    // ========================================
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // 14. TOOLTIPS (OPCIONAL)
    // ========================================
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'var(--cor-primaria)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.fontSize = '0.9rem';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            
            const rect = element.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
            
            document.body.appendChild(tooltip);

            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    });

    // ========================================
    // 15. PREVENIR SCROLL EXCESSIVO
    // ========================================
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(() => {
                isScrolling = false;
            });
        }
    });

    // ========================================
    // 16. DETECTAR MUDANÇA DE TELA
    // ========================================
    let lastWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        
        if (Math.abs(currentWidth - lastWidth) > 10) {
            // Recalcular animações
            checkVisibility();
            revealOnScroll();
        }
        
        lastWidth = currentWidth;
    });

    // ========================================
    // 17. ANIMAÇÃO DE BOTÃO PRINCIPAL
    // ========================================
    const primaryButtons = document.querySelectorAll('.btn-primary');

    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('click', (e) => {
            if (button.classList.contains('email-cta')) return;
            if (button instanceof HTMLAnchorElement && button.href.startsWith('mailto:')) return;
            if (button instanceof HTMLButtonElement && button.type === 'submit') return;
            e.preventDefault();
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            }, 150);
        });
    });

    // ========================================
    // 18. RASTREAMENTO DE CLIC (OPCIONAL)
    // ========================================
    const clickTracker = (e) => {
        const target = e.target;
        if (target.classList.contains('btn-primary') || target.closest('.btn-primary')) {
            console.log('CTA Clicado:', target.closest('.btn-primary').textContent);
        }
    };

    document.addEventListener('click', clickTracker);

    // ========================================
    // 19. ANIMAÇÃO DE TEXTO (TYPING EFFECT)
    // ========================================
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let charIndex = 0;

        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 500);
    }

    // ========================================
    // 20. FUNÇÃO DE UTILIDADE: SCROLL TO TOP
    // ========================================
    window.scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // ========================================
    // 21. DETECTAR VISIBILIDADE DA PÁGINA
    // ========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Usuário saiu da página');
        } else {
            console.log('Usuário retornou à página');
            // Reativar animações se necessário
            checkVisibility();
            revealOnScroll();
        }
    });

    // ========================================
    // 22. MODAL FAQ
    // ========================================
    window.openFAQModal = () => {
        document.getElementById('faqModal').style.display = 'block';
    };

    window.closeFAQModal = () => {
        document.getElementById('faqModal').style.display = 'none';
    };

    // Fechar modal ao clicar fora
    window.onclick = (event) => {
        const modal = document.getElementById('faqModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    const talentsModal = document.getElementById('talentsModal');
    const talentsDialog = talentsModal?.querySelector('.talents-modal-panel');
    const showTalentsButton = document.querySelector('.see-all');
    const closeTalentsButton = talentsModal?.querySelector('.talents-modal-close');

    const closeTalentsModal = () => {
        if (!talentsModal || !showTalentsButton) return;
        talentsModal.classList.remove('is-open');
        talentsModal.setAttribute('aria-hidden', 'true');
        showTalentsButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        showTalentsButton.focus();
    };

    showTalentsButton?.addEventListener('click', () => {
        if (!talentsModal || !talentsDialog) return;
        talentsModal.classList.add('is-open');
        talentsModal.setAttribute('aria-hidden', 'false');
        showTalentsButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        talentsDialog.focus();
    });

    closeTalentsButton?.addEventListener('click', closeTalentsModal);

    talentsModal?.addEventListener('click', (event) => {
        if (event.target === talentsModal) closeTalentsModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && talentsModal?.classList.contains('is-open')) {
            closeTalentsModal();
        }
    });

});
