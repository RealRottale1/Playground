#include <iostream>
#include <array>
#include <string>

struct gameSettings
{
    static constexpr int refreshRate = 64;
    static constexpr unsigned int screenX = 1200;
    static const unsigned int screenY = 1000;
};

struct player
{
    double health = 100.0d;
    std::array<float, 2> position = {0.0f, 0.0f};
};

int main()
{
    std::cout << "Refresh Rate: " << gameSettings::refreshRate << std::endl;
    std::cout << "Screen Size X: " << gameSettings::screenX << std::endl;
    std::cout << "Screen Size Y: " << gameSettings::screenY << std::endl;

    player rottale1;
    player *pntr = &rottale1;

    std::cout << "Player Health: " << (*pntr).health << std::endl;
    std::cout << "Player Position: " << pntr->position[0] << ", " << pntr->position[1];

    return 0;
}