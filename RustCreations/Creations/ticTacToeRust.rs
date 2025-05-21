/*
   !!! This code requires RNG to work !!!
*/
use rand::Rng;
use std::collections::HashMap;

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
            }/*
   !!! This code requires RNG to work !!!
*/
use rand::Rng;

fn playGame() -> () {
  fn displayBoard(gameBoard: &[[usize; 4]; 4]) -> () {
    println!("+----+----+----+----+");
    for rowData in gameBoard {
      print!("|");
      for data in rowData {
        if *data == 0 {
          print!("    |");
        } else {
          print!("{}{}|", *data, if *data > 9 {if *data > 99 {if *data > 999 {""} else {" "}} else {"  "}} else {"   "});
        }
      }
      println!("\n+----+----+----+----+");
    }
  }

  fn spawnPieceRandomly(value: usize, gameBoard: &mut [[usize; 4]; 4]) -> bool {
    let mut emptySpots: Vec<[usize; 2]> = Vec::new();
    for y in 0..4 {
      for x in 0..4 {
        if gameBoard[y][x] == 0 {
          emptySpots.push([y, x]);
        }
      }
    }
    if !emptySpots.is_empty() {
      let mut rng = rand::thread_rng();
      let randomSpot: usize = rng.gen_range(0..emptySpots.len());
      gameBoard[emptySpots[randomSpot][0]][emptySpots[randomSpot][1]] = value;
      return true;
    }
    return false;
  }

  fn hasAllDifferentNeighbors(y: usize, x: usize, gameBoard: &mut [[usize; 4]; 4]) -> bool {
    let myType: usize = gameBoard[y][x];
    let iY = y as isize;
    let iX = x as isize;
    let neighborPositions: [[isize; 2]; 4] = [[iY - 1, iX],[iY + 1, iX], [iY, iX - 1], [iY, iX + 1]];
    for i in 0..4 {
      if (neighborPositions[i][0] > -1) && (neighborPositions[i][1] > -1) && (neighborPositions[i][0] < 4) && (neighborPositions[i][1] < 4) {
        if gameBoard[neighborPositions[i][0] as usize][neighborPositions[i][1] as usize] == myType {
          return false;
        }
      }
    }
    return true;
  }

  fn shiftPieces(key: char, gameBoard: &mut [[usize; 4]; 4], score: &mut usize) -> usize {
    let mut boardChanged: bool = false;
    let mut xDirection: i32 = 0;
    let mut yDirection: i32 = 0;
    match key {
      'A' => {
        xDirection = -1;
      },
      'D' => {
        xDirection = 1;
      },
      'W' => {
        yDirection = -1;
      }
      _ => {
        yDirection = 1;
      }
    }
    for i in 0..4 {
      for j in 0..4 {
        for k in (1..j+1).rev() {
          let changeInYDir: bool = yDirection != 0;
          let changeInXDir: bool = xDirection != 0;
          let useK: usize = if (yDirection == 1) || (xDirection == 1) {3 - k} else {k};
          let useY: usize = if changeInYDir {useK} else {i};
          let useX: usize = if changeInXDir {useK} else {i};
          let prevY: usize = if changeInYDir {if yDirection == -1 {useK - 1} else {useK + 1}} else {i};
          let prevX: usize = if changeInXDir {if xDirection == -1 {useK - 1} else {useK + 1}} else {i};
          if gameBoard[useY][useX] == gameBoard[prevY][prevX] {
            gameBoard[prevY][prevX] += gameBoard[prevY][prevX];
            *score += gameBoard[prevY][prevX];
            gameBoard[useY][useX] = 0;
            boardChanged = true;
          } else if gameBoard[prevY][prevX] == 0 {
            gameBoard[prevY][prevX] = gameBoard[useY][useX];
            gameBoard[useY][useX] = 0;
            boardChanged = true;
          }
        }
      }
    }
    if boardChanged {
      let mut rng = rand::thread_rng();
      let numberPercent: usize = rng.gen_range(0..10);
      let ableToSpawn: bool = spawnPieceRandomly(if numberPercent == 0 {4} else {2}, gameBoard);
      for y in 0..4 {
        for x in 0..4 {
          if gameBoard[y][x] == 2048 {
            return 1;
          }
        }
      }
    }
    let mut noMoreMoves: bool = true;
    for y in 0..4 {
      for x in 0..4 {
        let results: bool = hasAllDifferentNeighbors(y, x, gameBoard);
        if !results {
          noMoreMoves = false;
          break;
        }
      }
      if !noMoreMoves {
        break;
      }
    }
    if noMoreMoves {
      return 2;
    }
    return 0;
  }

  let mut score: usize = 0;
  let mut gameBoard: [[usize; 4]; 4] = [[0; 4]; 4];
  spawnPieceRandomly(2, &mut gameBoard);
  spawnPieceRandomly(2, &mut gameBoard);
  let mut playerMove: String = String::new();
  loop {
    println!("Score: {}", score);
    displayBoard(&gameBoard);
    loop {
      println!("Move:");
      std::io::stdin()
        .read_line(&mut playerMove)
        .expect("Unable to read line!");
      playerMove = playerMove.trim().to_string().to_uppercase();
      if (playerMove == "W") || (playerMove == "A") || (playerMove == "S") || (playerMove == "D") {
        let endGame: usize = shiftPieces(playerMove.chars().next().unwrap(), &mut gameBoard, &mut score);
        if endGame != 0 {
          println!("Score: {}", score);
          displayBoard(&gameBoard);
          if endGame == 2 {
            println!("You lost!");
          } else {
            println!("You won!");
          }
          return;
        }
        playerMove.clear();
        break;
      } else {
        println!("Invalid input!");
        playerMove.clear();
      }
    }
  }
}

fn main() -> () {
  playGame();
  println!("Play again?");
  let mut quitGame: String = String::new();
  loop {
    std::io::stdin()
      .read_line(&mut quitGame)
      .expect("Unable to read line!");
    if quitGame.trim() == "yes" {
      break;
    }
    quitGame.clear();
  }
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

fn main() -> () {
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