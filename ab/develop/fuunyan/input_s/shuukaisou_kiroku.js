//日付をセットするメソッド
function setDateInfo(dateObj){
    var target = document.getElementById("calender");
    target.value = dateObj.getCalenderValue();
}
    
//生徒情報をセットするメソッド
function setStudentInfo(studentInfo){
    var target = document.getElementById("studentInfo");
    target.textContent = studentInfo;
}

function setHidukeHeader(){
    var hidukeHeaderOperation = new shuukaisouKirokuHeaderOperation();
    hidukeHeaderOperation.setHidukeHeader();
}



function pushHiduke(){
    moveHiduke();
}

function pushShukei(){
    moveShuukei();
}

function pushLap(){
    moveLap();
}

function moveHiduke(){
    shuukaisouObj.notifyFocus();
    shuukaisouContaner = document.getElementById("shitumonContent");
    shuukeiContainer = document.getElementById("shuukeiContent");
    lapBunsekiContainer = document.getElementById("lapBunsekiContent");
    
    $(shuukaisouContaner).show();
    $(shuukeiContainer).hide();
    $(lapBunsekiContainer).hide();
}

function moveShuukei(){
    shuukaisouShukeiObj.notifyFocus();
    shuukaisouContaner = document.getElementById("shitumonContent");
    shuukeiContainer = document.getElementById("shuukeiContent");
    lapBunsekiContainer = document.getElementById("lapBunsekiContent");
    
    $(shuukaisouContaner).hide();
    $(shuukeiContainer).show();
    $(lapBunsekiContainer).hide();
}

function moveLap(){
    shuukaisouContaner = document.getElementById("shitumonContent");
    shuukeiContainer = document.getElementById("shuukeiContent");
    lapBunsekiContainer = document.getElementById("lapBunsekiContent");
    
    $(shuukaisouContaner).hide();
    $(shuukeiContainer).hide();
    $(lapBunsekiContainer).show();
}

var shuukaisouObj;
var shuukaisouShukeiObj;

function initialize(){
    //ログインチェック
    comfn.loginCheck(function () {
        //SessionStorageの取得とBasicInfoへの値設定
        comfn.setBasicInfo();
        /*
        //日付取得
        var date = comfn.getTodayDate();
        setDateInfo(date);
        */
        //生徒情報の取得、セット
        var studentInfo = comfn.getStudentInfo();
        setStudentInfo(studentInfo);
                
        //パラメタを確認して分岐させる
        var flag = comfn.takeGET();
        var recordObj = getRecordObj()
        //記録の取得
        
        //  setHidukeHeader();
        
        shuukaisouObj = new shukaisou(10);
        shuukaisouObj.readyForKiroku(recordObj);
        
        shuukaisouShukeiObj = new shuukaisouShuukei();
        shuukaisouShukeiObj.ready();
        
        moveHiduke();
    });
    
}

$(function () {
    initialize();
    $(document).on('click', '#hidukeButton', function () {
        pushHiduke();
    });
    $(document).on('click', '#shuukeiButton', function () {
        pushShukei();
    });
    $(document).on('click', '#lapBunsekiButton', function () {
        pushLap();
    });
    
});