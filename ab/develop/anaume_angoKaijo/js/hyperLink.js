var selRange, selectionImgEle;

function linkJump(a) {
    "use strict";
    window.open(a)
}

function deleteLink() {
    "use strict";
    var a, parentNode, alertItem;
    selectionImgEle = null;
    selRange = null;
    a = document.getSelection();
    if (ImgOperation.isSelected()) {
        var selectedID = ImgOperation.getSelectedID();
        alertItem = confirm("URLのリンクを解除します。\nよろしいですか。");
        if (alertItem === true) {
            selectionImgEle = document.getElementById(selectedID);
            var dbClickAction = selectionImgEle.parentElement.getAttribute("ondblclick");
            var border = selectionImgEle.parentElement.style.border;
            var undoAction = function() {
                selectionImgEle.parentElement.setAttribute("ondblclick", dbClickAction);
                selectionImgEle.parentElement.style.border = border
            };
            undoOperation.setUndoAction(undoAction);
            var redoAction = function() {
                selectionImgEle.parentElement.removeAttribute("ondblclick");
                selectionImgEle.parentElement.style.border = ""
            };
            undoOperation.setRedoAction(redoAction);
            selectionImgEle.parentElement.removeAttribute("ondblclick");
            selectionImgEle.parentElement.style.border = "";
            return false
        }
    }
    selRange = a.getRangeAt(0);
    parentNode = a.anchorNode.parentNode;
    while (parentNode) {
        if (parentNode.nodeType === 1) {
            if (parentNode.className === "hyperLinkArea") {
                alertItem = confirm("URLのリンクを解除します。\nよろしいですか。");
                if (alertItem === true) {
                    setTextContentsUndo();
                    parentNode.outerHTML = parentNode.innerHTML;
                    setTextContentsRedo();
                    break
                }
            }
        }
        parentNode = parentNode.parentNode
    }
}

function editFileLink(a) {
    "use strict";
    var b, reader, selectionItem, selRange;
    selectionItem = document.getSelection();
    selRange = selectionItem.getRangeAt(0);
    b = document.createElement("span");
    b.alt = a.name;
    b.textContent = a.name;
    b.className = "fileLink";
    reader = new FileReader();
    reader.onload = function() {
        SS.setItem(a.name, reader.result);
        b.setAttribute("ondblclick", "fileDownload('" + a.name + "')")
    };
    reader.readAsDataURL(a);
    selRange.insertNode(b)
}

function fileDownload(b) {
    "use strict";
    var c = SS.getItem(b);
    if (c) {
        window.navigator.msSaveOrOpenBlob(base64toBlob(c), b)
    } else {
        fileLoad(b, function(a) {
            window.navigator.msSaveOrOpenBlob(base64toBlob(a), b)
        })
    }
}

function setTextContentsUndo() {
    var textContent = document.getElementById("textContents").innerHTML;
    var undoAction = function() {
        document.getElementById("textContents").innerHTML = textContent
    };
    undoOperation.setUndoAction(undoAction)
}

function setTextContentsRedo() {
    var afterTextContent = document.getElementById("textContents").innerHTML;
    var redoAction = function() {
        document.getElementById("textContents").innerHTML = afterTextContent
    };
    undoOperation.setRedoAction(redoAction)
}

function editLink() {
    "use strict";
    var a, aEle, linkUrl;
    linkUrl = document.getElementById("linkUrl").value;
    document.getElementById("linkUrl").value = "";
    if (!linkUrl.match(/(http|ftp)s?:\/\/.+/)) {
        alert("URLが正しくありません。");
        return
    }
    if (selectionImgEle) {
        var dbClickAction = selectionImgEle.parentElement.getAttribute("ondblclick");
        var border = selectionImgEle.parentElement.style.border;
        var undoAction = function() {
            if (dbClickAction == null) {
                selectionImgEle.parentElement.removeAttribute("ondblclick")
            } else {
                selectionImgEle.parentElement.setAttribute("ondblclick", dbClickAction)
            }
            selectionImgEle.parentElement.style.border = border
        };
        undoOperation.setUndoAction(undoAction);
        var redoAction = function() {
            selectionImgEle.parentElement.setAttribute("ondblclick", "linkJump('" + linkUrl + "')");
            selectionImgEle.parentElement.style.border = "1px solid blue"
        };
        undoOperation.setRedoAction(redoAction);
        selectionImgEle.parentElement.setAttribute("ondblclick", "linkJump('" + linkUrl + "')");
        selectionImgEle.parentElement.style.border = "1px solid blue"
    } else {
        setTextContentsUndo();
        a = document.createElement("span");
        a.setAttribute("ondblclick", "linkJump('" + linkUrl + "')");
        a.textContent = selRange.cloneContents().textContent;
        a.className = "hyperLinkArea";
        selRange.deleteContents();
        selRange.insertNode(a);
        setTextContentsRedo()
    }
}
var cacheParentNode;

function insertLink(e) {
    "use strict";
    var a, parentNode, questionArea;
    questionArea = false;
    selectionImgEle = null;
    selRange = null;
    a = document.getSelection();
    if (a.toString().length < 1 && !ImgOperation.isSelected()) {
        alert("テキストもしくは画像を選択してください。");
        return false
    }
    if (ImgOperation.isSelected()) {
        selectionImgEle = ImgOperation.getSelectedImg();
        modalOpen("linkModal");
        return false
    }
    selRange = a.getRangeAt(0);
    parentNode = a.anchorNode.parentNode;
    cacheParentNode = parentNode;
    while (parentNode) {
        if (parentNode.nodeType === 1) {
            if (parentNode.id === "questionArea") {
                questionArea = true;
                break
            }
        }
        parentNode = parentNode.parentNode;
        questionArea = false
    }
    if (questionArea) {
        modalOpen("linkModal");
        return false
    }
    alert("テキストもしくは画像を選択してください。")
}