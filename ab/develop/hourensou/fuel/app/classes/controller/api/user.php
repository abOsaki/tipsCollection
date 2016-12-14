<?php

/**
 * ユーザ情報を扱うコントローラ
 *
 */
class Controller_Api_User extends Controller_Baserest
{

    protected $authFlag = true;
 // 認証フラグ

    /**
     * ユーザ情報を取得する。
     */
    public function action_get()
    {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $inputjson:' . print_r($inputjson, true));

        if (isset($inputjson['id'])) {

            $val = Validation::forge();
            if (! $val->run($inputjson)) {
                // throw new ValidateException;
//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' ValidateException $inputjson:' . print_r($inputjson, true));
            }

            $modelDbUsers = new Model_Db_Users();
            $user = $modelDbUsers->find_by_pk($inputjson['id']);
            $id = $user->id;
            $userid = $user->loginName;
            $password = $user->password;
            $name = $user->displayName;
            $authority = $user->authority;
        } else {
            $id = $this->user->id;
            $userid = $this->user->loginName;
            $password = $this->user->password;
            $name = $this->user->displayName;
            $authority = $this->user->authority;
        }

        $response_json = array(
            'id' => $id,
            'password' => $password,
            'userid' => $userid,
            'name' => $name,
            'authority' => $authority
        );
        // Log::info('response_json:' . print_r($response_json, true));

        return $this->response($response_json);
    }

    /**
     * ユーザ情報一覧を取得する。
     */
    public function action_get_list()
    {
        $modelDbUsers = new Model_Db_Users();
        $result = $modelDbUsers->getUserList();
        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * ユーザを作成する。
     *
     * @param unknown $param
     */
    public function action_create_user()
    {
        $inputjson = Input::json();
//Log::info('json:' . print_r($inputjson, true));

        $val = Validation::forge();
        if (! $val->run($inputjson)) {
            // throw new ValidateException;
//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' ValidateException $inputjson:' . print_r($inputjson, true));
        }

        // 管理ユーザでない場合はエラーを返す。
        if ($this->user->authority != "m") {
            // 認証していない場合はエラーを返す。
            $data_array = array(
                'code' => 401,
                'message' => 'Unauthorized'
            );
            return $this->response($data_array, 401);
        }

        $userid = $inputjson['userid'];
        $password = $inputjson['password'];
        $authority = $inputjson['authority'];
        $displayname = $inputjson['displayname'];

        $loginPw = Util_Auth::get_stretched_password($password, $userid);

        $modelDbUsers = new Model_Db_Users();
        $result = $modelDbUsers->insertUser($userid, $loginPw, $authority, $displayname);

        return $this->response($result);
    }

    /**
     * ユーザ情報を変更する。
     *
     * TODO パスワード変更にも対応する。
     *
     * @param unknown $param
     */
    public function action_update_user()
    {
        $inputjson = Input::json();
//Log::info('json:' . print_r($inputjson, true));

        $val = Validation::forge();
        if (! $val->run($inputjson)) {
            // throw new ValidateException;
//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' ValidateException $inputjson:' . print_r($inputjson, true));
        }

        // 管理ユーザでない場合はエラーを返す。
        if ($this->user->authority != "m") {
            // 認証していない場合はエラーを返す。
            $data_array = array(
                'code' => 401,
                'message' => 'Unauthorized'
            );
            return $this->response($data_array, 401);
        }

        $id = $inputjson['id'];
        // $password = $inputjson['password'];
        $authority = $inputjson['authority'];
        $displayname = $inputjson['displayname'];

        // $loginPw = Util_Auth::get_stretched_password($password, $userid);

        $modelDbUsers = new Model_Db_Users();
        $result = $modelDbUsers->updateUser($id, $authority, $displayname);

        return $this->response($result);
    }
}