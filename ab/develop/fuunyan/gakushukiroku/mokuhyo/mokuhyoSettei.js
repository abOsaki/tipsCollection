function selectedStamp(pvStampImg){
    clearSelectStamp();
    pvStampImg.className = 'selectStampBackground';
}

function clearSelectStamp(){
    var stamps = document.getElementsByClassName('selectStampBackground');
    for(var i = 0; i < stamps.length; i++){
        var stamp = stamps[i];
        stamp.className = 'stamp';
    }
}

function initializeMokuhyoSelect(){
    var mokuhyoSelect = document.getElementById("mokuhyoSelect");
    mokuhyoSelect.selectedIndex = 14;
}

function getRegistValue(){
    var result = [];
    result['userID'] = userID;
    result['periodID'] = 0;
    result['curriculumID'] = parseInt(document.getElementById("kamokuSelect").value);
    result['goalPoint'] = parseInt(document.getElementById("mokuhyoSelect").value);
    result['stamp'] = '';
    return result;
}

function nextStep(){
    
    var mokuhyoObj = mokuhyoObjUtil.getMokuhyoObj();
    mokuhyoObj.SetSession();
    moveNext();

}

function moveNext(){
    location.href = "mokuhyoSetteiKakunin.html";
}

function readyCalender(){

//    var mindate = param.sheet.dateFrom;
//    var mindateFormat = new Date(mindate.replace(/-/g, '/'));

    $("#startCalender").datepicker({
//        minDate : mindateFormat,
//        maxDate : '0d',
        //ボタン
        showOn : "button",
        buttonImage: "../../common/images/calendar-icon.png",
        buttonImageOnly: true,
    });
    
    $("#endCalender").datepicker({
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
//        dateFormat: 'mm月dd日(D)',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'};
    $.datepicker.setDefaults($.datepicker.regional['ja']);
}

function changeTestKubun(pvTestKubun){
    var additionalKyouka = document.getElementById('additionalKyouka');
    if(pvTestKubun == 1){
        additionalKyouka.style.display = 'none';
    }else{
        additionalKyouka.style.display = 'block';
    }
}

$(function () {
    "use strict";
    
    loginCheck();
    
    readyCalender();
    
    mokuhyoObjUtil.loadData();
    mokuhyoObjUtil.clearSession();
    
    $('#nextButton').on('click',function () {
        nextStep();
    });
    
    $("input:radio[name='testKubun']").on('change',function () {
        var testKubun = $("input:radio[name='testKubun']:checked").val();
        changeTestKubun(testKubun);
    });
    
    $('#menu').on('touchend', function () {
        location.href = "../menu/";
    });
    
    
//    $('#nextButtonPane').on('click', '#nextButton', function () {
//        nextStep();
//    });
//    
//    $(document).on('change', "input:radio[name='testKubun']", function () {
//        var testKubun = $("input:radio[name='testKubun']:checked").val();
//        changeTestKubun(testKubun);
//    });
//    
//    $('.breadcrumb').on('touchend', '#menu', function () {
//        location.href = "../menu/";
//    });
    
//    $(document).on('click', '.stamp', function () {
//        selectedStamp(this);
//    });
    
//    initializeMokuhyoSelect();
});