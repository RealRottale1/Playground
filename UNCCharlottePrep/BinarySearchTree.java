import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        BinarySearchTree<Integer> BST = new BinarySearchTree<>(50);
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

class Node<T extends Comparable<T>> {
    private T value;
    private Node<T> parent;
    private Node<T> lNode;
    private Node<T> rNode;
    public Node(T value) {
        this.value = value;
    }
    public T getValue() {
        return this.value;
    }
    public void setValue(T value) {
        this.value = value;
    }

    public Node<T> getLNode() {
        return this.lNode;
    }
    public void setLNode(Node<T> newNode) {
        this.lNode = newNode;
    }

    public Node<T> getRNode() {
        return this.rNode;
    }
    public void setRNode(Node<T> newNode) {
        this.rNode = newNode;
    }

    public Node<T> getParentNode() {
        return this.parent;
    }
    public void setParentNode(Node<T> newNode) {
        this.parent = newNode;
    }
}

class BinarySearchTree<T extends Comparable<T>> {
    private Node<T> rootNode;
    public BinarySearchTree(T rootValue) {
        this.rootNode = new Node<>(rootValue);
    }

    // Insert method
    public void insert(T newValue) {
        Node<T> newNode = new Node<>(newValue);
        Node<T> currentNode = rootNode;
        do {
            boolean usesLNode = newValue.compareTo(currentNode.getValue()) < 0;
            Node<T> nextNode = usesLNode ? currentNode.getLNode() : currentNode.getRNode();
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
    public void removeViaIteration(T removeValue) {
       // Finds the node to remove
       Node<T> currentNode = rootNode;
        do {
            if (currentNode == null) {
                return; // No such value exists
            }
            T currentNodeValue = currentNode.getValue();
            if (currentNodeValue != removeValue) {
                currentNode = (removeValue.compareTo(currentNodeValue) < 0) ? currentNode.getLNode() : currentNode.getRNode();
            } else {
                break;
            }
        } while (true);

        //Gets children of removeNode
        Node<T> currentParentNode = currentNode.getParentNode();
        Node<T> currentLNode = currentNode.getLNode();
        Node<T> currentRNode = currentNode.getRNode();

        // Handles no children
        if (currentLNode == null && currentRNode == null) {
            // Handles current parent
            if (currentParentNode != null) {
                if (removeValue.compareTo(currentParentNode.getValue()) < 0) {
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
                if (currentLNode.getValue().compareTo(currentParentNode.getValue()) < 0) {
                    currentParentNode.setLNode(currentLNode);
                } else {
                    currentParentNode.setRNode(currentLNode);
                }
            }
            return;
        }

        // Gets left most node (from the right child of the current node)
        Node<T> currentLMostNode = currentRNode;
        do {
            Node<T> nextNode = currentLMostNode.getLNode();
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
                if (currentRNode.getValue().compareTo(currentParentNode.getValue()) < 0) {
                    currentParentNode.setLNode(currentRNode);
                } else {
                    currentParentNode.setRNode(currentRNode);
                }
            }
            return;
        }

        // Handles left most node
        Node<T> currentLMostRNode = currentLMostNode.getRNode();

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
            if (currentLMostNode.getValue().compareTo(currentParentNode.getValue()) < 0) {
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

    private Node<T> remove(Node<T> currentNode, T removeValue) {
        if (currentNode == null) {return null;}

        T currentValue = currentNode.getValue();
        int compareValue = removeValue.compareTo(currentValue);
        if (compareValue < 0) {
            currentNode.setLNode(remove(currentNode.getLNode(), removeValue));
            Node<T> currentLNode = currentNode.getLNode();
            if (currentLNode != null) {
                currentLNode.setParentNode(currentNode);
            }
        } else if (compareValue > 0) {
            currentNode.setRNode(remove(currentNode.getRNode(), removeValue));
            Node<T> currentRNode = currentNode.getRNode();
            if (currentRNode != null) {
                currentRNode.setParentNode(currentNode);
            }
        } else {
            if (currentNode.getLNode() == null) {return currentNode.getRNode();}
            if (currentNode.getRNode() == null) {return currentNode.getLNode();}

            Node<T> lMostNode = currentNode.getRNode();
            T lMostValue = lMostNode.getValue();
            do {
                Node<T> nextLNode = lMostNode.getLNode();
                if (nextLNode == null) {
                    break;
                }
                lMostNode = nextLNode;
                lMostValue = lMostNode.getValue();
            } while (true);

            currentNode.setValue(lMostValue);
            currentNode.setRNode(remove(currentNode.getRNode(), lMostNode.getValue()));
            Node<T> lMostRNode = lMostNode.getRNode();
            if (lMostRNode != null) {
                lMostRNode.setParentNode(currentNode);
            }

        }
        return currentNode;
    }
    public void removeViaRecursion(T removeValue) {
        this.rootNode = remove(this.rootNode, removeValue);
    }

    public void printInBFS() {
        Set<Node<T>> unprintedNodes = new HashSet<>();
        Set<Node<T>> nextNodes = new HashSet<>();
        unprintedNodes.add(this.rootNode);
        System.out.println(this.rootNode.getValue());
        do {
            for (Node<T> parent : unprintedNodes) {
                Node<T> lNode = parent.getLNode();
                Node<T> rNode = parent.getRNode();
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