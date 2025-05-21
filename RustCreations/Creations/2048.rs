/*
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