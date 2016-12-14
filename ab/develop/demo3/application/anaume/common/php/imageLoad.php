<?php
require_once './../../../../admin/php/dbConnect.php';

function imageLoad($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();
    $sql = "SELECT `data` FROM `fileImage` WHERE `fileName` = :fileName";
    //return  $sql;
    $stmt = $pdo -> prepare($sql);
    $stmt -> bindValue(':fileName', $param, PDO::PARAM_STR);
    $stmt -> execute(null);
    $result = $stmt -> fetch(PDO::FETCH_ASSOC);
    return $result['data'];
}
$data = file_get_contents("php://input");
header("Content-Type: image/png");
echo imageLoad($data);

?>