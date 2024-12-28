#include <iostream>
#include <string>
#include <algorithm>
#include <stdexcept>
#include <map>
#include <vector>
#include <ctype.h>
#include <thread>
#include <chrono>
#include <cmath>

class equationClass {
    public:
        std::vector<std::map<std::string, int>> reactants;
        std::vector<std::map<std::string, int>> products;
};


int makeParts(std::vector<std::map<std::string, int>>& equationSection, std::string part) {
    const int sections = std::count(part.begin(), part.end(), '+')+1;
    int startIndex = 0;
    
    for (int i = 0; i < sections; i++) {
        const size_t plusPos = part.find('+', startIndex);
        const int endIndex = (plusPos != std::string::npos) ? plusPos : part.length();
        const std::string portion = part.substr(startIndex, endIndex - startIndex);
        const int portionSize = portion.length();
        std::cout << "Portion Size: " << portionSize << std::endl;
        std::map<std::string, int> portionMap;
        std::string element;
        std::string number; 
        for (int j = 0; j < portionSize; j++) {
            const char character = portion[j];
            std::cout << "Character: " << character << std::endl;
            if (!isdigit(character)) {
                if (number.length() > 0) {
                    portionMap[element] = std::stoi(number);
                    element = "";
                    number = "";
                };
                element += character;
            } else {
                number += character;
            };
        };
        if (number.length() > 0) {
            portionMap[element] = std::stoi(number);
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

std::vector<int> nextMultiplier(int index, int length, bool reverse) {
    std::vector<int> combination;
    for (int i = 0; i < length; i++) {
        const int digit = (!reverse ? (index%9)+1 : 9 - (index%9));
        combination.insert(combination.begin(), digit);
        index = std::floor(index/9);
    };
    return combination;
};

bool multiplyAndCalculate(equationClass equationTable, int multiplierI, std::vector<int> multiplier) {
    auto multiply = [multiplier] (std::vector<std::map<std::string, int>>& section, int sectionLength, int multiplierStart) {
        for (int i = 0; i < sectionLength; i++) {
            std::map<std::string, int>& portion = section[i];
            for (auto& pair : portion) {
                pair.second *= multiplier[i+multiplierStart];
            };
        };
    };

    auto merge = [] (std::vector<std::map<std::string, int>>& section, int sectionLength) {
        for (int i = 1; i < sectionLength; i++) {
            std::map<std::string, int>& portion = section[i];
            for (auto& pair : portion) {
                if (section[0].find(pair.first) != section[0].end()) {
                    section[0][pair.first] += pair.second;
                } else {
                    section[0][pair.first] = pair.second;
                };
            };
        };
        section.erase(section.begin()+1, section.end());
    };

    const int reactantsLength = equationTable.reactants.size();
    const int productsLength = equationTable.products.size(); 

    /*//Debug
    std::cout << "Multiplier: ";
    for (int i = 0; i < multiplier.size(); i++) {
        std::cout << multiplier[i];
    };
    std::cout << std::endl;*/

    multiply(equationTable.reactants, reactantsLength, 0);
    multiply(equationTable.products, productsLength, reactantsLength);

    merge(equationTable.reactants, reactantsLength);
    merge(equationTable.products, productsLength);

    for (auto pair = equationTable.reactants[0].begin(); pair != equationTable.reactants[0].end(); pair++) {
        if (equationTable.products[0].find(pair->first) != equationTable.products[0].end()) {
            if (equationTable.products[0][pair->first] != equationTable.reactants[0][pair->first]) {
                return false;
            };
        } else {
            throw std::invalid_argument("Unclosed Equation!");
        };
    };

    return true;
};

std::string balanceEquation(std::string source) {
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
    totalParts += makeParts(equationTable.products, products);
    std::vector<int> multiplier;
    const int multiplierLength = (equationTable.reactants.size() + equationTable.products.size());
    for (int i = 0; i < multiplierLength; i++) {
        multiplier.push_back(1);
    };
    int multiplierI = 1;
    const std::int64_t maxLimit = (std::pow(9, totalParts))/2;

    /*//Debug
    for (int i = 0; i < equationTable.reactants.size(); i++) {
        std::map<std::string, int>& portion = equationTable.reactants[i];
        std::cout << "Pair: ";
        for (auto& pair : portion) {
            std::cout << pair.first << ":" << pair.second << ", ";
        };
        std::cout << "---------------";
    };
    std::cout << std::endl << "Products VVV" << std::endl;
    for (int i = 0; i < equationTable.products.size(); i++) {
        std::map<std::string, int>& portion = equationTable.products[i];
        std::cout << "Pair: ";
        for (auto& pair : portion) {
            std::cout << pair.first << ":" << pair.second << ", ";
        };
        std::cout << "---------------";
    };
    std::cout << std::endl << std::endl;*/

    auto tryMultiplier = [&multiplierI, multiplierLength, &multiplier, equationTable](bool reverse) {
        multiplier = nextMultiplier(multiplierI, multiplierLength, reverse);
        const bool solvedEquation = multiplyAndCalculate(equationTable, multiplierI, multiplier);
        return solvedEquation;
    };

    while (true) {
        if (tryMultiplier(false)) {
            std::cout << "Multiplier: ";
            for (int i = 0; i < multiplierLength; i++) {
                std::cout << multiplier[i];
            };
            std::cout << std::endl;
            return "Convert multiplier vector to string!";
        };

        if (tryMultiplier(true)) {
            std::cout << "Multiplier: ";
            for (int i = 0; i < multiplierLength; i++) {
                std::cout << multiplier[i];
            };
            std::cout << std::endl;
            return "Convert multiplier vector to string!";
        };

        multiplierI += 1;
        if (multiplierI >= maxLimit) {
            throw std::invalid_argument("Equation Unsolvable/Too Big!");
        };

        if (!(multiplierI % 50000)) {
            std::this_thread::sleep_for(std::chrono::milliseconds(1));
        };
    };

    return "something went wrong!";
}

int main() {
    std::string balancedEquation = balanceEquation("A1 + B2 + C3 + D2 + E1 > E9 + D8 + C7 + B8 + A9");
    std::cout << balancedEquation;
};