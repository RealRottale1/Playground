#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <algorithm>

struct encryptedText {
    std::map<char, char> encryptionKey;
    std::string text;
};

encryptedText encryptText(std::string &text) {
    std::srand(static_cast<unsigned>(std::time(0)));
    encryptedText myEncryptedText;
    const int textLength = text.length();
    std::vector<char> usedChars;
    for (int i = 0; i < textLength; i++) {
        const char currentChar = text[i];
        if (myEncryptedText.encryptionKey.find(currentChar) != myEncryptedText.encryptionKey.end()) {
            myEncryptedText.text += myEncryptedText.encryptionKey[currentChar];
        } else {
            char randomChar;
            do {
                randomChar = char(21+(std::rand() % 14847422));
            } while (std::find(usedChars.begin(), usedChars.end(), randomChar) != usedChars.end());
            usedChars.push_back(randomChar);
            myEncryptedText.encryptionKey.insert({currentChar, randomChar});
            myEncryptedText.text += randomChar;
        }
    }
    return myEncryptedText;
}

std::string unencryptText(encryptedText &secureText) {
    std::map<int, char> unsecureMap;
    const int textLength = secureText.text.length();
    for (auto &pair : secureText.encryptionKey) {
        for (int i = 0; i < textLength; i++) {
            if (secureText.text[i] == pair.second) {
                unsecureMap.insert({i, pair.first});
            }
        }
    }
    std::string unsecureText;
    const int mapSize = unsecureMap.size();
    for (int i = 0; i < mapSize; i++) {
        unsecureText += unsecureMap[i];
    }
    return unsecureText;
}

int main() {
    std::string unsecureText = "Encryption is the method by which information is converted into secret code that hides the information's true meaning. The science of encrypting and decrypting information is called cryptography.";
    encryptedText secureText = encryptText(unsecureText);
    std::cout << secureText.text << std::endl;
    std::string reUnsecureText = unencryptText(secureText);
    std::cout << reUnsecureText << std::endl;
    return 0;
}