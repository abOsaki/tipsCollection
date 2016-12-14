function kikanHeikinMode(){
    this.ready = function(){
        
    }
    this.notifyHyoujiPushed = function(){
        //データを取得する
        changeData();
    }
    this.notifyFocus= function(){
        setGraph();
        changeData();
    }
    /*
    this.getSelectedDate = function(){
        return getSelectedDate();
    }
    */
    return this;
    
    function changeData(){
        var startTime = shuukaisouCommon.getKikanHeikinStartTime();
        var endTime = shuukaisouCommon.getKikanHeikinEndTime();
        //データ取得
        getShuukaisouDataFromDateRange(startTime,endTime,dataRecieved);
    }
    
    function dataRecieved(data){
        var oneDayKirokus = [];
        var currentDate;
        var kirokus = [];
        for(var i = 0; i < data.length; i++){
            var taishoData = data[i];
            var dateText = taishoData.date.substring(0,10);
            if(currentDate){
                currentDate = dateText;
            }
            
            if(currentDate == dateText){
                kirokus.push(taishoData);
            }else{
                //条件終了のため一度登録
                var oneDayKiroku = new oneDayKirokuObject
                (currentDate,kirokus);
                oneDayKirokus.push(oneDayKiroku);
                
                currentDate = dateText;
                kirokus = [];
                kirokus.push(taishoData);
            }
        }
        if(kirokus.length > 0){
            //条件終了のため一度登録
            var oneDayKiroku = new oneDayKirokuObject
            (currentDate,kirokus);
            oneDayKirokus.push(oneDayKiroku);
        }
    }
    
    function setGraph(){
        
    }
}

function oneDayKirokuObject(pvDate,pvKirokus){
    this.date = pvDate;
    this.kirokus = pvKirokus;
    return this;
}

function bunsekiMode(){
    this.ready = function(){
        
    }
    this.notifyHyoujiPushed = function(){
        //データを取得する
        changeData();
    }
    this.notifyFocus= function(){
        setGraph();
        changeData();
    }
    this.getSelectedDate = function(){
        return getSelectedDate();
    }
    return this;
    
    function setGraph(){
        shuukaisouCommon.setBunsekiGraph();
    }
    
    function changeData(){
        /*
        //スタートタイムとエンドタイムを取得する
        var startTime = shuukaisouCommon.getBunsekiStartTime();
        var endTime = shuukaisouCommon.getBunsekiEndTime();
        */
        
        var time = shuukaisouCommon.getBunsekiTime();
        
        //データ取得
        getShuukaisouDataFromDateRange(time,time,dataRecieved);
    }
    
    function dataRecieved(data){
        
        var shuu = 0;
        var goukeiKyori = 0;
        var sumSeccond = 0;
        var maxs = [];
        var mins = [];
        
        for(var i = 0; i < data.length; i++){
            var taisho = data[i];
            var taishoData = JSON.parse(taisho.data);
            shuu += taishoData.shuukai;
            kyoriOneTrack = parseInt(taishoData.kyoriOneTrack);
            var sogoKyori = kyoriOneTrack * taishoData.shuukai;
            goukeiKyori += sogoKyori;
            
            var sumTimeArray = taishoData.sumTime.split(":");
            //分
            var minutesText = sumTimeArray[0];
            var minutes = parseInt(minutesText);
            //秒
            var seccondText = sumTimeArray[1];
            var seccond = parseInt(seccondText);
            sumSeccond += getSeccond(minutes,seccond);
            
            var maxKouho = getMaxLap(taishoData.wraps);
            maxs.push(maxKouho);
            var minKouho = getMinLap(taishoData.wraps);
            mins.push(minKouho);
        }
        setSumShuukai(shuu);
        setSumKyori(goukeiKyori);
        setSumTime(sumSeccond);
        setAveTime(sumSeccond,data.length);
        
        //平均秒
        var aveSeccond = Math.round(sumSeccond / shuu); //parseInt(sumSeccond / shuu);
        setAveLap(aveSeccond);
        
        var maxLap = Math.max.apply(null,maxs);
        var minLap = Math.min.apply(null,mins);
        var sabun = maxLap - minLap;
        
        shuukaisouCommon.setBunsekiGraphData(data,aveSeccond,sabun);
    }
    
    function getMaxLap(pvLaps){
        return Math.max.apply(null,pvLaps);
    }
    
    function getMinLap(pvLaps){
        var datas = $.grep(pvLaps,
                        function(elem, index) {
                        // ageプロパティの値でフィルター
                        return (elem);
        });
        return Math.min.apply(null,datas);
    }
    
    function setSumShuukai(pvShuukai){
        var shuukaiText = pvShuukai + "周";
        var shuuDom = document.getElementById("shuuData");
        shuuDom.textContent = shuukaiText;
    }
    
    function setSumKyori(pvKyori){
        var kyori = pvKyori.toLocaleString();
        var kyoriText = kyori + "m";
        var kyoriDom = document.getElementById("kyoriData");
        kyoriDom.textContent = kyoriText;
    }
    
    function setSumTime(pvSeccond){
        var minutes = parseInt(pvSeccond / 60);
        var seccond = pvSeccond % 60;
        
        if(minutes < 10){
            minutes = "0" + minutes;
        }
        
        if(seccond < 10){
            seccond = "0" + seccond;
        }
        
        var timeText = minutes + ":" + seccond;
        var sumTimeDom = document.getElementById("sumTimeData");
        sumTimeDom.textContent = timeText;
    }
    
    function setAveTime(pvSeccond,pvTry){
        var aveSeccond = pvSeccond / pvTry;
        
        var minutes = parseInt(aveSeccond / 60);
        var seccond = parseInt(aveSeccond % 60);
        
        if(minutes < 10){
            minutes = "0" + minutes;
        }
        
        if(seccond < 10){
            seccond = "0" + seccond;
        }
        
        var timeText = minutes + ":" + seccond;
        var aveTimeDom = document.getElementById("aveTimeData");
        aveTimeDom.textContent = timeText;
    }
    
    function setAveLap(pvSeccond){
        var aveTimeDom = document.getElementById("aveLapData");
        aveTimeDom.textContent = pvSeccond;
    }
    
    function getSelectedDate(){
        return shuukaisouCommon.getBunsekiSelectedDate();
    }
}