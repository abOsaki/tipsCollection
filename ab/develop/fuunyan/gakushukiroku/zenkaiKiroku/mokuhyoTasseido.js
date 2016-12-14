function dataLoad(){
    
    var sendData = {
        'command' : "getCurriculumGoalResult",
        'userID' : userID,
        'periodID' : 0
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setData(data);
    }).fail(function(data){
        alert('データの取得に失敗しました');
    });
}

function setData(pvData){
    for(var i = 0; i < pvData.length; i++){
        var data = pvData[i];
        var obj = new mokuhyoResultObj(data);
        setHyoukaDisplay(obj);
    }
}

function setHyoukaDisplay(pvDataObj){
    var pane = getCurriculumPane(pvDataObj.curriculumID);
    var hyoukaPoint = pvDataObj.getHyoukaPoint();
    for(var i = 0; i < hyoukaPoint; i++){
        var span = document.createElement('span');
        span.textContent = '☆';
        pane.appendChild(span);
    }
}

function getCurriculumPane(pvCurriculumID){
    var result;
    if(pvCurriculumID == 1){
        result = document.getElementById('kokugoPane');
    }else if(pvCurriculumID == 2){
        result = document.getElementById('suugakuPane');
    }else if(pvCurriculumID == 3){
        result = document.getElementById('eigoPane');
    }else if(pvCurriculumID == 4){
        result = document.getElementById('rikaPane');
    }else if(pvCurriculumID == 5){
        result = document.getElementById('shakaiPane');
    }else if(pvCurriculumID == 6){
        result = document.getElementById('ongakuPane');
    }else if(pvCurriculumID == 7){
        result = document.getElementById('bijutuPane');
    }else if(pvCurriculumID == 8){
        result = document.getElementById('gijutuPane');
    }else if(pvCurriculumID == 9){
        result = document.getElementById('hotaiPane');
    }else{
        throw new Error('未対応のCurriculumID : ' + pvCurriculumID);
    }
    return result;
}

var mokuhyoResultObj = function(pvData){
    this.curriculumID = pvData.curriculumID;
    this.goalPoint = parseInt(pvData.goalPoint);
    this.point = parseInt(pvData.point);
}
mokuhyoResultObj.prototype.getHyoukaPoint = function(){
    if(this.goalPoint && this.point){
        var sa = this.point - this.goalPoint;
        if(sa < 0){
            return 1;
        }else if(sa <= 10){
            return 3;
        }else{
            return 5;
        }
    }else{
        return 0;
    }
};

function clearAllActive(){
    var contentPanes = document.getElementsByClassName('contentPane');
    for(var i = 0; i < contentPanes.length; i++){
        var contentPane = contentPanes[i];
        contentPane.className = 'contentPane hidden';
    }
    var kubunBtns = document.getElementsByClassName('kubunBtn');
    for(var i = 0; i < kubunBtns.length; i++){
        var kubunBtn = kubunBtns[i];
        kubunBtn.className = 'kubunBtn btn-default';
    }
}

function testActive(){
    clearAllActive();
    //ペーンの表示
    var testPane = document.getElementById('testPane');
    testPane.className = 'contentPane';
    //ボタン
    var testBtn = document.getElementById('testBtn');
    testBtn.className = 'kubunBtn btn-primary';
}

function gakushActive(){
    clearAllActive();
    //ペーンの表示
    var gakushuPane = document.getElementById('gakushuPane');
    gakushuPane.className = 'contentPane';
    //ボタン
    var gakushuBtn = document.getElementById('gakushuBtn');
    gakushuBtn.className = 'kubunBtn btn-primary';
}

$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //データのロード
//    dataLoad();
    
    $(document).on('click', '#okBtn', function () {
        location.href = "../menu/";
    });
    
    $(document).on('touchend', '#okBtn', function () {
        location.href = "../menu/";
    });
    
    $('#testBtn').on('click', function () {
        testActive();
    });
    
    $('#gakushuBtn').on('click', function () {
        gakushActive();
    });
    
});