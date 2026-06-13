import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String args[]) {
        LRU LRUobj = new LRU(4);
        LRUobj.put("Apple");
        LRUobj.put("Banana");
        LRUobj.put("Carrot"); 
        LRUobj.put("Durian");
        LRUobj.get("Apple");
        LRUobj.put("Eggplant");
        LRUobj.print();
        LRUobj.put("Eggplant2");
        LRUobj.print();
    }
}

class LRU {
    private int capacity;
    private Chain head;
    private Chain tail;
    private HashMap<String, Chain> chainMap = new HashMap<>();

    public LRU(int capacity) {
        this.capacity = Math.max(0, capacity);
    }

    public Chain get(String value) {
        Chain c = this.chainMap.get(value);
        if (c != null) {
            if (this.head != c) {
                c.getPrev().setNext(c.getNext());
                this.head.setPrev(c);
                if (this.tail == c) {
                    this.tail = c.getPrev();
                }
                c.setNext(this.head);
                if (this.head.getNext() == null) {
                    this.tail = this.head;
                }
                c.setPrev(null);
                this.head = c;
            }
        }

        System.out.println(this.tail.getValue());
        this.print();
        return c;
    }

    public void put(String value) {
        Chain c = this.chainMap.get(value);
        if (c == null) {
            c = new Chain(value);
            this.chainMap.put(value, c);
        }
        if (this.head != null) {
            this.head.setPrev(c);
            c.setNext(this.head);
            if (this.head.getNext() == null) {
                this.tail = this.head;
            }
        }
        c.setPrev(null);
        this.head = c;
        if (this.head.getNext() == null) {
            this.tail = this.head;
        }

        System.out.println(this.tail.getValue());
        this.print();
        if (this.chainMap.size() > this.capacity) {
            Chain currentTail = this.tail;
            this.tail = this.tail.getPrev();
            if (this.tail != null) {
                this.tail.setNext(null);
            } else {
                this.head = null;
            }
            this.chainMap.remove(currentTail.getValue());
        }
    }

    public void print() {
        Chain current = this.head;
        while (current != null) {
            System.out.print(current.getValue() + ", ");
            current = current.getNext();
        }
        System.out.println("");
    }
}

class Chain {
    private Chain prev;
    private Chain next;
    private String value;

    public Chain(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }
    public Chain getNext() {
        return this.next;
    }
    public Chain getPrev() {
        return this.prev;
    }

    public void setNext(Chain c) {
        this.next = c;
    }
    public void setPrev(Chain c) {
        this.prev = c;
    }
}