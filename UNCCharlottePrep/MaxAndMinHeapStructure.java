import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        MaxHeap<Integer> heapMax = new MaxHeap<Integer>(5);
        heapMax.add(4);
        heapMax.add(3);
        heapMax.add(20);
        heapMax.print();
        heapMax.pop();
        heapMax.print();

        System.out.println("---");

        MinHeap<Integer> heapMin = new MinHeap<Integer>(5);
        heapMin.add(4);
        heapMin.add(3);
        heapMin.add(20);
        heapMin.print();
        heapMin.pop();
        heapMin.print();
    }
}

interface HeapStructure<T extends Comparable<T>> {
    void print();

    void add(T value);
    void pop();
}

class MaxHeap<T extends Comparable<T>> implements HeapStructure<T> {
    private ArrayList<T> heap;

    public MaxHeap(T value) {
        this.heap = new ArrayList<T>();
        this.heap.add(value);
    }

    @Override
    public void print() {
        System.out.println(this.heap);
    }

    @Override
    public void add(T value) {
        this.heap.add(value);
        int heapI = this.heap.size() - 1;
        do {
            int parentI = (heapI - 1) / 2;
            T parentValue = this.heap.get(parentI);
            if (parentValue.compareTo(value) < 0) {
                this.heap.set(heapI, parentValue);
                this.heap.set(parentI, value);
            }
            heapI = parentI;
            if (parentI <= 0) {break;}
        } while (true);
    }
    @Override
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

class MinHeap<T extends Comparable<T>> implements HeapStructure<T> {
    private ArrayList<T> heap;

    public MinHeap(T value) {
        this.heap = new ArrayList<T>();
        this.heap.add(value);
    }

    @Override
    public void print() {
        System.out.println(this.heap);
    }

    @Override
    public void add(T value) {
        this.heap.add(value);
        int heapI = this.heap.size() - 1;
        do {
            int parentI = (heapI - 1) / 2;
            T parentValue = this.heap.get(parentI);
            if (parentValue.compareTo(value) > 0) {
                this.heap.set(heapI, parentValue);
                this.heap.set(parentI, value);
            }
            heapI = parentI;
            if (parentI <= 0) {break;}
        } while (true);
    }
    @Override
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
                largestChildIndex = this.heap.get(leftChildIndex).compareTo(this.heap.get(rightChildIndex)) <= 0 ? leftChildIndex : rightChildIndex;
            }
            T currentValue = this.heap.get(currentIndex);
            T largestValue = this.heap.get(largestChildIndex);
            if (largestValue.compareTo(currentValue) < 0) {
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