#include <iostream>
#include <array>
#include <string>
#include <map>
#include <vector>
#include <cmath>

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

std::string getPositionName(int row, int column) {
    std::string positionName = std::to_string(row) + char(column + 65);
    return positionName;
}

void botMove(std::array<std::array<char, 7>, 6> &gameBoard) {
    std::map<std::string, int> allMoves = {};

    auto assignPointsToPosition = [&allMoves](int row, int column, int points) {
        std::string sidePositionName = getPositionName(row, column);
        if (allMoves.find(sidePositionName) == allMoves.end()) {
            allMoves.insert({sidePositionName, points});
        } else {
            allMoves[sidePositionName] += points;
        }
    };

    auto getPiece = [&gameBoard](int row, int column) {
        char piece = gameBoard[row][column];
        if (row !=5) {
            char supportingPiece = gameBoard[row + 1][column];
            if (supportingPiece == '_') {
                return 'N';
            }
        }
        return piece;
    };

    for (int row = 0; row < 6; row++) {
        for (int column = 0; column < 7; column++) {
            char currentPieceType = getPiece(row, column);
            if (currentPieceType != 'N') {
                if (currentPieceType != '_') {
                    bool leftInGrid = (column - 1 != -1);
                    bool rightInGrid = (column + 1 != 8);
    
                    if (!leftInGrid || !rightInGrid) { // No pair
                        int useDif = (leftInGrid ? -1 : 1);
                        if (getPiece(row, column + useDif) == '_') {
                            assignPointsToPosition(row, column + useDif, 1);
                        }
                    } else {
                        char leftPiece = getPiece(row, column - 1);
                        char rightPiece = getPiece(row, column + 1);
                        if (leftPiece == rightPiece && leftPiece == currentPieceType) { // 3 pair connected
                            bool farLeftInGrid = (column - 2 > -1);
                            bool farRightInGrid = (column + 2 < 8);
                            
                            char farLeftPiece = (farLeftInGrid ? getPiece(row, column - 2) : 'N');
                            char farRightPiece = (farRightInGrid ? getPiece(row, column + 2) : 'N');
    
                            if (farLeftPiece == farRightPiece && farLeftPiece == '_') { // 3 pair connected with 2 openings
                                assignPointsToPosition(row, column - 2, 100 * (currentPieceType == 'C' ? 10 : 1) - 10);
                                assignPointsToPosition(row, column + 2, 100 * (currentPieceType == 'C' ? 10 : 1)  - 10);
                            } else if (farLeftPiece == '_' || farRightPiece == '_') { // 3 pair connected with 1 opening
                                int useDif = (farLeftInGrid ? -2 : 2);
                                assignPointsToPosition(row, column + useDif, 100 * (currentPieceType == 'C' ? 10 : 1)  - 10);
                            }
    
                        } else if (leftPiece == currentPieceType || rightPiece == currentPieceType) { // 2 pair connected
                            assignPointsToPosition(row, column + (leftPiece == currentPieceType ? 1 : -1), 10);
                        } else if (leftPiece == '_' || rightPiece == '_') {
                            if (leftPiece == rightPiece) { // Both sides empty
                                assignPointsToPosition(row, column - 1, 1);
                                assignPointsToPosition(row, column + 1, 1);
                            } else { // 1 side empty
                                int useDif = (leftPiece == '_' ? -1 : 1);
                                assignPointsToPosition(row, column + useDif, 1);
                            }
                        }
                    }
    
                    if (column < 4) {
                        char endPiece = getPiece(row, column + 3);
                        if (endPiece == currentPieceType) {
                            char secondPiece = getPiece(row, column + 1);
                            char thirdPiece = getPiece(row, column + 2);
                            if (secondPiece == thirdPiece && secondPiece == '_') {
                                assignPointsToPosition(row, column + 1, 10);
                                assignPointsToPosition(row, column + 2, 10);
                            } else if (secondPiece == '_' || thirdPiece == '_') {
                                int useDif = (secondPiece == '_' ? 1 : 2);
                                assignPointsToPosition(row, column + useDif, 10);
                            }
                        }
                    }
                } else {
                    bool leftInGrid = (column - 1 != -1);
                    bool rightInGrid = (column + 1 != 8);
    
                    if (leftInGrid && rightInGrid) {
                        char leftPiece = getPiece(row, column - 1);
                        char rightPiece = getPiece(row, column + 1);
    
                        if (leftPiece == rightPiece && leftPiece != '_') {
                            assignPointsToPosition(row, column, 9);
                        }
                    }
                }
            }
        }
    }

    for (int column = 0; column < 7; column++) {
        int sameTypeCounter = 0;
        char previousPieceType = 'N';
        for (int row = 5; row >= 0; row--) {
            char currentPieceType = gameBoard[row][column];
            if (currentPieceType != '_') {
                if (previousPieceType == 'N' || previousPieceType == currentPieceType) {
                    sameTypeCounter += 1;
                } else {
                    sameTypeCounter = 0;
                    previousPieceType = currentPieceType;
                }
            } else {
                if (sameTypeCounter != 0) {
                    assignPointsToPosition(row, column, std::pow(10, -1+sameTypeCounter) * ((currentPieceType == 'C' && sameTypeCounter == 3)  ? 10 : 1));
                }
                break;
            }
        }
    }

    for (auto &pair : allMoves) {
        std::cout << pair.first << " , " << pair.second << std::endl;
    }
}

/*
                // Handles sides
                for (int dif = 0; dif < 2; dif++) {
                    int sideColumn = column + (dif ? 1 : -1);
                    if (sideColumn > -1 && sideColumn < 8) {
                        std::string sidePositionName = getPositionName(row, sideColumn);
                        if (allMoves.find(sidePositionName) == allMoves.end()) {
                            allMoves.insert({sidePositionName, 1});
                        } else {
                            allMoves[sidePositionName] += 1;
                        }
                    }
                }
*/

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
        // Check if player won
        botMove(gameBoard);
    }
    return 0;
}