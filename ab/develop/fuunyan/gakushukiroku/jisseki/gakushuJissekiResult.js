var taishoPHPDate;
function setHiduke(){
    taishoPHPDate = dateGakushuCommon.getPHPDateSession();
    var hiduke = dateGakushuCommon.getGappiTextByPHPDate(taishoPHPDate);
    var hidukeContent = document.getElementById('hidukeContent');
    hidukeContent.textContent = hiduke;
}

function dataLoad(){
    //対象日付からデータを取得する（計画と実績）
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyPlanLogFromDate",
        'userID' : userID,
        'periodID' : 0,
        'targetDate' : taishoPHPDate
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setData(data);
    }).fail(function(data){
        alert('データの取得に失敗しました');
    });
    
}

function setData(pvData){
    //グラフのセット
    graphFunc2.setup(pvData);
    //合計のセット
    sumPlanLog.set(pvData);
    //パーセントのセット
    sumPlanLog.percentDisplay();
    //横グラフのセット
    sumPlanLog.setYokoGraph();
}

var sumPlanLog = function(){
    
    var planSumTime;
    var logSumTime;
    
    function setPlanYokoGraph(){
        var planTimePane = document.getElementById('planTimePane');
        for(var i = 0; i < planSumTime; i++){
            var graph = document.createElement('div');
            graph.className ='planYokoGraph';
            planTimePane.appendChild(graph);
        }
    }
    
    function setLogYokoGraph(){
        var logTimePane = document.getElementById('logTimePane');
        for(var i = 0; i < logSumTime; i++){
            var graph = document.createElement('div');
            graph.className ='logYokoGraph';
            logTimePane.appendChild(graph);
        }
    }
    
    return {
        set : function(pvData){
            planSumTime = 0;
            logSumTime = 0;
            for(var i = 0; i < pvData.length; i++){
                var data = pvData[i];
                var planLogObj = new kamokubetuPlanLogObj(data);
                planSumTime += planLogObj.getPlanSpendTime();
                logSumTime += planLogObj.getJissekiSpendTime();
            }
            var sumTimeContent = document.getElementById('sumTimeContent');
            sumTimeContent.textContent = logSumTime;
        },
        percentDisplay : function(){
            var kekka;
            if(planSumTime == 0){
                kekka = '--';
            }else{
                kekka = parseInt((logSumTime / planSumTime) * 100);
            }
            
            var percent = document.getElementById('percent');
            percent.textContent = kekka + '%';
        },
        setYokoGraph : function(){
            setPlanYokoGraph();
            setLogYokoGraph();
        }
    }
}();

var graphFunc2 = function(){
    
    function setup(pvData){
        for(var i = 0; i < pvData.length; i++){
            var data = pvData[i];
            var planLogObj = new kamokubetuPlanLogObj(data);
            
            setupYotei(planLogObj.planSpendTime,planLogObj.getCurriculumID());
            setupResult(planLogObj.jissekiSpendTime,planLogObj.getCurriculumID());
            
//            var taishoArray = getTaishoArray(planLogObj.getCurriculumID());
//            setupYotei(planLogObj.planSpendTime,taishoArray);
//            setupJisseki(planLogObj.jissekiSpendTime,taishoArray);
        }
    }
    
    function setupYotei(pvHour,pvCurriculumID){
        var taishoPane = getYoteiPane(pvCurriculumID);
        if(pvHour){
            var hour = parseInt(pvHour);
            for(var i = 0; i < hour; i++){
                var pane = document.createElement('div');
                pane.className = 'planGraph';
                taishoPane.appendChild(pane);
            }
        }
    }
    
    function setupResult(pvHour,pvCurriculumID){
        var taishoPane = getResultPane(pvCurriculumID);
        if(pvHour){
            var hour = parseInt(pvHour);
            for(var i = 0; i < hour; i++){
                var pane = document.createElement('div');
                pane.className = 'resultGraph';
                taishoPane.appendChild(pane);
            }
        }
    }
    
    function getYoteiPane(pvCurriculumID){
        var result;
        if(pvCurriculumID == 1){
            result = document.getElementById('kokugoPlanPane');
        }else if(pvCurriculumID == 2){
            result = document.getElementById('suugakuPlanPane');
        }else if(pvCurriculumID == 3){
            result = document.getElementById('eigoPlanPane');
        }else if(pvCurriculumID == 4){
            result = document.getElementById('rikaPlanPane');
        }else if(pvCurriculumID == 5){
            result = document.getElementById('shakaiPlanPane');
        }else if(pvCurriculumID == 6){
            result = document.getElementById('ongakuPlanPane');
        }else if(pvCurriculumID == 7){
            result = document.getElementById('bijutuPlanPane');
        }else if(pvCurriculumID == 8){
            result = document.getElementById('gijutuPlanPane');
        }else if(pvCurriculumID == 9){
            result = document.getElementById('hotaiPlanPane');
        }else{
            throw new Error('未対応のCurriculumID : ' + pvCurriculumID);
        }
        return result;
    }
    
    function getResultPane(pvCurriculumID){
        var result;
        if(pvCurriculumID == 1){
            result = document.getElementById('kokugoResultPane');
        }else if(pvCurriculumID == 2){
            result = document.getElementById('suugakuResultPane');
        }else if(pvCurriculumID == 3){
            result = document.getElementById('eigoResultPane');
        }else if(pvCurriculumID == 4){
            result = document.getElementById('rikaResultPane');
        }else if(pvCurriculumID == 5){
            result = document.getElementById('shakaiResultPane');
        }else if(pvCurriculumID == 6){
            result = document.getElementById('ongakuResultPane');
        }else if(pvCurriculumID == 7){
            result = document.getElementById('bijutuResultPane');
        }else if(pvCurriculumID == 8){
            result = document.getElementById('gijutuResultPane');
        }else if(pvCurriculumID == 9){
            result = document.getElementById('hotaiResultPane');
        }else{
            throw new Error('未対応のCurriculumID : ' + pvCurriculumID);
        }
        return result;
    }
    
    
    return{
        setup : function(pvData){
            setup(pvData);
        }
    };
}();


var graphFunc = function(){
    
    var kokugos = [];
    var suugakus = [];
    var eigos = [];
    var rikas = [];
    var shakais = [];
    var ongakus = [];
    var bijutus = [];
    var gijutus = [];
    var hotais = [];
    
    function setup(pvData){
        for(var i = 0; i < pvData.length; i++){
            var data = pvData[i];
            var planLogObj = new kamokubetuPlanLogObj(data);
            
            var taishoArray = getTaishoArray(planLogObj.getCurriculumID());
            setupYotei(planLogObj.planSpendTime,taishoArray);
            setupJisseki(planLogObj.jissekiSpendTime,taishoArray);
        }
        
    }
    
    function setupYotei(pvValue,pvTaishoArray){
        if(pvValue){
            var value = parseInt(pvValue);
            for(var i = 0; i < 5; i++){
                pvTaishoArray[i].innerHTML = '';
                if(i < value){
                    var circle = document.createElement('div');
                    circle.className = 'siromaru';
                    pvTaishoArray[i].appendChild(circle);
                }
            }
        }
    }
    
    function setupJisseki(pvValue,pvTaishoArray){
        if(pvValue){
            var value = parseInt(pvValue);
            for(var i = 0; i < 5; i++){
                if(i < value){
                    pvTaishoArray[i].innerHTML = '';
                    var circle = document.createElement('div');
                    circle.className = 'kuromaru';
                    pvTaishoArray[i].appendChild(circle);
                    
//                    pvTaishoArray[i].textContent = '●';
                }
            }
        }
    }
    
    function getTaishoArray(pvCurriculumID){
        if(pvCurriculumID == 1){
            return kokugos;
        }else if(pvCurriculumID == 2){
            return suugakus;
        }else if(pvCurriculumID == 3){
            return eigos;
        }else if(pvCurriculumID == 4){
            return rikas;
        }else if(pvCurriculumID == 5){
            return shakais;
        }else if(pvCurriculumID == 6){
            return ongakus;
        }else if(pvCurriculumID == 7){
            return bijutus;
        }else if(pvCurriculumID == 8){
            return gijutus;
        }else if(pvCurriculumID == 9){
            return hotais;
        }else{
            throw new Error('未対応のCurriculumID : ' + pvCurriculumID);
        }
        
    }
    
    function init(){
        for(var i = 1; i <= 5; i++){
            var kyouka,id,element;

            kyouka = 'kokugo';
            id = kyouka + i;
            element = document.getElementById(id);
            kokugos.push(element);

            kyouka = 'suugaku';
            id = kyouka + i;
            element = document.getElementById(id);
            suugakus.push(element);

            kyouka = 'eigo';
            id = kyouka + i;
            element = document.getElementById(id);
            eigos.push(element);

            kyouka = 'rika';
            id = kyouka + i;
            element = document.getElementById(id);
            rikas.push(element);

            kyouka = 'shakai';
            id = kyouka + i;
            element = document.getElementById(id);
            shakais.push(element);

            kyouka = 'ongaku';
            id = kyouka + i;
            element = document.getElementById(id);
            ongakus.push(element);

            kyouka = 'bijutu';
            id = kyouka + i;
            element = document.getElementById(id);
            bijutus.push(element);

            kyouka = 'gijutu';
            id = kyouka + i;
            element = document.getElementById(id);
            gijutus.push(element);

            kyouka = 'hotai';
            id = kyouka + i;
            element = document.getElementById(id);
            hotais.push(element);
        }
    }
    
    return{
        setup : function(pvData){
            init();
            setup(pvData);
        }
    };
}();

$(function () {
    "use strict";
    //ログインチェック
    loginCheck();
    //日付のセット
    setHiduke();
    //データのロード
    dataLoad();
    
    $(document).on('click touchend', '#calenderBtn', function () {
        location.href = "gakushuJissekiCalender.html"
    });
    
    $('.breadcrumb').on('touchend', '#menu', function () {
        location.href = "../menu/";
    });
    
});