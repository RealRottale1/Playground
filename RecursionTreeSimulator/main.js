const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

async function wait(duration) { return new Promise((complete) => { setTimeout(() => { complete(); }, duration); }) }
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; };

const TEXTURES = {
    missing: makeImage("missing"),
    background: makeImage("background"),
}

const CANVAS_HANDLER = {
    width: 0,
    height: 0,
    setCanvasSize: function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        mainWindow.width = this.width;
        mainWindow.height = this.height;
    },
    right(x) {return this.width - x;},
    bottom(y) {return this.height - y;},
    center(x) {return this.width / 2 - x / 2;},
    middle(y) {return this.height / 2 - y / 2;}
}

CANVAS_HANDLER.setCanvasSize();
let generating = false;
const delayTime = 1;
const delayPercentage = 4;

class LEAVES {
    static leaves = [];
    static size = 15;
    static minSizePercent = 0.5;
    static maxSizePercent = 1.25;
    x = 0;
    y = 0;
    sizePercent = 1;
    constructor() {
        this.sizePercent = Math.max(Math.random() * (LEAVES.maxSizePercent - LEAVES.minSizePercent) + LEAVES.minSizePercent, LEAVES.minSizePercent);
        LEAVES.leaves.push(this);
    }

    static async render() {
        for (let i = 0; i < LEAVES.leaves.length; i++) {
            const leaf = LEAVES.leaves[i];
            ctx.fillStyle = "green";
            ctx.save();
            ctx.beginPath();
            //ctx.globalAlpha = 0.5;
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

    static spread = Math.PI / 6;
    static widthRetention = 0.75;
    static lengthRetention = 0.75;

    static root = null;
    children = [];
    leaf = null;
    rot = 0; len = 0; wid = 0; color = "black";

    constructor(rot, len, wid, color, currentDepth) {
        this.rot = rot; this.len = len; this.wid = wid;
        this.color = color;
        if (TREE.root === null) {
            TREE.root = this;
        }

        let earlyExit = false;
        if (currentDepth < TREE.maxDepth) {
            if (currentDepth >= TREE.minDepth) {
                if (Math.floor(Math.random() * 11) <= TREE.depthExitPercent) {
                    earlyExit = true;
                }
            }
            if (!earlyExit) {
                const childrenCount = Math.floor(Math.random() * (TREE.maxPerBranch+1-TREE.minPerBranch)) + TREE.minPerBranch;
                for (let i = 0; i < childrenCount; i++) {
                    const childRot = (i - (childrenCount - 1) / 2) * TREE.spread;
                    const child = new TREE(childRot, Math.min(this.len * TREE.lengthRetention, -50), this.wid * TREE.widthRetention, this.color, currentDepth + 1);
                    this.children.push(child);
                }
            }
        }
        
        if (currentDepth >= TREE.maxDepth || earlyExit) {
            this.leaf = new LEAVES();
        }
    }


    async render(x, y, rot, depth) {
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rot + rot);
        const offX = Math.cos(this.rot + rot) * this.len;
        const offY = Math.sin(this.rot + rot) * this.len;
        ctx.fillRect(0, -this.wid/2, this.len, this.wid);
        ctx.restore();


        for (const child of this.children) {
            await child.render(x + offX, y + offY, this.rot + rot, depth + 1);
        }
        if (depth % delayPercentage == 0) {
            await wait(delayTime);
        }
        
        if (this.leaf !== null) {
            this.leaf.x = x + offX;
            this.leaf.y = y + offY;
        }

        if (depth == 0) {
            await LEAVES.render();
        }
    }
}

function generateBackground() {
    ctx.fillStyle = "rgb(255, 0, 191)";
    ctx.fillRect(0, 0, CANVAS_HANDLER.width, CANVAS_HANDLER.height);
    ctx.save();
    ctx.drawImage(
        TEXTURES.background,
        0,0,
        CANVAS_HANDLER.width,
        CANVAS_HANDLER.height
    );
    ctx.restore();
}

async function generateTree() {
    generateBackground();
    a = new TREE(Math.PI/2, -200, 50, "brown", 0);
    await TREE.root.render(CANVAS_HANDLER.center(0), CANVAS_HANDLER.bottom(0), 0, 0);
    generating = false;
}

const generateButton = document.getElementById("regenButton");
const maxBranchInput = document.getElementById("maxBranch");
const minBranchInput = document.getElementById("minBranch");
const maxDepthInput = document.getElementById("maxDepth");
const minDepthInput = document.getElementById("minDepth");
const minDepthExitInput = document.getElementById("depthExitPercent");
const widthRetentionInput = document.getElementById("widthRetention");
const lengthRetentionInput = document.getElementById("lengthRetention");
const leafSizeInput = document.getElementById("leafSize");
const leafMinInput = document.getElementById("leafMin");
const leafMaxInput = document.getElementById("leafMax");

generateButton.addEventListener("click", () => {
    if (generating) {return};
    generating = true;
    TREE.root = null;
    LEAVES.leaves = [];
    TREE.maxPerBranch = Math.max(Math.min(parseInt(maxBranchInput.value), 12), 1);
    TREE.minPerBranch = Math.max(Math.min(parseInt(minBranchInput.value), 12), 1);
    TREE.maxDepth = Math.max(Math.min(parseInt(maxDepthInput.value), 12), 1);
    TREE.minDepth = Math.max(Math.min(parseInt(minDepthInput.value), 12), 1);
    TREE.depthExitPercent = Math.max(Math.min(parseInt(minDepthExitInput.value), 100), 0) / 10;
    TREE.widthRetention = Math.max(Math.min(parseInt(widthRetentionInput.value), 200), 0) / 100;
    TREE.lengthRetention = Math.max(Math.min(parseInt(lengthRetentionInput.value), 200), 0) / 100;
    LEAVES.size = Math.max(Math.min(parseInt(leafSizeInput.value), 50), 0);
    LEAVES.minSizePercent = Math.max(Math.min(parseInt(leafMinInput.value), 200), 0) / 100;
    LEAVES.maxSizePercent = Math.max(Math.min(parseInt(leafMaxInput.value), 200), 0) / 100;
    console.log(LEAVES.size, LEAVES.maxSizePercent, LEAVES.minSizePercent);
    generateTree();
});

TEXTURES.background.onload = () => {
    generateBackground();
}