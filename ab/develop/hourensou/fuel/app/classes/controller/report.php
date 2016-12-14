<?php

class Controller_Report extends Controller_Base
{

    protected $authFlag = true;
 // 認証フラグ
    public function action_index()
    {
        // 管理ユーザでない場合はリダイレクト
        if ($this->user->authority != "m") {
            Response::redirect('/');
        }

        Config::load('application', 'application');

        $startYear = Config::get('application.report.startYear');
        $aggregateStartYear = Config::get('application.report.aggregateStartYear');

        $view = View::forge('report/index');
        $view->startYear = $startYear;
        $endYear = date('Y') + 2;
        $view->endYear = $endYear;

        $view->aggregateStartYear = $aggregateStartYear;
        $view->aggregateEndtYear = date('Y');

        return Response::forge($view);
    }

    public function action_workshift()
    {
        // 管理ユーザでない場合はリダイレクト
        if ($this->user->authority != "m") {
            Response::redirect('/');
        }

        Config::load('application', 'application');

        $startYear = Config::get('application.report.startYear');
        $aggregateStartYear = Config::get('application.report.aggregateStartYear');

        $view = View::forge('report/workshift');
        $view->startYear = $startYear;
        $endYear = date('Y') + 2;
        $view->endYear = $endYear;

        $view->aggregateStartYear = $aggregateStartYear;
        $view->aggregateEndtYear = date('Y');

        return Response::forge($view);
    }
}
