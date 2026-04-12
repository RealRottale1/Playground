const mainWindow = document.getElementById("game");
if (!mainWindow) {console.warn("Unable to find [game]!");}
const faceButton = document.getElementById("face");
if (!faceButton) {console.warn("Unable to find [face]!");}

// Side Func
function simulateClick(element, isLeft) {
    const eventParams = {
        bubbles: true,
        cancelable: true,
        view: window,
        button: (isLeft ? 0 : 2),
        buttons: (isLeft ? 1 : 2)
    };
    element.dispatchEvent(new MouseEvent("mousedown", eventParams));
    element.dispatchEvent(new MouseEvent("mouseup", eventParams));
    element.dispatchEvent(new MouseEvent((isLeft ? "click" : "contextmenu"), eventParams));
}
async function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

// Start Up
function getBoardSize() {
    let boardYSize = 0;
    let boardXSize = 0;
    for (let v = 0; v < 2; v++) {
        let count = 0;
        do {
            count++;
            if (!document.getElementById(`${(v ? 1 : count)}_${(v ? count : 1)}`)) {
                break;
            }
        } while (true);
        if (v) {
            boardXSize = count - 1;
        } else {
            boardYSize = count - 1;
        }
    }
    return [boardYSize, boardXSize];
}
const [boardYSize, boardXSize] = getBoardSize();
const board = {};


// Helper Func
function readTileValue(tile) {
    const tileList = tile.classList;
    if (tileList.contains("blank")) {
        return -1;
    } else if (tileList.contains("bombflagged")) {
        return -2;
    } else {
        return parseInt(tileList[1].at(-1), 10);
    }
}
function getNearbyTiles(y, x) {
    const bombTiles = [];
    const unknownTiles = [];
    const knownTiles = [];
    for (let y2 = y - 1; y2 <= y + 1; y2++) {
        if (y2 >= 0 && y2 < boardYSize) {
            for (let x2 = x - 1; x2 <= x + 1; x2++) {
                if (x2 >= 0 && x2 < boardXSize) {
                    if (!(y2 == y && x2 == x)) {
                        const tileData = board[y2][x2][1];;
                        if (tileData == -1) {
                            unknownTiles.push([y2, x2]);
                        } else if (tileData == -2) {
                            bombTiles.push([y2, x2]);
                        } else {
                            knownTiles.push([y2, x2]);
                        }
                    }
                }
            }
        }
    }
    return [bombTiles, unknownTiles, knownTiles];
}
function isSubset(setA, setB) {
    if (setA.length > setB.length) {return false;}
    const bMap = {};
    for (const posB of setB) {
        if (!bMap[posB[0]]) {
            bMap[posB[0]] = new Set();
        }
        bMap[posB[0]].add(posB[1]);
    }
    let subset = true
    for (const posA of setA) {
        if (!bMap[posA[0]]) {subset = false; break;}
        if (!bMap[posA[0]].has(posA[1])) {subset = false; break;}
        if (bMap[posA[0]].size == 1) {
            delete bMap[posA[0]];
        } else {
            bMap[posA[0]].delete(posA[1]);
        }
    }
    return (subset ? bMap : false);
}

// Main Func
function updateBoard() {
    for (let y = 0; y < boardYSize; y++) {
        if (!board[y]) {
            board[y] = {};
        }
        for (let x = 0; x < boardXSize; x++) {
            board[y][x] = [document.getElementById(`${y}_${x}`), null, null, null, null];
            board[y][x][1] = readTileValue(board[y][x][0]);
        }
    }
    for (let y = 0; y < boardYSize; y++) {
        for (let x = 0; x < boardXSize; x++) {
            const [bombTiles, unknownTiles, knownTiles] = getNearbyTiles(y, x);
            board[y][x][2] = bombTiles;
            board[y][x][3] = unknownTiles;
            board[y][x][4] = knownTiles;
        }
    }
}

async function sweepMines() {
    for (let y = 0; y < boardYSize; y++) {
        for (let x = 0; x < boardXSize; x++) {
            const tile = board[y][x];
            if (tile[1] <= 0) {continue;}

            const bombCount = tile[2].length;
            const unknownCount = tile[3].length;
            const knownCount = tile[4].length;

            if (unknownCount == 0) {continue;}
            let clicks = 0;
                
            if (bombCount == tile[1]) {
                for (const pos of tile[3]) {
                    simulateClick(board[pos[0]][pos[1]][0], true);
                    clicks++;
                }
            } else if ((bombCount + unknownCount) == tile[1]) {
                for (const pos of tile[3]) {
                    simulateClick(board[pos[0]][pos[1]][0], false);
                    clicks++;
                }
            }

            if (clicks > 0) {return true;}
        }
    }
    return false;
}

async function sweepMinesSetReduction() {
    for (let yA = 0; yA < boardYSize; yA++) {
        for (let xA = 0; xA < boardXSize; xA++) {
            const tileA = board[yA][xA];
            if (tileA[1] <= 0) {continue;}
            const bombCountA = tileA[2].length;
            const unknownCountA = tileA[3].length;
            const knownCountA = tileA[4].length;
            if (unknownCountA == 0) {continue;}
            const bombsLeftA = tileA[1] - bombCountA;

            for (const posB of tileA[4]) {
                const tileB = board[posB[0]][posB[1]];
                if (tileB[1] <= 0) {continue;}
                const bombCountB = tileB[2].length;
                const unknownCountB = tileB[3].length;
                if (unknownCountB == 0) {continue;}
                const bombsLeftB = tileB[1] - bombCountB;

                const subsetData = isSubset(tileA[3], tileB[3]);
                if (!subsetData) {continue;}

                if (bombsLeftB - bombsLeftA == (unknownCountB - unknownCountA)) {
                    for (const y in subsetData) {
                        for (const x of subsetData[y]) {
                            simulateClick(board[y][x][0], false);
                        }
                    }
                } else if (bombsLeftB - bombsLeftA == 0) {
                    for (const y in subsetData) {
                        for (const x of subsetData[y]) {
                            simulateClick(board[y][x][0], true);
                        }
                    }
                }
            }
        }
    }
}

async function sweepMinesBestGuess() {
    const riskBoard = {};
    for (let y = 0; y < boardYSize; y++) {
        for (let x = 0; x < boardXSize; x++) {
            const tile = board[y][x];
            if (tile[1] <= 0) {continue;}

            const bombCount = tile[2].length;
            const unknownCount = tile[3].length;
            const knownCount = tile[4].length;

            if (unknownCount == 0) {continue;}
            const risk = (tile[1] - bombCount) / unknownCount;
            for (const pos of tile[3]) {
                if (!riskBoard[pos[0]]) {
                    riskBoard[pos[0]] = {};
                    riskBoard[pos[0]][pos[1]] = risk;
                } else {
                    riskBoard[pos[0]][pos[1]] += risk;
                }
            }
        }
    }
    const leastRiskyPiece = [-1, -1];
    let leastRisk = Infinity;
    for (const y in riskBoard) {
        for (const x in riskBoard[y]) {
            const risk = riskBoard[y][x];
            if (risk < leastRisk) {
                leastRisk = risk;
                leastRiskyPiece[0] = y;
                leastRiskyPiece[1] = x;
            }
        }
    }
    if (leastRiskyPiece == -1) {return false;}
    simulateClick(board[leastRiskyPiece[0]][leastRiskyPiece[1]][0], true);
}

// Core
do {
    updateBoard();
    simulateClick(board[Math.floor(boardYSize/2)][Math.floor(boardXSize/2)][0], true);
    await wait(50);
    do {
        updateBoard();
        const sweepPassed = await sweepMines();
        if (!sweepPassed) {
            const setReductionSweepPassed = await sweepMinesSetReduction();
            if (!setReductionSweepPassed) {
                await sweepMinesBestGuess();
            }
        }
        await wait(1);
    } while (!document.getElementsByClassName("facewin").length && !document.getElementsByClassName("facedead").length);
    if (document.getElementsByClassName("facedead").length) {
        console.warn("Awaiting Reset!")
        do {
            await wait(100);
        } while (document.getElementsByClassName("facedead").length);
        await wait(250);
    } else {
        break;
    }
} while (true);
