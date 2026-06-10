import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.Map;
import java.util.HashSet;
import java.util.Set;


public class Main {
    public static void main(String[] args) {
        KruskalAlgorithm<Integer> algorithm = new KruskalAlgorithm<Integer>();
        Vertex<Integer> node1 = new Vertex<Integer>(1, 'A', 'B');
        Vertex<Integer> node2 = new Vertex<Integer>(7, 'A', 'C');
        Vertex<Integer> node3 = new Vertex<Integer>(5, 'B', 'C');
        Vertex<Integer> node4 = new Vertex<Integer>(4, 'B', 'D');
        Vertex<Integer> node5 = new Vertex<Integer>(3, 'B', 'E');
        Vertex<Integer> node6 = new Vertex<Integer>(6, 'C', 'E');
        Vertex<Integer> node7 = new Vertex<Integer>(2, 'D', 'E');

        algorithm.add(node1);
        algorithm.add(node2);
        algorithm.add(node3);
        algorithm.add(node4);
        algorithm.add(node5);
        algorithm.add(node6);
        algorithm.add(node7);
        algorithm.print();

        System.out.println(algorithm.getKruskal());
    }
}

record Pair<K, V>(K key, V value){}

class KruskalAlgorithm<T extends Comparable<T>> {
    private Set<Vertex<T>> allVertex = new HashSet<>();

    public void add(Vertex<T> vertex) {
        this.allVertex.add(vertex);
    }

    static private Pair<Character, Integer> getRoot(Character start, HashMap<Character, Character> parentArray) {
        Integer depth = 0;
        Character current = start;
        do {
            Character next = parentArray.get(current);
            if (next == current) {
                return new Pair<Character, Integer>(current, depth);
            }
            current = next;
            depth++;
        } while (true);
    }

    public HashMap<Character, Character> getKruskal() {
        // Gets TreeMap of cheapest vertex
        TreeMap<T, ArrayList<Character[]>> cheapestVertex = new TreeMap<>();
        HashMap<Character, Character> parentArray = new HashMap<>();
        for (Vertex<T> v : this.allVertex) {
            T weight = v.getWeight();
            Character nodeA = v.getNodeA();
            Character nodeB = v.getNodeB();
            parentArray.put(nodeA, nodeA);
            parentArray.put(nodeB, nodeB);
            Character[] nodesAB = new Character[]{nodeA, nodeB};
            if (cheapestVertex.containsKey(weight)) {
                cheapestVertex.get(weight).add(nodesAB);
            } else {
                ArrayList<Character[]> container = new ArrayList<>();
                container.add(nodesAB);
                cheapestVertex.put(weight, container);
            }
        }

        // Solves for cheapest connections
        int connections = 0;
        for (Map.Entry<T, ArrayList<Character[]>> entry : cheapestVertex.entrySet()) {
            for (Character[] nodesAB : entry.getValue()) {
                Pair<Character, Integer> nodeAPair = getRoot(nodesAB[0], parentArray);
                Pair<Character, Integer> nodeBPair = getRoot(nodesAB[1], parentArray);
                if (nodeAPair.key() != nodeBPair.key()) {
                    if (nodeAPair.value() <= nodeBPair.value()) {
                        parentArray.put(nodeAPair.key(), nodesAB[1]);
                    } else {
                        parentArray.put(nodeBPair.key(), nodesAB[0]);
                    }
                    connections++;
                    if (connections >= this.allVertex.size() - 1) {
                        return parentArray;
                    }
                }
            }
        }
        return parentArray;
    }

    public void print() {
        for (Vertex<T> v : this.allVertex) {
            System.out.println(v.getNodeA() + "-" + v.getWeight() + "-" + v.getNodeB());
        }
    }
}

class Vertex<T extends Comparable<T>> {
    private T weight;
    private Character nodeA;
    private Character nodeB;

    public Vertex(T weight, Character nodeA, Character nodeB) {
        this.weight = weight;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
    }

    public T getWeight() {
        return this.weight;
    }
    public Character getNodeA() {
        return this.nodeA;
    }
    public Character getNodeB() {
        return this.nodeB;
    }
}