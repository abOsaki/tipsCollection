<?php

require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

if($param['command']=='getCookieValue'){
    $response = getCookieValue($param);
}else if($param['command']=='setCookieValue'){
    $response = setCookieValue($param);
}

echo json_encode($response,JSON_UNESCAPED_UNICODE);

function getCookieValue($param){
    $key = $param['key'];
    
    $result = $_COOKIE[$key];
    
    return $result;
}

function setCookieValue($param){
    $key = $param['key'];
    $value = $param['value'];
    
    session_start();
    $_SESSION["id"] = $value;
    
    return setcookie($key,$value,time() + 259200);
}