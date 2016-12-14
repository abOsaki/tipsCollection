function setHiduke(){
    //対象日付のセット
    setTaishoHiduke();
    //日付タイトルのセット
    setHidukeTitle();
}

function setTaishoHiduke(){
    //計画の対象日付をゲットする
    var taisho = sessionStorage.getItem('keikakuJisseki');
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

function setHidukeTitle(){
    var hidukeTitle = document.getElementById('hidukeTitle');
    hidukeTitle.textContent = taishoDate.month + '月' + taishoDate.date + '日の振り返り';
}

function dataLoad(){
    //対象日付からデータを取得する（計画と実績）
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyPlanLogFromDate",
        'userID' : userID,
        'periodID' : 0,
        'targetDate' : taishoDate.getToString()
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setJisseki(data);
    }).fail(function(data){
        alert('データの取得に失敗しました');
    });
    
}

function setJisseki(pvData){
    var tbody = $('#planLogTable').find('tbody')[0];
    
    //オブジェクトの取得
    var objects = kamokubetuPlanLogObjUtil.getObjectsByRows(pvData);
    
    objects.sort(function(a,b){
            if( a.getCurriculumID() < b.getCurriculumID() ) return -1;
            if( a.getCurriculumID() > b.getCurriculumID() ) return 1;
            return 0;
    });
    
    for(var i = 0; i < objects.length; i++){
        var planLogObj = objects[i]
        var tr = planLogObj.getTR();
        tbody.appendChild(tr);
    }
    
    //カウントオブジェクトの取得
    var countObj = kamokubetuPlanLogObjUtil.getKamokuCount(objects);
    //グラフのセット
    setCCChart(countObj);
}

function setCCChart(pvCountObj){
    
    var chart = {
        'config' : {
            "xScaleFont" : "bold 25px 'meiryo'",
            "yScaleFont" : "bold 20px 'meiryo'",
            "hanreiFont" : "bold 25px 'meiryo'",
            "hanreiLineHeight" : "40",
            'minY' : 0, 
            'maxY' : 3,
            'type' : 'bar',
            "barWidth": 24,
            'colorSet' :
                    ['#337ab7','orange']
    
        },
        'data': [
            ["教科",'国語','数学','英語','理科','社会'],
            ["予定",pvCountObj.kokugo.plan,pvCountObj.suugaku.plan,pvCountObj.eigo.plan,pvCountObj.rika.plan,pvCountObj.shakai.plan],
            ["実績",pvCountObj.kokugo.jisseki,pvCountObj.suugaku.jisseki,pvCountObj.eigo.jisseki,pvCountObj.rika.jisseki,pvCountObj.shakai.jisseki]
        ]
    };
    ccchart.init('graph', chart)
}
var graphConfig;

$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //日付のセット
    setHiduke();
    //データのロード
    dataLoad();
});