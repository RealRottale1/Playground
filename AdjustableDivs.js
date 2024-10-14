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
    const WithinRange = 30
    const ResizeRange = 30

    let InDiv = false
    const GrabbedAt = [null, null]
    const DivSize = [Div.style.width.replace("px", ""), Div.style.height.replace("px", "")]
    const DivPos = [Div.style.left.replace("px", ""), Div.style.top.replace("px", "")]

    function ResetVariables() {
        InDiv = false
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
        const XInBox = ((UseGrabY >= (ResizeRange*-1)) && (UseGrabY <= (Number(DivSize[1]) + ResizeRange)))
        const YInBox = ((UseGrabX >= (ResizeRange*-1)) && (UseGrabX <= (Number(DivSize[0]) + ResizeRange)))
        const XMin = ((UseGrabX <= WithinRange) && (UseGrabX >= (ResizeRange*-1)) && XInBox)
        const XMax = ((UseGrabX >= DivSize[0] - WithinRange) && (UseGrabX <= (Number(DivSize[0]))+ResizeRange) && XInBox)
        const YMin = ((UseGrabY <= WithinRange) && (UseGrabY >= (ResizeRange*-1)) && YInBox)
        const YMax = (((UseGrabY >= DivSize[1] - WithinRange) && (UseGrabY <= (Number(DivSize[1]))+ResizeRange)) && YInBox)
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
            document.body.style.cursor = "e-resize"
            if (IsGrabbing) {
                HandleXChange(XMin, NewGrabAtX)
            }

        } else if ((YMin || YMax) && !XMin && !XMax) {
            document.body.style.cursor = "n-resize"
            if (IsGrabbing) {
                HandleYChange(YMin, NewGrabAtY)
            }

        } else if ((XMin || XMax) && (YMin || YMax)) {
            if (XMax && YMin || XMin && YMax) {
                document.body.style.cursor = "ne-resize"
            } else if (XMin && YMin || XMax && YMax) {
                document.body.style.cursor = "nw-resize"
            }

            if (IsGrabbing) {
                HandleXChange(XMin, NewGrabAtX)
                HandleYChange(YMin, NewGrabAtY)
            }

        } else if (InDiv)  {
            if (IsGrabbing) {
                document.body.style.cursor = "grabbing"
                event.preventDefault()
                Div.style.left = `${event.pageX - GrabbedAt[0]}px`
                Div.style.top = `${event.pageY - GrabbedAt[1]}px`
            } else {
                document.body.style.cursor = "grab"
            }
        } else {
            document.body.style.cursor = "default"
        }
    })

    /*Div.addEventListener("mouseleave", function () {
        Div.style.cursor = "default"
        ResetVariables()
    })*/

    document.addEventListener("mousedown", function (event) {
        event.preventDefault()
        GrabbedAt[0] = event.pageX - Number(String(Div.style.left).replace("px", ""))
        GrabbedAt[1] = event.pageY - Number(String(Div.style.top).replace("px", ""))
    })

    Div.addEventListener("mousedown", function (event) {
       InDiv = true
    })

    document.addEventListener("mouseup", function () {
        Div.style.cursor = "default"
        ResetVariables()
    })

}

AdjustableDiv(DragDiv)