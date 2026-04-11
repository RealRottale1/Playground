const mainWindow = document.getElementById("game");
if (!mainWindow) {console.warn("Unable to find [game]!");}

// Core Variables
let currentPieces = {};

const boardXSize = 31;
const boardYSize = 17;



// Setup
function simulateClick(element, isRight) {
    const eventParams = {
        bubbles: true,
        cancelable: true,
        view: window,
        button: (isRight ? 2 : 0),
        buttons: (isRight ? 2 : 1)
    };
    element.dispatchEvent(new MouseEvent("mousedown", eventParams));
    element.dispatchEvent(new MouseEvent("mouseup", eventParams));
    element.dispatchEvent(new MouseEvent((isRight ? "contextmenu" : "click"), eventParams));
}
function setGamePieces() {
    for (let y = 0; y < boardYSize; y++) {
        currentPieces[y] = [];
        for (let x = 0; x < boardXSize; x++) {
            const piece = document.getElementById(`${y}_${x}`);
            let neighboringPositions = [];
            for (let y2 = y - 1; y2 <= y + 1; y2++) {
                if (y2 >= 0 && y2 < boardYSize) {
                    for (let x2 = x - 1; x2 <= x + 1; x2++) {
                        if (x2 >= 0 && x2 < boardXSize) {
                            if (!(x2 == x && y2 == y)) {
                                neighboringPositions.push([y2, x2]);
                            }
                        }
                    }
                }
            }
            currentPieces[y][x] = [piece, neighboringPositions];
        }
    }
}
setGamePieces();



// Main
function getMineNumber(y, x) {
    const pieceList = currentPieces[y][x][0].classList;
    if (pieceList.contains("blank") || pieceList.contains("open0")) {
        return 0;
    } else {
        return parseInt(currentPieces[y][x][0].classList[1].at(-1), 10);
    }
}

function getTile(y, x) {
    const pieceList = currentPieces[y][x][0].classList;
    if (pieceList.contains("blank")) {
        return '_';
    } else if (pieceList.contains("bombflagged")) {
        return 'b';
    }
    return 'n';
}

async function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

async function sweepMines() {
    let clicks = 0;
    for (let y = 0; y < boardYSize; y++) {
        for (let x = 0; x < boardXSize; x++) {
            if (currentPieces[y][x]) {
                const nearbyMines = getMineNumber(y, x);
                if (nearbyMines == 0) {continue;}

                const nearbyMineNumbers = [];
                let possibleMineSpots = 0;
                let knownMineSpots = 0;
                for (let i = 0; i < currentPieces[y][x][1].length; i++) {
                    const tileResult = getTile(currentPieces[y][x][1][i][0], currentPieces[y][x][1][i][1]);
                    if (tileResult == 'b') {knownMineSpots++;}
                    if (tileResult == '_') {possibleMineSpots++;}
                    nearbyMineNumbers.push(tileResult);
                }

                if (possibleMineSpots == 0) {continue;}

                if (knownMineSpots == nearbyMines) {
                    for (let i = 0; i < currentPieces[y][x][1].length; i++) {
                        if (nearbyMineNumbers[i] == '_') {
                            const targetTile = currentPieces[currentPieces[y][x][1][i][0]][currentPieces[y][x][1][i][1]][0];
                            simulateClick(targetTile, false);
                            clicks++;
                        }
                    }
                } else if ((knownMineSpots + possibleMineSpots) == nearbyMines) {
                    for (let i = 0; i < currentPieces[y][x][1].length; i++) {
                        if (nearbyMineNumbers[i] == '_') {
                            const targetTile = currentPieces[currentPieces[y][x][1][i][0]][currentPieces[y][x][1][i][1]][0];
                            simulateClick(targetTile, true);
                            clicks++;
                        }
                    }
                }
                //await wait(50);
            }
        }
    }
    return clicks;
}

simulateClick(currentPieces[Math.floor(boardYSize/2)][Math.floor(boardXSize/2)][0], false);
do {
    const clicks = await sweepMines();
    if (clicks == 0) {
        await wait(500);
        console.log("Awaiting!");
    }
    await wait(100);
} while (!document.getElementsByClassName("facewin").length);
