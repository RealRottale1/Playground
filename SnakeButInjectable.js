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
MainDiv.style.zIndex = "9999"
SnakeHead.style.height = "25px"
SnakeHead.style.width = "25px"
SnakeHead.style.position = "relative"
SnakeHead.style.top = "50%"
SnakeHead.style.left = "50%"
MainDiv.appendChild(SnakeHead)

// Variables And Stuff
let SnakePosition = []
const HeadPosition = [50, 50]
const DirUp = [0, 0] // Direction, Up
const MoveBy = 5


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

document.addEventListener("keydown", function(event) {
    console.log(event.key)
    const [Direction, Up] = GetDirection(event.key)
    console.log(Direction+","+Up)
})