use std::collections::HashMap;



fn handleGame() {

    let mut gameBoard: HashMap<u8, [char; 3]> = HashMap::new();
    gameBoard.insert(0, ['_', '_', '_']);
    gameBoard.insert(1, ['_', '_', '_']);
    gameBoard.insert(2, ['_', '_', '_']);
}

fn main() {
    let mut playGame: String = String::new();
    loop {
        //handleGame();
        println!("Play Again? yes/no: ");
        std::io::stdin().read_line(&mut playGame);

        if playGame.trim() != "yes" {
            break;
        }
    }
}