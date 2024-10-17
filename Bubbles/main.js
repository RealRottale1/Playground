const Canvas = document.getElementById("BubbleCanvas")
console.log(Canvas)

const CTX = Canvas.getContext("2d")

const BubbleData = []
const SpawnBubbleAt = 50
const RadiusConstraints = [10, 50]
const YBy = 0.75

function RandomColor() {
    const R = Math.floor(Math.random() * 255)
    const G = Math.floor(Math.random() * 255)
    const B = Math.floor(Math.random() * 255)
    return (`rgba(${R} , ${G}, ${B}, 1)`)
}

function RandomXPos() {
    return(String(Math.floor(Math.random() * Canvas.width)))
}

function RandomRadius() {
    return(String(Math.floor(Math.random() * RadiusConstraints[1]) + RadiusConstraints[0]))
}

function CanSpawnBubble() {
    const BubbleLength = BubbleData.length
    for (let i = 0; i < BubbleLength; i++) {
        const SelectedBubble = BubbleData[i]
        // Setup check to see if bubble is inside of a bubble
    }
    return(true)
}

let SpawnBubble = 0
function RunBubbles() {
    SpawnBubble += 1
    if (SpawnBubble >= SpawnBubbleAt) {
        SpawnBubble = 0
        const Radius = RandomRadius()
        const XPos = RandomXPos()
        const YPos = 0-Radius
        if (CanSpawnBubble()) {
            const NewBubble = [RandomColor(), XPos, YPos, Radius]
            BubbleData.push(NewBubble)
        }
    }
    CTX.clearRect(0, 0, Canvas.width, Canvas.height)
    const BubbleLength = BubbleData.length
    for (let i = 0; i < BubbleLength; i++) {
        const SelectedBubble = BubbleData[i]
        CTX.beginPath()
        CTX.fillStyle = SelectedBubble[0]
        CTX.arc(SelectedBubble[1], (Canvas.height - SelectedBubble[2]), SelectedBubble[3], 0, 2 * Math.PI)
        CTX.fill()
        SelectedBubble[2] += YBy
    }
    requestAnimationFrame(RunBubbles)
}

RunBubbles()