const mainWindow = document.getElementById("mainCanvas");
const ctx = mainWindow.getContext("2d");

/* Critical Functions */
async function wait(duration) {return new Promise((complete) => {setTimeout(() => {complete();}, duration);})}
function halt(duration) {return new Promise((complete) => {setTimeout(() => {complete();}, duration);})}


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
    if (WP.windowHeight < 500) {return;};
    ctx.fillStyle = 'rgb(125, 125, 125)';
    ctx.beginPath();
    ctx.rect(WP.middle(1000), WP.bottom(100), 1000, 100);
    ctx.fill();
    ctx.closePath();
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
        handleUnitTab();

        // Mouse Input
        if (MKI.clicked) {
            ctx.fillStyle = 'rgba(183, 57, 57, 1)';
            ctx.beginPath();
            ctx.rect(MKI.downX, MKI.downY, 5, 5);
            ctx.fill();
            ctx.closePath();
        }
    }
}

startGame();