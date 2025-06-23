struct Point: Hashable {
    let y: Int;
    let x: Int;
    var r: Int = 0;

    func hash(into hasher: inout Hasher) {
        hasher.combine(y);
        hasher.combine(x);
    }

    static func == (lhs: Point, rhs: Point) -> Bool {
        return lhs.y == rhs.y && lhs.x == rhs.x;
    }
}

var maze: [[Character]] = [
    ["#","#","#","#","#","#","#","#","#","#"],
    ["#","M"," "," ","#"," "," "," "," ","#"],
    ["#"," "," "," ","#"," "," "," "," ","#"],
    ["#","9"," "," ","#"," "," "," "," ","#"],
    ["#"," "," ","9","#","4","#"," "," ","#"],
    ["#"," "," "," ","3","3","#","9"," ","#"],
    ["#"," "," "," ","2","2","#","2","3","#"],
    ["#"," "," "," ","1","1","#"," ","9","#"],
    ["#"," "," "," ","#"," ","#"," ","C","#"],
    ["#","#","#","#","#","#","#","#","#","#"],
];

let height: (min: Int, max: Int) = (0, 9);
let width: (min: Int, max: Int)  = (0, 9);
var allConnections: [Point: [Point]] = [:];
let allDirections: [(Int, Int)] = [(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1),(-1,0),(-1,1)];

for y in 0...height.max {
    for x in 0...width.max {
        let currentPoint: Point = Point(y: y, x: x);
        var temp: [Point] = [];
        for direction in allDirections {
            let nextY: Int = y + direction.0;
            let nextX: Int = x + direction.1;
            if nextY < height.min || nextY > height.max || nextX < width.min || nextX > width.max {
                continue;
            }
            if maze[nextY][nextX] == "#" {
                continue;
            }
            let riskValue: Int = maze[nextY][nextX].wholeNumberValue ?? 0;
            temp.append(Point(y: nextY, x: nextX, r: riskValue));
        }
        allConnections[currentPoint] = temp;
    }
}

func getShortestPath() -> [Point]? {
    func getPositionOfChar(char: Character) -> Point? {
        for y in 0...height.max {
            for x in 0...width.max {
                if maze[y][x] == char {
                    return Point(y: y, x: x);
                }
            }
        }
        return nil;
    }

    func getNextPoints(currentPoint: Point, usedConnections: [[Point]]) -> [Point] {
        var unusedConnections: [Point] = [];
        for connection in allConnections[currentPoint]! {
            var isUsed: Bool = false;
            for section in usedConnections {
                if section.contains(connection) {
                    isUsed = true;
                    break;
                }
            }
            if !isUsed {
                unusedConnections.append(connection);
            }
        }
        return unusedConnections;
    }

    if let startPoint = getPositionOfChar(char: "M") {
        if let endPoint = getPositionOfChar(char: "C") {
            var finishedPaths: [(path: [Point], risk: Int)] = [];
            var currentPaths: [[Point]] = [];
            var currentIndexs: [Int] = [0];
            
            var lowestRisk: Int = Int.max;
            var currentRisk: Int = 0;

            currentPaths.append(getNextPoints(currentPoint: startPoint, usedConnections: currentPaths));
            if currentPaths[0].isEmpty {
                print("The mouse was unable to reach the cheese!");
                return nil;
            }

            func goBack(index: Int) -> Void {
                if index - 1 >= 0 {
                    currentRisk -= currentPaths[index - 1][currentIndexs[index - 1]].r;
                    currentIndexs[index - 1] += 1;
                }
                currentPaths.remove(at: index);
                currentIndexs.remove(at: index);
            }

            while !currentPaths.isEmpty {
                let lastI: Int = currentPaths.count - 1;
                if currentIndexs[lastI] >= currentPaths[lastI].count || currentRisk > lowestRisk {
                    goBack(index: lastI);
                    continue;
                }

                let currentPoint: Point = currentPaths[lastI][currentIndexs[lastI]];
                let nextNeighbors: [Point] = getNextPoints(currentPoint: currentPoint, usedConnections: currentPaths);
                if nextNeighbors.isEmpty {
                    currentIndexs[lastI] += 1;
                    if currentIndexs[lastI] >= currentPaths[lastI].count {
                        goBack(index: lastI);
                    }
                } else {
                    if nextNeighbors.contains(endPoint) {
                        lowestRisk = currentRisk;
                        var temp: [Point] = [];
                        temp.append(startPoint);
                        for i in 0...lastI {
                            temp.append(currentPaths[i][currentIndexs[i]]);
                        }
                        temp.append(endPoint);
                        finishedPaths.append((path: temp, risk: currentRisk + currentPoint.r));
                        currentIndexs[lastI] += 1;
                    } else {
                        currentRisk += currentPoint.r;
                        currentPaths.append(nextNeighbors);
                        currentIndexs.append(0);
                    }
                }
            }

            finishedPaths.sort(by: {
                if $0.risk == $1.risk {
                    return $0.path.count < $1.path.count;
                } else {
                    return $0.risk < $1.risk;
                }
            });

            print("The mouse reached the cheese!");
            maze[startPoint.y][startPoint.x] = " ";
            return finishedPaths[0].path;
        }
    }

    print("Maze lacks a mouse and/or cheese!");
    return nil;
}

if let results = getShortestPath() {
    for move in results {
        for y in 0...height.max {
            for x in 0...width.max {
                if move.y == y && move.x == x {
                    print("M", terminator: "");
                } else {
                    print(maze[y][x], terminator: "");
                }
            }
            print("");
        }
        print("");
    }
}
