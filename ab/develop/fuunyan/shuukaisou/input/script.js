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
    //周回走の準備
    setupShukaisou();
}

function setupDate(date){
    var dom = document.getElementById("header");
    dom.textContent = date.getCalenderValue() + "　　";
}

function setupStudentInfo(studentInfo){
    var dom = document.getElementById("header");
    dom.textContent += studentInfo;
}

var cvShuukaisou;
function setupShukaisou(){
    //☆☆☆
    //ここで周回数を与える
    //var shuukaisuu = getShuukaisu();
    cvShuukaisou = new inputShuukaisou();
    cvShuukaisou.ready();
    
    //周回走を1回目にセットしておく
    cvShuukaisou.notifyChangeKaime(1);
    var buttons = document.getElementsByClassName("kaimeButton");
        for(var i = 0; i < buttons.length; i++){
            var taisho = buttons[i];
            if(taisho.value == 1){
                taisho.disabled = true;
            }
    }
}

function getShuukaisu(){
    var param = location.search.substring(1);
    var result = parseInt(param.split("=")[1]);
    if(result){
        return result;
    }
    return 10;
}


$(function () {
    "use strict";
    
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
    
    $('#shuukaisuuSelect').change(function(){
       cvShuukaisou.notifyChangeShuukaisuu(this.value);
    });
    
    $('#mokuhyoLapSelect').change(function(){
       cvShuukaisou.notifyChangeMokuhyoLap(this.value);
    });
    
    $('#mokuhyoTimeMinutesSelect').change(function(){
        cvShuukaisou.notifyChangeMokuhyoTime();
    });
    
    $('#mokuhyoTimeSeccondSelect').change(function(){
        cvShuukaisou.notifyChangeMokuhyoTime();
    });
    
    $('#kyoriSelect').change(function(){
       cvShuukaisou.notifyChangeKyori(); 
    });
    
    $('.kaimeButton').click(function(){
        var buttons = document.getElementsByClassName("kaimeButton");
        for(var i = 0; i < buttons.length; i++){
            var taisho = buttons[i];
            taisho.disabled = false;
        }
        this.disabled = true;
        cvShuukaisou.notifyChangeKaime(this.value);
    });
    
    $('#resetButton').click(function(){
        cvShuukaisou.notifyResetButtonPush();
    });
    
    $('#ketteiButton').click(function(){
        cvShuukaisou.notifyKetteiButtonPush();
    });
    
    $('#startButtonParentPane').click(function(){
        
        var startButton = document.getElementById("shukaisouStartButton");
        
        if(startButton){
            if(startButton.disabled){
                var ketteiButton = document.getElementById("ketteiButton");
                if(!ketteiButton.disabled){
                    /*
                    $('#riyuu').dialog({
                        modal: true,
                        width:500,
                        draggable: false,
                        title: "確認",
                        buttons: [{
                            text: "OK",
                            class: 'fu_button',
                            click : function() {
                                $(this).dialog('close');
                            }
                        }]
                        });
                        */
                    alert("決定ボタンを押してください");
                }
            }
        }
        
    });
    
    initialize();
});