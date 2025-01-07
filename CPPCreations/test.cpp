#include <iostream>
#include <map>
#include <vector>
#include <string>
#include <thread>
#include <cctype>
#include <mutex>

std::map<std::string, std::string> decBinConversionMap;
std::map<std::string, std::string> binDecConversionMap;

std::vector<std::string> convertBases(std::string &rawData, int toBase) {
    auto split = [] (std::string &rawData) {
        std::vector<std::string> textVector;
        while (text.find(' ') != std::string::npos) {
            const int endPos = text.find(' ');
            textVector.push_back(text.substr(0, endPos));
            text.erase(0, endPos+1);
        }
        textVector.push_back(text);
        return textVector;
    };

    auto handleThreadConversion = [toBase] (std::vector<std::string> &splitDataVector, int startAt, int endAt) {
        auto convertDecBin = [&splitDataVector] (int i) {
            std::string data = splitDataVector[i];
            if (decBinConversionMap.find(data) != decBinConversionMap.end()) {
                splitDataVector[i] = decBinConversionMap[data];
                return;
            } else {
                
            }
        };

        for (int i = startAt; i < endAt; i++) {
            switch(toBase) {
                case 0:
                    convertDecBin(i);
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
            threads.push_back(std::thread(handleThreadConversion, std::ref(splitDataVector), startAt, endAt));
        } else {
            const int startAt = extraLength*(normalLength+1) + (i-extraLength)*normalLength;
            const int endAt = startAt+normalLength;
            threads.push_back(std::thread(handleThreadConversion, std::ref(splitDataVector), startAt, endAt));
        }
    }

    for (auto &thread : threads) {
        thread.join();
    }

}

int main() {
    std::vector<std::string> convertedData = convertBases("128 20 38", 0);

    return 0;
}

/*
Multithreading
converts sections data
once it converts it swaps data in vector
adds num to bin to a map which allows faster calculation of repeats
*/