<?php
use Fuel\Core\Date;

class Controller_Edit extends Controller_Base
{

    protected $authFlag = true;
 // 認証フラグ
    public function action_index()
    {

        Config::load('application', 'application');

        $startYear = Config::get('application.edit.startYear');
        $endYear = date('Y') + 2;

        $view = View::forge('edit/index');
        $view->urlBase = $this->urlBase;
        $view->startYear = $startYear;
        $view->endYear = $endYear;

        return Response::forge($view);
    }

    public function action_test()
    {
        Log::info('action_test');
        Log::info('APPPATH:' . APPPATH);
        Log::info('DOCROOT:' . DOCROOT);

        return Response::forge(View::forge('edit/test'));
    }
}
