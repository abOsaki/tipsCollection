<?php
//namespace Model;

use Fuel\Core\Model_Crud;

class Model_Db_Userleave extends  Model_Crud {
    protected static $_table_name = 'userleave';
    protected static $_primary_key = 'id';

    public function insesrt($dataArray, $userid) {
        $sql = "insert into userleave";
        $sql .= " (userid, leavedate, `leave`, createuser, createdate, updateuser, updatedate)";
        $sql .= " values";
        $sql .= " (:userid, :leavedate, :leave, :userid, now(), :userid,  now())";
        $sql .= " on duplicate key update";
        $sql .= " `leave` = :leave, updateuser = :userid, updatedate = now()";

        $query = DB::query($sql);

        $parameters = $dataArray;
        $parameters['userid'] = $userid;

        //パラメータ設定
        $query->parameters($parameters);

Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $query:' . print_r($query, true));

        $result = $query->execute();
Log::info('$result:' . print_r($result, true));

    }

}
