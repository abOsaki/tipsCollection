//業務報告反映時
function reportSelectDisable(parentEle, selectedIndex) {
    parentEle.addEventListener("change", reMakeSelect, false);
    
    if (parentEle.firstElementChild.getAttribute("name") != "preparationOfLesson" || selectedIndex != 2) {
        parentEle.nextElementSibling.firstElementChild.disabled = true;
        parentEle.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        parentEle.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        parentEle.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
    }
}

//要望・トラブル等報告反映時
function demandSelectDisable(parentEle, selectedIndex) {
    //console.log(parentEle.firstElementChild.getAttribute("name"));
    if (parentEle.firstElementChild.getAttribute("name") == "title" && selectedIndex != 1) {
        parentEle.nextElementSibling.firstElementChild.disabled = true;
        parentEle.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        parentEle.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
        parentEle.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;
    } else if (parentEle.firstElementChild.getAttribute("name") == "trouble") {
        if (selectedIndex == 1) {
            parentEle.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;   
        } else if (selectedIndex == 2) {
            parentEle.nextElementSibling.firstElementChild.disabled = true;   
        } else if (selectedIndex == 3) {
            parentEle.nextElementSibling.firstElementChild.disabled = true;
            parentEle.nextElementSibling.nextElementSibling.firstElementChild.disabled = true;   
        }
    }
}