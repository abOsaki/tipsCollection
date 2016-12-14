function setKeikakuHiduke(){
    //対象日付のセット
    setTaishoHiduke();
    //計画日付のセット
    setKeikauHidukeTitle();
}

function setTaishoHiduke(){
    //計画の対象日付をゲットする
    var taisho = sessionStorage.getItem('keikakuHiduke');
    if(taisho){
        //日付の取得
        var date = new Date(taisho);
        //dateObjectの取得
        taishoDate = new dateInfo(date);
    }else{
        //本日の日付の取得
        taishoDate = comfn.getTodayDate();
    }
    
}
var taishoDate;

function setKeikauHidukeTitle(){
    var keikakuTitle = document.getElementById('keikakuTitle');
    keikakuTitle.textContent = taishoDate.month + '月' + taishoDate.date + '日の計画';
}

function dataLoad(){
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyPlanFromDate",
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
        setKeikaku(data);
    }).fail(function(data){
        alert('データの取得に失敗しました')
    });
}

function setKeikaku(pvData){
    var containerPane = document.getElementById('contantContainer');
    for(var i =0; i < pvData.length; i++){
        //データ
        var data = pvData[i];
        //計画のDiv取得
        var pane = getKeikakuDiv(data);
        //格納
        containerPane.appendChild(pane);
    }
}   

function getKeikakuDiv(pvData){
    var result = document.createElement('div');
    result.className = 'text-center contentKoumoku';
    var contentArea = document.createElement('div');
    contentArea.className = 'contentArea';
    //教科
    var kyoukaSpan = document.createElement('span');
    kyoukaSpan.className = 'kamokuSpan koumokuSpan';
    kyoukaSpan.textContent = getKyoukaText(pvData.curriculumID);
    contentArea.appendChild(kyoukaSpan);
    //時間
    var hourSpan = document.createElement('span');
    hourSpan.className = 'hourSpan koumokuSpan';
    hourSpan.textContent = pvData.spendTime;
    contentArea.appendChild(hourSpan);
    var hourTanni = document.createElement('span');
    hourTanni.textContent = '時間';
    contentArea.appendChild(hourTanni);
    
    //詳細
    if(pvData.workbookID && pvData.workbookAmount){
        var p = document.createElement('p');
        contentArea.appendChild(p);
        //教材
        var kyouzaiSpan = document.createElement('span');
        kyouzaiSpan.className = 'kyouzaiSpan koumokuSpan';
        kyouzaiSpan.textContent = getKyouzaiText(pvData.workbookID);
        contentArea.appendChild(kyouzaiSpan);
        //ページ
        var pageSpan = document.createElement('span');
        pageSpan.className = 'pageSpan koumokuSpan';
        pageSpan.textContent = pvData.workbookAmount;
        contentArea.appendChild(pageSpan);
        var pageTanni = document.createElement('span');
        pageTanni.textContent = 'ページ';
        contentArea.appendChild(pageTanni);
    }
    result.appendChild(contentArea);
    
    return result;
}

$(function () {
    "use strict";
    
    loginCheck();
    //計画日付のセット
    setKeikakuHiduke();
    //データのロード
    dataLoad();
    
    $(document).on('click', '#menuButton', function () {
        location.href = "../menu/";
    });
    
    $(document).on('click', '#keikakuButton', function () {
        location.href = "hibetuKeikaku.html";
    });
    
});