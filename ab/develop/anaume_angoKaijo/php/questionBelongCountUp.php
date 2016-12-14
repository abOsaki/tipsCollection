<?php
require_once "dbConnect.php";

function questionBelongCountUp($insertList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    session_start();

    $sqlUpdate = "`question`";
    $sqlSet = "`belongCount` = `belongCount` + 1";
    $sqlWhere = null;
    
    for ($i = 0; $i < count($insertList); $i++) {
        if (isset($sqlWhere)) {
            $sqlWhere .= " OR ";    
        }
        $sqlWhere .= "`id` = {$insertList[$i]}";
    }
    
    $sql = "UPDATE {$sqlUpdate} SET {$sqlSet} WHERE {$sqlWhere}";    

    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
    
    //var_dump("insert");
    //var_dump($insertList);
    //var_dump($sql);
}

//js側からのデータ
$data = file_get_contents("php://input");
$dataArray = json_decode($data, true);

//js側へ
echo questionBelongCountUp($dataArray);

?>