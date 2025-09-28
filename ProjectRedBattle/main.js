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
}

/* Canvas Variables */
const WP = {
    windowWidth: 0,
    windowHeight: 0,
    getWindowResize: function() {
        WP.windowWidth = window.innerWidth; 
        WP.windowHeight = window.innerHeight;
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
    clicked: false,
    getMouseMove: function(event) {
        const rect = mainWindow.getBoundingClientRect();
        MKI.x = event.clientX - rect.left;
        MKI.y = event.clientY - rect.top;
    },
    getMouseDown: function() {
        MKI.downX = MKI.x;
        MKI.downY = MKI.y;
    },
    getMouseUp: function() {
        if (MKI.downX == MKI.x && MKI.downY == MKI.y) {
            MKI.clicked = true;
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
}
bootGame();

/* Unit Tab */
function handleUnitTab() {
    if (WP.windowHeight < 500) {return [0, 0, 0, 0];};
    ctx.fillStyle = 'rgb(125, 125, 125)';
    ctx.beginPath();
    const x = WP.middle(1000);
    const y = WP.bottom(100);
    const width = 1000;
    const height = 100;
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(gameTextures.warrior, x + 25, y + 25, 50, 50)
    ctx.drawImage(gameTextures.fishling, x + 125, y + 25, 50, 50)
    return [x, y, width, height];
}


async function startGame() {
    let a = 0;
    while (true) {
        a += 1;
        await wait(1);

        // Background
        ctx.clearRect(0, 0, WP.windowWidth, WP.windowHeight);
        ctx.fillStyle = 'rgb(255, 0 ,0)';
        mainWindow.width = WP.windowWidth;
        mainWindow.height = WP.windowHeight;
        ctx.font = "25px serif";
        ctx.fillText(`Width: ${WP.windowWidth}, Height: ${WP.windowHeight}, a = ${a}`, 100, 100);
    
        // GUI
        const [unitX, unitY, unitWidth, unitHeight] = handleUnitTab();
        console.log(unitX +" , "+  unitY);
        // Mouse Input
        if (MKI.clicked) {
            if (MKI.downX >= unitX && MKI.downX <= unitX + unitWidth && MKI.downY >= unitY && MKI.downY <= unitY + unitHeight) {
                console.log("CLICKED")
            }
            MKI.downX = 0;
            MKI.downY = 0;
            MKI.clicked = false;
        }
    }
}

startGame();