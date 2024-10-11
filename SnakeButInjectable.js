// Creates MainDiv
const MainDiv = document.createElement("div")
MainDiv.classList.add("MainDiv")
MainDiv.style.zIndex = "0"
MainDiv.style.height = "100%"
MainDiv.style.width = "100%"
MainDiv.style.position = "fixed"
MainDiv.style.top = "0px"
document.body.appendChild(MainDiv)

// Creates Original Snake
const SnakeHead = document.createElement("div")
SnakeHead.classList.add("SnakeHead")
SnakeHead.style.backgroundColor = "green"
//MainDiv.style.zIndex = "9999"
SnakeHead.style.height = "25px"
SnakeHead.style.width = "25px"
SnakeHead.style.position = "absolute"
SnakeHead.style.top = "50%"
SnakeHead.style.left = "50%"
MainDiv.appendChild(SnakeHead)

// Variables And Stuff
const MoveBy = 2.5
const TickRate = 125

let SnakePositions = [[50,50]]
let SnakeParts = [SnakeHead]

const DirUp = [0, 0] // Direction, Up

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

// Controls
document.addEventListener("keydown", function(event) {
    console.log(event.key)
    const [Direction, Up] = GetDirection(event.key)
    if (Direction) {
        DirUp[0] = Direction
        DirUp[1] = Up
    }
})

async function TickWait() {
    return new Promise(Results => {
        setTimeout(() => {
            Results()
        },TickRate)
    })
}

function GrowSnake() {
    const SnakeLength = SnakePositions.length
    const SnakeBody = document.createElement("div")
    SnakeBody.classList.add("SnakeBody")
    SnakeBody.style.backgroundColor = "green"
    SnakeBody.style.height = "25px"
    SnakeBody.style.width = "25px"
    SnakeBody.style.position = "absolute"

    const [XAxis, YAxis] = SnakePositions[SnakeLength-1]
    SnakeBody.style.top = String(XAxis)+"%"
    SnakeBody.style.left = String(YAxis)+"%"


    MainDiv.appendChild(SnakeBody)
    SnakePositions.push([XAxis, YAxis])
    SnakeParts.push(SnakeBody)
}

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

function MoveSnakeToPosition(SnakeLength) {
    for (let i = 0; i < SnakeLength; i++) {
        const UseSnakePosition = SnakePositions[i]
        const UseSnakePart = SnakeParts[i]
        UseSnakePart.style.left = String(UseSnakePosition[0])+"%"
        UseSnakePart.style.top = String(UseSnakePosition[1])+"%"
    }
}

async function StartGame() {
    while (true) {
        await TickWait()
    
        if (DirUp[0]) {
            const SnakeLength = SnakePositions.length
            SetNewSnakePosition(SnakeLength)
            MoveSnakeToPosition(SnakeLength)
        }
    }
}


GrowSnake()
GrowSnake()
GrowSnake()
GrowSnake()
GrowSnake()
GrowSnake()


StartGame()