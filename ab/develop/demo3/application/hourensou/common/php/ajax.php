<?php
require_once './../../../../admin/php/dbConnect.php';

//ログインかつ権限を満たしているか。
function loginCheck() {
    session_start();
    $flag = 'false';
    $url = '#';
    
    if (abs(intval($_SESSION['HOURENSOU'])) == 1 || abs(intval($_SESSION['HOURENSOU'])) == 2) {
        $flag = 'true';
        $url = './../report/';
    } else if (abs(intval($_SESSION['HOURENSOU'])) == 3) {
        $flag = 'true';
        $url = './../edit/';
    }
    
    //遷移先調整。適宜追加
    $loginCheck = array(
        'flag' => $flag,
        'url' => $url
        );
    return $loginCheck;
}

//js側からのデータ
$data = file_get_contents('php://input');
$req = json_decode($data, true);
$res = '';

if ($req['command'] == 'loginCheck') {
    $res = loginCheck();
} else {
    $res = 'command error';
}

echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>