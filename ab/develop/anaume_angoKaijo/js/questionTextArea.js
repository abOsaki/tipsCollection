function checkRange(c) {
    setTimeout(function() {
        var a = document.getSelection();
        var b = a.getRangeAt(0);
        if (!b.startContainer.tagName || b.startContainer.tagName.toLowerCase() != "div") {
            c.setAttribute("contenteditable", true)
        } else {
            checkRange(c)
        }
    }, 100)
}
window.addEventListener("load", function(b) {
    var c = document.getElementById("textContents");
    c.addEventListener("focus", function(a) {
        c.setAttribute("contenteditable", false);
        checkRange(c)
    }, false)
}, false);