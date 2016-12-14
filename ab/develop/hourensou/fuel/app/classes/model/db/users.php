<?php
//namespace Model;

use Fuel\Core\Model_Crud;

class Model_Db_Users extends  Model_Crud {
    protected static $_table_name = 'users';
    protected static $_primary_key = 'id';

    /**
     *
     */
    public function getUserList() {
//        $sql = "SELECT `id`, `displayName` FROM `users` WHERE `id` >= 5 AND `id` <= 9 OR `id` = 11";
        $sql = "SELECT `id`, `displayName` FROM `users`";

        $query = DB::query($sql);
        $result = $query->execute()->as_array();

        return $result;
    }

    public function insertUser($userid, $password, $authority, $displayname) {
        $sql = "insert into users";
        $sql .= " (loginName, password , displayName, authority)";
        $sql .= " values";
        $sql .= " (:loginName, :password, :displayName, :authority)";
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $sql:' . $sql);

        $query = DB::query($sql);
        $dataArray['loginName'] = $userid;
        $dataArray['password'] = $password;
        $dataArray['displayName'] = $displayname;
        $dataArray['authority'] = $authority;
        //パラメータ設定
        $query->parameters($dataArray);
/*
        foreach ($dataArray as $key => $value) {
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $key:' . $key);
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $value:' . $value);
            $query->bind($key, $value);
        }
*/
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $query:' . $query);

        $result = $query->execute();
Log::info('$result:' . print_r($result, true));
    }


    public function updateUser($id, $authority, $displayname) {
        $sql = "update users";
        $sql .= " set";
        $sql .= " displayName=:displayname, authority=:authority";
        $sql .= " where id=:id";
        Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $sql:' . $sql);

        $query = DB::query($sql);
        $dataArray['id'] = $id;
        $dataArray['authority'] = $authority;
        $dataArray['displayname'] = $displayname;

        //パラメータ設定
        $query->parameters($dataArray);
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $query:' . $query);

        $result = $query->execute();
        Log::info('$result:' . print_r($result, true));

    }
}
