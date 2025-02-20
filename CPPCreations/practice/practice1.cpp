#include <iostream>
#include <string>

struct block {
    int position[3] = {0, 0, 0};
    std::string name;

    block(int x, int y, int z, std::string name) {
        this->position[0] = x;
        this->position[1] = y;
        this->position[2] = z;
        this->name = name;
    }
    
    std::string printPosition() {
        return "X:" + std::to_string(this->position[0]) + ", Y:" + std::to_string(this->position[1]) + ", Z:" + std::to_string(this->position[2]);
    }
};

int main() {

    block dirt(5, 15, 10, "dirt");
    std::cout << dirt.printPosition();

    std::cout << std::endl;

    block *pntr = &dirt; // Stack Pointer
    std::cout << "Memory location of dirt stored: " << &dirt << std::endl;
    std::cout << "Memory location of dirt stored as the value of a pointer: " << pntr << std::endl; // Use pntr-> to access values not *pntr. This is because the pntr points to an instance and not a value and thus needs the -> operator to access any values (pntr holds a refrence not a value)
    std::cout << "Memory location of a pointer that points to the memory location of dirt" << &pntr << std::endl;
    
    /////////////////////Seperate Testing/////////////////////
    int *numPntr = new int; // Heap Pointer
    *numPntr = 9;

    int *stackPntr = numPntr; // Stack Pointer


    std::cout << "Heap pntr value: " << *numPntr << std::endl;
    std::cout << "Stack pntr value: " << *stackPntr << std::endl;
    std::cout << "Heap pntr stores memory location to int value: " << numPntr << std::endl;
    std::cout << "Stack pntr stores memory location to int value: " << stackPntr << std::endl;
    std::cout << "Memory location of heap pntr: " << &numPntr << std::endl;
    std::cout << "Memory location of stack pntr: " << &stackPntr << std::endl;

    stackPntr = nullptr;
    delete numPntr; // You must manually delete heap data
    numPntr = nullptr;

    std::cout << stackPntr << std::endl;
    std::cout << numPntr << std::endl;

    return 0;
}