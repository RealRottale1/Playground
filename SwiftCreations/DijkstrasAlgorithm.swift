var connections: [String: [String: Int]] = [:];
var nodes: [String: (d: Int, p: String?)] = [:];

func connectNode(_ n1: String, _ n2: String, _ d: Int) -> Void {
    let d: Int = d < 0 ? 0 : d;
    connections[n1, default: [:]][n2] = d;
    connections[n2, default: [:]][n1] = d;
    if !nodes.keys.contains(n1) {nodes[n1] = (d: Int.max, p: nil)};
    if !nodes.keys.contains(n2) {nodes[n2] = (d: Int.max, p: nil)};
} 

connectNode("A", "B", 2);
connectNode("A", "D", 8);
connectNode("B", "D", 5);
connectNode("B", "E", 6);
connectNode("D", "E", 3);
connectNode("D", "F", 2);
connectNode("E", "F", 1);
connectNode("E", "C", 9);
connectNode("F", "C", 3);

let startingNode: String = "A";
nodes[startingNode]!.d = 0;

var pathMap: [String: (d: Int, p: String)] = [:];
func fillPathMap() -> Void {
    var searchedNodes: Set<String> = [];
    var unsearchedNodes: [String] = [startingNode];
    do {
        let currentNode: String = unsearchedNodes[0];
        let currentDistance: Int = nodes[currentNode]!.d;
        for neighboringNode in connections[currentNode]!.keys {
            if nodes[currentNode]!.d + connections[currentNode]![neighboringNode]! < nodes[neighboringNode]!.d {
                
            }
        }
    } while !unsearchedNodes.isEmpty;
}

fillPathMap();
print(pathMap);