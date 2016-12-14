<?php
require_once '../../../admin/php/dbConnect.php';

//知恵蔵SEARCH
function chiezouSearch($param) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = 'chiezou';

    $chiezouColumn = ['id', 'content', 'cause', 'countermeasure'];
    
    //SELECT
    $sqlSelect = '';
    $columnList = $chiezouColumn;
    foreach ($columnList as $value) {
        if (!empty($sqlSelect)) {
            $sqlSelect .= ', ';
        }
        $sqlSelect .= "IFNULL (`{$value}`, '') AS `{$value}`";
    }

    //FROM
    $sqlFrom = "{$tableName}";

    //サブクエリ
    $subQuery =
        "SELECT `chiezouId`,`viewDate`, `user`," .
        "COUNT(`chiezouId`) AS `ct`, " .
        "AVG(`viewingTime`) AS `avg`, " .
        "SUM(`viewingTime`) AS `sum`, " .
        "MAX(`viewingTime`) AS `max`" .
        "FROM `previewCount` " .
        "GROUP BY `chiezouId`";

    //JOIN
    $sqlJoin = "LEFT JOIN ({$subQuery}) AS `pCt` ON `{$tableName}`.`id` = `pCt`.`chiezouId`";
    
    //WHERE
    $sqlWhere = "";

    //キーワード絞り込み
    //全角スペースを半角スペースに置換し分割
    $keyword = mb_convert_kana($param["keyword"], "s", "UTF-8");
    $keywordList = preg_split("/[\s]+/", $keyword, -1, PREG_SPLIT_NO_EMPTY);
    //mecabを通したものと結合
    $keywordList = array_merge($keywordList, mecabfn($param["keyword"]));
    $keywordList = array_unique($keywordList);

    $whereStr = "";
    $keywordArray = array();
    if (count($keywordList) > 0) {
        foreach($keywordList as $num => $value){
        //foreach($keywordList as $value){
            if (!empty($whereStr)) {
                $whereStr .= "OR ";
            }
            $whereStr .= "`keyword` LIKE :keyword{$num} ";
            //$whereStr .= "`keyword` LIKE '%{$value}%' ";
            $keywordArray[] = $value;
        }
        if (!empty($sqlWhere)) {
            $sqlWhere .= "AND ";
        }
        $sqlWhere .= "({$whereStr})";
    }
    
    //項目絞り込み
    $whereStr = "";
    if (!empty($param["largeCategory"])) {
        //$whereStr .= "`largeCategory` = '{$param["largeCategory"]}' ";
        $whereStr .= "`largeCategory` = :largeCategory ";
    }
    if (!empty($param["middleCategory"])) {
        if (!empty($whereStr)) {
            $whereStr .= "AND ";
        }
        //$whereStr .= "`middleCategory` = '{$param["middleCategory"]}' ";
        $whereStr .= "`middleCategory` = :middleCategory ";
    }
    if (!empty($whereStr)) {
        if (!empty($sqlWhere)) {
            $sqlWhere .= "AND ";
        }
        $sqlWhere .= "({$whereStr})";
    }
    
    //社内用と社外の権限分け
    session_start();
    if (intval($_SESSION["TAMATEBAKO"]) > 0) {
        if (!empty($sqlWhere)) {
            $sqlWhere .= "AND ";
        }
        $sqlWhere .= "`{$tableName}`.`largeCategory` != '小耳ネタ' ";
    }

    //ORDER
    $sqlOrder = 
        "`ct` DESC, " .
        "`avg` DESC, " .
        "`sum` DESC, " .
        "`max` DESC";

    //SQL
    if (!empty($sqlWhere)) {
       $sqlWhere = "WHERE {$sqlWhere}";
    }
    $sql = "SELECT {$sqlSelect} FROM `{$tableName}` {$sqlJoin} {$sqlWhere} ORDER BY {$sqlOrder}";
    //return $sql;

    $stmt = $pdo -> prepare($sql);

    //プリペアドステートメント
    if (count($keywordList) > 0) {
        foreach($keywordList as $num => $value){
            $stmt -> bindValue(":keyword{$num}", "%{$value}%", PDO::PARAM_STR);
        }
    }
    $str = "largeCategory";
    if (!empty($param[$str])) {
        $stmt -> bindValue(":{$str}", $param[$str], PDO::PARAM_STR);
    }
    $str = "middleCategory";
    if (!empty($param[$str])) {
        $stmt -> bindValue(":{$str}", $param[$str], PDO::PARAM_STR);
    }

    $stmt -> execute(null);
    return $stmt -> fetchAll(PDO::FETCH_CLASS);
}

//知恵蔵閲覧履歴
function previewCount($param) {
    $model = new dbConnect(TAMATEBAKO_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "previewCount";

    $columnList = ["user", "chiezouId", "viewingTime"];

    //INSERT
    $sqlInsert = "`" . implode("`, `", $columnList) . "`";

    //VALUES
    $sqlValues = ":" . implode(", :", $columnList);

    /*
     *viewingTimeが一定値以下の場合は記録しなくてもよい
     *何かしらのフィルターを掛けて明らかに短いものはカウントしなくてもよい
     *一定間隔でJS側から送信してきてもよい
     */
    
    //SQL
    $sql = "INSERT INTO `{$tableName}` ({$sqlInsert}) VALUES ({$sqlValues})";
    //return $sql;

    $stmt = $pdo -> prepare($sql);

    //プリペアドステートメント
    foreach ($param as $key => $value) {
        if (!empty($value)) {
            $stmt -> bindValue(":{$key}", $value, PDO::PARAM_INT);
        }
    }

    session_start();
    $stmt -> bindValue(":user", $_SESSION["USERID"], PDO::PARAM_INT);

    $stmt -> execute(null);

    //return $stmt -> fetchAll(PDO::FETCH_CLASS);
}

//mecabで形態素解析
function mecabfn($keywordStr) {
    $mecabpath = "/usr/local/bin/mecab"; // mecab.exe のパス
    $dictPath = "./../common/dic/myDic.dic"; // オリジナル追加辞書

    //エスケープ
    $input_deleteRN = str_replace(array("\r", "\n", "\""), array(" ", " ", "\\\""), $keywordStr);

    //辞書がeuc-jpのため変換
    $input_encode = mb_convert_encoding($input_deleteRN, "euc-jp", "utf-8");

    //形態素解析
    exec("echo {$input_encode} | {$mecabpath} -u {$dictPath}", $result);
    
    $word_list_index = $word_list = array();
    foreach ($result as $val) {
        //euc-jpからutf-8に戻す
        $val = mb_convert_encoding($val, "utf-8", "euc-jp");

        if($output[$i] == "EOS") {
            break;
        }

        //$valをカンマ区切りで配列へ変換
        $tmp = explode(",", $val);

        //0番目をタブ区切りで配列へ
        $tmp = explode("\t", $tmp[0], 2);
        //$tmp[0]: 要素, $tmp[1]: 品詞

        //品詞を指定して格納(オリジナルの品詞が作れる？)
        if ($tmp[1] == "名詞") {
            //カウント用配列の$word_list_indexにすでに入っているか判定
            $key = array_search($tmp[0], $word_list_index);

            if ($key === false) {// 新出
                $word_list[] = array(
                    "num" => 1,
                    "word" => $tmp[0]
                );
                $word_list_index[] = $tmp[0];
            } else {// 既出
                $word_list[$key]["num"] += 1;
            }
        }
    }

    //$word_list_indexを破棄
    unset($word_list_index);

    //ソート(numの値でソートされている？)
    arsort($word_list);

    $mecabResult = array();
    foreach ($word_list as $value) {
        $mecabResult[] = $value["word"];
    }
    return $mecabResult;
}

//js側からのデータ
$data = file_get_contents('php://input');
$req = json_decode($data, true);

$res = '';
if($req['command'] == 'search'){
    $res = chiezouSearch($req['param']);
} else if($req['command'] == 'count'){
    $res = previewCount($req['param']);
} else {
    $res = 'command error';
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>