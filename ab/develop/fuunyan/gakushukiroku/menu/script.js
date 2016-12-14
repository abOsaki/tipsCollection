var studentInfo;

function checkMokuhyo(){
    //目標を取得する
    var sendData = {
        'command' : "getGoal",
        'userID' : userID,
        'periodID' : 0
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setMenu(data);
    }).fail(function(data){
        alert('日付の取得に失敗しました');
    });
    
    
}

function setMenu(pvData){
    if(pvData && (pvData.length > 0)){
        setGoalExistStyle(pvData);
    }else{
        setGoalLessStyle();
    }
}

function setGoalLessStyle(){
    var gakushuukeikaku = document.getElementById('gakushuukeikakuBtn');
    gakushuukeikaku.setAttribute('disabled','disabled');
    
    var gakushuukiroku = document.getElementById('gakushuukirokuBtn');
    gakushuukiroku.setAttribute('disabled','disabled');
    
    var sikenkekka = document.getElementById('sikenkekkaBtn');
    sikenkekka.setAttribute('disabled','disabled');
    
    var title = document.getElementById('title');
    title.style.display = 'none';
}

function setGoalExistStyle(pvData){
    var mokuhyo = document.getElementById('mokuhyoBtn');
    mokuhyo.textContent = 'Step1　目標設定（済）'
    
    var today = new Date();
    var testDate = new Date(pvData[0].testStartDate);
    //差（ミリ秒数）
    var msDiff = testDate.getTime() - today.getTime();
    //差（日数）
    var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));
    
    var nissuu = document.getElementById('nissuu');
    nissuu.textContent = daysDiff;
    
    if(daysDiff < 1){
        var title = document.getElementById('title');
        title.style.display = 'none';
    }
    
//    var titleText = '試験まであと' + daysDiff + '日';
//    
//    var title = document.getElementById('title');
//    title.textContent = titleText;
    
    //スタンプの作成
    var stampImg = document.createElement('img');
    stampImg.src = '../../common/images/menu5_neko.png';
    stampImg.id = 'stampImg';
    
    var imgPane = document.getElementById('imgPane');
    imgPane.appendChild(stampImg);
    
    //メッセージの作成
    var messagePane = document.getElementById('messagePane');
    messagePane.textContent = '今日も頑張ろう！';
    
    
//    //期間目標
//    var periodGoalRow = pvData[0];
//    var periodGoalObj = new periodGoalObject(periodGoalRow);
//    var mokuhyoContent = document.getElementById('mokuhyoContent');
//    mokuhyoContent.textContent = periodGoalObj.getMokuhyoText();
//    //科目別目標
//    for(var i = 1; i < pvData.length; i++){
//        var data = pvData[i];
//        var kamokubetuGoalObj = new kamokubetuGoalObject(data);
//        kamokubetuGoalObj.setKamokuTD();
//    }
}

function setAisatu(){
    var aisatuText = userName + 'さん　ようこそ！';
    var aisatu = document.getElementById('aisatu');
    aisatu.textContent = aisatuText;
}

$(function () {
    "use strict";
    
    loginCheck();
    //挨拶のセット
    setAisatu();
    //目標のチェック
    checkMokuhyo();
    
    $('#contentPane').on('click', '#mokuhyoBtn', function () {
        location.href = "../mokuhyo/mokuhyoSettei.html";
    });
    
    $('#contentPane').on('click', '#gakushuukeikakuBtn', function () {
        location.href = "../keikaku/gakushuKeikakuCalender.html";
    });
    
    $('#contentPane').on('click', '#gakushuukirokuBtn', function () {
        location.href = "../jisseki/gakushuJissekiCalender.html";
    });
    
    $('#contentPane').on('click', '#sikenkekkaBtn', function () {
        location.href = "../zenkaiKiroku/index.html";
    });
    
    
    
    $('#contentPane').on('touchend', '#mokuhyoBtn', function () {
        location.href = "../mokuhyo/mokuhyoSettei.html";
    });
    
    $('#contentPane').on('touchend', '#gakushuukeikakuBtn', function () {
        location.href = "../keikaku/gakushuKeikakuCalender.html";
    });
    
    $('#contentPane').on('touchend', '#gakushuukirokuBtn', function () {
        location.href = "../jisseki/gakushuJissekiCalender.html";
    });
    
    $('#contentPane').on('touchend', '#sikenkekkaBtn', function () {
        location.href = "../zenkaiKiroku/index.html";
    });
    
    
//    
//    $(document).on('click', '#keikakuKakuninButton', function () {
//        location.href = "../keikaku/setteizumi.html";
//    });
//    
//    $(document).on('click', '#kirokusuruButton', function () {
//        location.href = "../jisseki/hibetuJisseki.html";
//    });
//    
//    $(document).on('click', '#kirokumiruButton', function () {
//        location.href = "../jisseki/nyuryokuzumi.html";
//    });
//    
//    $(document).on('click', '#zenkaiKirokumiruButton', function () {
//        location.href = "../zenkaiKiroku";
//    });
    
});