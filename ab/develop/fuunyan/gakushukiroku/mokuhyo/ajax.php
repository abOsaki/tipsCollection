<?php
require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;
if($param['command']=='savePeriodGoal'){
    $deleteResponse = deletePeriodGoal($param);
    $response = insertPeriodGoal($param);
}else if($param['command']=='getPeriodGoal'){
    $response = getPeriodGoal($param);
}else if($param['command']=='saveCurriculumGoal'){
    $response = insertCurriculumGoals($param);
}else if($param['command']=='savePeriodAndCurriculumGoal'){
    $response = insertPeriodGoalAndCurriculumGoal($param);
}else if($param['command']=='getCurriculumGoal'){
    $response = getCurriculumGoal($param);
}else if($param['command']=='getPeriodAndCurriculumGoal'){
    $response = getPeriodAndCurriculumGoal($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function deletePeriodGoal($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="delete from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->execute();
    return $result;
}

function getPeriodGoal($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getCurriculumGoal($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyCurriculumGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getPeriodAndCurriculumGoal($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result1 = $stmt->fetchAll();
    
    $sql="select * from ".'studyCurriculumGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result2 = $stmt->fetchAll();
    
    $result = array_merge($result1, $result2);
    
    return $result;
}

function insertPeriodGoal($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="INSERT INTO "
            .'studyPeriodGoal '
            .'(userID,periodID,curriculumID,goalPoint,stamp) '
            .'VALUES (?,?,?,?,?)';
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['curriculumID'],       PDO::PARAM_INT);
    $stmt->bindValue(4, $param['goalPoint'],       PDO::PARAM_INT);
    $stmt->bindValue(5, $param['stamp'],       PDO::PARAM_STR);
    
    $result = $stmt->execute();
    
    return $result;
}

function insertCurriculumGoals($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    deleteAndInsertCurriculumGoal($pdo,$param,1,$param['kokugoPoint']);
    deleteAndInsertCurriculumGoal($pdo,$param,2,$param['suugakuPoint']);
    deleteAndInsertCurriculumGoal($pdo,$param,3,$param['eigoPoint']);
    deleteAndInsertCurriculumGoal($pdo,$param,4,$param['rikaPoint']);
    deleteAndInsertCurriculumGoal($pdo,$param,5,$param['shakaiPoint']);
    
    return 'true';
}

function deleteAndInsertCurriculumGoal($pdo,$param,$curriculumID,$point){
    deleteCurriculumGoal($pdo,$param,$curriculumID);
    insertCurriculumGoal($pdo,$param,$curriculumID,$point);
}

function deleteCurriculumGoal($pdo,$param,$curriculumID){
    //sql文を発行して
    $sql="delete from ".'studyCurriculumGoal '
    ." where `userID` = ? and `periodID` = ? and `curriculumID` = ?";
    //prepareして
    $stmt = $pdo->prepare($sql);
    //バインドして
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, (int)$curriculumID,       PDO::PARAM_INT);
    
    //エグゼキュート
    $stmt->execute();
}

function insertCurriculumGoal($pdo,$param,$curriculumID,$point){
    
    //sql文を発行して
    $sql="INSERT INTO "
            .'studyCurriculumGoal '
            .'(userID,periodID,curriculumID,goalPoint) '
            .'VALUES (?,?,?,?)';
    //prepareして
    $stmt = $pdo->prepare($sql);
    //バインドして
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, (int)$curriculumID,       PDO::PARAM_INT);
    $stmt->bindValue(4, (int)$point,       PDO::PARAM_INT);
    //エグゼキュート
    $stmt->execute();
}

function insertPeriodGoalAndCurriculumGoal($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    deletePeriodPhase($pdo,$param);
    insertPeriodPhase($pdo,$param);
    
    $kamokuDatas = json_decode($param['kamokuDatas']);
    
    foreach ($kamokuDatas as $kamokuData){
        $decodeData = json_decode($kamokuData);
        deleteCurriculumGoal($pdo,$param,$decodeData->curriculumID);
        insertCurriculumGoal($pdo,$param,$decodeData->curriculumID,$decodeData->point);
    }
    
    return 'true';
}

function deletePeriodPhase($pdo,$param){
    $sql="delete from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
}

function insertPeriodPhase($pdo,$param){
    $sql="INSERT INTO "
            .'studyPeriodGoal '
            .'(userID,periodID,testStartDate,testEndDate,testKind) '
            .'VALUES (?,?,?,?,?)';
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['testStartDate'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['testEndDate'],       PDO::PARAM_STR);
    $stmt->bindValue(5, $param['testKind'],       PDO::PARAM_INT);
    
    $stmt->execute();
}