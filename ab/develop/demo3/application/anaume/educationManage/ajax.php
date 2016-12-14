<?php
require_once "../../../admin/php/dbConnect.php";

//検索
function Search($param,$tablename) {
    $model = new dbConnect(ANAUME_TABLE);
    $pdo = $model -> connectInfo();
    
    $commondb = COMMON_TABLE;
    $maindb = ANAUME_TABLE;
    $sql = "SELECT `{$maindb}`.`{$tablename}`.`id` AS Id," .
        "`{$commondb}`.`m_school`.`m_category_id` AS Category, " . 
        "`{$maindb}`.`{$tablename}`.`m_school_id` AS School, " .
        "`{$maindb}`.`{$tablename}`.`m_grade_id` AS Grade, " .
        "`{$maindb}`.`{$tablename}`.`m_curriculum_id` AS Curriculum, " .
        "`{$commondb}`.`m_unit`.`name` AS Unit, " .
        "`{$maindb}`.`{$tablename}`.`title` AS Title, " .
        "`{$commondb}`.`t_user`.`displayName` AS Auther, " .
        "`{$maindb}`.`{$tablename}`.`m_share_id` AS Share, " .
        "`{$maindb}`.`{$tablename}`.`date` AS Date," .
        "`{$maindb}`.`{$tablename}`.`renewalDate` AS RenewalDate ";
    
    if($tablename == "package"){ //頁数表示用(問題集のみ)
        $sql .= ", `{$maindb}`.`{$tablename}`.`contents` AS Contents ";
    }
    
    $sql .=  "FROM `{$maindb}`.`{$tablename}`";
    $sql .=  "LEFT JOIN `{$commondb}`.`m_school` ON `{$tablename}`.`m_school_id` = `{$commondb}`.`m_school`.`id` ";
    $sql .=  "LEFT JOIN `{$commondb}`.`t_user` ON `{$tablename}`.`author` = `t_user`.`id`";
    $sql .=  "LEFT JOIN `{$commondb}`.`m_unit` ON `{$tablename}`.`m_unit_id` = `m_unit`.`id`";
    $str = "";
    $str .= " where ";
    
    /* 権限絞り込み----------------------------------------------------------------------------------------------------*/
    session_start();
    $roleWhere = "`{$tablename}`.`author` = '{$_SESSION["USERID"]}' ";
    //「教材に紐づいた学校の所属地区」と「ユーザーの所属地区」が同一のもの
    $roleCity = "`{$commondb}`.`m_school`.`m_city_id` = '{$_SESSION["CITY"]}'";
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
                $roleSchoole .= "`{$tablename}`.`m_share_id` = '2' ";
            }
            break;
        case 6:
            //担任
            //「教材に紐づいた共有権限」が「区内共有」のものを追加
            $roleCity .= " AND `m_share_id` = '3' ";
            //「教材に紐づいた学校」と「ユーザーの所属学校」が同一であり「教材に紐づいた共有権限」が「校内共有」のものを追加
            $roleSchoole .= "`{$tablename}`.`m_school_id` = '{$_SESSION["SCHOOL"]}' AND `{$tablename}`.`m_share_id` = '2' ";
            break;
        case 7:
            //専科
            //「教材に紐づいた共有権限」が「区内共有」のもの
            $roleCity .= " AND `m_share_id` = '3' ";
            //「教材に紐づいた学校」と「ユーザーの所属学校」が同一であり「教材に紐づいた共有権限」が「校内共有」のものを追加
            $roleSchoole .= "`{$tablename}`.`m_school_id` = '{$_SESSION["SCHOOL"]}' AND `{$tablename}`.`m_share_id` = '2' ";
            break;
        case 8:
            //デモ（企業） <- 支援員と一緒にしている
            //「教材に紐づいた学校の所属地区」と「ユーザーの所属地区」
            $roleCity .= " AND `m_share_id` = '3' ";
            if ((int)$param["school"] > 0) {
                //学校に無所属のため学校リストから選択することになる
                //学校リスト選択時のみ「教材に紐づいた共有権限」が「校内共有」のものを追加
                $roleSchoole .= "`{$tablename}`.`m_share_id` = '2' ";
            }
            break;
        case 9:
            //その他（学校） <- 担任・専科と一緒にしている
            //「教材に紐づいた共有権限」が「区内共有」のものを追加
            $roleCity .= " AND `m_share_id` = '3' ";
            //「教材に紐づいた学校」と「ユーザーの所属学校」が同一であり「教材に紐づいた共有権限」が「校内共有」のものを追加
            $roleSchoole .= "`{$tablename}`.`m_school_id` = '{$_SESSION["SCHOOL"]}' AND `{$tablename}`.`m_share_id` = '2' ";
            break;
    }
    if (!empty($roleCity)) {
        $roleCity = "OR ($roleCity) ";
    }
    if (!empty($roleSchoole)) {
        $roleSchoole = "OR ($roleSchoole) ";
    }
    $roleWhere .= "{$roleCity} {$roleSchoole} ";
    $str .=  "({$roleWhere}) AND ";
    //return $sql;
    
    /*--------------------------------------------------------------------------------------------------------------*/

    foreach ($param as $key => $value) {
        if($value == null || $value == "") continue; 
        if($key == 'category'){
            $str .=  "`{$commondb}`.`m_school`.`m_category_id` = :category AND ";
        }else if($key == 'school'){
            $str .=  "`{$maindb}`.`{$tablename}`.`m_school_id` = :school AND ";
        }else if($key == 'grade'){
            $str .=  "`{$maindb}`.`{$tablename}`.`m_grade_id` = :grade AND ";
        }else if($key == 'curriculum'){
            $str .=  "`{$maindb}`.`{$tablename}`.`m_curriculum_id` = :curriculum AND ";
        }else if($key == 'unit'){
            $str .=  "`{$maindb}`.`{$tablename}`.`m_unit_id` = :unit AND ";
        }else if($key == 'title'){
            $str .= " `{$key}` LIKE :title AND ";
        }
    }

    //後ろのAND消し
    if(mb_substr($str, -4) == "AND "){
        $str = substr($str, 0, -4);
    }
    //後ろのwhere消し
    if(mb_substr($str, -6) == "where "){
        $str = substr($str, 0, -6);
    }
    $sql .= $str;
    $stmt = $pdo -> prepare($sql);

    foreach ($param as $key => $value) { //sqlインジェクション対策
        if($value == null || $value == "") continue; 
        if($key == 'category'){
            $stmt->bindValue(':category', $value, PDO::PARAM_INT);
        }else if($key == 'school'){
            $stmt->bindValue(':school', $value, PDO::PARAM_INT);
        }else if($key == 'grade'){
            $stmt->bindValue(':grade', $value, PDO::PARAM_INT);
        }else if($key == 'curriculum'){
            $stmt->bindValue(':curriculum', $value, PDO::PARAM_INT);
        }else if($key == 'unit'){
            $stmt->bindValue(':unit', $value, PDO::PARAM_INT);
        }else if($key == 'title'){
            $stmt->bindValue(':title', "%{$value}%", PDO::PARAM_STR);
        }
    }

    $stmt -> execute(null);
    return $stmt -> fetchAll(PDO::FETCH_CLASS);

}



//js側からのデータ
$data = file_get_contents("php://input");
$req = json_decode($data, true);

$res = "";
//選択によって参照するデータベース変更
if ($req["command"] == "packageSearch"){ 
    $tablename = "package";
    $res = Search($req["param"],$tablename);
}else if($req["command"] == "questionSearch"){
    $tablename = "question";
    $res = Search($req["param"],$tablename);
}else{
    $res = null;
}

//js側へ
echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>