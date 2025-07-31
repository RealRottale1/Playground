import java.util.*;

public class Shape {
    Integer y; // y position
    Integer x; // x position
    boolean moved;

    Integer yDir = 0; // y dir of movement
    Integer xDir = 0; // x dir of movement
    Integer momentum = 0; // # times they move without slope
    Integer momentumGain = 0; // Amount of momentum gained per slope
    Integer fallGain = 0; // Amount of momentum gained per fall

    public Shape(Integer y, Integer x, Integer s, Integer f) {
        this.y = y;
        this.x = x;
        this.moved = false;
        this.momentumGain = s;
        this.fallGain = f;
    }
}

public class

public class Main {
    public static void display(char[][] board) {
        for (Integer y = 0; y < board.length; y++) {
            for (Integer x = 0; x < board[y].length; x++) {
                System.out.println(board[y][x]);
            }
            System.out.println();
        }
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

        HashMap<Integer, HashMap<Integer, Shape>> nextObjects = new HashMap<Integer, HashMap<Integer, Shape>>();
        HashMap<Integer, HashMap<Integer, Shape>> objects = new HashMap<Integer, HashMap<Integer, Shape>>();

        for (Integer y = 0; y < board.length; y++) {
            for (Integer x = 0; x < board[y].length; x++) {
                if (board[y][x] == '○') {
                    Shape ball = new Shape(y, x, 6, 2);
                    objects.computeIfAbsent(y, t -> new HashMap<Integer, Shape>()).put(x, ball);
                }
            }
        }

        do {
            List<Integer> keys = new ArrayList<Integer>(objects.keySet());
            keys.sort(Comparator.reverseOrder());
            for (Integer y : keys) {
                for (HashMap.Entry<Integer, Shape> entry : objects[y].entrySet()) {
                    Integer x = entry.getKey();
                    Shape object = entry.getValue();

                    // If falling yDir = -1
                    if (y+1 < 7 && board[y+1][x] == ' ') {
                        object.yDir = -1;
                        object.momentum += object.fallGain;
                    }

                    if (momentum == 0) {
                        nextObjects.computeIfAbsent(object.y, t -> new HashMap<Integer, Shape>()).put(object.x, object);

                    };

                    Integer nextY = object.y + object.yDir;
                    Integer nextX = object.x + object.xDir;
                    if (nextX < 0 || nextX > 19) {
                        // Out of bounds
                        object.xDir = 0;
                        nextX = object.x;
                    } else {

                    }
                    char charInPos = board[nextY][nextX];
                    if (charInPos == '◢' || charInPos == '■' || charInPos == '◣') {
                            // Map in way
                            object.momentum = 0;
                            object.yDir = 0;
                            object.xDir = 0;
                            continue;
                        } else if (charInPos == ' ') {
                            object.momentum -= 1;
                            // Nothing in way
                        } else {
                            // Object in way
                        }
                    }
                }
            }
            display(board);
            Thread.sleep(1000);
        } while (true)
    }
}

/* ■ ◢ ◣ ○ □ */

/*
Each ball moves
When ball hits another ball check the X array and calculate the direction of all balls touching. Then shift em.

*/
