#include <iostream>
#include <string>
#include <array>

class star {
    public:
        std::array<int, 3> color;
        std::string name;
        int size;
        int x;
        int y;
        star(std::array<int, 3> color, std::string name, int size, int x, int y) {
            this->color = color;
            this->size = size;
            this->name = name;
            this->x = x;
            this->y = y;
        }
};

bool objectsIntersect(star &object1, star &object2) {
    return false;
}

int main() {
    star Sun({255, 255, 0}, "sun", 100, 5, 5);
    star Sun2({255, 0, 255}, "sun 2", 200, 5, 5);
    bool doesItersect = objectsIntersect(Sun, Sun2);
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