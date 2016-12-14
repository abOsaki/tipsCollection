//const mokuhyoLapID = "mokuhyoLap";
//const mokuhyoTimeID = "mokuhyoTime";
var _ua = (function(){
    return {
        lte_IE6:typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined",
        lte_IE7:typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
        lte_IE8:typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined",
        lte_IE9:document.uniqueID && typeof window.matchMedia == "undefined",
        gte_IE10:document.uniqueID && window.matchMedia ,
        eq_IE8:document.uniqueID && document.documentMode === 8,
        eq_IE9:document.uniqueID && document.documentMode === 9,
        eq_IE10:document.uniqueID && document.documentMode === 10,
        eq_IE11:document.uniqueID && document.documentMode === 11,
//        eq_IE10:document.uniqueID && window.matchMedia && document.selection,
//        eq_IE11:document.uniqueID && window.matchMedia && !document.selection,
//        eq_IE11:document.uniqueID && window.matchMedia && !window.ActiveXObject,
        Trident:document.uniqueID
    }
})();

var shuukaisouCommon = (function () {
    
    var mokuhyoLapText;
    function setMokuhyoLap(lapObj){
        var text = getTimeTextFromMokuhyoObj(lapObj);
        text = text.substring(3);
        var second = parseInt(text);
        text = second + "秒";
        var com = document.getElementById("mokuhyoLap");
        mokuhyoLapText = text;
        com.textContent = text;
        
        if(second){
            var mokuhyoLapSelect = document.getElementById("mokuhyoLapSelect");
            mokuhyoLapSelect.selectedIndex = second;
        }
        /*
        var shuukaisuuSelect = document.getElementById("shuukaisuuSelect");
        shuukaisuuSelect.selectedIndex = shuukaisuu - 1;
        */
    };
    
    function getMokuhyoLap(){
        return mokuhyoLapText;
    };
    
    var mokuhyoTimeText;
    function setMokuhyoTime(timeObj){
        var text = getTimeTextFromMokuhyoObj(timeObj);
        
        var com = document.getElementById("mokuhyoTime");
        mokuhyoTimeText = text;
        com.textContent = text;
    };
    
    function getMokuhyoTime(){
        return mokuhyoTimeText;
    };
    
    function setBunsekiGraph(){
        setBunsekiCcChart();
        ccchart.init("bunsekiGraph",bunsekiGraphConfig);
    }
    
    function setBunsekiCcChart(){
        
        var graphPane = document.getElementById("graphPane");
        var width = graphPane.clientWidth + 6;
        var height = graphPane.clientHeight + 6;
        
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "bold 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "bold 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            "paddingTop" : "25", //上パディング
            //"paddingLeft" : "20",
            "paddingRight" : "140", //右パディング
            "colorSet" : ["blue"], //データ列の色
            "useShadow" : "no", //影
            "height" : height, //チャート高さ
            "width" : width, //チャート幅
            "useMarker" : "css-ring", //マーカー種類
            "markerWidth" : "7", //マーカー大きさ
            "valYOffset" : "8", //値オフセット
            "valXOffset" : "-8", //値オフセット
            //"bg" : "#fff", //背景色
            "bg" : "#fff", //背景色
            "textColor" : "#333", //テキスト色
            //"lineWidth" : "1", //ラインの太さ
            "lineWidth" : "3", //ラインの太さ
            "axisXWidth" : "0.5", //ラインの太さ
            "axisYWidth" : "0.1", //ラインの太さ
            //"onlyChart" : "yes",
            "xColor" : "#808080",
            "yColor" : "#000"
            
        }});
        
        bunsekiGraphConfig = {
            "config" : {
            "colorSet" : ["red","blue","orange","green","purple","brown"], //データ列の色
            "minY" : 0, //Y軸最小値
            "maxY" : 10, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            },
            "data" : [
                ["周回"],
                ]
        };
    }
    
    var bunsekiGraphConfig;
    function setBunsekiGraphConfig(getData,min,max){
        
        var dataArray = getBunsekiDataForGraph(getData);
        
        bunsekiGraphConfig = {
            "config" : {
            "colorSet" : ["red","blue","orange","green","purple","brown"], //データ列の色
            "minY" : min, //Y軸最小値
            "maxY" : max, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            },
            "data" : dataArray
            /*
            "data" : [
                ["日付"],
                ]
                */
        };
    }
    
    function getBunsekiDataForGraph(datas){
        var result = [];
        var hidukeArray = ["周回"];
        result.push(hidukeArray);
        
        for(var i = 0; i < datas.length; i++){
            var data = datas[i];
            var date = data.date;
            var dateText = date.substring(5).substring(0,5);
            
            var tuki = parseInt(dateText.substring(0,2));
            var hi = parseInt(dateText.substring(3));
            //var dateAfterText = tuki + "月" + hi + "日" + "-" + data.try;
            var dateAfterText = data.try + "回目";
            
            //var dateText = date;
            var dateArray = [dateAfterText];
            result.push(dateArray);
        }
        return result;
    }
    
    function setShukeiGraph(){
        //setShukeiCcchartBase();
        //setShukeiGraphConfig();
        
        //setShukeiCcchartBase();
        //setShukeiGraphConfig();
        
        setShukeiCccChartBase(0,10);
        
        ccchart.init("shuukeiGraph",shuukeiGraphConfig);
    }
    
    function setShukeiCccChartBase(shukeiGraphMin,shukeiGraphMax){
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "bold 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "bold 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            "paddingTop" : "25", //上パディング
            //"paddingLeft" : "20",
            "paddingRight" : "140", //右パディング
            "colorSet" : ["blue"], //データ列の色
            "useShadow" : "no", //影
            "height" : "500", //チャート高さ
            "width" : "1100", //チャート幅
            "useMarker" : "css-ring", //マーカー種類
            "markerWidth" : "7", //マーカー大きさ
            "valYOffset" : "8", //値オフセット
            "valXOffset" : "-8", //値オフセット
            //"bg" : "#fff", //背景色
            "bg" : "#fff", //背景色
            "textColor" : "#333", //テキスト色
            //"lineWidth" : "1", //ラインの太さ
            "lineWidth" : "3", //ラインの太さ
            "axisXWidth" : "0.5", //ラインの太さ
            "axisYWidth" : "0.1", //ラインの太さ
            //"onlyChart" : "yes",
            "xColor" : "#808080",
            "yColor" : "#000"
            
        }});
        
        shuukeiGraphConfig = {
            "config" : {
            "colorSet" : ["red","blue","yellow"], //データ列の色
            "minY" : shukeiGraphMin, //Y軸最小値
            "maxY" : shukeiGraphMax, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            },
            "data" : [
                [""],
                ["平均ラップ"],
                ["目標ラップ"],
                ]
        };
        
    };
    
    function setShukeiGoukeiCccChartBase(shukeiGraphMin,shukeiGraphMax){
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "bold 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "bold 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            "paddingTop" : "25", //上パディング
            //"paddingLeft" : "20",
            "paddingRight" : "140", //右パディング
            "colorSet" : ["blue"], //データ列の色
            "useShadow" : "no", //影
            "height" : "500", //チャート高さ
            "width" : "1100", //チャート幅
            "useMarker" : "css-ring", //マーカー種類
            "markerWidth" : "7", //マーカー大きさ
            "valYOffset" : "8", //値オフセット
            "valXOffset" : "-8", //値オフセット
            //"bg" : "#fff", //背景色
            "bg" : "#fff", //背景色
            "textColor" : "#333", //テキスト色
            //"lineWidth" : "1", //ラインの太さ
            "lineWidth" : "3", //ラインの太さ
            "axisXWidth" : "0.5", //ラインの太さ
            "axisYWidth" : "0.1", //ラインの太さ
            //"onlyChart" : "yes",
            "xColor" : "#808080",
            "yColor" : "#000"
            
        }});
        
        shuukeiGraphConfig = {
            "config" : {
            "colorSet" : ["red","blue","yellow"], //データ列の色
            "minY" : shukeiGraphMin, //Y軸最小値
            "maxY" : shukeiGraphMax, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            },
            "data" : [
                [""],
                ["合計タイム"],
                ["目標タイム"],
                ]
        };
        
    };
    
    /*
    function setShukeiCcchartBase(){
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "100 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "100 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            //"paddingTop" : "25", //上パディング
            //"paddingLeft" : "20",
            //"paddingRight" : "0", //右パディング
            "colorSet" : ["blue"], //データ列の色
            "useShadow" : "no", //影
            //"height" : "200", //チャート高さ
            //"width" : "907", //チャート幅
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
    */
    
    function setShukeiGraphConfig(){
        var minY = 10;
        var maxY = 0;
        
        graphConfig = {
            "config" : {
            "colorSet" : ["blue","red"], //データ列の色
            "minY" : minY, //Y軸最小値
            "maxY" : maxY, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            "xLines":[
                
                /*
                {
                    "val": 0,
                    "color": "blue",
                    "width": 5,
                    //"fillOver": "rgba(0,215,0,0.3)",
                    "text": '目標：1時間以内',
                    "font": "15px Arial"
                },
                */
                {
                    "val": mokuhyoWrapSeccond,
                    "color": "blue",
                    "width": 5,
                    //"fillOver": "rgba(255,0,0,0.3)",
                    "text": ' ',
                    //"font": "15px Arial"
                }, ]
            },
            "data" : [
                ["周回"],
                [""],
                ]
        };
    };
    
    var mokuhyoWrapSeccond;
    function setGraph(mokuhyoLapSeccond){
        mokuhyoWrapSeccond = mokuhyoLapSeccond
        setCccChartBase();
        setGraphConfig();
        setInitializeGraphData();
        ccchart.init("graph",graphConfig);
    };
    
    function writeBrowseVer(){
        if(_ua.eq_IE10){
            console.log("ie10");
        }
        
        if(_ua.eq_IE11){
            console.log("ie11");
        }
        
    }
    
    var graphConfig;
    function setCccChartBase(){
        
        //ブラウザのバージョンを取得する
        //writeBrowseVer();
        
        //ブラウザのバージョンによりheight値を取得する
        /*
        var height;
        if(_ua.eq_IE11){
            height = "200";
        }else{
            height = "400";
        }
        */
        ccchart.base("",{config:{
            "type" : "line", //チャート種類
            //"useVal" : "yes", //値を表示
            "xScaleFont" : "100 16px 'meiryo'", //水平軸目盛フォント
            "yScaleFont" : "100 16px 'meiryo'", //垂直軸目盛フォント
            "hanreiFont" : "bold 16px 'meiryo'", //凡例フォント
            "valFont" : "bold 16px 'meiryo'", //値フォント
            //"paddingTop" : "25", //上パディング
            //"paddingLeft" : "20",
            //"paddingRight" : "0", //右パディング
            "colorSet" : ["red"], //データ列の色
            "useShadow" : "no", //影
            "height" : "400", //チャート高さ
            //"width" : "907", //チャート幅
            "useMarker" : "arc", //マーカー種類
            "markerWidth" : "7", //マーカー大きさ
            "valYOffset" : "8", //値オフセット
            "valXOffset" : "-8", //値オフセット
            //"bg" : "#fff", //背景色
            "bg" : "#fff", //背景色
            "textColor" : "#333", //テキスト色
            "lineWidth" : "3", //ラインの太さ
            "axisXWidth" : "0.5", //ラインの太さ
            "axisYWidth" : "0.1", //ラインの太さ
            "onlyChart" : "yes",
            "xColor" : "#808080",
            "yColor" : "#000"
            
        }});
    };
    
    function setGraphConfig(){
        var minY = mokuhyoWrapSeccond - 5;
        var maxY = mokuhyoWrapSeccond + 5;
        
        graphConfig = {
            "config" : {
            "colorSet" : ["red","blue"], //データ列の色
            "minY" : minY, //Y軸最小値
            "maxY" : maxY, //Y軸最大値
            "axisXLen" : 10, //水平目盛線の本数
            "roundDigit":0, // 軸目盛値の端数処理
            "xLines":[
                
                /*
                {
                    "val": 0,
                    "color": "blue",
                    "width": 5,
                    //"fillOver": "rgba(0,215,0,0.3)",
                    "text": '目標：1時間以内',
                    "font": "15px Arial"
                },
                */
                {
                    "val": mokuhyoWrapSeccond,
                    "color": "blue",
                    "width": 3,
                    //"fillOver": "rgba(255,0,0,0.3)",
                    "text": ' ',
                    //"font": "15px Arial"
                }, ]
            },
            "data" : [
                ["周回"],
                [""],
                ]
        };
    };
    
    function setInitializeGraphData(){
        for(var i =0; i <=  11; i++){
            graphConfig["data"][0][i] = (i) + "周目";
            graphConfig["data"][1][i] = null;
        }
           
    };
    
    function setGraphData(shuukai,data){
        var min = mokuhyoWrapSeccond - 5;
        var max = mokuhyoWrapSeccond + 5;
        if(data < min){
            data = min;
        }else if(data > max){
            data = max;
        }
        
        graphConfig["data"][1][(shuukai - 1)] = data;
        ccchart.init("graph",graphConfig);
    };
    
    //☆☆☆リセットグラフ
    function resetGraphData(){
        if(graphConfig){
            setInitializeGraphData();
            ccchart.init("graph",graphConfig);
        }
    };
    
    function setBunsekiGraphVisivillity(){
        /*
        var hidukeGraphDom = document.getElementById("-ccchart-css-group-graph");
        if(hidukeGraphDom){
            hidukeGraphDom.style.visibility = "hidden";
        }
        hidukeGraphDom.style.visibility = "hidden";
        */
        var shuukeiGraphDom = document.getElementById("-ccchart-css-group-shuukeiGraph");
        if(shuukeiGraphDom){
            shuukeiGraphDom.style.visibility = "hidden";
        }
    }
    
    /*
    function setBunsekiGraphBefore(){
        //日付別と集計グラフの初期化を行う
        graphConfig.data = [];
        ccchart.init("graph",graphConfig);
        
        shuukeiGraphConfig.data = [];
        ccchart.init("shuukeiGraph",shuukeiGraphConfig);
    }
    */
    
    function setBunseiGraphFilter(pvKiame){
        //データから周目とラップのデータを取得する
        for(var i =0; i < cvCurrentData.length; i++){
            var taisho = cvCurrentData[i];
            var decodeData = JSON.parse(cvCurrentData[i].data);
            var wraps = decodeData.wraps;
            for(var j = 0; j < wraps.length; j++){
                var lap = wraps[j];
                if(lap){
                    
                    /*
                    var omomi = (i * 0.2);
                    if(i % 2 == 0){
                        omomi /= -2;
                    }
                    */
                    if(taisho.try == pvKiame){
                        var lapData = parseInt(lap);// + omomi;
                        bunsekiGraphConfig["data"][i + 1][j+1] = lapData;
                    }else{
                        bunsekiGraphConfig["data"][i + 1][j+1] = null;
                    }
                    
                }else{
                    bunsekiGraphConfig["data"][i + 1][j+1] = null;
                }
            }
        }
        /*
        for(var k = 1; k <= 11; k++){
            bunsekiGraphConfig["data"][0][k] = k + "周目";
        }
        */
        
        ccchart.init("bunsekiGraph",bunsekiGraphConfig);
        setBunsekiGraphVisivillity();
    }
    
    var cvCurrentData;
    function setBUnsekiGraphData(datas,aveSeccond,sabun){
        //setBunsekiGraphBefore();
        var firstData = JSON.parse(datas[0].data);
        //目標ラップのセコンドを取得する
        var mokuhyoObj = firstData.mokuhyoObj;
        var mokuhyoLap = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoObj);
        
        var chousei = 5;
        if(sabun > 10){
            chousei = 10;
        }
        
        if(sabun > 20){
            chousei = 20;
        }
        
        cvCurrentData = datas;
        
        var min = aveSeccond - chousei;
        var max = aveSeccond + chousei;
        setBunsekiCcChart();
        setBunsekiGraphConfig(datas,min,max);
        
        //データから周目とラップのデータを取得する
        for(var i =0; i < datas.length; i++){
            var decodeData = JSON.parse(datas[i].data);
            var wraps = decodeData.wraps;
            for(var j = 0; j < wraps.length; j++){
                var lap = wraps[j];
                if(lap){
                    var omomi1 = Math.round(i / 2);
                    var omomi = (omomi1 * 0.15);
                    if(i % 2 == 0){
                        omomi /= -2;
                    }
                    
                    var lapData = parseInt(lap) + omomi;
                    bunsekiGraphConfig["data"][i + 1][j+1] = lapData;
                }else{
                    bunsekiGraphConfig["data"][i + 1][j+1] = null;
                }
            }
        }
        
        for(var k = 1; k <= 11; k++){
            bunsekiGraphConfig["data"][0][k] = k + "周目";
        }
        
        ccchart.init("bunsekiGraph",bunsekiGraphConfig);
        setBunsekiGraphVisivillity();
    }
    
    function setShuukeiGraphVisivillity(){
        var hidukeGraphDom = document.getElementById("-ccchart-css-group-graph");
        if(hidukeGraphDom){
            hidukeGraphDom.style.visibility = "hidden";
        }
        hidukeGraphDom.style.visibility = "hidden";
        var bunsekiGraphDom = document.getElementById("-ccchart-css-group-bunsekiGraph");
        if(bunsekiGraphDom){
            bunsekiGraphDom.style.visibility = "hidden";
        }
    }
    
    function setBunsekiGraphHidden(){
        var bunsekiGraphDom = document.getElementById("-ccchart-css-group-bunsekiGraph");
        if(bunsekiGraphDom){
            bunsekiGraphDom.style.visibility = "hidden";
        }
    }
    
    var shuukeiGraphConfig;
    function setShuukeiGraphData(datas,kind){
        if(kind!=0){
            setShuukeiGoukeiGraphData(datas);
            return;
        }
        
        var firstData = JSON.parse(datas[0].data);
        //目標ラップのセコンドを取得する
        var mokuhyoObj = firstData.mokuhyoObj;
        var mokuhyoLap = getMokuhyoWrapSeccondFromMokuhyoDataObj(mokuhyoObj);
        var min = mokuhyoLap - 5;
        var max = mokuhyoLap + 5;
        setShukeiCccChartBase(min,max);
        //目標ラップのセコンドを中央値にしてセットを行う
        for(var i = 0; i < datas.length; i++){
            var decodeData = JSON.parse(datas[i].data);
            var aveTime = parseInt(decodeData.aveTime);
            var mokuhyoLapTime = getMokuhyoWrapSeccondFromMokuhyoDataObj(decodeData.mokuhyoObj);
            
            if(mokuhyoLapTime < min){
                mokuhyoLapTime = min;
            }else if(mokuhyoLapTime > max){
                mokuhyoLapTime = max;
            }
            
            var dateText = datas[i].date.substring(5).substring(0,5);
            var tuki = parseInt(dateText.substring(0,2));
            var hi = parseInt(dateText.substring(3));
            var dateAfterText = tuki + "月" + hi + "日";
            
            shuukeiGraphConfig["data"][0][i+1] = dateAfterText;
            shuukeiGraphConfig["data"][1][i+1] = aveTime;
            shuukeiGraphConfig["data"][2][i+1] = mokuhyoLapTime;
        }
        ccchart.init("shuukeiGraph",shuukeiGraphConfig);
        setShuukeiGraphVisivillity();
    };
    
    function setShuukeiGoukeiGraphData(datas){
        var firstData = JSON.parse(datas[0].data);
        //目標ラップのセコンドを取得する
        var mokuhyoObj = firstData.mokuhyoObj;
        var mokuhyoTime = getMokuhyoTimeSeccondFromMokuhyoDataObj(mokuhyoObj);
        var min = mokuhyoTime - 25;
        var max = mokuhyoTime + 25;
        setShukeiGoukeiCccChartBase(min,max);
        //目標ラップのセコンドを中央値にしてセットを行う
        for(var i = 0; i < datas.length; i++){
            var decodeData = JSON.parse(datas[i].data);
            var secondText = decodeData.sumTime.slice(0,2);
            var second = parseInt(secondText);
            var minuteTextBefore = decodeData.sumTime;
            var minuteText = minuteTextBefore.split(":")[1];
            var minute = parseInt(minuteText);
            var sumTimeSeccond = getSeccond(second,minute);
            var mokuhyoTimeTime = getMokuhyoTimeSeccondFromMokuhyoDataObj(decodeData.mokuhyoObj);
            
            if(sumTimeSeccond < min){
                sumTimeSeccond = min;
            }else if(sumTimeSeccond > max){
                sumTimeSeccond = max;
            }
            
            var dateText = datas[i].date.substring(5).substring(0,5);
            
            var tuki = parseInt(dateText.substring(0,2));
            var hi = parseInt(dateText.substring(3));
            var dateAfterText = tuki + "月" + hi + "日";
            
            shuukeiGraphConfig["data"][0][i+1] = dateAfterText;
            shuukeiGraphConfig["data"][1][i+1] = sumTimeSeccond;
            shuukeiGraphConfig["data"][2][i+1] = mokuhyoTimeTime;
        }
        ccchart.init("shuukeiGraph",shuukeiGraphConfig);
        setShuukeiGraphVisivillity();
    }
    
    function setGraphDataFromRecord(laps){
        var min = mokuhyoWrapSeccond - 5;
        var max = mokuhyoWrapSeccond + 5;
        
        for(var i = 0; i < laps.length; i++){
            var data = laps[i];
            if(data < min){
            data = min;
            }else if(data > max){
                data = max;
            }
            graphConfig["data"][1][i + 1] = data;
        }
        ccchart.init("graph",graphConfig);
    };
    
    function setAllCalender(date){
        //setHidukebetsuCalender(date);
        //setShuukeiCalender(date);
        setKikanHeikinCalender(date);
        setBunsekiCalender(date);
    };
    
    function setHidukebetsuCalender(date){
        setCalender(date,"hidukebetsuCalender");
        readyCalender("#hidukebetsuCalender");
    }
    
    function setKikanHeikinCalender(pvDate){
        setCalender(pvDate,"kikanHeikinEndCalender");
        readyCalender("#kikanHeikinEndCalender");
        
        //5日前のdateを取得する
        var todayDate = getDateFromText(pvDate.getCalenderValue());
        //5日前を取得
        var beforeDate = getAfterDate(todayDate,-5);
        var dateObj = new dateInfo(beforeDate);
        
        setCalender(dateObj,"kikanHeikinStartCalender");
        readyCalender("#kikanHeikinStartCalender");
    }
    
    function setShuukeiCalender(date){
        setCalender(date,"shuukeiEndCalender");
        readyCalender("#shuukeiEndCalender");
        
        //5日前のdateを取得する
        var todayDate = getDateFromText(date.getCalenderValue());
        //5日前を取得
        var beforeDate = getAfterDate(todayDate,-5);
        var dateObj = new dateInfo(beforeDate);
        
        setCalender(dateObj,"shuukeiStartCalender");
        readyCalender("#shuukeiStartCalender");
    }
    
    function setBunsekiCalender(date){
        
        setCalender(date,"bunsekiCalender");
        readyCalender("#bunsekiCalender");
        
        /*
        setCalender(date,"bunsekiEndCalender");
        readyCalender("#bunsekiEndCalender");
        
        setCalender(date,"bunsekiStartCalender");
        readyCalender("#bunsekiStartCalender");
        */
        
        /*
        //5日前のdateを取得する
        var todayDate = getDateFromText(date.getCalenderValue());
        //5日前を取得
        var beforeDate = getAfterDate(todayDate,-5);
        var dateObj = new dateInfo(beforeDate);
        
        setCalender(dateObj,"bunsekiStartCalender");
        readyCalender("#bunsekiStartCalender");
        */
    }
    
    function setCalender(date,id){
        var target = document.getElementById(id);
        target.value = date.getCalenderValue();
    }
    
    function readyCalender(calenderID){
        
        /*
        var mindate = param.sheet.dateFrom;
        var mindateFormat = new Date(mindate.replace(/-/g, '/'));
        */
        
        $(calenderID).datepicker({
            //minDate : mindateFormat,
            maxDate : '0d',
            //ボタン
            showOn : "button",
            buttonImage: "../../common/images/calendar-icon.png",
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
    
    function getHidukebetsuDate(){
        var dateString = document.getElementById("hidukebetsuCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getDateTextFromText(dateString){
        var year = parseInt(dateString.split("年")[0]);
        var month = parseInt(dateString.split("年")[1]);
        if(month < 10){
            month = "0" + month;
        }
        var date = parseInt(dateString.split("月")[1]);
        if(date < 10){
            date = "0" + date;
        }
        
        var datedata = year + "-" + month + "-" + date;
        return datedata;
    }
    
    function getDateFromText(dateString){
        var year = parseInt(dateString.split("年")[0]);
        var month = parseInt(dateString.split("年")[1]);
        var date = parseInt(dateString.split("月")[1]);
        var result = new Date(year,month - 1,date);
        return result;
    }
    
    function getAfterDate(dateObj, number) {
        var result = false;
        if (dateObj && dateObj.getTime && number && String(number).match(/^-?[0-9]+$/)) {
            var hosei = Number(number) * 24 * 60 * 60 * 1000;
            result = new Date(dateObj.getTime() + hosei);
        }
        return result;
    }
    
    function hidukebetsuZenjitsu(){
        //現在の日時取得
        var dateString = document.getElementById("bunsekiCalender").value;
        var currentDate = getDateFromText(dateString);
        var afterDate = getAfterDate(currentDate,-1);
        var dateObj = new dateInfo(afterDate);
        setCalender(dateObj,"bunsekiCalender");
    }
    
    function hidukebetsuGojitsu(){
        //現在の日時取得
        var dateString = document.getElementById("bunsekiCalender").value;
        var currentDate = getDateFromText(dateString);
        var afterDate = getAfterDate(currentDate,1);
        var dateObj = new dateInfo(afterDate);
        setCalender(dateObj,"bunsekiCalender");
    }
    
    function getShuukeiDateArray(){
        //開始の日付を取得
        var startDateString = document.getElementById("shuukeiStartCalender").value;
        var startDate = getDateFromText(startDateString);
        
        //終了日付を取得
        var endDateString = document.getElementById("shuukeiEndCalender").value;
        var endDate = getDateFromText(endDateString);
        
        var result = getDateRangeArray(startDate,endDate);
        return result;
    }
    
    function getDateRangeArray(startDate,endDate){
        var result = [];
        var isSame = false;
        var count = 0;
        //同じ場合は返して終了
        if(isEqualDate(startDate,endDate)){
            result.push(startDate);
            return result;
        }
        var expresDate = startDate;
        while(!isSame && (count < 1000)){
            if(isEqualDate(expresDate,endDate)){
              isSame = true;
            }else{
                expresDate = getAfterDate(expresDate,1);
            }
            result.push(expresDate);
            count++;
        }
        return result;
    }
    
    function isEqualDate(startDate,endDate){
        return (startDate.getFullYear() == endDate.getFullYear() && 
                startDate.getMonth() == endDate.getMonth() && 
                startDate.getDate() == endDate.getDate());
    }
    
    function getShukeiStartTime(){
        var dateString = document.getElementById("shuukeiStartCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getShukeiEndTime(){
        var dateString = document.getElementById("shuukeiEndCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getKikanHeikinStartTime(){
        var dateString = document.getElementById("kikanHeikinStartCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getKikanHeikinEndTime(){
        var dateString = document.getElementById("kikanHeikinEndCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getBunsekiStartTime(){
        var dateString = document.getElementById("bunsekiStartCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getBunsekiTime(){
        var dateString = document.getElementById("bunsekiCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getBunsekiEndTime(){
        var dateString = document.getElementById("bunsekiEndCalender").value;
        var result = getDateTextFromText(dateString);
        return result;
    }
    
    function getShuukeiSelectedDate(){
        var colName = document.getElementsByClassName("-ccchart-ttip-colname");
        if(colName.length > 0){
            return colName[0].textContent;
        }
    }
    
    function getBunsekiSelectedDate(){
        //-ccchart-ttip-rowname
        var colName = document.getElementsByClassName("-ccchart-ttip-rowname");
        if(colName.length > 0){
            return colName[0].textContent;
        }
    }
    
    function setHidukebetsuCalenderText(date){
        var dateInfoObj = new dateInfo(date);
        setCalender(dateInfoObj,"hidukebetsuCalender");
    }
    
    return {
        setMokuhyoObj : function(mokuhyoObj){
            setMokuhyoLap(mokuhyoObj.mokuhyoWrapObj);
            setMokuhyoTime(mokuhyoObj.mokuhyoTimeObj);
        },
        setGraph : function(mokuhyoLapSeccond){
            setGraph(mokuhyoLapSeccond);
        },
        setGraphData : function(shuukai,data){
            setGraphData(shuukai,data)
        },
        getMokuhyoLapText : function(){
            return getMokuhyoLap();
        },
        getMokuhyoTimeText : function(){
            return getMokuhyoTime();
        },
        setGraphDataFromRecode : function(laps){
            setGraphDataFromRecord(laps);
        },
        setAllCalender : function(date){
            setAllCalender(date);
        },
        getHidukebetsuDate : function(){
            return getHidukebetsuDate();
        },
        hidukebetsuZenjituPushed : function(){
            hidukebetsuZenjitsu();
        },
        hidukebetsuGojituPushed : function(){
            hidukebetsuGojitsu();
        },
        setShukeiGraph : function(){
            setShukeiGraph();
        },
        getShukeiDateArray : function(){
            return getShuukeiDateArray();
        },
        getShukeiStartTime : function(){
            return getShukeiStartTime();
        },
        getShukeiEndTime : function(){
            return getShukeiEndTime();
        },
        setShukeiGraphData : function(datas,kind){
            setShuukeiGraphData(datas,kind);
        },
        setBunsekiGraph : function(){
            setBunsekiGraph();
        },
        getBunsekiStartTime : function(){
            return getBunsekiStartTime();
        },
        getBunsekiEndTime : function(){
            return getBunsekiEndTime();
        },
        getBunsekiTime : function(){
            return getBunsekiTime();
        },
        getKikanHeikinStartTime : function(){
            return getKikanHeikinStartTime();
        },
        getKikanHeikinEndTime : function(){
            return getKikanHeikinEndTime();
        },
        setBunsekiGraphData : function(datas,aveSeccond,sabun){
            setBUnsekiGraphData(datas,aveSeccond,sabun);
        },
        getShuukeiSelectedDate : function(){
            return getShuukeiSelectedDate();
        },
        getBunsekiSelectedDate : function(){
            return getBunsekiSelectedDate();
        },
        setHidukebetsuCalenderText : function(date){
            setHidukebetsuCalenderText(date);
        },
        resetGraphData : function(){
            resetGraphData();
        },
        setBunsekiGraphHidden : function(){
            setBunsekiGraphHidden();
        },
        setBunsekiGraphFilter : function(pvKaime){
            setBunseiGraphFilter(pvKaime)
        }
    };
}());