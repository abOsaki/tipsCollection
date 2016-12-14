var loadingFlagCount = 0;

function loadStart() {
    "use strict";
    var a, loaderEle;
    if (!document.getElementById("loaderBg") && !document.getElementById("loader")) {
        a = document.createElement("div");
        a.id = "loaderBg";
        a.style.display = "block";
        loaderEle = document.createElement("div");
        loaderEle.id = "loader";
        document.body.appendChild(a);
        a.appendChild(loaderEle)
    }
    loadingFlagCount += 1
}

function loadEnd() {
    "use strict";
    var a, loaderEle;
    loadingFlagCount -= 1;
    if (loadingFlagCount < 0) {
        loadingFlagCount = 0
    }
    if (document.getElementById("loaderBg") && loadingFlagCount <= 0) {
        a = document.getElementById("loaderBg");
        document.body.removeChild(a)
    }
}