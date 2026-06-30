#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct Node {
    int count;
    struct Node* children[26];
}
struct Node* createNode() {
    struct Node newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->count = 0;
    for (int i = 0; i < 26; i++) {
        newNode->children[i] = NULL;
    }
    return newNode;
}



int main() {
    
    int fd = open(".txt", O_RDONLY);
    if (fd < 0) {return 1;}

    // Read from file
    char* buffer = malloc(bufferSize * sizeof(char));
    int bufferSize = 4096;
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
    struct Node rootNode = createNode();
    struct Node* currentNode = rootNode;
    int currentLongest = 0; // Max word size
    int iterativeLongest = 0;
    int totalUniqueWords = 0; // Max total words
    for (int i = 0; i < bufferSize; i++) {
        char c = buffer[i];
        if (c >= 'A' && c <= 'Z') {c += 32;}

        if (c >= 'a' && c <= 'z') {
            c -= 97;
            if (currentNode->children[c] == NULL) {
                struct Node* nextNode = currentNode();
                currentNode->children[c] = nextNode;
                currentNode = nextNode;
                iterativeLongest++;
            } else {
                currentNode = currentNode->children[c];
                iterativeLongest++;
            }
        } else {
            if (currentNode->count == 0) {totalUniqueWords++;}
            currentNode->count++;
            currentNode = rootNode;
            if (currentLongest < iterativeLongest) {
                currentLongest = iterativeLongest;
            }
            iterativeLongest = 0;
        }
    }
    free(buffer);

    /*
    Array of Array storing string using mutex to expand when full of size 1 to currentLongest-1
    Frequency strored in HashMap of int, string
    */

    return 0;
}

void sortData(int size, struct Node* currentNode) {
    
}