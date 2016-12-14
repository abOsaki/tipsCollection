function keyDownFunc(a) {
    "use strict";
    var b;
    if (a.keyCode === 13) {
        if (document.getElementById("alert-overlay").style.display === "block") {
            b = document.createEvent("MouseEvents");
            b.initEvent("click", false, true);
            document.getElementById("alertOK").dispatchEvent(b)
        } else {
            if (document.getElementById("loginModal").style.display === "block") {
                login()
            }
        }
    }
}
window.addEventListener("keydown", keyDownFunc, false);