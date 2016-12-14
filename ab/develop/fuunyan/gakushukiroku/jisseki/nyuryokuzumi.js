function addDetail(pvContent){
    var $contentArea = $(pvContent).find('.detailPane');
    var context = $contentArea[0];
    context.className = 'detailPane';
}

//テーブルを取得する（本来はオブジェクトをパラメタとするか、オブジェクトの機能として提供する）
function getDetailTable(){
    var table = document.createElement('table');
    //詳細ヘッダーのTRを取得する（修正ボタン）
    var headerTR = getHeaderTR();
    //格納
    table.appendChild(headerTR);
    //詳細のTR配列を取得する
    var trs = getShousaiTRs();
    //格納
    for(var i = 0; i < trs.length; i++){
        var tr = trs[i];
        table.appendChild(tr);
    }
    
    return table;
}

function getHeaderTR(){
    var result = document.createElement('tr');
    
    var td = document.createElement('td');
    td.className = 'shousaiTopColumn';
    td.setAttribute('rowspan', '3');
    result.appendChild(td);
    
    var stamp = document.createElement('img');
    stamp.className = 'stamp'
    stamp.src = "../../common/images/stamp2.png"
    td.appendChild(stamp);
    
    return result;
}

function getShousaiTRs(){
    var result = [];
    var tr1 = getShousaiTR('数学','問題集','５ページ');
    result.push(tr1);
    var tr2 = getShousaiTR('理科','問題集','４ページ');
    result.push(tr2);
    
    return result;
}

function getShousaiTR(pvKyouka,pvKyouzai,pvPage){
    var result = document.createElement('tr');
    
    var kyoukaTD = document.createElement('td');
    var kyoukaDiv = document.createElement('div');
    kyoukaDiv.className = 'shousaiKoumoku';
    kyoukaDiv.textContent = pvKyouka;
    kyoukaTD.appendChild(kyoukaDiv);
    result.appendChild(kyoukaTD);
    
    var kyouzaiTD = document.createElement('td');
    var kyouzaiDiv = document.createElement('div');
    kyouzaiDiv.className = 'shousaiKoumoku';
    kyouzaiDiv.textContent = pvKyouzai;
    kyouzaiTD.appendChild(kyouzaiDiv);
    result.appendChild(kyouzaiTD);
    
    var pageTD = document.createElement('td');
    var pageDiv = document.createElement('div');
    pageDiv.className = 'shousaiKoumoku';
    pageDiv.textContent = pvPage;
    pageTD.appendChild(pageDiv);
    result.appendChild(pageTD);
    
    return result;
}

function getShuseiButton(){
    var result = document.createElement('button');
    result.textContent = '修正';
    return result;
}

function getDetail(){
    var detailPane = document.createElement('div');
    detailPane.className = 'detail';
    var p = document.createElement('p');
    detailPane.appendChild(p);
    var kamoku = document.createElement('span');
    kamoku.textContent = '国語';
    kamoku.className = 'koumokuSpan';
    detailPane.appendChild(kamoku);
    var kyouzai = document.createElement('span');
    kyouzai.textContent = '教材１';
    kyouzai.className = 'koumokuSpan';
    detailPane.appendChild(kyouzai);
    var page = document.createElement('span');
    page.textContent = '５ページ';
    page.className = 'koumokuSpan';
    detailPane.appendChild(page);
    return detailPane;
}

function getDetail2(){
    var detailPane = document.createElement('div');
    detailPane.className = 'detail';
    var p = document.createElement('p');
    detailPane.appendChild(p);
    var kamoku = document.createElement('span');
    kamoku.textContent = '数学';
    kamoku.className = 'koumokuSpan';
    detailPane.appendChild(kamoku);
    var kyouzai = document.createElement('span');
    kyouzai.textContent = '教材２';
    kyouzai.className = 'koumokuSpan';
    detailPane.appendChild(kyouzai);
    var page = document.createElement('span');
    page.textContent = '５ページ';
    page.className = 'koumokuSpan';
    detailPane.appendChild(page);
    return detailPane;
}

function setCCChart(pvCountObj){
    
    var chart = {
        'config' : {
            "xScaleFont" : "bold 20px 'meiryo'",
            "yScaleFont" : "bold 20px 'meiryo'",
            "hanreiFont" : "bold 20px 'meiryo'",
//            "paddingBottom" : "40",
//            "xScaleYOffset" : "10",
            "hanreiLineHeight" : "40",
            'minY' : 0, 
            'maxY' : 6,
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
    ccchart.init('graph', chart);
}

function loadData(){
    //今日の日付の取得
    var today = comfn.getTodayDate();
    //5日前の日付
    var beforeDate = getAfterDate(today.originDate,-5);
    var beforeDay = new dateInfo(beforeDate);
//    var afterDate = getAfterDate(today.originDate,5);
//    var afterDay = new dateInfo(afterDate);
    
    //おそらくここで接続するAPIにstudyCheckLogをJOINする返答が必要になる。
    
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyLogFromStartEndDate",
        'userID' : userID,
        'periodID' : 0,
        'startDate' : beforeDay.getToString(),
        'endDate' : today.getToString(),
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        setData(data);
    }).fail(function(data){
        alert('データの取得に失敗しました')
    });
    
    
    //グラフ用api
    var sendData = {
        'command' : "getStudyPlanLogFromStartEndDate",
        'userID' : userID,
        'periodID' : 0,
        'startDate' : beforeDay.getToString(),
        'endDate' : today.getToString(),
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        setGraph(data);
    }).fail(function(data){
        alert('データの取得に失敗しました')
    });
}

function setGraph(pvData){

    //オブジェクトの取得
    var objects = kamokubetuPlanLogObjUtil.getObjectsByRows(pvData);
    //カウントオブジェクトの取得
    var countObj = kamokubetuPlanLogObjUtil.getKamokuCount(objects);
    
    //グラフのセット
    setCCChart(countObj);
}

function setData(pvData){
    //コンテンツの追加
    var container = document.getElementById('contantContainer');
    //日別データの取得
    var hibetuDatas = getHibetuJissekiData(pvData);
    //日別データの繰り返し
    for(var i = 0; i < hibetuDatas.length; i++){
        //日別データ
        var hibetuData = hibetuDatas[i];
        //詳細ヘッダの取得
        var shousaiHeader = getJissekiShousaiHeaderContent();
        //日別データからコンテンツの取得
        var content = hibetuData.getContent(shousaiHeader);
        
        if(!hibetuData.datas[0].isRead){
            shousaiHeader.className = 'stamp nonReadStamp';
            content.children[0].className = 'contentArea nonRead';
        }
        
        //コンテナに格納
        container.appendChild(content);
        //科目データの取得
        for(var j = 0; j < hibetuData.datas.length; j++){
            var kamokuData = hibetuData.datas[j];
        }
    }
}

function getJissekiShousaiHeaderContent(){
    var stamp = document.createElement('img');
    stamp.className = 'stamp';
    stamp.src = "../../common/images/stamp2.png";
    return stamp;
};

function getHibetuJissekiData(pvData){
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
    
//    $(document).on('click', '.contentArea', function () {
//        addDetail(this);
//    });
//    
//    $('.contentArea').bind('touchstart', function() {
//        addDetail(this);
//    });
    
    $('#contantContainer').on('click', '.contentArea', function () {
        addDetail(this);
    });
    
});