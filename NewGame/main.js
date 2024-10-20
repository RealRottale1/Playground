const mainDiv = document.getElementById('mainDiv');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

// deep clone function
function deepClone(object) {
    if (object === null || typeof object !== 'object') {
        return(object);
    };
    if (object instanceof HTMLImageElement) {
        const clonedImage = new Image();
        clonedImage.src = object.src;
        return(clonedImage);
    };
    let clonedObject = Array.isArray(object) ? [] : {};
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof object[key] === 'function') {
                clonedObject[key] = object[key].bind(clonedObject);
              } else {
                clonedObject[key] = deepClone(object[key]);
              };
        };
    };
    return clonedObject;
};

// variables and settings
// settings
const settings = {
    refreshRate: 10,

};

// stores texture data
const weapons = {
    hands: {
        attackRange: 35,
        damage: 15,
        attackDuration: 500,
        attackCoolDown: 150,
        texture: null,
        sizeX: 0,
        sizeY: 0,
        offset: 0,
        draw: function (x, y, mouseX, mouseY, attacking) {
            console.log(this.texture+" , "+this.sizeX+" , "+this.sizeY);
            if (!this.texture || !this.sizeX || !this.sizeY) {
                return(false);
            };
            const dX = mouseX - x;
            const dY = mouseY - y;
            const angle = Math.atan2(dY, dX) + Math.PI / 2;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.drawImage(this.texture, -1 * (this.sizeX / 2), -1 * (this.sizeY / 2) + (attacking ? this.offset * (4 / 3) : this.offset), this.sizeX, this.sizeY);
            ctx.restore();
        },
    },
    defaultSword: Object.create({}),
};
Object.assign(weapons.defaultSword, weapons.hands);
Object.assign(weapons.defaultSword, {
    attackRange: 45,
    damage: 50,
    attackDuration: 750,
    attackCoolDown: 250,
    texture: null,
    sizeX: 50,
    sizeY: 50,
    offset: -50,
});

let playerProps = {
    // texture stuff
    useTexture: null,
    fullHealth: null,
    halfHealth: null,
    nearDeath: null,
    sizeX: 25,
    sizeY: 25,
    draw: function (x, y) {
        ctx.drawImage(this.useTexture, x - this.sizeX / 2, y - this.sizeY / 2, this.sizeX, this.sizeY);
    },
    maxHealth: 100,
    health: 100,
    getUseTexture: function () {
        if (this.health > 66) {
            this.useTexture = this.fullHealth;
        } else if (this.health <= 66 && this.health > 33) {
            this.useTexture = this.halfHealth;
        } else {
            this.useTexture = this.nearDeath;
        };
    },
    // movment stuff
    playerMovmentAmount: 2.5,
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
    updateXY: function () {
        const newX = this.x + (this.keyMovment.d - this.keyMovment.a) * this.playerMovmentAmount;;
        const newY = this.y + (this.keyMovment.s - this.keyMovment.w) * this.playerMovmentAmount;
        if (newX >= 0 && newX <= mainCanvas.width) {
            this.x = newX
        };
        if (newY >= 0 && newY <= mainCanvas.height) {
            this.y = newY
        };
    },
    // sword stuff
    mouseX: 0,
    mouseY: 0,
    canAttack: true,
    attacking: false,
    weaponData: weapons.defaultSword,
};

const enemiesProps = {
    goblin: {
        // texture stuff
        useTexture: null,
        fullHealth: null,
        halfHealth: null,
        nearDeath: null,
        sizeX: 25,
        sizeY: 25,
        draw: function (x, y) {
            ctx.drawImage(this.useTexture, x - this.sizeX / 2, y - this.sizeY / 2, this.sizeX, this.sizeY);
        },
        getUseTexture: function () {
            if (this.health > 66) {
                this.useTexture = this.fullHealth;
            } else if (this.health <= 66 && this.health > 33) {
                this.useTexture = this.halfHealth;
            } else {
                this.useTexture = this.nearDeath;
            };
        },
        // general stuff
        starterHealth: 100,
        health: 100,
        x: 0,
        y: 0,
        // weapon suff
        canAttack: true,
        attacking: false,
        attackRangeMultiplier: 1,
        attackDamageMultiplier: 1,
        weaponData: weapons.hands,
        attack: function() {
            if (this.canAttack) {
                this.canAttack = false;
                this.attacking = true;
                playerProps.health -= this.weaponData.damage*this.attackDamageMultiplier;
                setTimeout(() => {
                    this.attacking = false;
                    setTimeout(() => {
                        this.canAttack = true;
                    }, this.weaponData.attackCoolDown);
                }, this.weaponData.attackDuration);
            };
        },
        // movment/tick stuff
        movementSpeed: 1.5,
        tickAction: function () {
            const dX = playerProps.x - this.x;
            const dY = playerProps.y - this.y;
            const distance = Math.sqrt(dX**2 + dY**2);
            if (distance > 0) {
                const nX = dX/distance;
                const nY = dY/distance;
                this.x += nX*this.movementSpeed;
                this.y += nY*this.movementSpeed;
                if (distance < this.weaponData.attackRange*this.attackRangeMultiplier) {
                    console.log('attack!');
                    this.attack();
                };
            };
        },
    },
};

let savedPlayerProps = null;
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
        image.onload = () => { success(image) };
        image.onerror = (err) => { failure(err) };
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
    playerProps.fullHealth = await loadImage('textures/players/playerH3.png');
    playerProps.halfHealth = await loadImage('textures/players/playerH2.png');
    playerProps.nearDeath = await loadImage('textures/players/playerH1.png');
    enemiesProps.goblin.fullHealth = await loadImage('textures/enemies/goblin/goblin3.png');
    enemiesProps.goblin.halfHealth = await loadImage('textures/enemies/goblin/goblin2.png');
    enemiesProps.goblin.nearDeath = await loadImage('textures/enemies/goblin/goblin1.png');
    weapons.defaultSword.texture = await loadImage('textures/weapons/defaultSword.png');
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
        startButton.addEventListener('click', function (event) {
            startButton.remove();
            success();
        });
    });
};

// boots up game
function bootGame() {
    // generates stuff like bushes
    savedPlayerProps = { ...playerProps };
    playerProps = savedPlayerProps;

    return new Promise((success) => {
        success();
    });
};

// handles setting key movment
function handleSetKeyMovment(event, setTo) {
    if (event && event.key) {
        switch (String(event.key).toLowerCase()) {
            case ("w"):
                playerProps.keyMovment.w = setTo;
                break;
            case ("a"):
                playerProps.keyMovment.a = setTo;
                break;
            case ("s"):
                playerProps.keyMovment.s = setTo;
                break;
            case ("d"):
                playerProps.keyMovment.d = setTo;
                break;
            default:
                break;
        };
    };
};

// gets key down
function establishUserInputDown(event) {
    handleSetKeyMovment(event, 1)
};

// gets key up
function establishUserInputUp(event) {
    handleSetKeyMovment(event, 0)
};

// gets mouse position
function establishMouseInput(event) {
    const rect = mainCanvas.getBoundingClientRect()
    playerProps.mouseX = event.clientX - rect.left
    playerProps.mouseY = event.clientY - rect.top
};

// gets mouse click
function establishMouseClick(event) {
    if (playerProps.canAttack) {
        playerProps.canAttack = false;
        playerProps.attacking = true;
        setTimeout(() => {
            playerProps.attacking = false;
            setTimeout(() => {
                playerProps.canAttack = true;
            }, playerProps.weaponData.attackCoolDown);
        }, playerProps.weaponData.attackDuration);
    };
};

// main game loop
async function playGame() {
    while (true) {
        clearAll();
        playerProps.updateXY();
        playerProps.getUseTexture();
        playerProps.draw(playerProps.x, playerProps.y);

        const currentEnemyLength = currentEnemies.length;
        for (let i = currentEnemyLength - 1; i >= 0; i--) {
            const selectedEnemy = currentEnemies[i];
            selectedEnemy.getUseTexture();
            selectedEnemy.tickAction();
            selectedEnemy.draw(selectedEnemy.x, selectedEnemy.y)
        };

        playerProps.weaponData.draw(playerProps.x, playerProps.y, playerProps.mouseX, playerProps.mouseY, playerProps.attacking)
        if (playerProps.health <= 0) {
            break;
        } else {
            await waitTick();
        };
    };
};


// handles spawning in enemies
function summonEnemy(enemyObject, spawnX, spawnY) {
    const summonedEnemy = deepClone(enemyObject);
    summonedEnemy.x = spawnX;
    summonedEnemy.y = spawnY;
    currentEnemies.push(summonedEnemy);
};

// handles core loop
async function runGame() {
    await loadTextures();
    while (true) {
        await makeLoadingScreen();
        await bootGame();

        summonEnemy(enemiesProps.goblin, 500, 400);
        document.addEventListener('keydown', establishUserInputDown);
        document.addEventListener('keyup', establishUserInputUp);
        document.addEventListener('mousemove', establishMouseInput);
        document.addEventListener('click', establishMouseClick);
        await playGame();
        document.removeEventListener('keydown', establishUserInputDown);
        document.removeEventListener('keyup', establishUserInputUp);
        document.removeEventListener('mousemove', establishMouseInput);
        document.removeEventListener('click', establishMouseClick);
    };
};

runGame();
// End