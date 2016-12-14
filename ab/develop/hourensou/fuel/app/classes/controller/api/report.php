<?php
/**
 * 管理者用の報告情報を扱うコントローラ
 *
 */
class Controller_Api_Report extends Controller_Baserest {

    protected $authFlag = true;    // 認証フラグ

    /**
     * 報告情報を取得する。
     *
     * {
     *      fDate   [required]: [開始日時 YYYY-MM-DD],
     *      eDate   [required]: [終了日時 YYYY-MM-DD],
     *      order   [optional]: [ソート school user]
     * }
     *
     * @return object
     */
    public function action_get_loadstate() {
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('orderType', 'orderType')
                   ->add_rule('valid_string', 'alpha');
        $validation->add('order', 'order')
                   ->add_rule('valid_string', 'alpha');

        if (!$validation->run($inputjson)) {
           $data_array = array('code' => 403, 'message' => 'Forbidden');
           return $this->response($data_array, 403);
        }

        $fDate = null;
        $eDate = null;
        $order = null;
        if (isset($inputjson['fDate'])) {
            $fDate = $inputjson['fDate'];
        }
        if (isset($inputjson['eDate'])) {
            $eDate = $inputjson['eDate'];
        }
        if (isset($inputjson['order'])) {
            $order = $inputjson['order'];
        }

        $modelDbReport = new Model_Db_Report();
        $result = $modelDbReport->loadState($fDate, $eDate, $order);

        $response_json = $result;
//Log::info('response_json:' . print_r($response_json, true));

//Log::info('count(response):' . count($response_json));

        return $this->response($response_json);
    }

/*
    public function action_get_name_list() {
//Log::info('action_get_name_list');
        $inputjson = Input::json();
//Log::info('json:' . print_r($inputjson, true));

        $response_json = array();

        return $this->response($response_json);
    }
*/

    /**
     * 「ICT活用授業報告一覧」情報を取得する。
     *
     * {
     *      fDate       [required]: [開始日時 YYYY-MM-DD],
     *      eDate       [required]: [終了日時 YYYY-MM-DD],
     *      tableName いらない
     *      orderType   [optional]: [昇順降順指定 A D](未使用？)
     *      order       [optional]: [ソート school user support lesson grade curriculum]
     * }
     *
     * @return object
     */
    public function action_load_list_ict() {
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('orderType', 'orderType')
                   ->add_rule('valid_string', 'alpha');
        $validation->add('order', 'order')
                   ->add_rule('valid_string', 'alpha');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

//        $tableName = $inputjson['tableName'];
        $orderType = null;
        if (isset($inputjson['orderType'])) {
            $orderType = $inputjson['orderType'];

        }
        $fDate = $inputjson['fDate'];
        $eDate = $inputjson['eDate'];
        $order = null;
        if (isset($inputjson['orderType'])) {
            $order = $inputjson['order'];
        }

        $userid = $this->user->id;

//        $authority = Session::get('AUTHORITY');
        $authority = $this->user->authority;
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $authority:' . $authority);

        $modelDbLessonreport = new Model_Db_Lessonreport();
        $result = $modelDbLessonreport->loadListIct($orderType, $fDate, $eDate, $order, $authority, $userid);

        $response_json = $result;
//Log::info('response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }

    /**
     * 「要望・トラブル等一覧」情報を取得する。
     *
     * {
     *      fDate       [required]: [開始日時 YYYY-MM-DD],
     *      eDate       [required]: [終了日時 YYYY-MM-DD],
     *      tableName いらない
     *      orderType   [optional]: [昇順降順指定 A D](未使用？)
     *      order       [optional]: [ソート school user title trouble status]
     * }
     *
     * @return object
     */
    public function action_load_list_demand() {
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('orderType', 'orderType')
                   ->add_rule('valid_string', 'alpha');
        $validation->add('order', 'order')
                   ->add_rule('valid_string', 'alpha');

//        $tableName = $inputjson['tableName'];
        $orderType = null;
        if (isset($inputjson['orderType'])) {
            $orderType = $inputjson['orderType'];

        }
        $fDate = $inputjson['fDate'];
        $eDate = $inputjson['eDate'];
        $order = null;
        if (isset($inputjson['orderType'])) {
            $order = $inputjson['order'];
        }

        $userid = $this->user->id;

//        $authority = Session::get('AUTHORITY');
        $authority = $this->user->authority;
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $authority:' . $authority);

        $modelDbTroublereport = new Model_Db_Troublereport();
        $result = $modelDbTroublereport->loadListDemand($orderType, $fDate, $eDate, $order, $authority, $userid);

        $response_json = $result;
        //Log::info('response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }

/*
    public function action_load_list_manage() {
//Log::info('action_load_list_manage');
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $tableName = $inputjson['tableName'];
        $orderType = null;
        if (isset($inputjson['orderType'])) {
            $orderType = $inputjson['orderType'];

        }
        $fDate = $inputjson['fDate'];
        $eDate = $inputjson['eDate'];
        $order = null;
        if (isset($inputjson['orderType'])) {
            $order = $inputjson['order'];
        }

//        $userid = Session::get('USERID');
        $userid = $this->user->id;

        $authority = Session::get('AUTHORITY');

        $result = self::loadListManage($tableName, $orderType, $fDate, $eDate, $order, $authority, $userid);

        $response_json = $result;
//Log::info('response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }
*/

    public function action_load_manage_graph() {
//Log::info('action_load_manage_graph');
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $userid = $this->user->id;

        $result = self::loadReportManageGraph($inputjson, $userid);

        $response_json = $result;

        return $this->response($response_json);
    }

    public function action_load_manage_graph_ict() {
//Log::info('action_load_manage_graph_ict');
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $result= self::loadReportManageGraphIct($inputjson);
        $response_json = $result;

        return $this->response($response_json);
    }

    public function action_load_manage_graph_trouble() {
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $result= self::loadReportManageGraphTrouble($inputjson);
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $result:' . print_r($result, true));
        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * 「要望・トラブル等報告」情報のチェックを行う。
     * （事務局コメントとチェックフラグの更新）
     *
     * {
     *      id          [required]: [ID numeric],
     *      check       [optional]: [未読:1 既読:2],
     *      sendtype    [optional]: [個人:1 全体:2],
     *      comment     [optional]: [コメント],
     * }
     *
     * @return object
     */
    public function action_check_demand() {
        $inputjson = Input::json();
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('id', 'id')
                   ->add_rule('required')
                   ->add_rule('valid_string', 'numeric');
        $validation->add('check', 'check')
                   ->add_rule('valid_string', 'numeric');
        $validation->add('sendtype', 'sendtype')
                   ->add_rule('valid_string', 'numeric');
//        $validation->add('comment', 'comment')
//                   ->add_rule('valid_string', 'utf8');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $data_array:' . print_r($data_array, true));
            return $this->response($data_array, 403);
        }

        $modelDbTroublereport = new Model_Db_Troublereport();
        $result = $modelDbTroublereport->checkDemand($inputjson);
        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * シフト一覧を取得する。(管理者用)
     *
     * {
     *      fDate   [required]: [開始日時 YYYY-MM-DD],
     *      eDate   [required]: [終了日時 YYYY-MM-DD],
     * }
     *
     * @return object
     */
    public function action_load_workshift_list() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
                    ->add_rule('required')
                    ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
                    ->add_rule('required')
                    ->add_rule('valid_date', 'Y-m-d');

        $validation->add('orderType', 'orderType')
                   ->add_rule('valid_string', 'alpha');
        $validation->add('order', 'order')
                   ->add_rule('valid_string', 'alpha');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $order = null;
        if (isset($inputjson['order'])) {
            $order = $inputjson['order'];
        }
        $modelDbWorkshift = new Model_Db_Workshift();
        $result = $modelDbWorkshift->loadReportWorkshift($inputjson['fDate'], $inputjson['eDate'], $order);
        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * 指定したシフト情報を取得する。
     *
     * @return object
     */
    public function action_get_workshift() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $userid = $this->user->id;

        $modelDbWorkshift = new Model_Db_Workshift();
        $result = $modelDbWorkshift->getWorkshift($inputjson);

        $response_json = $result;
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }


    /**
     * TODO モデル化する。
     *
     * @param unknown $tableName
     * @param unknown $orderType
     * @param unknown $fDate
     * @param unknown $eDate
     * @param unknown $order
     * @param unknown $selectAuth
     * @return string
     */
/*
    private function loadListManage($dataTableName, $dataOrderType, $fDate, $eDate, $order, $selectAuth, $userid) {
        $sqlSelect = "";
        $sqlPlus = "";
        //var_dump($dataArray);

        //業務報告・ICT活用・要望トラブルの分岐
        if($dataTableName == "reportList") {
            $columnList = array(
                "date", "users", "schoolE", "schoolH", "timetable", "location",
                "business", "preparationOfLesson", "lesson", "lessonAfter", "trouble", "maintenance", "other",
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
            $tableName = "report";
            $timeTable = "timetable";
        } else if($dataTableName == "ictList") {
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
            $timeTable = "lessonTimetable";

            for ($i = 0; $i < count($columnCheckList); $i++) {
                $sqlPlus .= ", (CASE WHEN `{$columnCheckList[$i]}` IS NULL THEN NULL ELSE '{$columnCheckListName[$i]}' END) AS `{$columnCheckList[$i]}`";
            }
        } else if($dataTableName == "demandList") {
            $columnList = array(
                "date",             "user",        "schoolE",         "schoolH",      "title",
                "trouble",          "equipment",   "application",     "status",       "souceName",
                "memo",             "check",       "comment",         "sendtype"
            );
            $tableName = "troubleReport";
            $sqlPlus .= ", `{$tableName}`.`id`";
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
        if($tableName == "report" || $tableName == "lessonReport") {
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
        } else if ($tableName == "troubleReport") {
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
        } else {
            $sqlOrder = "ORDER BY `date` DESC, `users`.`id` ASC";
        }

        $sql = "{$sqlSelect} {$sqlJoin} {$sqlWhere} {$sqlOrder}";
        //var_dump($sql);


        $query = DB::query($sql);
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' query:' . print_r($query, true));
        $result = $query->execute()->as_array();

Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' result:' . print_r($result, true));

        return $result;
    }
*/

    /**
     * loadReportManageGraph読み込み
     *
     * TODO モデル化する。
     *
     * @param unknown $dataArray
     * @return string
     */
    private function loadReportManageGraph($dataArray, $userid) {

        $groupByColumn = "`business` ";
        $targetColumn = "`business`, `label` ";
        $subTargetColumn = "`business`, `lj`.`name` AS `label`";
        $subJoin = "LEFT JOIN `business` `lj` ON `report`.`business` = `lj`.id ";
        //$sqlWhere = "WHERE ";

        $terminalFlag = true;

        //絞り込み条件の候補となるフィールド
        $fields = array("group", "user", "schoolE", "schoolH", "gradeE", "gradeH", "classE", "classH",
            "business", "preparationOfLesson");

        //WHERE条件に指定したカラムをセレクトする
        $additionalSelect = "";


        $subSqlWhere = "WHERE ";
        if($dataArray["fDate"] != null) {
            if(!preg_match("/^\d{4}-\d{2}-\d{2}$/" , $dataArray["fDate"])) {
                return json_encode("Invalid request.");
            }
            if($subSqlWhere != "WHERE ") {
                $subSqlWhere .= "AND ";
            }
            $subSqlWhere .= "`date` >= '{$dataArray["fDate"]}' ";
        }
        if($dataArray["eDate"] != null) {
            if(!preg_match("/^\d{4}-\d{2}-\d{2}$/" , $dataArray["eDate"])) {
                return json_encode("Invalid request.");
            }
            if($subSqlWhere != "WHERE ") {
                $subSqlWhere .= "AND ";
            }
            $subSqlWhere .= "`date` <= '{$dataArray["eDate"]}' ";
        }

        foreach($fields as $field) {
            if(isset($dataArray[$field])) {
                if(!preg_match("/^\d+$/" , $dataArray[$field])) {
                    return json_encode("Invalid request.");
                }
                if($subSqlWhere != "WHERE ") {
                    $subSqlWhere .= "AND ";
                }
                $subSqlWhere .= "`{$field}` = '{$dataArray[$field]}' ";
                $additionalSelect .= "`{$field}`, ";
            }
        }

        if(isset($dataArray["business"])) {

            if($dataArray["business"] == 1) {
                $groupByColumn = "`preparationOfLesson` ";
                $targetColumn = "{$groupByColumn}, `label` ";
                $subTargetColumn = "`preparationOfLesson`, `lj`.`name` AS `label`";
                $subJoin = "LEFT JOIN `preparationOfLesson` `lj` ON `report`.`preparationOfLesson` = `lj`.id ";
            }
            else if($dataArray["business"] == 2) {
                // 授業支援
                $groupByColumn = "`lesson` ";
                $targetColumn = "{$groupByColumn}, `label` ";
                $subTargetColumn = "`lesson`, `lj`.`name` AS `label`";
                $subJoin = "LEFT JOIN `lesson` `lj` ON `report`.`lesson` = `lj`.id ";
            }
            else if($dataArray["business"] == 3) {
                // 授業後支援
                $groupByColumn = "`lessonAfter` ";
                $targetColumn = "{$groupByColumn}, `label` ";
                $subTargetColumn = "`lessonAfter`, `lj`.`name` AS `label`";
                $subJoin = "LEFT JOIN `lessonAfter` `lj` ON `report`.`lessonAfter` = `lj`.id ";
            }
            else if($dataArray["business"] == 4) {
                // トラブル対応
                $groupByColumn = "`trouble` ";
                $targetColumn = "{$groupByColumn}, `label` ";
                $subTargetColumn = "`trouble`, `lj`.`name` AS `label`";
                $subJoin = "LEFT JOIN `trouble` `lj` ON `report`.`trouble` = `lj`.id ";
            }
            else if($dataArray["business"] == 5) {
                // 環境整備
                $groupByColumn = "`maintenance` ";
                $targetColumn = "{$groupByColumn}, `label` ";
                $subTargetColumn = "`maintenance`, `lj`.`name` AS `label`";
                $subJoin = "LEFT JOIN `maintenance` `lj` ON `report`.`maintenance` = `lj`.id ";
            }
            else if($dataArray["business"] == 6) {
                // その他
                $groupByColumn = "`other` ";
                $targetColumn = "{$groupByColumn}, `label` ";
                $subTargetColumn = "`other`, `lj`.`name` AS `label`";
                $subJoin = "LEFT JOIN `other` `lj` ON `report`.`other` = `lj`.id ";
            }

        }
        else {

            $terminalFlag = false;
        }

        if($subSqlWhere == "WHERE ") {
            $subSqlWhere = "";
        }


        $timetableSql = "SELECT `id`, `period` FROM `timetable` ORDER BY `id`";

        $query = DB::query($timetableSql);
        $timetableResultArray = $query->execute()->as_array();

        $timetableViewSelect = "";
        $sumUpSelect = "";
        $firstLoop = true;

        foreach ($timetableResultArray as $timetableResult) {
            if($firstLoop) {
                $firstLoop = false;
            }
            else {
                $timetableViewSelect .= ", ";
                $sumUpSelect .= "+ ";
            }
            $timetableViewSelect .= "MAX(CASE timetable WHEN {$timetableResult["id"]} THEN count ELSE 0 END) AS `t{$timetableResult["id"]}` ";

            $sumUpSelect .= "t{$timetableResult["id"]} * {$timetableResult["period"]} ";
        }

        $sqlSelect = "SELECT `date_from`, `date_to`, {$additionalSelect} {$targetColumn}, "
        . "( ({$sumUpSelect}) / 60) AS `hour` ";

        $sqlFrom =
        "FROM ( "
            . "SELECT MIN(`date_from`) AS `date_from`, MAX(`date_to`) AS `date_to`, {$additionalSelect} {$targetColumn}, "
            . "{$timetableViewSelect} "
            . "FROM ( "
                . "SELECT MIN(`date`) AS `date_from`, MAX(`date`) AS `date_to`, "
                    . "{$additionalSelect} {$subTargetColumn}, `timetable`, COUNT(*) AS `count` "
                    . "FROM `report` "
                        . "{$subJoin} "
                        . "{$subSqlWhere} "
                        . "GROUP BY {$groupByColumn}, `timetable` "
                        . ") AS `sub` "
                            . "GROUP BY {$groupByColumn} "
                            . ") AS `sub2` ";


        $viewSql = "{$sqlSelect} {$sqlFrom} ";

        $sql = "SELECT {$groupByColumn}.`id` AS `id`, {$groupByColumn}.`name` AS `label`, "
        . "`date_from`, `date_to`, {$additionalSelect} {$groupByColumn}, "
        //            . "(CASE `label` WHEN NULL THEN {$groupByColumn}.`name` ELSE `label` END) AS `label`, "
        . "(CASE WHEN `hour` IS NULL THEN 0 ELSE `hour` END) AS `hour` "
            . "FROM {$groupByColumn} "
            . "LEFT JOIN ( {$viewSql} ) AS `view` ON ({$groupByColumn}.`id` = `view`.{$groupByColumn}) "
            . "ORDER BY `id`";
//Log::info("sql:" . print_r($sql, true));

        $query = DB::query($sql);
        $result = $query->execute()->as_array();

//Log::info("result:" . print_r($result, true));

        $prop = array(
            //targetのバッククオートを外す
            "target" => substr($groupByColumn, 1, -2),

            //終着点のフラグ
            "flag" => $terminalFlag,

            "sql" => $sql
        );

        $array[] = json_encode($prop);

        foreach ($result as $value) {
            if(isset($value["business"])) {
                $value["drillDown"]["business"] = $value["business"];
            }
            if(isset($value["preparationOfLesson"])) {
                $value["drillDown"]["preparationOfLesson"] = $value["preparationOfLesson"];
            }

            $array[] = $value;
        }

        Log::info("array:" . print_r($array, true));

        return $array;
    }

    /**
     * loadReportManageGraphIct読み込み
     *
     * TODO モデル化する。
     *
     * @param unknown $dataArray
     * @return string
     */
    private function loadReportManageGraphIct($dataArray) {

        //絞り込み条件の候補となるフィールド
        $fields = array("group", "user", "schoolE", "schoolH", "gradeE", "gradeH", "classE", "classH",
            "curriculumE", "curriculumH", "title", "trouble");

        //WHERE条件に指定したカラムをセレクトする
        $additionalSelect = "";

        $subSqlWhere = "WHERE ";
        if($dataArray["fDate"] != null) {
            if(!preg_match("/^\d{4}-\d{2}-\d{2}$/" , $dataArray["fDate"])) {
                return json_encode("Invalid request.");
            }
            if($subSqlWhere != "WHERE ") {
                $subSqlWhere .= "AND ";
            }
            $subSqlWhere .= "`date` >= '{$dataArray["fDate"]}' ";
        }
        if($dataArray["eDate"] != null) {
            if(!preg_match("/^\d{4}-\d{2}-\d{2}$/" , $dataArray["eDate"])) {
                return json_encode("Invalid request.");
            }
            if($subSqlWhere != "WHERE ") {
                $subSqlWhere .= "AND ";
            }
            $subSqlWhere .= "`date` <= '{$dataArray["eDate"]}' ";
        }

        foreach($fields as $field) {
            if(isset($dataArray[$field])) {
                if(!preg_match("/^\d+$/" , $dataArray[$field])) {
                    return json_encode("Invalid request.");
                }
                if($subSqlWhere != "WHERE ") {
                    $subSqlWhere .= "AND ";
                }
                $subSqlWhere .= "`{$field}` = '{$dataArray[$field]}' ";
                $additionalSelect .= "`{$field}`, ";
            }
        }

        if($subSqlWhere == "WHERE ") {
            $subSqlWhere = "";
        }


        $mainTable = "";
        $viewSql = "";
        $joinOn = "";
        $orderBy = "";

        $groupBy = $dataArray["group_by"];

//Log::info("1 additionalSelect:" . $additionalSelect);
        if($groupBy == "grade"
            || $groupBy == "curriculum") {

// TODO カラムが重複している場合は追加しないよう修正
                //$additionalSelect .= "`{$groupBy}E`, `{$groupBy}H`, ";

                if (strpos($additionalSelect, "{$groupBy}E") === false) {
                    $additionalSelect .= "`{$groupBy}E`, ";
                }
                if (strpos($additionalSelect, "{$groupBy}H") === false) {
                    $additionalSelect .= "`{$groupBy}H`, ";
                }
//Log::info("2 additionalSelect:" . $additionalSelect);

                $mainTable =
                "SELECT `{$groupBy}E`.`id` AS `{$groupBy}EId`, NULL AS `{$groupBy}HId`, "
                . "CONCAT('小学校 ', `{$groupBy}E`.`name`) AS `label` "
                . "FROM {$groupBy}E "
                . "UNION "
                    . "SELECT NULL AS `{$groupBy}EId`, `{$groupBy}H`.`id` AS `{$groupBy}HId`, "
                    . "CONCAT('中学校 ', `{$groupBy}H`.`name`) AS `label` "
                    . "FROM {$groupBy}H ";

                    $viewSql =
                    "SELECT MIN(`date`) AS `date_from`, MAX(`date`) AS `date_to`, "
                        . "{$additionalSelect} COUNT(*) AS `count` "
                        . "FROM `lessonReport` "
                            . "{$subSqlWhere} "
                            . "GROUP BY `{$groupBy}E`, `{$groupBy}H` ";

                            $joinOn = "( `main`.`{$groupBy}EId` = `view`.`{$groupBy}E` OR `main`.`{$groupBy}HId` = `view`.`{$groupBy}H` ) ";
                            $orderBy = " `{$groupBy}EId` IS NULL, `{$groupBy}EId`, `{$groupBy}HId` ";

        } else if($groupBy == "purpose"
                || $groupBy == "equipment"
                || $groupBy == "application") {

            if($groupBy == "purpose") {
                $maxi = 10;
            }
            else if($groupBy == "equipment") {
                $maxi = 7;
            }
            else if($groupBy == "application") {
                $maxi = 13;
            }


            $mainTable =
            "SELECT `id` AS `{$groupBy}Id`, `name` AS `label` "
            . "FROM {$groupBy} ";


            for($i = 1; $i <= $maxi; $i++) {

                if($i != 1) {
                    $viewSql .= "UNION ";
                }

                $viewSql .=
                "SELECT {$i} AS {$groupBy}, MIN(`date`) AS `date_from`, MAX(`date`) AS `date_to`, "
                . "{$additionalSelect} SUM(`{$groupBy}{$i}`) AS `count` "
                . "FROM `lessonReport` "
                    . "{$subSqlWhere} ";
            }

            $joinOn = "( `main`.`{$groupBy}Id` = `view`.`{$groupBy}` ) ";
            $orderBy = "`{$groupBy}Id` ";
        }

        $sql = "SELECT `main`.`label` AS `label`, "
            . "`date_from`, `date_to`, {$additionalSelect} "
            . "(CASE WHEN `count` IS NULL THEN 0 ELSE `count` END) AS `count` "
                . "FROM ( {$mainTable} ) AS `main` "
                . "LEFT JOIN ( {$viewSql} ) AS `view` ON {$joinOn} "
                . "ORDER BY {$orderBy}";

//Log::info("3 additionalSelect:" . $additionalSelect);

        $query = DB::query($sql);
        $result = $query->execute()->as_array();

        $prop = array(
            "group_by" => $dataArray["group_by"],
            "sql" => $sql
        );

        $result = array_merge($prop, $result);

        return $result;
    }

    private function loadReportManageGraphTrouble($dataArray) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));

        $groupByColumn = "`title` ";
        $targetColumn = "`title`, `label` ";
        $subTargetColumn = "`title`, `lj`.`name` AS `label`";
        $subJoin = "LEFT JOIN `title` `lj` ON `troubleReport`.`title` = `lj`.id ";
        //$sqlWhere = "WHERE ";

        $terminalFlag = true;

        //絞り込み条件の候補となるフィールド
        $fields = array("group", "user", "schoolE", "schoolH", "gradeE", "gradeH", "classE", "classH",
                       "title", "trouble");

        //WHERE条件に指定したカラムをセレクトする
        $additionalSelect = "";


        $subSqlWhere = "WHERE ";
        if($dataArray["fDate"] != null) {
            if(!preg_match("/^\d{4}-\d{2}-\d{2}$/" , $dataArray["fDate"])) {
                return json_encode("Invalid request.");
            }
            if($subSqlWhere != "WHERE ") {
                $subSqlWhere .= "AND ";
            }
            $subSqlWhere .= "`date` >= '{$dataArray["fDate"]}' ";
        }
        if($dataArray["eDate"] != null) {
            if(!preg_match("/^\d{4}-\d{2}-\d{2}$/" , $dataArray["eDate"])) {
                return json_encode("Invalid request.");
            }
            if($subSqlWhere != "WHERE ") {
                $subSqlWhere .= "AND ";
            }
            $subSqlWhere .= "`date` <= '{$dataArray["eDate"]}' ";
        }

//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $fields:' . print_r($fields, true));

        foreach($fields as $field) {
            if (isset($dataArray[$field])) {
                if($dataArray[$field] != null) {
                    if(!preg_match("/^\d+$/" , $dataArray[$field])) {
                    return json_encode("Invalid request.");
                    }
                    if($subSqlWhere != "WHERE ") {
                        $subSqlWhere .= "AND ";
                    }
                    $subSqlWhere .= "`{$field}` = '{$dataArray[$field]}' ";
                    $additionalSelect .= "`{$field}`, ";
                }
            }
        }

        if (isset($dataArray["title"])) {
            if($dataArray["title"] != null) {

                if($dataArray["title"] == 1) {
                    // トラブル

                    // 2016-10-19 !isset($dataArray["trouble"]) 追加 TODO 内容確認
                    if(!isset($dataArray["trouble"]) || $dataArray["trouble"] == null) {
                        $terminalFlag = false;
                    }

                    if (isset($dataArray["trouble"])) {
                        if($dataArray["trouble"] == 1) {
                            $groupByColumn = "`equipment` ";
                            $subTargetColumn = "`equipment`, `lj`.`name` AS `label`";
                            $subJoin = "LEFT JOIN `equipment` `lj` ON `troubleReport`.`equipment` = `lj`.id ";
                        } else if($dataArray["trouble"] == 2) {
                            $groupByColumn = "`application` ";
                            $subTargetColumn = "`application`, `lj`.`name` AS `label`";
                            $subJoin = "LEFT JOIN `application` `lj` ON `troubleReport`.`application` = `lj`.id ";

                        } else {
                            $groupByColumn = "`trouble` ";
                            $subTargetColumn = "`trouble`, `lj`.`name` AS `label`";
                            $subJoin = "LEFT JOIN `trouble` `lj` ON `troubleReport`.`trouble` = `lj`.id ";
                        }
                    } else {
                        $groupByColumn = "`trouble` ";
                        $subTargetColumn = "`trouble`, `lj`.`name` AS `label`";
                        $subJoin = "LEFT JOIN `trouble` `lj` ON `troubleReport`.`trouble` = `lj`.id ";
                    }

                }
            }
            else {
                $terminalFlag = false;
            }
        } else {
            $terminalFlag = false;
        }

        if($subSqlWhere == "WHERE ") {
            $subSqlWhere = "";
        }



        $sqlSelect = "SELECT MIN(`date`) AS `date_from`, MAX(`date`) AS `date_to`, "
                    . "{$additionalSelect} {$subTargetColumn}, COUNT(*) AS `count` ";

        $sqlFrom = "FROM `troubleReport` "
                    . "{$subJoin} "
                    . "{$subSqlWhere} "
                    . "GROUP BY {$groupByColumn} ";


        $viewSql = "{$sqlSelect} {$sqlFrom} ";

        $sql = "SELECT {$groupByColumn}.`id` AS `id`, {$groupByColumn}.`name` AS `label`, "
            . "`date_from`, `date_to`, {$additionalSelect} {$groupByColumn}, "
            . "(CASE WHEN `count` IS NULL THEN 0 ELSE `count` END) AS `count` "
            . "FROM {$groupByColumn} "
            . "LEFT JOIN ( {$viewSql} ) AS `view` ON ({$groupByColumn}.`id` = `view`.{$groupByColumn}) "
            . "ORDER BY `id`";


        //var_dump($sqlSelect);
        //var_dump($sqlFrom);
        //var_dump($sqlJoin);

//        $stmt = $this -> pdo -> prepare($sql);
//        $stmt -> execute(null);

//        $array[] = $sql;
//        $array[] = $timetable;

        $query = DB::query($sql);
        $result = $query->execute()->as_array();


        $terminalFlag = array();
        $array2 = array();


        foreach ($result as $value) {
            // 2016-10-19 isset($dataArray["title"])判定追加 TODO 内容確認
            if(!isset($dataArray["title"]) || $dataArray["title"] == null) {
                if($value["title"] == 1) {
                    $terminalFlag[] = false;
                }
                else {
                    $terminalFlag[] = true;
                }
            } else if($dataArray["title"] == 1) {
                if (isset($dataArray["trouble"])) {
                    if($dataArray["trouble"] != null) {
                        $terminalFlag[] = true;
                    } else if($value["trouble"] == 1 || $value["trouble"] == 2) {
                        $terminalFlag[] = false;
                    } else {
                        $terminalFlag[] = true;
                    }
                } else {
                    $terminalFlag[] = true;
                }
            }

            $array2[] = json_encode($value);
        }
/*
        while($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
            if($dataArray["title"] == null) {
                if($result["title"] == 1) {
                    $terminalFlag[] = false;
                }
                else {
                    $terminalFlag[] = true;
                }
            }
            else if($dataArray["title"] == 1) {
                if($dataArray["trouble"] != null) {
                    $terminalFlag[] = true;
                }
                else if($result["trouble"] == 1 || $result["trouble"] == 2) {
                    $terminalFlag[] = false;
                }
                else {
                    $terminalFlag[] = true;
                }
            }

            $array2[] = json_encode($result);
        }
*/
        $prop = array(
            //targetのバッククオートを外す
            "target" => substr($groupByColumn, 1, -2),

            //終着点のフラグ
            "flag" => $terminalFlag,

            "sql" => $sql
        );

        $array[] = json_encode($prop);
        $array = array_merge($array, $array2);

//        $data = json_encode($array);
        $data = $array;

        return $data;
    }
}