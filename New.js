const DragDiv = document.createElement("div")
DragDiv.classList.add("DragDiv")
DragDiv.style.position = "fixed"
DragDiv.style.left = "0px"
DragDiv.style.top = "0px"
DragDiv.style.height = "100px"
DragDiv.style.width = "125px"
DragDiv.style.backgroundColor = "rgba(125, 150, 125, 1)"
DragDiv.style.zIndex = "100"
document.body.append(DragDiv)


function AdjustableDiv(Div) {
    const ResizeRange = 35
    const GrabbedAt = [null, null]
    const DivSize = [Div.style.width.replace("px", ""), Div.style.height.replace("px", "")]
    const DivPos = [Div.style.left.replace("px", ""), Div.style.top.replace("px", "")]

    function ResetVariables() {
        GrabbedAt[0] = null
        GrabbedAt[1] = null
        DivSize[0] = Div.style.width.replace("px", "")
        DivSize[1] = Div.style.height.replace("px", "")
        DivPos[0] = Div.style.left.replace("px", "")
        DivPos[1] = Div.style.top.replace("px", "")
    }

    function HandleXChange(XMin, NewGrabAtX) {
        const XChange = (NewGrabAtX - GrabbedAt[0]) * (XMin ? 1 : -1)
        Div.style.width = `${DivSize[0] - XChange}px`
        if (XMin) {
            Div.style.left = `${DivPos[0] - (XChange * -1)}px`
        }
    }

    function HandleYChange(YMin, NewGrabAtY) {
        const YChange = (NewGrabAtY - GrabbedAt[1]) * (YMin ? 1 : -1)
        Div.style.height = `${DivSize[1] - YChange}px`
        if (YMin) {
            Div.style.top = `${DivPos[1] - (YChange * -1)}px`
        }
    }

    function GetPositionalData(UseGrabX, UseGrabY) {
        const XMin = (UseGrabX <= ResizeRange)
        const XMax = (UseGrabX >= DivSize[0] - ResizeRange)
        const YMin = (UseGrabY <= ResizeRange)
        const YMax = (UseGrabY >= DivSize[1] - ResizeRange)
        return ([XMin, XMax, YMin, YMax])
    }

    document.addEventListener("mousemove", function (event) {
        const IsGrabbing = GrabbedAt[0] && GrabbedAt[1]

        const NewGrabAtX = event.pageX - DivPos[0]
        const NewGrabAtY = event.pageY - DivPos[1]

        let XMin = null
        let XMax = null
        let YMin = null
        let YMax = null
        if (IsGrabbing) {
            [XMin, XMax, YMin, YMax] = GetPositionalData(GrabbedAt[0], GrabbedAt[1])
        } else {
            [XMin, XMax, YMin, YMax] = GetPositionalData(NewGrabAtX, NewGrabAtY)
        }

        if ((XMin || XMax) && !YMin && !YMax) {
            Div.style.cursor = "e-resize"
            if (IsGrabbing) {
                HandleXChange(XMin, NewGrabAtX)
            }

        } else if ((YMin || YMax) && !XMin && !XMax) {
            Div.style.cursor = "n-resize"
            if (IsGrabbing) {
                HandleYChange(YMin, NewGrabAtY)
            }

        } else if ((XMin || XMax) && (YMin || YMax)) {
            if (XMax && YMin || XMin && YMax) {
                Div.style.cursor = "ne-resize"
            } else if (XMin && YMin || XMax && YMax) {
                Div.style.cursor = "nw-resize"
            }

            if (IsGrabbing) {
                HandleXChange(XMin, NewGrabAtX)
                HandleYChange(YMin, NewGrabAtY)
            }

        } else  {
            if (IsGrabbing) {
                Div.style.cursor = "grabbing"
                event.preventDefault()
                Div.style.left = `${event.pageX - GrabbedAt[0]}px`
                Div.style.top = `${event.pageY - GrabbedAt[1]}px`
            } else {
                Div.style.cursor = "grab"
            }
        }     
    })

    Div.addEventListener("mouseleave", function () {
        Div.style.cursor = "default"
        ResetVariables()
    })

    document.addEventListener("mousedown", function (event) {
        event.preventDefault()
        GrabbedAt[0] = event.pageX - Number(String(Div.style.left).replace("px", ""))
        GrabbedAt[1] = event.pageY - Number(String(Div.style.top).replace("px", ""))
    })

    document.addEventListener("mouseup", function () {
        Div.style.cursor = "default"
        ResetVariables()
    })

}

AdjustableDiv(DragDiv)