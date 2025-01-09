#include <iostream>
#include <string>
#include <array>

int main() {
    int numbers[10] = {3, 5, 7, 4, 6, 0, 2, 1, 9, 8};
    int *ptr = numbers;
    for (int i = 0; i < 10; i++) {
        std::cout << "Index: " << i << ", Value: " << *(ptr + i) << std::endl;
    }

    return 0;
}

/* Basic number sorter using pointers
    std::array<int, 15> unsortedData = {9, 8, 7, 4, 5, 2, 3, 6, 1, 0, 9, 8, 4, 6, 7};
    const int unsortedDataSize = unsortedData.size();

    bool adjustedArray;
    do {
        adjustedArray = false;
        for (int i = 0; i < unsortedDataSize-1; i++) {
            int *currentValue = &unsortedData[i];
            int *nextValue = &unsortedData[i+1];
            if (*nextValue < *currentValue) {
                adjustedArray = true;
                int *tempValue = new int;
                *tempValue = *nextValue;
                *nextValue = *currentValue;
                *currentValue = *tempValue;
                delete tempValue;
                tempValue = nullptr;
            }
            currentValue = nullptr;
            nextValue = nullptr;
        }
    } while (adjustedArray);

    for (int i = 0; i < unsortedDataSize; i++) {
        std::cout << unsortedData[i];
    }
*/

/*
    int numberArray[3] = {1, 2, 3};
    // points to array
    dataType (*ptr)[size] = &array;

    //points to start of array
    dataType *ptr = array;
*/