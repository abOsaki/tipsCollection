<?php
require_once "../../../admin/php/dbConnect.php";

//開く
function educationOpen($param) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();
    
    if (!empty($param["q"]) && empty($param["p"])) {
        //questionを指定。package未指定
        $tableName = 'question';
        $commonTable = COMMON_TABLE;
        $result = array();
        
        //設問を取得
        $sql =
            "SELECT `TB1`.`id`, `TB1`.`title`,`TB1`.`textContents`,`TB1`.`imageContents`,`TB1`.`fusen`,`TB1`.`textStyle`, `TB2`.`name` AS `school`, `TB3`.`name` AS `category`, `TB4`.`name` AS `grade`, `TB5`.`name` AS `curriculum`, `TB6`.`name` AS `unit`,`TB7`.`displayName` AS `author` " .
            "FROM `{$tableName}` AS `TB1` " .
            "LEFT JOIN `{$commonTable}`.`m_school` AS `TB2` ON `TB1`.`m_school_id` = `TB2`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_category` AS `TB3` ON `TB2`.`m_category_id` = `TB3`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_grade` AS `TB4` ON `TB1`.`m_grade_id` = `TB4`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_curriculum` AS `TB5` ON `TB1`.`m_curriculum_id` = `TB5`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_unit` AS `TB6` ON `TB1`.`m_unit_id` = `TB6`.`id` " .
            "LEFT JOIN `{$commonTable}`.`t_user` AS `TB7` ON `TB1`.`author` = `TB7`.`id` " .
            "WHERE `TB1`.`id` in ({$param["q"]}) ";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $tmp = $stmt -> fetchAll(PDO::FETCH_CLASS);
        foreach($tmp as $t){
            foreach ($t as $key => $value){
                if ($key == "textContents" || $key == "imageContents" || $key == "fusen" || $key == "textStyle"){
                    $result["pages"][0]["$key"] = $value;
                }else if($key == "id"){
                    $result["pages"][0]["$key"] = $value;
                    $result["info"]["contents"] = $value;
                    $result["info"]["$key"] = $value;
                }else{
                    $result["info"]["$key"] = $value;
                }
            }
        }
        return $result;
        
    } else if (empty($param["q"]) && !empty($param["p"])) {
        //question未指定。packageを指定
        
        $tableName = 'package';
        $commonTable = COMMON_TABLE;
        $result = array();
        
        //問題集使われている設問のIDを取得
        $sql =
            "SELECT `TB1`.`id`, `TB1`.`title`, `TB1`.`contents`,`TB2`.`name` AS `school`, `TB3`.`name` AS `category`, `TB4`.`name` AS `grade`, `TB5`.`name` AS `curriculum`, `TB6`.`name` AS `unit`,`TB7`.`displayName` AS `author` " .
            "FROM `{$tableName}` AS `TB1` " .
            "LEFT JOIN `{$commonTable}`.`m_school` AS `TB2` ON `TB1`.`m_school_id` = `TB2`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_category` AS `TB3` ON `TB2`.`m_category_id` = `TB3`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_grade` AS `TB4` ON `TB1`.`m_grade_id` = `TB4`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_curriculum` AS `TB5` ON `TB1`.`m_curriculum_id` = `TB5`.`id` " .
            "LEFT JOIN `{$commonTable}`.`m_unit` AS `TB6` ON `TB1`.`m_unit_id` = `TB6`.`id` " .
            "LEFT JOIN `{$commonTable}`.`t_user` AS `TB7` ON `TB1`.`author` = `TB7`.`id` " .
            "WHERE `TB1`.`id` in ({$param["p"]}) ";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $packageInfo = $stmt -> fetch(PDO::FETCH_ASSOC);
        foreach($packageInfo as $key => $value){
            $result["info"]["$key"] = $value;
        }
        //設問を取得
        $in_id = preg_replace("{|}", "", $packageInfo["contents"]);
        $tableName = "question";
        $sql =
            "SELECT `TB1`.`id`,`TB1`.`textContents`,`TB1`.`imageContents`,`TB1`.`fusen`,`TB1`.`textStyle`" .
            "FROM `{$tableName}` AS `TB1` " .
            "WHERE `TB1`.`id` in ({$in_id}) "; 
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $contents = $stmt -> fetchAll(PDO::FETCH_CLASS);
        foreach($contents as $value){
            $result["pages"][] = $value;
        }
        return $result;
    }
}

//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);

$res = "";
if ($req["command"] == "educationSave"){
    $res = educationSave($req["param"]);
} else if ($req["command"] == "educationOpen"){
    $res = educationOpen($req["param"]);
} else {
    $res = null;
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>