<?php
require_once "dbConnect.php";
require_once "belongCountUpdater.php";


//項目をすべて取得
function packageDelete($data) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    session_start();
    
    $sql = "SELECT `author` FROM `package` WHERE `id` = '{$data}'";
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
    $result = $stmt -> fetch(PDO::FETCH_ASSOC);
    if ($result["author"] != $_SESSION["USERID"]) {
        return "noAuth";
    }
    
    $sqlWhere = "`package`.`id` = {$data} AND `author` = '{$_SESSION["USERID"]}'";
    
    updateBelongCount($pdo, null, $sqlWhere);
    
    //DELETE FROM テーブル名 WHERE 条件;
    $sql = "DELETE FROM `package` WHERE {$sqlWhere}";
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
//$dataArray = json_decode($data, true);

//js側へ
echo packageDelete($data);

?>