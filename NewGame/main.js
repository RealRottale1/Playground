const mainDiv = document.getElementById('mainDiv');
const mainCanvas = document.getElementById('mainCanvas');
const shopItems = document.getElementById('shopDiv');
const shopOptions = shopItems.children;
const ctx = mainCanvas.getContext('2d');

// variables and settings
// settings
const settings = {
    minMouseMove: 50,
    poisonLinger: 10000,
    explosionLinger: 1500,
    minHordRange: 5,
    gridRes: 5,
    refreshRate: 10,
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
    mirrorGoblinFullHealth: makeImage('textures/enemies/mirrorGoblin/mirrorGoblin3.png'),
    mirrorGoblinHalfHealth: makeImage('textures/enemies/mirrorGoblin/mirrorGoblin2.png'),
    mirrorGoblinNearDeath: makeImage('textures/enemies/mirrorGoblin/mirrorGoblin1.png'),
    ghostGoblinFullHealth: makeImage('textures/enemies/ghostGoblin/ghostGoblin3.png'),
    ghostGoblinHalfHealth: makeImage('textures/enemies/ghostGoblin/ghostGoblin2.png'),
    ghostGoblinNearDeath: makeImage('textures/enemies/ghostGoblin/ghostGoblin1.png'),
    poisonGoblinFullHealth: makeImage('textures/enemies/poisonGoblin/poisonGoblin3.png'),
    poisonGoblinHalfHealth: makeImage('textures/enemies/poisonGoblin/poisonGoblin2.png'),
    poisonGoblinNearDeath: makeImage('textures/enemies/poisonGoblin/poisonGoblin1.png'),
    ninjaGoblinFullHealth: makeImage('textures/enemies/ninjaGoblin/ninjaGoblin3.png'),
    ninjaGoblinHalfHealth: makeImage('textures/enemies/ninjaGoblin/ninjaGoblin2.png'),
    ninjaGoblinNearDeath: makeImage('textures/enemies/ninjaGoblin/ninjaGoblin1.png'),
    skeletonGoblinFullHealth: makeImage('textures/enemies/skeletonGoblin/skeletonGoblin3.png'),
    skeletonGoblinHalfHealth: makeImage('textures/enemies/skeletonGoblin/skeletonGoblin2.png'),
    skeletonGoblinNearDeath: makeImage('textures/enemies/skeletonGoblin/skeletonGoblin1.png'),
    skeletonGoblinDead: makeImage('textures/enemies/skeletonGoblin/skeletonGoblinDead.png'),
    shamanGoblinFullHealth: makeImage('textures/enemies/shamanGoblin/shamanGoblin3.png'),
    shamanGoblinHalfHealth: makeImage('textures/enemies/shamanGoblin/shamanGoblin2.png'),
    shamanGoblinNearDeath: makeImage('textures/enemies/shamanGoblin/shamanGoblin1.png'),
    shamanGoblinFullHealthMagic: makeImage('textures/enemies/shamanGoblin/shamanGoblin3Magic.png'),
    shamanGoblinHalfHealthMagic: makeImage('textures/enemies/shamanGoblin/shamanGoblin2Magic.png'),
    shamanGoblinNearDeathMagic: makeImage('textures/enemies/shamanGoblin/shamanGoblin1Magic.png'),
    weaponDefaultSword: makeImage('textures/weapons/defaultSword.png'),
    weaponMace: makeImage('textures/weapons/mace.png'),
    weaponKatana: makeImage('textures/weapons/katana.png'),
    weaponBattleAxe: makeImage('textures/weapons/battleAxe.png'),
    weaponWarHammer: makeImage('textures/weapons/warHammer.png'),
    weaponTriblade: makeImage('textures/weapons/triblade.png'),
    weaponSickle: makeImage('textures/weapons/sickle.png'),
    weaponTrident: makeImage('textures/weapons/trident.png'),
    weaponSpear: makeImage('textures/weapons/spear.png'),
    weaponEarlyGoblinSword: makeImage('textures/weapons/earlyGoblinSword.png'),
    weaponCopperSword: makeImage('textures/weapons/copperSword.png'),
    weaponGoldSword: makeImage('textures/weapons/goldSword.png'),
    weaponCobaltSword: makeImage('textures/weapons/cobaltSword.png'),
    weaponGiantSword: makeImage('textures/weapons/giantSword.png'),
    weaponRhodoniteSword: makeImage('textures/weapons/rhodoniteSword.png'),
    weaponAmethystSword: makeImage('textures/weapons/amethystSword.png'),
    weaponLongSword: makeImage('textures/weapons/longSword.png'),
    weaponBow: makeImage('textures/weapons/bow.png'),
    weaponBowFull: makeImage('textures/weapons/bowFull.png'),
    weaponGoldBow: makeImage('textures/weapons/goldBow.png'),
    weaponGoldBowFull: makeImage('textures/weapons/goldBowFull.png'),
    weaponCrossbow: makeImage('textures/weapons/crossbow.png'),
    weaponCrossbowFull: makeImage('textures/weapons/crossbowFull.png'),
    weaponMultiShotBow: makeImage('textures/weapons/multiShotBow.png'),
    weaponMultiShotBowFull: makeImage('textures/weapons/multiShotBowFull.png'),
    weaponSlingShot: makeImage('textures/weapons/slingShot.png'),
    weaponSlingShotFull: makeImage('textures/weapons/slingShotFull.png'),
    weaponBlowDart: makeImage('textures/weapons/blowDart.png'),
    weaponThrowingKnives: makeImage('textures/weapons/throwingKnives.png'),
    weaponBombBow: makeImage('textures/weapons/bombBow.png'),
    weaponBombBowFull: makeImage('textures/weapons/bombBowFull.png'),
    bulletArrow: makeImage('textures/weapons/arrow.png'),
    bulletGoldArrow: makeImage('textures/weapons/goldArrow.png'),
    bulletCrossArrow: makeImage('textures/weapons/crossArrow.png'),
    bulletMultiArrow: makeImage('textures/weapons/multiArrow.png'),
    bulletSlingBullet: makeImage('textures/weapons/slingBullet.png'),
    bulletPoisonDart: makeImage('textures/weapons/poisonDart.png'),
    bulletBombArrow: makeImage('textures/weapons/bombArrow.png'),
    heart: makeImage('textures/drops/heart.png'),
    explosion: makeImage('textures/explosion.png'),
    poisonTile: makeImage('textures/poisonTile.png'),
    plainsBackground: makeImage('textures/areas/plainBackground.png'),
    plainsForeground: makeImage('textures/areas/plainForeground.png'),
    forestBackground: makeImage('textures/areas/forestBackground.png'),
    forestForeground: makeImage('textures/areas/forestForeground.png'),
    shopBackground1: makeImage('textures/shopBackground/background1.png'),
};

class effectExplosion {
    x = 0;
    y = 0;
    sizeX = 200;
    sizeY = 200;
    range = 200;
    damage = 100;
    texture = gameTextures.explosion;
    dead = false;
    activate = function () {

        const enemyLength = currentEnemies.length;
        for (let i = enemyLength - 1; i > -1; i--) {
            const enemy = currentEnemies[i];
            if (enemy && enemy.health > 0) {
                const [dX, dY, distance] = getDistance(this, enemy);
                const trueDistance = distance - (enemy.hitBoxX + enemy.hitBoxY) / 2;
                if (trueDistance <= this.range) {
                    enemy.explode(this.damage);
                };
            };
        };

        // hurts player
        const [dX, dY, distance] = getDistance(this, usePlayerProps);
        const trueDistance = distance - (usePlayerProps.sizeX + usePlayerProps.sizeY) / 2;
        if (trueDistance <= this.range) {
            usePlayerProps.health -= this.damage;
        };

        // destroys arrows
        const bulletLength = currentBullets.length;
        for (let i = bulletLength - 1; i >= 0; i--) {
            const bullet = currentBullets[i];
            if (bullet) {
                const [dX, dY, distance] = getDistance(this, bullet);
                const trueDistance = distance - (bullet.boxSizeX + bullet.boxSizeY) / 2;
                if (trueDistance <= this.range) {
                    currentBullets.splice(i, 1);
                };
            };
        };

        setTimeout(() => {
            this.dead = true;
        }, settings.explosionLinger);
    };
};

class tilePoison {
    x = 0;
    y = 0;
    sizeX = 150;
    sizeY = 150;
    texture = gameTextures.poisonTile;
    range = 50;
    damage = .1;
    dead = false;
    activate = function () {
        setTimeout(() => {
            this.dead = true;
        }, settings.poisonLinger);
    };
};

let usePlayerProps = null;
const currentBullets = [];
const currentDropItems = [];
const currentEnemies = [];
const currentHords = [];
const currentForegrounds = [];
const currentFloorgrounds = [];

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

function getMouseAngle() {
    const dX = usePlayerProps.mouseX - usePlayerProps.x;
    const dY = usePlayerProps.mouseY - usePlayerProps.y;
    return (Math.atan2(dY, dX));
};

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
    damage = 10;
    swingDamge = 0;
    swingWeight = 0;
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
    draw(x, y, angle, offsetX, offsetY, blocking, using) {
        if (!this.texture || !this.sizeX || !this.sizeY || (using && this.disappearOnUse)) {
            return (false);
        };
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + (blocking ? (Math.PI / 2) : 0));
        ctx.drawImage(((!using && this.fullTexture) ? this.fullTexture : this.texture), (blocking ? offsetY * 2 / 3 : offsetX), (blocking ? offsetY/2  : offsetY), this.sizeX, this.sizeY);
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

class crossbowArrow extends arrow {
    constructor() {
        super();
        this.useTexture = gameTextures.bulletCrossArrow;
        this.damage = 150;
    };
}

class multiArrow extends arrow {
    constructor() {
        super();
        this.useTexture = gameTextures.bulletMultiArrow;
        this.damage = 20;
    };
}

class slingBullet extends arrow {
    constructor() {
        super();
        this.sizeX = 15;
        this.sizeY = 15;
        this.boxSizeX = 15;
        this.boxSizeY = 15;
        this.useTexture = gameTextures.bulletSlingBullet;
        this.damage = 5;
    };
}

class poisonDart extends arrow {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.boxSizeX = 25;
        this.boxSizeY = 25;
        this.useTexture = gameTextures.bulletPoisonDart;
        this.damage = 10;
    };
    async onImpact(hit) {
        if (hit === usePlayerProps) {
            for (let i = 0; i < 50; i++) {
                await wait(100);
                if (usePlayerProps.health <= 0) {
                    break;
                };
                hit.health -= .5;
            };
        } else {
            hit.movementSpeed = (hit.maxSpeed * 2 / 3);
        };
    }
}

class throwingKinve extends arrow {
    constructor() {
        super();
        this.sizeX = 45;
        this.sizeY = 45;
        this.boxSizeX = 25;
        this.boxSizeY = 25;
        this.useTexture = gameTextures.weaponThrowingKnives;
        this.damage = 25;
        this.rotation = 0;
    };
    draw() {
        if (!this.useTexture || !this.sizeX || !this.sizeY) {
            return (false);
        };
        if ((this.rotation*Math.PI/180) >= (2*Math.PI)) {
            this.rotation = 0;
        } else {
            this.rotation += 12.5;
        };
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle+(this.rotation*Math.PI/180));
        ctx.drawImage(this.useTexture, -1 * (this.sizeX / 2), -1 * (this.sizeY / 2), this.sizeX, this.sizeY);
        ctx.restore();
    };
}

class bombArrow extends arrow {
    constructor() {
        super();
        this.sizeX = 100;
        this.sizeY = 100;
        this.boxSizeX = 50;
        this.boxSizeY = 50;
        this.useTexture = gameTextures.bulletBombArrow;
        this.damage = 5;
    };
    async onImpact(hit) {
        const effect = new effectExplosion;
        effect.x = this.x;
        effect.y = this.y;
        effect.sizeX = 100;
        effect.sizeY = 100;
        effect.range = 50;
        effect.damage = 50;
        effect.activate();
        currentForegrounds.push(effect);
    }   
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
        this.fullTexture = gameTextures.weaponBowFull;
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
        this.useBullet = crossbowArrow;
        this.texture = gameTextures.weaponCrossbow;
        this.fullTexture = gameTextures.weaponCrossbowFull;
        this.displayName = 'Crossbow';
    };
};

class weaponGoldBow extends weaponBow {
    constructor() {
        super();
        this.fireRate = 750;
        this.useBullet = goldArrow;
        this.texture = gameTextures.weaponGoldBow;
        this.fullTexture = gameTextures.weaponGoldBowFull;
        this.displayName = 'Gold Bow';
    };
};

class weaponMultiShotBow extends weaponBow {
    constructor() {
        super();
        this.sizeX = 100;
        this.sizeY = 50;
        this.fireRate = 1000;
        this.useBullet = multiArrow;
        this.texture = gameTextures.weaponMultiShotBow;
        this.fullTexture = gameTextures.weaponMultiShotBowFull;
        this.displayName = 'Multi Shot Bow';
    };
    shoot(x1, x2, y1, y2, source) {
        const dX = x2 - x1;
        const dY = y2 - y1;
        const changeBy = (Math.PI/36)
        let angle = Math.atan2(dY, dX) + (Math.PI / 2) - changeBy;
        for (let i = 0; i < 3; i++) {
            const shotArrow = new this.useBullet;
            shotArrow.source = source;
            const averageSize = (shotArrow.boxSizeX + shotArrow.boxSizeY) / 2;
            shotArrow.x = x1 + (-1 * (this.yOffset) - averageSize) * Math.cos(angle - Math.PI / 2);
            shotArrow.y = y1 + (-1 * (this.yOffset) - averageSize) * Math.sin(angle - Math.PI / 2);
            shotArrow.angle = angle;
            angle += changeBy;
            currentBullets.push(shotArrow);
        };
    };
};

class weaponSlingShot extends weaponBow {
    constructor() {
        super();
        this.fireRate = 100;
        this.useBullet = slingBullet;
        this.texture = gameTextures.weaponSlingShot;
        this.fullTexture = gameTextures.weaponSlingShotFull;
        this.displayName = 'Sling Shot';
    };
};

class weaponBlowDart extends weaponBow {
    constructor() {
        super();
        this.fireRate = 1250;
        this.yOffset = -50;
        this.useBullet = poisonDart;
        this.texture = gameTextures.weaponBlowDart;
        this.fullTexture = null;
        this.displayName = 'Poison Dart';
    };
};

class weaponThrowingKnives extends weaponBow {
    constructor() {
        super();
        this.fireRate = 1250;
        this.useBullet = throwingKinve;
        this.texture = gameTextures.weaponThrowingKnives;
        this.displayName = 'Throwing Knives';
        this.disappearOnUse = true;
    };
};

class weaponBombBow extends weaponBow {
    constructor() {
        super();
        this.fireRate = 2000;
        this.useBullet = bombArrow;
        this.texture = gameTextures.weaponBombBow;
        this.fullTexture = gameTextures.weaponBombBowFull;
        this.displayName = 'Bomb Bow';
    };
};

class weaponDefaultSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 80;
        this.damage = 20;
        this.swingDamge = 2.5;
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

class weaponMace extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 65;
        this.damage = 35;
        this.swingDamge = 8.3;
        this.swingWeight = 3;
        this.attackDuration = 500;
        this.attackCoolDown = 1500;
        this.canBlock = true;
        this.blockDuration = 1000;
        this.blockCoolDown = 500;
        this.texture = gameTextures.weaponMace;
        this.displayName = 'Mace';
        this.sizeX = 50;
        this.sizeY = 100;
        this.offset = -50;
    };
};

class weaponKatana extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 100;
        this.damage = 25;
        this.swingDamge = 20;
        this.attackDuration = 500;
        this.attackCoolDown = 600;
        this.canBlock = true;
        this.texture = gameTextures.weaponKatana;
        this.displayName = 'Katana';
        this.sizeX = 50;
        this.sizeY = 100;
        this.offset = -50;
    };
};

class weaponBattleAxe extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 100;
        this.damage = 10;
        this.swingDamge = 25;
        this.swingWeight = 10;
        this.attackDuration = 1000;
        this.attackCoolDown = 1500;
        this.texture = gameTextures.weaponBattleAxe;
        this.displayName = 'Battle Axe';
        this.sizeX = 75;
        this.sizeY = 100;
        this.offset = -50;
    };
};

class weaponWarHammer extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 100;
        this.damage = 2.5;
        this.swingDamge = 45;
        this.swingWeight = 15;
        this.attackDuration = 1000;
        this.attackCoolDown = 1500;
        this.texture = gameTextures.weaponWarHammer;
        this.displayName = 'War Hammer';
        this.sizeX = 75;
        this.sizeY = 100;
        this.offset = -50;
    };
};

class weaponTriblade extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 75;
        this.damage = 20;
        this.swingDamge = 2.5;
        this.attackDuration = 100;
        this.attackCoolDown = 50;
        this.texture = gameTextures.weaponTriblade;
        this.displayName = 'Tri-Blade';
        this.sizeX = 75;
        this.sizeY = 75;
        this.offset = -25;
    };
};

class weaponSickle extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 75;
        this.damage = 5;
        this.swingDamge = 15;
        this.attackDuration = 300;
        this.attackCoolDown = 200;
        this.canBlock = true;
        this.texture = gameTextures.weaponSickle;
        this.displayName = 'Sickle';
        this.sizeX = 100;
        this.sizeY = 95;
        this.offset = -35;
    };
};

class weaponTrident extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 125;
        this.damage = 75;
        this.swingDamge = 10;
        this.swingWeight = 5;
        this.attackDuration = 700;
        this.attackCoolDown = 850;
        this.texture = gameTextures.weaponTrident;
        this.displayName = 'Trident';
        this.sizeX = 50;
        this.sizeY = 100;
        this.offset = -65;
    };
};

class weaponSpear extends weaponHands {
    constructor() {
        super();
        this.swingable = false;
        this.attackRange = 125;
        this.damage = 35;
        this.swingDamge = 0;
        this.swingWeight = 0;
        this.attackDuration = 700;
        this.attackCoolDown = 850;
        this.texture = gameTextures.weaponSpear;
        this.displayName = 'Spear';
        this.sizeX = 75;
        this.sizeY = 125;
        this.offset = -65;
    };
};

class weaponEarlyGoblinSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 70;
        this.damage = 15;
        this.swingDamge = 2.5;
        this.attackDuration = 750;
        this.attackCoolDown = 250;
        this.canBlock = true;
        this.blockDuration = 1000;
        this.blockCoolDown = 500;
        this.texture = gameTextures.weaponEarlyGoblinSword;
        this.displayName = 'Goblin Sword';
        this.sizeX = 75;
        this.sizeY = 75;
        this.offset = -35;
    };
};

class weaponCopperSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 70;
        this.damage = 25;
        this.swingDamge = 4.5;
        this.attackDuration = 750;
        this.attackCoolDown = 350;
        this.canBlock = true;
        this.blockDuration = 1000;
        this.blockCoolDown = 500;
        this.texture = gameTextures.weaponCopperSword;
        this.displayName = 'Copper Sword';
        this.sizeX = 75;
        this.sizeY = 75;
        this.offset = -35;
    };
};

class weaponGoldSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 70;
        this.damage = 35;
        this.swingDamge = 5.5;
        this.attackDuration = 750;
        this.attackCoolDown = 500;
        this.canBlock = true;
        this.blockDuration = 1000;
        this.blockCoolDown = 500;
        this.texture = gameTextures.weaponGoldSword;
        this.displayName = 'Gold Sword';
        this.sizeX = 75;
        this.sizeY = 75;
        this.offset = -35;
    };
};

class weaponCobaltSword extends weaponCopperSword {
    constructor() {
        super();
        this.texture = gameTextures.weaponCobaltSword;
        this.displayName = 'Cobalt Sword';
    };
};

class weaponGiantSword extends weaponHands {
    constructor() {
        super();
        this.swingable = true;
        this.attackRange = 70;
        this.damage = 50;
        this.swingDamge = 45;
        this.attackDuration = 550;
        this.attackCoolDown = 1000;
        this.canBlock = false;
        this.blockDuration = 1000;
        this.blockCoolDown = 500;
        this.texture = gameTextures.weaponGiantSword;
        this.displayName = 'Giant Sword';
        this.sizeX = 100;
        this.sizeY = 200;
        this.offset = -50;
    };
};

class weaponRhodoniteSword extends weaponCopperSword {
    constructor() {
        super();
        this.texture = gameTextures.weaponRhodoniteSword;
        this.displayName = 'Rhodonite Sword';
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
    movementHistory = [];
    mouseHistory = [];
    getCurrentWeapon() {
        return((this.currentWeapon == 'sword') ? this.weaponData : this.bowData);
    };
    getWeaponAngle() {
        const useTool = this.getCurrentWeapon();
        if (!useTool.swingWeight) {
            return(getMouseAngle() + Math.PI/2);
        };

        const mouseHistoryLength = this.mouseHistory.length;
        if ((mouseHistoryLength) < 49 && ((mouseHistoryLength-1) - useTool.swingWeight) < 0) {
            return(this.mouseHistory[0]);
        } else {
            return(this.mouseHistory[Math.floor((mouseHistoryLength-1) - useTool.swingWeight)]);
        };

    };
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
        this.movementHistory.push([this.x, this.y]);
        if (this.movementHistory.length >= 50) {
            this.movementHistory.splice(0, 1);
        };
    };
    // sword stuff
    amountMouseMoved = 0;
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
    weaponData = new weaponMace;
    bowData = new weaponBombBow;
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
    exploded = false;
    exploding = false;
    explosionRange = 0;
    die(noDrops) {
        if (!noDrops) {
            console.log('dropped a heart!');
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

    explode(damage) {
        if (this.health > 0) {

            this.health -= damage;
            console.log(damage);
            if (this.constructor.name == 'bombGoblin' && !this.exploded) {
                this.exploded = true;
                this.exploding = true;
                this.makeExplosion();
            };


            if (this.health <= 0) {
                this.die(true);
            };
        } else {
            this.die(true);
        };
    };
    draw(x, y) {
        ctx.globalAlpha = (this.opacity ? this.opacity : 1);
        ctx.drawImage(this.useTexture, x - this.sizeX / 2, y - this.sizeY / 2, this.sizeX, this.sizeY);
        ctx.globalAlpha = 1;
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
    adjustmentSpeed = 25;
    minAdjustSpeed = 10;

    // movment/tick stuff
    maxSpeed = 1.5;
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

    checkIfCanAttack() {
        const [dX, dY, distance] = getDistance(usePlayerProps, this);
        const trueDistance = distance - (this.hitBoxX + this.hitBoxY)/2;
        const ratio = (trueDistance/((mainCanvas.width + mainCanvas.height)/8));
        const proximity = ((ratio < 0) ? 0 : ((ratio >= 1) ? 1 : ratio));
        
        const useAdjustmentSpeed = ((this.currentWeapon == 'sword') ? (this.adjustmentSpeed) : Math.floor(this.adjustmentSpeed/2));
        const moveLength = (usePlayerProps.movementHistory.length + 1);
        const adjustDiff = (moveLength - useAdjustmentSpeed);
        const speed = ((proximity >= 1) ? adjustDiff : ((proximity < 0) ? moveLength : Math.floor(adjustDiff + ((1-proximity) * useAdjustmentSpeed))) - this.minAdjustSpeed);
        const useSpeed = ((speed > (moveLength - this.minAdjustSpeed)) ? (moveLength - this.minAdjustSpeed) : speed);

        const pDX = (usePlayerProps.movementHistory[useSpeed][0] - this.x);
        const pDY = (usePlayerProps.movementHistory[useSpeed][1] - this.y);
        const pastAttackAngle = Math.atan2(pDY, pDX);

        const aDX = (usePlayerProps.x - usePlayerProps.movementHistory[useSpeed][0]); // a stands for another because I can't be bothered to give it a unique name
        const aDY = (usePlayerProps.y - usePlayerProps.movementHistory[useSpeed][1]);
        const aDistance = Math.sqrt(aDX ** 2 + aDY ** 2);

        return([(aDistance <= 50), pastAttackAngle]);
    };

    attack() {
        if (this.canAttack) {
            const [couldAttack, pastAttackAngle] = this.checkIfCanAttack();
            if (!couldAttack) {
                return;
            };
            this.canAttack = false;
            this.attacking = true;
            if (usePlayerProps.blocking) {
                const playerAngle = usePlayerProps.getWeaponAngle();
                const difference = Math.abs(playerAngle - (pastAttackAngle+(Math.PI/2)));
                if (difference < (29 * Math.PI / 36) || difference > (43 * Math.PI / 36)) {
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
            const [couldAttack, pastAttackAngle] = this.checkIfCanAttack();
            if (!couldAttack) {
                return;
            };
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
    };
};

class berserkerGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.maxSpeed = 2.5;
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
        this.maxSpeed = 1;
        this.movementSpeed = 1;
        this.fullHealth = gameTextures.bombGoblinFullHealth;
        this.halfHealth = gameTextures.bombGoblinHalfHealth;
        this.nearDeath = gameTextures.bombGoblinNearDeath;
        this.fullHealthLit = gameTextures.bombGoblinFullHealthLit;
        this.halfHealthLit = gameTextures.bombGoblinHalfHealthLit;
        this.nearDeathLit = gameTextures.bombGoblinNearDeathLit;
        this.starterHealth = 100;
        this.health = 100;
        this.explodeIn = 500;
        this.bombRange = 50;
        this.explosionRange = 150;
    };

    makeExplosion() {
        const effect = new effectExplosion;
        effect.x = this.x;
        effect.y = this.y;
        effect.activate();
        currentForegrounds.push(effect);
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
                this.exploded = true;
                this.makeExplosion();
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
        this.singleTexture = true;
        this.starterHealth = 1;
        this.health = 1;
        this.maxSpeed = 3.5;
        this.movementSpeed = 3.5;
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

    die(noDrops) {
        if (this.bit) {
            usePlayerProps.bites -= 1;
        };
        super.die(noDrops);
    }
};

class mirrorGoblin extends goblin {
    constructor() {
        super();
        this.maxSpeed = 1;
        this.movementSpeed = 1;
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.mirrorGoblinFullHealth;
        this.halfHealth = gameTextures.mirrorGoblinHalfHealth;
        this.nearDeath = gameTextures.mirrorGoblinNearDeath;
        this.reflectsBullets = true;
    };
};

class ghostGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.ghostGoblinFullHealth;
        this.halfHealth = gameTextures.ghostGoblinHalfHealth;
        this.nearDeath = gameTextures.ghostGoblinNearDeath;
        this.hits = 0;
        this.opacity = 0.5;
    };
    tpAway() {
        const ran = Math.floor(Math.floor(Math.random()*30)/10);
        const newAngle = (ran == 0 ? Math.PI : (ran == 1 ? 3*Math.PI/2 : Math.PI/2));
        const weaponAngle = usePlayerProps.getWeaponAngle() + newAngle;
        const [newX, newY] = inBounds((this.x - (-250 * Math.cos(weaponAngle))), (this.y - (-250 * Math.sin(weaponAngle))));
        this.x = newX;
        this.y = newY;
    };
    getUseTexture() {
        if (this.health > 66) {
            this.useTexture = this.fullHealth;
        } else if (this.health <= 66 && this.health > 33) {
            this.useTexture = this.halfHealth;
            if (this.hits == 0) {
                this.hits = 1;
                this.tpAway();
            };
        } else {
            this.useTexture = this.nearDeath;
            if (this.hits == 1) {
                this.hits = 2;
                this.tpAway();
            };
        };
    };

    move(dX, dY, distance) {
        const nX = dX / distance;
        const nY = dY / distance;
        this.x += nX * this.movementSpeed;
        this.y += nY * this.movementSpeed;
        const averageHitBox = (this.hitBoxX + this.hitBoxY) / 2;

        const enemyLength = currentEnemies.length;
        for (let i = 0; i < enemyLength; i++) {
            const enemy = currentEnemies[i];
            if (enemy != this && enemy.constructor.name != this.constructor.name) {
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
        endPos[0] = usePlayerProps.x;
        endPos[1] = usePlayerProps.y;
        const dX = endPos[0] - this.x;
        const dY = endPos[1] - this.y;
        const distance = Math.sqrt(dX ** 2 + dY ** 2);
        this.move(dX, dY, distance);
    };
};

class poisonGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.poisonGoblinFullHealth;
        this.halfHealth = gameTextures.poisonGoblinHalfHealth;
        this.nearDeath = gameTextures.poisonGoblinNearDeath;
    };

    die(noDrops) {
        const tile = new tilePoison;
        tile.x = this.x;
        tile.y = this.y;
        tile.activate();
        currentFloorgrounds.push(tile);
        super.die(noDrops);
    }
};

class ninjaGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.ninjaGoblinFullHealth;
        this.halfHealth = gameTextures.ninjaGoblinHalfHealth;
        this.nearDeath = gameTextures.ninjaGoblinNearDeath;
    };

    getUseTexture() {
        if (this.health > 66) {
            this.useTexture = this.fullHealth;
            this.opacity = 0.125;
        } else if (this.health <= 66 && this.health > 33) {
            this.useTexture = this.halfHealth;
            this.opacity = 0.45;
        } else {
            this.useTexture = this.nearDeath;
            this.opacity = 1;
        };
    };
};

class skeletonGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.skeletonGoblinFullHealth;
        this.halfHealth = gameTextures.skeletonGoblinHalfHealth;
        this.nearDeath = gameTextures.skeletonGoblinNearDeath;
        this.dead = gameTextures.skeletonGoblinDead;
        this.reviving = false;
        this.reviveTime = 7500;
        this.killCD = false;
    };

    getUseTexture() {
        if (this.health > 66) {
            this.useTexture = this.fullHealth;
        } else if (this.health <= 66 && this.health > 33) {
            this.useTexture = this.halfHealth;
        } else if (!this.reviving) {
            this.useTexture = this.nearDeath;
        } else {
            this.useTexture = this.dead;
        };
    };

    die(noDrops) {
        if (!this.reviving) {
            this.killCD = true
            this.reviving = true;
            setTimeout(() => {
                this.killCD = false
                setTimeout(() => {
                    this.health = 100;
                    this.reviving = false;
                }, this.reviveTime);
            }, 500);
        } else if (!this.killCD) {
            super.die(noDrops);
        };
    };

    tickAction() {
        this.criticalTickAction();

        if (!this.reviving) {
            super.tickAction();
        };
    };
};

class shamanGoblin extends goblin {
    constructor() {
        super();
        this.sizeX = 50;
        this.sizeY = 50;
        this.fullHealth = gameTextures.shamanGoblinFullHealth;
        this.halfHealth = gameTextures.shamanGoblinHalfHealth;
        this.nearDeath = gameTextures.shamanGoblinNearDeath;
        this.fullHealthMagic = gameTextures.shamanGoblinFullHealthMagic;
        this.halfHealthMagic = gameTextures.shamanGoblinHalfHealthMagic;
        this.nearDeathMagic = gameTextures.shamanGoblinNearDeathMagic;
        this.summoning = false;
        this.summonRange = 150;
        this.summoningDuration = 2500;
        this.summonCD = false;
        this.summonCDTime = 5000;
    };

    getUseTexture() {
        if (this.health > 66) {
            if (!this.summoning) {
                this.useTexture = this.fullHealth;
            } else {
                this.useTexture = this.fullHealthMagic;
            };
        } else if (this.health <= 66 && this.health > 33) {
            if (!this.summoning) {
                this.useTexture = this.halfHealth;
            } else {
                this.useTexture = this.halfHealthMagic;
            };
        } else {
            if (!this.summoning) {
                this.useTexture = this.nearDeath;
            } else {
                this.useTexture = this.nearDeathMagic;
            };
        };
    };

    tickAction() { // for shaman goblin
        const trueDistance = this.criticalTickAction();
        if (this.summoning) {
            return;
        };

        // action stuff
        if (trueDistance <= this.summonRange) {
            if (this.summonCD) {
                return;
            };
            this.summoning = true;
            setTimeout(() => {
                if (!this || this.health <= 0) {
                    return;
                };
                this.summoning = false;
                const onX = Math.round(Math.random());
                const summonX = (onX ? 0 : Math.floor(Math.random()*mainCanvas.width));
                const summonY = (onX ? Math.floor(Math.random()*mainCanvas.width) : 0);
                if (Math.round(Math.random()) == 1) {
                    summonEnemy([null, ghostGoblin, [weaponDefaultSword, null], [summonX, summonY]]);
                } else {
                    summonEnemy([null, skeletonGoblin, [weaponDefaultSword, null], [summonX, summonY]]);
                };
                this.summonCD = true;
                setTimeout(() => {
                    this.summonCD = false;
                }, this.summonCDTime);
            }, this.summoningDuration);
        } else {
            this.handleMovment();
        };
    };
};

class bigGoblin extends goblin {
    constructor() {
        super();
        this.fullHealth = gameTextures.bigGoblinFullHealth;
        this.halfHealth = gameTextures.bigGoblinHalfHealth;
        this.nearDeath = gameTextures.bigGoblinNearDeath;
        this.starterHealth = 200;
        this.health = 200;
        this.hitBoxX = 50;
        this.hitBoxY = 50;
        this.sizeX = 50;
        this.sizeY = 50;
        this.attackDamageMultiplier = 1.5;
        this.maxSpeed = .5;
        this.movementSpeed = .5;
        this.adjustmentSpeed = 35;
        this.minAdjustSpeed = 25;
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
        transition: [[gameTextures.missingTexture, 10], ],
        waves: [ // spawnTick#, enemy, [weaponData, bowData] , [x,y]
            [
                [500, goblin, [null, null], [250, 0]],
                [700, goblin, [null, null], [0, 250]],
            ],
            [
                [200, goblin, [null, null], [250, 500]],
                [600, goblin, [null, null], [0, 250]],
                [1000, goblin, [null, null], [250, 0]],
                [1400, archerGoblin, [null, weaponBow], [500, 250]],
            ],
            [
                [200, archerGoblin, [null, weaponBow], [0, 125]],
                [300, archerGoblin, [null, weaponBow], [0, 875]],
                [1300, archerGoblin, [null, weaponBow], [500, 125]],
                [1400, archerGoblin, [null, weaponBow], [500, 875]],
            ],
            [
                [200, goblin, [null, null], [0, 0]],
                [800, archerGoblin, [null, weaponBow], [500, 500]],
                [1600, goblin, [null, null], [250, 500]],
                [1800, goblin, [null, null], [250, 0]],
                [2000, bigGoblin, [null, null], [500, 250]],
            ],
        ],
        shopItems: {weapons: [weaponKatana, weaponSpear], bows: [null, weaponSlingShot]},
    },
    {
        background: gameTextures.plainsBackground,
        foreground: gameTextures.plainsForeground,
        transition: [[gameTextures.missingTexture, 10], ],
        waves: [
            [
                [200, bigGoblin, [null, null], [250, 500]],
                [1000, goblin, [null, null], [0, 0]],
                [1000, archerGoblin, [null, weaponBow], [0, 250]],
                [1000, goblin, [null, null], [0, 500]],
                [2000, goblin, [weaponEarlyGoblinSword, null], [0, 0]],
            ],
            [
                [200, goblin, [null, null], [0, 250]],
                [800, archerGoblin, [null, weaponBow], [500, 250]],
                [800, bigGoblin, [weaponEarlyGoblinSword, null], [500, 150]],
                [800, goblin, [weaponEarlyGoblinSword, null], [500, 350]],
            ],
            [
                [200, goblin, [weaponEarlyGoblinSword, null], [0, 250]],
                [200, archerGoblin, [null, weaponBow], [500, 250]],
                [1400, goblin, [weaponEarlyGoblinSword, null], [500, 250]],
                [1400, archerGoblin, [null, weaponBow], [0, 250]],
                [2600, berserkerGoblin, [weaponEarlyGoblinSword], [250, 500]],
            ],
        ],
        shopItems: {weapons: [weaponSickle, weaponMace], bows: [weaponMultiShotBow, weaponBlowDart]},
    },
    {
        background: gameTextures.forestBackground,
        foreground: gameTextures.forestForeground,
        transition: [[gameTextures.missingTexture, 10], ],
        waves: [
            [
                //[200, archerGoblin, [null, weaponBow], [0, 0]],
                //[200, archerGoblin, [null, weaponBow], [0, 0]],
                //[200, archerGoblin, [null, weaponBow], [0, 0]],
                [200, bombGoblin, [null, null], [0, 0]],
            ],
            [
                [200, goblin, [weaponCopperSword, null], [0, 0]],
                [1200, goblin, [weaponGoldSword, null], [0, 0]],
                [1200, goblin, [weaponRhodoniteSword, null], [500, 500]],
                [2200, goblin, [weaponGoldSword, null], [0, 0]],
                [2200, goblin, [weaponCobaltSword, null], [500, 500]],
                [2200, poisonGoblin, [null, weaponBlowDart], [500, 0]],
            ],
            [
                [200, poisonGoblin, [null, null], [0, 0]],
                [400, poisonGoblin, [null, null], [500, 500]],
                [600, poisonGoblin, [null, null], [500, 0]],
                [800, poisonGoblin, [null, weaponBlowDart], [0, 500]],

                [1600, poisonGoblin, [null, null], [0, 0]],
                [1800, poisonGoblin, [null, null], [500, 500]],
                [2000, poisonGoblin, [null, null], [500, 0]],
                [2200, poisonGoblin, [null, weaponBlowDart], [0, 500]],
            ],
            [
                [200, poisonGoblin, [weaponCobaltSword, null], [0, 500]],
                [200, goblin, [weaponGoldSword, null], [500, 500]],
                [800, bigGoblin, [weaponGoldSword, null], [250, 500]],
                [1800, goblin, [weaponCopperSword, null], [0, 500]],
                [1800, poisonGoblin, [weaponRhodoniteSword, null], [500, 500]],
                [2400, bigGoblin, [weaponCobaltSword, null], [250, 0]],
            ],
        ],
        shopItems: {weapons: [weaponBattleAxe, weaponTriblade], bows: [weaponGoldBow, weaponCrossbow]},
    },
    {
        background: gameTextures.forestBackground,
        foreground: gameTextures.forestForeground,
        transition: [[gameTextures.missingTexture, 10], ],
        waves: [
            [
                [200, goblin, [weaponCopperSword, null], [0, 0]],
                [1200, goblin, [weaponGoldSword, null], [0, 0]],
                [1200, goblin, [weaponRhodoniteSword, null], [500, 500]],
                [2200, goblin, [weaponGoldSword, null], [0, 0]],
                [2200, goblin, [weaponCobaltSword, null], [500, 500]],
                [2200, poisonGoblin, [null, weaponBlowDart], [500, 0]],
            ],
            [
                [200, poisonGoblin, [null, null], [0, 0]],
                [400, poisonGoblin, [null, null], [500, 500]],
                [600, poisonGoblin, [null, null], [500, 0]],
                [800, poisonGoblin, [null, weaponBlowDart], [0, 500]],

                [1600, poisonGoblin, [null, null], [0, 0]],
                [1800, poisonGoblin, [null, null], [500, 500]],
                [2000, poisonGoblin, [null, null], [500, 0]],
                [2200, poisonGoblin, [null, weaponBlowDart], [0, 500]],
            ],
            [
                [200, poisonGoblin, [weaponCobaltSword, null], [0, 500]],
                [200, goblin, [weaponGoldSword, null], [500, 500]],
                [800, bigGoblin, [weaponGoldSword, null], [250, 500]],
                [1800, goblin, [weaponCopperSword, null], [0, 500]],
                [1800, poisonGoblin, [weaponRhodoniteSword, null], [500, 500]],
                [2400, bigGoblin, [weaponCobaltSword, null], [250, 0]],
            ],
        ],
        shopItems: {weapons: [weaponWarHammer, weaponTrident], bows: [null, null]},
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

// fills mouse movment history with blanks
function fillMouseHistoryWithBlanks() {
    for (let i = 0; i < 50; i++) {
        usePlayerProps.mouseHistory.push[0];
    };
};

// boots up game
function bootGame() {
    settings.hasShownTransition = false;
    settings.currentLevel = 2;
    settings.currentWave = 0;
    amountSummoned = 0;
    stillEnemiesToSummon = true;
    gameClock = 0;
    usePlayerProps = new playerProps();
    currentEnemies.splice(0, currentEnemies.length);
    currentBullets.splice(0, currentBullets.length);
    currentDropItems.splice(0, currentDropItems.length);
    currentForegrounds.splice(0, currentForegrounds.length);
    currentFloorgrounds.splice(0, currentFloorgrounds.length);
    fillMouseHistoryWithBlanks();

    return new Promise((success) => {
        success();
    });
};

// reloads game
function reloadGame() {
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
    usePlayerProps.amountMouseMoved = 0;
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
    usePlayerProps.movementHistory = [];
    usePlayerProps.mouseHistory = [];
    fillMouseHistoryWithBlanks();

    currentEnemies.splice(0, currentEnemies.length);
    currentBullets.splice(0, currentBullets.length);
    currentDropItems.splice(0, currentDropItems.length);
    currentForegrounds.splice(0, currentForegrounds.length);
    currentFloorgrounds.splice(0, currentFloorgrounds.length);
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
                usePlayerProps.blocking = false;
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

// gets mouse position
function establishMouseInput(event) {
    const rect = mainCanvas.getBoundingClientRect();
    const distance = Math.sqrt((usePlayerProps.mouseX - (event.clientX - rect.left)) ** 2 + (usePlayerProps.mouseY - (event.clientY - rect.top)) ** 2);
    
    usePlayerProps.amountMouseMoved += distance;
    usePlayerProps.mouseX = event.clientX - rect.left;
    usePlayerProps.mouseY = event.clientY - rect.top;
};

// checks if player is swinging the sword and sets isSwinging to the value
function handleSwingingCheck() {
    const useTool = usePlayerProps.getCurrentWeapon();
    if (!useTool.swingable) {
        return;
    };
    const mouseHistoryLength = usePlayerProps.mouseHistory.length;
    const currentAngle = (useTool.swingWeight ? Math.floor((mouseHistoryLength-1) - useTool.swingWeight) : 0);
    const nextAngle = (currentAngle == 49 ? currentAngle-1 : currentAngle+1);
    const total = Math.abs(Math.abs(usePlayerProps.mouseHistory[currentAngle]) - Math.abs(usePlayerProps.mouseHistory[nextAngle]));

    usePlayerProps.isSwinging = (total > 0.2616);
};

// gets mouse click
function establishMouseClick(event) {
    if (usePlayerProps.currentWeapon == 'sword') {
        if (usePlayerProps.canAttack) {
            usePlayerProps.canAttack = false;
            usePlayerProps.attacking = true;
            usePlayerProps.blocking = false;
            usePlayerProps.initialAttackAngle = usePlayerProps.getWeaponAngle();
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
    const useWeapon = usePlayerProps.getCurrentWeapon();
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
        if (!useBullet) {
            continue;
        };
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
                if (useEnemy && useEnemy.health > 0) {
                    const distance = Math.sqrt((useEnemy.x - useBullet.x) ** 2 + (useEnemy.y - useBullet.y) ** 2);
                    if (distance <= (useEnemy.hitBoxX + useEnemy.hitBoxY) / 2) {
                        if (!useEnemy.reflectsBullets) {
                            hitEnemy = true;
                            useEnemy.health -= useBullet.damage;
                            if (useBullet.onImpact) {
                                useBullet.onImpact(useEnemy);
                            };
                            if (useEnemy.health <= 0) {
                                useEnemy.die();
                            };
                        } else {
                            useBullet.source = 'enemy'
                            useBullet.angle += Math.PI; 
                        };
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
                if (useBullet.onImpact) {
                    useBullet.onImpact(usePlayerProps);
                };
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

        //Draw floor objects
        const floorgroundLength = currentFloorgrounds.length;
        for (let i = floorgroundLength - 1; i >= 0; i--) {
            const item = currentFloorgrounds[i];
            if (item.dead) {
                currentFloorgrounds.splice(i, 1);
            } else {
                const [dX, dY, distance] = getDistance(usePlayerProps, item);
                if (distance < item.range + (usePlayerProps.sizeX + usePlayerProps.sizeY)/2) {
                    usePlayerProps.health -= item.damage; 
                };
                ctx.drawImage(item.texture, item.x - item.sizeX / 2, item.y - item.sizeY / 2, item.sizeX, item.sizeY);
            };
        };

        // Draw non-characters
        moveBullets();
        drawDroppedItems();

        // Sword stab and slash debuff
        let stabSwinging = false;
        if (usePlayerProps.attacking) {
            const currentMouseAngle = usePlayerProps.getWeaponAngle();
            if (Math.abs(usePlayerProps.initialAttackAngle - currentMouseAngle) > .5) {
                stabSwinging = true;
            };
        };

        // Draw player and enemies
        usePlayerProps.draw(usePlayerProps.x, usePlayerProps.y);
        const weaponUsing = usePlayerProps.getCurrentWeapon();
        const [angle, offsetX, offsetY] = getWeaponPosition(usePlayerProps.x, usePlayerProps.y, usePlayerProps.mouseX, usePlayerProps.mouseY, weaponUsing.sizeX, weaponUsing.sizeY, weaponUsing.offset, usePlayerProps.attacking);
        const currentEnemyLength = currentEnemies.length;
        makeHords();
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
                const useAngle = usePlayerProps.getWeaponAngle();
                const initialOffset = (((canStab && !stabSwinging> 0) || (usePlayerProps.bites > 0 && selectedEnemy.constructor.name)) ? 0 : usePlayerProps.weaponData.offset);
                const x1 = usePlayerProps.x + (initialOffset * Math.cos(useAngle + Math.PI / 2));
                const y1 = usePlayerProps.y + (initialOffset * Math.sin(useAngle + Math.PI / 2));
                const x2 = usePlayerProps.x + (offsetY * Math.cos(useAngle + Math.PI / 2));
                const y2 = usePlayerProps.y + (offsetY * Math.sin(useAngle + Math.PI / 2));

                const xMin = selectedEnemy.x - selectedEnemy.hitBoxX/2;
                const xMax = selectedEnemy.x + selectedEnemy.hitBoxX/2;
                const yMin = selectedEnemy.y - selectedEnemy.hitBoxY/2;
                const yMax = selectedEnemy.y + selectedEnemy.hitBoxY/2;

                if (lineIntersects(x1, y1, x2, y2, xMin, yMin, xMax, yMax)) {
                    if ((canStab && !stabSwinging)) {
                        console.log('stabbed!');
                        selectedEnemy.wasAttacked = true;
                        selectedEnemy.health -= usePlayerProps.weaponData.damage;
                    } else {
                        console.log('slashed!');
                        selectedEnemy.wasSwingAttacked = true;
                        selectedEnemy.health -= weaponUsing.swingDamge;
                    };
                    if (selectedEnemy.health <= 0) {
                        selectedEnemy.die();
                    };
                };
                
            };

            if (selectedEnemy.health > 0) {
                const [dX, dY, distance] = getDistance(usePlayerProps, selectedEnemy);
                const trueDistance = distance - (selectedEnemy.hitBoxX + selectedEnemy.hitBoxY)/2;
                const ratio = (trueDistance/((mainCanvas.width + mainCanvas.height)/8));
                const proximity = ((ratio < 0) ? 0 : ((ratio >= 1) ? 1 : ratio));
                
                const useAdjustmentSpeed = ((selectedEnemy.currentWeapon == 'sword') ? (selectedEnemy.adjustmentSpeed) : Math.floor(selectedEnemy.adjustmentSpeed/2));
                const moveLength = (usePlayerProps.movementHistory.length + 1);
                const adjustDiff = (moveLength - useAdjustmentSpeed);
                const speed = ((proximity >= 1) ? adjustDiff : ((proximity < 0) ? moveLength : Math.floor(adjustDiff + ((1-proximity) * useAdjustmentSpeed))));
                
                const useSpeed = ((speed > (moveLength - selectedEnemy.minAdjustSpeed)) ? (moveLength - selectedEnemy.minAdjustSpeed) : speed);

                const usePos = usePlayerProps.movementHistory[useSpeed];
                if (usePos) {
                    if (selectedEnemy.currentWeapon == 'sword') {
                        const [enemyAngle, enemyOffsetX, enemyOffsetY] = getWeaponPosition(selectedEnemy.x, selectedEnemy.y, usePos[0], usePos[1], selectedEnemy.weaponData.sizeX, selectedEnemy.weaponData.sizeY + averageHitBox, selectedEnemy.weaponData.offset, selectedEnemy.attacking);
                        selectedEnemy.weaponData.draw(selectedEnemy.x, selectedEnemy.y, enemyAngle, enemyOffsetX, enemyOffsetY, false, !selectedEnemy.canAttack);
                    } else {
                        const [enemyAngle, enemyOffsetX, enemyOffsetY] = getWeaponPosition(selectedEnemy.x, selectedEnemy.y, usePos[0], usePos[1], selectedEnemy.bowData.sizeX, selectedEnemy.bowData.sizeY + averageHitBox, selectedEnemy.bowData.offset, null);
                        selectedEnemy.bowData.draw(selectedEnemy.x, selectedEnemy.y, enemyAngle, enemyOffsetX, selectedEnemy.bowData.yOffset, false, !selectedEnemy.canShoot);
                    };
                };
            };
        };
        
        if (usePlayerProps.currentWeapon == 'sword') {
            usePlayerProps.weaponData.draw(usePlayerProps.x, usePlayerProps.y, (usePlayerProps.getWeaponAngle()), offsetX, offsetY, usePlayerProps.blocking, !usePlayerProps.canAttack);
        } else {
            usePlayerProps.bowData.draw(usePlayerProps.x, usePlayerProps.y, (usePlayerProps.getWeaponAngle()), offsetX, usePlayerProps.bowData.yOffset, usePlayerProps.blocking, !usePlayerProps.canShoot);
        };

        /*onst hordLength = currentHords.length; // Debug for hords
        for (let i = 0; i < hordLength; i++) {
            const hord = currentHords[i];
            const color = `rgb(${i * 25}, ${255 - (i * 25)}, ${i * 25})`;
            const memberLength = hord.members.length;
            for (let j = 0; j < memberLength; j++) {
                const member = hord.members[j];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.rect(member.x - member.hitBoxX / 2, member.y - member.hitBoxY / 2, member.hitBoxX, member.hitBoxY);
                ctx.fill();
                ctx.closePath();
            };
        };*/

        usePlayerProps.mouseHistory.push(angle);
        const mouseHistoryLength = usePlayerProps.mouseHistory.length;
        if (mouseHistoryLength > 50) {
            usePlayerProps.mouseHistory.splice(0, 1);
        };
        handleSwingingCheck();

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

        /*// debug for player movment history
        const movementHistoryLength = usePlayerProps.movementHistory.length;
        for (let i = 0; i < movementHistoryLength; i++) {
            const history = usePlayerProps.movementHistory[i];
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.rect(history[0], history[1], 5, 5);
            ctx.fill();
            ctx.closePath();
        };*/
        

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
                settings.currentLevel += 1;
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