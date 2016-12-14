<?php
require_once "../../../admin/php/dbConnect.php";

//開く
function questionOpen($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableNmae = "question";
    $comTB = COMMON_TABLE;

    //SELECT
    $sqlSelect =
        "`{$tableNmae}`.`id`, " .
        " `title`, " .
        "`{$comTB}`.`m_school`.`m_category_id` AS `category`, " .
        "`m_school_id` AS `school`, " .
        "`m_grade_id` AS `grade`, " .
        "`m_curriculum_id` AS `curriculum`, " .
        "`m_unit_id` AS `unit`, " .
        "`m_share_id` AS `share`, " .
        "`textContents`, ".
        "`imageContents`, ".
        "`fusen`, " .
        "`textStyle` ";

    //FROM
    $sqlFrom ="`{$tableNmae}` ";

    //JOIN
    $sqlJoin = "LEFT JOIN `{$comTB}`.`m_school` ON `m_school_id` = `{$comTB}`.`m_school`.`id` ";

    //WHERE
    $sqlWhere = "`{$tableNmae}`.`id` = :quesID ";
    if (!empty($sqlWhere)) {
        $sqlWhere = "WHERE {$sqlWhere} ";
    }
    
    //SQL
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} {$sqlJoin} {$sqlWhere} ";
    //return $sql;

    $stmt = $pdo -> prepare($sql);
    
    //バインド
    $stmt -> bindValue(":quesID", $param, PDO::PARAM_STR);
    
    $stmt -> execute(null);

    $result = $stmt -> fetch(PDO::FETCH_ASSOC);

    return $result;
}

//新規
function questionInsert($param) {
    //return $param;
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "question";
    $sql =
        "INSERT INTO `{$tableName}` " .
        "(`date`, `m_school_id`, `m_grade_id`, `m_curriculum_id`, `title`, `author`, `m_share_id`, `m_unit_id`, `textContents`, `imageContents`, `textStyle`, `fusen` ) " .
        "VALUE (NOW(), :m_school_id, :m_grade_id, :m_curriculum_id, :title, :author, :m_share_id, :m_unit_id, :textContents, :imageContents, :textStyle, :fusen);";
    //return $sql;
    
    $sql .= "SELECT LAST_INSERT_ID() AS `id`;";
    $stmt = $pdo -> prepare($sql);

    session_start();
    $stmt -> bindValue(":m_school_id",     $param["school"],        PDO::PARAM_INT);
    $stmt -> bindValue(":m_grade_id",      $param["grade"],         PDO::PARAM_INT);
    $stmt -> bindValue(":m_curriculum_id", $param["curriculum"],    PDO::PARAM_INT);
    $stmt -> bindValue(":title",           $param["title"],         PDO::PARAM_STR);
    $stmt -> bindValue(":author",          $_SESSION["USERID"],     PDO::PARAM_INT);
    $stmt -> bindValue(":m_share_id",      $param["share"],         PDO::PARAM_INT);
    $stmt -> bindValue(":m_unit_id",       $param["unit"],          PDO::PARAM_INT);
    $stmt -> bindValue(":textContents",    $param["textContents"],  PDO::PARAM_STR);
    //一度デコードされているため再エンコード
    $stmt -> bindValue(":imageContents",   json_encode($param["imageContents"], JSON_UNESCAPED_UNICODE), PDO::PARAM_STR);
    $stmt -> bindValue(":fusen",           json_encode($param["fusen"], JSON_UNESCAPED_UNICODE), PDO::PARAM_STR);
    $stmt -> bindValue(":textStyle",       $param["textStyle"],     PDO::PARAM_STR);
    
    $stmt -> execute(null);
    $result["result"] = $pdo -> lastInsertId();
    return $result;
}

//上書き
function questionUpdate($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "question";
    $sql =
        "UPDATE `{$tableName}` " .
        "SET `id` = LAST_INSERT_ID(`id`), `m_share_id` = :m_share_id, `textContents` = :textContents, `imageContents` = :imageContents, `textStyle` = :textStyle, `fusen` = :fusen ";
    $sqlWhere = "WHERE `m_school_id` = :m_school_id AND `m_grade_id` = :m_grade_id AND `m_curriculum_id` = :m_curriculum_id AND `title` = :title AND `author` = :author AND `m_unit_id` = :m_unit_id; ";
    $sql .= $sqlWhere;

    //return $sql;
    $stmt = $pdo -> prepare($sql);

    session_start();
    $stmt -> bindValue(":m_school_id",     $param["school"],        PDO::PARAM_INT);
    $stmt -> bindValue(":m_grade_id",      $param["grade"],         PDO::PARAM_INT);
    $stmt -> bindValue(":m_curriculum_id", $param["curriculum"],    PDO::PARAM_INT);
    $stmt -> bindValue(":title",           $param["title"],         PDO::PARAM_STR);
    $stmt -> bindValue(":author",          $_SESSION["USERID"],     PDO::PARAM_INT);
    $stmt -> bindValue(":m_share_id",      $param["share"],         PDO::PARAM_INT);
    $stmt -> bindValue(":m_unit_id",       $param["unit"],          PDO::PARAM_INT);
    $stmt -> bindValue(":textContents",    $param["textContents"],  PDO::PARAM_STR);
    //一度デコードされているため再エンコード
    $stmt -> bindValue(":imageContents",   json_encode($param["imageContents"], JSON_UNESCAPED_UNICODE), PDO::PARAM_STR);
    $stmt -> bindValue(":fusen",           json_encode($param["fusen"], JSON_UNESCAPED_UNICODE), PDO::PARAM_STR);
    $stmt -> bindValue(":textStyle",       $param["textStyle"],     PDO::PARAM_STR);

    $stmt -> execute(null);
    $result["result"] = $pdo -> lastInsertId();
    return $result;
}

//存在
function questionExist($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();

    $tableName = "question";
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

//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);

$res = "";
if ($req["command"] == "insert") {
    $res = questionInsert($req["param"]);
} else if ($req["command"] == "update") {
    $res = questionUpdate($req["param"]);
} else if ($req["command"] == "exist") {
    $res = questionExist($req["param"]);
} else if ($req["command"] == "open"){
    $res = questionOpen($req["param"]);
} else {
    $res = null;
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>