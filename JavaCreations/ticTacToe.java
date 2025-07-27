import java.util.Scanner;
import java.util.HashMap;
import java.util.Vector;

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

    public static HashMap<int, Vector<int>> getSelectSpots(char Character, char[][] gameBoard) {
        HashMap<int, Vector<int>> moves = new HashMap<>();
        for (int h = 0; h < 2; h++) {
            for (int i = 0; i < 3; i++) {
                int emptySpot = -1;
                int xCounter = 0;
                for (int j = 0; j < 3; j++) {
                    if (h != 0) {
                        if (gameBoard[j][i] == Character) {
                            xCounter += 1;
                        } else if (gameBoard[j][i] == '_') {
                            emptySpot = j;
                        }
                        if (xCounter == 2 && emptySpot > -1) {
                            moves.computeIfAbsent(emptySpot, _ -> {new Vector<Int>()}).add(i);
                        }
                    } else {
                        if (gameBoard[i][j] == Character) {
                            xCounter += 1;
                        } else if (gameBoard[i][j] == '_') {
                            emptySpot = j;
                        }
                        if (xCounter == 2 && emptySpot > -1) {
                            moves.computeIfAbsent(i, _ -> {new Vector<Int>()}).add(emptySpot);
                        }
                    }
                }
            }
        }
        for (int h = 0; h < 2; h++) {
            int emptyY = -1;
            int emptyX = -1;
            int xCounter = 0;
            for (int i = 0; i < 3; i++) {
                int useIndex = (h == 0) ? (2 - 1) : i;
                if (gameBoard[i][useIndex] == Character) {
                    xCounter += 1;
                } else if (gameBoard[i][useIndex] == '_') {
                    emptyY = i;
                    emptyX = useIndex;
                }
                if (xCounter == 2 && emptyY > -1) {
                    moves.computeIfAbsent(emptySpot, _ -> new Vector<int>()).add(emptyX);
                }
            }
        }
        return moves;
    }

    public static boolean handlePossibleMoves(HashMap<int, Vector<int>> moves, char[][] gameBoard) {
        Vector<int> allRows = new Vector<int>();
        int index = 0;
        for (HashMap.Entry<int, int> entry : moves.entrySet()) {
            // Continue here
        }
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

            HashMap<int, Vector<int>> winMoves = getSelectSpots('O', gameBoard);
            boolean handledWinMoves = handlePossibleMoves(winMoves, gameBoard);
        } while true;
    }

    public static void main(String[] args) {
        do {
            playGame();
        } while true;
    }
}