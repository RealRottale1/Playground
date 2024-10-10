
// Sets up MainDiv
const MainDiv = document.createElement("div")
MainDiv.classList.add("MainDiv")
MainDiv.style.display = "flex"
MainDiv.style.flexDirection = "column"
MainDiv.style.alignItems = "center"
MainDiv.style.justifyItems = "center"
MainDiv.style.height = "500px"
MainDiv.style.width = "500px"
MainDiv.style.top = "10px"
MainDiv.style.right = "10px"
MainDiv.style.backgroundColor = "rgba(125, 125, 125, 0.75)"
MainDiv.style.position = "fixed"
MainDiv.style.zIndex = "999"
MainDiv.style.borderRadius = "15px"

// Sets up ViewDiv
const ViewDiv = document.createElement("div")
ViewDiv.classList.add("ViewDiv")
ViewDiv.style.height = "90%"
ViewDiv.style.width = "90%"
ViewDiv.style.backgroundColor = "rgba(0, 0, 0, 1)"
ViewDiv.style.position = "relative"

// Sets up Action Button
const ActionButton = document.createElement("button")
ActionButton.classList.add("ActionButton")
ActionButton.style.height = "10%"
ActionButton.style.width = "90%"
ActionButton.style.backgroundColor = "rgba(255, 255, 255, 1)"
ActionButton.style.position = "relative"
ActionButton.style.border = "0px"
ActionButton.textContent = "JUMP"
ActionButton.style.fontSize = "20px"





MainDiv.appendChild(ViewDiv)
MainDiv.appendChild(ActionButton)
document.body.appendChild(MainDiv)


ActionButton.addEventListener("mouseover", () => {
    ActionButton.style.backgroundColor = "rgba(255, 255, 255, 0.75)"
})

ActionButton.addEventListener("mousedown", () => {
    ActionButton.style.backgroundColor = "rgba(125, 125, 125, 0.5)"
})

ActionButton.addEventListener("mouseout", () => {
    ActionButton.style.backgroundColor = "rgba(255, 255, 255, 1)"
})

ActionButton.addEventListener("mouseup", () => {
    ActionButton.style.backgroundColor = "rgba(255, 255, 255, 1)"
})