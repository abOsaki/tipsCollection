function loginCheck(){
    var userID = document.getElementById('userID').value;
    if(!userID){
        comfn.message_ok('ログアウト', '時間がたったので<br>一度ログアウトしました！', function () {
        location.href = comfn.SS.getName('HOME',"1");
        });
    }
}

var answer = function(pvIndex,pvQuestionID,pvQuestionText,pvAnswerIndex,pvAnswerText){
    this.index = pvIndex;
    this.questionID = pvQuestionID;
    this.questionText = pvQuestionText;
    this.answerindex = pvAnswerIndex;
    this.answerText = pvAnswerText;
};

answer.prototype.getSendJsonData = function(){
    var result = {
        userID : basicInfo.userID(),
        jugyouEnqueteQuestion : this.questionID,
        answerNumber : this.answerindex,
        jugyouEnquete : basicInfo.jugyouEnquete()
    };
    
    return JSON.stringify(result);
};

answer.prototype.getKakuninTR = function(pvIndex){
//    //クラスネーム
//    var className;
//    if(parseInt(pvIndex) % 2 == 0){
//        className = 'info';
//    }else{
//        className = 'active';
//    }
//    
    //TRを作成
    var result = document.createElement('tr');
    
    //indexTD
    var indexTD = document.createElement('td');
//    indexTD.className = className;
    indexTD.textContent = this.index;
    result.appendChild(indexTD);
    //質問文TD
    var questionTD = document.createElement('td');
//    questionTD.className = className;
    questionTD.textContent = this.questionText;
    result.appendChild(questionTD);
    
    //答え文言
    var answerTD = document.createElement('td');
//    answerTD.className = className;
    answerTD.textContent = this.answerText;
    result.appendChild(answerTD);
    
    
    return result;
};

var questionManage = function(){
    var currentQuestion = 0;
    var answers;
    var questionPanes;
    var currentPane;
    
    function fadeOutCurrentPane(pvCollback){
        if(currentPane){
            $(currentPane).fadeOut("slow",pvCollback);
        }else{
            pvCollback();
        }
    }
    
    function visibleCurrentPane(){
        if(currentQuestion >= questionPanes.length){
            visibleKakuninPane();
        }
        
        for(var i = 0; i < questionPanes.length; i++){
            var pane = questionPanes[i];
            if(i == currentQuestion){
                currentPane = pane;
                $(currentPane).fadeIn("slow");
//                pane.style.display = 'block';
            }else{
                pane.style.display = 'none';
            }
        }
    }
    
    function visibleKakuninPane(){
        questionKakunin.display(answers);
    }
    
    return {
        setQuestionPanes : function(){
            questionPanes = document.getElementsByClassName('pane');
            answers = new Array(questionPanes.length);
        },
        visibleCurrentPane : function(){
            visibleCurrentPane();
        },
        moveNextQuestion : function(){
            currentQuestion++;
            fadeOutCurrentPane(visibleCurrentPane);
//            visibleCurrentPane();
        },
        setAnswerData : function(pvButton){
            var index = currentQuestion + 1;
            var taishoID = 'question' + index;
            var questionID = document.getElementById(taishoID).value;
            
            taishoID = 'questionText' + index;
            var questionText = document.getElementById(taishoID).textContent;
            
            //答えオブジェクトの作成
            var answerObj = new answer(index,questionID,questionText,pvButton.value,pvButton.textContent);
            answers[currentQuestion] = answerObj;
        }
    };
}();

var questionKakunin = function(){
    
    var answers;
    function display(){
        var tbody = document.getElementById('questionKakuninTBody');
        for(var i = 0; i < answers.length; i++){
            var answer = answers[i];
            var tr = answer.getKakuninTR(i);
            tbody.appendChild(tr);
        }
        
        
        var $kakunin = $('#kakuninPane');
        $kakunin.fadeIn("slow");
        
//        var kakuninPane = document.getElementById('kakuninPane');
//        kakuninPane.style.visibility = 'visible';
        
    }
    
    function sendSaveData(){
        var sendAnswers = [];
        for(var i = 0; i < answers.length; i++){
            var answer = answers[i];
            var sendData = answer.getSendJsonData();
            sendAnswers.push(sendData);
        }
        sendAnswers = JSON.stringify(sendAnswers);
        
        //目標を取得する
        var sendData = {
            'command' : "saveAnswer",
            'answers' : sendAnswers,
        };
        $.ajax({
            url: '../common/jugyouEnqueteAnswer.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function(data){
            location.href = 'complete.php';
        }).fail(function(data){
        });
    }
    
    return {
        display : function(pvAnswers){
            answers = pvAnswers;
            display();
            
        },
        sendSaveData : function(){
            sendSaveData();
        }
    }
}();

var basicInfo = function(){
    
    return {
        
        userID : function(){
            var userID = document.getElementById('userID');
            return userID.value;
        },
        jugyouEnquete : function(){
            var enqueteID = document.getElementById('enqueteID');
            return enqueteID.value;
        }
        
    }
}();

function isEnqueteValid(){
    var enqueteID = document.getElementById('enqueteID').value;
    return enqueteID;
}


$(function () {
    "use strict";
    loginCheck();
    
    //解答可能なアンケートがあるかのチェック
    if(isEnqueteValid() == 0){
        $('.questionPane').hide();
        //質問が存在しない
        comfn.message_ok('質問がありません', '現在、質問はありません。<br>メニューにもどります！', function () {
            history.back();
        });
    }
    
    questionManage.setQuestionPanes();
    questionManage.visibleCurrentPane();
    
    $('.answerBtn').on('click', function () {
        questionManage.setAnswerData(this);
        questionManage.moveNextQuestion();
    });
    
    $('#sendBtn').on('click', function () {
        questionKakunin.sendSaveData();
    });
    
//    var uri = "ws://" + location.host + ":9000/osaki/activepro/activestation/demo2/fuunyan/jugyouEnquete/socket.php";
//    var ws = new WebSocket(uri);
//    
//    ws.onopen = function(){
//        alert('connected');
//    };
    
    
});