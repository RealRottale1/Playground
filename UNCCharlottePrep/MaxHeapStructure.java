import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        MaxHeap<Integer> heap = new MaxHeap<Integer>(5);
        heap.add(4);
        heap.add(3);
        heap.add(20);
        heap.print();
        heap.pop();
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

    public void pop() {
        int currentIndex = 0;
        this.heap.set(0, this.heap.get(this.heap.size() - 1));
        this.heap.remove(this.heap.size() - 1);

        int heapSize = this.heap.size();
        do {
            int leftChildIndex = (2*currentIndex + 1);
            int rightChildIndex = (2*currentIndex + 2);
            boolean leftInRange = leftChildIndex < heapSize;
            boolean rightInRange = rightChildIndex < heapSize;
            
            if (!leftInRange && !rightInRange) {
                break;
            }

            int largestChildIndex = leftChildIndex;
            if (leftInRange && rightInRange) {
                largestChildIndex = this.heap.get(leftChildIndex).compareTo(this.heap.get(rightChildIndex)) >= 0 ? leftChildIndex : rightChildIndex;
            }
            T currentValue = this.heap.get(currentIndex);
            T largestValue = this.heap.get(largestChildIndex);
            if (largestValue.compareTo(currentValue) > 0) {
                T valueHolder = currentValue;
                this.heap.set(currentIndex, largestValue);
                this.heap.set(largestChildIndex, valueHolder);
                currentIndex = largestChildIndex;
            } else {
                break;
            }
       } while (true);
    }
}