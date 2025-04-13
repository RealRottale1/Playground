extern crate rand;
use std::collections::HashMap;
use rand::Rng;


fn handleGame() {

    fn outputGameBoard(gameBoard: &HashMap<u8, [char; 3]>) {
        println!("  0 1 2");
        for i in 0u8..3 {
            print!("{} ", i);
            for j in 0u8..3 {
                print!("{} ", gameBoard[&i][j as usize]);
            }
        }
        println!(" ");
    }

    fn getEmptySpots(gameBoard: &HashMap<u8, [char; 3]>) -> HashMap<u8, Vec<u8>> {
        let mut moves: HashMap<u8, Vec<u8>> = HashMap::new();
        for i in 0u8..3 {
            let mut madeEntry: bool = false;
            for j in 0u8..3 {
                if gameBoard[&i][j as usize] == '_' {
                    if !madeEntry {
                        moves.insert(i, vec![j]);
                        madeEntry = true;
                    } else {
                        if let Some(entry) = moves.get_mut(&i) {
                            entry.push(j);
                        }
                    }
                }
            }
        }
        return moves;
    }

    fn getSelectSpots(character: char, gameBoard: &mut HashMap<u8, [char; 3]>) -> HashMap<u8, Vec<u8>> {
        let mut moves: HashMap<u8, Vec<u8>> = HashMap::new();
        for h in 0u8..2 {
            for i in 0u8..3 {
                let mut emptySpot: u8 = 3;
                let mut xCounter: u8 = 0;
                for j in 0u8..3 {
                    if h == 0 {
                        if gameBoard[&j][i as usize] == character {
                            xCounter += 1;
                        } else if gameBoard[&j][i as usize] == '_' {
                            emptySpot = j;
                        }
                        if (xCounter == 2) && (emptySpot < 3) {
                            if moves.contains_key(&emptySpot) {
                                if let Some(entry) = moves.get_mut(&emptySpot) {
                                    entry.push(i);
                                }
                            } else {
                                moves.insert(emptySpot, vec![i]);
                            }
                        }
                    } else {
                        if gameBoard[&i][j as usize] == character {
                            xCounter += 1;
                        } else if gameBoard[&i][j as usize] == '_' {
                            emptySpot = j;
                        }
                        if (xCounter == 2) && (emptySpot < 3) {
                            moves.insert(i, vec![emptySpot]);
                        }
                    }
                }
            }
        }
        for h in 0u8..2 {
            let mut emptyRow: u8 = 3;
            let mut emptyColumn: u8 = 3;
            let mut xCounter: u8 = 0;
            for i in 0u8..3 {
                let useIndex: u8 = if h == 0 {i} else {2-i};
                if gameBoard[&i][useIndex as usize] == character {
                    xCounter += 1;
                } else if gameBoard[&i][useIndex  as usize] == '_' {
                    emptyRow = i;
                    emptyColumn = useIndex;
                }
                if (xCounter == 2) && (emptyRow < 3) {
                    if moves.contains_key(&i) {
                        if let Some(entry) = moves.get_mut(&emptyRow) {
                            entry.push(emptyColumn);
                        }
                    } else {
                        moves.insert(emptyRow, vec![emptyColumn]);
                    }
                }
            }
        }
        return moves;
    }

    fn invalidMove(playerMove: &str, gameBoard: &mut HashMap<u8, [char; 3]>) -> bool {
        if playerMove.len() == 2 {
            let firstChar: char = playerMove.chars().nth(0).unwrap();
            let lastChar: char = playerMove.chars().nth(1).unwrap();
            if (firstChar.is_digit(10)) && (lastChar.is_digit(10)) {
                let row: u8 = firstChar as u8 - 48;
                let column: u8 = lastChar as u8 - 48;
                if (row >= 0) && (row <= 2) && (column >= 0) && (column <= 2) {
                    if let Some(entry) = gameBoard.get_mut(&row) {
                        if entry[column as usize] == '_' {
                            entry[column as usize] = 'X';
                        }
                        return false;
                    }
                }
            }
        }
        return true;
    }

    fn handlePossibleMoves(moves: &HashMap<u8, Vec<u8>>, gameBoard: &HashMap<u8, [char; 3]>) -> bool {
        let mut allRows: Vec<u8>;
        let mut index: u8 = 0;
        for (key, value) in moves {
            if (value.is_empty()) && (value[0] >= 0) {
                allRows.push(index);
            }
            index += 1;
        }

        if allRows.len() > 0 {
            let mut rng = rand::thread_rng();
            let randomRow: u8 = rng.gen_range(0..allRows.len());
            if moves[allRows[randomRow]].len() > 0 {
                let randomColumn: u8 = rng.gen_range(0..moves[allRows[randomRow]].len());
                gameBoard[allRows[randomRow]][moves[allRows[randomRow]][randomColumn]] = 'O';
                return true;
            }
        }
        return false;
    }

    
    fn checkForWinner(gameBoard: &HashMap<u8, [char; 3]>) -> char {
        for i in 0u8..3 {
            if (gameBoard[&i][0] != '_') && (gameBoard[&i][0] == gameBoard[&i][1]) && (gameBoard[&i][1] == gameBoard[&i][2]) {
                return gameBoard[&i][0];
            }
            if (gameBoard[&0][i as usize] != '_') && (gameBoard[&0][i as usize] == gameBoard[&1][i as usize]) && (gameBoard[&1][i as usize] == gameBoard[&2][i as usize]) {
                return gameBoard[&0][i as usize];
            }
        }

        if (gameBoard[&0][0] != '_') && (gameBoard[&0][0] == gameBoard[&1][1]) && (gameBoard[&1][1] == gameBoard[&2][2]) {
            return gameBoard[&0][0];
        }
        if (gameBoard[&0][2] != '_') && (gameBoard[&0][2] == gameBoard[&1][1]) && (gameBoard[&1][1] == gameBoard[&2][0]) {
            return gameBoard[&0][2];
        }

        for i in 0u8..3 {
            for j in 0u8..3 {
                if gameBoard[&i][j as usize] == '_' {
                    return 'P';
                }
            }
        }
        return 'D';
    }

    let mut gameBoard: HashMap<u8, [char; 3]> = HashMap::new();
    gameBoard.insert(0, ['_', '_', '_']);
    gameBoard.insert(1, ['_', '_', '_']);
    gameBoard.insert(2, ['_', '_', '_']);

    loop {
        outputGameBoard(&mut gameBoard);

        let gameResults: char = checkForWinner(&mut gameBoard);
        if gameResults != 'P' {
            if gameResults == 'D' {
                println!("Draw!");
            } else {
                println!("{} won the game!", gameResults);
            }
            break;
        }

        let mut playerMove: String = String::new();
        loop {
            print!("Player Move: ");
            std::io::stdin().read_line(&mut playerMove);
            if !invalidMove(playerMove.trim(), &mut gameBoard) {
                break;
            }
        }

        let mut winMoves: HashMap<u8, Vec<u8>> = getSelectSpots('O', &mut gameBoard);

        let handledWinMoves: bool = handlePossibleMoves(&mut winMoves, &mut gameBoard);

        if !handledWinMoves {
            let mut blockMoves: HashMap<u8, Vec<u8>> = getSelectSpots('X',&mut gameBoard);
            
            let handledBlockMoves: bool = handlePossibleMoves(&mut blockMoves,&mut gameBoard);
            
            if !handledBlockMoves {
                let mut emptyMoves: HashMap<u8, Vec<u8>> = getEmptySpots(&mut gameBoard);
                let handledEmptyMoves: bool = handlePossibleMoves(&mut emptyMoves,&mut gameBoard);
            }
        }
    }
}

fn main() {
    let mut playGame: String = String::new();
    loop {
        handleGame();
        print!("Play Again? yes/no: ");
        std::io::stdin().read_line(&mut playGame);

        if playGame.trim() != "yes" {
            break;
        }
    }
}