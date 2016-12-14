function addDetail(pvContent){
    var $contentArea = $(pvContent).find('.detailPane');
    var context = $contentArea[0];
    context.className = 'detailPane';
}

////テーブルを取得する（本来はオブジェクトをパラメタとするか、オブジェクトの機能として提供する）
//function getDetailTable(){
//    var table = document.createElement('table');
//    //詳細ヘッダーのTRを取得する（修正ボタン）
//    var headerTR = getHeaderTR();
//    //格納
//    table.appendChild(headerTR);
//    //詳細のTR配列を取得する
//    var trs = getShousaiTRs();
//    //格納
//    for(var i = 0; i < trs.length; i++){
//        var tr = trs[i];
//        table.appendChild(tr);
//    }
//    
//    return table;
//}

//function getHeaderTR(){
//    var result = document.createElement('tr');
//    
//    var td = document.createElement('td');
//    td.className = 'shousaiTopColumn';
//    td.setAttribute('rowspan', '3');
//    result.appendChild(td);
//    
//    var shuuseiButton = document.createElement('button');
//    shuuseiButton.className = 'btn btn-primary shuuseiButton';
//    shuuseiButton.onclick = clickShuseiButton;
//    shuuseiButton.textContent = '修正';
//    
//    td.appendChild(shuuseiButton);
//    
//    return result;
//}

//function clickShuseiButton(){
//    location.href = 'hibetuKeikaku.html';
//}


//function getShousaiTRs(){
//    var result = [];
//    var tr1 = getShousaiTR('数学','問題集','５ページ');
//    result.push(tr1);
//    var tr2 = getShousaiTR('理科','問題集','４ページ');
//    result.push(tr2);
//    
//    return result;
//}

//function getShousaiTR(pvKyouka,pvKyouzai,pvPage){
//    var result = document.createElement('tr');
//    
//    var kyoukaTD = document.createElement('td');
//    var kyoukaDiv = document.createElement('div');
//    kyoukaDiv.className = 'shousaiKoumoku';
//    kyoukaDiv.textContent = pvKyouka;
//    kyoukaTD.appendChild(kyoukaDiv);
//    result.appendChild(kyoukaTD);
//    
//    var kyouzaiTD = document.createElement('td');
//    var kyouzaiDiv = document.createElement('div');
//    kyouzaiDiv.className = 'shousaiKoumoku';
//    kyouzaiDiv.textContent = pvKyouzai;
//    kyouzaiTD.appendChild(kyouzaiDiv);
//    result.appendChild(kyouzaiTD);
//    
//    var pageTD = document.createElement('td');
//    var pageDiv = document.createElement('div');
//    pageDiv.className = 'shousaiKoumoku';
//    pageDiv.textContent = pvPage;
//    pageTD.appendChild(pageDiv);
//    result.appendChild(pageTD);
//    
//    return result;
//}


//function getShuseiButton(){
//    var result = document.createElement('button');
//    result.textContent = '修正';
//    return result;
//}

//function getDetail(){
//    var detailPane = document.createElement('div');
//    detailPane.className = 'detail';
//    var p = document.createElement('p');
//    detailPane.appendChild(p);
//    var kamoku = document.createElement('span');
//    kamoku.textContent = '国語';
//    kamoku.className = 'koumokuSpan';
//    detailPane.appendChild(kamoku);
//    var kyouzai = document.createElement('span');
//    kyouzai.textContent = '教材１';
//    kyouzai.className = 'koumokuSpan';
//    detailPane.appendChild(kyouzai);
//    var page = document.createElement('span');
//    page.textContent = '５ページ';
//    page.className = 'koumokuSpan';
//    detailPane.appendChild(page);
//    return detailPane;
//}
//
//function getDetail2(){
//    var detailPane = document.createElement('div');
//    detailPane.className = 'detail';
//    var p = document.createElement('p');
//    detailPane.appendChild(p);
//    var kamoku = document.createElement('span');
//    kamoku.textContent = '数学';
//    kamoku.className = 'koumokuSpan';
//    detailPane.appendChild(kamoku);
//    var kyouzai = document.createElement('span');
//    kyouzai.textContent = '教材２';
//    kyouzai.className = 'koumokuSpan';
//    detailPane.appendChild(kyouzai);
//    var page = document.createElement('span');
//    page.textContent = '５ページ';
//    page.className = 'koumokuSpan';
//    detailPane.appendChild(page);
//    return detailPane;
//}

function setCCChart(){
    
    var chart = {
        'config' : {
            "xScaleFont" : "bold 20px 'meiryo'",
            "yScaleFont" : "bold 20px 'meiryo'",
            "hanreiFont" : "bold 20px 'meiryo'",
            'minY' : 0, 
            'maxY' : 6,
            'type' : 'stacked',
            "barWidth": 24,
            'colorSet' :
                    ['#337ab7','orange']
    
        },
        'data': [
            ["教科",'国語','数学','英語','理科','社会'],
            ["予定",kokugo,suugaku,eigo,rika,shakai]
        ]
    };
    ccchart.init('graph', chart)
}

function loadData(){
    //今日の日付の取得
    var today = comfn.getTodayDate();
    //5日後の日付
    var afterDate = getAfterDate(today.originDate,5);
    var afterDay = new dateInfo(afterDate);
    
    //
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyPlanFromStartEndDate",
        'userID' : userID,
        'periodID' : 0,
        'startDate' : today.getToString(),
        'endDate' : afterDay.getToString(),
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
    //コンテンツの追加
    var container = document.getElementById('contantContainer');
    //日別データの取得
    var hibetuDatas = getHibetuKeikakuData(pvData);
    //科目データ
    kamokuDatas = [];
    //日別データの繰り返し
    for(var i = 0; i < hibetuDatas.length; i++){
        //日別データ
        var hibetuData = hibetuDatas[i];
        //日別データからコンテンツの取得
        var content = hibetuData.getContent();
        //コンテナに格納
        container.appendChild(content);
        //科目データの取得
        for(var j = 0; j < hibetuData.datas.length; j++){
            var kamokuData = hibetuData.datas[j];
            kamokuDatas.push(kamokuData);
        }
    }
    //科目のカウントセット
    setKamokuCount(kamokuDatas);
    //グラフのセット
    setCCChart();
}

var kokugo,suugaku,eigo,rika,shakai;
function setKamokuCount(pvkamokuDatas){
    kokugo = 0;
    suugaku = 0;
    eigo = 0;
    rika = 0;
    shakai = 0;
    
    for(var i = 0; i < pvkamokuDatas.length; i++){
        var kamokuData = pvkamokuDatas[i];
        if(kamokuData.curriculumID == 1){
            kokugo += parseInt(kamokuData.spendTime);
        }else if(kamokuData.curriculumID == 2){
            suugaku += parseInt(kamokuData.spendTime);
        }else if(kamokuData.curriculumID == 3){
            eigo += parseInt(kamokuData.spendTime);
        }else if(kamokuData.curriculumID == 4){
            rika += parseInt(kamokuData.spendTime);
        }else if(kamokuData.curriculumID == 5){
            shakai += parseInt(kamokuData.spendTime);
        }
    }
    
}
var countData;

function getHibetuKeikakuData(pvData){
    var result = [];
    if(pvData && (pvData.length > 0)){
        var dayData = [];
        var currentDate = pvData[0].targetDate;
        for(var i = 0; i < pvData.length; i++){
            var data = pvData[i];
            if(currentDate == data.targetDate){
                dayData.push(data);
            }else{
                //セット
                var hibetuObj = new hibetuKamokubetuObj(currentDate,dayData);
                result.push(hibetuObj);
                //初期化
                currentDate = data.targetDate;
                dayData = [];
                dayData.push(data);
            }
        }
        //セット
        var hibetuObj = new hibetuKamokubetuObj(currentDate,dayData);
        result.push(hibetuObj);
    }
    return result;
}

$(function () {
    "use strict";
    
    //ログインチェック
    loginCheck();
    //データを取得する
    loadData();
    
    $('#contantContainer').on('click', '.contentArea', function () {
        addDetail(this);
    });
    
    $(document).on('click','.shuuseiButton',function(){
        sessionStorage.setItem("targetKeikakuDate",this.name);
        location.href = 'hibetuKeikaku.html';
    });
    
});