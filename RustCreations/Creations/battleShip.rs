/*
   !!! This code requires RNG to work !!!
*/
use rand::Rng;

fn handleGame() -> () {
    fn placeBotShips(gameBoard: &mut [[char; 10]; 10]) -> Vec<Vec<[usize; 3]>> {
        fn getShipPositions(
            gameBoard: &[[char; 10]; 10],
            currentShipSize: usize,
            difference: usize,
            y: usize,
        ) -> (Vec<[usize; 2]>, Vec<[usize; 2]>) {
            let mut xy: Vec<[usize; 2]> = Vec::new();
            let mut yx: Vec<[usize; 2]> = Vec::new();
            let endColumn = currentShipSize + difference;
            let startColumn = (endColumn - 1) - (currentShipSize - 1);
            let mut xyInvalid: bool = false;
            let mut yxInvalid: bool = false;
            for x in startColumn..endColumn {
                if xyInvalid && yxInvalid {
                    xy.clear();
                    yx.clear();
                    return (yx, xy);
                } else {
                    if !yxInvalid {
                        if gameBoard[y][x] == '_' {
                            yx.push([y, x]);
                        } else {
                            yxInvalid = true;
                            yx.clear();
                        }
                    }
                    if !xyInvalid {
                        if gameBoard[x][y] == '_' {
                            xy.push([x, y]);
                        } else {
                            xyInvalid = true;
                            xy.clear();
                        }
                    }
                }
            }
            return (yx, xy);
        }

        let shipSizes: [usize; 5] = [5, 4, 3, 3, 2];
        let mut AllShipPlacements: Vec<Vec<[usize; 3]>> = Vec::new();
        for currentShipSize in 0..5 {
            let mut validShipPlacements: Vec<Vec<[usize; 2]>> = Vec::new();
            let possibleSpotCount: usize = 10 - shipSizes[currentShipSize];
            for difference in 0..possibleSpotCount + 1 {
                for y in 0..10 {
                    let (yx, xy): (Vec<[usize; 2]>, Vec<[usize; 2]>) =
                        getShipPositions(&gameBoard, shipSizes[currentShipSize], difference, y);
                    if !yx.is_empty() {
                        validShipPlacements.push(yx);
                    }
                    if !xy.is_empty() {
                        validShipPlacements.push(xy);
                    }
                }
            }

            let mut rng = rand::thread_rng();
            let randomPosition: usize = rng.gen_range(0..validShipPlacements.len());
            let randomPositionLength: usize = validShipPlacements[randomPosition].len();
            let mut shipVector: Vec<[usize; 3]> = Vec::new();
            for i in 0..randomPositionLength {
                let positionData: &[usize; 2] = &validShipPlacements[randomPosition][i];
                gameBoard[positionData[0]][positionData[1]] = 'B';
                shipVector.push([positionData[0], positionData[1], 0]);
            }
            AllShipPlacements.push(shipVector);
        }
        return AllShipPlacements;
    }

    fn displayBoard(&gameBoard: &[[char; 10]; 10]) -> () {
        println!("  0 1 2 3 4 5 6 7 8 9");
        for y in 0..10 {
            print!("{} ", ((b'A' + y as u8) as char));
            for x in 0..10 {
                print!("{} ", gameBoard[y][x]);
            }
            println!("");
        }
    }

    fn getPlayerMove(fireAt: &String) -> (usize, usize) {
        if fireAt.len() == 3 {
            let playerMove: Vec<char> = fireAt.chars().collect();
            if (playerMove[0].is_alphabetic())
                && (playerMove[1].is_digit(10))
                && (('A'..'K').contains(&playerMove[0]))
            {
                let column: usize = playerMove[1].to_digit(10).unwrap() as usize;
                if column < 10 {
                    let row: usize = (playerMove[0] as u8 - b'A') as usize;
                    return (row, column);
                }
            }
        }
        return (10, 0);
    }

    fn handleShoot(
        y: usize,
        x: usize,
        shipBoard: &mut [[char; 10]; 10],
        shootBoard: &mut [[char; 10]; 10],
        ships: &mut Vec<Vec<[usize; 3]>>,
    ) -> usize {
        if shipBoard[y][x] == 'B' {
            let totalShips: usize = ships.len();
            for i in 0..totalShips {
                let mut foundPosition: bool = false;
                let mut notFullyBlownUp: bool = false;
                let currentShipLength: usize = ships[i].len();
                for j in 0..currentShipLength {
                    let sameY: bool = ships[i][j][0] == y;
                    let sameX: bool = ships[i][j][1] == x;
                    if sameY || sameX {
                        if sameY && sameX {
                            foundPosition = true;
                            ships[i][j][2] = 1;
                            shipBoard[ships[i][j][0]][ships[i][j][1]] = 'X';
                            shootBoard[ships[i][j][0]][ships[i][j][1]] = 'X';
                        } else {
                            if ships[i][j][2] == 0 {
                                notFullyBlownUp = true;
                            }
                        }
                    } else {
                        notFullyBlownUp = false;
                        break;
                    }
                }
                if foundPosition {
                    if !notFullyBlownUp {
                        for j in 0..currentShipLength {
                            shipBoard[ships[i][j][0]][ships[i][j][1]] = 'S';
                            shootBoard[ships[i][j][0]][ships[i][j][1]] = 'S';
                        }
                        return 2; // Sunk Ship
                    } else {
                        return 1; // Hit Ship
                    }
                }
            }
        }
        return 0; // Missed
    }

    fn allShipsBlownUp(ships: &Vec<Vec<[usize; 3]>>) -> bool {
        let totalShips: usize = ships.len();
        for i in 0..totalShips {
            let currentShipLength: usize = ships[i].len();
            for j in 0..currentShipLength {
              if ships[i][j][2] == 0 {
                return false;
              }
            }
        }
      return true;
    }

    fn attemptShipPlacement(placeAt: &String, currentShipSize: usize, shipBoard: &mut [[char; 10]; 10]) -> Vec<[usize; 3]> {
      let mut shipParts: Vec<[usize; 3]> = Vec::new();
      if placeAt.len() == 5 {
        let placeAtVector: Vec<char> = placeAt.chars().collect();
        if (placeAtVector[0].is_alphabetic()) && (placeAtVector[2].is_alphabetic()) && (placeAtVector[1].is_digit(10)) &&(placeAtVector[3].is_digit(10)) && (('A'..'K').contains(&placeAtVector[0])) && (('A'..'K').contains(&placeAtVector[2])) {
            let sX: usize = placeAtVector[1].to_digit(10).unwrap() as usize;
            let eX: usize = placeAtVector[3].to_digit(10).unwrap() as usize;
            if (sX < 10) && (eX < 10) {
              let sY: usize = (placeAtVector[0] as u8 - b'A') as usize;
              let eY: usize = (placeAtVector[2] as u8 - b'A') as usize;
              let correctShipSize: bool = if (sX == eX) && (eY >= (currentShipSize - 1)) && ((eY - (currentShipSize - 1)) == sY)  {
                true
              } else if (sY == eY) && (eX >= (currentShipSize - 1)) && ((eX - (currentShipSize - 1)) == sX) {
                true
              } else {
                false
              };
                  if correctShipSize {
                    for y in sY..eY+1 {
                      for x in sX..eX+1 {
                        if shipBoard[y][x] != '_' {
                          println!("Another Ship Intersects That Position!");
                          return shipParts;
                        }
                      }
                    }
                    for y in sY..eY+1 {
                      for x in sX..eX+1 {
                        shipParts.push([y, x, 0]);
                          // Finish here. It aint updating the playerShips Vector thus registering it as no ships.
                        shipBoard[y][x] = 'B';
                      }
                    }
                    println!("Ship Placed!");
                    return shipParts;
                  } else {
                    println!("Invalid Ship Size!");
                  }
            } else {
              println!("Invalid Ship Position!");
            }
        } else {
          println!("Invalid Ship Position!");
        }
      } else {
        println!("Invalid Position Format!");
      }
      return shipParts;
    }

    fn getNeighbors(y: usize, x: usize, shipBoard: &[[char; 10]; 10]) -> Vec<[usize; 2]> {
        let mut neighbors: Vec<[usize; 2]> = Vec::new();
        for i in 0..4 {
            let useY: usize = match i {
                0 => {
                    if y == 0 {
                       10
                    } else {
                      y - 1
                    }
                },
                1 => {
                    if y == 9 {
                        10
                    } else {
                        y + 1
                    }
                }
                _=> y
            };
            let useX: usize = match i {
                2 => {
                    if x == 0 {
                       10
                    } else {
                      x - 1
                    }
                },
                3 => {
                    if x == 9 {
                        10
                    } else {
                        x + 1
                    }
                }
                _=> x
            };
            if (useY == 10) || (useX == 10) {
                continue;
            }

            if shipBoard[useY][useX] == '_' {
                neighbors.push([useY, useX]);
            }
        }
        return neighbors;
    }
  
    let mut playerShipBoard: [[char; 10]; 10] = [['_'; 10]; 10];
    let mut playerShootBoard: [[char; 10]; 10] = [['_'; 10]; 10];
    let mut botShipBoard: [[char; 10]; 10] = [['_'; 10]; 10];
    let mut botShootBoard: [[char; 10]; 10] = [['_'; 10]; 10];
    let mut botShips: Vec<Vec<[usize; 3]>> = placeBotShips(&mut botShipBoard);
    let mut playerShips: Vec<Vec<[usize; 3]>> = Vec::new();
  
    let shipSizes: [usize; 5] = [5, 4, 3, 3, 2];
    let mut placeAt: String = String::new();
    for s in 0..5 {
      let currentShipSize: usize = shipSizes[s];
      loop {
        placeAt.clear();
        println!("-<>-[Player Board]-<>-");
        displayBoard(&playerShipBoard);
        println!("Place {} piece ship from _ to _ (Ex: A2A{}): ", currentShipSize, 2+currentShipSize);
        std::io::stdin()
          .read_line(&mut placeAt)
          .expect("placeAt unable to read line!");
        let results: Vec<[usize; 3]> = attemptShipPlacement(&placeAt, currentShipSize, &mut playerShipBoard);
        if !results.is_empty() {
          playerShips.push(results);
          break;
        }
      }
    }

    let mut winner: usize = 0;
    let mut fireAt: String = String::new();
    while winner == 0 {
        println!("-<>-[Bot Board]-<>-");
        displayBoard(&botShipBoard);
        println!("-<>-[Bot Shoot]-<>-");
        displayBoard(&botShootBoard);
        println!("-<>-[Enemy Board]-<>-");
        displayBoard(&playerShootBoard);
        println!("-<>-[Player Board]-<>-");
        displayBoard(&playerShipBoard);

        loop {
            println!("Fire at: ");
            fireAt.clear();
            std::io::stdin()
                .read_line(&mut fireAt)
                .expect("fireAt unable to read line!");

            let (playerY, playerX): (usize, usize) = getPlayerMove(&fireAt);

            if (playerY != 10) && (playerShootBoard[playerY][playerX] == '_') {
                if botShipBoard[playerY][playerX] == 'B' {
                    let results: usize = handleShoot(
                        playerY,
                        playerX,
                        &mut botShipBoard,
                        &mut playerShootBoard,
                        &mut botShips,
                    );
                    match results {
                        0 => println!("Player Missed!"),
                        1 => println!("Player Hit A Battle Ship!"),
                        2 => {
                            if allShipsBlownUp(&botShips) {
                                println!("Player Sunk All Battle Ships!");
                                winner = 1;
                            } else {
                                println!("Player Sunk A Battle Ship!");
                            }
                        }
                        _ => println!("Invalid Results!"),
                    }
                } else {
                    println!("Player Missed!");
                    playerShootBoard[playerY][playerX] = 'M';
                }
                break;
            } else {
                println!("Invalid position!");
            }
        } // Player Fires

        let mut foundX: bool = false;
        let mut allEmptySpots: Vec<[usize; 2]> = Vec::new();
        'outer: for y in 0..10 {
            for x in 0..10 {
                if botShootBoard[y][x] == 'X' {
                    let nextPossibleMoves: Vec<[usize; 2]> = getNeighbors(y, x, &botShootBoard);
                    if nextPossibleMoves.is_empty() {
                        continue;
                    }
                    let mut rng = rand::thread_rng();
                    let randomIndex: usize = rng.gen_range(0..nextPossibleMoves.len());
                    let results: usize = handleShoot(
                        nextPossibleMoves[randomIndex][0],
                        nextPossibleMoves[randomIndex][1],
                        &mut playerShipBoard,
                        &mut botShootBoard,
                        &mut playerShips,
                    );
                    foundX = true;
                    match results {
                        0 => {
                            println!("Bot Missed!");
                            botShootBoard[nextPossibleMoves[randomIndex][0]][nextPossibleMoves[randomIndex][1]] = 'M';
                        },
                        1 => println!("Bot Hit A Battle Ship!"),
                        2 => {
                            if allShipsBlownUp(&playerShips) {
                                println!("Bot Sunk All Battle Ships!");
                                winner = 1;
                            } else {
                                println!("Bot Sunk A Battle Ship!");
                            }
                        }
                        _ => println!("Invalid Results!"),
                    }
                    break 'outer;
                } else if botShootBoard[y][x] == '_' {
                    allEmptySpots.push([y, x]);
                }
            }
        }
        if !foundX {
            let mut rng = rand::thread_rng();
            let randomIndex: usize = rng.gen_range(0..allEmptySpots.len());
            let results: usize = handleShoot(
                allEmptySpots[randomIndex][0],
                allEmptySpots[randomIndex][1],
                &mut playerShipBoard,
                &mut botShootBoard,
                &mut playerShips,
            );
            match results {
                0 => {
                    println!("Bot Missed!");
                    botShootBoard[allEmptySpots[randomIndex][0]][allEmptySpots[randomIndex][1]] = 'M';
                },
                1 => println!("Bot Hit A Battle Ship!"),
                2 => {
                    if allShipsBlownUp(&playerShips) {
                        println!("Bot Sunk All Battle Ships!");
                        winner = 1;
                    } else {
                        println!("Bot Sunk A Battle Ship!");
                    }
                }
                _ => println!("Invalid Results!"),
            }
        }
    }
}

fn main() -> () {
    let mut playAgain: String = String::new();
    loop {
        handleGame();
        println!("Play Again? (yes or no)");
        std::io::stdin()
            .read_line(&mut playAgain)
            .expect("playAgain unable to read line!");

        if playAgain.trim() == "no" {
            break;
        }
        playAgain.clear();
    }
}
