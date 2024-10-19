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
            ctx.drawImage(texture, x-this.sizeX/2, y-this.sizeY/2, this.sizeX, this.sizeY);
        },
    },

    goblin: {
        fullHealth: null,
        halfHealth: null,
        nearDeath: null,
        sizeX: 25,
        sizeY: 25,
        draw: function(texture ,x, y) {
            ctx.drawImage(texture, x-this.sizeX/2, y-this.sizeY/2, this.sizeX, this.sizeY);
        },
    },

    sword: {
        texture: null,
        sizeX: 50,
        sizeY: 50,
        offset: -50,
        draw: function(x, y, mouseX, mouseY, attacking) {
            const dX = mouseX - x;
            const dY = mouseY - y;
            const angle = Math.atan2(dY, dX) + Math.PI/2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.drawImage(this.texture, -1*(this.sizeX/2), -1*(this.sizeY/2)+(attacking ? this.offset*(4/3) : this.offset), this.sizeX, this.sizeY);
            ctx.restore();
        },
    },

    grass: {
        texture: null,
        draw: function(x, y) {
            ctx.drawImage(this.texture, x, y, 25, 25);
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
    mouseX: 0,
    mouseY: 0,
    swordData: {
        damage: 50,
        canAttack: true,
        attacking: false,
        attackDuration: 750,
        attackCoolDown: 250,
    },
};

const enemiesProps = {
    gobblin: {
        starterHealth: 100,
        movementSpeed: 5,
        tickAction: function() {

        },
        getUseTextureIndex: function(health) {
            if (health > 66) {
                return(0);
            } else if (health <= 66 && health > 33) {
                return(1);
            } else {
                return(2);
            }
        },
    },
};

const savedPlayerProps = {...playerProps};
const currentEnemies = [];
// End










// critical functions and setup functions
// wait tick system
function waitTick() {
    return new Promise((success) => {
        setTimeout(() => {
            success();
        }, settings.refreshRate);
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
    gameTextures.player.fullHealth = await loadImage('textures/players/playerH3.png');
    gameTextures.player.halfHealth = await loadImage('textures/players/playerH2.png');
    gameTextures.player.nearDeath = await loadImage('textures/players/playerH1.png');
    gameTextures.goblin.fullHealth = await loadImage('textures/enemies/goblin/goblin1.png');
    gameTextures.goblin.halfHealth = await loadImage('textures/enemies/goblin/goblin2.png');
    gameTextures.goblin.nearDeath = await loadImage('textures/enemies/goblin/goblin3.png');
    gameTextures.sword.texture = await loadImage('textures/swords/defaultSword.png');
    gameTextures.grass.texture = await loadImage('textures/grass.png');
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
    console.log(playerProps.health)

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

// gets mouse position
function establishMouseInput(event) {
    const rect = mainCanvas.getBoundingClientRect()
    playerProps.mouseX = event.clientX - rect.left
    playerProps.mouseY = event.clientY - rect.top
};

// gets mouse click
function establishMouseClick(event) {
    if (playerProps.swordData.canAttack) {
        playerProps.swordData.canAttack = false;
        playerProps.swordData.attacking = true;
        setTimeout(() => {
            playerProps.swordData.attacking = false;
            setTimeout(() => {
                playerProps.swordData.canAttack = true;
            }, playerProps.swordData.attackCoolDown);
        }, playerProps.swordData.attackDuration);
    };
};

// main game loop
async function playGame() {
    while (true) {
        clearAll();
        playerProps.updateXY();
        playerProps.getUseTexture();
        gameTextures.player.draw(playerProps.useTexture, playerProps.x, playerProps.y);
        gameTextures.sword.draw(playerProps.x, playerProps.y, playerProps.mouseX, playerProps.mouseY, playerProps.swordData.attacking)

        const currentEnemyLength = currentEnemies.length;
        for (let i = currentEnemyLength-1; i > 0; i--) {
            const selectedEnemy = currentEnemies[i];
            selectedEnemy.enemyData.tickAction();
            gameTextures.
        };

        if (playerProps.health <= 0) {
            break;
        } else {
            await waitTick();
        };
    };
};

// gets object by name from an object
function getObjectFromName(objectName, parentObject) {
    for (let object in parentObject) {
        if (object == objectName) {
            return(object);
        };
    };
};

// handles spawning in enemies
function summonEnemy(enemyName, spawnX, spawnY) {
    const summonedEnemy = {
        enemyData: getObjectFromName(enemyName, parentObject),
        enemyTextureData: getObjectFromName(enemyName, parentObject),
        health: enemyObject.maxHealth,
        x: spawnX,
        y: spawnY,
    };
    currentEnemies.push(summonedEnemy)
};

// handles core loop
async function runGame() {
    await loadTextures();
    while (true) {
        await makeLoadingScreen();
        await bootGame();

        summonEnemy(gobblin, 500, 400);
        document.addEventListener('keydown', establishUserInputDown);
        document.addEventListener('keyup', establishUserInputUp);
        document.addEventListener('mousemove', establishMouseInput);
        document.addEventListener('click', establishMouseClick);
        await playGame();
        document.removeEventListener('keydown', establishUserInputDown);
        document.removeEventListener('keyup', establishUserInputUp);
        document.removeEventListener('mousemove', establishMouseInput);
        document.removeEventListener('click', establishMouseClick);
    }
};

runGame();
// End















