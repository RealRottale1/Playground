const DragDiv = document.createElement("div")
DragDiv.classList.add("DragDiv")
DragDiv.style.position = "fixed"
DragDiv.style.left = "0px"
DragDiv.style.top = "0px"
DragDiv.style.height = "100px"
DragDiv.style.width = "125px"
DragDiv.style.border = "solid red 35px"
DragDiv.style.backgroundColor = "black"
DragDiv.style.zIndex = "100"
document.body.append(DragDiv)


function SuperDiv(Div) {
    const ResizeRange = 35
    const GrabbedAt = [null, null]
    const DivSize = [Div.style.width.replace("px",""), Div.style.height.replace("px","")]
    const DivPos = [Div.style.left.replace("px",""), Div.style.top.replace("px","")]

    document.addEventListener("mousemove", function(event) {
        if (GrabbedAt[0] && GrabbedAt[1]) {

            const NewGrabAtX = event.pageX-DivPos[0]
            const NewGrabAtY = event.pageY-DivPos[1]

            const XMin = (GrabbedAt[0] <= ResizeRange)
            const XMax = (GrabbedAt[0] >= DivSize[0]-ResizeRange)
            const YMin = (GrabbedAt[1] <= ResizeRange)
            const YMax = (GrabbedAt[1] >= DivSize[1]-ResizeRange)


            //console.log((DivSize[0]-NewGrabAtX)*-1)
            if ((XMin || XMax) && !YMin && !YMax) {
                console.log("XRange")
                const XChange = (NewGrabAtX-GrabbedAt[0])*(XMin ? 1 : -1)
                Div.style.width = `${DivSize[0]-XChange}px`
                if (XMin) {
                    Div.style.left = `${DivPos[0]-(XChange*-1)}px`
                }

            } else if ((YMin || YMax) && !XMin && !XMax) {
                console.log("YRange")
                const YChange = (NewGrabAtY-GrabbedAt[1])*(YMin ? 1 : -1)
                Div.style.height = `${DivSize[1]-YChange}px`
                if (YMin) {
                    Div.style.top = `${DivPos[1]-(YChange*-1)}px`
                }

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
        DivSize[0] = Div.style.width.replace("px","")
        DivSize[1] = Div.style.height.replace("px","")
        DivPos[0] = Div.style.left.replace("px","")
        DivPos[1] = Div.style.top.replace("px","")
    })

    Div.addEventListener("mouseleave", function() {
        GrabbedAt[0] = null
        GrabbedAt[1] = null
        DivSize[0] = Div.style.width.replace("px","")
        DivSize[1] = Div.style.height.replace("px","")
        DivPos[0] = Div.style.left.replace("px","")
        DivPos[1] = Div.style.top.replace("px","")
    })
}

SuperDiv(DragDiv)