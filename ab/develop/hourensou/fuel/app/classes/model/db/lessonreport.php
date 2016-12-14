<?php
//namespace Model;

use Fuel\Core\Model_Crud;

class Model_Db_Lessonreport extends  Model_Crud {
    protected static $_table_name = 'lessonReport';
    protected static $_primary_key = 'id';

    //ict保存
    public function insertIct($dataArray, $userid) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));
        //insertするフィールド名の配列を用意
        $titleArray = array("user", "date", "group", "schoolE", "schoolH", "lessonTimetable", "lessonLocation", "support", "lesson",
            "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH",
            "purpose1", "purpose2", "purpose3", "purpose4", "purpose5",
            "purpose6", "purpose7", "purpose8", "purpose9", "purpose10",
            "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7",
            "application1", "application2", "application3", "application4", "application5",
            "application6", "application7", "application8", "application9", "application10",
            "application11", "application12", "application13"
        );
        if(isset($dataArray["id"]) && $dataArray["id"] != ""){
            self::updateIctData($dataArray);
            return;
        }

        //文字列の最初はカンマが入らないので先に代入する
        $sqlField = "`" . $titleArray[0] . "`";
        $sqlValue = ":" . $titleArray[0];
        //必要なSQL文を生成
        foreach ($titleArray as $str){
            //null以外を代入
            //idは新規保存のため空になっているので除外
            //userは別指定するので除外
            if (isset($dataArray[$str]) && $str != "user") {
                //jsonのオプション名はDBのfield名と揃えておく/
                $sqlField .= ", `" . $str . "`";
                $sqlValue .= ", :" . $str;
            }
        }
        $sql = "INSERT INTO `lessonReport` (" . $sqlField . ") VALUES (" . $sqlValue . ")";
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $sql:' . $sql);

        $query = DB::query($sql);
        $query->bind('user', $userid);
        //パラメータ設定
        foreach ($titleArray as $value) {
            if (isset($dataArray[$value])) {
                $query->bind($value, $dataArray[$value]);
            }
        }
        $result = $query->execute();
//Log::info('$result:' . print_r($result, true));

    }

    //ict上書き保存
    private function updateIctData($dataArray) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));
        //updateするフィールド名の配列を用意
        $titleArray = array("date", "group", "schoolE", "schoolH", "lessonTimetable", "lessonLocation", "support", "lesson",
            "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH",
            "purpose1", "purpose2", "purpose3", "purpose4", "purpose5", "purpose6", "purpose7", "purpose8", "purpose9", "purpose10",
            "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7",
            "application1", "application2", "application3", "application4", "application5",
            "application6", "application7", "application8", "application9", "application10",
            "application11", "application12", "application13"
        );

        //文字列の最初はカンマが入らないので先に代入する
        $sqlSet = "SET `{$titleArray[0]}` = :{$titleArray[0]}";
        //${$titleArray[0]} = $dataArray[$titleArray[0]];
        //必要なSQL文を生成
        foreach ($titleArray as $str){
            if ($str != $titleArray[0]) {
                //jsonのオプション名はDBのfield名と揃えておく/
                $sqlSet .= ", `{$str}` = :{$str}";
            }
        }
        $sqlUpdate = "UPDATE `lessonReport` ";
        $sqlWhere = "WHERE `id` = '{$dataArray["id"]}'";
        $sql = "{$sqlUpdate} {$sqlSet} {$sqlWhere}";
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $sql:' . $sql);
        $query = DB::query($sql);

        //パラメータ設定
        foreach ($titleArray as $value) {
            if (isset($dataArray[$value])) {
                $query->bind($value, $dataArray[$value]);
            }
        }
        $result = $query->execute();
//Log::info('$result:' . print_r($result, true));

        return;
    }

    public function getIctReportList($fDate, $eDate, $userid) {
        $columnList = array(
            "date", "schoolE", "schoolH", "lessonTimetable", "lessonLocation", "support", "lesson",
            "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH",
            "purpose1", "purpose2", "purpose3", "purpose4", "purpose5",
            "purpose6", "purpose7", "purpose8", "purpose9", "purpose10",
            "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7",
            "application1", "application2", "application3", "application4", "application5",
            "application6", "application7", "application8", "application9", "application10",
            "application11", "application12", "application13" );

        $sql = "SELECT `" . $columnList[0] . "` AS `0`";

        for ( $i = 1; $i < count($columnList); $i++ ) {
            if ( $i <= 50 ) {
                $sql .= ", `" . $columnList[$i] . "`.`name` AS `" . $i . "`";
            } else {
                $sql .= ", `" . $columnList[$i] . "` AS `" .$i . "`";
            }
        }

        $sql .= " FROM `lessonReport` ";
        for ( $i = 1; $i <= 50; $i++ ) {
            $sql .= "LEFT JOIN `" . $columnList[$i] . "` ON `lessonReport`.`" . $columnList[$i] . "` = `" . $columnList[$i] . "`.`id` ";
        }

        $sqlWhere = "WHERE `user` = {$userid} AND `date` >= CAST( '{$fDate}' AS DATE ) AND `date` <= CAST( '{$eDate}' AS DATE )";
        $sql .= $sqlWhere . " ORDER BY `date` DESC, `lessonTimetable` ASC";

        $query = DB::query($sql);
//Log::info('$query:' . print_r($query, true));
        $result = $query->execute()->as_array();

        return $result;
    }

    /**
     *
     * @param unknown $orderType
     * @param unknown $fDate
     * @param unknown $eDate
     * @param unknown $order
     * @param unknown $selectAuth
     * @return string
     */
    public function loadListIct($dataOrderType, $fDate, $eDate, $order, $selectAuth, $userid) {
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' start');
        $sqlSelect = "";
        $sqlPlus = "";

        $columnList = array(
            "date", "user", "schoolE", "schoolH", "lessonTimetable", "lessonLocation",
            "support", "lesson", "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo","unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH"
        );
        $columnCheckList = array(
            "purpose1", "purpose2", "purpose3", "purpose4", "purpose5", "purpose6", "purpose7", "purpose8", "purpose9", "purpose10",
            "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7",
            "application1", "application2", "application3", "application4", "application5", "application6", "application7",
            "application8", "application9", "application10", "application11", "application12", "application13"
        );

        $columnCheckListName = array(
            "作品を作る", "練習する", "調べる", "話し合う", "見比べる", "観察・記録する", "考えをまとめる", "発表する", "見せる", "その他",
            "電子黒板", "教員機", "タブレット", "プロジェクタ", "書画カメラ", "プリンタ", "その他",
            "Active School", "Degital School Note", "Active Web Board", "Power Point", "Word", "Excel", "Internet Explorer",
            "カメラ(写真)", "カメラ(動画)", "ドリル教材", "デジタル教科書", "あなうめ君", "その他"
        );

        $tableName = "lessonReport";

        for ($i = 0; $i < count($columnCheckList); $i++) {
            $sqlPlus .= ", (CASE WHEN `{$columnCheckList[$i]}` IS NULL THEN NULL ELSE '{$columnCheckListName[$i]}' END) AS `{$columnCheckList[$i]}`";
        }

        if($dataOrderType == "A") {
            $dataOrderType = "ASC";
        } else if($dataOrderType == "D") {
            $dataOrderType = "DESC";
        } else {
            $dataOrderType = "";
        }

        //SELECT指定
        $sqlSelect .= "SELECT `{$tableName}`.`date`, `users`.`displayName` AS 'user'{$sqlPlus}";

        //SELECT追加指定
        for ( $i = 2; $i < count($columnList); $i++ ) {
            if($columnList[$i] != "souceName" && $columnList[$i] != "memo" && $columnList[$i] != "comment" && $columnList[$i] != "sendtype") {
                $sqlSelect .= ", `" . $columnList[$i] . "`.`name` AS `" . $columnList[$i] . "`";
            } else {
                $sqlSelect .= ", `{$columnList[$i]}`";
            }
        }

        //LEFT JOIN指定
        $sqlJoin = "FROM `{$tableName}`";
        $sqlJoin .= "LEFT JOIN `users` ON `{$tableName}`.`user` = `users`.`id` ";
        for ( $i = 2; $i < count($columnList); $i++ ) {
            if($columnList[$i] != "souceName" && $columnList[$i] != "memo" && $columnList[$i] != "comment" && $columnList[$i] != "sendtype") {
                $sqlJoin .= "LEFT JOIN `" . $columnList[$i] . "` ON `{$tableName}`.`" . $columnList[$i] . "` = `" . $columnList[$i] . "`.`id` ";
            }
        }

        //ユーザー絞り込み
        if ($selectAuth == "m") {
            // TODO 以下ユーザ絞り込みの条件を確認する。とりあえず、確認用に1を設定して条件を外す。
            //            $selectUser = "(`users`.`id` = '5' OR `users`.`id` = '6' OR `users`.`id` = '7' OR `users`.`id` = '8' OR `users`.`id` = '9' OR `users`.`id` = '11')";
            $selectUser = "1";
        } else {
            $selectUser = "`users`.`id` = '{$userid}'";
        }

        //検索条件
        $sqlWhere = "WHERE ({$selectUser}) AND `date` >= CAST( '{$fDate}' AS DATE ) AND `date` <= CAST( '{$eDate}' AS DATE )";

        //ソート内容
        $sqlOrder = "ORDER BY ";
        //業務・ICT活用ソート内容
        if($order == "date") {
            $sqlOrder .= "`date` {$dataOrderType}, `users`.`id` ASC, `inputDate` DESC";
        } else if($order == "user") {
            $sqlOrder .= "`users`.`id` {$dataOrderType}, `date` DESC, `inputDate` DESC";
        } else if($order == "school") {
            $sqlOrder .= "`{$tableName}`.`schoolE` IS NULL, `{$tableName}`.`schoolE` {$dataOrderType}, `{$tableName}`.`schoolH` IS NULL, `{$tableName}`.`schoolH` {$dataOrderType}, ";
            $sqlOrder .= "`users`.`id` ASC, `date` DESC, `inputDate` DESC";
        }  else if($order == "grade") {
            $sqlOrder .= "`{$tableName}`.`gradeE` IS NULL, `{$tableName}`.`gradeE` {$dataOrderType}, `{$tableName}`.`gradeH` IS NULL, `{$tableName}`.`gradeH` {$dataOrderType}, ";
            $sqlOrder .= "`users`.`id` ASC, `date` DESC, `inputDate` DESC";
        }  else if($order == "curriculum") {
            $sqlOrder .= "`{$tableName}`.`curriculumE` IS NULL, `{$tableName}`.`curriculumE` {$dataOrderType}, `{$tableName}`.`curriculumH` IS NULL, `{$tableName}`.`curriculumH` {$dataOrderType}, ";
            $sqlOrder .= "`users`.`id` ASC, `date` DESC, `inputDate` DESC";
        } else if(isset($order)) {
            $sqlOrder .= "`{$order}`.`id` {$dataOrderType}, `users`.`id` ASC, `date` DESC, `inputDate` DESC";
        } else {
            //上記条件を満たさない場合
            $sqlOrder = "ORDER BY `date` DESC, `users`.`id` ASC, `inputDate` DESC";
        }

        $sql = "{$sqlSelect} {$sqlJoin} {$sqlWhere} {$sqlOrder}";

        $query = DB::query($sql);
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' query:' . print_r($query, true));
        $result = $query->execute()->as_array();

Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' result:' . print_r($result, true));

        return $result;
    }
}
