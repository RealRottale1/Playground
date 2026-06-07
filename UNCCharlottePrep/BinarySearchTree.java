

public class Main {
    public static void main(String[] args) {
        BinarySearchTree BST = new BinarySearchTree(50);
        BST.insert(40);
        BST.insert(70);
        BST.insert(60);
        BST.insert(85);
        BST.insert(80);
        BST.insert(75);
        BST.remove(70);
    }
}

class Node {
    private int value;
    private Node parent;
    private Node lNode;
    private Node rNode;
    public Node(int value) {
        this.value = value;
    }
    public int getValue() {
        return this.value;
    }

    public Node getLNode() {
        return this.lNode;
    }
    public void setLNode(Node newNode) {
        this.lNode = newNode;
    }

    public Node getRNode() {
        return this.rNode;
    }
    public void setRNode(Node newNode) {
        this.rNode = newNode;
    }

    public Node getParentNode() {
        return this.parent;
    }
    public void setParentNode(Node newNode) {
        this.parent = newNode;
    }
}

class BinarySearchTree {
    private Node rootNode
    public BinarySearchTree(int rootValue) {
        this.rootNode = new Node(rootValue);
    }

    public void insert(int newValue) {
        Node newNode = new Node(newValue);
        Node currentNode = rootNode;
        do {
            boolean usesLNode = newValue < currentNode.getValue();
            Node nextNode = usesLNode ? currentNode.getLNode() : currentNode.getRNode();
            if (nextNode == null) {
                if (usesLNode) {currentNode.setLNode(newNode);} else {currentNode.setRNode(newNode);}
                newNode.setParentNode(currentNode);
                break;
            } else {
                currentNode = nextNode;
            }
        } while (true);
    }

    public void remove(int removeValue) {
        /* Learn to code*/
    }
}