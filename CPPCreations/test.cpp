/*
    collision = Map -inf, 0, inf
        chunk = Array containing yHeight * Arrays
            Array = block id

    background = same as collision map but if a collision block is present the background block is not rendered

    rendering {
        background
        collision
        player
    }

    detecting hits {
        xPos from center of screen = xPos % xScreenSize
        
    }
*/