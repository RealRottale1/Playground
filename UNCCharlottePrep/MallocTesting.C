#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdbool.h>

struct Array {
    int *data;
    int dataCapacity;
};

void setArrayCapacity(struct Array *list, int capacity) {
    if (capacity <= list->dataCapacity) {
        assert(false);
    }
    int *newData = (int*)realloc(list->data, list->dataCapacity * sizeof(int));
    if (newData == NULL) {
        assert(false);
    }
    list->data = newData;
    list->dataCapacity = capacity;
}

struct Array* createArray(int capacity) {
    struct Array *list = (struct Array*)malloc(sizeof(struct Array));
    setArrayCapacity(list, capacity);
    return list;
}

void set(struct Array *list, int index, int value) {
    if (index < 0) {assert(false);}
    if (list->dataCapacity <= index) {
        setArrayCapacity(list, index + 1);
    }
    list->data[index] = value;
}

void add(struct Array *list, int value) {
    setArrayCapacity(list, list->dataCapacity + 1);
    list->data[list->dataCapacity - 1] = value;
}

int get(struct Array *list, int index) {
    assert(index >= 0 && index < list->dataCapacity);
    return list->data[index];
}

int pop(struct Array *list) {
    
}

int indexOf(struct Array *list, int value) {
    for (int i = 0; i < list->dataCapacity; i++) {
        if (list->data[i] == value) {
            return i;
        }
    }
    return -1;
}

void printArray(struct Array *list) {
    for (int i = 0; i < list->dataCapacity; i++) {
        printf("%i, ", list->data[i]);
    }
    printf("\n");
}

int main() {
    struct Array *list = createArray(5);
    set(list, 0, 2);
    set(list, 1, 6);
    set(list, 2, 12);
    add(list, 3);
    printArray(list);
    printf("%i\n", get(list, 0));
    printf("%i\n", indexOf(list, 12));
    return 0;
}
