<?php
require_once 'dbConnect.php';

function hoge($param) {
    return true;
}

//js側からのデータ
$data = file_get_contents('php://input');
$req = json_decode($data, true);
$res = '';

if ($req['command'] == '') {
    $res = hoge($req['param']);
} else {
    $res = 'command error';
}

echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>