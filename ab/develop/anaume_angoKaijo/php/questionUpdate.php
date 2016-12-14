<?php
require_once "dbConnect.php";

//項目をすべて取得
function updateData($dataList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    //UPDATE テーブル名 SET `フィールド名1` = '値' [,`フィールド名2` = '値', ... ] WHERE 条件式;
    $sqlUpdate = "`question`";
    
    //値・条件式
    session_start();
    $sqlWhere = "`author` = '{$_SESSION["USERID"]}'";
    foreach ($dataList as $key => $value) {
        if ($key != "textContents" && $key != "imageContents" && $key != "textStyle" && $key != "share" && $key != "fusen" && $key != "audioContents" && $key != "rubyContents") { //上書き条件判定
            if (isset($sqlWhere)) {
                $sqlWhere .= " AND ";
            }
            $sqlWhere .= "`{$key}` = '{$value}'";
        } else { //上書き値フィールド
            if (isset($sqlSet)) {
                $sqlSet .= ", ";
            }
            if ($key == "textContents" || $key == "imageContents" || $key == "fusen" || $key == "audioContents" || $key == "rubyContents") {
                $sqlSet .= "`{$key}` = :{$key}";
            } else {
                $sqlSet .= "`{$key}` = '{$value}'";
            }
        }
    }
    
    //SQL文
    $sql = "UPDATE {$sqlUpdate} SET {$sqlSet} WHERE {$sqlWhere}";
    
    //発行
    $stmt = $pdo -> prepare($sql);
    
    //プレースホルダ
    $stmt -> bindValue(':textContents', $dataList["textContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':imageContents', $dataList["imageContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':audioContents', $dataList["audioContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':rubyContents', $dataList["rubyContents"], PDO::PARAM_STR);
    $stmt -> bindValue(':fusen', $dataList["fusen"], PDO::PARAM_STR);
    
    //実行
    $stmt -> execute(null);
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);
updateData($dataArray);

//js側へ
//echo json_encode(update($dataArray));

?>