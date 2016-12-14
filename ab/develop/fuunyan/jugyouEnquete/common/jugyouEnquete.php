<?php

require_once "../../common/php/dbConnect.php";
require_once "common.php";
require_once "jugyouEnqueteQuestion.php";

class jugyouEnquete{
    private $questions;
    private $id;
    private $user;
    private $active;
    private $share;
    private $group;
    private $school;
    private $grade;
    private $class;
    private $curriculum;
    private $schoolName;
    private $pdo;
            
    function __construct($pdo,$row,$questions) {
        $this->pdo = $pdo;
        $this->id = $row['id'];
        $this->user = $row['user'];
        $this->active = $row['active'];
        $this->share = $row['share'];
        $this->group = $row['group'];
        $this->school = $row['school'];
        $this->grade = $row['grade'];
        $this->class = $row['class'];
        $this->curriculum = $row['curriculum'];
        $this->schoolName = $row['name'];
        $this->questions = $questions;
    }
    
    public function getID(){
        return $this->id;
    }
    
    public function getTitle(){
        $spanStart = "<span>";
        $gakunen = "学年：$this->grade 年　";
        $class = "クラス：$this->class 組　";
        $kyouka = getCurriculumText($this->curriculum);
        $spanEnd = "</span>";
        $result = $spanStart.$gakunen.$class.$kyouka.$spanEnd;
        return $result;
    }

    public function getQuestionPane() {
        $result = '';
        $index = 1;
        foreach ($this->questions as $question){
            $result = $result.$question->getQuestionPane($index++);
        }
        return $result;
    }
    
    public function getQuestionTrs(){
        return jugyouEnqueteQuestion::getTrs($this->questions);
    }
    
    private function getTr(){
        $trStart = "<tr>";
        $groupText = $this->getGroupText();
        $groupTD = "<td>$groupText</td>";
        $schoolTD = "<td>$this->schoolName</td>";
        $gakunenTD = "<td>$this->grade 年</td>";
        $classTD = "<td>$this->class 組</td>";
        $curriculumText = getCurriculumText($this->curriculum);
        $curriculumTD = "<td>$curriculumText</td>";
        $jissiTD = "<td><button class='executeBtn btn-primary' value=$this->id>実施</button></td>";
        $trEnd = "</tr>";
        
        $result = $trStart . $groupTD . $schoolTD . $gakunenTD .
                $classTD . $curriculumTD . $jissiTD . $trEnd;
        return $result;
    }
    
    private function getGroupText(){
        if($this->group == 1){
            return '小学校';
        }else if($this->group == 2){
            return '中学校';
        }
    }
    
    public static function setStartStopEnquete($enqueteID,$activeFlag){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        $sql="update jugyouEnquete "
            . "set `active` = $activeFlag "
            . "where `id` = $enqueteID";
        
        $stmt = $pdo->prepare($sql);

        $stmt->execute();
    }

    public static function createForTeacher(){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        $rows = self::getRowForTeacher($pdo);
        
        //結果用配列
        $result = array();
        
        //ループ
        foreach ($rows as $row){
            $questions = self::getQuestionsByQuestionText($pdo,$row['jugyouEnqueteQuestion']);
            //ループ内でインスタンス作成
            $jeqObj = new jugyouEnquete($pdo,$row,$questions);
            array_push($result,$jeqObj);
            
        }
        return $result;
    }
    
    private static function getQuestionsByQuestionText($pdo,$questionsText){
        //ローのクエッションを取得する（分割）
        $questionIndexs = explode(",", $questionsText);
        //質問配列
        $questions = array();
        //質問の取得
        foreach ($questionIndexs as $index){
            $question = jugyouEnqueteQuestion::createByID( $pdo, $index);
            array_push($questions, $question);
        }
        return $questions;
    }

        private static function getRowForTeacher($pdo){
        session_start();
        $userID = (int)$_SESSION['USERID'];
        $group= (int)$_SESSION["GROUP"];
        
        $schoolDB = self::getSchoolTable($group);
        
        $sql="select je.id,je.user,je.active,je.share,je.group,je.grade,je.class,je.curriculum,school.name "
            . " from jugyouEnquete as je "
            ."left join $schoolDB as school on je.school=school.id "
            ." where je.`user` = ?";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $userID,       PDO::PARAM_INT);
        
        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
    }
    
    private static function getSchoolTable($groupIndex){
        if($groupIndex == 1){
            return COMMON_TABLE . '.schoolE';
        }else if($groupIndex == 2){
            return COMMON_TABLE . '.schoolH';
        }else{
            throw new Exception('未対応のグループ');
        }
    }
    
    public static function getByID($id){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        $row = self::getRowByID($pdo,$id);
        
        $questionsText = $row['jugyouEnqueteQuestion'];
        $questions = self::getQuestionsByQuestionText($pdo,$questionsText);
        
        $result = new jugyouEnquete($pdo,$row,$questions);
        return $result;
    }
    
    public static function create(){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        $row = self::getRow($pdo);
        //結果用配列
        
        //クエッションストリング
        $questionsText = $row['jugyouEnqueteQuestion'];
        $questions = self::getQuestionsByQuestionText($pdo,$questionsText);
        
//        //ローのクエッションを取得する（分割）
//        $questionIndexs = explode(",", $questionsText);
//        //質問配列
//        $questions = array();
//        //質問の取得
//        foreach ($questionIndexs as $index){
//            $question = jugyouEnqueteQuestion::createByID( $pdo, $index);
//            array_push($questions, $question);
//        }
        
        $result = new jugyouEnquete($pdo,$row,$questions);
        
        return $result;
    }
    
    private static function getRowByID($pdo,$id){
        $sql="select * from jugyouEnquete "
            ." where `id` = $id";
        
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute();
        $result = $stmt->fetch();
        return $result;
    }
    
    private static function getRow($pdo){
        session_start();
        $userID = (int)$_SESSION['USERID'];
        $group= (int)$_SESSION["GROUP"];
        $school = 0;
        $grade = 0;
        $class = 0;
        if($group == 1){
            $school = (int)$_SESSION["SCHOOLE"];
            $grade = (int)$_SESSION["GRADEE"];
            $class = (int)$_SESSION["CLASSE"];
        }else if($group == 2){
            $school = (int)$_SESSION["SCHOOLH"];
            $grade = (int)$_SESSION["GRADEH"];
            $class = (int)$_SESSION["CLASSH"];
        }
        
        $sql="select * from jugyouEnquete "
            ." where `active` = 2 and `group` = ? and `school` = ? and `grade` = ? and `class` = ?";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $group,       PDO::PARAM_INT);
        $stmt->bindValue(2, $school,       PDO::PARAM_INT);
        $stmt->bindValue(3, $grade,       PDO::PARAM_INT);
        $stmt->bindValue(4, $class,       PDO::PARAM_INT);

        $stmt->execute();
        $result = $stmt->fetch();
        return $result;
    }
    
    public static function insert($questions,$grade,$class,$curriculum){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        $questionsText = '';
        foreach ($questions as $question){
            $questionsText = $questionsText . $question;
            $questionsText = $questionsText . ',';
        }
        $questionsText = rtrim($questionsText, ',');
        
        //ユーザ情報の取得
        session_start();
        $userID = (int)$_SESSION['USERID'];
        $group= (int)$_SESSION["GROUP"];
        $school = 0;
        if($group == 1){
            $school = (int)$_SESSION["SCHOOLE"];
        }else if($group == 2){
            $school = (int)$_SESSION["SCHOOLH"];
        }
        
        $sql="insert into "
                . "jugyouEnquete "
                . "(`user`,`jugyouEnqueteQuestion`,`active`,`share`,`group`,`school`,`grade`,`class`,`curriculum`) "
                . "VALUES (?,?,1,2,?,?,?,?,?)";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $userID,       PDO::PARAM_INT);
        $stmt->bindValue(2, $questionsText,       PDO::PARAM_STR);
        
        $stmt->bindValue(3, $group,       PDO::PARAM_INT);
        $stmt->bindValue(4, $school,       PDO::PARAM_INT);
        $stmt->bindValue(5, $grade,       PDO::PARAM_INT);
        $stmt->bindValue(6, $class,       PDO::PARAM_INT);
        $stmt->bindValue(7, $curriculum,       PDO::PARAM_INT);

        $stmt->execute();
        
        return $pdo->lastInsertId();
    }
    
    public static function getTrs($enquetes){
        $result = '';
        foreach ($enquetes as $enquete){
            $tr = $enquete->getTr();
            $result = $result.$tr;
        }
        return $result;
    }
    
}

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

