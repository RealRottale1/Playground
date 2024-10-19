const mainDiv = document.getElementById('mainDiv');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

// variables and settings
// settings
const settings = {
    refreshRate: 10,
    playerMovmentAmount: 2.5,
};

// stores texture data
const gameTextures = {
    player: {
        fullHealth: null,
        halfHealth: null,
        nearDeath: null,
        sizeX: 25,
        sizeY: 25,
        draw: function(texture ,x, y) {
            ctx.drawImage(texture, x-this.sizeX/2, y-this.sizeY/2, this.sizeX, this.sizeY)
        },
    },

    grass: {
        texture: null,
        draw: function(x, y) {
            ctx.drawImage(this.texture, x, y, 25, 25)
        },
    },
    rock: {
        texture: null,
        draw: function(x, y) {
            ctx.drawImage(this.texture, x, y, 50, 50)
        },
    },
};

let playerProps = {
    maxHealth: 100,
    health: 100,
    useTexture: null,
    getUseTexture: function() {
        if (this.health > 66) {
            this.useTexture = gameTextures.player.fullHealth;
        } else if (this.health <= 66 && this.health > 33) {
            this.useTexture = gameTextures.player.halfHealth;
        } else {
            this.useTexture = gameTextures.player.nearDeath;
        }
    },
    x: 250,
    y: 250,
    velocityX: 0,
    velocityY: 0,
    keyMovment: {
        w: 0,
        a: 0,
        s: 0,
        d: 0,
    },
    updateXY: function() {
        const newX = this.x + (this.keyMovment.d - this.keyMovment.a)*settings.playerMovmentAmount;;
        const newY = this.y + (this.keyMovment.s - this.keyMovment.w)*settings.playerMovmentAmount;
        if (newX >= 0 && newX <= mainCanvas.width) {
            this.x = newX
        };
        if (newY >= 0 && newY <= mainCanvas.height) {
            this.y = newY
        };
    },
};

const savedPlayerProps = {...playerProps};
// End










// critical functions and setup functions
// wait tick system
function waitTick() {
    return new Promise((success) => {
        setTimeout(() => {
            success()
        }, settings.refreshRate)
    });
};

// handles loading image
function loadImage(Path) {
    return new Promise((success, failure) => {
     const image = new Image();
     image.src = Path;
     image.onload = () => {success(image)};
     image.onerror = (err) => {failure(err)};
    }); 
 };

// clears canvas and resets background
function clearAll() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fillStyle = 'rgb(14 204 30)';
    ctx.beginPath();
    ctx.rect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fill();
};
// End









// game loop
// handles loading textures
async function loadTextures() {
    gameTextures.player.fullHealth = await loadImage('textures/playerH3.png');
    gameTextures.player.halfHealth = await loadImage('textures/playerH2.png');
    gameTextures.player.nearDeath = await loadImage('textures/playerH1.png');

    gameTextures.grass.texture = await loadImage('textures/grass.png');
    gameTextures.rock.texture = await loadImage('textures/rock.png');
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
        });
    });
};

// boots up game
function bootGame() {
    // generates stuff like bushes
    playerProps = savedPlayerProps;

    return new Promise((success) => {
        success();
    });
};

// handles setting key movment
function handleSetKeyMovment(event ,setTo) {
    if (event && event.key) {
        switch (String(event.key).toLowerCase()) {
            case("w"):
                playerProps.keyMovment.w = setTo;
                break;
            case("a"):
                playerProps.keyMovment.a = setTo;
                break;
            case("s"):
                playerProps.keyMovment.s = setTo;
                break;
            case("d"):
                playerProps.keyMovment.d = setTo;
                break;
            default:
                break;
        };
    };
};

// gets key down
function establishUserInputDown(event) {
    handleSetKeyMovment(event ,1)
};

// gets key up
function establishUserInputUp(event) {
    handleSetKeyMovment(event ,0)
};

// main game loop
async function playGame() {
    while (true) {
        clearAll();
        playerProps.updateXY();
        playerProps.getUseTexture();
        gameTextures.player.draw(playerProps.useTexture, playerProps.x, playerProps.y);
        await waitTick();
        console.log(playerProps.keyMovment)
    };
};

// handles core loop
async function runGame() {
    await loadTextures();
    await makeLoadingScreen();
    await bootGame();
    document.addEventListener('keydown', establishUserInputDown);
    document.addEventListener('keyup', establishUserInputUp);
    await playGame();
    document.removeEventListener('keydown', establishUserInputDown);
    document.removeEventListener('keyup', establishUserInputUp);
};

runGame();
// End















