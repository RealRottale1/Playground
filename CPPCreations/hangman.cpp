#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>
#include <algorithm>
#include <cctype>

std::string randomWord() {
    const std::vector<std::string> wordsVector = {"abandon", "twinkle", "climate", "analyze", "journey", "vortex", "cipher", "bricks", "optical", "crunch",
    "fortify", "glistening", "mystify", "pivot", "harbinger", "outlook", "brilliant", "rubble", "raindrop", "vanguard",
    "whisper", "maverick", "trickle", "genuine", "harmony", "fragment", "tinker", "designs", "skillet", "platinum",
    "launch", "wholesome", "captive", "subtle", "relapse", "loftier", "examine", "victory", "curtain", "shelter",
    "juggling", "perplex", "heighten", "redefine", "twilight", "frantic", "pioneer", "grasping", "prelude", "gather",
    "exceed", "unseen", "flame", "hunters", "elevate", "crafters", "retrieve", "spiral", "vision", "summon",
    "grazing", "civility", "unveil", "attract", "perpetual", "enchanted", "bravado", "intrigue", "mastery", "outlook",
    "reflect", "sincerity", "serene", "galore", "swiftly", "venture", "graced", "survival", "tempered", "meander",
    "subtlety", "whistling", "charity", "swindle", "forecast", "coastal", "quicksand", "ripple", "bother", "ascend",
    "acquire", "revolt", "unmask", "swift", "morale", "pebbles", "accuse", "wholesome", "turmoil", "fashion",
    "reboot", "summoned", "creature", "diverse", "triple", "cosmic", "inspire", "modulate", "serenity", "breathe",
    "genuine", "stability", "reform", "flourish", "whispering", "screech", "crown", "pioneer", "fracture", "strive"};
    std::srand(static_cast<unsigned>(std::time(0)));
    const int randomIndex = std::rand() % wordsVector.size();
    return wordsVector[randomIndex];
};

bool displayHiddenWord(std::string guessingWord, std::vector<char> &guessedCharacters) {
    bool notSolved = false;
    std::string displayWord = guessingWord;
    const int guessingWordLength = guessingWord.length();
    for (int i = 0; i < guessingWordLength; i++) {
        if (guessingWord[i] != '-') {
            if (std::find(guessedCharacters.begin(), guessedCharacters.end(), guessingWord[i]) == guessedCharacters.end()) {
                displayWord[i] = '-';
                notSolved = true;
            }
        }
    }
    std::cout << displayWord << std::endl;
    return notSolved;
}

void displayHangMan(int lives) {
    std::cout << "  |-----+" << std::endl;
    std::cout << "  |     ";
    if (lives <= 6) {
        std::cout << '|';
    }
    std::cout << std::endl << "  |     ";
    if (lives <= 5) {
        std::cout << 'O';
    }
    std::cout << std::endl << "  |    ";
    if (lives <= 4) {
        if (lives == 4) {
            std::cout << " +";
        } else if (lives == 3) {
            std::cout << "-+";
        } else {
            std::cout << "-+-";
        }
    }
    std::cout << std::endl << "  |     ";
    if (lives <= 1) {
        if (lives == 1) {
            std::cout << '|';
        } else {
            std::cout << '^';
        }
    }
    std::cout << std::endl << "  |     " << std::endl;
    std::cout << "-----" << std::endl;
}

void displayGuessedCharacters(std::vector<char> &guessedCharacters) {
    std::cout << "Guessed characters: ";
    const int guessedCharactersSize = guessedCharacters.size();
    for (int i = 0; i < guessedCharactersSize; i++) {
        std::cout << guessedCharacters[i] << ' ';
    }
    std::cout << std::endl;
}

int main() {
    std::string playing;
    do {
        std::string guessingWord = randomWord();
        const int guessingWordLength = guessingWord.length();
        std::vector<char> guessedCharacters = {};
        int lives = 7;
        do {
            displayHangMan(lives);
            std::cout << lives << " limb" << (lives == 1 ? "" : "s") << " left!" << std::endl;
            displayGuessedCharacters(guessedCharacters);
            bool notSolved = displayHiddenWord(guessingWord, guessedCharacters);
            if (!notSolved) {
                break;
            }
            std::cout << ": ";
            std::string userGuess;
            std::getline(std::cin, userGuess);
            if (userGuess.length() == 0 || userGuess.length() > 1) {
                std::cout << "Please input only one character!" << std::endl;
            } else if (std::isdigit(userGuess[0])) {
                std::cout << "Character must not be a digit!" << std::endl;
            } else if (std::find(guessedCharacters.begin(), guessedCharacters.end(), userGuess[0]) != guessedCharacters.end()) {
                std::cout << "Please input a character you have not already guessed!" << std::endl;
            } else {
                guessedCharacters.push_back(userGuess[0]);
                if (guessingWord.find(userGuess[0]) == std::string::npos) {
                    lives -= 1;
                }
            }
        } while (lives > 0);
        if (lives <= 0) {
            std::cout << "You lost! The word was " << guessingWord << std::endl;
        } else {
            std::cout << "You won with " << lives << " limb" << (lives == 1 ? "" : "s") << " left!";
        }
        std::cout << "Do you want to play again? yes/no" << std::endl << ": ";
        std::getline(std::cin, playing);
    } while (playing == "yes");
    return 0;
}
