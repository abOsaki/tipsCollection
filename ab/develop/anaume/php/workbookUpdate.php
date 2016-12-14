<?php
require_once "dbConnect.php";
require_once "belongCountUpdater.php";

//項目をすべて取得
function workbookUpdate($dataList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    //値・条件式
    session_start();
    $sqlWhere = "`author` = '{$_SESSION["USERID"]}'";
    foreach ($dataList as $key => $value) {
        if ($key != "contents" && $key != "share") {
            //上書き条件判定
            if (isset($sqlWhere)) {
                $sqlWhere .= " AND ";
            }
            $sqlWhere .= "`{$key}` = '{$value}'";
        }
    }
    
    //上書き値フィールド
    $sqlSet = "`share` = '{$dataList["share"]}', `contents` = :contents";

    
    updateBelongCount($pdo, $dataList["contents"], $sqlWhere);

    //SQL文
    $sql = "UPDATE `package` SET {$sqlSet} WHERE {$sqlWhere}";
    //return $sql;
    //発行
    $stmt = $pdo -> prepare($sql);
    
    //プレースホルダ
    // countentsはカンマ区切りの文字列
    $stmt -> bindValue(':contents', $dataList["contents"], PDO::PARAM_STR);
    //実行
    $stmt -> execute(null);
}




//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);
echo workbookUpdate($dataArray);

//js側へ
//echo json_encode(update($dataArray));

?>