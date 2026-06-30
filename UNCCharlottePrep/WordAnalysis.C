#include <fcntl.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

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

    // To lower case and count chars
    for (int i = 0; i < bufferSize; i++) {
        char c = buffer[i];
        if (c >= 'A' && c <= 'Z') {
            c += 32;
            buffer[i] = c;
        }

    }

    // Add words to hashmap



    free(buffer);
    return 0;
}