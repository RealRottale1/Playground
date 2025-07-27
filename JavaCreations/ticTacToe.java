import java.util.Scanner;

public class Main {

    public static void outputBoard(char[][] gameBoard) {
        System.out.println("  0 1 2");
        for (int y = 0; y < 3; y++) {
            System.out.print(y + " ");
            for (int x = 0; x < 3; x++) {
                System.out.print(gameBoard[y][x] + " ");
            }
            System.out.println("");
        }
    }

    public static char checkForWinner(char[][] gameBoard) {
        for (int v = 0; v < 3; v++) {
            if (gameBoard[v][0] != '_' && gameBoard[v][0] == gameBoard[v][1] && gameBoard[v][1] == gameBoard[v][2]) {
                return gameBoard[v][0];
            }
            if (gameBoard[0][v] != '_' && gameBoard[0][v] == gameBoard[1][v] && gameBoard[1][v] == gameBoard[2][v]) {
                return gameBoard[0][v];
            }
        }
        if (gameBoard[0][0] != '_' && gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2]) {
            return gameBoard[0][0];
        }
        if (gameBoard[0][2] != '_' && gameBoard[0][2] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][0]) {
            return gameBoard[0][2];
        }
        for (int y = 0; y < 3; y++) {
            for (int x = 0; x < 3; x++) {
                if (gameBoard[y][x] == '_') {
                    return 'P';
                }
            }
        }
        return 'D';
    }

    public static boolean placeUserPiece(String userInput,char[][] gameBoard) {
        if (userInput.length() == 2) {
            if (userInput.matches("\\d+")) {
                int y = Character.getNumericValue(userInput.charAt(0));
                int x = Character.getNumericValue(userInput.charAt(1));
                if (y > -1 && y < 3 && x > -1 && x < 3) {
                    if (gameBoard[y][x] == '_') {
                        gameBoard[y][x] = 'X';
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static void playGame() {
        char[][] gameBoard = {{'_','_','_'}, {'_','_','_'}, {'_','_','_'}};

        do {
            outputBoard(gameBoard);
            char gameResults = checkForWinner(gameBoard);
            if (gameResults != 'P') {
                if gameResults == 'D' {
                    System.out.prinln("Draw");
                } else {
                    System.out.println(gameResults + " won the game!");
                }
                break;
            }

            Scanner scanner = new Scanner(System.in);
            do {
                System.out.println("Players move: ");
                String userInput = scanner.nextLine();
                boolean results = placeUserPiece(userInput, gameBoard);
                if results {
                    break;
                }
            } while true;

            // Continue from here :)
        } while true;
    }

    public static void main(String[] args) {
        do {
            playGame();
        } while true;
    }
}