<?php
define("STRETCH_COUNT", 1000);

//文字列からSHA256のハッシュ値を取得
function get_sha256($target) {
    return hash("sha256", $target);
}

function get_stretched_password($password, $userId) {
    $salt = get_sha256($userId);
    $hash = "";
    for ($i = 0; $i < STRETCH_COUNT; $i++) {
        $hash = get_sha256($hash . $salt . $password);
    }
    return $hash;
}
?>