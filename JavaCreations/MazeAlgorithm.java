import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

record Pair<k, v>(k key, v value){}

public class Main {


    public static void main(String[] args) {
        Maze testMaze = new Maze("0,0,1,0/1,0,1,0/0,0,0,0/0,0,1,0", true);
        System.out.println("Created Maze Network!");
        List<String> solution = BFSSolver.solve(testMaze, "0,0", "0,3");
        System.out.println("Finished!");
        System.out.println(solution);
    }

    /*
       "S,0,1,0/
        1,0,1,E/
        0,0,0,0/
        0,0,1,0"
    */
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

    public Maze(String rawData, boolean isBFS) {
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
        HashMap<String, MazeNode> MapNetwork = new HashMap<>();
        for (int y = 0; y < ySize; y++) {
            for (int x = 0; x < xSize; x++) {
                String NetworkKey = transformedData.get(y).get(x).key();
                Integer Weight = transformedData.get(y).get(x).value();

                Set<String> Children = new HashSet<>();
                if (y + 1 < ySize) {if (transformedData.get(y+1).get(x).value() != 1 || !isBFS) {Children.add(transformedData.get(y+1).get(x).key());}}
                if (y - 1 >= 0)    {if (transformedData.get(y-1).get(x).value() != 1 || !isBFS) {Children.add(transformedData.get(y-1).get(x).key());}}
                if (x + 1 < xSize) {if (transformedData.get(y).get(x+1).value() != 1 || !isBFS) {Children.add(transformedData.get(y).get(x+1).key());}}
                if (x - 1 >= 0)    {if (transformedData.get(y).get(x-1).value() != 1 || !isBFS) {Children.add(transformedData.get(y).get(x-1).key());}}

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

        // Converts the completed network into a linear path
        if (!foundExit) {
            return solvedMaze;
        }
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
}