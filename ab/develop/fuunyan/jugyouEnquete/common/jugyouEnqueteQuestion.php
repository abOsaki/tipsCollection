<?php

require_once "../../common/php/dbConnect.php";

//js側からのデータ
$data = file_get_contents("php://input");
$param = json_decode($data, true);

$response = null;

if($param['command']=='saveQuestion'){
//    $response = jugyouEnqueteAnswer::saveAnswer($param);
    jugyouEnqueteQuestion::insert($param);
    $questionObjects = jugyouEnqueteQuestion::create();
    $response = jugyouEnqueteQuestion::getTrs($questionObjects);
    
    echo json_encode($response,JSON_UNESCAPED_UNICODE);
}

class jugyouEnqueteQuestion {
   private $id;
   private $selectedCount;
   private $questionText;
   private $share;
   function __construct($row) {
       $this->id = $row['id'];
       $this->selectedCount = $row['selectCount'];
       $this->questionText = $row['questionText'];
       $this->share = $row['share'];
   }
   
   public function getID(){
       return $this->id;
   }

      public function getQuestionPane($index){
       $result = <<< EOM
                <input type='hidden' id='question{$index}' value='{$this->id}' >
                <div class='pane' >
                    <div>質問{$index}</div>
                    <div class='questionText' id='questionText{$index}'>{$this->questionText}</div>
                    {$this::getButtonPane($this->selectedCount)}
                </div>
EOM;
        return $result;
   }
   
   private static function getButtonPane($selectCount){
       if($selectCount == 5){
           return self::get5ButtonPane();
       }else if($selectCount == 3){
           return self::get3ButtonPane();
       }
   }
   
   private static function get5ButtonPane(){
       $button1 = self::get1Button();
       $button2 = self::get2Button();
       $button3 = self::get3Button();
       $button4 = self::get4Button();
       $button5 = self::get5Button();
       
       $result = <<< EOM
               <div>
                    <div>
                        {$button1}
                    </div>
                    <div>
                        {$button2}
                    </div>
                    <div>
                        {$button3}
                    </div>
                    <div>
                        {$button4}
                    </div>
                    <div>
                        {$button5}
                    </div>
                </div>
EOM;
       return $result;
   }
   
   private static function get3ButtonPane(){
       $button1 = self::get1Button();
       $button3 = self::get3Button();
       $button5 = self::get5Button();
       
       $result = <<< EOM
               <div>
                    <div>
                        {$button1}
                    </div>
                    <div>
                        {$button3}
                    </div>    
                    <div>
                        {$button5}
                    </div>
                </div>
EOM;
       return $result;
   }
   
   private static function get1Button(){
       return "<button class='btn btn-primary answerBtn' value='1'>非常に良い</button>";
   }
   
   private static function get2Button(){
       return "<button class='btn btn-primary answerBtn' value='2'>だいたい良い</button>";
   }
   
   private static function get3Button(){
       return "<button class='btn btn-primary answerBtn' value='3'>ふつう</button>";
   }
   
   private static function get4Button(){
       return "<button class='btn btn-primary answerBtn' value='4'>あまりそう思わない</button>";
   }
   
   private static function get5Button(){
       return "<button class='btn btn-primary answerBtn' value='5'>そう思わない</button>";
   }

   private function getTr($index){
       $result = "<tr><td class='indexHeader'>$index</td><td class='questionContents'>$this->questionText<input class='questionID' type='hidden' value=$this->id></td><td><div class='togglePane'><input type='checkbox' name='questionChk[]' value=$this->id checked='checked' class='toggle' ></div></td></tr>";
       return $result;
   }


   public static function insert($param){
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        session_start();
        
        //ユーザ情報
        $userID = $_SESSION['USERID'];
        //ｉｎｆｏのセット
        $group= (int)$_SESSION["GROUP"];
        $school = 0;
        $grade = 0;
        $class = 0;
        if($group == 1){
            $school = $_SESSION["SCHOOLE"];
            $grade = $_SESSION["GRADEE"];
            $class = $_SESSION["CLASSE"];
        }else if($group == 2){
            $school = $_SESSION["SCHOOLH"];
            $grade = $_SESSION["GRADEH"];
            $class = $_SESSION["CLASSH"];
        }
        
        $sql="insert into "
                . "jugyouEnqueteQuestion "
                . "(`selectCount`,`questionText`,`share`,`user`,`group`,`school`,`grade`,`class`) "
                . "VALUES (?,?,2,?,?,?,?,?)";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $param['selectCount'],       PDO::PARAM_INT);
        $stmt->bindValue(2, $param['questionText'],       PDO::PARAM_STR);
        //以下ユーザ情報
        $stmt->bindValue(3, $userID,       PDO::PARAM_INT);
        $stmt->bindValue(4, $group,       PDO::PARAM_INT);
        $stmt->bindValue(5, $school,       PDO::PARAM_INT);
        $stmt->bindValue(6, $grade,       PDO::PARAM_INT);
        $stmt->bindValue(7, $class,       PDO::PARAM_INT);

        $stmt->execute();
    }
    
    public static function createByID($pdo,$index){
        $row = self::getRow($pdo,$index);
        $result = new jugyouEnqueteQuestion($row);
        return $result;
    }
    
    private static function getRow($pdo,$index){
        $sql="select * from jugyouEnqueteQuestion "
            ." where `id` = ?";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $index,       PDO::PARAM_INT);

        $stmt->execute();
        $result = $stmt->fetch();
        return $result;
    }

    public static function create(){
        $rows = self::getRows();
        //結果用配列
        $result = array();
        //ループ
        foreach ($rows as $row){
            //ループ内でインスタンス作成
            $jeqObj = new jugyouEnqueteQuestion($row);
            array_push($result,$jeqObj);
        }
        return $result;
    }
    
    public static function createAndGetTrs(){
        $objs = self::create();
        $result = self::getTrs($objs);
        return $result;
    }

    private static function getRows(){
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
        
        //データ取得
        $model = new dbConnect(MASTER_TABLE);
        $pdo = $model -> connectInfo();
        
        $sql="select * from jugyouEnqueteQuestion "
            ." where `share` = 1 or `user` = ?";
        
        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(1, $userID,       PDO::PARAM_INT);

        $stmt->execute();
        $result = $stmt->fetchAll();
        return $result;
    }

    public static function getTrs($enqueteQuestions){
        $result = '';
//        for($i = 0; $i < count($enqueteQuestions); $i++){
//            $enqueteQuestion = $enqueteQuestions[$i];
//            $tr = $enqueteQuestion->getTr($i+1);
//            $result = $result.$tr;
//        }
        
        $count = 1;
        foreach ($enqueteQuestions as $enqueteQuestion){
            $tr = $enqueteQuestion->getTr($count++);
            $result = $result.$tr;
        }
        
        return $result;
    }
}
