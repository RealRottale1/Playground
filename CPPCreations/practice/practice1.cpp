#include <iostream>
#include <string>

int main() {
    std::string text = "0";

    std::string *stackPntr1 = &text;

    std::string *stackPntr2 = stackPntr1;

    std::string **stackPntr3 = &stackPntr2;

    **stackPntr3 = "1";

    std::cout << text;

    return 0;
}