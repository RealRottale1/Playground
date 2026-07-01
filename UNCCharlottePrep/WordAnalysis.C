#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

struct Node {
    int count;
    struct Node* parent;
    struct Node* children[26];
    char* str;
    char value;
};
struct Node* createNode() {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->count = 0;
    newNode->parent = NULL;
    for (int i = 0; i < 26; i++) {
        newNode->children[i] = NULL;
    }
    newNode->str = 0;
    newNode->value = 0;
    return newNode;
}

struct NodeHolder {
    struct Node* data;
    struct NodeHolder* next;
};
struct NodeHolder* createNodeHolder(struct Node* current) {
    struct NodeHolder* newNodeHolder = (struct NodeHolder*)malloc(sizeof(struct NodeHolder));
    newNodeHolder->data = current;
    newNodeHolder->next = NULL;
    return newNodeHolder;
}

struct StringHolder {
    char* str;
    struct StringHolder* next;
    struct StringHolder* prior;
};
struct StringHolder* createStringHolder(struct Node* current) {
    struct StringHolder* newStringHolder = (struct StringHolder*)malloc(sizeof(struct StringHolder));
    newStringHolder->str = current->str;
    newStringHolder->next = NULL;
    newStringHolder->prior = NULL;
    return newStringHolder;
}



int main() {
    
    int fd = open(".txt", O_RDONLY);
    if (fd < 0) {return 1;}

    // Read from file
    int bufferSize = 4096;
    char* buffer = malloc(bufferSize * sizeof(char));
    int totalRead = 0;
    ssize_t bytesRead;
    while ((bytesRead = read(fd, buffer + totalRead, bufferSize - totalRead))) {
        totalRead += bytesRead;
        if (totalRead >= bufferSize * 0.75) {
            bufferSize *= 2;
            char* temp = realloc(buffer, bufferSize);
            if (temp == NULL) {free(buffer); close(fd); return 1;}
            buffer = temp;
        }
    }
    close(fd);

    // Create TriNode map
    struct Node* rootNode = createNode();
    struct Node* currentNode = rootNode;
    int currentLongest = 0; // Max word size
    int iterativeLongest = 0;
    int totalUniqueWords = 0; // Max total words
    for (int i = 0; i < bufferSize; i++) {
        char c = buffer[i];
        if (c >= 'A' && c <= 'Z') {c += 32;}

        if (c >= 'a' && c <= 'z') {
            int ic = c - 97;
            if (currentNode->children[ic] == NULL) {
                struct Node* nextNode = createNode();
                currentNode->children[ic] = nextNode;
                nextNode->value = c;
                nextNode->parent = currentNode;
                currentNode = nextNode;
                iterativeLongest++;
            } else {
                currentNode = currentNode->children[ic];
                iterativeLongest++;
            }
        } else {
            if (currentNode->count == 0) {
                totalUniqueWords++;

                // Reconstruct the word
                char* str = malloc(iterativeLongest + 1);
                str[iterativeLongest] = '\0';
                struct Node* useNode = currentNode;
                do {
                    iterativeLongest--;
                    str[iterativeLongest] = (char)useNode->value;
                    useNode = useNode->parent;
                    if (useNode == rootNode) {
                        break;
                    }
                } while (true);
                currentNode->str = str;
            }
            currentNode->count++;
            currentNode = rootNode;
            if (currentLongest < iterativeLongest) {
                currentLongest = iterativeLongest;
            }
            iterativeLongest = 0;
        }
    }
    free(buffer);

    // Analysis
    struct NodeHolder* rootNodeHolder = createNodeHolder(rootNode);
    struct NodeHolder* nextNodeHolder = NULL;
    struct NodeHolder* currentNodeHolder = NULL;
    struct StringHolder* firstStringHolder = NULL;
    struct StringHolder* lastStringHolder = NULL;
    do {
        struct NodeHolder* iNodeHolder = rootNodeHolder;
        do {
            struct Node* iNode = iNodeHolder->data;
            for (int i = 0; i < 26; i++) {
                if (iNode->children[i] != NULL) {
                    struct Node* currentNode = iNode->children[i];
                    struct NodeHolder* newNodeHolder = createNodeHolder(currentNode);
                    if (nextNodeHolder == NULL) {
                        nextNodeHolder = newNodeHolder;
                        currentNodeHolder = newNodeHolder;
                    } else {
                        currentNodeHolder->next = newNodeHolder;
                        currentNodeHolder = newNodeHolder;
                    }
                    
                    if (currentNode->str != 0) {
                        struct StringHolder* newStringHolder = createStringHolder(currentNode);
                        if (firstStringHolder == NULL) {
                            firstStringHolder = newStringHolder;
                            lastStringHolder = firstStringHolder;
                        } else {
                            lastStringHolder->next = newStringHolder;
                            newStringHolder->prior = lastStringHolder;
                            lastStringHolder = newStringHolder; 
                        }   
                    }
                }
            }
            iNodeHolder = iNodeHolder->next;
        } while (iNodeHolder != NULL);
        
        // Free memory of old holders
        struct NodeHolder* freeNodeHolder = rootNodeHolder;
        do { 
            struct NodeHolder* nextFreeNodeHolder = freeNodeHolder->next;
            free(freeNodeHolder);
            freeNodeHolder = nextFreeNodeHolder;
        } while (freeNodeHolder);

        rootNodeHolder = nextNodeHolder;
        nextNodeHolder = NULL;
        currentNodeHolder = NULL;
    } while (rootNodeHolder != NULL);


    // Free String Holder
    // Free trieNode when done
    return 0;
}
