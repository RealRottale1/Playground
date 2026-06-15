#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct Node {
    char key[45];
    int value;
    struct Node* next;
};

struct HashMap {
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

struct HashMap* makeHashMap() {
    struct HashMap* set = (struct HashMap*)calloc(1, sizeof(struct HashMap));
    return set;
}

struct Node* makeNode(char* key, int value) {
    struct Node* node = (struct Node*)malloc(sizeof(struct Node));
    strncpy(node->key, key, 44);
    node->key[44] = '\0';
    node->value = value;
    return node;
}

void put(struct HashMap* set, char* key, int value) {
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

void rem(struct HashMap* set, char* key) {
    unsigned int hash = getHash(key);
    if (set->buckets[hash] != NULL) {
        struct Node* current = set->buckets[hash];
        if (strcmp(current->key, key) == 0) {
            struct Node* next = current->next;
            free(current);
            set->buckets[hash] = next;
            return;
        }

        while (true) {
            struct Node* next = current->next;
            if (next == NULL) {
                return;
            }
            if (strcmp(next->key, key) == 0) {
                struct Node* nextnext = next->next;
                free(current->next);
                current->next = nextnext;
                return;
            }
            current = next;
        } 
    }
}

void print(struct HashMap* set) {
    for (int i = 0; i < 200; i++) {
        struct Node* current = set->buckets[i];
        while (current != NULL) {
            printf("%s=%i, ", current->key, current->value);
            current = current->next;
        }
    }
    printf("\n");
}

void unMap(struct HashMap* set) {
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
    struct HashMap* set = makeHashMap();
    put(set, "hello", 1);
    put(set, "hello", 2);
    put(set, "goodbye", 3);
    rem(set, "hello");
    put(set, "at", 22);
    put(set, "be", 4);
    print(set);
        
    rem(set, "be");
    rem(set, "at");

    print(set);

    unMap(set);
    return 0;
}