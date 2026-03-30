/**
 * Exercise23_05
 * 
 * Recursive implementation of merge Sort
 * that does not create new arrays when splitting.
 * Merges into a temporary array and copies back
 * into the original array.
 */
public class Exercise23_05 {

  /**
   * Public method that starts the recursive merge sort.
   *
   * @paramarray to be sorted
   */
  public static void mergeSort(int[] list) {
    if (list == null || list.length <= 1)
      return;

    mergeSort(list, 0, list.length - 1);
  }

  /**
   * Recursively sorts the array between low and high indices.
   *
   * @param array to sort
   * @param low starting index
   * @param high ending index
   */
  private static void mergeSort(int[] list, int low, int high) {
    if (low >= high)
      return;

    int mid = (low + high) / 2;

    // Recursively sort first half
    mergeSort(list, low, mid);

    // Recursively sort second half
    mergeSort(list, mid + 1, high);

    // Merge the two halves
    merge(list, low, high);
  }

  /**
   * Merges two sorted halves of the array into a temporary array,
   * then copies the sorted values back into the original array.
   *
   * @param list the array containing two sorted halves
   * @param low starting index
   * @param high ending index
   */
  private static void merge(int[] list, int low, int high) {
    int[] temp = new int[high - low + 1];

    int mid = (low + high) / 2;
    int current1 = low;
    int current2 = mid + 1;
    int current3 = 0;

    // Merge both halves into temp
    while (current1 <= mid && current2 <= high) {
      if (list[current1] <= list[current2])
        temp[current3++] = list[current1++];
      else
        temp[current3++] = list[current2++];
    }

    while (current1 <= mid)
      temp[current3++] = list[current1++];

    while (current2 <= high)
      temp[current3++] = list[current2++];

    for (int i = 0; i < temp.length; i++) {
      list[low + i] = temp[i];
    }
  }

  /**
   * Test method.
   * Multiple test cases documented in output.
   */
  public static void main(String[] args) {

    System.out.println("Test Case 1:");
    int[] list1 = {2, 3, 2, 5, 6, 1, -2, 3, 14, 12, -5};
    mergeSort(list1);
    printArray(list1);

    System.out.println("\nTest Case 2:");
    int[] list2 = {5, 4, 3, 2, 1};
    mergeSort(list2);
    printArray(list2);

    System.out.println("\nTest Case 3:");
    int[] list3 = {1, 2, 3, 4, 5};
    mergeSort(list3);
    printArray(list3);

    System.out.println("\nTest Case 4:");
    int[] list4 = {};
    mergeSort(list4);
    printArray(list4);

    System.out.println("\nTest Case 5:");
    int[] list5 = {9};
    mergeSort(list5);
    printArray(list5);
  }

  // prints an array
  private static void printArray(int[] list) {
    for (int value : list)
      System.out.print(value + " ");
    System.out.println();
  }
}s