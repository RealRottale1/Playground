#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct Node {
    char key[45];
    int value;
    struct Node* next;
};

struct HashSet {
    struct Node* buckets[200];
    int totalNodes;
};

unsigned int getHash(char *key) {
    unsigned int hash = 5381;
    int c;
    while (c = *key++) {
        hash = ((hash << 5) + hash) + c;
    } 
    return hash % 200;
}

struct HashSet* makeHashSet() {
    struct HashSet* set = (struct HashSet*)calloc(1, sizeof(struct HashSet));
    return set;
}

struct Node* makeNode(char* key, int value) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    strncpy(node->key, key, 44);
    node->key[44] = '\0';
    node->value = value;
    return node;
}

void put(struct HashSet* set, char* key, int value) {
    unsigned int hash = getHash(key);
    if (set->buckets[hash] == NULL) {
        set->buckets[hash] = makeNode(key, value);
    } else {
        struct Node* current = set->buckets[hash];
        do {
            if (strcmp(current->key, key) == 0) {
                current->value = value;
                return;
            }
            struct Node* next = current->next;
            if (next == NULL) {
                current->next = makeNode(key, value);
                return;
            }
            current = next;
        } while (true);
    }
}

void print(struct HashSet* set) {
    for (int i = 0; i < 200; i++) {
        struct Node* current = set->buckets[i];
        while (current != NULL) {
            printf("%s=%i, ", current->key, current->value);
            current = current->next;
        }
    }
}

void unMap(struct HashSet* set) {
    for (int i = 0; i < 200; i++) {
        struct Node* current = set->buckets[i];
        while (current != NULL) {
            struct Node* next = current->next;
            free(current);
            current = next;
        }
    }
    free(set);
}

int main() {
    struct HashSet* set = makeHashSet();
    put(set, "hello", 1);
    put(set, "hello", 2);
    put(set, "goodbye", 3);
    print(set);
    unMap(set);
    return 0;
}