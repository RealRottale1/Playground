#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <stdexcept>
#include <cmath>

std::string romanify(int value) {
    if (value <= 0) {
        throw std::invalid_argument("Cannot Convert To Value Less Than 1!");
    };
    std::map<int, std::pair<int, char>> romanValues = {{0, {1000, 'M'}}, {1, {500, 'D'}}, {2, {100, 'C'}}, {3, {50, 'L'}}, {4, {10, 'X'}}, {5, {5, 'V'}}, {6, {1, 'I'}}};
    std::string romanValue = "";
    for (int i = 0; i < 7; i++) {
        while (value >= romanValues[i].first) {
            value -= romanValues[i].first;
            romanValue += romanValues[i].second;
        };
        if (i != 6) {
            for (int j = i+1; j < 7; j++) {
                const int difference = (romanValues[i].first - romanValues[j].first);
                if (value >= difference && difference != romanValues[j].first) {
                    value -= difference;
                    romanValue += romanValues[j].second;
                    romanValue += romanValues[i].second;
                };
            };
        };
    };
    return romanValue;
};

int unromanify(const std::string &romanValue) {
    auto checkSubtraction = [] (char firstChar,char secondChar) {
        if (firstChar == secondChar) {
            return true;
        };
        if (secondChar == 'I' && (firstChar == 'V' || firstChar == 'X')) {
            return true;
        };
        if (secondChar == 'X' && (firstChar == 'L' || firstChar == 'C')) {
            return true;
        };
        if (secondChar == 'C' && (firstChar == 'D' || firstChar == 'M')) {
            return true;
        };
        return false;
    };

    std::map<char, std::pair<int, int>> romanValues = {{'M', {0, 1000}}, {'D', {1, 500}}, {'C', {2, 100}}, {'L', {3, 50}}, {'X', {4, 10}}, {'V', {5, 5}}, {'I', {6, 1}}};
    int romanValueLength = romanValue.length();
    int value;
    for (int i = romanValueLength-1; i >= 0; i--) {
        char firstChar = romanValue[i];
        char secondChar = (((i-1)>=0) ? romanValue[i-1] : '_');
        char thirdChar = (((i-2)>=0) ? romanValue[i-2] : '_');
        char fourthChar = (((i-3)>=0) ? romanValue[i-3] : '_');
        if (firstChar == secondChar && secondChar == thirdChar && thirdChar == fourthChar) {
            throw std::invalid_argument("Roman Numerals Cannot Repeat More Than 3 Times!");
        };
        if (romanValues.find(firstChar) != romanValues.end()) {
            if (secondChar) {
                if (romanValues.find(secondChar) != romanValues.end()) {
                    if (romanValues[firstChar].second > romanValues[secondChar].second) {
                        if (thirdChar && thirdChar == secondChar) {
                            throw std::invalid_argument("Invalid Roman Numeral Arrangement!");
                        };
                        const bool validSubtraction = checkSubtraction(firstChar, secondChar);
                        if (validSubtraction) {
                            value += (romanValues[firstChar].second - romanValues[secondChar].second);
                        } else {
                            throw std::invalid_argument("Invalid Subtraction Detected!");
                            break;
                        };
                    } else {
                        value += romanValues[firstChar].second;
                        --i;
                    };
                } else if (secondChar != '_') {
                    throw std::invalid_argument("Invalid Roman Numeral Character Detected!");
                };
            } else {
                value += romanValues[firstChar].second;
            };
        } else { 
           throw std::invalid_argument("Invalid Roman Numeral Character Detected!");
        };
    };
    return value;
};

int main() {
    std::cout << unromanify("IIIV") << std::endl;  
    return 0;
};

//IIX - Invalid because it is equal to 10 and should thus be X