#include <iostream>
#include <map>
#include <vector>
#include <string>
#include <thread>
#include <cctype>
#include <cmath>
#include <chrono>
#include <array>
#include <algorithm>

std::array<char, 36> base36Array = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};

void handleConversionThread(std::vector<std::string> &splitDataVector, int startAt, int endAt, int fromBase, int toBase) {
    auto getCharValue = [] (char character) {
        auto iterator = std::find(base36Array.begin(), base36Array.end(),character);
        if (iterator != base36Array.end()) {
            std::cout << "Iterator: " << iterator << std::endl;
            const int textValue = std::distance(base36Array.begin(), iterator);
            return textValue;
        }
        return 0;
    };
    
    std::map<std::string, std::string> baseMap;

    for (int i = startAt; i < endAt; i++) {
        if (baseMap.find(splitDataVector[i]) != baseMap.end()) {
            splitDataVector[i] = baseMap[splitDataVector[i]];
        } else {
            unsigned long long base10Value = 0;
            if (fromBase == 10) {
                base10Value = std::stoi(splitDataVector[i]);
            } else {
                const unsigned long long textLength = splitDataVector[i].length();
                for (int j = 0; j < textLength; j++) {
                    // Debug! std::cout << "CharVal: " << getCharValue(splitDataVector[i][j]) << ", Base: " << fromBase << ", Power: " << textLength - j - 1 << std::endl;
                    base10Value += (getCharValue(splitDataVector[i][j]) * std::pow(fromBase, textLength - j - 1));
                }
            }

            std::string convertedValue = "";
            if (toBase == 10) {
                convertedValue = std::to_string(base10Value);
            } else {
                while (base10Value > 0) {
                    const int whole = base10Value / toBase;
                    const int remainder = base10Value % toBase;
                    convertedValue = base36Array[remainder] + convertedValue;
                    base10Value = whole;
                }
            }
            
            baseMap.insert({splitDataVector[i], convertedValue});
            splitDataVector[i] = convertedValue;
        }
    }
};

std::vector<std::string> convertBases(std::string &rawData, int fromBase, int toBase) {
    auto split = [] (std::string &rawData) {
        std::vector<std::string> textVector;
        while (rawData.find(' ') != std::string::npos) {
            const int endPos = rawData.find(' ');
            textVector.push_back(rawData.substr(0, endPos));
            rawData.erase(0, endPos+1);
        }
        textVector.push_back(rawData);
        return textVector;
    };

    std::vector<std::string> splitDataVector = split(rawData);

    if (fromBase == toBase) {
        return splitDataVector;
    }

    if (fromBase < 2 || fromBase > 36 || toBase < 2 || toBase > 36) {
        std::cout << "ERROR! - To and from bases must be >1 and <37!" << std::endl;
        return splitDataVector;
    }

    std::vector<std::thread> threads;
    const int optimalThreadCount = std::thread::hardware_concurrency();
    const int splitDataVectorSize = splitDataVector.size();
    const int useThreadCount = (optimalThreadCount > splitDataVectorSize ? splitDataVectorSize : optimalThreadCount);
    const int extraLength = (splitDataVectorSize > optimalThreadCount ? splitDataVectorSize % optimalThreadCount : 0);
    const int normalLength = (splitDataVectorSize - extraLength)/useThreadCount;

    for (int i = 0; i < useThreadCount; i++) {
        if (i < extraLength) {
            const int startAt = i*(normalLength+1);
            const int endAt = startAt+normalLength+1;
            threads.push_back(std::thread(handleConversionThread, std::ref(splitDataVector), startAt, endAt, fromBase, toBase));
        } else {
            const int startAt = extraLength*(normalLength+1) + (i-extraLength)*normalLength;
            const int endAt = startAt+normalLength;
            threads.push_back(std::thread(handleConversionThread, std::ref(splitDataVector), startAt, endAt,  fromBase, toBase));
        }
    }

    for (auto &thread : threads) {
        thread.join(); 
    }

    return splitDataVector;
}

int main() {
    std::string numbers = "943 251 870";
    
    auto startTime = std::chrono::high_resolution_clock::now();
    std::vector<std::string> convertedData = convertBases(numbers, 10, 16);
    auto endTime = std::chrono::high_resolution_clock::now();

    int convertedDataSize = convertedData.size();
    for (int i = 0; i < convertedDataSize; i++) {
        std::cout << convertedData[i] << ", ";
    }

    std::cout << std::endl << "Data Converted in " << std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count() << " milliseconds!" << std::endl;
    return 0;
}

/*
Multithreading
converts sections data
once it converts it swaps data in vector
adds num to bin to a map which allows faster calculation of repeats
*/