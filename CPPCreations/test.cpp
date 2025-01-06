#include <iostream>
#include <string>

int main() {
    int* ptr1 = new int;
    *ptr1 = 1;

    std::cout << *ptr1 << std::endl;

    int var1 = 2;
    delete ptr1;
    ptr1 = nullptr;
    std::cout << "ptr1: " << ptr1 << std::endl;
    ptr1 = &var1;
    std::cout << ptr1 << std::endl;

    std::cout << *ptr1 << std::endl;
    std::cout << ptr1 << ',' << &var1 << std::endl;

    *ptr1 = 3;
    std::cout << *ptr1 << ',' << var1 << std::endl;


    std::cout << var1 << std::endl;
    return 0;
}