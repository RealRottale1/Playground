

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
                break;
            } else {
                currentNode = nextNode;
            }
        } while (true);
    }

    public void remove(int removeValue) {
        // Scrap this all I wrote it poorly!
        Node removeNode = rootNode;
        boolean foundRemoveNode = true;
        if (removeNode.getValue() != removeValue) {
            do {
                removeNode = (removeValue < removeNode.getValue()) ? removeNode.getLNode() : removeNode.getRNode();
                if (removeNode.getValue() == removeValue) {
                    break;
                }
                if (removeNode == null) {
                    foundRemoveNode = false;
                    break;
                }
            } while (true);
            if (!foundRemoveNode) {return;}
        }
        
        Node useNode = removeNode;
        // Move to the right one (if possible)
        Node rightRemoveNode = removeNode.getRNode();
        if (rightRemoveNode != null) {
            useNode = rightRemoveNode;
            // Get the left most value
            do {
                Node nextNode = useNode.getLNode();
                if (nextNode == null) {
                    break;
                }
                useNode = nextNode;
            } while (true);

        } else {
            // No right nodes so re
            this.rootNode = useNode.getLNode();
        }
    }
}