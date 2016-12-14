<?php
require_once "../common/php/dbConnect.php";
//定数
define("SHUUKAISOU_TABLE_NAME","shuukaisou");


//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;
if($param['command']=='shuukaisouDataInsert'){
    $response = insertShuukaisouData($param);
}
else if($param['command']=='shuukaisouDataGet'){
    $response = getShuukaisouData();
}else if($param['command']=='shuukaisouDataGetFromDate'){
    $response = getShuukaisouDataFromDate($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function insertShuukaisouData($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    //$tablename="shuukaisou";
    $datetime = date("Y-m-d H:i:s");
    session_start();
    
    $sql="INSERT INTO ".SHUUKAISOU_TABLE_NAME
    ." (user,data)"
    ." VALUES (?,?)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['data'],       PDO::PARAM_STR);
    
    $result = $stmt->execute();
    
    return $result;
}

/*
function isExistTodayData(){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="select * from ".SHUUKAISOU_TABLE_NAME
    ." where `user` = ? and `date` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->execute();
    
}
*/

function getShuukaisouData(){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="select * from ".SHUUKAISOU_TABLE_NAME
    ." where `user` = ?"
    ." order by `date` desc";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->execute();
    $result=$stmt->fetchAll();
    
    return $result;
}

function getShuukaisouDataFromDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="select * from ".SHUUKAISOU_TABLE_NAME
    ." where `user` = ? and `date` between ? and ?"
    ." order by `date` desc";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['startDateTime'],       PDO::PARAM_STR);
    $stmt->bindValue(3, $param['endDateTime'],       PDO::PARAM_STR);
    $stmt->execute();
    $result=$stmt->fetchAll();
    
    return $result;
}