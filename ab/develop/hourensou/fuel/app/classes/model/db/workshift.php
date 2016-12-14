<?php
//namespace Model;

use Fuel\Core\Model_Crud;

class Model_Db_Workshift extends  Model_Crud {
	protected static $_table_name = 'workshift';
	protected static $_primary_key = 'id';

	public function loadWorkshift($dataArray, $userid) {

	    $sql = "select a.user, a.shiftdate,";
	    $sql .= " a.am_group, (select areaid from schoolE where id = a.am_schoolE) as am_areaE, a.am_schoolE,";
	    $sql .= " (select areaid from schoolH where id = a.am_schoolH) as am_areaH, a.am_schoolH,";
	    $sql .= " a.pm_group, (select areaid from schoolE where id = a.pm_schoolE) as pm_areaE, a.pm_schoolE,";
	    $sql .= " (select areaid from schoolH where id = a.pm_schoolH) as pm_areaH, a.pm_schoolH,";
	    $sql .= " a.createuser, a.createdate, a.updateuser , a.updatedate, b.leave";
	    $sql .= " from workshift a";
	    $sql .= " left join userleave b on a.user = b.userid and a.shiftdate = b.leavedate";
	    $sql .= " where a.user=:userid";
	    //Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $sql:' . $sql);

	    if ($dataArray['fDate'] && $dataArray['eDate']) {
	        $sql .= " and a.shiftdate >= '{$dataArray["fDate"]}' and a.shiftdate <= '{$dataArray["eDate"]}'";
	    }

	    $query = DB::query($sql);

	    $query->bind('userid', $userid);
	    Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $query:' . print_r($query, true));

	    $result = $query->execute()->as_array();
	    Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $result:' . print_r($result, true));

	    return $result;
	}

    /**
     * シフト入力
     * 追加、更新
     *
     * 重複するデータがなければ追加、あれば更新を行う。
     *
     * @param unknown $dataArray
     * @param unknown $userid
     */
    public function insertWorkShift($dataArray, $userid) {
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));

        $sql = "insert into workshift";
        $sql .= " (user, shiftdate, am_group, am_schoolE, am_schoolH, pm_group, pm_schoolE, pm_schoolH, createuser, createdate, updateuser, updatedate)";
        $sql .= " values";
        $sql .= " (:user, :shiftdate, :am_group, :am_schoolE, :am_schoolH, :pm_group, :pm_schoolE, :pm_schoolH, :user, now(), :user, now())";
        $sql .= " on duplicate key update";
        $sql .= " user = :user, shiftdate = :shiftdate, am_group = :am_group, am_schoolE = :am_schoolE, am_schoolH = :am_schoolH, pm_group = :pm_group, pm_schoolE = :pm_schoolE, pm_schoolH = :pm_schoolH, updateuser = :user, updatedate = now()";

        $query = DB::query($sql);


        $parameters = array();
        $parameters['user'] = $userid;
        $parameters['shiftdate'] = $dataArray['shiftdate'];
        $parameters['am_group'] = $dataArray['am_group'];
        if (isset($dataArray['am_schoolE'])) {
            $parameters['am_schoolE'] = $dataArray['am_schoolE'];
        } else {
            $parameters['am_schoolE'] = null;
        }
        if (isset($dataArray['am_schoolH'])) {
            $parameters['am_schoolH'] = $dataArray['am_schoolH'];
        } else {
            $parameters['am_schoolH'] = null;
        }
        $parameters['pm_group'] = $dataArray['pm_group'];
        if (isset($dataArray['pm_schoolE'])) {
            $parameters['pm_schoolE'] = $dataArray['pm_schoolE'];
        } else {
            $parameters['pm_schoolE'] = null;
        }
        if (isset($dataArray['pm_schoolH'])) {
            $parameters['pm_schoolH'] = $dataArray['pm_schoolH'];
        } else {
            $parameters['pm_schoolH'] = null;
        }

        //パラメータ設定
        $query->parameters($parameters);

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

    /**
     * シフト入力 更新
     *
     * 指定されたシフトIDのデータを更新する。
     *
     * @param unknown $dataArray
     * @param unknown $userid
     */
    public function updateWorkShift($dataArray, $userid) {
//Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $dataArray:' . print_r($dataArray, true));

        $data_keys = array_keys($dataArray);

        $sql = "update workshift";
        $sql .= " set";
        $array_set = array();
        foreach ($data_keys as  $value) {
            if ($value == 'id' || $value == 'am_area' || $value == 'pm_area') {
                continue;
            }
            array_push($array_set, "$value=:$value");
        }
        $sql .= " " . implode(", ", $array_set);
        $sql .= " , updateuser=:updateuser, updatedate=now()";
        $sql .= " where id=:id";
Log::info(__CLASS__ . ' ' . __FUNCTION__  . ' $sql:' . $sql);

        $query = DB::query($sql);
//        $query->bind('user', $userid);
        $dataArray['updateuser'] = $userid;
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


    public function loadReportWorkshift($fDate, $eDate, $order = null) {
Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $fDate:' . $fDate);
Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $eDate:' . $eDate);
Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $order:' . $order);

        $sql = "select a.groupid, a.schoolid, a.areaid, c.name as areaname, a.name, b.shiftid, b.user, d.displayName as username, b.shiftdate, b.am_group, b.am_schoolid, b.pm_group, b.pm_schoolid";
        $sql .= " from";
        $sql .= " (select 1 as groupid, id as schoolid, areaid, name from schoolE union select 2 as groupid, id as schoolid, areaid, name from schoolH) a left join area c on a.areaid= id,";
        $sql .= " (select id as shiftid, user, shiftdate, am_group, (case when am_group=1 then am_schoolE when am_group=2 then am_schoolH else null end) as am_schoolid,";
        $sql .= "  pm_group, (case when pm_group=1 then pm_schoolE when pm_group=2 then pm_schoolH else null end) as pm_schoolid from workshift where shiftdate>=:fDate and shiftdate<=:eDate) b left join users d on user=id";
        $sql .= " where ((a.groupid = b.am_group and a.schoolid = b.am_schoolid) or (a.groupid = b.pm_group and a.schoolid = b.pm_schoolid))";

        if ($order == 'area') {
            $sql .= " order by a.areaid, a.groupid, a.schoolid, b.user, b.shiftdate";
        } else if ($order == 'school') {
            $sql .= " order by a.groupid, a.schoolid, a.areaid, b.user, b.shiftdate";
        } else if ($order == 'user') {
            $sql .= " order by b.user, a.areaid, a.groupid, a.schoolid, b.shiftdate";
        } else {
            $sql .= " order by a.areaid, a.groupid, a.schoolid, b.user, b.shiftdate";
        }
        //Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $sql:' . $sql);

        $query = DB::query($sql);
        $query->bind('fDate', $fDate);
        $query->bind('eDate', $eDate);

//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $query:' . print_r($query, true));

        $result = $query->execute()->as_array();
//Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $result:' . print_r($result, true));

        return $result;
    }

    public function getWorkshift($dataArray) {
        Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $dataArray:' . print_r($dataArray, true));

        $sql = "select a.shiftid, a.user, d.displayName as username, a.shiftdate, b.areaid as am_areaid, e.name as am_areaname, a.am_group, g.name as am_groupname, a.am_schoolid, b.name as am_schoolname, c.areaid as pm_areaid, f.name as pm_areaname, a.pm_group, h.name as pm_groupname, a.pm_schoolid, c.name as pm_schoolname";
        $sql .= " from";
        $sql .= " (select id as shiftid, user, shiftdate, am_group, (case when am_group=1 then am_schoolE when am_group=2 then am_schoolH else null end) as am_schoolid,  pm_group, (case when pm_group=1 then pm_schoolE when pm_group=2 then pm_schoolH else null end) as pm_schoolid from workshift where id=:id) a";
        $sql .= " left join users d on a.user=d.id";
        $sql .= " left join (select 1 as groupid, id as schoolid, areaid, name from schoolE union select 2 as groupid, id as schoolid, areaid, name from schoolH) b on a.am_group=b.groupid and a.am_schoolid=b.schoolid";
        $sql .= " left join (select 1 as groupid, id as schoolid, areaid, name from schoolE union select 2 as groupid, id as schoolid, areaid, name from schoolH) c on a.pm_group=c.groupid and a.pm_schoolid=c.schoolid";
        $sql .= " left join area e on b.areaid=e.id";
        $sql .= " left join area f on c.areaid=f.id";
        $sql .= " left join `group` g on a.am_group=g.id";
        $sql .= " left join `group` h on a.pm_group=h.id";

        //Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $sql:' . $sql);

        $query = DB::query($sql);
        $query->bind('id', $dataArray['id']);
        Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $query:' . print_r($query, true));

        $result = $query->execute()->as_array();
        Log::info(__CLASS__ . ' ' . __FUNCTION__ . ' $result:' . print_r($result, true));

        return $result;
    }

}
