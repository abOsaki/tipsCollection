<?php
require_once "../../../admin/php/dbConnect.php";
//belongCount利用のため追加
require_once "../common/php/belongCount.php";

//新規
function workbookInsert($param) {
    //return $param;
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "package";
    $sql =
        "INSERT INTO `{$tableName}` " .
        "(`date`, `m_school_id`, `m_grade_id`, `m_curriculum_id`, `title`, `author`, `contents`, `m_share_id`, `m_unit_id`) " .
        "VALUE (NOW(), :m_school_id, :m_grade_id, :m_curriculum_id, :title, :author, :contents, :m_share_id, :m_unit_id);";
    //return $sql;
    
    $renew = array(
        'where' => null,
        'param' => $param
    );
    updateBelongCount($pdo, $renew);

    $sql .= "SELECT LAST_INSERT_ID() AS `id`;";
    $stmt = $pdo -> prepare($sql);

    session_start();
    $stmt -> bindValue(":m_school_id",     $param["school"],                 PDO::PARAM_INT);
    $stmt -> bindValue(":m_grade_id",      $param["grade"],                  PDO::PARAM_INT);
    $stmt -> bindValue(":m_curriculum_id", $param["curriculum"],             PDO::PARAM_INT);
    $stmt -> bindValue(":title",           $param["title"],                  PDO::PARAM_STR);
    $stmt -> bindValue(":author",          $_SESSION["USERID"],              PDO::PARAM_INT);
    $stmt -> bindValue(":contents",        implode(',', $param["contents"]), PDO::PARAM_STR);
    $stmt -> bindValue(":m_share_id",      $param["share"],                  PDO::PARAM_INT);
    $stmt -> bindValue(":m_unit_id",       $param["unit"],                   PDO::PARAM_INT);
    
    $stmt -> execute(null);
    //$result["result"] = "insert";
    $result["result"] = $pdo -> lastInsertId();
    return $result;
}

//上書き
function workbookUpdate($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "package";
    $sql =
        "UPDATE `{$tableName}` " .
        "SET `id` = LAST_INSERT_ID(`id`), `contents` = :contents, `m_share_id` = :m_share_id ";
    $sqlWhere = "WHERE `m_school_id` = :m_school_id AND `m_grade_id` = :m_grade_id AND `m_curriculum_id` = :m_curriculum_id AND `title` = :title AND `author` = :author AND `m_unit_id` = :m_unit_id; ";
    $sql .= $sqlWhere;

    //$sql .= "SELECT `id` FROM (SELECT LAST_INSERT_ID() AS `id`) AS `LII`;";
    //$sql .=  "SELECT LAST_INSERT_ID() AS `id` FROM {$tableName} ;";
    
    $renew = array(
        'where' => $sqlWhere,
        'param' => $param
    );
    updateBelongCount($pdo, $renew);

    //return $sql;
    $stmt = $pdo -> prepare($sql);

    session_start();
    $stmt -> bindValue(":m_school_id",     $param["school"],                 PDO::PARAM_INT);
    $stmt -> bindValue(":m_grade_id",      $param["grade"],                  PDO::PARAM_INT);
    $stmt -> bindValue(":m_curriculum_id", $param["curriculum"],             PDO::PARAM_INT);
    $stmt -> bindValue(":title",           $param["title"],                  PDO::PARAM_STR);
    $stmt -> bindValue(":author",          $_SESSION["USERID"],              PDO::PARAM_INT);
    $stmt -> bindValue(":contents",        implode(',', $param["contents"]), PDO::PARAM_STR);
    $stmt -> bindValue(":m_share_id",      $param["share"],                  PDO::PARAM_INT);
    $stmt -> bindValue(":m_unit_id",       $param["unit"],                   PDO::PARAM_INT);

    $stmt -> execute(null);
    //return $result["result"] = "update";
    //$result = $stmt -> fetch(PDO::FETCH_ASSOC);
    $result["result"] = $pdo -> lastInsertId();
    return $result;
}

//存在
function workbookExist($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "package";
    $sql =
        "SELECT `id` " .
        "FROM `{$tableName}` " .
        "WHERE `m_school_id` = :m_school_id AND `m_grade_id` = :m_grade_id AND `m_curriculum_id` = :m_curriculum_id AND `title` = :title AND `author` = :author AND `m_unit_id` = :unit ";
    $stmt = $pdo -> prepare($sql);
    //return $sql;

    session_start();
    $stmt -> bindValue(":m_school_id",     $param["school"],     PDO::PARAM_INT);
    $stmt -> bindValue(":m_grade_id",      $param["grade"],      PDO::PARAM_INT);
    $stmt -> bindValue(":m_curriculum_id", $param["curriculum"], PDO::PARAM_INT);
    $stmt -> bindValue(":title",           $param["title"],      PDO::PARAM_STR);
    $stmt -> bindValue(":author",          $_SESSION["USERID"],  PDO::PARAM_INT);
    $stmt -> bindValue(":unit",            $param["unit"],       PDO::PARAM_INT);

    $stmt -> execute(null);
    
    $array = $stmt -> fetchAll(PDO::FETCH_CLASS);
    if (count($array) > 0) {
        $result["flag"] = "true";
    } else if (count($array) == 0) {
        $result["flag"] = "false";
    } else {
        $result["flag"] = "error";
    }
    return $result;
}

//開く
function workbookOpen($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();
    
    $tableNmae = 'package';
    $commonTable = COMMON_TABLE;
    $workbook = array();
    
    //問題集使われている設問のIDを取得
    $sql =
        "SELECT `TB1`.`id`, `title`, `contents`, `TB2`.`m_category_id` AS `category`, `m_school_id` AS `school`, `m_grade_id` AS `grade`, `m_curriculum_id` AS `curriculum`, `m_unit_id` AS `unit`, `m_share_id` AS `share` " .
        "FROM `{$tableNmae}` AS `TB1`" .
        "LEFT JOIN `{$commonTable}`.`m_school` AS `TB2` ON `m_school_id` = `TB2`.`id`" .
        "WHERE `TB1`.`id` = :packageID ";
    $stmt = $pdo -> prepare($sql);
    $stmt -> bindValue(":packageID", $param, PDO::PARAM_STR);
    $stmt -> execute(null);
    $result = $stmt -> fetch(PDO::FETCH_ASSOC);
    $wookbook["info"] = $result;
    $contents = explode(',', $result['contents']);

    //設問を取得
    $in_id = preg_replace("/\d{1,}/", "?", $result["contents"]);
    $tableName = "question";
    $sql =
        "SELECT `TB1`.`id`, `TB1`.`title`, `TB2`.`name` AS `school`, `TB3`.`name` AS `category`, `TB4`.`name` AS `grade`, `TB5`.`name` AS `curriculum`, `TB6`.`name` AS `unit` " .
        "FROM `{$tableName}` AS `TB1` " .
        "LEFT JOIN `{$commonTable}`.`m_school` AS `TB2` ON `TB1`.`m_school_id` = `TB2`.`id` " .
        "LEFT JOIN `{$commonTable}`.`m_category` AS `TB3` ON `TB2`.`m_category_id` = `TB3`.`id` " .
        "LEFT JOIN `{$commonTable}`.`m_grade` AS `TB4` ON `TB1`.`m_grade_id` = `TB4`.`id` " .
        "LEFT JOIN `{$commonTable}`.`m_curriculum` AS `TB5` ON `TB1`.`m_curriculum_id` = `TB5`.`id` " .
        "LEFT JOIN `{$commonTable}`.`m_unit` AS `TB6` ON `TB1`.`m_unit_id` = `TB6`.`id` " .
        "WHERE `TB1`.`id` in ({$in_id}) ";
    //return $sql;
    $stmt = $pdo -> prepare($sql);
    foreach ($contents as $key => $value) {
        $stmt -> bindValue($key + 1, $value, PDO::PARAM_INT);
    }
    $stmt -> execute(null);
    $questions = $stmt -> fetchAll(PDO::FETCH_CLASS);
    
    //問題集に使われている順番で設問を格納
    foreach ($contents as $value) {
        foreach ($questions as $ques){
            //stdClassのままだと参照できないためキャスト
            $ques = (array)$ques;
            if ($value == $ques["id"]) {
                $wookbook["result"][] = $ques;
            }
        }
    }

    return $wookbook;
}

//設問検索
function questionSearch($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "question";
    $commonDB = COMMON_TABLE;

    //SELECT
    $sqlSelect =
        "SELECT `TB0`.`id`, IFNULL(`TB0`.`title`, '') AS `title`";
    
    //FROM
    $sqlFrom =
        "FROM {$tableName} AS `TB0` ";
    $sqlJoin = "";

    //SELECT, LEFT JOIN 追加
    $array = ["school", "grade", "curriculum", "unit"];
    foreach($array as $key => $value) {
        $key += 1;
        if (!empty($sqlSelect)) {
            $sqlSelect .= ',';
        }
        $sqlSelect .= "IFNULL(`TB{$key}`.`name`, '') AS `{$value}` ";
        $sqlJoin .= "LEFT JOIN `{$commonDB}`.`m_{$value}` AS `TB{$key}` ON `TB0`.`m_{$value}_id` = `TB{$key}`.`id` ";
        //学校から所属する学校種別を割り出す
        if ($value == "school") {
            $sqlSelect .= ", IFNULL(`CATEGORY`.`name`, '') AS `category` ";
            $sqlJoin .= "LEFT JOIN `{$commonDB}`.`m_category` AS `CATEGORY` ON `TB{$key}`.`m_category_id` = `CATEGORY`.`id` ";
        }
    }

    //WHERE
    $sqlWhere = "";
    foreach ($array as $key => $value) {
        $key += 1;
        if (!empty($param[$value])) {
            if (!empty($sqlWhere)) {
                $sqlWhere .= "AND ";
            }
            $sqlWhere .= "`TB{$key}`.`id` = :{$value} ";
        }
    }
    if (!empty($param["title"])) {
        if (!empty($sqlWhere)) {
            $sqlWhere .= "AND ";
        }
        $sqlWhere .= "`TB0`.`title` LIKE :title ";
    }
    if (!empty($param["category"])) {
        if (!empty($sqlWhere)) {
            $sqlWhere .= "AND ";
        }
        $sqlWhere .= "`CATEGORY`.`id` = :category ";
    }

    /* 権限絞り込み----------------------------------------------------------------------------------------------------*/
    session_start();
    $roleWhere = "`TB0`.`author` = '{$_SESSION["USERID"]}' ";
    //「教材に紐づいた学校の所属地区」と「ユーザーの所属地区」が同一のもの
    $roleCity = "`TB1`.`m_city_id` = '{$_SESSION["CITY"]}'";
    $roleSchoole = "";
    switch ((int)$_SESSION['ROLE']) {
        case 1:
            //事務局(編集権限無し)
            return array();
            break;
        case 2:
            //教育委員会(編集権限無し)
            return array();
            break;
        case 3:
            //学校管理職(編集権限無し)
            return array();
            break;
        case 4:
            //コーディネーター
            //学区内の全コンテンツ対象のため絞り込み無し
            break;
        case 5:
            //ICT支援員
            //「教材に紐づいた学校の所属地区」と「ユーザーの所属地区」
            $roleCity .= " AND `m_share_id` = '3' ";
            if ((int)$param["school"] > 0) {
                //学校に無所属のため学校リストから選択することになる
                //学校リスト選択時のみ「教材に紐づいた共有権限」が「校内共有」のものを追加
                $roleSchoole .= "`TB0`.`m_share_id` = '2' ";
            }
            break;
        case 6:
            //担任
            //「教材に紐づいた共有権限」が「区内共有」のものを追加
            $roleCity .= " AND `m_share_id` = '3' ";
            //「教材に紐づいた学校」と「ユーザーの所属学校」が同一であり「教材に紐づいた共有権限」が「校内共有」のものを追加
            $roleSchoole .= "`TB0`.`m_school_id` = '{$_SESSION["SCHOOL"]}' AND `TB0`.`m_share_id` = '2' ";
            break;
        case 7:
            //専科
            //「教材に紐づいた共有権限」が「区内共有」のもの
            $roleCity .= " AND `m_share_id` = '3' ";
            //「教材に紐づいた学校」と「ユーザーの所属学校」が同一であり「教材に紐づいた共有権限」が「校内共有」のものを追加
            $roleSchoole .= "`TB0`.`m_school_id` = '{$_SESSION["SCHOOL"]}' AND `TB0`.`m_share_id` = '2' ";
            break;
        case 8:
            //デモ（企業） <- 支援員と一緒にしている
            //「教材に紐づいた学校の所属地区」と「ユーザーの所属地区」
            $roleCity .= " AND `m_share_id` = '3' ";
            if ((int)$param["school"] > 0) {
                //学校に無所属のため学校リストから選択することになる
                //学校リスト選択時のみ「教材に紐づいた共有権限」が「校内共有」のものを追加
                $roleSchoole .= "`TB0`.`m_share_id` = '2' ";
            }
            break;
        case 9:
            //その他（学校） <- 担任・専科と一緒にしている
            //「教材に紐づいた共有権限」が「区内共有」のものを追加
            $roleCity .= " AND `m_share_id` = '3' ";
            //「教材に紐づいた学校」と「ユーザーの所属学校」が同一であり「教材に紐づいた共有権限」が「校内共有」のものを追加
            $roleSchoole .= "`TB0`.`m_school_id` = '{$_SESSION["SCHOOL"]}' AND `TB0`.`m_share_id` = '2' ";
            break;
    }
    if (!empty($roleCity)) {
        $roleCity = "OR ($roleCity) ";
    }
    if (!empty($roleSchoole)) {
        $roleSchoole = "OR ($roleSchoole) ";
    }
    $roleWhere .= "{$roleCity} {$roleSchoole} ";
    //return $sql;

    /*--------------------------------------------------------------------------------------------------------------*/

    if (!empty($sqlWhere)) {
        $sqlWhere = "WHERE ({$roleWhere}) AND ({$sqlWhere}) ";
    }
    
    $sql = $sqlSelect . $sqlFrom . $sqlJoin . $sqlWhere;
    //return $sql;

    $stmt = $pdo -> prepare($sql);

    //バインド
    foreach ($array as $value) {
        if (!empty($param[$value])) {
            $stmt->bindValue(":{$value}", "{$param[$value]}", PDO::PARAM_INT);
        }
    }
    //バインド追記
    if (!empty($param["title"])) {
        $stmt->bindValue(":title", "%{$param["title"]}%", PDO::PARAM_STR);
    }
    if (!empty($param["category"])) {
        $stmt->bindValue(":category", "{$param["category"]}", PDO::PARAM_INT);
    }

    $stmt -> execute(null);
    return $stmt -> fetchAll(PDO::FETCH_CLASS);
}

//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);

$res = "";
if ($req["command"] == "insert") {
    $res = workbookInsert($req["param"]);
} else if ($req["command"] == "update") {
    $res = workbookUpdate($req["param"]);
} else if ($req["command"] == "exist") {
    $res = workbookExist($req["param"]);
} else if ($req["command"] == "workbookOpen") {
    $res = workbookOpen($req["param"]);
} else if ($req["command"] == "questionSearch") {
    $res = questionSearch($req["param"]);
} else {
    $res = null;
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>