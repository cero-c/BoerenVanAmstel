// =====================================
// WEIDEVOGELGEBIED
// =====================================

// Pagina 1 -> Pagina 2
const naarBoerBijdragen = document.getElementById("naarBoerBijdragen");

if (naarBoerBijdragen) {
    naarBoerBijdragen.addEventListener("click", () => {
        window.location.href = "weidevogelgebied2.html";
    });
}

// Pagina 2 -> Pagina 1
const terugNaarWeidevogel1 = document.getElementById("terugNaarWeidevogel1");

if (terugNaarWeidevogel1) {
    terugNaarWeidevogel1.addEventListener("click", () => {
        window.location.href = "weidevogelgebied1.html";
    });
}

// Pagina 2 -> Volgende pagina (bijvoorbeeld donatie/verkooppunten)
const naarBijdragen = document.getElementById("naarBijdragen");

if (naarBijdragen) {
    naarBijdragen.addEventListener("click", () => {
        window.location.href = "bijdragen.html"; // Pas deze naam aan
    });
}


// =====================================
// BOEREN
// =====================================

// Boer pagina 1 -> Boer pagina 2
const naarMelkPagina = document.getElementById("naarMelkPagina");

if (naarMelkPagina) {
    naarMelkPagina.addEventListener("click", () => {
        window.location.href = "bgrutto2.html";
    });
}

// Boer pagina 2 -> Boer pagina 1
const terugNaarBoer1 = document.getElementById("terugNaarBoer1");

if (terugNaarBoer1) {
    terugNaarBoer1.addEventListener("click", () => {
        window.location.href = "bgrutto1.html";
    });
}

// Boer pagina 2 -> Verkooppunten
const naarVerkooppunten = document.getElementById("naarVerkooppunten");

if (naarVerkooppunten) {
    naarVerkooppunten.addEventListener("click", () => {
        window.location.href = "verkooppunten.html"; // Pas deze naam aan
    });
}