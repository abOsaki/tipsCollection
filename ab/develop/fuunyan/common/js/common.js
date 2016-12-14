//questionAnswerObject
function questionAnswer(pvRow){
    this.id = pvRow.id;
    this.answerType = pvRow.answerType;
    this.answerKind = pvRow.answerKind;
    this.index = pvRow.index;
    this.value = pvRow.value;
    this.result = pvRow.result;
    this.answerHTML = pvRow.answerHTML;
    this.answerText = pvRow.answerText;
    this.stamp = pvRow.stamp;
    cvThis = this;
    this.getAnserObject = function(){
        return getAnserObject();
    }
    this.getAnswerHTML = function(){
        return getAnswerHTML();
    }
    return this;
    
    var cvThis;
    
    function getAnserObject(){
        return {
            answer : cvThis.answerText,
            result : cvThis.result,
            stamp : cvThis.stamp
        }
    }
    
    function getAnswerHTML(){
        var value = cvThis.value;
        
        var beforeTag = '<label><input type="radio" name="' + cvThis.answerType+'_'+cvThis.answerType + '_value" value=' + value + '>';
        var contentTag = cvThis.answerHTML;
        var afterTag = '</label>'
        var result = beforeTag + contentTag + afterTag;
        return result;
    }
}
var questionAnswers = [];

function getQuestionAnswerForPrintData(pvAnswerType,pvAnswer){
    //アンサーの取得
    var answers = getQuestionAnswersForPrintTable(pvAnswerType);
    //アンサーの繰り返し
    for(var i = 0; i < answers.length; i++){
        var answer = answers[i];
        if(answer.isSatisfy(pvAnswer)){
            return answer;
        }
    }
}

function getQuestionAnswersForPrintTable(pvAnserType){
    if(pvAnserType == 1){
        return getSleepTimeQuestionAnswersForPrintTable();
    }else if(pvAnserType == 2){
        return getWakeupTimeQuestionAnswersForPrintTable();
    }
    //該当のアンサータイプのものを取得
    var gaitoQuestionAnswers = getQuestionAnswerByAnswerType(pvAnserType);
    
    var result = [];
    for(var i = 0; i < gaitoQuestionAnswers.length; i++){
        var questionAnswer = gaitoQuestionAnswers[i];
        if(questionAnswer.value == 2){
            var verygood = {
                type : 'verygood',
                value : 2,
                text : questionAnswer.answerText,
                stamp : 'url(../common/images/stamp/fine5color.png)',
                backgroundColor : 'rgb(217,229,255)',
                isSatisfy : function(pvAnswerData){
                    return (pvAnswerData == 2);
                },
                getContent : function(pvAnswerData){
                    return '◎';
                }
            }
            result.push(verygood);
        }else if(questionAnswer.value == 1){
            var good = {
                type : 'good',
                value : 1,
                text : questionAnswer.answerText,
                stamp : 'url(../common/images/stamp/fine2color.png)',
                backgroundColor : 'rgb(255,255,153)',
                isSatisfy : function(pvAnswerData){
                    return (pvAnswerData == 1);
                },
                getContent : function(pvAnswerData){
                    return '○';
                }
            };
            result.push(good);
        }else if(questionAnswer.value == 0){
            var bad = {
                type : 'bad',
                value : 0,
                text : questionAnswer.answerText,
                stamp : 'url(../common/images/stamp/fine1color.png)',
                backgroundColor : 'rgb(255,204,204)',
                isSatisfy : function(pvAnswerData){
                    return (pvAnswerData == 0);
                },
                getContent : function(pvAnswerData){
                    return '×';
                }
            };
            result.push(bad);
        }
    }
    
    result.sort(function(a,b){
        if( a.value > b.value ) return -1;
        if( a.value < b.value ) return 1;
        return 0;
    });
    
    return result;
}

function getSleepTimeQuestionAnswersForPrintTable(){
    var result = [];
    var verygood = {
        type : 'verygood',
        text : '夜7時～10時',
        stamp : 'url(../common/images/stamp/fine5color.png)',
        backgroundColor : 'rgb(217,229,255)',
        isSatisfy : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
                var hour = answerData[0] * 100;
                var minutes = answerData[1] * 1;
                var hourMinutes = hour + minutes;
                return (hourMinutes < 2300);
            }
            return false;
        },
        getContent : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
//                var hour = answerData[0] * 100;
//                var minutes = answerData[1] * 1;
//                var hourMinutes = hour + minutes;
                return answerData[0];
            }
            return '◎';
        }
        
    };
    result.push(verygood);
    
    var good = {
        type : 'good',
        text : '夜11時～12時',
        stamp : 'url(../common/images/stamp/fine2color.png)',
        backgroundColor : 'rgb(255,255,153)',
        isSatisfy : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
                var hour = answerData[0] * 100;
                var minutes = answerData[1] * 1;
                var hourMinutes = hour + minutes;
                return (hourMinutes < 2400);
            }
            return false;
        },
        getContent : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
//                var hour = answerData[0] * 100;
//                var minutes = answerData[1] * 1;
//                var hourMinutes = hour + minutes;
                return answerData[0];
            }
            return '○';
        }
    };
    result.push(good);
    
    var bad = {
        type : 'bad',
        text : '夜12時～',
        stamp : 'url(../common/images/stamp/fine1color.png)',
        backgroundColor : 'rgb(255,204,204)',
        isSatisfy : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length == 2){
                var hour = answerData[0] * 100;
                var minutes = answerData[1] * 1;
                var hourMinutes = hour + minutes;
                return (hourMinutes >= 2400);
            }
            return false;
        },
        getContent : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length == 2){
//                var hour = answerData[0] * 100;
//                var minutes = answerData[1] * 1;
//                var hourMinutes = hour + minutes;
                return answerData[0];
            }
            return '×';
        }
    };
    result.push(bad);
    
    return result;
}

function getWakeupTimeQuestionAnswersForPrintTable(){
    var result = [];
    var verygood = {
        type : 'verygood',
        text : '朝4時～7時',
        stamp : 'url(../common/images/stamp/fine5color.png)',
        backgroundColor : 'rgb(217,229,255)',
        isSatisfy : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
                var hour = answerData[0] * 100;
                var minutes = answerData[1] * 1;
                var hourMinutes = hour + minutes;
                return (hourMinutes < 800);
            }
            return false;
        },
        getContent : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length == 2){
//                var hour = answerData[0] * 100;
//                var minutes = answerData[1] * 1;
//                var hourMinutes = hour + minutes;
                return answerData[0];
            }
            return '◎';
        }
    };
    result.push(verygood);
    
    var good = {
        type : 'good',
        text : '朝8時～9時',
        stamp : 'url(../common/images/stamp/fine2color.png)',
        backgroundColor : 'rgb(255,255,153)',
        isSatisfy : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
                var hour = answerData[0] * 100;
                var minutes = answerData[1] * 1;
                var hourMinutes = hour + minutes;
                return (hourMinutes < 1000);
            }
            return false;
        },
        getContent : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length == 2){
//                var hour = answerData[0] * 100;
//                var minutes = answerData[1] * 1;
//                var hourMinutes = hour + minutes;
                return answerData[0];
            }
            return '○';
        }
    };
    result.push(good);
    
    var bad = {
        type : 'bad',
        text : '朝10時～',
        stamp : 'url(../common/images/stamp/fine1color.png)',
        backgroundColor : 'rgb(255,204,204)',
        isSatisfy : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length ==2){
                var hour = answerData[0] * 100;
                var minutes = answerData[1] * 1;
                var hourMinutes = hour + minutes;
                return (hourMinutes >= 1000);
            }
            return false;
        },
        getContent : function(pvAnswerData){
            var answerData = pvAnswerData.split(",");
            
            if(answerData.length == 2){
//                var hour = answerData[0] * 100;
//                var minutes = answerData[1] * 1;
//                var hourMinutes = hour + minutes;
                return answerData[0];
            }
            return '×';
        }
    };
    result.push(bad);
    
    return result;
}

function getQuestionAnswerHtmlByAnswerType(pvAnserType){
    if(pvAnserType < 3){
        return getDateAnswerHtml(pvAnserType);
    }
    
    //該当のアンサータイプのものを取得
    var gaitoQuestionAnswers = getQuestionAnswerByAnswerType(pvAnserType);
    
    //該当アンサータイプからHTMLを作成する
    return getQuestionAnswerHtmlByQuestionAnswerArray(gaitoQuestionAnswers);
}

function getQuestionAnswerByAnswerType(pvAnserType){
    var result = [];
    for(var i = 0; i < questionAnswers.length; i++){
        var taisho = questionAnswers[i];
        if(taisho.answerType == pvAnserType){
            result.push(taisho);
        }
    }
    return result;
}

function getQuestionAnswerHtmlByQuestionAnswerArray(pvQuestionAnswers){
    var result = "";
    for(var i = 0; i < pvQuestionAnswers.length; i++){
        var taisho = pvQuestionAnswers[i];
        
        result += taisho.getAnswerHTML();
    }
    return result;
}

function getDateAnswerHtml(pvAnserType){
    if (pvAnserType == 1) {
        var $hour = (function () {
            var $dom, i,
                array = [
                    {
                        'name': '--',
                        'value': ''
                    },
                    {
                        'name': '午後(よる)7',
                        'value': '19'
                    },
                    {
                        'name': '午後(よる)8',
                        'value': '20'
                    },
                    {
                        'name': '午後(よる)9',
                        'value': '21'
                    },
                    {
                        'name': '午後(よる)10',
                        'value': '22'
                    },
                    {
                        'name': '午後(よる)11',
                        'value': '23'
                    },
                    {
                        'name': '午前(よなか)0',
                        'value': '24'
                    },
                    {
                        'name': '午前(よなか)1',
                        'value': '25'
                    },
                    {
                        'name': '午前(よなか)2',
                        'value': '26'
                    },
                    {
                        'name': '午前(よなか)3',
                        'value': '27'
                    }
                ];
                $dom = $('<select />', {
                    'class': 'hour'
            });
            for (f = 0; f < array.length; f += 1) {
                $dom.append("<option value='" + array[f].value + "'>" + array[f].name + "</option>");
            }
            var $wrap = $('<label/>', {
            'class': 'select'
            }).append($dom)
            return $wrap;
        }());
        var $minute = comfn.getMinute();
        var result = '';
        result +=
            $hour.get(0).outerHTML + '<ruby><rb>時</rb><rt>じ</rt></ruby>' +
            $minute.get(0).outerHTML + '<ruby><rb>分</rb><rt>ふん</rt></ruby>';
        } else {
            $hour = (function () {
                var $dom, i,
                array = [
                    {
                        'name': '--',
                        'value': ''
                    },
                    {
                        'name': '午前(あさ)4',
                        'value': '4'
                    },
                    {
                        'name': '午前(あさ)5',
                        'value': '5'
                    },
                    {
                        'name': '午前(あさ)6',
                        'value': '6'
                    },
                    {
                        'name': '午前(あさ)7',
                        'value': '7'
                    },
                    {
                        'name': '午前(あさ)8',
                        'value': '8'
                    },
                    {
                        'name': '午前(あさ)9',
                        'value': '9'
                    },
                    {
                        'name': '午前(あさ)10',
                        'value': '10'
                    },
                    {
                        'name': '午前(あさ)11',
                        'value': '11'
                    },
                    {
                        'name': '午後(ごご)12',
                        'value': '12'
                    }
                ];
            $dom = $('<select />', {
            'class': 'hour'
            });
        for (i = 0; i < array.length; i += 1) {
            $dom.append("<option value='" + array[i].value + "'>" + array[i].name + "</option>");
            }
            var $wrap = $('<label/>', {
                'class': 'select'
            }).append($dom)

            return $wrap;
    })();
    $minute = comfn.getMinute();
    result = '';
    result +=
        $hour.get(0).outerHTML + '<ruby><rb>時</rb><rt>じ</rt></ruby>' +
        $minute.get(0).outerHTML + '<ruby><rb>分</rb><rt>ふん</rt></ruby>';
    }
    return result;
}

function getQuestionAnswerObj(pvAnserType,pvAnswerData){
    
    if (pvAnswerData == "") {
        return {
            answer: '',
            'result': -1,
            stamp: ''
        };
    }
    
    if(pvAnserType < 3){
        return getQuestionAnswerTimeObj(pvAnserType,pvAnswerData);
    }
    
    for(var i = 0; i < questionAnswers.length; i++){
        var taisho = questionAnswers[i];
        if((taisho.answerType == pvAnserType) && (taisho.value == parseInt(pvAnswerData))){
            //ここでオブジェクトを返す
            return taisho.getAnserObject();
        }
    }
    throw new Error('未定義のanswerTypeです answerType : ' + Number(pvAnserType) + 'answerData : ' + pvAnswerData);
}

function getQuestionAnswerTimeObj(pvAnserType,pvAnswerData){
    if (Number(pvAnserType) === 1) {
        //何時何分
        node = pvAnswerData.split(',');
        result = 1;
        stamp = 'sleep1color.png';
        if (node[0] >= 23) {
            result = 0;
            stamp = 'sleep5color.png';
        }
        return {
            answer: node[0] + '時' + node[1] + '分',
            'result': result,
            stamp: stamp
        };
    } else if (Number(pvAnserType) === 2) {
        //何時何分
        node = pvAnswerData.split(',');
        stamp = 'sleep1color.png';
        result = 1;
        if (node[0] >= 8) {
            result = 0;
            stamp = 'sleep5color.png';
        }
        return {
            answer: node[0] + '時' + node[1] + '分',
            'result': result,
            stamp: stamp
        };
    }
}

function setQuestionAnswer(pvCallback){
    //データベースから読み込みを行う
    var sendData = {
        'command': 'getQuestionAnswer'
    };
    $.ajax({
        url: '../common/php/act.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
        error: function(e){
            
        },
        success: function(e){
            
        }
    }).done(function (data) {
        answerDataRecieved(data,pvCallback);
    });
}

function questionObj(pvRow){
    this.id = pvRow.id;
    this.questionText = pvRow.questionText;
    this.answerType = pvRow.answerType;
    this.graphType = pvRow.graphType;
    this.graphMinValue = pvRow.graphMinValue;
    this.graphMaxValue = pvRow.graphMaxValue;
    this.graphMokuhyoValue = pvRow.graphMokuhyoValue;
    this.graphCantionValue = pvRow.graphCantionValue;
    
    this.getGraphMaxValue = function(){
        return getGraphMaxValue();
    };
    
    this.getGraphMinValue = function(){
        return getGraphMinValue();
    };
    
    this.getThisAnswers = function (){
        return getThisAnswers();
    };
    
    this.getGraphCautionValue = function (){
        return getGraphCautionValue();
    };
    
    this.getGraphMokuhyoValue = function(){
        return getGraphMokuhyoValue();
    };
    
//    this.isMokuhyoValid = function(){
//        return isMokuhyoValid();
//    };
//    
//    this.isCautionValid = function(){
//        return isCautionValid();
//    };
    
    cvThis = this;
    return this;
    
    var cvThis;
    
    function getThisAnswers(){
        var result = [];
        result = getQuestionAnswerByAnswerType(cvThis.answerType);
        return result;
    }
    
    function getGraphMaxValue(){
        if(cvThis.graphMaxValue){
            return parseInt(cvThis.graphMaxValue);
        }else{
            return 4;
        }
    }
    
    function getGraphMinValue(){
        if(cvThis.graphMinValue){
            return parseInt(cvThis.graphMinValue);
        }else{
            return -2;
        }
    }
    
    function getGraphCautionValue(){
        if(cvThis.graphCantionValue){
            return parseInt(cvThis.graphCantionValue);
        }else{
            return 0;
        }
        
    }
    
    function getGraphMokuhyoValue(){
        if(cvThis.graphMokuhyoValue){
            return parseInt(cvThis.graphMokuhyoValue);
        }else{
            return 2;
        }
    }
    
//    function isCautionValid(){
//        return cvThis.graphCantionValue;
//    }
//    
//    function isMokuhyoValid(){
//        return cvThis.graphMokuhyoValue;
//    }
}

function answerDataRecieved(pvData,pvCallback){
    for(var i = 0; i < pvData.length; i++){
        var row = pvData[i];
        var qaObj = new questionAnswer(row);
        questionAnswers.push(qaObj);
    }
    pvCallback();
}

function setQuestion(pvCallback){
    //データベースから読み込みを行う
    var sendData = {
        'command' : 'getQuestion'
    };
    $.ajax({
        url: '../common/php/act.php',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(sendData),
        error: function(e){
            
        },
        success: function(e){
            
        }
    }).done(function (data) {
        questionDataRecieved(data,pvCallback);
    });
}

var questions = [];
function questionDataRecieved(pvData,pvCallback){
    for(var i = 0; i < pvData.length; i++){
        var row = pvData[i];
        var qObj = new questionObj(row);
        questions.push(qObj);
    }
    pvCallback();
}

function getGraphConfigFromQuestionID(pvQuestionID){
    
    if(pvQuestionID == "-1"){
        return getGraphConfigSuiminJikan();
    }
    
    //クエッションを取得
    var question;
    for(var i = 0; i < questions.length; i++){
        var taisho = questions[i];
        if(taisho.id == pvQuestionID){
            question = taisho;
            break;
        }
    }
    
    var answerType = question.answerType;
    //アンサータイプ分岐
    if(answerType == 1){
        return getGraphConfigSleepTime();
    }
    
    if(answerType == 2){
        return getGraphConfigWakeupTime();
    }
    
    //アンサーズからグラフコンフィグを取得する
    return getGraphConfigFromQuestion(question);
}

function getGraphConfigSuiminJikan(){
    return {
        chartDataType : 'sleep',
        memo : "睡眠時間（目標：8時間）",
        unit : "時間",
        maxY : 16,
        minY : 4,
        axisXLen : 6,
        xLines : [{
            "val": 8,
            "color": "aqua",
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
    }
}

function getGraphConfigSleepTime(){
    return {
        chartDataType : 'sleep',
        memo : "昨日は、何時に寝ましたか（目標：２１時）",
        unit : "時間",
        maxY : 28,
        minY : 16,
        axisXLen : 6,
        xLines : [{
            "val": 21,
            "color": "aqua",
            "width": 5,
            //"fillOver": "rgba(0,215,0,0.3)",
            "text": '目標：21時',
            "font": "15px Arial"
        }, {
            "val": 23,
            "color": "red",
            "width": 5,
            //"fillUnder": "rgba(255,0,0,0.3)",
            "text": '注意：23時',
            "font": "15px Arial"
        }],
        yAxisVal : ["16時","18時", "20時", "22時", "0時", "2時", "4時"]
    }
}

function getGraphConfigWakeupTime(){
    return {
        chartDataType : 'sleep',
        memo : "今日は、何時に起きましたか（目標：６時）",
        unit : "時間",
        maxY : 14,
        minY : 2,
        axisXLen : 6,
        xLines : [{
            "val": 6,
            "color": "aqua",
            "width": 5,
            //"fillOver": "rgba(0,215,0,0.3)",
            "text": '目標：6時',
            "font": "15px Arial"
        }, {
            "val": 8,
            "color": "red",
            "width": 5,
            //"fillUnder": "rgba(255,0,0,0.3)",
            "text": '注意：8時',
            "font": "15px Arial"
        }],
        yAxisVal : ["2時", "4時", "6時", "8時", "10時", "12時", "14時"]
    }
}

function getGraphConfigFromQuestion(pvQuestion){
    //アンサーの取得
    var answers = pvQuestion.getThisAnswers();
    
    //答えの数２つ
    if(answers.length == 2){
        return getGraphConfigFromQuestion2Answer(pvQuestion);
    }
    
    //答えの数３つ
    if(answers.length == 3){
        return getGraphConfigFromQuestion3Answer(pvQuestion);
    }
    
    throw new Error('未定義の答えの数です。questionAnswerTableのanswerType' + pvQuestion.answerType + 'を確認してください  ' + '答えの数: ' + answers.length);
}

function getGraphConfigFromQuestion2Answer(pvQuestion){
    //アンサーの取得
    var answers = pvQuestion.getThisAnswers();
    //valueで並び替え（降順ソート）
    answers.sort(function(a,b){
        if(a.value > b.value) return -1;
        if(a.value < b.value) return 1;
    });
    
    var unit = "";
    
    for(var i = 0; i < answers.length; i++){
        var answer = answers[i];
        var answerText = answer.index + ":" + answer.answerText + " ";
        unit += answerText;
    }
    
    var yAxisVal = [" "," ",answers[1].answerText,  answers[0].answerText, " ", " ", " "];
    
    return {
        chartDataType : 'stage',
        memo : pvQuestion.questionText,
        unit : unit,
        maxY : 2,
        minY : -2,
        axisXLen : 4,
        yAxisVal : yAxisVal
    }
}


function getGraphConfigFromQuestion3Answer(pvQuestion){
    //アンサーの取得
    var answers = pvQuestion.getThisAnswers();
    //valueで並び替え（降順ソート）
    answers.sort(function(a,b){
        if(a.value > b.value) return -1;
        if(a.value < b.value) return 1;
    });
    
    var unit = "";
    
    for(var i = 0; i < answers.length; i++){
        var answer = answers[i];
        var answerText = answer.index + ":" + answer.answerText + " ";
        unit += answerText;
    }
    
    
    //目標値
    var mokuhyoValue = pvQuestion.getGraphMokuhyoValue();
    
    //注意値
    var cautionValue = pvQuestion.getGraphCautionValue();
    
    var mokuhyoCaution = [];
    
    //目標が有効であれば目標オブジェクトを取得する
    if(pvQuestion.graphMokuhyoValue){
        var mokuhyoAnswer = answers[0];
        //目標オブジェクト
        var mokuhyoObj = {
            "val": mokuhyoValue,
            "color": "aqua",
            "width": 5,
            //"fillOver": "rgba(0,215,0,0.3)",
            //"text": '目標：' + mokuhyoAnswer.answerText,
            "text": '目標', // + mokuhyoAnswer.answerText,
            "font": "15px Arial"
        };
        mokuhyoCaution.push(mokuhyoObj);
    }
    
    
    //注意が有効であれば注意オブジェクトを取得する
    if(pvQuestion.graphCantionValue){
        var cautionAnswer = answers[2];
        //注意オブジェクト
        var cautionObj = {
            "val": cautionValue,
            "color": "red",
            "width": 5,
            //"fillUnder": "rgba(255,0,0,0.3)",
            //"text": '注意：' + cautionAnswer.answerText,
            "text": '注意',// + cautionAnswer.answerText,
            "font": "15px Arial"
        };
        mokuhyoCaution.push(cautionObj);
    }
    
    
    //var yAxisVal = [" "," ",answers[2].answerText,  answers[1].answerText,  answers[0].answerText, " ", " "];
    
    var max = pvQuestion.getGraphMaxValue();
    var min = pvQuestion.getGraphMinValue();
    
    var yAxisVal = [];
    for(var i = min; i < max; i++){
        
        var check = answers.some(function(a){
            return (a.value == i);
        });
        if(check){
            for(var j =0; j < answers.length; j++){
                var answer = answers[j];
                if(answer.value == i){
                    var text = answer.answerText;
                    yAxisVal.push(text);
                }
            }
        }else{
            yAxisVal.push(" ");
        }
    }
    
    return {
        chartDataType : 'stage',
        memo : pvQuestion.questionText,
        unit : unit,
        maxY : max,
        minY : min,
        axisXLen : 6,
        xLines : mokuhyoCaution,
        yAxisVal : yAxisVal
    }
}


/*global $, console, alert*/
//common_parameter
var param = {};
//definition

//生徒情報
function studentInfo(){
    var prefix = param.status.GROUP === "1" ? 'E' : 'H';
    this.group = param.status.GROUP;
    this.grade = param.status['GRADE' + prefix] + "年";
    this.kumi = param.status['CLASS' + prefix] + "組";
    this.number = param.status.NUMBER + "番";
    this.getDisplay = function(){
        return this.grade + this.kumi + this.number;
    };
    return this;
};

//日付情報
function dateInfo(date){
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.displayYear = ("0" + date.getFullYear()).slice(-4);
    this.displayMonth = ("0" + (date.getMonth() + 1)).slice(-2);
    this.displayDate = ("0" + date.getDate()).slice(-2);
    this.originDate = date;
    var youbis = [
                    "日",
                    "月",
                    "火",
                    "水",
                    "木",
                    "金",
                    "土"
                ];
    var youbi = youbis[date.getDay()];
    this.getCalenderValue = function(){
        return this.displayYear + "年" + this.displayMonth + "月" + this.displayDate + "日" + "(" + youbi + ")";
    };
    this.getToString = function(){
        return (this.displayYear + '-' + this.displayMonth + '-' + this.displayDate);
    };
    return this;
};

var comfn = (function () {
    
    return {
        //セッションストレージへのアクセスを行う。
        SS: {
            get: function (key) {
                return JSON.parse(sessionStorage.getItem(key));
            },
            set: function (key, value) {
                sessionStorage.setItem(key, JSON.stringify(value));
            },
            getName: function (key, value) {
                var list = JSON.parse(sessionStorage.getItem(key)),
                    result = list.filter(function (item, index) {
                        // console.log("COM17", typeof (item.id), typeof (value));
                        if (item.id == value) {
                            return true;
                        }
                    })[0];
                if (result) {
                    return result.name;
                } else {
                    return "----";
                }
            }
        },
        getGroup : function(){
            var info = new studentInfo();
            return info.group;
        },
        getStudentInfo: function(){
            var info = new studentInfo();
            var result = info.getDisplay();
            return result;
        },
        getTodayDate: function(){
            var date = new Date();
            var result = new dateInfo(date);
            return result;
        },
        //xx年xx月xx日xx年xx組xx番を生成する
        setInfo: function ($target) {
            var myTbl = [],
                setInfo = "",
                myD = new Date(),
                myYear = myD.getFullYear(),
                myMonth = myD.getMonth() + 1,
                myDate = myD.getDate(),
                myDay = myD.getDay(),
                prefix = param.status.GROUP === "1" ? 'E' : 'H',
                grade = param.status['GRADE' + prefix],
                classfie = param.status['CLASS' + prefix],
                number = param.status.NUMBER;
            switch (prefix) {
            case "E":
                myTbl = [
                    "日",
                    "月",
                    "火",
                    "水",
                    "木",
                    "金",
                    "土"
                ];
                setInfo =
                    myYear + '年' +
                    myMonth + '月' +
                    myDate + '日(' +
                    myTbl[myDay] + ')' +
                    grade + '年' +
                    classfie + '組' +
                    number + '番さん';
                $target.html(setInfo);
                break;
            case "H":
                myTbl = ["日", "月", "火", "水", "木", "金", "土"];
                setInfo =
                    myYear + '年' +
                    myMonth + '月' +
                    myDate + '日（' +
                    myTbl[myDay] + '） ' +
                    grade + '　年　' +
                    classfie + '　組 ' +
                    number + '　番さん';
                $target.html(setInfo);
                break;
            default:
                console.log("prefix error");
                break;
            }
        },
        //ダイアログを表示する。
        message: function (title, message) {
            var $dom = $('<div/>', {
                id: 'com_dialog'
            }).attr('title', title).append(
                $('<p/>').html(message)
            );
            $('body').append($dom);
            $dom.dialog({
                modal: true,
                draggable: false,
                width: 300,
                height: 220,
                buttons: [{
                    text: "OK",
                    class: 'fu_button',
                    click: function () {
                        $dom.dialog("close");
                    }
                }]
            }).on("dialogbeforeclose", function (event, ui) {
                $('#com_dialog').remove();
            });
        },
        //OKボタン付きのダイアログを表示する。
        // title：題名
        // message：内容
        // callback：「OK」が押されたときに実行される関数（なくてもよい）
        message_ok: function (title, message, callback) {
            callback = callback || function () {};
            var $dom = $('<div/>', {
                id: 'com_dialog'
            }).attr('title', title).append(
                $('<p/>').html(message)
            );
            $('body').append($dom);
            $dom.dialog({
                modal: true,
                draggable: false,
                width: 400,
                //height: 150,
                //maxheight: 300,
                buttons: [
                    {
                        text: "OK",
                        class: 'fu_button',
                        click: function () {
                            callback();
                            $dom.dialog("close");
                        }
                }
                ]
            }).on("dialogbeforeclose", function (event, ui) {
                $('#com_dialog').remove();
            });
        },
        //ログインチェック
        // callback：ログインが正常だった場合に実行される関数（なくてもよい）
        loginCheck: function (callback) {
            callback = callback || function () {};
            var sendData = {
                'command': 'loginCheck'
            };
            $.ajax({
                url: '../common/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (!data || !data.USERID) {
                    comfn.message_ok('ログアウト', '時間がたったので<br>一度ログアウトしました！', function () {
                        location.href = comfn.SS.getName('HOME', "1");
                    });
                } else {
                    param.status = data;
                    //console.dir(data);
                    $('#basicInfo .displayname').text(param.status['DISPLAYNAME']);
                    callback();
                }
            });
        },
        
        loginCheckUrl: function (url,callback) {
            callback = callback || function () {};
            var sendData = {
                'command': 'loginCheck'
            };
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (!data || !data.USERID) {
                    comfn.message_ok('ログアウト', '時間がたったので<br>一度ログアウトしました！', function () {
                        location.href = comfn.SS.getName('HOME', "1");
                    });
                } else {
                    param.status = data;
                    //console.dir(data);
                    $('#basicInfo .displayname').text(param.status['DISPLAYNAME']);
                    callback();
                }
            });
        },
        //COMMONDBへリソースの取得を行う。
        //obj: {
        //  table:配列化されたテーブル名 ['question','test'],
        //  callback: AJAXによりデータ取得後に実行したい関数（なくてもよい）
        //  }
        getTableCom: function (obj) {
            var sendData = {
                'command': 'getTableCom',
                'param': obj.table
            };
            comfn._getTable(obj, sendData);
            //MASTERDBへリソースの取得を行う。
            //同上
        },
        getTableMaster: function (obj) {
            var sendData = {
                'command': 'getTableMaster',
                'delete_flag': obj.delete_flag || "",
                'param': obj.table
            };
            comfn._getTable(obj, sendData);
        },
        _getTable: function (obj, sendData) {
            obj.callback = obj.callback || (function () {}());
            $.ajax({
                url: '../common/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var key;
                for (key in data) {
                    comfn.SS.set(key, data[key]);
                }
                obj.callback();
            });
        },
        takeGET: function () {
            var i, kv,
                arg = {},
                pair = location.search.substring(1).split('&');

            for (i = 0; pair[i]; i += 1) {
                kv = pair[i].split('=');
                arg[kv[0]] = kv[1];
            }
            return arg;
        },

        //時のオプション項目を返す。
        getHour: function () {
            var i,
                $dom = $('<select />', {
                    'class': 'hour'
                });
            for (i = 0; i < 12; i += 1) {
                $dom.append("<option value='" + i + "'>" + i + "</option>");
            }
            return $dom;
        },
        //分のオプション項目を返す。
        getMinute: function () {
            var i,
                $dom = $('<select />', {
                    'class': 'minute'
                });

            $dom.append("<option value=''>--</option>");
            for (i = 0; i < 60; i += 15) {
                $dom.append("<option value='" + i + "'>" + ("0" + i).slice(-2) + "</option>");
            }
            return $('<label />', {
                'class': 'select'
            }).append($dom);
        },
        //TheadとTbodyの内、Tbodyだけスクロールさせる。
        scrollResize: function () {
            $('table.scroll').each(function(){

                var $table = $(this),
                    $bodyCells = $table.find('tbody tr:first').children(),
                    colWidth;
                colWidth = $bodyCells.map(function () {
                    return $(this).width();
                }).get();
                $table.find('thead tr').children().each(function (i, v) {
                    $(v).width(colWidth[i]);
                });
                    
            })
        },
        //セッションを削除し、トップ画面に戻る。
        logout: function () {
            var sendData = {
                'command': 'logout'
            };
            $.ajax({
                url: '../common/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                window.location.href = "./../";
                //window.location.href = comfn.SS.getName('HOME', "1");
            });
        },
        //セッションを削除するだけ．．
        removeSession: function () {
            var sendData = {
                'command': 'logout'
            };
            $.ajax({
                url: '../common/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {});
        },

        //SESSIONSTRAGEから既定のテーブルを取得し、画面上に#basicInfoが存在したら選択肢を反映させる。
        setBasicInfo: function (callback) {

            callback=callback || (function(){});

            comfn.getTableCom({
                //DBから取得したいテーブル
                table: ['curriculumE', 'curriculumH', 'classE', 'classH', 'gradeE', 'gradeH', 'group', 'schoolE', 'schoolH', 'share'],
                //取得終了後に実施したい関数
                callback: function () {

                    //画面内に#basicInfoが存在していたら・・・
                    if ($('#basicInfo').length != 0) {

                        //セレクトボックスに規定の値を入れる
                        $('#basicInfo .group').setOption(comfn.SS.get('group'));
                        $('#basicInfo .share').setOption(comfn.SS.get('share'));
                        $('#basicInfo .school').setOption(comfn.SS.get('schoolE'));
                        $('#basicInfo .classes').setOption(comfn.SS.get('classE'));
                        $('#basicInfo .grade').setOption(comfn.SS.get('gradeE'));
                        $('#basicInfo .curriculum').setOption(comfn.SS.get('curriculumE'));

                        //groupのセレクトボックスの値が変更されたら、小学生/中学生の出しわけを行う。
                        $('#basicInfo select.group').on('change', function () {
                            var $prefix = $(this).val() === "1" ? 'E' : 'H';
                            $('#basicInfo .classes').setOption(comfn.SS.get('class' + $prefix));
                            $('#basicInfo .grade').setOption(comfn.SS.get('grade' + $prefix));
                            $('#basicInfo .school').setOption(comfn.SS.get('school' + $prefix));
                            $('#basicInfo .curriculum').setOption(comfn.SS.get('curriculum' + $prefix));
                        });
                    }
                    callback();
                }
            });
        },
        setQuestionAnswer: function(pvCallback){
            setQuestionAnswer(pvCallback);
        },
        setQuestion: function(pvCallback){
            setQuestion(pvCallback);
        },
        getGraphConfigFromQuestionID : function(pvQuestionID){
            return getGraphConfigFromQuestionID(pvQuestionID);
        },
        generateQuestion: function (list, $target,admin,questionCounter) {

            admin=admin || 0;
            var i, node, $minute, $hour, $row,
                $str=[];

            for (i = 0; i < list.length; i += 1) {
                node = list[i];

                var counter;
                if(admin){
                    counter=3;
                }else{
                   counter=1;

                }

                for (var j = 0; j < counter; j++) {
                    //アンサータイプから質問を取得する
                    var html = getQuestionAnswerHtmlByAnswerType(node.answerType);
                    $str[j] = html;
                }

                if(admin){
                    //管理画面用に目標，注意ラインを追加する
                    $row = ('<tr data="' + node.id +
                        '"><td><input type="checkbox" class="check" checked="checked" value="' +
                        node.id + '"</td><td>' + questionCounter +
                        '</td><td class="question">' + node.ruby 
                        + '</td><td class="answer">' + $str[0] + '</td>'
                        + '</td><td class="border">' + $str[1] + '</td>'
                        + '</td><td class="warning">' + $str[2] + '</td>'
                        +'</tr>');  

                }else{
                    $row = ('<tr data="' + node.id +
                        '"><td><input type="checkbox" class="check" checked="checked" value="' +
                        node.id + '"</td><td>' + node.id +
                        '</td><td class="question">' + node.ruby + '</td><td class="answer">' + $str[0] + '</td></tr>');
                }
                $target.append($row);
            }
        },
        //このメソッドは最悪、アンサータイプとデータで答えのオブジェクトを返しているが、該当のものがないとエラーも出ず、undefinedが返される
        //そもそも上のgenerationQuestionと統合して、オブジェクト化すべき、それとデータベースから読み出すべき（設計がそもそもひどい）
        createAnswerText: function (obj, qNode) {
            //ここで取得するように変更
            return getQuestionAnswerObj(qNode.answerType,obj.answerData);
        },
        computeDate: function (dateFrom, addDays) {
            var year = dateFrom.split('-')[0],
                month = parseInt(dateFrom.split('-')[1], 10),
                day = parseInt(dateFrom.split('-')[2], 10),
                dt = new Date(year, month - 1, day),
                baseSec = dt.getTime(),
                addSec = addDays * 86400000, //日数 * 1日のミリ秒数
                targetSec = baseSec + addSec;
            dt.setTime(targetSec);
            return dt;
        },
        //二つの日の差分を返す。
        compareDate: function (dateFrom, dateTo) {
            var diff, diffDay,
                year1 = dateFrom.split('-')[0],
                month1 = parseInt(dateFrom.split('-')[1], 10),
                day1 = parseInt(dateFrom.split('-')[2], 10),
                year2 = dateTo.split('-')[0],
                month2 = parseInt(dateTo.split('-')[1], 10),
                day2 = parseInt(dateTo.split('-')[2], 10),
                dt1 = new Date(year1, month1 - 1, day1),
                dt2 = new Date(year2, month2 - 1, day2);
            diff = dt1 - dt2;
            diffDay = diff / 86400000; //1日は86400000ミリ秒
            return (diffDay < 0) ? diffDay * -1 : diffDay;
        },
        //htmlタグ付き文字の
        htmlParse: function (str, arrowTag) {
            // 配列形式の場合は'|'で結合
            if ((Array.isArray ?
                    Array.isArray(arrowTag) : Object.prototype.toString.call(arrowTag) === '[object Array]')) {
                arrowTag = arrowTag.join('|');
            }

            // arrowTag が空の場合は全てのHTMLタグを除去する
            arrowTag = arrowTag ? arrowTag : '';

            // パターンを動的に生成
            var pattern = new RegExp('(?!<\\/?(' + arrowTag + ')(>|\\s[^>]*>))<("[^"]*"|\\\'[^\\\']*\\\'|[^\\\'">])*>', 'gim');
            return str.replace(pattern, '');
        }
    };
}());

function moveUrlWidthParam(pvURL){
    var urlParam = comfn.takeGET().p;
    if(urlParam){
        var addParam = "?p=" + urlParam;
        var url = pvURL + addParam;
        location.href = url;
    }else{
        location.href = pvURL;
    }
}

//jquery Extend
$.fn.extend({
    //オブジェクト形式の配列から選択要素を作成する。
    // [{"id":"1","name":"小学校"},{"id":"2","name":"中学校"}]
    setOption: function (options) {
        var $option, i;
        if (this.length == 0) {
            return;
        }
        this.empty();
        $option = $();
        for (i = 0; i < options.length; i += 1) {
            $option.push(
                $("<option/>", {
                    'value': options[i].id,
                    'text': options[i].name
                })[0]
            );
        }
        this.append($option);
        return this;
    }
});


// 選択状態ごとdomをコピーする
//jquery.clone拡張
(function (original) {
    jQuery.fn.clone = function () {
        var i, l,
            result = original.apply(this, arguments),
            my_textareas = this.find('textarea').add(this.filter('textarea')),
            result_textareas = result.find('textarea').add(result.filter('textarea')),
            my_selects = this.find('select').add(this.filter('select')),
            result_selects = result.find('select').add(result.filter('select'));

        for (i = 0, l = my_textareas.length; i < l; ++i) {
            $(result_textareas[i]).val($(my_textareas[i]).val());
        }
        for (i = 0, l = my_selects.length; i < l; ++i) {
            result_selects[i].selectedIndex = my_selects[i].selectedIndex;
        }

        return result;
    };
})(jQuery.fn.clone);


//events
$(document).on('click', '#img_logout', function () {
    "use strict";
    //ログアウトボタンが押されたらログアウト
    comfn.logout();
}).on('click', '#img_menu', function () {
    "use strict";
    //メニューボタンが押されたらメニュー画面
    location.href = '../menu_t/';
}).on('click', '#img_modoru', function () {
    "use strict";
    //戻るボタンが押されたら一つ戻る
    history.back();
});