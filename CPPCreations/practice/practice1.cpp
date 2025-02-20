#include <iostream>
#include <string>

int main() {
    std::string text = "0";

    std::string *heapPntr1 = new std::string; // Heap Pointer
    *heapPntr1 = text;
    *heapPntr1 = "1";

    std::string *stackPntr1 = &text; // Stack Pointer
    *stackPntr1 = "2";

    std::string *stackPntr2 = stackPntr1; // Stack Pointer
    *stackPntr2 = "3";

    std::string *stackPntr5 = stackPntr2; // Stack Pointer
    *stackPntr5 = "5";

    std::cout << &text << " , " << stackPntr1 << " , " << stackPntr2 << " , " << stackPntr5 << std::endl;

    std::string **stackPntr3 = &stackPntr2;
    **stackPntr3 = "4";

    std::cout << "text: " << text << std::endl;
    std::cout << "*heapPntr1: " << *heapPntr1 << std::endl;
    std::cout << "*stackPntr1: " << *stackPntr1 << std::endl;
    std::cout << "*stackPntr2: " << *stackPntr2 << std::endl;
    std::cout << "**stackPntr3: " << **stackPntr3 << std::endl;

    return 0;
}