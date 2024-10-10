
// Sets up MainDiv
const MainDiv = document.createElement("iframe")
MainDiv.classList.add("MainDiv")
MainDiv.src = "https://lurkers.io/?host=51-222-105-196.lurkers.io&port=6775"
MainDiv.style.height = "100%"
MainDiv.style.width = "100%"
MainDiv.style.top = "0px"
MainDiv.style.backgroundColor = "rgba(125, 125, 125, 0.75)"
MainDiv.style.position = "fixed"
MainDiv.style.zIndex = "999"
MainDiv.style.borderRadius = "15px"

document.body.appendChild(MainDiv)