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
SnakeHead.style.position = "relative"
SnakeHead.style.top = "50%"
SnakeHead.style.left = "50%"
MainDiv.appendChild(SnakeHead)

// Variables And Stuff
const MoveBy = 5
const TickRate = 100

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
            return([-1,1])
        case "w":
            return([1,1])
        default:
            return([null, null])
    }
}

// Controls
document.addEventListener("keydown", function(event) {
    console.log(event.key)
    const [Direction, Up] = GetDirection(event.key)
    if (Direction) {
        DirUp[0], DirUp[1] = Direction, Up
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
    const SnakeBody = document.createElement("div")
    SnakeBody.classList.add("SnakeBody")
    SnakeBody.style.backgroundColor = "green"
    SnakeBody.style.height = "25px"
    SnakeBody.style.width = "25px"
    SnakeBody.style.position = "relative"
    SnakeBody.style.top = "50%"
    SnakeBody.style.left = "50%"
    MainDiv.appendChild(SnakeBody)
}

function HandleSnakePart(UseSnakePosition, UseSnakePart) {

}

// Game Loop
while (true) {
    await TickWait()
    console.log(SnakePositions[0])
    if (DirUp[0]) {
        HandleSnakePart(SnakePositions[0], SnakeParts[0])
    }
    const SnakeLength = SnakePositions.length
    for (let i = 0; i < SnakeLength; i++) {
        const UseSnakePosition = SnakePositions[i]
        const UseSnakePart = SnakeParts[i]
    }
}

//        SnakePositions[0][Up] += Direction*MoveBy