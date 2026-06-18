const canvas = document.querySelector("#mapCanvas");
const ctx = canvas.getContext("2d");

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
        x: 0.23,
        y: 0.28,
        type: "boerderij",
        featured: true,
        text: "Klik op mij en ontdek het verhaal van de boeren!"
    },
    {
        x: 0.37,
        y: 0.18,
        type: "vogel",
        featured: true,
        text: "Klik op mij en ontdek de weidevogelgebieden!"
    },

    { x: 0.68, y: 0.25, type: "boerderij" },
    { x: 0.14, y: 0.50, type: "boerderij" },
    { x: 0.25, y: 0.62, type: "boerderij" },
    { x: 0.17, y: 0.88, type: "boerderij" },

    { x: 0.58, y: 0.52, type: "vogel" },
    { x: 0.55, y: 0.72, type: "vogel" },
    { x: 0.39, y: 0.92, type: "vogel" }
];

let scale = 1;
let targetScale = 1;

let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;


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
        const markerImage = markerImages[marker.type];

        const backgroundImage = marker.featured
            ? markerBackgrounds.groot
            : markerBackgrounds.klein;

        if (!markerImage.complete || !backgroundImage.complete) return;

        const baseScale = getBaseScale();
        const markerScale = scale / baseScale;

        const backgroundSize = marker.featured
            ? 180 * markerScale
            : 90 * markerScale;

        const markerSize = marker.featured
            ? 90 * markerScale
            : 50 * markerScale;

        const x = offsetX + marker.x * mapImage.width * scale;
        const y = offsetY + marker.y * mapImage.height * scale;

        // achtergrond
        ctx.drawImage(
            backgroundImage,
            x - backgroundSize / 2,
            y - backgroundSize / 2,
            backgroundSize,
            backgroundSize
        );

        // marker icoon
        const iconY = marker.featured
            ? y + 35 * markerScale
            : y;

        ctx.drawImage(
            markerImage,
            x - markerSize / 2,
            iconY - markerSize / 2,
            markerSize,
            markerSize
        );

        // tekst voor grote markers
        if (marker.featured && marker.text) {
            ctx.fillStyle = "#173B8F";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `bold ${16 * markerScale}px sans-serif`;

            wrapText(
                marker.text,
                x,
                y - 45 * markerScale,
                140 * markerScale,
                20 * markerScale
            );
        }
    })};


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
    if (!isDragging) return;

    offsetX = event.clientX - startX;
    offsetY = event.clientY - startY;

    limitDrag();
    draw();
});

canvas.addEventListener("mouseup", function () {
    isDragging = false;
});

canvas.addEventListener("mouseleave", function () {
    isDragging = false;
});

mapImage.onload = resizeCanvas;

markerImages.boerderij.onload = draw;
markerImages.vogel.onload = draw;

markerBackgrounds.klein.onload = draw;
markerBackgrounds.groot.onload = draw;

window.addEventListener("resize", resizeCanvas);