<?php

abstract class Controller_Base extends Controller
{

    protected $authFlag = true;
 // 認証フラグ
    protected $user;
    protected $urlBase;

    public function before()
    {
        parent::before();

//Log::info('Uri::string():' . Uri::string());
//Log::info('Uri::base():' . Uri::base(false));
        $urlBase = Uri::base(false);

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
                // 認証していない場合はトップページ以外はトップページへリダイレクト
                $uri_string = Uri::string();
                if ($uri_string != '' && $uri_string != 'index') {
                    Response::redirect('/');
                }
            }
        }
    }
}