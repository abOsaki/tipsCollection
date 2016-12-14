<?php
require_once "dbConnect.php";

//項目をすべて取得
function nameList($tableName) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();
    
    $baseInfo = $baseInfo = $model -> baseInfoName();
    
    //テーブル名により参照を変更
    $sqlSelect = "";
    $sqlFrom = "";
    if ($tableName == "difficulty") {
        //固有情報を参照
        $sqlSelect = "`id` AS 'value', `name`";
        $sqlFrom = "`{$tableName}`";
    } else {
        //共有情報を参照
        $sqlSelect = "`{$baseInfo}`.`{$tableName}`.`id` AS 'value', `{$baseInfo}`.`{$tableName}`.`name`";
        $sqlFrom = "`{$baseInfo}`.`{$tableName}`";
    }
    $sqlWhere = "`id` > 0";
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} WHERE {$sqlWhere};";
    //var_dump($sql);
    
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);

    while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        //session[school]
        $array[] = json_encode($result);
    }
    $data = $array;
    //var_dump($data);
    return $data;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);

//js側へ
echo json_encode(nameList($data));

?>