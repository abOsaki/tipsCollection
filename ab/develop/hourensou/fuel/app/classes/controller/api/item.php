<?php

class Controller_Api_Item extends Controller_Rest
{

    /**
     * マスター情報を取得する。
     */
    public function action_get_item_list()
    {
        $inputjson = Input::json();
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $inputjson:' . print_r($inputjson, true));

        $list = $inputjson;

        $result = Array();

        foreach ($list['array'] as $value) {
            if ($value == 'item' || $value == 'grade' || $value == 'class' || $value == 'curriculum' || $value == 'school') {
                continue;
            }

            if (isset($list['where'][0])) {
                $result[$value] = self::getItemData($value, $list['where'][0]);
            } else {
                $result[$value] = self::getItemData($value);
            }

//if ($value == 'schoolE' || $value == 'schoolH') {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $result[' . $value . ']:' . print_r($result[$value], true));
//}

        }

        $response_json = $result;

        return $this->response($response_json);
    }

    /**
     * 指定したマスター情報を取得する。
     *
     * @param unknown $tableName
     */
    private function getItemData($tableName, $where = array())
    {

        // TODO $tableNameで指定できる対象のテーブルかチェックする。

        // $sql = "SELECT `name` FROM `" . $tableName . "`";
        $sql = "SELECT * FROM `" . $tableName . "`";

        if ($where) {
            $tmp_array = array();
            foreach ($where as $key => $value) {
                if ($value) {
                    array_push($tmp_array, $key . '=' . $value);
                }
            }
            $sql .= " where " . implode('and', $tmp_array);
        }
        $query = DB::query($sql);
        $result = $query->execute()->as_array();

        return $result;
    }
}