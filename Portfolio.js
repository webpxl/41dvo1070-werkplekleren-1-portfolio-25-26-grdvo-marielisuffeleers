// Definieer de volgorde van je pagina's
const pages = [
    'portfolio_begin_pagina.html',  // 1. Begin pagina
    'html_about_me.html',           // 2. About me pagina
    'motivation_letter.html',       // 3. Motivatie brief
    'my_design.html',               // 4. My designs
    'pagina_met_design.html',       // 5. Pagina met designs (foto's)
    'index.html',                   // 6. Tools/vaardigheden (of stage/werk ervaring?)
    'einden.html'                   // 7. Einde pagina
];

// Haal de huidige pagina op
const currentPage = window.location.pathname.split('/').pop() || 'portfolio_begin_pagina.html';

// Zoek de index van de huidige pagina
const currentIndex = pages.indexOf(currentPage);

// Functie om naar de volgende pagina te gaan
function goToNextPage() {
    if (currentIndex < pages.length - 1) {
        window.location.href = pages[currentIndex + 1];
    } else {
        // Als je op de laatste pagina bent, ga terug naar de eerste
        window.location.href = pages[0];
    }
}

// Functie om naar de vorige pagina te gaan
function goToPreviousPage() {
    if (currentIndex > 0) {
        window.location.href = pages[currentIndex - 1];
    } else {
        // Als je op de eerste pagina bent, ga naar de laatste
        window.location.href = pages[pages.length - 1];
    }
}

// Event listener voor klikken op het scherm
document.addEventListener('click', function(event) {
    const screenWidth = window.innerWidth;
    const clickX = event.clientX;

    // Bepaal een zone van 25% aan elke kant
    const leftZone = screenWidth * 0.25;
    const rightZone = screenWidth * 0.75;

    // Als je links klikt (eerste 25% van het scherm)
    if (clickX < leftZone) {
        goToPreviousPage();
    }
    // Als je rechts klikt (laatste 25% van het scherm)
    else if (clickX > rightZone) {
        goToNextPage();
    }
});

// Visuele feedback toevoegen (optioneel)
document.addEventListener('DOMContentLoaded', function() {
    // Cursor veranderen aan de zijkanten
    document.addEventListener('mousemove', function(event) {
        const screenWidth = window.innerWidth;
        const mouseX = event.clientX;

        const leftZone = screenWidth * 0.25;
        const rightZone = screenWidth * 0.75;

        if (mouseX < leftZone) {
            document.body.style.cursor = 'w-resize'; // Linker pijl
        } else if (mouseX > rightZone) {
            document.body.style.cursor = 'e-resize'; // Rechter pijl
        } else {
            document.body.style.cursor = 'default';
        }
    });
});