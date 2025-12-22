const tileConfigurations = {
    standard: {"grass": {r: 1, s: 0.025}, "stone": {r: -1, s: 0, drownDamage: 999}, "sand": {r: 0, s: 0.020}, "shallowwater": {r: 5, s: 0.0125, drownDamage: 0.025}, "deepwater": {r: 100, s: 0.0025, drownDamage: 1}, "lava": {r: 1000, s: 0.00125, drownDamage: 3}},
}

const Soul = {
    "warrior":  {
        texture: "warrior",
        sizeX: 0.5,
        sizeY: 0.5,
        maxHealth: 100,
        isGood: true, 
        pathConfigType: "standard"},
    "goblin":  {
        texture: "goblin",
        sizeX: 0.5,
        sizeY: 0.5,
        maxHealth: 100,
        isGood: false, 
        pathConfigType: "standard"},
}

class FlowField {
    static goodFlowFields = new Map();
    static badFlowFields = new Map();

    static getStartUnits(isGood) {
        const start = [];
        for (const instance of (isGood ? Creature.goodInstances : Creature.badInstances)) {
            start.push([instance.x, instance.y]);
        }
        return start;
    }

    static makeFlowFields() {
        for (let p = 0; p < 2; p++) {
            const useFlowField = (p == 0 ? FlowField.badFlowFields : FlowField.goodFlowFields);
            useFlowField.clear();
            const usePathTypes = (p == 0 ? Creature.badPathTypes : Creature.goodPathTypes);
            for (const pathType of usePathTypes.keys()) {
                // Start up
                const mappedData = new Map();
                let closedData = new Set();
                let openData = FlowField.getStartUnits(p != 0);
                for (const data of openData) {
                    const x = data[0];
                    const y = data[1];
                    closedData.add(x+","+y);
                    if (!mappedData.has(y)) {
                    mappedData.set(y, new Map());
                    }
                    mappedData.get(y).set(x, [0, 0]);
                }
                
                // Pathing
                let distance = 1;
                while (openData.length > 0) {
                    let nextOpenData = [];
                    for (const data of openData) {
                        const x = data[0];
                        const y = data[1];
                        for (let [xDir, yDir] of [[0, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]]) {
                            const nX = xDir + x;
                            const nY = yDir + y;
                            if (!closedData.has(nX+","+nY)) {
                                if (nX >= 0 && nX < BM.maxColumns && nY >= 0 && nY < BM.maxRows) {
                                    closedData.add(nX+","+nY);
                                    if (!mappedData.has(nY)) {
                                        mappedData.set(nY, new Map());
                                    }
                                    const risk = tileConfigurations[pathType][BM.map[nY][nX]].r;
                                    mappedData.get(nY).set(nX, [distance, (risk == -1 ? null : risk)]);
                                    nextOpenData.push([nX, nY]);
                                }
                            }
                        }
                    }
                    openData = nextOpenData;
                    distance += 1;
                }

                // Direction
                const directionData = new Map();
                for (let y = 0; y < BM.maxRows; y++) {
                    directionData.set(y, new Map());
                    for (let x = 0; x < BM.maxColumns; x++) {
                        if (mappedData.get(y).get(x)[1] == null) {
                            directionData.get(y).set(x, null);
                            continue;
                        }
                        let lowestPos = null;
                        let lowestDistance = Number.MAX_VALUE;
                        let lowestRisk = Number.MAX_VALUE;
                        for (let [xDir, yDir] of [[0, -1], [1, 0], [0, 1], [-1, 0], [-1, -1], [1, -1], [1, 1], [-1, 1]]) {
                            const nX = x + xDir;
                            const nY = y + yDir;
                            if (nX >= 0 && nX < BM.maxColumns && nY >= 0 && nY < BM.maxRows) {
                                const data = mappedData.get(nY).get(nX);
                                const distance = data[0];
                                const risk = data[1];
                                if (risk == null) {
                                    continue;
                                }
                                if (distance < lowestDistance || (distance == lowestDistance && risk < lowestRisk)) {
                                    lowestPos = [[nY, nX]];
                                    lowestDistance = distance;
                                    lowestRisk = risk;
                                } else if (distance == lowestDistance && risk == lowestRisk) {
                                    lowestPos.push([nY, nX]);
                                }
                            }
                        }
                        directionData.get(y).set(x, lowestPos);
                    }
                }
                useFlowField.set(pathType, directionData);
            }
        }
    }
}

/* Creatures */
class Creature {
    static goodInstances = new Set();
    static badInstances = new Set();

    static goodPathTypes = new Map();
    static badPathTypes = new Map();

    static allCords = new Map();

    x = 0;
    y = 0;
    fluidX = 0;
    fluidY = 0;

    pathConfigType = null;
    width = 0;
    height = 0;
    health = 0;
    isGood = false;

    repathRange = 1;
    attackRange = 2;

    // Debug
    returnCode = 0;
    debugInfo = null;

    constructor(x, y, soulType) {
        this.x = x;
        this.y = y;
        this.fluidX = x;
        this.fluidY = y;

        const info = Soul[soulType];
        this.width = info.sizeX;
        this.height = info.sizeY;
        this.texture = info.texture;
        this.health = info.maxHealth;
        this.isGood = info.isGood;

        this.pathConfigType = info.pathConfigType;
        const usePathTypes = (this.isGood ? Creature.goodPathTypes : Creature.badPathTypes);
        usePathTypes.set(this.pathConfigType, (usePathTypes.has(this.pathConfigType) ? usePathTypes.get(this.pathConfigType) + 1: 1));    
        
        const useSet = (this.isGood ? Creature.goodInstances : Creature.badInstances);
        useSet.add(this);
        Creature.allCords.set(x+","+y, this);
    }

    static terminate(instance) {
        if (instance.health <= 0) {
            const usePathTypes = (instance.isGood ? Creature.goodPathTypes : Creature.badPathTypes);
            usePathTypes.set(instance.pathConfigType, usePathTypes.get(instance.pathConfigType) - 1);
            if (usePathTypes.get(instance.pathConfigType) <= 0) {
                usePathTypes.delete(instance.pathConfigType);
            }
            Creature.allCords.delete(instance.x+","+instance.y);
            const instanceType = instance.isGood ? Creature.goodInstances : Creature.badInstances;
            instanceType.delete(instance);
        }
    }

    static act(instance) {
        const useFlowType = (instance.isGood ? FlowField.badFlowFields : FlowField.goodFlowFields);
        const useFlowField = useFlowType.get(instance.pathConfigType);
        const nextPositions = useFlowField.get(instance.y).get(instance.x);
        if (nextPositions == null) {return};
        for (const nextPosition of nextPositions) {
            const x = nextPosition[1];
            const y = nextPosition[0];
            if (Creature.allCords.has(x+","+y)) {
                continue;
            }
            const distance = getDistance(y, instance.fluidY, x, instance.fluidX);
            if (distance < 0.1) {
                Creature.allCords.delete(instance.x+","+instance.y);
                instance.fluidX = x;
                instance.fluidY = y;
                instance.x = x;
                instance.y = y;
                Creature.allCords.set(instance.x+","+instance.y, instance);
            } else {
                const tileSpeed = tileConfigurations[instance.pathConfigType][BM.map[y][x]].s;
                instance.fluidX += (x - instance.fluidX) * tileSpeed;
                instance.fluidY += (y - instance.fluidY) * tileSpeed;
                if (distance < 1) {
                    Creature.allCords.delete(instance.x+","+instance.y);
                    instance.x = x;
                    instance.y = y;
                    Creature.allCords.set(instance.x+","+instance.y, instance);
                }
            }
        }
    }

    static renderInstances() {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        for (const instances of [Creature.goodInstances, Creature.badInstances]) {
            for (const instance of instances) {
                const tileX = Math.floor((instance.x- BM.mouseX + 0.5) * tileSize + halfWidth);
                const tileY = Math.floor((instance.y - BM.mouseY + 0.5) * tileSize + halfHeight);
                const screenX = Math.floor((instance.fluidX - BM.mouseX + 0.5) * tileSize + halfWidth);
                const screenY = Math.floor((instance.fluidY - BM.mouseY + 0.5) * tileSize + halfHeight);
                const screenWidth = size*instance.width;
                const screenHeight = size*instance.height;
                
                ctx.drawImage(
                    gameTextures[instance.texture],
                    screenX - screenWidth/2,
                    screenY - screenHeight/2,
                    screenWidth,
                    screenHeight
                );
                ctx.drawImage(
                    gameTextures.debugOutline,
                    tileX - size/2,
                    tileY - size/2,
                    size,
                    size
                );
            }
        }
    }
}










class Creature {
    
    sizeX;  sizeY; gridSpace;
    xPos;  fluidXPos;
    yPos;  fluidYPos;
    health;
    width = 0.5; height = 0.5;

    isGood; subClass;

    static grid; // int: <int: <{int, [int], int<Creature>}>>
    static maxGridSize = 4;

    static units = { // {Boolean: String<Set(Creature)>}
        true: new Map(),
        false: new Map(),
    };

    static tileProps = {"grass": 1, "stone": Number.MAX_VALUE, "shallowwater": 5, "deepwater": 25, "sand": 2, "lava": 250};

    static makeFlowFields() {
        let flowFields = new Map();
        let intentList = new Map();

        // Makes flow field
        for (const [outerKey, subUnitMap] of Object.entries(Creature.units)) {
            const useOuterKey = outerKey === "true";

            for (const [innerKey, _] of subUnitMap) {
                // Gets starting positions
                const closedData = new Map(); // int<int<[risk, distance]>>
                for (let y = 0; y < BM.maxRows; y++) {
                    closedData.set(y, new Map());
                }
                const openData = [];
                for (const [_, enemySet] of Creature.units[useOuterKey ? "false" : "true"]) {
                    for (const enemyCreature of enemySet) {
                        openData.push([enemyCreature.yPos, enemyCreature.xPos]);
                        closedData.get(enemyCreature.yPos).set(enemyCreature.xPos, [Creature.tileProps[BM.map[enemyCreature.yPos][enemyCreature.xPos]], 0]);
                    }
                }

                // Generates closedData which contains positional risk and distance
                let visitedCount = 0;
                while (visitedCount < openData.length) {
                    visitedCount += 1;
                    let useData = openData[visitedCount - 1];
                    let currentDistance = closedData.get(useData[0]).get(useData[1])[1];
                    for (let [yDir, xDir] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
                        let nextY = useData[0] + yDir;
                        let nextX = useData[1] + xDir;
                        if (closedData.has(nextY) && nextX >= 0 && nextX < BM.maxColumns && !closedData.get(nextY).has(nextX)) {
                            if (BM.map[nextY][nextX] != "stone") {
                                openData.push([nextY, nextX]);
                                closedData.get(nextY).set(nextX, [Creature.tileProps[BM.map[nextY][nextX]], currentDistance + 1]);
                            }
                        }
                    }
                }

                // Generates flowData
                let flowData = new Map();
                for (let y = 0; y < BM.maxRows; y++) {
                    flowData.set(y, new Map());
                    for (let x = 0; x < BM.maxColumns; x++) {
                        if (closedData.get(y).has(x)) {
                            
                            let bestY = y;
                            let bestX = x;
                            let bestRisk = Number.MAX_VALUE;
                            let bestDistance = Number.MAX_VALUE;
                            
                            let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
                            for (let i = 3; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [directions[i], directions[j]] = [directions[j], directions[i]]; 
                            }

                            for (let [yDir, xDir] of directions) {
                                let neighborY = y + yDir;
                                let neighborX = x + xDir;
                                if (closedData.has(neighborY) && closedData.get(neighborY).has(neighborX)) {
                                    let neighborData = closedData.get(neighborY).get(neighborX);
                                    let neighborRisk = neighborData[0];
                                    let neighborDistance = neighborData[1];
                                    let riskWeight = 1;
                                    let distanceWeight = 100;
                                    if (neighborDistance * distanceWeight < bestDistance * distanceWeight) {
                                        if (neighborRisk * riskWeight < bestRisk * riskWeight) {
                                        bestY = neighborY;
                                        bestX = neighborX;
                                        bestRisk = neighborRisk;
                                        bestDistance = neighborDistance;
                                        }
                                    }
                                }
                            }
                            flowData.get(y).set(x, [bestY, bestX]);
                        }
                    }
                }

                flowFields.set(innerKey, flowData);
            }
        }

        // Makes intentList
        for (const [outerKey, subUnitMap] of Object.entries(Creature.units)) {
            for (const [innerKey, units] of subUnitMap) {
                for (const unit of units) {
                    let flow = flowFields.get(innerKey);
                    let nextTile = flow.get(unit.yPos).get(unit.xPos);
                    intentList.set(unit, [nextTile[0], nextTile[1]]);

                    unit.yPos = nextTile[0];
                    unit.xPos = nextTile[1];
                    unit.fluidYPos = nextTile[0];
                    unit.fluidXPos = nextTile[1];
                }
            }
        }
    }

    static setUp() {
        let newGrid = new Map();
        for (let y = 0; y < BM.maxRows; y++) {
            let row = new Map();
            for (let x = 0; x < BM.maxColumns; x++) {
                let freeSpaces = [];
                let instances = new Map();
                for (let i = 0; i < Creature.maxGridSize; i++) {
                    freeSpaces.push(i);
                    instances.set(i, null);
                }
                row.set(x, {size: 0, freeSpaces: freeSpaces, instances: instances});
            }
            newGrid.set(y, row);
        }
        this.grid = newGrid;
    }

    static renderInstances() {
        const baseTileSize = WP.windowWidth / BM.maxColumns;
        const tileSize = baseTileSize * BM.zoom;
        const size = Math.ceil(tileSize);

        const halfWidth = WP.windowWidth / 2;
        const halfHeight = WP.windowHeight / 2;

        for (const [_, subUnitMap] of Object.entries(Creature.units)) {
            for (const [_, units] of subUnitMap) {
                for (const unit of units) {
                    const tileX = Math.floor((unit.xPos- BM.mouseX + 0.5) * tileSize + halfWidth);
                    const tileY = Math.floor((unit.yPos - BM.mouseY + 0.5) * tileSize + halfHeight);
                    const screenX = Math.floor((unit.fluidXPos - BM.mouseX + 0.5) * tileSize + halfWidth);
                    const screenY = Math.floor((unit.fluidYPos - BM.mouseY + 0.5) * tileSize + halfHeight);
                    const screenWidth = size*unit.width;
                    const screenHeight = size*unit.height;
                    ctx.drawImage(
                        gameTextures[unit.subClass],
                        screenX - screenWidth/2,
                        screenY - screenHeight/2,
                        screenWidth,
                        screenHeight
                    );
                    ctx.drawImage(
                        gameTextures.debugOutline,
                        tileX - size/2,
                        tileY - size/2,
                        size,
                        size
                    );
                }
            }
        }
    }

    constructor(x, y, isGood, subClass) {
        this.xPos = x; this.fluidXPos = x;
        this.yPos = y; this.fluidYPos = y;

        this.isGood = isGood;
        this.subClass = subClass;
        if (Creature.units[this.isGood].has(this.subClass)) {
            Creature.units[this.isGood].get(this.subClass).add(this);
        } else {
            let newSet = new Set();
            newSet.add(this);
            Creature.units[this.isGood].set(this.subClass, newSet);
        }

        this.gridSpace = 1;
        const gridData = Creature.grid.get(y).get(x);
        gridData.size += this.gridSpace;
        const instanceIndex = gridData.freeSpaces.pop();
        gridData.instances.set(instanceIndex, this);
    }
}