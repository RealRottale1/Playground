import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        BinarySearchTree BST = new BinarySearchTree(50);
        BST.insert(40);
        BST.insert(70);
        BST.insert(60);
        BST.insert(85);
        BST.insert(80);
        BST.insert(75);
        BST.removeViaIteration(70);
        //BST.removeViaRecursion(70);
        BST.printInBFS();
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
    public void setValue(int value) {
        this.value = value;
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
    private Node rootNode;
    public BinarySearchTree(int rootValue) {
        this.rootNode = new Node(rootValue);
    }

    // Insert method
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

    // Remove methods
    public void removeViaIteration(int removeValue) {
       // Finds the node to remove
       Node currentNode = rootNode;
        do {
            if (currentNode == null) {
                return; // No such value exists
            }
            int currentNodeValue = currentNode.getValue();
            if (currentNodeValue != removeValue) {
                currentNode = (removeValue < currentNodeValue) ? currentNode.getLNode() : currentNode.getRNode();
            } else {
                break;
            }
        } while (true);

        //Gets children of removeNode
        Node currentParentNode = currentNode.getParentNode();
        Node currentLNode = currentNode.getLNode();
        Node currentRNode = currentNode.getRNode();

        // Handles no children
        if (currentLNode == null && currentRNode == null) {
            // Handles current parent
            if (currentParentNode != null) {
                if (removeValue < currentParentNode.getValue()) {
                    currentParentNode.setLNode(null);
                } else {
                    currentParentNode.setRNode(null);
                }
            } else {
                this.rootNode = null;
            }
            return;
        }

        // Handles just left child
        if (currentLNode != null && currentRNode == null) {
            currentNode.setLNode(null);
            currentLNode.setParentNode(currentParentNode);

            // Handles current parent
            if (currentParentNode == null) {
                this.rootNode = currentLNode;
            } else {
                if (currentLNode.getValue() < currentParentNode.getValue()) {
                    currentParentNode.setLNode(currentLNode);
                } else {
                    currentParentNode.setRNode(currentLNode);
                }
            }
            return;
        }

        // Gets left most node (from the right child of the current node)
        Node currentLMostNode = currentRNode;
        do {
            Node nextNode = currentLMostNode.getLNode();
            if (nextNode == null) {
                break;
            }
            currentLMostNode = nextNode;
        } while (true);

        // Handles just right child
        if (currentLMostNode == currentRNode) {
            currentNode.setRNode(null);
            currentRNode.setParentNode(currentParentNode);

            // Handles re-attaching existing leftNode
            currentRNode.setLNode(currentNode.getLNode());
            if (currentLNode != null) {
                currentLNode.setParentNode(currentRNode);
            }

            // Handles current parent
            if (currentParentNode == null) {
                this.rootNode = currentRNode;
            } else {
                if (currentRNode.getValue() < currentParentNode.getValue()) {
                    currentParentNode.setLNode(currentRNode);
                } else {
                    currentParentNode.setRNode(currentRNode);
                }
            }
            return;
        }

        // Handles left most node
        Node currentLMostRNode = currentLMostNode.getRNode();

        // Handles moving up potential right node of currentLMostNode
        if (currentLMostRNode != null) {
            currentLMostRNode.setParentNode(currentLMostNode.getParentNode());
        }
        currentLMostNode.getParentNode().setLNode(currentLMostRNode); // Either null or the right node
        currentLMostNode.setParentNode(currentParentNode);

        // Handles current parent
        if (currentParentNode == null) {
            this.rootNode = currentLMostNode;
        } else {
            if (currentLMostNode.getValue() < currentParentNode.getValue()) {
                currentParentNode.setLNode(currentLMostNode);
            } else {
                currentParentNode.setRNode(currentLMostNode);
            }
        }

        // Finishes the re-attachment process
        currentLMostNode.setLNode(currentNode.getLNode());
        currentLMostNode.setRNode(currentNode.getRNode());
        if (currentLNode != null) {
            currentLNode.setParentNode(currentLMostNode);
        }
        if (currentRNode != null) {
            currentRNode.setParentNode(currentLMostNode);
        }
    }

    private Node remove(Node currentNode, int removeValue) {
        if (currentNode == null) {return null;}

        int currentValue = currentNode.getValue();
        if (removeValue < currentValue) {
            currentNode.setLNode(remove(currentNode.getLNode(), removeValue));
            Node currentLNode = currentNode.getLNode();
            if (currentLNode != null) {
                currentLNode.setParentNode(currentNode);
            }
        } else if (removeValue > currentValue) {
            currentNode.setRNode(remove(currentNode.getRNode(), removeValue));
            Node currentRNode = currentNode.getRNode();
            if (currentRNode != null) {
                currentRNode.setParentNode(currentNode);
            }
        } else {
            if (currentNode.getLNode() == null) {return currentNode.getRNode();}
            if (currentNode.getRNode() == null) {return currentNode.getLNode();}

            Node lMostNode = currentNode.getRNode();
            int lMostValue = lMostNode.getValue();
            do {
                Node nextLNode = lMostNode.getLNode();
                if (nextLNode == null) {
                    break;
                }
                lMostNode = nextLNode;
                lMostValue = lMostNode.getValue();
            } while (true);

            currentNode.setValue(lMostValue);
            currentNode.setRNode(remove(currentNode.getRNode(), lMostNode.getValue()));
            Node lMostRNode = lMostNode.getRNode();
            if (lMostRNode != null) {
                lMostRNode.setParentNode(currentNode);
            }

        }
        return currentNode;
    }
    public void removeViaRecursion(int removeValue) {
        this.rootNode = remove(this.rootNode, removeValue);
    }

    public void printInBFS() {
        Set<Node> unprintedNodes = new HashSet<>();
        Set<Node> nextNodes = new HashSet<>();
        unprintedNodes.add(this.rootNode);
        System.out.println(this.rootNode.getValue());
        do {
            for (Node parent : unprintedNodes) {
                Node lNode = parent.getLNode();
                Node rNode = parent.getRNode();
                if (lNode != null) {
                    nextNodes.add(lNode);
                    System.out.print(lNode.getValue() + ",");
                }
                if (rNode != null) {
                    nextNodes.add(rNode);
                    System.out.print(rNode.getValue());
                }
                System.out.print("|");
            }
            System.out.println("");
            unprintedNodes = nextNodes;
            nextNodes = new HashSet<>();
        } while(unprintedNodes.size() > 0);
    }
}