<?php
require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

if($param['command']=='getGoal'){
    $response = getMokuhyo($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function getMokuhyo($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $periodGoal = getPeriodGoal($pdo,$param);
    $curriculumGoal = getCurriculumGoal($pdo,$param);
    
    $result = array_merge($periodGoal,$curriculumGoal);
    return $result;
}

function getPeriodGoal($pdo,$param){
    
    $sql="select * from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getCurriculumGoal($pdo,$param){
    
    $sql="select * from ".'studyCurriculumGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}