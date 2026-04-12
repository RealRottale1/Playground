const mainWindow = document.getElementById("game");
if (!mainWindow) {console.warn("Unable to find [game]!");}
const faceButton = document.getElementById("face");
if (!faceButton) {console.warn("Unable to find [face]!");}

// Core Variables
let currentPieces = {};

const boardXSize = 10;
const boardYSize = 10;



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

function getNeighborData(y, x) {
    const nearbyMineNumbers = [];
    let possibleMineSpots = 0;
    let knownMineSpots = 0;
    for (let i = 0; i < currentPieces[y][x][1].length; i++) {
        const tileResult = getTile(currentPieces[y][x][1][i][0], currentPieces[y][x][1][i][1]);
        if (tileResult == 'b') {knownMineSpots++;}
        if (tileResult == '_') {possibleMineSpots++;}
        nearbyMineNumbers.push(tileResult);
    }
    return [nearbyMineNumbers, possibleMineSpots, knownMineSpots];
}

async function sweepMines() {
    let clicks = 0;
    for (let y = 0; y < boardYSize; y++) {
        for (let x = 0; x < boardXSize; x++) {
            if (currentPieces[y][x]) {
                const nearbyMines = getMineNumber(y, x);
                if (nearbyMines == 0) {continue;}

                const [nearbyMineNumbers, possibleMineSpots, knownMineSpots] = getNeighborData(y, x);

                if (possibleMineSpots == 0) {continue;}
                let localClicks = 0;

                if (knownMineSpots == nearbyMines) {
                    for (let i = 0; i < currentPieces[y][x][1].length; i++) {
                        if (nearbyMineNumbers[i] == '_') {
                            const targetTile = currentPieces[currentPieces[y][x][1][i][0]][currentPieces[y][x][1][i][1]][0];
                            simulateClick(targetTile, false);
                            localClicks++;
                        }
                    }
                } else if ((knownMineSpots + possibleMineSpots) == nearbyMines) {
                    for (let i = 0; i < currentPieces[y][x][1].length; i++) {
                        if (nearbyMineNumbers[i] == '_') {
                            const targetTile = currentPieces[currentPieces[y][x][1][i][0]][currentPieces[y][x][1][i][1]][0];
                            simulateClick(targetTile, true);
                            localClicks++;
                        }
                    }
                }

                // Pattern Recognition
                if (localClicks == 0 && nearbyMines == 2 && !knownMineSpots) {
                    // Horizontal 1 2 1 check
                    if ((x - 1 >= 0 && x + 1 < boardXSize)) {
                        if (getMineNumber(y, x-1) == 1 && getMineNumber(y, x+1) == 1) {
                            const leftTile = currentPieces[y][x-1][0];
                            const rightTile = currentPieces[y][x+1][0];
                            for (const yDir of [-1, 1]) {
                                const nY = y + yDir;
                                if (nY >= 0 && nY < boardYSize) {
                                    if (getTile(nY, x) == '_') {
                                        console.log("Used special move")
                                        simulateClick(currentPieces[nY][x][0], false);
                                        localClicks++;
                                    }
                                }
                            }
                        }
                    }
                    if ((y - 1 >= 0 && y + 1 < boardYSize)) {
                        if (getMineNumber(y, y-1) == 1 && getMineNumber(y, y+1) == 1) {
                            const upTile = currentPieces[y-1][x][0];
                            const downTile = currentPieces[y+1][x][0];
                            for (const xDir of [-1, 1]) {
                                const nX = x + xDir;
                                if (nX >= 0 && nX < boardXSize) {
                                    if (getTile(y, nX) == '_') {
                                        console.log("Used special move")
                                        simulateClick(currentPieces[y][nX][0], false);
                                        localClicks++;
                                    }
                                }
                            }
                        }
                    }
                }

                clicks += localClicks;
            }
        }
    }
    return clicks;
}

async function heavySweepMines() {
    let currentPiecesRisk = {};
    for (let y = 0; y < boardYSize; y++) {
        for (let x = 0; x < boardXSize; x++) {
            if (currentPieces[y][x]) {
                const nearbyMines = getMineNumber(y, x);
                if (nearbyMines == 0) {continue;}

                const [nearbyMineNumbers, possibleMineSpots, knownMineSpots] = getNeighborData(y, x);
            
                if (possibleMineSpots == 0) {continue;}
                const risk = (nearbyMines - knownMineSpots) / possibleMineSpots;
                for (let i = 0; i < currentPieces[y][x][1].length; i++) {
                    if (nearbyMineNumbers[i] == '_') {
                        const neighborPiece = currentPieces[y][x][1][i];
                        const neighborY = neighborPiece[0];
                        const neighborX = neighborPiece[1]
                        if (!currentPiecesRisk[neighborY]) {
                            currentPiecesRisk[neighborY] = {};
                        }
                        if (!currentPiecesRisk[neighborY][neighborX]) {
                            currentPiecesRisk[neighborY][neighborX] = risk;
                        } else {
                            currentPiecesRisk[neighborY][neighborX] += risk;
                        }
                    }
                }
            }
        }
    }
    
    const leastRiskyPiece = [-1 ,-1];
    let leastRisk = Infinity;
    for (const y in currentPiecesRisk) {
        for (const x in currentPiecesRisk[y]) {
            const risk = currentPiecesRisk[y][x];
            if (risk < leastRisk) {
                leastRiskyPiece[0] = y;
                leastRiskyPiece[1] = x;
                leastRisk = risk;
            }
        }
    }
    if (leastRiskyPiece[0] == -1) {return false;}
    const targetTile = currentPieces[leastRiskyPiece[0]][leastRiskyPiece[1]][0];
    simulateClick(targetTile, false);
}

do {
    setGamePieces();
    simulateClick(currentPieces[Math.floor(boardYSize/2)][Math.floor(boardXSize/2)][0], false);
    do {
        const clicks = await sweepMines();
        if (clicks == 0) {
            heavySweepMines();
        }
        await wait(100);
    } while (!document.getElementsByClassName("facewin").length && !document.getElementsByClassName("facedead").length);
    if (document.getElementsByClassName("facedead").length) {
        console.warn("Awaiting Reset!")
        do {
            await wait(100);
        } while (document.getElementsByClassName("facedead").length);
        await wait(1000);
    } else {
        break;
    }
} while (true);