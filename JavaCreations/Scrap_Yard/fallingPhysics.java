import java.util.*;

class Shape {
    Integer y; // y position
    Integer x; // x position
    boolean moved;

    Integer yDir = 0; // y dir of movement
    Integer xDir = 0; // x dir of movement
    Integer momentum = 0;

    public Shape(Integer y, Integer x) {
        this.y = y;
        this.x = x;
        this.moved = false;
    }
}

public class Main {
    public static void display(char[][] board) {
        for (Integer y = 0; y < board.length; y++) {
            for (Integer x = 0; x < board[y].length; x++) {
                System.out.print(board[y][x]);
            }
            System.out.println();
        }
    }

    public static char[][] cloneBoard(char[][] board) {
        char[][] clone = new char[board.length][];
        for (int i = 0; i < board.length; i++) {
            clone[i] = Arrays.copyOf(board[i], board[i].length);
        }
        return clone;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'■',' ',' ',' ',' ',' ',' ','○',' ',' ', '○','○',' ',' ',' ',' ',' ',' ',' ','■'},
            {' ',' ',' ',' ',' ',' ',' ','○',' ',' ', ' ',' ',' ',' ',' ',' ',' ',' ',' ',' '},
            {'○',' ',' ',' ',' ',' ',' ',' ',' ',' ', '◣',' ',' ',' ',' ',' ',' ',' ',' ',' '},
            {' ',' ',' ',' ',' ',' ',' ','◢',' ',' ', ' ',' ',' ',' ',' ',' ',' ',' ',' ',' '},
            {' ',' ',' ',' ',' ',' ','◢','■',' ',' ', ' ',' ',' ',' ',' ',' ',' ',' ',' ',' '},
            {'◣',' ',' ',' ','◣',' ',' ',' ',' ',' ', ' ',' ',' ',' ',' ',' ',' ',' ',' ',' '},
            {'■','◣',' ','◢','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■'},
            {'■','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■','■'},
        };
        Integer boardY = board.length;
        Integer boardX = board[0].length;

        Set<Shape> objects = new HashSet<Shape>();

        for (Integer y = 0; y < boardY; y++) {
            for (Integer x = 0; x < boardX; x++) {
                if (board[y][x] == '○') {
                    Shape ball = new Shape(y, x);
                    objects.add(ball);
                }
            }
        }

        do {
            char[][] clonedBoard = cloneBoard(board);
            do {
                for (Shape object : objects) {
                    // Checks if in air
                    boolean inAir = false;
                    if (object.y+1 < board.length && board[object.y+1][object.x] == ' ') {
                        object.yDir = 1;
                        object.momentum += 3;
                        inAir = true;
                    }

                    if (object.momentum == 0) {
                        continue;
                    }

                    Integer nextY = object.y + object.yDir;
                    Integer nextX = object.x + object.xDir;

                    // Checks if y in range
                    if (nextY >= boardY) {
                        nextY = object.y;
                    }

                    // Checks if x in range
                    if (nextX < 0 || nextX > boardX) {
                        nextX = object.x;
                        object.xDir = 0;
                    }
                    System.out.println(nextY + "," + nextX);
                    char charInPos = board[nextY][nextX];
                    if (charInPos == '■') {
                        object.momentum -= 1;
                        object.yDir = 0;
                        if (object.xDir != 0 && object.yDir == 0) {
                            object.xDir = 0;
                            object.momentum = 0;
                        }
                    } else if (charInPos == '◢') {
                        if (object.xDir == 0 || object.xDir == 1) {
                            if (object.x-1 > -1) {
                                object.xDir = -1;
                                if (object.xDir == 0) {
                                    object.momentum += 3;
                                } else {
                                    object.momentum -= 1;
                                }
                            }
                        } else {
                            object.xDir = 1;
                            object.momentum -= 1;
                        }
                    } else if (charInPos == '◣') {
                        if (object.xDir == 0 || object.xDir == -1) {
                            if (object.x+1 < boardX) {
                                object.xDir = 1;
                                if (object.xDir == 0) {
                                    object.momentum += 3;
                                } else {
                                    object.momentum -= 1;
                                }
                            }
                        } else {
                            object.xDir = -1;
                            object.momentum -= 1;
                        }
                    } else if (charInPos == ' ') {
                        if (!inAir) {
                            object.momentum -= 1;
                        }
                        clonedBoard[object.y][object.x] = ' ';
                        object.y = nextY;
                        object.x = nextX;
                        clonedBoard[object.y][object.x] = '○';
                    } else {
                        
                    }


                }
                break;
            } while (true);
            board = clonedBoard;
            display(board);
            try {
                Thread.sleep(1000); // waits 1000 milliseconds = 1 second
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } while (true);
    }
}

/* ■ ◢ ◣ ○ □ */

/*
Each ball moves
When ball hits another ball check the X array and calculate the direction of all balls touching. Then shift em.

*/
