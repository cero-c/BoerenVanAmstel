const canvas = document.querySelector("#mapCanvas");
const ctx = canvas.getContext("2d");

const mapImage = new Image();
mapImage.src = "images/Grutto-kaart.png";

const markerImages = {
    boerderij: new Image(),
    vogel: new Image(),
    verkooppunt: new Image(),
    horeca: new Image()
};

markerImages.boerderij.src = "images/boerderij.png";
markerImages.vogel.src = "images/weidevogels.png";
markerImages.verkooppunt.src="images/verkooppunt.png";
markerImages.horeca.src="images/horeca.png";

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
        link: "index.html",
        hoverScale: 1
    },
    {
        x: 0.39,
        y: 0.45,
        type: "vogel",
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
    { x: 0.43, y: 0.90, type: "vogel" },

    { x: 0.4, y: 0.23, type: "verkooppunt" },
    { x: 0.45, y: 0.3, type: "verkooppunt" },
    { x: 0.5, y: 0.19, type: "verkooppunt" },
    { x: 0.2, y: 0.54, type: "verkooppunt" },
    { x: 0.17, y: 0.5, type: "verkooppunt" },
    { x: 0.24, y: 0.48, type: "verkooppunt" },
    { x: 0.19, y: 0.27, type: "verkooppunt" },
    { x: 0.42, y: 0.35, type: "verkooppunt" },

    { x: 0.45, y: 0.23, type: "horeca" },
    { x: 0.2, y: 0.35, type: "horeca" },
    { x: 0.45, y: 0.09, type: "horeca" },
    { x: 0.2, y: 0.54, type: "horeca" },
    { x: 0.15, y: 0.42, type: "horeca" },
    { x: 0.5, y: 0.28, type: "horeca" },
    { x: 0.55, y: 0.33, type: "horeca" },


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
    vogel: true,
    verkooppunt: true,
    horeca: true
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
markerImages.verkooppunt.onload = draw;

markerBackgrounds.klein.onload = draw;
markerBackgrounds.groot.onload = draw;

window.addEventListener("resize", resizeCanvas);

function animate() {
    draw();
    requestAnimationFrame(animate);
}

animate();


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
const filterVerkooppunten = document.querySelector("#filterVerkooppunten");
const filterHoreca = document.querySelector('#filterHoreca');

if (filterVerkooppunten) {
    filterVerkooppunten.addEventListener("change", function () {
        filters.verkooppunt = filterVerkooppunten.checked;
        hoveredMarker = null;
        draw();
    });
}

if (filterHoreca) {
    filterHoreca.addEventListener("change", function () {
        filters.horeca = filterHoreca.checked;
        hoveredMarker = null;
        draw();
    });
}

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
        window.location.href = "kaart-grutto.html";
    });
}