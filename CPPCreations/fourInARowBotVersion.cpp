#include <iostream>
#include <array>
#include <string>
#include <map>
#include <vector>
#include <cmath>
#include <utility>
#include <random>

std::array<std::array<char, 7>, 6> makeGameBoard() {
    std::array<std::array<char, 7>, 6> gameBoard;
    for (int i = 0; i < 6; i++) {
        std::array<char, 7> column = {'_', '_', '_', '_', '_', '_', '_'};
        gameBoard[i] = column;
    }
    std::random_device rd;
    std::mt19937 mt(rd());
    std::uniform_real_distribution<double> randomPosition(0, 6);
    int randomPositionIndex = std::round(randomPosition(mt));
    gameBoard[5][randomPositionIndex] = 'C';
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
    if (playerMove.length() != 1) {
        std::cout << "Invalid Position" << std::endl;
        return false;
    }

    int column = (int)playerMove[0] - 65;
    if (column < 0 || column > 6) {
        std::cout << "Column is Invalid" << std::endl;
        return false; 
    }

    int row = 0;
    do {
        char pieceAtPosition = gameBoard[row][column];
        if (pieceAtPosition == '_') {
            row++;
        } else {
            row--;
            break;
        }
    } while (true);
    if (row == -1) {
        std::cout << "Column is Full" << std::endl;
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

    return true;
}

std::string getPositionName(int row, int column) {
    std::string positionName = std::to_string(row) + char(column + 65);
    return positionName;
}

std::map<std::string, int> getNextMoves(std::array<std::array<char, 7>, 6> &gameBoard, char thisPieceType) {
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
                    bool rightInGrid = (column + 1 != 7);
    
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
                            bool farRightInGrid = (column + 2 < 7);
                            
                            char farLeftPiece = (farLeftInGrid ? getPiece(row, column - 2) : 'N');
                            char farRightPiece = (farRightInGrid ? getPiece(row, column + 2) : 'N');

                            if (farLeftPiece == farRightPiece && farLeftPiece == '_') { // 3 pair connected with 2 openings
                                assignPointsToPosition(row, column - 2, 100 * (currentPieceType == thisPieceType ? 10 : 1) - 10);
                                assignPointsToPosition(row, column + 2, 100 * (currentPieceType == thisPieceType ? 10 : 1)  - 10);
                            } else if (farLeftPiece == '_' || farRightPiece == '_') { // 3 pair connected with 1 opening
                                int useDif = (farLeftInGrid ? -2 : 2);
                                assignPointsToPosition(row, column + useDif, 100 * (currentPieceType == thisPieceType ? 10 : 1)  - 10);
                            }
    
                        } else if ((leftPiece == currentPieceType && rightPiece == '_') || (rightPiece == currentPieceType && leftPiece == '_')) { // 2 pair connected
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

                    // Diagonals
                    std::map<int, std::pair<char, std::array<int, 2>>> TLBRLine;
                    std::map<int, std::pair<char, std::array<int, 2>>> BLTRLine;

                    for (int i = -3; i < 4; i++) {
                        if (i == 0) {
                            std::array<int, 2> position = {row, column};
                            std::pair<char, std::array<int, 2>> pieceData = {currentPieceType, position};
                            TLBRLine.insert({0, pieceData});
                            BLTRLine.insert({0, pieceData});
                            continue;
                        }
                        
                        if (row + i > -1 && row + i < 6 && column + i > -1 && column + i < 7) {
                            std::array<int, 2> position = {row + i, column + i};
                            std::pair<char, std::array<int, 2>> pieceData = {getPiece(row + i, column + i), position};
                            TLBRLine.insert({i, pieceData});
                        }

                        if (row - i > -1 && row - i < 6 && column + i > -1 && column + i < 7) {
                            std::array<int, 2> position = {row - i, column + i};
                            std::pair<char, std::array<int, 2>> pieceData = {getPiece(row - i, column + i), position};
                            BLTRLine.insert({i, pieceData});
                        }
                    }

                    std::array<std::map<int, std::pair<char, std::array<int, 2>>>, 2> diagonals = {TLBRLine, BLTRLine};
                    for (int i = 0; i < 2; i++) {
                        bool leftDiagonalInGrid = (diagonals[i].find(-1) != diagonals[i].end() && diagonals[i][-1].first != 'N');
                        bool rightDiagonalInGrid = (diagonals[i].find(1) != diagonals[i].end() && diagonals[i][1].first != 'N');

                        if (!leftDiagonalInGrid && !rightDiagonalInGrid) {
                            continue;
                        } else if (!leftDiagonalInGrid || !rightDiagonalInGrid) {
                            int useDif = (!leftDiagonalInGrid ? 1 : -1);
                            std::array<int, 2> &position = diagonals[i][useDif].second;
                            if (getPiece(position[0], position[1]) == '_') {
                                assignPointsToPosition(position[0], position[1], 1);
                            }
                        } else {
                            if (diagonals[i][-1].first == diagonals[i][1].first && diagonals[i][-1].first == currentPieceType) { // 3 pair connected
                                bool farLeftDiagonalInGrid = (diagonals[i].find(-2) != diagonals[i].end() && diagonals[i][-2].first != 'N');
                                bool farRightDiagonalInGrid = (diagonals[i].find(2) != diagonals[i].end() && diagonals[i][2].first != 'N');
                                
                                if (!farLeftDiagonalInGrid && !farRightDiagonalInGrid) {
                                    continue;
                                } else {
                                    if ((!farLeftDiagonalInGrid && farRightDiagonalInGrid && diagonals[i][2].first == '_') || (farLeftDiagonalInGrid && diagonals[i][-2].first == '_' && !farRightDiagonalInGrid)) { // 3 pair connected with 1 opening
                                        int useDif = (!farLeftDiagonalInGrid ? 2 : -2);
                                        std::array<int, 2> &position = diagonals[i][useDif].second;
                                        assignPointsToPosition(position[0], position[1], 100 * (currentPieceType == thisPieceType ? 10 : 1)  - 10);
                                    
                                    } else if (farLeftDiagonalInGrid && farRightDiagonalInGrid && diagonals[i][-2].first == diagonals[i][2].first && diagonals[i][-2].first == '_') { // 3 pair connected with 2 openings
                                        std::array<int, 2> &farLeftPosition = diagonals[i][-2].second;
                                        std::array<int, 2> &farRightPosition = diagonals[i][2].second;
                                        assignPointsToPosition(farLeftPosition[0], farLeftPosition[1], 100 * (currentPieceType == thisPieceType ? 10 : 1) - 10);
                                        assignPointsToPosition(farRightPosition[0], farRightPosition[1], 100 * (currentPieceType == thisPieceType ? 10 : 1)  - 10);
                                    }
                                }
                            } else if (diagonals[i][-1].first == currentPieceType || diagonals[i][1].first == currentPieceType) { // 2 pair connected
                                int useDif = (diagonals[i][-1].first == currentPieceType ? 2 : -2);
                                if (diagonals[i][useDif/2].first == '_') {
                                    bool farDiagonalInGrid = (diagonals[i].find(useDif) != diagonals[i].end() && diagonals[i][useDif].first != 'N');
                                    if (farDiagonalInGrid && (diagonals[i][useDif].first == '_' || diagonals[i][useDif].first == currentPieceType)) {
                                        std::array<int, 2> &position = diagonals[i][useDif].second;
                                        assignPointsToPosition(position[0], position[1], 10);
                                    } else {
                                        std::array<int, 2> &position = diagonals[i][useDif/2].second;             
                                        assignPointsToPosition(position[0], position[1], 1);
                                    }
                                }
                            } else if (diagonals[i][-1].first == '_' || diagonals[i][1].first == '_') {
                                if (diagonals[i][-1].first == diagonals[i][1].first) { // Both sides empty
                                    std::array<int, 2> &leftPosition = diagonals[i][-1].second;
                                    std::array<int, 2> &rightPosition = diagonals[i][1].second;
                                    assignPointsToPosition(leftPosition[0], leftPosition[1], 1);
                                    assignPointsToPosition(rightPosition[0], rightPosition[1], 1);
                                } else { // 1 side empty
                                    int useDif = (diagonals[i][-1].first == '_' ? -1 : 1);
                                    std::array<int, 2> &position = diagonals[i][useDif].second;
                                    assignPointsToPosition(position[0], position[1], 1);
                                }
                            }
                        }
                    }
                    
                    // // Debug!
                    // std::cout << "ROW=" << row << ", COLUMN=" << column << std::endl;
                    // std::cout << "TLBR LINE" << std::endl;
                    // for (const auto& entry : TLBRLine) {
                    //     int key = entry.first;
                    //     char character = entry.second.first;
                    //     const std::array<int, 2>& arr = entry.second.second;
                    //     std::cout << "Key: " << key << ", Char: " << character << ", Array: {" << arr[0] << ", " << arr[1] << "}" << std::endl;
                    // }
                    // std::cout << "BLTR LINE" << std::endl;
                    // for (const auto& entry : BLTRLine) {
                    //     int key = entry.first;
                    //     char character = entry.second.first;
                    //     const std::array<int, 2>& arr = entry.second.second;
                    //     std::cout << "Key: " << key << ", Char: " << character << ", Array: {" << arr[0] << ", " << arr[1] << "}" << std::endl;
                    // }
    
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
                    bool rightInGrid = (column + 1 != 7);
    
                    if (leftInGrid && rightInGrid) {
                        char leftPiece = getPiece(row, column - 1);
                        char rightPiece = getPiece(row, column + 1);
    
                        if (leftPiece == rightPiece && leftPiece != '_' && leftPiece != 'N') {
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
                if (previousPieceType != currentPieceType) {
                    sameTypeCounter = 1;
                } else {
                    sameTypeCounter += 1;
                }
                previousPieceType = currentPieceType;
            } else {
                if (sameTypeCounter != 0) {
                    assignPointsToPosition(row, column, std::pow(10, -1+sameTypeCounter) * ((currentPieceType == thisPieceType && sameTypeCounter == 3)  ? 10 : 1) );
                }
                break;
            }
        }
    }

    // for (auto it = allMoves.begin(); it != allMoves.end();) {
    //     std::string key = it->first;
    //     int row = (int)key[0] - 48;
    //     int column = (int)key[1] - 65;
    //     if ((row == 5 ? (gameBoard[row][column] != '_') : (getPiece(row, column) != '_') )) {
    //         std::cout << "Purging Move At Row: " << row << ", Column: " << column << ", Points: " << it->second << std::endl;
    //         it = allMoves.erase(it);
    //     } else {
    //         it++;
    //     }
    // }

    return allMoves;
}

void botMove(std::array<std::array<char, 7>, 6> &gameBoard, char thisPieceType) {

    auto makeGameBoardCopy = [](std::array<std::array<char, 7>, 6> &gameBoard) {
        std::array<std::array<char, 7>, 6> gameBoardCopy;
        for (int row = 0; row < 6; row++) {
            std::array<char, 7> tempArray;
            for (int column = 0; column < 7; column++) {
                tempArray[column] = gameBoard[row][column];
            }
            gameBoardCopy[row] = tempArray;
        }
        return gameBoardCopy;
    };

    std::map<std::string, int> allMoves = getNextMoves(gameBoard, thisPieceType);

    std::map<int, std::vector<std::string>> sortedMovesByPoints;
    for (auto &pair : allMoves) {
        std::cout << pair.first << " , " << pair.second << std::endl;
        if (sortedMovesByPoints.find(pair.second) != sortedMovesByPoints.end()) {
            sortedMovesByPoints[pair.second].push_back(pair.first);
        } else {
            std::vector<std::string> tempVector = {pair.first};
            sortedMovesByPoints.insert({pair.second, tempVector});
        }
    }

    bool foundSafeMove = false;
    std::string firstBestMove = "";
    for (auto it = sortedMovesByPoints.rbegin(); it != sortedMovesByPoints.rend(); it++) {
        if (foundSafeMove) {
            break;
        }
        std::vector<std::string> samePointMoves = sortedMovesByPoints[it->first];
        while (samePointMoves.size() > 0) {
            std::random_device rd;
            std::mt19937 mt(rd());
            std::uniform_real_distribution<double> randomMove(0, samePointMoves.size() - 1);
            int randomMoveIndex = std::round(randomMove(mt));

            std::string selectedMove = samePointMoves[randomMoveIndex];
            if (firstBestMove == "") {
                firstBestMove = selectedMove;
            }

            int row = (int)selectedMove[0] - 48;
            int column = (int)selectedMove[1] - 65;

            std::array<std::array<char, 7>, 6> gameBoardCopy = makeGameBoardCopy(gameBoard);
            gameBoardCopy[row][column] = thisPieceType;

            std::map<std::string, int> allNextMoves = getNextMoves(gameBoardCopy, (thisPieceType == 'P' ? 'C' : 'P'));
            bool safeMove = true; 
            for (auto &pair : allNextMoves) {
                if (pair.second >= 250) {
                    safeMove = false;
                    break;
                }
            }

            if (safeMove) {
                gameBoard[row][column] = thisPieceType;
                foundSafeMove = true;
                break;
            } else {
                samePointMoves.erase(samePointMoves.begin() + randomMoveIndex);
            }
        }
    }

    if (!foundSafeMove) {
        int row = (int)firstBestMove[0] - 48;
        int column = (int)firstBestMove[1] - 65;
        gameBoard[row][column] = 'C';
    }
}

bool checkForFull(std::array<std::array<char, 7>, 6> &gameBoard) {
    for (int row = 0; row < 6; row++) {
        for (int column = 0; column < 7; column++) {
            if (gameBoard[row][column] == '_') {
                return false;
            }
        }
    }
    return true;
}

bool checkForWin(std::array<std::array<char, 7>, 6> &gameBoard, char currentPieceType) {
    for (int row = 0; row < 6; row++) {
        int matches = 0;
        for (int column = 0; column < 7; column++) {
            matches = (gameBoard[row][column] == currentPieceType ? matches + 1 : 0);
            if (matches == 4) {
                return true;
            }
        }
    }

    for (int column = 0; column < 6; column++) {
        int matches = 0;
        for (int row = 5; row >= 0; row--) {
            matches = (gameBoard[row][column] == currentPieceType ? matches + 1 : 0);
            if (matches == 4) {
                return true;
            }
        }
    }

    for (int p = 0; p < 6; p++) {
        int rightRow = ((p + 3) > 5 ? 5 : p + 3);
        int rightColumn = ((p - 2) < 0 ? 0 : p - 2);
        int leftRow = ((p - 3) > 0 ? 8 - p : 5);
        int leftColumn = ((p + 3) < 6 ? p + 3 : 6);
        int duration = ((p + 4) < 7 ? p + 4 : 9 - p);

        int rightMatches = 0;
        int leftMatches = 0;
        for (int i = 0; i < duration; i++) {
            if (gameBoard[rightRow - i][rightColumn + i] == currentPieceType) {
                if (rightMatches == 3) {
                    return true;
                }
                rightMatches += 1;
            } else {
                rightMatches = 0;
            }

            if (gameBoard[leftRow - i][leftColumn - i] == currentPieceType) {
                if (leftMatches == 3) {
                    return true;
                }
                leftMatches += 1;
            } else {
                leftMatches = 0;
            }
        }
    }

    return false;
}

int main() {
    int continues = 0;
    std::array<std::array<char, 7>, 6> gameBoard = makeGameBoard();

    while (true) {
        displayBoard(gameBoard);

        std::cout << "Bot1's Turn!" << std::endl;
        botMove(gameBoard, 'P');
        bool bot1Won = checkForWin(gameBoard, 'P');
        if (bot1Won) {
            std::cout << "Bot1 won!" << std::endl;
            break;
        } else {
            bool boardFull = checkForFull(gameBoard);
            if (boardFull) {
                std::cout << "Tie!" << std::endl;
                break;
            }
        }

        displayBoard(gameBoard);

        std::cout << "Bot2's Turn!" << std::endl;
        botMove(gameBoard, 'C');
        bool bot2Won = checkForWin(gameBoard, 'C');
        if (bot2Won) {
            std::cout << "Bot2 won!" << std::endl;
            break;
        } else {
            bool boardFull = checkForFull(gameBoard);
            if (boardFull) {
                std::cout << "Tie!" << std::endl;
                break;
            }
        }

        if (continues == 5) {
            continues = 0;
            std::cout << "Continue: ";
            std::string temp;
            std::getline(std::cin, temp);
        } else {
            continues++;
        }
    }

    displayBoard(gameBoard);
    return 0;
}