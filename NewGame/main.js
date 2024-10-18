const mainDiv = document.getElementById('mainDiv');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

const gameTextures = {
    grass: function(x, y) {
        ctx.drawImage('..\textures\grass.png', x, y)
    },
}

let playerProps = {
    x: 0,
    y: 0,
};

const savedPlayerProps = {...playerProps};

async function runGame() {
    await makeLoadingScreen();
    await bootGame();
};

runGame();

function bootGame() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fillStyle = 'rgb(14 204 30)';
    ctx.beginPath();
    ctx.rect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fill();
    playerProps = savedPlayerProps;

    gameTextures.grass(100, 100);

    return new Promise((success) => {
        success();
    });
};








// loads main menu
function makeLoadingScreen() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fillStyle = 'rgb(255 0 0)';
    ctx.beginPath();
    ctx.rect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fill();

    const startButton = document.createElement('button');
    startButton.textContent = 'Play';
    startButton.id = 'playButton';
    mainDiv.appendChild(startButton);

    return new Promise((success) => {
        startButton.addEventListener('click', function(event) {
            startButton.remove();
            success();
        })
    })
}