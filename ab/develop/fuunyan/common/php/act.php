<?php
require_once "dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
//パラメタに基づいたメソッドを取得
$method = getMethod($req['command']);
//パラメタに基づいた結果を取得
$res=$method($req);
//結果をjson形式に
$reult = json_encode($res,JSON_UNESCAPED_UNICODE);
//結果を返却
echo $reult;

function getMethod($pvCommand){
    if($pvCommand == 'getQuestionAnswer'){
        return getQuestionAnswer;
    }else if($pvCommand == 'getQuestion'){
        return getQuestion;
    }
}

function getQuestionAnswer(){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql = "select * from questionAnswer";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

function getQuestion(){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    
    $sql = "select * from question";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();
    return $result;
}

?>