<?php
require_once "../common/php/dbConnect.php";
//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);
$res = "";
if ($req['command'] == 'answerSearch') {
    $res = answerSearch($req);
} else if ($req['command'] == 'userList') {
    $res = userList($req['param']);
} else if ($req['command'] == 'averageData') {
    $res = averageData($req['param']);
} else if ($req['command'] == 'sleapAverage') {
    $res = sleapAverage($req['param']);
}
echo json_encode($res, JSON_UNESCAPED_UNICODE);
//////////////////////////////////////////////function
// パッケージを検索する
function answerSearch($req = null) {
    $res = array();
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model->connectInfo();
    $commonTable = COMMON_TABLE;
    if ($req != null) {
        $tablename = "sheet";
        $datetime = date("Y-m-d H:i:s");
        //$sql = "SELECT * , {$tablename}.id AS sheet_id  FROM `{$tablename}` " . "left outer join package on sheet.package = package.id";
        $sql =
            "SELECT " .
            "sheet.id, sheet.group, sheet.title, sheet.schoolE, sheet.schoolH, sheet.gradeE, sheet.gradeH, sheet.classE, sheet.classH, sheet.share, sheet.package, sheet.stopFlag, sheet.dateFrom, sheet.dateTo, " .
            "package.id, package.date, package.renewalDate, package.author, package.group, package.curriculumE, package.curriculumH, package.purpose, package.title, package.contents, " .
            "{$tablename}.id AS sheet_id " .
            "FROM `{$tablename}` " .
            "LEFT OUTER JOIN package ON sheet.package = package.id ";
        $str = "";
        if (isset($req['param'])) {
            if (is_array($req['param'])) {
                $str.= " where ";
                $end = each($req['param']);
                foreach ($req['param'] as $key => $value) {
                    $str.= " sheet.`{$key}` = ? AND ";
                }
                $str = substr($str, 0, -4);
                $stmt = $pdo->prepare($sql . $str);
                $count = 1;
                foreach ($req['param'] as $key => $value) {
                    $stmt->bindValue($count, $value, PDO::PARAM_INT);
                    $count++;
                }
            } else {
                $stmt = $pdo->prepare($sql);
            }
            $stmt->execute(null);
            $res[$tablename] = $stmt->fetchAll(PDO::FETCH_CLASS);
        }
    }
    
    //子データ取得
    $sql = "SELECT * FROM `question`";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(null);
    $detail = $stmt->fetchAll(PDO::FETCH_CLASS);
    for ($i = 0;$i < count($res[$tablename]);$i++) {
        $list = explode(',', $res[$tablename][$i]->contents);
        $res[$tablename][$i]->child = array();
        for ($j = 0;$j < count($list);$j++) {
            for ($k = 0;$k < count($detail);$k++) {
                if ($list[$j] == $detail[$k]->id) {
                    $res[$tablename][$i]->child[] = $detail[$k];
                }
            }
        }
    }
    
    //answer取得
    //$sql = "SELECT TB1.*,TB2.sex,TB2.number FROM `answer` TB1 left outer join ostk_baseinfo_demo1.users TB2 on TB1.user=TB2.id where TB1.package= ? ";
    $sql = "SELECT TB1.*,TB2.sex,TB2.number, " . "(CASE TB2.group WHEN '1' THEN TB2.gradeE WHEN '2' THEN TB2.gradeH ELSE null END) AS `grade`, " . "(CASE TB2.group WHEN '1' THEN TB2.classE WHEN '2' THEN TB2.classH ELSE null END) AS `class` " . "FROM `answer` TB1 left outer join {$commonTable}.users TB2 on TB1.user=TB2.id" .
        " WHERE " .
        " TB1.package= ? AND ".
        " `TB2`.`schoolE` = ? AND".
        " `TB2`.`schoolH` = ? AND".
        " `TB2`.`gradeE` = ? AND".
        " `TB2`.`gradeH` = ? AND".
        " `TB2`.`classE` = ? AND".
        " `TB2`.`classH` = ? AND".
        " `TB2`.`group` = ? ";
//        " WHERE " .
//        " TB1.package= {$res[$tablename][0]->package} AND ".
//        " `TB2`.`schoolE` = {$res[$tablename][0]->schoolE} AND".
//        " `TB2`.`schoolH` = {$res[$tablename][0]->schoolH} AND".
//        " `TB2`.`gradeE` = {$res[$tablename][0]->gradeE} AND".
//        " `TB2`.`gradeH` = {$res[$tablename][0]->gradeH} AND".
//        " `TB2`.`classE` = {$res[$tablename][0]->classE} AND".
//        " `TB2`.`classH` = {$res[$tablename][0]->classH} AND".
//        " `TB2`.`group` = {$res[$tablename][0]->group} ";
    
    //return $sql;
    $stmt = $pdo->prepare($sql);

    $stmt->bindValue(1, $res[$tablename][0]->package, PDO::PARAM_INT);
    $stmt->bindValue(2, $res[$tablename][0]->schoolE, PDO::PARAM_INT);
    $stmt->bindValue(3, $res[$tablename][0]->schoolH, PDO::PARAM_INT);
    $stmt->bindValue(4, $res[$tablename][0]->gradeE, PDO::PARAM_INT);
    $stmt->bindValue(5, $res[$tablename][0]->gradeH, PDO::PARAM_INT);
    $stmt->bindValue(6, $res[$tablename][0]->classE, PDO::PARAM_INT);
    $stmt->bindValue(7, $res[$tablename][0]->classH, PDO::PARAM_INT);
    $stmt->bindValue(8, $res[$tablename][0]->group, PDO::PARAM_INT);


    $stmt->execute(null);
    $res['answer'] = $stmt->fetchAll(PDO::FETCH_CLASS);


    //ユーザリスト取得
    //先生は除外すること
    $sql = "SELECT id FROM ".$commonTable.".users".
        " WHERE " .
        " `schoolE` = ? AND".
        " `schoolH` = ? AND".
        " `gradeE` = ? AND".
        " `gradeH` = ? AND".
        " `classE` = ? AND".
        " `classH` = ? AND".
        " `group` = ?  AND".
        " `authority` != 't'";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(1, $res[$tablename][0]->schoolE, PDO::PARAM_INT);
    $stmt->bindValue(2, $res[$tablename][0]->schoolH, PDO::PARAM_INT);
    $stmt->bindValue(3, $res[$tablename][0]->gradeE, PDO::PARAM_INT);
    $stmt->bindValue(4, $res[$tablename][0]->gradeH, PDO::PARAM_INT);
    $stmt->bindValue(5, $res[$tablename][0]->classE, PDO::PARAM_INT);
    $stmt->bindValue(6, $res[$tablename][0]->classH, PDO::PARAM_INT);
    $stmt->bindValue(7, $res[$tablename][0]->group, PDO::PARAM_INT);

    $stmt->execute(null);
    $res['student'] = $stmt->fetchAll(PDO::FETCH_CLASS);


    return $res;
}
function userList($param) {
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model->connectInfo();
    $sql = "SELECT `id`, CONCAT(`number`, '番') AS `name`" . "FROM `users` " . "WHERE `id` IN ('" . implode("', '", $param) . "')" . "ORDER BY `number` ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(null);
    return $stmt->fetchAll(PDO::FETCH_CLASS);
}
function averageData($param) {
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model->connectInfo();
    $cT = COMMON_TABLE;
    $quesId = $param["qID"];
    $group = $param["group"];
    if ($group == 1) {
        $code = "E";
    } else if ($group == 2) {
        $code = "H";
    }
    $school = "AND `TB2`.`school{$code}` = '{$param["school"]}'";
    $grade = "AND `TB2`.`grade{$code}` = '{$param["grade"]}'";
    $class = "AND `TB2`.`class{$code}` = '{$param["class"]}'";
    $sex = "AND `TB2`.`sex` = '{$param["sex"]}'";
    $sql = "SELECT " . "'1' AS `avetype`, " . "DATE_FORMAT(`date`, '%m/%d') AS `date`, " . "`question`, " . "CASE " . "WHEN `question` IN (1, 2) " . "THEN TRUNCATE(MOD(AVG((SUBSTRING_INDEX(`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`answerData`, ',', -1) * 60000)) * 0.001 / 60 / 60, 24) + 0.05, 1) " . "ELSE TRUNCATE(AVG(`answerData`) + 0.05, 1) END as `avg` " . "FROM `answer` AS `TB1` " . "LEFT JOIN `".COMMON_TABLE."`.`users` AS `TB2` ON `TB1`.`user` = `TB2`.`id` " . "WHERE `answerData` != '0,0' " . "AND `question` = '{$quesId}' " . "{$school} " . "{$grade} " . "GROUP BY `TB1`.`question`, DATE_FORMAT(`TB1`.`date`, '%Y/%m/%d') " .
    //union2
    "UNION " . "SELECT " . "'2' AS `avetype`," . "DATE_FORMAT(`date`, '%m/%d') AS `date`, " . "`question`, " . "CASE " . "WHEN `question` IN (1, 2) " . "THEN TRUNCATE(MOD(AVG((SUBSTRING_INDEX(`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`answerData`, ',', -1) * 60000)) * 0.001 / 60 / 60, 24) + 0.05, 1) " . "ELSE TRUNCATE(AVG(`answerData`) + 0.05, 1) END as `avg` " . "FROM `answer` AS `TB1` " . "LEFT JOIN `".COMMON_TABLE."`.`users` AS `TB2` ON `TB1`.`user` = `TB2`.`id` " . "WHERE `answerData` != '0,0' " . "AND `question` = '{$quesId}' " . "{$school} " . "{$grade} " . "{$class} " . "GROUP BY `TB1`.`question`, DATE_FORMAT(`TB1`.`date`, '%Y/%m/%d') " .
    //union3
    "UNION " . "SELECT " . "'3' AS `avetype`, " . "DATE_FORMAT(`date`, '%m/%d') AS `date`, " . "`question`, " . "CASE " . "WHEN `question` IN (1, 2) " . "THEN TRUNCATE(MOD(AVG((SUBSTRING_INDEX(`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`answerData`, ',', -1) * 60000)) * 0.001 / 60 / 60, 24) + 0.05, 1) " . "ELSE TRUNCATE(AVG(`answerData`) + 0.05, 1) END as `avg` " . "FROM `answer` AS `TB1` " . "LEFT JOIN `".COMMON_TABLE."`.`users` AS `TB2` ON `TB1`.`user` = `TB2`.`id` " . "WHERE `answerData` != '0,0' " . "AND `question` = '{$quesId}' " . "{$school} " . "{$grade} " . "{$class} " . "{$sex} " . "GROUP BY `TB1`.`question`, DATE_FORMAT(`TB1`.`date`, '%Y/%m/%d') " . "ORDER BY `avetype` DESC, `date` ASC";
    //return $sql;
    $stmt = $pdo->prepare($sql);
    $stmt->execute(null);
    return $stmt->fetchAll(PDO::FETCH_CLASS);
}
function sleapAverage($param) {
    $model = new dbConnect(MASTER_TABLE);
    $pdo = $model->connectInfo();
    $cT = COMMON_TABLE;
    //$quesId = $param["qID"];
    $quesId = 1;
    $group = $param["group"];
    if ($group == 1) {
        $code = "E";
    } else if ($group == 2) {
        $code = "H";
    }
    $school = "AND `TB2`.`school{$code}` = '{$param["school"]}'";
    $grade = "AND `TB2`.`grade{$code}` = '{$param["grade"]}'";
    $class = "AND `TB2`.`class{$code}` = '{$param["class"]}'";
    $sex = "AND `TB2`.`sex` = '{$param["sex"]}'";
    $sql = "SELECT " . "'1' AS `avetype`, " . "DATE_FORMAT(`TB1`.`date`, '%m/%d') AS `date`, " . "`TB1`.`question`, " . "TRUNCATE(MOD( " . "AVG( " . "(SUBSTRING_INDEX(`TB1`.`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`TB1`.`answerData`, ',', -1) * 60000) " . ") * 0.001 / 60 / 60, 24) + 0.05, 1) " . "AS `avg1`, " . "TRUNCATE(MOD( " . "AVG( " . "(SUBSTRING_INDEX(`TB3`.`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`TB3`.`answerData`, ',', -1) * 60000) " . ") * 0.001 / 60 / 60, 24) + 0.05, 1) " . "AS `avg3` " . "FROM `answer` AS `TB1` " . "LEFT JOIN `".COMMON_TABLE."`.`users` AS `TB2` ON `TB1`.`user` = `TB2`.`id` " . "INNER JOIN `answer` AS `TB3` ON `TB1`.`date` = `TB3`.`date` AND '2' = `TB3`.`question` AND '1' = `TB1`.`question` " . "WHERE `TB1`.`answerData` != '0,0' " . "AND `TB1`.`question` = '{$quesId}' " . "{$school} " . "{$grade} " . "GROUP BY `TB1`.`question`, DATE_FORMAT(`TB1`.`date`, '%Y/%m/%d') " . "UNION " . "SELECT " . "'2' AS `avetype`, " . "DATE_FORMAT(`TB1`.`date`, '%m/%d') AS `date`, " . "`TB1`.`question`, " . "TRUNCATE(MOD( " . "AVG( " . "(SUBSTRING_INDEX(`TB1`.`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`TB1`.`answerData`, ',', -1) * 60000) " . ") * 0.001 / 60 / 60, 24) + 0.05, 1) " . "AS `avg1`, " . "TRUNCATE(MOD( " . "AVG( " . "(SUBSTRING_INDEX(`TB3`.`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`TB3`.`answerData`, ',', -1) * 60000) " . ") * 0.001 / 60 / 60, 24) + 0.05, 1) " . "AS `avg3` " . "FROM `answer` AS `TB1` " . "LEFT JOIN `".COMMON_TABLE."`.`users` AS `TB2` ON `TB1`.`user` = `TB2`.`id` " . "INNER JOIN `answer` AS `TB3` ON `TB1`.`date` = `TB3`.`date` AND '2' = `TB3`.`question` AND '1' = `TB1`.`question` " . "WHERE `TB1`.`answerData` != '0,0' " . "AND `TB1`.`question` = '{$quesId}' " . "{$school} " . "{$grade} " . "{$class} " . "GROUP BY `TB1`.`question`, DATE_FORMAT(`TB1`.`date`, '%Y/%m/%d') " . "UNION " . "SELECT " . "'3' AS `avetype`, " . "DATE_FORMAT(`TB1`.`date`, '%m/%d') AS `date`, " . "`TB1`.`question`, " . "TRUNCATE(MOD( " . "AVG( " . "(SUBSTRING_INDEX(`TB1`.`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`TB1`.`answerData`, ',', -1) * 60000) " . ") * 0.001 / 60 / 60, 24) + 0.05, 1) " . "AS `avg1`, " . "TRUNCATE(MOD( " . "AVG( " . "(SUBSTRING_INDEX(`TB3`.`answerData`, ',', 1) * 3600000 + SUBSTRING_INDEX(`TB3`.`answerData`, ',', -1) * 60000) " . ") * 0.001 / 60 / 60, 24) + 0.05, 1) " . "AS `avg3` " . "FROM `answer` AS `TB1` " . "LEFT JOIN `".COMMON_TABLE."`.`users` AS `TB2` ON `TB1`.`user` = `TB2`.`id` " . "INNER JOIN `answer` AS `TB3` ON `TB1`.`date` = `TB3`.`date` AND '2' = `TB3`.`question` AND '1' = `TB1`.`question` " . "WHERE `TB1`.`answerData` != '0,0' " . "AND `TB1`.`question` = '{$quesId}' " . "{$school} " . "{$grade} " . "{$class} " . "{$sex} " . "GROUP BY `TB1`.`question`, DATE_FORMAT(`TB1`.`date`, '%Y/%m/%d') " . "ORDER BY `avetype` DESC, `date` ASC";
    //return $sql;
    $stmt = $pdo->prepare($sql);
    $stmt->execute(null);
    return $stmt->fetchAll(PDO::FETCH_CLASS);
}