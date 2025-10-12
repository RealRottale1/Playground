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

const tileConfigurations = {
    standard: {"grass": {r: 1, s: 0.025}, "stone": {r: -1, s: 0, drownDamage: 999}, "sand": {r: 0, s: 0.020}, "shallowwater": {r: 5, s: 0.0125, drownDamage: 0.025}, "deepwater": {r: 100, s: 0.0025, drownDamage: 1}, "lava": {r: 1000, s: 0.00125, drownDamage: 3}},
}

const Soul = {
    "warrior":  {
        texture: "warrior",
        sizeX: 0.5,
        sizeY: 0.5,
        maxHealth: 100,
        isGood: true, 
        pathConfigType: "standard"},
    "goblin":  {
        texture: "goblin",
        sizeX: 0.5,
        sizeY: 0.5,
        maxHealth: 100,
        isGood: false, 
        pathConfigType: "standard"},
}

class FlowField {
    static goodFlowFields = new Map();
    static badFlowFields = new Map();

    static getStartUnits(isGood) {
        const start = [];
        for (const instance of (isGood ? Creature.goodInstances : Creature.badInstances)) {
            start.push([instance.x, instance.y]);
        }
        return start;
    }

    static makeFlowFields() {
        for (let p = 0; p < 2; p++) {
            const useFlowField = (p == 0 ? FlowField.badFlowFields : FlowField.goodFlowFields);
            useFlowField.clear();
            const usePathTypes = (p == 0 ? Creature.badPathTypes : Creature.goodPathTypes);
            for (const pathType of usePathTypes.keys()) {
                // Start up
                const mappedData = new Map();
                let closedData = new Set();
                let openData = FlowField.getStartUnits(p != 0);
                for (const data of openData) {
                    const x = data[0];
                    const y = data[1];
                    closedData.add(x+","+y);
                    if (!mappedData.has(y)) {
                    mappedData.set(y, new Map());
                    }
                    mappedData.get(y).set(x, [0, 0]);
                }
                
                // Pathing
                let distance = 1;
                while (openData.length > 0) {
                    let nextOpenData = [];
                    for (const data of openData) {
                        const x = data[0];
                        const y = data[1];
                        for (let [xDir, yDir] of [[0, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]]) {
                            const nX = xDir + x;
                            const nY = yDir + y;
                            if (!closedData.has(nX+","+nY)) {
                                if (nX >= 0 && nX < BM.maxColumns && nY >= 0 && nY < BM.maxRows) {
                                    closedData.add(nX+","+nY);
                                    if (!mappedData.has(nY)) {
                                        mappedData.set(nY, new Map());
                                    }
                                    const risk = tileConfigurations[pathType][BM.map[nY][nX]].r;
                                    mappedData.get(nY).set(nX, [distance, (risk == -1 ? null : risk)]);
                                    nextOpenData.push([nX, nY]);
                                }
                            }
                        }
                    }
                    openData = nextOpenData;
                    distance += 1;
                }

                // Direction
                const directionData = new Map();
                for (let y = 0; y < BM.maxRows; y++) {
                    directionData.set(y, new Map());
                    for (let x = 0; x < BM.maxColumns; x++) {
                        if (mappedData.get(y).get(x)[1] == null) {
                            directionData.get(y).set(x, null);
                            continue;
                        }
                        let lowestPos = null;
                        let lowestDistance = Number.MAX_VALUE;
                        let lowestRisk = Number.MAX_VALUE;
                        for (let [xDir, yDir] of [[0, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]]) {
                            const nX = x + xDir;
                            const nY = y + yDir;
                            if (nX >= 0 && nX < BM.maxColumns && nY >= 0 && nY < BM.maxRows) {
                                const data = mappedData.get(nY).get(nX);
                                const distance = data[0];
                                const risk = data[1];
                                if (risk == null) {
                                    continue;
                                }
                                if (distance < lowestDistance || (distance == lowestDistance && risk < lowestRisk)) {
                                    lowestPos = [[nY, nX]];
                                    lowestDistance = distance;
                                    lowestRisk = risk;
                                } else if (distance == lowestDistance && risk == lowestRisk) {
                                    lowestPos.push([nY, nX]);
                                }
                            }
                        }
                        directionData.get(y).set(x, lowestPos);
                    }
                }
                useFlowField.set(pathType, directionData);
            }
        }
    }
}

/* Creatures */
class Creature {
    static goodInstances = new Set();
    static badInstances = new Set();

    static goodPathTypes = new Map();
    static badPathTypes = new Map();

    static allCords = new Map();

    x = 0;
    y = 0;
    fluidX = 0;
    fluidY = 0;

    pathConfigType = null;
    width = 0;
    height = 0;
    health = 0;
    isGood = false;

    repathRange = 1;
    attackRange = 2;

    // Debug
    returnCode = 0;
    debugInfo = null;

    constructor(x, y, soulType) {
        this.x = x;
        this.y = y;
        this.fluidX = x;
        this.fluidY = y;

        const info = Soul[soulType];
        this.width = info.sizeX;
        this.height = info.sizeY;
        this.texture = info.texture;
        this.health = info.maxHealth;
        this.isGood = info.isGood;

        this.pathConfigType = info.pathConfigType;
        const usePathTypes = (this.isGood ? Creature.goodPathTypes : Creature.badPathTypes);
        usePathTypes.set(this.pathConfigType, (usePathTypes.has(this.pathConfigType) ? usePathTypes.get(this.pathConfigType) + 1: 1));    
        
        const useSet = (this.isGood ? Creature.goodInstances : Creature.badInstances);
        useSet.add(this);
        Creature.allCords.set(x+","+y, this);
    }

    static terminate(instance) {
        if (instance.health <= 0) {
            const usePathTypes = (instance.isGood ? Creature.goodPathTypes : Creature.badPathTypes);
            usePathTypes.set(instance.pathConfigType, usePathTypes.get(instance.pathConfigType) - 1);
            if (usePathTypes.get(instance.pathConfigType) <= 0) {
                usePathTypes.delete(instance.pathConfigType);
            }
            Creature.allCords.delete(instance.x+","+instance.y);
            const instanceType = instance.isGood ? Creature.goodInstances : Creature.badInstances;
            instanceType.delete(instance);
        }
    }
    static act(instance) {
        const useFlowType = (instance.isGood ? FlowField.badFlowFields : FlowField.goodFlowFields);
        const useFlowField = useFlowType.get(instance.pathConfigType);
        const nextPositions = useFlowField.get(instance.y).get(instance.x);
        if (nextPositions == null) {return};
        for (const nextPosition of nextPositions) {
            const x = nextPosition[1];
            const y = nextPosition[0];
            if (Creature.allCords.has(x+","+y)) {
                continue;
            }
            Creature.allCords.delete(instance.x+","+instance.y);
            instance.x = x;
            instance.y = y;
            instance.fluidX = instance.x;
            instance.fluidY = instance.y;
            Creature.allCords.set(instance.x+","+instance.y, instance);
        }
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
BM.map = [];
for (let y = 0; y < BM.maxRows; y++) {
    BM.map[y] = [];
    for (let x = 0; x < BM.maxColumns; x++) {
        let r = Math.random();
        BM.map[y][x] =
            (r < 0.25) ? "grass" :
            (r < 0.5) ? "shallowwater" :
            (r < 0.75) ? "sand" :
            (r < 1) ? "grass" : "lava";
    }
}


    for (let i = 0; i < 50; i++) {
        for (let o = 0; o < 10; o++) {
            new Creature(i, o, "warrior");
            new Creature(i, 49-o, "goblin");
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

let f = 0;
async function gameLoop() {
    // Background
    mainWindow.width = WP.windowWidth;
    mainWindow.height = WP.windowHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WP.windowWidth, WP.windowHeight);
    BM.render();

    // Creatures
    if (f <= 0) {
        FlowField.makeFlowFields();
        f = 20;
    }
    f -= 1;
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
                ctx.fillStyle = "blue";
                ctx.font = "35px serif";
                ctx.fillText(`Cords (x, y): ${x+","+y}`, 100, 100);
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