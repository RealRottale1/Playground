const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

const DEVICEPIXELRATIO = window.devicePixelRatio || 1;
const USERINPUT = new Set();
const ACCELERATIONAMMOUNT = 0.125;
const REVERSEACCELERATIONAMMOUNT = 0.0625;
const NATURALDECELERATEAMMOUNT = 0.1;
const MAXSPEED = 15;
const MAXBOOSTEDSPEED = MAXSPEED + 15;
const TURNAMOUNT = .5 * (Math.PI / 180);
const DRIFTAMOUNT = TURNAMOUNT * 2;
const BRICKPIXELAMOUNT = 100;
const OILTRACTIONLOSSAMOUNT = 150;
const MAXSPEEDONOILBEFORETRACTIONLOSS = MAXSPEED / 4;

async function wait(duration) {return new Promise((resolve) => {setTimeout(() => {resolve()})}, duration)};
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; }

const gameTextures = {
    missingTexture: makeImage("missing"),
    blario: makeImage("blario"),
    blarioReversing: makeImage("blarioReversed"),
    brick: makeImage("brick"),
    booster: makeImage("booster"),
    directionalBooster: makeImage("evilBooster"),
    oil: makeImage("oil"),
    ice: makeImage("ice"),
    tire: makeImage("tire"),
    map: makeImage("map"),
}


let cartX = 0;
let cartY = 0;
let cartSize = 100;
let cartR = 0;
let cartSpeed = 0;
let reversing = false;
let cartNoTraction = 0;
let cartOnIce = false;

class InteractableObject {
    static instances = new Set();
    x;  y;  xSize; ySize; rotation; className;
    constructor(x, y, xSize, ySize, rotation, className) {
        this.x = x; this.y = y;
        this.xSize = xSize; this.ySize = ySize;
        this.rotation = rotation * Math.PI/180;
        this.className = className;
        InteractableObject.instances.add(this);
    }

    static renderCoveredImages(localInstances, textureName, pixelAmount) {
        const centerX = mainWindow.width / 2;
        const centerY = mainWindow.height / 2;
        for (const wall of localInstances) {
            ctx.save();
            ctx.translate(centerX + (wall.x - cartX), centerY + (wall.y - cartY));
            ctx.rotate(wall.rotation);
            for (let y = 0; y < wall.ySize/pixelAmount; y++) {
                for (let x = 0; x < wall.xSize/pixelAmount; x++) {
                    ctx.drawImage(
                    gameTextures[textureName],
                    -(wall.xSize/2)+pixelAmount*x,
                    -(wall.ySize/2)+pixelAmount*y,
                    pixelAmount,
                    pixelAmount
                    );
                }
            }
            ctx.restore();
        }
    }

    static renderSquareImages(localInstances, textureName) {
        const centerX = mainWindow.width / 2;
        const centerY = mainWindow.height / 2;
        for (const instance of localInstances) {
            ctx.save();
            ctx.translate(centerX + (instance.x - cartX), centerY + (instance.y - cartY));
            ctx.rotate(instance.rotation + Math.PI/2);
            ctx.drawImage(
                gameTextures[textureName],
                -(instance.xSize/2),
                -(instance.ySize/2),
                instance.xSize,
                instance.ySize
            );
            ctx.restore();
        }
    }

    static getBlarioCollisionInfo(nDX, nDY) {
        const blarioSize = cartSize/2;
        const bXW = blarioSize*Math.cos(cartR);
        const bYW = blarioSize*Math.sin(cartR);
        const bXH = -blarioSize*Math.sin(cartR);
        const bYH = blarioSize*Math.cos(cartR);
       
        const blarioFlat1 = ((cartX + bXW + bXH) * nDX) + ((cartY + bYW + bYH) * nDY);
        const blarioFlat2 = ((cartX - bXW - bXH) * nDX) + ((cartY - bYW - bYH) * nDY);
        const blarioFlat3 = ((cartX + bXW - bXH) * nDX) + ((cartY + bYW - bYH) * nDY);
        const blarioFlat4 = ((cartX - bXW + bXH) * nDX) + ((cartY - bYW + bYH) * nDY);

        const blarioMax = Math.max(blarioFlat1, blarioFlat2, blarioFlat3, blarioFlat4);
        const blarioMin = Math.min(blarioFlat1, blarioFlat2, blarioFlat3, blarioFlat4);
        return [blarioMax, blarioMin];
    }

    static getObjectCollisionInfo(wall, nDX, nDY) {
        const xWidth = wall.xSize / 2;   const yWidth = wall.ySize / 2;
        const wXW = xWidth * Math.cos(wall.rotation);
        const wYW = xWidth * Math.sin(wall.rotation);
        const wXH = -yWidth * Math.sin(wall.rotation);
        const wYH = yWidth * Math.cos(wall.rotation);
        
        const wallFlat1 = ((wall.x + wXW + wXH) * nDX) + ((wall.y + wYW + wYH) * nDY);
        const wallFlat2 = ((wall.x - wXW - wXH) * nDX) + ((wall.y - wYW - wYH) * nDY);
        const wallFlat3 = ((wall.x + wXW - wXH) * nDX) + ((wall.y + wYW - wYH) * nDY);
        const wallFlat4 = ((wall.x - wXW + wXH) * nDX) + ((wall.y - wYW + wYH) * nDY);
        const wallMax = Math.max(wallFlat1, wallFlat2, wallFlat3, wallFlat4);
        const wallMin = Math.min(wallFlat1, wallFlat2, wallFlat3, wallFlat4);
        return [wallMax, wallMin];
    }

    static getOverlapAmount(wall, blarioInfo, wallInfo, nDY, nDX, intercectingWalls) {
        const overlap = Math.min(blarioInfo[0], wallInfo[0]) - Math.max(blarioInfo[1], wallInfo[1]);
        const wallInMap = intercectingWalls.has(wall);
        if (!wallInMap || ((overlap < intercectingWalls.get(wall)[0]))) {
            const wallToCartX = cartX - wall.x;
            const wallToCartY = cartY - wall.y;
            const d = wallToCartX * nDX + wallToCartY * nDY;
            const smallestAxisX = d < 0 ? -nDX : nDX;
            const smallestAxisY = d < 0 ? -nDY : nDY;
            if (!wallInMap) {
                intercectingWalls.set(wall, [overlap, smallestAxisX, smallestAxisY, wall.className]);
            } else {
                intercectingWalls.get(wall)[0] = overlap;
                intercectingWalls.get(wall)[1] = smallestAxisX;
                intercectingWalls.get(wall)[2] = smallestAxisY;
                intercectingWalls.get(wall)[3] = wall.className;
            }
        }
    }

    static getCollisions() {
        const intercectingWalls = new Map();
        const pTW = new Set([...InteractableObject.instances]);
        for (let i = 0; i < 4; i++) {
            let nDX = null;
            let nDY = null;
            let blarioInfo = null;
            if (i <= 1) {
                nDX = i ? Math.cos(cartR) : -Math.sin(cartR);
                nDY = i ? Math.sin(cartR) : Math.cos(cartR);
                blarioInfo = InteractableObject.getBlarioCollisionInfo(nDX, nDY);
            }
            for (const wall of pTW) {
                if (blarioInfo) {
                    const wallInfo = InteractableObject.getObjectCollisionInfo(wall, nDX, nDY);
                    if (wallInfo[1] > blarioInfo[0] || blarioInfo[1] > wallInfo[0]) {
                        pTW.delete(wall);
                    } else {
                        InteractableObject.getOverlapAmount(wall, blarioInfo, wallInfo, nDY, nDX, intercectingWalls);
                    }
                } else {
                    const localNDX = i == 2 ? Math.cos(wall.rotation) : -Math.sin(wall.rotation);
                    const localNDY = i == 2 ? Math.sin(wall.rotation) : Math.cos(wall.rotation);
                    const localBlarioInfo = InteractableObject.getBlarioCollisionInfo(localNDX, localNDY);
                    const wallInfo = InteractableObject.getObjectCollisionInfo(wall, localNDX, localNDY);
                    if (wallInfo[1] > localBlarioInfo[0] || localBlarioInfo[1] > wallInfo[0]) {
                        pTW.delete(wall);
                    } else {
                        InteractableObject.getOverlapAmount(wall, localBlarioInfo, wallInfo, localNDY, localNDX, intercectingWalls);
                    }
                }
            }
        }
        for (const wall of intercectingWalls.keys()) {
            if (!pTW.has(wall)) {
                intercectingWalls.delete(wall);
            }
        }
        return intercectingWalls;
    }

}

class Walls extends InteractableObject {
    static localInstances = new Set();
    static render() {
        InteractableObject.renderCoveredImages(Walls.localInstances, "brick", BRICKPIXELAMOUNT);
    }

    constructor(x, y, xSize, ySize, rotation) {
        super(x, y, xSize, ySize, rotation, "wall");
        Walls.localInstances.add(this);
    }
}

class Tires extends InteractableObject {
    static localInstances = new Set();
    static render() {
        InteractableObject.renderCoveredImages(Tires.localInstances, "tire", BRICKPIXELAMOUNT);
    }

    constructor(x, y, xSize, ySize, rotation) {
        super(x, y, xSize, ySize, rotation, "tire");
        Tires.localInstances.add(this);
    }
}

class Boosters extends InteractableObject {
    static localInstances = new Set();
    static render() {
        InteractableObject.renderSquareImages(Boosters.localInstances, "booster")
    }

    constructor(x, y, xSize, ySize, rotation) {
        super(x, y, xSize, ySize, rotation, "booster");
        Boosters.localInstances.add(this);
    }
}

class DirectionalBoosters extends InteractableObject {
    static localInstances = new Set();
    static render() {
        InteractableObject.renderSquareImages(DirectionalBoosters.localInstances, "directionalBooster")
    }

    constructor(x, y, xSize, ySize, rotation) {
        super(x, y, xSize, ySize, rotation, "diBooster");
        DirectionalBoosters.localInstances.add(this);
    }
}

class OilSpill extends InteractableObject {
    static localInstances = new Set();
    static render() {
        InteractableObject.renderSquareImages(OilSpill.localInstances, "oil")
    }

    constructor(x, y, xSize, ySize, rotation) {
        super(x, y, xSize, ySize, rotation, "oil");
        OilSpill.localInstances.add(this);
    }
}

class Ice extends InteractableObject {
    static localInstances = new Set();
    static render() {
        InteractableObject.renderCoveredImages(Ice.localInstances, "ice", BRICKPIXELAMOUNT*2);
    }

    constructor(x, y, xSize, ySize, rotation) {
        super(x, y, xSize, ySize, rotation, "ice");
        Ice.localInstances.add(this);
    }
}


function render() {
    // Wipe
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, mainWindow.width, mainWindow.height);
    
    const centerX = mainWindow.width/2;
    const centerY = mainWindow.height/2

    ctx.drawImage(
        gameTextures.map,
        centerX - cartX,
        centerY - cartY,
        DEVICEPIXELRATIO * 10000,
        DEVICEPIXELRATIO * 10000
    );

    Boosters.render();
    DirectionalBoosters.render();
    OilSpill.render();
    Ice.render();

    // Cart
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(cartR + Math.PI/2);
    ctx.drawImage(
        (reversing ? gameTextures.blarioReversing : gameTextures.blario),
        -cartSize/2,
        -cartSize/2,
        cartSize,
        cartSize
    );
    ctx.restore();

    Walls.render();
    Tires.render();
    requestAnimationFrame(render);
}

function handleInput() {
    // Turning
    const accelerate = USERINPUT.has(87);
    const decelerate = USERINPUT.has(83);
    const drifting = USERINPUT.has(16);
    const turningLeft = USERINPUT.has(65);
    const turningRight = USERINPUT.has(68);
    reversing = decelerate;

    if (!cartOnIce || Math.abs(cartSpeed) < 1) {
        if ((!turningLeft && turningRight) || (turningLeft && !turningRight)) {
            cartR += (drifting && cartSpeed != 0 ? (turningLeft ? -DRIFTAMOUNT : DRIFTAMOUNT) : (turningLeft ? -TURNAMOUNT : TURNAMOUNT)) *  (1 + (cartNoTraction/OILTRACTIONLOSSAMOUNT) * 3);
        }
        if (cartNoTraction == 0) {
            if ((!accelerate && decelerate) || (accelerate && !decelerate)) {
                const newSpeed = cartSpeed + (accelerate ? ACCELERATIONAMMOUNT : -REVERSEACCELERATIONAMMOUNT);
                cartSpeed = Math.min(Math.abs(newSpeed), MAXSPEED) * Math.sign(newSpeed);
            } else if (!accelerate && !decelerate) {
                const newSpeed = cartSpeed + NATURALDECELERATEAMMOUNT * Math.sign(cartSpeed) * -1;
                cartSpeed = Math.max(Math.abs(newSpeed), 0) * Math.sign(newSpeed);
            }
        } else {
            cartNoTraction -= 1;
        }
    }
    cartY += Math.sin(cartR) * cartSpeed;
    cartX += Math.cos(cartR) * cartSpeed;

    cartOnIce = false;
    const hitObjects = InteractableObject.getCollisions();
    for (const [obj, objectInfo] of hitObjects) {
        if (objectInfo[3] == "wall") {
            cartX += objectInfo[1] * (objectInfo[0]);
            cartY += objectInfo[2] * (objectInfo[0]);
            cartSpeed -= (1-ACCELERATIONAMMOUNT) * Math.sign(cartSpeed);
        } else if (objectInfo[3] == "tire") {
            cartX += objectInfo[1] * (objectInfo[0]);
            cartY += objectInfo[2] * (objectInfo[0]);
            cartSpeed *= -1;
        } else if (objectInfo[3] == "oil") {
            if ((accelerate || decelerate) && Math.abs(cartSpeed) > MAXSPEEDONOILBEFORETRACTIONLOSS) {
                cartNoTraction = OILTRACTIONLOSSAMOUNT;
            }
        } else if (objectInfo[3] == "ice") {
            cartOnIce = true;
        } else {
            cartSpeed = Math.min(Math.abs(cartSpeed) + .125, MAXBOOSTEDSPEED) * Math.sign(cartSpeed);
            if (objectInfo[3] == "diBooster") {
                cartR = obj.rotation;
            }
        }
    }
    cartSpeed = Math.round(cartSpeed * 1000)/1000;
}

document.addEventListener("keydown", function(event) {
    USERINPUT.add(event.keyCode);
});

document.addEventListener("keyup", function(event) {
    if (USERINPUT.has(event.keyCode)) {
        USERINPUT.delete(event.keyCode);
    }
});

async function startGame() {
    mainWindow.width = window.innerWidth * DEVICEPIXELRATIO;
    mainWindow.height = window.innerHeight * DEVICEPIXELRATIO;

    requestAnimationFrame(render);
    do {
        handleInput();
        await wait(0.1);
    } while (true);
}

for (let i = 0; i < 15; i++) {
    const o1 = new Walls(350, -50, 350, 400, 0);
    const o2 = new Boosters(350, 450, 350, 400, 0);
    const o3 = new DirectionalBoosters(350, 750, 350, 400, 0);
    const o4 = new OilSpill(350, 1150, 350, 400, 0);
    const o5 = new Ice(350, 1550, 350, 400, 0);
    const o6 = new Tires(350, 1950, 350, 400, 0);
}
startGame()