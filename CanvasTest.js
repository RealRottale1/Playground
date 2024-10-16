const Canvas = document.createElement("canvas")
Canvas.setAttribute("id","Canvas")
Canvas.style.height = "500px"
Canvas.style.width = "500px"
Canvas.style.position = "fixed"
Canvas.height = 500
Canvas.width = 500
Canvas.style.top = "0%"
Canvas.style.left = "0%"
Canvas.style.transform = "translate(50%, 50%)"
Canvas.style.zIndex = "999"
Canvas.style.backgroundColor = "rgba(125, 125, 125, 1)"
document.body.appendChild(Canvas)

const CContent = Canvas.getContext("2d")

function Draw(XPos, YPos) {
    CContent.fillStyle = "rgba(0, 0, 0, 1)"
    CContent.fillRect(XPos, YPos, 5, 5)
}

Canvas.addEventListener("mousemove", function(event) {
    const UseX = (Number(Canvas.style.width.replace("px","")) - event.clientX)*-1+Canvas.width/2
    const UseY = (Number(Canvas.style.height.replace("px","")) - event.clientY)*-1+Canvas.width/2
    Draw(UseX, UseY)
})
