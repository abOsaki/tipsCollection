function showShuukaisou(){
    this.ready = function(){
        setup();
    }
    this.setKiroku = function(recodeObj){
        if(mokuhyoObj){
            setData(recodeObj);
        }
        else{
            chnageData();
        }
    }
    this.notifyHyoujiPushed = function(){
        chnageData();
    }
    
    this.notifyFocus= function(){
        if(mokuhyoObj){
            setGraph(mokuhyoObj);
        }
        chnageData();
    }
    
    this.getSelectedDate = function(){
        return getSelectedDate();
    }
    return this;
    
    var mokuhyoObj;
    var mokuhyoWrapSeccond;
    var gmt;
    var laps;
    var times;
    var averageTime;
    var sumTime;
    function setup(){
        //フィールドのセット
        setField();
        //目標のセット
        mokuhyoObj = getMokuhyoObj();
        
        if(mokuhyoObj){
            setMokuhyoObj(mokuhyoObj);
        }else{
        }
    }
    
    function setField(){
        gmt = new Date().getTimezoneOffset() / 60;
        setLaps();
        setTimes();
        averageTime = document.getElementById("averageiLap");
        sumTime = document.getElementById("sumTime");
    }
    
    function setLaps(){
        laps = [];
        var dummy = "";
        laps.push(dummy);
        var firstID = "lap";
        for(var i = 1; i <= 10; i++){
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
        for(var i = 1; i <= 10; i++){
            var id = firstID + i;
            var dom = document.getElementById(id);
            times.push(dom);
        }
    }
    
    function setData(recodeObj){
        if(recodeObj){
            setMokuhyoObj(recodeObj.mokuhyoObj);
            setLapData(recodeObj.wraps);
            setTimeData(recodeObj.times);
            setAverageData(recodeObj.aveTime);
            setSumTimeData(recodeObj.sumTime);
            setGraph(recodeObj.mokuhyoObj);
            setGraphDataFromRecord(recodeObj.wraps);

            adjustDisplay(recodeObj.wraps.length);
        }else{
            //全部初期化
            
            
        }
    }
    
    //周回に合わせて画面の構成を変更する
    function adjustDisplay(count){
        for(var i = 1; i <= 10; i++){
            var headerID = "header" + i;
            var header = document.getElementById(headerID);
            header.textContent = (i) + "周目";
        }
        
        for(var i = count + 1; i <= 10; i++){
            var headerID = "header" + i;
            var header = document.getElementById(headerID);
            header.textContent = "";
        }
    }
    
    function setMokuhyoObj(mokuhyoObj){
        shuukaisouCommon.setMokuhyoObj(mokuhyoObj);
        mokuhyoWrapSeccond = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoObj);
    }
    
    function setLapData(lapDatas){
        for(var i = 1; i < laps.length; i++){
            laps[i].textContent = ""; 
        }
        
        for(var i = 0; i < lapDatas.length; i++){
            laps[i+1].textContent = lapDatas[i];
        }
    }
    
    function setTimeData(timeDatas){
        for(var i = 1; i < times.length; i++){
            times[i].textContent = ""; 
        }
        
        for(var i = 0; i < timeDatas.length; i++){
            times[i+1].textContent = timeDatas[i];
        }
    }
    
    function setAverageData(average){
        averageTime.textContent = average;
    }
    
    function setSumTimeData(sumTimeData){
        sumTime.textContent = sumTimeData;
    }
    
    function setGraph(mokuhyoObj){
        var mokuhyoWrapSeccond = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoObj);
        shuukaisouCommon.setGraph(mokuhyoWrapSeccond);
    }
    
    function setGraphDataFromRecord(laps){
        shuukaisouCommon.setGraphDataFromRecode(laps);
    }
    
    function chnageData(){
        //日付データの取得
        var date = shuukaisouCommon.getHidukebetsuDate();
        //日付データからデータの取得
        getShuuaisouDataFromDate(date,getNewData)
    }
    
    function getNewData(data){
        setData(data);
    }
    
    function getSelectedDate(){
        
    }
    
}