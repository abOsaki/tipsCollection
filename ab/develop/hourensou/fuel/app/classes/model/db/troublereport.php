<?php
//namespace Model;

use Fuel\Core\Model_Crud;

class Model_Db_Troublereport extends  Model_Crud {
    protected static $_table_name = 'troubleReport';
    protected static $_primary_key = 'id';


    /**
     * demand読み込み
     *
     *
     * @param unknown $dataArray
     */
    public function loadDemand($fDate, $eDate, $userid) {

        $sqlSelect = "SELECT ";
        $sqlSelect .= "`troubleReport`.`date`, ";
        $sqlSelect .= "`schoolE`.`name` AS `schoolE`, ";
        $sqlSelect .= "`schoolH`.`name` AS `schoolH`, ";
        $sqlSelect .= "`title`.`name` AS `title`, ";
        $sqlSelect .= "`trouble`.`name` AS `trouble`, ";
        $sqlSelect .= "`equipment`.`name` AS `equipment`, ";
        $sqlSelect .= "`application`.`name` AS `application`, ";
        $sqlSelect .= "`status`.`name` AS `status`, ";
        $sqlSelect .= "`troubleReport`.`souceName`, ";
        $sqlSelect .= "`troubleReport`.`memo`, ";
        $sqlSelect .= "`troubleReport`.`check`, ";
        $sqlSelect .= "`troubleReport`.`comment`,";
        $sqlSelect .= "`troubleReport`.`sendtype`";
        $sqlFrom = "FROM `troubleReport`";
        $sqlJoin = "LEFT JOIN `schoolE` ON `troubleReport`.`schoolE` = `schoolE`.`id`";
        $sqlJoin .= "LEFT JOIN `schoolH` ON `troubleReport`.`schoolH` = `schoolH`.`id`";
        $sqlJoin .= " LEFT JOIN `title` ON `troubleReport`.`title` = `title`.`id`";
        $sqlJoin .= " LEFT JOIN `trouble` ON `troubleReport`.`trouble` = `trouble`.`id`";
        $sqlJoin .= " LEFT JOIN `equipment` ON `troubleReport`.`equipment` = `equipment`.`id`";
        $sqlJoin .= " LEFT JOIN `application` ON `troubleReport`.`application` = `application`.`id`";
        $sqlJoin .= " LEFT JOIN `status` ON `troubleReport`.`status` = `status`.`id`";
        $sqlWhere = "WHERE (`user` = '{$userid}' or `sendtype`=2) AND `date` >= '{$fDate}' AND `date` <= '{$eDate}'";

        $sql = "{$sqlSelect} {$sqlFrom} {$sqlJoin} {$sqlWhere} ORDER BY date DESC";
        $query = DB::query($sql);
Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $query:' . print_r($query, true));
        $result = $query->execute()->as_array();

        return $result;
    }

    /**
     * demand事務局コメントとチェック済みフラグの更新
     *
     * @param unknown $dataArray
     */
    public function checkDemand($dataArray) {
        $sqlUpdate = "UPDATE `troubleReport`";
        if(isset($dataArray["comment"]) && isset($dataArray["sendtype"])) {
            $sqlSet = "SET `comment` = '{$dataArray["comment"]}', `sendtype` = '{$dataArray["sendtype"]}'";
        } else if (isset($dataArray["check"])) {
            $sqlSet = "SET `check` = '{$dataArray["check"]}'";
        } else {
            return;
        }
        $sqlWhere = "WHERE `id` = '{$dataArray["id"]}'";

        $sql = "{$sqlUpdate} {$sqlSet} {$sqlWhere}";
//Log::info('$sql:' . $sql);

        $query = DB::query($sql);
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $query:' . print_r($query, true));
        $result = $query->execute();
//Log::info('$result:' . print_r($result, true));

        $array = array();
/*
        while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
            $array[] = json_encode($result,JSON_UNESCAPED_UNICODE);
        }
*/

//        $data = json_encode($array,JSON_UNESCAPED_UNICODE);
//        return $data;
        return;
    }

    public function insertDemand($dataArray, $userid) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));
        //insertするフィールド名の配列を用意
        $titleArray = array("user", "date", "group", "schoolE", "schoolH", "title", "trouble", "equipment", "application", "status", "souceName", "memo");
        if(isset($dataArray["id"]) && $dataArray["id"] != ""){
            self::updateDemandData($dataArray);
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
                //文字列で変数を生成し受け取った配列のデータを代入
                //jsonのオプション名はDBのfield名と揃えておく/
                $sqlField .= ", `" . $str . "`";
                $sqlValue .= ", :" . $str;
            }
        }
        $sql = "INSERT INTO `troubleReport` (" . $sqlField . ") VALUES (" . $sqlValue . ")";
//Log::info('$sql:' . $sql);

        $query = DB::query($sql);
        $query->bind('user', $userid);
        //パラメータ設定
        foreach ($titleArray as $value) {
            if (isset($dataArray[$value])) {
                $query->bind($value, $dataArray[$value]);
            }
        }
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $query:' . print_r($query, true));

        $result = $query->execute();
//Log::info('$result:' . print_r($result, true));

    }

    //demand上書き保存
    private function updateDemandData($dataArray) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));
        //updateするフィールド名の配列を用意
        $titleArray = array("date", "group", "schoolE", "schoolH", "title", "trouble", "equipment", "application", "status", "souceName", "memo");

        //文字列の最初はカンマが入らないので先に代入する
        $sqlSet = "SET `{$titleArray[0]}` = :{$titleArray[0]}";
        //${$titleArray[0]} = $dataArray[$titleArray[0]];
        //必要なSQL文を生成
        foreach ($titleArray as $str){
            if ($str != $titleArray[0]) {
                //文字列で変数を生成し受け取った配列のデータを代入
                //jsonのオプション名はDBのfield名と揃えておく/
                $sqlSet .= ", `{$str}` = :{$str}";
            }
            //echo "{$str} : ${$str} ;\n";
        }
        $sqlUpdate = "UPDATE `troubleReport`";
        $sqlWhere = "WHERE `id` = '{$dataArray["id"]}'";
        $sql = "{$sqlUpdate} {$sqlSet} {$sqlWhere}";

//Log::info('$sql:' . $sql);

        $query = DB::query($sql);

        //パラメータ設定
        foreach ($titleArray as $value) {
            if (isset($dataArray[$value])) {
                $query->bind($value, $dataArray[$value]);
            }
        }
        $result = $query->execute();

        return;
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
    public function loadListDemand($dataOrderType, $fDate, $eDate, $order, $selectAuth, $userid) {
        $sqlSelect = "";
        $sqlPlus = "";

        $columnList = array(
                "date",             "user",        "schoolE",         "schoolH",      "title",
                "trouble",          "equipment",   "application",     "status",       "souceName",
                "memo",             "check",       "comment",         "sendtype"
        );
        $tableName = "troubleReport";
        $sqlPlus .= ", `{$tableName}`.`id`";

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

        //トラブル要望ソート内容
        if($order == "date") {
            $sqlOrder .= "`date` {$dataOrderType}, `users`.`id` ASC, `inputDate` DESC";
        } else if($order == "user") {
            $sqlOrder .= "`users`.`id` {$dataOrderType}, `date` DESC, `inputDate` DESC";
        } else if($order == "school") {
            $sqlOrder .= "`{$tableName}`.`schoolE` IS NULL, `{$tableName}`.`schoolE` {$dataOrderType}, `{$tableName}`.`schoolH` IS NULL, `{$tableName}`.`schoolH` {$dataOrderType}, ";
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
