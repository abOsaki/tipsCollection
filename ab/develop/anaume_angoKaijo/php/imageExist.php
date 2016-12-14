<?php
require_once "dbConnect.php";


//項目をすべて取得
function imageExist($imgName) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    session_start();
    
    //var_dump($dataList);

    $sqlSelect = "`id`";
    $sqlFrom = "`imageFile`";
    $sqlWhere = "`fileName` = '{$imgName}'";
    
    //sql文作成
    //SELECT フィールド名1[フィールド名2, フィールド名3] FROM テーブル名1[, テーブル名2, テーブル名3] WHERE 条件);
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} WHERE {$sqlWhere}";    
    //echo $sql;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
    
    $result = $stmt -> fetch();
    
    if ($result) {
        return "true";
    }
    return "false";
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
//$dataArray = json_decode($data, true);

//js側へ
echo imageExist($data);

?>