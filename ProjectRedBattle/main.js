const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

/* Critical Functions */
async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function halt(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; }

/* Game Textures */
const gameTextures = {
    missingTexture: makeImage("missing"),
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
        ctx.drawImage(gameTextures[this.content], this.x, this.y, this.width, this.height);
        if (this.darkness != 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${this.darkness})`;
            ctx.fillRect(this.x, this.y, this.width, this.height);
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
    for (const tile of ["Grass", "Stone", "Shallow Water", "Deep Water", "Sand"]) {
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
                for (const otherTile of ["Grass", "Stone", "Shallow Water", "Deep Water", "Sand"]) {
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

    for (let y = 0; y < BM.maxRows; y++) {
        for (let x = 0; x < BM.maxColumns; x++) {
            if (!BM.map[y]) {
                BM.map[y] = ["stone"];
            } else {
                BM.map[y].push((y == BM.maxRows-1 || y == 0 || x == BM.maxColumns-1) ? "stone" : (Math.random() > 0.5 ? "sand" : "shallowwater"));
            }
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
    const tiles = ["grassTab", "stoneTab", "shallowwaterTab", "deepwaterTab", "sandTab"];
    for (let i = 0; i < tiles.length; i++) {
        if (WP.resized) {GUI.instances[tiles[i]].update(x + 25, y + 75 * i + 75, 50, 50)}
        GUI.instances[tiles[i]].render();
    }
}

/* Gets Tile From Mouse Position */
function getSelectedTile() {
    const baseTileSize = WP.windowWidth / BM.maxColumns;
    const tileSize = baseTileSize * BM.zoom;

    const halfWidth = WP.windowWidth / 2;
    const halfHeight = WP.windowHeight / 2;

    const tileX = Math.floor((MKI.x - halfWidth) / tileSize + BM.mouseX);
    const tileY = Math.floor((MKI.y - halfHeight) / tileSize + BM.mouseY);
    
    const selectedX = Math.max(0, Math.min(BM.maxColumns - 1, tileX));
    const selectedY = Math.max(0, Math.min(BM.maxRows - 1, tileY));
    console.log(selectedX +", "+ selectedY);
    return [selectedX, selectedY];
}

function gameLoop() {
    // Background
    mainWindow.width = WP.windowWidth;
    mainWindow.height = WP.windowHeight;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, WP.windowWidth, WP.windowHeight);
    BM.render();

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
                        prompt("You clicked " + key);
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
        
        if (MKI.currentMouse == 0 && BM.currentTile != null) {
            const [x, y] = getSelectedTile();
            if (x && y) {BM.map[y][x] = BM.currentTile};
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