var taishoPHPDate;
function setHiduke(){
    taishoPHPDate = dateGakushuCommon.getPHPDateSession();
    var hiduke = dateGakushuCommon.getGappiTextByPHPDate(taishoPHPDate);
    var hidukeContent = document.getElementById('hidukeContent');
    hidukeContent.textContent = hiduke;
}

//初期表示
function setInitialDisplay(){
    mainKyoukaFanc.selectedKokugo();
//    addKyoukaFanc.selectedOngaku();
//    graphFunc.init();
}

var kyoukaFanc = function(){
    return {
        selected : function(pvID){
            var content = document.getElementById(pvID);
            content.style.display = 'block';
        }
    };
}();

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

var addKyoukaFanc = function(){
    function initialize(){
        var contents = document.getElementsByClassName('addKyoukaContent');
        for(var i = 0; i < contents.length; i++){
            var content = contents[i];
            content.style.display = 'none';
        }
    }
    
    function buttonSetup(pvSelectedID){
        var buttons = document.getElementsByClassName('addKyoukaBtn');
        for(var i = 0; i < buttons.length; i++){
            var button = buttons[i];
            if(button.id == pvSelectedID){
                button.className = 'addKyoukaBtn btn-primary';
            }else{
                button.className = 'addKyoukaBtn btn-default';
            }
        }
    }
    
    return{
        init : function(){
            var contents = document.getElementsByClassName('addKyoukaContent');
            for(var i = 0; i < contents.length; i++){
                var content = contents[i];
                content.style.display = 'none';
            }
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
        }
    };
}();

var gakushuTimeFunc = function(){
    function getAllTime(){
        var contents = document.getElementsByClassName('gakushuHour');
        var sum = 0;
        for(var i = 0; i < contents.length; i++){
            content = contents[i];
            sum += parseInt(content.value);
        }
        return sum;
    }
    
    function setTime(pvTime){
        var sumTimeContent = document.getElementById('sumTimeContent');
        sumTimeContent.textContent = pvTime;
    }
    
    return{
        changeTime: function(){
            var sum = getAllTime();
            setTime(sum);
            graphFunc2.allSetup();
        }
    };
}();

var graphFunc2 = function(){
    
    function allSetup(){
        setup('kokugoHour','kokugoPlanPane');
        setup('suugakuHour','suugakuPlanPane');
        setup('eigoHour','eigoPlanPane');
        setup('rikaHour','rikaPlanPane');
        setup('shakaiHour','shakaiPlanPane');
        setup('ongakuHour','ongakuPlanPane');
        setup('bijutuHour','bijutuPlanPane');
        setup('gijutuHour','gijutuPlanPane');
        setup('hotaiHour','hotaiPlanPane');
    }
    function setup(pvHourID,pvTaishoPaneID){
        var taishoPane = document.getElementById(pvTaishoPaneID);
        taishoPane.innerHTML = '';
        var hour = document.getElementById(pvHourID).value;
        var value = parseInt(hour.value);
        for(var i = 0; i < hour; i++){
            var pane = document.createElement('div');
            pane.className = 'yokoGraph';
            taishoPane.appendChild(pane);
        }
    }
    
    return{
        allSetup : function(){
            allSetup();
        }
    };
}();

var graphFunc = function(){
    
    var kokugos = [];
    var suugakus = [];
    var eigos = [];
    var rikas = [];
    var shakais = [];
    var ongakus = [];
    var bijutus = [];
    var gijutus = [];
    var hotais = [];
    
    function allSetup(){
        setup('kokugoHour',kokugos);
        setup('suugakuHour',suugakus);
        setup('eigoHour',eigos);
        setup('rikaHour',rikas);
        setup('shakaiHour',shakais);
        setup('ongakuHour',ongakus);
        setup('bijutuHour',bijutus);
        setup('gijutuHour',gijutus);
        setup('hotaiHour',hotais);
    }
    
    function setup(pvHourID,pvTaishoArray){
        var hour = document.getElementById(pvHourID);
        var value = parseInt(hour.value);
        for(var i = 0; i < 5; i++){
            pvTaishoArray[i].innerHTML = '';
            if(i < value){
                var circle = document.createElement('div');
                circle.className = 'siromaru';
                pvTaishoArray[i].appendChild(circle);
            }
        }
    }
    
    return{
        init : function(){
            for(var i = 1; i <= 5; i++){
                var kyouka,id,element;
                
                kyouka = 'kokugo';
                id = kyouka + i;
                element = document.getElementById(id);
                kokugos.push(element);
                
                kyouka = 'suugaku';
                id = kyouka + i;
                element = document.getElementById(id);
                suugakus.push(element);
                
                kyouka = 'eigo';
                id = kyouka + i;
                element = document.getElementById(id);
                eigos.push(element);
                
                kyouka = 'rika';
                id = kyouka + i;
                element = document.getElementById(id);
                rikas.push(element);
                
                kyouka = 'shakai';
                id = kyouka + i;
                element = document.getElementById(id);
                shakais.push(element);
                
                kyouka = 'ongaku';
                id = kyouka + i;
                element = document.getElementById(id);
                ongakus.push(element);
                
                kyouka = 'bijutu';
                id = kyouka + i;
                element = document.getElementById(id);
                bijutus.push(element);
                
                kyouka = 'gijutu';
                id = kyouka + i;
                element = document.getElementById(id);
                gijutus.push(element);
                
                kyouka = 'hotai';
                id = kyouka + i;
                element = document.getElementById(id);
                hotais.push(element);
            }
        },
        allSetup : function(){
            allSetup();
        }
    };
}();


function nextStep(){
    //現在の科目を保存する
    var result = getRegistValue();
    //無い場合は終了
    if(result.length < 1){
        moveNext();
        return;
    }
    //JSON形式へ
    result = JSON.stringify(result);
    
    //点数をDBに保存する（保存成功時にコールバック）
    var sendData = {
        'command' : "saveStudyPlan",
        'datas' : result,
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
//        saveSession();
        moveNext();
    }).fail(function(data){
        alert('目標の保存に失敗しました');
    });
}

function moveNext(){
    location.href = "gakushuKeikakuCalender.html";
}

function getRegistValue(){
    var result = [];
    
    var contents = document.getElementsByClassName('gakushuHour');
    for(var i = 0; i < contents.length; i++){
        var content = contents[i];
        if(content.value > 0){
            var inputData = {};
            inputData.userID = userID;
            inputData.periodID = 0;
            inputData.targetDate = taishoPHPDate;
            inputData.curriculumID = getCurriculumIdBySelectID(content.id);
            inputData.spendTime = content.value;
            inputData.gakushContent = getGakushuYoteiContentByCurriculumID(inputData.curriculumID);
            var encodeData = JSON.stringify(inputData);
            result.push(encodeData);
        }
    }
    return result;
}

function getGakushuYoteiContentByCurriculumID(pvCurriculumID){
    var taishoText;
    if(pvCurriculumID == 1){
        taishoText = document.getElementById('kokugoGakushuContent').value;
    }else if(pvCurriculumID == 2){
        taishoText = document.getElementById('suugakuGakushuContent').value;
    }else if(pvCurriculumID == 3){
        taishoText = document.getElementById('eigoGakushuContent').value;
    }else if(pvCurriculumID == 4){
        taishoText = document.getElementById('rikaGakushuContent').value;
    }else if(pvCurriculumID == 5){
        taishoText = document.getElementById('shakaiGakushuContent').value;
    }else if(pvCurriculumID == 6){
        taishoText = document.getElementById('ongakuGakushuContent').value;
    }else if(pvCurriculumID == 7){
        taishoText = document.getElementById('bijutuGakushuContent').value;
    }else if(pvCurriculumID == 8){
        taishoText = document.getElementById('gijutuGakushuContent').value;
    }else if(pvCurriculumID == 9){
        taishoText = document.getElementById('hotaiGakushuContent').value;
    }else{
        throw new Error('未対応のＩＤ :' + pvCurriculumID);
    }
    return taishoText;
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

function getSelectIdByCurriculumID(pvCurriculumID){
    var curriculumID = parseInt(pvCurriculumID);
    if(curriculumID == 1){
        return 'kokugoHour';
    }else if(curriculumID == 2){
        return 'suugakuHour';
    }else if(curriculumID == 3){
        return 'eigoHour';
    }else if(curriculumID == 4){
        return 'rikaHour';
    }else if(curriculumID == 5){
        return 'shakaiHour';
    }else if(curriculumID == 6){
        return 'ongakuHour';
    }else if(curriculumID == 7){
        return 'bijutuHour';
    }else if(curriculumID == 8){
        return 'gijutuHour';
    }else if(curriculumID == 9){
        return 'hotaiHour';
    }else{
        throw new Error('未対応のＩＤ :' + curriculumID);
    }
}

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
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        dateSet(data);
    }).fail(function(data){
        alert('データの取得に失敗しました')
    });
}

function dateSet(pvData){
    //取得したデータから、コントロールをセットする
    for(var i = 0; i < pvData.length; i++){
        var data = pvData[i];
        //カリキュラムＩＤからセレクトＩＤ取得
        var selectID = getSelectIdByCurriculumID(data.curriculumID);
        //セレクトの取得
        var select = document.getElementById(selectID);
        //セレクトに値のセット
        select.value = data.spendTime;
    }
    gakushuTimeFunc.changeTime();
}


$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //日付のセット
    setHiduke();
    //初期表示
    setInitialDisplay();
    //ロード
    loadKeikakuData();
    
//    //目標を取得する
//    loadMokuhyoData();
//    //目標をタイトルにセットする
//    
//    //月ごとのボタンを取得する
    
    
    
//    var calender = getCalender();
//    var calenderPane = document.getElementById('calenderPane');
//    calenderPane.appendChild(calender);
//    
//    
//    $(document).on('click', '#zenkaiKirokumiruButton', function () {
//        location.href = "../zenkaiKiroku";
//    });
    
//    $('#calender').on('click', 'a', function () {
//        setDate(this);
//        location.href = "gakushuKeikakuSettei.html"
//    });
    
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
//        addKyoukaFanc.selectedOngaku();
    });
    
    $(document).on('click touchend', '#bijutuBtn', function () {
        mainKyoukaFanc.selectedBijutu();
//        addKyoukaFanc.selectedBijutu();
    });
    
    $(document).on('click touchend', '#gijutuBtn', function () {
        mainKyoukaFanc.selectedGijutu();
//        addKyoukaFanc.selectedGijutu();
    });
    
    $(document).on('click touchend', '#hotaiBtn', function () {
        mainKyoukaFanc.selectedHotai();
//        addKyoukaFanc.selectedHotai();
    });
    
    $(document).on('change', '.gakushuHour', function () {
        gakushuTimeFunc.changeTime();
    });
    
    $('#saveBtn').on('click', function () {
        nextStep();
    });
    
    $('.breadcrumb').on('touchend', '#menu', function () {
        location.href = "../menu/";
    });
    
});