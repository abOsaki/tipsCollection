<?php
require_once '../../../admin/php/dbConnect.php';

//知恵蔵INSERT
//function chiezouInsert() {
//}

//知恵蔵UPDATE
//function chiezouInsert() {
//}

//知恵蔵SEARCH
function chiezouSearch($dataArray) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "chiezou";

    $columnList = ["id", "indexID", "date", "largeCategory", "middleCategory", "keyword", "content", "cause", "countermeasure"];

    //SELECT
    $sqlSelect = "`deleteFlag`";
    foreach ($columnList as $value) {
        if (!empty($sqlSelect)) {
            $sqlSelect .= ", ";
        }
        $sqlSelect .= "IFNULL(`{$value}`, '') AS `{$value}`";
    }

    //FROM
    $sqlFrom = "`{$tableName}`";

    //WHERE
    $sqlWhere = "`deleteFlag` IS NULL";
    foreach ($dataArray as $key => $value) {
        if (!empty($value) && !($key == "content" || $key == "cause" || $key == "countermeasure" )) {
            if (!empty($sqlWhere)) {
                $sqlWhere .= " AND ";
            }
            if ($key == "fromDate") {
                $sqlWhere .= "`date` >= :{$key}";
            } else if ($key == "toDate") {
                $sqlWhere .= "`date` <= :{$key}";
            } else {
                $sqlWhere .= "`{$key}` = :{$key}";
            }
        }
    }

    //ORDER
    $orderList = ["content", "cause", "countermeasure"];
    $sqlOrder = "";
    foreach ($orderList as $value) {
        if (!empty($dataArray[$value])) {
            if (!empty($sqlOrder)) {
                $sqlOrder .= ", ";
            }
            $sqlOrder .= "`{$value}` ASC";
        }
    }
    if (!empty($sqlOrder)) {
        $sqlOrder .= ", ";
    }
    $sqlOrder .= " `date` DESC, `renewalDate` DESC";

    //SQL
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} WHERE {$sqlWhere} ORDER BY {$sqlOrder}";
    $stmt = $pdo -> prepare($sql);
    //return $sql;

    //プリペアドステートメント
    foreach ($columnList as $value) {
        if ($value == "date") {
            $sqlWhere .= "`date` >= :fromDate AND `date` <= :toDate";
            $stmt -> bindValue(":fromDate", $dataArray["fromDate"], PDO::PARAM_STR);
            $stmt -> bindValue(":toDate", $dataArray["toDate"], PDO::PARAM_STR);
        } else {
            $item = $dataArray[$value];
            //content,cause,countermeasureはORDERで使用
            if (!empty($item) && !($value == "content" || $value == "cause" || $value == "countermeasure" )) {
                $sqlWhere .= "`{$key}` = :{$key}";
                $stmt -> bindValue(":{$value}", $item, PDO::PARAM_STR);
            }
        }
    }

    $stmt -> execute(null);
    return $stmt -> fetchAll(PDO::FETCH_CLASS);
}

//知恵蔵INSERT
function chiezouInsert($dataArray) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "chiezou";

    //$columnList = ["id", "indexID", "author", "date", "revisionDate", "largeCategory", "middleCategory", "keyword", "content", "cause", "countermeasure"];
    $columnList = ["id", "date", "largeCategory", "middleCategory", "keyword", "content", "cause", "countermeasure"];

    //INSERT
    $sqlInsert = "";
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

        $sqlValues .= "({$placeholder})";
    }

    //DUPLICATE
    $sqlDuplicate = "";
    foreach ($columnList as $value) {
        if ($value != "id") {
            if (!empty($sqlDuplicate)) {
                $sqlDuplicate .= ", ";
            }
            $sqlDuplicate .= "`{$value}` = VALUES(`{$value}`)";
        }
    }

    //SQL
    $sql = "INSERT INTO `{$tableName}` ({$sqlInsert}) VALUES {$sqlValues} ON DUPLICATE KEY UPDATE {$sqlDuplicate}";
    $stmt = $pdo -> prepare($sql);
    //return $sql;

    //プリペアドステートメント
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
    
    $stmt -> execute(null);
    return true;
}

function chiezouFetch($indexIdList) {
    if($indexIdList) {
        // updateしたいときの処理はここ
        // indexIdListに更新対象のIDを入れて実行する？
        return null;
    }
    else {
        return chiezouFetchNew();
    }
}

function chiezouFetchNew() {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    $troubleReport = HOURENSOU_TABLE . "`.`troubleReport";
    $chiezou = TAMATEBAKO_TABLE . "`.`chiezou";
    $trSelCol = ["id", "user", "date", "revisionDate", "memo", "comment"];

    $subQuery = "SELECT `indexID` FROM `{$chiezou}` `c` WHERE `c`.`indexID` IS NOT NULL";

    $sql =
        "SELECT `" . implode("`,`", $trSelCol) . "`" .
        " FROM `{$troubleReport}` `tr` WHERE `tr`.`id` NOT IN({$subQuery})";

    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);
    $results = $stmt -> fetchAll(PDO::FETCH_CLASS);
    
    $dataArray = array();
    foreach ($results as $row) {
        $obj = array(
            "indexID" => $row -> id,
            "author" => $row -> user,
            "date" => $row -> date,
            "revisionDate" => $row -> revisionDate,
            "largeCategory" => null,
            "middleCategory" => null,
            "keyword" => implode(",", extractKeywords($row -> memo)),
            "content" => $row->memo,
            "cause" => null,
            "countermeasure" => $row->comment
        );
        $dataArray[] = $obj;
    }

    return chiezouInsert($dataArray);
}

function extractKeywords($str) {
    $dictPath = "./../common/dic/myDic.dic"; // オリジナル追加辞書

    // メタ文字のエスケープ
    // 文字コード変換: js, php (UTF-8) -> mecabサーバー (EUC-JP)
    $str = mb_convert_encoding(
        str_replace(array("\r", "\n", "\""), array(" ", " ", "\\\""), $str),
        "euc-jp", "utf-8");
    
    exec("echo \"{$str}\" | mecab -u {$dictPath}", $output);

    $keywords = array();
    for($i = 0; $i < count($output); $i++) {
        // 文字コード再変換
        $output[$i] = mb_convert_encoding($output[$i], "utf-8", "euc-jp");
        
        if($output[$i] == "EOS") {
            break;
        }
        
        $result = explode("\t", explode(",", $output[$i], 2)[0]);
        
        if($result[1] == "名詞") {
            $keywords[] = $result[0];
        }
    }

    return $keywords;
}

function deleteIndexID($indexID) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    //SQL
    $sql = "UPDATE `chiezou` SET `deleteFlag` = :deleteFlag WHERE `id` = :id;";
    $stmt = $pdo -> prepare($sql);
    //return $sql;

    $stmt -> bindValue(":deleteFlag", 1, PDO::PARAM_INT);
    $stmt -> bindValue(":id", $indexID, PDO::PARAM_STR);

    $stmt -> execute(null);
    return "deleteOK";
}

function restoreIndexID($indexID) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    //SQL
    $sql = "UPDATE `chiezou` SET `deleteFlag` = :deleteFlag WHERE `id` = :id;";
    $stmt = $pdo -> prepare($sql);
    //return $sql;

    $stmt -> bindValue(":deleteFlag", NULL, PDO::PARAM_INT);
    $stmt -> bindValue(":id", $indexID, PDO::PARAM_STR);

    $stmt -> execute(null);
    return "restoreOK";
}

//js側からのデータ
$data = file_get_contents('php://input');
$req = json_decode($data, true);

$res = '';
if ($req['command'] == 'search') {
    $res = chiezouSearch($req['param']);
} else if ($req['command'] == 'insert') {
    $res = chiezouInsert($req['param']);
} else if($req['command'] == 'fetch'){
    $res = chiezouFetch($req['param']);
} else if($req['command'] == 'delete'){
    $res = deleteIndexID($req['param']);
} else if($req['command'] == 'restore'){
    $res = restoreIndexID($req['param']);
} else {
    $res = 'command error';
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>