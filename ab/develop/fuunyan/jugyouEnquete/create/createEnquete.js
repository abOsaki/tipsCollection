function saveQuestion(){
    //質問の取得
    var insertQuestion = document.getElementById('questionInsert');
    var question = insertQuestion.value;
    //質問の選択肢数
//    var selectNumberSelect = document.getElementById('selectNumberSelect');
//    var selectNumber = selectNumberSelect.value;
    
    var selectNumber = 5;
    
    //目標を取得する
    var sendData = {
        'command' : "saveQuestion",
        'selectCount' : selectNumber,
        'questionText' : question
    };
    $.ajax({
        url: '../common/jugyouEnqueteQuestion.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        //ＴＢＯＤＹの内容を返して
        setQuestionTBody(data);
    }).fail(function(data){
    });
}

function setQuestionTBody(pvInnerHTML){
    var questionTBody = document.getElementById('questionTBody');
    questionTBody.innerHTML = pvInnerHTML;
    
    $('.toggle').bootstrapToggle({
      on: '使用',
      off: '不使用'
    });
}

function setInitializeGakunenClassInfo(){
    var gakunen = document.getElementById('gakunen').value;
    var gakunenSelect = document.getElementById('gakunenSelect');
    gakunenSelect.value = gakunen;
    
    var classValue = document.getElementById('class').value;
    var classSelect = document.getElementById('classSelect');
    classSelect.value = classValue;
}

$(function () {
    "use strict";
    
    setInitializeGakunenClassInfo();
    
    $('.toggle').bootstrapToggle({
      on: '使用',
      off: '不使用'
    });
    
    $('#addBtn').on('click', function () {
        saveQuestion();
        
        //バリデーション
//        if(isValidQuestion()){
//            saveQuestion();
//            $('#insertQuestion').val('');
//            unsetValid();
//        }else{
//            setValid();
//        }
    });
    
});