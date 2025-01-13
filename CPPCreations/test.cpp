#include <iostream>
#include <array>

int main()
{
    std::array<char, 3> array1 = {'a', 'b', 'c'};

    char *charPointer = &array1[1];
    std::array<char, 3> *arrayPointer = &array1;

    std::cout << &charPointer << std::endl;
    std::cout << &(*arrayPointer)[1] << std::endl;

    return 0;
}