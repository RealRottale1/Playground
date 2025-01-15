#include <iostream>
#include <array>
#include <string>

int main()
{
    int *number = new int;
    *number = 256;

    std::cout << number << ", " << &number << std::endl;
    return 0;
}