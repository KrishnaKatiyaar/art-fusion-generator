const canvas = new fabric.Canvas('artCanvas', {
    width: 800,
    height: 600,
    backgroundColor: '#d7ccc8'
});

// Art Database (Use more entries from Wikimedia Commons)
const artDatabase = {
    eyes: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mona_Lisa.jpg/150px-Mona_Lisa.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Frida_Kahlo_%28self_portrait%29.jpg/160px-Frida_Kahlo_%28self_portrait%29.jpg'
    ],
    backgrounds: [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/160px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/160px-Tsunami_by_hokusai_19th_century.jpg'
    ]
};

// Initialize palette
function loadElements() {
    const palette = document.getElementById('elementsPalette');
    Object.entries(artDatabase).forEach(([category, urls]) => {
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.draggable = true;
            img.ondragstart = dragStart;
            palette.appendChild(img);
        });
    });
}

// Drag and drop functionality
function dragStart(e) {
    const url = e.target.src;
    e.dataTransfer.setData('text/plain', url);
}

canvas.on('drop', (event) => {
    const url = event.e.dataTransfer.getData('text/plain');
    fabric.Image.fromURL(url, img => {
        img.set({
            left: event.e.offsetX - img.width/2,
            top: event.e.offsetY - img.height/2,
            scaleX: 0.3,
            scaleY: 0.3,
            borderColor: '#4e342e',
            cornerColor: '#8d6e63',
            transparentCorners: false
        });
        canvas.add(img);
        updateProvenance(url);
    });
});

function updateProvenance(url) {
    const provenance = document.getElementById('artProvenance');
    provenance.textContent = `Added element from: ${new URL(url).pathname.split('/').pop()}`;
}

// Random fusion generator
async function randomizeArt() {
    canvas.clear();
    
    // Random background
    const bgUrl = artDatabase.backgrounds[Math.floor(Math.random() * artDatabase.backgrounds.length)];
    const bgImg = await loadImage(bgUrl);
    canvas.setBackgroundImage(bgUrl, canvas.renderAll.bind(canvas));
    
    // Add random elements
    for(let i = 0; i < 3; i++) {
        const category = Object.keys(artDatabase)[Math.floor(Math.random() * Object.keys(artDatabase).length)];
        const url = artDatabase[category][Math.floor(Math.random() * artDatabase[category].length)];
        fabric.Image.fromURL(url, img => {
            img.set({
                left: Math.random() * canvas.width,
                top: Math.random() * canvas.height,
                angle: Math.random() * 360,
                opacity: 0.8,
                scaleX: 0.2 + Math.random() * 0.3,
                scaleY: 0.2 + Math.random() * 0.3,
                blendMode: 'multiply'
            });
            canvas.add(img);
        });
    }
}

function download() {
    const link = document.createElement('a');
    link.download = 'art-fusion.png';
    link.href = canvas.toDataURL({format: 'png'});
    link.click();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadElements();
    canvas.on('object:modified', () => canvas.renderAll());
});
