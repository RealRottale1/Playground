const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

/* Critical Functions */
async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function halt(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; }
function getDistance(y2, y1, x2, x1) { return Math.abs(x2 - x1) + Math.abs(y2 - y1) };
function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; }

const tickRate = 2;

/* Game Textures */
const gameTextures = {
    missingTexture: makeImage("missing"),
    debugOutline: makeImage("debugOutline"),
    warrior: makeImage("warrior"),
    fishling: makeImage("fishling"),
    elf: makeImage("elf"),
    troll: makeImage("troll"),
    fledgling: makeImage("fledgling"),
    goblin: makeImage("goblin"),

    unitBar: makeImage("tabUnitBar"),
    mapBar: makeImage("mapBar"),

    grass: makeImage("grass"),
    stone: makeImage("stone"),
    shallowwater: makeImage("shallowWater"),
    deepwater: makeImage("deepWater"),
    sand: makeImage("sand"),
    lava: makeImage("lava"),

    saveIcon: makeImage("saveIcon"),
    uploadIcon: makeImage("uploadIcon"),
}

/* Canvas Variables */
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

/* User Input Variables */
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
        MKI.x = event.clientX - rect.left;
        MKI.y = event.clientY - rect.top;
    },
    getMouseDown: function (event) {
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

/* Battle Map */
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

/* Graphical User Interface */
class GUI {
    static instances = {};
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
        this.zindex = zindex;
        GUI.instances[name] = this;
    }
    update(x, y, width, height, zindex) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zindex = zindex;
        this.enabled = true;
    }
    render() {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;
        ctx.drawImage(gameTextures[this.content], this.x, this.y, this.width, this.height);
        if (this.darkness != 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.darkness})`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

const WeaponData = {
    "ironSword": {
        range: 2,
    }
}

const SoulData = {
    "normal": {
        width: 0.5,
        height: 0.5,
        health: 100,
        tileProps: { "grass": { risk: 1, speed: 1 }, "stone": { risk: Number.MAX_VALUE, speed: 0 }, "shallowwater": { risk: 5, speed: 0.25 }, "deepwater": { risk: 25, speed: 0.125 }, "sand": { risk: 2, speed: 0.9 }, "lava": { risk: 250, speed: 0.1 } },
        detectVision: 10,
        alertVision: 5,
        wanderChance: 1,
    }
}

class Creature {
    static allUnits = new Set();
    static allUnitPositions = new Map(); // int<int<Set(Creature)>>

    xPos; fluidXPos; oldXPos;
    yPos; fluidYPos; oldYPos;
    health;
    isGood; subClass; soulType; weaponType;

    allTargets = new Set();
    targetChain = [];

    knownTileMap = new Map(); // int<int<risk>>
    moving = false;

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
                    if (unit.targetChain.length > 0) {
                        if (getDistance(target.yPos, unit.yPos, target.xPos, unit.xPos) < getDistance(unit.targetChain[0].yPos, unit.yPos, unit.targetChain[0].xPos, unit.xPos)) {
                            unit.targetChain = [target];
                            unit.allTargets.clear();
                            unit.allTargets.add(target);
                        }
                    } else {
                        unit.targetChain = [target];
                        unit.allTargets.add(target);
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

    static wander(unit) { // Main
        let detectVision = SoulData[unit.soulType].detectVision;
        let alertVision = SoulData[unit.soulType].alertVision;
        let allyUnits = new Set();
        for (let y = unit.yPos + detectVision; y >= unit.yPos - detectVision; y--) {
            let ySpread = Math.abs(unit.yPos - y);
            let xSpread = detectVision - ySpread;
            for (let x = unit.xPos + xSpread; x >= unit.xPos - xSpread; x--) {
                if (y >= 0 && x >= 0 && y < BM.maxRows && x < BM.maxColumns) {
                    // Adds targets
                    const newAllies = Creature.makeUnitConnection(unit, y, x, alertVision);
                    for (const ally of newAllies) {
                        allyUnits.add(ally);
                    }

                    // Expands known tiles
                    if (!unit.knownTileMap.has(y)) {
                        unit.knownTileMap.set(y, new Map());
                    }
                    if (!unit.knownTileMap.get(y).has(x)) {
                        unit.knownTileMap.get(y).set(x, SoulData[unit.soulType].tileProps[BM.map[y][x]].risk);
                    }
                }
            }
        }
        let touchingTiles = shuffleArray([[0, 1], [1, 0], [0, -1], [-1, 0]]);
        let currentRisk = SoulData[unit.soulType].tileProps[BM.map[unit.yPos][unit.xPos]].risk;
        let currentPosition = [unit.yPos, unit.xPos];
        let wanderChange = SoulData[unit.soulType].wanderChance;
        for (let d of touchingTiles) {
            let nY = unit.yPos + d[0];
            let nX = unit.xPos + d[1];
            if (unit.knownTileMap.has(nY) && unit.knownTileMap.get(nY).has(nX)) {
                let knownRisk = unit.knownTileMap.get(nY).get(nX);
                if (knownRisk <= currentRisk * 5 && Math.random() <= wanderChange) {
                    currentRisk = knownRisk;
                    currentPosition[0] = nY;
                    currentPosition[1] = nX;
                }
            }
        }

        return [currentPosition, allyUnits];
    }

    static getValidTiles(unit, targetUnit, detectVision, alertVision, pathFindingConfig) { // Helper
        const validTiles = new Map();
        let allyUnits = new Set();
        for (let i = 0; i < 2; i++) {
            const useUnit = (i == 0 ? unit : targetUnit)
            for (let y = useUnit.yPos + detectVision; y >= useUnit.yPos - detectVision; y--) {
                let ySpread = Math.abs(useUnit.yPos - y);
                let xSpread = detectVision - ySpread;
                for (let x = useUnit.xPos + xSpread; x >= useUnit.xPos - xSpread; x--) {
                    if (y >= 0 && x >= 0 && y < BM.maxRows && x < BM.maxColumns) {
                        if (useUnit == unit) {
                            // Adds targets
                            const newAllies = Creature.makeUnitConnection(unit, y, x, alertVision);
                            for (const ally of newAllies) {
                                allyUnits.add(ally);
                            }
                        }
                        if (!validTiles.has(y)) {
                            validTiles.set(y, new Map());
                        }
                        if (pathFindingConfig == 1) { // Astar
                            validTiles.get(y).set(x, { y: y, x: x, f: 0, g: 0, h: 0, pY: null, pX: null });
                        } else { // Flow Field
                            validTiles.get(y).set(x, 0);
                        }
                    }
                }
            }
        }
        return [validTiles, allyUnits];
    }

    /* SMART MOVES */
    static aStar(unit, validTiles) { // Helper
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
                    if (BM.map[nY][nX] != "stone") {
                        if (!closedMap.has(nY) || !closedMap.get(nY).has(nX)) {
                            const possibleG = validTiles.get(currentY).get(currentX).g + SoulData[unit.soulType].tileProps[BM.map[nY][nX]].risk;
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
        return ([]);
    }
    static flowField(unit, validTiles) { // Helper
        const closedMap = new Map(); // int<int>
    }
    static smartMove(unit) {
        const detectVision = SoulData[unit.soulType].detectVision;
        const alertVision = SoulData[unit.soulType].alertVision;
        const targetUnit = unit.targetChain[unit.targetChain.length - 1];

        // Gets tiles to use in path finding
        const data = Creature.getValidTiles(unit, targetUnit, detectVision, alertVision);
        const validTiles = data[0];
        const allyUnits = data[1];

        let useAstar = false;
        let nextMove;
        if (useAstar) {
            nextMove = Creature.aStar(unit, validTiles);
        } else {
            nextMove = Creature.flowField(unit, validTiles);
        }
        return ([nextMove, allyUnits]);
    }

    static setNextPosition(nextPositions) { // Main
       for (const [unit, desiredPosition] of nextPositions) {
            Creature.allUnitPositions.get(unit.yPos).get(unit.xPos).delete(unit);
            unit.yPos = desiredPosition[0];
            unit.xPos = desiredPosition[1];
            Creature.updateAllUnitPositions(unit);
            unit.moving = true;
        }
    }

    static moveUnit(unit) { // Main
        let dx = unit.xPos - unit.fluidXPos;
        let dy = unit.yPos - unit.fluidYPos;
        let dist = Math.hypot(dx, dy);

        const useY = (dist <= 0.5 ? unit.yPos : unit.oldYPos);
        const useX = (dist <= 0.5 ? unit.xPos : unit.oldXPos);
        const speed = SoulData[unit.soulType].tileProps[BM.map[useY][useX]].speed * 0.05;

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

        // Act for all units
        const visionData = new Map();
        const nextPositions = new Map();
        const lostTarget = new Set();
        for (const unit of Creature.allUnits) {
            for (const target of deadUnits) {
                if (unit.allTargets.has(target)) {
                    unit.allTargets.clear();
                    unit.targetChain = [];
                }
            }
            // Unit above broke chain
            if (unit.targetChain.length > 0 && unit.targetChain[unit.targetChain.length - 1].targetChain.length <= 0 && unit.targetChain[unit.targetChain.length - 1].isGood == unit.isGood) {
                unit.allTargets.clear();
                unit.targetChain = [];
            }
            if (!unit.moving) {
                if (unit.allTargets.size == 0) { // Wander
                    const wanderData = Creature.wander(unit);
                    const wanderPosition = wanderData[0];
                    const allyUnits = wanderData[1];
                    visionData.set(unit, allyUnits);
                    nextPositions.set(unit, wanderPosition);
                } else { // Pathfind towards target
                    const targetEnemy = unit.targetChain[0];
                    const distanceBetweenEnemy = getDistance(targetEnemy.yPos, unit.yPos, targetEnemy.xPos, unit.xPos);
                    if (distanceBetweenEnemy <= WeaponData[unit.weaponType].range) {
                        targetEnemy.health -= 5
                    } else {
                        const moveData = Creature.smartMove(unit);
                        const nextMove = moveData[0];
                        const allyUnits = moveData[1];
                        if (nextMove.length == 0) {
                            lostTarget.add(unit);
                            // No movement
                        } else {
                            nextPositions.set(unit, nextMove);
                            visionData.set(unit, allyUnits);
                        }
                    }
                }
            } else { // Transition to spot
                Creature.moveUnit(unit);
            }
        }

        // Move all units
        Creature.setNextPosition(nextPositions);

        // Enemy recognition
        for (const [unit, allyUnits] of visionData) {
            let validChain = true;
            for (const target of unit.allTargets) {
                if (target.health <= 0) {
                    validChain = false;
                    break;
                }
            }
            if (!validChain) {
                continue;
            }

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

    constructor(x, y, isGood, subClass, soulType, weaponType) {
        this.xPos = x; this.fluidXPos = x; this.oldXPos = x;
        this.yPos = y; this.fluidYPos = y; this.oldYPos = y;

        this.isGood = isGood;
        this.subClass = subClass;
        this.soulType = soulType;
        this.weaponType = weaponType;
        this.health = SoulData[soulType].health;

        Creature.allUnits.add(this);
        Creature.updateAllUnitPositions(this);
    }

    static renderInstances() { // Main
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        for (const unit of Creature.allUnits) {
            const width = SoulData[unit.soulType].width;
            const height = SoulData[unit.soulType].height;
            const tileX = Math.floor((unit.xPos - BM.mouseX + 0.5) * tileSize + halfWidth);
            const tileY = Math.floor((unit.yPos - BM.mouseY + 0.5) * tileSize + halfHeight);
            const screenX = Math.floor((unit.fluidXPos - BM.mouseX + 0.5) * tileSize + halfWidth);
            const screenY = Math.floor((unit.fluidYPos - BM.mouseY + 0.5) * tileSize + halfHeight);
            const screenWidth = size * width;
            const screenHeight = size * height;
            ctx.drawImage(
                gameTextures[(unit.targetChain.length > 0 ? "missingTexture" : unit.subClass)],
                screenX - screenWidth / 2,
                screenY - screenHeight / 2,
                screenWidth,
                screenHeight
            );
            ctx.drawImage(
                gameTextures.debugOutline,
                tileX - size / 2,
                tileY - size / 2,
                size,
                size
            );
        }
    }
}

/* Boot Up */
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
    for (const tab of ["Warrior", "Fishling", "Elf", "Troll", "Fledgling", "Goblin"]) {
        const tabName = tab.toLowerCase()
        const element = new GUI(tabName + "Tab", tabName, 0, 0, 0, 0, 0);
        element.hover = () => {
            const x = WP.middle(0);
            const y = WP.bottom(120);
            ctx.drawImage(gameTextures.unitBar, x - 90, y - 35, 180, 50);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.font = "35px serif";
            ctx.textAlign = "center";
            ctx.textBaseLine = "middle";
            ctx.fillText(tab, x, y);
        }
    }

    /* Handles Tile Buttons */
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
            ctx.textBaseLine = "middle";
            ctx.fillText(tile, x - length / 2, y);
        }
        element.click = () => {
            const alreadyUsing = BM.currentTile == tileName;
            if (!alreadyUsing) {
                for (const otherTile of BM.tiles) {
                    const otherElement = GUI.instances[otherTile.toLowerCase().replaceAll(" ", "") + "Tab"];
                    if (otherElement.darkness != 0) {
                        otherElement.darkness = 0;
                        break;
                    }
                }
            }
            element.darkness = (alreadyUsing ? 0 : 0.65);
            BM.currentTile = (alreadyUsing ? null : tileName);
        }
    }

    /* Save And Upload Buttons */
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
    };
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

    /* Default World Tiles */
    BM.map = [];
    for (let y = 0; y < BM.maxRows; y++) {
        BM.map[y] = [];
        for (let x = 0; x < BM.maxColumns; x++) {
            let r = Math.random();
            BM.map[y][x] =
                (r < 0.25) ? "grass" :
                    (r < 0.5) ? "grass" :
                        (r < 0.75) ? "grass" :
                            (r < 1) ? "grass" : "lava";
        }
    }


    for (let i = 0; i < 50; i++) {
        for (let o = 0; o < 15; o++) {
            new Creature(i, o, true, "warrior", "normal", "ironSword");
            new Creature(i, 49 - o, false, "goblin", "normal", "ironSword");
        }
    }
}
bootGame();

/* Gets Tile From Mouse Position */
function getSelectedTile() {
    const baseTileSize = WP.windowWidth / BM.maxColumns;
    const tileSize = baseTileSize * BM.zoom;

    const halfWidth = WP.windowWidth / 2;
    const halfHeight = WP.windowHeight / 2;

    const tileX = Math.floor(BM.mouseX + (MKI.x - halfWidth) / tileSize);
    const tileY = Math.floor(BM.mouseY + (MKI.y - halfHeight) / tileSize);

    const selectedX = (tileX > (BM.maxColumns - 1) || tileX < 0) ? null : tileX;
    const selectedY = (tileY > (BM.maxRows - 1) || tileY < 0) ? null : tileY;
    return [selectedX, selectedY];
}

async function handleInputs() {
    // Mouse Input Of All Kind
    let overElement = false;
    for (const [key, element] of Object.entries(GUI.instances)) {
        if (element.enabled) {
            if (MKI.x >= element.x && MKI.x <= element.x + element.width && MKI.y >= element.y && MKI.y <= element.y + element.height) {
                overElement = true;
                if (element.hover) { element.hover() };
                MKI.hoveringOver = key;
                if (MKI.wentDown) {
                    MKI.wentDown = false;
                    MKI.initialTarget = key;
                    break;
                }
                if (MKI.wentUp) {
                    MKI.wentUp = false;
                    if (MKI.initialTarget == key && MKI.hoveringOver == key) {
                        if (element.click) { element.click() };
                        console.log(`You clicked the ${element.name}`);
                        MKI.downX = 0;
                        MKI.downY = 0;
                    }
                    MKI.initialTarget = null;
                }
                break;
            }
        }
    }

    /* Handles Moving The Screen */
    if (!overElement) {
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

        const [x, y] = getSelectedTile();
        if (x != null && y != null) {
            if (MKI.currentMouse == 0 && BM.currentTile != null) {
                BM.map[y][x] = BM.currentTile;
            }
        }
    };
}

/* Unit Tab */
function handleUnitTab() {
    const tabs = ["warriorTab", "fishlingTab", "elfTab", "trollTab", "fledglingTab", "goblinTab"];
    if (WP.windowHeight < 500) { for (let i = 0; i < 6; i++) { GUI.instances[tabs[i]].enabled = false }; return };
    const x = WP.middle(600);
    const y = WP.bottom(100);
    const width = 600;
    const height = 100;
    ctx.drawImage(gameTextures.unitBar, x, y, width, height);
    for (let i = 0; i < 6; i++) {
        if (WP.resized) { GUI.instances[tabs[i]].update(x + 100 * i + 25, y + 25, 50, 50) };
        GUI.instances[tabs[i]].render();
    }
}
/* Map Tab */
function handleMapTab() {
    const x = 0;
    const y = WP.center(0) - 300;
    const width = 100;
    const height = 600;
    ctx.drawImage(gameTextures.mapBar, x, y, width, height);
    const tiles = ["grassTab", "stoneTab", "shallowwaterTab", "deepwaterTab", "sandTab", "lavaTab"];
    for (let i = 0; i < tiles.length; i++) {
        if (WP.resized) { GUI.instances[tiles[i]].update(x + 25, y + 75 * i + 75, 50, 50) }
        GUI.instances[tiles[i]].render();
    }
    if (WP.resized) { GUI.instances["uploadTab"].update(x + 25, y - 50, 50, 50) }
    GUI.instances["uploadTab"].render();

    if (WP.resized) { GUI.instances["saveTab"].update(x + 25, y + 600, 50, 50) }
    GUI.instances["saveTab"].render();
}

async function handleRenders() {
    // Background
    mainWindow.width = WP.windowWidth;
    mainWindow.height = WP.windowHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WP.windowWidth, WP.windowHeight);
    BM.render();

    Creature.renderInstances();

    // GUI
    handleUnitTab();
    handleMapTab();

    WP.justReleased = false;
    WP.resized = false;

    requestAnimationFrame(handleRenders);
}


async function startGame() {
    requestAnimationFrame(handleRenders);
    while (true) {
        Creature.act();
        for (let tick = 0; tick < tickRate; tick++) {
            await wait(0.1);
            handleInputs();
        }
    }
}

startGame();