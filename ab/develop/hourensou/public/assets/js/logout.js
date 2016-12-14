//ログアウト
function logout($page) {
    "use strict";

    var base;
    if ($page == 'index') {
        base = './';
    } else {
        base = '../';
    }
    var xmlhr, response;
    xmlhr = new XMLHttpRequest();
    xmlhr.open("POST", base + "api/auth/logout", false);
    xmlhr.onreadystatechange = function () {
        location.href = "./";
    };
    xmlhr.send(null);
}
