<?php
require_once "dbConnect.php";

function educationOpen($id) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    //var_dump($dataList);
    
    //$sqlSelect = "`contents`";
    $sqlSelect = "*";
    
    $sqlFrom = "`package`";
    
    $sqlWhere = "`id` = '{$id}'";
        
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} WHERE {$sqlWhere}";
    //echo $sql;
    
    //var_dump($sql);die;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);

    $array = array();
    $result = $stmt -> fetch(PDO::FETCH_ASSOC);
    
    return $result;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(educationOpen($dataArray));

?>