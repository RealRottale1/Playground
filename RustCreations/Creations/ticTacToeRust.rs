
fn ticTacToeGame() -> () {
  fn handleGame() -> () {
    fn outputGameBoard(gameBoard: &[[char; 3]; 3]) -> () {
        println!("  0 1 2");
        for i in 0..3 {
            print!("{} ", i);
            for j in 0..3 {
                print!("{} ", gameBoard[i][j]);
            }
            println!("");
        }
    }

    fn getEmptySpots(gameBoard: &[[char; 3]; 3]) -> HashMap<usize, Vec<usize>> {
        let mut moves: HashMap<usize, Vec<usize>> = HashMap::new();
        for i in 0..3 {
            let mut madeEntry: bool = false;
            for j in 0..3 {
                if gameBoard[i][j] == '_' {
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

    fn getSelectSpots(character: char, gameBoard: &[[char; 3]; 3]) -> HashMap<usize, Vec<usize>> {
        let mut moves: HashMap<usize, Vec<usize>> = HashMap::new();
        for h in 0..2 {
            for i in 0..3 {
                let mut emptySpot: usize = 99;
                let mut xCounter: u8 = 0;
                for j in 0..3 {
                    if h != 0 {
                        if gameBoard[j][i] == character {
                            xCounter += 1;
                        } else if gameBoard[j][i] == '_' {
                            emptySpot = j;
                        }
                        if (xCounter == 2) && (emptySpot != 99) {
                            if let Some(entry) = moves.get_mut(&emptySpot) {
                                entry.push(i);
                            } else {
                                moves.insert(emptySpot, vec![i]);
                            }
                        }
                    } else {
                        if gameBoard[i][j] == character {
                            xCounter += 1;
                        } else if gameBoard[i][j] == '_' {
                            emptySpot = j;
                        }
                        if (xCounter == 2) && (emptySpot != 99) {
                            moves.insert(i, vec![emptySpot]);
                        }
                    }
                }
            }
        }
        for h in 0..2 {
            let mut emptyRow: usize = 99;
            let mut emptyColumn: usize = 99;
            let mut xCounter: u8 = 0;
            for i in 0..3 {
                let useIndex: usize = if h != 0 { i } else { 2 - i };
                if gameBoard[i][useIndex] == character {
                    xCounter += 1;
                } else if gameBoard[i][useIndex] == '_' {
                    emptyRow = i;
                    emptyColumn = useIndex;
                }
                if (xCounter == 2) && (emptyRow != 99) {
                    if let Some(entry) = moves.get_mut(&i) {
                        entry.push(emptyColumn);
                    } else {
                        moves.insert(emptyRow, vec![emptyColumn]);
                    }
                }
            }
        }
        return moves;
    }

    fn invalidMove(playerMove: &String, gameBoard: &mut [[char; 3]; 3]) -> bool {
        if playerMove.len() == 3 {
            let playerMoveVector: Vec<char> = playerMove.chars().collect();
            if (playerMoveVector[0].is_ascii_digit()) && (playerMoveVector[1].is_ascii_digit()) {
                if (playerMoveVector[0] >= '0')
                    && (playerMoveVector[0] <= '2')
                    && (playerMoveVector[1] >= '0')
                    && (playerMoveVector[1] <= '2')
                {
                    let row: usize = playerMoveVector[0].to_digit(10).unwrap() as usize;
                    let column: usize = playerMoveVector[1].to_digit(10).unwrap() as usize;
                    if gameBoard[row][column] == '_' {
                        gameBoard[row][column] = 'X';
                        return false;
                    }
                }
            }
        }
        return true;
    }

    fn handlePossibleMoves(moves: &HashMap<usize, Vec<usize>>,gameBoard: &mut [[char; 3]; 3]) -> bool {
        let mut allRows: Vec<usize> = Vec::new();
        let mut index: usize = 0;
        for (key, data) in moves {
            if !data.is_empty() {
                allRows.push(*key);
            }
            index += 1;
        }
        if allRows.len() > 0 {
            let mut rng = rand::thread_rng();
            let randomRow: usize = rng.gen_range(0..allRows.len());
            let selectedRowLength: usize = moves[&allRows[randomRow]].len();
            if selectedRowLength > 0 {
                let randomColumn: usize = rng.gen_range(0..selectedRowLength);
                gameBoard[allRows[randomRow]][moves[&allRows[randomRow]][randomColumn]] = 'O';
                return true;
            }
        }
        return false;
    }

    fn checkForWinner(gameBoard: &[[char; 3]; 3]) -> char {
        for i in 0..3 {
            if (gameBoard[i][0] != '_')
                && (gameBoard[i][0] == gameBoard[i][1])
                && (gameBoard[i][1] == gameBoard[i][2])
            {
                return gameBoard[i][0];
            }
            if (gameBoard[0][i] != '_')
                && (gameBoard[0][i] == gameBoard[1][i])
                && (gameBoard[1][i] == gameBoard[2][i])
            {
                return gameBoard[0][i];
            }
        }
        if (gameBoard[0][0] != '_')
            && (gameBoard[0][0] == gameBoard[1][1])
            && (gameBoard[1][1] == gameBoard[2][2])
        {
            return gameBoard[0][0];
        }
        if (gameBoard[0][2] != '_')
            && (gameBoard[0][2] == gameBoard[1][1])
            && (gameBoard[1][1] == gameBoard[2][0])
        {
            return gameBoard[0][2];
        }
        for i in 0..3 {
            for j in 0..3 {
                if gameBoard[i][j] == '_' {
                    return 'P';
                }
            }
        }
        return 'D';
    }

    fn debugMoves(moves: &HashMap<usize, Vec<usize>>) -> () {
        for i in 0..3 {
            println!("Row: {}", i);
            if let Some(entry) = moves.get(&i) {
                let entryLength = entry.len();
                for j in 0..entryLength {
                    print!("{}", entry[j]);
                }
                println!("");
            }
        }
    }

    let mut gameBoard: [[char; 3]; 3] = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']];

    loop {
        outputGameBoard(&gameBoard);

        let gameResults: char = checkForWinner(&gameBoard);
        if gameResults != 'P' {
            if gameResults == 'D' {
                println!("Draw");
            } else {
                println!("{} won the game!", gameResults);
            }
            break;
        }

        let mut playerMove: String = String::new();
        loop {
            println!("Player Move: ");
            std::io::stdin()
                .read_line(&mut playerMove)
                .expect("Unable to read player move!");
            if !invalidMove(&playerMove, &mut gameBoard) {
                break;
            } else {
                playerMove.clear();
            }
        }

        let winMoves: HashMap<usize, Vec<usize>> = getSelectSpots('O', &gameBoard);
        let handledWinMoves: bool = handlePossibleMoves(&winMoves, &mut gameBoard);
        if !handledWinMoves {
            let blockMoves: HashMap<usize, Vec<usize>> = getSelectSpots('X', &gameBoard);
            let handledBlockMoves: bool = handlePossibleMoves(&blockMoves, &mut gameBoard);
            if !handledBlockMoves {
                let emptyMoves: HashMap<usize, Vec<usize>> = getEmptySpots(&gameBoard);
                let handledEmptyMoves = handlePossibleMoves(&emptyMoves, &mut gameBoard);
            }
        }
    }
  }

  let mut playGame: String = String::new();
  loop {
      handleGame();

      println!("Play again? (yes or no)");

      std::io::stdin()
          .read_line(&mut playGame)
          .expect("Failed to read line");

      if playGame == "no" {
          break;
      } else {
          playGame.clear();
      }
  }
}

// Ported from backup Replit version because original was corrupted for some reason (merged with 2048 code)