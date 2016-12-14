<?php

class Controller_Result extends Controller_Base
{

    protected $authFlag = true;
 // 認証フラグ
    public function action_index()
    {
        Log::info('action_index');
        Log::info('APPPATH:' . APPPATH);
        Log::info('DOCROOT:' . DOCROOT);

        return Response::forge(View::forge('result/index'));
    }
}
