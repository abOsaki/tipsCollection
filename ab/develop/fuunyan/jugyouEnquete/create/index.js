
function saveQuestion(){
    //質問の取得
    var insertQuestion = document.getElementById('insertQuestion');
    var question = insertQuestion.value;
    //質問の選択肢数
    var selectNumberSelect = document.getElementById('selectNumberSelect');
    var selectNumber = selectNumberSelect.value;
    
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

function isValidQuestion(){
    var question = document.getElementById('insertQuestion');
    return (question.value.match(/\S/g));
}

function setValid(){
    var validationPanes = document.getElementsByClassName('validationPane');
    for(var i = 0; i < validationPanes.length; i++){
        var validationPane = validationPanes[i];
        validationPane.style.display = 'block';
    }
}

function unsetValid(){
    var validationPanes = document.getElementsByClassName('validationPane');
    for(var i = 0; i < validationPanes.length; i++){
        var validationPane = validationPanes[i];
        validationPane.style.display = 'none';
    }
}

function setQuestionTBody(pvInnerHTML){
    var questionTBody = document.getElementById('questionTBody');
    questionTBody.innerHTML = pvInnerHTML;
}

$(function () {
    "use strict";
    
    $('#addBtn').on('click', function () {
        
        if(isValidQuestion()){
            saveQuestion();
            $('#insertQuestion').val('');
            unsetValid();
        }else{
            setValid();
        }
        
//        //質問を保存する
//        saveQuestion();
    });
    
});