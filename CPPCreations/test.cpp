#include <iostream>
#include <string>

int main() {
    std::string *pointer1 = new std::string;
    *pointer1 = "Hello!";

    std::cout << *pointer1 << std::endl;

    std::string byeMessage = "Goodbye!";
    delete pointer1;
    pointer1 = &byeMessage;

    std::cout << *pointer1 << std::endl;

    *pointer1 = "Hello!";
    pointer1 = nullptr;

    std::cout << byeMessage << std::endl;

    return 0;
}