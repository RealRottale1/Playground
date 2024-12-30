#include <iostream>
#include <map>
#include <string>
#include <vector>

void handleGame() {
    auto outputGameBoard = [] (std::map<int, std::array<char, 3>> &gameBoard) {
        std::cout << "  0 1 2" << std::endl;
        for (int i = 0; i < 3; i++) {
            std::cout << i << ' ';
            for (int j = 0; j < 3; j++) {
                std::cout << gameBoard[i][j] << ' ';
            };
            std::cout << std::endl;
        };
    };

    auto invalidMove = [] (std::string playerMove) {

    };

    auto getEmptySpots = [] (std::map<int, std::array<char, 3>> &gameBoard) {
        std::map<int, std::vector<int>> moves;
        for (int i = 0; i < 3; i++) {
            bool madeEntry = false;
            for (int j = 0; j < 3; j++) {
                if (gameBoard[i][j] == '_') {
                    if (!madeEntry) {
                        moves.insert({i, {j}});
                        madeEntry = true;
                    } else {
                        moves[i].push_back(j);
                    };
                };
            };
        };
        return moves;
    };

    auto getBlockSpots = [] (std::map<int, std::array<char, 3>> &gameBoard) {
        std::map<int, std::vector<int>> moves;
        for (int h = 0; h < 2; h++) {
            for (int i = 0; i < 3; i++) {
                int emptySpot = -1;
                int xCounter = 0;
                for (int j = 0; j < 3; j++) {
                    if (h) {
                        if (gameBoard[j][i] == 'X') {
                            xCounter += 1;
                        } else if (gameBoard[j][i] == '_') {
                            emptySpot = j;
                        };
                        if (xCounter == 2 && emptySpot > -1) {
                            if (moves.find(emptySpot) != moves.end()) {
                                moves[emptySpot].push_back(i);
                            } else {
                                moves.insert({emptySpot, {i}});
                            };
                        };
                    } else {
                        if (gameBoard[i][j] == 'X') {
                            xCounter += 1;
                        } else if (gameBoard[i][j] == '_') {
                            emptySpot = j;
                        };
                        if (xCounter == 2 && emptySpot > -1) {
                            moves.insert({i, {emptySpot}});
                        };
                    }
                };
            };
        };
        for (int h = 0; h < 2; h++) {
            int emptySpot = -1;
            int xCounter = 0;
            for (int i = 0; i < 3; i++) {
                int useIndex = (h ? i : 2-i);
                if (gameBoard[i][useIndex] == 'X') {
                    xCounter += 1;
                } else if (gameBoard[i][useIndex] == '_') {
                    emptySpot = useIndex;
                };
                if (xCounter == 2 && emptySpot > -1) {
                    if (moves.find(i) != moves.end()) {
                        moves[i].push_back(emptySpot);
                    } else {
                        moves.insert({i, {emptySpot}});
                    };
                };
            };
        }
        return moves;
    };

    std::map<int, std::array<char, 3>> gameBoard;
    gameBoard.insert({0, {'_', '_', '_'}});
    gameBoard.insert({1, {'_', '_', '_'}});
    gameBoard.insert({2, {'_', '_', '_'}});

    while (true) {
        outputGameBoard(gameBoard);
        std::string playerMove;
        do {
            std::cout << "Player Move: ";
            std::getline(std::cin, playerMove);
        } while (invalidMove(playerMove));
        

    };

    /*std::map<int, std::vector<int>> moves = getBlockSpots(gameBoard);
    for (int i = 0; i < 3; i++) {
        std::cout << "Row: " << i << std::endl;
        int vectorSize = moves[i].size();
        for (int j = 0; j < vectorSize; j++) {
            std::cout << moves[i][j];
        };
        std::cout << std::endl;
    };*/
};

int main() {
    handleGame();
    return 0;
};