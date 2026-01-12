
const pages = [
    'index.html',  // 1. Begin pagina
    'html_about_me.html',           // 2. About me pagina
    'motivation_letter.html',       // 3. Motivatie brief
    'my_design.html',               // 4. My designs
    'pagina_met_design.html',       // 5. Pagina met designs
    'tools en vaardig heden ',      // 6. Tools/vaardigheden
    'einden.html'                   // 7. Einde pagina
];


const currentPage = window.location.pathname.split('/').pop() || 'index.html';


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


document.addEventListener('click', function(event) {
    const screenWidth = window.innerWidth;
    const clickX = event.clientX;

    const leftZone = screenWidth * 0.25;
    const rightZone = screenWidth * 0.75;


    if (clickX < leftZone) {
        goToPreviousPage();
    }

    else if (clickX > rightZone) {
        goToNextPage();
    }
});


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