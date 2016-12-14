<?php
require_once './dbConnect.php';


//セッション登録
function setSession($loginId, $loginPw) {
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();

    //ハッシュ化
    //$loginPw = get_stretched_password($loginPw, $loginId);

    $sql =
        "SELECT `id`, `displayName`, `m_prefecture_id`, `m_city_id`, `m_category_id`, `m_school_id`, `m_grade_id`, `m_classroom_id`, `m_curriculum_id`, `m_role_id`, `student_number` " .
        "FROM `USERLIST` " .
        "WHERE `loginName` = :loginId AND `password` = :loginPw;";
    $stmt = $pdo -> prepare($sql);

    //パラメーター設定
    $stmt -> bindValue(':loginId', $loginId, PDO::PARAM_STR);
    $stmt -> bindValue(':loginPw', $loginPw, PDO::PARAM_STR);

    $stmt -> execute(null);
    
    $loginFlag = '';
    $loginAuthority = '';

    if ($result = $stmt -> fetch(PDO::FETCH_ASSOC)) {
        session_start();
        //ユーザー情報をセッションへ登録
        $_SESSION['USERID'] = $result['id']; //ユーザーID
        $_SESSION['DISPLAYNAME'] = $result['displayName']; //表示名
        $_SESSION['PREFECTURE'] = $result['m_prefecture_id']; //都道府県
        $_SESSION['CITY'] = $result['m_city_id']; //地区（社内外の判定も有り）
        $_SESSION['CATEGORY'] = $result['m_category_id']; //学校種別
        $_SESSION['SCHOOL'] = $result['m_school_id']; //学校
        $_SESSION['GRADE'] = $result['m_grade_id']; //学年
        $_SESSION['CLASSROOM'] = $result['m_classroom_id']; //クラス
        $_SESSION['CURRICULUME'] = $result['m_curriculum_id']; //担当教科（専科）
        $_SESSION['ROLE'] = $result['m_role_id']; //権限
        $_SESSION['NUMBER'] = $result['student_number']; //出席番号（ふーにゃん用）

        $loginFlag = true;
    } else {
        $loginFlag = false;
    }

    $sessionInfo = array(
        "flag" => $loginFlag
        );
    return $sessionInfo;
}

//ハッシュ化の際にはコメントを外す
//function get_sha256($target) {
//    return hash('sha256', $target);
//}

//function get_stretched_password($password, $userId) {
//    $salt = get_sha256($userId);
//    $hash = '';
//    for ($i = 0; $i < STRETCH_COUNT; $i++) {
//        $hash = get_sha256($hash . $salt . $password);
//    }
//    return $hash;
//}

//ログイン
function login($param) {
    if(!empty($param['login'])) {
        $sessionInfo = setSession($param['userid'], $param['password']);

        if($sessionInfo['flag'] == true) {
            $message = 'success';
            $url = './../menu/';
            $flag = 'true';
        } else {
            $message = 'mismatch';
            $url = '#';
            $flag = 'false';
        }
    } else {
        $message = 'error';
        $url = '#';
        $flag = 'false';
    }
    $loginInfo = array(
        'flag' => $flag,
        'url' => $url,
        'message' => $message
        );
    return $loginInfo;
}

//ログアウト
function logout(){
    session_start();
    if (isset($_COOKIE["PHPSESSID"])) {
        setcookie("PHPSESSID", '', time() - 1800, '/');
    }
    session_destroy();
    return true;
}

//ログイン情報
function loginInfo() {
    session_start();
    return $_SESSION;
}

//テーブルリストの取得
function getTable($param) {
    $dbname = '';
    
    //共通テーブル
    $dbname = COMMON_TABLE;
    $model = new dbConnect($dbname);
    $pdo = $model -> connectInfo();

    $tableList = array(
        'category' => 'm_category',
        //'city' => 'm_city',
        'prefecture' => 'm_prefecture'
    );
    foreach ($tableList as $key => $value) {
        $sql = "SELECT `id`, `name` FROM `{$value}`;";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $res[$key] = $stmt -> fetchAll(PDO::FETCH_CLASS);
    }

    //カテゴリー情報 有
    $tableList = array(
        'grade' => 'm_grade',
        'classroom' => 'm_classroom',
        'curriculum' => 'm_curriculum'
    );
    foreach ($tableList as $key => $value) {
        $sql = "SELECT `id`, `name`, `m_category_id` AS `category` FROM `{$value}`;";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $res[$key] = $stmt -> fetchAll(PDO::FETCH_CLASS);
    }

    //カテゴリー情報 有, 地区で絞り込み
    //支援員は地区の選択を可能にする？ -> するならば絞り込ますに全データを返す必要がある？
    $tableList = array(
        'school' => 'm_school'
    );
    session_start();
    foreach ($tableList as $key => $value) {
        $sql =
            "SELECT `id`, `name`, `m_category_id` AS `category`" .
            "FROM `{$value}` " .
            "WHERE `m_city_id` = :city;";
        $stmt = $pdo -> prepare($sql);
        
        $stmt -> bindValue(':city', $_SESSION['CITY'], PDO::PARAM_STR);

        $stmt -> execute(null);
        $res[$key] = $stmt -> fetchAll(PDO::FETCH_CLASS);
    }
    
    //各コンテンツ必要テーブルcommonで良い？
    switch($param){
        case 'hourensou':
            $dbname = HOURENSOU_TABLE;
            $tableList = ['timetable', 'location', 'business', 'preparationOfLesson', 'lesson', 'lessonAfter', 'trouble', 'maintenance', 'other',
                          'lessonTimetable', 'lessonLocation', 'support',
                          'purpose', 'equipment', 'application',
                          'title', 'status'];
            break;
        case 'tamatebako':
            $dbname = TAMATEBAKO_TABLE;
            $tableList = ['middleCategory01', 'middleCategory02', 'middleCategory03'];

            $tableName = 'largeCategory';
            //$_SESSION['CITY']の値で社内外を判定
            if(intval($_SESSION['CITY']) == 0) {
                //社内の人は「middleCategory04」を追加）
                $tableList[] = 'middleCategory04';
                $sql = "SELECT `id`, `name` FROM `{$tableName}`";
            } else {
                //社外の人は「largeCategory」の「4」を除外）
                $sql = "SELECT `id`, `name` FROM `{$tableName}` WHERE `id` != '4'";
            }
            $model = new dbConnect($dbname);
            $pdo = $model -> connectInfo();
            $stmt = $pdo -> prepare($sql);
            $stmt -> execute(null);
            $res[$tableName] = $stmt -> fetchAll(PDO::FETCH_CLASS);

            break;
        case 'anaume':
            $dbname = ANAUME_TABLE;
            $tableList = ['m_share'];
            break;
        case 'fuunyan':
            $dbname = FUUNYAN_TABLE;
            $tableList = [];
            break;
        case 'mekurin':
            $dbname = MEKURIN_TABLE;
            $tableList = [];
            break;
        default:
            return 'param error';
            break;
    }
    $model = new dbConnect($dbname);
    $pdo = $model -> connectInfo();
    for ($i = 0, $ic = count($tableList); $i < $ic; $i += 1) {
        $tableName = $tableList[$i];
        $sql = "SELECT `id`, `name` FROM `{$tableName}` ";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $res[str_replace('m_', '', $tableName)] = $stmt -> fetchAll(PDO::FETCH_CLASS);
    }
    return $res;
}

function unitSelecter($param) {
    $model = new dbConnect(COMMON_TABLE);
    $pdo = $model -> connectInfo();

    $sql =
        "SElECT `TB1`.`id`, `TB1`.`name` " .
        "FROM `m_unit` AS `TB1` " .
        "WHERE `m_grade_id` = :grade AND `m_curriculum_id` = :curriculum OR `id` = '1' " .
        "ORDER BY `id` = '1', `TB1`.`sort` ASC;";
    //学年教科だけで絞り込めばよい（学校種別を内包している、）
    //ID=1は「その他」
    $stmt = $pdo -> prepare($sql);
    //return $sql;
    
    $stmt -> bindValue(':grade', $param['grade'], PDO::PARAM_STR);
    $stmt -> bindValue(':curriculum', $param['curriculum'], PDO::PARAM_STR);

    $stmt -> execute(null);
    return $stmt -> fetchAll(PDO::FETCH_CLASS);
}

//js側からのデータ
$data = file_get_contents('php://input');
$req = json_decode($data, true);
$res = '';

if ($req['command'] == 'login') {
    $res = login($req['param']);
} else if ($req['command'] == 'loginInfo') {
    $res = loginInfo();
} else if ($req['command'] == 'logout') {
    $res = logout($req['param']);
} else if ($req['command'] == 'getTable') {
    $res = getTable($req['param']);
} else if ($req['command'] == 'unitSelecter') {
    $res = unitSelecter($req['param']);
} else {
    $res = 'command error';
}

echo json_encode($res, JSON_UNESCAPED_UNICODE);

?>