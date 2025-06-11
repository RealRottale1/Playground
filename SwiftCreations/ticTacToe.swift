


func playGame() -> () {
    let outputBoard = {(gameBoard: [[Character]]) -> () in
        print("  0 1 2");
        for y in 0..<3 {
            print("\(y)", terminator: " ");
            for x in 0..<3 {
                print("\(gameBoard[y][x])", terminator: " ");
            }
            print("");
        }        
    }

    let checkForWinner = {(gameBoard: [[Character]]) -> Character in 
        for v in 0..<3 {
            if gameBoard[v][0] != "_" && gameBoard[v][0] == gameBoard[v][1] && gameBoard[v][1] == gameBoard[v][2] {
                return gameBoard[v][0];
            }
            if gameBoard[0][v] != "_" && gameBoard[0][v] == gameBoard[1][v] && gameBoard[1][v] == gameBoard[2][v] {
                return gameBoard[v][0];
            }
        }
        if gameBoard[0][0] != "_" && gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2] {
            return gameBoard[0][0];
        }
        if gameBoard[0][2] != "_" && gameBoard[0][2] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][0] {
            return gameBoard[0][2];
        }
        for y in 0..<3 {
            for x in 0..<3 {
                if gameBoard[y][x] == "_" {
                    return "P";
                }
            }
        }
        return "D";
    }

    let placeUserPiece = {(userInput: String, gameBoard: inout [[Character]]) -> Bool in 
        if userInput.count == 2 {
            if userInput.allSatisfy{$0.isNumber} {
                let y: Int = (userInput.first!).wholeNumberValue!;
                let x: Int = (userInput[userInput.index(userInput.startIndex, offsetBy: 1)]).wholeNumberValue!;
                if y > -1 && y < 3 && x > -1 && x < 3 {
                    if gameBoard[y][x] == "_" {
                        gameBoard[y][x] = "X";
                        return true;
                    }
                }
            }
        }
        return false;
    }

    let getSelectSpots = {(_ char: Character, gameBoard: [[Character]]) -> [Int: [Int]] in 
        var moves: [Int: [Int]] = [:];
        for h in 0..<2 {
            for i in 0..<3 {
                var emptySpot: Int = -1;
                var xCounter: Int = 0;
                for j in 0..<3 {
                    if h != 0 {
                        if gameBoard[j][i] == char {
                            xCounter += 1;
                        } else if gameBoard[j][i] == "_" {
                            emptySpot = j;
                        }
                        if xCounter == 2 && emptySpot > -1 {
                            moves[emptySpot, default: []].append(i);
                        }
                    } else {
                        if gameBoard[i][j] == char {
                            xCounter += 1;
                        } else if gameBoard[i][j] == "_" {
                            emptySpot = j;
                        }
                        if xCounter == 2 && emptySpot > -1 {
                            moves[i, default: []].append(emptySpot);
                        }
                    }
                }
            }
        }
        for h in 0..<2 {
            var emptyY: Int = -1;
            var emptyX: Int = -1;
            var xCounter: Int = 0;
            for i in 0..<3 {
                let useIndex: Int = (h == 0) ? (2 - i) : i;
                if gameBoard[i][useIndex] == char {
                    xCounter += 1;
                } else if gameBoard[i][useIndex] == "_" {
                    emptyY = i;
                    emptyX = useIndex;
                }
                if xCounter == 2 && emptyY > -1 {
                    moves[emptyY, default: []].append(emptyX);
                }
            }
        }
        return moves;
    }

    let handlePossibleMoves = {(moves: [Int: [Int]], gameBoard: inout [[Character]]) -> Bool in
        var allRows: [Int] = [];
        var index: Int = 0;
        for (key, value) in moves {
            if !value.isEmpty && value[0] >= 0 {
                allRows.append(key);
            }
            index += 1;
        }
        let allRowsCount: Int = allRows.count;
        if allRowsCount != 0 {
            let rRow: Int = Int.random(in: 0..<allRowsCount);
            if let columns = moves[allRows[rRow]] {
                let selectColumnCount: Int = columns.count;
                if selectColumnCount > 0 {
                    let rColumn: Int = Int.random(in: 0..<selectColumnCount);
                    gameBoard[allRows[rRow]][columns[rColumn]] = "O";
                    return true;
                }
            }
        }
        return false;
    }

    let getEmptySpots = {(gameBoard: [[Character]]) -> [Int: [Int]] in 
        var allEmptySpots: [Int: [Int]] = [:];
        for y in 0..<3 {
            for x in 0..<3 {
                if gameBoard[y][x] == "_" {
                    allEmptySpots[y, default: []].append(x);
                }
            }
        }
        return allEmptySpots;
    }

    var gameBoard: [[Character]] = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];

    repeat {
        outputBoard(gameBoard);

        let gameResults: Character = checkForWinner(gameBoard);
        if gameResults != "P" {
            if gameResults == "D" {
                print("Draw");
            } else {
                print("\(gameResults) won the game!");
            }
            break;
        }

        repeat {
            print("Players Move: ");
            if let userInput = readLine() {
                let results: Bool = placeUserPiece(userInput, &gameBoard);
                if results {
                    break;
                }
            }
        } while true;

        let winMoves: [Int: [Int]] = getSelectSpots("O", gameBoard);
        let handledWinMoves: Bool = handlePossibleMoves(winMoves, &gameBoard);
        if !handledWinMoves {
            let blockMoves: [Int: [Int]] = getSelectSpots("X", gameBoard);
            let handledBlockMoves: Bool = handlePossibleMoves(blockMoves, &gameBoard);
            if !handledBlockMoves {
                let emptyMoves: [Int: [Int]] = getEmptySpots(gameBoard);
                handlePossibleMoves(emptyMoves, &gameBoard);
            }
        }
    } while true;
}

func main() -> () {
    repeat {
        playGame();
        print("Play again? (Y/N): ");
        if let userInput = readLine() {
            if userInput.lowercased() == "n" {
                break;
            }
        }
    } while true
}
main();