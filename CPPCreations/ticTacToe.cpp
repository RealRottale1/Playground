#include <iostream>
#include <map>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>

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

    auto getSelectSpots = [] (char character, std::map<int, std::array<char, 3>> &gameBoard) {
        std::map<int, std::vector<int>> moves;
        for (int h = 0; h < 2; h++) {
            for (int i = 0; i < 3; i++) {
                int emptySpot = -1;
                int xCounter = 0;
                for (int j = 0; j < 3; j++) {
                    if (h) {
                        if (gameBoard[j][i] == character) {
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
                        if (gameBoard[i][j] == character) {
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
                if (gameBoard[i][useIndex] == character) {
                    xCounter += 1;
                } else if (gameBoard[i][useIndex] == '_') {
                    emptySpot = useIndex;
                };
                if (xCounter == 2 && emptySpot > -1) {
                    if (moves.find(i) != moves.end()) {
                        moves[i].push_back(emptySpot);
                    } else {
                        moves.insert({useIndex, {emptySpot}});
                    };
                };
            };
        }
        return moves;
    };

    auto invalidMove = [] (std::string &playerMove, std::map<int, std::array<char, 3>> &gameBoard) {
        if (playerMove.length() == 2) {
            if (std::isdigit(playerMove[0]) && std::isdigit(playerMove[1])) {
                const int row = playerMove[0] - '0';
                const int column = playerMove[1] - '0';
                if (row >= 0 && row <= 2 && column >= 0 && column <= 2) {
                    if (gameBoard[row][column] == '_') {
                        gameBoard[row][column] = 'X';
                        return false;
                    };
                };
            };
        };
        return true;
    };

    auto handlePossibleMoves = [] (std::map<int, std::vector<int>> &moves, std::map<int, std::array<char, 3>> &gameBoard) {
        const int mapSize = moves.size();
        std::vector<int> allRows;
        int index = 0;
        for (auto &pair : moves) {
            if (!pair.second.empty() && pair.second[0] >= 0) {
                allRows.push_back(index);
            };
            index += 1;
        };

        for (int i = 0; i < allRows.size(); i++) {
            std::cout << allRows[i] << std::endl;
        };

        return false;
    };

    /*
            const int mapSize = moves.size();
        std::srand(static_cast<unsigned>(std::time(0)));
        const int randomRow = std::rand() % mapSize;
        std::cout << "MAP SIZE: " << mapSize << std::endl;
        std::cout << "RANDOM ROW: " << randomRow << std::endl;
        int index = 0;
        bool finished = false;
        for (auto &pair : moves) {
            std::cout << "REPEATS!";
            if (!finished) {
                if (index == randomRow) {
                    finished = true;
                    const int vectorSize = pair.second.size();
                    std::srand(static_cast<unsigned>(std::time(0)));
                    const int randomColumn = std::rand() % vectorSize;
                    gameBoard[pair.first][pair.second[randomColumn]] = 'O';
                    std::cout << "TEST: " << gameBoard[pair.first][pair.second[randomColumn]];
                    return true;
                };
            };
        };
    */

    std::map<int, std::array<char, 3>> gameBoard;
    gameBoard.insert({0, {'_', '_', '_'}});
    gameBoard.insert({1, {'_', 'O', 'O'}});
    gameBoard.insert({2, {'O', '_', '_'}});

    while (true) {
        outputGameBoard(gameBoard);
        std::string playerMove;
        do {
            std::cout << "Player Move: ";
            std::getline(std::cin, playerMove);
        } while (invalidMove(playerMove, gameBoard));
        
        std::map<int, std::vector<int>> winMoves = getSelectSpots('O', gameBoard);
        for (int i = 0; i < 3; i++) {
            std::cout << "Row: " << i << std::endl;
            int vectorSize = winMoves[i].size();
            for (int j = 0; j < vectorSize; j++) {
                std::cout << winMoves[i][j];
            };
            std::cout << std::endl;
        };
        
        bool handledWinMoves = handlePossibleMoves(winMoves, gameBoard); 
        
        //std::map<int, std::vector<int>> blockMoves = getSelectSpots('X', gameBoard);
        //std::map<int, std::vector<int>> emptyMoves = getEmptySpots(gameBoard);
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