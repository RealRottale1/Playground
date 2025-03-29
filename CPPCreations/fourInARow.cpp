#include <iostream>
#include <array>
#include <string>

std::array<std::array<char, 7>, 6> makeGameBoard() {
    std::array<std::array<char, 7>, 6> gameBoard;
    for (int i = 0; i < 6; i++) {
        std::array<char, 7> column = {'_', '_', '_', '_', '_', '_', '_'};
        gameBoard[i] = column;
    }
    return gameBoard;
}

void displayBoard(std::array<std::array<char, 7>, 6> &gameBoard) {
    std::cout << "   A, B, C, D, E, F, G," << std::endl;
    for (int i = 0; i < 6; i++) {
        std::cout << i << ", ";
        for (int j = 0; j < 7; j++) {
            std::cout << gameBoard[i][j] << ", ";
        }
        std::cout << std::endl;
    }
}

bool isValidPlayerMove(std::array<std::array<char, 7>, 6> &gameBoard, std::string &playerMove) {
    if (playerMove.length() != 2) {
        return false;
    }
    int column = (int)playerMove[0] - 65;
    int row = (int)playerMove[1] - 48;
    if (column < 0 || column > 6 || row < 0 || row > 5) {
        std::cout << "Invalid Location" << std::endl;
        return false; 
    }

    auto* userRow = &gameBoard[row];
    auto* userPosition = &(*userRow)[column];

    if (*userPosition != '_') {
        std::cout << "Position Taken" << std::endl;
        return false;
    }

    if (row != 5) {
        char belowLocation = gameBoard[row + 1][column];
        if (belowLocation == '_') {
            std::cout << "Position Unsupported" << std::endl;
            return false;
        }
    }

    *userPosition = 'P';
    std::cout << "Executed" << std::endl;

    return true;
}

int main() {
    std::array<std::array<char, 7>, 6> gameBoard = makeGameBoard();

    while (true) {
        displayBoard(gameBoard);
        std::cout << "Player Move: ";
        bool validPlayerMove = false;
        do {
            std::string playerMove = "";
            std::getline(std::cin, playerMove);
            validPlayerMove = isValidPlayerMove(gameBoard, playerMove);
        } while (!validPlayerMove);
    }
    return 0;
}