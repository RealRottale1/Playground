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

func makeQuickestConnections() -> Void {
    var searchedNodes: Set<String> = [];
    var unsearchedNodes: [String] = [startingNode];
    repeat {
        let cNode: String = unsearchedNodes[0];
        if searchedNodes.contains(cNode) {
            unsearchedNodes.removeFirst()
            continue;    
        }
        let cDistance: Int = nodes[cNode]!.d;
        for nNode in connections[cNode]!.keys {
            let distanceBetween: Int = connections[cNode]![nNode]!;
            if cDistance + distanceBetween < nodes[nNode]!.d {
                nodes[nNode]!.d = cDistance + distanceBetween;
                nodes[nNode]!.p = cNode;
            }
            if !searchedNodes.contains(nNode) {unsearchedNodes.append(nNode)};
        }
        searchedNodes.insert(cNode);
        unsearchedNodes.removeFirst();
    } while !unsearchedNodes.isEmpty;
}

makeQuickestConnections();

func getQuickestPathTo(to endNode: String) -> [String] {
    var path: [String] = [];
    var currentNode: String = endNode;
    repeat {
        path.append(currentNode);
        if let nextNode = nodes[currentNode]!.p {
            currentNode = nextNode;
        } else {
            return path.reversed();
        }
    } while true;
}

let path: [String] = getQuickestPathTo(to: "C");
print(path);