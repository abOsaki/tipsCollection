<?php
require_once "../../../admin/php/dbConnect.php";

//知恵蔵INSERT
function chiezouInsert($dataArray) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();
    $tableName = "chiezou";

    $columnList = ["date", "largeCategory", "middleCategory", "keyword", "content", "cause", "countermeasure"];

    //INSERT
    $sqlInsert = "`inputDate`, `author`";
    foreach ($columnList as $value) {
        if (!empty($sqlInsert)) {
            $sqlInsert .= ", ";
        }
        $sqlInsert .= "`{$value}`";
    }

    //VALUES
    $sqlValues = "";
    foreach ($dataArray as $num => $obj){
        if (!empty($sqlValues)) {
            $sqlValues .= ", ";
        }

        //プレースホルダ
        $placeholder = "";
        foreach ($columnList as $value) {
            if (!empty($placeholder)) {
                $placeholder .= ", ";
            }
            $placeholder .= ":{$value}{$num}";
        }
        
        $sqlValues .= "(NOW(), :author, {$placeholder})";
    }

    //SQL
    $sql = "INSERT INTO `{$tableName}` ({$sqlInsert}) VALUES {$sqlValues}";
    $stmt = $pdo -> prepare($sql);
    //return $dataArray;
    
    //パラメーター
    foreach ($dataArray as $num => $obj) {
        foreach ($columnList as $value) {
            $item = $dataArray[$num][$value];
            if (!empty($item)) {
                $stmt -> bindValue(":{$value}{$num}", $item, PDO::PARAM_STR);
            } else {
                $stmt -> bindValue(":{$value}{$num}", null, PDO::PARAM_STR);
            }
        }
    }

    session_start();
    $stmt -> bindValue(":author", $_SESSION["USERID"], PDO::PARAM_STR);
    
    $stmt -> execute(null);
    return true;
}

//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);

$res = "";
if($req["command"] == "insert"){
    $res = chiezouInsert($req["param"]);
} else {
    $res = null;
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>