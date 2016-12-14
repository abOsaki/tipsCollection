var contentTemplateInnerHTML;
function setContentTemplate(){
    var contentTemplatePane = document.getElementById('contentTemplate');
    //alert(contentTemplatePane.innerHTML);
    contentTemplateInnerHTML = contentTemplatePane.innerHTML;
    
}

function addContentTemplate(){
    var newContent = document.createElement('div');
    newContent.className = 'text-center contentKoumoku';
    newContent.innerHTML = contentTemplateInnerHTML;
    
    var container = document.getElementById('contantContainer');
    container.appendChild(newContent);
}

function readyCalender(){

//    var mindate = param.sheet.dateFrom;
//    var mindateFormat = new Date(mindate.replace(/-/g, '/'));

    $("#calender").datepicker({
//        minDate : mindateFormat,
//        maxDate : '0d',
        //ボタン
        showOn : "button",
        buttonImage: "../../common/images/calendar-icon.png",
        buttonImageOnly: true,
    });

    // 日本語化
    $.datepicker.regional['ja'] = {

        closeText: '閉じる',
        prevText: '<前',
        nextText: '次>',
        currentText: '今日',
        monthNames: ['1月','2月','3月','4月','5月','6月',
        '7月','8月','9月','10月','11月','12月'],
        monthNamesShort: ['1月','2月','3月','4月','5月','6月',
        '7月','8月','9月','10月','11月','12月'],
        dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
        dayNamesShort: ['日','月','火','水','木','金','土'],
        dayNamesMin: ['日','月','火','水','木','金','土'],
        weekHeader: '週',
        dateFormat: 'yy年mm月dd日(D)',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'};
    $.datepicker.setDefaults($.datepicker.regional['ja']);
}

function setJissekiHiduke(){
    //本日の日付を取得する
    taishoDate = comfn.getTodayDate();
    //カレンダーのセット
    var calender = document.getElementById('calender');
    calender.value = taishoDate.getCalenderValue();
    
    //本日の日付から実績を取得する
    
    
}
var taishoDate;

function getRegistValue(){
    var result = [];
    
    //コンテントエリアの取得
    var contentAreas = document.getElementsByClassName('contentArea');
    for(var i = 0; i < contentAreas.length; i++){
        var contentArea = contentAreas[i];
        var kamokuValue = $(contentArea).find('.kamokuSelect')[0].value;
        var hourValue = $(contentArea).find('.hourSelect')[0].value;
        
        //科目と時間の値が有効である
        if((kamokuValue > 0) && (hourValue > 0)){
            var inputData = {};
            inputData.userID = userID;
            inputData.periodID = 0;
            inputData.targetDate = taishoDate.getToString();
            inputData.curriculumID = kamokuValue;
            inputData.spendTime = hourValue;
            //教材とページの値が有効である
            var kyouzaiValue = $(contentArea).find('.kyouzaiSelect')[0].value;
            var pageValue = $(contentArea).find('.pageSelect')[0].value;
            if((kyouzaiValue > 0) && (pageValue > 0)){
                inputData.workbookID = kyouzaiValue;
                inputData.workbookAmount = pageValue;
            }
            var inputDataJ = JSON.stringify(inputData);
            result.push(inputDataJ)
        }
    }
    
    return result;
}

function nextStep(){
    //結果の取得
    var result = getRegistValue();
    //JSON形式へ
    result = JSON.stringify(result);
    
    //点数をDBに保存する（保存成功時にコールバック）
    var sendData = {
        'command' : "saveStudyLog",
        'datas' : result,
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        saveSession();
        moveNext();
    }).fail(function(data){
        alert('目標の保存に失敗しました');
    });    
}

function saveSession(){
    //計画の対象日付をセットする
    sessionStorage.setItem('keikakuJisseki',taishoDate.getToString());
}

function moveNext(){
    location.href = "jissekiKanryou.html";
}

function calenderChanged(){
    var dateString = document.getElementById("calender").value;
    var year = parseInt(dateString.split("年")[0]);
    var month = parseInt(dateString.split("年")[1]);
    var day = parseInt(dateString.split("月")[1]);
    var date = new Date(year,month - 1,day);
    taishoDate = new dateInfo(date);
    
    loadData();
}

function loadData(){
    //日付から計画データを取得する
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyLogFromDate",
        'userID' : userID,
        'periodID' : 0,
        'targetDate' : taishoDate.getToString()
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
    //初期処理（すべてのコントロールを未入力状態にする）
    dataLoadInitialize();
    //取得したデータから、コントロールをセットする
    for(var i = 0; i < pvData.length; i++){
        var data = pvData[i];
        //カリキュラムが同じ値になっているkamokuSelectの親を取得する
        var kamokuPane = getKamokuPane(data.curriculumID);
        //科目ペーンにデータをセットする
        setKamokuPaneValue(kamokuPane,data);
    }
}

function dataLoadInitialize(){
    //時間セレクト
    var hourSelects = document.getElementsByClassName('hourSelect');
    for(var i = 0; i < hourSelects.length; i++){
        var hourSelect = hourSelects[i];
        hourSelect.value = 0;
        hourSelect.className = 'hourSelect backgroundPink';
    }
    //教材セレクト
    var kyouzaiSelects = document.getElementsByClassName('kyouzaiSelect');
    for(var i = 0; i < kyouzaiSelects.length; i++){
        var kyouzaiSelect = kyouzaiSelects[i];
        kyouzaiSelect.value = 0;
        kyouzaiSelect.className = 'kyouzaiSelect backgroundPink';
    }
    //頁セレクト
    var pageSelects = document.getElementsByClassName('pageSelect');
    for(var i = 0; i < pageSelects.length; i++){
        var pageSelect = pageSelects[i];
        pageSelect.value = 0;
        pageSelect.className = 'pageSelect backgroundPink';
    }
    
}

function getKamokuPane(pvCurriculumID){
    var kamokuSelects = document.getElementsByClassName('kamokuSelect');
    for(var i = 0; i < kamokuSelects.length; i++){
        var taisho = kamokuSelects[i];
        if(taisho.value == pvCurriculumID){
            return taisho.parentNode;
        }
    }
}

function setKamokuPaneValue(pvKamokuPane,pvData){
    //時間セレクト
    var hourSelect;
    hourSelect = $(pvKamokuPane).find('.hourSelect')[0];
    if(!hourSelect){
        hourSelect = $(pvKamokuPane).find('.hourSelect backgroundPink')[0];
    }
    hourSelect.value = pvData.spendTime;
    hourSelect.className = 'hourSelect';
    //教材・ページ
    if(pvData.workbookID && pvData.workbookAmount){
        var kyouzaiSelect = $(pvKamokuPane).find('.kyouzaiSelect')[0];
        kyouzaiSelect.value = pvData.workbookID;
        kyouzaiSelect.className = 'kyouzaiSelect';
        
        var pageSelect = $(pvKamokuPane).find('.pageSelect')[0];
        pageSelect.value = pvData.workbookAmount;
        pageSelect.className = 'pageSelect';
    }
}

$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //カレンダーの準備
    readyCalender();
    //計画日の日付をセットする
    setJissekiHiduke();
    
    $(document).on('click', '#completeButton', function () {
        nextStep();
    });
    
    setContentTemplate();
    
    $(document).on('click', '#addButton', function () {
        addContentTemplate();
    });
    
    $(document).on('change', '.hourSelect', function () {
        if(this.value > 0){
            this.className = 'hourSelect';
        }else{
            this.className = 'hourSelect backgroundPink';
        }
    });
    
    $(document).on('change', '.kyouzaiSelect', function () {
        if(this.value > 0){
            this.className = 'kyouzaiSelect';
        }else{
            this.className = 'kyouzaiSelect backgroundPink';
        }
    });
    
    $(document).on('change', '.pageSelect', function () {
        if(this.value > 0){
            this.className = 'pageSelect';
        }else{
            this.className = 'pageSelect backgroundPink';
        }
    });
    
    $(document).on('change', '#calender', function () {
        calenderChanged();
    });
});