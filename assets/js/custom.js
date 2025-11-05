document.addEventListener('DOMContentLoaded', () => {
    // Configuration constants
    const SCROLL_MULTIPLIER = 0.5;
    const EDGE_THRESHOLD = 20;

    /* measure margins and set css variables */
    const full = document.getElementById('ti-measure-full');
    const content = document.getElementById('ti-measure-content');
    const body = document.body;
    
    const measure = function() {
        const fullRect = full.getBoundingClientRect();
        const contentRect = content.getBoundingClientRect();
        const bodyRect = body.getBoundingClientRect();
        
        document.documentElement.style.setProperty(
            '--ti-margin-measure-left', `${contentRect.x}px`);
        document.documentElement.style.setProperty(
            '--ti-margin-measure-right', `${bodyRect.width - contentRect.width - contentRect.x}px`);
        document.documentElement.style.setProperty(
            '--ti-content-width', `${contentRect.width}px`);
    };
    
    measure();
    window.addEventListener('resize', measure);

    function isElCompletelyInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (rect.top >= 0 && rect.bottom <= window.innerHeight);
    }

    /* Handle scrolling for each card holder */
    const cardHolders = document.querySelectorAll('.ti-card-holder');

    cardHolders.forEach((cardHolder) => {
        const wrapper = cardHolder.closest('.ti-card-holder-wrapper');
        const leftArrow = wrapper?.querySelector('.ti-nav-left');
        const rightArrow = wrapper?.querySelector('.ti-nav-right');

        // Count cards to determine if navigation is needed
        const cardCount = cardHolder.querySelectorAll('.ti-card').length;
        const needsNavigation = cardCount > 3;

        // Function to update arrow visibility and opacity
        const updateArrows = () => {
            if (!needsNavigation || !leftArrow || !rightArrow) return;

            const maxScroll = cardHolder.scrollWidth - cardHolder.clientWidth;
            const currentScroll = cardHolder.scrollLeft;

            // Show arrows only if there's scrollable content
            if (maxScroll > 0) {
                leftArrow.style.display = 'block';
                rightArrow.style.display = 'block';

                // Left arrow: 50% opacity at start, 100% when scrolled
                const leftOpacity = currentScroll <= 10 ? 0.5 : 1;
                leftArrow.style.opacity = leftOpacity;

                // Right arrow: 100% opacity at start, 50% at end
                const rightOpacity = currentScroll >= maxScroll - 10 ? 0.5 : 1;
                rightArrow.style.opacity = rightOpacity;
            } else {
                leftArrow.style.display = 'none';
                rightArrow.style.display = 'none';
            }
        };

        // Initial arrow update
        updateArrows();

        // Update arrows on scroll
        cardHolder.addEventListener('scroll', updateArrows);

        // Update arrows on window resize
        window.addEventListener('resize', updateArrows);

        // Handle arrow clicks with quick smooth scrolling
        const quickScroll = (direction) => {
            const cardWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ti-card-width') || '348px');
            const gap = 24;
            const scrollAmount = cardWidth + gap; // Scroll by one card width

            // Use requestAnimationFrame for quick but smooth scrolling
            const start = cardHolder.scrollLeft;
            const target = start + (direction * scrollAmount);
            const duration = 300; // 300ms for quick scroll
            const startTime = performance.now();

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic for smooth deceleration
                const easeOut = 1 - Math.pow(1 - progress, 3);

                cardHolder.scrollLeft = start + (target - start) * easeOut;

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        };

        if (leftArrow) {
            leftArrow.addEventListener('click', (e) => {
                e.preventDefault();
                quickScroll(-1);
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', (e) => {
                e.preventDefault();
                quickScroll(1);
            });
        }

        // Disable smooth scrolling behavior for drag/wheel
        cardHolder.style.scrollBehavior = 'auto';
        
        let isPointerDown = false;
        let activePointerId = null;
        let grabX = 0;
        let initialScroll = 0;

        cardHolder.addEventListener('pointerdown', (e) => {
            isPointerDown = true;
            activePointerId = e.pointerId;
            grabX = e.clientX;
            initialScroll = cardHolder.scrollLeft;
            
            if (e.pointerType === 'mouse') {
                cardHolder.style.cursor = 'grabbing';
            }
            
            e.preventDefault();
        });

        cardHolder.addEventListener('pointermove', (e) => {
            if (!isPointerDown || e.pointerId !== activePointerId) return;
            
            const moveX = e.clientX - grabX;
            
            // Use transform for immediate visual feedback
            requestAnimationFrame(() => {
                cardHolder.scrollLeft = initialScroll - moveX;
            });
            
            e.preventDefault();
            e.stopPropagation();
        });

        const endPointerDrag = (e) => {
            if (e.pointerId === activePointerId) {
                if (e.pointerType === 'mouse') {
                    cardHolder.style.cursor = 'grab';
                }
                isPointerDown = false;
                activePointerId = null;
            }
        };

        cardHolder.addEventListener('pointerup', endPointerDrag);
        cardHolder.addEventListener('pointercancel', endPointerDrag);


        cardHolder.style.cursor = 'grab';

        cardHolder.addEventListener('wheel', (e) => {
            // console.log(e);
            if (( Math.abs(e.deltaY) != 120 && 'wheelDelta' in e && Number.isInteger(e.deltaY)) // chrome
                && ( Math.abs(e.deltaY) < 90 || Object.is(-0, e.deltaX) || e.deltaX != 0)) {
                return;
            }
            
            if (!isElCompletelyInViewport(cardHolder)) {
                return;
            }

            const maxScroll = cardHolder.scrollWidth - cardHolder.clientWidth;
            const currentScroll = cardHolder.scrollLeft;
            
            if (maxScroll <= 0) {
                return;
            }

            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                const scrollingDown = e.deltaY > 0;
                const scrollingUp = e.deltaY < 0;
                
                if (scrollingDown && currentScroll < maxScroll - EDGE_THRESHOLD) {
                    e.preventDefault();
                    cardHolder.scrollLeft = Math.min(maxScroll, currentScroll + (e.deltaY * SCROLL_MULTIPLIER));
                    return;
                }
                
                if (scrollingUp && currentScroll > EDGE_THRESHOLD) {
                    e.preventDefault();
                    cardHolder.scrollLeft = Math.max(0, currentScroll + (e.deltaY * SCROLL_MULTIPLIER));
                    return;
                }
                
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            const scrollAmount = (e.deltaX !== 0 ? e.deltaX : e.deltaY) * SCROLL_MULTIPLIER;
            cardHolder.scrollLeft = Math.max(0, Math.min(maxScroll, currentScroll + scrollAmount));
        }, { passive: false });
    });
});
// Configuration
const MODAL_PREFIXES = ['modal-', 'popup-'];
let isProgrammaticModalOperation = false;
let isModalTransition = false;

function isModalId(id) {
    return MODAL_PREFIXES.some(prefix => id.startsWith(prefix));
}

function removeHash() {
    if (window.location.hash) {
        // When actively closing, push a new state without hash
        if (!isModalTransition) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        } else {
            // During modal transitions, just replace state
            history.replaceState('', document.title, window.location.pathname + window.location.search);
        }
    }
}

function handleModalHash() {
    const hash = window.location.hash.substring(1);
    if (hash && isModalId(hash)) {
        const modal = UIkit.modal(`#${hash}`);
        if (modal) {
            modal.show();
        }
    }
}

function setupModalHandlers(element) {
    const modalId = element.id;
    
    // Update URL when modal shows
    UIkit.util.on(element, 'beforeshow', () => {
        if (!isProgrammaticModalOperation && modalId && window.location.hash !== `#${modalId}`) {
            isModalTransition = true;
            history.pushState(modalId, document.title, `#${modalId}`);

            // Track modal open in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'modal_open', {
                    'modal_id': modalId,
                    'page_location': window.location.href,
                    'page_title': document.title
                });
            }
        }
    });

    // Handle modal hiding
    UIkit.util.on(element, 'hide', () => {
        if (!isProgrammaticModalOperation && window.location.hash === `#${modalId}`) {
            // Check if this is a transition to another modal
            const otherModalOpening = document.querySelector('.uk-modal:not(.uk-modal-hiding)');
            isModalTransition = !!otherModalOpening;

            // Track modal close in Google Analytics (only if not transitioning to another modal)
            if (!isModalTransition && typeof gtag !== 'undefined') {
                gtag('event', 'modal_close', {
                    'modal_id': modalId,
                    'page_location': window.location.pathname
                });
            }

            removeHash();
        }
    });

    // Reset transition flag after show
    UIkit.util.on(element, 'shown', () => {
        isModalTransition = false;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Setup handlers for existing modals
    document.querySelectorAll(MODAL_PREFIXES.map(p => `[id^="${p}"]`).join(',')).forEach(setupModalHandlers);

    // Watch for new modals
    new MutationObserver(mutations =>
        mutations.forEach(mutation =>
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.id && isModalId(node.id)) {
                    setupModalHandlers(node);
                }
            })
        )
    ).observe(document.body, { childList: true, subtree: true });

    // Handle initial hash
    handleModalHash();
});

// Handle browser navigation
window.addEventListener('popstate', () => {
    isProgrammaticModalOperation = true;
    document.querySelectorAll('.uk-modal.uk-open').forEach(el => 
        UIkit.modal(el)?.hide()
    );
    handleModalHash();
    isProgrammaticModalOperation = false;
});