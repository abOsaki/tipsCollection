<?php
class Controller_Index extends Controller_Base
{

    protected $authFlag = true;    // 認証フラグ

    public function action_index()
	{

		$view = View::forge('index/index');
		$view->user = $this->user;

		$userid = Session::get('USERID');
		$view->userid = $userid;


		return Response::forge($view);
	}
}
