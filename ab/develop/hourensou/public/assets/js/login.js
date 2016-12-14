/*global console, alert, modalFun*/

function modalLogin(e) {
    "use strict";
    modalFun(e);
}

function location_href(page) {
    location.href = page;
}

function login() {
    "use strict";
    var userId, userPW, loginForm, message, sendData, loginInfo, xmlhr, response;

    //ID、PW、ログインフォームであることのデータを代入
    userId = document.getElementById("userID").value;
    userPW = document.getElementById("userPW").value;
    loginForm = document.getElementById("loginFrm").value;
//alert(" userId:" + userId + " userPW:" + userPW + " loginForm:" + loginForm);

    //入力確認
    sendData = {};
    message = "";
    if (loginForm) {
        if (userId) {
            sendData.userid = userId;
        } else {
            message += "ユーザIDが未入力です。";
        }
        if (userPW) {
            sendData.password = userPW;
        } else {
            if (message !== "") {
                message += "<br />";
            }
            message += "パスワードが未入力です。";
        }
        sendData.login = loginForm;
    } else {
        message = "ページの更新を行ってください。";
    }

    //アラート文が未挿入
    if (!message) {
        sendData = JSON.stringify(sendData);

        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "api/auth/login", true);
//        xmlhr.responseType = 'text';
        xmlhr.onreadystatechange = function () {
            if (xmlhr.readyState === 4) {
                response = xmlhr.responseText;
//                response = xmlhr.response;
//console.log(response);
                if (xmlhr.status === 200) {
                    //console.log(response);
                    loginInfo = JSON.parse(response);
//                    loginInfo = response;
//console.log("loginInfo:" + loginInfo);
//console.log("loginInfo.flag:" + loginInfo.flag);
                    if (loginInfo.flag === true) {
                        if (!loginInfo.url) {
                            alert("エラーが発生しました。");
                        } else {
//console.log("loginInfo.url:" + loginInfo.url);
                            location.href = loginInfo.url;
                        }
                    } else if (loginInfo.flag === "false") {
                        if (!loginInfo.message) {
                            alert("ログインエラーが発生しました。");
                        } else {
                            alert(loginInfo.message);
                        }
                    } else {
                        console.log("レスポンス:" + loginInfo.flag);
                    }
                }
            }
        };
//alert(" sendData:" + sendData);
        xmlhr.send(sendData);
    } else {
        alert(message);
    }
}