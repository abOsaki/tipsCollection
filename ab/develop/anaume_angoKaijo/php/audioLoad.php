<?php
require_once "dbConnect.php";

function audioLoad($audioName) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();
    
    //var_dump($dataList);
    
    $sqlSelect = "`data`";
    
    $sqlFrom = "`audioFile`";
    
    $sqlWhere = "`fileName` = :fileName";
    
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} WHERE {$sqlWhere}";
    echo $sql;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    
    //プレースホルダ
    $stmt -> bindValue(':fileName', $audioName, PDO::PARAM_STR);
    
    //実行
    $stmt -> execute(null);

    //echo $sql;
    
    while ($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        //header("Content-Type: image/png");
        echo $result["data"];
    }
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);

//js側へ
//header("Content-Type: image/png");
audioLoad($data);

?>