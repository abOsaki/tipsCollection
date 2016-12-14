<?php
require_once "dbConnect.php";


//項目をすべて取得
function questionDelete($data) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    //var_dump($dataList);
    session_start();
    
    $sql = "SELECT * FROM `question` WHERE `id` = '{$data}'";
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
    $result = $stmt -> fetch(PDO::FETCH_ASSOC);
    

    if ($result["author"] != $_SESSION["USERID"]){
        return "noAuth";
    }else if ((int)$result["belongCount"] > 0) {
        return (int)$result["belongCount"];

    } else {
        $sqlFrom = "`question`";
        $sqlWhere = "`question`.`id` = {$data} AND `author` = '{$_SESSION["USERID"]}'";
        //DELETE FROM テーブル名 WHERE 条件;
        $sql = "DELETE FROM {$sqlFrom} WHERE {$sqlWhere}";
        //echo $sql;
        //発行
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        return 0;
    }
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
//$dataArray = json_decode($data, true);

//js側へ
echo questionDelete($data);

?>