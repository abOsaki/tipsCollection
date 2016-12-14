function getURLParam(){
    var urlParam = comfn.takeGET().p;
    if(urlParam){
        return ("?p=" + urlParam);
    }else{
        return '';
    }
}

function saveShukaisouMokuhyo(){
    //目標データオブジェクトの取得
    var mokuhyoObject = getMokuhyoObject();
    //セッションへのセーブ
    saveShukaisouMokuhyoForSession(mokuhyoObject);
    //DBへのセーブ
    saveShukaisouMokuhyoForDB(mokuhyoObject);
}

function getMokuhyoObject(){
    var mokuhyoTimeObj = getMokuhyoTimeObj();
    var mokuhyoWrapObj = getMokuhyoWrapObj();
    var result = new mokuhyoDataObj(mokuhyoTimeObj,mokuhyoWrapObj);
    return result;
}

function getMokuhyoTimeObj(){
    var mokuhyoTimeMinutes = document.getElementById("mokuhyoTimeMinutes");
    var mokuhyoTimeSeccond = document.getElementById("mokuhyoTimeSeccond");
    var result = getMokuhyoObj(mokuhyoTimeMinutes,mokuhyoTimeSeccond);
    return result;
}

function getMokuhyoWrapObj(){
    var mokuhyoWrapMinutes = document.getElementById("mokuhyoWrapMinutes");
    var mokuhyoWrapSeccond = document.getElementById("mokuhyoWrapSeccond");
    var result = getMokuhyoObj(mokuhyoWrapMinutes,mokuhyoWrapSeccond);
    return result;
}

function getMokuhyoObj(minutesDom,seccondDom){
    var minutes = parseInt(minutesDom.value);
    var seccond = parseInt(seccondDom.value);
    var result = new mokuhyoObj(minutes,seccond);
    return result;
}

function setMokuhyoWrapValues(minutes,seccond){
    var mokuhyoWrapMinutes = document.getElementById("mokuhyoWrapMinutes");
    var mokuhyoWrapSeccond = document.getElementById("mokuhyoWrapSeccond");
    setMokuhyoValues(mokuhyoWrapMinutes,mokuhyoWrapSeccond,minutes,seccond);
}

function setMokuhyoTimeValues(minutes,seccond){
    var mokuhyoTimeMinutes = document.getElementById("mokuhyoTimeMinutes");
    var mokuhyoTimeSeccond = document.getElementById("mokuhyoTimeSeccond");
    setMokuhyoValues(mokuhyoTimeMinutes,mokuhyoTimeSeccond,minutes,seccond);
}

function setMokuhyoValues(minutesDom,seccondDom,minutes,seccod){
    if(minutes != 0){
        minutesDom.value = minutes;
    }
    
    if(seccod != 0){
        seccondDom.value = seccod;
    }
}

function saveShukaisouMokuhyoForSession(mokuhyoObject){
    
    
    /*
    var mokuhyoTimeObj = getMokuhyoTimeObj();
    var mokuhyoWrapObj = getMokuhyoWrapObj();
    var sendData = new mokuhyoDataObj(mokuhyoTimeObj,mokuhyoWrapObj);
    */
    setMokuhyoObj(mokuhyoObject);
}

function startKakuninStep(){
    var shuukaisuuDOM = document.getElementById("shuukasuu");
    var shuukaisuuText = shuukaisuuDOM.value;
    var shuukaisuu = parseInt(shuukaisuuText);
    
    if(!shuukaisuu || (shuukaisuu < 1) || (shuukaisuu > 10)){
        var riyuu;
        var riyuuDom = document.getElementById("riyuu");
        
        if(!shuukaisuu){
            riyuu = "周回数を入力してください";
        }
        
        if((shuukaisuu < 1) || (shuukaisuu > 10)){
            riyuu = "１～１０の周回数を入力してください";
        }
        riyuuDom.textContent = riyuu;
        
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
        return;
    }
    
    var shuukaisuuDom = document.getElementById("shuukaisuu");
    shuukaisuuDom.textContent = shuukaisuu;
    
    $('#shuukaisouKakuninModalContents').dialog({
        modal: true,
        width:500,
        draggable: false,
        title: "確認",
        buttons: [{
            text: "はじめる",
            class: 'fu_button',
            click : function() {
                startShuukaisou();
            }
        },
        {
            text: "みなおす",
            class: 'fu_button',
            click : function() {
                $(this).dialog('close');
            }
        }]
    });
}

function startShuukaisou(){
    saveShukaisouMokuhyo();
                
    //ここで周回数を付けて送る
    var shuukaisuuDOM = document.getElementById("shuukasuu");
    var shuukaisuu = shuukaisuuDOM.value;
    var href = "../shuukaisou/input/?p=" + shuukaisuu;
                
    location.href = href;
    //location.href = "../shuukaisou/input";
    //window.open( "../input_s/", "" ) ;
}

function startKirokumiru(){
    location.href = "../shuukaisou/kiroku";
}


function setDisplay(group){
    if(group === "1"){
        
    }else{
        var shougakuseiPane = document.getElementById("shougakuseiPane");
        shougakuseiPane.style.visibility = "hidden";
    }
}

/*global $, console, alert, comfn*/
$(function () {
    //definition
    var fn = {
        init: function () {
            //ログインチェック
            comfn.loginCheck(function () {
                comfn.setInfo($('.info'));

                //☆☆☆中学生用の画面のため
                //group = comfn.getGroup();
                //setDisplay(group);
            });
        }
    };
    
    fn.init();
    
    $('#chuugakuseiPane').hide();
    
    //commonのlogoutとは別処理
    $(document).off('click', '#img_logout');
    $(document).on('click', '#img_logout', function () {
        //ログアウトボタンが押されたらログアウト
        comfn.removeSession();
        window.location.href = comfn.SS.getName('HOME', "1");
    });
    $(document).on('click','#seikatukiroku',function(){
        moveUrlWidthParam('../input_s/');
    });
    $(document).on('click','#shuukaisou',function(){
        moveUrlWidthParam('../shuukaisou/input/');
    });
    $(document).on('click','#jugyouEnquete',function(){
        moveUrlWidthParam('../jugyouEnquete/answer/');
    });
});