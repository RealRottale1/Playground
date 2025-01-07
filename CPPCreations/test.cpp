#include <iostream>
#include <map>
#include <vector>
#include <string>
#include <thread>
#include <cctype>
#include <cmath>
#include <mutex>
#include <chrono>

std::mutex conversionMapMutex;
std::map<std::string, std::string> decBinConversionMap;
std::map<std::string, std::string> binDecConversionMap;

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

    auto handleDecBinConversionThread = [] (std::vector<std::string> &splitDataVector, int startAt, int endAt) {
        for (int i = startAt; i < endAt; i++) {
            if (decBinConversionMap.find(splitDataVector[i]) != decBinConversionMap.end()) {
                splitDataVector[i] = decBinConversionMap[splitDataVector[i]];
            } else {
                unsigned int decimalValue = std::stoi(splitDataVector[i]);
                unsigned int byteAmount = 7;
                do {
                    unsigned int maxByteAmount = std::pow(2, byteAmount);
                    if (decimalValue <= maxByteAmount) {
                        std::string binaryString;
                        for (int j = byteAmount; j >= 0; j--) {
                            unsigned int value = std::pow(2, j);
                            if (decimalValue >= value) {
                                binaryString += '1';
                                decimalValue -= value;
                            } else {
                                binaryString += '0';
                            }
                        }
                        std::lock_guard<std::mutex> lock(conversionMapMutex);
                        decBinConversionMap.insert({splitDataVector[i], binaryString});
                        binDecConversionMap.insert({binaryString, splitDataVector[i]});
                        splitDataVector[i] = binaryString;
                        break;
                    }
                    byteAmount += 8;
                } while (true);
            }
        }
    };

    std::vector<std::string> splitDataVector = split(rawData);

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
            threads.push_back(std::thread(handleDecBinConversionThread, std::ref(splitDataVector), startAt, endAt));
        } else {
            const int startAt = extraLength*(normalLength+1) + (i-extraLength)*normalLength;
            const int endAt = startAt+normalLength;
            threads.push_back(std::thread(handleDecBinConversionThread, std::ref(splitDataVector), startAt, endAt));
        }
    }

    for (auto &thread : threads) {
        thread.join(); 
    }

    return splitDataVector;
}

// 0=dec, 1=bin, 2=hex
int main() {
    std::string numbers = "";
    
    auto startTime = std::chrono::high_resolution_clock::now();
    std::vector<std::string> convertedData = convertBases(numbers, 0, 1);
    auto endTime = std::chrono::high_resolution_clock::now();

    /*int convertedDataSize = convertedData.size();
    for (int i = 0; i < convertedDataSize; i++) {
        std::cout << convertedData[i] << ", ";
    }*/

    std::cout << std::endl << "Data Converted in " << std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count() << " milliseconds!" << std::endl;
    return 0;
}

/*
Multithreading
converts sections data
once it converts it swaps data in vector
adds num to bin to a map which allows faster calculation of repeats
*/