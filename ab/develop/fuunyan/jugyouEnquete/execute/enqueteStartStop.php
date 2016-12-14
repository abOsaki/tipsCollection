<?php

require_once "../../common/php/dbConnect.php";
require_once "../common/jugyouEnquete.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

$enqueteID = $param['id'];

if($param['command']=='startEnquete'){
    //アンケートオブジェクトのスタティックメソッドでアンケートを起動させる
    jugyouEnquete::setStartStopEnquete($enqueteID, 2);
}else if($param['command']=='stopEnquete'){
    //アンケートオブジェクトのスタティックメソッドでアンケートを停止させる
    jugyouEnquete::setStartStopEnquete($enqueteID, 1);
}
echo json_encode($response,JSON_UNESCAPED_UNICODE);
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

