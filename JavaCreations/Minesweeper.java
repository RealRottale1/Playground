
//Minesweeper

// Imports
import java.util.*;

public class Main {
  // Changed Variables
  public static int MaxRows = 0; // Max is 35
  public static int MaxColumns = 0; // Max is 35
  public static int MaxBombsInRow = 0; // Higher number equals more bombs CAN spawn
  public static int MinBombsInRow = 0; // Higher number equals more bombs WILL spawn
  public static int MaxBombRandomRange = MaxRows; // Lower number equals more bombs
  public static String HiddenChar = "◼️";
  public static String FlagChar = "F";
  public static String BombShowChar = "B";
  public static String DebugCommand = "debug";

  // Vital Variables DO NOT EDIT!
  public static String[] GridUnits = { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
  public static List<String> RemovedBlocks = new ArrayList<String>();
  public static List<String> FlaggedBlocks = new ArrayList<String>();
  public static Boolean IsDead = false;

  // Game Loop
  public static Map<String, List<String>> RedrawNearbyBombs(Map<String, List<String>> NewField) {
    for (int i = 0; i < MaxRows; i++) {
      for (int ii = 0; ii < MaxColumns; ii++) {
        if (NewField.get(String.valueOf(i)).get(ii) != "B" ) { // && NewField.get(String.valueOf(i)).get(ii) != " "
          int BombsNearby = 0;
          for (int Row = i - 1; Row < i + 2; Row++) {
            for (int Column = ii - 1; Column < ii + 2; Column++) {
              if (Row > -1 && Column > -1 && Row < MaxRows && Column < MaxColumns) {
                if (Row == i && Column == ii) {
                } else {
                  if (NewField.get(String.valueOf(Row)).get(Column).equals("B")) {
                    BombsNearby += 1;
                  }
                }
              }
            }
          }
          if (BombsNearby == 0) {
            NewField.get(String.valueOf(i)).set(ii, " ");
          } else {
            NewField.get(String.valueOf(i)).set(ii, String.valueOf(BombsNearby));
          }
        }
      }
    }
    return NewField;
  }

  public static Map<String, List<String>> GenerateField() {
    // Generates field
    Map<String, List<String>> NewField = new LinkedHashMap<String, List<String>>();
    for (int i = 0; i < MaxRows; i++) {
      List<String> TempRow = new ArrayList<String>();
      for (int ii = 0; ii < MaxColumns; ii++) {
        TempRow.add("0");
      }
      NewField.put(String.valueOf(i), TempRow);
    }

    // Places mines
    for (Map.Entry<String, List<String>> Row : NewField.entrySet()) {
      int CurrentBombCount = 0;
      for (int i = 0; i < Row.getValue().size(); i++) {
        if (CurrentBombCount < MaxBombsInRow) {
          if (CurrentBombCount < MinBombsInRow) {
            Row.getValue().set(i, "B");
            CurrentBombCount += 1;
          } else {
            Random rand = new Random();
            if (rand.nextInt(MaxBombRandomRange - i) == 0) {
              Row.getValue().set(i, "B");
              CurrentBombCount += 1;
            }
          }
        } else {
          break;
        }
      }
      Collections.shuffle(Row.getValue());
    }

    // Generates numbers for how many bombs are around each square
    NewField.get(String.valueOf(MaxRows / 2)).set(MaxColumns / 2, "0");
    NewField = RedrawNearbyBombs(NewField);

    return NewField;
  }

  public static Boolean DecectIfVisible(Map<String, List<String>> NewField, int i, int ii,
      Map<String, Map<String, String>> PastPaths) {
    for (int Row = i - 1; Row < i + 2; Row++) {
      for (int Column = ii - 1; Column < ii + 2; Column++) {
        if (Row > -1 && Column > -1 && Row < MaxRows && Column < MaxColumns) {
          if (Row == i && Column == ii) {
          } else {
            if (Row == MaxRows / 2 && Column == MaxColumns / 2) {
              return true;
            } else {
              Boolean NotUsed = true;
              for (Map.Entry<String, Map<String, String>> Data : PastPaths.entrySet()) {
                for (Map.Entry<String, String> Vals : Data.getValue().entrySet()) {
                  if (String.valueOf(Row).equals(Vals.getKey()) && String.valueOf(Column).equals(Vals.getValue())) {
                    NotUsed = false;
                    break;
                  }
                }
                if (!NotUsed) {
                  break;
                }
              }
              for (String RemovedPart : RemovedBlocks) {
                String XYPosition[] = RemovedPart.split("_");
                if (XYPosition[0].equals(String.valueOf(i)) && XYPosition[1].equals(String.valueOf(ii))) {
                  return true;
                }
              }

              if (NewField.get(String.valueOf(Row)).get(Column).equals(" ")) {

                if (NotUsed) {
                  Map<String, String> PathData = new Hashtable<String, String>();
                  PathData.put(String.valueOf(Row), String.valueOf(Column));
                  PastPaths.put(String.valueOf(Row) + String.valueOf(Column), PathData);
                  Boolean CanShow = DecectIfVisible(NewField, Row, Column, PastPaths);
                  if (CanShow) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  public static Map<String, List<String>> MakeClone(Map<String, List<String>> Field) {
    Map<String, List<String>> NewField = new LinkedHashMap<String, List<String>>();
    int RowIndex = 0;
    for (List<String> Row : Field.values()) {
      List<String> TempRow = new ArrayList<String>();
      int Index = 0;
      for (String Data : Row) {
        TempRow.add(Index, Data);
        Index += 1;
      }
      NewField.put(String.valueOf(RowIndex), TempRow);
      RowIndex += 1;
    }
    return NewField;
  }

  public static void HandleFormatField(Map<String, List<String>> NewField) {
    for (int i = 0; i < MaxRows; i++) {
      for (int ii = 0; ii < MaxColumns; ii++) {
        if (i == MaxRows / 2 && ii == MaxColumns / 2) {
        } else {
          Boolean Flagged = false;
          for (String FlaggedPart : FlaggedBlocks) {
            String XYPosition[] = FlaggedPart.split("_");
            if (XYPosition[0].equals(String.valueOf(i)) && XYPosition[1].equals(String.valueOf(ii))) {
              NewField.get(String.valueOf(i)).set(ii, FlagChar);
              Flagged = true;
              break;
            }
          }
          if (!Flagged) {
            if (NewField.get(String.valueOf(i)).get(ii).equals("B")) {
              NewField.get(String.valueOf(i)).set(ii, HiddenChar);
            } else {
              Boolean IsVisible = false;

              for (String RemovedPart : RemovedBlocks) {
                String XYPosition[] = RemovedPart.split("_");
                if (XYPosition[0].equals(String.valueOf(i)) && XYPosition[1].equals(String.valueOf(ii))) {
                  IsVisible = true;
                  break;
                }
              }

              if (!IsVisible) {
                Map<String, Map<String, String>> PastPaths = new Hashtable<String, Map<String, String>>();
                Map<String, String> PathData = new Hashtable<String, String>();

                PathData.put(String.valueOf(i), String.valueOf(ii));
                PastPaths.put(String.valueOf(i) + String.valueOf(ii), PathData);

                IsVisible = DecectIfVisible(NewField, i, ii, PastPaths);
              }

              // Check if block is in the removed parts array
              if (!IsVisible) {
                NewField.get(String.valueOf(i)).set(ii, HiddenChar);
              }
            }
          }
        }
      }
    }
  }

  public static void FormatShowField(Map<String, List<String>> NewField) {
    HandleFormatField(NewField);

    System.out.print("#");
    for (int i = 0; i < MaxRows; i++) {
      System.out.print(" " + GridUnits[i] + ",");
    }
    System.out.println(" ");

    int Index = 0;
    for (Map.Entry<String, List<String>> Row : NewField.entrySet()) {
      System.out.println(GridUnits[Index] + Row.getValue());
      Index += 1;
    }
  }

  public static void main(String[] args) {
    // Establishes scanner
    Scanner Scanner = new Scanner(System.in);
    do {
      // Gets game mode
      String GameMode = "";
      do {
        System.out.print("-----[ Pick A Game Mode ]-----\n---[Easy]--[Medium]--[Hard]---\nInput:");
        GameMode = Scanner.nextLine();
      } while (!GameMode.toLowerCase().equals("baby") && !GameMode.toLowerCase().equals("easy")
          && !GameMode.toLowerCase().equals("medium") && !GameMode.toLowerCase().equals("hard")
          && !GameMode.toLowerCase().equals("hell"));

      // Sets values according to selected game mode
      if (GameMode.toLowerCase().equals("baby")) {
        MaxRows = 5;
        MaxColumns = 5;
        MaxBombsInRow = 1;
        MinBombsInRow = 1;
        MaxBombRandomRange = MaxRows;
      } else if (GameMode.toLowerCase().equals("easy")) {
        MaxRows = 10;
        MaxColumns = 10;
        MaxBombsInRow = 4;
        MinBombsInRow = 0;
        MaxBombRandomRange = MaxRows + 2;
      } else if (GameMode.toLowerCase().equals("medium")) {
        MaxRows = 18;
        MaxColumns = 18;
        MaxBombsInRow = 8;
        MinBombsInRow = 2;
        MaxBombRandomRange = MaxRows + 1;
      } else if (GameMode.toLowerCase().equals("hard")) {
        MaxRows = 24;
        MaxColumns = 24;
        MaxBombsInRow = 11;
        MinBombsInRow = 4;
        MaxBombRandomRange = MaxRows;
      } else if (GameMode.toLowerCase().equals("hell")) {
        MaxRows = 35;
        MaxColumns = 35;
        MaxBombsInRow = 25;
        MinBombsInRow = 15;
        MaxBombRandomRange = MaxRows;
      }

      String[] UseGridUnits = new String[MaxRows];
      // Removes unused units from grid system
      for (int i = 0; i < MaxRows; i++) {        
        UseGridUnits[i] = GridUnits[i];      
      }

      // Prints Instructions
      System.out.println(
          "\nWelcome to Mine Sweeper!\nType F to flag a square and R to reveal a square.\nType the Row and Coloumn ID to select a square.\n");

      // Gets field
      Map<String, List<String>> Field = GenerateField();

      // Shows field with hidden parts
      Map<String, List<String>> ClonedField = MakeClone(Field);
      FormatShowField(ClonedField);

      // Gets input and handles game loop
      Boolean InDebugMode = false;
      Boolean WonGame = false;
      do {

        // Gets input
        System.out.print("Input: ");
        String Input = Scanner.nextLine();
        if (Input.equals(DebugCommand)) {
          InDebugMode = true;
        }

        // Breaks input into command parts
        String Parts[] = Input.split(" ");
        if (Parts.length == 2) {
          if (Parts[0].toUpperCase().equals("F") || Parts[0].toUpperCase().equals("R")) {
            if (Parts[1].length() == 2) {
              if (Arrays.asList(UseGridUnits).contains(String.valueOf(Parts[1].charAt(0)))
                  && Arrays.asList(UseGridUnits).contains(String.valueOf(Parts[1].charAt(1)))) {
                if (Parts[0].toUpperCase().equals("R")) {

                  // Handles remove command
                  int RowNum = Arrays.asList(UseGridUnits).indexOf(String.valueOf(Parts[1].charAt(0)));
                  int ColumnNum = Arrays.asList(UseGridUnits).indexOf(String.valueOf(Parts[1].charAt(1)));
                  if (ClonedField.get(String.valueOf(RowNum)).get(ColumnNum).equals(HiddenChar)) {
                    if (Field.get(String.valueOf(RowNum)).get(ColumnNum).equals("B")) {
                      IsDead = true;
                    } else {
                      ClonedField.get(String.valueOf(RowNum)).set(ColumnNum, "0");
                      RemovedBlocks.add(String.valueOf(RowNum) + "_" + String.valueOf(ColumnNum));
                    }
                  }
                } else if (Parts[0].toUpperCase().equals("F")) {

                  // Handles flag command
                  int RowNum = Arrays.asList(UseGridUnits).indexOf(String.valueOf(Parts[1].charAt(0)));
                  int ColumnNum = Arrays.asList(UseGridUnits).indexOf(String.valueOf(Parts[1].charAt(1)));
                  if (ClonedField.get(String.valueOf(RowNum)).get(ColumnNum).equals(HiddenChar)
                      || ClonedField.get(String.valueOf(RowNum)).get(ColumnNum).equals(FlagChar)) {
                    Boolean IsFlagged = false;
                    for (String FlaggedPart : FlaggedBlocks) {
                      String XYPosition[] = FlaggedPart.split("_");
                      if (XYPosition[0].equals(String.valueOf(RowNum))
                          && XYPosition[1].equals(String.valueOf(ColumnNum))) {
                        IsFlagged = true;
                        break;
                      }
                    }
                    if (IsFlagged) {
                      FlaggedBlocks.remove(String.valueOf(RowNum) + "_" + String.valueOf(ColumnNum));
                    } else {
                      FlaggedBlocks.add(String.valueOf(RowNum) + "_" + String.valueOf(ColumnNum));
                    }
                  }
                }
              }
            }
          }
        }

        // Allows for debug mode
        if (InDebugMode) {
          System.out.println("Visible Map -----");
          int Index = 0;
          for (Map.Entry<String, List<String>> Row : Field.entrySet()) {
            System.out.println(UseGridUnits[Index] + Row.getValue());
            Index += 1;
          }
          System.out.println("Altered Map -----");
          Index = 0;
          for (Map.Entry<String, List<String>> Row : ClonedField.entrySet()) {
            System.out.println(UseGridUnits[Index] + Row.getValue());
            Index += 1;
          }
          System.out.println("New Map -----");
        }

        // Redraws field
        RedrawNearbyBombs(Field);
        ClonedField = MakeClone(Field);
        FormatShowField(ClonedField);

        // Checks if you won
        WonGame = true;
        int RIndex = 0;
        for (Map.Entry<String, List<String>> Row : ClonedField.entrySet()) {
          int CIndex = 0;
          for (String Data : Row.getValue()) {
            if (Data.equals(HiddenChar) || Data.equals(FlagChar)) {
              if (!Field.get(String.valueOf(RIndex)).get(CIndex).equals("B")) {
                WonGame = false;
                break;
              }
            }
            CIndex += 1;
          }
          if (CIndex < MaxColumns) {
            break;
          }
          RIndex += 1;
        }
        if (WonGame) {
          break;
        }

      } while (!IsDead);

      // Handles ending
      System.out.print("#");
      for (int i = 0; i < MaxRows; i++) {
        System.out.print(" " + UseGridUnits[i] + ",");
      }
      System.out.println(" ");

      int RIndex = 0;
      for (Map.Entry<String, List<String>> Row : Field.entrySet()) {
        int CIndex = 0;
        for (String Data : Row.getValue()) {
          if (Data.equals("B")) {
            ClonedField.get(String.valueOf(RIndex)).set(CIndex, BombShowChar);
          }
          CIndex += 1;
        }
        System.out.println(UseGridUnits[RIndex] + Row.getValue());
        RIndex += 1;
      }

      // Prints win/lose message
      if (IsDead) {
        System.out.println("You Died!");
      } else {
        System.out.println("You Won!");
      }
      IsDead = false;

      // Play again?
      System.out.print("Input anything to return to menu:");
      Scanner.nextLine();
      System.out.print("\033[H\033[2J");
      System.out.flush();

      RemovedBlocks = new ArrayList<String>();
      FlaggedBlocks = new ArrayList<String>();
    } while (true);
    // You won does not always play immediatly after you win
  }
}