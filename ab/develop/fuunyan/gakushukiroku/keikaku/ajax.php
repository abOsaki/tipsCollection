<?php
require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

if($param['command']=='getLastStudyPlan'){
    $response = getLastStudyPlan($param);
}else if($param['command']=='saveStudyPlan'){
    $response = insertStudyPlans($param);
}else if($param['command']=='getStudyPlanFromDate'){
    $response = getStudyPlanFromDate($param);
}else if($param['command']=='getStudyPlanFromStartEndDate'){
    $response = getStudyPlanFromStartEndDate($param);
}else if($param['command']=='getStudyPlan'){
    $response = getStudyPlan($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function getLastStudyPlan($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPlan '
    ." where `userID` = ? and `periodID` = ? order by targetDate desc limit 1";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function insertStudyPlans($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $datas = $param['datas'];
    
    $datas = json_decode($datas);
    
    if(count($datas) > 0){
        $decodeDataForDelete = json_decode($datas[0]);
        deletePlan($pdo,$decodeDataForDelete);
    }
    
    foreach ($datas as $data){
        
        $decodeData = json_decode($data);
        
        insertPlan($pdo,$decodeData);
    }
    
    return 'true';
}

function deletePlan($pdo,$data){
    //sql
    $sql="delete from "
            .'studyPlan '
            .'where `userID` = ? and `periodID` = ? and `targetDate` = ? ';
    //prepare
    $stmt = $pdo->prepare($sql);
    //bind
    $stmt->bindValue(1, $data->userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $data->periodID,       PDO::PARAM_INT);
    $stmt->bindValue(3, $data->targetDate,       PDO::PARAM_STR);
    //execute
    $stmt->execute();
}

function insertPlan($pdo,$data){
    //sql
    $sql="INSERT INTO "
            .'studyPlan '
            .'(userID,periodID,targetDate,curriculumID,spendTime,workbookID,workbookAmount,gakushContent,createAT) '
            .'VALUES (?,?,?,?,?,?,?,?,?)';
    //prepare
    $stmt = $pdo->prepare($sql);
    //bind
    $stmt->bindValue(1, $data->userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $data->periodID,       PDO::PARAM_INT);
    $stmt->bindValue(3, $data->targetDate,       PDO::PARAM_STR);
    $stmt->bindValue(4, $data->curriculumID,       PDO::PARAM_INT);
    $stmt->bindValue(5, $data->spendTime,       PDO::PARAM_INT);
    if(isset($data->workbookID)){
        $stmt->bindValue(6, $data->workbookID,       PDO::PARAM_INT);
    }else{
        $stmt->bindValue(6, null,       PDO::PARAM_NULL);
    }
    if(isset($data->workbookAmount)){
        $stmt->bindValue(7, $data->workbookAmount,       PDO::PARAM_INT);
    }else{
        $stmt->bindValue(7, null,       PDO::PARAM_NULL);
    }
    $stmt->bindValue(8, $data->gakushContent,       PDO::PARAM_STR);
    $stmt->bindValue(9, date ("Y-m-d H:i:s"),       PDO::PARAM_STR);
    
    //execute
    $stmt->execute();
}

function getStudyPlanFromDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPlan '
    ." where `userID` = ? and `periodID` = ? and `targetDate` = ? ";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['targetDate'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getStudyPlan($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPlan '
    ." where `userID` = ? and `periodID` = ? ";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getStudyPlanFromStartEndDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPlan '
    ." where `userID` = ? and `periodID` = ? and `targetDate` between ? and ? order by `targetDate`";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['startDate'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['endDate'],       PDO::PARAM_STR);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}