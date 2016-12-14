function upFile() {
    "use strict";
    var a, selRange, textContainer, node, containerFlag, inputEle;
    a = document.getSelection();
    selRange = a.getRangeAt(0);
    textContainer = document.getElementById("textContents");
    node = selRange.commonAncestorContainer;
    containerFlag = false;
    while (node !== null) {
        if (textContainer === node) {
            containerFlag = true;
            break
        }
        node = node.parentNode
    }
    if (!containerFlag) {
        return false
    }
    inputEle = document.createElement("input");
    inputEle.id = "fileUp";
    inputEle.type = "file";
    inputEle.style.display = "none";
    inputEle.setAttribute("onchange", "createFileIcon(this.files[0])");
    document.getElementById("imageContents").appendChild(inputEle);
    document.getElementById("fileUp").click();
    document.getElementById("imageContents").removeChild(document.getElementById("fileUp"))
}

function createFileIcon(a) {
    "use strict";
    editFileLink(a)
}