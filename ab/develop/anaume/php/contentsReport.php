<?php
require_once "dbConnect.php";

function questionOpen($itemData) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();
    
    $sqlFrom = "lessonReport";
    $baseInfo = $model -> baseInfoName();
    $dbmekurin = $model -> dbmekurinName();
    
    //ログイン情報により条件設定
    session_start();
    if ($_SESSION["GROUP"] == 1) {
        $code = "E";
    } else if ($_SESSION["GROUP"] == 2) {
        $code = "H";
    } else {
        $code = null;
    }
    
    //INSERT
    $sqlInsert = "{$sqlFrom}";
    //VALUES
    $sqlValues = "'{$_SESSION["USERID"]}', '{$itemData["materialType"]}', '{$itemData["kyouzaiId"]}', '{$itemData["kyouzaiCode"]}'";
    if (!empty($code)) {
        //書き込み場所
        $intoList = ["user", "materialType", "package", "kyouzaiCode", "group", "school{$code}", "grade{$code}", "class{$code}", "curriculum{$code}", "lessonTimetable"];
       
        //VALUES
        $sqlValues .= ", ";
        $sqlValues .= "'{$_SESSION["GROUP"]}', '{$_SESSION["SCHOOL"]}'";
        
        $sqlValues .= ", ";
        if ($itemData["grade"]) {
            $sqlValues .= "'{$itemData["grade"]}'";
        } else {
            $sqlValues .= "'{$_SESSION["GRADE"]}'";
        }
        
        $sqlValues .= ", ";
        if ($itemData["class"]) {
            $sqlValues .= "'{$itemData["class"]}'";
        } else {
            $sqlValues .= "'{$_SESSION["CLASS"]}'";
        }
        
        //教科は教材によって決定するため不要？
        $sqlValues .= ", ";
        //教材の教科番号を取得
        if ($itemData["kyouzaiCode"] == 1) {
            $tableName = "question";
        } else if ($itemData["kyouzaiCode"] == 2) {
            $tableName = "package";
        }
        $sql = "SELECT CONCAT(IFNULL(`curriculumE`, ''), IFNULL(`curriculumH`, '')) AS 'curriculum' FROM `{$tableName}` WHERE `id` = '{$itemData["kyouzaiId"]}'";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $result = $stmt -> fetch(PDO::FETCH_ASSOC);
        $sqlValues .= "'{$result["curriculum"]}'";
        
    } else {
        $intoList = ["user", "materialType", "package", "kyouzaiCode", "lessonTimetable"];
    }
        
    //INTO
    $sqlInto = "`" . implode("`, `", $intoList) . "`";
    
    //VALUES
    $sqlValues .= ", ";
    if ($itemData["lessonTimetable"]) {
        $sqlValues .= "'{$itemData["lessonTimetable"]}'";
    } else {
        //格納時に現在の時間で割り当てる
        $nowDateTime = date('Hi');
        $sqlValues .= "'";
        if ($nowDateTime >= 0830 && $nowDateTime <= 0930) {
            $sqlValues .= 1;
        } else if ($nowDateTime >= 0930 && $nowDateTime <= 1030) {
            $sqlValues .= 2;
        } else if ($nowDateTime >= 1030 && $nowDateTime <= 1130) {
            $sqlValues .= 3;
        } else if ($nowDateTime >= 1130 && $nowDateTime <= 1230) {
            $sqlValues .= 4;
        } else if ($nowDateTime >= 1330 && $nowDateTime <= 1430) {
            $sqlValues .= 5;
        } else if ($nowDateTime >= 1430 && $nowDateTime <= 1530) {
            $sqlValues .= 6;
        } else {
            $sqlValues .= 0;
        }
        $sqlValues .= "'";
    }
    
    $sql = "INSERT INTO `{$dbmekurin}`.`{$sqlInsert}` ({$sqlInto}) VALUES ({$sqlValues})";
    //return $sql;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
//
//    $array = array();
//    while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
//        $array[] = $result;
//    }
    
    //return $sql;
    //return $array;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(questionOpen($dataArray));

?>