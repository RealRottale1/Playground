#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

std::vector<std::string> sortVector(std::vector<std::string> &data) {
    std::map<char, std::vector<std::string>> wordMap;
    const int dataSize = data.size();
    for (int i = 0; i < dataSize; i++) {
        const std::string word = data[i];
        const char firstChar = word[0];
        if (wordMap.find(firstChar) == wordMap.end()) {
            std::vector<std::string> newVector;
            wordMap.insert({firstChar, newVector});
            wordMap[int(firstChar)].push_back(word);
        } else {
            wordMap[int(firstChar)].push_back(word);
        };
    };
    auto sortByASCIIValue = [] (std::vector<std::string> &wordVector, int wordVectorSize) {
        if (wordVectorSize <= 1) {
            return;
        };
        while (true) {
            bool swapped = false;
            for (int i = 0; i < wordVectorSize-1; i++) {
                const std::string currentWord = wordVector[i];
                const std::string nextWord = wordVector[i+1];
                const int maxLength = std::max(currentWord.length(), nextWord.length());
                for (int j = 0; j < maxLength; j++) {
                    const char currentChar = currentWord[j];
                    const char nextChar = nextWord[j];
                    if (int(currentChar) < int(nextChar)) {
                        break;
                    } else if (int(currentChar) > int(nextChar)) {
                        swapped = true;
                        std::swap(wordVector[i], wordVector[i+1]);
                        break;
                    };
                };
            };
            if (!swapped) {
                break;
            }
        };
    };
    for (auto &wordPair : wordMap) {
        std::vector<std::string> &wordVector = wordPair.second;
        const int wordVectorSize = wordVector.size();
        sortByASCIIValue(wordVector, wordVectorSize);
    };
    std::vector<std::string> sortedVector;
    for (auto &wordPair : wordMap) {
        std::vector<std::string> &wordVector = wordPair.second;
        const int wordVectorSize = wordVector.size();
        for (int i = 0; i < wordVectorSize; i++) {
            sortedVector.push_back(wordVector[i]);
        };
    };
    return sortedVector;
};

std::vector<float> sortVector(std::vector<float> &data) {
    std::vector<float> negativeNumbers;
    std::vector<float> positiveNumbers;
    const int dataSize = data.size();
    for (int i = 0; i < dataSize; i++) {
        const float number = data[i];
        if (number < 0) {
            negativeNumbers.push_back(number);
        } else {
            positiveNumbers.push_back(number);
        };
    };
    std::vector<float> allNumbers;
    for (int i = 0; i < 2; i++) {
        std::vector<float>& useVector = (i ? negativeNumbers : positiveNumbers);
        const int useVectorSize = useVector.size();
        while (true) {
            bool swapped = false;
            for (int j = 0; j < useVectorSize-1; j++) {
                const float currentNumber = useVector[j];
                const float nextNumber = useVector[j+1];
                if (currentNumber > nextNumber) {
                    swapped = true;
                    std::swap(useVector[j], useVector[j+1]);
                }
            };
            if (!swapped) {
                break;
            };
        };
        allNumbers.insert(allNumbers.begin(), useVector.begin(), useVector.end());
    };
    return allNumbers;
};

int main() {
    std::vector<std::string> data = {
    "45.6", "apple", "-23.4", "banana", "12.3", "carrot", "-67.8", "date",
    "89.1", "elephant", "-45.3", "frog", "56.7", "grape", "-78.9", "honey",
    "34.2", "igloo", "-9.8", "jungle", "23.4", "kiwi", "-90.1", "lemon",
    "12.5", "mango", "-45.6", "nectarine", "67.8", "orange", "-89.0", "pear",
    "45.1", "quokka", "-34.7", "raspberry", "78.2", "strawberry", "-56.3", "tomato",
    "23.8", "umbrella", "-90.5", "violet", "67.4", "watermelon", "-78.1", "xylophone",
    "34.6", "yacht", "-23.7", "zebra", "89.9", "alpha", "-45.5", "beta",
    "12.2", "gamma", "-67.9", "delta", "23.1", "epsilon", "-78.3", "zeta",
    "34.9", "eta", "-90.2", "theta", "45.3", "iota", "-23.5", "kappa",
    "56.1", "lambda", "-34.4", "mu", "78.6", "nu", "-45.2", "xi",
    "89.5", "omicron", "-67.3", "pi", "12.4", "rho", "-90.6", "sigma",
    "34.8", "tau", "-78.7", "upsilon", "67.3", "phi", "-23.6", "chi",
    "45.4", "psi", "-12.9", "omega", "56.9", "apple", "-89.7", "banana",
    "12.7", "carrot", "-67.6", "date", "78.4", "elephant", "-23.8", "frog",
    "34.5", "grape", "-45.1", "honey", "56.8", "igloo", "-90.7", "jungle",
    "67.1", "kiwi", "-78.5", "lemon", "23.9", "mango", "-12.8", "nectarine",
    "89.6", "orange", "-45.8", "pear", "34.7", "quokka", "-67.2", "raspberry",
    "12.6", "strawberry", "-23.9", "tomato", "78.7", "umbrella", "-45.9", "violet",
    "89.3", "watermelon", "-78.8", "xylophone", "56.5", "yacht", "-90.8", "zebra",
    "34.3", "alpha", "-67.7", "beta", "12.8", "gamma", "-45.4", "delta",
    "78.8", "epsilon", "-23.3", "zeta", "67.2", "eta", "-89.2", "theta",
    "45.5", "iota", "-12.3", "kappa", "34.1", "lambda", "-78.4", "mu",
    "56.2", "nu", "-45.6", "xi", "89.2", "omicron", "-67.1", "pi",
    "23.7", "rho", "-90.4", "sigma", "78.1", "tau", "-12.6", "upsilon",
    "45.7", "phi", "-23.2", "chi", "67.6", "psi", "-34.9", "omega",
    "89.4", "apple", "-90.3", "banana", "34.4", "carrot", "-67.5", "date",
    "45.8", "elephant", "-12.5", "frog", "56.4", "grape", "-45.7", "honey",
    "78.3", "igloo", "-23.4", "jungle", "12.9", "kiwi", "-78.6", "lemon"
};
    std::vector<std::string> sortedData = sortVector(data);

    const int sortedDataSize = sortedData.size();
    for (int i = 0; i < sortedDataSize; i++) {
        std::cout << sortedData[i] << ", " << std::endl;
    };

    return 0;
};