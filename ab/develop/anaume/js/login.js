function loginOpen() {
    "use strict";
    var a, response;
    a = new XMLHttpRequest();
    a.open("POST", "./php/loginCheck.php", false);
    a.onreadystatechange = function() {
        if (a.readyState === 4) {
            response = a.responseText;
            if (a.status === 200) {
                if (response === "false") {
                    modalOpen("loginModal")
                } else {
                    location.href = "./menu"
                }
            }
        }
    };
    a.send(null)
}

function logout() {
    "use strict";
    var a, response;
    a = new XMLHttpRequest();
    a.open("POST", "./php/logout.php", false);
    a.onreadystatechange = function() {
        location.href = "./../"
    };
    a.send(null)
}

function loginCheck() {
    "use strict";
    var a, response;
    a = new XMLHttpRequest();
    a.open("POST", "./php/loginCheck.php", false);
    a.onreadystatechange = function() {
        if (a.readyState === 4) {
            response = a.responseText;
            if (a.status === 200) {
                if (response === "false") {
                    location.href = "./"
                }
            }
        }
    };
    a.send(null)
}

function login() {
    "use strict";
    var a, userPW, loginForm, message, sendData, loginInfo, xmlhr, response;
    a = document.getElementById("userID").value;
    userPW = document.getElementById("userPW").value;
    loginForm = document.getElementById("loginFrm").value;
    sendData = {};
    message = "";
    if (loginForm) {
        if (a) {
            sendData.userid = a
        } else {
            message += "ユーザ名が未入力です。"
        }
        if (userPW) {
            sendData.password = userPW
        } else {
            if (message !== "") {
                message += "<br />"
            }
            message += "パスワードが未入力です。"
        }
        sendData.login = loginForm
    } else {
        message = "ページの更新を行ってください。"
    }
    if (!message) {
        sendData = JSON.stringify(sendData);
        xmlhr = new XMLHttpRequest();
        xmlhr.open("POST", "./php/login.php", true);
        xmlhr.onreadystatechange = function() {
            if (xmlhr.readyState === 1) {
                loadStart()
            }
            if (xmlhr.readyState === 4) {
                response = xmlhr.responseText;
                if (xmlhr.status === 200) {
                    loginInfo = JSON.parse(response);
                    if (loginInfo.flag === "true") {
                        if (!loginInfo.url) {
                            alertWindow("エラーが発生しました。")
                        } else {
                            saveUserID(loginInfo.userid);
                            location.href = loginInfo.url
                        }
                    } else if (loginInfo.flag === "false") {
                        if (!loginInfo.message) {
                            alertWindow("ログインエラーが発生しました。")
                        } else {
                            alertWindow(loginInfo.message)
                        }
                    } else {
                        modalView("registerModal")
                    }
                }
                loadEnd()
            }
        };
        xmlhr.send(sendData)
    } else {
        alertWindow(message)
    }
}
$(function() {
    $(window).keydown(function(e) {
        if (e.keyCode == 8) {
            var obj = event.target;
            if (obj.id == "userID" || obj.id == "userPW" || obj.id == "textContents" || obj.id == "title" || obj.id == "rubyContent") {
                return true
            }
            return false
        }
    });
    /*
    $('#loginButton').click(function(){
        login();
    });
    */
    /*
    $('#testn').click(function(e){
        login();
        return true;
    });
    */
});