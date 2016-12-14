var taishoPHPDate;
function setHiduke(){
    taishoPHPDate = dateGakushuCommon.getPHPDateSession();
    var hiduke = dateGakushuCommon.getGappiTextByPHPDate(taishoPHPDate);
    var hidukeContent = document.getElementById('hidukeContent');
    hidukeContent.textContent = hiduke;
}

function getGakushuJissekiTR(){
    var result = document.createElement('tr');
    var kyoukaTD = document.createElement('td');
    var kyoukaSelect = document.createElement('select');
    kyoukaSelect.className = 'kyoukaSelect';
    for(var i = 1; i <= 9; i++){
        var option = document.createElement('option');
        option.value = i;
        option.textContent = getKyoukaText(i);
        kyoukaSelect.appendChild(option);
    }
    kyoukaTD.appendChild(kyoukaSelect);
    result.appendChild(kyoukaTD);
    //時間
    var hourTD = document.createElement('td');
    var hourSelect = document.createElement('select');
    hourSelect.className = 'hourSelect';
    for(var i = 0; i <= 5; i++){
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        hourSelect.appendChild(option);
    }
    hourTD.appendChild(hourSelect);
    //単位
    var taniSpan = document.createElement('span');
    taniSpan.textContent = '時間';
    hourTD.appendChild(taniSpan);
    result.appendChild(hourTD);
    result.className = 'contentArea';
    
    return result;
}


function getKyoukaOptions(){
    var result = [];
    
    for(var i = 1; i <= 9; i++){
        var option = document.createElement('option');
        option.value = i;
        option.textContent = getKyoukaText(i);
        result.push(option);
    }
    
//    var kokugoOption = document.createElement('option');
//    kokugoOption.value = 1;
//    kokugoOption.textContent = '国語';
//    result.push(kokugoOption);
//    
//    var suugakuOption = document.createElement('option');
//    suugakuOption.value = 2;
//    kokugoOption.textContent = '国語';
//    result.push(suugakuOption);
//    
//    var eigoOption = document.createElement('option');
//    eigoOption.value = 3;
//    kokugoOption.textContent = '国語';
//    result.push(eigoOption);
//    
//    var rikaOption = document.createElement('option');
//    rikaOption.value = 4;
//    kokugoOption.textContent = '国語';
//    result.push(rikaOption);
//    
//    var shakaiOption = document.createElement('option');
//    shakaiOption.value = 5;
//    kokugoOption.textContent = '国語';
//    result.push(shakaiOption);
//    
//    var ongakuOption = document.createElement('option');
//    ongakuOption.value = 6;
//    kokugoOption.textContent = '国語';
//    result.push(ongakuOption);
//    
//    var bijutuOption = document.createElement('option');
//    bijutuOption.value = 7;
//    kokugoOption.textContent = '国語';
//    result.push(bijutuOption);
//    
//    var gijutuOption = document.createElement('option');
//    gijutuOption.value = 8;
//    result.push(gijutuOption);
//    
//    var hotaiOption = document.createElement('option');
//    hotaiOption.value = 9;
//    result.push(hotaiOption);
//    
    return result;
}

var keikakuFunc = function(){
    function loadKeikakuData(){
        //日付から計画データを取得する
        //対象日付からデータを取得する
        var sendData = {
            'command' : "getStudyPlanFromDate",
            'userID' : userID,
            'periodID' : 0,
            'targetDate' : taishoPHPDate
        };
        $.ajax({
            url: '../keikaku/ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData),
        }).done(function(data){
            setKeikakuData(data);
        }).fail(function(data){
            alert('データの取得に失敗しました')
        });
    }

    function setKeikakuData(pvData){
        var table = document.getElementById('gakushuTable');
        for(var i = 0; i < pvData.length; i++){
            var data = pvData[i];
            
            //ＴＲを作成し、テーブルに格納し、値をセットする
            var tr = getGakushuJissekiTR();
            //
            $(tr).find('.kyoukaSelect')[0].value = data.curriculumID;
//            $(tr).find('.hourSelect')[0].value = data.spendTime;
            
            table.appendChild(tr);
        }
    }
    
    
    
    return {
        load : function(){
            loadKeikakuData();
        }
        
    };
    
}();

function nextStep(){
    //結果の取得
    var result = getRegistValue();
    //JSON形式へ
    result = JSON.stringify(result);
    
    //点数をDBに保存する（保存成功時にコールバック）
    var sendData = {
        'command' : "saveStudyLog",
        'datas' : result
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        moveNext();
    }).fail(function(data){
        alert('目標の保存に失敗しました');
    });
}

function getRegistValue(){
    var result = [];
    
    var contents = document.getElementsByClassName('gakushuHour');
    var sleepAmountValue = document.getElementById('sleepTime').value;
    var tubuyakiKind = $("input:radio[name='tubuyakiKubun']:checked").val();
    for(var i = 0; i < contents.length; i++){
        var content = contents[i];
        if(content.value > 0){
            var inputData = {};
            inputData.userID = userID;
            inputData.periodID = 0;
            inputData.targetDate = taishoPHPDate;
            inputData.curriculumID = getCurriculumIdBySelectID(content.id);
            inputData.spendTime = content.value;
//            inputData.gakushContent = getGakushuYoteiContentByCurriculumID(inputData.curriculumID);
            inputData.sleepAmount = sleepAmountValue;
            inputData.tubuyakiKind = tubuyakiKind;
            var encodeData = JSON.stringify(inputData);
            result.push(encodeData);
        }
    }
    return result;
}

function getCurriculumIdBySelectID(pvSelectID){
    if(pvSelectID == 'kokugoHour'){
        return 1;
    }else if(pvSelectID == 'suugakuHour'){
        return 2;
    }else if(pvSelectID == 'eigoHour'){
        return 3;
    }else if(pvSelectID == 'rikaHour'){
        return 4;
    }else if(pvSelectID == 'shakaiHour'){
        return 5;
    }else if(pvSelectID == 'ongakuHour'){
        return 6;
    }else if(pvSelectID == 'bijutuHour'){
        return 7;
    }else if(pvSelectID == 'gijutuHour'){
        return 8;
    }else if(pvSelectID == 'hotaiHour'){
        return 9;
    }else{
        throw new Error('未対応のＩＤ :' + pvSelectID);
    }
}

//function getRegistValue(){
//    var result = [];
//    
//    //コンテントエリアの取得
//    var contentAreas = document.getElementsByClassName('contentArea');
//    for(var i = 0; i < contentAreas.length; i++){
//        var contentArea = contentAreas[i];
//        var kamokuValue = $(contentArea).find('.kyoukaSelect')[0].value;
//        var hourValue = $(contentArea).find('.hourSelect')[0].value;
//        var sleepAmountValue = document.getElementById('sleepTime').value;
//        var tubuyakiKind = $("input:radio[name='tubuyakiKubun']:checked").val();
//        
//        //科目と時間の値が有効である
//        if((kamokuValue > 0) && (hourValue > 0)){
//            var inputData = {};
//            inputData.userID = userID;
//            inputData.periodID = 0;
//            inputData.targetDate = taishoPHPDate;
//            inputData.curriculumID = kamokuValue;
//            inputData.spendTime = hourValue;
//            inputData.sleepAmount = sleepAmountValue;
//            inputData.tubuyakiKind = tubuyakiKind;
//            
//            //教材とページの値が有効である
////            var kyouzaiValue = $(contentArea).find('.kyouzaiSelect')[0].value;
////            var pageValue = $(contentArea).find('.pageSelect')[0].value;
////            if((kyouzaiValue > 0) && (pageValue > 0)){
////                inputData.workbookID = kyouzaiValue;
////                inputData.workbookAmount = pageValue;
////            }
//            var inputDataJ = JSON.stringify(inputData);
//            result.push(inputDataJ);
//        }
//    }
//    
//    return result;
//}

function moveNext(){
    location.href = "gakushuJissekiResult.html";
}

var mainKyoukaFanc = function(){
    function initialize(){
        var contents = document.getElementsByClassName('mainKyoukaContent');
        for(var i = 0; i < contents.length; i++){
            var content = contents[i];
            content.style.display = 'none';
        }
    }
    
    function buttonSetup(pvSelectedID){
        var buttons = document.getElementsByClassName('mainKyoukaBtn');
        for(var i = 0; i < buttons.length; i++){
            var button = buttons[i];
            if(button.id == pvSelectedID){
                button.className = 'mainKyoukaBtn btn-primary';
            }else{
                button.className = 'mainKyoukaBtn btn-default';
            }
        }
    }
    
    return{
        init : function(){
            initialize();
        },
        selectedKokugo : function(){
            initialize();
            kyoukaFanc.selected('kokugoContent');
            buttonSetup('kokugoBtn');
        },
        selectedSuugaku : function(){
            initialize();
            kyoukaFanc.selected('suugakuContent');
            buttonSetup('suugakuBtn');
        },
        selectedEigo : function(){
            initialize();
            kyoukaFanc.selected('eigoContent');
            buttonSetup('eigoBtn');
        },
        selectedRika : function(){
            initialize();
            kyoukaFanc.selected('rikaContent');
            buttonSetup('rikaBtn');
        },
        selectedShakai : function(){
            initialize();
            kyoukaFanc.selected('shakaiContent');
            buttonSetup('shakaiBtn');
        },
        selectedOngaku : function(){
            initialize();
            kyoukaFanc.selected('ongakuContent');
            buttonSetup('ongakuBtn');
        },
        selectedBijutu : function(){
            initialize();
            kyoukaFanc.selected('bijutuContent');
            buttonSetup('bijutuBtn');
        },
        selectedGijutu : function(){
            initialize();
            kyoukaFanc.selected('gijutuContent');
            buttonSetup('gijutuBtn');
        },
        selectedHotai : function(){
            initialize();
            kyoukaFanc.selected('hotaiContent');
            buttonSetup('hotaiBtn');
        },
        buttonSetup : function(pvSelectdID){
            buttonSetup(pvSelectdID);
        }
    };
}();

//初期表示
function setInitialDisplay(){
    mainKyoukaFanc.selectedKokugo();
}

var kyoukaFanc = function(){
    return {
        selected : function(pvID){
            var content = document.getElementById(pvID);
            content.style.display = 'block';
        }
    };
}();

$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //日付のセット
    setHiduke();
    //初期セット
    setInitialDisplay();
    //学習計画のロード
//    keikakuFunc.load();
    
    
    
    $('#nextButton').on('click', function () {
        nextStep();
    });
    
    $('#saveBtn').on('click', function () {
        nextStep();
    });
    
    $('.breadcrumb').on('touchend', '#menu', function () {
        location.href = "../menu/";
    });
    
    $(document).on('click touchend', '#kokugoBtn', function () {
        mainKyoukaFanc.selectedKokugo();
    });
    
    $(document).on('click touchend', '#suugakuBtn', function () {
        mainKyoukaFanc.selectedSuugaku();
    });
    
    $(document).on('click touchend', '#eigoBtn', function () {
        mainKyoukaFanc.selectedEigo();
    });
    
    $(document).on('click touchend', '#rikaBtn', function () {
        mainKyoukaFanc.selectedRika();
    });
    
    $(document).on('click touchend', '#shakaiBtn', function () {
        mainKyoukaFanc.selectedShakai();
    });
    
    $(document).on('click touchend', '#ongakuBtn', function () {
        mainKyoukaFanc.selectedOngaku();
    });
    
    $(document).on('click touchend', '#bijutuBtn', function () {
        mainKyoukaFanc.selectedBijutu();
    });
    
    $(document).on('click touchend', '#gijutuBtn', function () {
        mainKyoukaFanc.selectedGijutu();
    });
    
    $(document).on('click touchend', '#hotaiBtn', function () {
        mainKyoukaFanc.selectedHotai();
    });
    
});