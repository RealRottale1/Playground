#include <iostream>
#include <string>
#include <algorithm>
#include <stdexcept>
#include <map>
#include <vector>
#include <ctype.h>

int makeParts(std::vector<std::map<std::string, std::string>>& equationSection, std::string part) {
    const int sections = std::count(part.begin(), part.end(), '+')+1;
    int startIndex = 0;
    
    for (int i = 0; i < sections; i++) {
        const size_t plusPos = part.find('+', startIndex);
        const int endIndex = (plusPos != std::string::npos) ? plusPos : part.length();
        const std::string portion = part.substr(startIndex, endIndex - startIndex);
        const int portionSize = portion.length();
        std::cout << "Portion Size: " << portionSize << std::endl;
        std::map<std::string, std::string> portionMap;
        std::string element;
        std::string number; 
        for (int j = 0; j < portionSize; j++) {
            const char character = portion[j];
            std::cout << "Character: " << character << std::endl;
            if (!isdigit(character)) {
                if (number.length() > 0) {
                    portionMap[element] = number;
                    element = "";
                    number = "";
                };
                element += character;
            } else {
                number += character;
            };
        };
        if (number.length() > 0) {
            portionMap[element] = number;
        };

        equationSection.push_back(portionMap);
        if (plusPos != std::string::npos) {
            startIndex = plusPos + 1;
        } else {
            break;
        };
    };

    return sections;
};

std::string balanceEquation(std::string source) {
    
    class equationClass {
        public:
            std::vector<std::map<std::string, std::string>> reactants;
            std::vector<std::map<std::string, std::string>> products;
    };

    source.erase(std::remove(source.begin(), source.end(), ' '), source.end());
    int midPoint = source.find('>', 0);
    if (midPoint <= 0) {
        throw std::invalid_argument("Invalid Equation!");
    };

    std::string reactants = source.substr(0, midPoint);
    std::string products = source.substr(midPoint+1, source.length());

    equationClass equationTable;
    int totalParts = 0;
    totalParts += makeParts(equationTable.reactants, reactants);


    // Output the reactants
    std::cout << "AHHHHHHHHHHHHHHHHHHHHHHHh:" << std::endl;
    for (const auto& map : equationTable.reactants) {
        for (const auto& pair : map) {
            std::cout << pair.first << ": " << pair.second << " " << std::endl;
        }
        std::cout << "NEXT SECTION!" << std::endl;
    }
    return source;
}

int main() {
    std::string balancedEquation = balanceEquation("H2O1 + U2Z4T7 + C4 + F3 > H4O2 + F6");
    std::cout << balancedEquation;
};