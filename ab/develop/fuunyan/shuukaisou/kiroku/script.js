//const LoginCheckURL = '../../common/php/ajax.php';

function initialize(){
    comfn.loginCheckUrl('../../common/php/ajax.php',startSetup);
}

function startSetup(){
    comfn.setBasicInfo();
    //日付取得
    var date = comfn.getTodayDate();
    setupDate(date);
    //生徒情報の取得、セット
    var studentInfo = comfn.getStudentInfo();
    setupStudentInfo(studentInfo);
    
    /*
    //周回走の準備
    setupShukaisou();
    //集計の準備
    setShuukei();
    //分析の準備
    setBunseki();
    */
    
    //分析の準備
    setBunseki();
    //期間平均の準備
    setKikanHeikin();
    bunsekiModeObj.notifyHyoujiPushed();
    initializeGamen();
}

function setupDate(date){
    //カレンダーのセットアップ
    shuukaisouCommon.setAllCalender(date);
}

function initializeGamen(){
    $("#kikanHeikinPane").hide();
    $("#bunnsekiPane").show();
}

function setupStudentInfo(studentInfo){
    var dom = document.getElementById("header");
    dom.textContent = studentInfo;
}

var shuukaisouMode;
function setupShukaisou(){
    shuukaisouMode = new showShuukaisou();
    shuukaisouMode.ready();
    //レコードを取得する
    var recordObj = getRecordObj();
    shuukaisouMode.setKiroku(recordObj);
}

var shuukeiModeObj;
function setShuukei(){
    shuukeiModeObj = new shuukeiMode();
    shuukeiModeObj.ready();
}

var bunsekiModeObj;
function setBunseki(){
    bunsekiModeObj = new bunsekiMode();
    bunsekiModeObj.ready();
}

var kikanHeikinModeObj;
function setKikanHeikin(){
    kikanHeikinModeObj = new kikanHeikinMode();
    kikanHeikinModeObj.ready();
}

function hyoujiButtonPushed(){
    //表示ボタンが押された
    shuukaisouMode.notifyHyoujiPushed();
}

function shuukeiHyoujiButtonPushed(){
    shuukeiModeObj.notifyHyoujiPushed();
}

function bunsekiHyoujiButtonPushed(){
    bunsekiModeObj.notifyHyoujiPushed();
}

function hidukebetsuZenjituPushed(){
    shuukaisouCommon.hidukebetsuZenjituPushed();
}

function hidukebetsuGojituPushed(){
    shuukaisouCommon.hidukebetsuGojituPushed();
}

var currentMode;
function hidukebetsuButtonPushed(){
    /*
    var hidukebetsuButton = document.getElementById("hidukebetsuButton");
    hidukebetsuButton.src = "../images/tb_date_on.png"
    var shuukeiButton = document.getElementById("shuukeiButton");
    shuukeiButton.src = "../images/tb_aggregate_off.png";
    var bunnsekiButton = document.getElementById("bunnsekiButton");
    bunnsekiButton.src = "../images/tb_analysis_off.png";
    
    $("#shuukeiPane").hide();
    $("#bunnsekiPane").hide();
    $("#hidukebetsuPane").show();
    shuukaisouMode.notifyFocus();
    currentMode = shuukaisouMode;
    */
}

function shuukeiButtonPushed(){
    /*
    var hidukebetsuButton = document.getElementById("hidukebetsuButton");
    hidukebetsuButton.src = "../images/tb_date_off.png"
    var shuukeiButton = document.getElementById("shuukeiButton");
    shuukeiButton.src = "../images/tb_aggregate_on.png";
    var bunnsekiButton = document.getElementById("bunnsekiButton");
    bunnsekiButton.src = "../images/tb_analysis_off.png";
    */
    
    /*
    $("#hidukebetsuPane").hide();
    $("#bunnsekiPane").hide();
    $("#shuukeiPane").show();
    shuukeiModeObj.notifyFocus();
    currentMode = shuukeiModeObj;
    */
    
    shuukaisouCommon.setBunsekiGraphHidden();
    
    $("#bunnsekiPane").hide();
    $("#kikanHeikinPane").show();
    kikanHeikinModeObj.notifyFocus();
    currentMode = kikanHeikinMode;
}

function bunnsekiButtonPushed(){
    /*
    var hidukebetsuButton = document.getElementById("hidukebetsuButton");
    hidukebetsuButton.src = "../images/tb_date_off.png"
    var shuukeiButton = document.getElementById("shuukeiButton");
    shuukeiButton.src = "../images/tb_aggregate_off.png";
    var bunnsekiButton = document.getElementById("bunnsekiButton");
    bunnsekiButton.src = "../images/tb_analysis_on.png";
    */
    
    $("#hidukebetsuPane").hide();
    $("#shuukeiPane").hide();
    $("#bunnsekiPane").show();
    bunsekiModeObj.notifyFocus();
    currentMode = bunsekiModeObj;
}

function pushGragh(){
    /*
    var date = currentMode.getSelectedDate();
    if(date){
        
        //日付から月、日の取得
        var month = date.split("月")[0] - 1;
        var hiniti = date.split("月")[1].split("日")[0];
        
        var taishoDate = new Date();
        taishoDate.setMonth(month);
        taishoDate.setDate(hiniti);
        
        //日付データから日付別に移動させる
        $("#shuukeiPane").hide();
        $("#bunnsekiPane").hide();
        $("#hidukebetsuPane").show();
        
        //var newDate = new Date(date);
        
        //コモンに日付別のカレンダーに日付をセットする
        shuukaisouCommon.setHidukebetsuCalenderText(taishoDate);
        //フォーカスを日付別に合わせる
        shuukaisouMode.notifyFocus();
        
        currentMode = shuukaisouMode;
    }
    */
}

function pushGraphData(){
    alert("データがクリックされた")
}

$(function () {
    "use strict";
    $("#shuukeiPane").hide();
    $("#bunnsekiPane").hide();
    initialize();
    $(document).on('click', '#hyouji', function () {
        hyoujiButtonPushed();
    });
    $(document).on('click', '#shuukeiHyouji', function () {
        shuukeiHyoujiButtonPushed();
    });
    $(document).on('click', '#bunsekiHyouji', function () {
        bunsekiHyoujiButtonPushed();
    });
    $(document).on('click', '#hidukebetsuGojitu', function () {
        hidukebetsuGojituPushed();
    });
    $(document).on('click', '#hidukebetsuZenjitu', function () {
        
        hidukebetsuZenjituPushed();
    });
    $(document).on('click', '#hidukebetsuButton', function () {
        
        hidukebetsuButtonPushed();
    });
    $(document).on('click', '#shuukeiButton', function () {
        
        shuukeiButtonPushed();
    });
    $(document).on('click', '#bunnsekiButton', function () {
        
        bunnsekiButtonPushed();
    });
    $(document).on('click', '.-ccchart-css-group', function () {
        
        pushGragh();
    });
    $(document).on('click', '.-ccchart-css-arc', function () {
        var x = $(this).attr('data-x');
        var y = $(this).attr('data-y');
        var t1 = $(this).attr('data-col');
        var t2 = $(this).attr('data-colname');
        var t3 = $(this).attr('data-colnamestitle');
        var t4 = $(this).attr('data-scatter-y');
        var t5 = $(this).attr('data-scatter-x');
        var t6 = $(this).attr('data-data');
        var t7 = $(this).attr('data-percent');
        var t8 = $(this).attr('data-unit');
        var t9 = $(this).attr('data-bg');
        
        //回目取得
        var kaime = parseInt(y);
        
        shuukaisouCommon.setBunsekiGraphFilter(kaime);
        //pushGraphData();
        /*
        var y = $(this).attr('data-y');
        var month = y.split("月")[0];
        var day = y.split("月")[1].split("日")[0];
        var kaime = y.split("-")[1];
        */
        //getSessionExpire();
    });
    $("#logout_Button").on('click',function(){
        moveUrlWidthParam('./../../index/');
        //location.href = "./../../index/";
    });
    $("#menu_Button").on('click',function(){
        moveUrlWidthParam('./../../menu_s/');
        //location.href = "./../../menu_s/";
    });
    $("#modoru_Button").on('click',function(){
        window.history.back(-1);
        return false;
    });
});