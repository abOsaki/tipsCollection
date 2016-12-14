var kamokubetuPlanLogObj = function(pvData){
    this.planCurriculumID = pvData.plan_curriculumID;
    var cvPlanCurriculumID = pvData.plan_curriculumID;
    this.planSpendTime = pvData.plan_spendTime;
    var cvPlanSpendTime = pvData.plan_spendTime;
    this.jissekiCurriculumID = pvData.jisseki_curriculumID;
    var cvJissekiCurriculumID = pvData.jisseki_curriculumID;
    this.jissekiSpendTime = pvData.jisseki_spendTime;
    var cvJissekiSpendTime = pvData.jisseki_spendTime;
    
    this.getTR = function(){
        return getThisTR();
    };
    
    this.getPlanSpendTime = function(){
        return getPlanSpendTime();
    };
    
    this.getJissekiSpendTime = function(){
        return getJissekiSpendTime();
    };
    
    this.getCurriculumID =function(){
        return getCurriculumID();
    };
    
    function getCurriculumID(){
        if(cvPlanCurriculumID){
            return parseInt(cvPlanCurriculumID);
            
        }else if(cvJissekiCurriculumID){
            return parseInt(cvJissekiCurriculumID);
        }
        throw new Error('カリキュラムコードが設定されていません');
    }
    
    function getPlanSpendTime(){
        if(cvPlanSpendTime){
            return parseInt(cvPlanSpendTime);
        }else{
            return 0;
        }
    }
    
    function getJissekiSpendTime(){
        if(cvJissekiSpendTime){
            return parseInt(cvJissekiSpendTime);
        }else{
            return 0;
        }
    }
    
    function getThisTR(){
        var result = document.createElement('tr');
        //教科
        var kyoukaTD = getKyoukaTD();
        result.appendChild(kyoukaTD);
        //予定
        var yoteiTD = getYoteiTD();
        result.appendChild(yoteiTD);
        //実績
        var jissekiTD = getJissekiTD();
        result.appendChild(jissekiTD);
        
        return result;
    };
    
    function getKyoukaTD(){
        var result = document.createElement('td');
        var kyoukaText;
        if(cvPlanCurriculumID){
            kyoukaText = getKyoukaText(cvPlanCurriculumID);
        }else if(cvJissekiCurriculumID){
            kyoukaText = getKyoukaText(cvJissekiCurriculumID);
        }
        result.textContent = kyoukaText;
        return result;
    };
    
    function getYoteiTD(){
        var result = document.createElement('td');
        var yoteiText;
        if(cvPlanSpendTime){
            yoteiText = cvPlanSpendTime + '時間';
        }else{
            yoteiText = '――';
        }
        result.textContent = yoteiText;
        return result;
    }
    
    function getJissekiTD(){
        var result = document.createElement('td');
        var jissekiText;
        if(cvJissekiSpendTime){
            jissekiText = cvJissekiSpendTime + '時間';
        }else{
            jissekiText = '――';
        }
        result.textContent = jissekiText;
        return result;
    }
};

var kamokubetuPlanLogObjUtil = {
    getObjectsByRows : function(pvRows){
        var result = [];
        for(var i = 0; i < pvRows.length; i++){
            var data = pvRows[i];
            var planLogObj = new kamokubetuPlanLogObj(data);
            result.push(planLogObj);
        }
        return result;
    },
    getKamokuCount : function(pvkamokubetuPlanLogObjArray){
        var kokugo,suugaku,eigo,rika,shakai;
        kokugo = {
            plan : 0,
            jisseki : 0
        };
        suugaku = {
            plan : 0,
            jisseki : 0
        };
        eigo = {
            plan : 0,
            jisseki : 0
        };
        rika = {
            plan : 0,
            jisseki : 0
        };
        shakai = {
            plan : 0,
            jisseki : 0
        };
        
        for(var i = 0; i < pvkamokubetuPlanLogObjArray.length; i++){
            var data = pvkamokubetuPlanLogObjArray[i];
            //国語
            if((data.planCurriculumID == 1) || (data.jissekiCurriculumID == 1)){
                kokugo.plan += data.getPlanSpendTime();
                kokugo.jisseki += data.getJissekiSpendTime();
            }
            //数学
            if((data.planCurriculumID == 2) || (data.jissekiCurriculumID == 2)){
                suugaku.plan += data.getPlanSpendTime();
                suugaku.jisseki += data.getJissekiSpendTime();
            }
            //英語
            if((data.planCurriculumID == 3) || (data.jissekiCurriculumID == 3)){
                eigo.plan += data.getPlanSpendTime();
                eigo.jisseki += data.getJissekiSpendTime();
            }
            //理科
            if((data.planCurriculumID == 4) || (data.jissekiCurriculumID == 4)){
                rika.plan += data.getPlanSpendTime();
                rika.jisseki += data.getJissekiSpendTime();
            }
            //社会
            if((data.planCurriculumID == 5) || (data.jissekiCurriculumID == 5)){
                shakai.plan += data.getPlanSpendTime();
                shakai.jisseki += data.getJissekiSpendTime();
            }
        }
        
        var result = {
            'kokugo' : kokugo,
            'suugaku' : suugaku,
            'eigo' : eigo,
            'rika' : rika,
            'shakai' : shakai
        }
        return result;
    }
    
};

//予定実績共通で使用できるオブジェクト
var kamokubetuObj = function(pvData){
    this.id = pvData.id;
    var cvID = pvData.id;
    this.userID = pvData.userID;
    var userID = pvData.userID;
    this.periodID = pvData.periodID;
    cvPeriodID = pvData.periodID;
    this.targetDate = pvData.targetDate;
    cvTargetDate = pvData.targetDate;
    this.curriculumID = pvData.curriculumID;
    cvCurriculumID = pvData.curriculumID;
    this.spendTime = pvData.spendTime;
    cvSpendTime = pvData.spendTime;
    this.workbookID = pvData.workbookID;
    cvWorkbookID = pvData.workbookID;
    this.workbookAmount = pvData.workbookAmount;
    cvWorkbookAmount = pvData.workbookAmount;
    this.createAT = pvData.createAT;
    cvCreateAT = pvData.createAT;
    this.updateAT = pvData.updateAT;
    cvUpdateAT = pvData.updateAT;
    
    this.getKamokuHourText = function(){
        return getKamokuHourText();
    };
    
    this.getShousaiTR = function(){
        if(cvWorkbookID){
            return getShousaiTR();
        }
    };
    
    function getKamokuHourText(){
        //科目のテキスト
        var kamokuText = getKyoukaText(cvCurriculumID);
        //つなぎ
        var tunagi = '：';
        //時間のテキスト
        var hourText = cvSpendTime + '';
        //時間の単位
        var hourTanni = '時間';
        //連結
        var result = kamokuText + tunagi + hourText + hourTanni;
        //結果返却
        return result;
    }
    
    function getShousaiTR(){
        
        var result = document.createElement('tr');
        var kyoukaTD = document.createElement('td');
        var kyoukaDiv = document.createElement('div');
        kyoukaDiv.className = 'shousaiKoumoku';
        kyoukaDiv.textContent = getKyoukaText(cvCurriculumID);
        kyoukaTD.appendChild(kyoukaDiv);
        result.appendChild(kyoukaTD);

        var kyouzaiTD = document.createElement('td');
        var kyouzaiDiv = document.createElement('div');
        kyouzaiDiv.className = 'shousaiKoumoku';
        kyouzaiDiv.textContent = getKyouzaiText(cvWorkbookID);
        kyouzaiTD.appendChild(kyouzaiDiv);
        result.appendChild(kyouzaiTD);

        var pageTD = document.createElement('td');
        var pageDiv = document.createElement('div');
        pageDiv.className = 'shousaiKoumoku';
        pageDiv.textContent = cvWorkbookAmount + 'ページ';
        pageTD.appendChild(pageDiv);
        result.appendChild(pageTD);

        return result;
    }
    
};

function getDateFromPHPDate(pvDate){
    //日付の取得
    var date = new Date(pvDate);
    //dateObjectの取得
    var result = new dateInfo(date);
    return result;
}

var hibetuKamokubetuObj = function(pvDate,pvDatas){
    this.date = pvDate;
    var cvDate = pvDate;
    this.datas = pvDatas;
    var cvDatas = pvDatas;
    
    
    
    this.getContent = function(pvShousaiHeader){
        return getContent(pvShousaiHeader);
    };
    
    function getContent(pvShousaiHeader){
        var result = document.createElement('div');
        result.className = 'contentKoumoku';
        //コンテンツエリア
        var content = document.createElement('div');
        content.className = 'contentArea';
        //日付スパン
        var hiduke = document.createElement('span');
        hiduke.className = 'marginL5';
        var dateObject = getDateFromPHPDate(cvDate);
        hiduke.textContent = dateObject.displayMonth + '月' + dateObject.displayDate + '日';
        content.appendChild(hiduke);
        //科目詳細用
        var shousais = [];
        //科目
        for(var i = 0; i < cvDatas.length; i++){
            var data = cvDatas[i];
            var kamokubetu = new kamokubetuObj(data);
            //項目
            var koumoku = document.createElement('span');
            koumoku.className = 'koumokuSpan';
            koumoku.textContent = kamokubetu.getKamokuHourText();
            //詳細の取得
            var shousai = kamokubetu.getShousaiTR();
            if(shousai){
                shousais.push(shousai);
            }
            
            content.appendChild(koumoku);
        }
        //詳細ペーン
        var shousaiPane = document.createElement('div');
        shousaiPane.className = 'detailPane hidden';
        //詳細テーブル
        var table = document.createElement('table');
        //詳細ヘッダーTR
        var headerTR = document.createElement('tr');
        //詳細ヘッダーTD
        var headerTD = document.createElement('td');
        headerTD.className = 'shousaiTopColumn';
        var rowspan = shousais.length > 0 ? (shousais.length + 1) : 1;
        headerTD.setAttribute('rowspan', rowspan);
        headerTD.className = '';
        //詳細ヘッダ
        if(pvShousaiHeader){
            
            headerTD.appendChild(pvShousaiHeader);
        }else{
            var shuseiButton = getShousaiHeaderContent();
            headerTD.appendChild(shuseiButton);
        }
        
//        var shousaiHeader = getShousaiHeaderContent();
//        var shuuseiButton = document.createElement('button');
//        shuuseiButton.className = 'btn btn-primary shuuseiButton';
//        shuuseiButton.textContent = '修正';
//        shuuseiButton.name = cvDate;
        
//        headerTD.appendChild(shousaiHeader);
        headerTR.appendChild(headerTD); 
        table.appendChild(headerTR);
        shousaiPane.appendChild(table);
        content.appendChild(shousaiPane);
        
        //科目詳細
        for(var i = 0; i < shousais.length; i++){
            var shousaiTR = shousais[i];
            table.appendChild(shousaiTR);
        }
        
        result.appendChild(content);
        return result;
    };
    
    function getShousaiHeaderContent(){
        var shuuseiButton = document.createElement('button');
        shuuseiButton.className = 'btn btn-warning shuuseiButton';
        shuuseiButton.textContent = '修正';
        shuuseiButton.name = cvDate;
        return shuuseiButton;
    };
};