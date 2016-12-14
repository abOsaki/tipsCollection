<?php
//設問がいくつの問題集に使われているかの判定
    /*
    $renew = array(
        "param" => {}
        "where" => str
    );
    */
function updateBelongCount($pdo, $renew) {
    $param = $renew["param"];
    if (!empty($renew["where"])) {
        $sql = "SELECT contents FROM `package` {$renew["where"]}";
        $stmt = $pdo -> prepare($sql);

        session_start();
        if (empty($param["id"])) {
            //pacageのid指定がなければ作成・編集時のカウント調整
            $stmt -> bindValue(":m_school_id",     $param["school"],     PDO::PARAM_INT);
            $stmt -> bindValue(":m_grade_id",      $param["grade"],      PDO::PARAM_INT);
            $stmt -> bindValue(":m_curriculum_id", $param["curriculum"], PDO::PARAM_INT);
            $stmt -> bindValue(":title",           $param["title"],      PDO::PARAM_STR);
            $stmt -> bindValue(":author",          $_SESSION["USERID"],  PDO::PARAM_INT);
            $stmt -> bindValue(":m_unit_id",       $param["unit"],       PDO::PARAM_INT);
        } else {
            //pacageのid指定があれば削除時のカウントダウン
            $stmt -> bindValue(":id",              $param["id"],         PDO::PARAM_INT);
        }

        $stmt -> execute(null);
        $result = $stmt -> fetch(PDO::FETCH_ASSOC);

        $oldContents = explode(",", $result["contents"]);
    }

    if (!empty($param["contents"])) {
        $newContents = $param["contents"];
    }

    /*
     * balance
     * key:contentId; value:-1,0,1
     *
     * -1 : keyのcontentIdがoldにのみ存在する
     * 0  : keyのcontentIdがoldとnewの両方に存在する
     * 1  : keyのcontentIdがnewにのみ存在する
     */
    $balance = array();
    
    //oldに含まれているcontentIdのbalance値を一度すべて-1に設定
    if (!empty($oldContents)) {
        for ($i = 0, $len = count($oldContents); $i < $len; $i += 1) {
            $contentId = $oldContents[$i];
            $balance[$contentId] = -1;
        }
    }
    
    //newに含まれているcontentIdのbalance値を更新
    if (!empty($newContents)) {
        for ($i = 0, $len = count($newContents); $i < $len; $i += 1) {
            $contentId = $newContents[$i];
            if (isset($balance[$contentId])) {
                if ($balance[$contentId] == -1) {
                    //oldにも含まれていたcontentIdの場合balance値は0
                    $balance[$contentId] = 0;
                }
            } else {
                //oldに含まれていなかったcontentIdの場合balance値は1
                $balance[$contentId] = 1;
            }
        }
    }
    
    foreach($balance as $contentId => $bal) {
        switch($bal) {
            case 1:
                if(isset($countUp)) {
                    $countUp .= ", {$contentId}";
                }
                else {
                    $countUp = "{$contentId}";
                }
                break;
            case -1:
                if(isset($countDown)) {
                    $countDown .= ", {$contentId}";
                }
                else {
                    $countDown = "{$contentId}";
                }
                break;
        }
    }
    if (!empty($countUp)) {
        $sql = "UPDATE question SET belongCount = belongCount + 1 WHERE id IN({$countUp})";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
    }
    if (!empty($countDown)) {
        $sql = "UPDATE question SET belongCount = belongCount - 1 WHERE id IN({$countDown})";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
    }
}
?>
