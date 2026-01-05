const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

/* Critical Functions */
async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function halt(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; }
function getDistance(y2, y1, x2, x1) { return Math.abs(x2 - x1) + Math.abs(y2 - y1) };
function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; }

let GAMEsavedUnits = [];
let GAMEsavedMap;
let GAMEStarted = false;
let GAMEPaused = true;
let GAMESpeed = 1;
let GAMEtickRate = 2;

let GAMEselectedUnitType;
let GAMEloadedSelectedUnitType = false;
let GAMEselectedUnit = null;
let GAMEGUIUnits = [];

let GAMETrashcanSelected = false;
let GAMEfillBucketSelected = false;

/* TEXTURES */
const gameTextures = {
    missingTexture: makeImage("missing"),
    debugOutline: makeImage("debugOutline"),

    warrior: makeImage("hud/warrior"),
    fishling: makeImage("hud/fishling"),
    elf: makeImage("hud/elf"),
    troll: makeImage("hud/troll"),
    fledgling: makeImage("hud/fledgling"),
    goblin: makeImage("hud/goblin"),

    warriorFootSoldier0: makeImage("creatures/warriors/footSoldier/footSoldier0"),
    warriorFootSoldier1: makeImage("creatures/warriors/footSoldier/footSoldier1"),
    warriorFootSoldier2: makeImage("creatures/warriors/footSoldier/footSoldier2"),
    warriorArcher0: makeImage("creatures/warriors/archer/archer0"),
    warriorArcher1: makeImage("creatures/warriors/archer/archer1"),
    warriorArcher2: makeImage("creatures/warriors/archer/archer2"),
    warriorKnight0: makeImage("creatures/warriors/knight/knight0"),
    warriorKnight1: makeImage("creatures/warriors/knight/knight1"),
    warriorKnight2: makeImage("creatures/warriors/knight/knight2"),
    warriorUndead0: makeImage("creatures/warriors/undead/undead0"),
    warriorUndead1: makeImage("creatures/warriors/undead/undead1"),
    warriorUndead2: makeImage("creatures/warriors/undead/undead2"),
    warriorRusher0: makeImage("creatures/warriors/rusher/rusher0"),
    warriorRusher1: makeImage("creatures/warriors/rusher/rusher1"),
    warriorRusher2: makeImage("creatures/warriors/rusher/rusher2"),

    goblinFootSoldier0: makeImage("creatures/goblins/footSoldier/footSoldier0"),
    goblinFootSoldier1: makeImage("creatures/goblins/footSoldier/footSoldier1"),
    goblinFootSoldier2: makeImage("creatures/goblins/footSoldier/footSoldier2"),
    goblinArcher0: makeImage("creatures/goblins/archer/archer0"),
    goblinArcher1: makeImage("creatures/goblins/archer/archer1"),
    goblinArcher2: makeImage("creatures/goblins/archer/archer2"),
    goblinLarge0: makeImage("creatures/goblins/large/large0"),
    goblinLarge1: makeImage("creatures/goblins/large/large1"),
    goblinLarge2: makeImage("creatures/goblins/large/large2"),
    goblinBerserker0: makeImage("creatures/goblins/Berserker/Berserker0"),
    goblinBerserker1: makeImage("creatures/goblins/Berserker/Berserker1"),
    goblinBerserker2: makeImage("creatures/goblins/Berserker/Berserker2"),
    goblinBiter0: makeImage("creatures/goblins/biter/biter0"),
    goblinBiter1: makeImage("creatures/goblins/biter/biter1"),
    goblinBiter2: makeImage("creatures/goblins/biter/biter2"),
    goblinBomber0: makeImage("creatures/goblins/bomber/bomber0"),
    goblinBomber1: makeImage("creatures/goblins/bomber/bomber1"),
    goblinBomber2: makeImage("creatures/goblins/bomber/bomber2"),
    explosion: makeImage("creatures/explosion"),

    fishlingFootSoldier0: makeImage("creatures/fishlings/footSoldier/footSoldier0"),
    fishlingFootSoldier1: makeImage("creatures/fishlings/footSoldier/footSoldier1"),
    fishlingFootSoldier2: makeImage("creatures/fishlings/footSoldier/footSoldier2"),
    fishlingArcher0: makeImage("creatures/fishlings/archer/archer0"),
    fishlingArcher1: makeImage("creatures/fishlings/archer/archer1"),
    fishlingArcher2: makeImage("creatures/fishlings/archer/archer2"),   
    fishlingRusher0: makeImage("creatures/fishlings/rusher/rusher0"), 
    fishlingRusher1: makeImage("creatures/fishlings/rusher/rusher1"), 
    fishlingRusher2: makeImage("creatures/fishlings/rusher/rusher2"), 
    fishlingDiver0: makeImage("creatures/fishlings/diver/diver0"), 
    fishlingDiver1: makeImage("creatures/fishlings/diver/diver1"),
    fishlingDiver2: makeImage("creatures/fishlings/diver/diver2"),
    waterBubble: makeImage("creatures/waterBubble"),

    ironSword: makeImage("weapons/ironSword"),
    trident: makeImage("weapons/trident"),
    knightSword: makeImage("weapons/knightSword"),
    undeadSword: makeImage("weapons/undeadSword"),
    dagger: makeImage("weapons/dagger"),
    fishlingDagger: makeImage("weapons/fishlingDagger"),
    largeSword: makeImage("weapons/largeSword"),

    bow: makeImage("weapons/bow"),
    loadedBow: makeImage("weapons/loadedBow"),
    fishlingBow: makeImage("weapons/fishlingBow"),
    loadedFishlingBow: makeImage("weapons/loadedFishlingBow"),

    arrow: makeImage("arrows/arrow"),
    fishlingArrow: makeImage("arrows/fishlingArrow"),

    unitBar: makeImage("tabUnitBar"),
    unitSelectBar: makeImage("tabUnitSelect"),
    mapBar: makeImage("mapBar"),

    grass: makeImage("grass"),
    stone: makeImage("stone"),
    shallowwater: makeImage("shallowWater"),
    deepwater: makeImage("deepWater"),
    sand: makeImage("sand"),
    lava: makeImage("lava"),

    saveIcon: makeImage("hud/saveIcon"),
    uploadIcon: makeImage("hud/uploadIcon"),
    playButton: makeImage("hud/playButton"),
    pauseButton: makeImage("hud/pauseButton"),
    halfSpeedButton: makeImage("hud/halfSpeed"),
    normalSpeedButton: makeImage("hud/normalSpeed"),
    doubleSpeedButton: makeImage("hud/doubleSpeed"),
    resetButton: makeImage("hud/resetButton"),
    fillBucketButton: makeImage("hud/fillBucketButton"),
    trashCanButton: makeImage("hud/trashCanButton"),
    removeButton: makeImage("hud/removeUnitButton"),
}

/* CANVAS VARIABLES */
const WP = {
    windowWidth: 0,
    windowHeight: 0,
    resized: false,
    getWindowResize: function () {
        WP.windowWidth = window.innerWidth;
        WP.windowHeight = window.innerHeight;
        WP.resized = true;
    },
    right: function (x) { return WP.windowWidth - x; },
    bottom: function (y) { return WP.windowHeight - y; },
    middle: function (x) { return (WP.windowWidth - x) / 2; },
    center: function (y) { return (WP.windowHeight - y) / 2; },
}

/* INPUT VARIABLES */
const MKI = {
    x: 0,
    y: 0,
    downX: 0,
    downY: 0,
    changeX: 0,
    changeY: 0,
    wentDown: false,
    wentUp: false,
    currentMouse: null,
    initialTarget: null,
    lastScroll: 0,
    getMouseMove: function (event) {
        const rect = mainWindow.getBoundingClientRect();
        const scaleX = mainWindow.width / rect.width;
        const scaleY = mainWindow.height / rect.height;

        MKI.x = (event.clientX - rect.left) * scaleX;
        MKI.y = (event.clientY - rect.top) * scaleY;
    },
    getMouseDown: function (event) {
        const rect = mainWindow.getBoundingClientRect();
        const scaleX = mainWindow.width / rect.width;
        const scaleY = mainWindow.height / rect.height;

        MKI.x = (event.clientX - rect.left) * scaleX;
        MKI.y = (event.clientY - rect.top) * scaleY;

        MKI.currentMouse = event.button;
        if (event.button == 2) {
            MKI.downX = MKI.x;
            MKI.downY = MKI.y;
            MKI.changeX = MKI.x;
            MKI.changeY = MKI.y;
        }
        MKI.wentDown = true;
    },
    getMouseUp: function (event) {
        MKI.currentMouse = null;
        MKI.wentUp = true;
    },
    getRightClick: function (event) {
        event.preventDefault();
    },
    getMouseScroll: function (event) {
        event.preventDefault();
        const rect = mainWindow.getBoundingClientRect();
        const mouseXCanvas = event.clientX - rect.left;
        const mouseYCanvas = event.clientY - rect.top;

        const tileSize = WP.windowWidth / BM.maxColumns;
        const oldTileSize = tileSize * BM.zoom;

        let newZoom = BM.zoom;
        if (event.deltaY < 0) {
            newZoom = Math.min(BM.zoom * BM.zoomFactor, 2);
        } else {
            newZoom = Math.max(BM.zoom / BM.zoomFactor, 0.375);
        }

        if (newZoom == BM.zoom) { return };
        const newTileSize = tileSize * newZoom;
        const centerX = WP.windowWidth / 2;
        const centerY = WP.windowHeight / 2;
        const worldX = BM.mouseX + (mouseXCanvas - centerX) / oldTileSize;
        const worldY = BM.mouseY + (mouseYCanvas - centerY) / oldTileSize;
        BM.zoom = newZoom;
        BM.mouseX = worldX - (mouseXCanvas - centerX) / newTileSize;
        BM.mouseY = worldY - (mouseYCanvas - centerY) / newTileSize;
    }
}

/* BATTLE MAP */
class BM {
    static canEdit = true;
    static currentTile = null;
    static maxColumns = 50;
    static maxRows = 50;
    static mouseX = this.maxColumns / 2;
    static mouseY = this.maxRows / 2;
    static zoom = 1;
    static zoomFactor = 1.1;
    static map = [[]];
    static tiles = ["Grass", "Stone", "Shallow Water", "Deep Water", "Sand", "Lava"];

    static render() {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        for (let y = 0; y < BM.maxRows; y++) {
            for (let x = 0; x < BM.maxColumns; x++) {
                const screenX = Math.floor((x - BM.mouseX) * tileSize + halfWidth);
                const screenY = Math.floor((y - BM.mouseY) * tileSize + halfHeight);

                if (screenX + size < 0 || screenX > WP.windowWidth || screenY + size < 0 || screenY > WP.windowHeight) { continue };

                ctx.drawImage(
                    gameTextures[BM.map[y][x]],
                    screenX,
                    screenY,
                    size, size
                );
            }
        }
    }
}

/* GUI */
class GUI {
    static instances = new Map();
    enabled = false;
    content = null;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    zindex = 0;
    darkness = 0;
    constructor(name, content, x, y, width, height, zindex) {
        this.name = name;
        this.content = content;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zindex = zindex
        GUI.instances.set(name, this);
    }
    update(x, y, width, height, zindex) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zindex = zindex ? zindex : this.zindex;
    }
    render() {
        this.enabled = true;
        ctx.drawImage(gameTextures[this.content], this.x, this.y, this.width, this.height);
        if (this.darkness != 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.darkness})`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    renderText() {
        this.enabled = true;
        
        ctx.fillStyle = `rgba(255, 0, 0)`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.font = "35px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.content, this.x+this.width/2, this.y+this.height/2);
    }
}

/* CREATURE */
const ArrowData = {
    "normal": {
        texture: "arrow",
        damage: 15,
        speed: 0.125,
        lifeTime: 100,
        size: 2,
        hitboxSize: 0.125,
        piercing: false,
        maxPierces: 0,
    },
    "fishling": {
        texture: "fishlingArrow",
        damage: 15,
        speed: 0.125,
        lifeTime: 100,
        size: 2,
        hitboxSize: 0.125,
        piercing: false,
        maxPierces: 0,
    }
}
const WeaponData = {
    "ironSword": {
        range: 2,
        damage: 33,
        attackRate: 20,
        attackDuration: 12,
        coolDownTime: 8,
        isMelee: true,
        texture: "ironSword",
        width: 1,
        height: 1,
    },
    "strongIronSword": {
        range: 2,
        damage: 33,
        attackRate: 15,
        attackDuration: 6,
        coolDownTime: 4,
        isMelee: true,
        texture: "ironSword",
        width: 1,
        height: 1,
    },
    "trident": {
        range: 3,
        damage: 33,
        attackRate: 20,
        attackDuration: 20,
        coolDownTime: 16,
        isMelee: true,
        texture: "trident",
        width: 1,
        height: 1.25,
    },
    "knightSword": {
        range: 3,
        damage: 50,
        attackRate: 20,
        attackDuration: 20,
        coolDownTime: 16,
        isMelee: true,
        texture: "knightSword",
        width: 1,
        height: 1.25,
    },
    "undeadSword": {
        range: 2,
        damage: 22,
        attackRate: 20,
        attackDuration: 12,
        coolDownTime: 8,
        isMelee: true,
        texture: "undeadSword",
        width: 1,
        height: 1,
    },
    "dagger": {
        range: 1,
        damage: 8,
        attackRate: 10,
        attackDuration: 6,
        coolDownTime: 4,
        isMelee: true,
        texture: "dagger",
        width: 0.5,
        height: 0.5,
    },
    "fishlingDagger": {
        range: 1,
        damage: 8,
        attackRate: 10,
        attackDuration: 6,
        coolDownTime: 4,
        isMelee: true,
        texture: "fishlingDagger",
        width: 0.5,
        height: 0.5,
    },
    "largeSword": {
        range: 4,
        damage: 50,
        attackRate: 30,
        attackDuration: 20,
        coolDownTime: 16,
        isMelee: true,
        texture: "largeSword",
        width: 1,
        height: 1.5,
    },
    "bow": {
        range: 10,
        attackRate: 50,
        attackDuration: 10,
        coolDownTime: 20,
        isMelee: false,
        texture: "bow",
        loadedTexture: "loadedBow",
        arrowType: "normal",
        width: 1,
        height: 1,
    },
    "fishlingBow": {
        range: 10,
        attackRate: 50,
        attackDuration: 10,
        coolDownTime: 20,
        isMelee: false,
        texture: "fishlingBow",
        loadedTexture: "loadedFishlingBow",
        arrowType: "fishling",
        width: 1,
        height: 1,
    },
    "bite": {
        range: 1,
        damage: 5,
        attackRate: 0,
        attackDuration: 0,
        coolDownTime: 0,
        isEvent: true,
        isMelee: true,
        texture: null,
        width: 1,
        height: 1,
    },
    "explode": {
        range: 1,
        damage: 0,
        attackRate: 0,
        attackDuration: 0,
        coolDownTime: 0,
        isEvent: true,
        isMelee: true,
        texture: null,
        width: 1,
        height: 1,
    },
}
const SoulData = {
    "normal": {
        tileProps: { "grass": { risk: 1, speed: 1 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.25 }, "deepwater": { risk: 25, speed: 0.125 }, "sand": { risk: 2, speed: 0.9 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 15,
        alertVision: 7,
        wanderChance: 1,
    },
    "warriorUndead": {
        tileProps: { "grass": { risk: 1, speed: 1.25 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.5 }, "deepwater": { risk: 25, speed: 0.375 }, "sand": { risk: 2, speed: 1.15 }, "lava": { risk: 25, speed: 0.375 } },
        detectVision: 10,
        alertVision: 2,
        wanderChance: 1,
    },
    "warriorRusher": {
        tileProps: { "grass": { risk: 1, speed: 1.25 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.5 }, "deepwater": { risk: 25, speed: 0.375 }, "sand": { risk: 2, speed: 1.15 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 12,
        alertVision: 4,
        wanderChance: 1,
    },
    "warriorKnight": {
        tileProps: { "grass": { risk: 1, speed: 0.875}, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.125 }, "deepwater": { risk: Number.MAX_VALUE, speed: 0 }, "sand": { risk: 2, speed: 0.775 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 20,
        alertVision: 12,
        wanderChance: 1,
    },
    "swimmer": {
        tileProps: { "grass": { risk: 8, speed: 0.5 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 1, speed: 1 }, "deepwater": { risk: 2, speed: 0.8 }, "sand": { risk: 4, speed: 0.75 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 15,
        alertVision: 7,
        wanderChance: 1,
    },
    "rushingSwimmer": {
        tileProps: { "grass": { risk: 8, speed: 0.75 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 1, speed: 1.25 }, "deepwater": { risk: 2, speed: 1.05 }, "sand": { risk: 4, speed: 1 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 12,
        alertVision: 4,
        wanderChance: 1,
    },
    "fishlingDiver": {
        tileProps: { "grass": { risk: 8, speed: 0.5 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 1, speed: 1 }, "deepwater": { risk: 2, speed: 0.8 }, "sand": { risk: 4, speed: 0.75 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 15,
        alertVision: 7,
        wanderChance: 1,
    },
    "large": {
        tileProps: { "grass": { risk: 1, speed: 0.5 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.125 }, "deepwater": { risk: Number.MAX_VALUE, speed: 0 }, "sand": { risk: 2, speed: 0.45 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 20,
        alertVision: 12,
        wanderChance: 1,
    },
    "biter": {
        tileProps: { "grass": { risk: 1, speed: 1.5 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.5 }, "deepwater": { risk: 25, speed: 0.25 }, "sand": { risk: 2, speed: 1.3 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 15,
        alertVision: 0,
        wanderChance: 1,
    },
    "bomber": {
        tileProps: { "grass": { risk: 1, speed: 0.5 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.125 }, "deepwater": { risk: 25, speed: 0.0625 }, "sand": { risk: 2, speed: 0.45 }, "lava": { risk: Number.MAX_VALUE, speed: 0 } },
        detectVision: 15,
        alertVision: 0,
        wanderChance: 1,
    },
}
const CreatureTypes = {
    "warrior": {
        "footSoldier": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "warriorFootSoldier0",
            healthMiddle: "warriorFootSoldier1",
            healthLow: "warriorFootSoldier2",
        },
        "archer": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "warriorArcher0",
            healthMiddle: "warriorArcher1",
            healthLow: "warriorArcher2",
        },
        "knight": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 300,
            healthHigh: "warriorKnight0",
            healthMiddle: "warriorKnight1",
            healthLow: "warriorKnight2",
        },
        "undead": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 75,
            healthHigh: "warriorUndead0",
            healthMiddle: "warriorUndead1",
            healthLow: "warriorUndead2",
        },
        "rusher": {
            hitboxSize: 0.5,
            width: 0.625,
            height: 0.625,
            health: 100,
            healthHigh: "warriorRusher0",
            healthMiddle: "warriorRusher1",
            healthLow: "warriorRusher2",
        }
    },
    "goblin": {
        "footSoldier": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "goblinFootSoldier0",
            healthMiddle: "goblinFootSoldier1",
            healthLow: "goblinFootSoldier2",
        },
        "archer": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "goblinArcher0",
            healthMiddle: "goblinArcher1",
            healthLow: "goblinArcher2",
        },
        "large": {
            hitboxSize: 0.75,
            width: 0.75,
            height: 0.75,
            health: 250,
            healthHigh: "goblinLarge0",
            healthMiddle: "goblinLarge1",
            healthLow: "goblinLarge2",
        },
        "berserker": {
            hitboxSize: 0.5,
            width: 0.75,
            height: 0.75,
            health: 75,
            healthHigh: "goblinBerserker0",
            healthMiddle: "goblinBerserker1",
            healthLow: "goblinBerserker2",
        },
        "biter": {
            hitboxSize: 0.25,
            width: 0.25,
            height: 0.25,
            health: 25,
            healthHigh: "goblinBiter0",
            healthMiddle: "goblinBiter1",
            healthLow: "goblinBiter2",
        },
        "bomber": {
            hitboxSize: 0.5,
            width: 0.625,
            height: 0.625,
            health: 125,
            healthHigh: "goblinBomber0",
            healthMiddle: "goblinBomber1",
            healthLow: "goblinBomber2",
        },
    },
    "fishling": {
        "footSoldier": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "fishlingFootSoldier0",
            healthMiddle: "fishlingFootSoldier1",
            healthLow: "fishlingFootSoldier2",
        },
        "archer": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "fishlingArcher0",
            healthMiddle: "fishlingArcher1",
            healthLow: "fishlingArcher2",
        },
        "rusher": {
            hitboxSize: 0.5,
            width: 0.625,
            height: 0.625,
            health: 100,
            healthHigh: "fishlingRusher0",
            healthMiddle: "fishlingRusher1",
            healthLow: "fishlingRusher2",
        },
        "diver": {
            hitboxSize: 0.5,
            width: 0.5,
            height: 0.5,
            health: 100,
            healthHigh: "fishlingDiver0",
            healthMiddle: "fishlingDiver1",
            healthLow: "fishlingDiver2",
            diver: true,
        }
    }
}
class Creature {
    // Positional
    static allUnits = new Set();
    static allUnitPositions = new Map(); // int<int<Set(Creature)>>
    static allArrows = new Set(); // {x, y, type, lifeTime, direction, isGood, allPierced}
    static allExplosions = []; // [y, x, radius, lifeTime]
    static tileCapacity = 4;

    // Core
    xPos; fluidXPos; oldXPos;
    yPos; fluidYPos; oldYPos;
    health; maxHealth;
    isGood; subClass; classType; soulType; weaponType;
    standingTile;
    // Debug
    debugMode; debugEnemy;  debugAlly;
    // Movement
    allTargets = new Set();
    targetChain = [];
    moving = false;
    justLostTarget = false;
    isDiver = false;    underWater = false;
    // Attack
    attackTick = 0;
    attacking = false;
    lastAttackAngle = 0;
    biters = new Set(); bit = null;
    exploded = false;

    static updateAllUnitPositions(unit) { // Helper
        // Position
        if (!Creature.allUnitPositions.has(unit.yPos)) {
            Creature.allUnitPositions.set(unit.yPos, new Map());
        }
        if (!Creature.allUnitPositions.get(unit.yPos).has(unit.xPos)) {
            let newSet = new Set();
            newSet.add(unit);
            Creature.allUnitPositions.get(unit.yPos).set(unit.xPos, newSet);
        } else {
            Creature.allUnitPositions.get(unit.yPos).get(unit.xPos).add(unit);
        }
    }
    static makeUnitConnection(unit, y, x, alertVision) { // Helper
        const allyUnits = new Set();
        if (Creature.allUnitPositions.has(y) && Creature.allUnitPositions.get(y).has(x)) {
            for (let target of Creature.allUnitPositions.get(y).get(x)) {
                if (target == unit) {
                    continue;
                }
                if (unit.isGood != target.isGood) {
                    if (!unit.isMelee && target.underWater) {
                        continue;
                    } else {
                        if (unit.targetChain.length > 0) {
                            if (unit.targetChain[0] == target || getDistance(target.yPos, unit.yPos, target.xPos, unit.xPos) < getDistance(unit.targetChain[0].yPos, unit.yPos, unit.targetChain[0].xPos, unit.xPos)) {
                                unit.targetChain = [target];
                                unit.allTargets.clear();
                                unit.allTargets.add(target);
                            }
                        } else {
                            unit.targetChain = [target];
                            unit.allTargets.add(target);
                        }
                    }
                } else {
                    const distanceFromAlly = getDistance(unit.yPos, y, unit.xPos, x);
                    if (distanceFromAlly <= alertVision) {
                        allyUnits.add(target);
                    }
                }
            }
        }
        return allyUnits;
    }

    /* Weapons */
    static isClearPath(y1, x1, y2, x2) { // Helper
        // Math stuff
        let cx = Math.floor(x1);
        let cy = Math.floor(y1);
        const endX = Math.floor(x2);
        const endY = Math.floor(y2);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const stepX = Math.sign(dx);
        const stepY = Math.sign(dy);
        const tDeltaX = dx !== 0 ? Math.abs(1 / dx) : Infinity;
        const tDeltaY = dy != 0 ? Math.abs(1 / dy) : Infinity;
        // More math stuff
        function getTMax(z, dz) {
            if (dz > 0) {
                return (Math.floor(z) + 1 - z) / dz;
            } else if (dz < 0) {
                return (z - Math.floor(z)) / -dz;
            } else {
                return Infinity;
            }
        }
        let tMaxX = getTMax(x1, dx);
        let tMaxY = getTMax(y1, dy);
        // Loop
        while (true) {
            if (cy >= 0 && cy < BM.maxRows && cx >= 0 && cx < BM.maxColumns) {
                if (BM.map[cy][cx] == "stone") {
                    return false;
                }
                if (cx == endX && cy == endY) {
                    return true;
                }
                if (tMaxX < tMaxY) {
                    tMaxX += tDeltaX;
                    cx += stepX;
                } else {
                    tMaxY += tDeltaY;
                    cy += stepY;
                }
            } else {
                return false;
            }
        }
    }
    static explode(self) { // Helper
        const radius = 3
        Creature.allExplosions.push([
            self.yPos,
            self.xPos,
            radius,
            100,
        ]);
        self.exploded = true;
        self.health = 0;
        const eY = self.yPos;
        const eX = self.xPos;
        const i = Math.floor(radius/2) + 1;
        for (let y = -i; y <= i; y++) {
            for (let x = -i; x <= i; x++) {
                const nY = eY + y;
                const nX = eX + x;
                if (Creature.allUnitPositions.has(nY) && Creature.allUnitPositions.get(nY).has(nX)) {
                    for (const unit of Creature.allUnitPositions.get(nY).get(nX)) {
                        const isBomber = (unit.weaponType == "explode");
                        if (unit.isGood != self.isGood || isBomber) {
                            const uY = unit.fluidYPos;
                            const uX = unit.fluidXPos;
                            if ((uY >= eY - i + 0.5 && uY <= eY + i - 0.5)
                            &&  (uX >= eX - i + 0.5  && uX <= eX + i - 0.5)) {
                                unit.health = 0;
                                if (isBomber && !unit.exploded) {
                                    Creature.explode(unit);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    static attack(unit, targetUnit) { // Main
        const currentWeapon = WeaponData[unit.weaponType];
        const attackRate = currentWeapon.attackRate;
        const attackDuration = currentWeapon.attackDuration;
        const coolDownTime = currentWeapon.coolDownTime;

        if (currentWeapon.isEvent) {
            if (unit.classType == "biter" && !unit.bit && targetUnit) {
                unit.bit = targetUnit;
                targetUnit.biters.add(unit);
                targetUnit.health -= currentWeapon.damage;
            } else if (unit.classType == "bomber" && !unit.exploded) {
                Creature.explode(unit);
            }
        } else {
            unit.attackTick += 1;
            if (unit.attackTick == attackRate) {
                // Lost target
                if (!targetUnit) {
                    unit.attackTick = 0;
                    return;
                }
                unit.attacking = true;
                if (currentWeapon.isMelee) { // Melee attack
                    targetUnit.health -= currentWeapon.damage;
                } else { // Ranged attack
                    const arrow = {
                        x: unit.fluidXPos,
                        y: unit.fluidYPos,
                        type: currentWeapon.arrowType,
                        lifeTime: 0,
                        direction: Math.atan2(unit.fluidYPos - targetUnit.fluidYPos, unit.fluidXPos - targetUnit.fluidXPos),
                        isGood: unit.isGood,
                        allPierced: new Set(),
                    };
                    Creature.allArrows.add(arrow);
                }
            } else {
                if (unit.attackTick == attackRate + attackDuration) {
                    unit.attacking = false;
                } else {
                    if (unit.attackTick >= attackRate + attackDuration + coolDownTime) {
                        unit.attackTick = 0;
                    }
                }
            }
        }
    }
    static handleArrows() { // Main
        const deadArrows = new Set();
        for (const arrow of Creature.allArrows) {
            const arrowInfo = ArrowData[arrow.type];
            // Remove old arrows
            if (arrow.lifeTime >= arrowInfo.lifeTime) {
                deadArrows.add(arrow);
                continue;
            }
            arrow.lifeTime += 1;

            // Damage units
            function getHitUnits() {
                // Hit stone
                const closestY = Math.round(arrow.y);
                const closestX = Math.round(arrow.x);
                if (BM.map[closestY] && BM.map[closestY][closestX] == "stone") {
                    return true;
                }

                const touchingY = new Set();
                touchingY.add(Math.floor(arrow.y));
                touchingY.add(Math.ceil(arrow.y));
                const touchingX = new Set();
                touchingX.add(Math.floor(arrow.x));
                touchingX.add(Math.ceil(arrow.x));
                const surroundingTiles = new Map(); // int<Set(int)>>
                for (const y of touchingY) {
                    for (const x of touchingX) {
                        for (let [yDir, xDir] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                            const ny = y + yDir;
                            const nx = x + xDir;
                            if (!surroundingTiles.has(ny)) {
                                surroundingTiles.set(ny, new Set());
                            } else {
                                if (surroundingTiles.get(ny).has(nx)) {
                                    continue;
                                }
                            }
                            surroundingTiles.get(ny).add(nx);
                            if (!Creature.allUnitPositions.has(ny) || !Creature.allUnitPositions.get(ny).has(nx)) {
                                continue;
                            }
                            for (const unit of Creature.allUnitPositions.get(ny).get(nx)) {
                                const dx = unit.fluidXPos - arrow.x;
                                const dy = unit.fluidYPos - arrow.y;
                                if (unit.isGood != arrow.isGood && !unit.underWater && (dx * dx + dy * dy) <= arrowInfo.hitboxSize / 2) {
                                    unit.health -= arrowInfo.damage;
                                    if (!arrowInfo.piercing) {
                                        return (true);
                                    } else if (!arrow.allPierced.has(unit)) {
                                        arrow.totalPierced += 1;
                                        arrow.allPierced.add(unit);
                                        if (arrow.allPierced.length >= arrowInfo.maxPierces) {
                                            return (true);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return (false);
            }
            const arrowDestroyed = getHitUnits();
            if (arrowDestroyed) {
                deadArrows.add(arrow);
            } else {
                // Move arrow in direction
                arrow.x += Math.cos(arrow.direction + Math.PI) * arrowInfo.speed;
                arrow.y += Math.sin(arrow.direction + Math.PI) * arrowInfo.speed;
            }
        }
        for (const arrow of deadArrows) {
            Creature.allArrows.delete(arrow);
        }
    }

    /* Smart Movement */
    static getValidTiles(unit, targetUnit, detectVision, alertVision, pathFindingConfig) { // Helper
        //console.log(pathFindingConfig)
        const validTiles = new Map();
        let allyUnits = new Set();
        for (let i = 0; i < 2; i++) {
            const useUnit = (i == 0 ? unit : targetUnit)
            if (!useUnit) { break };
            for (let y = useUnit.yPos + detectVision; y >= useUnit.yPos - detectVision; y--) {
                let ySpread = Math.abs(useUnit.yPos - y);
                let xSpread = detectVision - ySpread;
                for (let x = useUnit.xPos + xSpread; x >= useUnit.xPos - xSpread; x--) {
                    if (y >= 0 && x >= 0 && y < BM.maxRows && x < BM.maxColumns) {
                        if (unit.targetChain.length < 3 && useUnit == unit) {
                            // Adds targets
                            const newAllies = Creature.makeUnitConnection(unit, y, x, alertVision);
                            for (const ally of newAllies) {
                                allyUnits.add(ally);
                            }
                        }
                        if (!validTiles.has(y)) {
                            validTiles.set(y, new Map());
                        }

                        const tileAtCapacity = (Creature.allUnitPositions.has(y) ? (Creature.allUnitPositions.get(y).has(x) ? Creature.allUnitPositions.get(y).get(x).size >= Creature.tileCapacity : false) : false);
                        const risk = SoulData[unit.soulType].tileProps[BM.map[y][x]].risk;
                        if (pathFindingConfig == 0) { // Astar
                            validTiles.get(y).set(x, { y: y, x: x, f: 0, g: 0, h: 0, pY: null, pX: null, r: risk, c: tileAtCapacity });
                        } else if (pathFindingConfig == 1) { // Flow Field
                            validTiles.get(y).set(x, { r: risk, d: getDistance(y, targetUnit.yPos, x, targetUnit.xPos), c: tileAtCapacity });
                        } else { // Wander
                            validTiles.get(y).set(x, { r: risk, c: tileAtCapacity });
                        }
                    }
                }
            }
        }
        return [validTiles, allyUnits];
    }
    static aStar(unit, targetUnit, validTiles) { // Helper
        const startNode = validTiles.get(unit.yPos).get(unit.xPos);
        startNode.h = (Math.abs(targetUnit.xPos - unit.xPos) + Math.abs(targetUnit.yPos - unit.yPos));
        startNode.f = startNode.h;
        const path = [];
        const openSet = [[unit.yPos, unit.xPos]];
        const openSetAsMap = new Map();
        openSetAsMap.set(unit.yPos, new Set());
        openSetAsMap.get(unit.yPos).add(unit.xPos);
        const closedMap = new Map();
        while (openSet.length > 0) {
            let lowestIndex = 0;
            const openLength = openSet.length;
            for (let i = 0; i < openLength; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }

            let currentY = openSet[lowestIndex][0];
            let currentX = openSet[lowestIndex][1];
            if (currentY == targetUnit.yPos && currentX == targetUnit.xPos) {
                let nextY = currentY;
                let nextX = currentX;
                path.push([nextY, nextX]);
                while (nextY != null && nextX != null) {
                    let nextData = validTiles.get(nextY).get(nextX);
                    nextY = nextData.pY;
                    nextX = nextData.pX;
                    path.push([nextY, nextX]);
                }
                return (path.length >= 3 ? path[path.length - 3] : []);
            }

            openSetAsMap.get(openSet[lowestIndex][0]).delete(openSet[lowestIndex][1]);
            openSet.splice(lowestIndex, 1);
            if (!closedMap.has(currentY)) {
                closedMap.set(currentY, new Set());
            }
            closedMap.get(currentY).add(currentX);

            let neighboringTiles = shuffleArray([[0, 1], [1, 0], [0, -1], [-1, 0]]);
            for (let d of neighboringTiles) {
                let nY = currentY + d[0];
                let nX = currentX + d[1];
                if (validTiles.has(nY) && validTiles.get(nY).has(nX)) {
                    if (SoulData[unit.soulType].tileProps[BM.map[nY][nX]].speed != 0) {
                        if (!validTiles.get(nY).get(nX).c) {
                            if (!closedMap.has(nY) || !closedMap.get(nY).has(nX)) {
                                const possibleG = validTiles.get(currentY).get(currentX).g + validTiles.get(nY).get(nX).r;
                                const neighborData = validTiles.get(nY).get(nX);
                                const missingYOnMap = !openSetAsMap.has(nY);
                                if (missingYOnMap || !openSetAsMap.get(nY).has(nX)) {
                                    if (missingYOnMap) {
                                        openSetAsMap.set(nY, new Set());
                                    }
                                    openSetAsMap.get(nY).add(nX);
                                    openSet.push([nY, nX]);
                                } else if (possibleG >= neighborData.g) {
                                    continue;
                                }

                                neighborData.g = possibleG;
                                function getMinRisk(soulType) {
                                    let min = Infinity;
                                    for (const tile in SoulData[soulType].tileProps) {
                                        const risk = SoulData[soulType].tileProps[tile].risk;
                                        if (risk > 0 && risk < min) min = risk;
                                    }
                                    return min;
                                }
                                const MIN_RISK = getMinRisk(unit.soulType);
                                const dx = Math.abs(targetUnit.xPos - neighborData.x);
                                const dy = Math.abs(targetUnit.yPos - neighborData.y);
                                neighborData.h = (dx + dy) * MIN_RISK;
                                neighborData.f = neighborData.g + neighborData.h;
                                neighborData.pY = currentY;
                                neighborData.pX = currentX;
                            }
                        }
                    }
                }
            }
        }
        return ([]);
    }
    static flowField(unit, validTiles) { // Helper
        // Get next tile
        let bestY = unit.yPos;
        let bestX = unit.xPos;
        let bestRisk = Number.MAX_VALUE;
        let bestDistance = Number.MAX_VALUE;
        let directions = shuffleArray([[0, 1], [1, 0], [0, -1], [-1, 0]]);
        for (let [yDir, xDir] of directions) {
            let nY = unit.yPos + yDir;
            let nX = unit.xPos + xDir;
            if (validTiles.has(nY) && validTiles.get(nY).has(nX)) {
                if (SoulData[unit.soulType].tileProps[BM.map[nY][nX]].speed != 0) {
                    if (!validTiles.get(nY).get(nX).c) {
                        let nDistance = validTiles.get(nY).get(nX).d;
                        let nRisk = validTiles.get(nY).get(nX).r;
                        if (nDistance < bestDistance || (nDistance === bestDistance && nRisk < bestRisk)) {
                            bestY = nY;
                            bestX = nX;
                            bestRisk = nRisk;
                            bestDistance = nDistance;
                        }
                    }
                }
            }
        }
        return ([bestY, bestX]);
    }
    static wander(unit, validTiles) { // Helper
        let touchingTiles = shuffleArray([[0, 1], [1, 0], [0, -1], [-1, 0]]);
        let currentRisk = SoulData[unit.soulType].tileProps[BM.map[unit.yPos][unit.xPos]].risk;
        let currentPosition = [unit.yPos, unit.xPos];
        let wanderChange = SoulData[unit.soulType].wanderChance;
        for (let d of touchingTiles) {
            let nY = unit.yPos + d[0];
            let nX = unit.xPos + d[1];
            if (validTiles.has(nY) && validTiles.get(nY).has(nX) && BM.map[nY][nX] != "stone") {
                let knownRisk = validTiles.get(nY).get(nX).r;
                if (knownRisk <= currentRisk * 5 && Math.random() <= wanderChange) {
                    if (!validTiles.get(nY).get(nX).c) {
                        currentRisk = knownRisk;
                        currentPosition[0] = nY;
                        currentPosition[1] = nX;
                    }
                }
            }
        }
        return currentPosition;
    }
    static smartMove(unit, movementType) {
        const detectVision = SoulData[unit.soulType].detectVision;
        const alertVision = SoulData[unit.soulType].alertVision;
        let targetUnit = (unit.targetChain.length > 0 ? unit.targetChain[unit.targetChain.length - 1] : null);
        const creatureOverload = (Creature.allUnits.size > 250); // Reduces lag on huge loads

        // Gets tiles to use in path finding
        const data = Creature.getValidTiles(unit, targetUnit, detectVision, alertVision, (movementType == 0 && creatureOverload ? 1 : 0));
        const validTiles = data[0];
        const allyUnits = data[1];

        // Just lost target
        if (unit.justLostTarget) {
            return ([false, allyUnits]);
        }

        // Adjusts Wander to AStar if nearby enemy found
        // if (movementType == 2 && unit.targetChain[0]) {
        //     console.log("FOUND ENEMY")
        //     targetUnit = unit.targetChain[unit.targetChain.length - 1];
        //     movementType = (creatureOverload ? 1 : 0);
        // }

        // Attack
        if (movementType != 2) {
            const targetEnemy = unit.targetChain[0];
            const distanceBetweenEnemy = getDistance(targetEnemy.yPos, unit.yPos, targetEnemy.xPos, unit.xPos);
            const currentWeapon = WeaponData[unit.weaponType];
            if (distanceBetweenEnemy <= currentWeapon.range && (currentWeapon.isMelee || Creature.isClearPath(unit.fluidYPos, unit.fluidXPos, targetEnemy.fluidYPos, targetEnemy.fluidXPos))) {
                if (unit.attackTick == 0) {
                    unit.attackTick = 1;
                }
                return ([false, allyUnits]);
            }
        }

        // Gets best next move
        let nextMove = null;
        if (movementType == 0) {
            nextMove = Creature.aStar(unit, targetUnit, validTiles);
        } else if (movementType == 1) {
            nextMove = Creature.flowField(unit, validTiles);
        } else if (movementType == 2) {
            nextMove = Creature.wander(unit, validTiles);
        }
        return ([nextMove, allyUnits]);
    }

    /* Updates Position */
    static setNextPosition(nextPositions) { // Main
        for (const [unit, desiredPosition] of nextPositions) {
            if (unit.health <= 0) {
                continue;
            }
            Creature.allUnitPositions.get(unit.yPos).get(unit.xPos).delete(unit);
            unit.yPos = desiredPosition[0];
            unit.xPos = desiredPosition[1];
            Creature.updateAllUnitPositions(unit);
            unit.moving = true;
        }
    }
    static moveUnit(unit, speedData) { // Main
        const dx = speedData[0];
        const dy = speedData[1];
        const dist = speedData[2];
        const speed = speedData[3];
        if (dist <= speed) {
            unit.fluidXPos = unit.xPos;
            unit.fluidYPos = unit.yPos;
            unit.oldYPos = unit.yPos;;
            unit.oldXPos = unit.xPos;
            unit.moving = false;
        } else {
            unit.fluidXPos += (dx / dist) * speed;
            unit.fluidYPos += (dy / dist) * speed;
        }
        return false;
    }

    static act() { // Main
        // Prune dead units
        const deadUnits = new Set();
        for (const unit of Creature.allUnits) {
            if (unit.health <= 0) {
                deadUnits.add(unit);
            }
        }
        for (const unit of deadUnits) {
            let deadY = unit.yPos;
            let deadX = unit.xPos;
            Creature.allUnits.delete(unit);
            Creature.allUnitPositions.get(deadY).get(deadX).delete(unit);
        }

        // All explosion
        const survivingExplosions = [];
        for (const explosion of Creature.allExplosions) {
            explosion[3] -= 1;
            if (explosion[3] > 0) {
                survivingExplosions.push(explosion);
            }
        }
        Creature.allExplosions = survivingExplosions;

        // Act for all units
        const visionData = new Map();
        const nextPositions = new Map();
        const lostTarget = new Set();
        for (const unit of Creature.allUnits) {
            for (const target of deadUnits) {
                if (unit.allTargets.has(target)) {
                    unit.allTargets.clear();
                    unit.targetChain = [];
                    unit.justLostTarget = true;
                }
                if (unit.bit === target) {
                    unit.bit = null;
                }
                if (unit.biters.has(target)) {
                    unit.biters.delete(target);
                }
            }
            // Unit above broke chain
            if (unit.targetChain.length > 0 
                && ((unit.targetChain[unit.targetChain.length - 1].targetChain.length <= 0 && unit.targetChain[unit.targetChain.length - 1].isGood == unit.isGood)
                || !unit.isMelee && unit.targetChain[0].underWater)
            ) {
                unit.allTargets.clear();
                unit.targetChain = [];
                unit.justLostTarget = true;
            }

            // Get standing tile
            function getSpeed() {
                const dx = unit.xPos - unit.fluidXPos;
                const dy = unit.yPos - unit.fluidYPos;
                const dist = Math.hypot(dx, dy);

                const useY = (dist <= 0.5 ? unit.yPos : unit.oldYPos);
                const useX = (dist <= 0.5 ? unit.xPos : unit.oldXPos);
                const speed = SoulData[unit.soulType].tileProps[BM.map[useY][useX]].speed * 0.05;

                return [[dx, dy, dist, speed], BM.map[useY][useX]];
            }
            const [speedData, standingTile] = getSpeed();
            unit.standingTile = standingTile;
            if (speedData[3] == 0) {
                unit.health -= unit.maxHealth/10;
            }
            if (unit.isDiver) {
                unit.underWater = (unit.standingTile == "deepwater");
            }

            // Progress attack
            if (unit.attackTick != 0) {
                Creature.attack(unit, unit.targetChain[0]);
            }

            if (!unit.moving || (unit.biters.size > 0 && !unit.bit)) {
                const moveData = Creature.smartMove(unit, (unit.allTargets.size == 0 ? 2 : 0));
                const nextMove = moveData[0];
                const allyUnits = moveData[1];
                if (nextMove) {
                    if (nextMove.length == 0) {
                        lostTarget.add(unit);
                        // No movement
                    } else {
                        nextPositions.set(unit, nextMove);
                        visionData.set(unit, allyUnits);
                    }
                }
            } else { // Transition to spot
                if (unit.biters.size <= 0 && !unit.bit) {
                    Creature.moveUnit(unit, speedData);
                }
            }

            // Remove useless chains
            const detectVision = SoulData[unit.soulType].detectVision;
            while (true) {
                const chainLength = unit.targetChain.length;
                if (chainLength >= 2) {
                    const nearEndOfChain = (chainLength == 2);
                    const secondTarget = unit.targetChain[chainLength - (nearEndOfChain ? 1 : 2)];
                    const distanceFromSecond = getDistance(secondTarget.yPos, unit.yPos, secondTarget.xPos, unit.xPos);
                    if (distanceFromSecond <= detectVision) {
                        unit.allTargets.delete(secondTarget);
                        unit.targetChain.pop();
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            unit.justLostTarget = false;
        }

        // Handles all arrows
        Creature.handleArrows();

        // Move all units
        Creature.setNextPosition(nextPositions);

        // Enemy recognition
        for (const [unit, allyUnits] of visionData) {
            // Break invalid chains
            let validChain = true;
            for (const target of unit.allTargets) {
                if (target.health <= 0) {
                    validChain = false;
                    break;
                }
            }
            if (!validChain || (unit.targetChain[0] && unit.targetChain[0].isGood == unit.isGood)) {
                continue;
            }
            // Set chains
            if (allyUnits.size > 0) {
                for (const ally of allyUnits) {
                    if (ally.targetChain.length == 0) {
                        if (unit.targetChain.length != 0) {
                            if (unit.targetChain[0].isGood != ally.isGood) {
                                let copiedChain = unit.targetChain.slice();
                                ally.targetChain = copiedChain;
                                ally.targetChain.push(unit);
                                ally.allTargets = new Set(unit.allTargets);
                                ally.allTargets.add(unit);
                            }
                        }
                    }
                }
            }
        }

        // Dismantles lost chains
        for (let unit of lostTarget) {
            unit.allTargets.clear();
            unit.targetChain = [];
        }
    }

    constructor(x, y, isGood, subClass, classType, soulType, weaponType) { // Core
        this.xPos = x; this.fluidXPos = x; this.oldXPos = x;
        this.yPos = y; this.fluidYPos = y; this.oldYPos = y;

        this.isGood = isGood;
        this.subClass = subClass;
        this.soulType = soulType;
        this.classType = classType
        this.weaponType = weaponType;
        this.health = CreatureTypes[subClass][classType].health;
        this.maxHealth = this.health;
        this.isDiver = CreatureTypes[subClass][classType].diver;
        Creature.allUnits.add(this);
        Creature.updateAllUnitPositions(this);
    }

    static renderInstances() { // Main
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        function getScreenPosition(z, mZ, halfZ) {
            return Math.floor((z - mZ + 0.5) * tileSize + halfZ);
        }

        // Render arrows
        for (const arrow of Creature.allArrows) {
            const arrowInfo = ArrowData[arrow.type];
            const arrowSize = arrowInfo.size;
            const screenX = getScreenPosition(arrow.x, BM.mouseX, halfWidth);
            const screenY = getScreenPosition(arrow.y, BM.mouseY, halfHeight);
            const screenWidth = size * arrowSize;
            const screenHeight = size * arrowSize;
            ctx.save();
            ctx.translate(screenX, screenY);
            ctx.rotate(arrow.direction - Math.PI / 2);
            ctx.drawImage(
                gameTextures[arrowInfo.texture],
                -screenWidth / 2,
                -screenHeight / 2,
                screenWidth,
                screenHeight
            );
            ctx.restore();
        }

        // Render creatures
        for (const unit of Creature.allUnits) {
            const creatureData = CreatureTypes[unit.subClass][unit.classType];
            const width = creatureData.width;
            const height = creatureData.height;
            const screenX = getScreenPosition(unit.fluidXPos, BM.mouseX, halfWidth);
            const screenY = getScreenPosition(unit.fluidYPos, BM.mouseY, halfHeight);
            const screenWidth = size * width;
            const screenHeight = size * height;
            const healthPercentage = unit.health / unit.maxHealth;

            const waterDepth = unit.standingTile == "shallowwater" ? 1.25 : unit.standingTile == "deepwater" ? 2 : 0;
            if (!unit.underWater) {
                if (waterDepth != 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(
                        screenX - screenWidth / 2,
                        screenY - screenHeight / 2,
                        screenWidth,
                        screenHeight / waterDepth
                    );
                    ctx.clip();
                }
            }

            ctx.drawImage(
                gameTextures[unit.debugMode ? "missingTexture" : unit.debugEnemy ? "troll" : unit.debugAlly ? "elf" : unit.underWater ? "waterBubble" : (healthPercentage <= 0.333 ? creatureData.healthLow : (healthPercentage <= 0.666 ? creatureData.healthMiddle : creatureData.healthHigh))],
                screenX - screenWidth / 2,
                screenY - screenHeight / 2,
                screenWidth,
                screenHeight
            );

            if (waterDepth != 0) {
                ctx.restore();
            }

            if (!unit.underWater) {
                const currentWeapon = WeaponData[unit.weaponType];
                const weaponWidth = currentWeapon.width;
                const weaponHeight = currentWeapon.height;
                ctx.save();
                ctx.translate(screenX, screenY);
                let rotation = 0;
                const targetEnemy = unit.targetChain[0];
                if (targetEnemy) {
                    rotation = Math.atan2(unit.fluidYPos - targetEnemy.fluidYPos, unit.fluidXPos - targetEnemy.fluidXPos) - Math.PI / 2;
                } else {
                    if (unit.fluidYPos == unit.yPos && unit.fluidXPos == unit.xPos) {
                        rotation = unit.lastAttackAngle;
                    } else {
                        rotation = Math.atan2(unit.fluidYPos - unit.yPos, unit.fluidXPos - unit.xPos) - Math.PI / 2;
                        unit.lastAttackAngle = rotation;
                    }
                }
                if (currentWeapon.texture) {
                    ctx.rotate(rotation);
                    ctx.drawImage(
                    gameTextures[(!currentWeapon.isMelee && unit.attackTick < currentWeapon.attackRate ? currentWeapon.loadedTexture : currentWeapon.texture)],
                    -(size * weaponWidth + (targetEnemy ? 0 : (currentWeapon.isMelee ? size / 2 : 0))) / 2,
                    -(size * weaponHeight * (targetEnemy ? 3 : 2) + (targetEnemy ? (unit.attacking && currentWeapon.isMelee ? size : 0) : 0)) / 2,
                    size * weaponWidth,
                    size * weaponHeight
                    );
                }
                ctx.restore();
            }
            if (unit.debugMode || unit.debugEnemy || unit.debugAlly) {
                const tileX = Math.floor((unit.xPos - BM.mouseX + 0.5) * tileSize + halfWidth);
                const tileY = Math.floor((unit.yPos - BM.mouseY + 0.5) * tileSize + halfHeight);
                ctx.drawImage(
                    gameTextures.debugOutline,
                    tileX - size / 2,
                    tileY - size / 2,
                    size,
                    size
                );
            }
            unit.debugMode = false;
            unit.debugEnemy = false;
            unit.debugAlly = false;
        }

        // Render explosions
        for (const explosion of Creature.allExplosions) {
            const radius = explosion[2];
            const screenX = getScreenPosition(explosion[1], BM.mouseX, halfWidth);
            const screenY = getScreenPosition(explosion[0], BM.mouseY, halfHeight);
            const screenRadius = size * radius;
            ctx.drawImage(
                gameTextures["explosion"],
                screenX - screenRadius / 2,
                screenY - screenRadius / 2,
                screenRadius,
                screenRadius
            );
        }
    }
}
const CreatureSelection = {
    "warriorTab": {
        "Foot Soldier": [true, "warrior", "footSoldier", "normal", "ironSword"],
        "Archer": [true, "warrior", "archer", "normal", "bow"],
        "Knight": [true, "warrior", "knight", "warriorKnight", "knightSword"],
        "Undead": [true, "warrior", "undead", "warriorUndead", "undeadSword"],
        "Rusher": [true, "warrior", "rusher", "warriorRusher", "dagger"],
    },
    "fishlingTab": {
        "Foot Soldier": [true, "fishling", "footSoldier", "swimmer", "trident"],
        "Archer": [true, "fishling", "archer", "swimmer", "fishlingBow"],
        "Rusher": [true, "fishling", "rusher", "rushingSwimmer", "fishlingDagger"],
        "Diver": [true, "fishling", "diver", "fishlingDiver", "trident"],
    },
    "goblinTab": {
        "Foot Soldier": [false, "goblin", "footSoldier", "normal", "ironSword"],
        "Archer": [false, "goblin", "archer", "normal", "bow"],
        "Large": [false, "goblin", "large", "large", "largeSword"],
        "Berserker": [false, "goblin", "berserker", "warriorRusher", "strongIronSword"],
        "Biter": [false, "goblin", "biter", "biter", "bite"],
        "Bomber": [false, "goblin", "bomber", "bomber", "explode"],
    }
}

/* BOOT */
function bootGame() {
    window.addEventListener("resize", WP.getWindowResize);
    WP.getWindowResize();
    mainWindow.addEventListener("mousemove", MKI.getMouseMove);
    mainWindow.addEventListener("mousedown", MKI.getMouseDown);
    mainWindow.addEventListener("mouseup", MKI.getMouseUp);
    mainWindow.addEventListener("mouseleave", MKI.getMouseUp)
    mainWindow.addEventListener("wheel", MKI.getMouseScroll);
    mainWindow.addEventListener("contextmenu", MKI.getRightClick);


    /* Handles Tab Buttons */
    function loadUnitTab() {
        for (const tab of ["Warrior", "Fishling", "Elf", "Troll", "Fledgling", "Goblin"]) {
            const tabName = tab.toLowerCase();
            const guiName = tabName + "Tab";
            const element = new GUI(guiName, tabName, 0, 0, 0, 0, 0);
            element.hover = () => {
                const x = WP.middle(0);
                const y = WP.bottom(120);
                ctx.drawImage(gameTextures.unitBar, x - 90, y - 35, 180, 50);
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.font = "35px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(tab, x, y-(35/4));
            }
            element.click = () => {
                if (GAMEselectedUnitType) {
                    GUI.instances.get(GAMEselectedUnitType).darkness = 0;
                }
                for (const guiName of GAMEGUIUnits) {
                    GUI.instances.delete(guiName);
                }
                GAMEGUIUnits = [];
                const deselected = GAMEselectedUnitType == guiName;
                GAMEselectedUnitType = (deselected ? null : guiName);
                GAMEloadedSelectedUnitType = false;
                if (!deselected) {
                    GUI.instances.get(GAMEselectedUnitType).darkness = 0.65;
                }
            }
        }
        const unitSelectBar = new GUI("unitSelectBar", "unitSelectBar", 0, 0, 0, 0, 1);
        const trashCanButton = new GUI("trashCanButton", "trashCanButton", 0 ,0 ,0, 0 ,0);
        trashCanButton.click = () => {
            GAMETrashcanSelected = !GAMETrashcanSelected;
            if (GAMETrashcanSelected) {
                GUI.instances.get("trashCanButton").darkness = 0.65;
            } else {
                GUI.instances.get("trashCanButton").darkness = 0;
            }
        }
        const removeButton = new GUI("removeButton", "removeButton", 0, 0, 0, 0, 0);
        removeButton.click = () => {
            if (GAMEselectedUnit) {
                GAMEselectedUnit = null;
            }
        }
    }

    /* Handles Control Buttons */
    function loadPlayButton() {
        const pausePlayButton = new GUI("pausePlayButton", "playButton", 0, 0, 0, 0, 0);
        pausePlayButton.click = () => {
            if (GAMEPaused && !GAMEStarted) {
                GAMEsavedMap = structuredClone(BM.map);
                GAMEsavedUnits = [];
                for (const unit of Creature.allUnits) {
                    GAMEsavedUnits.push([unit.xPos, unit.yPos, unit.isGood, unit.subClass, unit.classType, unit.soulType, unit.weaponType]);
                }
                GAMEStarted = true;
            }
            GAMEPaused = !GAMEPaused;
            pausePlayButton.content = (GAMEPaused ? "playButton" : "pauseButton");
        }
    }
    function loadSpeedButton() {
        const speedButton = new GUI("speedButton", "normalSpeedButton", 0, 0, 0, 0, 0);
        speedButton.click = () => {
            GAMESpeed += 1;
            if (GAMESpeed == 3) {
                GAMESpeed = 0;
            }
            GAMEtickRate = Math.max(3 - (2 * GAMESpeed), 0) + 1;
            speedButton.content = (GAMESpeed == 0 ? "halfSpeedButton" : (GAMESpeed == 1 ? "normalSpeedButton" : "doubleSpeedButton"));
        }
    }
    function loadResetButton() {
        const resetButton = new GUI("resetButton", "resetButton", 0, 0, 0, 0, 0);
        resetButton.click = () => {
            if (GAMEPaused && GAMEStarted) {
                GAMEStarted = false;
                BM.map = GAMEsavedMap;
                Creature.allUnits.clear();
                Creature.allUnitPositions.clear();
                Creature.allArrows.clear();
                Creature.allExplosions = [];
                for (const unitData of GAMEsavedUnits) {
                    new Creature(unitData[0], unitData[1], unitData[2], unitData[3], unitData[4], unitData[5], unitData[6]);
                }
            }
        }
    }

    /* Handles Tile Buttons */
    function loadTileButtons() {
        for (const tile of BM.tiles) {
            const tileName = tile.toLowerCase().replaceAll(" ", "");
            const element = new GUI(tileName + "Tab", tileName, 0, 0, 0, 0, 0);
            const length = tile.length * 20 + 50;
            element.hover = () => {
                const x = length + 15;
                const y = WP.center(0) - 300;
                ctx.drawImage(gameTextures.unitBar, x - length, y - 35, length, 50);
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.font = "35px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(tile, x - length / 2, y-(35/4));
            }
            element.click = () => {
                const alreadyUsing = BM.currentTile == tileName;
                if (!alreadyUsing) {
                    for (const otherTile of BM.tiles) {
                        const otherElement = GUI.instances.get(otherTile.toLowerCase().replaceAll(" ", "") + "Tab");
                        if (otherElement.darkness != 0) {
                            otherElement.darkness = 0;
                            break;
                        }
                    }
                }
                GAMEselectedUnit = null;
                element.darkness = (alreadyUsing ? 0 : 0.65);
                BM.currentTile = (alreadyUsing ? null : tileName);
            }
        }
    }

    /* Map Buttons */
    function loadUploadButton() {
        const uploadIcon = new GUI("uploadTab", "uploadIcon", 0, 0, 0, 0, 0);
        uploadIcon.click = () => {
            if (!BM.canEdit) { return };
            const data = prompt("Insert World File");
            if (data && data.length > 0) {
                const worldFile = data.split(" ");
                if (worldFile.length === BM.maxRows * BM.maxColumns) {
                    const validTiles = new Set(BM.tiles.map(s => s.toLowerCase().replace(/\s+/g, "")));
                    let hasInvalidTile = false;
                    for (const tile of worldFile) {
                        if (!validTiles.has(tile)) {
                            hasInvalidTile = true;
                            break;
                        }
                    }
                    if (!hasInvalidTile) {
                        for (let y = 0; y < BM.maxRows; y++) {
                            for (let x = 0; x < BM.maxColumns; x++) {
                                BM.map[y][x] = worldFile[y * BM.maxColumns + x];
                            }
                        }
                        return;
                    }
                }
            }
            alert("Invalid World File");
        }
    }
    function loadSaveButton() {
        const saveIcon = new GUI("saveTab", "saveIcon", 0, 0, 0, 0, 0);
        saveIcon.click = async () => {
            if (!BM.canEdit) { return };
            try {
                const worldFile = BM.map.flat().map(
                    t => t.toLowerCase().replace(/\s+/g, "")
                ).join(" ");
                await navigator.clipboard.writeText(worldFile);
            } catch {
                alert("Something Went Wrong Please Try Again");
            }
        };
    }
    function loadFillButton() {
        const saveIcon = new GUI("fillButton", "fillBucketButton", 0, 0, 0, 0, 0);
        saveIcon.click = () => {
            GAMEfillBucketSelected = !GAMEfillBucketSelected;
            GUI.instances.get("fillButton").darkness = (GAMEfillBucketSelected ? 0.65 : 0);
            if (!BM.canEdit) { return };
        }
    }

    loadUnitTab();
    loadPlayButton();
    loadSpeedButton();
    loadResetButton();
    loadTileButtons();
    loadUploadButton();
    loadSaveButton();
    loadFillButton();

    /* Default World Tiles */
    BM.map = [];
    for (let y = 0; y < BM.maxRows; y++) {
        BM.map[y] = [];
        for (let x = 0; x < BM.maxColumns; x++) {
            BM.map[y][x] = "grass";
        }
    }

    // for (let i = 0; i < 30; i++) {
    //     for (let o = 0; o < 1; o++) {
    //         new Creature(i + 10, o + 25, true,     "fishling", "rusher", "rushingSwimmer", "fishlingDagger");
    //         new Creature(i + 10, 5 - o + 40, false, "goblin", "archer", "normal", (Math.random() < 0.5 ? "ironSword" : "bow"));
    //     }
    // }
}
bootGame();

/* INPUT */
function getSelectedTile() {
    const baseTileSize = WP.windowWidth / BM.maxColumns;
    const tileSize = baseTileSize * BM.zoom;

    const halfWidth = WP.windowWidth / 2;
    const halfHeight = WP.windowHeight / 2;

    const tileX = Math.floor(BM.mouseX + (MKI.x - halfWidth) / tileSize);
    const tileY = Math.floor(BM.mouseY + (MKI.y - halfHeight) / tileSize);

    const selectedX = (tileX > (BM.maxColumns - 1) || tileX < 0) ? null : tileX;
    const selectedY = (tileY > (BM.maxRows - 1) || tileY < 0) ? null : tileY;
    return [selectedY, selectedX];
}
async function handleInputs() {
    // Gets interacted gui
    let highestZindex = -1;
    let highestElement = null;
    let highestKey = null;
    for (const [key, element] of GUI.instances) {
        if (element.enabled) {
            if (MKI.x >= element.x && MKI.x <= element.x + element.width && MKI.y >= element.y && MKI.y <= element.y + element.height) {
                if (element.zindex > highestZindex) {
                    highestZindex = element.zindex;
                    highestElement = element;
                    highestKey = key;
                }
            }
        }
    }

    if (highestElement) {
        if (highestElement.hover) { highestElement.hover() };
        MKI.hoveringOver = highestKey;
        if (MKI.wentDown) {
            MKI.wentDown = false;
            MKI.initialTarget = highestKey;
            return;
        }
        if (MKI.wentUp) {
            MKI.wentUp = false;
            if (MKI.initialTarget == highestKey && MKI.hoveringOver == highestKey) {
                if (highestElement.click) { highestElement.click() };
                console.log(`You clicked the ${highestElement.name}`);
                MKI.downX = 0;
                MKI.downY = 0;
            }
            MKI.initialTarget = null;
        }
    }
    if (!highestElement) {
        MKI.hoveringOver = null
        if (MKI.currentMouse == 2) {
            if (MKI.wentDown) {
                MKI.wentDown = false;
                MKI.initialTarget = null;
            }
            if (MKI.downX != 0 && MKI.downY != 0) {
                const baseTileSize = WP.windowWidth / BM.maxColumns;
                const tileSize = baseTileSize * BM.zoom;

                const downXPixels = MKI.x - MKI.changeX;
                const downYPixels = MKI.y - MKI.changeY;

                if (downXPixels != 0 || downYPixels != 0) {
                    BM.mouseX -= downXPixels / tileSize;
                    BM.mouseY -= downYPixels / tileSize;
                    MKI.changeX = MKI.x;
                    MKI.changeY = MKI.y;
                }
            }
        }
        if (MKI.wentUp) {
            MKI.wentUp = false;
            MKI.downX = 0;
            MKI.downY = 0;
            MKI.changeX = 0;
            MKI.changeY = 0;
        }

        const [y, x] = getSelectedTile();
        if (GAMEPaused && x != null && y != null) {
            if (MKI.currentMouse == 0) {
                if (GAMETrashcanSelected) {
                    if (Creature.allUnitPositions.has(y) && Creature.allUnitPositions.get(y).has(x)) {
                        for (const unit of Creature.allUnitPositions.get(y).get(x)) {
                            Creature.allUnits.delete(unit);
                        }
                        Creature.allUnitPositions.get(y).delete(x);
                    }
                } else if (GAMEselectedUnit) {
                    if (!Creature.allUnitPositions.has(y) || (Creature.allUnitPositions.has(y) && (!Creature.allUnitPositions.get(y).has(x) || (Creature.allUnitPositions.get(y).has(x) && Creature.allUnitPositions.get(y).get(x).size == 0)))) {
                        new Creature(x, y, GAMEselectedUnit[0], GAMEselectedUnit[1], GAMEselectedUnit[2], GAMEselectedUnit[3], GAMEselectedUnit[4]);
                    }
                } else if (BM.currentTile != null)  {
                    const currentTileType = BM.map[y][x];
                    BM.map[y][x] = BM.currentTile;
                    if (GAMEfillBucketSelected) {
                        function fill(sY, sX, currentTileType) {
                            const closedTiles = new Map();
                            closedTiles.set(sY, new Set());
                            closedTiles.get(sY).add(sX);
                            const openTiles = [[sY, sX]];
                            let index = 0;
                            while (index < openTiles.length) {
                                const currentTile = openTiles[index];
                                const y = currentTile[0];
                                const x = currentTile[1];
                                BM.map[y][x] = BM.currentTile;
                                for (let [yDir, xDir] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                                    const nY = y + yDir;
                                    const nX = x + xDir;
                                    if (nY >= 0 && nX >= 0 && nY < BM.maxRows && nX < BM.maxColumns) {
                                        if (!closedTiles.has(nY) || !closedTiles.get(nY).has(nX)) {
                                            if (BM.map[nY][nX] == currentTileType) {
                                                openTiles.push([nY, nX]);
                                            }
                                            if (!closedTiles.has(nY)) {
                                                closedTiles.set(nY, new Set());
                                            }
                                            closedTiles.get(nY).add(nX);
                                        }
                                    }
                                }
                                index += 1;
                            }

                        }
                        fill(y, x, currentTileType);
                    }
                }
            }
        }
    }
}

/* RENDERING */
function handleUnitTab() {
    const tabs = ["warriorTab", "fishlingTab", "elfTab", "trollTab", "fledglingTab", "goblinTab"];
    if (WP.windowHeight < 500) { for (let i = 0; i < 6; i++) { GUI.instances.get(tabs[i]).enabled = false }; return };
    const x = WP.middle(600);
    const y = WP.bottom(100);
    const width = 600;
    const height = 100;
    ctx.drawImage(gameTextures.unitBar, x, y, width, height);
    for (let i = 0; i < 6; i++) {
        if (WP.resized) { GUI.instances.get(tabs[i]).update(x + 100 * i + 25, y + 25, 50, 50) };
        GUI.instances.get(tabs[i]).render();
    }
    if (WP.resized) { GUI.instances.get("trashCanButton").update(x + 625, y + 25, 50, 50) };
    GUI.instances.get("trashCanButton").render();
    if (WP.resized) { GUI.instances.get("removeButton").update(x - 75, y + 25, 50, 50) };
    if (GAMEselectedUnit) {
        GUI.instances.get("removeButton").render();
    }
}
function handleUnitSelectionTab() {
    const width = 600;
    const height = 600;
    const x = WP.middle(0);
    const y = WP.center(120);
    const guiObject = GUI.instances.get("unitSelectBar");
    if (WP.resized) { guiObject.update(x - width / 2, y - height / 2, width, height) };
    if (GAMEselectedUnitType) {
        guiObject.render();
        if (!GAMEloadedSelectedUnitType) {
            let index = 0;
            for (const [displayName, unitData] of Object.entries(CreatureSelection[GAMEselectedUnitType])) {
                GAMEGUIUnits.push(displayName);
                const xOffset = (index % 2 == 0) ? (x-100) - 150: (x-100) + 150;
                const button = new GUI(displayName, displayName, xOffset, y-250 + 100*Math.floor(index/2), 200, 50, 2);
                button.click = () => {
                    BM.currentTile = null;
                    for (const tile of BM.tiles) {
                        const element = GUI.instances.get(tile.toLowerCase().replaceAll(" ", "") + "Tab");
                        if (element.darkness != 0) {
                            element.darkness = 0;
                            break;
                        }
                    }
                    GAMETrashcanSelected = false;
                    GUI.instances.get("trashCanButton").darkness = 0;
                    GAMEselectedUnit = unitData;
                }
                index += 1;
            }
            GAMEloadedSelectedUnitType = true;
        }
        for (let i = 0; i < GAMEGUIUnits.length; i++) {
            const guiButton = GUI.instances.get(GAMEGUIUnits[i]);
            if (WP.resized) { 
                const xOffset = (i % 2 == 0) ? (x-100) - 150: (x-100) + 150;
                guiButton.update(xOffset, y-250 + 100*Math.floor(i/2), 200, 50)
            }
            guiButton.renderText();
        } 
    } else {
        guiObject.enabled = false;
    }
}
function handleControlTab() {
    const width = 50;
    const height = 50;
    if (WP.resized) {
        GUI.instances.get("pausePlayButton").update(
            WP.right(width + 25),
            height / 2,
            50,
            50)
    }
    GUI.instances.get("pausePlayButton").render()

    if (WP.resized) { GUI.instances.get("speedButton").update(WP.right(width * 2 + 50), height / 2, 50, 50) }
    GUI.instances.get("speedButton").render()

    if (WP.resized) { GUI.instances.get("resetButton").update(WP.right(width * 3 + 75), height / 2, 50, 50) }
    GUI.instances.get("resetButton").render()
}
function handleMapTab() {
    const x = 0;
    const y = WP.center(0) - 300;
    const width = 100;
    const height = 600;
    ctx.drawImage(gameTextures.mapBar, x, y, width, height);
    const tiles = ["grassTab", "stoneTab", "shallowwaterTab", "deepwaterTab", "sandTab", "lavaTab"];
    for (let i = 0; i < tiles.length; i++) {
        if (WP.resized) { GUI.instances.get(tiles[i]).update(x + 25, y + 75 * i + 75, 50, 50) }
        GUI.instances.get(tiles[i]).render();
    }
    if (WP.resized) { GUI.instances.get("uploadTab").update(WP.right(75), WP.bottom(75), 50, 50) }
    GUI.instances.get("uploadTab").render();

    if (WP.resized) { GUI.instances.get("saveTab").update(WP.right(175), WP.bottom(75), 50, 50) }
    GUI.instances.get("saveTab").render();

    if (WP.resized) { GUI.instances.get("fillButton").update(x + 25, y + 600, 50, 50) }
    GUI.instances.get("fillButton").render();
}
async function handleRenders() {
    // Background
    mainWindow.width = WP.windowWidth;
    mainWindow.height = WP.windowHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WP.windowWidth, WP.windowHeight);
    BM.render();

    /* Debug */
    // const data = getSelectedTile();
    // if (data) {
    //     const y = data[0];
    //     const x = data[1];
    //     if (Creature.allUnitPositions.has(y) && Creature.allUnitPositions.get(y).has(x)) {
    //         for (const unit of Creature.allUnitPositions.get(y).get(x)) {
    //             console.log("New Creature")
    //             unit.debugMode = true;
    //             console.log(unit.targetChain)
    //             for (let i = 0; i < unit.targetChain.length; i++) {
    //                 const target = unit.targetChain[i];
    //                 if (i == 0) {
    //                     target.debugEnemy = true;
    //                 } else {
    //                     target.debugAlly = true;
    //                 }
    //             }
    //         }
    //     }
    // }

    Creature.renderInstances();

    // GUI
    handleUnitTab();
    handleMapTab();
    handleUnitSelectionTab();
    handleControlTab();

    handleInputs();

    WP.justReleased = false;
    WP.resized = false;

    requestAnimationFrame(handleRenders);
}


/* CORE */
async function startGame() {
    requestAnimationFrame(handleRenders);
    while (true) {
        if (!GAMEPaused) {
            Creature.act();
        }
        for (let tick = 0; tick < GAMEtickRate; tick++) {
            await wait(0.1);
        }
    }
}

startGame();
