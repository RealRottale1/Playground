#include <iostream>
#include <map>
#include <vector>
#include <string>
#include <thread>
#include <cctype>
#include <cmath>
#include <chrono>

    void handleDecBinConversionThread(std::vector<std::string> &splitDataVector, int startAt, int endAt) {
        std::map<std::string, std::string> decBinConversionMap;
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
                        decBinConversionMap.insert({splitDataVector[i], binaryString});
                        splitDataVector[i] = binaryString;
                        break;
                    }
                    byteAmount += 8;
                } while (true);
            }
        }
    };

    void handleBinDecConversionThread(std::vector<std::string> &splitDataVector, int startAt, int endAt) {
        std::map<std::string, std::string> binDecConversionMap;
        for (int i = startAt; i < endAt; i++) {
            if (binDecConversionMap.find(splitDataVector[i]) != binDecConversionMap.end()) {
                splitDataVector[i] = binDecConversionMap[splitDataVector[i]];
            } else {
                const unsigned int binaryValueLength = splitDataVector[i].length();
                unsigned int binaryValue = 0;
                for (int j = binaryValueLength-1; j >= 0; j--) {
                    if (splitDataVector[i][j] == '1') {
                        binaryValue += std::pow(2, ((binaryValueLength-1)-j));
                    }
                }
                std::string stringBinaryValue = std::to_string(binaryValue);
                binDecConversionMap.insert({splitDataVector[i], stringBinaryValue});
                splitDataVector[i] = stringBinaryValue;
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

    auto handleThreadAssignment = [] (std::vector<std::string> &splitDataVector, int startAt, int endAt, int fromBase, int toBase) {
        switch(fromBase) {
            case 0:
                switch(toBase) {
                    case 1:
                        handleDecBinConversionThread(splitDataVector, startAt, endAt);
                        break;
                    case 2:
                        break;
                        //decHex
                }
                break;
            case 1:
                switch(toBase) {
                    case 0:
                        handleBinDecConversionThread(splitDataVector, startAt, endAt);
                        break;
                    case 2:
                        break;
                        //binHex
                }
                break;
            case 2:
                switch(toBase) {
                    case 0:
                        break;
                        //hexDec
                    case 1:
                        break;
                        //hexBin
                }
                break;
        }
    };

    std::vector<std::thread> threads;
    const int optimalThreadCount = std::thread::hardware_concurrency();
    const int splitDataVectorSize = splitDataVector.size();
    const int useThreadCount = (optimalThreadCount > splitDataVectorSize ? splitDataVectorSize : optimalThreadCount);
    const int extraLength = (splitDataVectorSize > optimalThreadCount ? splitDataVectorSize % optimalThreadCount : 0);
    const int normalLength = (splitDataVectorSize - extraLength)/useThreadCount;


    //handleDecBinConversionThread(std::ref(splitDataVector), 0, splitDataVectorSize);
    for (int i = 0; i < useThreadCount; i++) {
        if (i < extraLength) {
            const int startAt = i*(normalLength+1);
            const int endAt = startAt+normalLength+1;
            threads.push_back(std::thread(handleThreadAssignment, std::ref(splitDataVector), startAt, endAt, fromBase, toBase));
        } else {
            const int startAt = extraLength*(normalLength+1) + (i-extraLength)*normalLength;
            const int endAt = startAt+normalLength;
            threads.push_back(std::thread(handleThreadAssignment, std::ref(splitDataVector), startAt, endAt,  fromBase, toBase));
        }
    }

    for (auto &thread : threads) {
        thread.join(); 
    }

    return splitDataVector;
}

// 0=dec, 1=bin, 2=hex
int main() {
    std::string numbers = "0011 111111";
    
    auto startTime = std::chrono::high_resolution_clock::now();
    std::vector<std::string> convertedData = convertBases(numbers, 1, 0);
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