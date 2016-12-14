<?php
require_once '../../../admin/php/dbConnect.php';

function laodReport($param) {
}

//js側からのデータ
$data = file_get_contents('php://input');
$req = json_decode($data, true);

$res = '';
if($req['command'] == 'laodReport'){
    $res = laodReport($req['param']);
} else {
    $res = 'command error';
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>