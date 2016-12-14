<?php
require_once "dbConnect.php";

function workbook($refineList) {
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    $tableName = "question";
    $baseInfo = $model -> baseInfoName();

    //SELECT
    $selectList = array("id", "title");
    $sqlSelect = "`{$tableName}`.`" . implode("`, `{$tableName}`.`", $selectList) . "` ";
    //共有情報から取得
    $sqlSelect .= ", `{$baseInfo}`.`group`.`name` AS 'group'";
    
    //CASE
    //分岐個所
    $sqlCase = "";
    $sqlCase .=
        ", " .
        "CASE `{$tableName}`.`group` " .
        "WHEN '1' THEN `{$baseInfo}`.`schoolE`.`name` " .
        "WHEN '2' THEN `{$baseInfo}`.`schoolH`.`name` " .
        "ELSE '' " .
        "END AS 'school'";
    $sqlCase .=
        ", " .
        "CASE `{$tableName}`.`group` " .
        "WHEN '1' THEN `{$baseInfo}`.`gradeE`.`name` " .
        "WHEN '2' THEN `{$baseInfo}`.`gradeH`.`name` " .
        "ELSE '' " .
        "END AS 'grade' ";
    $sqlCase .=
        ", " .
        "CASE `{$tableName}`.`group` " .
        "WHEN '1' THEN `{$baseInfo}`.`curriculumE`.`name` " .
        "WHEN '2' THEN `{$baseInfo}`.`curriculumH`.`name` " .
        "ELSE '' " .
        "END AS 'curriculum' ";
    $sqlSelect .= $sqlCase;
    
    //FROM
    $sqlFrom = "`{$tableName}`";
    
    //JOIN
    $sqlJoin = "";
    $joinList = ["group", "schoolE", "schoolH", "gradeE", "gradeH", "curriculumE", "curriculumH"];
    foreach($joinList as $value) {
        if (isset($sqlJoin)) {
            $sqlJoin .= " ";
        }
        $sqlJoin .= "LEFT JOIN `{$baseInfo}`.`{$value}` ON `{$tableName}`.`{$value}` = `{$baseInfo}`.`{$value}`.`id`";
    }
    
    //単元-リストは各DBテーブルのidとkey番号をそろえる
    //学校種別リスト
    $groupList = ["", "E", "H"];
    //小学学年リスト
    $gradeEList = ["", "1", "2", "3", "4", "5", "6"];
    //中学学年リスト
    $gradeHList = ["", "1", "2", "3"];
    //小学教科リスト
    $curriculumEList = ["", "Kokugo", "Syakai", "Math", "Rika"];
    //中学教科リスト
    $curriculumHList = ["", "Kokugo", "ShakaiG", "ShakaiH", "ShakaiC", "Math", "Rika", "English"];
    
    //学年リスト
    $gradeList = array(
        "E" => $gradeEList,
        "H" => $gradeHList
    );
    //教科リスト
    $curriculumList = array(
        "E" => $curriculumEList,
        "H" => $curriculumHList
    );
    
    //単元テーブルリスト
    $stmt = $pdo -> prepare("SHOW TABLES FROM `{$baseInfo}` LIKE 'unit%'");
    $stmt -> execute(null);
    $unitTableList = array();
    foreach($stmt as $value) {
        $unitTableList[] = $value[0];
    }
    
    //単元セレクト
    $sqlSelect .= ", `unit`.`name` AS `unit`";
    $unitSelect =
        "SELECT @num := @num + 1 AS 'id', `unitSelect`.`unitNum`, `unitSelect`.`name`, `unitSelect`.`group`, `unitSelect`.`grade`, `unitSelect`.`curriculum`" .
        "FROM (SELECT @num := -1) AS `dmy`, " .
        "(SELECT `id` AS `unitNum`, `name`, '0' AS 'group', '0' AS 'grade', '0' AS 'curriculum' FROM `{$baseInfo}`.`unit`";
    
    foreach((array)$groupList as $key1 => $value1) {
        //groupをもとに学年リストを切り替え
        foreach((array)$gradeList[$value1] as $key2 => $value2) {
            //groupをもとに教科リストを切り替え
            foreach((array)$curriculumList[$value1] as $key3 => $value3) {
                if (!empty($key1) && !empty($key2) && !empty($key3) && in_array("unit{$value1}{$value2}{$value3}", $unitTableList)) {
                    $unitSelect .= " UNION SELECT `id` AS `unitNum`, `name`, '{$key1}' AS 'group', '{$key2}' AS 'grade', '{$key3}' AS 'curriculum' FROM `{$baseInfo}`.`unit{$value1}{$value2}{$value3}`";
                } else {
                    continue;
                }
            }
        }
    }
    $unitSelect .= ") AS `unitSelect`";
    //return $unitSelect;
    $sqlJoin .= 
        "LEFT JOIN ({$unitSelect}) AS `unit` ON `unit`.`group` = `{$tableName}`.`group`" .
        "AND (`unit`.`grade` = `{$tableName}`.`gradeE` OR `unit`.`grade` = `{$tableName}`.`gradeH`)" .
        "AND (`unit`.`curriculum` = `{$tableName}`.`curriculumE` OR `unit`.`curriculum` = `{$tableName}`.`curriculumH`)" .
        "AND `unit`.`unitNum` in (`{$tableName}`.`" . implode("`, `{$tableName}`.`", $unitTableList) . "`)" .
        "OR (`unit`.`id` = `{$tableName}`.`unit`)";

    //WHERE
    $sqlWhere = "";

    //WHERE追加
    $sqlWhere .= "`{$tableName}`.`id` in ('" .implode("','", $refineList) . "')";
    
    //order引数の配列順にソート
    $sqlOrder = "CASE `{$tableName}`.`id` ";
    foreach($refineList as $key => $value) {
        $sqlOrder .= "WHEN {$value} THEN {$key} "; 
    }
    $sqlOrder .= "ELSE 0 END";
    
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} {$sqlJoin} WHERE {$sqlWhere} ORDER BY {$sqlOrder};";
    //echo $sql;
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $stmt -> execute(null);

    $array = array();
    while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        $array[] = json_encode($result);
    }
    $data = $array;
    //var_dump($data);
    
    //return $sql;
    return $data;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(workbook($dataArray));

?>