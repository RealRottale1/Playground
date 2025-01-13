// 2d box intersection
/*static bool intersects(std::array<float, 2> box1, float box1SizeX, float box1SizeY, std::array<float, 2> box2, float box2SizeX, float box2SizeY)
{   
    for (int i = 0; i < 1; i++)
    {
        const float boxSize = (i ? box1SizeY : box1SizeX);
        const std::array<float, 2> pos1 = { box1[i] - boxSize / 2.0f, box1[i] + boxSize / 2.0f };
        const std::array<float, 2> pos2 = { box2[i] - boxSize / 2.0f, box2[i] + boxSize / 2.0f };
        const std::array<float, 2>* lowestPos = (pos1[i] >= pos2[i] ? &pos2 : &pos1);
        const std::array<float, 2>* nextPos = (lowestPos == &pos1 ? &pos2 : &pos1);
        const bool intersects = (((*nextPos)[i] >= (*lowestPos)[i]) && ((*nextPos)[i] <= (*lowestPos)[1]));
        if (!intersects)
        {
            return false;
        }
    }
    return true;
}*/