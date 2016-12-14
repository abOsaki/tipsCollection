<?php
//ログアウト処理（セッション破棄）
function Logout() {
    session_start();

    if (isset($_COOKIE["PHPSESSID"])) {
        setcookie("PHPSESSID", '', time() - 1800, '/');
    }
    session_destroy();
    return true;
}

logout();