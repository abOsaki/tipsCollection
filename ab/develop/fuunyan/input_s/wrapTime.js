function diffrentTime(afterTime,beforeTime,gmt){
    var diffrent = new Date(afterTime - beforeTime);
    //表示情報の取得
    var milliSecond = diffrent.getMilliseconds();
    this.milliSecond = milliSecond;
    var seccond = diffrent.getSeconds();
    this.seccond = seccond;
    var minutes = diffrent.getMinutes();
    this.minutes = minutes;
    var hour = diffrent.getHours() + gmt;
    this.hour = hour;
    this.getTimeText = function(){
        var textHour = hour < 10 ? "0" + hour : hour;
        var textMinutes = minutes < 10 ? "0" + minutes : minutes;
        var textSecond = seccond < 10 ? "0" + seccond : seccond;
        var milliSecondBufu = parseInt(milliSecond / 10);
        var textMilliSecond = milliSecondBufu < 10 ? "0" + milliSecondBufu : milliSecondBufu;
        //var result = textHour + ":" + textMinutes + ":" + textSecond + ":" + textMilliSecond;
        var result = textMinutes + ":" + textSecond;
        return result;
    }
    this.getRecodeText = function(){
        var textMinutes = minutes < 10 ? "0" + minutes : minutes;
        var textSecond = seccond < 10 ? "0" + seccond : seccond;
        var result = textMinutes + ":" + textSecond;
        return result;
    }
    return this;
}

function recordTime(lastDiffrentTime,sumDiffrentTime,wrapCount){
    this.lastTime = lastDiffrentTime;
    this.sumTime = sumDiffrentTime;
    this.wrapCount = wrapCount;
    return this;
}

function wrapTimeStrage(startTime,gmt){
    var gmt = gmt;
    var startTime = startTime;
    var lastTime = startTime;
    this.startTime = startTime;
    var timeStrage = [];
    this.addWrap = function(wrapTime){
        return addWrapTime(wrapTime);
    };
    return this;
    
    //ラップタイムを追加し、ラップ（1週にかかった時間）を返す
    function addWrapTime(wrapTime){
        timeStrage.push(wrapTime);
        var lastTimeObj = getLastTime(wrapTime);
        var sumTimeObj = getSumTime(wrapTime);
        var wrapNo = getWrapNo();
        var result = new recordTime(lastTimeObj,sumTimeObj,wrapNo);
        lastTime = wrapTime;
        return result;
        
        /*
        var result = diffrentTime(wrapTime,lastTime,gmt);
        lastTime = wrapTime;
        return result;
        */
    }
    
    function getLastTime(wrapTime){
        var result = new diffrentTime(wrapTime,lastTime,gmt);
        return result;
    }
    
    function getSumTime(wrapTime){
        var result = new diffrentTime(wrapTime,startTime,gmt);
        return result;
    }
    
    function getWrapNo(){
        return timeStrage.length;
    }
    
}

function recodeTimeObj(seccond){
    this.minutes = parseInt(seccond / 60);
    this.seccond = seccond % 60;
    this.getTimeTextForSeccond = function(){
        return seccond;
    };
    return this;
}

function getRecodeTimeObj(currentMinute,currentSeccond,sumRecordMinute,sumRecordSeccond){
    var currentSumSecond = getSeccond(currentMinute,currentSeccond);
    var sumRecordSumSeccond = getSeccond(sumRecordMinute,sumRecordSeccond);
    var outputRecord = currentSumSecond - sumRecordSumSeccond;
    var result = new recodeTimeObj(outputRecord);
    return result;
}

function getSeccond(minute,seccond){
    var result = (minute * 60) + seccond;
    return result;
}

function getAverageTimeObj(sumMinute,sumSeccond,index){
    var sumSeccond = getSeccond(sumMinute,sumSeccond);
    var aveSecond = Math.round(sumSeccond / index);
    var result = new recodeTimeObj(aveSecond);
    return result;
}

/*
function getSumTimeFromMinutesSeccond(minutes,secconds){
    var sumMinutes = 0;
    for(var i = 0; i < minutes.length; i++){
        sumMinutes += minutes[i];
    }
    
    var sumSecconds = 0;
    for(var i = 0; i < secconds.length; i++){
        sumSecconds += secconds[i];
    }
    
    var sumSeccondsForCulculate = (sumMinutes * 60) + sumSecconds;
    
    var minuteSeed = parseInt(sumSeccondsForCulculate / 60);
    var seccodSeed = sumSeccondsForCulculate % 60;
    var textMinutes = minuteSeed < 10 ? "0" + minuteSeed : minuteSeed;
    var textSecond = seccodSeed < 10 ? "0" + seccodSeed : seccodSeed;
    var result = textMinutes + ":" + textSecond;
    return result;
}
*/