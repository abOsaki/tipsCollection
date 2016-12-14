function alertWindow(alertHtml, okEvent) {
    "use strict";

    function relocateWindow(eleId) {
        var relocateEle, x, y;
        relocateEle = document.getElementById(eleId);
        x = (window.innerWidth - relocateEle.clientWidth) * 0.5;
        y = (window.innerHeight - relocateEle.clientHeight) * 0.5;
        relocateEle.style.left = x + "px";
        relocateEle.style.top = y + "px";
    }

    var windowEle, textEle, okBtnEle, cancelBtnEle, w, h;

    //アラート背景用エレメント
    windowEle = document.getElementById("alert-overlay");
    windowEle.style.display = "block";

    //テキスト表示エレメント
    textEle = document.getElementById("alertText");

    //ボタンエレメント
    okBtnEle = document.getElementById("alertOK");
    cancelBtnEle = document.getElementById("alertCancel");

    if (okEvent) { //「OK」イベントあり
        okBtnEle.style.display = "inline-block";
        cancelBtnEle.style.display = "inline-block";

        okBtnEle.onclick = function () {
            okEvent();
            windowEle.style.display = "none";
        };

        cancelBtnEle.onclick = function () {
            windowEle.style.display = "none";
        };
    } else { //「OK」イベントなし
        okBtnEle.style.display = "inline-block";
        cancelBtnEle.style.display = "none";

        okBtnEle.onclick = function () {
            windowEle.style.display = "none";
        };
    }
    textEle.innerHTML = alertHtml;

    relocateWindow("alertWindow");
    window.addEventListener("resize", function () {
        relocateWindow("alertWindow");
    }, false);
}