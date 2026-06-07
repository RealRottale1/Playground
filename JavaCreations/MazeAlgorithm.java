import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

enum AlgorithmType {BFS, DIJKSTRAS}
record Pair<k, v>(k key, v value){}

public class Main {


    public static void main(String[] args) {
        Maze testMaze = new Maze("0,0,1,0/1,0,1,0/0,0,0,0/0,0,1,0", AlgorithmType.BFS);
        System.out.println("Created Maze Network!");
        List<String> solution = BFSSolver.solve(testMaze, "0,0", "0,3");
        System.out.println("Finished!");
        System.out.println(solution);

        Maze testMaze2 = new Maze("0,0,1,0/1,1,1,0/0,0,2,0/0,0,1,0", AlgorithmType.DIJKSTRAS);
        System.out.println("Created Maze Network!");
        List<String> solution2 = DijkstraSolver.solve(testMaze2, "0,0", "1,3");
        System.out.println("Finished!");
        System.out.println(solution2);
    }
}

class MazeNode {
    Integer Weight;
    Set<String> Children;
    String Parent;
    public MazeNode(Integer Weight, Set<String> Children) {
        this.Weight = Weight;
        this.Children = Children;
    }
}

class Maze {
    HashMap<String, MazeNode> MapNetwork;

    static List<String> reconstruct(Maze unsolvedMaze, String endNode, List<String> solvedMaze) {
        // Converts the completed network into a linear path
        String lastNode = endNode;
        do {
            solvedMaze.add(lastNode);
            if (unsolvedMaze.MapNetwork.get(lastNode) == null || unsolvedMaze.MapNetwork.get(lastNode).Parent == null) {
                break;
            }
            lastNode = unsolvedMaze.MapNetwork.get(lastNode).Parent;
        } while (true);
        return solvedMaze.reversed();
    }

    public Maze(String rawData, AlgorithmType useAlgorithm) {
        List<List<Pair<String, Integer>>> transformedData = new ArrayList<>();
        int xSize;
        int ySize;

        // Transforms raw data into array list data
        String[] rawRowData = rawData.split("/");
        ySize = rawRowData.length;
        int rawY = 0;
        for (String rawRow : rawRowData) {
            String[] rawColumnData = rawRow.split(",");
            List<Pair<String, Integer>> transformedColumnData = new ArrayList<>();
            int rawX = 0;
            for (String rawColumn : rawColumnData) {
                Pair<String, Integer> pair = new Pair<>(
                    Integer.toString(rawY) + "," + Integer.toString(rawX),
                    Integer.parseInt(rawColumn)
                );
                transformedColumnData.add(pair);
                rawX++;
            }
            transformedData.add(transformedColumnData);
            rawY++;
        }
        xSize = transformedData.get(0).size();

        // Transforms array list data into network data
        int wallValue = 1; // BFS wall value by default
        if (useAlgorithm == AlgorithmType.DIJKSTRAS) {
            wallValue = -1;
        }
        HashMap<String, MazeNode> MapNetwork = new HashMap<>();
        for (int y = 0; y < ySize; y++) {
            for (int x = 0; x < xSize; x++) {
                String NetworkKey = transformedData.get(y).get(x).key();
                Integer Weight = transformedData.get(y).get(x).value();

                Set<String> Children = new HashSet<>();
                if (y + 1 < ySize) {if (transformedData.get(y+1).get(x).value() != wallValue) {Children.add(transformedData.get(y+1).get(x).key());}}
                if (y - 1 >= 0)    {if (transformedData.get(y-1).get(x).value() != wallValue) {Children.add(transformedData.get(y-1).get(x).key());}}
                if (x + 1 < xSize) {if (transformedData.get(y).get(x+1).value() != wallValue) {Children.add(transformedData.get(y).get(x+1).key());}}
                if (x - 1 >= 0)    {if (transformedData.get(y).get(x-1).value() != wallValue) {Children.add(transformedData.get(y).get(x-1).key());}}

                MazeNode NetworkNode = new MazeNode(Weight, Children);
                MapNetwork.put(NetworkKey, NetworkNode);
            }
        }
        this.MapNetwork = MapNetwork;
    }    
}

class BFSSolver {
    static List<String> solve(Maze unsolvedMaze, String startNode, String endNode) {
        List<String> solvedMaze = new ArrayList<>();
        if ((unsolvedMaze.MapNetwork.get(endNode) == null || unsolvedMaze.MapNetwork.get(endNode).Weight == 1)|| (unsolvedMaze.MapNetwork.get(startNode) == null || unsolvedMaze.MapNetwork.get(startNode).Weight == 1)) {
            return solvedMaze; // Unable to solve maze as start or end is blocked
        }
        
        // Attempts to solve the network
        Set<String> currentNodes = new HashSet<>();
        currentNodes.add(startNode);
        Set<String> nextNodes = new HashSet<>();
        Set<String> oldNodes = new HashSet<>();
        oldNodes.add(startNode);
        boolean foundExit = false;
        do {
            for (String parent : currentNodes) {
                for (String child : unsolvedMaze.MapNetwork.get(parent).Children) {
                    if (!oldNodes.contains(child)) {
                        oldNodes.add(child);
                        nextNodes.add(child);
                        unsolvedMaze.MapNetwork.get(child).Parent = parent;
                    }
                    if (child.equals(endNode)) {
                        foundExit = true;
                        break;
                    }
                }
                if (foundExit) {
                    break;
                }
            }
            currentNodes = nextNodes;
            nextNodes = new HashSet<>();
        } while (!foundExit || currentNodes.size() <= 0);

        if (!foundExit) {
            return solvedMaze;
        }
        return Maze.reconstruct(unsolvedMaze, endNode, solvedMaze);
    }
}

class DijkstraSolver {
    static List<String> solve(Maze unsolvedMaze, String startNode, String endNode) {
        List<String> solvedMaze = new ArrayList<>();

        unsolvedMaze.MapNetwork.get(startNode).Weight = 0;
        unsolvedMaze.MapNetwork.get(endNode).Weight = 0;
        TreeMap<Integer, Set<String>> nextNodes = new TreeMap<>();
        Set<String> starter = new HashSet<>();
        starter.add(startNode);
        nextNodes.put(0, starter);

        Set<String> oldNodes = new HashSet<>();
        oldNodes.add(startNode);
        boolean foundExit = false;
        do {
            int lowestNodeWeight = nextNodes.firstKey(); 
            String currentNodeKey = nextNodes.get(lowestNodeWeight).iterator().next();
            MazeNode currentNode = unsolvedMaze.MapNetwork.get(currentNodeKey);
            if (nextNodes.get(lowestNodeWeight).size() <= 1) {
                nextNodes.remove(lowestNodeWeight);
            } else {
                nextNodes.get(lowestNodeWeight).remove(currentNodeKey);
            }

            for (String child : currentNode.Children) {
                if (!oldNodes.contains(child)) {
                    MazeNode childNode = unsolvedMaze.MapNetwork.get(child);
                    childNode.Weight += currentNode.Weight;
                    int childWeight = childNode.Weight;
                    if (nextNodes.get(childWeight) == null) {
                        Set<String> newSet = new HashSet<>();
                        newSet.add(child);
                        nextNodes.put(childWeight, newSet);
                    } else {
                        nextNodes.get(childWeight).add(child);
                    }
                    oldNodes.add(child);
                    childNode.Parent = currentNodeKey;
                    if (child.equals(endNode)) {
                        foundExit = true;
                        break;
                    }
                }
            }
        } while (!foundExit || nextNodes.size() > 0);

        if (!foundExit) {
            return solvedMaze;
        }
        return Maze.reconstruct(unsolvedMaze, endNode, solvedMaze);
    }
}