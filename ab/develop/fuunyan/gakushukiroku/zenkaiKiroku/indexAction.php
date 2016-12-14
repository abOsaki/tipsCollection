<?php

require_once "../../common/php/dbConnect.php";

saveCurriculumResult();

setSession();

header( "Location: mokuhyoTasseido.php" ) ;

function setSession(){
    session_start();
    $_SESSION['userID'] = $_POST['userID'];
    $_SESSION['periodID'] = $_POST['periodID'];
}

function saveCurriculumResult(){
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    //トランザクション
    $pdo -> beginTransaction();
    //全削除
    deleteAllCurriculum($pdo);
    //各種教科保存
    insertAllKyoukaResult($pdo);
    //コミット
    $pdo -> commit();
}

function deleteAllCurriculum($pdo){
    //sql文を発行して
    $sql="delete from ".'studyCurriculumResult '
    ." where `userID` = ? and `periodID` = ?";
    //prepareして
    $stmt = $pdo->prepare($sql);
    //バインドして
    $stmt->bindValue(1, $_POST['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $_POST['periodID'],       PDO::PARAM_INT);
    
    //エグゼキュート
    $stmt->execute();
}

function insertAllKyoukaResult($pdo){
    
    if(!(strval($_POST['kokugokekka']) == '')){
        insertCurriculumResult($pdo,1,$_POST['kokugokekka']);
    }
    if(!(strval($_POST['suugakukekka']) == '')){
        insertCurriculumResult($pdo,2,$_POST['suugakukekka']);
    }
    if(!(strval($_POST['eigokekka']) == '')){
        insertCurriculumResult($pdo,3,$_POST['eigokekka']);
    }
    if(!(strval($_POST['rikakekka']) == '')){
        insertCurriculumResult($pdo,4,$_POST['rikakekka']);
    }
    if(!(strval($_POST['shakaikekka']) == '')){
        insertCurriculumResult($pdo,5,$_POST['shakaikekka']);
    }
    if(!(strval($_POST['ongakukekka']) == '')){
        insertCurriculumResult($pdo,6,$_POST['ongakukekka']);
    }
    if(!(strval($_POST['bijutukekka']) == '')){
        insertCurriculumResult($pdo,7,$_POST['bijutukekka']);
    }
    if(!(strval($_POST['gijutukekka']) == '')){
        insertCurriculumResult($pdo,8,$_POST['gijutukekka']);
    }
    if(!(strval($_POST['hotaikekka']) == '')){
        insertCurriculumResult($pdo,9,$_POST['hotaikekka']);
    }
}

function insertCurriculumResult($pdo,$curriculumID,$point){
    //sql文を発行して
    $sql="INSERT INTO "
            .'studyCurriculumResult '
            .'(userID,periodID,curriculumID,point) '
            .'VALUES (?,?,?,?)';
    //prepareして
    $stmt = $pdo->prepare($sql);
    //バインドして
    $stmt->bindValue(1, $_POST['userID'],       PDO::PARAM_INT);
    $stmt->bindValue(2, $_POST['periodID'],       PDO::PARAM_INT);
    $stmt->bindValue(3, $curriculumID,       PDO::PARAM_INT);
    $stmt->bindValue(4, $point,       PDO::PARAM_INT);
    //エグゼキュート
    $stmt->execute();
}
