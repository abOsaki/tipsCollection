<?php
use Fuel\Core\Controller_Rest;

abstract class Controller_Baserest extends Controller_Rest
{

    protected $authFlag = true;
 // 認証フラグ
    protected $user;

    public function before()
    {
        parent::before();

        // 認証が必要かどうか調べる。
        if ($this->authFlag) {
            // 認証が行われているかどうか調べる。
            $userid = Session::get('USERID');
            $displayName = Session::get('NAME');
            $authority = Session::get('AUTHORITY');

            // TODO 認証方法を検討する。
            if ($userid && $displayName && $authority) {
                // セッション情報が取得できたら認証済み
                // ユーザ情報を取得する。
                $column = array(
                    'id' => $userid
                );
                $this->user = Model_Db_Users::find_one_by($column);
            } else {
                // 認証していない場合はエラーを返す。
                $data_array = array(
                    'code' => 401,
                    'message' => 'Unauthorized'
                );
                return $this->response($data_array, 401);
            }
        }
    }
}