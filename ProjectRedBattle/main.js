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
    wentDown: false,
    wentUp: false,
    initialTarget: null,
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
    }
}

/* Battle Map */
class BM {
    static maxColumns = 100;
    static maxRows = 100;
    static map = [[]];
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
    for (const tab of ["Warrior", "Fishling", "Elf", "Troll", "Fledgling", "Goblin"]) {
        const tabName = tab.toLowerCase()
        const element = new GUI(tabName+"Tab", tabName, 0, 0, 0, 0, 0);
        element.hover = () => {
            const x = WP.middle(0);
            const y = WP.bottom(110);
            ctx.font = "35px serif";
            ctx.textAlign = "center";
            ctx.textBaseLine = "middle";
            ctx.fillText(tab, x, y);
        }   
    }
    for (let y = 0; y < BM.maxRows; y++) {
        for (let x = 0; x < BM.maxColumns; x++) {
            if (!BM.map[y]) {
                BM.map[y] = ["grass"];
            } else {
                BM.map[y].push("grass");
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
        ctx.clearRect(0, 0, WP.windowWidth, WP.windowHeight);
        mainWindow.width = WP.windowWidth;
        mainWindow.height = WP.windowHeight;
        ctx.font = "25px serif";
        ctx.fillText(`Width: ${WP.windowWidth}, Height: ${WP.windowHeight}, a = ${a}`, 100, 100);
    
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
            if (MKI.wentUp) {
                MKI.wentUp = false;
                MKI.downX = 0;
                MKI.downY = 0;
            }
        };

        WP.justReleased = false;
        WP.resized = false;
    }
}

startGame();