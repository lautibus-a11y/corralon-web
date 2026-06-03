        // Initialize Icons
        lucide.createIcons();

        // 1. Lenis Smooth Scroll Setup
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 2. Custom Cursor Logic
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        const hoverTriggers = document.querySelectorAll('.hover-trigger, .material-card, .accordion-header, .modal-close');
        const darkSections = document.querySelectorAll('.dark-section');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            if(cursorDot) {
                cursorDot.style.left = `${posX}px`;
                cursorDot.style.top = `${posY}px`;
            }
            if(cursorOutline) {
                cursorOutline.style.left = `${posX}px`;
                cursorOutline.style.top = `${posY}px`;
            }

            let isDark = false;
            darkSections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if(posX >= rect.left && posX <= rect.right && posY >= rect.top && posY <= rect.bottom) {
                    isDark = true;
                }
            });
            if(isDark) {
                document.body.classList.add('dark-section-cursor');
            } else {
                document.body.classList.remove('dark-section-cursor');
            }
        });

        hoverTriggers.forEach(trigger => {
            trigger.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            trigger.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // 3. Navbar background on scroll
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('-translate-y-2');
                navbar.querySelector('div>div').classList.add('border', 'border-white/10', 'bg-dark/80');
            } else {
                navbar.classList.remove('-translate-y-2');
                navbar.querySelector('div>div').classList.remove('border', 'border-white/10', 'bg-dark/80');
            }
        });

        // 4. Hero Image Parallax 
        const heroImg = document.getElementById('hero-img');
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if(scroll < window.innerHeight) {
                heroImg.style.transform = `scale(1.05) translateY(${scroll * 0.3}px)`;
            }
        });

        // 5. Scroll Animations
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-text, .fade-up, .slide-down').forEach((el) => {
            observer.observe(el);
        });

        // Stats Animated Counters
        const statsContainer = document.getElementById('stats-container');
        const counters = document.querySelectorAll('.counter-value');
        let countersAnimated = false;

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateValue(counter, 0, target, 2000);
                    });
                }
            });
        }, { threshold: 0.5 });
        if (statsContainer) statsObserver.observe(statsContainer);

        // 6. Interactive Calculator Logic
        const sliderM2 = document.getElementById('slider-m2');
        const sliderPisos = document.getElementById('slider-pisos');
        const valM2 = document.getElementById('val-m2');
        const valPisos = document.getElementById('val-pisos');
        const outCemento = document.getElementById('out-cemento');
        const outLadrillo = document.getElementById('out-ladrillo');
        const outHierro = document.getElementById('out-hierro');

        function updateCalculator() {
            const m2 = parseInt(sliderM2.value);
            const pisos = parseInt(sliderPisos.value);

            valM2.innerText = m2;
            valPisos.innerText = pisos;

            const calcCemento = Math.floor(m2 * 1.5 * pisos); 
            const calcLadrillo = ((m2 * 0.05) * pisos).toFixed(1);
            const calcHierro = Math.floor(m2 * 0.8 * pisos);

            animateValue(outCemento, parseFloat(outCemento.innerText) || 0, calcCemento, 500);
            animateValue(outLadrillo, parseFloat(outLadrillo.innerText) || 0, parseFloat(calcLadrillo), 500, true);
            animateValue(outHierro, parseFloat(outHierro.innerText) || 0, calcHierro, 500);
        }

        sliderM2.addEventListener('input', updateCalculator);
        sliderPisos.addEventListener('input', updateCalculator);

        function animateValue(obj, start, end, duration, isFloat = false) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                let currentVal = progress * (end - start) + start;
                obj.innerHTML = isFloat ? currentVal.toFixed(1) : Math.floor(currentVal);
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
        setTimeout(updateCalculator, 500);

        // 7. Modal Logic for Materials
        const modalData = {
            'estructura': {
                title: 'Hormigón & Áridos',
                items: [
                    { name: 'Cemento Portland Loma Negra 50kg', price: '$8.500', value: 8500, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Arena Fina por Metro Cúbico (m³)', price: '$22.000', value: 22000, image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Piedra Partida 6/20 por Metro Cúbico', price: '$28.000', value: 28000, image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Hormigón Elaborado H21 (Servicio Bomba)', price: 'Consultar', value: 0, image: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=200&auto=format&fit=crop' }
                ]
            },
            'tension': {
                title: 'Aceros & Mallas',
                items: [
                    { name: 'Varilla Hierro Aletado 8mm (12m)', price: '$9.200', value: 9200, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Varilla Hierro Aletado 12mm (12m)', price: '$18.400', value: 18400, image: 'https://images.unsplash.com/photo-1516216621161-f9c9c02a22b4?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Malla Sima 15x15 6mm (Panel 2x3m)', price: '$24.500', value: 24500, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Alambre Negro Recocido N°16 (1kg)', price: '$2.100', value: 2100, image: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=200&auto=format&fit=crop' }
                ]
            },
            'mamposteria': {
                title: 'Ladrillos & Bloques',
                items: [
                    { name: 'Ladrillo Hueco 18x18x33 (Pallet x 144)', price: '$115.000', value: 115000, image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Ladrillo Común de Primera (Millar)', price: '$95.000', value: 95000, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Bloque de Hormigón 20x20x40', price: '$1.800 c/u', value: 1800, image: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Ladrillo Retak HCCA 15x25x50', price: '$3.500 c/u', value: 3500, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200&auto=format&fit=crop' }
                ]
            },
            'terminaciones': {
                title: 'Maderas Premium',
                items: [
                    { name: 'Tirante Pino Paraná 2x6 (Metro lineal)', price: '$5.800', value: 5800, image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Machimbre Pino 1/2 x 4 (M2)', price: '$12.500', value: 12500, image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Viga Multilaminada Estructural', price: 'Consultar', value: 0, image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=200&auto=format&fit=crop' },
                    { name: 'Placa OSB 18mm 1.22x2.44m', price: '$38.000', value: 38000, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200&auto=format&fit=crop' }
                ]
            }
        };

        const materialModal = document.getElementById('material-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        const materialCards = document.querySelectorAll('.material-card');

        materialCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                const data = modalData[category];
                
                modalTitle.innerText = data.title;
                modalContent.innerHTML = '';
                
                data.items.forEach(item => {
                    modalContent.innerHTML += `
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-dark/10 hover:bg-black/5 transition-colors rounded-lg group gap-4">
                            <div class="flex items-center gap-4 flex-1 min-w-0">
                                <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border border-dark/10 shrink-0">
                                <div class="min-w-0">
                                    <h4 class="font-bold text-base md:text-lg text-dark group-hover:text-accent transition-colors truncate">${item.name}</h4>
                                    <span class="font-mono text-sm text-dark/50">${item.price}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-3 shrink-0 self-end sm:self-auto mt-2 sm:mt-0">
                                <div class="flex items-center gap-1.5 border border-dark/20 rounded-full px-2 py-1 bg-white/50">
                                    <button class="qty-minus w-7 h-7 rounded-full flex items-center justify-center hover:bg-dark hover:text-white transition-colors text-lg font-bold leading-none text-dark/60 hover:text-white">−</button>
                                    <span class="qty-value font-mono text-base font-bold w-5 text-center text-dark" data-qty="1">1</span>
                                    <button class="qty-plus w-7 h-7 rounded-full flex items-center justify-center hover:bg-dark hover:text-white transition-colors text-lg font-bold leading-none text-dark/60 hover:text-white">+</button>
                                </div>
                                <button class="add-to-cart bg-dark text-white px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-accent transition-colors flex items-center justify-center gap-2" data-name="${item.name}" data-price="${item.price}" data-value="${item.value}">
                                    <i data-lucide="shopping-cart" class="w-4 h-4"></i> Agregar
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                lucide.createIcons();
                materialModal.classList.remove('hidden');
                materialModal.classList.add('flex');
                
                // Trigger animation
                setTimeout(() => {
                    materialModal.classList.add('is-open');
                }, 10);
            });
        });

        // Close modal logic
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                materialModal.classList.remove('is-open');
                setTimeout(() => {
                    materialModal.classList.add('hidden');
                    materialModal.classList.remove('flex');
                }, 400); // Wait for transition
            });
        });

        // 8. Accordion Logic for Services
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');
            
            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    otherItem.querySelector('.accordion-icon').style.transform = 'rotate(0deg)';
                });

                // Open clicked if it wasn't open
                if (!isOpen) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });

        // 10. Testimonial Slider Logic
        const track = document.getElementById('testimonial-track');
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        let currentSlide = 0;

        if (track && prevBtn && nextBtn) {
            const slides = track.children.length;
            
            function updateSlider() {
                track.style.transform = `translateX(-${currentSlide * 100}%)`;
            }

            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides) % slides;
                updateSlider();
            });

            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides;
                updateSlider();
            });

            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides;
                updateSlider();
            }, 6000);
        }

        // 9. Cart Logic
        let cart = [];

        function addToCart(item) {
            const existing = cart.find(i => i.name === item.name);
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                cart.push({ ...item });
            }
            updateCartUI();
        }

        function removeFromCart(name) {
            cart = cart.filter(i => i.name !== name);
            updateCartUI();
        }

        function updateQuantity(name, delta) {
            const item = cart.find(i => i.name === name);
            if (!item) return;
            item.quantity = Math.max(1, item.quantity + delta);
            updateCartUI();
        }

        function getCartTotal() {
            return cart.reduce((sum, item) => sum + (item.value || 0) * item.quantity, 0);
        }

        function getCartCount() {
            return cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        function updateCartUI() {
            const fab = document.getElementById('cart-fab');
            const badge = document.getElementById('cart-badge');
            const cartItemsContainer = document.getElementById('cart-items');
            const cartFooter = document.getElementById('cart-footer');
            const cartTotal = document.getElementById('cart-total');

            const count = getCartCount();
            
            if (count > 0) {
                fab.classList.remove('hidden');
                badge.textContent = count > 99 ? '99+' : count;
            } else {
                fab.classList.add('hidden');
            }

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="flex flex-col items-center justify-center py-12 text-dark/40">
                        <i data-lucide="shopping-bag" class="w-12 h-12 mb-4"></i>
                        <p class="font-mono text-sm uppercase tracking-widest">Tu carrito está vacío</p>
                    </div>
                `;
                cartFooter.classList.add('hidden');
            } else {
                let html = '';
                cart.forEach(item => {
                    html += `
                        <div class="flex items-center justify-between p-3 border-b border-dark/10">
                            <div class="flex-1 min-w-0 mr-3">
                                <h4 class="font-bold text-sm text-dark truncate">${item.name}</h4>
                                <span class="font-mono text-xs text-dark/50">${item.price}</span>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <div class="flex items-center gap-1 border border-dark/20 rounded-full px-2 py-0.5">
                                    <button class="cart-qty-minus w-6 h-6 flex items-center justify-center text-dark/60 hover:text-dark transition-colors text-sm font-bold leading-none" data-name="${item.name}">−</button>
                                    <span class="font-mono text-sm font-bold w-4 text-center text-dark">${item.quantity}</span>
                                    <button class="cart-qty-plus w-6 h-6 flex items-center justify-center text-dark/60 hover:text-dark transition-colors text-sm font-bold leading-none" data-name="${item.name}">+</button>
                                </div>
                                <button class="cart-remove w-7 h-7 flex items-center justify-center text-dark/30 hover:text-red-500 transition-colors" data-name="${item.name}">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    `;
                });
                cartItemsContainer.innerHTML = html;
                cartFooter.classList.remove('hidden');
                cartTotal.textContent = `$${getCartTotal().toLocaleString('es-AR')}`;
                lucide.createIcons();
            }
        }

        // Quantity buttons in modal (delegated)
        document.getElementById('modal-content')?.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            if (target.classList.contains('qty-minus') || target.classList.contains('qty-plus')) {
                const container = target.closest('.flex.items-center.gap-3');
                if (!container) return;
                const valueEl = container.querySelector('.qty-value');
                let qty = parseInt(valueEl.dataset.qty) || 1;
                if (target.classList.contains('qty-minus')) {
                    qty = Math.max(1, qty - 1);
                } else {
                    qty = Math.min(99, qty + 1);
                }
                valueEl.dataset.qty = qty;
                valueEl.textContent = qty;
            }

            if (target.classList.contains('add-to-cart')) {
                const name = target.dataset.name;
                const price = target.dataset.price;
                const value = parseFloat(target.dataset.value) || 0;
                const container = target.closest('.flex.items-center.gap-3');
                const valueEl = container?.querySelector('.qty-value');
                const quantity = parseInt(valueEl?.dataset.qty) || 1;
                
                addToCart({ name, price, value, quantity });
                
                if (valueEl) {
                    valueEl.dataset.qty = 1;
                    valueEl.textContent = '1';
                }

                target.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> ✓';
                setTimeout(() => {
                    target.innerHTML = '<i data-lucide="shopping-cart" class="w-4 h-4"></i> Agregar';
                    lucide.createIcons();
                }, 1000);
            }
        });

        // Cart toggle
        document.getElementById('cart-toggle')?.addEventListener('click', () => {
            const panel = document.getElementById('cart-panel');
            panel.classList.remove('hidden');
            panel.classList.add('flex');
            setTimeout(() => {
                panel.querySelector('#cart-inner').classList.add('is-open');
                lucide.createIcons();
            }, 10);
        });

        function closeCart() {
            const panel = document.getElementById('cart-panel');
            panel.querySelector('#cart-inner').classList.remove('is-open');
            setTimeout(() => {
                panel.classList.add('hidden');
                panel.classList.remove('flex');
            }, 400);
        }

        document.getElementById('cart-close')?.addEventListener('click', closeCart);
        document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);

        // Cart item quantity/remove (delegated)
        document.getElementById('cart-items')?.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            const name = target.dataset.name;
            if (!name) return;

            if (target.classList.contains('cart-qty-plus')) {
                updateQuantity(name, 1);
            } else if (target.classList.contains('cart-qty-minus')) {
                updateQuantity(name, -1);
            } else if (target.classList.contains('cart-remove')) {
                removeFromCart(name);
            }
        });

        // WhatsApp checkout
        document.getElementById('cart-whatsapp')?.addEventListener('click', () => {
            if (cart.length === 0) return;
            
            const phone = '1234567890';
            let message = '¡Hola! Quiero hacer un pedido:\n\n';
            
            cart.forEach(item => {
                message += `• ${item.name} x ${item.quantity}\n`;
            });
            
            const totalItems = getCartCount();
            const totalPrice = getCartTotal();
            message += `\nTotal: ${totalItems} productos — $${totalPrice.toLocaleString('es-AR')}`;
            
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });

        // 10. Nosotros Carousel Autoplay
        const carouselSlides = document.querySelectorAll('#nosotros-carousel .carousel-slide');
        const carouselDots = document.querySelectorAll('#nosotros-carousel .carousel-dot');
        let activeSlideIndex = 0;
        
        function rotateCarousel() {
            if (carouselSlides.length === 0) return;
            
            // Hide current slide
            carouselSlides[activeSlideIndex].classList.remove('opacity-100');
            carouselSlides[activeSlideIndex].classList.add('opacity-0');
            if (carouselDots.length > 0) {
                carouselDots[activeSlideIndex].classList.remove('opacity-100');
                carouselDots[activeSlideIndex].classList.add('opacity-40');
            }
            
            // Move to next slide
            activeSlideIndex = (activeSlideIndex + 1) % carouselSlides.length;
            
            // Show next slide
            carouselSlides[activeSlideIndex].classList.remove('opacity-0');
            carouselSlides[activeSlideIndex].classList.add('opacity-100');
            if (carouselDots.length > 0) {
                carouselDots[activeSlideIndex].classList.remove('opacity-40');
                carouselDots[activeSlideIndex].classList.add('opacity-100');
            }
        }
        
        setInterval(rotateCarousel, 4000);

        // 11. Team Slider Logic
        const teamTrack = document.getElementById('team-track');
        const prevTeamBtn = document.getElementById('prev-team');
        const nextTeamBtn = document.getElementById('next-team');
        let currentTeamSlide = 0;

        if (teamTrack && prevTeamBtn && nextTeamBtn) {
            const updateTeamSlider = () => {
                const firstChild = teamTrack.children[0];
                const itemWidth = firstChild.offsetWidth;
                const gap = parseFloat(window.getComputedStyle(teamTrack).gap) || 0;
                const moveDist = itemWidth + gap;
                teamTrack.style.transform = `translateX(-${currentTeamSlide * moveDist}px)`;
            };

            const getVisibleItems = () => {
                if(window.innerWidth >= 1024) return 3;
                if(window.innerWidth >= 640) return 2;
                return 1;
            };

            prevTeamBtn.addEventListener('click', () => {
                currentTeamSlide = Math.max(currentTeamSlide - 1, 0);
                updateTeamSlider();
            });

            nextTeamBtn.addEventListener('click', () => {
                const maxIndex = teamTrack.children.length - getVisibleItems();
                currentTeamSlide = Math.min(currentTeamSlide + 1, maxIndex);
                updateTeamSlider();
            });

            window.addEventListener('resize', () => {
                const maxIndex = teamTrack.children.length - getVisibleItems();
                if (currentTeamSlide > maxIndex) currentTeamSlide = Math.max(0, maxIndex);
                updateTeamSlider();
            });
        }

        // Hero Video Sequencer (fired after preloader dismisses)
        function startHeroVideos() {
            const vid1 = document.getElementById('hero-vid-1');
            const vid2 = document.getElementById('hero-vid-2');
            if (!vid1 || !vid2) return;

            vid1.play().catch(() => {});

            vid1.addEventListener('ended', () => {
                vid2.play().catch(() => {});
                vid2.classList.remove('opacity-0');
                vid2.classList.add('opacity-40');
                vid1.classList.remove('opacity-40');
                vid1.classList.add('opacity-0');
            });
        }

        // Cinematic Preloader Logic
        // Uses DOMContentLoaded timing — does NOT wait for videos/images to load.
        // A hard 4s max cap ensures it never stays stuck on slow connections.
        function dismissPreloader() {
            const preloader = document.getElementById('preloader');
            const loaderBrand = document.getElementById('loader-brand');
            const loaderBar = document.getElementById('loader-progress-bar');
            const loaderText = document.getElementById('loader-text');
            const body = document.getElementById('body');
            if (!preloader || preloader.dataset.dismissed) return;
            preloader.dataset.dismissed = '1';

            // Step 1 — reveal brand + progress bar
            loaderBrand.classList.remove('translate-y-full');
            loaderBar.style.width = '100%';
            loaderText.classList.remove('opacity-0');

            // Step 2 — after 2.2s: slide brand out
            setTimeout(() => {
                loaderBrand.classList.add('-translate-y-full');
                loaderBar.classList.add('opacity-0');
                loaderText.classList.add('opacity-0');

                // Step 3 — 0.6s later: sweep preloader up
                setTimeout(() => {
                    preloader.style.transform = 'translateY(-100%)';

                    // Step 4 — unlock scroll + fire videos
                    setTimeout(() => {
                        body.classList.remove('overflow-hidden');
                        startHeroVideos();
                        setTimeout(() => { preloader.style.display = 'none'; }, 1500);
                    }, 800);
                }, 600);
            }, 2200);
        }

        // Trigger as soon as DOM is ready (no video/image wait)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', dismissPreloader);
        } else {
            // DOM already parsed (script deferred / async)
            dismissPreloader();
        }

        // Hard cap: if something goes wrong, force dismiss after 4s
        setTimeout(dismissPreloader, 4000);

