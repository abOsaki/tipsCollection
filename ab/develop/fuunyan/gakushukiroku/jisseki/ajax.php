<?php
require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

if($param['command']=='getLastStudyLog'){
    $response = getLastStudyLog($param);
}else if($param['command']=='saveStudyLog'){
    $response = insertStudyLogs($param);
}else if($param['command']=='getStudyLogFromDate'){
    $response = getStudyLogFromDate($param);
}else if($param['command']=='getStudyLogFromStartEndDate'){
    $response = getStudyLogFromStartEndDate($param);
}else if($param['command']=='getStudyPlanLogFromDate'){
    $response = getStudyPlanLogFromDate($param);
}else if($param['command']=='getStudyPlanLogFromStartEndDate'){
    $response = getStudyPlanLogFromStartEndDate($param);
}else if($param['command']=='getStudyLog'){
    $response = getStudyLog($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function getLastStudyLog($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyLog '
    ." where `userID` = ? and `periodID` = ? order by targetDate desc limit 1";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function insertStudyLogs($param){
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
            .'studyLog '
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
            .'studyLog '
            .'(userID,periodID,targetDate,curriculumID,spendTime,sleepAmount,tubuyakiKind,workbookID,workbookAmount,createAT) '
            .'VALUES (?,?,?,?,?,?,?,?,?,?)';
    //prepare
    $stmt = $pdo->prepare($sql);
    //bind
    $stmt->bindValue(1, $data->userID,       PDO::PARAM_INT);
    $stmt->bindValue(2, $data->periodID,       PDO::PARAM_INT);
    $stmt->bindValue(3, $data->targetDate,       PDO::PARAM_STR);
    $stmt->bindValue(4, $data->curriculumID,       PDO::PARAM_INT);
    $stmt->bindValue(5, $data->spendTime,       PDO::PARAM_INT);
    $stmt->bindValue(6, $data->sleepAmount,       PDO::PARAM_INT);
    $stmt->bindValue(7, $data->tubuyakiKind,       PDO::PARAM_INT);
    
    
    if(isset($data->workbookID)){
        $stmt->bindValue(8, $data->workbookID,       PDO::PARAM_INT);
    }else{
        $stmt->bindValue(8, null,       PDO::PARAM_NULL);
    }
    if(isset($data->workbookAmount)){
        $stmt->bindValue(9, $data->workbookAmount,       PDO::PARAM_INT);
    }else{
        $stmt->bindValue(9, null,       PDO::PARAM_NULL);
    }
    //$stmt->bindValue(8, strtotime (date("Y-m-d H:i:s")),       PDO::PARAM_STR);
    $stmt->bindValue(10, date("Y-m-d H:i:s"),       PDO::PARAM_STR);
    //execute
    $stmt->execute();
}

function getStudyLogFromDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyLog '
    ." where `userID` = ? and `periodID` = ? and `targetDate` = ? ";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['targetDate'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getStudyPlanLogFromDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql = "SELECT jisseki.curriculumID as jisseki_curriculumID
            , plan.curriculumID as plan_curriculumID
            , jisseki.spendTime as jisseki_spendTime
            , plan.spendTime as plan_spendTime
            FROM studyLog jisseki
            RIGHT JOIN studyPlan plan ON jisseki.userID=plan.userID and jisseki.periodID=plan.periodID and jisseki.targetDate=plan.targetDate and jisseki.curriculumID=plan.curriculumID
            where plan.`userID` = ? and plan.`periodID` = ? and plan.`targetDate` = ?  
            union
            SELECT jisseki.curriculumID as jisseki_curriculumID
            , plan.curriculumID as plan_curriculumID
            , jisseki.spendTime as jisseki_spendTime
            , plan.spendTime as plan_spendTime
            FROM studyLog jisseki
            left JOIN studyPlan plan ON jisseki.userID=plan.userID
            and jisseki.periodID=plan.periodID
            and jisseki.targetDate=plan.targetDate
            and jisseki.curriculumID=plan.curriculumID
            where jisseki.`userID` = ? and jisseki.`periodID` = ? and jisseki.`targetDate` = ? 
            ";

    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['targetDate'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(5, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(6, $param['targetDate'],       PDO::PARAM_STR);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getStudyPlanLogFromStartEndDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql = "SELECT jisseki.curriculumID as jisseki_curriculumID
            , plan.curriculumID as plan_curriculumID
            , jisseki.spendTime as jisseki_spendTime
            , plan.spendTime as plan_spendTime
            FROM studyLog jisseki
            RIGHT JOIN studyPlan plan ON jisseki.userID=plan.userID and jisseki.periodID=plan.periodID and jisseki.targetDate=plan.targetDate and jisseki.curriculumID=plan.curriculumID
            where plan.`userID` = ? and plan.`periodID` = ? and plan.`targetDate` between ? and ?  
            union
            SELECT jisseki.curriculumID as jisseki_curriculumID
            , plan.curriculumID as plan_curriculumID
            , jisseki.spendTime as jisseki_spendTime
            , plan.spendTime as plan_spendTime
            FROM studyLog jisseki
            left JOIN studyPlan plan ON jisseki.userID=plan.userID
            and jisseki.periodID=plan.periodID
            and jisseki.targetDate=plan.targetDate
            and jisseki.curriculumID=plan.curriculumID
            where jisseki.`userID` = ? and jisseki.`periodID` = ? and jisseki.`targetDate` between ? and ? 
            ";

    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['startDate'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['endDate'],       PDO::PARAM_STR);
    $stmt->bindValue(5, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(6, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(7, $param['startDate'],       PDO::PARAM_STR);
    $stmt->bindValue(8, $param['endDate'],       PDO::PARAM_STR);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getStudyLogFromStartEndDate($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    //userID,periodID,targetDateでレフトアウタージョインでstudyCheckLogを
    
    $sql="select studyLog.targetDate as targetDate,"
            . "studyLog.curriculumID as curriculumID,"
            . "studyLog.spendTime as spendTime,"
            . "studyLog.workbookID as workbookID,"
            . "studyLog.workbookAmount as workbookAmount,"
            . "studyCheckLog.isRead as isRead "
            . "from ".'studyLog '
            . "left join studyCheckLog on studyLog.userID=studyCheckLog.userID"
            . " and studyLog.periodID=studyCheckLog.periodID"
            . " and studyLog.targetDate=studyCheckLog.targetDate "
            . " where studyLog.`userID` = ? "
            . "and studyLog.`periodID` = ? "
            . "and studyLog.`targetDate` between ? and ? "
            . "order by studyLog.`targetDate` "
            ;
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $param['startDate'],       PDO::PARAM_STR);
    $stmt->bindValue(4, $param['endDate'],       PDO::PARAM_STR);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getStudyLog($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyLog '
    ." where `userID` = ? and `periodID` = ? ";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}