function inputShuukaisou(){
    this.ready = function(){
        setup();
    };
    this.notifyChangeShuukaisuu = function(pvShuukaisuu){
        notifyChangeShuukaisuu(pvShuukaisuu);
    };
    this.notifyChangeMokuhyoLap = function(pvMokuhyoLap){
        notifyChangeMokuhyoLap(pvMokuhyoLap);
    };
    this.notifyChangeMokuhyoTime = function(){
        notifyChangeMokuhyoTime();
    };
    this.notifyChangeKaime = function(pvKaime){
        notifyChangeKaime(pvKaime);
    };
    this.notifyResetButtonPush = function(){
        notifyResetButtonPush();
    };
    this.notifyChangeKyori = function(){
        notifyChangeKyori();
    };
    this.notifyKetteiButtonPush = function(){
        notifyKetteiButtonPush();
    };
    
    return this;
    
    function notifyKetteiButtonPush(){
        //周回のセット
        shuukaisuu = parseInt(document.getElementById("shuukaisuuSelect").value);
        //目標オブジェクトのセット
        setMokuhyoObject();
        //ヘッダー等の処理
        adjustDisplay();
        //目標のセット
        setMokuhyoObj(mokuhyoObj);
        //グラフのセット
        setGraph();
        //スタートボタンの有効化
        var startButton = document.getElementById("shukaisouStartButton");
        startButton.disabled = false;
        //距離のセット
        setSumKyori();
        
        /*
        //目標オブジェクトのセット
        setMokuhyoObject();
        //目標のセット
        setMokuhyoObj(mokuhyoObj);
        //グラフのセット
        setGraph();
        */
    }
    
    function setMokuhyoObject(){
        //目標オブジェクトを作成する
        //ラップ
        var mokuhyoLap = document.getElementById("mokuhyoLapSelect").value;
        //タイム
        var mokuhyoTimeMinutes = document.getElementById("mokuhyoTimeMinutesSelect").value;
        var mokuhyoTimeSeccond = document.getElementById("mokuhyoTimeSeccondSelect").value;
        
        mokuhyoLap = parseInt(mokuhyoLap);
        mokuhyoTimeMinutes = parseInt(mokuhyoTimeMinutes);
        mokuhyoTimeSeccond = parseInt(mokuhyoTimeSeccond);
        
        //メンバ変数にセット
        mokuhyoObj = createMokuhyoObj(0,mokuhyoLap,mokuhyoTimeMinutes,mokuhyoTimeSeccond);
    }
    
    function notifyChangeKaime(pvKaime){
        
        if(cvIsStart && !isEnd){
            alert("計測中は操作できません");
            rollbackKaimeButton();
            return;
        }
        
        cvKaime = pvKaime;
        
        //var date = new Date();
        //shuukaisouCommon.getda
        var date = comfn.getTodayDate();
        var dateText = date.displayYear + "-" + date.displayMonth + "-" + date.displayDate;
        
        //ここでデータを取得する処理を
        getShuuaisouDataFromDateAndKaime(dateText,cvKaime,dataRecieved);
        
    }
    
    function rollbackKaimeButton(){
        //ここでボタンを戻す処理を行うか
        var buttons = document.getElementsByClassName("kaimeButton");
        for(var i = 0; i < buttons.length; i++){
            var taisho = buttons[i];
            if(taisho.value== cvKaime){
                taisho.disabled = true;
            }else{
                taisho.disabled = false;
            }
        }
    }
    
    function dataRecieved(pvData){
        if(pvData){
            setGetData(pvData);
        }else{
            //各種データの初期化処理
            setGetNoData();
        }
    }
    
    function setGetData(pvData){
        //目標オブジェクトのセット
        mokuhyoObj = pvData.mokuhyoObj;
        setMokuhyoObj(mokuhyoObj);
        setGraph();
        //周回数のセット
        shuukaisuu = pvData.shuukai;
        setShuukaisuuSelect();
        adjustDisplay();
        //距離のセット
        var kyoriSelect = document.getElementById("kyoriSelect");
        kyoriSelect.value = pvData.kyoriOneTrack;
        setSumKyori();
        //ラップの貼り付け
        setClearLaps();
        setLapDataFromGetData(pvData.wraps);
        //タイムの貼り付け
        setClearTimes();
        setTimeDataFromGetData(pvData.times);
        //平均ラップの貼り付け
        averageTime.textContent = pvData.aveTime;
        //合計タイムの貼り付け
        sumTime.textContent = pvData.sumTime;
        //グラフの貼り付け
        shuukaisouCommon.resetGraphData();
        setGraphFromGetData(pvData.wraps);
        //決定ボタンの無効化
        var ketteiButton = document.getElementById("ketteiButton");
        ketteiButton.disabled = true;
        //スタートボタンの無効化
        var startButton = document.getElementById("shukaisouStartButton");
        //スタートボタンが取得できなかったらスタートボタンに切り替える
        if(!startButton){
            startButton = document.getElementById("shukaisouEndButton");
            startButton.id = "shukaisouStartButton";
            startButton.textContent = "スタート";
            
            startButton.onclick = startButtonPushed;
        }
        startButton.disabled = true;
        
        startButton.id = "shukaisouEndButton";
        startButton.textContent = "記録を見る";
        startButton.onclick = exitShukaisou;
        startButton.disabled = false;
        
        //やり直しボタンの無効化
        var resetButton = document.getElementById("resetButton");
        resetButton.disabled = true;
        //各種選択コントロールのdisable化
        var kyoriSelect = document.getElementById("kyoriSelect");
        kyoriSelect.disabled = true;
        var shuukaisuuSelect = document.getElementById("shuukaisuuSelect");
        shuukaisuuSelect.disabled = true;
        var mokuhyoLapSelect = document.getElementById("mokuhyoLapSelect");
        mokuhyoLapSelect.disabled = true;
        var mokuhyoTimeMinutesSelect = document.getElementById("mokuhyoTimeMinutesSelect");
        mokuhyoTimeMinutesSelect.disabled = true;
        var mokuhyoTimeSeccondSelect = document.getElementById("mokuhyoTimeSeccondSelect");
        mokuhyoTimeSeccondSelect.disabled = true;
    }
    
    function setGetNoData(){
        //ラップ初期化
        setClearLaps();
        //タイム初期化
        setClearTimes();
        //平均ラップの貼り付け
        averageTime.textContent = "0";
        //合計タイムの貼り付け
        sumTime.textContent = "0";
        //グラフ初期化
        shuukaisouCommon.resetGraphData();
        //決定ボタンの有効化
        var ketteiButton = document.getElementById("ketteiButton");
        ketteiButton.disabled = false;
        //スタートボタン有効化
        var startButton = document.getElementById("shukaisouStartButton");
        //スタートボタンが取得できなかったらスタートボタンに切り替える
        if(!startButton){
            startButton = document.getElementById("shukaisouEndButton");
            startButton.id = "shukaisouStartButton";
            startButton.textContent = "スタート";
            
            startButton.onclick = startButtonPushed;
            
            currentLap = 1;
            isEnd = false;
            cvIsStart = false;
            lastRecordDiffrentTime = new diffrentTime(0,0,gmt);
        }
        startButton.disabled = true;
        //やり直しボタンの有効化
        var resetButton = document.getElementById("resetButton");
        resetButton.disabled = true;
        //各種選択コントロールのdisable化
        var kyoriSelect = document.getElementById("kyoriSelect");
        kyoriSelect.disabled = false;
        var shuukaisuuSelect = document.getElementById("shuukaisuuSelect");
        shuukaisuuSelect.disabled = false;
        var mokuhyoLapSelect = document.getElementById("mokuhyoLapSelect");
        mokuhyoLapSelect.disabled = false;
        var mokuhyoTimeMinutesSelect = document.getElementById("mokuhyoTimeMinutesSelect");
        mokuhyoTimeMinutesSelect.disabled = false;
        var mokuhyoTimeSeccondSelect = document.getElementById("mokuhyoTimeSeccondSelect");
        mokuhyoTimeSeccondSelect.disabled = false;
        
        //周回数と
        setSumKyori();
    }
    
    function setSumKyori(){
        var shuu = document.getElementById("shuukaisuuSelect").value;
        var kyori = document.getElementById("kyoriSelect").value;
        var sumKyori = shuu * kyori;
        sumKyori = sumKyori.toLocaleString();
        var kyoriText = sumKyori + "m";
        var sumkyoriDom = document.getElementById("sumKyori");
        sumkyoriDom.textContent = kyoriText;
    }
    
    function setClearLaps(){
        for(var i = 1; i < laps.length; i++){
            laps[i].textContent = ""; 
        }
    }
    
    function setLapDataFromGetData(pvLapDats){
        for(var i = 0; i < pvLapDats.length; i++){
            laps[i+1].textContent = pvLapDats[i];
        }
    }
    
    function setClearTimes(){
        for(var i = 1; i < times.length; i++){
            times[i].textContent = ""; 
        }
    }
    
    function setTimeDataFromGetData(pvTimeDatas){
        for(var i = 0; i < pvTimeDatas.length; i++){
            times[i+1].textContent = pvTimeDatas[i];
        }
    }
    
    function setGraphFromGetData(pvLapDats){
        for(var i = 0; i < pvLapDats.length; i++){
            var taisho = pvLapDats[i];
            if(taisho){
                shuukaisouCommon.setGraphData((i+2),taisho);
            }
        }
    }
    
    function notifyResetButtonPush(){
        if(isEnd){
            isEnd = false;
            reset();
            return;
        }
        
        if(cvIsStart){
            cvIsReset = true;
        }else{
            reset();
        }
    }
    
    function resetIntervalCallback(){
        cvIsReset = false;
        cvIsStart = false;
        reset();
    }
    
    function reset(){
        //グラフの初期化
        shuukaisouCommon.resetGraphData();
        //ヘッダの初期化
        headerReset();
        //ラップの初期化
        lapReset();
        //タイムの初期化
        timeReset();
        //平均ラップの初期化
        averageTime.textContent = 0;
        //合計タイムの初期化
        sumTime.textContent = 0;
        //カレント周回の初期化
        currentLap = 1;
        //ブリンク終了
        blinkClear();
        //ストップウォッチの初期化
        stopWatch.textContent = "00:00";
        //スタートボタンのセット
        resetStartButton();
        //ラップの数字の初期化
        lastRecordDiffrentTime = new diffrentTime(0,0,gmt);
        //ブリンクを戻す
        isBlinkStart = false;
        //決定ボタンを選択可に
        var ketteiButton = document.getElementById("ketteiButton");
        ketteiButton.disabled = false;
    }
    
    function headerReset(){
        for(var i = 1; i < currentLap; i++){
            var header = headers[i];
            header.style.background = "";
        }
    }
    
    function lapReset(){
        for(var i = 0; i < laps.length; i++){
            var taisho = laps[i];
            if(taisho){
                taisho.textContent = "";
                taisho.style.backgroundColor = "";
            }
            
        }
    }
    
    function timeReset(){
        for(var i = 0; i < times.length; i++){
            var taisho = times[i];
            if(taisho){
                taisho.textContent = "";
                taisho.style.backgroundColor = "";
            }
        }
    }
    
    var mokuhyoObj;
    var stopWatch;
    var mokuhyoWrapSeccond;
    var gmt;
    var isEnd;
    var headers;
    var laps;
    var times;
    var currentLap;
    var averageTime;
    var sumTime;
    var shuukaisuu;
    var cvKaime;
    function setup(){
        //フィールドのセット
        setField();
        /*
        //ここで周回数に合わせて画面の構成を変更する
        adjustDisplay();
        //目標のセット
        mokuhyoObj = getMokuhyoObj();
        setMokuhyoObj(mokuhyoObj);
        //グラフのセット
        setGraph();
        */
        //スタートボタンのセット
        setStartButtonEvent();
        
        //ここで本日のデータを取得する
        var date = comfn.getTodayDate();
        var dateText = date.displayYear + "-" + date.displayMonth + "-" + date.displayDate;
        getShuuaisouDataFromDate(dateText,setTryTagHeader);
    }
    
    function setTryTagHeader(pvDatas){
        for(var i = 0; i < pvDatas.length; i++){
            var taisho = pvDatas[i];
            var kaime = taisho.try;
            //回目に応じてタブボタンを取得する
            /*
            var idSeed = "kaimeButton";
            var id = idSeed + kaime;
            var kaimeButton = document.getElementById(id);
            kaimeButton.style.backgroundColor = "silver";
            kaimeButton.textContent += "(終了)";
            */
            setTryTagHeaderFromIndex(kaime);
        }
    }
    
    function setTryTagHeaderFromIndex(pvKaime){
        var idSeed = "kaimeButton";
        var id = idSeed + pvKaime;
        var kaimeButton = document.getElementById(id);
        kaimeButton.style.backgroundColor = "orange";
        kaimeButton.textContent += "(終了)";
    }
    
    //周回に合わせて画面の構成を変更する
    function adjustDisplay(){
        setShuukaisuuDisplay();
        setShuukaisuuSelect();
    }
    
    function setShuukaisuuDisplay(){
        for(var i = 0; i < 11; i++){
            var headerID = "header" + (i + 1);
            var header = document.getElementById(headerID);
            var text = (i + 1) + "周目";
            header.textContent = text;
            header.style.backgroundColor = "";
        }
        
        for(var j = shuukaisuu + 1; j <= 11; j++){
            var headerID = "header" + j;
            var header = document.getElementById(headerID);
            header.textContent = "";
            header.style.backgroundColor = "";
        }
    }
    
    function setShuukaisuuSelect(){
        var shuukaisuuSelect = document.getElementById("shuukaisuuSelect");
        shuukaisuuSelect.selectedIndex = shuukaisuu - 1;
    }
    
    function notifyChangeKyori(){
        setSumKyori();
    }
    
    function notifyChangeShuukaisuu(pvShuukaisuu){
        shuukaisuu = parseInt(pvShuukaisuu);
        setShuukaisuuDisplay();
        setSumKyori();
        setMokuhyoTimeFromChange();
        changeMokuhyos();
    }
    
    function setField(){
        //周回数を10にセットする
        //shuukaisuu = 10;
        cvKaime = 1;
        stopWatch = document.getElementById("stopWatch");
        gmt = new Date().getTimezoneOffset() / 60;
        isEnd = false;
        setHeaders();
        setLaps();
        setTimes();
        currentLap = 1;
        averageTime = document.getElementById("averageiLap");
        sumTime = document.getElementById("sumTime");
        lastRecordDiffrentTime = new diffrentTime(0,0,gmt);
    }
    
    function setHeaders(){
        headers = [];
        var dummy = "";
        headers.push(dummy);
        var firstID = "header";
        for(var i = 1; i <= 11; i++){
            var id = firstID + i;
            var dom = document.getElementById(id);
            headers.push(dom);
        }
        
    }
    
    function setLaps(){
        laps = [];
        var dummy = "";
        laps.push(dummy);
        var firstID = "lap";
        for(var i = 1; i <= 11; i++){
            var id = firstID + i;
            var dom = document.getElementById(id);
            laps.push(dom);
        }
    }
    
    function setTimes(){
        times = [];
        var dummy = "";
        times.push(dummy);
        var firstID = "time";
        for(var i = 1; i <= 11; i++){
            var id = firstID + i;
            var dom = document.getElementById(id);
            times.push(dom);
        }
    }
    
    function setMokuhyoObj(mokuhyoObj){
        shuukaisouCommon.setMokuhyoObj(mokuhyoObj);
        mokuhyoWrapSeccond = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoObj);
        
        
        var mokuhyoLapSelect = document.getElementById("mokuhyoLapSelect");
        mokuhyoLapSelect.value = mokuhyoWrapSeccond;
        var mokuhyoTimeMinutesSelect = document.getElementById("mokuhyoTimeMinutesSelect");
        mokuhyoTimeMinutesSelect.value = mokuhyoObj.mokuhyoTimeObj.minutes;
        var mokuhyoTimeSeccondSelect = document.getElementById("mokuhyoTimeSeccondSelect");
        mokuhyoTimeSeccondSelect.value = mokuhyoObj.mokuhyoTimeObj.seccond;
        
    }
    
    function setMokuhyoTimeFromChange(){
        //ラップの取得
        var mokuhyoLap = document.getElementById("mokuhyoLapSelect").value;
        mokuhyoLap = parseInt(mokuhyoLap);
        var seccond = parseInt(mokuhyoLap);
        //周回数
        var shuukaisuu = document.getElementById("shuukaisuuSelect").value;
        shuukaisuu = parseInt(shuukaisuu);
        //合計のセコンド
        seccond *= shuukaisuu;
        //分
        var minutes = parseInt(seccond / 60);
        //秒
        var seccond = parseInt(seccond % 60);
        $('#mokuhyoTimeMinutesSelect').val(minutes);
        $('#mokuhyoTimeSeccondSelect').val(seccond);
    }
    
    function notifyChangeMokuhyoLap(pvMokuhyoLap){
        /*
        //☆☆☆新しく目標オブジェクトを作成する
        var second = parseInt(pvMokuhyoLap);
        var mokuhyoLapObj = getStaticMokuhyoObj(0,second);
        mokuhyoObj.mokuhyoWrapObj = mokuhyoLapObj;
        shuukaisouCommon.setMokuhyoObj(mokuhyoObj);
        mokuhyoWrapSeccond = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoObj);
        setGraph();
        */
        setMokuhyoTimeFromChange();
        changeMokuhyos();
    }
    
    function changeMokuhyos(){
        //目標オブジェクトのセット
        setMokuhyoObject();
        //目標のセット
        setMokuhyoObj(mokuhyoObj);
        //グラフのセット
        setGraph();
    }
    
    function notifyChangeMokuhyoTime(){
        //目標タイムの取得をする
        var minutes = document.getElementById("mokuhyoTimeMinutesSelect").value;
        var seccond = document.getElementById("mokuhyoTimeSeccondSelect").value;
        //目標タイムからseccondの取得
        var minutesSeccond = parseInt(minutes) * 60;
        seccond = parseInt(seccond);
        seccond += minutesSeccond;
        //周回数で割る
        var shuukaisuu = document.getElementById("shuukaisuuSelect").value;
        var aveLap = seccond / shuukaisuu;
        aveLap = parseInt(aveLap);
        //ラップにセット
        var mokuhyoLapSelect = document.getElementById("mokuhyoLapSelect");
        var value;
        if(aveLap < 59){
            value = aveLap + "";
            $('#mokuhyoLapSelect').val(value);
        }else{
            value = 59 +"";
            $('#mokuhyoLapSelect').val(value);
        }
        changeMokuhyos();
    }
        
    function setGraph(){
        shuukaisouCommon.setGraph(mokuhyoWrapSeccond);
    }
    
    function setStartButtonEvent(){
        var startButton = document.getElementById("shukaisouStartButton");
        startButton.onclick = startButtonPushed;
    }
    
    function startButtonPushed(){
        var startButton = document.getElementById("shukaisouStartButton");
        startButton.id = "shukaisouWrapButton";
        startButton.textContent = "ラップ";
        startButton.onclick = lapButtonPushed;
        startLap();
        blinkHeader();
        //決定ボタンの無効化
        var ketteiButton = document.getElementById("ketteiButton");
        ketteiButton.disabled = true;
        //やり直しボタンの有効化
        var resetButton = document.getElementById("resetButton");
        resetButton.disabled = false;
    }
    
    function setEnd(){
        isEnd = true;
        var lapButton = document.getElementById("shukaisouWrapButton");
        lapButton.id = "shukaisouEndButton";
        lapButton.textContent = "記録を見る";
        lapButton.onclick = exitShukaisou;
        sumTime.textContent = lastDiffrentTime.getTimeText();
        //やり直しボタンの有効化
        var resetButton = document.getElementById("resetButton");
        resetButton.disabled = true;
        blinkClear();
        setTryTagHeaderFromIndex(cvKaime);
    }
    
    function resetStartButton(){
        var startButton = document.getElementById("shukaisouStartButton");
        if(startButton){
            return;
        }
        
        var lapButton = document.getElementById("shukaisouWrapButton");
        if(lapButton){
            lapButton.id = "shukaisouStartButton";
            lapButton.textContent = "スタート";
            lapButton.onclick = startButtonPushed;
            return;
        }
        
        var endButton = document.getElementById("shukaisouEndButton");
        if(endButton){
            endButton.id = "shukaisouStartButton";
            endButton.textContent = "スタート";
            endButton.onclick = startButtonPushed;
            return;
        }
    }
    
    function lapButtonPushed(){
        if(currentLap === shuukaisuu){
            setEnd();
        }
        //現在の時間取得
        var nowDate = new Date().getTime();
        //ラップデータの取得
        var wrapData = wrapTimeStrageObj.addWrap(nowDate);
        //レコードの記録
        recordRegist(wrapData);
        
        blinkHeader();
        
        if(isEnd){
            saveShukaisou();
        }
        
        //過去テーブルの背景を変える
        changeKakoTable();
    }
    
    function changeKakoTable(){
        
        var backgroundColor;
        if(isEnd){
            backgroundColor = "";
        }else{
            backgroundColor = "silver";
        }
        
        for(var i = 1; i < currentLap; i++){
            var header = headers[i];
            header.style.background = backgroundColor;
            var lap = laps[i];
            lap.style.background = backgroundColor;
            var time = times[i];
            time.style.background = backgroundColor;
        }
    }
    
    function revertSilver(){
        for(var i = 1; i < currentLap; i++){
            var header = headers[i];
            header.style.background = "";
            var lap = laps[i];
            lap.style.background = "";
            var time = times[i];
            time.style.background = "";
        }
    }
    
    function exitShukaisou(){
        moveUrlWidthParam('../kiroku');
//        location.href = "../kiroku";
        
    }
    
    function saveShukaisou(){
        var wrapDatas = getWrapArray();
        var timeDatas = getTimeArray();
        var aveTime = averageTime.textContent;
        var sumTimeRecode = sumTime.textContent;
        var kyoriOneTrack = document.getElementById("kyoriSelect").value;
        var recordObj = new shuukaisouRecodeObject
        (shuukaisuu,shuukaisouCommon.getMokuhyoLapText(),shuukaisouCommon.getMokuhyoTimeText(),wrapDatas,timeDatas,aveTime,sumTimeRecode,mokuhyoObj,cvKaime,kyoriOneTrack);
        saveShuukaisouData(recordObj);
        setRecordObj(recordObj);
    }
    
    function getWrapArray(){
        var result = [];
        for(var i = 1; i < laps.length; i++){
            var data = laps[i].textContent;
            result.push(data);
        }
        return result;
    }
    
    function getTimeArray(){
        var result = [];
        for(var i = 1; i < times.length; i++){
            var data = times[i].textContent;
            result.push(data);
        }
        return result;
    }
    
    //スタートの時間
    var startDate;
    function startLap(){
        startDate = new Date().getTime();
        wrapTimeStrageObj = new wrapTimeStrage(startDate,gmt);
        interval();
    }
    
    var cvIsStart;
    var cvIsReset;
    //インターバル（ストップウォッチの運用）
    function interval(){
        cvIsStart = true;
        //現在の時間取得
        var nowDate = new Date().getTime();
        var diffTime = new diffrentTime(nowDate,startDate,gmt);
        //表示
        displayTime(diffTime);
        //セット
        if(!isEnd){
            if(!cvIsReset){
                setTimeout(interval,10);
            }else{
                resetIntervalCallback();
            }
        }
        else{
            //alert("記録が終了しました");
        }
    }
    
    var lastDiffrentTime;
    //時間を表示する
    function displayTime(diffrentTime){
        if(!isEnd){
            stopWatch.textContent = diffrentTime.getTimeText();
            times[currentLap].textContent = diffrentTime.getTimeText();
            lastDiffrentTime = diffrentTime;
            displayLap();
            /*
            stopwatchDisplay.innerHTML = diffrentTime.getTimeText();
            //現在の周回の欄に秒数を表示する
            //wrapTds[currentShukai].textContent = diffrentTime.getTimeText();
            sumTds[currentShukai-1].textContent = diffrentTime.getTimeText();
            lastDiffrentTime = diffrentTime;
            displayRecore();
            */
        }
    }
    
    var lastRecordDiffrentTime;
    function displayLap(){
        lastRecordDiffrentTimeObj = getRecodeTimeObj
        (lastDiffrentTime.minutes,
         lastDiffrentTime.seccond,
         lastRecordDiffrentTime.minutes,
         lastRecordDiffrentTime.seccond);
        var seccond = getSeccond(lastRecordDiffrentTimeObj.minutes,lastRecordDiffrentTimeObj.seccond);
        laps[currentLap].textContent = seccond;
    }
    
    //レコードの登録（表に書き込み）
    function recordRegist(recodeData){
        
        currentLap++;
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
        (lastRecordDiffrentTime.minutes,lastRecordDiffrentTime.seccond,(currentLap-1));
        averageTime.textContent = recodeTimeObj.getTimeTextForSeccond();
    }
    
    function setGraphData(data){
        shuukaisouCommon.setGraphData(currentLap,data);
    }
    
    function blink(){
        if(isEnd){
            return;
        }
        
        if(!cvIsStart){
            return;
        }
        
        if(currentBlinkHeader){
            if(currentBlinkHeader.className == "blinkTtl shuukaiHeader"){
                currentBlinkHeader.className = "ttl shuukaiHeader";
            }else{
                currentBlinkHeader.className = "blinkTtl shuukaiHeader";
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
        currentBlinkHeader = headers[(currentLap)];
        currentBlinkHeader.className = "blinkTtl shuukaiHeader";
        
        if(!isBlinkStart){
            blink();
            isBlinkStart = true;
        }
    }
    
    function blinkClear(){
        if(currentBlinkHeader){
            currentBlinkHeader.className = "ttl shuukaiHeader";
        }
    }
}

//const BlinkClassName = "blinkTtl";
//const TableHeaderClassName = "ttl";