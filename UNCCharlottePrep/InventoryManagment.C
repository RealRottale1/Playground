#include <stdio.h>
#include <string.h>

struct Item {
    char name[12];
    float weight;
    struct Item *prev;
    struct Item *next;
};

void populateItem(struct Item *obj, char *string, float weight) {
    strncpy(obj->name, string, 11);
    obj->name[11] = '\0';
    obj->weight = weight;
}

struct LinkedList {
    struct Item *head;
    struct Item *tail;
    float maxWeight;
    float currentWeight;
};

int addToInventory(struct LinkedList *list, struct Item *obj) {
    float newWeight = list->currentWeight + obj->weight;
    if (newWeight <= list->maxWeight) {
        list->currentWeight = newWeight;
        if (list->head == NULL) {
            // Add obj to head if no elements
            list->head = obj;
            list->tail = obj;
            obj->next = NULL;
            obj->prev = NULL;
        } else {
            // Add obj behind tail and set obj to tail
            struct Item *currentTail = list->tail;
            currentTail->next = obj;
            obj->prev = currentTail;
            obj->next = NULL;
            list->tail = obj;
        }
        return 1;
    };
    return 0;
}

int removeFromInventory(struct LinkedList *list, char *string) {
    struct Item *current = list->head;
    while (current != null) {
        if (strncmp(current->name, string, 11) == 0) {
            
        }
        current = current->next;
    } 
    return 0;
}

void printInventory(struct LinkedList *list) {
    printf("} - {|Inventory|} - {\n");
    struct Item *current = list->head;
    while (current != NULL) {
        printf("%s, ", current->name);
        current = current->next;
    }
}

int main() {
    struct LinkedList inventory;
    inventory.maxWeight = 10.0f;
    inventory.currentWeight = 0.0f;

    struct Item stimpack1;
    populateItem(&stimpack1, "Stimpack", 1.0f);
    struct Item stimpack2;
    populateItem(&stimpack2, "Stimpack", 1.0f);
    struct Item radAway1;
    populateItem(&radAway1, "RadAway", 1.0f);

    addToInventory(&inventory, &stimpack1);
    addToInventory(&inventory, &stimpack2);
    addToInventory(&inventory, &radAway1);
    removeFromInventory(&inventory, "Stimpack");
    printInventory(&inventory);

    return 0;
}