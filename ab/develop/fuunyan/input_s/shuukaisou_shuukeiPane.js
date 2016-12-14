function shuukaisouShuukei(){
    this.ready = function(){
        ready();
    }
    this.notifyFocus = function(){
        notifyFocus();
    }
    
    function ready(){
        setPanes();
        setDisplay();
        
        
    }
    
    function notifyFocus(){
        changeThisGraphBase();
    }
    
    var mainContainer;
    var graphCanvas;
    function setPanes(){
        mainContainer = document.getElementById("shuukeiContent");
        graphCanvas = document.getElementById("shuukeiGraph");
    }
    
    function setDisplay(){
        setGraphBase();
        //カレンダーの用意
        setCalender();
        
    }
    
    function setGraphBase(){
        setCccChartBase();
        setGraphConfig();
        ccchart.init("shuukeiGraph",graphConfig);
    }
    var graphConfig;
    
    function changeThisGraphBase(){
        setCccChartBase();
        ccchart.init("shuukeiGraph",graphConfig);
    }
    
    function setCccChartBase(){
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "100 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "100 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            //"paddingTop" : "25", //上パディング
            //"paddingLeft" : "140",
            "paddingRight" : "0", //右パディング
            "colorSet" : ["blue"], //データ列の色
            "useShadow" : "no", //影
            "height" : "400", //チャート高さ
            "width" : "907", //チャート幅
            "useMarker" : "arc", //マーカー種類
            "markerWidth" : "7", //マーカー大きさ
            "valYOffset" : "8", //値オフセット
            "valXOffset" : "-8", //値オフセット
            //"bg" : "#fff", //背景色
            "bg" : "#fff", //背景色
            "textColor" : "#333", //テキスト色
            "lineWidth" : "1", //ラインの太さ
            "onlyChart" : "yes",
            "xColor" : "#808080",
            "yColor" : "#000"
            
        }});
        
    }
    
    function setGraphConfig(){
        var minY = 0;
        var maxY = 10;
        
        
        graphConfig = {
            "config" : {
            "colorSet" : ["red","blue"], //データ列の色
            "minY" : minY, //Y軸最小値
            "maxY" : maxY, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
                /*
            "xLines":[
                
                {
                    "val": mokuhyoWrapSeccond,
                    "color": "red",
                    "width": 5,
                    //"fillOver": "rgba(255,0,0,0.3)",
                    "text": '目標',
                    "font": "15px Arial"
                }, ]
            },
            */
            "data" : [
                ["周回"],
                [""],
                ]
            }
        };
    }
    
    function setCalender(){
        var date = comfn.getTodayDate();
        setDateForShukei(date);
        readyCalender();
    }
    
    function setDateForShukei(date){
        var start = document.getElementById("shuukeiStartCalender");
        start.value = date.getCalenderValue();
        
        var end = document.getElementById("shuukeiEndCalender");
        end.value = date.getCalenderValue();
    }
    
    function readyCalender(){
        
        /*
        var mindate = param.sheet.dateFrom;
        var mindateFormat = new Date(mindate.replace(/-/g, '/'));
        */
        
        $("#shuukeiEndCalender").datepicker({
            //minDate : mindateFormat,
            maxDate : '0d',
            //ボタン
            showOn : "button",
            buttonImage: "../common/images/calendar-icon.png",
            buttonImageOnly: true,
        });
        
        $("#shuukeiStartCalender").datepicker({
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
    
}



    