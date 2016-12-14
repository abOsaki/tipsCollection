function getStaticMokuhyoObj(minutes,seccond){
    var result = new mokuhyoObj(minutes,seccond);
    return result;
}

function mokuhyoObj(minutes,seccond){
    this.minutes = minutes;
    this.seccond = seccond;
    return this;
}

function mokuhyoDataObj(mokuhyoTimeObj,mokuhyoWrapObj){
    this.mokuhyoTimeObj = mokuhyoTimeObj;
    this.mokuhyoWrapObj = mokuhyoWrapObj;
    return this;
}

function createMokuhyoObj(pvLapMinutes,pvLapSeccond,pvTimeMinutes,pvTimeSeccond){
    var lapObj = new mokuhyoObj(pvLapMinutes,pvLapSeccond);
    var timeObj = new mokuhyoObj(pvTimeMinutes,pvTimeSeccond);
    var result = new mokuhyoDataObj(timeObj,lapObj);
    return result;
}

function getMokuhyoWrapTextFromMokuhyoDataObj(mokuhyoDataObj){
    return getTimeTextFromMokuhyoObj(mokuhyoDataObj.mokuhyoWrapObj);
}

function getMokuhyoTimeTextFromMokuhyoDataObj(mokuhyoDataObj){
    return getTimeTextFromMokuhyoObj(mokuhyoDataObj.mokuhyoTimeObj);
}

function getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoDataObj){
    return getMokuhyoSeccondFromMokuhyoObj(mokuhyoDataObj.mokuhyoWrapObj)
}

function getMokuhyoTimeSeccondFromMokuhyoDataObj(mokuhyoDataObj){
    return getMokuhyoSeccondFromMokuhyoObj(mokuhyoDataObj.mokuhyoTimeObj)
}

function getMokuhyoSeccondFromMokuhyoObj(mokuhyoObj){
    var minutes;
    if(mokuhyoObj.minutes){
        minutes = mokuhyoObj.minutes;
    }else{
        minutes = 0;
    }
    var seccond;
    if(mokuhyoObj.seccond){
        seccond = mokuhyoObj.seccond;
    }else{
        seccond = 0;
    }
    
    var minutesSeccond = minutes * 60;
    var result = minutesSeccond + seccond;
    return result;
}

function getMokuhyoObjMinute(mokuhyoObj){
    var result;
    if(mokuhyoObj.minutes){
        result = mokuhyoObj.minutes;
    }else{
        result = 0;
    }
    return result;
}

function getMokuhyoObjSeccond(mokuhyoObj){
    var result;
    if(mokuhyoObj.seccond){
        result = mokuhyoObj.seccond;
    }else{
        result = 0;
    }
    return result;
}

function getTimeTextFromMokuhyoObj(mokuhyoObj){
    var minutes;
    if(mokuhyoObj.minutes){
        minutes = mokuhyoObj.minutes;
    }else{
        minutes = 0;
    }
    var seccond;
    if(mokuhyoObj.seccond){
        seccond = mokuhyoObj.seccond;
    }else{
        seccond = 0;
    }
    
    var textMinutes = minutes < 10 ? "0" + minutes : minutes;
    var textSecond = seccond < 10 ? "0" + seccond : seccond;
    var result = textMinutes + ":" + textSecond;
    return result;
}