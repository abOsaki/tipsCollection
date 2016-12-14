<?php

class Controller_Api_Group extends Controller_Rest
{

    public function action_get_info()
    {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $inputjson:' . print_r($inputjson, true));

        $result = self::getGroupInfo($inputjson);

        return $this->response($result);
    }

    // 学校種別ごとの学校リスト、学年リスト、教科リストを取得
    private function getGroupInfo($dataArray)
    {
        $returnObject = array();
        $sqls = array();

        $g = $dataArray["group"];

        if (isset($dataArray["school"])) {

            $sql = "SELECT `id`, `name` FROM `school{$g}` ORDER BY `id`";

            $sqls[] = $sql;

            $query = DB::query($sql);
            $school_result = $query->execute()->as_array();

            $returnObject["school"] = $school_result;
        }

        if (isset($dataArray["grade"])) {

            $sql = "SELECT `id`, `name` FROM `grade{$g}` ORDER BY `id`";

            $sqls[] = $sql;
            $query = DB::query($sql);
            $grade_result = $query->execute()->as_array();

            $returnObject["grade"] = $grade_result;
        }

        if (isset($dataArray["curriculum"])) {

            $sql = "SELECT `id`, `name` FROM `curriculum{$g}` ORDER BY `id`";

            $sqls[] = $sql;

            $query = DB::query($sql);
            $curriculum_result = $query->execute()->as_array();

            $returnObject["curriculum"] = $curriculum_result;
        }

        $returnObject["request"] = $dataArray;
        $returnObject["sqls"] = $sqls;

        return $returnObject;
    }
}
