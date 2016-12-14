var loadingFlagCount = 0;

//読み込み開始時に実行
function loadStart() {
    "use strict";
    var loaderBgEle, loaderEle;
    if (!document.getElementById("loaderBg") && !document.getElementById("loader")) {
        loaderBgEle = document.createElement("div");
        loaderBgEle.id = "loaderBg";
        loaderBgEle.style.display = "block";
        loaderEle = document.createElement("div");
        loaderEle.id = "loader";

        document.body.appendChild(loaderBgEle);
        loaderBgEle.appendChild(loaderEle);
    }

    //loadingFlagCount読み込み中の接続をカウント
    loadingFlagCount += 1;
}

//読み込み終了時に実行
function loadEnd() {
    "use strict";
    var loaderBgEle, loaderEle;
    loadingFlagCount -= 1;

    if (loadingFlagCount < 0) {
        loadingFlagCount = 0;
    }

    if (document.getElementById("loaderBg") && loadingFlagCount <= 0) {
        loaderBgEle = document.getElementById("loaderBg");
        //loadingFlagCountが0になっていればすべての読み込み終了
        document.body.removeChild(loaderBgEle);
    }
}