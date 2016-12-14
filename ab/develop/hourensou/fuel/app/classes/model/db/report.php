<?php
//namespace Model;

use Fuel\Core\Model_Crud;

class Model_Db_Report extends  Model_Crud {
    protected static $_table_name = 'report';
    protected static $_primary_key = 'id';

    //DBへinsert
    public function insertData($dataArray, $userid) {
        //Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));
        //insertするフィールド名の配列を用意
        $titleArray = array("user", "date", "group", "schoolE", "schoolH", "timetable", "location", "business",
            "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other",
            "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH"
        );
        if(isset($dataArray["id"]) && $dataArray["id"] != ""){
            self::updateData($dataArray);
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
            //Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $str:' . $str);
            //Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' isset($dataArray[' . $str. ']):' . isset($dataArray[$str]));
            if (isset($dataArray[$str]) && $str != "user") {
                //jsonのオプション名はDBのfield名と揃えておく/
                $sqlField .= ", `" . $str . "`";
                $sqlValue .= ", :" . $str;
            }
        }
        $sql = "INSERT INTO `report` (" . $sqlField . ") VALUES (" . $sqlValue . ")";
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
        //Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $result:' . print_r($result, true));

    }


    //report上書き保存
    private function updateData($dataArray) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));
        //updateするフィールド名の配列を用意
        $titleArray = array("date", "group", "schoolE", "schoolH", "timetable", "location", "business",
            "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other",
            "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH"
        );

        //文字列の最初はカンマが入らないので先に代入する
        $sqlSet = "SET `{$titleArray[0]}` = :{$titleArray[0]}";

        //必要なSQL文を生成
        foreach ($titleArray as $str){
            if ($str != $titleArray[0]) {
                //jsonのオプション名はDBのfield名と揃えておく/
                $sqlSet .= ", `{$str}` = :{$str}";
            }
        }

        $sqlUpdate = "UPDATE `report`";
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
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $result:' . print_r($result, true));

        return;
    }


    public function getReportList($fDate, $eDate, $userid) {
        //        $columnList = array( "date", "group", "schoolE", "schoolH", "timetable", "location", "gradeE", "gradeH", "classE", "classH", "business", "preparationOfLesson", "lesson", "lessonAfter", "trouble", "other", "curriculumE", "curriculumH", "unitE1Kokugo", "unitE1Math", "unitE2Kokugo", "unitE2Math", "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai", "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai", "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai", "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai", "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiH", "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiH", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH", "purpose1", "purpose2", "purpose3", "purpose4", "purpose5", "purpose6", "purpose7", "purpose8", "purpose9", "purpose10", "equipment1", "equipment2", "equipment3", "equipment4", "equipment5", "equipment6", "equipment7", "application1", "application2", "application3", "application4", "application5", "application6", "application7", "application8", "application9", "application10", "application11", "application12", "application13" );
        $columnList = array(
            "date", "schoolE", "schoolH", "timetable", "location", "business",
            "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other",
            "gradeE", "gradeH", "classE", "classH", "curriculumE", "curriculumH",
            "unitE1Kokugo", "unitE1Math",
            "unitE2Kokugo", "unitE2Math",
            "unitE3Kokugo", "unitE3Math", "unitE3Rika", "unitE3Syakai",
            "unitE4Kokugo", "unitE4Math", "unitE4Rika", "unitE4Syakai",
            "unitE5Kokugo", "unitE5Math", "unitE5Rika", "unitE5Syakai",
            "unitE6Kokugo", "unitE6Math", "unitE6Rika", "unitE6Syakai",
            "unitH1English", "unitH1Kokugo", "unitH1Math", "unitH1Rika", "unitH1ShakaiG", "unitH1ShakaiH",
            "unitH2English", "unitH2Kokugo", "unitH2Math", "unitH2Rika", "unitH2ShakaiG", "unitH2ShakaiH",
            "unitH3English", "unitH3Kokugo", "unitH3Math", "unitH3Rika", "unitH3ShakaiC", "unitH3ShakaiH");

        $sql = "SELECT `" . $columnList[0] . "` AS `0`";

        for ( $i = 1; $i < count($columnList); $i++ ) {
            if ( $i <= 55 ) {
                $sql .= ", `" . $columnList[$i] . "`.`name` AS `" . $i . "`";
            } else {
                $sql .= ", `" . $columnList[$i] . "` AS `" .$i . "`";
            }
        }

        $sql .= " FROM `report` ";
        for ( $i = 1; $i <= 55; $i++ ) {
            $sql .= "LEFT JOIN `" . $columnList[$i] . "` ON `report`.`" . $columnList[$i] . "` = `" . $columnList[$i] . "`.`id` ";
        }

        $sqlWhere = "WHERE `user` = {$userid} AND `date` >= CAST( '{$fDate}' AS DATE ) AND `date` <= CAST( '{$eDate}' AS DATE )";
        $sql .= $sqlWhere . " ORDER BY `date` DESC, `timetable` ASC";

        $query = DB::query($sql);
        $result = $query->execute()->as_array();

        return $result;
    }

    /**
     *
     * @param unknown $fDate
     * @param unknown $eDate
     * @param unknown $order
     */
    public function loadState($fDate = null, $eDate = null, $order = null) {
        //Log::info("loadState:");
        $sqlSelect = "SELECT DISTINCT ";
        $sqlSelect .= "`calendar`.`date` AS `date`, `calendar`.`dayOfWeek` AS `dayOfWeek`, ";
        $sqlSelect .= "`schoolE`.`name` AS `schoolE`, `schoolH`.`name` AS `schoolH`, ";
        $sqlSelect .= "`users`.`displayName` AS `name`, ";
        $sqlSelect .= "(CASE WHEN `report`.`id` IS NULL THEN 0 ELSE 1 END) AS `reportDone`, ";
        $sqlSelect .= "(CASE WHEN `lessonReport`.`id` IS NULL THEN 0 ELSE 1 END) AS `lReportDone`, ";
        $sqlSelect .= "(CASE WHEN `troubleReport`.`id` IS NULL THEN 0 ELSE 1 END) AS `tReportDone` ";

        $sqlFrom = "FROM `calendar` ";

        $sqlJoin = "CROSS JOIN `users` ";
        $sqlJoin .= "LEFT JOIN ( ";
        $sqlJoin .= "`report` ";
        $sqlJoin .= "LEFT JOIN `lessonReport` ON ( ";
        $sqlJoin .= "`report`.`user` = `lessonReport`.`user` AND `report`.`date` = `lessonReport`.`date` ";
        $sqlJoin .= "AND (`report`.`schoolE` = `lessonReport`.`schoolE` OR `report`.`schoolH` = `lessonReport`.`schoolH`)) ";
        $sqlJoin .= "LEFT JOIN `troubleReport` ON ( ";
        $sqlJoin .= "`report`.`user` = `troubleReport`.`user` AND `report`.`date` = `troubleReport`.`date` ";
        $sqlJoin .= "AND (`report`.`schoolE` = `troubleReport`.`schoolE` OR `report`.`schoolH` = `troubleReport`.`schoolH`)) ";
        $sqlJoin .= "LEFT JOIN `schoolE` ON `report`.`schoolE` = `schoolE`.`id` ";
        $sqlJoin .= "LEFT JOIN `schoolH` ON `report`.`schoolH` = `schoolH`.`id`";
        $sqlJoin .= ") ON (`users`.`id` = `report`.`user` AND `calendar`.`date` = `report`.`date`) ";

        $sqlWhere = "";
        //テストユーザあり
        //$sqlWhere .= "`users`.`id` IN (2, 3, 5, 6, 7, 8, 9, 11, 16) ";
        //テストユーザなし
        //        $sqlWhere .= "`users`.`id` IN (5, 6, 7, 8, 9, 11) ";
        if ($fDate != null) {
            if($sqlWhere != "") {
                $sqlWhere .= "AND ";
            }
            $sqlWhere .= "`calendar`.`date` >= '{$fDate}' ";
        }
        if ($eDate != null) {
            if($sqlWhere != "") {
                $sqlWhere .= "AND ";
            }
            $sqlWhere .= "`calendar`.`date` <= '{$eDate}' ";
        }

        if($sqlWhere != "") {
            $sqlWhere = "WHERE " . $sqlWhere;
        }

        if (isset($order)) {
            if($order == "school") {
                $sqlORDER = "ORDER BY `report`.`schoolE` IS NULL, `report`.`schoolE`, "
                    . "`report`.`schoolH` IS NULL, `report`.`schoolH`, "
                        . "`calendar`.`date` DESC, `users`.`id`";
            }
            else if($order == "user") {
                $sqlORDER = "ORDER BY `users`.`id`, `calendar`.`date` DESC, "
                    . "`report`.`schoolE` IS NULL, `report`.`schoolE`, "
                        . "`report`.`schoolH` IS NULL, `report`.`schoolH` ";
            } else {
                $sqlORDER = "ORDER BY `calendar`.`date` DESC, `users`.`id`, "
                    . "`report`.`schoolE` IS NULL, `report`.`schoolE`, "
                        . "`report`.`schoolH` IS NULL, `report`.`schoolH` ";
            }
        } else {
            $sqlORDER = "ORDER BY `calendar`.`date` DESC, `users`.`id`, "
                . "`report`.`schoolE` IS NULL, `report`.`schoolE`, "
                    . "`report`.`schoolH` IS NULL, `report`.`schoolH` ";
        }

        $sql = "{$sqlSelect} {$sqlFrom} {$sqlJoin} {$sqlWhere} {$sqlORDER}";
        //Log::info("sql:" . print_r($sql, true));

        $query = DB::query($sql);
        $result = $query->execute()->as_array();

        //Log::info("result:" . print_r($result, true));

        return $result;
    }

}