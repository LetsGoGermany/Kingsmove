const customCheck = document.querySelectorAll(".terms-section")

Array.from(customCheck).forEach(element => element.addEventListener("click",(event) => toggleBox(event)))

function toggleBox(box) {
    switch(box.target.classList.contains("checked")) {
        case true:
            box.target.classList.remove("checked");
            break
        case false: 
            box.target.classList.add("checked");
            break
    }
}