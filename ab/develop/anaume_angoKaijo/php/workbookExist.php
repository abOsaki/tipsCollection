<?php
require_once "dbConnect.php";


//項目をすべて取得
function workbookExist($dataList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    //var_dump($dataList);

    $sqlSelect = "`id`";
    
    session_start();

    $sqlFrom = "`package`";
    
    $sqlWhere = "`author` = '{$_SESSION["USERID"]}'";
    foreach ($dataList as $key => $value) {
        if ($key != "share") {
            if (isset($sqlWhere)) {
                $sqlWhere .= " AND ";
            }
            $sqlWhere .= "`{$key}` = '{$value}'";
        }
    }
    
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
$dataArray = json_decode($data, true);

//js側へ
echo workbookExist($dataArray);

?>