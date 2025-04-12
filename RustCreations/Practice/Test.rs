use std::collections::HashMap;



fn handleGame() {

    fn outputGameBoard(gameBoard: &HashMap<u8, [char; 3]>) {
        println!("  0 1 2");
        for i: u8 in 0..3 {
            print!("{} ", i);
            for j: u8 in 0..3 {
                print!("{} ", gameBoard[i][j]);
            }
        }
        println!(" ");
    }

    fn checkForWinner(gameBoard: &HashMap<u8, [char; 3]>) {
        for i: u8 in 0..3 {
            if (gameBoard[i][0] != '_') && (gameBoard[i][0] == gameBoard[i][1]) && (gameBoard[i][1] == gameBoard[i][2]) {
                return gameBoard[i][0];
            }
            if (gameBoard[0][i] != '_') && (gameBoard[0][i] == gameBoard[1][i]) && (gameBoard[1][i] == gameBoard[2][i]) {
                return gameBoard[0][i];
            }
        }

        if (gameBoard[0][0] != '_') && (gameBoard[0][0] == gameBoard[1][1]) && (gameBoard[1][1] == gameBoard[2][2]) {
            return gameBoard[0][0];
        }
        if (gameBoard[0][2] != '_') && (gameBoard[0][2] == gameBoard[1][1]) && (gameBoard[1][1] == gameBoard[2][0]) {
            return gameBoard[0][2];
        }

        for i: u8 in 0..3 {
            for j: u8 in 0..3 {
                if gameBoard[i][j] == '_' {
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
        outputGameBoard(gameBoard);

        const gameResults: char = checkForWinner(gameBoard);
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
            if !invalidMove(playerMove.trim(), gameBoard) {
                break;
            }
        }
    }
}

fn main() {
    let mut playGame: String = String::new();
    loop {
        //handleGame();
        print!("Play Again? yes/no: ");
        std::io::stdin().read_line(&mut playGame);

        if playGame.trim() != "yes" {
            break;
        }
    }
}