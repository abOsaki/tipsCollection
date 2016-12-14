function alertWindow(c, d) {
    "use strict";

    function relocateWindow(a) {
        var b, x, y;
        b = document.getElementById(a);
        x = (window.innerWidth - b.clientWidth) / 2;
        y = (window.innerHeight - b.clientHeight) / 2;
        b.style.left = x + "px";
        b.style.top = y + "px"
    }
    var e, textEle, okBtnEle, cancelBtnEle, w, h;
    e = document.getElementById("alert-overlay");
    e.style.display = "block";
    textEle = document.getElementById("alertText");
    okBtnEle = document.getElementById("alertOK");
    cancelBtnEle = document.getElementById("alertCancel");
    if (d) {
        okBtnEle.style.display = "inline-block";
        cancelBtnEle.style.display = "inline-block";
        okBtnEle.onclick = function() {
            d();
            e.style.display = "none"
        };
        cancelBtnEle.onclick = function() {
            e.style.display = "none"
        }
    } else {
        okBtnEle.style.display = "inline-block";
        cancelBtnEle.style.display = "none";
        okBtnEle.onclick = function() {
            e.style.display = "none"
        }
    }
    textEle.innerHTML = c;
    relocateWindow("alertWindow");
    window.addEventListener("resize", function() {
        relocateWindow("alertWindow")
    }, false)
}