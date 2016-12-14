<?php
require_once "../common/php/dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res = "";

if ($req['command'] == 'packageSave') {
    $res = packageSave($req);
} else if ($req['command'] == 'sheet') {
    $res = getSheet($req);
}

echo json_encode($res,JSON_UNESCAPED_UNICODE);
//////////////////////////////////////////////function
// パッケージを検索する
function packageSave($req = null) {
    $res = array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $tablename = "package";

    $datetime = date("Y-m-d H:i:s");
    $param = $req['param'];
    $id = "";

    $param['dateFrom'] = DateTime::createFromFormat('Y/m/d', $param['dateFrom']) -> format('Y-m-d 00:00:00');
    $param['dateTo'] = DateTime::createFromFormat('Y/m/d', $param['dateTo']) -> format('Y-m-d 23:59:59');

    $sql =
        "INSERT INTO " . $tablename .
        "(id,date,renewalDate,author,`group`,schoolE,schoolH,gradeE,gradeH,curriculumE,curriculumH,purpose,title,contents) " .
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) " .
        "ON DUPLICATE KEY UPDATE " .
        //「pacakgeの更新」自分：○、他人：×、回答あり：×。case,if?
        "renewalDate = ?, author = ?, `group` = ?, schoolE = ?, schoolH = ?, gradeE= ?, gradeH= ?, curriculumE= ?, curriculumH = ?, purpose = ?, title =?, contents=?, `id` = LAST_INSERT_ID(`id`);";
    $sql .=
        "INSERT INTO `sheet` " .
        "(`id`,`package`, `title`, `share`, `dateFrom`, `dateTo`, `group`, `schoolE`, `schoolH`, `gradeE`, `gradeH`, `classE`, `classH`) " .
        "VALUES (?, LAST_INSERT_ID(), ?,?,?,?,?,?,?,?,?,?,?) " .
        "ON DUPLICATE KEY UPDATE " .
        "`package` = VALUES(`package`), `title` = VALUES(`title`), `share` = VALUES(`share`), `dateFrom` = VALUES(`dateFrom`), `dateTo` = VALUES(`dateTo`), `group` = VALUES(`group`), `schoolE` = VALUES(`schoolE`), `schoolH` = VALUES(`schoolH`), `gradeE` = VALUES(`gradeE`), `gradeH` = VALUES(`gradeH`), `classE` = VALUES(`classE`), `classH` = VALUES(`classH`);";
    $stmt = $pdo -> prepare($sql);

    session_start();
    if ($stmt) {
        $stmt -> setFetchMode(PDO::FETCH_ASSOC);
        $stmt -> bindValue(1, $id,                       PDO::PARAM_INT);
        $stmt -> bindValue(2, $datetime,                 PDO::PARAM_INT);
        $stmt -> bindValue(3, $datetime,                 PDO::PARAM_INT);
        $stmt -> bindValue(4, $param['author'],          PDO::PARAM_INT);
        $stmt -> bindValue(5, $_SESSION['GROUP'],        PDO::PARAM_INT);
        $stmt -> bindValue(6, $_SESSION['SCHOOLE'],      PDO::PARAM_INT);
        $stmt -> bindValue(7, $_SESSION['SCHOOLH'],      PDO::PARAM_INT);
        $stmt -> bindValue(8, $_SESSION['GRADEE'],       PDO::PARAM_INT);
        $stmt -> bindValue(9, $_SESSION['GRADEH'],       PDO::PARAM_INT);
        $stmt -> bindValue(10, $_SESSION["CURRICULUME"], PDO::PARAM_INT);
        $stmt -> bindValue(11, $_SESSION["CURRICULUMH"], PDO::PARAM_INT);
        $stmt -> bindValue(12, $param['purpose'],        PDO::PARAM_INT);
        $stmt -> bindValue(13, $param['title'],          PDO::PARAM_STR);
        $stmt -> bindValue(14, $param['contents'],       PDO::PARAM_STR);

        $stmt -> bindValue(15, $datetime,                PDO::PARAM_INT);
        $stmt -> bindValue(16, $param['author'],         PDO::PARAM_INT);
        $stmt -> bindValue(17, $_SESSION['GROUP'],       PDO::PARAM_INT);
        $stmt -> bindValue(18, $_SESSION['SCHOOLE'],     PDO::PARAM_INT);
        $stmt -> bindValue(19, $_SESSION['SCHOOLH'],     PDO::PARAM_INT);
        $stmt -> bindValue(20, $_SESSION['GRADEE'],      PDO::PARAM_INT);
        $stmt -> bindValue(21, $_SESSION['GRADEH'],      PDO::PARAM_INT);
        $stmt -> bindValue(22, $_SESSION["CURRICULUME"], PDO::PARAM_INT);
        $stmt -> bindValue(23, $_SESSION["CURRICULUMH"], PDO::PARAM_INT);
        $stmt -> bindValue(24, $param['purpose'],        PDO::PARAM_INT);
        $stmt -> bindValue(25, $param['title'],          PDO::PARAM_STR);
        $stmt -> bindValue(26, $param['contents'],       PDO::PARAM_STR);

        $stmt -> bindValue(27, $param['sheetID'],    PDO::PARAM_INT);
        $stmt -> bindValue(28, $param['title'],      PDO::PARAM_STR);
        $stmt -> bindValue(29, $param['share'],      PDO::PARAM_INT);
        $stmt -> bindValue(30, $param['dateFrom'],   PDO::PARAM_STR);
        $stmt -> bindValue(31, $param['dateTo'],     PDO::PARAM_STR);
        $stmt -> bindValue(32, $_SESSION['GROUP'],   PDO::PARAM_INT);
        $stmt -> bindValue(33, $_SESSION['SCHOOLE'], PDO::PARAM_INT);
        $stmt -> bindValue(34, $_SESSION['SCHOOLH'], PDO::PARAM_INT);
        $stmt -> bindValue(35, $_SESSION['GRADEE'],  PDO::PARAM_INT);
        $stmt -> bindValue(36, $_SESSION['GRADEH'],  PDO::PARAM_INT);
        $stmt -> bindValue(37, $_SESSION['CLASSE'],  PDO::PARAM_INT);
        $stmt -> bindValue(38, $_SESSION['CLASSH'],  PDO::PARAM_INT);

        $stmt -> execute(null);

        return $res['result'] = $param;

    } else {
        return $res['result'] = 'false';
        //return array('result'=>'false');
    }
}

function getSheet($req = null) {
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model -> connectInfo();
    $param = $req['param'];

    $tb1 = "sheet";
    $tb2 = "package";

    $sql =
        "SELECT * " .
        "FROM `{$tb1}` AS `TB1` " .
        "LEFT JOIN `{$tb2}` AS `TB2` ON `TB1`.`{$tb2}` = `TB2`.`id` " .
        "WHERE `TB1`.`id` = :sheetID ";
    //return $sql;

    $stmt = $pdo -> prepare($sql);
    $stmt -> bindValue(':sheetID', $param["id"], PDO::PARAM_INT);

    $stmt -> execute(null);

    //sheetのdateFrom,dateTo
    //packageのcontents
    return $stmt -> fetchAll(PDO::FETCH_CLASS);
}

?>