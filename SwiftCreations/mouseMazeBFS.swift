
struct Point: Hashable {
    let y: Int
    let x: Int
}

var maze: [[Character]] = [
    ["#","#","#","#","#","#","#","#","#","#"],
    ["#","M"," "," ","#"," "," "," "," ","#"],
    ["#"," "," "," ","#"," "," "," "," ","#"],
    ["#"," "," "," ","#"," "," "," "," ","#"],
    ["#"," "," "," ","#"," ","#"," "," ","#"],
    ["#"," "," "," "," "," ","#","#"," ","#"],
    ["#"," "," "," "," "," ","#"," "," ","#"],
    ["#"," "," "," "," "," ","#"," ","#","#"],
    ["#"," "," "," "," "," ","#"," ","C","#"],
    ["#","#","#","#","#","#","#","#","#","#"],
];

let height: (min: Int, max: Int) = (0, 9);
let width: (min: Int, max: Int)  = (0, 9);
var allConnections: [Point: [Point]] = [:];
var allDirections: [(Int, Int)] = [(0,1),(1,1),(1,0),(1,-1),(0,-1),(-1,-1),(-1,0),(-1,1)];

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
            temp.append(Point(y: nextY, x: nextX));
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

    func getNextPoints(currentPoint: Point, usedConnections: Set<Point>) -> [Point] {
        var unusedConnections: [Point] = [];
        for connection in allConnections[currentPoint]! {
            if !usedConnections.contains(connection) {
                unusedConnections.append(connection);
            }
        }
        return unusedConnections;
    }

    if let startPoint = getPositionOfChar(char: "M") {
        if let endPoint = getPositionOfChar(char: "C") {
            var usedConnections: Set<Point> = [startPoint];
            var nextPathWays: [[Point]] = [];
            var pathWays: [[Point]] = [];

            let initialConnections: [Point] = getNextPoints(currentPoint: startPoint, usedConnections: usedConnections);
            for connection in initialConnections {
                pathWays.append([startPoint, connection]);
            }

            while true {
                for path in pathWays {
                    let pathLen: Int = path.count;
                    let newConnections: [Point] = getNextPoints(currentPoint: path[pathLen-1], usedConnections: usedConnections);
                    for newConnection in newConnections {
                        usedConnections.insert(newConnection);
                        nextPathWays.append(path + [newConnection]);

                        if newConnection == endPoint {
                            print("Mouse reached the cheese!");
                            maze[startPoint.y][startPoint.x] = " ";
                            return nextPathWays[nextPathWays.count-1];
                        }
                    }
                }
                if nextPathWays.isEmpty {
                    print("Mouse unable to reach cheese!");
                    return nil;
                }
                pathWays = nextPathWays;
                nextPathWays.removeAll();
            }
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
            print();
        }
    }
}