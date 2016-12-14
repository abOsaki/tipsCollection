<?php
require_once "../common/php/dbConnect.php";
//定数
define("SHUUKAISOU_TABLE_NAME","shuukaisou");

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;
if($param['command']=='shuukaisouDataInsert'){
    $deleteResponse = deleteTodayData($param);
    $response = insertShuukaisouData($param);
}
else if($param['command']=='shuukaisouDataGet'){
    $response = getShuukaisouData();
}else if($param['command']=='shuukaisouDataGetFromDate'){
    $response = getShuukaisouDataFromDate($param);
}else if($param['command']=='shuukaisouDataGetFromDateTry'){
    $response = getShuukaisouDataFromDateTry($param);
}else if($param['command']=='sessionExpire'){
    $response = getSessionExpire();
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function getSessionExpire(){
    phpinfo();
    die;
    //return session_cache_expire();
}

function insertShuukaisouData($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    //$tablename="shuukaisou";
    $datetime = date("Y-m-d H:i:s");
    session_start();
    
    $sql="INSERT INTO ".SHUUKAISOU_TABLE_NAME
    ." (user,try,data)"
    ." VALUES (?,?,?)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['try'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['data'],       PDO::PARAM_STR);
    
    $result = $stmt->execute();
    
    return $result;
}

function deleteTodayData($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="delete from ".SHUUKAISOU_TABLE_NAME
    ." where `user` = ? and `try` = ? and `date` between ? and ?";
    $stmt = $pdo->prepare($sql);
    
    $startDate = getTodayStartDateString();
    $endDate = getTodayEndDateString();
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['try'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $startDate,       PDO::PARAM_STR);
    $stmt->bindValue(4, $endDate,       PDO::PARAM_STR);
    //var_dump($startDate);die;
    
    $stmt->execute();
    $result = $stmt->execute();
    return $result;
}

function getTodayStartDateString(){
    $date = date("Y-m-d");
    $result = $date." 00:00:00";
    return $result;
}

function getTodayEndDateString(){
    $date = date("Y-m-d");
    $result = $date." 23:59:59";
    return $result;
}

function isExistTodayData($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="select * from ".SHUUKAISOU_TABLE_NAME
    ." where `user` = ? and `date` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['data'],       PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->execute();
    return $result;
}

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
    ." order by `date`";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['startDateTime'],       PDO::PARAM_STR);
    $stmt->bindValue(3, $param['endDateTime'],       PDO::PARAM_STR);
    $stmt->execute();
    $result=$stmt->fetchAll();
    
    return $result;
}

function getShuukaisouDataFromDateTry($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    session_start();
    
    $sql="select * from ".SHUUKAISOU_TABLE_NAME
    ." where `user` = ? and `try` = ? and `date` between ? and ?"
    ." order by `date`";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $_SESSION['USERID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['try'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['startDateTime'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['endDateTime'],       PDO::PARAM_STR);
    $stmt->execute();
    $result=$stmt->fetchAll();
    
    return $result;
}