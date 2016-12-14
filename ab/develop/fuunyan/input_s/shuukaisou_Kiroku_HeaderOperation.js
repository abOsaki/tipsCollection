function shuukaisouKirokuHeaderOperation(){
    this.setHidukeHeader = function(){
        setHidukeHeader();
    }
    return this;
    
    var shitumonPane;
    function setPane(){
        shitumonPane = document.getElementById("shitsumon");
    }
    
    function setHidukeHeader(){
        setPane();
        var parentSpam = document.createElement("spam");
        
        var previewButton = document.createElement("button");
        previewButton.textContent = "＜＜前日";
        var calender = document.createElement("input");
        calender.setAttribute("type","date");
        calender.setAttribute("cmanCLDat","USE:ON");
        calender.id = "calender";
        parentSpam.appendChild(calender);
        var nextButton = document.createElement("button");
        nextButton.textContent = "後日＞＞";
        
        
        parentSpam.appendChild(previewButton);
        parentSpam.appendChild(calender);
        parentSpam.appendChild(nextButton);
        
        shitumonPane.appendChild(parentSpam);
        
        setCalender();
        
        var hyoujiSpam = document.createElement("button");
        hyoujiSpam.textContent = "表示";
        shitumonPane.appendChild(hyoujiSpam);
        
    }
    
    function readyCalender(){
        
        /*
        var mindate = param.sheet.dateFrom;
        var mindateFormat = new Date(mindate.replace(/-/g, '/'));
        */
        
        $("#calender").datepicker({
            //minDate : mindateFormat,
            maxDate : '0d',
            //ボタン
            showOn : "button",
            buttonImage: "../common/images/calendar-icon.png",
            buttonImageOnly: true,
        });

        // 日本語化
        $.datepicker.regional['ja'] = {
            
            closeText: '閉じる',
            prevText: '<前',
            nextText: '次>',
            currentText: '今日',
            monthNames: ['1月','2月','3月','4月','5月','6月',
            '7月','8月','9月','10月','11月','12月'],
            monthNamesShort: ['1月','2月','3月','4月','5月','6月',
            '7月','8月','9月','10月','11月','12月'],
            dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
            dayNamesShort: ['日','月','火','水','木','金','土'],
            dayNamesMin: ['日','月','火','水','木','金','土'],
            weekHeader: '週',
            dateFormat: 'yy年mm月dd日(D)',
            firstDay: 0,
            isRTL: false,
            showMonthAfterYear: true,
            yearSuffix: '年'};
        $.datepicker.setDefaults($.datepicker.regional['ja']);
    }
    
    function setCalender(){
        var date = comfn.getTodayDate();
        setDateInfo(date);
        readyCalender();
    }
    //日付をセットするメソッド
    function setDateInfo(dateObj){
        var target = document.getElementById("calender");
        target.value = dateObj.getCalenderValue();
    }
    
    function setDate(hidukeSelect){
        var dates = getDateOptions();
        for(var i = 0; i < dates.length; i++){
            var date = dates[i];
            hidukeSelect.appendChild(date);
        }
    }
    
    function getDateOptions(){
        var result = [];
        var date = new Date();
        for(var i = 0; i < 5; i++){
            var option = document.createElement("option");
            option.textContent = date.toLocaleDateString();
            option.value = date;
            result.push(option);
        }
        
        return result;
    }
    
    var getOfBeforeAfterDays = function(dateObj, number) {
    var result = false;
    if (dateObj && dateObj.getTime && number && String(number).match(/^-?[0-9]+$/)) {
        result = new Date(dateObj.getTime() + Number(number) * 24 * 60 * 60 * 1000);
    }
    return result;
        
};
    
    
}