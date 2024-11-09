const mainDiv = document.getElementById('mainDiv');
const mainCanvas = document.getElementById('mainCanvas');
const shopItems = document.getElementById('shopDiv');
const shopOptions = shopItems.children;
const ctx = mainCanvas.getContext('2d');

// variables and settings
// settings
const settings = {
    explosionLinger: 1500,
    minHordRange: 5,
    gridRes: 5,
    refreshRate: 10,
    mouseSwingRate: 50,
    dropHearSize: [50, 50],
    bulletSpeed: -5,
    currentLevel: 0,
    currentWave: 0,
    timeBeforeNextWave: 2500,
    maxTimeBeforeNextWave: 18000,
    startPosition: [250, 250],
    hasShownTransition: false,
    waveDisplayTime: 250,
};

function inBounds(x, y) {
    if (x < 0) {
        x = 0;
    };
    if (x > mainCanvas.width) {
        x = mainCanvas.width;
    };
    if (y < 0) {
        y = 0;
    };
    if (y > mainCanvas.height) {
        y = mainCanvas.height;
    };
    return ([x, y]);
};

function lineIntersects(x1, y1, x2, y2, xMin, yMin, xMax, yMax) {
    function ccw(x1, y1, x2, y2, x3, y3) {
        return((y3 - y1) * (x2 - x1) > (y2 - y1) * (x3 - x1));
    };

    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        return(ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) && ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4));
    };

    if (
        intersect(x1, y1, x2, y2, xMin, yMin, xMin, yMax) ||
        intersect(x1, y1, x2, y2, xMin, yMax, xMax, yMax) ||
        intersect(x1, y1, x2, y2, xMax, yMax, xMax, yMin) ||
        intersect(x1, y1, x2, y2, xMax, yMin, xMin, yMin)
    ) {
        return(true);
    }
    return(false);
};

function getDistance(point1, point2) {
    const dX = (point2.x - point1.x);
    const dY = (point2.y - point1.y);
    const distance = Math.sqrt(dX ** 2 + dY ** 2);
    return ([dX, dY, distance]);
};

function makeImage(url) {
    const image = new Image();
    try {
        image.src = url;
    } catch {
        image.src = 'textures/missing.png';
    };
    return (image);
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
    berserkerGoblinFullHealth: makeImage('textures/enemies/berserkerGoblin/berserkerGoblin3.png'),
    berserkerGoblinHalfHealth: makeImage('textures/enemies/berserkerGoblin/berserkerGoblin2.png'),
    berserkerGoblinNearDeath: makeImage('textures/enemies/berserkerGoblin/berserkerGoblin1.png'),
    archerGoblinFullHealth: makeImage('textures/enemies/archerGoblin/archerGoblin3.png'),
    archerGoblinHalfHealth: makeImage('textures/enemies/archerGoblin/archerGoblin2.png'),
    archerGoblinNearDeath: makeImage('textures/enemies/archerGoblin/archerGoblin1.png'),
    bombGoblinFullHealth: makeImage('textures/enemies/bombGoblin/bombGoblin3.png'),
    bombGoblinHalfHealth: makeImage('textures/enemies/bombGoblin/bombGoblin2.png'),
    bombGoblinNearDeath: makeImage('textures/enemies/bombGoblin/bombGoblin1.png'),
    bombGoblinFullHealthLit: makeImage('textures/enemies/bombGoblin/bombGoblinLit3.png'),
    bombGoblinHalfHealthLit: makeImage('textures/enemies/bombGoblin/bombGoblinLit2.png'),
    bombGoblinNearDeathLit: makeImage('textures/enemies/bombGoblin/bombGoblinLit1.png'),
    biterGoblinFullHealth: makeImage('textures/enemies/biterGoblin/biterGoblin3.png'),
    weaponDefaultSword: makeImage('textures/weapons/defaultSword.png'),
    weaponLongSword: makeImage('textures/weapons/longSword.png'),
    weaponBow: makeImage('textures/weapons/bow.png'),
    weaponGoldBow: makeImage('textures/weapons/goldBow.png'),
    weaponCrossbow: makeImage('textures/weapons/crossbow.png'),
    bulletArrow: makeImage('textures/weapons/arrow.png'),
    bulletGoldArrow: makeImage('textures/weapons/goldArrow.png'),
    bulletCrossArrow: makeImage('textures/weapons/crossArrow.png'),
    heart: makeImage('textures/drops/heart.png'),
    explosion: makeImage('textures/explosion.png'),
    plainsBackground: makeImage('textures/areas/plainBackground.png'),
    plainsForeground: makeImage('textures/areas/plainForeground.png'),
    shopBackground1: makeImage('textures/shopBackground/background1.png'),
};

class effectExplosion {
    x = 0;
    y = 0;
    sizeX = 200;
    sizeY = 200;
    texture = gameTextures.explosion;
    dead = false;
    activate = function () {
        setTimeout(() => {
            this.dead = true;
        }, settings.explosionLinger);
    };
};

let usePlayerProps = null;
const currentBullets = [];
const currentDropItems = [];
const currentEnemies = [];
const currentHords = [];
const currentForegrounds = [];

// function for calculating weapon position
function getWeaponPosition(x, y, mouseX, mouseY, sizeX, sizeY, offset, attacking) {
    const dX = mouseX - x;
    const dY = mouseY - y;
    const angle = Math.atan2(dY, dX) + Math.PI / 2;
    const offsetX = (-1 * (sizeX / 2));
    const offsetY = (-1 * (sizeY / 2) + (attacking ? offset * (4 / 3) : offset));
    return ([angle, offsetX, offsetY]);
};

class weaponHands {
    swingable = false;
    attackRange = 5;
    damage = 15;
    swingDamge = 0;
    attackDuration = 500;
    attackCoolDown = 150;
    canBlock = false;
    blockDuration = 0;
    blockCoolDown = 0;
    texture = null;
    displayName = 'Hands';
    sizeX = 0;
    sizeY = 0;
    offset = 0;
    draw(x, y, angle, offsetX, offsetY, blocking) {
        if (!this.texture || !this.sizeX || !this.sizeY) {
            return (false);
        };
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + (blocking ? (Math.PI / 2) : 0));
        ctx.drawImage(this.texture, (blocking ? offsetY * 2 / 3 : offsetX), (blocking ? offsetX : offsetY), this.sizeX, this.sizeY);
        ctx.restore();
    };
};

class arrow {
    source = null;
    sizeX = 100;
    sizeY = 100;
    boxSizeX = 50;
    boxSizeY = 50;
    useTexture = gameTextures.bulletArrow;
    x = 0;
    y = 0;
    angle = 0;
    damage = 25;
    draw() {
        if (!this.useTexture || !this.sizeX || !this.sizeY) {
            return (false);
        };
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.useTexture, -1 * (this.sizeX / 2), -1 * (this.sizeY / 2), this.sizeX, this.sizeY);
        ctx.restore();
    };
};

class goldArrow extends arrow {
    constructor() {
        super();
        this.useTexture = gameTextures.bulletGoldArrow;
        this.damage = 50;
    };
}

class crossbow extends arrow {
    constructor() {
        super();
        this.useTexture = gameTextures.bulletCrossArrow;
        this.damage = 150;
    };
}

class weaponBow extends weaponHands {
    constructor() {
        super();
        this.fireRate = 1000;
        this.useBullet = arrow;
        this.swingable = false;
        this.attackRange = 250;
        this.damage = 0;
        this.swingDamge = 0;
        this.attackDuration = 0;
        this.attackCoolDown = 0;
        this.texture = gameTextures.weaponBow;
        this.displayName = 'Bow';
        this.sizeX = 50;
        this.sizeY = 50;
        this.yOffset = -75;
    };
    shoot(x1, x2, y1, y2, source) {
        const dX = x2 - x1;
        const dY = y2 - y1;
        const angle = Math.atan2(dY, dX) + Math.PI / 2;
        const shotArrow = new this.useBullet;
        shotArrow.source = source;
        const averageSize = (shotArrow.boxSizeX + shotArrow.boxSizeY) / 2;
        shotArrow.x = x1 + (-1 * (this.yOffset) - averageSize) * Math.cos(angle - Math.PI / 2);
        shotArrow.y = y1 + (-1 * (this.yOffset) - averageSize) * Math.sin(angle - Math.PI / 2);
        shotArrow.angle = angle;
        currentBullets.push(shotArrow);
    };
};

class weaponCrossbow extends weaponBow {
    constructor() {
        super();
        this.fireRate = 5000;
        this.useBullet = crossbow;
        this.texture = gameTextures.weaponCrossbow;
        this.displayName = 'Crossbow';
    };
};

class weaponGoldBow extends weaponBow {
    constructor() {
        super();
        this.fireRate = 750;
        this.useBullet = goldArrow;
        this.texture = gameTextures.weaponGoldBow;
        this.displayName = 'Gold Bow';
    };
};

class weaponDefaultSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 80;
        this.damage = 35;
        this.swingDamge = 4.6;
        this.attackDuration = 750;
        this.attackCoolDown = 250;
        this.canBlock = true;
        this.blockDuration = 1000;
        this.blockCoolDown = 500;
        this.texture = gameTextures.weaponDefaultSword;
        this.displayName = 'Sword';
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
        this.swingDamge = 11.3;
        this.attackDuration = 800;
        this.attackCoolDown = 950;
        this.texture = gameTextures.weaponLongSword;
        this.displayName = 'Long Sword';
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
    x = settings.startPosition[0];
    y = settings.startPosition[1];
    velocityX = 0;
    velocityY = 0;
    keyMovment = {
        w: 0,
        a: 0,
        s: 0,
        d: 0,
    };
    bites = 0;
    updateXY() {
        if (this.bites > 0) {
            return;
        };
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
    initialAttackAngle = 0;
    canBlock = true;
    blocking = false;
    isShooting = false;
    canShoot = true;
    shooting = false;
    currentWeapon = 'sword';
    weaponData = new weaponDefaultSword;
    bowData = new weaponBow;
};

function fillMap(sources, sSX, sSY, pathMap) {
    const enemyLength = currentEnemies.length;
    for (let i = 0; i < enemyLength; i++) {
        const enemy = currentEnemies[i];
        if (!sources.includes(enemy)) {
            const nearestX = Math.round(enemy.x / settings.gridRes) * settings.gridRes;
            const nearestY = Math.round(enemy.y / settings.gridRes) * settings.gridRes;
            const nearestHitBoxX = Math.round(((enemy.hitBoxX / 2) + (sSX / 2)) / settings.gridRes) * settings.gridRes;
            const nearestHitBoxY = Math.round(((enemy.hitBoxY / 2) + (sSY / 2)) / settings.gridRes) * settings.gridRes;

            const minX = nearestX - nearestHitBoxX;
            const minY = nearestY - nearestHitBoxY;
            const maxX = nearestX + nearestHitBoxX;
            const maxY = nearestY + nearestHitBoxY;
            for (let x = minX; x < maxX; x += settings.gridRes) {
                if (x >= 0 && x <= mainCanvas.width) {
                    for (let y = minY; y < maxY; y += settings.gridRes) {
                        if (y >= 0 && y <= mainCanvas.height) {
                            pathMap.get(x)[y] = {
                                x: x,
                                y: y,
                                f: 0,
                                g: 0,
                                h: 0,
                                walkAble: false,
                                parent: null,
                            };
                        };
                    };
                };
            };
        };
    };

    for (let x = 0; x < mainCanvas.width + settings.gridRes; x += settings.gridRes) {
        if (Object.entries(pathMap.get(x)).length <= 100) {
            for (let y = 0; y < mainCanvas.height + settings.gridRes; y += settings.gridRes) {
                if (!pathMap.get(x)[y]) {
                    pathMap.get(x)[y] = {
                        x: x,
                        y: y,
                        f: 0,
                        g: 0,
                        h: 0,
                        walkAble: true,
                        parent: null,
                    };
                };
            };
        };
    };
};

function heuristic(pos0, pos1) {
    return (Math.abs(pos1.x - pos0.x) + Math.abs(pos1.y - pos0.y));
};

function getNeighbors(x, y, pathMap) {
    const neighbors = [];
    if (pathMap.get(x)[y + settings.gridRes]) { // up
        const entry = pathMap.get(x)[y + settings.gridRes];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x + settings.gridRes)) { // north east
        const entry = pathMap.get(x + settings.gridRes)[y + settings.gridRes];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x + settings.gridRes)) { // right
        const entry = pathMap.get(x + settings.gridRes)[y];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x + settings.gridRes)) { // south east
        const entry = pathMap.get(x + settings.gridRes)[y - settings.gridRes];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x)[y - settings.gridRes]) { // down
        const entry = pathMap.get(x)[y - settings.gridRes];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x - settings.gridRes)) { // south west
        const entry = pathMap.get(x - settings.gridRes)[y - settings.gridRes];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x - settings.gridRes)) { // left
        const entry = pathMap.get(x - settings.gridRes)[y];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    if (pathMap.get(x - settings.gridRes)) { // north west
        const entry = pathMap.get(x - settings.gridRes)[y + settings.gridRes];
        if (entry && entry.walkAble) {
            neighbors.push(entry);
        };
    };
    return (neighbors);
};

function makePath(start, end, maxIterations, pathMap) {
    const path = [];
    const openSet = [start];
    const closedSet = [];
    let iterations = 0;
    while (openSet.length > 0) {
        iterations += 1;
        if (iterations > maxIterations) {
            break;
        };
        let lowestIndex = 0;
        const openLength = openSet.length;
        for (let i = 0; i < openLength; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            };
        };

        let currentPoint = openSet[lowestIndex];
        if (currentPoint === end) {
            let temp = currentPoint;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            };
            return (path.reverse());
        };

        openSet.splice(lowestIndex, 1);
        closedSet.push(currentPoint);

        const neighbors = getNeighbors(currentPoint.x, currentPoint.y, pathMap);
        const totalNeighbors = neighbors.length;
        for (let i = 0; i < totalNeighbors; i++) {
            const neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                const possibleG = currentPoint.g + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (possibleG >= neighbor.g) {
                    continue;
                };

                neighbor.g = possibleG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentPoint;
            };
        };
    };

    return ([]); // no path
};

function handlePathing(source) {
    const [eX, eY] = inBounds(Math.round(source.x / settings.gridRes) * settings.gridRes, Math.round(source.y / settings.gridRes) * settings.gridRes);
    const [pX, pY] = inBounds(Math.round(usePlayerProps.x / settings.gridRes) * settings.gridRes, Math.round(usePlayerProps.y / settings.gridRes) * settings.gridRes);
    const maxIterations = Math.round(Math.sqrt((pX - eX) ** 2 + (pY - eY) ** 2) * 1.5);

    if (maxIterations <= 25) {
        return ([]);
    };

    const pathMap = new Map();
    for (let mapX = 0; mapX < mainCanvas.width + settings.gridRes; mapX += settings.gridRes) {
        pathMap.set(mapX, {});
    };

    fillMap([source], source.hitBoxX, source.hitBoxY, pathMap);

    //console.log(eX+' , '+eY);
    const start = pathMap.get(eX)[eY];
    const end = pathMap.get(pX)[pY];
    const path = makePath(start, end, maxIterations, pathMap);
    if (path[0]) {
        path.splice(0, 1);
    };

    return (path);
};

function getMyHord(source) {
    const hordLength = currentHords.length;
    for (let i = 0; i < hordLength; i++) {
        const hord = currentHords[i];
        if (hord.members.includes(source)) {
            return (hord);
        }
    };
    return (false);
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
    die(noDrops) {
        if (!noDrops) {
            const heart = new heartItem(this.x, this.y);
            currentDropItems.push(heart);
        };
        const enemyLength = currentEnemies.length;
        for (let i = 0; i < enemyLength; i++) {
            if (currentEnemies[i] === this) {
                currentEnemies.splice(i, 1);
            };
        };
    };
    draw(x, y) {
        ctx.drawImage(this.useTexture, x - this.sizeX / 2, y - this.sizeY / 2, this.sizeX, this.sizeY);
    };
    starterHealth = 100;
    health = 100;
    getUseTexture() {
        if (this.health > this.starterHealth * 2 / 3) {
            this.useTexture = this.fullHealth;
        } else if (this.health <= this.starterHealth * 2 / 3 && this.health > this.starterHealth * 1 / 3) {
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
    canShoot = true;
    shooting = false;
    attackRangeMultiplier = 1;
    attackDamageMultiplier = 1;
    currentWeapon = 'sword';
    weaponData = new weaponHands;
    bowData = null;

    // movment/tick stuff
    movementSpeed = 1.5;
    checkTick = [0, 10000];
    swingAttackClock = [0, 10];
    path = [];
    moving = false;

    move(dX, dY, distance) {
        const nX = dX / distance;
        const nY = dY / distance;
        this.x += nX * this.movementSpeed;
        this.y += nY * this.movementSpeed;
        const averageHitBox = (this.hitBoxX + this.hitBoxY) / 2;

        const enemyLength = currentEnemies.length;
        for (let i = 0; i < enemyLength; i++) {
            const enemy = currentEnemies[i];
            if (enemy != this) {
                const enemyDifX = enemy.x - this.x;
                const enemyDifY = enemy.y - this.y;
                const enemyDist = Math.sqrt(enemyDifX ** 2 + enemyDifY ** 2);
                const averageEnemyHitBox = (enemy.hitBoxX + enemy.hitBoxY) / 2;
                if (enemyDist <= averageHitBox + averageEnemyHitBox) {
                    const strength = (enemyDist > averageHitBox ? 0 : -1 * (averageHitBox - enemyDist) / averageHitBox);
                    if (averageHitBox > averageEnemyHitBox) { // If you are bigger you push them
                        enemy.x += -1 * strength * enemyDifX;
                        enemy.y += -1 * strength * enemyDifY;
                    } else {
                        this.x += strength * enemyDifX;
                        this.y += strength * enemyDifY;
                    };
                };
            };
        };
        const [pDX, pDY, playerDistance] = getDistance(usePlayerProps, this);
        const averagePlayerHitBox = (usePlayerProps.sizeX + usePlayerProps.sizeY) / 2;
        if (playerDistance <= averageHitBox + averagePlayerHitBox) {
            const strength = (playerDistance > averageHitBox ? 0 : -1 * (averageHitBox - playerDistance) / averageHitBox);
            this.x += strength * pDX;
            this.y += strength * pDY;
        };
    };

    handleMovment() {
        const endPos = [0, 0];
        const hord = getMyHord(this);
        if (hord) {
            if (hord.path[0]) {
                //console.log(hord.path);
                endPos[0] = this.x + (hord.path[0].x - hord.x);
                endPos[1] = this.y + (hord.path[0].y - hord.y);
            } else {
                endPos[0] = usePlayerProps.x;
                endPos[1] = usePlayerProps.y;
            };
        } else {
            this.path = handlePathing(this);
            if (this.path[0]) {
                endPos[0] = this.path[0].x;
                endPos[1] = this.path[1].y;
            } else {
                endPos[0] = usePlayerProps.x;
                endPos[1] = usePlayerProps.y;
            };
        };
        const dX = endPos[0] - this.x;
        const dY = endPos[1] - this.y;
        const distance = Math.sqrt(dX ** 2 + dY ** 2);
        this.move(dX, dY, distance);
    };

    attack() {
        if (this.canAttack) {
            this.canAttack = false;
            this.attacking = true;
            if (usePlayerProps.blocking) {
                const dX = (usePlayerProps.x - this.x);
                const dY = (usePlayerProps.y - this.y);
                const attackAngle = Math.atan2(dY, dX);
                const playerAngle = getMouseAngle();
                const difference = Math.abs(playerAngle - attackAngle);

                if (difference < (29 * Math.PI / 36) || difference > (43 * Math.PI / 36)) {
                    console.log('FREE HIT!');
                    usePlayerProps.health -= this.weaponData.damage * this.attackDamageMultiplier;
                };
            } else {
                usePlayerProps.health -= this.weaponData.damage * this.attackDamageMultiplier;
            }
            setTimeout(() => {
                this.attacking = false;
                setTimeout(() => {
                    this.canAttack = true;
                }, this.weaponData.attackCoolDown);
            }, this.weaponData.attackDuration);
        };
    };

    shoot() {
        if (this.canShoot) {
            this.canShoot = false;
            this.shooting = true;
            this.bowData.shoot(this.x, usePlayerProps.x, this.y, usePlayerProps.y, 'enemy');
            setTimeout(() => {
                this.canShoot = true;
                this.shooting = false;
            }, this.bowData.fireRate);
        };
    };

    criticalTickAction() {
        this.checkTick[0] += 1;
        const [dX, dY, distance] = getDistance(usePlayerProps, this);
        const trueDistance = distance - (this.hitBoxX + this.hitBoxY) / 2;

        // swing tick stuff
        if (this.checkTick[0] >= this.checkTick[1]) {
            this.checkTick[0] = 0;
        };
        if (this.wasSwingAttacked) {
            this.swingAttackClock[0] += 1;
            if (this.swingAttackClock[0] >= this.swingAttackClock[1]) {
                this.swingAttackClock[0] = 0;
                this.wasSwingAttacked = false;
            };
        };

        return (trueDistance);
    }

    tickAction() {
        const trueDistance = this.criticalTickAction();

        // action stuff
        if (this.weaponData && (trueDistance <= this.weaponData.attackRange * this.attackRangeMultiplier * 5 / 3)) {
            this.currentWeapon = 'sword';
            if (trueDistance > this.weaponData.attackRange * this.attackRangeMultiplier) {
                this.moving = true;
                this.handleMovment();
            } else {
                this.moving = false;
                this.attack();
            };
        } else if (this.bowData && (trueDistance <= this.bowData.attackRange * 5 / 3)) {
            if (trueDistance > this.bowData.attackRange) {
                this.moving = true;
                this.handleMovment();
            } else {
                this.moving = false;
            };
            this.currentWeapon = 'bow';
            this.shoot();
        } else {
            this.moving = true;
            this.handleMovment();
        };
    };
};

class archerGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.archerGoblinFullHealth;
        this.halfHealth = gameTextures.archerGoblinHalfHealth;
        this.nearDeath = gameTextures.archerGoblinNearDeath;
        this.starterHealth = 100;
        this.health = 100;
    };
};

class berserkerGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.movementSpeed = 2.5;
        this.attackDamageMultiplier = 2;
        this.fullHealth = gameTextures.berserkerGoblinFullHealth;
        this.halfHealth = gameTextures.berserkerGoblinHalfHealth;
        this.nearDeath = gameTextures.berserkerGoblinNearDeath;
        this.starterHealth = 75;
        this.health = 75;
    };
};

class bombGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.movementSpeed = 1;
        this.fullHealth = gameTextures.bombGoblinFullHealth;
        this.halfHealth = gameTextures.bombGoblinHalfHealth;
        this.nearDeath = gameTextures.bombGoblinNearDeath;
        this.fullHealthLit = gameTextures.bombGoblinFullHealthLit;
        this.halfHealthLit = gameTextures.bombGoblinHalfHealthLit;
        this.nearDeathLit = gameTextures.bombGoblinNearDeathLit;
        this.starterHealth = 100;
        this.health = 100;
        this.exploding = false;
        this.explodeIn = 500;
        this.explosionDamage = 100;
        this.bombRange = 50;
        this.explosionRange = 150;
    };

    explode() {
        if (this.health > 0) {
            const enemyLength = currentEnemies.length;
            const myAverageHitBoxSize = (this.hitBoxX + this.hitBoxY) / 2;

            // hurts enemies
            for (let i = enemyLength - 1; i >= 0; i--) {
                const enemy = currentEnemies[i];
                if (this !== enemy && enemy) {
                    const [dX, dY, distance] = getDistance(enemy, this);

                    if (distance < this.explosionRange - (myAverageHitBoxSize + (enemy.hitBoxX + enemy.hitBoxY) / 2)) {
                        if (enemy.explode && !enemy.exploding) {
                            enemy.exploding = true;
                            enemy.explode();
                        } else {
                            enemy.health -= this.explosionDamage;
                        };
                    };
                };
            };

            // hurts player
            const [dX, dY, distance] = getDistance(usePlayerProps, this);
            if (distance < this.explosionRange - (myAverageHitBoxSize + (usePlayerProps.sizeX + usePlayerProps.sizeY) / 2)) {
                usePlayerProps.health -= this.explosionDamage;
            };

            // destroys arrows
            const bulletLength = currentBullets.length;
            for (let i = bulletLength - 1; i >= 0; i--) {
                const bullet = currentBullets[i];
                const [dX, dY, distance] = getDistance(bullet, this);
                if (distance < this.explosionRange - (myAverageHitBoxSize + (bullet.boxSizeX + bullet.boxSizeY) / 2)) {
                    currentBullets.splice(i, 1);
                };
            };

            const effect = new effectExplosion;
            effect.x = this.x;
            effect.y = this.y;
            effect.activate();
            currentForegrounds.push(effect);
            this.die(true);
        };
    };

    tickAction() { // for bomb goblin
        const trueDistance = this.criticalTickAction();
        if (this.exploding) {
            return;
        };

        // action stuff
        if (trueDistance <= this.bombRange) {
            this.exploding = true;
            setTimeout(() => {
                this.explode();
            }, this.explodeIn);
        } else {
            this.handleMovment();
        };
    };

    getUseTexture() {
        if (this.health > this.starterHealth * 2 / 3) {
            if (this.exploding) {
                this.useTexture = this.fullHealthLit;
            } else {
                this.useTexture = this.fullHealth;
            };
        } else if (this.health <= this.starterHealth * 2 / 3 && this.health > this.starterHealth * 1 / 3) {
            if (this.exploding) {
                this.useTexture = this.halfHealthLit;
            } else {
                this.useTexture = this.halfHealth;
            };
        } else {
            if (this.exploding) {
                this.useTexture = this.nearDeathLit;
            } else {
                this.useTexture = this.nearDeath;
            };
        };
    };
};

class biterGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 20;
        this.sizeY = 20;
        this.hitBoxX = 20;
        this.hitBoxY = 20;
        this.useTexture = gameTextures.biterGoblinFullHealth;
        this.starterHealth = 25;
        this.health = 25;
        this.movementSpeed = 3.5;
        this.singleTexture = true;
        this.bit = false;
        this.biteDamage = 10;
        this.biteRange = 5;
    };

    tickAction() { // for biter goblin
        const trueDistance = this.criticalTickAction();
        if (this.bit) {
            return;
        };

        // action stuff
        if (trueDistance <= this.biteRange) {
            usePlayerProps.bites += 1;
            usePlayerProps.health -= this.biteDamage;
            this.bit = true
        } else {
            this.handleMovment();
        };
    };

    die() {
        usePlayerProps.bites -= 1;
        super.die();
    }
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
// End

const levelData = [
    {
        background: gameTextures.plainsBackground,
        foreground: gameTextures.plainsForeground,
        transition: [
            [gameTextures.missingTexture, 10],
        ],
        waves: [ // spawnTick#, enemy, [weaponData, bowData] , [x,y]
            [
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
                [200, biterGoblin, [null, null], [300, 200]],
            ],
            [
                [200, goblin, [weaponDefaultSword, weaponBow], [450, 500]],
            ],
        ],
        shopItems: {
            weapons: [
                weaponDefaultSword, weaponLongSword,
            ],
            bows: [
                weaponGoldBow, weaponBow,
            ],
        },
    },
];









// critical functions and setup functions
// wait tick system
function waitTick() {
    return new Promise((success) => {
        setTimeout(() => {
            success();
        }, settings.refreshRate);
    });
};
// End









// game loop

// makes background for title screen
function makeTitleScreenBackground() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fillStyle = 'rgb(255 0 0)';
    ctx.beginPath();
    ctx.rect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.fill();
};

// loads on death options
function optionsOnDeath() {
    makeTitleScreenBackground()
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.id = 'retryButton';
    mainDiv.appendChild(retryButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.id = 'resetButton';
    mainDiv.appendChild(resetButton);

    return new Promise((results) => {
        retryButton.addEventListener('click', function () {
            retryButton.remove();
            resetButton.remove();
            results(true);
        });
        resetButton.addEventListener('click', function () {
            retryButton.remove();
            resetButton.remove();
            results(false);
        });
    });
}

function handleShop() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.beginPath();
    ctx.drawImage(gameTextures.shopBackground1, 0, 0);
    ctx.closePath();

    const useShopGear = [levelData[settings.currentLevel - 1].shopItems.weapons[0], levelData[settings.currentLevel - 1].shopItems.weapons[1], levelData[settings.currentLevel - 1].shopItems.bows[0], levelData[settings.currentLevel - 1].shopItems.bows[1]];
    shopItems.style.opacity = 1;
    shopItems.style.zIndex = 10;
    for (let i = 0; i < 4; i++) {
        const useGear = new useShopGear[i];
        useShopGear[i] = useGear;
        console.log(useGear);
        let useArrow = null;
        if (i > 1) {
            useArrow = new useGear.useBullet;
        };
        const useShopButton = shopOptions[i + 1];
        const pName = useShopButton.children[0];
        const pDamage = useShopButton.children[1];
        const pSwingDamage = useShopButton.children[2];
        const pRTime = useShopButton.children[3];
        const pRange = useShopButton.children[4];
        pName.textContent = useGear.displayName;
        if (!useArrow) {
            pDamage.textContent = 'Dmg: ' + String(useGear.damage) + 'hp';
            pRTime.textContent = 'Dur: ' + String(useGear.attackDuration / 100) + 'sec | Cd: ' + String(useGear.attackCoolDown / 100) + 'sec';
            pRange.textContent = 'Range: ' + String(useGear.attackRange) + 'px';
        } else {
            pDamage.textContent = 'Dmg: ' + String(useArrow.damage) + 'hp';
            pRTime.textContent = 'Cd: ' + String(useGear.fireRate / 1000) + 'sec';
            pRange.textContent = 'Range: Unlimited';
        };
        pSwingDamage.textContent = 'Swing Dmg: ' + String(useGear.swingDamge) + 'hp';
    };


    return new Promise((results) => {
        const SelectedGear = [null, null];
        for (let i = 0; i < 4; i++) {
            const useGear = useShopGear[i];
            const useShopButton = shopOptions[i + 1];
            const useIndex = ((i < 2) ? 0 : 1);
            let mouseOver = false;
            useShopButton.addEventListener('mouseenter', function () {
                if (SelectedGear[useIndex] != useShopGear[i]) {
                    mouseOver = true;
                    useShopButton.style.backgroundColor = 'rgb(175, 130, 96)';
                    useShopButton.style.border = '2.5px solid rgb(84, 52, 27)';
                };
            });
            useShopButton.addEventListener('mouseleave', function () {
                if (SelectedGear[useIndex] != useShopGear[i]) {
                    mouseOver = false;
                    useShopButton.style.backgroundColor = 'rgb(207, 156, 116)';
                    useShopButton.style.border = '2.5px solid rgb(138, 93, 59)';
                };
            });
            useShopButton.addEventListener('click', function () {
                if (SelectedGear[useIndex] != useShopGear[i]) {
                    const oppIndex = (!(i - (useIndex * 2)) + (useIndex * 2));
                    if (SelectedGear[useIndex] == useShopGear[oppIndex]) {
                        const oppButton = shopOptions[oppIndex + 1];
                        oppButton.style.backgroundColor = 'rgb(207, 156, 116)';
                        oppButton.style.borderColor = 'rgb(84, 52, 27)';
                    };
                    SelectedGear[useIndex] = useGear;
                    useShopButton.style.backgroundColor = 'rgb(90, 59, 36)';
                    useShopButton.style.borderColor = 'rgb(58, 32, 12)';
                } else {
                    SelectedGear[useIndex] = null;
                    if (mouseOver) {
                        useShopButton.style.backgroundColor = 'rgb(175, 130, 96)';
                        useShopButton.style.border = '2.5px solid rgb(84, 52, 27)';
                    } else {
                        useShopButton.style.backgroundColor = 'rgb(207, 156, 116)';
                        useShopButton.style.borderColor = 'rgb(84, 52, 27)';
                    };
                };
            });
        };
        shopOptions[0].addEventListener('click', function () {
            if (SelectedGear[0]) {
                usePlayerProps.weaponData = SelectedGear[0];
            };
            if (SelectedGear[1]) {
                usePlayerProps.bowData = SelectedGear[1];
            };
            shopItems.style.opacity = 0;
            shopItems.style.zIndex = 0;
            for (let i = 0; i < 4; i++) {
                const useShopButton = shopOptions[i + 1];
                useShopButton.style.backgroundColor = 'rgb(207, 156, 116)';
                useShopButton.style.border = '2.5px solid rgb(138, 93, 59)';
            }
            results();
        });
    });
};

// loads main menu
function makeLoadingScreen() {
    makeTitleScreenBackground()

    const startButton = document.createElement('button');
    startButton.textContent = 'Play';
    startButton.id = 'playButton';
    mainDiv.appendChild(startButton);

    return new Promise((success) => {
        startButton.addEventListener('click', function () {
            startButton.remove();
            success();
        });
    });
};

// boots up game
function bootGame() {
    settings.hasShownTransition = false;
    settings.currentLevel = 0;
    settings.currentWave = 0;
    amountSummoned = 0;
    stillEnemiesToSummon = true;
    gameClock = 0;
    usePlayerProps = new playerProps();
    currentEnemies.splice(0, currentEnemies.length);
    currentBullets.splice(0, currentBullets.length);
    currentDropItems.splice(0, currentDropItems.length);
    currentForegrounds.splice(0, currentForegrounds.length);

    return new Promise((success) => {
        success();
    });
};

// reloads game
function reloadGame() {
    settings.currentLevel = 0;
    settings.currentWave = 0;
    amountSummoned = 0;
    stillEnemiesToSummon = true;
    gameClock = 0;

    usePlayerProps.x = settings.startPosition[0];
    usePlayerProps.y = settings.startPosition[1];
    usePlayerProps.health = 100;
    usePlayerProps.maxHealth = 100;
    usePlayerProps.velocityX = 0;
    usePlayerProps.velocityY = 0;
    usePlayerProps.keyMovment.w = 0;
    usePlayerProps.keyMovment.a = 0;
    usePlayerProps.keyMovment.s = 0;
    usePlayerProps.keyMovment.d = 0;
    usePlayerProps.mouseX = 0;
    usePlayerProps.mouseY = 0;
    usePlayerProps.isSwinging = false;
    usePlayerProps.canAttack = true;
    usePlayerProps.attacking = false;
    usePlayerProps.isShooting = false;
    usePlayerProps.canShoot = true;
    usePlayerProps.shooting = false;
    usePlayerProps.currentWeapon = 'sword';
    usePlayerProps.bites = 0;
    usePlayerProps.initialAttackAngle = 0;

    currentEnemies.splice(0, currentEnemies.length);
    currentBullets.splice(0, currentBullets.length);
    currentDropItems.splice(0, currentDropItems.length);
    currentForegrounds.splice(0, currentForegrounds.length);
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
    return (Math.atan2(dY, dX));
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
    const currentAngle = getMouseAngle();
    const directionHistoryLength = savedMouseDirections.length;
    usePlayerProps.isSwinging = false;
    for (let i = 0; i < directionHistoryLength; i++) {
        const useDirection = savedMouseDirections[i];
        if ((Math.abs(useDirection) > Math.abs(currentAngle) + .5) || Math.abs(useDirection) + .5 < Math.abs(currentAngle)) {
            usePlayerProps.isSwinging = true;
            break
        };
    };
    //console.log('results='+usePlayerProps.isSwinging);
    savedMouseDirections = [];
};

// gets mouse click
function establishMouseClick(event) {
    if (usePlayerProps.currentWeapon == 'sword') {
        if (usePlayerProps.canAttack) {
            usePlayerProps.canAttack = false;
            usePlayerProps.attacking = true;
            usePlayerProps.blocking = false;
            usePlayerProps.initialAttackAngle = getMouseAngle();
            setTimeout(() => {
                usePlayerProps.attacking = false;
                usePlayerProps.initialAttackAngle = 0;
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
            usePlayerProps.bowData.shoot(usePlayerProps.x, usePlayerProps.mouseX, usePlayerProps.y, usePlayerProps.mouseY, 'player');
            setTimeout(() => {
                usePlayerProps.canShoot = true;
                usePlayerProps.shooting = false;
            }, usePlayerProps.bowData.fireRate);
        };
    };
};

// gets right mouse click
function establishRightMouseClick(event) {
    event.preventDefault();
    const useWeapon = (usePlayerProps.currentWeapon == 'sword' ? usePlayerProps.weaponData : usePlayerProps.bowData);
    if (useWeapon.canBlock) {
        usePlayerProps.blocking = !usePlayerProps.blocking;
    };
};


// draws the HUD
function drawHUD() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.rect((mainCanvas.width - 250) / 2, mainCanvas.height - 30, 250, 25);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    if (usePlayerProps.health >= 50) {
        ctx.fillStyle = `rgba(${255 * ((usePlayerProps.maxHealth - usePlayerProps.health) * .02)}, 255, 1)`;
    } else {
        ctx.fillStyle = `rgba(255, ${Math.floor(255 * (usePlayerProps.health / usePlayerProps.maxHealth))}, 0, 1)`;
    };
    ctx.rect((mainCanvas.width - 242.5) / 2, mainCanvas.height - 27.5, 242.5 * (usePlayerProps.health / 100), 20);
    ctx.fill();
    ctx.closePath();
}

// draws dropped items
function drawDroppedItems() {
    const droppedLength = currentDropItems.length;
    for (let i = droppedLength - 1; i > -1; i--) {
        const currentDroppedItem = currentDropItems[i];
        const distanceFromPlayer = Math.sqrt((usePlayerProps.x - currentDroppedItem.x) ** 2 + (usePlayerProps.y - currentDroppedItem.y) ** 2);
        if (distanceFromPlayer > (currentDroppedItem.sizeX + currentDroppedItem.sizeY) / 2) {
            currentDroppedItem.draw();
        } else {
            currentDroppedItem.pickUp();
            currentDropItems.splice(i, 1);
        };
    };
};

// handles moving bullets
function moveBullets() {
    const bulletLength = currentBullets.length;
    for (let i = bulletLength - 1; i > -1; i--) {
        const useBullet = currentBullets[i];
        useBullet.x += (settings.bulletSpeed * Math.cos(useBullet.angle + Math.PI / 2));
        useBullet.y += (settings.bulletSpeed * Math.sin(useBullet.angle + Math.PI / 2));
        if (useBullet.x < 0 || useBullet.x > mainCanvas.width || useBullet.y < 0 || useBullet.y > mainCanvas.height) {
            currentBullets.splice(i, 1);
            continue;
        };
        if (useBullet.source == 'player') {
            let hitEnemy = false;
            const enemyLength = currentEnemies.length;
            for (let j = enemyLength - 1; j > -1; j--) {
                const useEnemy = currentEnemies[j];
                const distance = Math.sqrt((useEnemy.x - useBullet.x) ** 2 + (useEnemy.y - useBullet.y) ** 2);
                if (distance <= (useEnemy.hitBoxX + useEnemy.hitBoxY) / 2) {
                    hitEnemy = true;
                    useEnemy.health -= useBullet.damage;
                    if (useEnemy.health <= 0) {
                        useEnemy.die();
                    };
                };
            };
            if (hitEnemy) {
                currentBullets.splice(i, 1);
                continue;
            };
        } else {
            const distance = Math.sqrt((usePlayerProps.x - useBullet.x) ** 2 + (usePlayerProps.y - useBullet.y) ** 2);
            if (distance <= (usePlayerProps.sizeX + usePlayerProps.sizeY) / 2) {
                usePlayerProps.health -= useBullet.damage;
                currentBullets.splice(i, 1);
                continue;
            };
        };
        useBullet.draw();
        /*
        ctx.beginPath(); // For debugging!
        ctx.fillStyle = 'blue';
        ctx.rect(useBullet.x, useBullet.y, 5, 5);
        ctx.fill();
        ctx.closePath();
        */
    };
};

// handles spawning in enemies
function summonEnemy(enemyData) {
    const summonedEnemy = new enemyData[1];
    if (enemyData[2][0]) {
        summonedEnemy.weaponData = new enemyData[2][0];
    };
    if (enemyData[2][1]) {
        summonedEnemy.bowData = new enemyData[2][1];
    };
    summonedEnemy.x = enemyData[3][0];
    summonedEnemy.y = enemyData[3][1];
    currentEnemies.push(summonedEnemy);
};

// plays transition
async function wait(time) {
    return new Promise((success) => {
        setTimeout(() => { success() }, time);
    });
};

async function drawWaveNumber(i) {
    ctx.font = '25px Black Ops One';
    let useOpacity = 1;
    if (i < settings.waveDisplayTime / 3) {
        useOpacity = (i / (settings.waveDisplayTime / 3));
    } else if (i >= settings.waveDisplayTime / 3 && i <= settings.waveDisplayTime * 2 / 3) {
        useOpacity = 1;
    } else {
        useOpacity = ((settings.waveDisplayTime / i) * 2) - 2;
    };
    ctx.fillStyle = `rgba(0, 0, 0, ${useOpacity})`;
    ctx.fillText(`Wave ${settings.currentWave + 1}`, mainCanvas.width * .8, mainCanvas.height - 25, 100);
};

// plays transition
async function playTransition() {
    const transitionSlides = levelData[settings.currentLevel].transition.length;
    for (let i = 0; i < transitionSlides; i++) {
        const useImageData = levelData[settings.currentLevel].transition[i];
        ctx.drawImage(useImageData[0], 0, 0);
        await wait(useImageData[1]);
    };
};

// assigns enemys to hords
function makeHords() {
    const enemyLength = currentEnemies.length;
    for (let i = 0; i < enemyLength; i++) {
        const enemy = currentEnemies[i];
        if (!enemy.moving) {
            continue;
        };
        const enemySize = (enemy.hitBoxX + enemy.hitBoxY) / 2;
        const addToHord = [];

        for (let j = 0; j < enemyLength; j++) {
            if (i != j) {
                const otherEnemy = currentEnemies[j];
                if (!otherEnemy.moving || enemy.movementSpeed != otherEnemy.movementSpeed) {
                    continue;
                };
                const otherSize = (otherEnemy.hitBoxX + otherEnemy.hitBoxY) / 2;
                if (enemySize != otherSize) {
                    continue;
                };

                const [dX, dY, distance] = getDistance(otherEnemy, enemy);

                if (distance <= settings.minHordRange + enemySize) {
                    addToHord.push(otherEnemy);
                };
            };
        };
        if (!addToHord[0]) {
            continue;
        };

        let alreadyInAHord = false;
        const hordLength = currentHords.length;
        for (let j = 0; j < hordLength; j++) {
            const hord = currentHords[j];
            if (hord.members.includes(this)) {
                alreadyInAHord = true;
                hord.members = [...hord.members, ...addToHord];
                break;
            }
        };
        if (!alreadyInAHord) {
            addToHord.push(enemy);
            currentHords.push({
                members: addToHord,
            });
        };
    };

    const hordLength = currentHords.length;
    for (let i = 0; i < hordLength; i++) {
        const hord = currentHords[i];
        const centerPos = [0, 0];
        const memberLength = hord.members.length;
        for (let j = 0; j < memberLength; j++) {
            const member = hord.members[j];
            centerPos[0] += member.x;
            centerPos[1] += member.y;
        };
        centerPos[0] = centerPos[0] / memberLength;
        centerPos[1] = centerPos[1] / memberLength;
        hord.x = centerPos[0];
        hord.y = centerPos[1];

        const [eX, eY] = inBounds(Math.round(hord.x / settings.gridRes) * settings.gridRes, Math.round(hord.y / settings.gridRes) * settings.gridRes);
        const [pX, pY] = inBounds(Math.round(usePlayerProps.x / settings.gridRes) * settings.gridRes, Math.round(usePlayerProps.y / settings.gridRes) * settings.gridRes);
        const maxIterations = Math.round(Math.sqrt((pX - eX) ** 2 + (pY - eY) ** 2) * 1.5);

        if (maxIterations <= 25) {
            hord.path = [];
            continue;
        };

        const pathMap = new Map();
        for (let mapX = 0; mapX < mainCanvas.width + settings.gridRes; mapX += settings.gridRes) {
            pathMap.set(mapX, {});
        };

        fillMap(hord.members, hord.members[0].hitBoxX, hord.members[0].hitBoxY, pathMap);

        const start = pathMap.get(eX)[eY];
        const end = pathMap.get(pX)[pY];
        const path = makePath(start, end, maxIterations, pathMap);
        if (path[0]) {
            path.splice(0, 1);
        };

        hord.path = path;
    };
};

// main game loop
let amountSummoned = 0;
let stillEnemiesToSummon = true;
let gameClock = 0;
async function playLevel() {
    while (true) {
        // Clock stuff
        gameClock += 1;
        if ((gameClock % settings.mouseSwingRate) == 0) {
            handelSwingingCheck();
        };
        if (stillEnemiesToSummon) {
            const currentWaveData = levelData[settings.currentLevel].waves[settings.currentWave];
            if (currentWaveData) {
                const levelEnemiesLength = currentWaveData.length;
                for (let i = 0; i < levelEnemiesLength; i++) {
                    const enemyData = currentWaveData[i];
                    if (enemyData[0] == gameClock) {
                        summonEnemy(enemyData);
                        amountSummoned += 1;
                        if (amountSummoned >= levelEnemiesLength) {
                            stillEnemiesToSummon = false;
                            break;
                        };
                    };
                };
            } else {
                console.log('Next Level');
                settings.currentLevel += 1;
                break;
            };
        };
        if (gameClock >= settings.maxTimeBeforeNextWave) {
            console.log('Times up! Next wave!');
            gameClock = 0;
            settings.currentWave += 1;
            amountSummoned = 0;
            stillEnemiesToSummon = true;
        };

        // Reset/update stuff
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        ctx.drawImage(levelData[settings.currentLevel].background, 0, 0, mainCanvas.width, mainCanvas.height);
        usePlayerProps.updateXY();
        usePlayerProps.getUseTexture();

        // Draw non-characters
        moveBullets();
        drawDroppedItems();

        // Sword stab and slash debuff
        let stabSwinging = false;
        if (usePlayerProps.attacking) {
            const currentMouseAngle = getMouseAngle();
            if (Math.abs(usePlayerProps.initialAttackAngle - currentMouseAngle) > .5) {
                stabSwinging = true;
            };
        };

        // Draw player and enemies
        usePlayerProps.draw(usePlayerProps.x, usePlayerProps.y);
        const [angle, offsetX, offsetY] = getWeaponPosition(usePlayerProps.x, usePlayerProps.y, usePlayerProps.mouseX, usePlayerProps.mouseY, usePlayerProps.weaponData.sizeX, usePlayerProps.weaponData.sizeY, usePlayerProps.weaponData.offset, usePlayerProps.attacking);
        const currentEnemyLength = currentEnemies.length;
        makeHords();
        const holdingSword = (usePlayerProps.currentWeapon == 'sword');
        for (let i = currentEnemyLength - 1; i >= 0; i--) {
            const selectedEnemy = currentEnemies[i];
            if (!selectedEnemy.singleTexture) {
                selectedEnemy.getUseTexture();
            };
            selectedEnemy.tickAction();
            selectedEnemy.draw(selectedEnemy.x, selectedEnemy.y);
            const averageHitBox = (selectedEnemy.hitBoxX + selectedEnemy.hitBoxY) / 2;
            const canStab = (!selectedEnemy.wasAttacked && usePlayerProps.attacking);
            const canSwing = (!selectedEnemy.wasSwingAttacked && usePlayerProps.isSwinging && !usePlayerProps.blocking && ((usePlayerProps.currentWeapon == 'sword' && usePlayerProps.weaponData.swingable) || (usePlayerProps.currentWeapon == 'bow' && usePlayerProps.bowData.swingable)));
            if (canStab || canSwing) {
                const initialOffset = ((canStab && !stabSwinging) ? 0 : usePlayerProps.weaponData.offset);
                const x1 = usePlayerProps.x + (initialOffset * Math.cos(angle + Math.PI / 2));
                const y1 = usePlayerProps.y + (initialOffset * Math.sin(angle + Math.PI / 2));
                const x2 = usePlayerProps.x + (offsetY * Math.cos(angle + Math.PI / 2));
                const y2 = usePlayerProps.y + (offsetY * Math.sin(angle + Math.PI / 2));

                const xMin = selectedEnemy.x - selectedEnemy.hitBoxX/2;
                const xMax = selectedEnemy.x + selectedEnemy.hitBoxX/2;
                const yMin = selectedEnemy.y - selectedEnemy.hitBoxY/2;
                const yMax = selectedEnemy.y + selectedEnemy.hitBoxY/2;

                if (lineIntersects(x1, y1, x2, y2, xMin, yMin, xMax, yMax)) {
                    if ((canStab && !stabSwinging)) {
                        selectedEnemy.wasAttacked = true;
                        selectedEnemy.health -= usePlayerProps.weaponData.damage;
                    } else {
                        selectedEnemy.wasSwingAttacked = true;
                        if (holdingSword) {
                            selectedEnemy.health -= usePlayerProps.weaponData.swingDamge;
                        } else {
                            selectedEnemy.health -= usePlayerProps.bowData.swingDamge;
                        };
                    };
                    if (selectedEnemy.health <= 0) {
                        selectedEnemy.die();
                    };
                };
                
            };

            if (selectedEnemy.currentWeapon == 'sword') {
                const [enemyAngle, enemyOffsetX, enemyOffsetY] = getWeaponPosition(selectedEnemy.x, selectedEnemy.y, usePlayerProps.x, usePlayerProps.y, selectedEnemy.weaponData.sizeX, selectedEnemy.weaponData.sizeY + averageHitBox, selectedEnemy.weaponData.offset, selectedEnemy.attacking);
                selectedEnemy.weaponData.draw(selectedEnemy.x, selectedEnemy.y, enemyAngle, enemyOffsetX, enemyOffsetY);
            } else {
                const [enemyAngle, enemyOffsetX, enemyOffsetY] = getWeaponPosition(selectedEnemy.x, selectedEnemy.y, usePlayerProps.x, usePlayerProps.y, selectedEnemy.bowData.sizeX, selectedEnemy.bowData.sizeY + averageHitBox, selectedEnemy.bowData.offset, null);
                selectedEnemy.bowData.draw(selectedEnemy.x, selectedEnemy.y, enemyAngle, enemyOffsetX, selectedEnemy.bowData.yOffset);
            };
        };
        if (holdingSword) {
            usePlayerProps.weaponData.draw(usePlayerProps.x, usePlayerProps.y, angle, offsetX, offsetY, usePlayerProps.blocking);
        } else {
            usePlayerProps.bowData.draw(usePlayerProps.x, usePlayerProps.y, angle, offsetX, usePlayerProps.bowData.yOffset, usePlayerProps.blocking);
        };

        const hordLength = currentHords.length; // Debug for hords
        for (let i = 0; i < hordLength; i++) {
            const hord = currentHords[i];
            const color = `rgb(${i * 25}, ${255 - (i * 25)}, ${i * 25})`;
            const memberLength = hord.members.length;
            for (let j = 0; j < memberLength; j++) {
                const member = hord.members[j];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.rect(member.x - member.sizeY / 2, member.y - member.sizeY / 2, member.sizeX, member.sizeY);
                ctx.fill();
                ctx.closePath();
            };
        };

        if (!stillEnemiesToSummon && currentEnemies.length <= 0) {
            stillEnemiesToSummon = true;
            setTimeout(() => {
                if (amountSummoned != 0) {
                    settings.currentWave += 1;
                    amountSummoned = 0;
                    gameClock = 0;
                };
            }, settings.timeBeforeNextWave);
        };

        // Final drawing
        const foregroundLength = currentForegrounds.length;
        for (let i = foregroundLength - 1; i >= 0; i--) {
            const item = currentForegrounds[i];
            if (item.dead) {
                currentForegrounds.splice(i, 1);
            } else {
                ctx.drawImage(item.texture, item.x - item.sizeX / 2, item.y - item.sizeY / 2, item.sizeX, item.sizeY);
            };
        };

        ctx.drawImage(levelData[settings.currentLevel].foreground, 0, 0, mainCanvas.width, mainCanvas.height);
        drawHUD();
        if (gameClock <= settings.waveDisplayTime && levelData[settings.currentLevel].waves[settings.currentWave]) {
            drawWaveNumber(gameClock);
        };

        // End check
        currentHords.splice(0, currentHords.length);
        if (usePlayerProps.health <= 0) {
            break;
        } else {
            await waitTick();
        };
    };
};

// handles core loop
async function runGame() {
    while (true) {
        await makeLoadingScreen();
        await bootGame();
        while (true) {
            if (!settings.hasShownTransition) {
                await playTransition();
                settings.hasShownTransition = true;
            };
            document.addEventListener('keydown', establishUserInputDown);
            document.addEventListener('keyup', establishUserInputUp);
            document.addEventListener('mousemove', establishMouseInput);
            document.addEventListener('click', establishMouseClick);
            document.addEventListener('contextmenu', establishRightMouseClick);
            await playLevel();
            document.removeEventListener('keydown', establishUserInputDown);
            document.removeEventListener('keyup', establishUserInputUp);
            document.removeEventListener('mousemove', establishMouseInput);
            document.removeEventListener('click', establishMouseClick);
            document.removeEventListener('contextmenu', establishRightMouseClick);
            currentHords.splice(0, currentHords.length);
            if (usePlayerProps.health > 0) {
                await handleShop();
                reloadGame();
            } else {
                const retry = await optionsOnDeath();
                if (retry) {
                    reloadGame();
                } else {
                    break;
                };
            };
        };
    };
};

runGame();
// End