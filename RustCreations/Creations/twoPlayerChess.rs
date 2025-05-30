#[derive(Copy, Clone, Debug)]
struct PieceStruct {
    color: bool,
    pieceType: i8,
}

fn playGame() -> () {
    fn matchPiece(color: bool, pieceType: i8) -> char {
        match (color, pieceType) {
            (false, 1) => '♙',
            (true, 1) => '♟',
            (false, 2) => '♘',
            (true, 2) => '♞',
            (false, 3) => '♗',
            (true, 3) => '♝',
            (false, 4) => '♖',
            (true, 4) => '♜',
            (false, 5) => '♕',
            (true, 5) => '♛',
            (false, 6) => '♔',
            (true, 6) => '♚',
            _ => '_',
        }
    }

    fn displayBoard(gameBoard: &[[Option<PieceStruct>; 8]; 8]) -> () {
        println!("   A B C D E F G H");
        println!(" /-----------------\\");
        for y in 0..8 {
            print!("{}| ", y);
            for x in 0..8 {
                match gameBoard[y][x] {
                    Some(piece) => {
                        print!("{} ", matchPiece(piece.color, piece.pieceType))
                    }
                    _ => {
                        print!("  ")
                    }
                }
            }
            print!("|{}", y);
            println!("");
        }
        println!(" \\-----------------/");
        println!("   A B C D E F G H");
    }

    let mut gameBoard: [[Option<PieceStruct>; 8]; 8] = [[None; 8]; 8];
    let specialRow: [i8; 8] = [4, 2, 3, 5, 6, 3, 2, 4];

    for i in 0..2 {
        let row: usize = if i == 0 { 0 } else { 7 };
        for j in 0..8 {
            gameBoard[row][j] = Some(PieceStruct {
                color: row == 7,
                pieceType: specialRow[j],
            });
        }
    }
    for i in 0..2 {
        let row: usize = if i == 0 { 1 } else { 6 };
        for j in 0..8 {
            gameBoard[row][j] = Some(PieceStruct {
                color: row == 6,
                pieceType: 1,
            });
        }
    }
    for y in 2..6 {
        for x in 0..8 {
            gameBoard[y][x] = Some(PieceStruct {
                color: false,
                pieceType: 0,
            });
        }
    }

    fn isLegalMove( sY: isize, sX: isize, eY: isize, eX: isize, gameBoard: &[[Option<PieceStruct>; 8]; 8],) -> bool {
        //println!("Data sY:{}, sX:{}, eY:{}, eX:{}", sY,sX,eY,eX);
        fn lineCheck(sY: isize, sX: isize, eY: isize, eX: isize, gameBoard: &[[Option<PieceStruct>; 8]; 8]) -> bool {
            let length: isize = if (eX - sX).abs() == 0 {(eY - sY).abs()} else {(eX - sX).abs()};
            let xChange: isize = (eX - sX)/length;
            let yChange: isize = (eY - sY)/length;
            for i in 1..length {
                if sY + yChange * i < 0 || sY + yChange * i > 7 || sX + xChange * i < 0 || sX + xChange * i > 7 {
                    break;
                }
                if gameBoard[(sY + yChange * i) as usize][(sX + xChange * i) as usize].is_some() {
                    if gameBoard[(sY + yChange * i) as usize][(sX + xChange * i) as usize].unwrap().pieceType != 0 {
                        return false;
                    }
                }
            }
            return true;
        }
        let startPiece: Option<PieceStruct> = gameBoard[sY as usize][sX as usize];
        let endPiece: Option<PieceStruct> = gameBoard[eY as usize][eX as usize];
        if (startPiece.is_some()) && (endPiece.is_some()) {
            let startWhite: bool = startPiece.unwrap().color;
            let startPieceType: i8 = startPiece.unwrap().pieceType;
            let endWhite: bool = endPiece.unwrap().color;
            let endPieceType: i8 = endPiece.unwrap().pieceType;
            if (startPieceType == 0) || ((startWhite == endWhite) && endPieceType != 0) {
                return false;
            }
            match startPieceType {
                1 => {
                    let yDistance: isize = (eY - sY).abs();
                    let xDistance: isize = (eX - sX).abs();
                    //println!("Distance: Y:{}, X:{}", yDistance, xDistance);
                    if yDistance == 2 && xDistance == 0 {
                        if (startWhite && sY == 6 && sY > eY) || (!startWhite && sY == 1 && eY > sY) {
                            if gameBoard[(sY + if startWhite {-1} else {1}) as usize][sX as usize].is_some() {
                                return gameBoard[(sY + if startWhite {-1} else {1}) as usize][sX as usize].unwrap().pieceType == 0;
                            }
                        } else {
                            return false;
                        }
                    } else if yDistance == 1 && (xDistance == 1 || xDistance == 0) {
                        if (xDistance == 0 && endPieceType == 0) || (xDistance == 1 && endPieceType != 0) {
                            return (startWhite && (sY > eY)) || (!startWhite && (eY > sY)); 
                        }
                    } else {
                        return false;
                    }
                }
                2 => {
                    return ((sY + 2 == eY) && ((sX + 1 == eX) || (sX - 1 == eX)))
                        || ((sY - 2 == eY) && ((sX + 1 == eX) || (sX - 1 == eX)))
                        || ((sX + 2 == eX) && ((sY + 1 == eY) || (sY - 1 == eY)))
                        || ((sX - 2 == eX) && ((sY + 1 == eY) || (sY - 1 == eY)));
                }
                3 => {
                    return if (eY - sY).abs() == (eX - sX).abs() {lineCheck(sY, sX, eY, eX, &gameBoard)} else {false};
                }
                4 => {
                    return if ((sX == eX) && (sY != eY)) || ((sX != eX) && (sY == eY)) {lineCheck(sY, sX, eY, eX, &gameBoard)} else {false};
                }
                5 => {
                    return if ((sX == eX) && (sY != eY)) || ((sX != eX) && (sY == eY)) || (eY - sY).abs() == (eX - sX).abs() {lineCheck(sY, sX, eY, eX, &gameBoard)} else {false};
                }
                6 => {
                    return (eY - sY).abs() == 1 || (eX - sX).abs() == 1;
                }
                _ => {
                    return false;
                }
            }
        }
        return false;
    }

    fn getKingPosition(color: bool, gameBoard: &[[Option<PieceStruct>; 8]; 8]) -> [usize; 2] {
        for y in 0..8 {
            for x in 0..8 {
                if gameBoard[y][x].is_some() {
                    if gameBoard[y][x].unwrap().pieceType == 6 {
                        if gameBoard[y][x].unwrap().color == color {
                            return [y, x];
                        }
                    }
                }
            }
        }
        return [9, 9];
    }

    fn inCheck(isWhite: bool, kingPosition: &[usize; 2], gameBoard: &[[Option<PieceStruct>; 8]; 8]) -> bool {
        for y in 0..8 {
            for x in 0..8 {
                if gameBoard[y][x].is_some() {
                    if gameBoard[y][x].unwrap().color != isWhite && gameBoard[y][x].unwrap().pieceType != 0 {
                        //println!("PIECE TYPE: {}",gameBoard[y][x].unwrap().pieceType);
                        if isLegalMove(y as isize, x as isize, kingPosition[0] as isize, kingPosition[1] as isize, &gameBoard) {
                            //println!("Check Y:{}, X:{}, KY:{}, KX:{}",y,x,kingPosition[0],kingPosition[1]);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    fn getAllPossibleMoves(y: isize, x: isize, isWhite: bool, pieceType: i8, gameBoard: &[[Option<PieceStruct>; 8]; 8]) -> Vec<[usize; 2]> {
        fn bishopMoves(y: isize, x: isize, allMoves: &mut Vec<[isize; 2]>) -> () {
            let disFromBottom: isize = 7 - y;
            let disFromRight: isize = 7 - x;
            let allQuarterLengths: [isize; 4] = [
                if y >= disFromRight {disFromRight} else {y},
                if y >= x {x} else {y},
                if disFromBottom >= x {x} else {disFromBottom},
                if disFromBottom >= disFromRight {disFromRight} else {disFromBottom}
            ];
            for i in 0..2 {
                for j in 0..2 {
                    for k in 1..allQuarterLengths[(i*2+j) as usize]+1 {
                        let yDiff: isize = y + 1*k * (i*-2+1);
                        let xDiff: isize = x + 1*k * (j*-2+1);
                    }
                }
            }
        }
        fn rookMoves(y: isize, x: isize, allMoves: &mut Vec<[isize; 2]>) -> () {
            let allQuarterLengths: [isize; 4] = [7 - x, y, x, 7 - y];
            for i in 0..2 {
                for j in 0..2 {
                    for k in 1..allQuarterLengths[(i*2+j) as usize]+1 {
                        let yDiff: isize = y + (1*k) * (j) * (i*2 - 1);
                        let xDiff: isize = x + (1*k) * (1-j) * (i*-2 + 1);
                        //println!("yDiff: {}, xDiff: {}, Key: {}",yDiff,xDiff, (i*2+j));
                        allMoves.push([yDiff, xDiff]);
                    }
                }
            }
        }
        let mut allMoves: Vec<[isize; 2]> = Vec::new();
        match pieceType {
            1 => {
                let colorDiff: isize = if isWhite {1} else {-1};
                let yOneUp: isize = y + 1 * colorDiff;
                let yTwoUp: isize = y + 2 * colorDiff;
                let xLeft: isize = x - 1;
                let xRight: isize = x + 1;
                let yOneUpInRange: bool = yOneUp < 8 && yOneUp > -1;
                if yOneUpInRange {allMoves.push([yOneUp, x]);};
                if yTwoUp < 8 && yTwoUp > -1 {allMoves.push([yTwoUp, x]);};
                if yOneUpInRange && xRight < 8 && xRight > -1 {allMoves.push([yOneUp, xRight]);};
                if yOneUpInRange && xLeft < 8 && xLeft > -1 {allMoves.push([yOneUp, xLeft]);};
            },
            2 => {
                //println!("START HERE: y: {}, x: {}",y,x);
                for k in 0..2 {
                    for j in 0..2 {
                        for i in 0..2 {
                            let yDiff: isize = y + (2 - i) * (k*2 - 1);
                            let xDiff: isize = x + (1 + i) * (j*2 - 1);
                            //println!("HERE: yDiff: {}, xDiff: {}",yDiff,xDiff);
                            if yDiff < 8 && yDiff > -1 && xDiff < 8 && xDiff > -1 {
                                allMoves.push([yDiff, xDiff]);
                            }
                        }
                    }
                }
            },
            3 => {
                bishopMoves(y, x, &mut allMoves);
            },
            4 => {
                rookMoves(y, x, &mut allMoves);
            },
            5 => {
                bishopMoves(y, x, &mut allMoves);
                rookMoves(y, x, &mut allMoves);
            },
            6 => {
                let yUp: isize = y + 1;
                let yDown: isize = y - 1;
                let xRight: isize = x + 1;
                let xLeft: isize = x - 1;
                let rightInRange: bool = xRight < 8 && xRight > -1;
                let leftInRange: bool = xLeft < 8 && xLeft > -1;
                let upInRange: bool = yUp < 8 && yUp > -1;
                let downInRange: bool = yDown < 8 && yDown > -1;
                if rightInRange                {allMoves.push([y, xRight]);};
                if rightInRange && upInRange   {allMoves.push([yUp, xRight]);};
                if upInRange                   {allMoves.push([yUp, x]);};
                if upInRange && leftInRange    {allMoves.push([yUp, xLeft]);};
                if leftInRange                 {allMoves.push([y, xLeft]);};
                if leftInRange && downInRange  {allMoves.push([yDown, xLeft]);};
                if downInRange                 {allMoves.push([yDown, x]);};
                if downInRange && rightInRange {allMoves.push([yDown, xRight]);};
            }
            _ => {}
        }
        //println!("PIECETYPE: {}",pieceType);
        let mut allValidMoves: Vec<[usize; 2]> = Vec::new();
        for position in allMoves {
            if isLegalMove(y, x, position[0], position[1], &gameBoard) {
                allValidMoves.push([position[0] as usize, position[1] as usize]);
            }
        }
        return allValidMoves;
    }

    fn allMovesLeadToCheck(isWhite: bool, gameBoard: &mut [[Option<PieceStruct>; 8]; 8]) -> bool {
        for y in 0..8 {
            for x in 0..8 {
                if gameBoard[y][x].is_some() {
                    if gameBoard[y][x].unwrap().color == isWhite {
                        let startPoint: &Option<PieceStruct> = &gameBoard[y][x];
                        if startPoint.is_none() {
                            continue;
                        }
                        let startWhite: bool = startPoint.unwrap().color;
                        let startPieceType: i8 = startPoint.unwrap().pieceType;
                        
                        let allPossibleMoves: Vec<[usize; 2]> = getAllPossibleMoves(y as isize, x as isize, gameBoard[y][x].unwrap().color, gameBoard[y][x].unwrap().pieceType, &gameBoard);
                        let allPossibleMovesLength: usize = allPossibleMoves.len();
                        for i in 0..allPossibleMovesLength {
                            let endPoint: &Option<PieceStruct> = &gameBoard[allPossibleMoves[i][0]][allPossibleMoves[i][1]];
                            if endPoint.is_none() {
                                continue;
                            }
                            let endWhite: bool = endPoint.unwrap().color;
                            let endPieceType: i8 = endPoint.unwrap().pieceType;

                            if let Some(endPiece) = gameBoard[allPossibleMoves[i][0]][allPossibleMoves[i][1]].as_mut() {
                                endPiece.color = startWhite;
                                endPiece.pieceType = startPieceType;
                            }
                            if let Some(startPiece) = gameBoard[y][x].as_mut() {
                                startPiece.color = false;
                                startPiece.pieceType = 0;
                            }
                            let kingPosition: [usize; 2] = getKingPosition(startWhite, &gameBoard);
                            let stillInCheck: bool = inCheck(startWhite, &kingPosition, &gameBoard);
                            if let Some(endPiece) = gameBoard[allPossibleMoves[i][0]][allPossibleMoves[i][1]].as_mut() {
                                endPiece.color = endWhite;
                                endPiece.pieceType = endPieceType;
                            }
                            if let Some(startPiece) = gameBoard[y][x].as_mut() {
                                startPiece.color = startWhite;
                                startPiece.pieceType = startPieceType;
                            }
                            if !stillInCheck {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        
        return true;
    }
    
    fn handlePlayerMove(isWhite: bool, gameBoard: &mut [[Option<PieceStruct>; 8]; 8]) -> () {
        let mut playerMove: String = String::new();
        loop {
            println!("|---[{}]---|", if isWhite {"Whites Turn"} else {"Blacks Turn"});
            std::io::stdin()
                .read_line(&mut playerMove)
                .expect("Unable to read line!");

            if playerMove.len() == 5 {
                let moveParts: Vec<char> = playerMove.to_lowercase().trim().chars().collect();
                if moveParts[0].is_alphabetic() && moveParts[1].is_ascii_digit() && moveParts[2].is_alphabetic() && moveParts[3].is_ascii_digit() {
                    let startColumn: usize = (moveParts[0] as u8 - b'a') as usize;
                    let startRow: usize = moveParts[1] as usize - 48;
                    let endColumn: usize = (moveParts[2] as u8 - b'a') as usize;
                    let endRow: usize = moveParts[3] as usize - 48;
                    //println!("HERE SY:{}, SX:{}, EY:{}, EX:{}", startRow, startColumn, endRow, endColumn);
                    if (startColumn >= 0 && startColumn <= 7) && (endColumn >= 0 && endColumn <= 7) && (startRow >= 0 && startRow <= 7) && (endRow >= 0 && endRow <= 7) {
                        if (startColumn != endColumn) || (startRow != endRow) {
                            let startPieceData: &Option<PieceStruct> = &gameBoard[startRow][startColumn];
                            if startPieceData.is_some() {
                                if startPieceData.unwrap().color == isWhite {
                                    let results: bool = isLegalMove(startRow as isize, startColumn as isize, endRow as isize, endColumn as isize, gameBoard);
                                    if results {
                                        let endPieceData: &Option<PieceStruct> = &gameBoard[endRow][endColumn];
                                        if endPieceData.is_some() {
                                            let startColor: bool = startPieceData.unwrap().color;
                                            let endColor: bool = endPieceData.unwrap().color;
                                            let startPieceType: i8 = startPieceData.unwrap().pieceType;
                                            let endPieceType: i8 = endPieceData.unwrap().pieceType;
                                            if let Some(endPosition) = gameBoard[endRow][endColumn].as_mut() {
                                                endPosition.color = startColor;
                                                endPosition.pieceType = startPieceType;
                                            }
                                            if let Some(startPosition) = gameBoard[startRow][startColumn].as_mut() {
                                                startPosition.color = false;
                                                startPosition.pieceType = 0;
                                            }
                                            let kingPosition: [usize; 2] = getKingPosition(isWhite, &gameBoard);
                                            if inCheck(isWhite, &kingPosition, &gameBoard) {
                                                if let Some(endPosition) = gameBoard[endRow][endColumn].as_mut() {
                                                    endPosition.color = endColor;
                                                    endPosition.pieceType = endPieceType;
                                                }
                                                if let Some(startPosition) = gameBoard[startRow][startColumn].as_mut() {
                                                    startPosition.color = startColor;
                                                    startPosition.pieceType = startPieceType;
                                                }
                                            } else {
                                                return;
                                            }
                                        }
                                    } else {
                                        println!("Piece movement violates rules of movement!");
                                    }
                                } else {
                                    println!("Moving piece must be {}!", if isWhite {"white"} else {"black"});
                                }
                            }
                        } else {
                            println!("Piece must change position!");
                        }
                    } else {
                        println!("Piece movement out of bounds!");
                    }
                } else {
                    println!("Invalid piece movemen!");
                }
            } else {
                println!("Invalid piece movement format! Ex C2C3");
            }
            playerMove.clear();
        }
    }

    loop {
        for i in 0..2 {
            displayBoard(&gameBoard);

            let isWhite: bool = if i == 0 {true} else {false};
            
            handlePlayerMove(isWhite, &mut gameBoard);

            let kingPosition: [usize; 2] = getKingPosition(!isWhite, &gameBoard);
            //println!("KING POSITION: y: {}, x: {}",kingPosition[0],kingPosition[1]);
            let isInCheck: bool = inCheck(!isWhite, &kingPosition, &gameBoard);
            //println!("In Check = {}", isInCheck);
            if isInCheck {
                if allMovesLeadToCheck(!isWhite, &mut gameBoard) {
                    println!("Checkmate!");
                    return;
                }
            } else {
                if allMovesLeadToCheck(!isWhite, &mut gameBoard) {
                    println!("Stalemate!");
                    return;
                }
            }
        }
    }
}

fn main() -> () {
    let mut playAgain: String = String::new();
    loop {
        playGame();
        std::io::stdin()
            .read_line(&mut playAgain)
            .expect("Unable to read line!");
        if playAgain.to_lowercase().trim() == "no" {
            break;
        }
        playAgain.clear();
    }
}
