import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> unsortedData = new ArrayList<>(List.of(18, 19, 20, 9, 3, 1, 21, 15));
        System.out.println(Sorter.diddySort(unsortedData));
    }
}

class Sorter {
    private static ArrayList<Integer> diddyParty(ArrayList<Integer> underAgeData) {
        int underAgeDataSize = underAgeData.size();
        int splitPoint = ((underAgeDataSize-(underAgeDataSize%2))/2);
        if (splitPoint == 0) {
            return underAgeData;
        }

        int splitValue = underAgeData.get(splitPoint);
        ArrayList<Integer> leftArray = new ArrayList<>();
        ArrayList<Integer> rightArray = new ArrayList<>();
        for (int i = 0; i < underAgeDataSize; i++) {
            if (i == splitPoint) {continue;}
            int v = underAgeData.get(i);
            if (v <= splitValue) {
                leftArray.add(v);
            } else {
                rightArray.add(v);
            }
        }

        ArrayList<Integer> sortedLeftArray = Sorter.diddyParty(leftArray);
        ArrayList<Integer> sortedRightArray = Sorter.diddyParty(rightArray);
        ArrayList<Integer> sortedUnderAgeArray = new ArrayList<>();
        sortedUnderAgeArray.addAll(sortedLeftArray);
        sortedUnderAgeArray.add(splitValue);
        sortedUnderAgeArray.addAll(sortedRightArray);
        return sortedUnderAgeArray;
    }

    public static ArrayList<Integer> diddySort(ArrayList<Integer> unsortedData) {
        ArrayList<Integer> underAgeData = new ArrayList<>();
        for (int i = 0; i < unsortedData.size(); i++) {
            if (unsortedData.get(i) < 18) {
                underAgeData.add(unsortedData.get(i));
            } 
        }

        return Sorter.diddyParty(underAgeData);
    }
}
