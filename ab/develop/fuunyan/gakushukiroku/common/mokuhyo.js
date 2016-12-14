var mokuhyoObj = function(pvTestStartDate,pvTestEndDate,pvTestKubun,pvKamokuMokuhyos){
    this.testStartDate = pvTestStartDate;
    this.testEndDate = pvTestEndDate;
    this.testKubun = pvTestKubun;
    this.kamokuMokuhyos = pvKamokuMokuhyos;
};
mokuhyoObj.prototype.SetSession = function(){
    var data = JSON.stringify(this);
    sessionStorage.setItem('mokuhyoObj', data);
};

var mokuhyoObjUtil = (function(){
    
    function getBySession(){
        var data = sessionStorage.getItem('mokuhyoObj');
        return JSON.parse(data);
    };
    
    function setMokuhyoObj(pvData){
        //試験開始
        var startCalender = document.getElementById('startCalender');
        startCalender.value = pvData.testStartDate;
        startCalender.textContent = pvData.testStartDate;
        //試験終了
        var endCalender = document.getElementById('endCalender');
        endCalender.value = pvData.testEndDate;
        endCalender.textContent = pvData.testEndDate;
        //試験区分
        var testKubunP = document.getElementById('testKubun');
        if(testKubunP){
            var kubunText = getTestKubunText(pvData.testKubun);
            testKubunP.textContent = kubunText;
        }else{
            $("input:radio[name='testKubun']").val([pvData.testKubun]);
        }
        if(pvData.testKubun == 1){
            var additionalKyouka = document.getElementById('additionalKyouka');
            additionalKyouka.style.display = 'none';
        }

        kamokuMokuhyoObjUtil.setKamokuMokuhyoObjects(pvData.kamokuMokuhyos);
    }
    
    var currentMokuhyoObj;
    function saveDBCurrentMokuhyoObj(pvCallback){
        
        //科目別の取得
        kamokuDatas = kamokuMokuhyoObjUtil.getJSONKamokuObjects(currentMokuhyoObj.kamokuMokuhyos);
        //日付を取得する
        var startDate = getPHPDateByNengappiText(currentMokuhyoObj.testStartDate);
        var endDate = getPHPDateByNengappiText(currentMokuhyoObj.testEndDate);
        
        //点数をDBに保存する（保存成功時にコールバック）
        var sendData = {
            'command' : "savePeriodAndCurriculumGoal",
            'userID' : userID,
            'periodID' : 0,
            'kamokuDatas' : kamokuDatas,
            'testStartDate' : startDate,
            'testEndDate': endDate,
            'testKind' : currentMokuhyoObj.testKubun
        };
        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function(data){
            pvCallback();
        }).fail(function(data){
            alert('目標の保存に失敗しました');
        });
    };
    
    return {
        setData : function(pvObj){
            setMokuhyoObj(pvObj);
        },
        loadData : function(){
            var mokuhyoObj = getBySession();
            if(mokuhyoObj){
                setMokuhyoObj(mokuhyoObj);
                currentMokuhyoObj = mokuhyoObj;
            }else{
                var additionalKyouka = document.getElementById('additionalKyouka');
                additionalKyouka.style.display = 'none';
            }
            
        },
        saveDBCurrentMokuhyoObj : function(pvCallback){
            saveDBCurrentMokuhyoObj(pvCallback)
        },
        getBySession: function(){
            return getBySession();
        },
        clearSession: function(){
            sessionStorage.removeItem('mokuhyoObj');
        },
        getMokuhyoObj: function(){
            //試験開始
            var startCalender = document.getElementById('startCalender');
            var startDate = startCalender.value;
            //試験終了
            var endCalender = document.getElementById('endCalender');
            var endDate = endCalender.value;
            //試験区分
            var testKubun = $("input:radio[name='testKubun']:checked").val();
            //科目別
            var kamokuMokuhyos = kamokuMokuhyoObjUtil.getKamokuMokuhyoObjects();
            
            var result = new mokuhyoObj(startDate,endDate,testKubun,kamokuMokuhyos);
            return result;
        },
        getMokuhyoObjByRow : function(pvPeriodRow,pvCurriculumRows){
            var startDate = dateGakushuCommon.getNenGappiTextByPHPDate(pvPeriodRow.testStartDate);
            var endDate = dateGakushuCommon.getNenGappiTextByPHPDate(pvPeriodRow.testEndDate);
            var testKubun = pvPeriodRow.testKind;
            var kamokuMokuhyos = kamokuMokuhyoObjUtil.getKamokuMokuhyoObjectsByRows(pvCurriculumRows);
            
            var result = new mokuhyoObj(startDate,endDate,testKubun,kamokuMokuhyos);
            return result;
        }
    };
})();

var kamokuMokuhyoObj = function(pvCurriculumID,pvPoint){
    this.curriculumID = pvCurriculumID;
    this.point = pvPoint;
};

var kamokuMokuhyoObjUtil = (function(){
    
    var setKamokuMokuhyoObj = function(pvCurriculumID,pvPointValue,pvSetArray){
        if(pvPointValue){
            var kamokuMokuhyoObject = new kamokuMokuhyoObj(pvCurriculumID,pvPointValue);
            pvSetArray.push(kamokuMokuhyoObject);
        }
    };
    
    var setKamokuObjValue = function(pvKamokuObj){
        var taishoDOM;
        if(pvKamokuObj.curriculumID == 1){
            taishoDOM = document.getElementById('kokugoMokuhyo');
        }else if(pvKamokuObj.curriculumID == 2){
            taishoDOM = document.getElementById('suugakuMokuhyo');
        }else if(pvKamokuObj.curriculumID == 3){
            taishoDOM = document.getElementById('eigoMokuhyo');
        }else if(pvKamokuObj.curriculumID == 4){
            taishoDOM = document.getElementById('rikaMokuhyo');
        }else if(pvKamokuObj.curriculumID == 5){
            taishoDOM = document.getElementById('shakaiMokuhyo');
        }else if(pvKamokuObj.curriculumID == 6){
            taishoDOM = document.getElementById('ongakuMokuhyo');
        }else if(pvKamokuObj.curriculumID == 7){
            taishoDOM = document.getElementById('bijutuMokuhyo');
        }else if(pvKamokuObj.curriculumID == 8){
            taishoDOM = document.getElementById('gijutuMokuhyo');
        }else if(pvKamokuObj.curriculumID == 9){
            taishoDOM = document.getElementById('hotaiMokuhyo');
        }
        if(taishoDOM.localName == 'select'){
            taishoDOM.value = pvKamokuObj.point;
        }else{
            taishoDOM.textContent = pvKamokuObj.point;
        }
        
        
    };
    
    return{
        getJSONKamokuObjects : function(pvKamokuObjs){
            var result = [];
            for(var i = 0; i < pvKamokuObjs.length; i++){
                var kamokuObj = pvKamokuObjs[i];
                var encode = JSON.stringify(kamokuObj);
                result.push(encode);
            }
            return JSON.stringify(result);
        },
        setKamokuMokuhyoObjects : function(pvKamokuObjs){
            for(var i = 0; i < pvKamokuObjs.length; i++){
                var kamokuObj = pvKamokuObjs[i];
                setKamokuObjValue(kamokuObj);
            }
        },
        getKamokuMokuhyoObjectsByRows : function(pvRows){
            var result = [];
            for(var i = 0; i < pvRows.length; i++){
                var row = pvRows[i];
                var obj = new kamokuMokuhyoObj(row.curriculumID,row.goalPoint);
                result.push(obj);
            }
            return result;
        },
        getKamokuMokuhyoObjects: function(){
            var result = [];
            //国語
            var kokugoDom = document.getElementById('kokugoMokuhyo');
            setKamokuMokuhyoObj(1,kokugoDom.value,result);
            //数学
            var suugakuDom = document.getElementById('suugakuMokuhyo');
            setKamokuMokuhyoObj(2,suugakuDom.value,result);
            //英語
            var eigoDom = document.getElementById('eigoMokuhyo');
            setKamokuMokuhyoObj(3,eigoDom.value,result);
            //理科
            var rikaDom = document.getElementById('rikaMokuhyo');
            setKamokuMokuhyoObj(4,rikaDom.value,result);
            //社会
            var shakaiDom = document.getElementById('shakaiMokuhyo');
            setKamokuMokuhyoObj(5,shakaiDom.value,result);
            //音楽
            var ongakuDom = document.getElementById('ongakuMokuhyo');
            setKamokuMokuhyoObj(6,ongakuDom.value,result);
            //美術
            var bijutuDom = document.getElementById('bijutuMokuhyo');
            setKamokuMokuhyoObj(7,bijutuDom.value,result);
            //技家
            var gijutuDom = document.getElementById('gijutuMokuhyo');
            setKamokuMokuhyoObj(8,gijutuDom.value,result);
            //保体
            var hotaiDom = document.getElementById('hotaiMokuhyo');
            setKamokuMokuhyoObj(9,hotaiDom.value,result);
            //返却
            return result;
        }
    };
})();