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

std::vector<std::string> sort(std::vector<std::string> &data) {
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

int main() {
    std::vector<std::string> data = {"orange", "apple", "ant", "america", "pear", "mango", "banana", "grape", "cherry", "kiwi", "lemon", "lime", "blueberry", "raspberry", "blackberry", "watermelon", "strawberry", "pineapple", "apricot", "avocado", "coconut", "cranberry", "date", "fig", "guava", "jackfruit", "lychee", "nectarine", "papaya", "peach", "plum", "pomegranate", "tangerine", "persimmon", "cantaloupe", "honeydew", "durian", "starfruit", "kumquat", "mulberry", "passionfruit", "olive", "tomato", "cucumber", "pumpkin", "zucchini", "carrot", "onion", "potato", "garlic", "spinach", "lettuce", "broccoli", "cauliflower", "celery", "beet", "radish", "turnip", "parsley", "basil", "oregano", "sage", "thyme", "mint", "ginger", "turmeric", "cinnamon", "nutmeg", "clove", "cardamom", "vanilla", "chocolate", "sugar", "honey", "jam", "butter", "bread", "pasta", "rice", "noodle", "egg", "chicken", "fish", "beef", "lamb", "pork", "shrimp", "lobster", "crab", "oyster", "clam", "scallop", "salmon", "trout", "cod", "tuna", "sardine", "mackerel", "anchovy"};
    std::vector<std::string> sortedData = sort(data);

    const int sortedDataSize = sortedData.size();
    for (int i = 0; i < sortedDataSize; i++) {
        std::cout << sortedData[i] << ", " << std::endl;
    };

    return 0;
};