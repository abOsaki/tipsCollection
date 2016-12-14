<?php
use Fuel\Core\Input;
use Fuel\Core\Session;

/**
 * 認証コントローラ
 */
class Controller_Api_Auth extends Controller_Rest
{
    // const STRETCH_COUNT = 1000;
    public function action_index()
    {
        return Response::forge(View::forge('index/index'));
    }

    /**
     * ログイン
     */
    public function action_login()
    {
        $inputjson = Input::json();
//Log::info('json:' . print_r($inputjson, true));

        $userid = $inputjson['userid'];
        $password = $inputjson['password'];

        // $loginPw = self::get_stretched_password($password, $userid);
        $loginPw = Util_Auth::get_stretched_password($password, $userid);

        $column = array(
            'loginName' => $userid,
            'password' => $loginPw
        );
        $user = Model_Db_Users::find_one_by($column);

        Session::set('USERID', $user->id);
        Session::set('NAME', $user->displayName);
        Session::set('AUTHORITY', $user->authority);

        $loginFlag = true;
        $loginAuthority = $user->authority;

        if ($loginAuthority == "m") {
            $url = Uri::base(false) . "report/";
        } elseif ($loginAuthority == "s") {
            $url = Uri::base(false) . "edit/";
        }

        $response_json = array(
            "flag" => $loginFlag,
            "authority" => $loginAuthority,
            "url" => $url
        );

        return $this->response($response_json);
    }

    /**
     * ログアウト
     */
    public function action_logout()
    {

        Session::destroy();
        $response_json = array();

        return $this->response($response_json);
    }

    /**
     * ログインチェック
     */
//     private function check() {
//         Log::info('check');
//     }

    //文字列からSHA256のハッシュ値を取得
//     private function get_sha256($target) {
//         return hash("sha256", $target);
//     }

//     private function get_stretched_password($password, $userId) {
//         $salt = self::get_sha256($userId);
//         $hash = "";
//         for ($i = 0; $i < self::STRETCH_COUNT; $i++) {
//             $hash = self::get_sha256($hash . $salt . $password);
//         }
//         return $hash;
//     }
}

