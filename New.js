const DragDiv = document.createElement("div")
DragDiv.classList.add("DragDiv")
DragDiv.style.position = "fixed"
DragDiv.style.left = "0px"
DragDiv.style.top = "0px"
DragDiv.style.height = "100px"
DragDiv.style.width = "100px"
DragDiv.style.backgroundColor = "black"
DragDiv.style.zIndex = "100"
document.body.append(DragDiv)

DragDiv.addEventListener("mouseleave", function() {
    DragDiv.style.cursor = "default"
    console.log("LEFT")
})

DragDiv.addEventListener("mouseover", function() {
    DragDiv.style.cursor = "grab"
    console.log("OVER")
})

DragDiv.addEventListener("mousedown", function(event) {
    console.log(event.clientX+","+event.clientY)
    DragDiv.style.cursor = "grabbing"
    console.log("DOWN")
})

DragDiv.addEventListener("mouseup", function() {
    DragDiv.style.cursor = "grab"
    console.log("UP")
})