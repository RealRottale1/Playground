#include <iostream>
#include <array>
#include <stdlib.h>
#include <ctime>

void printPntrArray(std::array<int, 3> *pntrArray)
{
    for (int i = 0; i < 3; i++)
    {
        std::cout << (*pntrArray)[i] << ", ";
    }
    std::cout << std::endl;
}

int main()
{
    std::srand(std::time(0));
    std::array<int, 3> *pntrArray = new std::array<int, 3>;

    for (int i = 0; i < 3; i++)
    {
        (*pntrArray)[i] = std::rand() % 10;
    }

    printPntrArray(pntrArray);

    delete pntrArray;
    pntrArray = nullptr;

    int number = 7;
    int number2 = 8;
    int *numberPntr = new int;
    int *numberPntr2 = new int;
    numberPntr = &number; // This links the pointer to the refrence of number
    *numberPntr2 = number2; // This sets the pointer to the value of number2
    
    std::cout << "1: " << *numberPntr << std::endl;
    std::cout << "2: " << *numberPntr2 << std::endl;
    
    *numberPntr = 5;
    *numberPntr2 = 6;
    
    std::cout << "1: " << *numberPntr << std::endl;
    std::cout << "2: " << *numberPntr2 << std::endl;
    
    std::cout << "1: " << number << std::endl;
    std::cout << "2: " << number2 << std::endl;

    return 0;
}