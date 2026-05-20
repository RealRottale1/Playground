const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

const DEVICEPIXELRATIO = window.devicePixelRatio || 1;
const USERINPUT = new Set();
const ACCELERATIONAMMOUNT = 0.125;
const REVERSEACCELERATIONAMMOUNT = 0.0625;
const NATURALDECELERATEAMMOUNT = 0.1;
const MAXSPEED = 15;
const TURNAMOUNT = .5 * (Math.PI / 180);
const DRIFTAMOUNT = TURNAMOUNT * 2;

async function wait(duration) {return new Promise((resolve) => {setTimeout(() => {resolve()})}, duration)};
function makeImage(url) { const image = new Image(); try { image.src = ("textures/" + url + ".png"); } catch { image.src = 'textures/missing.png'; } return image; }

const gameTextures = {
    missingTexture: makeImage("missing"),
    blario: makeImage("blario"),
    blarioReversing: makeImage("blarioReversed"),
    map: makeImage("map"),
}


let cartX = 0;
let cartY = 0;
let cartSize = 100;
let cartR = 0;
let cartSpeed = 0;
let reversing = false;

class Walls {
    static instances = new Set();
    x;  y;  xSize; ySize; rotation;

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

    static getWallCollisionInfo(wall, nDX, nDY) {
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

    static getCollisions() {
    
        const pTW = new Set([...Walls.instances]);
        for (let i = 0; i < 4; i++) {
            let nDX = null;
            let nDY = null;
            let blarioInfo = null;
            if (i <= 1) {
                nDX = i ? Math.cos(cartR) : -Math.sin(cartR);
                nDY = i ? Math.sin(cartR) : Math.cos(cartR);
                blarioInfo = Walls.getBlarioCollisionInfo(nDX, nDY);
            }
            for (const wall of pTW) {
                if (blarioInfo) {
                    const wallInfo = Walls.getWallCollisionInfo(wall, nDX, nDY);
                    if (wallInfo[1] > blarioInfo[0] || blarioInfo[1] > wallInfo[0]) {
                        console.log(blarioInfo)
                        pTW.delete(wall);
                    }
                } else {
                    const localNDX = i == 2 ? Math.cos(wall.rotation) : -Math.sin(wall.rotation);
                    const localNDY = i == 2 ? Math.sin(wall.rotation) : Math.cos(wall.rotation);
                    const localBlarioInfo = Walls.getBlarioCollisionInfo(localNDX, localNDY);
                    const wallInfo = Walls.getWallCollisionInfo(wall, localNDX, localNDY);
                    if (wallInfo[1] > localBlarioInfo[0] || localBlarioInfo[1] > wallInfo[0]) {
                        console.log("P2")
                        pTW.delete(wall);
                    }
                }
            }
        }
        console.log(pTW.size);
    }

    static render() {
        for (const wall of Walls.instances) {
            ctx.save();
            ctx.translate(wall.x - cartX, wall.y - cartY);
            ctx.rotate(wall.rotation);
            ctx.fillStyle = "black";
            ctx.fillRect(
                -wall.xSize/2,
                -wall.ySize/2,
                wall.xSize,
                wall.ySize
            );
            ctx.restore();
        }
    }

    constructor(x, y, xSize, ySize, rotation) {
        this.x = x; this.y = y;
        this.xSize = xSize; this.ySize = ySize;
        this.rotation = rotation * Math.PI/180;
        Walls.instances.add(this);
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
    if ((!turningLeft && turningRight) || (turningLeft && !turningRight)) {
        cartR += (drifting && cartSpeed != 0 ? (turningLeft ? -DRIFTAMOUNT : DRIFTAMOUNT) : (turningLeft ? -TURNAMOUNT : TURNAMOUNT));
        if (cartR > Math.PI * 2) {
            cartR = 0;
        } else if (cartR < 0) {
            cartR = Math.PI * 2;
        }
    }

    // Moving
    if ((!accelerate && decelerate) || (accelerate && !decelerate)) {
        const newSpeed = cartSpeed + (accelerate ? ACCELERATIONAMMOUNT : -REVERSEACCELERATIONAMMOUNT);
        cartSpeed = Math.min(Math.abs(newSpeed), MAXSPEED) * Math.sign(newSpeed);
        cartY += Math.sin(cartR) * cartSpeed;
        cartX += Math.cos(cartR) * cartSpeed;
    } else if (!accelerate && !decelerate) {
        const newSpeed = cartSpeed + NATURALDECELERATEAMMOUNT * Math.sign(cartSpeed) * -1;
        cartSpeed = Math.max(Math.abs(newSpeed), 0) * Math.sign(newSpeed);
        cartY += Math.sin(cartR) * cartSpeed;
        cartX += Math.cos(cartR) * cartSpeed;
    }
    cartSpeed = Math.round(cartSpeed * 1000)/1000;
    Walls.getCollisions()
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

const wall1 = new Walls(350, 350, 50, 50, 45);
startGame()