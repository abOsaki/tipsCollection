function shukaisou(shukaiNo){
    var shukaisuu = shukaiNo;
    this.ready = function(){
        ready();
    }
    this.readyForKiroku = function(recordObj){
        readyForKiroku(recordObj);
    }
    this.notifyFocus = function(){
        notifyFocus();
    }
    return this;
    
    
    function notifyFocus(){
        //グラフの設定と再表示
        changeThisGraphBase();
    }
    
    function changeThisGraphBase(){
        setCccChartBase();
        ccchart.init(GraphID,graphConfig);
    }
    
    
    function ready(){
        //目標オブジェクトの取得
        mokuhyoDataObj = getMokuhyoObj();
        //情報のセットアップ
        setInfos(mokuhyoObj);
        //各種ペーンのセット
        setPanes();
        comfn.setInfo($('.info'));
        //ストップウォッチのセット
        setStopwatch();
        //周回走のスタートボタンのセット
        shukaisouStartButtonSet();
        //周回走の次へボタンのセット
        shukaisouNextStepButtonSet();
        //テーブルのセットを行う
        setTable();
        
        //グラフのセットを行う
        setGraph();
        //ディスプレイのセット
        displayTime(new diffrentTime(0,0,gmt));
    }
    
    function readyForKiroku(recordObj){
        //目標
        mokuhyoDataObj = recordObj.mokuhyoObj;
        //情報のセットアップ
        setInfos();
        //各種ペーンのセット
        setPanes();
        comfn.setInfo($('.info'));
        //周回走の次へボタンのセット
        shukaisouNextStepButtonSet();
        
        //ヘッダーのセット
        setHidukeHeader();
        //テーブルのセットを行う
        setTable();
        //グラフのセットを行う
        setGraph();
        //データをセットする
        setData(recordObj);
    }
    
    function setHidukeHeader(){
        var parentSpam = document.createElement("spam");
        
        var previewButton = document.createElement("button");
        previewButton.textContent = "＜＜前日";
        var calender = document.createElement("input");
        calender.setAttribute("type","date");
        calender.setAttribute("cmanCLDat","USE:ON");
        calender.id = "calender";
        parentSpam.appendChild(calender);
        var nextButton = document.createElement("button");
        nextButton.textContent = "後日＞＞";
        
        
        parentSpam.appendChild(previewButton);
        parentSpam.appendChild(calender);
        parentSpam.appendChild(nextButton);
        
        shitsumonPane.appendChild(parentSpam);
        
        setCalender();
        
        var hyoujiSpam = document.createElement("button");
        hyoujiSpam.textContent = "表示";
        hyoujiSpam.onclick = hyoujiButtonPushed;
        shitsumonPane.appendChild(hyoujiSpam);
        
    }
    
    function setCalender(){
        var date = comfn.getTodayDate();
        setDateInfo(date);
        readyCalender();
    }
    
    function readyCalender(){
        
        /*
        var mindate = param.sheet.dateFrom;
        var mindateFormat = new Date(mindate.replace(/-/g, '/'));
        */
        
        $("#calender").datepicker({
            //minDate : mindateFormat,
            maxDate : '0d',
            //ボタン
            showOn : "button",
            buttonImage: "../common/images/calendar-icon.png",
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
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: '年'};
        $.datepicker.setDefaults($.datepicker.regional['ja']);
    }
    
    function hyoujiButtonPushed(){
        
        var dateString = document.getElementById("calender").value;
            
        var year = parseInt(dateString.split("年")[0]);
        var month = parseInt(dateString.split("年")[1]);
        if(month < 10){
            month = "0" + month;
        }
        var date = parseInt(dateString.split("月")[1]);
        if(date < 10){
            date = "0" + date;
        }
        
        var datedata = year + "-" + month + "-" + date;
        
        //DBからこの生徒のデータを取得し、表示する
        getShuuaisouDataFromDate(datedata,getNewData)
    }
    
    function getNewData(data){
        if(data == null){
            alert("該当データがありませんでした");
            return;
        }
        mokuhyoDataObj = data.mokuhyoObj;
        setMokuhyoRenwel();
        //データの表示
        setData(data);
    }
    
    function setMokuhyoRenwel(){
        //目標
        if(mokuhyoDataObj){
            mokuhyoWrapText = getMokuhyoWrapTextFromMokuhyoDataObj(mokuhyoDataObj);
            mokuhyoTimeText = getMokuhyoTimeTextFromMokuhyoDataObj(mokuhyoDataObj);
            mokuhyoWrapSeccond = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoDataObj);
        }
    }
    
    function setData(recordObj){
        setLapDataFromRecord(recordObj.wraps);
        setTimeDataFromRecord(recordObj.times);
        setGraphDataFromRecord(recordObj.wraps);
        setAverageDataFromRecord(recordObj.aveTime);
        setSumTimeDataFromRecord(recordObj.sumTime);
    }
    
    function setLapDataFromRecord(laps){
        for(var i = 0; i < laps.length; i++){
            wrapTds[i].textContent = laps[i];
        }
    }
    
    function setTimeDataFromRecord(times){
        for(var i = 0; i < times.length; i++){
            sumTds[i].textContent = times[i];
        }
    }
    
    function setGraphDataFromRecord(laps){
        var min = mokuhyoWrapSeccond - 5;
        var max = mokuhyoWrapSeccond + 5;
        
        for(var i = 0; i < laps.length; i++){
            var data = laps[i];
            if(data < min){
            data = min;
            }else if(data > max){
                data = max;
            }
            graphConfig["data"][1][i + 1] = data;
        }
        ccchart.init(GraphID,graphConfig);
    }
    
    function setAverageDataFromRecord(average){
        avarageTd.textContent = average;
    }
    
    function setSumTimeDataFromRecord(sumTime){
        sumTimeTd.textContent = sumTime;
    }
    
    var sumRecordMinutes;
    var sumRecordSeccond;
    var isEnd;
    var mokuhyoDataObj;
    var mokuhyoWrapText;
    var mokuhyoTimeText;
    var mokuhyoWrapSeccond;
    function setInfos(){
        sumRecordMinutes = 0;
        sumRecordSeccond = 0;
        isEnd = false;
        currentShukai = 1;
        lastDiffrentTime = new diffrentTime(0,0,gmt);
        lastRecordDiffrentTime = new diffrentTime(0,0,gmt);
        if(mokuhyoObj){
            mokuhyoWrapText = getMokuhyoWrapTextFromMokuhyoDataObj(mokuhyoDataObj);
            mokuhyoTimeText = getMokuhyoTimeTextFromMokuhyoDataObj(mokuhyoDataObj);
            mokuhyoWrapSeccond = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoDataObj);
        }
    }
    
    var contentPane;
    var shitsumonPane;
    //ペーンのセットアップ
    function setPanes(){
        contentPane = document.getElementById("content");
        shitsumonPane = document.getElementById("shitumonContent");
    }
    
    //周回走のスタートボタン
    var shukaisouStartButton;
    //周回走スタートボタンのセットアップ
    function shukaisouStartButtonSet(){
        shukaisouStartButton = document.createElement("button");
        shukaisouStartButton.id = StartButtonID;
        shukaisouStartButton.className = StartButtonClassName;
        shukaisouStartButton.textContent = "スタート";
        shukaisouStartButton.onclick = startButtonPushed;
        shitsumonPane.appendChild(shukaisouStartButton);
        
    }
    
    //
    function startButtonPushed(){
        startWrap();
        shukaisouStartButton.textContent = "ラップ";
        shukaisouStartButton.id = WrapButtonID;
        shukaisouStartButton.onclick = wrapButtonPushed;
        blinkHeader();
    }
    
    function wrapButtonPushed(){
        //規定周回が終了したら終了処理
        if(shukaisuu === (currentShukai)){
            setRecordEnd();
            blinkClear();
        }
        //現在の時間取得
        var nowDate = new Date().getTime();
        //ラップデータの取得
        var wrapData = wrapTimeStrageObj.addWrap(nowDate);
        //レコードの記録
        recordRegist(wrapData);
        
        blinkHeader();
        
        
    }
    
    //終了処理を行う
    function setRecordEnd(){
        isEnd = true;
        shukaisouStartButton.textContent = "記録を見る";
        shukaisouStartButton.id = EndButtonID;
        shukaisouStartButton.onclick = exitShukaisou;
        sumTimeTd.textContent = lastDiffrentTime.getTimeText();
    }
    
    function exitShukaisou(){
        
        var wrapDatas = getWrapArray();
        var timeDatas = getTimeArray();
        var aveTime = avarageTd.textContent;
        var sumTime = sumTimeTd.textContent;
        var recordObj = new shuukaisouRecodeObject
        (shukaisuu,mokuhyoWrapText,mokuhyoTimeText,wrapDatas,timeDatas,aveTime,sumTime,mokuhyoDataObj);
        saveShuukaisouData(recordObj);
        setRecordObj(recordObj);
        
        location.href = "shuukaisou_kiroku.html";
    }
    
    function getWrapArray(){
        var result = [];
        for(var i = 0; i < wrapTds.length; i++){
            var data = wrapTds[i].textContent;
            result.push(data);
        }
        return result;
    }
    
    function getTimeArray(){
        var result = [];
        for(var i = 0; i < sumTds.length; i++){
            var data = sumTds[i].textContent;
            result.push(data);
        }
        return result;
    }
    
    var currentShukai;
    //総合タイムのセット
    function sumTimeRegist(index,recodeData){
        var sumTd = sumTds[index];
        var sumText = recodeData.sumTime.getRecodeText();
        sumTd.textContent = sumText;
    }
    
    //ラップタイムのセット
    function wrapTimeRegist(index,recodeData){
        var wrapTd = wrapTds[index];
        var recodeTimeObj = getRecodeTimeObj
        (recodeData.sumTime.minutes,
         recodeData.sumTime.seccond,
         sumRecordMinutes,
         sumRecordSeccond);
        wrapTd.textContent = recodeTimeObj.getTimeTextForSeccond();
        sumRecordMinutes += recodeTimeObj.minutes;
        sumRecordSeccond += recodeTimeObj.seccond;
        //秒数のセット
        var thisWrapData = getSeccond
        (recodeTimeObj.minutes,recodeTimeObj.seccond);
        //グラフのセット
        setGraphData(thisWrapData);
    }
    //次ステップボタンのセットアップ
    function shukaisouNextStepButtonSet(){
        removeNextModoruButton();
        setLogoutButton();
    }
    
    //次へ戻るボタンのリムーブ
    function removeNextModoruButton(){
        var nextButton = document.getElementById("img_tsugi");
        var modoruButon = document.getElementById("img_modoru");
        if(nextButton != null){
            var parent = nextButton.parentElement;
            parent.removeChild(nextButton);
            parent.removeChild(modoruButon);
        }
    }

    //ログアウトボタンのセットアップ
    function setLogoutButton(){
        var logoutButton = document.createElement("button");
        logoutButton.textContent = "ログアウト";
        logoutButton.className = "fu_button";
        logoutButton.id = "img_logout";
        contentPane.appendChild(logoutButton);
    }
    
    //ストップウォッチの表示
    var stopwatchDisplay;
    var gmt;
    //ストップウォッチのセット
    function setStopwatch(){
        stopwatchDisplay = document.createElement("p");
        stopwatchDisplay.id = StopWatchID;
        shitsumonPane.appendChild(stopwatchDisplay);
        gmt = new Date().getTimezoneOffset() / 60;
    }
    
    var lastDiffrentTime;
    var lastRecordDiffrentTime;
    //時間を表示する
    function displayTime(diffrentTime){
        if(!isEnd){
            stopwatchDisplay.innerHTML = diffrentTime.getTimeText();
            //現在の周回の欄に秒数を表示する
            //wrapTds[currentShukai].textContent = diffrentTime.getTimeText();
            sumTds[currentShukai-1].textContent = diffrentTime.getTimeText();
            lastDiffrentTime = diffrentTime;
            displayRecore();
        }
    }
    
    function displayRecore(){
        lastRecordDiffrentTimeObj = getRecodeTimeObj
        (lastDiffrentTime.minutes,
         lastDiffrentTime.seccond,
         lastRecordDiffrentTime.minutes,
         lastRecordDiffrentTime.seccond);
        var seccond = getSeccond(lastRecordDiffrentTimeObj.minutes,lastRecordDiffrentTimeObj.seccond);
        wrapTds[currentShukai-1].textContent = seccond;
    }
    var lastRecordDiffrentTimeObj;
    
    //レコードの登録（表に書き込み）
    function recordRegist(recodeData){
        
        currentShukai++;
        lastRecordDiffrentTime = lastDiffrentTime;
        
        averageTimeRegist();
        var currentSeccond = getSeccond
        (lastRecordDiffrentTimeObj.minutes,
         lastRecordDiffrentTimeObj.seccond);
        
        setGraphData(currentSeccond);
    }
    
    //平均タイムのセット
    function averageTimeRegist(){
        var recodeTimeObj = getAverageTimeObj
        (lastRecordDiffrentTime.minutes,lastRecordDiffrentTime.seccond,(currentShukai -1));
        avarageTd.textContent = recodeTimeObj.getTimeTextForSeccond();
    }
    
    //スタートの時間
    var startDate;
    var isStart;
    var wrapTimeStrageObj;
    //時間計測を開始する
    function startWrap(){
        if(!isStart){
            isStart = true;
            startDate = new Date().getTime();
            wrapTimeStrageObj = new wrapTimeStrage(startDate,gmt);
            interval();
        }
    }
    
    //インターバル（ストップウォッチの運用）
    function interval(){
        //現在の時間取得
        var nowDate = new Date().getTime();
        var diffTime = new diffrentTime(nowDate,startDate,gmt);
        //表示
        displayTime(diffTime);
        //セット
        if(!isEnd){
            setTimeout(interval,10);
        }
        else{
            //alert("記録が終了しました");
        }
        
    }
    
    function setGraph(){
        setCccChartBase();
        setGraphConfig();
        setInitializeGraphData();
        ccchart.init(GraphID,graphConfig);
    }
    var graphConfig;
    
    function setCccChartBase(){
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "100 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "100 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            //"paddingTop" : "25", //上パディング
            //"paddingLeft" : "140",
            "paddingRight" : "0", //右パディング
            "colorSet" : ["blue"], //データ列の色
            "useShadow" : "no", //影
            "height" : "200", //チャート高さ
            "width" : "907", //チャート幅
            "useMarker" : "arc", //マーカー種類
            "markerWidth" : "7", //マーカー大きさ
            "valYOffset" : "8", //値オフセット
            "valXOffset" : "-8", //値オフセット
            //"bg" : "#fff", //背景色
            "bg" : "#fff", //背景色
            "textColor" : "#333", //テキスト色
            "lineWidth" : "1", //ラインの太さ
            "onlyChart" : "yes",
            "xColor" : "#808080",
            "yColor" : "#000"
            
        }});
        
    }
    
    function setGraphConfig(){
        var minY = mokuhyoWrapSeccond - 5;
        var maxY = mokuhyoWrapSeccond + 5;
        
        
        graphConfig = {
            "config" : {
            "colorSet" : ["red","blue"], //データ列の色
            "minY" : minY, //Y軸最小値
            "maxY" : maxY, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            "xLines":[
                
                /*
                {
                    "val": 0,
                    "color": "blue",
                    "width": 5,
                    //"fillOver": "rgba(0,215,0,0.3)",
                    "text": '目標：1時間以内',
                    "font": "15px Arial"
                },
                */
                {
                    "val": mokuhyoWrapSeccond,
                    "color": "red",
                    "width": 5,
                    //"fillOver": "rgba(255,0,0,0.3)",
                    "text": '目標',
                    "font": "15px Arial"
                }, ]
            },
            "data" : [
                ["周回"],
                [""],
                ]
        };
    }
    
    function setInitializeGraphData(){
        for(var i =0; i <=  shukaisuu; i++){
            graphConfig["data"][0][i] = (i) + "周目";
            graphConfig["data"][1][i] = null;
        }
           
    }
    
    function setGraphData(data){
        var min = mokuhyoWrapSeccond - 5;
        var max = mokuhyoWrapSeccond + 5;
        if(data < min){
            data = min;
        }else if(data > max){
            data = max;
        }
        
        graphConfig["data"][1][(currentShukai-1)] = data;
        ccchart.init(GraphID,graphConfig);
    }
    
    //テーブルのセット
    function setTable(){
        //周目のヘッダーの取得
        var shukaiHeader = getTableHeaderContentTr();
        shitsumonPane.appendChild(shukaiHeader);
        
        //目標列の取得
        var mokuhyo = getMokuhyoPane();
        shitsumonPane.appendChild(mokuhyo);
        
        //ラップの取得
        var wrap = getWrapTimePane();
        shitsumonPane.appendChild(wrap);
        
        //タイムの取得
        var time = getTimePane();
        shitsumonPane.appendChild(time);
        
    }
    
    function getTableHeaderPane(){
        //結果格納用
        var result = document.createElement("div");
        //テーブル作成
        var table = document.createElement("table");
        //ヘッダーの作成
        var tr = getTableHeaderContentTr();
        //格納
        table.appendChild(tr);
        
        result.appendChild(table);
        return result;
    }
    
    var tableHeaders;
    function getTableHeaderContentTr(){
        tableHeaders = [];
        var tr = document.createElement("tr");
        for(var i = 0; i <= shukaisuu; i++){
            var th = document.createElement("th");
            if(i == 0){
                th.className = TableTopLeftHeaderClassName;
            }
            else{
                th.textContent = i + "周目";
                th.className = TableHeaderClassName;
                tableHeaders.push(th);
            }
            tr.appendChild(th);
        }
        return tr;
    }
    
    
    function getMokuhyoPane(){
        var result = document.createElement("div");
        
        //目標ヘッダーの取得
        var mokuhyoHeader = getMokuhyouHeader();
        result.appendChild(mokuhyoHeader);
        //グラフ用のキャンバスの取得
        var graphCanvas = getMokuhyoGraph();
        result.appendChild(graphCanvas);
        //目標タイムのペーンの取得
        var mokuhyoTimesPane = getMokuhyoTimesPane();
        result.appendChild(mokuhyoTimesPane);
        
        //目標ラップと目標タイムの取得
        return result;
    }
    
    function getMokuhyouHeader(){
        var result = document.createElement("div");
        result.className = MokuhyoTextClassName;
        result.textContent = "目標";
        return result;
    }
    
    function getMokuhyoGraph(){
        var canvas = document.createElement("canvas");
        canvas.id = GraphID;
        return canvas;
    }
    
    function getMokuhyoTimesPane(){
        var result = document.createElement("div");
        //目標ラップを取得する
        var mokuhyoWrapPane = getMokuhyoWrapPane();
        result.appendChild(mokuhyoWrapPane);
        //目標タイムを取得する
        var mokuhyoTimePane = getMokuhyoTimePane();
        result.appendChild(mokuhyoTimePane);
        
        return result;
    }
    
    function getMokuhyoWrapPane(){
        var result = document.createElement("div");
        var mokuhyoWrap = document.createElement("div");
        mokuhyoWrap.textContent = "目標ラップ";
        mokuhyoWrap.className = MokuhyoWrapTextClassName;
        result.appendChild(mokuhyoWrap);
        var mokuhyoWrapData = document.createElement("div");
        mokuhyoWrapData.textContent = mokuhyoWrapText;
        mokuhyoWrapData.className = MokuhyoWrapDataClassName;
        result.appendChild(mokuhyoWrapData);
        
        return result;
    }
    
    function getMokuhyoTimePane(){
        var result = document.createElement("div");
        var mokuhyoTime = document.createElement("div");
        mokuhyoTime.textContent = "目標タイム";
        mokuhyoTime.className = MokuhyoTimeTextClassName;
        result.appendChild(mokuhyoTime);
        var mokuhyoTimeData = document.createElement("div");
        mokuhyoTimeData.textContent = mokuhyoTimeText;
        mokuhyoTimeData.className = MokuhyoTimeDataClassName;
        result.appendChild(mokuhyoTimeData);
        
        return result;
    }
    
    function getMokuhyoTr(columCount){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.textContent = "目標";
        //th.rowSpan = 2;
        th.className = TableHeaderClassName;
        var td = document.createElement("td");
        td.colSpan = columCount;
        //td.rowSpan = 2;
        td.className = TableDataClassName;
        var canvas = document.createElement("canvas");
        canvas.id = GraphID;
        td.appendChild(canvas);
        tr.appendChild(th);
        tr.appendChild(td);
        return tr;
    }
    
    function getWrapTimePane(){
        //結果格納用
        var result = document.createElement("div");
        result.className = WrapPaneClassName;
        //見出しの取得
        var header = getWrapTimeHeader();
        result.appendChild(header);
        //ラップの取得
        var wrapTable = getWrapTimeTable();
        result.appendChild(wrapTable);
        
        //平均ラップの取得
        var average = getAveragePane();
        result.appendChild(average);
        
        return result;
    }
    
    function getWrapTimeHeader(){
        var result = document.createElement("div");
        result.textContent = "ラップ";
        result.className = WrapTextClass;
        return result;
    }
    
    function getWrapTimeTable(){
        //テーブル作成
        var table = document.createElement("table");
        table.className = WrapTableClassName;
        var tr = getWrapTimeTr();
        table.appendChild(tr);
        return table;
    }
    
    var wrapTds;
    function getWrapTimeTr(){
        var tr = document.createElement("tr");
        wrapTds = [];
        for(var i = 0;i < shukaisuu;i++){
            var td = document.createElement("td");
            td.className = TableDataClassName;
            wrapTds.push(td);
            tr.appendChild(td);
        }
        
        return tr;
    }
    
    function getAveragePane(){
        var result = document.createElement("div");
        //ヘッダー取得
        var header = getAverageHeader();
        result.appendChild(header);
        //コンテンツの取得
        var content = getAverageContent();
        result.appendChild(content);
        
        return result;
    }
    
    function getAverageHeader(){
        var result = document.createElement("div");
        result.textContent = "平均ラップ";
        result.className = WrapAverageHeaderClassName;
        return result;
    }
    
    var avarageTd;
    function getAverageContent(){
        var result = document.createElement("div");
        result.className = WrapAverageDataClassName;
        avarageTd = result;
        return result;
    }
    
    
    function getTimePane(){
        var result = document.createElement("div");
        //見出しの取得
        var header = getTimeHeader();
        result.appendChild(header);
        //タイムの取得
        var timeContent = getTimeContent();
        result.appendChild(timeContent);
        //合計タイムの取得
        var sumTime = getSumTimePane();
        result.appendChild(sumTime);
        
        return result;
    }
    
    function getTimeHeader(){
        var result = document.createElement("div");
        result.className = TimeTextClassName;
        result.textContent = "タイム";
        return result;
    }
    
    function getTimeContent(){
        var result = document.createElement("table");
        result.className = TimeTableClassName;
        var tr = getSumTimeTr();
        result.appendChild(tr);
        
        return result;
    }
    
    var sumTds;
    function getSumTimeTr(){
        var tr = document.createElement("tr");
        sumTds = [];
        for(var i = 0;i < shukaisuu;i++){
            var td = document.createElement("td");
            td.className = TableDataClassName;
            sumTds.push(td);
            tr.appendChild(td);
        }
        return tr;
    }
    
    function getSumTimePane(){
        var result = document.createElement("div");
        var header = getSumTimeHeader();
        result.appendChild(header);
        var contet = getSumTimeContetn();
        result.appendChild(contet);
        
        return result;
    }
    
    function getSumTimeHeader(){
        var result = document.createElement("div");
        result.className = TimeSumHeaderClassName;
        result.textContent = "合計タイム";
        return result;
    }
    
    var sumTimeTd;
    function getSumTimeContetn(){
        
        var result = document.createElement("div");
        sumTimeTd = result;
        //result.textContent = "ごた";
        result.className = TimeSumDataClassName;
        sumTimeTd = result;
        return result;
    }
    
    function blink(){
        if(isEnd){
            return;
        }
        if(currentBlinkHeader){
            if(currentBlinkHeader.className == BlinkClassName){
                currentBlinkHeader.className = TableHeaderClassName;
            }else{
                currentBlinkHeader.className = BlinkClassName;
            }
        }
        setTimeout(blink, 1000);
    }
    
    var isBlinkStart;
    var currentBlinkHeader;
    function blinkHeader(){
        if(isEnd){
            return;
        }
        
        blinkClear();
        currentBlinkHeader = tableHeaders[(currentShukai-1)];
        currentBlinkHeader.className = BlinkClassName;
        
        if(!isBlinkStart){
            blink();
            isBlinkStart = true;
        }
    }
    
    function blinkClear(){
        if(currentBlinkHeader){
            currentBlinkHeader.className = TableHeaderClassName;
        }
    }
    
}

//スタートボタン
const StartButtonClassName = "shukaisouStartButtonClassName";
const StartButtonID = "shukaisouStartButton";
const WrapButtonID = "shukaisouWrapButton";
const EndButtonID = "shukaisouEndButton";

//ストップウォッチ
//const StopWatchID = "stopwatchDisplay";
const StopWatchID = "stopwatchDisplay";

//テーブルクラス定数
const TableHeaderClassName = "tableHeader tableCommonWidth";
const TableTopLeftHeaderClassName = "topLeftHeader";
const TableDataClassName = "recordData tableCommonWidth tableCommonHeight";

//目標クラス
const MokuhyoTextClassName = "mokuhyoText headerCommon tableCommonWidth";
const MokuhyoTextPaneClassName = "mokuhyoTextPane tableCommonWidth";
const MokuhyoWrapTextClassName = "mokuhyoWrapText headerCommon tableCommonWidth tableCommonHeight";
const MokuhyoWrapDataClassName = "tableCommonWidth tableCommonHeight floatLeftCommon";
const MokuhyoTimeTextClassName = "mokuhyoTimeText headerCommon tableCommonWidth tableCommonHeight";
const MokuhyoTimeDataClassName = "tableCommonWidth tableCommonHeight floatLeftCommon";

//ラップクラス
const WrapPaneClassName = "wrapPane";
const WrapTextClass = "wrapText headerCommon tableCommonWidth tableCommonHeight";
const WrapTableClassName = "wrapTable";
const WrapAverageHeaderClassName = "wrapAverageHeader headerCommon tableCommonWidth";
const WrapAverageDataClassName = "floatLeftCommon tableCommonWidth tableCommonHeight";

//タイムクラス
const TimeTextClassName = "TimeText headerCommon tableCommonWidth tableCommonHeight";
const TimeTableClassName = "timeTable";
const TimeSumHeaderClassName = "timeSumHeader headerCommon tableCommonWidth tableCommonHeight";
const TimeSumDataClassName = "floatLeftCommon tableCommonWidth tableCommonHeight"


//グラフID
const GraphID = "graph";

//ブリンク
const BlinkClassName = "tableHeaderBlink";
