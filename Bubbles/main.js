const Canvas = document.getElementById("BubbleCanvas")
const CTX = Canvas.getContext("2d")
Canvas.width = window.innerWidth
Canvas.height = window.innerHeight

const MousePos = [0, 0]
const BubbleData = []
const SpawnBubbleAt = 5
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
    return(Math.floor(Math.random() * (RadiusConstraints[1]*10))/10 + RadiusConstraints[0])
}

function CanSpawnBubble(XPos, YPos, Radius) {
    const BubbleLength = BubbleData.length
    for (let i = 0; i < BubbleLength; i++) {
        const SelectedBubble = BubbleData[i]
        const Distance = Math.sqrt((SelectedBubble.XPos - XPos)**2+(SelectedBubble.YPos - YPos)**2)
        if (Distance < SelectedBubble.Radius + Radius) {
            return(false)
        }
    }   
    return (true)
}

function MoveNearbyBubbles(UseX, UseY) {
    const BubbleLength = BubbleData.length
    for (let i = 0; i < BubbleLength; i++) {
        const SelectedBubble = BubbleData[i]
        const DX = (SelectedBubble.XPos - UseX)
        const DY = (SelectedBubble.YPos - UseY)
        const Distance = Math.sqrt(DX**2 + DY**2)
        if (Distance <= SelectedBubble.Radius) {
            const Angle = Math.atan2(DY, DX)
            SelectedBubble.XPos += Math.cos(Angle) * (SelectedBubble.Radius-Distance)
            SelectedBubble.YPos += Math.sin(Angle) * (SelectedBubble.Radius-Distance)
        }
    }
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

    MoveNearbyBubbles(MousePos[0], MousePos[1])

    for (let i = BubbleLength-1; i > 0; i--) {
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
        if ((SelectedBubble.YPos + SelectedBubble.Radius) < 0) {
            BubbleData.splice(i,1)
        }
    }
    requestAnimationFrame(RunBubbles)
}

RunBubbles()

Canvas.addEventListener("mousemove", function(event) {
    const BoundingRect = Canvas.getBoundingClientRect()
    MousePos[0] = Math.floor(event.pageX - BoundingRect.left)
    MousePos[1] = Math.floor(event.pageY - BoundingRect.top)
})

window.addEventListener("resize", function() {
    Canvas.width = window.innerWidth
    Canvas.height = window.innerHeight
})