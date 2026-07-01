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
void freeTrieNode(struct Node* current) {
    free(current->str);
    for (int i = 0; i < 26; i++) {
        if (current->children[i] != NULL) {
            freeTrieNode(current->children[i]);
        }
    }
    free(current);
    return;
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
void printStringHolderLG(struct StringHolder* current) {
    struct StringHolder* next = current;
    while (next != NULL) {
        printf("%s, ", next->str);
        next = next->next;
    }
    printf("\n");
}
void printStringHolderGL(struct StringHolder* current) {
    struct StringHolder* prior = current;
    while (prior != NULL) {
        printf("%s, ", prior->str);
        prior = prior->prior;
    }
    printf("\n");
}

struct WordHolder {
    char* str;
    int count;
};
struct WordHolder* createWordHolder(struct Node* current) {
    struct WordHolder* newWordHolder = (struct WordHolder*)malloc(sizeof(struct WordHolder));
    newWordHolder->str = current->str;
    newWordHolder->count = current->count;
    return newWordHolder;
}
void sortWordHolder(struct WordHolder** current, int start, int end) {
    if (start < end) {
        struct WordHolder* splitHolder = current[end];
        int splitValue = splitHolder->count;

        int i = start - 1;
        for (int j = start; j < end; j++) {
            if (current[j]->count > splitValue) {
                i++;
                struct WordHolder* tempHolder = current[i];
                current[i] = current[j];
                current[j] = tempHolder;
            }
        }
        struct WordHolder* tempHolder = current[i + 1];
        current[i + 1] = current[end];
        current[end] = tempHolder;
        sortWordHolder(current, start, i);
        sortWordHolder(current, i + 2, end);
    }
}
void printWordHolder(struct WordHolder** current, int start, int size, int mover) {
    int i = start;
    while (i >= 0 && i < size) {
        printf("%s: %i, ", current[i]->str, current[i]->count);
        i+=mover;
    }
    printf("\n");
}


int main() {
    printf("RUNNING WORD ANALYSIS!\n");
    int fd = open(".\\LyrinthBible.txt", O_RDONLY);
    if (fd < 0) {
        printf("FAILED TO READ FILE!");
        return 1;
    }
 
    // Read from file
    int bufferSize = 4096;
    char* buffer = (char*)malloc(bufferSize * sizeof(char));
    int totalRead = 0;
    ssize_t bytesRead;
    while ((bytesRead = read(fd, buffer + totalRead, bufferSize - totalRead))) {
        totalRead += bytesRead;
        if (totalRead >= bufferSize * 0.75) {
            bufferSize *= 2;
            char* temp = (char*)realloc(buffer, bufferSize);
            if (temp == NULL) {free(buffer); close(fd); printf("FAILED TO ALLOCATE MEMORY FOR BUFFER"); return 1;}
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
            if (currentNode->count == 0 && iterativeLongest > 0) {
                totalUniqueWords++;

                // Reconstruct the word
                char* str = (char*)malloc(iterativeLongest + 1);
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

    // Generate Size Analysis
    struct NodeHolder* rootNodeHolder = createNodeHolder(rootNode);
    struct NodeHolder* nextNodeHolder = NULL;
    struct NodeHolder* currentNodeHolder = NULL;
    struct StringHolder* firstStringHolder = NULL;
    struct StringHolder* lastStringHolder = NULL;
    struct WordHolder** frequencyArray = (struct WordHolder**)malloc(totalUniqueWords * sizeof(struct WordHolder));
    int frequencyIndex = 0;
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

                        struct WordHolder* newWordHolder = createWordHolder(currentNode);
                        frequencyArray[frequencyIndex] = newWordHolder;
                        frequencyIndex++; 
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

    // Generate Frequency Analysis
    sortWordHolder(frequencyArray, 0, totalUniqueWords - 1);

    // Output Analysis
    printf("L to G Length:\n");
    printStringHolderLG(firstStringHolder);

    // printf("G to L Length:\n");
    // printStringHolderGL(lastStringHolder);

    printf("L to G Frequency:\n");
    printWordHolder(frequencyArray, totalUniqueWords-1, totalUniqueWords, -1);

    // printf("G to L Frequency:\n");
    // printWordHolder(frequencyArray, 0, totalUniqueWords, 1);

    // Free String Holder
    struct StringHolder* currentStringHolder = firstStringHolder;
    do {
        struct StringHolder* nextStringHolder = currentStringHolder->next;
        free(currentStringHolder);
        currentStringHolder = nextStringHolder;
    } while (currentStringHolder != NULL);
    firstStringHolder = NULL;
    lastStringHolder = NULL;

    // Free Word Holder
    for (int i = 0; i < totalUniqueWords; i++) {
        free(frequencyArray[i]);
        frequencyArray[i] = NULL;
    }

    // Free trieNode
    freeTrieNode(rootNode);    
    rootNode = NULL;
    currentNode = NULL;

    printf("PROGRAM FINISHED!");
    return 0;
}
