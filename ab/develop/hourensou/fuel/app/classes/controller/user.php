<?php
class Controller_User extends Controller_Base
{

    protected $authFlag = true;    // 認証フラグ

    public function action_index()
    {

        // 管理ユーザでない場合はリダイレクト
        if ($this->user->authority != "m") {
            Response::redirect('/');
        }

        $view = View::forge('user/index');

        $user_array = Model_Db_Users::find_all();
        $view->user_array = $user_array;

        return Response::forge($view);
    }
}
