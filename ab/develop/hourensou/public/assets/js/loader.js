var loadingFlagCount = 0;

function loadStart() {
//console.log("loadStart()");
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
    loadingFlagCount++;
}

function loadEnd() {
// console.log("loadEnd()");
    var loaderBgEle, loaderEle;
    loadingFlagCount--;

    if (loadingFlagCount < 0) {
        loadingFlagCount = 0;
    }

    if (document.getElementById("loaderBg") && loadingFlagCount <= 0) {
        loaderBgEle = document.getElementById("loaderBg");
        //loadingFlagCountが0になっていればすべての読み込み終了
        //loaderBgEle.style.display = "none";
        document.body.removeChild(loaderBgEle);
    }
}