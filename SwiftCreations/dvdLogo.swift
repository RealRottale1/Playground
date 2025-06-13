import Foundation;

var width: (min: Int, max: Int)  = (0, 29);
var height: (min: Int, max: Int) = (0, 29);
var position: (y: Int, x: Int)   = (15, 15);
var direction: (y: Int, x: Int)  = (0, 0);
var divider: String = "+" + String(repeating:"-", count: width.max+1) + "+";

direction.y = 1 + (-2 * Int.random(in: 0...1));
direction.x = 1 + (-2 * Int.random(in: 0...1));

while true {
    let nextY: Int = position.y + direction.y;
    let nextX: Int = position.x + direction.x;
    if nextY < height.min || nextY > height.max {direction.y *= -1};
    if nextX < width.min || nextX > width.max {direction.x *= -1};
    position.y += direction.y;
    position.x += direction.x;

    print(divider);
    for y in 0...height.max {
        print("|", terminator: "");
        for x in 0...width.max {
            if position.y == y && position.x == x {
                print("D", terminator: "");
            } else {
                print(" ", terminator: "");
            }
        }
        print("|");
    }
    print(divider);
    Thread.sleep(forTimeInterval: 0.25);
}
