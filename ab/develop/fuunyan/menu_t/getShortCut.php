<?php 

require_once "../common/php/dbConnect.php";

$data = file_get_contents("php://input");

if($_GET){

    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();


    $prefix='E';
    if($_GET['gp']=="2"){
         $prefix='H';  
    }

    $value=($_GET['pe'])?$_GET['pe']:$_GET['ph'];

    $tablename="school".$prefix;
    $datetime=date("Y-m-d H:i:s");
    $sql = "SELECT code  FROM `{$tablename}` where id = ? ";

    $stmt = $pdo -> prepare($sql);
    $stmt -> bindValue(1, $value, PDO::PARAM_INT);
    $stmt -> execute(null);
    $res=$stmt->fetchAll(PDO::FETCH_CLASS);


    $code=$res[0]->code;


    $contents = "";  
    //出力バッファリングを開始  
    ob_start();  
    //出力バッファに外部ファイルを読み込む  
    include('./shortcut.url');  
    //出力バッファの内容を変数に入れる  
    $contents = ob_get_contents();  
    //出力バッファリングを終了  
    ob_end_clean();  
    //変数の内容を出力 
    header("Content-Type:application/octet-stream");
header('Content-Disposition:attachment; filename*=UTF-8\'\''.rawurlencode('みまもりふぅ～にゃん.url'));
    echo $contents;  

    exit;
}

