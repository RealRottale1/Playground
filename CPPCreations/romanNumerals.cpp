#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>
#include <stdexcept>

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
                    romanValue += romanValues[j].second + romanValues[i].second;
                };
            };
        };
    };
    return romanValue;
};

int unromanify(const std::string &romanValue) {
    std::map<char, std::pair<int, int>> romanValues = {{'M', {0, 1000}}, {'D', {1, 500}}, {'C', {2, 100}}, {'L', {3, 50}}, {'X', {4, 10}}, {'V', {5, 5}}, {'I', {6, 1}}};
    int romanValueLength = romanValue.length();
    int value;
    for (int i = romanValueLength-1; i >= 0; i--) {
        const char currentChar = romanValue[i];
        if (romanValues.find(currentChar) != romanValues.end()) {
            if (i-1 >= 0) {
                const char nextChar = romanValue[i-1];
                if (romanValues.find(nextChar) != romanValues.end()) {
                    if (romanValues[currentChar].second > romanValues[nextChar].second) {
                        if ((romanValues[currentChar].second - romanValues[nextChar].second) == romanValues[nextChar].second) {
                            throw std::invalid_argument("Invalid Roman Numeral!");
                        } else {
                            const int totalDigits = std::string(romanValues[currentChar].second).length();
                            if ((romanValues[currentChar].second - (1*romanValues[currentChar].second)) == (romanValues[currentChar].second - romanValues[nextChar].second)) {
                                value += romanValues[currentChar].second - romanValues[nextChar].second;
                                --i;
                            } else {
                                throw std::invalid_argument("Invalid Roman Numeral!");
                            };
                        };
                    } else {
                        if ((romanValues[currentChar].second + romanValues[nextChar].second) == romanValues[currentChar].second*2) {
                            throw std::invalid_argument("Invalid Roman Numeral!");
                        } else {
                            value += romanValues[currentChar].second;
                        }
                    };
                } else {
                    throw std::invalid_argument("Invalid Roman Numeral!");
                }
            } else {
                value += romanValues[currentChar].second;
            };
        } else {
            throw std::invalid_argument("Invalid Roman Numeral!");
        };
    };
    return value;
};

int main() {
    std::cout << romanify(10) << std::endl;  
    std::cout << unromanify("XD") << std::endl;  
    return 0;
};