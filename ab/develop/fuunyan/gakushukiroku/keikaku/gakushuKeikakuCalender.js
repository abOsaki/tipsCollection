
var currentMonth;


function loadMokuhyoData(){
    //目標を取得する
    var sendData = {
        'command' : "getGoal",
        'userID' : userID,
        'periodID' : 0
    };
    $.ajax({
        url: '../menu/ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData)
    }).done(function(data){
        setMokuhyo(data);
    }).fail(function(data){
        alert('目標の取得に失敗しました');
    });
}

function setMokuhyo(pvData){
    var date = new Date();
    var testDtartDate = new Date(pvData[0].testStartDate);
    testEndDate = pvData[0].testEndDate;
    var nissu = gakushuCommon.getNokoriNissu(date,testDtartDate);
    setNissuTitle(nissu);
    //カレンダー
    calenderFunc.init();
}
var testEndDate;

function setNissuTitle(pvNisuu){
    var nissuu = document.getElementById('nissuu');
    nissuu.textContent = pvNisuu;
//    var nissu = document.getElementById('nissuTitle');
//    var nissuTitle = '試験まであと' + pvNisuu + '日';
//    nissu.textContent = nissuTitle;
}

function setDate(pvTaisho){
//    //月
//    var month = currentMonth;
//    //日
//    var day =  parseInt(pvTaisho.textContent);
//    //月日
//    var gappi = month + '月' + day + '日';
//    //テキスト
//    var data = dateGakushuCommon.getPHPDateByGappiText(gappi);
    
    //セッションストレージに保存
    dateGakushuCommon.setPHPDateSession(pvTaisho.name);
}



var calenderFunc = function(){
    
    function getAllCalender(pvStartDate,pvEndDate){
        var result = document.createElement('div');
        var headers = document.createElement('div');
        var contents = document.createElement('div');
        
        var startYear = pvStartDate.getFullYear();
        var endYear = pvEndDate.getFullYear();
        var startMonth = pvStartDate.getMonth() + 1;
        var endMonth = pvEndDate.getMonth() + 1;
        
        for(var i = startYear; i <= endYear; i++){
            //開始月と終了月セット
            var startLoopMonth;
            var endLoopMonth;
            
            //開始日と同じ年の場合で終了日と同じ年の場合
            if(startYear == endYear){
                startLoopMonth = startMonth;
                endLoopMonth = endMonth;
            //開始日と同じ年の場合で終了日と違う年の場合（１２月まで）
            }else if(startYear == i){
                startLoopMonth = startMonth;
                endLoopMonth = 12;
            //開始日と違う年で終了日と同じ年の場合（１から終了の年まで）
            }else if(endYear == i){
                startLoopMonth = 1;
                endLoopMonth = endMonth;
            //開始日とも終了日とも違う年の場合（１から１２まで）
            }else{
                startLoopMonth = 1;
                endLoopMonth = 12;
            }
            
            for(var j = startLoopMonth; j <= endLoopMonth; j++){
                var button = document.createElement('button');
                button.textContent = j + '月';
                var dateSeed = dateGakushuCommon.getPHPDateByNengappi(i,j,1);
                button.value = dateSeed;
                button.name = dateSeed;
                button.className = 'monthBtn btn-default';
                headers.appendChild(button);
                
                var date = new Date(dateSeed);
                var content = getCalenderContent(date,today);
                content.name = dateSeed;
                if(!firstMonth){
                    firstMonth = dateSeed;
                }
                content.className = 'calenderContent';
                content.style.display = 'none';
                contents.appendChild(content);
            }
            
        }
        
        headers.className = 'text-left';
        result.appendChild(headers);
        result.appendChild(contents);
        return result;
    }
    
    function getCalenderTitleButton(pvStartDate,pvEndDate){
        var result = document.createElement('div');
        
        var startYear = pvStartDate.getFullYear();
        var endYear = pvEndDate.getFullYear();
        var startMonth = pvStartDate.getMonth() + 1;
        var endMonth = pvEndDate.getMonth() + 1;
        
        for(var i = startYear; i <= endYear; i++){
            //開始月と終了月セット
            var startLoopMonth;
            var endLoopMonth;
            
            //開始日と同じ年の場合で終了日と同じ年の場合
            if(startYear == endYear){
                startLoopMonth = startMonth;
                endLoopMonth = endMonth;
            //開始日と同じ年の場合で終了日と違う年の場合（１２月まで）
            }else if(startYear == i){
                startLoopMonth = startMonth;
                endLoopMonth = 12;
            //開始日と違う年で終了日と同じ年の場合（１から終了の年まで）
            }else if(endYear == i){
                startLoopMonth = 1;
                endLoopMonth = endMonth;
            //開始日とも終了日とも違う年の場合（１から１２まで）
            }else{
                startLoopMonth = 1;
                endLoopMonth = 12;
            }
            
            for(var j = startLoopMonth; j <= endLoopMonth; j++){
                var button = document.createElement('button');
                button.textContent = j + '月';
                button.name = j;
                button.value = dateGakushuCommon.getPHPDateByNengappi(i,j,1);
                button.className = 'monthBtn btn-default';
                result.appendChild(button);
            }
            
        }
        
//        var startMonth = pvStartDate.getMonth() + 1;
//        var endMonth = pvEndDate.getMonth() + 1;
//        
//        if(startMonth <= endMonth){
//            for(var i = startMonth; i <= endMonth; i++){
//                var button = document.createElement('button');
//                button.textContent = i + '月';
//                button.name = i;
//                button.className = 'monthBtn btn-default';
//                result.appendChild(button);
//            }
//        }
        result.className = 'text-left';
        return result;
    }
    
    var firstMonth;
    var today;
    function getCalender(pvStartDate,pvEndDate){
        var result = document.createElement('div');
        var startMonth = pvStartDate.getMonth() + 1;
        var endMonth = pvEndDate.getMonth() + 1;
        firstMonth = startMonth;
        
        if(startMonth <= endMonth){
            for(var i = startMonth; i <= endMonth; i++){
                var taishoDate = new Date(pvStartDate.getFullYear(),i - 1,1);
                var content = getCalenderContent(taishoDate,today);
                content.name = i;
                content.className = 'calenderContent';
                content.style.display = 'none';
                result.appendChild(content);
            }
        }
        
        return result;
    }
    
    function selectedCalender(pvPHPDate){
        currentMonth = pvPHPDate;
        var calenderContents = document.getElementsByClassName('calenderContent');
        var i;
        for(i = 0; i < calenderContents.length; i++){
            var content = calenderContents[i];
            if(content.name == pvPHPDate){
                content.style.display = '';
            }else{
                content.style.display = 'none';
            }
        }
        
        var buttons = document.getElementsByClassName('monthBtn');
        for(i = 0; i < buttons.length; i++){
            var button = buttons[i];
            if(button.name == pvPHPDate){
                button.className = 'monthBtn btn-primary';
            }else{
                button.className = 'monthBtn btn-default';
            }
        }
        
    }
    
    
    function getCalenderContent(pvDate,pvToday){
        myDate = pvDate;	// 今日の日付データ取得
        myWeekTbl = new Array("日","月","火","水","木","金","土");	// 曜日テーブル定義
        myMonthTbl= new Array(31,28,31,30,31,30,31,31,30,31,30,31);	// 月テーブル定義
        myYear = myDate.getFullYear();	// 年を取得
        if (((myYear%4)==0 && (myYear%100)!=0) || (myYear%400)==0){	// うるう年だったら...
        myMonthTbl[1] = 29;	// 　２月を２９日とする
        }	
        myMonth = myDate.getMonth();	// 月を取得(0月～11月)
        currentMonth = myMonth + 1;
        myToday = myDate.getDate();	// 今日の'日'を退避
        myDate.setDate(1);	// 日付を'１日'に変えて、
        myWeek = myDate.getDay();	// 　'１日'の曜日を取得
        myTblLine = Math.ceil((myWeek+myMonthTbl[myMonth])/7);	// カレンダーの行数
        myTable = new Array(7*myTblLine);	// 表のセル数分定義

        for(i=0; i<7*myTblLine; i++) myTable[i]="　";	// myTableを掃除する
        for(i=0; i<myMonthTbl[myMonth]; i++)myTable[i+myWeek]=i+1;	// 日付を埋め込む

        // ***********************	
        //      カレンダーの表示	
        // ***********************	

        //テーブル作成
        var table = document.createElement('table');
        table.setAttribute('border','1');
//        table.id = 'calender';

    //    //ヘッダー
    //    var headerTR = document.createElement('tr');
    //    var headerTD = document.createElement('td');
    //    headerTD.textContent = 'テストん';
    //    headerTD.setAttribute('colspan','7');
    //    headerTR.appendChild(headerTD);
    //    table.appendChild(headerTR);

        //youbi
        var youbiTR = document.createElement('tr');
        for(i = 0; i<7; i++){
            var youbiTD = document.createElement('td');
            youbiTD.textContent = myWeekTbl[i];
            youbiTR.appendChild(youbiTD);
        }
        table.appendChild(youbiTR);

        //日にち
        for(i=0; i<myTblLine; i++){
            var weekTR = document.createElement('tr');
            for(j=0; j<7; j++){
                var dayTD = document.createElement('td');
                var dayA = document.createElement('a');
                //本日の場合はここでクラスを付ける
                if(pvToday.getMonth() == myDate.getMonth()){
                    if(pvToday.getDate() == myTable[j+(i*7)]){
                        dayA.className = 'today';
                    }
                    
                    if(pvToday.getDate() > myTable[j+(i*7)]){
                        dayA.className = 'kako';
                    }
                    
                }
                if(checkExistDataDay(currentMonth,myTable[j+(i*7)])){
                    dayTD.className = 'existDate';
                }
                if((myTable[j+(i*7)] != "　")){
                    dayA.name = dateGakushuCommon.getPHPDateByNengappi(myYear,currentMonth,myTable[j+(i*7)]);
                }
                
                dayA.textContent = myTable[j+(i*7)];
                dayTD.appendChild(dayA);
                weekTR.appendChild(dayTD);
            }
            table.appendChild(weekTR);
        }

        return table;
        /*
         for(i=0; i<myTblLine; i++){	// 表の「行」のループ
        document.write("<tr>");	// 行の開始
        for(j=0; j<7; j++){	// 表の「列」のループ
        document.write("<td align='center' ");	// 列(セル)の作成
        myDat = myTable[j+(i*7)];	// 書きこむ内容の取得
        if (myDat==myToday)document.write("bgcolor='#00ffff'>");	// 今日のセルの色
        else if(j==0) document.write("bgcolor='#ffb6c1'>");	// 日曜のセルの色
        else document.write("bgcolor='#ffffe0'>");	// 平日のセルの色
        document.write("<strong>",myDat,"</strong>");	// 日付セット
        document.write("</td>");	// 列(セル)の終わり
        }	
        document.write("</tr>");	// 行の終わり
        }	
        document.write("</table>");
         * * 
         * 
         * 
        document.write("<table border='1'>");	// 表の作成開始
        document.write("<tr><td colspan='7' bgcolor='#7fffd4'>");	// 見出し行セット
        document.write("<strong>",myYear, "年", (myMonth+1), "月カレンダー</strong>");	
        document.write("</td></tr>");	

        document.write("<tr>");	// 曜日見出しセット
        for(i=0; i<7; i++){	// 一行(１週間)ループ
        document.write("<td align='center' ");	
        if(i==0)document.write("bgcolor='#fa8072'>");	// 日曜のセルの色
        else document.write("bgcolor='#ffebcd'>");	// 月～土のセルの色
        document.write("<strong>",myWeekTbl[i],"</strong>");	// '日'から'土'の表示
        document.write("</td>");	
        }	
        document.write("</tr>");	


        */
    }
    
    return {
        init: function(){
            var calenderPane = document.getElementById('calenderPane');
            //今日の日付
            today = new Date();
            //テスト終了の日付
            var endday = new Date(testEndDate);
            
            var calender = getAllCalender(today,endday);
            calenderPane.appendChild(calender);
            
            selectedCalender(firstMonth);
            
//            selectedCalender(testEndDate);
            
//            //ヘッダーの取得
//            var header = getCalenderTitleButton(today,endday);
//            calenderPane.appendChild(header);
//            
//            //カレンダーのコンテンツをセットする
//            
//            
//            //今月カレンダー
//            var content = getCalender(today,endday);
//            calenderPane.appendChild(content);
//            
//            selectedCalender(firstMonth);


//            var date = new Date();
//            var calender = getCalender(date);
//            calenderPane.appendChild(calender);
//            //来月カレンダー
//            var nextMonthDate = new Date(date.getFullYear(),date.getMonth()+ 1,1);
//            var nextMonthCalender = getCalender(nextMonthDate);
//            calenderPane.appendChild(nextMonthCalender);
        },
        selected: function(pvMonth){
            selectedCalender(pvMonth);
        }
    };
}();

function checkExistDataDay(pvMonth,pvDay){
    var check = parseInt(pvDay);
    if(!parseInt(pvDay)){
        return false;
    }
    var date = dateGakushuCommon.getPHPDateByMonthDay(pvMonth,pvDay);
    return ($.inArray(date, existDataArray) >= 0);
}
var existDataArray;

var graphFunc2 = function(){
    var kokugoSpendTime;
    var suugakuSpendTime;
    var eigoSpendTime;
    var rikaSpendTime;
    var shakaiSpendTime;
    var ongakuSpendTime;
    var bijutuSpendTime;
    var gijutuSpendTime;
    var hotaiSpendTime;
    
    function allSetup(){
        setup(kokugoSpendTime,'kokugoPlanPane');
        setup(suugakuSpendTime,'suugakuPlanPane');
        setup(eigoSpendTime,'eigoPlanPane');
        setup(rikaSpendTime,'rikaPlanPane');
        setup(shakaiSpendTime,'shakaiPlanPane');
        setup(ongakuSpendTime,'ongakuPlanPane');
        setup(bijutuSpendTime,'bijutuPlanPane');
        setup(gijutuSpendTime,'gijutuPlanPane');
        setup(hotaiSpendTime,'hotaiPlanPane');
    }
    
    function setup(pvHour,pvTaishoPaneID){
        var taishoPane = document.getElementById(pvTaishoPaneID);
        taishoPane.innerHTML = '';
        var hour = pvHour;
        var value = parseInt(hour.value);
        for(var i = 0; i < hour; i++){
            var pane = document.createElement('div');
            pane.className = 'yokoGraph';
            taishoPane.appendChild(pane);
        }
    }
    
    return{
        setData : function(pvData){
            
            existDataArray = [];
            
            kokugoSpendTime = 0;
            suugakuSpendTime = 0;
            eigoSpendTime = 0;
            rikaSpendTime = 0;
            shakaiSpendTime = 0;
            ongakuSpendTime = 0;
            bijutuSpendTime = 0;
            gijutuSpendTime = 0;
            hotaiSpendTime = 0;
            
            for(var i = 0; i < pvData.length; i ++){
                var data = pvData[i];
                
                if(!($.inArray(data.targetDate, existDataArray) >= 0)){
                    existDataArray.push(data.targetDate);
                }
                
                if(data.curriculumID == 1){
                    kokugoSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 2){
                    suugakuSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 3){
                    eigoSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 4){
                    rikaSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 5){
                    shakaiSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 6){
                    ongakuSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 7){
                    bijutuSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 8){
                    gijutuSpendTime += parseInt(data.spendTime);
                }else if(data.curriculumID == 9){
                    hotaiSpendTime += parseInt(data.spendTime);
                }else{
                    throw new Error('未対応のcurriculumID : ' + data.curriculumID);
                }
            }
            
            allSetup();
        }
    };
}();

//var graphFunc = function(){
//    
//    var kokugos = [];
//    var suugakus = [];
//    var eigos = [];
//    var rikas = [];
//    var shakais = [];
//    var ongakus = [];
//    var bijutus = [];
//    var gijutus = [];
//    var hotais = [];
//    
//    var kokugoSpendTime;
//    var suugakuSpendTime;
//    var eigoSpendTime;
//    var rikaSpendTime;
//    var shakaiSpendTime;
//    var ongakuSpendTime;
//    var bijutuSpendTime;
//    var gijutuSpendTime;
//    var hotaiSpendTime;
//    
//    function allSetup(){
//        setup('kokugoHour',kokugos);
//        setup('suugakuHour',suugakus);
//        setup('eigoHour',eigos);
//        setup('rikaHour',rikas);
//        setup('shakaiHour',shakais);
//        setup('ongakuHour',ongakus);
//        setup('bijutuHour',bijutus);
//        setup('gijutuHour',gijutus);
//        setup('hotaiHour',hotais);
//    }
//    
//    var rowCount;
//    function setup(pvHourID,pvTaishoArray){
//        var hour = document.getElementById(pvHourID);
//        var value = parseInt(hour.value);
//        for(var i = 0; i < rowCount; i++){
//            pvTaishoArray[i].innerHTML = '';
//            if(i < value){
//                var circle = document.createElement('div');
//                circle.className = 'siromaru';
//                pvTaishoArray[i].appendChild(circle);
//                
////                pvTaishoArray[i].textContent = '○';
//            }else{
//                
//                
////                pvTaishoArray[i].textContent = '';
//            }
//        }
//    }
//    
//    function createTR(){
//        var timeGraphTable = document.getElementById('timeGraph');
//        //ヘッダーカラムの取得（一番下）
//        var headerColumn = getHeaderColumnTR();
//        //データカラムの取得（配列、逆順に挿入）
//        var dataColumns = getDataColumnTR();
//        
//        for(var i = dataColumns.length - 1; i >= 0; i--){
//            var columnTR = dataColumns[i];
//            timeGraphTable.appendChild(columnTR);
//        }
//        timeGraphTable.appendChild(headerColumn);
//    }
//    
//    function getHeaderColumnTR(){
//        var result = document.createElement('tr');
//        //tableHeader
//        var valueHeaderTd = document.createElement('td');
//        valueHeaderTd.className = 'valueHeader dataRow headerColumn';
//        valueHeaderTd.textContent = 0;
//        result.appendChild(valueHeaderTd);
//        //kyoukaTd
//        var kokugoTd = document.createElement('td');
//        kokugoTd.className = 'dataRow'; 
//        kokugoTd.textContent = '国語';
//        result.appendChild(kokugoTd);
//        
//        var suugakuTd = document.createElement('td');
//        suugakuTd.className = 'dataRow'; 
//        suugakuTd.textContent = '数学';
//        result.appendChild(suugakuTd);
//        
//        var eigoTd = document.createElement('td');
//        eigoTd.className = 'dataRow'; 
//        eigoTd.textContent = '英語';
//        result.appendChild(eigoTd);
//        
//        var rikaTd = document.createElement('td');
//        rikaTd.className = 'dataRow'; 
//        rikaTd.textContent = '理科';
//        result.appendChild(rikaTd);
//        
//        var shakaiTd = document.createElement('td');
//        shakaiTd.className = 'dataRow'; 
//        shakaiTd.textContent = '社会';
//        result.appendChild(shakaiTd);
//        
//        var ongakuTd = document.createElement('td');
//        ongakuTd.className = 'dataRow'; 
//        ongakuTd.textContent = '音楽';
//        result.appendChild(ongakuTd);
//        
//        var bijutuTd = document.createElement('td');
//        bijutuTd.className = 'dataRow'; 
//        bijutuTd.textContent = '美術';
//        result.appendChild(bijutuTd);
//        
//        var gijutuTd = document.createElement('td');
//        gijutuTd.className = 'dataRow'; 
//        gijutuTd.textContent = '技術';
//        result.appendChild(gijutuTd);
//        
//        var hotaiTd = document.createElement('td');
//        hotaiTd.className = 'dataRow'; 
//        hotaiTd.textContent = '保体';
//        result.appendChild(hotaiTd);
//        
//        return result;
//    }
//    
//    function getDataColumnTR(){
//        var result = [];
//        for(var i = 1; i <= rowCount; i++){
//            //tr
//            var tr = document.createElement('tr');
//            //valueHeader
//            var valueHeaderTd = document.createElement('td');
//            valueHeaderTd.className = 'headerColumn';
//            valueHeaderTd.textContent = i;
//            tr.appendChild(valueHeaderTd);
//            //kyoukaTd
//            var kokugoTd = document.createElement('td');
//            kokugoTd.id = 'kokugo' + i;
//            tr.appendChild(kokugoTd);
//            
//            var suugakuTd = document.createElement('td');
//            suugakuTd.id = 'suugaku' + i;
//            tr.appendChild(suugakuTd);
//            
//            var eigoTd = document.createElement('td');
//            eigoTd.id = 'eigo' + i;
//            tr.appendChild(eigoTd);
//            
//            var rikaTd = document.createElement('td');
//            rikaTd.id = 'rika' + i;
//            tr.appendChild(rikaTd);
//            
//            var shakaiTd = document.createElement('td');
//            shakaiTd.id = 'shakai' + i;
//            tr.appendChild(shakaiTd);
//            
//            var ongakuTd = document.createElement('td');
//            ongakuTd.id = 'ongaku' + i;
//            tr.appendChild(ongakuTd);
//            
//            var bijutuTd = document.createElement('td');
//            bijutuTd.id = 'bijutu' + i;
//            tr.appendChild(bijutuTd);
//            
//            var gijutuTd = document.createElement('td');
//            gijutuTd.id = 'gijutu' + i;
//            tr.appendChild(gijutuTd);
//            
//            var hotaiTd = document.createElement('td');
//            hotaiTd.id = 'hotai' + i;
//            tr.appendChild(hotaiTd);
//            
//            
//            result.push(tr);
//        }
//        return result;
//    }
//    
//    function setupTdArray(){
//        for(var i = 1; i <= rowCount; i++){
//            var kyouka,id,element;
//
//            kyouka = 'kokugo';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            kokugos.push(element);
//
//            kyouka = 'suugaku';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            suugakus.push(element);
//
//            kyouka = 'eigo';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            eigos.push(element);
//
//            kyouka = 'rika';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            rikas.push(element);
//
//            kyouka = 'shakai';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            shakais.push(element);
//
//            kyouka = 'ongaku';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            ongakus.push(element);
//
//            kyouka = 'bijutu';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            bijutus.push(element);
//
//            kyouka = 'gijutu';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            gijutus.push(element);
//
//            kyouka = 'hotai';
//            id = kyouka + i;
//            element = document.getElementById(id);
//            hotais.push(element);
//        }
//    }
//    
//    function initialize(pvMaxCount){
//        rowCount = pvMaxCount;
//        createTR();
//        setupTdArray();
//    }
//    
//    function setData(){
//        setup(kokugoSpendTime,kokugos);
//        setup(suugakuSpendTime,suugakus);
//        setup(eigoSpendTime,eigos);
//        setup(rikaSpendTime,rikas);
//        setup(shakaiSpendTime,shakais);
//        setup(ongakuSpendTime,ongakus);
//        setup(bijutuSpendTime,bijutus);
//        setup(gijutuSpendTime,gijutus);
//        setup(hotaiSpendTime,hotais);
//    }
//    
//    function setup(pvSpendTime,pvTaishoArray){
//        
//        for(var i = 0; i < rowCount; i++){
//            if(i < pvSpendTime){
//                var circle = document.createElement('div');
//                circle.className = 'siromaru';
//                pvTaishoArray[i].appendChild(circle);
//                
//            }else{
//                pvTaishoArray[i].innerHTML = '';
//            }
//        }
//    }
//    
//    
//    
//    return{
//        init : function(pvMaxCount){
//            initialize(pvMaxCount);
//        },
//        setData : function(pvData){
//            
//            existDataArray = [];
//            
//            kokugoSpendTime = 0;
//            suugakuSpendTime = 0;
//            eigoSpendTime = 0;
//            rikaSpendTime = 0;
//            shakaiSpendTime = 0;
//            ongakuSpendTime = 0;
//            bijutuSpendTime = 0;
//            gijutuSpendTime = 0;
//            hotaiSpendTime = 0;
//            
//            for(var i = 0; i < pvData.length; i ++){
//                var data = pvData[i];
//                
//                if(!($.inArray(data.targetDate, existDataArray) >= 0)){
//                    existDataArray.push(data.targetDate);
//                }
//                
//                if(data.curriculumID == 1){
//                    kokugoSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 2){
//                    suugakuSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 3){
//                    eigoSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 4){
//                    rikaSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 5){
//                    shakaiSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 6){
//                    ongakuSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 7){
//                    bijutuSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 8){
//                    gijutuSpendTime += parseInt(data.spendTime);
//                }else if(data.curriculumID == 9){
//                    hotaiSpendTime += parseInt(data.spendTime);
//                }else{
//                    throw new Error('未対応のcurriculumID : ' + data.curriculumID);
//                }
//            }
//            
//            var allSpendTime = [kokugoSpendTime,suugakuSpendTime,eigoSpendTime,rikaSpendTime,shakaiSpendTime,ongakuSpendTime,bijutuSpendTime,gijutuSpendTime,hotaiSpendTime];
//            var max = Math.max.apply(null, allSpendTime);
//            
//            initialize(max);
//            setData();
//        }
//    };
//    
//    
//}();

function loadKeikakuData(){
    //日付から計画データを取得する
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyPlan",
        'userID' : userID,
        'periodID' : 0
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        graphFunc2.setData(data);
        //目標を取得する
        loadMokuhyoData();
    }).fail(function(data){
        alert('データの取得に失敗しました')
    });
}

$(function () {
    "use strict";
    
    loginCheck();
//    //目標を取得する
//    loadMokuhyoData();
    //計画を取得する
    loadKeikakuData();
    
    
    
    
    
    
    
    
//    
//    $(document).on('click', '#zenkaiKirokumiruButton', function () {
//        location.href = "../zenkaiKiroku";
//    });
    
    $('#calenderPane').on('click touchend', 'a', function () {
        if(this.className == 'kako' || !(this.name)){
            return false;
        }
        setDate(this);
        location.href = "gakushuKeikakuSettei.html";
    });
    
    $(document).on('click touchend', '.monthBtn', function () {
        calenderFunc.selected(this.name);
    });
    
    $('.breadcrumb').on('touchend', '#menu', function () {
        location.href = "../menu/";
    });
    
});