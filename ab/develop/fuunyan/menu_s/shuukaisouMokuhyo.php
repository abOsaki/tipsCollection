<?php
require_once "../common/php/dbConnect.php";
//定数
define("SHUUKAISOUMOKUHYO_TABLE_NAME","shuukaisouMokuhyo");

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;
if($param['command']=='shuukaisouMokuhyoDataInsert'){
    $response = insertMokuhyoData($param);
}else if($param['command']=='shuukaisouMokuhyoDataGet'){
    $response = getShuukaisouMokuhyoData();
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function insertMokuhyoData($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $datetime = date("Y-m-d H:i:s");
    session_start();
    
    $sql="INSERT INTO ".SHUUKAISOUMOKUHYO_TABLE_NAME
    ." (user,timeM,timeS,lapM,lapS)"
    ." VALUES (?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['timeM'],       PDO::PARAM_STR);
    $stmt->bindValue(3, $param['timeS'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['lapM'],       PDO::PARAM_STR);
    $stmt->bindValue(5, $param['lapS'],       PDO::PARAM_STR);
    
    $result = $stmt->execute();
    
    return $result;
}

function getShuukaisouMokuhyoData(){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="select * from ".SHUUKAISOUMOKUHYO_TABLE_NAME
    ." where `user` = ?"
    ." order by `date` desc";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->execute();
    $result=$stmt->fetchAll();
    
    return $result;
}