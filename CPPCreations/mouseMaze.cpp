#include <iostream>
#include <map>
#include <array>
#include <vector>
#include <algorithm>
#include <cmath>
#include <deque>

#include <string>

std::map<int, std::array<std::string, 10>> maze = {
    {0, {"⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"}},
    {1, {"⬛", "🐭", "⬛", "⬜", "⬛", "⬜", "⬜", "⬜", "⬜", "⬛"}},
    {2, {"⬛", "⬜", "⬛", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬛"}},
    {3, {"⬛", "⬜", "⬛", "⬜", "⬛", "⬜", "⬜", "⬜", "⬜", "⬛"}},
    {4, {"⬛", "⬜", "⬛", "⬜", "⬛", "⬛", "⬛", "⬜", "⬜", "⬛"}},
    {5, {"⬛", "⬜", "⬛", "⬜", "⬜", "⬜", "⬛", "⬜", "⬜", "⬛"}},
    {6, {"⬛", "⬜", "⬛", "⬜", "⬛", "⬜", "⬛", "⬜", "⬜", "⬛"}},
    {7, {"⬛", "⬜", "⬛", "⬜", "⬛", "⬜", "⬛", "⬜", "⬜", "⬛"}},
    {8, {"⬛", "⬜", "⬜", "⬜", "⬛", "⬛", "⬛", "⬜", "🧀", "⬛"}},
    {9, {"⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛", "⬛"}},
};

std::array<int, 2> getPositionOfChar(std::string findChar) {
    for (int y = 0; y < 10; y++) {
        for (int x = 0; x < 10; x++) {
            if (maze[y][x] == findChar) {
                return {x, y};
            }
        }
    }
    return {-1, -1};
}

struct tile {
    bool isWall;
    int x;
    int y;
    int f = 0;
    int g = 0;
    double h = 0;
    tile* parent = nullptr;
    bool operator==(const tile& other) const {
        return (x == other.x) && (y == other.y);
    }
};

std::map<int, std::array<tile, 10>> makeTiledMaze() {
    std::map<int, std::array<tile, 10>> tiledMaze;
    for (int y = 0; y < 10; y++) {
        std::array<tile, 10> row;
        for (int x = 0; x < 10; x++) {
            tile newTile;
            newTile.x = x;
            newTile.y = y;
            newTile.isWall = (maze[y][x] == "⬛" ? true : false);
            row[x] = newTile;
        }
        tiledMaze.insert({y, row});
    }
    return tiledMaze;
}

std::vector<tile*> getNeighbors(int x, int y, std::map<int, std::array<tile, 10>> &tiledMaze) {
    std::vector<tile*> neighbors; // ask about
    for (int rep = 0; rep < 2; rep++) {
        const int change = (!rep ? -1 : 1);
        if (y+change > -1 && y+change < 11) {
            tile* neighbor = &tiledMaze[y+change][x];
            if (!neighbor->isWall) {
                neighbors.push_back(neighbor);
            }
        }
        if (x+change > -1 && x+change < 11) {
            tile* neighbor = &tiledMaze[y][x+change];
            if (!neighbor->isWall) {
                neighbors.push_back(neighbor);
            }
        }
        for (int rep2 = 0; rep2 < 2; rep2++) {
            const int change2 = (!rep2 ? -1 : 1);
            if (y+change2 > -1 && y+change2 < 11 && x+change > -1 && x+change < 11) {
                tile* neighbor = &tiledMaze[y+change2][x+change];
                if (!neighbor->isWall) {
                    neighbors.push_back(neighbor);
                }
            }
        }
    }
    return neighbors;
}

bool includesNeighbor(std::vector<tile*> &theSet, tile* neighbor) {
    const int openSetSize = theSet.size();
    for (int i = 0; i < openSetSize; i++) {
        if (*theSet[i] == *neighbor) {
            return true;
        }
    }
    return false;
}

double heuristic(tile* pos0, tile* pos1) {
    return std::abs(pos1->x - pos0->x) + std::abs(pos1->y - pos0->y);
}

std::deque<std::array<int, 2>> findPath(int sX, int sY, int eX, int eY) {
    std::map<int, std::array<tile, 10>> tiledMaze = makeTiledMaze();
    tile* startPoint = &tiledMaze[sY][sX];
    tile* endPoint = &tiledMaze[eY][eX];

    std::deque<std::array<int, 2>> path;
    std::vector<tile*> openSet = {startPoint};
    std::vector<tile*> closedSet;

    do {
        int lowestIndex = 0;
        const int openSetSize = openSet.size();
        for (int i = 0; i < openSetSize; i++) {
            if (openSet[i]->f < openSet[lowestIndex]->f) {
                lowestIndex = i;
            }
        }
        
        tile* currentPoint = openSet[lowestIndex];
        if (*currentPoint == *endPoint) {
            tile* tempTile = currentPoint;
            path.push_front({tempTile->x, tempTile->y});
            while (tempTile->parent) {
                path.push_front({tempTile->parent->x, tempTile->parent->y});
                tempTile = tempTile->parent;
            }
            return path;
        }

        openSet.erase(openSet.begin() + lowestIndex);
        closedSet.push_back(currentPoint);

        std::vector<tile*> neighbors = getNeighbors(currentPoint->x, currentPoint->y, tiledMaze);
        for (auto &neighbor : neighbors) {
            if (!includesNeighbor(closedSet, neighbor)) {
                const int possibleG = currentPoint->g + 1;

                if (!includesNeighbor(openSet, neighbor)) {
                    openSet.push_back(neighbor);
                } else if (possibleG >= neighbor->g) {
                    continue;
                }

                neighbor->g = possibleG;
                neighbor->h = heuristic(neighbor, endPoint);
                neighbor->f = neighbor->g + neighbor->h;
                neighbor->parent = currentPoint;;
            }
        }

    } while (!openSet.empty());
    path.push_front({-1, -1});
    return path;
}

int main() {
    auto [startX, startY] = getPositionOfChar("🐭");
    auto [endX, endY] = getPositionOfChar("🧀");
    
    std::deque<std::array<int, 2>> pathRoute = findPath(startX, startY, endX, endY);
    
    maze[startY][startX] = "⬜";

    const int pathRouteSize = pathRoute.size();
    for (int i = 0; i < pathRouteSize; i++) {
        for (int y = 0; y < 10; y++) {
            for (int x = 0; x < 10; x++) {
                if (y == pathRoute[i][1] && x == pathRoute[i][0]) {
                    std::cout << ' ' << ' ' << "🐭";
                } else {
                    std::cout << ' ' << ' ' << maze[y][x];
                }
            }
            std::cout << std::endl;
        }
        std::cin.get();
    }

    if (pathRoute[0][0] == -1 && pathRoute[0][1] == -1) {
        std::cout << "Mouse could not get the cheese!" << std::endl;
    } else {
        std::cout << "Mouse got the cheese!" << std::endl;
    }

    return 0;
}