<?php

function updateBelongCount($pdo, $newContentsStr, $packageSqlWhere) {
        
    if($packageSqlWhere) {
        //select
        $sql = "SELECT contents FROM `package` WHERE {$packageSqlWhere}";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
        $result = $stmt -> fetch(PDO::FETCH_ASSOC);

        $oldContents = explode(",", $result["contents"]);
    }
    if($newContentsStr) {
        $newContents = explode(",", $newContentsStr);
    }
    
    // balance
    // key:contentId; value:-1,0,1
    // -1 : keyのcontentIdがoldにのみ存在する
    // 0  : keyのcontentIdがoldとnewの両方に存在する
    // 1  : keyのcontentIdがnewにのみ存在する
    $balance = array();
    
    //oldに含まれているcontentIdのbalance値を一度すべて-1に設定
    if(isset($oldContents)) {
        for($i = 0, $len = count($oldContents); $i < $len; $i++) {
            $contentId = $oldContents[$i];
            $balance[$contentId] = -1;
        }
    }
    
    //newに含まれているcontentIdのbalance値を更新
    if(isset($newContents)) {
        for($i = 0, $len = count($newContents); $i < $len; $i++) {
            $contentId = $newContents[$i];

            if(isset($balance[$contentId])) {
                if($balance[$contentId] == -1) {
                    //oldにも含まれていたcontentIdの場合balance値は0
                    $balance[$contentId] = 0;
                }
            }
            else {
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
    
    if(isset($countUp)) {
        $sql = "UPDATE question SET belongCount = belongCount + 1 WHERE id IN({$countUp})";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
    }
    if(isset($countDown)) {
        $sql = "UPDATE question SET belongCount = belongCount - 1 WHERE id IN({$countDown})";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(null);
    }
    
}

?>