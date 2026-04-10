const mainWindow = document.getElementById("AreaBlock");
if (!mainWindow) {console.warn("Unable to find [AreaBlock]!");}

// Core Variables
let currentBoard = {};
let currentPieces = {};
let boardXSize = 0;
let boardYSize = 0;



// Setup
function setBoardSize() {
    let xSizeCount = 0;
    // Gets xSize
    do {
        if (mainWindow.childNodes[xSizeCount].id) {
            xSizeCount++;
        } else {
            break;
        }
    } while (true);
    boardXSize = xSizeCount;
    boardYSize = mainWindow.querySelectorAll(".clear").length;
}

function setGamePieces() {
    for (let y = 0; y < boardYSize; y++) {
        currentPieces[y] = [];
        for (let x = 0; x < boardXSize; x++) {
            const piece = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
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
setBoardSize();
setGamePieces();



// Main

//console.log(currentPieces);