#include <iostream>
#include <string>
#include <vector>
#include <thread>

std::string pigify(std::string text) {
    if (text.empty()) {
        return text;
    }
    auto split = [] (std::string &text) {
        std::vector<std::string> textVector;
        while (text.find(' ') != std::string::npos) {
            const int endPos = text.find(' ');
            textVector.push_back(text.substr(0, endPos));
            text.erase(0, endPos+1);
        }
        textVector.push_back(text);
        return textVector;
    };

    std::vector<std::string> textVector = split(text);

    auto handlePigify = [] (std::vector<std::string> &textVector, int start, int end) {
        auto isVowel = [] (char character) {
            switch(std::tolower(character)) {
                case 'a':
                    return true;
                case 'e':
                    return true;
                case 'i':
                    return true;
                case 'o':
                    return true;
                case 'u':
                    return true;
                default:
                    return false;
            }
        };
        
        for (int i = start; i < end; i++) {
            const bool startsWithVowel = isVowel(textVector[i][0]);
            if (startsWithVowel) {
                textVector[i] += "yay";
            } else {
                int firstVowel = 0;
                for (int j = 1; j < textVector[i].length(); j++) {
                    const bool foundVowel = isVowel(textVector[i][j]);
                    if (foundVowel) {
                        firstVowel = j;
                        break;
                    }
                }
                textVector[i] += textVector[i].substr(0, firstVowel) + "ay";
                textVector[i].erase(0, firstVowel);
            };

        }
    };

    std::vector<std::thread> threads;
    const int optimalThreadCount = std::thread::hardware_concurrency();
    const int useThreadCount = (optimalThreadCount > textVector.size() ? textVector.size() : optimalThreadCount);
    const int extraLength = (textVector.size() > optimalThreadCount ? textVector.size() % optimalThreadCount : 0);
    const int normalLength = (textVector.size()-extraLength)/useThreadCount;
    
    std::cout << optimalThreadCount << std::endl;
    std::cout << useThreadCount << std::endl;
    std::cout << extraLength << std::endl;
    std::cout << normalLength << std::endl;

    for (int i = 0; i < useThreadCount; i++) {
        if (i < extraLength) {
            const int startAt = i*(normalLength+1);
            const int endAt = startAt+normalLength+1;
            std::cout << "<, " << i << " , " << startAt << " , " << endAt << std::endl;
            threads.push_back(std::thread(handlePigify, std::ref(textVector), startAt, endAt));
        } else {                // Gets Start                  // Get Offset
            const int startAt = extraLength*(normalLength+1) + (i-extraLength)*normalLength;
            const int endAt = startAt+normalLength;
            std::cout << ">=, " << i << " , " << startAt << " , " << endAt << std::endl;
            threads.push_back(std::thread(handlePigify, std::ref(textVector), startAt, endAt));
        }
    }

    /*
        if (i+1 == useThreadCount) {
            threads.push_back(std::thread(handlePigify, std::ref(textVector), i*normalLength, normalLength+extraLength));
        } else {
            threads.push_back(std::thread(handlePigify, std::ref(textVector), i*normalLength, normalLength));
        }
    */
    for (auto &thread : threads) {
        thread.join();
    }

    std::string pigText;
    for (int i = 0; i < textVector.size(); i++) {
        pigText += textVector[i] + ' ';
    }

    return pigText;
}

int main() {
    std::string text = "Apple Pie Apple Pie apple Apple Apple Apple APple Apple Apple";
    std::string pigText = pigify(text);
    std::cout << pigText;
    return 0;
}