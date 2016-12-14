<?php
//use Fuel\Core\Controller_Rest;
use Fuel\Core\Input;

/**
 * 支援員用の報告情報を扱うコントローラーI
 *
 */
class Controller_Api_Edit extends Controller_Baserest {

    protected $authFlag = true;    // 認証フラグ

    /**
     * 「業務報告」情報を取得する。
     *
     * {
     *      date        [required]: [報告日 YYYY-MM-DD],
     *      schoolType  [required]: [学校区分 schoolE schoolH],
     *      schoolValue [required]: [学校ID],
     * }
     *
     * @return object
     */
    public function action_load_report_item() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('date', 'date')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('schoolType', 'schoolType')
                   ->add_rule('required')
                   ->add_rule('valid_string', 'alpha');
        $validation->add('schoolValue', 'schoolValue')
                   ->add_rule('required')
                   ->add_rule('valid_string', 'numeric');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $column = array(
                         'user' => $this->user->id,
                         'date' => $inputjson['date'],
                         $inputjson['schoolType'] => $inputjson['schoolValue'],
                     );

        $response_json = Model_Db_Report::find_by($column);

        return $this->response($response_json);
    }

    /**
     * 「ICT活用授業報告」情報を取得する。
     *
     * {
     *      date        [required]: [報告日 YYYY-MM-DD],
     *      schoolType  [required]: [学校区分 schoolE schoolH],
     *      schoolValue [required]: [学校ID],
     * }
     *
     * @return object
     */
    public function action_load_ict_item() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

            $validation = Validation::forge();
        $validation->add('date', 'date')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('schoolType', 'schoolType')
                   ->add_rule('required')
                   ->add_rule('valid_string', 'alpha');
        $validation->add('schoolValue', 'schoolValue')
                   ->add_rule('required')
                   ->add_rule('valid_string', 'numeric');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $column = array(
                         'user' => $this->user->id,
                         'date' => $inputjson['date'],
                         $inputjson['schoolType'] => $inputjson['schoolValue'],
                    );

        $response_json = Model_Db_Lessonreport::find_by($column);

        return $this->response($response_json);
    }

    /**
     * 「要望・トラブル等一覧」を取得する。
     *
     * {
     *      date        [required]: [報告日 YYYY-MM-DD],
     *      schoolType  [required]: [学校区分 schoolE schoolH],
     *      schoolValue [required]: [学校ID],
     * }
     *
     * @return object
     */
    public function action_load_demand_item() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('date', 'date')
        ->add_rule('required')
        ->add_rule('valid_date', 'Y-m-d');
        $validation->add('schoolType', 'schoolType')
        ->add_rule('required')
        ->add_rule('valid_string', 'alpha');
        $validation->add('schoolValue', 'schoolValue')
        ->add_rule('required')
        ->add_rule('valid_string', 'numeric');

        $userid = $this->user->id;

        $column = array(
            'user' => $this->user->id,
            'date' => $inputjson['date'],
            $inputjson['schoolType'] => $inputjson['schoolValue'],
        );

        $response_json = Model_Db_Troublereport::find_by($column);

        return $this->response($response_json);
    }



    /**
     * 「業務報告一覧」情報を取得する。
     *
     * {
     *      fDate   [required]: [開始日時 YYYY-MM-DD],
     *      eDate   [required]: [終了日時 YYYY-MM-DD],
     * }
     *
     * @return object
     */
    public function action_get_list() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
                   ->add_rule('required')
                   ->add_rule('valid_date', 'Y-m-d');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbReport = new Model_Db_Report();
        $fDate = $inputjson['fDate'];
        $eDate = $inputjson['eDate'];
        $result = $modelDbReport->getReportList($fDate, $eDate, $userid);

        $response_json = $result;
//Log::info('response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }

    /**
     * 「ITC活用授業報告一覧」情報を取得する。
     *
     * {
     *      fDate   [required]: [開始日時 YYYY-MM-DD],
     *      eDate   [required]: [終了日時 YYYY-MM-DD],
     * }
     *
     * @return object
     */
    public function action_get_ict_list() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
        ->add_rule('required')
        ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
        ->add_rule('required')
        ->add_rule('valid_date', 'Y-m-d');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbLessonreport = new Model_Db_Lessonreport();

        $fDate = $inputjson['fDate'];
        $eDate = $inputjson['eDate'];
        $result = $modelDbLessonreport->getIctReportList($fDate, $eDate, $userid);

        $response_json = $result;
//Log::info('$response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }

    /**
     * 「要望・トラブル等報告」情報を取得する。
     *
     * {
     *      fDate   [required]: [開始日時 YYYY-MM-DD],
     *      eDate   [required]: [終了日時 YYYY-MM-DD],
     * }
     *
     * @return object
     */
    public function action_load_demand() {
        $inputjson = Input::json();

        $validation = Validation::forge();
        $validation->add('fDate', 'fDate')
        ->add_rule('required')
        ->add_rule('valid_date', 'Y-m-d');
        $validation->add('eDate', 'eDate')
        ->add_rule('required')
        ->add_rule('valid_date', 'Y-m-d');

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbTroublereport = new Model_Db_Troublereport();
        $fDate = $inputjson['fDate'];
        $eDate = $inputjson['eDate'];
        $result = $modelDbTroublereport->loadDemand($fDate, $eDate, $userid);
        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * 「業務報告」情報の保存
     *
     * [
     * ]
     *
     * @return object
     */
    public function action_save_report() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' json_encode($inputjson):' . json_encode($inputjson));

        // TODO 入力チェック
        $val = Validation::forge();
        if (!$val->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbReport = new Model_Db_Report();
        foreach ($inputjson as $value) {
            $dataArray = json_decode($value, true);
            $result = $modelDbReport->insertData($dataArray, $userid);
        }

        $response_json = array();

        return $this->response($response_json);
    }

    /**
     * 「要望・トラブル等報告」情報の保存
     *
     * @return object
     */
    public function action_save_demand() {
        $inputjson = Input::json();

        $val = Validation::forge();
        if (!$val->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbTroublereport = new Model_Db_Troublereport();
        foreach ($inputjson as $value) {
            $dataArray = json_decode($value, true);

            $result = $modelDbTroublereport->insertDemand($dataArray, $userid);
        }

        $response_json =  array();

        return $this->response($response_json);
    }

    /**
     * 「ICT活用授業報告」情報の保存
     *
     * @return object
     */
    public function action_save_ict() {
        $inputjson = Input::json();

        $val = Validation::forge();
        if (!$val->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbLessonreport = new Model_Db_Lessonreport();
        foreach ($inputjson as $value) {
            $dataArray = json_decode($value, true);
            $result = $modelDbLessonreport->insertIct($dataArray, $userid);
        }

        $response_json = array();

        return $this->response($response_json);
    }

    /**
     * 「シフト入力情報」情報を取得する。
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

        if (!$validation->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $modelDbWorkshift = new Model_Db_Workshift();
        $result = $modelDbWorkshift->loadWorkshift($inputjson, $userid);
        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * 「シフト入力情報」情報の保存
     *
     * @return object
     */
    public function action_save_workshift() {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $val = Validation::forge();
        if (!$val->run($inputjson)) {
            $data_array = array('code' => 403, 'message' => 'Forbidden');
            return $this->response($data_array, 403);
        }

        $userid = $this->user->id;

        $inputData = array();
        foreach ($inputjson as $value) {
            $tmp_array = $value;
            if ($value['all_group']) {
                if ($value['all_group'] == 1) {
                    $tmp_array['am_schoolE'] = $tmp_array['all_school'];
                    $tmp_array['pm_schoolE'] = $tmp_array['all_school'];
                    $tmp_array['am_schoolH'] = null;
                    $tmp_array['pm_schoolH'] = null;
                } elseif ($value['all_group'] == 2) {
                    $tmp_array['am_schoolE'] = null;
                    $tmp_array['pm_schoolE'] = null;
                    $tmp_array['am_schoolH'] = $tmp_array['all_school'];
                    $tmp_array['pm_schoolH'] = $tmp_array['all_school'];
                }
                $tmp_array['am_group'] = $value['all_group'];
                $tmp_array['pm_group'] = $value['all_group'];

            } else {
                if ($value['am_group'] == 1) {
                    $tmp_array['am_schoolE'] = $tmp_array['am_school'];
                    $tmp_array['am_schoolH'] = null;
                } elseif ($value['am_group'] == 2) {
                    $tmp_array['am_schoolE'] = null;
                    $tmp_array['am_schoolH'] = $tmp_array['am_school'];
                }

                if ($value['pm_group'] == 1) {
                    $tmp_array['pm_schoolE'] = $tmp_array['pm_school'];
                    $tmp_array['pm_schoolH'] = null;
                    unset($tmp_array['pm_school']);
                } elseif ($value['pm_group'] == 2) {
                    $tmp_array['pm_schoolE'] = null;
                    $tmp_array['pm_schoolH'] = $tmp_array['pm_school'];
                }
            }

            // 必要ない項目を削除する。
            unset($tmp_array['all_area']);
            unset($tmp_array['all_group']);
            unset($tmp_array['all_school']);
            unset($tmp_array['am_school']);
            unset($tmp_array['pm_school']);

            array_push($inputData, $tmp_array);
        }
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputData:' . print_r($inputData, true));

        foreach ($inputData as $dataArray) {

            // シフト入力
            $modelDbWorkshift = new Model_Db_Workshift();
            if (isset($dataArray['id'])) {
                // 更新
                $result = $modelDbWorkshift->updateWorkShift($dataArray, $userid);
            } else {
                // 追加
                $result = $modelDbWorkshift->insertWorkShift($dataArray, $userid);
            }

            // 休暇登録
            $modelDbUserleave = new Model_Db_Userleave();
            $userleaveArray = array(
                                    'leavedate' => $dataArray['shiftdate'],
                                    'leave' => $dataArray['leave'],
                                 );
            $modelDbUserleave->insesrt($userleaveArray, $userid);
        }

        $response_json = array();

        return $this->response($response_json);
    }

}