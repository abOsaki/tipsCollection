function dataLoad(){
    var sendData = {
        'command' : "getPeriodAndCurriculumGoalAndResult",
        'userID' : userID,
        'periodID' : 0
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setPeriodGoal(data);
    }).fail(function(data){
        alert('データの取得に失敗しました');
    });
//    
//    var sendDataKamokuBetu = {
//        'command' : "getCurriculumGoal",
//        'userID' : userID,
//        'periodID' : 0
//    };
//    $.ajax({
//        url: '../mokuhyo/ajax.php',
//        type: 'POST',
//        dataType: 'json',
//        data: JSON.stringify(sendDataKamokuBetu)
//    }).done(function(data){
//        setKamokubetuGoal(data);
//    }).fail(function(data){
//        alert('データの取得に失敗しました');
//    });
}

function setPeriodGoal(pvData){
    var periodGoal = pvData[0];
    pvData.shift();
    var curriculumGoals = pvData;
    
    setResultPoint(curriculumGoals);
    
    var mokuhyoObj = mokuhyoObjUtil.getMokuhyoObjByRow(periodGoal,curriculumGoals);
    
    mokuhyoObjUtil.setData(mokuhyoObj);
    //日付のセット
//    new mokuhyoObj(data.)
    //区分のセット
    
    
}

function setResultPoint(pvCurriculumRows){
    for(var i = 0; i < pvCurriculumRows.length; i++){
        var row = pvCurriculumRows[i];
        if(row.point){
            var dom = getResultInputByCurriculumID(row.curriculumID);
            dom.value = row.point;
        }
    }
}

function getResultInputByCurriculumID(pvCurriculumID){
    var result;
    if(pvCurriculumID == 1){
        result = document.getElementById('kokugokekka');
    }else if(pvCurriculumID == 2){
        result = document.getElementById('suugakukekka');
    }else if(pvCurriculumID == 3){
        result = document.getElementById('eigokekka');
    }else if(pvCurriculumID == 4){
        result = document.getElementById('rikakekka');
    }else if(pvCurriculumID == 5){
        result = document.getElementById('shakaikekka');
    }else if(pvCurriculumID == 6){
        result = document.getElementById('ongakukekka');
    }else if(pvCurriculumID == 7){
        result = document.getElementById('bijutukekka');
    }else if(pvCurriculumID == 8){
        result = document.getElementById('gijutukekka');
    }else if(pvCurriculumID == 9){
        result = document.getElementById('hotaikekka');
    }else{
        throw new Error('未対応のCurriculumID : ' + pvCurriculumID);
    }
    return result;
}


function nextStep(){
    
    var resultObjs = getResultObjs();
    resultObjs = JSON.stringify(resultObjs);
    
    //点数をDBに保存する（保存成功時にコールバック）
    var sendData = {
        'command' : "saveCurriculumResult",
        'userID' : userID,
        'periodID' : 0,
        'kamokuDatas' : resultObjs
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        moveNext();
    }).fail(function(data){
//        alert('目標の保存に失敗しました');
    });
}

function moveNext(){
    location.href = "mokuhyoTasseido.html";
}

function getResultObjs(){
    var result = [];
    var point;
    //国語
    var kokugoDom = document.getElementById('kokugokekka');
    if(isValidateResult(kokugoDom.value)){
        point = parseInt(kokugoDom.value);
        var kokugoData = getResultMokuhyoObjInJSON(1,point);
        result.push(kokugoData);
    }
    //数学
    var suugakuDom = document.getElementById('suugakukekka');
    if(isValidateResult(suugakuDom.value)){
        point = parseInt(suugakuDom.value);
        var suugakuData = getResultMokuhyoObjInJSON(2,point);
        result.push(suugakuData);
    }
    //英語
    var eigoDom = document.getElementById('eigokekka');
    if(isValidateResult(eigoDom.value)){
        point = parseInt(eigoDom.value);
        var eigoData = getResultMokuhyoObjInJSON(3,point);
        result.push(eigoData);
    }
    //理科
    var rikaDom = document.getElementById('rikakekka');
    if(isValidateResult(rikaDom.value)){
        point = parseInt(rikaDom.value);
        var rikaData = getResultMokuhyoObjInJSON(4,point);
        result.push(rikaData);
    }
    //社会
    var shakaiDom = document.getElementById('shakaikekka');
    if(isValidateResult(shakaiDom.value)){
        point = parseInt(shakaiDom.value);
        var shakaiData = getResultMokuhyoObjInJSON(5,point);
        result.push(shakaiData);
    }
    //音楽
    var ongakuDom = document.getElementById('ongakukekka');
    if(isValidateResult(ongakuDom.value)){
        point = parseInt(ongakuDom.value);
        var ongakuData = getResultMokuhyoObjInJSON(6,point);
        result.push(ongakuData);
    }
    //美術
    var bijutuDom = document.getElementById('bijutukekka');
    if(isValidateResult(bijutuDom.value)){
        point = parseInt(bijutuDom.value);
        var bijutuData = getResultMokuhyoObjInJSON(7,point);
        result.push(bijutuData);
    }
    //技家
    var gijutuDom = document.getElementById('gijutukekka');
    if(isValidateResult(gijutuDom.value)){
        point = parseInt(gijutuDom.value);
        var gijutuData = getResultMokuhyoObjInJSON(8,point);
        result.push(gijutuData);
    }
    //保体
    var hotaiDom = document.getElementById('hotaikekka');
    if(isValidateResult(hotaiDom.value)){
        point = parseInt(hotaiDom.value);
        var hotaiData = getResultMokuhyoObjInJSON(9,point);
        result.push(hotaiData);
    }
    //返却
    return result;
    
}

function isValidateResult(pvValue){
    if(pvValue == ''){
        return false;
    }
    var parse = parseInt(pvValue);
    if(parse >= 0 && parse <= 100){
        return true;
    }
    return false;
}

function getResultMokuhyoObjInJSON(pvCurriculumID,pvPoint){
    var obj = new kamokuResultObj(pvCurriculumID,pvPoint);
    var result = JSON.stringify(obj);
    return result;
}

var kamokuResultObj = function(pvCurriculumID,pvPoint){
    this.curriculumID = pvCurriculumID;
    this.point = pvPoint;
};

function setUserID(){
    var userIDInput = document.getElementById('userIDInput');
    userIDInput.value = userID;
}

$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //ユーザIDのセットを行う
    setUserID();
    //データのロード
    dataLoad();
    
//    $('#okBtn').on('click', function () {
//        nextStep();
//    });
});