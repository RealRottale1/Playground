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

const CTX = Canvas.getContext("2d")
CTX.globalAlpha = .25
CTX.arc(100, 100, 50, 0, 1*Math.PI, true)
CTX.fill()
CTX.closePath()

CTX.globalAlpha = .5
CTX.arc(100, 120, 50, 0, 1*Math.PI, true)
CTX.fill()
CTX.closePath()

CTX.globalAlpha = .75
CTX.arc(100, 140, 50, 0, 1*Math.PI, true)
CTX.fill()
CTX.closePath()