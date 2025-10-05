const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

/* Critical Functions */
async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function halt(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; }
function getDistance(y2, y1, x2, x1) {return Math.abs(x2 - x1) + Math.abs(y2 - y1)};

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
    getRightClick: function(event) {
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

    static renderDebugTile(x, y, i) {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        const screenX = Math.floor((x - BM.mouseX) * tileSize + halfWidth);
        const screenY = Math.floor((y - BM.mouseY) * tileSize + halfHeight);

        ctx.fillStyle = "purple";
        ctx.font = "25px serif";
        ctx.fillText(i, screenX, screenY);
    }

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

/* AStar Path Finding */
class AStar {
    constructor(start, goal, tileProperties) {
        this.start = start;
        this.goal = goal;

        this.open = [{position: start, g: 0, f: AStar.heuristic(start, goal), parent: null}];
        this.closed = new Set();
        this.finished = false;
        this.path = null;

        this.tileWeights = {};
        for (const [key, data] of Object.entries(tileProperties)) {
            this.tileWeights[key] = data.r;
        }
    }

    static heuristic(a, b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    static neighbors(currentPosition) {
        const x = currentPosition[0];
        const y = currentPosition[1];
        const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const results = [];
        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < BM.maxColumns && ny < BM.maxRows) {
                results.push([nx, ny]);
            }
        }
        return results;
    }

    static reconstruct(node) {
        const path = [];
        let current = node;
        while (current) {
            path.push(current.position);
            current = current.parent;
        }
        return path.reverse();
    }

    static step(maxSteps, instance) {
        for (let i = 0; i < maxSteps && instance.open.length > 0; i++) {
            instance.open.sort((a, b) => a.f - b.f);
            const current = instance.open.shift();
            const key = current.position[0]+","+current.position[1];
            if (instance.closed.has(key)) {continue};
            instance.closed.add(key);
            if (current.position[0] == instance.goal[0] && current.position[1] == instance.goal[1]) {
                instance.finished = true;
                instance.path = AStar.reconstruct(current);
                return;
            }
            for (const neighbor of AStar.neighbors(current.position)) {
                const [nx, ny] = neighbor;
                const tileName = BM.map[ny][nx];
                if (tileName == "stone") {continue};
                const g = current.g + instance.tileWeights[tileName];
                const h = AStar.heuristic(neighbor, instance.goal);
                const f = g + h;
                instance.open.push({position: neighbor, g: g, f: f, parent: current});
            }
        }
    }
}

class PathManager {
    static developingPaths = new Map();
    static add(instance) {
        const startX = Math.floor(instance.x);
        const startY = Math.floor(instance.y);
        const goalX = Math.floor(instance.target.x);
        const goalY = Math.floor(instance.target.y);
        PathManager.developingPaths.set(instance, new AStar([startX, startY], [goalX, goalY], instance.tileProperties));
    }

    static developPaths(minSteps) {
        if (PathManager.developingPaths.size <= 0) {return};

        let stepsLeft = minSteps;
        let allPathsComplete = true;
        do {
            allPathsComplete = true;
            for (const path of PathManager.developingPaths.values()) {
                if (!path.finished) {
                    AStar.step(5, path);
                    stepsLeft -= 5;
                }

                if (!path.finished) {
                    allPathsComplete = false;
                }
            }
            if (allPathsComplete) {break};
        } while (stepsLeft > 0)
    }
}

/* Creatures */
class Creature {
    static goodInstances = new Set();
    static badInstances = new Set();
    static allCords = new Map();

    x = 0;
    y = 0;
    fluidX = 0;
    fluidY = 0;
    width = 0;
    height = 0;
    health = 0;
    isGood = false;

    initialEnemyX = 0;
    initialEnemyY = 0;
    target = null;
    pathIndex = 0;
    path = null;
    destination = null;
    requestingPath = false;
    tileProperties = null;

    repathRange = 1;
    attackRange = 2;

    // Debug
    returnCode = 0;
    debugInfo = null;

    constructor(x, y, width, height, texture, health, isGood, tileProperties) {
        this.x = x;
        this.y = y;
        this.fluidX = x;
        this.fluidY = y;
        this.width = width;
        this.height = height;
        this.texture = texture;
        this.health = health;
        this.isGood = isGood;
        this.tileProperties = tileProperties;
        const useSet = (isGood ? Creature.goodInstances : Creature.badInstances);
        useSet.add(this);
    }

    static getTarget(instance) {
        const opposingSide = !instance.isGood;
        let selectedEnemy = null;
        let shortestDistance = Number.MAX_VALUE;
        for (const enemy of (opposingSide ? Creature.goodInstances : Creature.badInstances)) {
            const distance = getDistance(enemy.y, instance.y, enemy.x, instance.x);
            if (shortestDistance > distance && enemy.health > 0) {
                shortestDistance = distance;
                selectedEnemy = enemy;
            }
        }
        return selectedEnemy;
    }
/*
overlapping issue is visual only and is a result of fluidX and fluidY being malformed.
fixing the issue will require a rework of fluidX and fluidY
*/
    static act(instance) {
        const initialPositionCord = Math.floor(instance.x) + ',' + Math.floor(instance.y);
        Creature.allCords.set(initialPositionCord, instance);

        if (instance.health <= 0) {
            Creature.allCords.delete(initialPositionCord);
            PathManager.developingPaths.delete(instance);

            instance.target = null;
            instance.path = null;
            instance.requestingPath = false;

            for (const other of [...Creature.goodInstances, ...Creature.badInstances]) {
                if (other.target === instance) {
                    other.target = null;
                    other.requestingPath = false;
                }
            }

            const instanceType = instance.isGood ? Creature.goodInstances : Creature.badInstances;
            instanceType.delete(instance);

            instance.returnCode = 1;
            return;
        }

        // If target is far from original spot make new path to same target
        if (instance.target) {
            if (getDistance(instance.target.y, instance.initialEnemyY, instance.target.x, instance.initialEnemyX) > instance.repathRange) {
                instance.target = this.getTarget(instance);
                instance.path = null;
            } else if (getDistance(instance.target.y, instance.y, instance.target.x, instance.x) < instance.attackRange) {
                instance.target.health -= 1;
                instance.returnCode = 2;
                return;
            }
        }

        // Find a target
        if (!instance.requestingPath) {
            if (!instance.target || instance.target && instance.target.health <= 0) {
                instance.target = Creature.getTarget(instance);
                if (instance.target) {
                    instance.initialEnemyX = instance.target.x;
                    instance.initialEnemyY = instance.target.y;
                }
                instance.returnCode = 3;
                return;
            }

            // Move along path
            if (instance.path && instance.pathIndex < instance.path.length) {
                if (!instance.destination) {
                    instance.destination = instance.path[instance.pathIndex];
                }

                const nextCord = instance.destination[0]+","+instance.destination[1];
                const nextTileTaken = Creature.allCords.has(nextCord);
                const nextTileInstance = (nextTileTaken ? Creature.allCords.get(nextCord) : null);
                if (nextTileInstance && nextCord != initialPositionCord) {
                    instance.debugInfo = "Next is blocked" + nextTileInstance.x + "," + nextTileInstance.y;
                    instance.returnCode = 5.5;
                    return;
                }

                const speed = instance.tileProperties[BM.map[instance.y][instance.x]].s;

                const dx = instance.destination[0] - instance.fluidX;
                const dy = instance.destination[1] - instance.fluidY;
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (distance == 0) {
                    instance.pathIndex += 1;
                    instance.destination = null;
                } else {
                    const step = Math.min(speed, distance);
                    const stepX = (dx / distance) * step;
                    const stepY = (dy / distance) * step;

                    let newX = instance.fluidX + stepX;
                    let newY = instance.fluidY + stepY;
                    const forcastedTile = Math.floor(newX) + ',' + Math.floor(newY);
                    if (Creature.allCords.has(forcastedTile) && forcastedTile !== initialPositionCord) {
                        instance.debugInfo = "Forecast blocked just now";
                        instance.returnCode = 5.6;
                        return;
                    }
                    
                    if (forcastedTile == nextCord) {
                        Creature.allCords.delete(initialPositionCord);
                        Creature.allCords.set(forcastedTile, instance);
                        instance.x = Math.floor(newX);
                        instance.y = Math.floor(newY);
                        instance.pathIndex++;
                        instance.destination = null;
                    }
                    instance.fluidX = newX;
                    instance.fluidY = newY;
                }

                instance.returnCode = 6;
                return;
            }
        }

        // Make New Path
        if (!instance.requestingPath) {
            instance.requestingPath = true;
            instance.path = null;

            if (instance.target) {
                instance.initialEnemyX = instance.target.x;
                instance.initialEnemyY = instance.target.y;
            }

            PathManager.add(instance);
        }
        if (PathManager.developingPaths.get(instance).finished) {
            instance.path = PathManager.developingPaths.get(instance).path;
            if (instance.path && instance.path.length > 1 && instance.path[0][0] === instance.x && instance.path[0][1] === instance.y) {
                instance.path.shift(); // remove current tile from the path
            }
            instance.pathIndex = 0;
            instance.destination = null;
            PathManager.developingPaths.delete(instance);
            instance.requestingPath = false;
        }
        instance.returnCode = 7;
        return;

    }

    static debugInstance(instance, color) {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        const screenX = Math.floor((instance.fluidX - BM.mouseX + 0.5) * tileSize + halfWidth);
        const screenY = Math.floor((instance.fluidY - BM.mouseY + 0.5) * tileSize + halfHeight);
        const screenWidth = size*instance.width;
        const screenHeight = size*instance.height;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(screenX - screenWidth/2,
            screenY - screenHeight/2,
            screenWidth,
            screenHeight);
        ctx.fill();
        ctx.closePath();
    } 

    static renderInstances() {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        for (const instances of [Creature.goodInstances, Creature.badInstances]) {
            for (const instance of instances) {
                const tileX = Math.floor((instance.x- BM.mouseX + 0.5) * tileSize + halfWidth);
                const tileY = Math.floor((instance.y - BM.mouseY + 0.5) * tileSize + halfHeight);
                const screenX = Math.floor((instance.fluidX - BM.mouseX + 0.5) * tileSize + halfWidth);
                const screenY = Math.floor((instance.fluidY - BM.mouseY + 0.5) * tileSize + halfHeight);
                const screenWidth = size*instance.width;
                const screenHeight = size*instance.height;
                
                ctx.drawImage(
                    gameTextures[instance.texture],
                    screenX - screenWidth/2,
                    screenY - screenHeight/2,
                    screenWidth,
                    screenHeight
                );
                ctx.drawImage(
                    gameTextures.debugOutline,
                    tileX - size/2,
                    tileY - size/2,
                    size,
                    size
                );
            }
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
        const tileName = tile.toLowerCase().replaceAll(" ","");
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
            ctx.fillText(tile, x - length/2, y);
        }
        element.click = () => {
            const alreadyUsing = BM.currentTile == tileName;
            if (!alreadyUsing) {
                for (const otherTile of BM.tiles) {
                    const otherElement = GUI.instances[otherTile.toLowerCase().replaceAll(" ","")+"Tab"];
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
        if (!BM.canEdit) {return};
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
        if (!BM.canEdit) {return};
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
    for (let y = 0; y < BM.maxRows; y++) {
        for (let x = 0; x < BM.maxColumns; x++) {
            if (!BM.map[y]) {
                BM.map[y] = ["grass"];
            } else {
                let r = Math.random();
                BM.map[y].push(
                    (r < 0.25) ? "grass" :
                    (r < 0.5) ? "shallowwater" :
                    (r < 0.75) ? "sand" :
                    (r < 1) ? "grass" : "lava"
                );
            }
        }
    }

    //BM.map[25][25] = "lava"
    // new Creature(0, 0, 0.5, 0.5, "warrior", 100, true, {"grass": {r: 1, s: 0.025}, "stone": {r: 0, s: 0, drownDamage: 999}, "sand": {r: 0, s: 0.020}, "shallowwater": {r: 5, s: 0.0125}, "deepwater": {r: 25, s: 0}, "lava": {r: 25, s: 0}});
    // new Creature(49, 49, 0.5, 0.5, "goblin", 100, false, {"grass": {r: 1, s: 0.025}, "stone": {r: 0, s: 0, drownDamage: 999}, "sand": {r: 0, s: 0.020}, "shallowwater": {r: 5, s: 0.0125}, "deepwater": {r: 25, s: 0}, "lava": {r: 25, s: 0}});
    for (let i = 0; i < 50; i++) {
        for (let o = 0; o < 10; o++) {
            new Creature(i, 49-o, 0.5, 0.5, "warrior", 100, true, {"grass": {r: 1, s: 0.025}, "stone": {r: 0, s: 0, drownDamage: 999}, "sand": {r: 0, s: 0.020}, "shallowwater": {r: 5, s: 0.0125, drownDamage: 0.025}, "deepwater": {r: 100, s: 0.0025, drownDamage: 1}, "lava": {r: 1000, s: 0.00125, drownDamage: 3}});
            new Creature(i, o, 0.5, 0.5, "goblin", 100, false, {"grass": {r: 1, s: 0.025}, "stone": {r: 0, s: 0, drownDamage: 999}, "sand": {r: 0, s: 0.020}, "shallowwater": {r: 5, s: 0.0125, drownDamage: 0.025}, "deepwater": {r: 100, s: 0.0025, drownDamage: 1}, "lava": {r: 1000, s: 0.00125, drownDamage: 3}});
        }
    }
}
bootGame();

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
        if (WP.resized) {GUI.instances[tiles[i]].update(x + 25, y + 75 * i + 75, 50, 50)}
        GUI.instances[tiles[i]].render();
    }
    if (WP.resized) {GUI.instances["uploadTab"].update(x + 25, y - 50, 50, 50)}
    GUI.instances["uploadTab"].render();

    if (WP.resized) {GUI.instances["saveTab"].update(x + 25, y + 600, 50, 50)}
    GUI.instances["saveTab"].render();
}

/* Gets Tile From Mouse Position */
function getSelectedTile() {
    const baseTileSize = WP.windowWidth / BM.maxColumns;
    const tileSize = baseTileSize * BM.zoom;

    const halfWidth = WP.windowWidth / 2;
    const halfHeight = WP.windowHeight / 2;

    const tileX = Math.floor(BM.mouseX + (MKI.x - halfWidth) / tileSize);
    const tileY = Math.floor(BM.mouseY + (MKI.y - halfHeight) / tileSize);
    
    const selectedX = (tileX > (BM.maxColumns-1) || tileX < 0) ? null : tileX;
    const selectedY = (tileY > (BM.maxRows-1) || tileY < 0) ? null : tileY;
    return [selectedX, selectedY];
}

function gameLoop() {
    // Background
    mainWindow.width = WP.windowWidth;
    mainWindow.height = WP.windowHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WP.windowWidth, WP.windowHeight);
    BM.render();

    // Creature Action
    PathManager.developPaths(2000);

    // Creatures
    const allCreatures = [...Creature.goodInstances, ...Creature.badInstances];
    for (let i = allCreatures.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCreatures[i], allCreatures[j]] = [allCreatures[j], allCreatures[i]];
    }
    for (const instance of allCreatures) {
        Creature.act(instance);
    }
    Creature.renderInstances();

    // GUI
    handleUnitTab();
    handleMapTab();

    // Mouse Input Of All Kind
    let overElement = false;
    for (const [key, element] of Object.entries(GUI.instances)) {
        if (element.enabled) {
            if (MKI.x >= element.x && MKI.x <= element.x + element.width && MKI.y >= element.y && MKI.y <= element.y + element.height) {
                overElement = true;
                if (element.hover) {element.hover()};
                MKI.hoveringOver = key;
                if (MKI.wentDown) {
                    MKI.wentDown = false;
                    MKI.initialTarget = key;
                    break;
                }
                if (MKI.wentUp) {
                    MKI.wentUp = false;
                    if (MKI.initialTarget == key && MKI.hoveringOver == key) {
                        if (element.click) {element.click()};
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

            // Debug Creatures
            if (Creature.allCords.has(x+","+y)) {
                const instance = Creature.allCords.get(x+","+y);
                Creature.debugInstance(instance, 'blue');
                ctx.fillStyle = "blue";
                ctx.font = "35px serif";
                ctx.fillText(`Cords (x, y): ${x+","+y}`, 100, 100);

                const selectedCords = instance.x+","+instance.y;
                ctx.fillText(`Instance Cords (x, y): ${selectedCords} | Instance Position (y, x): ${instance.y}, ${instance.x}`, 100, 130);

                ctx.fillText(`Target: ${instance.target}`, 100, 160);
                if (instance.target) {
                    Creature.debugInstance(instance.target, 'orange');
                }
                ctx.fillStyle = "blue";

                ctx.fillText(`Requesting Path: ${instance.requestingPath}`, 100, 200);
                ctx.fillText(`Has Path: ${instance.path != null}`, 100, 230);
                if (instance.path) {
                    for (let i = 0; i < instance.path.length; i++) {
                        BM.renderDebugTile(instance.path[i][0], instance.path[i][1], i);
                    }
                }

                ctx.fillStyle = "blue";
                ctx.font = "35px serif";
                ctx.fillText(`Return Code ${instance.returnCode}`, 100, 270);
                ctx.fillText(`Debug Info ${instance.debugInfo}`, 100, 300);
            } else {
            ctx.fillStyle = "orange";
            ctx.font = "25px serif";
            ctx.fillText(`X:${x}, Y:${y}`, 100, 100);
            }

        }
    };

    WP.justReleased = false;
    WP.resized = false;

    requestAnimationFrame(gameLoop);
}


function startGame() {
    requestAnimationFrame(gameLoop);
}

startGame();