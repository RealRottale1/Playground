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
            std::map<std::string, int> portion = section[i];
            for (auto pair = portion.begin(); pair != portion.end(); pair++) {
                pair->second *= multiplier[i+multiplierStart];
            };
        };
    };

    auto merge = [] (std::vector<std::map<std::string, int>>& section, int sectionLength) {
        for (int i = 0; i < sectionLength; i++) {
            std::map<std::string, int> portion = section[i];
            for (auto pair = portion.begin(); pair != portion.end(); pair++) {
                if (section[0].find(pair->first) != section[0].end()) {
                    section[0][pair->first] += pair->second;
                } else {
                    section[0][pair->first] = pair->second;
                };
            };
        };
        section.erase(section.begin()+1, section.end());
    };

    const int reactantsLength = equationTable.reactants.size();
    const int productsLength = equationTable.products.size(); 

    multiply(equationTable.reactants, reactantsLength, 0);
    multiply(equationTable.products, productsLength, reactantsLength);
    merge(equationTable.reactants, reactantsLength);
    merge(equationTable.products, productsLength);
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

    auto tryMultiplier = [multiplierI, multiplierLength, &multiplier, equationTable](bool reverse) {
        multiplier = nextMultiplier(multiplierI, multiplierLength, reverse);
        const bool solvedEquation = multiplyAndCalculate(equationTable, multiplierI, multiplier);
        return solvedEquation;
    };

    while (true) {
        bool solvedEquation = tryMultiplier(false);
        if (solvedEquation) {
            return "Convert multiplier vector to string!";
        };

        solvedEquation = tryMultiplier(true);
        if (solvedEquation) {
            return "Convert multiplier vector to string!";
        };

        multiplierI += 1;
        if (multiplierI >= maxLimit) {
            throw std::invalid_argument("Equation Unsolvable/Too Big!");
        };

        if (!(multiplierI % 1000)) {
            std::this_thread::sleep_for(std::chrono::seconds(1));
        };
        break;
    };

    return "something went wrong!";
}

int main() {
    std::string balancedEquation = balanceEquation("H2O1 + U2Z4T7 + C4 + F3 > H4O2 + F6");
    std::cout << balancedEquation;
};