#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <algorithm>

void sortVector(std::vector<std::string> &wordVector, int wordVectorSize) {
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

std::vector<std::string> sortStrings(std::vector<std::string> &data) {
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

    for (auto &wordPair : wordMap) {
        std::vector<std::string> &wordVector = wordPair.second;
        const int wordVectorSize = wordVector.size();
        sortVector(wordVector, wordVectorSize);
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

std::vector<float> sortNumbers(std::vector<float> &data) {
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
    std::vector<std::string> stringData = {"orange", "apple", "ant", "america", "pear", "mango", "banana", "grape", "cherry", "kiwi", "lemon", "lime", "blueberry", "raspberry", "blackberry", "watermelon", "strawberry", "pineapple", "apricot", "avocado", "coconut", "cranberry", "date", "fig", "guava", "jackfruit", "lychee", "nectarine", "papaya", "peach", "plum", "pomegranate", "tangerine", "persimmon", "cantaloupe", "honeydew", "durian", "starfruit", "kumquat", "mulberry", "passionfruit", "olive", "tomato", "cucumber", "pumpkin", "zucchini", "carrot", "onion", "potato", "garlic", "spinach", "lettuce", "broccoli", "cauliflower", "celery", "beet", "radish", "turnip", "parsley", "basil", "oregano", "sage", "thyme", "mint", "ginger", "turmeric", "cinnamon", "nutmeg", "clove", "cardamom", "vanilla", "chocolate", "sugar", "honey", "jam", "butter", "bread", "pasta", "rice", "noodle", "egg", "chicken", "fish", "beef", "lamb", "pork", "shrimp", "lobster", "crab", "oyster", "clam", "scallop", "salmon", "trout", "cod", "tuna", "sardine", "mackerel", "anchovy"};
    std::vector<std::string> sortedStringData = sortStrings(stringData);

    std::vector<float> numberData = {-23.45, 45.67, -12.34, 34.21, -98.76,  56.78, -78.91, 12.56, -67.89, 89.01,  -45.32, 23.89, -9.87, 67.45, -56.32,  89.76, -34.56, 12.34, -78.54, 90.12,  -67.89, 34.21, -45.67, 78.91, -90.23,  56.43, -12.34, 34.56, -89.76, 67.32,  -45.98, 23.45, -78.23, 90.45, -56.89,  34.21, -67.89, 12.34, -89.45, 56.78,  -45.32, 67.89, -23.45, 34.56, -90.12,  12.34, -78.91, 89.01, -56.78, 34.21};
    std::vector<float> sortedNumberData = sortNumbers(numberData);

    const int sortedDataSize = sortedNumberData.size();
    for (int i = 0; i < sortedDataSize; i++) {
        std::cout << sortedNumberData[i] << ", " << std::endl;
    };

    return 0;
};