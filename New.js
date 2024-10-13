const DragDiv = document.createElement("div")
DragDiv.classList.add("DragDiv")
DragDiv.style.position = "fixed"
DragDiv.style.left = "0px"
DragDiv.style.top = "0px"
DragDiv.style.height = "100px"
DragDiv.style.width = "125px"
DragDiv.style.backgroundColor = "black"
DragDiv.style.zIndex = "100"
document.body.append(DragDiv)


function SuperDiv(Div) {
    const ResizeRange = 25
    const GrabbedAt = [null, null]

    document.addEventListener("mousemove", function(event) {
        if (GrabbedAt[0] && GrabbedAt[1]) {
            const NewGrabAtX = event.pageX-Number(String(Div.style.left).replace("px",""))
            const NewGrabAtY = event.pageY-Number(String(Div.style.top).replace("px",""))

            const UseHeight = Number(Div.style.height.replace("px",""))
            const UseWidth = Number(Div.style.width.replace("px",""))

            const XMin = (GrabbedAt[0] <= ResizeRange)
            const XMax = (GrabbedAt[0] >= UseWidth-ResizeRange)
            const YMin = (GrabbedAt[1] <= ResizeRange)
            const YMax = (GrabbedAt[1] >= UseHeight-ResizeRange)

            if ((XMin || XMax) && !YMin && !YMax) {
                console.log("XRange")
                Div.style.width = `${UseWidth+(NewGrabAtX-GrabbedAt[0])}px`
                
            } else if ((YMin || YMax) && !XMin && !XMax) {
                console.log("YRange")
                Div.style.height = `${UseHeight+(NewGrabAtY-GrabbedAt[1])}px`

            } else {
                console.log("DragRange")
                event.preventDefault()
                Div.style.left = `${event.pageX-GrabbedAt[0]}px`
                Div.style.top = `${event.pageY-GrabbedAt[1]}px`
            }     
        }
    })

    /*Div.addEventListener("mouseover", function() {
        
    })*/
    
    Div.addEventListener("mousedown", function(event) {
        event.preventDefault()
        GrabbedAt[0] = event.pageX-Number(String(Div.style.left).replace("px",""))
        GrabbedAt[1] = event.pageY-Number(String(Div.style.top).replace("px",""))
    })
    
    Div.addEventListener("mouseup", function() {
        GrabbedAt[0] = null
        GrabbedAt[1] = null
    })

    Div.addEventListener("mouseleave", function() {
        GrabbedAt[0] = null
        GrabbedAt[1] = null
    })
}

SuperDiv(DragDiv)