/*global $, console, alert, comfn, param, DateFormat*/
$(function() {
    //definition
    var fn = {
            init: function() {
                //ログインチェック
                comfn.loginCheck();
                //SessionStorageの取得とBasicInfoへの値設定
                comfn.setBasicInfo();
                param.GET = comfn.takeGET();
                if (param.GET.p) {
                    fn.filterInfo();
                    
                    var callbackForQuestion = function(){
                        var callbackForQuestionAnswer = function(){
                            fn.answerSearch(param.GET.p);
                        };
                        comfn.setQuestionAnswer(callbackForQuestionAnswer);
                    };
                    
                    comfn.setQuestion(callbackForQuestion);
                }
                //fn.createChart();
            },
            filterInfo: function() {
                var inter,
                    code = null,
                    ct = 0,
                    array = [];
                inter = setInterval(function() {
                    if (param.sheet) {
                        if (Number(param.sheet[0].group)) {
                            if (Number(param.sheet[0].group) === 1) {
                                code = "E";
                            } else if (Number(param.sheet[0].group) === 2) {
                                code = "H";
                            }
                        }
                    }
                    if (code) {
                        $('#grade').text(comfn.SS.get("grade" + code)[Number(param.sheet[0]["grade" + code]) - 1].name);
                        $('#class').text(comfn.SS.get("class" + code)[Number(param.sheet[0]["class" + code]) - 1].name);
                        $('#pMonth').text(param.sheet[0].dateFrom.split(" ")[0] + "～" + param.sheet[0].dateTo.split(" ")[0]);
                        $('#pTitle').text(param.sheet[0].title);
                        $('.label_studentnum .div1').text(($('#grade').text()) + '' + $('#class').text() + 'さん');
                        $('.label_studentnum .div2').text('全員：' + param.student.length + '名');
                        //$('.label_studentnum .div2').text('全員:29名');
                        clearInterval(inter);
                    }
                }, 30);
                array.push({
                    id: "bar",
                    name: '棒グラフ'
                }, {
                    id: "line",
                    name: '折れ線グラフ'
                });
                //一度クリアして設定
                $('#chartType').empty().setOption(array);
            },
            getRange: function() {
                //日付抽出
                return (function() {
                    var days, baseDate, dateFormat, date, strDate, j, array = [];
                    array.push('日付');
                    days = comfn.compareDate(param.sheet[0].dateFrom, param.sheet[0].dateTo) + 1;
                    baseDate = param.sheet[0].dateFrom;
                    dateFormat = new DateFormat("yyyy-MM-dd");
                    for (j = 0; j < days; j += 1) {
                        date = dateFormat.format(comfn.computeDate(baseDate, j));
                        strDate = date.split('-');
                        array.push(strDate[1] + '/' + strDate[2]);
                    }
                    return array;
                }());
            },
            averageData: function(allFlag, target) {
                var sendData;
                // if ($('input[name="gradeAve"]:checked').val() || $('input[name="classAve"]:checked').val() || $('input[name="sexAve"]:checked').val()) { //平均値と比較
                //デモ用に平均表示を消去
                if (0) {
                    if ($("#questionSelector").val() > 0) { //睡眠時間以外
                        sendData = {
                            'command': 'averageData',
                            'param': {
                                qID: $("#questionSelector").val() || null,
                                group: param.sheet[0].group || null,
                                school: Number(param.sheet[0].schoolH) || param.sheet[0].schoolE,
                                grade: Number(param.sheet[0].gradeH) || param.sheet[0].gradeE,
                                "class": Number(param.sheet[0].classH) || param.sheet[0].classE,
                                sex: $('input[name="sexAve"]:checked').val()
                            }
                        };
                        $.ajax({
                            url: 'ajax.php',
                            type: 'POST',
                            dataType: 'json',
                            data: JSON.stringify(sendData)
                        }).done(function(data) {
                            var average, aveList, range, config, i, il, j, jl, k, kl,
                                flag = false;
                            //いずれ整理を
                            range = fn.getRange();
                            aveList = [
                                ["学年平均"],
                                ["クラス平均"],
                                ["性別平均"]
                            ];
                            average = [
                                ["学年平均"],
                                ["クラス平均"],
                                ["性別平均"]
                            ];
                            for (k = 0, kl = data.length; k < kl; k += 1) {
                                if (data[k].avetype === "1") {
                                    aveList[data[k].avetype - 1].push(data[k]);
                                } else if (data[k].avetype === "2") {
                                    aveList[data[k].avetype - 1].push(data[k]);
                                } else if (data[k].avetype === "3") {
                                    aveList[data[k].avetype - 1].push(data[k]);
                                }
                            }
                            for (k = 0, kl = aveList.length; k < kl; k += 1) {
                                for (i = 1, il = range.length; i < il; i += 1) {
                                    for (j = 1, jl = aveList[k].length; j < jl; j += 1) {
                                        if (aveList[k][j] && aveList[k][j].date && aveList[k][j].date === range[i]) {
                                            average[k].push(Number(aveList[k][j].avg));
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if (!flag) {
                                        average[k].push(null);
                                    }
                                    flag = false;
                                }
                            }
                            //console.log(average);
                            fn.createChart(average, allFlag, target)
                        });
                    } else {
                        //睡眠時間用
                        sendData = {
                            'command': 'sleapAverage',
                            'param': {
                                qID: $("#questionSelector").val() || null,
                                group: param.sheet[0].group || null,
                                school: Number(param.sheet[0].schoolH) || param.sheet[0].schoolE,
                                grade: Number(param.sheet[0].gradeH) || param.sheet[0].gradeE,
                                "class": Number(param.sheet[0].classH) || param.sheet[0].classE,
                                sex: $('input[name="sexAve"]:checked').val()
                            }
                        };
                        $.ajax({
                            url: 'ajax.php',
                            type: 'POST',
                            dataType: 'json',
                            data: JSON.stringify(sendData)
                        }).done(function(data) {
                            var average, aveList, range, config, i, il, j, jl, k, kl,
                                flag = false,
                                num = 0;
                            //いずれ整理を
                            range = fn.getRange();
                            aveList = [
                                ["学年平均"],
                                ["クラス平均"],
                                ["性別平均"]
                            ];
                            average = [
                                ["学年平均"],
                                ["クラス平均"],
                                ["性別平均"]
                            ];
                            for (k = 0, kl = data.length; k < kl; k += 1) {
                                if (data[k].avetype === "1") {
                                    aveList[data[k].avetype - 1].push(data[k]);
                                } else if (data[k].avetype === "2") {
                                    aveList[data[k].avetype - 1].push(data[k]);
                                } else if (data[k].avetype === "3") {
                                    aveList[data[k].avetype - 1].push(data[k]);
                                }
                            }
                            for (k = 0, kl = aveList.length; k < kl; k += 1) {
                                for (i = 1, il = range.length; i < il; i += 1) {
                                    for (j = 1, jl = aveList[k].length; j < jl; j += 1) {
                                        if (aveList[k][j] && aveList[k][j].date && aveList[k][j].date === range[i]) {
                                            if (aveList[k][j].avg1 > aveList[k][j].avg3) {
                                                num = Number(aveList[k][j].avg3) + (24 - Number(aveList[k][j].avg1));
                                            } else {
                                                num = Number(aveList[k][j].avg3) - Number(aveList[k][j].avg1);
                                            }
                                            num = Math.round((Number(aveList[k][j].avg3) + 24 - Number(aveList[k][j].avg1)) * Math.pow(10, 1)) / Math.pow(10, 1);
                                            average[k].push(num);
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if (!flag) {
                                        average[k].push(null);
                                    }
                                    flag = false;
                                }
                            }
                            fn.createChart(average, allFlag, target)
                        });
                    }
                } else { //平均比較無し
                    fn.createChart(null, allFlag, target)
                    return false;
                }
            },
            createChart: function(average, allFlag, target) {
                var quesID, chartType, xLine, maxY, minY, axisXLen, memoVal, configUnit,
                    range, chartData, chartConfig, i, il, yAxisVal,
                    date = [];
                quesID = $("#questionSelector").val();
                chartType = $("#chartType").val();
                if (allFlag == true) {
                    chartConfig = fn.chartConfig();
                    chartConfig.config.type='line';
                    chartConfig.config.useMarker = "css-ring",
                        chartConfig.config.lineWidth = 3,
                        chartConfig.config.borderWidth = 6,
                        chartConfig.config.markerWidth = 5,
                        chartConfig.config.hanreiMarkerStyle = "rect";
                    //全期間の場合はシートの期間中全てを格納
                    var array = fn.getDateList();
                    for (var i = 0; i < array.length; i++) {
                        date.push(array[i].id);
                    }
                } else {
                    chartConfig = fn.chartConfig();
                    chartConfig.config.type='bar';
                    chartConfig.config.colorSet = ["#cde0f4", "#9e9eff", "#c4efef", "#adf0b2", "#def092", "#ffff9e", "#a3a3ff", "#a3d1ff", "#a3ffff", "#a3ffd1", "#a3ffa3", "#d1ffa3", "#ffffa3", "#a8a8ff", "#a8d3ff", "#a8ffff", "#a8ffd3", "#a8ffa8", "#d3ffa8", "#ffffa8", "#adadff", "#add6ff", "#adffff", "#adffd6", "#adffad", "#d6ffad", "#ffffad", "#b2b2ff", "#b2d8ff", "#b2ffff", "#b2ffd8", "#b2ffb2", "#d8ffb2", "#ffffb2", "#b7b7ff", "#b7dbff", "#b7ffff", "#b7ffdb", "#b7ffb7", "#dbffb7", "#ffffb7"]
                    date.push($("#dateSelect").val());
                    chartConfig.config.barWidth = 16;
                        average = null;
                }
                //averageList = fun;
                
                
                //☆下記のくそメソッドは質問カラムに追加する必要性があるかも
                //実装方法
                //１、あらかじめ質問データをロードしておくOK
                
                //２、質問データからアンサータイプを取得する
                
                
                //３、アンサータイプからグラフのコンフィグオブジェクトを取得する
                var graphConfig = comfn.getGraphConfigFromQuestionID(quesID);
                
                
                if(graphConfig.chartDataType == "sleep"){
                    chartData = fn.sleepChartData(quesID, date, target);
                }else if(graphConfig.chartDataType == "stage"){
                    chartData = fn.stageChartData(quesID, date, target);
                }
                
                if(graphConfig.memo){
                    chartConfig.config.memo.val = graphConfig.memo;
                }
                
                if(graphConfig.unit){
                    chartConfig.config.unit = graphConfig.unit;
                }
                
                chartConfig.config.maxY = graphConfig.maxY;
                chartConfig.config.minY = graphConfig.minY;
                chartConfig.config.axisXLen = graphConfig.axisXLen;
                
                if(graphConfig.xLines){
                    chartConfig.config.xLines = graphConfig.xLines;
                }
                
                if(graphConfig.yAxisVal){
                    chartConfig.config.yAxisVal = graphConfig.yAxisVal;
                }
                
                /*
                switch (quesID) {
                    case "-1":
                        //就寝
                        // var range = fn.rangeGet(chartData)
                        chartData = fn.sleepChartData(quesID, date, target);
                        chartConfig.config.memo.val = "睡眠時間（目標：8時間）";
                        chartConfig.config.unit = "時間";
                        chartConfig.config.maxY = 16;
                        chartConfig.config.minY = 4;
                        chartConfig.config.axisXLen = 6;

                        chartConfig.config.xLines = [{
                            "val": 8,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：8時間',
                            "font": "15px Arial"
                        }, {
                            "val": 6,
                            "color": "red",
                            "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                            "text": '注意：6時間',
                            "font": "15px Arial"
                        }]
                        break;
                    case "1":
                        //就寝
                        chartData = fn.sleepChartData(quesID, date, target);
                        chartConfig.config.memo.val = "昨日は、何時に寝ましたか（目標：２１時）";
                        chartConfig.config.unit = "時間";
                        chartConfig.config.maxY = 28;
                        chartConfig.config.minY = 16;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 21,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：21時',
                            "font": "15px Arial"
                        }, {
                            "val": 23,
                            "color": "red",
                            "width": 5,
//                            "fillOver": "rgba(255,0,0,0.3)",
                            "text": '注意：23時',
                            "font": "15px Arial"
                        }]
                        chartConfig.config.yAxisVal = ["16時","18時", "20時", "22時", "0時", "2時", "4時"];

                        break;
                    case "2":
                        //起床
                        chartData = fn.sleepChartData(quesID, date, target);
                        chartConfig.config.memo.val = "今日は、何時に起きましたか（目標：６時）";
                        chartConfig.config.unit = "時間";
                        chartConfig.config.maxY = 14;
                        chartConfig.config.minY = 2;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 6,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：6時',
                            "font": "15px Arial"
                        },{
                            "val": 8,
                            "color": "red",
                            "width": 5,
                            //"fillOver": "rgba(255,0,0,0.3)",
                            "text": '注意：8時',
                            "font": "15px Arial"
                        }]
                        chartConfig.config.yAxisVal = ["2時", "4時", "6時", "8時", "10時", "12時", "14時"];
                        break;
                    case "3":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "昨日は、歯を何回みがきましたか";
                        chartConfig.config.unit = "2:2回以上、1:1回、0:0回";
                        chartConfig.config.maxY = 4;
                        chartConfig.config.minY = -2;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 2,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：2回以上',
                            "font": "15px Arial"
                        },{
                            "val": 0,
                            "color": "red",
                            "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                            "text": '注意：0回',
                            "font": "15px Arial"
                        }]
                        chartConfig.config.yAxisVal = [" "," ","0回",  "1回",  "2回以上", " ", " "];

                        break;
                    case "4":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "今日は、朝ごはんを食べましたか";
                        chartConfig.config.unit = "2:食べた、1:少し食べた、0:食べられなかった";
                        chartConfig.config.maxY = 4;
                        chartConfig.config.minY = -2;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 2,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：食べた',
                            "font": "15px Arial"
                        },{
                            "val": 0,
                            "color": "red",
                            "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                            "text": '注意：食べられなかった',
                            "font": "15px Arial"
                        }, ]
                        chartConfig.config.yAxisVal = [" "," ","食べられなかった",  "少し食べた",  "食べた", " ", " "];

                        break;
                    case "7":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "排便はありましたか";
                        //chartConfig.config.unit = "2:進んでやった、1:お家の人に言われてやった、0:やらなかった";
                        chartConfig.config.maxY = 2;
                        chartConfig.config.minY = -1;
                        chartConfig.config.axisXLen = 3;
                        
                        //chartConfig.config.xLines = [{
                        //    "val": 2,
                        //    "color": "blue",
                        //    "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                        //    "text": '目標：進んでやった',
                        //    "font": "15px Arial"
                        //},{
                        //    "val": 0,
                        //    "color": "red",
                        //    "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                        //    "text": '注意：やらなかった',
                        //    "font": "15px Arial"
                        //}, ]
                        
                        chartConfig.config.yAxisVal = ["","昨日も今朝も出ない","昨日、出た","今日の朝、出た"];
                        break;
                        
                    case "8":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "昨日のテレビやゲームの時間はどのくらいでしたか";
                        chartConfig.config.unit = "2:3時間以上、1:3時間以内、0:1時間以内";
                        chartConfig.config.maxY = 4;
                        chartConfig.config.minY = -2;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 0,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：1時間以内',
                            "font": "15px Arial"
                        },{
                            "val": 2,
                            "color": "red",
                            "width": 5,
                            //"fillOver": "rgba(255,0,0,0.3)",
                            "text": '注意：3時間以上',
                            "font": "15px Arial"
                        }, ]
                        chartConfig.config.yAxisVal = [" "," ","1時間以内",  "3時間以内",  "3時間以上", " ", " "];

                        break;
                    case "10":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "外で運動しましたか？";
                        chartConfig.config.unit = "2:,1:,0:";
                        chartConfig.config.maxY = 3;
                        chartConfig.config.minY = 0;
                        axisXLen = maxY;
                        break;
                    case "67":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "家庭学習はしましたか";
                        chartConfig.config.unit = "2:進んでやった、1:お家の人に言われてやった、0:やらなかった";
                        chartConfig.config.maxY = 4;
                        chartConfig.config.minY = -2;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 2,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：進んでやった',
                            "font": "15px Arial"
                        },{
                            "val": 0,
                            "color": "red",
                            "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                            "text": '注意：やらなかった',
                            "font": "15px Arial"
                        }, ]
                        chartConfig.config.yAxisVal = [" "," ","やらなかった",  "言われてやった",  "進んでやった", " ", " "];
                        break;
                    case "68":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "朝、寝起きはどうでしたか";
                        chartConfig.config.unit = "2:すっきり起きられた、1:もっとねむりたかった";
                        chartConfig.config.maxY = 2;
                        chartConfig.config.minY = -2;
                        chartConfig.config.axisXLen = 4;
                        
                        //chartConfig.config.xLines = [{
                        //    "val": 2,
                        //    "color": "blue",
                        //    "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                        //    "text": '目標：進んでやった',
                        //    "font": "15px Arial"
                        //},{
                        //    "val": 0,
                        //    "color": "red",
                        //    "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                        //    "text": '注意：やらなかった',
                        //    "font": "15px Arial"
                        //}, ]
                        
                        chartConfig.config.yAxisVal = [" "," ","もっとねむりたかった",  "すっきり起きられた",  "", " ", " "];
                        break;
                    case "69":
                        chartData = fn.stageChartData(quesID, date, target);
                        chartConfig.config.memo.val = "あいさつしましたか";
                        chartConfig.config.unit = "2:進んでやった、1:言われてからした、0:やらなかった";
                        chartConfig.config.maxY = 4;
                        chartConfig.config.minY = -2;
                        chartConfig.config.axisXLen = 6;
                        chartConfig.config.xLines = [{
                            "val": 2,
                            "color": "blue",
                            "width": 5,
                            //"fillOver": "rgba(0,215,0,0.3)",
                            "text": '目標：進んでやった',
                            "font": "15px Arial"
                        },{
                            "val": 0,
                            "color": "red",
                            "width": 5,
                            //"fillUnder": "rgba(255,0,0,0.3)",
                            "text": '注意：やらなかった',
                            "font": "15px Arial"
                        }, ]
                        chartConfig.config.yAxisVal = [" "," ","やらなかった",  "言われてからした",  "進んでやった", " ", " "];
                        break;
                        
                    default:
                        throw new Error('グラフが定義されていません questionID : ' + Number(quesID));
                }
                */



                chartConfig.data = chartData;
                param.chartData = chartData;

                if (average) {
                    var averageArray = [];
                    var num = comfn.compareDate(param.sheet[0].dateFrom.split(' ')[0], $('#dateSelect').val());
                    if (1) {
                        var totalVal;
                        var counter = 0;
                        if (allFlag == true) {
                            var sum = 0;
                            for (var i = 1; i < average[0].length; i++) {
                                if (average[0][i] != 0) {
                                    sum += average[0][i];
                                    counter++;
                                }
                            }
                            totalVal = (sum / counter);
                        } else {
                            totalVal = average[0][num + 1];
                        }
                        chartConfig.config.xLines.push({
                            "val": totalVal,
                            "color": "rgba(0,0,255,0.7)",
                            "text": average[0][0]
                        });
                    }
                    if (1) {
                        var totalVal;
                        var counter = 0;
                        if (allFlag == true) {
                            var sum = 0;
                            for (var i = 1; i < average[1].length; i++) {
                                if (average[1][i] != 0) {
                                    sum += average[1][i];
                                    counter++;
                                }
                            }
                            totalVal = (sum / counter);
                        } else {
                            totalVal = average[1][num + 1];
                        }
                        chartConfig.config.xLines.push({
                            "val": totalVal,
                            "color": "rgba(0,150,0,0.7)",
                            "text": average[1][0]
                        });
                    }
                }
                
                //@目印がついたx項目はredに
                ccchart.setXValueColorDictionary('@','red');
                
                ccchart.init('graph', chartConfig);
            },
            chartConfig: function(chartType) {
                var config;
                config = {
                    "config": {
                        "type": chartType,
                        "width": 1200,
                        "height": 480,
                        "useShadow": "no",
                        "useHanrei": "no",
                        "barWidth": 1500,
                        "lineToXOffset":50,
                        "paddingLeft":120,
                        "roundDigit": 1,
                        "bg": "#f8f8f8",
                        "hanreiColor": "#898989",
                        "unitColor": "#040455",
                        "xScaleColor": "#040455",
                        "yScaleColor": "#040455",
                        "yScaleFont": "15px Arial",
                        "yScaleRotate": -45,
                        "paddingBottom": 65,
                        "colNamesTitleOffset": 22,
                        "memo": {
                            "left": 500,
                            "top": 30,
                            "align": "left",
                            "color": "#040455",
                            "font": "100 18px Arial"
                        },
                    }
                };
                return config;
            },
            sleepChartData: function(quesID, dateList, target) {
                target = target || [];
                //questionID：文字列の数字
                var chartData, range, sleep, i,
                    dateArray = [];
                dateArray = dateArray.concat(dateList);
                range = dateArray;
                sleep = (function() {
                    var array, node, sleepFromArray, sleepToArray, sleepFromNode, sleepToNode, i, j,
                        baseObj = param.datamap.createUserMap;
                    if (target.length > 0) {
                        $('#userSelect').val('-99');
                    }
                    if ($('#userSelect').val() != '-99') {
                        var number = $('#userSelect').val();
                        baseObj = [baseObj.filter(function(item, index) {
                            if (item.user === number) {
                                return true;
                            }
                        })[0]];
                    }
                    var resObject = [];
                    //期間ごと
                    for (var m = 0; m < range.length; m++) {
                        //ユーザごと
                        resObject[m] = {
                            "range": range[m],
                            "data": {}
                        }
//                        var baseArray = [
//                            ['番号'],
//                            ['時間']
//                        ];
                        var baseArray = [
                            [''],
                            ['']
                        ];
                        for (var i = 0; i < baseObj.length; i++) {
                            node = baseObj[i];
                            if (target.length > 0 && $.inArray(node.user, target) == -1) {
                                continue;
                            }
                            sleepFromArray = node.que.filter(function(item, index) {
                                if (item.id === "1") {
                                    return true;
                                }
                            });
                            sleepToArray = node.que.filter(function(item, index) {
                                if (item.id === "2") {
                                    return true;
                                }
                            });
                            var num = comfn.compareDate(param.sheet[0].dateFrom.split(' ')[0], range[m]);
                            var bango = node.number + "番"
//                            baseArray[0].push(node.number + "番");
                            if (quesID === "1") { //就寝
                                // for (j = 0; j < range.length; j += 1) {
                                sleepFromNode = sleepFromArray[0].ans[num][1].split(',');
                                if (sleepFromNode.length === 2) {
                                    baseArray[1].push(Number(sleepFromArray[0].ans[num][1].replace(/,/g, '.')));
                                } else {
                                    //未回答の場合
                                    baseArray[1].push(null);
                                    bango += '@';
                                }
                                // }
                            } else if (quesID === "2") { //起床
                                // for (j = 0; j < range.length; j += 1) {
                                sleepToNode = sleepToArray[0].ans[num][1].split(',');
                                if (sleepToNode.length === 2) {
                                    baseArray[1].push(Number(sleepToArray[0].ans[num][1].replace(/,/g, '.')));
                                } else {
                                    //未回答の場合
                                    baseArray[1].push(null);
                                    bango += '@';
                                }
                                // }
                            } else {
                                //睡眠時間
                                if (sleepFromArray && sleepToArray) {
                                    // for (var j = 0; j < sleepFromArray[0].ans.length; j++) {
                                    //就寝時間を分解
                                    sleepFromNode = sleepFromArray[0].ans[num][1].split(',');
                                    sleepToNode = sleepToArray[0].ans[num][1].split(',');
                                    if (sleepFromNode.length === 2 && sleepToNode.length === 2) {
                                        // 回答していたら要素は2個．どちらも正しく回答している必要がある
                                        var hour = (Number(sleepToNode[0]) + 24) - Number(sleepFromNode[0]);
                                        var minute = (Number(sleepToNode[1])) - Number(sleepFromNode[1]);
                                        if (minute < 0) {
                                            minute = minute + 60;
                                            hour -= 1;
                                        }
                                        baseArray[1].push(Number(hour + '.' + minute));
                                    } else {
                                        //未回答の場合
                                        baseArray[1].push(null);
                                        bango += '@';
                                    }
                                } else {
                                    baseArray[1].push(null);
                                }
                            }
                            
                            baseArray[0].push(bango);
                            
                        }
                        resObject[m].data = baseArray;
                    }
                    return resObject;
                }());
                // chartData = [range];
                chartData = [];
                if (range.length == 1) {
                    //その日だけの表示を行えばよい場合
                    chartData.push(sleep[0].data[0])
                    for (i = 0; i < sleep.length; i++) {
                        chartData.push(sleep[i].data[1]);
                    }
                } else {
                    //全期間の値を表示する必要がある場合，データ整形を行う
                    chartData.push((function() {
                        //var dateArray = ['日付'];
                        var dateArray = [''];
                        for (i = 0; i < sleep.length; i++) {
                            dateArray.push(sleep[i].range)
                        }
                        return dateArray;
                    })());
                    for (var i = 1; i < sleep[0].data[0].length; i++) {
                        //生徒番号単位
                        var studentArray = [sleep[0].data[0][i]];
                        for (var j = 0; j < sleep.length; j++) {
                            studentArray.push(sleep[j].data[1][i])
                        }
                        chartData.push(studentArray);
                    }
                }
                return chartData;
            },
            stageChartData: function(quesID, userList, target) {
                target = target || [];
                //questionID：文字列の数字
                //ave平均表示フラグは必要？
                var chartData, range, stage,
                    dateArray = [];
                dateArray = dateArray.concat(userList);
                //日付抽出
                range = dateArray;
                stage = (function() {
                    var baseObj, array, node, i, j, eatArray, eatArrayNode;
                    baseObj = param.datamap.createUserMap;
                    if (target.length > 0) {
                        $('#userSelect').val('-99');
                    }
                    if ($('#userSelect').val() != -'99') {
                        var number = $('#userSelect').val();
                        baseObj = [baseObj.filter(function(item, index) {
                            if (item.user === number) {
                                return true;
                            }
                        })[0]];
                    }
                    var resObject = [];
                    for (var m = 0; m < range.length; m++) {
                        //ユーザごと
                        resObject[m] = {
                            "range": range[m],
                            "data": {}
                        }
//                        var baseArray = [
//                            ['番号'],
//                            ['時間']
//                        ];
                        var baseArray = [
                            [''],
                            ['']
                        ];
                        for (i = 0; i < baseObj.length; i += 1) {
                            node = baseObj[i];
                            eatArray = node.que.filter(function(item, index) {
                                if (item.id === quesID) {
                                    return true;
                                }
                            });
                            node = baseObj[i];
                            if (target.length > 0 && $.inArray(node.user, target) == -1) {
                                continue;
                            }
                            var num = comfn.compareDate(param.sheet[0].dateFrom.split(' ')[0], range[m]);
                            //baseArray[0].push(node.number + "番");
                            var bango = node.number + "番";
                            if (eatArray) {
                                // for (j = 0; j < range.length ; j += 1) {
                                //食を分解
                                eatArrayNode = eatArray[0].ans[num][1];
                                if (eatArrayNode.length === 1) {
                                    //正しい回答の場合
                                    baseArray[1].push(Number(eatArrayNode));
                                } else {
                                    //未回答の場合
                                    baseArray[1].push(null);
                                    bango += '@';
                                }
                                // }
                            } else {
                                baseArray[1].push(null);
                            }
                            // baseArray.push(array);
                            baseArray[0].push(bango);
                        }
                        resObject[m].data = baseArray;
                    }
                    return resObject;
                }());
                // chartData = [range];
                chartData = [];
                if (range.length == 1) {
                    //その日だけの表示を行えばよい場合
                    chartData.push(stage[0].data[0])
                    for (i = 0; i < stage.length; i++) {
                        chartData.push(stage[i].data[1]);
                    }
                } else {
                    //全期間の値を表示する必要がある場合，データ整形を行う
                    chartData.push((function() {
                        //var dateArray = ['日付'];
                        var dateArray = [''];
                        for (i = 0; i < stage.length; i++) {
                            dateArray.push(stage[i].range)
                        }
                        return dateArray;
                    })());
                    for (var i = 0; i < stage[0].data[0].length; i++) {
                        //生徒番号単位
                        var studentArray = [stage[0].data[0][i]];
                        for (var j = 0; j < stage.length; j++) {
                            var taisho = stage[j].data[1][i];
                            if(taisho === ""){
                                taisho = null;
                            }
                            studentArray.push(taisho)
                        }
                        chartData.push(studentArray);
                    }
                }
                return chartData;
            },
            answerSearch: function(id) {
                var sendData = {
                    'command': 'answerSearch',
                    'param': {
                        'id': id
                    }
                };
                $.ajax({
                    url: 'ajax.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(sendData)
                }).done(function(data) {
                    //答え配列
                    param.answer = data.answer;
                    //シート配列
                    param.sheet = data.sheet;
                    //生徒配列
                    param.student = data.student;
                    fn.showAnswer();
                    //仮でグラフ固定表示
                    $("img[data='graphBox']").trigger('click');
                });
            },
            showAnswer: function() {
                //クラス人数を記載
                //行数
                var question = [];
                //質問リストを取得
                for (var i = 0; i < param.sheet[0].child.length; i++) {
                    var node = param.sheet[0].child[i];
                    question.push({
                        'que': node.questionText,
                        'id': node.id
                    })
                }
                //質問の取得
                var question = question.filter(function(x, i, self) {
                    return self.indexOf(x) === i;
                });
                //項目リスト利用のため調整
                $('#questionSelector').setOption(
                    (function() {
                        var array = [];
                        array.push({
                            id: 0,
                            name: 'すべて'
                        });
                        for (var i = 0; i < question.length; i++) {
                            array.push({
                                id: question[i].id,
                                name: question[i].que.replace(/<rt>(.+?)\<\/rt>/g, "").replace(/<\/*ru*by*>/g, "").replace(/<br>/g, "")
                                    //name: question[i]
                            });
                        }
                        return array;
                    }())
                );
                //☆☆☆日付のセット
                $('#dateSelect').empty().setOption(fn.getDateList());
                fn.manageDateButton();
                //ユーザリスト
                var userlist = (function() {
                    //ユーザーid list
                    var list = [];
                    for (var i = 0; i < param.answer.length; i++) {
                        var node = param.answer[i];
                        list.push(node.user);
                    }
                    //unique
                    var list = list.filter(function(x, i, self) {
                        return self.indexOf(x) === i;
                    });
                    //make objectArray
                    var array = [];
                    for (var i = 0; i < list.length; i++) {
                        var id = list[i];
                        var node = param.answer.filter(function(item, index) {
                            if (item.user == id) return true;
                        })[0];
                        array.push({
                            id: node.user,
                            name: node.number + '番'
                        })
                    }
                    //sort by student Number
                    array.sort(function(a, b) {
                        if (Number(a.name) < Number(b.name)) return -1;
                        if (Number(a.name) > Number(b.name)) return 1;
                        return 0;
                    });
                    return array;
                })();
                userlist.unshift({
                    id: '-99',
                    name: '----'
                })
                $('#userSelect').empty().setOption(userlist);
                param.datamap = {
                    createUserMap: []
                };
                var $table = $('<table class="allTable"/>');
                //全体リスト
                var $wrap = $('<div class="allTableWrap"/>').append(fn.createFullList($table));
                $('.tableHeader').append($wrap);
                //ユーザリスト
                var userlist = (function() {
                    //id list
                    var list = [];
                    for (var i = 0; i < param.answer.length; i++) {
                        var node = param.answer[i];
                        list.push(node.user);
                    }
                    //unique
                    var list = list.filter(function(x, i, self) {
                        return self.indexOf(x) === i;
                    });
                    //make objectArray
                    var array = [];
                    for (var i = 0; i < list.length; i++) {
                        var id = list[i];
                        var node = param.answer.filter(function(item, index) {
                            if (item.user == id) return true;
                        })[0];
                        array.push({
                            id: node.user,
                            name: node.number
                        })
                    }
                    //sort by student Number
                    array.sort(function(a, b) {
                        if (Number(a.name) < Number(b.name)) return -1;
                        if (Number(a.name) > Number(b.name)) return 1;
                        return 0;
                    });
                    return array;
                })();
                //列数
                var days = comfn.compareDate(param.sheet[0].dateFrom, param.sheet[0].dateTo) + 1;
                // ヘッダ部分
                var baseDate = param.sheet[0].dateFrom;
                for (var k = 0; k < userlist.length; k++) {
                    var user = userlist[k];
                    var $wrap = $('<div class="studentWrap"/>').append(fn.createUserMap($table, user));
                }
                fn.fullTraverse();
            },
            getDateList: function() {
                //id list
                var list = [];
                for (var i = 0; i < param.answer.length; i++) {
                    var node = param.answer[i];
                    list.push(node.date.split(' ')[0]);
                }
                //unique
                var list = list.filter(function(x, i, self) {
                    return self.indexOf(x) === i;
                });
                var array = [];
                for (var i = 0; i < list.length; i++) {
                    array.push({
                        id: list[i],
                        name: list[i]
                    })
                }
                //sort by student Number
                array.sort(function(a, b) {
                    return (a.id < b.id) ? -1 : 1;
                });
                // array.unshift({
                //     id: '9999-99-99',
                //     name: '全期間'
                // })
                return array;
            },
            fullTraverse: function() {
                var counter = 0;
                var days = comfn.compareDate(param.sheet[0].dateFrom, param.sheet[0].dateTo) + 1;
                var dateFormat = new DateFormat("yyyy-MM-dd");
                //質問数ループ
                for (var i = 0; i < param.sheet[0].child.length; i++) {
                    //日数ループ
                    for (var j = 0; j < days; j++) {
                        //fromDate
                        var date = dateFormat.format(comfn.computeDate(param.sheet[0].dateFrom, j));
                        //結果オブジェクト
                        var resultObj = {
                                'sum': 0,
                                'error': [],
                                'warning': []
                            }
                        //全ユーザに対して対象日の対象質問データを走査
                        //datamap createUserMap 
                        //ユーザ分の繰り返し
                        for (var k = 0; k < param.datamap.createUserMap.length; k++) {
                            //ユーザマップの取得（1ユーザ分）
                            var node = param.datamap.createUserMap[k];
                            //ユーザの一つ目の質問を取得
                            var target = node.que[i].ans.filter(function(item, index) {
                                if (item[0] == date) return true;
                            })[0];
                            
                            //答えがどうなっているか
                            if (target[2].result == 0) {
                                //アウト
                                //スリーアウトか？
                                var flag = (function() {
                                    if (j >= 2) {
                                        var pastDate = dateFormat.format(comfn.computeDate(param.sheet[0].dateFrom, j-1));
                                        var pastTarget = node.que[i].ans.filter(function(item, index) {
                                            if (item[0] == pastDate) return true;
                                        })[0]
                                        if (pastTarget[2].result == 0) {
                                            // 一日前もアウト
                                            pastDate = dateFormat.format(comfn.computeDate(param.sheet[0].dateFrom, j - 2));
                                            pastTarget = node.que[i].ans.filter(function(item, index) {
                                                if (item[0] == pastDate) return true;
                                            })[0]
                                            if (pastTarget[2].result == 0) {
                                                //二日前もアウト
                                                return false;
                                            }
                                        }
                                    }
                                    return true;
                                })();
                                if (flag == false) {
                                    // resultObj.warning.push(node.user)
                                    resultObj.error.push(node.user)
                                } else {
                                    //セーフの場合，ワーニングに格納
                                    resultObj.warning.push(node.user)
                                }
                                resultObj.sum++;
                            } else if (target[2].result == 1) {
                                //セーフ
                                resultObj.sum++;
                            } else {
                                //未回答
                            }
                        }
                        //オールテーブルクラスの取得（数字の直入力でやられているため解析困難、はっきり言ってありえない）
                        //☆☆☆データ入力部分
                        var $td = $(".allTable tr").eq(i * 2 + 2).children('td').eq(j + 1);
                        $td.text(resultObj.warning.length || "")
                            .attr('data', resultObj.warning.join(':'))
                            .attr('date', date);
                        if (resultObj.warning.length > 0) {
                            $td.addClass('warning')
                        } else {
                            $(".allTable tr").eq(i * 2 + 1 + 1).children('td').eq(j + 3)
                            $td.addClass('nodata')
                        }
                        $td = $(".allTable tr").eq(i * 2 + 1).children('td').eq(j + 3);
                        $td.text(resultObj.error.length || "")
                            .attr('data', resultObj.error.join(':'))
                            .attr('date', date);
                        if (resultObj.error.length > 0) {
                            $td.addClass('error')
                        } else {
                            $td.addClass('nodata')
                        }
                        $td = $(".allTable tr").eq(i * 2 + 3).children('td').eq(j + 3);
                        /*
                        if (param.student.length-resultObj.sum > 0) {
                        $td.text(param.student.length-resultObj.sum)
                            .attr('data', "all")
                            .attr('date', date);
                        }
                        */
                    }
                }
            },
            createFullList: function($table) {
                //列数
                var days = comfn.compareDate(param.sheet[0].dateFrom, param.sheet[0].dateTo) + 1;
                var baseDate = param.sheet[0].dateFrom;
                //var dateFormat = new DateFormat("yyyy-MM-dd");
                var dateFormat = new DateFormat("MM/dd");
                var $row = "<thead><tr><th>質問</th><th>区分</th>";
                for (var j = 0; j < days; j++) {
                    var date = dateFormat.format(comfn.computeDate(baseDate, j));
                    $row += '<th>' + date + '</th>'
                }
                $row += "</tr></thead>";
                $table.prepend($row);
                //質問数
                //☆☆☆表の外枠作成
                for (var i = 0; i < param.sheet[0].child.length; i++) {
                    //質問取得
                    var node = param.sheet[0].child[i];
                    
                    //1行目
                    $row = "<tr class='errorrow' data='" + (i + 1) + "' questionid='" + node.id + "'>";
                    $row += "<td class='bgltblue bdczero' style='display:none'></td>";
                    //$row += "<td class='bdczero'></td>";
                    $row += '<td class="bgltblue bdb3" rowspan = "2" ><div style="width:260px; font-size:18px;">' + node.questionText + '</div></td>';
                    $row += "<td class='bgltred'><img style='width:20px' src='../common/images/error.png'/></td>";
                    for (var j = 0; j < days; j++) {
                        var date = dateFormat.format(comfn.computeDate(baseDate, j));
                        $row += '<td class="bgltred selectarea">&nbsp;</td>';
                    }
                    $row += "</tr>"
                    $table.append($row);
                    
                    //二行目
                    $row = "<tr class='warningrow' data='" + (i + 1) + "' questionid='" + node.id + "'>";
                    //$row += '<td class="bgltblue bdczero" style="display:none">' + node.id + '</td>';
                    //$row += '<td class="bdczero"><div style="width:260px; font-size:18px;">' + node.questionText + '</div></td>';
                    //$row += '<td class="bdczero"></td>';
                    $row += '<td class="bgltyellow bdb3"><img style="width:20px" src="../common/images/warning.png"/></td>';
                    for (var j = 0; j < days; j++) {
                        $row += '<td class="bgltyellow selectarea bdb3">&nbsp;</td>';
                    }
                    $table.append($row);
                    //三行目
                    /*
                    $row = "<tr class='sumrow' data='" + (i + 1) + "' questionid='" + node.id + "'>";
                    $row += '<td class="bgltblue bdb3" style="display:none">&nbsp;</td>';
                    $row += '<td class="bdb3">&nbsp;</td>';
                    $row += '<td class="bgltblue bdb3" style="font-size:10pt;">未回答数</td>';
                    for (var j = 0; j < days; j++) {
                        $row += '<td class="bgltblue selectarea-all bdb3 sumnum">&nbsp;</td>';
                    }
                    $table.append($row);
                    */
                }
                return $table;
            },
            createUserMap: function($table, user) {
                // //列数
                var days = comfn.compareDate(param.sheet[0].dateFrom, param.sheet[0].dateTo) + 1;
                // // ヘッダ部分
                var baseDate = param.sheet[0].dateFrom;
                var dateFormat = new DateFormat("yyyy-MM-dd");
                //var resultTotal = 0;
                //基礎情報b
                var baseObj = {
                    'user': user.id,
                    'grade': null,
                    'class': null,
                    'sex': null,
                    'number': null,
                    'que': []
                }
                //質問毎の繰り返し
                for (var i = 0; i < param.sheet[0].child.length; i++) {
                    var nodeObj = {
                        'id': null,
                        'ans': []
                    }
                    //質問オブジェクト
                    var node = param.sheet[0].child[i];
                    nodeObj.id = node.id;
                    var resultTotal = 0;
                    //日ごとの繰り返し
                    for (var j = 0; j < days; j++) {
                        //日付
                        var date = dateFormat.format(comfn.computeDate(baseDate, j));
                        //アンサー
                        var answer = param.answer.filter(function(item, index) {
                            if (item.date.indexOf(date) >= 0 && item.question == node.id && item.user == user.id) return true;
                        })[0]
                        if (answer === undefined) {
                            answer = {
                                'answerData': ""
                            };
                        }
                        //datamapに格納
                        //いけてない代入（回答レコード分無駄に代入している）
                        if (answer.sex) {
                            baseObj.sex = answer.sex;
                        }
                        if (answer.grade) {
                            baseObj.grade = answer.grade;
                        }
                        if (answer["class"]) {
                            baseObj["class"] = answer["class"];
                        }
                        if (answer.number) {
                            baseObj.number = answer.number;
                        }
                        
                        //☆☆☆ここが問題（帰り値がundefinedになっている）
                        var res = comfn.createAnswerText(answer, param.sheet[0].child[i]);
                        nodeObj.ans.push([date, answer.answerData, res])
                    }
                    baseObj.que.push(nodeObj);
                }
                param.datamap.createUserMap.push(baseObj);
            },
            dispGraph: function($this) {
                var questionId = $this.parent().attr('questionId');
                var targetName = $this.parent().attr('class');
                var userArray = $this.attr('data').split(':');
                var targetdate = $this.attr('date');
                if (targetName == "warningrow") {
                    // 日付毎シートに遷移，該当者のみ表示される
                    $('#questionSelector').val(questionId);
                    $('#dateSelect').val(targetdate);
                    $("#navigation_tab > span[data='graphBox']").trigger('click', [userArray])
                } else if (targetName == "errorrow") {
                    // 実施全期間シートへ遷移，該当者のみ表示される
                    $('#questionSelector').val(questionId);
                    $("#navigation_tab > span[data='graphBox_all']").trigger('click', [userArray])
                }
            },
            createUserArea: function($this) {
                $('.student').remove();
                var questionId = $this.parent().attr('data');
                var targetName = $this.parent().attr('class');
                var userArray = $this.attr('data').split(':');
                var targetdate = $this.attr('date');
                // //表示するべきデータが無かったらスルー
                if (userArray.length == 1 && userArray[0] == "") return;
                $('.studentWrap').remove();
                //列数
                var days = comfn.compareDate(param.sheet[0].dateFrom, param.sheet[0].dateTo) + 1;
                ///////////////// ヘッダ部分
                var baseDate = param.sheet[0].dateFrom;
                var $baseTable = $('<div class="studentWrap"/>');
                ///////////////// 実データ部分
                var $table = $('<table class="student"/>');
                var $row = "<thead><tr><th>区分</th><th>出席番号</th>";
                var dateFormat = new DateFormat("MM/dd");
                for (var j = 0; j < days; j++) {
                    var date = dateFormat.format(comfn.computeDate(baseDate, j));
                    $row += '<th>' + date + '</th>'
                }
                $row += "</tr></thead></table>";
                $table.append($row);
                alert("check");
                //質問毎の繰り返し
                for (var i = 0; i < param.datamap.createUserMap.length; i++) {
                    var node = param.datamap.createUserMap[i];
                    if ($.inArray(node.user, userArray) == -1 && targetName != "sumrow") {
                        continue;
                    }
                    var targetAnswer = node.que[questionId - 1].ans.filter(function(item, index) {
                        if (item[0] == targetdate) return true;
                    })[0];
                    // if(targetName=="sumrow"){
                    //     //未回答は表示しない予定！
                    //     if(targetAnswer[2].result=='-1'){
                    //         continue;
                    //     }   
                    // }
                    $table.append((function() {
                        var insertText = "";
                        if ($table.children('tbody').children('tr').length == 0) {
                            if (targetName == "warningrow") {
                                insertText = '<div><img  style="vertical-align: middle;width:30px" src="../common/images/warning.png">&nbsp;&nbsp;様子を見る</div>'
                            } else if (targetName == "sumrow") {
                                insertText = "全員"
                            } else if (targetName == "errorrow") {
                                insertText = '<div><img  style="vertical-align: middle;width:30px" src="../common/images/error.png">&nbsp;&nbsp;声かけ必要</div>'
                            }
                        }
                        var $row = "<tr><td class='bdczero'>" + insertText + "</td><td>" + node.number + "</td>";
                        for (var j = 0; j < node.que[questionId - 1].ans.length; j++) {
                            var childNode = node.que[questionId - 1].ans[j];
                            var insertClass = "";
                            if (childNode[0] == targetdate) {
                                insertClass = "bgltred";
                            }
                            if (childNode[2].result == 0) {
                                insertClass += " orange";
                            }
                            $row += "<td class='" + insertClass + "'>" + childNode[2].answer + "</td>";
                        }
                        $row += "</tr>";
                        return $row;
                    })());
                }
                $baseTable.append($table);
                $('.tableHeader').append($baseTable);
                var noWidth = $('.allTable thead tr th').eq(0).outerWidth();
                (function() {
                    $('.allTable thead tr th').css('background-color', 'white');
                    $('.student thead tr th').css('background-color', 'white');
                    var basewidth = 0;
                    for (var i = 1; i < $('.allTable thead tr th').length; i++) {
                        var $allTable_column = $('.allTable thead tr th').eq(i);
                        var $studentTable_column = $('.student thead tr th').eq(i - 1);
                        $allTable_column.css('background-color', 'red');
                        $studentTable_column.css('background-color', 'green');
                        var $allTable_width = $allTable_column.outerWidth();
                        var $studentTable_width = $studentTable_column.outerWidth();
                        // $allTable_column.css('width',"")
                        // $studentTable_column.css('width',"")  
                        if (i == $('.allTable thead tr th').length - 1) {
                            //最後はスクロールの関係で狭い方に合わせる
                            if ($allTable_width > $studentTable_width) {
                                $allTable_column.outerWidth($studentTable_width)
                                $studentTable_column.outerWidth($studentTable_width)
                                basewidth += $studentTable_width;
                            } else {
                                $studentTable_column.outerWidth($allTable_width)
                                $allTable_column.outerWidth($allTable_width)
                                basewidth += $allTable_width;
                            }
                        } else {
                            if ($allTable_width < $studentTable_width) {
                                $allTable_column.outerWidth($studentTable_width)
                                $studentTable_column.outerWidth($studentTable_width)
                                basewidth += $studentTable_width;
                            } else {
                                $studentTable_column.outerWidth($allTable_width)
                                $allTable_column.outerWidth($allTable_width)
                                basewidth += $allTable_width;
                            }
                        }
                    }
                    // $('.student').css('width',basewidth);
                })();
                var position = $('.studentWrap').offset();
                $('.studentWrap').css('height', $(window).height() - position.top - 50)
                $('.studentWrap').css('padding-left', noWidth);
                $('.allTable').outerWidth($('.student').outerWidth() + noWidth);
                return;
            },
            manageResultDisp: function($this) {
                var status = $this.val();
                if (status == 0) {
                    $('table.allTable tr').show();
                    $('table.student tr').show();
                    //$("table.student thead").show();
                    $("table.student tbody tr td").off('click')
                    $("table.student tbody tr td").removeClass('pointer')
                } else {
                    $("table.allTable tbody tr[questionid='" + status + "']").show();
                    $("table.allTable tbody tr[questionid!='" + status + "']").hide();
                    //$("table.student thead").hide();
                    $("table.student tbody tr[questionid='" + status + "']").show();
                    $("table.student tbody tr[questionid!='" + status + "']").hide();
                    $("table.student tbody tr td").addClass('pointer')
                }
            },
            manageDateButton: function() {
                var activeModule = $("#navigation_tab > span[switch='on']").attr('data');
                if (activeModule == 'graphBox') {
                    $('#dateselect_area').show();
                    $('#prevNum,#nextNum').show();
                    $('#userSelect').val('-99')
                    $('#userFilter').hide();
                } else if (activeModule == 'graphBox_all') {
                    $('#dateselect_area').hide();
                    $('#prevNum,#nextNum').hide();
                    $('#userFilter').show();
                }
            },
            tabManage: function($this, target) {
                var page = $this.attr('data');
                $this.css('color', 'yellow').attr('switch', 'on');
                $("#navigation_tab > span").not($this).css('color', 'white').attr('switch', 'off');
                $('#outputArea').children('div#' + page).show();
                if (page == 'graphBox_all') {
                    $('#outputArea').children('div#graphBox').show();
                    $('#outputArea').children('div').not('#graphBox').hide();
                } else {
                    $('#outputArea').children('div#' + page).show();
                    $('#outputArea').children('div').not('#' + page).hide();
                }
                fn.manageDateButton();
                $('#outputArea').children('div#' + page).fadeIn('fast');
                if (page == 'kakuninBox') {
                    $('#-ccchart-css-hybrid').hide();
                    $("#averageFilter").hide();
                    $('#questionSelector option[value=-1]').remove();
                    if (!$('#questionSelector option[value=0]')[0]) {
                        $('#questionSelector').prepend($("<option>").val("0").text("すべて"));
                    }
                } else if (page == 'graphBox') {
                    $('#-ccchart-css-hybrid').show();
                    $("#averageFilter").show();
                    $('#questionSelector option[value=0]').remove();
                    if (!$('#questionSelector option[value=-1]')[0]) {
                        $('#questionSelector').prepend($("<option>").val("-1").text("睡眠時間はどのくらいですか"));
                    }
                    fn.averageData(false, target);
                    //fn.createChart();
                } else {
                    //allflag
                    $('#-ccchart-css-hybrid').show();
                    $("#averageFilter").show();
                    $('#questionSelector option[value=0]').remove();
                    if (!$('#questionSelector option[value=-1]')[0]) {
                        $('#questionSelector').prepend($("<option>").val("-1").text("睡眠時間はどのくらいですか"));
                    }
                    fn.averageData(true, target);
                }
            },

            isNumber: function(x) {
                if (typeof(x) != 'number' && typeof(x) != 'string')
                    return false;
                else
                    return (x == parseFloat(x) && isFinite(x));
            }
        }
        //events
    $(document)
        .on('click', '.allTable thead', function() {
            if ($('.studentWrap').eq(0).is(':visible')) {
                $('.studentWrap').fadeOut();
            } else {
                $('.studentWrap').fadeIn();
            }
        }).on('change', '#questionSelector', function() {
            fn.manageResultDisp($(this));
        }).on('click', "#navigation_tab > span", function(event, target) {
            fn.tabManage($(this), target);
        }).on('change', '#questionSelector, #chartType, input[name="gradeAve"], input[name="classAve"], input[name="sexAve"]', function() {
            if ($('#graphBox').is(':visible')) {
                var activeModule = $("#navigation_tab > span[switch='on']").attr('data');
                if (activeModule == 'graphBox') {
                    fn.averageData(false);
                } else if (activeModule == 'graphBox_all') {
                    fn.averageData(true);
                }
            }
            //fn.createChart();
        }).on("click", "#dispGraph", function() {
            var activeModule = $("#navigation_tab > span[switch='on']").attr('data');
            if (activeModule == 'graphBox') {
                fn.averageData(false);
            } else if (activeModule == 'graphBox_all') {
                fn.averageData(true);
            }
        }).on("click", "#nextNum", function() {
            var $ele = $("#dateSelect"),
                num = $ele.prop("selectedIndex");
            if (num < $ele.children().length - 1) {
                $ele.prop("selectedIndex", num + 1);
                // fn.averageData();
            }
        }).on("click", "#prevNum", function() {
            var $ele = $("#dateSelect"),
                num = $ele.prop("selectedIndex");
            if (num > 0) {
                $ele.prop("selectedIndex", num - 1);
                // fn.averageData();
            }
        }).on('change', '#dateSelect', function() {
            fn.manageDateButton();
        }).on("click", '.selectarea,.selectarea-all', function() {
            // fn.createUserArea($(this));
            fn.dispGraph($(this));
        }).on("click", '.-ccchart-css-arc', function() {
            var dispname = $(this).attr('data-y');
            var id;
            $('#userSelect option').each(function() {
                if ($(this).text() == dispname) {
                    id = $(this).val()
                }
            })
            $("#navigation_tab > span[data='graphBox_all']").trigger('click', [
                [id]
            ])
        });
    // run
    fn.init();
});