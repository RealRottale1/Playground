#include <iostream>
#include <string>
#include <map>

std::string ceasafy(std::string plainText, int shiftBy) {
    std::string unplainText;
    const int plainTextLength = plainText.length();
    for (int i = 0; i < plainTextLength; i++) {
        int id = int(plainText[i]);
        if ((id >= 65 && id <= 90) || (id >= 97 && id <= 122)) {
            unplainText += (id<=90?((((id-65+shiftBy)%26)+26)%26+65):((((id-97+shiftBy)%26)+26)%26+97));
        } else {
            unplainText += plainText[i];
        }
    }
    return unplainText;
}

int main() {
    std::string plainText = "The action of a Caesar cipher is to replace each plaintext letter with a different one a fixed number of places down the alphabet.";
    std::string unplainText = ceasafy(plainText, -3); 
    std::cout << unplainText;
    return 0;
}