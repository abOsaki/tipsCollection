<?php

//ログインチェック
function loginCheck() {
    session_start();
    $userid = $_SESSION["USERID"];
    $displayname = $_SESSION["DISPLAYNAME"];
    
    $mekurin = $_SESSION["MEKURIN"];
    $anaume = $_SESSION["ANAUME"];
    $tamattebako = $_SESSION["TAMATEBAKO"];
    $hourensou = $_SESSION["HOURENSOU"];
    $fuunyan = $_SESSION["FUUNYAN"];

    $group = $_SESSION["GROUP"];
    $school = $_SESSION["SCHOOL"];
    $grade = $_SESSION["GRADE"];
    $class = $_SESSION["CLASS"];
    $curriculum = $_SESSION["CURRICULUM"];
    
    $flag = "false";
    
    if ($anaume >= 1 && $anaume <= 3) {
        $flag = "true";
    }
    
    if ($flag == "true") {
        $userInfo = array(
            "userId" => $userid,
            "displayName" => $displayname,
            "mekurin" => $mekurin,
            "anaume" => $anaume,
            "tamattebako" => $tamattebako,
            "hourensou" => $hourensou,
            "fuunyan" => $fuunyan,
            "group" => $group,
            "school" => $school,
            "grade" => $grade,
            "class" => $class,
            "curriculum" => $curriculum
            );
        return json_encode($userInfo);
    } else {
        return $flag;
    }
}

echo loginCheck();
?>