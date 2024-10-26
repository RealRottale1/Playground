const mainDiv = document.getElementById('mainDiv');
const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

// variables and settings
// settings
const settings = {
    refreshRate: 10,
    mouseSwingRate: 50,
    dropHearSize: [50, 50],
};

function makeImage(url) {
    const image = new Image();
    try {
        image.src = url;
    } catch {
        image.src = 'textures/missing.png';
    };
    return(image);
};

const gameTextures = {
    missingTexture: makeImage('textures/missing.png'),
    playerFullHealth: makeImage('textures/players/playerH3.png'),
    playerHalfHealth: makeImage('textures/players/playerH2.png'),
    playerNearDeath: makeImage('textures/players/playerH1.png'),
    goblinFullHealth: makeImage('textures/enemies/goblin/goblin3.png'),
    goblinHalfHealth: makeImage('textures/enemies/goblin/goblin2.png'),
    goblinNearDeath: makeImage('textures/enemies/goblin/goblin1.png'),
    bigGoblinFullHealth: makeImage('textures/enemies/bigGoblin/bigGoblin3.png'),
    bigGoblinHalfHealth: makeImage('textures/enemies/bigGoblin/bigGoblin2.png'),
    bigGoblinNearDeath: makeImage('textures/enemies/bigGoblin/bigGoblin1.png'),
    armorGoblinFullHealth: makeImage('textures/enemies/armorGoblin/armorGoblin3.png'),
    armorGoblinHalfHealth: makeImage('textures/enemies/armorGoblin/armorGoblin2.png'),
    armorGoblinNearDeath: makeImage('textures/enemies/armorGoblin/armorGoblin1.png'),
    weaponDefaultSword: makeImage('textures/weapons/defaultSword.png'),
    weaponLongSword: makeImage('textures/weapons/longSword.png'),
    weaponBow: makeImage('textures/weapons/bow.png'),
    bulletArrow: makeImage('textures/weapons/arrow.png'),
    heart: makeImage('textures/drops/heart.png'),
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

class weaponHands {
    swingable = false;
    attackRange = 35;
    damage = 15;
    attackDuration = 500;
    attackCoolDown = 150;
    texture = null;
    sizeX = 0;
    sizeY = 0;
    offset = 0;
    draw(x, y, angle, offsetX, offsetY) {
        if (!this.texture || !this.sizeX || !this.sizeY) {
            return(false);
        };
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.drawImage(this.texture, offsetX, offsetY, this.sizeX, this.sizeY);
        ctx.restore();
    };
};

class weaponBow extends weaponHands {
    constructor() {
        super();
        this.isABow = true;
        this.fireRate = 1000;
        this.swingable = false;
        this.attackRange = 0;
        this.damage = 0;
        this.attackDuration = 0;
        this.attackCoolDown = 0;
        this.texture = null;
        this.texture = gameTextures.weaponBow;
        this.sizeX = 50;
        this.sizeY = 50;
        this.yOffset= -75;
    };
};

class weaponDefaultSword extends weaponHands {
    constructor() {
        super();
        this.swingable = false;
        this.attackRange = 80;
        this.damage = 35;
        this.attackDuration = 750;
        this.attackCoolDown = 250;
        this.texture = gameTextures.weaponDefaultSword;
        this.sizeX = 50;
        this.sizeY = 50;
        this.offset = -50;
    };
};

class weaponLongSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 125;
        this.damage = 85;
        this.attackDuration = 800;
        this.attackCoolDown = 950;
        this.texture = gameTextures.weaponLongSword;
        this.sizeX = 50;
        this.sizeY = 100;
        this.offset = -75;
    };
};

class playerProps {
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
        const newX = this.x + (this.keyMovment.d - this.keyMovment.a) * this.playerMovmentAmount;
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
    isSwinging = false;
    canAttack = true;
    attacking = false;
    isShooting = false;
    canShoot = true;
    shooting = false;
    currentWeapon = 'sword';
    weaponData = new weaponDefaultSword;
    bowData = new weaponBow;
};

class goblin {
    // texture stuff
    useTexture = null;
    fullHealth = gameTextures.goblinFullHealth;
    halfHealth = gameTextures.goblinHalfHealth;
    nearDeath = gameTextures.goblinNearDeath;
    hitBoxX = 25;
    hitBoxY = 25;
    sizeX = 25;
    sizeY = 25;
    draw(x, y) {
        ctx.drawImage(this.useTexture, x - this.sizeX / 2, y - this.sizeY / 2, this.sizeX, this.sizeY);
    };
    starterHealth = 100;
    health = 100;
    getUseTexture() {
        if (this.health > this.starterHealth*2/3) {
            this.useTexture = this.fullHealth;
        } else if (this.health <= this.starterHealth*2/3 && this.health > this.starterHealth*1/3) {
            this.useTexture = this.halfHealth;
        } else {
            this.useTexture = this.nearDeath;
        };
    };
    // general stuff
    x = 0;
    y = 0;
    // weapon suff
    wasSwingAttacked = false;
    wasAttacked = false;
    canAttack = true;
    attacking = false;
    attackRangeMultiplier = 1;
    attackDamageMultiplier = 1;
    weaponData = new weaponDefaultSword;
    attack() {
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
    };
    // movment/tick stuff
    movementSpeed = 1.5;
    swingAttackClock = [0, 10];
    tickAction() {
        if (this.wasSwingAttacked) {
            this.swingAttackClock[0] += 1;
            if (this.swingAttackClock[0] >= this.swingAttackClock[1]) {
                this.swingAttackClock[0] = 0;
                this.wasSwingAttacked = false;
            };
        };
        const dX = usePlayerProps.x - this.x;
        const dY = usePlayerProps.y - this.y;
        const distance = Math.sqrt(dX**2 + dY**2);
        if (distance-(this.hitBoxX+this.hitBoxY)/2 > this.weaponData.attackRange*this.attackRangeMultiplier) {
            const nX = dX/distance;
            const nY = dY/distance;
            this.x += nX*this.movementSpeed;
            this.y += nY*this.movementSpeed;
        } else {
            this.attack();
        };
    };    
};

class armorGoblin extends goblin {
    constructor() {
        super();
        this.fullHealth = gameTextures.armorGoblinFullHealth;
        this.halfHealth = gameTextures.armorGoblinHalfHealth;
        this.nearDeath = gameTextures.armorGoblinNearDeath;
        this.starterHealth = 200;
        this.health = 200;
        this.movementSpeed = 1;
    };
};

class bigGoblin extends goblin {
    constructor() {
        super();
        this.fullHealth = gameTextures.bigGoblinFullHealth;
        this.halfHealth = gameTextures.bigGoblinHalfHealth;
        this.nearDeath = gameTextures.bigGoblinNearDeath;
        this.starterHealth = 125;
        this.health = 125;
        this.hitBoxX = 50;
        this.hitBoxY = 50;
        this.sizeX = 50;
        this.sizeY = 50;
        this.attackDamageMultiplier = 1.5;
        this.movementSpeed = .5;
    };
};

const enemiesProps = {
    goblin: goblin,
    armorGoblin: armorGoblin,
    bigGoblin: bigGoblin,
};

class dropItem {
    useTexture = gameTextures.missingTexture;
    x = 0;
    y = 0;
    sizeX = 0;
    sizeY = 0;
    draw() {
        ctx.drawImage(this.useTexture, this.x - this.sizeX / 2, this.y - this.sizeY / 2, this.sizeX, this.sizeY);
    };
}

class heartItem extends dropItem {
    constructor(x, y) {
        super();
        this.useTexture = gameTextures.heart;
        this.x = x;
        this.y = y;
        this.sizeX = 25;
        this.sizeY = 25;
    };
    pickUp() {
        if (usePlayerProps.health <= 75) {
            usePlayerProps.health += 25;
        } else {
            usePlayerProps.health = 100;
        };
    };
};

let usePlayerProps = null;
const currentDropItems = [];
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
            case ('1'):
                usePlayerProps.currentWeapon = 'sword';
                break;
            case ('2'):
                usePlayerProps.currentWeapon = 'bow';
                break;
            default:
                break;
        };
    };
};

// gets key down
function establishUserInputDown(event) {
    handleSetKeyMovment(event, 1);
};

// gets key up
function establishUserInputUp(event) {
    handleSetKeyMovment(event, 0);
};

function getMouseAngle() {
    const dX = usePlayerProps.mouseX - usePlayerProps.x;
    const dY = usePlayerProps.mouseY - usePlayerProps.y;
    return(Math.atan2(dY, dX));
};

// gets mouse position
let savedMouseDirections = [];
function establishMouseInput(event) {
    const rect = mainCanvas.getBoundingClientRect();
    usePlayerProps.mouseX = event.clientX - rect.left;
    usePlayerProps.mouseY = event.clientY - rect.top;
    const angle = getMouseAngle();
    savedMouseDirections.push(angle);
};

// checks if player is swinging the sword and sets isSwinging to the value
function handelSwingingCheck() {
    const currentAngle =  getMouseAngle();
    const directionHistoryLength = savedMouseDirections.length;
    for (let i = 0; i < directionHistoryLength; i++) {
        const useDirection = savedMouseDirections[i];
        if ((Math.abs(useDirection) > Math.abs(currentAngle) + .5) || Math.abs(useDirection) + .5 < Math.abs(currentAngle)) {
            break;
        };
    };
    savedMouseDirections = [];
};

// gets mouse click
function establishMouseClick(event) {
    if (usePlayerProps.currentWeapon == 'sword') {
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
    } else {
        if (usePlayerProps.canShoot) {
            usePlayerProps.canShoot = false;
            usePlayerProps.shooting = true;
            // Spawn Arrow
            setTimeout(() => {
                usePlayerProps.canShoot = true;
                usePlayerProps.shooting = false;
            }, usePlayerProps.bowData.fireRate);
        };
    };
};

// draws the HUD
function drawHUD() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect((mainCanvas.width-250)/2, mainCanvas.height-30, 250, 25);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    if (usePlayerProps.health >= 50) {
        ctx.fillStyle = `rgba(${255*((usePlayerProps.maxHealth-usePlayerProps.health)*.02)}, 255, 1)`;
    } else {
        ctx.fillStyle = `rgba(255, ${Math.floor(255*(usePlayerProps.health/usePlayerProps.maxHealth))}, 0, 1)`;
    };
    ctx.rect((mainCanvas.width-242.5)/2, mainCanvas.height-27.5, 242.5*(usePlayerProps.health/100), 20);
    ctx.fill();
    ctx.closePath();
}

// handles dropping a heart
function dropHeart(x, y) {
    const heart = new heartItem(x, y);
    currentDropItems.push(heart);
};

// draws dropped items
function drawDroppedItems() {
    const droppedLength = currentDropItems.length;
    for (let i = droppedLength-1; i > -1; i--) {
        const currentDroppedItem = currentDropItems[i];
        const distanceFromPlayer = Math.sqrt((usePlayerProps.x - currentDroppedItem.x)**2 + (usePlayerProps.y - currentDroppedItem.y)**2);
        if (distanceFromPlayer > (currentDroppedItem.sizeX + currentDroppedItem.sizeY)/2) {
            currentDroppedItem.draw();
        } else {
            currentDroppedItem.pickUp();
            currentDropItems.splice(i, 1);
        };
    };
};

// main game loop
let gameClock = 0;
async function playGame() {
    while (true) {
        gameClock += 1;
        if ((gameClock % settings.mouseSwingRate) == 0) {
            handelSwingingCheck();
        };
        if (gameClock >= 2500) {
            gameClock = 0;
        };
        clearAll();
        usePlayerProps.updateXY();
        usePlayerProps.getUseTexture();
        drawDroppedItems();
        usePlayerProps.draw(usePlayerProps.x, usePlayerProps.y);
        const [angle, offsetX, offsetY] = getWeaponPosition(usePlayerProps.x, usePlayerProps.y, usePlayerProps.mouseX, usePlayerProps.mouseY, usePlayerProps.weaponData.sizeX, usePlayerProps.weaponData.sizeY, usePlayerProps.weaponData.offset, usePlayerProps.attacking);
        const currentEnemyLength = currentEnemies.length;
        for (let i = currentEnemyLength - 1; i >= 0; i--) {
            const selectedEnemy = currentEnemies[i];
            selectedEnemy.getUseTexture();
            selectedEnemy.tickAction();
            selectedEnemy.draw(selectedEnemy.x, selectedEnemy.y);
            const averageHitBox = (selectedEnemy.hitBoxX+selectedEnemy.hitBoxY)/2;
            if ((!selectedEnemy.wasAttacked && usePlayerProps.attacking) || (!selectedEnemy.wasSwingAttacked && usePlayerProps.isSwinging && usePlayerProps.weaponData.swingable)) {
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
                        if (!selectedEnemy.wasAttacked && usePlayerProps.attacking) {
                            selectedEnemy.wasAttacked = true;
                            selectedEnemy.health -= usePlayerProps.weaponData.damage;
                        } else {
                            selectedEnemy.wasSwingAttacked = true;
                            selectedEnemy.health -= usePlayerProps.weaponData.damage/7.5;
                        };
                        if (selectedEnemy.health <= 0) {
                            dropHeart(selectedEnemy.x, selectedEnemy.y);
                            currentEnemies.splice(i, 1);
                        };
                        break;
                    };
                };
            };

            if (selectedEnemy.weaponData.texture) {
                const [enemyAngle, enemyOffsetX, enemyOffsetY] = getWeaponPosition(selectedEnemy.x, selectedEnemy.y, usePlayerProps.x, usePlayerProps.y, selectedEnemy.weaponData.sizeX, selectedEnemy.weaponData.sizeY+averageHitBox, selectedEnemy.weaponData.offset, selectedEnemy.attacking);
                selectedEnemy.weaponData.draw(selectedEnemy.x, selectedEnemy.y, enemyAngle, enemyOffsetX, enemyOffsetY);
            };
        };

        if (usePlayerProps.currentWeapon == 'sword') {
            usePlayerProps.weaponData.draw(usePlayerProps.x, usePlayerProps.y, angle, offsetX, offsetY);
        } else {
            usePlayerProps.bowData.draw(usePlayerProps.x, usePlayerProps.y, angle, offsetX, usePlayerProps.bowData.yOffset);
        };
        drawHUD();
        if (usePlayerProps.health <= 0) {
            break;
        } else {
            await waitTick();
        };
    };
};


// handles spawning in enemies
function summonEnemy(enemyObject, spawnX, spawnY) {
    const summonedEnemy = new enemyObject;
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