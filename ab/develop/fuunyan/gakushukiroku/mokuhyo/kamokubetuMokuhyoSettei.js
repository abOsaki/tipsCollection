function initializeMokuhyoSelect(pvMokuhyoSelect){
    pvMokuhyoSelect.selectedIndex = 14;
}

function initializeAllKamokuMokuhyoSelect(){
    var mokuhyoSelects = document.getElementsByClassName('mokuhyoSelect');
    for(var i = 0; i < mokuhyoSelects.length; i++){
        var taisho = mokuhyoSelects[i];
        initializeMokuhyoSelect(taisho);
    }
}

function setKamokuSelectByPeriodGoal(){
    //点数をDBに保存する（保存成功時にコールバック）
    var sendData = {
        'command' : "getPeriodGoal",
        'userID' : userID,
        'periodID' : 0,
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        setKamokuSelect(data);
    }).fail(function(data){
    });
}

function setKamokuSelect(pvData){
    var data = pvData[0];
    
    if(data.curriculumID == 0){
        var kokugoSelect = document.getElementById('kokugoSelect');
        kokugoSelect.value = data.goalPoint;
        var suugakuSelect = document.getElementById('suugakuSelect');
        suugakuSelect.value = data.goalPoint;
        var eigoSelect = document.getElementById('eigoSelect');
        eigoSelect.value = data.goalPoint;
        var rikaSelect = document.getElementById('rikaSelect');
        rikaSelect.value = data.goalPoint;
        var shakaiSelect = document.getElementById('shakaiSelect');
        shakaiSelect.value = data.goalPoint;
        
    }else if(data.curriculumID == 1){
        var kokugoSelect = document.getElementById('kokugoSelect');
        kokugoSelect.value = data.goalPoint;
    }else if(data.curriculumID == 2){
        var suugakuSelect = document.getElementById('suugakuSelect');
        suugakuSelect.value = data.goalPoint;
    }else if(data.curriculumID == 3){
        var eigoSelect = document.getElementById('eigoSelect');
        eigoSelect.value = data.goalPoint;
    }else if(data.curriculumID == 4){
        var rikaSelect = document.getElementById('rikaSelect');
        rikaSelect.value = data.goalPoint;
    }else if(data.curriculumID == 5){
        var shakaiSelect = document.getElementById('shakaiSelect');
        shakaiSelect.value = data.goalPoint;
    }
}

function getRegistValue(){
    var result = [];
    result['userID'] = userID;
    result['periodID'] = 0;
    result['kokugoPoint'] = parseInt(document.getElementById("kokugoSelect").value);
    result['suugakuPoint'] = parseInt(document.getElementById("suugakuSelect").value);
    result['eigoPoint'] = parseInt(document.getElementById("eigoSelect").value);
    result['rikaPoint'] = parseInt(document.getElementById("rikaSelect").value);
    result['shakaiPoint'] = parseInt(document.getElementById("shakaiSelect").value);
    return result;
}

function nextStep(){
    //結果の取得
    var result = getRegistValue();
    
    //点数をDBに保存する（保存成功時にコールバック）
    var sendData = {
        'command' : "saveCurriculumGoal",
        'userID' : userID,
        'periodID' : result['periodID'],
        'kokugoPoint' : result['kokugoPoint'],
        'suugakuPoint' : result['suugakuPoint'],
        'eigoPoint' : result['eigoPoint'],
        'rikaPoint' : result['rikaPoint'],
        'shakaiPoint' : result['shakaiPoint']
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        moveNext();
    }).fail(function(data){
        alert('目標の保存に失敗しました');
    });
    
}

function moveNext(){
    location.href = "../menu/";
}

$(function () {
    "use strict";
    
    loginCheck();
    
    initializeAllKamokuMokuhyoSelect();
    
    setKamokuSelectByPeriodGoal();
    
    $(document).on('click', '#completeButton', function () {
        nextStep();
    });
    
    $('.breadcrumb').on('touchend', '#menu', function () {
        location.href = "../menu/";
    });
    
});