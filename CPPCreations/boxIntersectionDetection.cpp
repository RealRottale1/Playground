#include <iostream>
#include <array>
#include <string>

static bool intersects(std::array<float, 2> box1, float box1SizeX, float box1SizeY, std::array<float, 2> box2, float box2SizeX, float box2SizeY)
{   
    for (int i = 0; i < 1; i++)
    {
        const float boxSize1 = (i ? box1SizeY : box1SizeX);
        const float boxSize2 = (i ? box2SizeY : box2SizeX);
        
        const std::array<float, 2> pos1 = { box1[i] - boxSize1 / 2.0f, box1[i] + boxSize1 / 2.0f };
        const std::array<float, 2> pos2 = { box2[i] - boxSize2 / 2.0f, box2[i] + boxSize2 / 2.0f };

        const std::array<float, 2>* lowestPos = (pos1[i] >= pos2[i] ? &pos2 : &pos1);
        const std::array<float, 2>* nextPos = (lowestPos == &pos1 ? &pos2 : &pos1);
        const bool intersectsX = (((*nextPos)[i] >= (*lowestPos)[i]) && ((*nextPos)[i] <= (*lowestPos)[1]));
        if (!intersectsX)
        {
            return false;
        }
    }
    return true;
}


int main()
{
    std::array<float, 2> pos1 = {5, 5};
    std::array<float, 2> size1 = {1, 1};

    std::array<float, 2> pos2 = {8, 8};
    std::array<float, 2> size2 = {1, 1};

    std::cout << intersects(pos1, size1[0], size1[1], pos2, size2[0], size2[1]) << std::endl;
    return 0;
}