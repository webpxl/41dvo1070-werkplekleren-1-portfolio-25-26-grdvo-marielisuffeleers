
const pages = [
    'portfolio_begin_pagina.html',  // 1. Begin pagina
    'html_about_me.html',           // 2. About me pagina
    'motivation_letter.html',       // 3. Motivatie brief
    'my_design.html',               // 4. My designs
    'pagina_met_design.html',       // 5. Pagina met designs
    'index.html',                   // 6. Tools/vaardigheden
    'einden.html'                   // 7. Einde pagina
];


const currentPage = window.location.pathname.split('/').pop() || 'portfolio_begin_pagina.html';


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
