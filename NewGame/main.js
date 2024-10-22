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

function makeImage(url) {
    const image = new Image();
    image.src = url;
    return(image);
};

const gameTextures = {
    playerFullHealth: makeImage('textures/players/playerH3.png'),
    playerHalfHealth: makeImage('textures/players/playerH2.png'),
    playerNearDeath: makeImage('textures/players/playerH1.png'),
    goblinFullHealth: makeImage('textures/enemies/goblin/goblin3.png'),
    goblinHalfHealth: makeImage('textures/enemies/goblin/goblin2.png'),
    goblinNearDeath: makeImage('textures/enemies/goblin/goblin1.png'),
    weaponDefaultSword: makeImage('textures/weapons/defaultSword.png'),
    weaponLongSword: makeImage('textures/weapons/longSword.png'),
};

// function for calculating weapon position
function getWeaponPosition(x, y, mouseX, mouseY, sizeX, sizeY, offset, attacking) {
    const dX = mouseX - x;
    const dY = mouseY - y;
    const angle = Math.atan2(dY, dX) + Math.PI / 2;
    const offsetX = (-1*(sizeX / 2));
    const offsetY = (-1*(sizeY / 2) + (attacking ? offset * (4 / 3) : offset));
    return([angle, offsetX, offsetY]);
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
        draw: function (x, y, angle, offsetX, offsetY) {
            if (!this.texture || !this.sizeX || !this.sizeY) {
                return(false);
            };
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.drawImage(this.texture, offsetX, offsetY, this.sizeX, this.sizeY);
            ctx.restore();
        },
    },
    defaultSword: Object.create({}),
    longSword: Object.create({}),
};
Object.assign(weapons.defaultSword, weapons.hands);
Object.assign(weapons.defaultSword, {
    attackRange: 80,
    damage: 50,
    attackDuration: 750,
    attackCoolDown: 250,
    texture: gameTextures.weaponDefaultSword,
    sizeX: 50,
    sizeY: 50,
    offset: -50,
});
Object.assign(weapons.longSword, weapons.hands);
Object.assign(weapons.longSword, {
    attackRange: 125,
    damage: 85,
    attackDuration: 800,
    attackCoolDown: 950,
    texture: gameTextures.weaponLongSword,
    sizeX: 50,
    sizeY: 100,
    offset: -75,
});

let playerProps = class {
    // texture stuff
    useTexture = null;
    fullHealth = gameTextures.playerFullHealth;
    halfHealth = gameTextures.playerHalfHealth;
    nearDeath = gameTextures.playerNearDeath;
    sizeX = 25;
    sizeY = 25;
    draw(x, y) {
        ctx.drawImage(this.useTexture, x - this.sizeX / 2, y - this.sizeY / 2, this.sizeX, this.sizeY);
    };
    maxHealth = 100;
    health = 100;
    getUseTexture() {
        if (this.health > 66) {
            this.useTexture = this.fullHealth;
        } else if (this.health <= 66 && this.health > 33) {
            this.useTexture = this.halfHealth;
        } else {
            this.useTexture = this.nearDeath;
        };
    };
    // movment stuff
    playerMovmentAmount = 2.5;
    x = 250;
    y = 250;
    velocityX = 0;
    velocityY = 0;
    keyMovment = {
        w: 0,
        a: 0,
        s: 0,
        d: 0,
    };
    updateXY() {
        const newX = this.x + (this.keyMovment.d - this.keyMovment.a) * this.playerMovmentAmount;;
        const newY = this.y + (this.keyMovment.s - this.keyMovment.w) * this.playerMovmentAmount;
        if (newX >= 0 && newX <= mainCanvas.width) {
            this.x = newX
        };
        if (newY >= 0 && newY <= mainCanvas.height) {
            this.y = newY
        };
    };
    // sword stuff
    mouseX = 0;
    mouseY = 0;
    canAttack = true;
    attacking = false;
    weaponData = weapons.defaultSword;
};

const enemiesProps = {
    goblin: {
        // texture stuff
        useTexture: null,
        fullHealth: gameTextures.goblinFullHealth,
        halfHealth: gameTextures.goblinHalfHealth,
        nearDeath: gameTextures.goblinNearDeath,
        hitBoxX: 25,
        hitBoxY: 25,
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
        wasAttacked: false,
        canAttack: true,
        attacking: false,
        attackRangeMultiplier: 1,
        attackDamageMultiplier: 1,
        weaponData: weapons.defaultSword,
        attack: function() {
            if (this.canAttack) {
                this.canAttack = false;
                this.attacking = true;
                usePlayerProps.health -= this.weaponData.damage*this.attackDamageMultiplier;
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
            const dX = usePlayerProps.x - this.x;
            const dY = usePlayerProps.y - this.y;
            const distance = Math.sqrt(dX**2 + dY**2);
            if (distance > this.weaponData.attackRange*this.attackRangeMultiplier) {
                const nX = dX/distance;
                const nY = dY/distance;
                this.x += nX*this.movementSpeed;
                this.y += nY*this.movementSpeed;
            } else {
                this.attack();
            };
        },
    },
};

let usePlayerProps = null;
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
    usePlayerProps = new playerProps();
    currentEnemies.splice(0,currentEnemies.length);

    return new Promise((success) => {
        success();
    });
};

// handles setting key movment
function handleSetKeyMovment(event, setTo) {
    if (event && event.key) {
        switch (String(event.key).toLowerCase()) {
            case ('w'):
                usePlayerProps.keyMovment.w = setTo;
                break;
            case ('a'):
                usePlayerProps.keyMovment.a = setTo;
                break;
            case ('s'):
                usePlayerProps.keyMovment.s = setTo;
                break;
            case ('d'):
                usePlayerProps.keyMovment.d = setTo;
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
    usePlayerProps.mouseX = event.clientX - rect.left
    usePlayerProps.mouseY = event.clientY - rect.top
};

// gets mouse click
function establishMouseClick(event) {
    if (usePlayerProps.canAttack) {
        usePlayerProps.canAttack = false;
        usePlayerProps.attacking = true;
        setTimeout(() => {
            usePlayerProps.attacking = false;
            setTimeout(() => {
                usePlayerProps.canAttack = true;
                const currentEnemyLength = currentEnemies.length;
                for (let i = currentEnemyLength - 1; i >= 0; i--) {
                    const selectedEnemy = currentEnemies[i];
                    selectedEnemy.wasAttacked = false;
                };
            }, usePlayerProps.weaponData.attackCoolDown);
        }, usePlayerProps.weaponData.attackDuration);
    };
};

// main game loop
async function playGame() {
    while (true) {
        clearAll();
        usePlayerProps.updateXY();
        usePlayerProps.getUseTexture();
        usePlayerProps.draw(usePlayerProps.x, usePlayerProps.y);
        const [angle, offsetX, offsetY] = getWeaponPosition(usePlayerProps.x, usePlayerProps.y, usePlayerProps.mouseX, usePlayerProps.mouseY, usePlayerProps.weaponData.sizeX, usePlayerProps.weaponData.sizeY, usePlayerProps.weaponData.offset, usePlayerProps.attacking);
        const currentEnemyLength = currentEnemies.length;
        for (let i = currentEnemyLength - 1; i >= 0; i--) {
            const selectedEnemy = currentEnemies[i];
            selectedEnemy.getUseTexture();
            selectedEnemy.tickAction();
            selectedEnemy.draw(selectedEnemy.x, selectedEnemy.y);
            
            if (!selectedEnemy.wasAttacked && usePlayerProps.attacking) {
                const averageHitBox = (selectedEnemy.hitBoxX+selectedEnemy.hitBoxY)/2;
                const startAt = ((offsetY+(usePlayerProps.weaponData.offset*-1))/averageHitBox)*-1+1;
                for (let j = startAt; j <= (offsetY*-1)/averageHitBox; j++) {
                    const m = (j*averageHitBox*-1);
                    const x = usePlayerProps.x + (m*Math.cos(angle+Math.PI/2));
                    const y = usePlayerProps.y + (m*Math.sin(angle+Math.PI/2));
                    /*
                    ctx.beginPath(); // For debugging!
                    ctx.fillStyle = 'blue';
                    ctx.rect(x, y, 5, 5);
                    ctx.fill();
                    ctx.closePath();
                    */
                    const distance = Math.sqrt((selectedEnemy.x-x)**2+(selectedEnemy.y-y)**2);
                    const enemyHit = (distance < averageHitBox);
                    if (enemyHit) {
                        selectedEnemy.wasAttacked = true;
                        selectedEnemy.health -= usePlayerProps.weaponData.damage;
                        if (selectedEnemy.health <= 0) {
                            currentEnemies.splice(i, 1);
                        };
                        break;
                    };
                };
            };

            if (selectedEnemy.weaponData.texture) {
                const [enemyAngle, enemyOffsetX, enemyOffsetY] = getWeaponPosition(selectedEnemy.x, selectedEnemy.y, usePlayerProps.x, usePlayerProps.y, selectedEnemy.weaponData.sizeX, selectedEnemy.weaponData.sizeY, selectedEnemy.weaponData.offset, selectedEnemy.attacking);
                selectedEnemy.weaponData.draw(selectedEnemy.x, selectedEnemy.y, enemyAngle, enemyOffsetX, enemyOffsetY);
            };
        };

        usePlayerProps.weaponData.draw(usePlayerProps.x, usePlayerProps.y, angle, offsetX, offsetY);
        if (usePlayerProps.health <= 0) {
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