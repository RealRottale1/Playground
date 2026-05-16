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


let cartX = -mainWindow.width;
let cartY = -mainWindow.height;
let cartSize = 100;
let cartR = 0;
let cartSpeed = 0;
let reversing = false;

class Walls {
    static instances = new Set();
    x;  y;  xSize; ySize; rotation;

    static getCollisions() {
        for (const wall of Walls.instances) {
            const xMin = x - xSize/2;   const xMax = x + xSize/2;
            const yMin = y - ySize/2;   const yMax = y + ySize/2;
        }
    }

    static render() {
        for (const wall of Walls.instances) {
            ctx.save();
            ctx.fillStyle = "black";
            ctx.fillRect(
                wall.x - cartX,
                wall.y- cartY,
                wall.xSize,
                wall.ySize
            );
            ctx.restore();
        }
    }

    constructor(x, y, xSize, ySize, rotation) {
        this.x = x; this.y = y;
        this.xSize = xSize; this.ySize = ySize;
        this.rotation = rotation;
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
    console.log(cartX, cartY)
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

const wall1 = new Walls(350, 350, 10, 10, 0);
startGame()