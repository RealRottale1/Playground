import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        MaxHeap<Integer> heap = new MaxHeap<Integer>(5);
        heap.add(4);
        heap.add(3);
        heap.add(20);
        heap.print();
    }
}

//Implement interface for maxHeap and minHeap
class MaxHeap<T extends Comparable<T>> {
    private ArrayList<T> heap;

    public void print() {
        System.out.println(this.heap);
    }

    public MaxHeap(T value) {
        this.heap = new ArrayList<T>();
        this.heap.add(value);
    }

    public void add(T value) {
        this.heap.add(value);
        int heapI = this.heap.size() - 1;
        do {
            int parentI = (heapI - 1) / 2;
            System.out.println(heapI);
            T parentValue = this.heap.get(parentI);
            if (parentValue.compareTo(value) < 0) {
                this.heap.set(heapI, parentValue);
                this.heap.set(parentI, value);
            }
            heapI = parentI;
            if (parentI <= 0) {break;}
        } while (true);
    }
}