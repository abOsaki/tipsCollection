<?php
require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;
if($param['command']=='saveCurriculumResult'){
    $response = saveCurriculumResult($param);
}else if($param['command']=='getCurriculumGoalResult'){
    $response = getCurriculumGoalResult($param);
}else if($param['command']=='getPeriodAndCurriculumGoalAndResult'){
    $response = getPeriodAndCurriculumGoalAndResult($param);
}
    
echo json_encode($response,JSON_UNESCAPED_UNICODE);

function saveCurriculumResult($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $kamokuDatas = json_decode($param['kamokuDatas']);
    
    foreach ($kamokuDatas as $kamokuData){
        $decodeData = json_decode($kamokuData);
        deleteCurriculumResult($pdo,$param,$decodeData->curriculumID);
        insertCurriculumResult($pdo,$param,$decodeData->curriculumID,$decodeData->point);
    }
    
    return 'true';
}

function deleteCurriculumResult($pdo,$param,$curriculumID){
    //sql文を発行して
    $sql="delete from ".'studyCurriculumResult '
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

function insertCurriculumResult($pdo,$param,$curriculumID,$point){
    
    //sql文を発行して
    $sql="INSERT INTO "
            .'studyCurriculumResult '
            .'(userID,periodID,curriculumID,point) '
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

function getCurriculumGoalResult($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    //sql文を発行して
    $sql="SELECT goal.curriculumID,goal.goalPoint,result.point 
        FROM studyCurriculumResult result 
        JOIN studyCurriculumGoal goal ON result.userID=goal.userID AND result.periodID=goal.periodID AND result.curriculumID=goal.curriculumID 
        where result.`userID` = ? and result.`periodID` = ?";
        
    //prepareして
    $stmt = $pdo->prepare($sql);
    //バインドして
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    //エグゼキュート
    $stmt->execute();
    
    $result = $stmt->fetchAll();
    return $result;
}

function getPeriodAndCurriculumGoalAndResult($param){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql="select * from ".'studyPeriodGoal '
    ." where `userID` = ? and `periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result1 = $stmt->fetchAll();
    
    $sql="select goal.curriculumID, goal.goalPoint , result.point from ".'studyCurriculumGoal goal '
            . 'LEFT JOIN studyCurriculumResult result ON result.userID=goal.userID AND result.periodID=goal.periodID AND result.curriculumID=goal.curriculumID'
            ." where goal.`userID` = ? and goal.`periodID` = ?";
    $stmt = $pdo->prepare($sql);
    
    $stmt->bindValue(1, $param['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $param['periodID'],       PDO::PARAM_INT);
    
    $stmt->execute();
    $result2 = $stmt->fetchAll();
    
    $result = array_merge($result1, $result2);
    
    return $result;
}