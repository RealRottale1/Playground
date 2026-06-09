import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> unsortedData = new ArrayList<>(List.of(4, 3, 2, 10, 12, 1, 5, 6));
        System.out.println(Sorter.bubbleSort(unsortedData));
        System.out.println(Sorter.selectionSort(unsortedData));
        System.out.println(Sorter.insertionSort(unsortedData));
        System.out.println(Sorter.mergeSort(unsortedData));
        System.out.println(Sorter.quickSort(unsortedData));
    }
}

class Sorter {
    public static ArrayList<Integer> bubbleSort(ArrayList<Integer> unsortedData) {
        int dataSize = unsortedData.size();
        boolean alteredData;
        do {
            alteredData = false;
            for (int i = 0; i < dataSize - 1; i++) {
                int thisValue = unsortedData.get(i);
                int nextValue = unsortedData.get(i+1);
                if (nextValue < thisValue) {
                    int valueHolder = thisValue;
                    unsortedData.set(i, nextValue);
                    unsortedData.set(i+1, valueHolder);
                    alteredData = true;
                }
            }
        } while (alteredData);
        return unsortedData;
    }
    public static ArrayList<Integer> selectionSort(ArrayList<Integer> unsortedData) {
        int dataSize = unsortedData.size();
        for (int i = 0; i < dataSize - 1; i++) {
            int minIndex = i;
            int minValue = unsortedData.get(i);
            int valueHolder = minValue;
            for (int j = i; j < dataSize; j++) {
                int thisValue = unsortedData.get(j);
                if (thisValue < minValue) {
                    minValue = thisValue;
                    minIndex = j;
                }
            }
            unsortedData.set(i, minValue);
            unsortedData.set(minIndex, valueHolder);
        }
        return unsortedData;
    }
    public static ArrayList<Integer> insertionSort(ArrayList<Integer> unsortedData) {
        int dataSize = unsortedData.size();
        if (dataSize == 1) {return unsortedData;}
        int lastValue = unsortedData.get(0);
        for (int i = 1; i < dataSize; i++) {
            int thisValue = unsortedData.get(i);
            if (thisValue < lastValue) {
                for (int j = i; j > 0; j--) {
                    int jValue = unsortedData.get(j-1);
                    if (jValue > thisValue) {
                        int valueHolder = jValue;
                        unsortedData.set(j-1, thisValue);
                        unsortedData.set(j, valueHolder);
                    } else {
                        break;
                    }
                }
            }
            lastValue = unsortedData.get(i-1);
        }
        return unsortedData;
    }
    public static ArrayList<Integer> mergeSort(ArrayList<Integer> unsortedData) {
        int dataSize = unsortedData.size();
        int splitPoint = ((dataSize-(dataSize%2))/2);
        if (splitPoint == 0) {
            return unsortedData;
        }

        ArrayList<Integer> leftData = new ArrayList<>();
        leftData.addAll(unsortedData.subList(0, splitPoint));
        ArrayList<Integer> sortedLeftData = mergeSort(leftData);

        ArrayList<Integer> rightData = new ArrayList<>();
        rightData.addAll(unsortedData.subList(splitPoint, dataSize));
        ArrayList<Integer> sortedRightData = mergeSort(rightData);

        int sortedLeftDataSize = sortedLeftData.size();
        int sortedRightDataSize = sortedRightData.size();
        ArrayList<Integer> mergedData = new ArrayList<>();
        int i = 0;
        int j = 0;
        do {
            int leftValue = sortedLeftData.get(i);
            int rightValue = sortedRightData.get(j);
            if (leftValue <= rightValue) {
                mergedData.add(leftValue);
                i++;
            } else {
                mergedData.add(rightValue);
                j++;
            }
        } while (i < sortedLeftDataSize && j < sortedRightDataSize);
        
        while (i < sortedLeftDataSize) {
            mergedData.add(sortedLeftData.get(i));
            i++;
        }
        while (j < sortedRightDataSize) {
            mergedData.add(sortedRightData.get(j));
            j++;
        }

        return mergedData;
    }
    public static ArrayList<Integer> quickSort(ArrayList<Integer> unsortedData) {
        int dataSize = unsortedData.size();
        int splitPoint = ((dataSize-(dataSize%2))/2);
        if (splitPoint == 0) {
            return unsortedData;
        }

        int splitValue = unsortedData.get(splitPoint);
        ArrayList<Integer> leftArray = new ArrayList<>();
        ArrayList<Integer> rightArray = new ArrayList<>();
        for (int i = 0; i < dataSize; i++) {
            if (i == splitPoint) {continue;}
            int thisValue = unsortedData.get(i);
            if (thisValue <= splitValue) {
                leftArray.add(thisValue);
            } else {
                rightArray.add(thisValue);
            }
        }

        ArrayList<Integer> sortedLeftArray = quickSort(leftArray);
        ArrayList<Integer> sortedRightArray = quickSort(rightArray);
        ArrayList<Integer> mergedArray = new ArrayList<>();
        mergedArray.addAll(sortedLeftArray);
        mergedArray.add(splitValue);
        mergedArray.addAll(sortedRightArray);
        return mergedArray;
    }
}