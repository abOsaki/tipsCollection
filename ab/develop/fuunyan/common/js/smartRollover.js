/* 画像ファイル名on-off切り替え*/
function smartRollover(imageEle) {
    "use strict";
    if (imageEle.src.match("_off.")) {
        imageEle.onmouseover = function () {
            this.src = this.src.replace("_off.", "_on.");
        };
        imageEle.onmouseout = function () {
            this.src = this.src.replace("_on.", "_off.");
        };
    }
}

//イベント登録
function setSmartRollover() {
    "use strict";
    var images, i, l;
    if (document.getElementsByTagName) {
        images = document.getElementsByTagName("img");
        for (i = 0, l = images.length; i < l; i += 1) {
            smartRollover(images[i]);
        }
    }
}

if (window.addEventListener) {
    window.addEventListener("load", setSmartRollover, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", setSmartRollover);
}