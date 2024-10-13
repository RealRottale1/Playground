// Creates MainDiv
const MainDiv = document.createElement("div")
MainDiv.classList.add("MainDiv")
MainDiv.style.backgroundColor = "rgba(187.5, 187.5, 187.5, 1)"
MainDiv.style.zIndex = "999"
MainDiv.style.height = "500px"
MainDiv.style.width = "500px"
MainDiv.style.position = "fixed"
MainDiv.style.top = "50%"
MainDiv.style.left = "50%"
MainDiv.style.transform = "translate(-50%, -50%)"
MainDiv.style.border = "solid black 25px"
MainDiv.style.borderRadius = "10px"
document.body.appendChild(MainDiv)

// Creates Original Snake
const SnakeHead = document.createElement("div")
SnakeHead.classList.add("SnakeHead")
SnakeHead.style.backgroundColor = "green"
SnakeHead.style.height = "25px"
SnakeHead.style.width = "25px"
SnakeHead.style.borderRadius = "5px"
SnakeHead.style.position = "absolute"
SnakeHead.style.top = "50%"
SnakeHead.style.left = "50%"
MainDiv.appendChild(SnakeHead)

// Creates Snake Food
const SnakeFood = document.createElement("div")
SnakeFood.classList.add("SnakeHead")
SnakeFood.style.backgroundColor = "red"
SnakeFood.style.height = "25px"
SnakeFood.style.width = "25px"
SnakeFood.style.position = "absolute"
SnakeFood.style.backgroundImage = "radial-gradient(circle, red, rgba(200, 0, 0, 1))"
SnakeFood.style.borderRadius = "25px"
MainDiv.appendChild(SnakeFood)


// Variables And Stuff
const MoveBy = 5 // Don't Edit!
const TickRate = 187.5

let SnakePositions = [[50,50]]
let SnakeParts = [SnakeHead]

const DirUp = [0,0] // Direction, Up
const SnakeFoodPosition = [null,null]

let ValidPositions = new Map() // Generates Map Of Valid Positions
for (i = 0; i < 20; i++) {
    let Row = []
    for (ii = 0; ii < 20;  ii++) {
        Row.push(ii*5)
    }
    ValidPositions.set(i*5,Row)
}

// Creates Score Board
const ScoreBoard = document.createElement("p")
ScoreBoard.classList.add("ScoreBoard")
ScoreBoard.style.zIndex = "100"
ScoreBoard.style.opacity = "0"
ScoreBoard.style.height = "100px"
ScoreBoard.style.lineHeight = "100px"
ScoreBoard.style.width = "300px"
ScoreBoard.style.textAlign = "center"
ScoreBoard.style.fontSize = "55px"
ScoreBoard.style.position = "relative"
ScoreBoard.style.margin = "0px"
ScoreBoard.style.padding = "0px"
ScoreBoard.style.top = "50%"
ScoreBoard.style.left = "50%"
ScoreBoard.style.transform = "translate(-50%, -50%)"
ScoreBoard.style.border = "solid black 5px"
ScoreBoard.style.borderRadius = "10px"
ScoreBoard.style.backgroundColor = "rgba(125, 125, 125, 1)"
MainDiv.appendChild(ScoreBoard)


// Spawns Food()
function SpawnFood() {
    let UVP = new Map(ValidPositions)
    const SnakeLength = SnakePositions.length
    for (let i = 0; i < SnakeLength; i++) {
        const UseSnakePosition = SnakePositions[i]
        const Row = UVP.get(UseSnakePosition[0])
        if (Row != null) {
            const Index = Row.indexOf(UseSnakePosition[1])
            if (Index != -1) {
                Row.splice(Index,1)
                if (Row.length < 1) {
                    UVP.delete(UseSnakePosition[0])
                }
            }
        }
    }
    if (UVP.size == 0) {
        return(true)
    }
    const UseUVP = Array.from(UVP.entries())
    const RanKey = Math.floor(Math.random()*(UseUVP.length-1))
    const UseRandomKey = UseUVP[RanKey][0]
    const UseRandomValue = UseUVP[RanKey][1][Math.floor(Math.random()*UseUVP[RanKey][1].length)]
    SnakeFoodPosition[1] = UseRandomKey
    SnakeFoodPosition[0] = UseRandomValue
    SnakeFood.style.top = String(SnakeFoodPosition[1])+"%"
    SnakeFood.style.left = String(SnakeFoodPosition[0])+"%"   
}

// Handles Directions From Keyboard Input
function GetDirection(Key) {
    if (typeof(Key) != "string") {
        return([null, null])
    }
    switch (String(Key)) {
        case "a":
            return([-1,0])
        case "d":
            return([1,0])
        case "s":
            return([1,1])
        case "w":
            return([-1,1])
        default:
            return([null, null])
    }
}

// Handles Keyboard Input
document.addEventListener("keydown", function(event) {
    const [Direction, Up] = GetDirection(event.key)
    if (Direction) {
        DirUp[0] = Direction
        DirUp[1] = Up
    }
})

// Hanles Tick System
async function TickWait() {
    return new Promise(Results => {
        setTimeout(() => {
            Results()
        },TickRate)
    })
}

// Handles Snake Growing
function GrowSnake() {
    const SnakeLength = SnakePositions.length
    const SnakeBody = document.createElement("div")
    SnakeBody.classList.add("SnakeBody")
    if ((SnakeLength%2) == 0) {
        SnakeBody.style.backgroundColor = "rgba(0, 128, 0, 1)"
    } else {
        SnakeBody.style.backgroundColor = "rgba(0, 184, 0, 1)"
    }
    SnakeBody.style.height = "25px"
    SnakeBody.style.width = "25px"
    SnakeBody.style.borderRadius = "5px"
    SnakeBody.style.position = "absolute"

    const [XAxis, YAxis] = SnakePositions[SnakeLength-1]
    SnakeBody.style.top = String(YAxis)+"%"
    SnakeBody.style.left = String(XAxis)+"%"

    MainDiv.appendChild(SnakeBody)
    SnakePositions.push([XAxis, YAxis])
    SnakeParts.push(SnakeBody)
}

// Handles Setting Snake To New Position
function SetNewSnakePosition(SnakeLength) {
    if (SnakeLength > 1) {
        for (let i = 0; i < SnakeLength-1; i++) {
            const UseIndex = (SnakeLength)-(i+1)
            SnakePositions[UseIndex][0] = SnakePositions[UseIndex-1][0]
            SnakePositions[UseIndex][1] = SnakePositions[UseIndex-1][1]
        }
    }
    SnakePositions[0][DirUp[1]] += DirUp[0]*MoveBy
}

// Handles CSS Update Of Snake Position
function MoveSnakeToPosition(SnakeLength) {
    for (let i = 0; i < SnakeLength; i++) {
        const UseSnakePosition = SnakePositions[i]
        const UseSnakePart = SnakeParts[i]
        UseSnakePart.style.left = String(UseSnakePosition[0])+"%"
        UseSnakePart.style.top = String(UseSnakePosition[1])+"%"
    }
}

// Detects If Snake Hit Itself
function SnakeHitSelf(SnakeLength) {
    if (SnakeLength < 2) {
        return(false)
    }
    for (let i = 1; i < SnakeLength; i++) {
        const UseSnakePosition = SnakePositions[i]
        if (UseSnakePosition[0] == SnakePositions[0][0] && UseSnakePosition[1] == SnakePositions[0][1]) {
            return(true)
        } 
    }
}

// Detects If Snake Hit Border
function SnakePastBorder(SnakeLength) {
    for (let i = 0; i < SnakeLength; i++) {
        const UseSnakePart = SnakeParts[i]
        const Up = Number(String(UseSnakePart.style.top).replace("%",""))
        const Left = Number(String(UseSnakePart.style.left).replace("%",""))
        if (Up < 0 || Up >= 100 || Left < 0 || Left >= 100) {
            return(true)
        }
    }   
}

// Detects If Snake Ate Food
function SnakeAteFood() {
    if (SnakeFoodPosition[0] == SnakePositions[0][0] && SnakeFoodPosition[1] == SnakePositions[0][1]) {
        return(true)
    }
}

// Handles Showing Score Board
function ShowScoreBoard() {
    ScoreBoard.textContent = "Score: "+String(SnakeParts.length)
    ScoreBoard.style.opacity = "1"
}

// Main Game Loop
async function StartGame() {
    while (true) {
        await TickWait()
    
        if (DirUp[0]) {
            const SnakeLength = SnakePositions.length
            SetNewSnakePosition(SnakeLength)
            console.log(SnakePositions)
            MoveSnakeToPosition(SnakeLength)
            if (SnakeHitSelf(SnakeLength) || SnakePastBorder(SnakeLength)) {
                ShowScoreBoard()
                break
            }
            if (SnakeAteFood()) {
                GrowSnake()
                const NoMoreFood = SpawnFood()
                if (NoMoreFood) {
                    ShowScoreBoard()
                    break
                }
            }
        }
    }
}

SpawnFood()
StartGame()

