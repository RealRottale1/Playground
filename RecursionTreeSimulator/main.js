let mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");
let sideWindow = document.createElement("canvas");
const sidectx = sideWindow.getContext("2d");
const loadingBarDiv = document.getElementById("loadingDiv");
const loadingBar = document.getElementById("loadingBar");
const loadingText = document.getElementById("loadingText");
const backgroundImage = document.getElementById("backgroundImage");

async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; };

const TEXTURES = {
    missing: makeImage("missing"),
    background: makeImage("background"),
}

const CANVAS_HANDLER = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    downX: 0,
    downY: 0,
    changeX: 0,
    changeY: 0,
    wentDown: false,
    wentUp: false,
    setCanvasSize: function(w) {
        this.width = window.innerWidth*2;
        this.height = window.innerHeight*2;
        w.width = this.width;
        w.height = this.height;
    },
    right(x) {return this.width - x;},
    bottom(y) {return this.height - y;},
    center(x) {return this.width / 2 - x / 2;},
    middle(y) {return this.height / 2 - y / 2;},
    mouseMove: function(event) {
        const rect = mainWindow.getBoundingClientRect();
        const scaleX = mainWindow.width / rect.width;
        const scaleY = mainWindow.height / rect.height;

        CANVAS_HANDLER.x = (event.clientX - rect.left) * scaleX;
        CANVAS_HANDLER.y = (event.clientY - rect.top) * scaleY;
    },
    mouseDown: function(event) {
        const rect = mainWindow.getBoundingClientRect();
        const scaleX = mainWindow.width / rect.width;
        const scaleY = mainWindow.height / rect.height;

        CANVAS_HANDLER.x = (event.clientX - rect.left) * scaleX;
        CANVAS_HANDLER.y = (event.clientY - rect.top) * scaleY;

        CANVAS_HANDLER.downX = CANVAS_HANDLER.x;
        CANVAS_HANDLER.downY = CANVAS_HANDLER.y;
        CANVAS_HANDLER.changeX = CANVAS_HANDLER.x;
        CANVAS_HANDLER.changeY = CANVAS_HANDLER.y;
        CANVAS_HANDLER.wentDown = true;
    },
    mouseUp: function(event) {
        CANVAS_HANDLER.wentUp = true;
    }
}

CANVAS_HANDLER.setCanvasSize(mainWindow);
let mouseX = CANVAS_HANDLER.middle(0);
let mouseY = CANVAS_HANDLER.center(0);
let menuOpen = true;
let cosmeticOpen = true;
let openingMenu = false;
let openingCosmetic = false;
let generating = true;
let generated = false;
const delayTime = 1;
let delayPercentage = 4;
let loadingPercent = 0;

class LEAVES {
    static leaves = [];
    static size = 15;
    static minSizePercent = 0.5;
    static maxSizePercent = 1.25;
    static R; static G; static B; static A;
    x = 0;
    y = 0;
    sizePercent = 1;
    constructor() {
        this.sizePercent = Math.max(Math.random() * (LEAVES.maxSizePercent - LEAVES.minSizePercent) + LEAVES.minSizePercent, LEAVES.minSizePercent);
        LEAVES.leaves.push(this);
    }

    static async render() {
        for (let i = 0; i < LEAVES.leaves.length; i++) {
            loadingPercent = 25 + (i / LEAVES.leaves.length) * 75;
            loadingBar.style.width = `${loadingPercent}%`;
            loadingText.textContent = `Rendering Leaves ${i+1}/${LEAVES.leaves.length}`;
            const leaf = LEAVES.leaves[i];
            ctx.fillStyle = `rgb(${LEAVES.R}, ${LEAVES.G}, ${LEAVES.B})`;
            ctx.save();
            ctx.globalAlpha = LEAVES.A;
            ctx.beginPath();
            //ctx.fillRect(leaf.x - LEAVES.size/2 * leaf.sizePercent, leaf.y - LEAVES.size/2 * leaf.sizePercent, LEAVES.size * leaf.sizePercent, LEAVES.size * leaf.sizePercent);
            ctx.arc(leaf.x, leaf.y, LEAVES.size * leaf.sizePercent, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (i % delayPercentage == 0) {
                await wait(delayTime);
            }
        }
    }
}

class TREE {
    static maxPerBranch = 5;
    static minPerBranch = 2;
    static maxDepth = 7;
    static minDepth = 5;
    static depthExitPercent = 0;
    static maxBranches = 0;

    static spread = Math.PI / 6;
    static widthRetention = 0.75;
    static lengthRetention = 0.75;

    static R; static G; static B; static A;

    static root = null;
    children = [];
    leaf = null;
    rot = 0; len = 0; wid = 0;

    constructor(rot, len, wid, currentDepth) {
        TREE.maxBranches++;
        this.rot = rot; this.len = len; this.wid = wid;
        if (TREE.root === null) {
            TREE.root = this;
        }

        let earlyExit = false;
        if (currentDepth < TREE.maxDepth) {
            if (currentDepth >= TREE.minDepth) {
                if (Math.random() < TREE.depthExitPercent) {
                    earlyExit = true;
                }
            }
            if (!earlyExit) {
                const childrenCount = Math.floor(Math.random() * (TREE.maxPerBranch+1-TREE.minPerBranch)) + TREE.minPerBranch;
                for (let i = 0; i < childrenCount; i++) {
                    const childRot = (i - (childrenCount - 1) / 2) * TREE.spread;
                    const child = new TREE(childRot, Math.min(this.len * TREE.lengthRetention, -50), this.wid * TREE.widthRetention, currentDepth + 1);
                    this.children.push(child);
                }
            }
        }
        
        if (currentDepth >= TREE.maxDepth || earlyExit) {
            if (LEAVES.size != 0) {
                if (LEAVES.maxSizePercent == 0 && LEAVES.maxSizePercent == LEAVES.minSizePercent) {
                    return;
                }
                this.leaf = new LEAVES();
            }
        }
    }


    async render(x, y, rot, depth) {
        if (TREE.A == 0) {return;}
        ctx.fillStyle = `rgb(${TREE.R}, ${TREE.G}, ${TREE.B})`;
        ctx.save();
        ctx.globalAlpha = TREE.A;
        ctx.translate(x, y);
        ctx.rotate(this.rot + rot);
        const offX = Math.cos(this.rot + rot) * this.len;
        const offY = Math.sin(this.rot + rot) * this.len;
        ctx.fillRect(0, -this.wid/2, this.len, this.wid);
        ctx.restore();

        loadingPercent++;
        for (const child of this.children) {
            await child.render(x + offX, y + offY, this.rot + rot, depth + 1);
        }
        if (this.children.length == 0) {
            loadingBar.style.width = `${(loadingPercent / TREE.maxBranches) * 25}%`;
            loadingText.textContent = `Rendering Branches ${loadingPercent}/${TREE.maxBranches}`;
        }

        if (depth % delayPercentage == 0) {
            await wait(delayTime);
        }
        
        if (this.leaf !== null) {
            this.leaf.x = x + offX;
            this.leaf.y = y + offY;
        }

        if (depth == 0) {
            if (LEAVES.A == 0) {return;}
            loadingText.textContent = "Rendering Leaves";
            await LEAVES.render();
        }
    }
}

let backgroundR; let backgroundG; let backgroundB; let backgroundA;
async function generateTree() {
    backgroundImage.style.backgroundColor = `rgba(${backgroundR}, ${backgroundG}, ${backgroundB}, ${backgroundA})`;
    loadingText.textContent = "Backend Computing";
    a = new TREE(Math.PI/2, -200, 50, 0);
    loadingText.textContent = "Rendering Branches";
    ctx.clearRect(0, 0, mainWindow.width, mainWindow.height);
    await TREE.root.render(CANVAS_HANDLER.center(0), CANVAS_HANDLER.bottom(250), 0, 0, false);
    CANVAS_HANDLER.setCanvasSize(sideWindow);
    sidectx.drawImage(mainWindow, 0, 0);
    generating = false;
}

const menuDiv = document.getElementById("controlDiv");
const colorDiv = document.getElementById("cosmeticDiv");
const generateButton = document.getElementById("regenButton");
const maxBranchInput = document.getElementById("maxBranch");
const minBranchInput = document.getElementById("minBranch");
const maxDepthInput = document.getElementById("maxDepth");
const minDepthInput = document.getElementById("minDepth");
const minDepthExitInput = document.getElementById("depthExitPercent");
const spreadInput = document.getElementById("spreadAmount");
const widthRetentionInput = document.getElementById("widthRetention");
const lengthRetentionInput = document.getElementById("lengthRetention");
const leafSizeInput = document.getElementById("leafSize");
const leafMinInput = document.getElementById("leafMin");
const leafMaxInput = document.getElementById("leafMax");
const completeDiv = document.getElementById("completeDiv");
const removeCompleteDiv = document.getElementById("removeCompleteText");
const removeControlDiv = document.getElementById("removeControlDiv");
const removeCosmeticDiv = document.getElementById("removeCosmeticDiv");
const branchRInput = document.getElementById("branchR");
const branchGInput = document.getElementById("branchG");
const branchBInput = document.getElementById("branchB");
const branchAInput = document.getElementById("branchA");
const leavesRInput = document.getElementById("leafR");
const leavesGInput = document.getElementById("leafG");
const leavesBInput = document.getElementById("leafB");
const leavesAInput = document.getElementById("leafA");
const backgroundRInput = document.getElementById("backR");
const backgroundGInput = document.getElementById("backG");
const backgroundBInput = document.getElementById("backB");
const backgroundAInput = document.getElementById("backA");
const delayInput = document.getElementById("delayTime");

backgroundR = Math.max(Math.min(parseInt(backgroundRInput.value), 255), 0);
backgroundG = Math.max(Math.min(parseInt(backgroundGInput.value), 255), 0);
backgroundB = Math.max(Math.min(parseInt(backgroundBInput.value), 255), 0);
backgroundA = Math.max(Math.min(parseInt(backgroundAInput.value), 100), 0) / 100;
generateButton.addEventListener("click", async function() {
    if (generating) {return};
    mouseX = CANVAS_HANDLER.middle(0);
    mouseY = CANVAS_HANDLER.center(0);
    generated = false;
    loadingPercent = 0;
    loadingBar.style.width = "0%";
    loadingBarDiv.style.display = 'block';
    completeDiv.style.display = 'none';
    generating = true;
    TREE.root = null;
    LEAVES.leaves = [];
    TREE.maxPerBranch = Math.max(Math.min(parseInt(maxBranchInput.value), 12), 1);
    TREE.minPerBranch = Math.max(Math.min(parseInt(minBranchInput.value), 12), 1);
    TREE.maxDepth = Math.max(Math.min(parseInt(maxDepthInput.value), 12), 1);
    TREE.minDepth = Math.max(Math.min(parseInt(minDepthInput.value), 12), 1);
    TREE.depthExitPercent = Math.max(Math.min(parseInt(minDepthExitInput.value), 100), 0) / 100;
    TREE.spread = Math.PI / (Math.max(Math.min(parseInt(spreadInput.value), 320), 1) / 10);
    TREE.widthRetention = Math.max(Math.min(parseInt(widthRetentionInput.value), 200), 0) / 100;
    TREE.lengthRetention = Math.max(Math.min(parseInt(lengthRetentionInput.value), 200), 0) / 100;
    LEAVES.size = Math.max(Math.min(parseInt(leafSizeInput.value), 50), 0);
    LEAVES.minSizePercent = Math.max(Math.min(parseInt(leafMinInput.value), 200), 0) / 100;
    LEAVES.maxSizePercent = Math.max(Math.min(parseInt(leafMaxInput.value), 200), 0) / 100;
    LEAVES.R = Math.max(Math.min(parseInt(leavesRInput.value), 255), 0);
    LEAVES.G = Math.max(Math.min(parseInt(leavesGInput.value), 255), 0);
    LEAVES.B = Math.max(Math.min(parseInt(leavesBInput.value), 255), 0);
    LEAVES.A = Math.max(Math.min(parseInt(leavesAInput.value), 100), 0) / 100;
    TREE.R = Math.max(Math.min(parseInt(branchRInput.value), 255), 0);
    TREE.G = Math.max(Math.min(parseInt(branchGInput.value), 255), 0);
    TREE.B = Math.max(Math.min(parseInt(branchBInput.value), 255), 0);
    TREE.A = Math.max(Math.min(parseInt(branchAInput.value), 100), 0) / 100;
    backgroundR = Math.max(Math.min(parseInt(backgroundRInput.value), 255), 0);
    backgroundG = Math.max(Math.min(parseInt(backgroundGInput.value), 255), 0);
    backgroundB = Math.max(Math.min(parseInt(backgroundBInput.value), 255), 0);
    backgroundA = Math.max(Math.min(parseInt(backgroundAInput.value), 100), 0) / 100;
    delayPercentage = 100 - Math.max(Math.min(parseInt(delayInput.value), 100), 0);
    TREE.maxBranches = 0;
    await generateTree();
    completeDiv.style.display = 'block';
    loadingBarDiv.style.display = 'none';
    generated = true;
});

TEXTURES.background.onload = () => {
    generating = false;
    backgroundImage.style.backgroundColor = `rgba(${backgroundR}, ${backgroundG}, ${backgroundB}, ${backgroundA})`;
}

removeCompleteDiv.addEventListener("click", ()=> {
    completeDiv.style.display = 'none';
});


removeControlDiv.addEventListener("click", async ()=> {
    if (openingMenu) {return;}
    openingMenu = true;
    menuOpen = !menuOpen;
    if (menuOpen) {
        menuDiv.classList.remove("close");
        removeControlDiv.textContent = "<";
    } else {
        menuDiv.classList.add("close");
        removeControlDiv.textContent = ">";
    }
    await wait(1000);
    openingMenu = false;
});


removeCosmeticDiv.addEventListener("click", async ()=> {
    if (openingCosmetic) {return;}
    openingCosmetic = true;
    cosmeticOpen = !cosmeticOpen;
    if (cosmeticOpen) {
        colorDiv.classList.remove("close");
        removeCosmeticDiv.textContent = ">";
    } else {
        colorDiv.classList.add("close");
        removeCosmeticDiv.textContent = "<";
    }
    await wait(1000);
    openingCosmetic = false;
});

async function mainLoop() {
    mainWindow.addEventListener("mousemove", CANVAS_HANDLER.mouseMove);
    mainWindow.addEventListener("mousedown", CANVAS_HANDLER.mouseDown);
    mainWindow.addEventListener("mouseup", CANVAS_HANDLER.mouseUp);
    while (true) {
        if (generated) {
            ctx.save();
            ctx.clearRect(0, 0, mainWindow.width, mainWindow.height);
            ctx.drawImage(sideWindow, mouseX-CANVAS_HANDLER.middle(0), mouseY-CANVAS_HANDLER.center(0));
            ctx.restore();
        }
        console.log(CANVAS_HANDLER.x)
        if (CANVAS_HANDLER.wentDown) {
            CANVAS_HANDLER.wentDown = false;
            CANVAS_HANDLER.initialTarget = null;
        }
        if (CANVAS_HANDLER.downX != 0 && CANVAS_HANDLER.downY != 0) {
            const downXPixels = CANVAS_HANDLER.x - CANVAS_HANDLER.changeX;
            const downYPixels = CANVAS_HANDLER.y - CANVAS_HANDLER.changeY;
            if (downXPixels != 0 || downYPixels != 0) {
                mouseX -= downXPixels;
                mouseY -= downYPixels;
                CANVAS_HANDLER.changeX = CANVAS_HANDLER.x;
                CANVAS_HANDLER.changeY = CANVAS_HANDLER.y;
            }
        }
        if (CANVAS_HANDLER.wentUp) {
            CANVAS_HANDLER.wentUp = false;
            CANVAS_HANDLER.downX = 0;
            CANVAS_HANDLER.downY = 0;
            CANVAS_HANDLER.changeX = 0;
            CANVAS_HANDLER.changeY = 0;
        }
        await wait(10);
    }
}
mainLoop();