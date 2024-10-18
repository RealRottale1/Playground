const Canvas = document.getElementById("BubbleCanvas")
console.log(Canvas)

const CTX = Canvas.getContext("2d")

const BubbleData = []
const SpawnBubbleAt = 15
const RadiusConstraints = [10, 50]
const YBy = 0.75

function RandomColor() {
    const R = Math.floor(Math.random() * 255)
    const G = Math.floor(Math.random() * 255)
    const B = Math.floor(Math.random() * 255)
    return([R,G,B])
}

function RandomXPos() {
    return(Math.floor(Math.random() * Canvas.width))
}

function RandomRadius() {
    return(Math.floor(Math.random() * RadiusConstraints[1]) + RadiusConstraints[0])
}

function CanSpawnBubble(XPos, YPos, Radius) {
    const BubbleLength = BubbleData.length
    for (let i = 0; i < BubbleLength; i++) {
        const SelectedBubble = BubbleData[i]
        const TotalRadius = Radius + SelectedBubble[3]
        if (Math.abs(SelectedBubble[1] - XPos) >= TotalRadius && Math.abs(SelectedBubble[2] - YPos) >= TotalRadius) {
            return (false)
        }
    }
    return (true)
}

let SpawnBubble = 0
function RunBubbles() {
    SpawnBubble += 1
    if (SpawnBubble >= SpawnBubbleAt) {
        SpawnBubble = 0
        const Radius = RandomRadius()
        const XPos = RandomXPos()
        const YPos = (Canvas.height - (0 - Radius))
        if (CanSpawnBubble(XPos, YPos, Radius)) {
            const NewBubble = {
                Color: RandomColor(),
                Radius: Radius,
                XPos: XPos,
                YPos: YPos,
            }
            BubbleData.push(NewBubble)
        }
    }
    CTX.clearRect(0, 0, Canvas.width, Canvas.height)
    const BubbleLength = BubbleData.length
    for (let i = 0; i < BubbleLength; i++) {
        const SelectedBubble = BubbleData[i]

        CTX.beginPath()
        const Gradient = CTX.createRadialGradient(SelectedBubble.XPos, SelectedBubble.YPos, (SelectedBubble.Radius/3)*2, SelectedBubble.XPos, SelectedBubble.YPos, SelectedBubble.Radius)
        Gradient.addColorStop(0, `rgba(${SelectedBubble.Color[0]}, ${SelectedBubble.Color[1]}, ${SelectedBubble.Color[2]}, 0)`)
        Gradient.addColorStop(.33, `rgba(${SelectedBubble.Color[0]}, ${SelectedBubble.Color[1]}, ${SelectedBubble.Color[2]}, .33)`)
        Gradient.addColorStop(.66, `rgba(${SelectedBubble.Color[0]}, ${SelectedBubble.Color[1]}, ${SelectedBubble.Color[2]}, .66)`)
        Gradient.addColorStop(1, `rgba(${SelectedBubble.Color[0]}, ${SelectedBubble.Color[1]}, ${SelectedBubble.Color[2]}, 1)`)
        CTX.fillStyle = Gradient
        CTX.arc(SelectedBubble.XPos, SelectedBubble.YPos, SelectedBubble.Radius, 0, 2 * Math.PI)
        CTX.fill()

        SelectedBubble.YPos -= YBy
    }
    requestAnimationFrame(RunBubbles)
}

RunBubbles()