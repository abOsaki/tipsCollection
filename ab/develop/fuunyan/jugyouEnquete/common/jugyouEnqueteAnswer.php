<?php

require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

if($param['command']=='saveAnswer'){
    $response = jugyouEnqueteAnswer::saveAnswer($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);


class jugyouEnqueteAnswer {
    
    public static function saveAnswer($param){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        //トランザクション
        $pdo -> beginTransaction();
        
        //JSONからデコード
        $answers = json_decode($param['answers']);
        
        foreach ($answers as $answer){
            $decodeAnswer = json_decode($answer);
            self::deleteAnswer($pdo,$decodeAnswer);
            self::insertAnswer($pdo,$decodeAnswer);
        }
        
        try{
            $pdo -> commit();
        } catch (Exception $ex) {
            $pdo -> rollBack();
        }
    }
    
    private static function deleteAnswer($pdo,$answer){
        $sql="delete from "
                . "jugyouEnqueteAnswer "
                . "where `jugyouEnquete` = ? and `jugyouEnqueteQuestion` = ? and `user` = ? and `createdAt` > DATE_SUB(NOW(), INTERVAL 1 DAY) ";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $answer->jugyouEnquete,       PDO::PARAM_INT);
        $stmt->bindValue(2, $answer->jugyouEnqueteQuestion,       PDO::PARAM_INT);
        $stmt->bindValue(3, $answer->userID,       PDO::PARAM_INT);

        $result = $stmt->execute();
        return $result;
    }

    private static function insertAnswer($pdo,$answer){
        $sql="insert into "
                . "jugyouEnqueteAnswer "
                . "(jugyouEnquete,jugyouEnqueteQuestion,answerNumber,user) "
                . "VALUES (?,?,?,?)";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $answer->jugyouEnquete,       PDO::PARAM_INT);
        $stmt->bindValue(2, $answer->jugyouEnqueteQuestion,       PDO::PARAM_INT);
        $stmt->bindValue(3, $answer->answerNumber,       PDO::PARAM_INT);
        $stmt->bindValue(4, $answer->userID,       PDO::PARAM_INT);

        $result = $stmt->execute();
        return $result;
    }
    
}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

