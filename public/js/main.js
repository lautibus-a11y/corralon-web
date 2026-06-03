// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

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

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 2. Custom Cursor Logic (GSAP Smooth Follow & Micro-interactions)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverTriggers = document.querySelectorAll('.hover-trigger, .material-card, .accordion-header, .modal-close');
const darkSections = document.querySelectorAll('.dark-section');

if (cursorDot && cursorOutline) {
    // Set initial centered positions
    gsap.set([cursorDot, cursorOutline], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Quick, highly responsive dot
        gsap.to(cursorDot, { duration: 0.1, x: posX, y: posY, overwrite: 'auto' });
        // Eased, trailing outline
        gsap.to(cursorOutline, { duration: 0.35, x: posX, y: posY, ease: 'power2.out', overwrite: 'auto' });

        // Dark section cursor inversion detect
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
}

// Global Hover Interactions for Cursor and Magnetic Buttons
document.querySelectorAll('.hover-trigger, .material-card, .accordion-header, .modal-close').forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        gsap.to(cursorOutline, { scale: 1.5, backgroundColor: 'rgba(255, 69, 0, 0.12)', borderColor: '#FF4500', duration: 0.3 });
    });
    trigger.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        gsap.to(cursorOutline, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(17, 17, 17, 0.5)', duration: 0.3 });
    });
});

// Magnetic & Scale micro-interactions on links/buttons
document.querySelectorAll('.hover-trigger').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.04, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mousedown', () => {
        gsap.to(btn, { scale: 0.96, duration: 0.1 });
    });
    btn.addEventListener('mouseup', () => {
        gsap.to(btn, { scale: 1.04, duration: 0.2 });
    });
});

// 3. Navbar Reveal & Glass effect on Scroll
const navbar = document.getElementById('navbar');
if (navbar) {
    ScrollTrigger.create({
        start: 'top -50',
        onEnter: () => {
            gsap.to(navbar, { y: -8, duration: 0.4, ease: 'power2.out' });
            gsap.to(navbar.querySelector('div>div'), {
                borderColor: 'rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(17, 17, 17, 0.85)',
                backdropFilter: 'blur(16px)',
                duration: 0.4
            });
        },
        onLeaveBack: () => {
            gsap.to(navbar, { y: 0, duration: 0.4, ease: 'power2.out' });
            gsap.to(navbar.querySelector('div>div'), {
                borderColor: 'rgba(255, 255, 255, 0.05)',
                backgroundColor: 'rgba(17, 17, 17, 0.4)',
                backdropFilter: 'blur(16px)',
                duration: 0.4
            });
        }
    });
}

// 4. Parallax Scroll Animations using GSAP ScrollTrigger
if (document.querySelector('#hero video')) {
    gsap.to('#hero video', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Parallax Nosotros images
const nosotrosCarousel = document.getElementById('nosotros-carousel');
if (nosotrosCarousel) {
    gsap.fromTo(nosotrosCarousel,
        { y: 50 },
        {
            y: -50,
            scrollTrigger: {
                trigger: nosotrosCarousel,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        }
    );
}

// 5. Scroll Reveals using GSAP (staggered and smooth)
gsap.utils.toArray('.reveal-text').forEach(el => {
    gsap.fromTo(el, 
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40, opacity: 0 },
        { 
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', 
            y: 0, 
            opacity: 1,
            duration: 1.2, 
            ease: 'power4.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        }
    );
});

gsap.utils.toArray('.fade-up').forEach(el => {
    // Avoid double animation for buttons/containers already handled individually
    gsap.fromTo(el, 
        { y: 30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        }
    );
});

gsap.utils.toArray('.slide-down').forEach(el => {
    gsap.fromTo(el, 
        { y: -30, opacity: 0 },
        { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Bento Material Cards entry stagger
const materialCardsContainer = document.querySelector('.grid-cols-1.md\\:grid-cols-3');
if (materialCardsContainer) {
    gsap.from('.material-card', {
        scale: 0.95,
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: materialCardsContainer,
            start: 'top 85%'
        }
    });
}

// 6. Stats Animated Counters (GSAP tweening numbers)
const statsContainer = document.getElementById('stats-container');
const counters = document.querySelectorAll('.counter-value');

if (statsContainer && counters.length > 0) {
    counters.forEach(counter => {
        const targetVal = parseFloat(counter.getAttribute('data-target'));
        const valueObj = { val: 0 };
        
        gsap.to(valueObj, {
            val: targetVal,
            duration: 2.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: statsContainer,
                start: 'top 85%'
            },
            onUpdate: () => {
                if (Number.isInteger(targetVal)) {
                    counter.innerText = Math.floor(valueObj.val);
                } else {
                    counter.innerText = valueObj.val.toFixed(1);
                }
            }
        });
    });
}

// 7. Interactive Calculator Logic
const sliderM2 = document.getElementById('slider-m2');
const sliderPisos = document.getElementById('slider-pisos');
const valM2 = document.getElementById('val-m2');
const valPisos = document.getElementById('val-pisos');
const outCemento = document.getElementById('out-cemento');
const outLadrillo = document.getElementById('out-ladrillo');
const outHierro = document.getElementById('out-hierro');

function updateCalculator() {
    if (!sliderM2 || !sliderPisos) return;
    const m2 = parseInt(sliderM2.value);
    const pisos = parseInt(sliderPisos.value);

    valM2.innerText = m2;
    valPisos.innerText = pisos;

    const calcCemento = Math.floor(m2 * 1.5 * pisos); 
    const calcLadrillo = ((m2 * 0.05) * pisos).toFixed(1);
    const calcHierro = Math.floor(m2 * 0.8 * pisos);

    // Smoothly animate values in response to slider movement
    animateValue(outCemento, calcCemento);
    animateValue(outLadrillo, parseFloat(calcLadrillo), true);
    animateValue(outHierro, calcHierro);
}

if (sliderM2 && sliderPisos) {
    sliderM2.addEventListener('input', updateCalculator);
    sliderPisos.addEventListener('input', updateCalculator);
}

function animateValue(obj, target, isFloat = false) {
    if (!obj) return;
    const currentVal = parseFloat(obj.innerText) || 0;
    const valHolder = { val: currentVal };
    gsap.to(valHolder, {
        val: target,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
            obj.innerHTML = isFloat ? valHolder.val.toFixed(1) : Math.floor(valHolder.val);
        }
    });
}
setTimeout(updateCalculator, 500);

// 8. Modal Logic for Materials (Enhanced with Elastic GSAP animations)
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
        
        // GSAP Modal Open Animation
        gsap.killTweensOf('#modal-inner');
        gsap.killTweensOf(materialModal);
        
        gsap.set(materialModal, { backgroundColor: 'rgba(17, 17, 17, 0)' });
        gsap.set('#modal-inner', { scale: 0.8, opacity: 0, y: 80 });

        gsap.to(materialModal, { backgroundColor: 'rgba(17, 17, 17, 0.65)', duration: 0.4 });
        gsap.to('#modal-inner', { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.2)' });
    });
});

// Close modal logic with GSAP
function closeModal() {
    if (!materialModal || materialModal.classList.contains('hidden')) return;
    
    gsap.killTweensOf('#modal-inner');
    gsap.killTweensOf(materialModal);

    gsap.to(materialModal, { backgroundColor: 'rgba(17, 17, 17, 0)', duration: 0.3 });
    gsap.to('#modal-inner', { 
        scale: 0.85, 
        opacity: 0, 
        y: 40, 
        duration: 0.35, 
        ease: 'power2.in',
        onComplete: () => {
            materialModal.classList.add('hidden');
            materialModal.classList.remove('flex');
        }
    });
}

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// 9. Accordion Logic for Services (Smooth height expansion with GSAP)
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    
    header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close all others
        accordionItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                const otherIcon = otherItem.querySelector('.accordion-icon');
                
                gsap.killTweensOf(otherContent);
                gsap.killTweensOf(otherIcon);
                gsap.to(otherContent, { height: 0, duration: 0.4, ease: 'power2.inOut' });
                gsap.to(otherIcon, { rotation: 0, duration: 0.3, ease: 'power2.out' });
            }
        });

        // Toggle current item
        gsap.killTweensOf(content);
        gsap.killTweensOf(icon);

        if (!isOpen) {
            item.classList.add('active');
            gsap.to(content, { height: 'auto', duration: 0.5, ease: 'power2.out' });
            gsap.to(icon, { rotation: 180, duration: 0.4, ease: 'power2.out' });
        } else {
            item.classList.remove('active');
            gsap.to(content, { height: 0, duration: 0.4, ease: 'power2.inOut' });
            gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.out' });
        }
    });
});

// 10. Testimonial Slider Logic (Eased fade transitions)
const track = document.getElementById('testimonial-track');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');
let currentSlide = 0;

if (track && prevBtn && nextBtn) {
    const slides = track.children.length;
    
    function updateSlider() {
        gsap.to(track, {
            xPercent: -currentSlide * 100,
            duration: 0.65,
            ease: 'power3.out'
        });
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
    }, 7000);
}

// 11. Cart Logic
let cart = [];

function addToCart(item) {
    const existing = cart.find(i => i.name === item.name);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        cart.push({ ...item });
    }
    updateCartUI();
    
    // Scale bump micro-interaction on the cart floating badge
    const badge = document.getElementById('cart-badge');
    if (badge) {
        gsap.fromTo(badge, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' });
    }
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
        if (fab.classList.contains('hidden')) {
            fab.classList.remove('hidden');
            gsap.fromTo(fab, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
        }
        badge.textContent = count > 99 ? '99+' : count;
    } else {
        gsap.to(fab, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => fab.classList.add('hidden') });
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

        // Action feedback micro-scale
        gsap.fromTo(target, { scale: 0.9 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
        target.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> ✓';
        setTimeout(() => {
            target.innerHTML = '<i data-lucide="shopping-cart" class="w-4 h-4"></i> Agregar';
            lucide.createIcons();
        }, 1000);
    }
});

// Cart panel toggles using GSAP side-drawer slide transitions
const cartPanel = document.getElementById('cart-panel');
document.getElementById('cart-toggle')?.addEventListener('click', () => {
    if (!cartPanel) return;
    cartPanel.classList.remove('hidden');
    cartPanel.classList.add('flex');
    
    gsap.killTweensOf('#cart-inner');
    gsap.killTweensOf(cartPanel.querySelector('#cart-backdrop'));
    
    gsap.set(cartPanel.querySelector('#cart-backdrop'), { opacity: 0 });
    gsap.set('#cart-inner', { yPercent: 100 });
    
    gsap.to(cartPanel.querySelector('#cart-backdrop'), { opacity: 1, duration: 0.35 });
    gsap.to('#cart-inner', { yPercent: 0, duration: 0.5, ease: 'power3.out' });
});

function closeCart() {
    if (!cartPanel || cartPanel.classList.contains('hidden')) return;
    
    gsap.killTweensOf('#cart-inner');
    gsap.killTweensOf(cartPanel.querySelector('#cart-backdrop'));

    gsap.to(cartPanel.querySelector('#cart-backdrop'), { opacity: 0, duration: 0.35 });
    gsap.to('#cart-inner', { 
        yPercent: 100, 
        duration: 0.45, 
        ease: 'power3.inOut',
        onComplete: () => {
            cartPanel.classList.add('hidden');
            cartPanel.classList.remove('flex');
        }
    });
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
        // Fade out deleted row animation
        const row = target.closest('.flex.items-center.justify-between');
        if (row) {
            gsap.to(row, { 
                opacity: 0, 
                x: 50, 
                duration: 0.3, 
                onComplete: () => removeFromCart(name) 
            });
        } else {
            removeFromCart(name);
        }
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

// 12. Nosotros Carousel Autoplay (Smooth cross-fade)
const carouselSlides = document.querySelectorAll('#nosotros-carousel .carousel-slide');
const carouselDots = document.querySelectorAll('#nosotros-carousel .carousel-dot');
let activeSlideIndex = 0;

function rotateCarousel() {
    if (carouselSlides.length === 0) return;
    
    const currentSlide = carouselSlides[activeSlideIndex];
    const currentDot = carouselDots[activeSlideIndex];
    
    activeSlideIndex = (activeSlideIndex + 1) % carouselSlides.length;
    
    const nextSlide = carouselSlides[activeSlideIndex];
    const nextDot = carouselDots[activeSlideIndex];
    
    // Cross-fade slides
    gsap.to(currentSlide, { opacity: 0, duration: 1.2, ease: 'power2.inOut' });
    gsap.to(nextSlide, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });
    
    // Animate indicator dots
    if (currentDot) gsap.to(currentDot, { opacity: 0.4, scale: 1, duration: 0.4 });
    if (nextDot) gsap.to(nextDot, { opacity: 1, scale: 1.3, duration: 0.4 });
}
if (carouselSlides.length > 0) {
    // Initial dot status
    gsap.set(carouselDots[0], { scale: 1.3 });
    setInterval(rotateCarousel, 5000);
}

// 13. Team Slider Logic (Smooth slide transitions using GSAP)
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
        
        gsap.to(teamTrack, {
            x: -currentTeamSlide * moveDist,
            duration: 0.6,
            ease: 'power3.out'
        });
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

// Hero Video Sequencer
function startHeroVideos() {
    const vid1 = document.getElementById('hero-vid-1');
    const vid2 = document.getElementById('hero-vid-2');
    if (!vid1 || !vid2) return;

    vid1.play().catch(() => {});

    vid1.addEventListener('ended', () => {
        vid2.play().catch(() => {});
        gsap.to(vid2, { opacity: 0.4, duration: 1 });
        gsap.to(vid1, { opacity: 0, duration: 1 });
    });
}

// Cinematic Preloader Logic (enhanced with GSAP animations)
function dismissPreloader() {
    const preloader = document.getElementById('preloader');
    const loaderBrand = document.getElementById('loader-brand');
    const loaderBar = document.getElementById('loader-progress-bar');
    const loaderText = document.getElementById('loader-text');
    const body = document.getElementById('body');
    
    if (!preloader || preloader.dataset.dismissed) return;
    preloader.dataset.dismissed = '1';

    const tl = gsap.timeline({
        onComplete: () => {
            body.classList.remove('overflow-hidden');
            startHeroVideos();
            gsap.set(preloader, { display: 'none' });
        }
    });

    // Step 1: Slide brand and progress bar up
    tl.to(loaderBrand, { yPercent: -100, duration: 1.2, ease: 'power4.out', delay: 0.2 });
    tl.to(loaderBar, { width: '100%', duration: 2.2, ease: 'power2.out' }, '-=1.2');
    tl.to(loaderText, { opacity: 1, duration: 0.8 }, '-=2.0');

    // Step 2: Fade out loading text/bars
    tl.to([loaderBar, loaderText], { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.2');

    // Step 3: Sweep preloader up
    tl.to(preloader, { yPercent: -100, duration: 1.2, ease: 'power4.inOut' }, '-=0.1');
}

// Trigger as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dismissPreloader);
} else {
    dismissPreloader();
}

// Hard cap: force preloader dismissal after 4.5s max
setTimeout(dismissPreloader, 4500);
