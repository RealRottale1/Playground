#include <iostream>
#include <string>

int main() {
    std::string* pntr1 = new std::string;
    *pntr1 = "Hello!";

    std::cout << *pntr1 << std::endl;

    std::string* pntr2 = new std::string;
    *pntr2 = "Bello!";

    std::cout << *pntr2 << std::endl;

    std::string GoodbyeMessage = "Goodbye!";

    delete pntr2;
    pntr2 = nullptr;
    
    pntr2 = &GoodbyeMessage;

    std::cout << *pntr2 << std::endl;

    delete pntr1;
    pntr1 = nullptr;

    pntr1 = pntr2;

    std::cout << pntr1 << "," << pntr2 << std::endl;

    return 0;
}