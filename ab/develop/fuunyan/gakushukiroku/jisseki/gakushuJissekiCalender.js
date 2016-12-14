//実績データのロード
function loadJissekiData(){
    //日付から計画データを取得する
    //対象日付からデータを取得する
    var sendData = {
        'command' : "getStudyLog",
        'userID' : userID,
        'periodID' : 0
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
    }).done(function(data){
        setExistDateData(data);
        //目標を取得する
        loadMokuhyoData();
    }).fail(function(data){
        alert('データの取得に失敗しました')
    });
    
    
}


function setExistDateData(pvData){
    existDataArray = [];
    for(var i = 0; i < pvData.length; i ++){
        var data = pvData[i];
        if(!($.inArray(data.targetDate, existDataArray) >= 0)){
            existDataArray.push(data.targetDate);
        }
    }
}

var existDataArray;
function checkExistDataDay(pvMonth,pvDay){
    var check = parseInt(pvDay);
    if(!parseInt(pvDay)){
        return false;
    }
    var date = dateGakushuCommon.getPHPDateByMonthDay(pvMonth,pvDay);
    return ($.inArray(date, existDataArray) >= 0);
}


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
}

var calenderFunc = function(){
    
    function getCalenderTitleButton(pvStartDate,pvEndDate){
        var result = document.createElement('div');
        
        var startMonth = pvStartDate.getMonth() + 1;
        var endMonth = pvEndDate.getMonth() + 1;
        
        if(startMonth <= endMonth){
            for(var i = startMonth; i <= endMonth; i++){
                var button = document.createElement('button');
                button.textContent = i + '月';
                button.name = i;
                button.className = 'monthBtn btn-default';
                result.appendChild(button);
            }
        }
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
                currentMonth = i;
//                content.style.display = 'none';
                result.appendChild(content);
            }
        }
        
        return result;
    }
    
    function selectedCalender(pvMonth){
        currentMonth = pvMonth;
        var calenderContents = document.getElementsByClassName('calenderContent');
        var i;
        for(i = 0; i < calenderContents.length; i++){
            var content = calenderContents[i];
            if(content.name == pvMonth){
                content.style.display = '';
            }else{
                content.style.display = 'none';
            }
        }
        
        var buttons = document.getElementsByClassName('monthBtn');
        for(i = 0; i < buttons.length; i++){
            var button = buttons[i];
            if(button.name == pvMonth){
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
                }
                if(checkExistDataDay(currentMonth,myTable[j+(i*7)])){
                    dayTD.className = 'existDate';
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
//            //テスト終了の日付
//            var endday = new Date(testEndDate);
//            
//            //ヘッダーの取得
//            var header = getCalenderTitleButton(today,endday);
//            calenderPane.appendChild(header);
            //今月カレンダー
//            var content = getCalender(today,endday);
            var content = getCalender(today,today);
            calenderPane.appendChild(content);
            
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

function setDate(pvTaisho){
    //月
    var month = currentMonth;
    //日
    var day =  parseInt(pvTaisho.textContent);
    //月日
    var gappi = month + '月' + day + '日';
    //テキスト
    var data = dateGakushuCommon.getPHPDateByGappiText(gappi);
    //セッションストレージに保存
    dateGakushuCommon.setPHPDateSession(data);
}


$(function () {
    "use strict";
    
    loginCheck();
    //実績データのロード
    loadJissekiData();
    
    $('#calenderPane').on('click touchend', 'a', function () {
        setDate(this);
        location.href = "gakushuJissekiSettei.html"
    });
    
    $('.breadcrumb').on('touchend', '#menu', function () {
        location.href = "../menu/";
    });
    
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


