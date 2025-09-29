const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

/* Critical Functions */
async function wait(duration) {return new Promise((complete) => {setTimeout(() => {complete();}, duration);})}
function halt(duration) {return new Promise((complete) => {setTimeout(() => {complete();}, duration);})}
function makeImage(url) {const image = new Image(); try {image.src = ("textures/"+url+".png");} catch {image.src = 'textures/missing.png';} return image;}

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

        grass: makeImage("goblin"),
}

/* Canvas Variables */
const WP = {
    windowWidth: 0,
    windowHeight: 0,
    resized: false,
    getWindowResize: function() {
        WP.windowWidth = window.innerWidth; 
        WP.windowHeight = window.innerHeight;
        WP.resized = true;
    },
    right: function(x) {return WP.windowWidth - x;},
    bottom: function(y) {return WP.windowHeight - y;},
    middle: function(x) {return (WP.windowWidth - x) / 2;},
    center: function(y) {return (WP.windowHeight - y) / 2;},
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
    initialTarget: null,
    lastScroll: 0,
    getMouseMove: function(event) {
        const rect = mainWindow.getBoundingClientRect();
        MKI.x = event.clientX - rect.left;
        MKI.y = event.clientY - rect.top;
    },
    getMouseDown: function() {
        MKI.downX = MKI.x;
        MKI.downY = MKI.y;
        MKI.wentDown = true;
    },
    getMouseUp: function() {
        MKI.wentUp = true;
    },
    getMouseScroll: function(event) {
        event.preventDefault();
        const change = (MKI.lastScroll > event.deltaY ? 1 : -1);
        const forcasted = BM.zoom + change/5;
        console.log(forcasted)
        if (forcasted >= 0.25 && forcasted <= 2) {
            MKI.lastScroll = change;
            BM.zoom = forcasted;
            const ratio = (WP.windowWidth/BM.maxColumns) * BM.zoom;
            // console.log(ratio)
            //BM.mouseX += change*ratio;
        }
    } 
}

/* Battle Map */
class BM {
    static maxColumns = 100;
    static maxRows = 100;
    static mouseX = 0;
    static mouseY = this.maxRows/2;
    static zoom = 1;
    static map = [[]];

    static render() {
        const ratio = (WP.windowWidth/this.maxColumns) * this.zoom;
        const size = Math.ceil(ratio);
        for (let y = 0; y < this.maxRows; y++) {
            for (let x = 0; x < this.maxColumns; x++) {
                ctx.drawImage(gameTextures[this.map[y][x]], 
                    Math.floor(ratio*x - (ratio/this.zoom)*this.mouseX), 
                    Math.floor(ratio*y - (ratio/this.zoom)*this.mouseY),
                    size, size);
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
    for (const tab of ["Warrior", "Fishling", "Elf", "Troll", "Fledgling", "Goblin"]) {
        const tabName = tab.toLowerCase()
        const element = new GUI(tabName+"Tab", tabName, 0, 0, 0, 0, 0);
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
    for (let y = 0; y < BM.maxRows; y++) {
        for (let x = 0; x < BM.maxColumns; x++) {
            if (!BM.map[y]) {
                BM.map[y] = ["elf"];
            } else {
                BM.map[y].push((y == 99 || y == 0 || x == 99) ? "elf" : ((Math.random() > 0.5 ? "grass" : "warrior")));
            }
        }
    }
}
bootGame();

/* Unit Tab */
function handleUnitTab() {
    const tabs = ["warriorTab", "fishlingTab", "elfTab", "trollTab", "fledglingTab", "goblinTab"];
    if (WP.windowHeight < 500) {for (let i = 0; i < 6; i++) {GUI.instances[tabs[i]].enabled = false}; return};
    const x = WP.middle(600);
    const y = WP.bottom(100);
    const width = 600;
    const height = 100;
    ctx.drawImage(gameTextures.unitBar, x, y, width, height);
    for (let i = 0; i < 6; i++) {
        if (WP.resized) {GUI.instances[tabs[i]].update(x + 100*i + 25, y + 25, 50, 50)};
        GUI.instances[tabs[i]].render();
    }
    return [x, y, width, height];
}


async function startGame() {
    let a = 0;
    while (true) {
        a += 1;
        await wait(1);

        // Background
        mainWindow.width = WP.windowWidth;
        mainWindow.height = WP.windowHeight;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, WP.windowWidth, WP.windowHeight);
        BM.render();

        // GUI
        handleUnitTab();


        // Mouse Input Of All Kind
        let overElement = false;
        for (const [key, element] of Object.entries(GUI.instances)) {
            if (element.enabled) {
                if (MKI.x >= element.x && MKI.x <= element.x + element.width && MKI.y >= element.y && MKI.y <= element.y + element.height) {
                    overElement = true;
                    element.hover();
                    MKI.hoveringOver = key;
                    if (MKI.wentDown) {
                        MKI.wentDown = false;
                        MKI.initialTarget = key;
                        break;
                    }
                    if (MKI.wentUp) {
                        MKI.wentUp = false;
                        if (MKI.initialTarget == key && MKI.hoveringOver == key) {
                            prompt("You clicked "+ key);
                            MKI.downX = 0;
                            MKI.downY = 0;
                        }
                        MKI.initialTarget = null;
                    }
                    break;
                }
            }
        }
        if (!overElement) {
            MKI.hoveringOver = null
            if (MKI.wentDown) {
                MKI.wentDown = false;
                MKI.initialTarget = null;
            }
            ctx.fillStyle = "white";
            ctx.font = "34px serif";
            ctx.fillText(`Zoom: ${BM.zoom}`, 120, 120);
            ctx.fillText(`MouseY ${BM.mouseY}`, 120, 140);
            if (MKI.downX != 0 && MKI.downY != 0) {

                console.log("Y: "+BM.mouseY)
                console.log("Percent: "+(BM.zoom/2.25)/BM.maxRows)
                const shiftX = (MKI.changeX == 0 ? 0 : (MKI.changeX - MKI.x)/5);
                const shiftY = (MKI.changeY == 0 ? 0 : (MKI.changeY - MKI.y)/5);
                const forcastX = (BM.mouseX + shiftX);
                const forcastY = (BM.mouseY + shiftY);
                const s = BM.zoom > 1 ? ((BM.zoom - 1) / 1) : 0;
                BM.mouseX = (forcastX > BM.maxColumns || forcastX < -1*BM.maxColumns) ? BM.mouseX : forcastX;
                BM.mouseY = (forcastY > BM.maxRows || forcastY < -1*BM.maxRows) ? BM.mouseY : forcastY;
                MKI.changeX = MKI.x;
                MKI.changeY = MKI.y;
            }
            if (MKI.wentUp) {
                MKI.wentUp = false;
                MKI.downX = 0;
                MKI.downY = 0;
                MKI.changeX = 0;
                MKI.changeY = 0;
            }
        };

        WP.justReleased = false;
        WP.resized = false;
    }
}

startGame();