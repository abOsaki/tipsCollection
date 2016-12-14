/*************************************
 * アプリケーション共通で使用する表示
 *************************************/

//ユーザーリスト取得
//function reportSelectName() {
//    var dataList, selectEle, optionEle, i, xmlhr, response;
//    if (document.getElementById("userNameSelect")) {
//        xmlhr = new XMLHttpRequest();
//        xmlhr.open("POST", "../api/user/get_list", true);
//        xmlhr.onreadystatechange = function () {
//            if (xmlhr.readyState === 1) {
//                //loading開始処理
//                loadStart();
//            }
//            if (xmlhr.readyState === 4) {
//                response = xmlhr.responseText;
//                dataList = JSON.parse(response);
//                selectEle = document.createElement("select");
//                selectEle.id = "userNameSelect";
//                optionEle = document.createElement("option");
//                optionEle.value = "";
//                optionEle.textContent = "--";
//                selectEle.appendChild(optionEle);
//                for (i = 0; i < dataList.length; i++) {
//                    optionEle = document.createElement("option");
//                    optionEle.value = JSON.parse(dataList[i]).id;
//                    optionEle.textContent = JSON.parse(dataList[i]).displayName;
//                    selectEle.appendChild(optionEle);
//                }
//                document.getElementById("userNameSelect").parentElement.replaceChild(selectEle, document.getElementById("userNameSelect"));
//
//                //loading終了処理
//                loadEnd();
//            }
//        };
//        xmlhr.send(null);
//    }
//}

/*
 * 日付情報をページにセットする。
 */
function setDateData() {
    var date = new Date();
    if (document.getElementById("yearDate") && document.getElementById("monthDate") && document.getElementById("dayDate")) {
        document.getElementById("yearDate").value = date.getFullYear();
        document.getElementById("monthDate").value = date.getMonth() + 1;
        document.getElementById("dayDate").value = date.getDate();
    }
}

/*
 * ユーザー名をページにセットする。
 */
function setUserInfo(user) {
    var schoolName, userName, aEle;
    userName = document.getElementById("userName");
    userName.textContent = user.name + " さん";

//    if (location.href.split("/").pop() === "edit.html") {
//        aEle = document.getElementById("headerImg2").parentElement;
//        aEle.title = user.title;
//        aEle.href = user.url;
//    }
}

/*
 * ユーザー情報を取得する。
 */
function getUserInfo() {
    var xmlhr, response, user;

    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", "../api/user/get", true);
    xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === 1) {
            //loading開始処理
            loadStart();
        }
        if (xmlhr.readyState === 4) {
            response = xmlhr.responseText;
            user = JSON.parse(response);
            setUserInfo(user);
            //loading終了処理
            loadEnd();
        }
    };
    xmlhr.send(null);
}

/*
 * 学校種別をページにセットする。
 */
function setSchoolTypeOptions() {

    var selecter = document.getElementById("schoolType");

    var opt;
    opt = document.createElement("option");
    opt.value = "1";
    opt.textContent = "小学校";
    if (selecter) {
      selecter.appendChild(opt);
    }
    opt = document.createElement("option");
    opt.value = "2";
    opt.textContent = "中学校";
    if (selecter) {
      selecter.appendChild(opt);
    }

}


/*
 * ページ読み込み後の処理
 */
function loadEvent(e) {
//console.log('baseInfo.js loadEvent() e:' + e);
    getUserInfo();          // ユーザ情報を取得しユーザー名をページにセットする。
    setDateData();          // 日付をページにセットする。
//    reportSelectName();
    setSchoolTypeOptions(); // 学校種別をページにセットする。
//    getNameList();                      // 未使用？

}
window.addEventListener("load", loadEvent, false);