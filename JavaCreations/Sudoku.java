//SUDOKU
// Imports
import java.util.Collections;
import java.util.*;

public class Main {
  // Changable variables
  public static int MaxRetries = 30;
  public static String EmptyChar = "_";

  // Gets numbers that can't be used
  public static List<Integer> GetUnusableNums(Map<String, List<String>> ABoard, int Y, int X) {
    List<Integer> UsedNumbers = new ArrayList<Integer>();

    // Handles rows
    for (int i = 0; i < 9; i++) {
      if (ABoard.get(String.valueOf(Y)) != null && !ABoard.get(String.valueOf(Y)).get(i).equals(" ")) {
        UsedNumbers.add(UsedNumbers.size(), Integer.valueOf(ABoard.get(String.valueOf(Y)).get(i)));
      }
    }

    // Handles columns
    int CorrectX = X % 3;
    for (int Chunk = 0; Chunk < 3; Chunk++) {
      int CorrectGridRow = Y % 3; // 0,1,2 based on position on 3 by 3 grid
      for (int i = 0; i < 3; i++) {
        int UseGridRow = CorrectGridRow + i * 3;
        if (ABoard.get(String.valueOf(UseGridRow)) != null
            && !ABoard.get(String.valueOf(UseGridRow)).get(CorrectX).equals(" ")) {
          UsedNumbers.add(UsedNumbers.size(), Integer.valueOf(ABoard.get(String.valueOf(UseGridRow)).get(CorrectX)));
        }
      }
      CorrectX += 3;
    }

    // if (ABoard.get(String.valueOf(i)) != null &&
    // !ABoard.get(String.valueOf(i)).get(X).equals(" ")) {
    // UsedNumbers.add(UsedNumbers.size(),
    // Integer.valueOf(ABoard.get(String.valueOf(i)).get(X)));
    // }

    /*
     * // Handles absolute y=x
     * for (int i = 0; i < Y; i++) {
     * int DistanceFromY = (Y-i);
     * int XPlus = X + (1*DistanceFromY);
     * int XMinus = X + (-1*DistanceFromY);
     * if (XPlus < 9) {
     * if (!ABoard.get(String.valueOf(i)).get(XPlus).equals(" ")) {
     * UsedNumbers.add(UsedNumbers.size(),
     * Integer.valueOf(ABoard.get(String.valueOf(i)).get(XPlus)));
     * }
     * }
     * if (XMinus > -1) {
     * if (!ABoard.get(String.valueOf(i)).get(XMinus).equals(" ")) {
     * UsedNumbers.add(UsedNumbers.size(),
     * Integer.valueOf(ABoard.get(String.valueOf(i)).get(XMinus)));
     * }
     * }
     * }
     * 
     * // Handles absolute y=-x
     * for (int i = 1; i < 9-Y; i++) {
     * int XPlus = X + (1*i);
     * int XMinus = X + (-1*i);
     * if (XPlus < 9) {
     * if (!ABoard.get(String.valueOf(Y+i)).get(XPlus).equals(" ")) {
     * UsedNumbers.add(UsedNumbers.size(),
     * Integer.valueOf(ABoard.get(String.valueOf(Y+i)).get(XPlus)));
     * }
     * }
     * if (XMinus > -1) {
     * if (!ABoard.get(String.valueOf(Y+i)).get(XMinus).equals(" ")) {
     * UsedNumbers.add(UsedNumbers.size(),
     * Integer.valueOf(ABoard.get(String.valueOf(Y+i)).get(XMinus)));
     * }
     * }
     * }
     */

    // Handles chunk
    int YChunk = Y / 3;
    int XChunk = X / 3;
    for (int yi = YChunk * 3; yi < YChunk * 3 + 3; yi++) {
      for (int xi = XChunk * 3; xi < XChunk * 3 + 3; xi++) {
        if (!ABoard.get(String.valueOf(yi)).get(xi).equals(" ")) {
          UsedNumbers.add(UsedNumbers.size(), Integer.valueOf(ABoard.get(String.valueOf(yi)).get(xi)));
        }
      }
    }

    return UsedNumbers;
  }

  public static Map<String, List<String>> MakeEmptyBoard() {
    Map<String, List<String>> ABoard = new LinkedHashMap<String, List<String>>();

    // Fills board with empty spaces
    for (int i = 0; i < 9; i++) {
      List<String> Chunk = new ArrayList<String>();
      for (int Pieces = 0; Pieces < 9; Pieces++) {
        Chunk.add(Pieces, " ");
      }
      ABoard.put(String.valueOf(i), Chunk);
    }
    return ABoard;
  }

  // Makes the answer board
  public static Map<String, List<String>> MakeAnswerBoard() {
    // Creates board
    Map<String, List<String>> ABoard = MakeEmptyBoard();

    // Randomly creates the first row
    Random random = new Random();

    do {
      int Retries = 0;

      // Generates first row
      for (int row = 0; row < 9; row++) {
        List<Integer> PossibleNumbers = new ArrayList<Integer>(Arrays.asList(0, 1, 2, 3, 4, 5, 6, 7, 8));
        for (int i = 0; i < 9; i++) {
          int randIndex = random.nextInt(PossibleNumbers.size());
          int randNumber = PossibleNumbers.get(randIndex);
          ABoard.get("0").set(i, String.valueOf(randNumber));
        }
      }

      for (int row = 0; row < 9; row++) {
        int CorrectAmount = 0;
        do {
          if (Retries >= MaxRetries) {
            break;
          }
          CorrectAmount = 0;
          for (int i = 0; i < 9; i++) {
            // Setup + Gets unusable numbers
            List<Integer> PossibleNumbers = new ArrayList<Integer>(Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9));
            List<Integer> UsedNumbers = GetUnusableNums(ABoard, row, i);
            // System.out.println("GetUnusableNums:"+UsedNumbers);
            Collections.shuffle(PossibleNumbers);
            int SelectedNumber = -1;
            int Index = 0;
            // Gets usable number
            do {
              SelectedNumber = PossibleNumbers.get(Index);
              if (Index < PossibleNumbers.size()) {
                Index += 1;
                if (Index >= 9) {
                  SelectedNumber = -2;
                }
              }
            } while (SelectedNumber == -1 || UsedNumbers.contains(SelectedNumber));
            ABoard.get(String.valueOf(row)).set(i, String.valueOf(SelectedNumber));

            if (SelectedNumber == -2) {
              for (int r = 0; r < 9; r++) {
                ABoard.get(String.valueOf(row)).set(r, " ");
              }
              Retries += 1;
              break;
            } else {
              CorrectAmount += 1;
            }
          }
        } while (CorrectAmount < 9);
      }
      if (Retries < MaxRetries) {
        break;
      } else {
        ABoard = MakeEmptyBoard();
      }
    } while (true);

    return ABoard;
  }

  public static Map<String, List<String>> MakeClone(Map<String, List<String>> UseBoard) {
    Map<String, List<String>> ClonedBoard = new LinkedHashMap<String, List<String>>();
    for (Map.Entry<String, List<String>> RowPair : UseBoard.entrySet()) {
      List<String> Row = new ArrayList<String>();
      for (String Piece : RowPair.getValue()) {
        Row.add(Piece);
      }
      ClonedBoard.put(RowPair.getKey(), Row);
    }
    return ClonedBoard;
  }

  public static void PrintBoard(String[] Axis ,Map<String, List<String>> ClonedBoard, Map<String, List<String>> UserBoard) {
    System.out.print("#  A B C   D E F   G H I");
    System.out.println(" ");
    int AxisIndex = 0;
    for (int boxes = 0; boxes < 3; boxes++) {
      System.out.println(" +-------+-------+-------+");
      for (int i = 0; i < 3; i++) {
        System.out.print(Axis[AxisIndex] + "|");
        int StartAt = boxes * 3; // Min Row use
        int EndAt = boxes * 3 + 3; // Max Row use
        for (int j = StartAt; j < EndAt; j++) {
          int DataStart = i * 3;
          for (int iter = 0; iter < 3; iter++) {
            ArrayList<String> Bold = new ArrayList<String>(Arrays.asList("", ""));
            if (ClonedBoard.get(String.valueOf(j)).get(DataStart + iter).equals("_")) {
              Bold.set(0, "\033[1m");
              Bold.set(1, "\033[0m");
            }
            System.out
                .print(" " + Bold.get(0) + UserBoard.get(String.valueOf(j)).get(DataStart + iter) + Bold.get(1));
          }
          System.out.print(" |");

        }
        System.out.println(" ");
        AxisIndex += 1;
      }
    }
    System.out.println(" +-------+-------+-------+");
  }

  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    do {
      Boolean DebugMode = false;
      // Makes AnswerBoard
      Map<String, List<String>> AnswerBoard = MakeAnswerBoard();

      // Clones AnswerBoard
      Map<String, List<String>> ClonedBoard = MakeClone(AnswerBoard);

      // Prepares AnswerBoard for playing
      Random random = new Random();
      for (int RowNum = 0; RowNum < 9; RowNum++) {
        int MaxKeep = random.nextInt(5, 7);
        List<Integer> GridSize = new ArrayList<Integer>(Arrays.asList(0, 1, 2, 3, 4, 5, 6, 7, 8));
        for (int i = 0; i < MaxKeep; i++) {
          int randIndex = random.nextInt(0, GridSize.size());
          GridSize.remove(randIndex);
        }
        for (int i = 0; i < 9; i++) {
          if (GridSize.contains(i)) {
            ClonedBoard.get(String.valueOf(RowNum)).set(i, EmptyChar);
          }
        }
      }
      Map<String, List<String>> UserBoard = MakeClone(ClonedBoard);

      // Instructions
      System.out.println(
          "Welcome to Sudoku!\nArrange the numbers 1-9 in each row, column, and chunk so that each row and column has only one accurance of each number.\n");

      // Game loop
      Boolean IsSolved = false;
      do {
        // Prints board
         String[] Axis = { "A", "B", "C", "D", "E", "F", "G", "H", "I" };
        if (DebugMode) {
          PrintBoard(Axis, ClonedBoard, AnswerBoard);
        }
        PrintBoard(Axis, ClonedBoard, UserBoard);
        
        if (IsSolved) {
          break;
        }
        // Handles input
        System.out.print("Input:");
        String Command = scanner.nextLine();
        String[] CommandParts = Command.split(" ");
        if (CommandParts.length == 2) {
          String[] XYPosition = CommandParts[0].split("");
          if (Arrays.asList(Axis).contains(XYPosition[0]) && Arrays.asList(Axis).contains(XYPosition[1])) {
            if (CommandParts[1].length() == 1 && (CommandParts[1].matches("[1-9]") || CommandParts[1].equals("_") )) {
              int Row = Arrays.asList(Axis).indexOf(XYPosition[0]);
              int Column = Arrays.asList(Axis).indexOf(XYPosition[1]);

              int TrueRow = Row / 3;
              int TrueColumn = Column / 3;
              int UseRowIndex = (TrueRow * 3) + TrueColumn;
              int UseIndex = ((Row % 3) * 3 + (Column % 3));
              if (ClonedBoard.get(String.valueOf(UseRowIndex)).get(UseIndex).equals("_")) {
                UserBoard.get(String.valueOf(UseRowIndex)).set(UseIndex, CommandParts[1]);
              } else {
                System.out.println("The location you inputed is already given!");
              }
            } else {
              System.out.println("Invalid number/empty!");
            }
          } else {
            System.out.println("Invalid XY position!");
          }
        } else {
          System.out.println("Invalid input!");
        }
        if (Command.toLowerCase().equals("debug")) {
          DebugMode = true;
        }

        IsSolved = true;
        for (int RowNum = 0; RowNum < 9; RowNum++) {
          for (int i = 0; i < 9; i++) {
            if (!AnswerBoard.get(String.valueOf(RowNum)).get(i).equals(UserBoard.get(String.valueOf(RowNum)).get(i))) {
              IsSolved = false;
              break;
            }
          }
          if (!IsSolved) {
            break;
          }
        }
      } while (true);
      System.out.print("You won!\nInput anything to play again:");
      scanner.nextLine();
      System.out.print("\033[H\033[2J");
      System.out.flush();
    } while (true);
  }
}
