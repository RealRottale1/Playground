#include <stdio.h>

int main() {
    char c1;
    char c2;
    float f1;
    int i1;
    printf("Char 1");
    scanf(" %c", &c1);
    printf("Char 2");
    scanf(" %c", &c2);
    printf("Float 1");
    scanf(" %f", &f1);
    printf("Int 1");
    scanf(" %i", &i1);

    printf("%c\n%c\n%.2f\n%i", c1, c2, f1, i1);
    return 0;
}