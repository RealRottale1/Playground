import Foundation;

print("Welcome to Conway's Game of Life 2! The first game was mainly themed around life so when deciding on a sequel Conway thought why not introduce the opposite of life that being WAR! Place different cell types and watch them go to war!\n");

var arena: [[Character]] = [
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".","F","F",".",".",".",".",".",".",".",".","D",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".","F",".","F",".",".",".",".",".",".","D","D",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".","F","F",".",".",".",".",".","D","D",".",".",".",".",".",".",".",".",".","J","J","J",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".","D",".",".",".",".",".",".",".",".",".",".","J","J",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","J",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".","A","A",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".","A","A",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".","A",".",".",".",".","C","C",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".",".",".","C","C",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".","Q",".",".",".",".",".",".",".",".",".","C",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".","Q","Q",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    ["Q","Q",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","B",".",".",".",".",".",".",".",".",".",".",".","."],
    [".","Q",".",".",".",".",".",".","Z",".",".","Z",".",".",".",".",".","B",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".","Z","Z","Z",".",".",".",".",".","B",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".","Z",".","Z",".","Z",".",".",".",".",".","B","B",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".","Z",".","Z",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    [".",".",".",".",".",".",".",".",".","Z",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
];

let height: (min: Int, max: Int) = (min: 0, max: 19);
let width: (min: Int, max: Int) = (min: 0, max: 29);
let allDirections: [(Int, Int)] = [(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1),(-1,0),(-1,1)];
var cellTypeCount: [Character : Int] = [:];
var iteration: Int = 0;

for y in 0...height.max {
    for x in 0...width.max {
        if !cellTypeCount.keys.contains(arena[y][x]) {
            cellTypeCount[arena[y][x]] = 0;
        }
    }
}

func sameNeighborAmount(y: Int, x: Int, c: Character) -> (Int, Int, [Character : Int]) {
    var totalSameNeighbors: Int = 0;
    var totalAliveNeighbors: Int = 0;
    var typesOfNeighboringCells: [Character : Int] = [:];
    for direction in allDirections {
        let nextY: Int = y + direction.0;
        let nextX: Int = x + direction.1;
        if nextY < height.min || nextY > height.max || nextX < width.min || nextX > width.max {
            continue;
        }
        let neighboringCellType: Character = arena[nextY][nextX];
        if neighboringCellType == c {
            totalSameNeighbors += 1;
        }
        if neighboringCellType != "." {
            totalAliveNeighbors += 1;
            typesOfNeighboringCells[neighboringCellType] = (typesOfNeighboringCells[neighboringCellType] ?? 0) + 1;
        }
    }
    return (totalSameNeighbors, totalAliveNeighbors, typesOfNeighboringCells);
}



while true {
    var nextArena: [[Character]] = arena;
    print("Iteration: \(iteration)");
    for y in 0...height.max {
        for x in 0...width.max {
            let currentCellType: Character = arena[y][x];
            let (sameCells, aliveCells, neighboringCellTypes): (Int, Int, [Character : Int]) = sameNeighborAmount(y: y, x: x, c: currentCellType);
            if currentCellType == "." {
                if aliveCells == 3 || aliveCells == 4 {
                    if let maxCellAmount = neighboringCellTypes.values.max() {
                        var amountWithMax: Int = 0;
                        var maxCellType: Character = ".";
                        for (cellType, Amount) in neighboringCellTypes {
                            if Amount == maxCellAmount {
                                amountWithMax += 1;
                                if amountWithMax == 2 {
                                    maxCellType = ".";
                                    break;
                                } else {
                                    maxCellType = cellType;
                                }
                            }
                        }
                        nextArena[y][x] = maxCellType;
                    }
                }
            } else {
                if sameCells > 1 && sameCells < 4 {
                    nextArena[y][x] = currentCellType;
                } else {
                    nextArena[y][x] = ".";
                }
            }
        }
    }
    arena = nextArena;
    for y in 0...height.max {
        for x in 0...width.max {
            print(arena[y][x], terminator: "");
            cellTypeCount[arena[y][x]]! += 1;
        }
        print();
    }
    for (cellType, Amount) in cellTypeCount.sorted(by: {$0.value > $1.value}) {
        print("Type: \(cellType) : \(Amount == 0 ? "Dead" : String(Amount))");
        cellTypeCount[cellType]! = 0;
    } 
    print();
    iteration += 1;
    Thread.sleep(forTimeInterval: 0.125);
}


//Thread.sleep(forTimeInterval: 0.25);