const canvas = document.querySelector("#mapCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
    const mapImage = new Image();
    mapImage.src = "images/Grutto-kaart.png";

    const markerImages = {
        boerderij: new Image(),
        vogel: new Image()
    };

    markerImages.boerderij.src = "images/boerderij.png";
    markerImages.vogel.src = "images/weidevogels.png";

    const markerBackgrounds = {
        klein: new Image(),
        groot: new Image()
    };

    markerBackgrounds.klein.src = "images/klein-achtergrond.png";
    markerBackgrounds.groot.src = "images/groot-achtergrond.png";


    const markers = [
        {
            x: 0.60,
            y: 0.42,
            type: "boerderij",
            featured: true,
            text: "Klik op mij en ontdek het verhaal van de boeren!",
            link: "index.html",
            hoverScale: 1
        },
        {
            x: 0.39,
            y: 0.45,
            type: "vogel",
            featured: true,
            text: "Klik op mij en ontdek de weidevogelgebieden!",
            link: "index.html",
            hoverScale: 1
        },

        { x: 0.30, y: 0.62, type: "boerderij" },
        { x: 0.42, y: 0.68, type: "boerderij" },
        { x: 0.56, y: 0.64, type: "boerderij" },
        { x: 0.66, y: 0.72, type: "boerderij" },
        { x: 0.48, y: 0.82, type: "boerderij" },

        { x: 0.34, y: 0.75, type: "vogel" },
        { x: 0.52, y: 0.73, type: "vogel" },
        { x: 0.61, y: 0.84, type: "vogel" },
        { x: 0.43, y: 0.90, type: "vogel" }
    ];

    let scale = 1;
    let targetScale = 1;

    let offsetX = 0;
    let offsetY = 0;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    let hoveredMarker = null;
    const filters = {
        boerderij: true,
        vogel: true
    };


    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        scale = getBaseScale();
        targetScale = scale;

        centerMap();
        draw();
    }

    function getBaseScale() {
        return Math.max(
            canvas.width / mapImage.width,
            canvas.height / mapImage.height
        );
    }

    function centerMap() {
        offsetX = (canvas.width - mapImage.width * scale) / 2;
        offsetY = (canvas.height - mapImage.height * scale) / 2;
    }

    function limitDrag() {
        const mapWidth = mapImage.width * scale;
        const mapHeight = mapImage.height * scale;

        if (mapWidth <= canvas.width) {
            offsetX = (canvas.width - mapWidth) / 2;
        } else {
            offsetX = Math.min(0, Math.max(canvas.width - mapWidth, offsetX));
        }

        if (mapHeight <= canvas.height) {
            offsetY = (canvas.height - mapHeight) / 2;
        } else {
            offsetY = Math.min(0, Math.max(canvas.height - mapHeight, offsetY));
        }
    }

    function wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";
        let lines = [];

        for (let i = 0; i < words.length; i++) {
            let testLine = line + words[i] + " ";
            let width = ctx.measureText(testLine).width;

            if (width > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + " ";
            } else {
                line = testLine;
            }
        }

        lines.push(line);

        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                x,
                y + index * lineHeight
            );
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            mapImage,
            offsetX,
            offsetY,
            mapImage.width * scale,
            mapImage.height * scale
        );

        markers.forEach(marker => {
            if (!filters[marker.type]) return;
            const markerImage = markerImages[marker.type];

            const backgroundImage = marker.featured
                ? markerBackgrounds.groot
                : markerBackgrounds.klein;


            if (marker.hoverScale === undefined) {
                marker.hoverScale = 1;
            }

            if (hoveredMarker === marker) {
                marker.hoverScale += (1.1 - marker.hoverScale) * 0.15;
            } else {
                marker.hoverScale += (1 - marker.hoverScale) * 0.15;
            }

            const baseScale = getBaseScale();
            const markerScale = scale / baseScale;

            const isHovered = hoveredMarker === marker;
            const backgroundSize = marker.featured
                ? 180 * markerScale * marker.hoverScale
                : 70 * markerScale;
            const markerSize = marker.featured
                ? 110 * markerScale * marker.hoverScale
                : 60 * markerScale;


            const x = offsetX + marker.x * mapImage.width * scale;
            const y = offsetY + marker.y * mapImage.height * scale;

            const bubbleY = marker.featured
                ? y - 20 * markerScale - ((marker.hoverScale - 1) * 100)
                : y;
            // achtergrond
            ctx.drawImage(
                backgroundImage,
                x - backgroundSize / 2,
                bubbleY - backgroundSize / 2,
                backgroundSize,
                backgroundSize
            );

            // tekst
            if (marker.featured && marker.text) {
                ctx.fillStyle = "#173B8F";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `${15 * markerScale}px sans-serif`;

                wrapText(
                    marker.text,
                    x,
                    bubbleY - 55 * markerScale,
                    135 * markerScale,
                    18 * markerScale
                );
            }

            // marker icoon
            const iconY = marker.featured
                ? y + 30 * markerScale
                : y - 8 * markerScale;

            ctx.drawImage(
                markerImage,
                x - markerSize / 2,
                iconY - markerSize / 2,
                markerSize,
                markerSize
            );
        });
    }


    canvas.addEventListener("wheel", function (event) {
        event.preventDefault();

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const zoom = event.deltaY < 0 ? 1.08 : 0.92;

        const oldScale = scale;
        const newScale = Math.min(
            Math.max(scale * zoom, getBaseScale()),
            getBaseScale() * 3
        );

        const scaleChange = newScale / oldScale;

        offsetX = mouseX - (mouseX - offsetX) * scaleChange;
        offsetY = mouseY - (mouseY - offsetY) * scaleChange;

        scale = newScale;

        limitDrag();
        draw();
    });

    canvas.addEventListener("mousedown", function (event) {
        isDragging = true;
        startX = event.clientX - offsetX;
        startY = event.clientY - offsetY;
    });

    canvas.addEventListener("mousemove", function (event) {

        if (isDragging) {
            offsetX = event.clientX - startX;
            offsetY = event.clientY - startY;

            limitDrag();
            return;
        }

        hoveredMarker = null;

        markers.forEach(marker => {

            if (!marker.featured) return;
            if (!filters[marker.type]) return;

            const baseScale = getBaseScale();
            const markerScale = scale / baseScale;

            const backgroundSize = 180 * markerScale * marker.hoverScale;

            const x = offsetX + marker.x * mapImage.width * scale;
            const y = offsetY + marker.y * mapImage.height * scale;

            const bubbleY = y - 20 * markerScale;

            if (
                event.clientX >= x - backgroundSize / 2 &&
                event.clientX <= x + backgroundSize / 2 &&
                event.clientY >= bubbleY - backgroundSize / 2 &&
                event.clientY <= bubbleY + backgroundSize / 2
            ) {
                hoveredMarker = marker;
            }
        });

        canvas.style.cursor = hoveredMarker ? "pointer" : "grab";
    });

    canvas.addEventListener("click", function (event) {
        const clickX = event.clientX;
        const clickY = event.clientY;

        markers.forEach(marker => {
            if (!marker.featured) return;
            if (!filters[marker.type]) return;

            const baseScale = getBaseScale();
            const markerScale = scale / baseScale;

            const backgroundSize = 180 * markerScale;

            const x = offsetX + marker.x * mapImage.width * scale;
            const y = offsetY + marker.y * mapImage.height * scale;

            const bubbleY = y - 20 * markerScale;

            if (
                clickX >= x - backgroundSize / 2 &&
                clickX <= x + backgroundSize / 2 &&
                clickY >= bubbleY - backgroundSize / 2 &&
                clickY <= bubbleY + backgroundSize / 2
            ) {
                window.location.href = marker.link;
            }
        });
    });


    mapImage.onload = resizeCanvas;

    markerImages.boerderij.onload = draw;
    markerImages.vogel.onload = draw;

    markerBackgrounds.klein.onload = draw;
    markerBackgrounds.groot.onload = draw;

    window.addEventListener("resize", resizeCanvas);

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    animate();


}



// ==========================================
// TUTORIAL & DONATIE
// ==========================================

let currentStep = 1;
let selectedAmount = '5';
let selectedFrequency = 'eenmalige';

document.addEventListener('DOMContentLoaded', () => {

    const beginScherm = document.getElementById('begin-scherm');

    if (beginScherm) {
        beginScherm.addEventListener('click', startVideo);
    }

    const video = document.getElementById('intro-video');

    if (video) {
        video.addEventListener('click', () => {
            video.pause();
            showTutorial();
        });

        video.addEventListener('ended', showTutorial);
    }

    const btnVerder = document.getElementById('btn-verder');
    const btnSkipTerug = document.getElementById('btn-skip-terug');
    const btnTerugSmall = document.getElementById('btn-terug-small');

    if (btnVerder) {
        btnVerder.addEventListener('click', () => {
            if (currentStep === 1) updateStep(2);
            else if (currentStep === 2) updateStep(3);
            else if (currentStep === 3) window.location.href = "kaart-grutto.html";
        });
    }

    if (btnSkipTerug) {
        btnSkipTerug.addEventListener('click', () => {
            if (currentStep === 1) console.log("Skip");
            else if (currentStep === 2) updateStep(1);
            else if (currentStep === 3) window.location.href = 'bijdrage.html';
        });
    }

    if (btnTerugSmall) {
        btnTerugSmall.addEventListener('click', () => {
            updateStep(2);
        });
    }

    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabText = this.innerText.trim().toLowerCase();

            if (tabText === 'eenmalig') {
                selectedFrequency = 'eenmalige';
            }
            else if (tabText === 'maandelijks') {
                selectedFrequency = 'maandelijkse';
            }
            else if (tabText === 'jaarlijks') {
                selectedFrequency = 'jaarlijkse';
            }
        });
    });

    const amountBtns = document.querySelectorAll('.amount-btn');
    const impactOverlay = document.getElementById('impact-overlay');
    const impactImage = document.getElementById('impact-image');

    amountBtns.forEach(btn => {

        btn.addEventListener('click', function () {

            amountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            selectedAmount = this.dataset.amount;
        });

        btn.addEventListener('mouseenter', function () {

            const amount = this.dataset.amount;

            if (impactImage) {
                impactImage.src = `images/overlay-donatie-${amount}-euro.png`;
            }

            if (impactOverlay) {
                impactOverlay.style.display = 'flex';
            }
        });

        btn.addEventListener('mouseleave', function () {

            if (impactOverlay) {
                impactOverlay.style.display = 'none';
            }
        });
    });

    if (impactOverlay) {

        impactOverlay.addEventListener('click', function () {
            impactOverlay.style.display = 'none';
        });
    }

    const modal = document.querySelector('.impact-modal');

    if (modal) {

        modal.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    }
});


const openBtn = document.querySelector("#openMenuBtn");
const closeBtn = document.querySelector("#closeMenuBtn");
const overlay = document.querySelector("#filterOverlay");

if (openBtn && closeBtn && overlay) {
    openBtn.addEventListener("click", function () {
        overlay.classList.add("is-active");
    });

    closeBtn.addEventListener("click", function () {
        overlay.classList.remove("is-active");
    });

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
            overlay.classList.remove("is-active");
        }
    });
}

const filterBoerderijen = document.querySelector("#filterBoerderijen");
const filterWeidevogels = document.querySelector("#filterWeidevogels");

if (filterBoerderijen) {
    filterBoerderijen.addEventListener("change", function () {
        filters.boerderij = filterBoerderijen.checked;
        hoveredMarker = null;
        draw();
    });
}

if (filterWeidevogels) {
    filterWeidevogels.addEventListener("change", function () {
        filters.vogel = filterWeidevogels.checked;
        hoveredMarker = null;
        draw();
    });
}

const switchPerspective = document.querySelector("#switchPerspective");

if (switchPerspective) {
    switchPerspective.addEventListener("click", function () {
        window.location.href = "kaart-boer.html";
    });
}


function startVideo() {
    const beginScherm = document.getElementById('begin-scherm');
    const videoScherm = document.getElementById('video-scherm');
    const video = document.getElementById('intro-video');

    if (beginScherm) beginScherm.style.display = 'none';
    if (videoScherm) videoScherm.style.display = 'block';
    if (video) video.play();
}

function showTutorial() {
    const videoScherm = document.getElementById('video-scherm');
    const tutorialScherm = document.getElementById('tutorial-scherm');

    if (videoScherm) videoScherm.style.display = 'none';
    if (tutorialScherm) tutorialScherm.style.display = 'block';

    updateStep(1);
}

function updateStep(step) {
    currentStep = step;

    const title = document.getElementById('tut-title');
    const text1 = document.getElementById('tut-text-1');
    const text2 = document.getElementById('tut-text-2');
    const stepInd = document.getElementById('tut-step');
    const btnLeft = document.getElementById('btn-skip-terug');
    const btnRight = document.getElementById('btn-verder');
    const markersContainer = document.getElementById('markers-container');
    const step3Markers = document.getElementById('step3-markers');
    const btnTerugSmall = document.getElementById('btn-terug-small');

    if (!title) return;

    if (step === 1) {
        title.style.display = 'block';
        title.innerHTML = "Hoi, ik ben Grutto!<br>Welkom in Amstelland.";
        text1.innerHTML = "Op deze kaart ontdek je hoe boeren, natuur en weidevogels met elkaar verbonden zijn.";
        text2.style.display = 'block';
        text2.innerHTML = "Scroll over de kaart en verken het gebied.";
        stepInd.innerText = "1/3";
        btnLeft.innerText = "Skip";
        btnRight.innerText = "Verder";
        if (markersContainer) markersContainer.style.display = 'none';
        if (btnTerugSmall) btnTerugSmall.style.display = 'none';
    }

    else if (step === 2) {
        title.style.display = 'block';
        title.innerHTML = "Klik op een <strong>marker</strong> om <strong>verhalen, locaties</strong> en bijzondere <strong>plekken</strong> te ontdekken.";
        text1.innerHTML = "Via het menu kun je locaties filteren, wisselen tussen verschillende perspectieven en een uitdagend spelletje vinden.";
        text2.style.display = 'none';
        stepInd.innerText = "2/3";
        btnLeft.innerText = "Terug";
        btnRight.innerText = "Verder";
        if (markersContainer) markersContainer.style.display = 'block';
        if (step3Markers) step3Markers.style.display = 'none';
        if (btnTerugSmall) btnTerugSmall.style.display = 'none';
    }

    else if (step === 3) {
        title.style.display = 'none';
        text1.innerHTML = "Ben je klaar? Dan laat ik je graag mijn landschap zien. <strong>Klik op de rechterknop</strong> en ontdek Amstelland.";
        text2.style.display = 'block';
        text2.innerHTML = "Of ben je benieuwd hoe jij vandaag kunt bijdragen aan natuurherstel? <strong>Klik op de linkerknop.</strong>";
        stepInd.innerText = "3/3";
        btnLeft.innerText = "Draag bij aan natuurherstel";
        btnRight.innerText = "Ontdek het Amstelgebied";
        if (markersContainer) markersContainer.style.display = 'block';
        if (step3Markers) step3Markers.style.display = 'block';
        if (btnTerugSmall) btnTerugSmall.style.display = 'block';
    }
}