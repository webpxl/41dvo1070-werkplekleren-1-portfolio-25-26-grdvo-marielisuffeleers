
const pages = [
    'portfolio_begin_pagina.html',  // 1. Begin pagina
    'html_about_me.html',           // 2. About me
    'motivation_letter.html',       // 3. Motivatie letter
    'my_design.html',               // 4. Mijn designs
    'pagina_met_design.html',       // 5. Pagina met mijn designs
    'tools.html',                   // 6. Tools
    'werk_ervaring.html',           // 7. Experience
    'einden.html'                   // 8. Einde
];


const currentPage = window.location.pathname.split('/').pop() || pages[0];


const currentIndex = pages.indexOf(currentPage);


function goToNextPage() {
    if (currentIndex >= 0 && currentIndex < pages.length - 1) {
        window.location.href = pages[currentIndex + 1];
    } else if (currentIndex === pages.length - 1) {
        window.location.href = pages[0];
    }
}


function goToPreviousPage() {
    if (currentIndex > 0) {
        window.location.href = pages[currentIndex - 1];
    } else if (currentIndex === 0) {
        // Als je op de eerste pagina bent, ga naar de laatste
        window.location.href = pages[pages.length - 1];
    }
}

// Detecteer apparaat type
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isTablet() {
    return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth <= 1024;
}


let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance in pixels
    const horizontalSwipe = Math.abs(touchEndX - touchStartX);
    const verticalSwipe = Math.abs(touchEndY - touchStartY);


    if (horizontalSwipe > verticalSwipe && horizontalSwipe > swipeThreshold) {
        if (touchEndX < touchStartX) {
            goToNextPage();
        }
        if (touchEndX > touchStartX) {
            goToPreviousPage();
        }
    }
}


document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipe();
}, false);


document.addEventListener('click', function(event) {
    if (isMobile() || isTablet()) {
        return;
    }

    if (event.target.tagName === 'A' || event.target.tagName === 'BUTTON' ||
        event.target.closest('a') || event.target.closest('button')) {
        return;
    }

    const screenWidth = window.innerWidth;
    const clickX = event.clientX;
    const leftZone = screenWidth * 0.30;
    const rightZone = screenWidth * 0.70;


    if (clickX < leftZone) {
        goToPreviousPage();
    }

    else if (clickX > rightZone) {
        goToNextPage();
    }
});


document.addEventListener('keydown', function(event) {
    // Skip keyboard navigatie op mobiel/tablet
    if (isMobile() || isTablet()) {
        return;
    }


    if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goToNextPage();
    }

    else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPreviousPage();
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Alleen cursor feedback op desktop
    if (!isMobile() && !isTablet()) {
        document.addEventListener('mousemove', function(event) {
            const screenWidth = window.innerWidth;
            const mouseX = event.clientX;

            const leftZone = screenWidth * 0.30;
            const rightZone = screenWidth * 0.70;

            if (mouseX < leftZone) {
                document.body.style.cursor = 'w-resize'; // Linker pijl
            } else if (mouseX > rightZone) {
                document.body.style.cursor = 'e-resize'; // Rechter pijl
            } else {
                document.body.style.cursor = 'default';
            }
        });
    }


    if (isMobile() || isTablet()) {
        addSwipeIndicator();
    }
});


function addSwipeIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'swipe-indicator';
    indicator.innerHTML = '← Swipe →';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 16px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        pointer-events: none;
        opacity: 0.8;
    `;

    document.body.appendChild(indicator);


    setTimeout(() => {
        indicator.style.transition = 'opacity 0.5s';
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 500);
    }, 3000);
}


let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);


window.addEventListener('resize', function() {
    // Update cursor gedrag als apparaat type verandert (bijv. tablet roteren)
    if (isMobile() || isTablet()) {
        document.body.style.cursor = 'default';
    }
});