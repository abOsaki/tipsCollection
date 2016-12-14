<?php
require_once "dbConnect.php";

function questionSearch($refineList) {
    //var_dump($refineList);
    
    $model = new dbConnect();
    $pdo = $model -> connectInfo();

    $tableName = "question";
    //データベース接続情報
    $baseInfo = $model -> baseInfoName();

    //SELECT
    $selectList = array("id", "date", "renewalDate", "title");
    
    //
    //"`question`.`id`, `question`.`date`, `question`.`renewalDate`, `question`.`title` 
    //☆☆☆questionテーブルのidとdateとrenewalDateとtitleを取得
    $sqlSelect = "`{$tableName}`.`" . implode("`, `{$tableName}`.`", $selectList) . "` ";
    
    //共有情報から取得
    
    //group.name = group
    //share.name = share
    //users.displayName = author
    //☆☆☆baseInfoデータベースのgroupテーブルのnameフィールドをgroupと定義（小学校、中学校）
    //☆☆☆baseInfoデータベースのshareテーブルのnameフィールドをgroupと定義（自分のみ、校内共有、区内共有）
    //☆☆☆baseInfoデータベースのusersテーブルのdisplayNameフィールドをauthorと定義（userのdisplayName）
    $sqlSelect .= 
        ", `{$baseInfo}`.`group`.`name` AS 'group'" .
        ", `{$baseInfo}`.`share`.`name` AS 'share'" .
        ", `{$baseInfo}`.`users`.`displayName` AS 'author'";
    
    //CASE
    //分岐個所
    $sqlCase = "";
    //questionテーブルのグループに応じて、小学校又は、中学校の名前をschoolに代入する
    //☆☆☆questionテーブルのグループに応じて、小学校、中学校の名前をschoolに代入する(学校名が入る)
    $sqlCase .=
        ", " .
        //questionテーブルのgroupによる分岐
        "CASE `{$tableName}`.`group` " .
        //1の場合はschoolEテーブルのname
        "WHEN '1' THEN `{$baseInfo}`.`schoolE`.`name` " .
        //2の場合はschoolHテーブルのname
        "WHEN '2' THEN `{$baseInfo}`.`schoolH`.`name` " .
        "ELSE '' " .
        "END AS 'school'";
    //☆☆☆questionテーブルのグループに応じて、学年のnameがgradeに入る（～年が入る）
    $sqlCase .=
        ", " .
        "CASE `{$tableName}`.`group` " .
        "WHEN '1' THEN `{$baseInfo}`.`gradeE`.`name` " .
        "WHEN '2' THEN `{$baseInfo}`.`gradeH`.`name` " .
        "ELSE '' " .
        "END AS 'grade' ";
    //☆☆☆questionテーブルのグループに応じて、カリキュラムのnameがcurriculumに入る
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
    //☆☆☆baseInfo.usersのジョイン  question.author(id) = users.id(id)
    $sqlJoin = "LEFT JOIN `{$baseInfo}`.`users` ON `{$tableName}`.`author` = `{$baseInfo}`.`users`.`id`";
    
    //☆☆☆group,schoolE,schoolH,gradeE,gradeH,curriculumE,curriculumH,shareテーブルをジョイン
    //☆☆☆questionの各カラムにある値=id
    $joinList = ["group", "schoolE", "schoolH", "gradeE", "gradeH", "curriculumE", "curriculumH", "share"];
    foreach($joinList as $value) {
        if (isset($sqlJoin)) {
            $sqlJoin .= " ";
        }
        //☆☆☆
        $sqlJoin .= "LEFT JOIN `{$baseInfo}`.`{$value}` ON `{$tableName}`.`{$value}` = `{$baseInfo}`.`{$value}`.`id`";
    }
    
    //単元-リストは各DBテーブルのidとkey番号をそろえる
    //学校種別リスト
    $groupList = ["", "E", "H"];
    //小学学年リスト
    $gradeEList = ["", "1", "2", "3", "4", "5", "6"];
    //中学学年リスト
    //$gradeHList = ["", "1", "2", "3"];
    $gradeHList = ["", "1", "2", "3","All"];
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
    //☆☆☆baseInfoにある全てのunitから始まるテーブルを取得
    $stmt = $pdo -> prepare("SHOW TABLES FROM `{$baseInfo}` LIKE 'unit%'");
    $stmt -> execute(null);
    $unitTableList = array();
    foreach($stmt as $value) {
        $unitTableList[] = $value[0];
    }
    
    //var_dump($unitTableList);die;
    
    //単元セレクト
    //☆☆☆unitテーブルのnameをunitと定義
    $sqlSelect .= ", `unit`.`name` AS `unit`";
    
    $unitSelect =
        "SELECT @num := @num + 1 AS 'id', `unitSelect`.`unitNum`, `unitSelect`.`name`, `unitSelect`.`group`, `unitSelect`.`grade`, `unitSelect`.`curriculum`" .
        "FROM (SELECT @num := -1) AS `dmy`, " .
        //☆☆☆baseInfoのunitテーブルのidをunitNum,nameはそのまま取得,groupを0として取得,gradeを0として取得,curriculumを0として取得
        "(SELECT `id` AS `unitNum`, `name`, '0' AS 'group', '0' AS 'grade', '0' AS 'curriculum' FROM `{$baseInfo}`.`unit`";
    
    //☆☆☆小学校、中学校
    foreach($groupList as $key1 => $value1) {
        //groupをもとに学年リストを切り替え
        //☆☆☆学年リスト（2次元配列）
        foreach((array)$gradeList[$value1] as $key2 => $value2) {
            //groupをもとに教科リストを切り替え
            //☆☆☆教科リスト
            foreach((array)$curriculumList[$value1] as $key3 => $value3) {
                //☆☆☆小中学、学年、教科リストがセットされていて、baseInfoのunitから始まるテーブルに存在する場合
                if (!empty($key1) && !empty($key2) && !empty($key3) && in_array("unit{$value1}{$value2}{$value3}", $unitTableList)) {
                    //☆☆☆unitの該当テーブルから
                    $unitSelect .= " UNION SELECT `id` AS `unitNum`, `name`, '{$key1}' AS 'group', '{$key2}' AS 'grade', '{$key3}' AS 'curriculum' FROM `{$baseInfo}`.`unit{$value1}{$value2}{$value3}`";
                } else {
                    continue;
                }
            }
        }
    }
    $unitSelect .= ") AS `unitSelect`";
    //return $unitSelect;
    
    //☆☆☆unitとquestionの連結
    $sqlJoin .= 
        "LEFT JOIN ({$unitSelect}) AS `unit` ON `unit`.`group` = `{$tableName}`.`group`" .
        "AND (`unit`.`grade` = `{$tableName}`.`gradeE` OR `unit`.`grade` = `{$tableName}`.`gradeH`)" .
        "AND (`unit`.`curriculum` = `{$tableName}`.`curriculumE` OR `unit`.`curriculum` = `{$tableName}`.`curriculumH`)" .
        "AND `unit`.`unitNum` in (`{$tableName}`.`" . implode("`, `{$tableName}`.`", $unitTableList) . "`)" .
        "OR (`unit`.`id` = `{$tableName}`.`unit`)";
    
    //WHERE
    //☆☆☆実行すべきwhere文
    //①自分で作ったもの
    //②選んである学校と一致し、shareが２になっているもの（校内共有）
    //③選んである小中学校のフラグと一致し、shareが３になっているもの（区内共有）
    
    $sqlWhere = "";
    
    //検索ワードの学校種別設定
    if ($refineList["group"] == 1) {
        $code = "E";
    } else if ($refineList["group"] == 2) {
        $code = "H";
    } else {
        $code = null;
    }
    //検索ワード
    foreach($refineList as $key => $value) {
        if ($sqlWhere != "") {
            $sqlWhere .= " AND ";
        }
        
        if ($key == "group") {
            $sqlWhere .= "`{$tableName}`.`{$key}` = '{$value}'";
        } else if ($key == "title") {
            $sqlWhere .= "`{$tableName}`.`{$key}` LIKE '%{$value}%'";
        } else if ($key == "unit") {
            if (!empty($code) && !empty($refineList["grade"]) && !empty($refineList["curriculum"])) {
                if (in_array("unit{$code}{$gradeList[$code][$refineList["grade"]]}{$curriculumList[$code][$refineList["curriculum"]]}", $unitTableList)) {
                    $unitTitle = "unit{$code}{$gradeList[$code][$refineList["grade"]]}{$curriculumList[$code][$refineList["curriculum"]]}";
                    $sqlWhere .= "`{$tableName}`.`{$unitTitle}` = '{$value}'";
                } else {
                    $sqlWhere .= "`{$tableName}`.`unit` = '{$value}'";
                }
            } else {
                $sqlWhere .= "`{$tableName}`.`unit` = '0'";
            }
        } else {
            //学校種別切り替え
            if (!empty($code)) {
                $sqlWhere .= "`{$tableName}`.`{$key}{$code}` = '{$value}'";
            }
        }
    }

    //ログイン情報により条件設定
    session_start();
    if ($_SESSION["GROUP"] == 1) {
        $code = "E";
    } else if ($_SESSION["GROUP"] == 2) {
        $code = "H";
    } else {
        $code = null;
    }
    
    
    
    //権限ごとに振り分け
    if ($sqlWhere != "") {
        $sqlWhere .= " AND ";
    }
    $sqlWhere .= "(";
    if ($_SESSION["ANAUME"] == 1) {
        //管理者・委員会
        $sqlWhere .=
            //全ユーザー
            "`{$tableName}`.`author` >= '1'";
    } else if ($_SESSION["ANAUME"] == 2) {
        //校長・副校長先生
        $sqlWhere .=
            //自分
            "`{$tableName}`.`author` = '{$_SESSION["USERID"]}' " .
            //同じ学校
            "OR (`{$tableName}`.`school{$code}` = '{$_SESSION["SCHOOL"]}')";
    } else if ($_SESSION["ANAUME"] == 3) {
        //グループが０である
        if ($_SESSION["GROUP"] == 0) {
            //支援員用
            $sqlWhere .=
                //自分
                "`{$tableName}`.`author` = '{$_SESSION["USERID"]}' " .
                //同じ属性+区内共有
                "OR (`{$baseInfo}`.`users`.`group` = '0' AND `share` = '3') ";
        } else {
            //先生・その他
            $sqlWhere .=
                //自分
                "`{$tableName}`.`author` = '{$_SESSION["USERID"]}' " .
                //同じ学校and担任のクラス
                //"OR (`{$tableName}`.`school{$code}` = '{$_SESSION["SCHOOL"]}' AND `{$baseInfo}`.`users`.`grade{$code}` = '{$_SESSION["GRADE"]}' AND `{$baseInfo}`.`users`.`class{$code}` = '{$_SESSION["CLASS"]}') " .
                //教材の学年が自分の所属と同一
                //"OR (`{$tableName}`.`school{$code}` = '{$_SESSION["SCHOOL"]}' AND `{$tableName}`.`grade{$code}` = '{$_SESSION["GRADE"]}') " .
                //校内共有
                "OR (`{$tableName}`.`school{$code}` = '{$_SESSION["SCHOOL"]}' AND `share` = '2') " .
                //区内共有
                "OR (`{$tableName}`.`group` = '{$_SESSION["GROUP"]}' AND `share` = '3') ";
        }
        
        
    } else {
        
        //権限無しはfasleを返す
        return false;
    }
    $sqlWhere .= ") ";
    
    //ORDER
    $sqlOrder = "`renewalDate` DESC";
    //SQL
    $sql = "SELECT {$sqlSelect} FROM {$sqlFrom} {$sqlJoin} WHERE {$sqlWhere} ORDER BY {$sqlOrder}";
    //return $sql;
    
    
    
    //発行
    $stmt = $pdo -> prepare($sql);
    $flag = $stmt -> execute(null);
    //var_dump($sql);die;

    $array = array();
    while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        $array[] = json_encode($result);
    }
    $data = $array;
    //var_dump($data);

    return $data;
}

//js側からのデータ
$data = file_get_contents("php://input");
//var_dump($data);
$dataArray = json_decode($data, true);

//js側へ
echo json_encode(questionSearch($dataArray));

?>