//common_parameter
var param = {};
//definition    
var comfn = {
    //セッションストレージへのアクセスを行う。
    SS: {
        get: function (key) {
            return JSON.parse(sessionStorage.getItem(key));
        },
        set: function (key, value) {
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        getName: function (key, value) {

            var list = JSON.parse(sessionStorage.getItem(key));
            var result= list.filter(function (item, index) {
                if (item.id == value) return true;
            })[0];

            if(result){
                return result.name;
            }else{
                return "----";
            }


        }
    },
    //xx年xx月xx日xx年xx組xx番を生成する
    setInfo: function ($target) {

        var myTbl = new Array("日", "月", "火", "水", "木", "金", "土");
        var myD = new Date();

        var myYear = myD.getFullYear();
        var myMonth = myD.getMonth() + 1;
        var myDate = myD.getDate();
        var myDay = myD.getDay();


        var prefix = param.status.GROUP == "1" ? 'E' : 'H';
        var grade = param.status['GRADE' + prefix];
        var classfie = param.status['CLASS' + prefix];
        var number = param.status.NUMBER;

        $target.text(myYear + '年' +
            myMonth + '月' +
            myDay + '日（' +
            myTbl[myDay] + '） ' +
            grade + '　年　' +
            classfie + '　組 ' +
            number + '　番さん')

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
                buttons: {
                    "OK": function () {
                        $dom.dialog("close");　　　　　
                    }
                }
            })
            .on("dialogbeforeclose", function (event, ui) {
                $('#com_dialog').remove();
            });
    },
    //OKボタン付きのダイアログを表示する。
    // title：題名
    // message：内容
    // callback：「OK」が押されたときに実行される関数（なくてもよい）
    message_ok: function (title, message, callback) {
        callback = callback || (function () {});
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
                maxheight: 300,
                　　　buttons: {　　　　
                    "OK": function () {　　　　
                        callback();
                        $dom.dialog("close");　　　　　
                    }　　　
                }　
            })
            .on("dialogbeforeclose", function (event, ui) {
                $('#com_dialog').remove();
            });
    },
    //ログインチェック
    // callback：ログインが正常だった場合に実行される関数（なくてもよい）
    loginCheck: function (callback) {
        callback = callback || (function () {});
        var sendData = {
            'command': 'loginCheck',
        }
        $.ajax({
            url: '../common/php/ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function (data) {
            if (!data  || !data.USERID) {
                comfn.message_ok('ログアウト', '時間がたったので<br>一度ログアウトしました！', function () {
                    location.href = comfn.SS.getName('HOME',"1");
                });
            } else {
                param['status'] = data;
                console.dir(data)
                $('#basicInfo .displayname').text(param.status['DISPLAYNAME']);
                callback();
            }
        })
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
        }
        comfn._getTable(obj, sendData);
        //MASTERDBへリソースの取得を行う。
        //同上
    },
    getTableMaster: function (obj) {
        var sendData = {
            'command': 'getTableMaster',
            'delete_flag':obj.delete_flag || "",
            'param': obj.table
        }
        comfn._getTable(obj, sendData);
    },
    _getTable: function (obj, sendData) {
        obj.callback = obj.callback || (function () {});
        $.ajax({
            url: '../common/php/ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function (data) {
            for (var key in data) {
                comfn.SS.set(key, data[key])
            }
            obj.callback();
        })
    },
    takeGET: function () {
        var arg = new Object;
        var pair = location.search.substring(1).split('&');
        for (var i = 0; pair[i]; i++) {
            var kv = pair[i].split('=');
            arg[kv[0]] = kv[1];
        }
        return arg;
    },

    //時のオプション項目を返す。
    getHour: function () {
        var $dom = $('<select />', {
            'class': 'hour'
        });
        for (var i = 0; i < 12; i++) {
            $dom.append("<option value='" + i + "'>" + i + "</option>");
        }
        return $dom;
    },
    //分のオプション項目を返す。
    getMinute: function () {
        var $dom = $('<select />', {
            'class': 'minute'
        });
        for (var i = 0; i < 60; i++) {
            $dom.append("<option value='" + i + "'>" + i + "</option>");
        }
        return $dom;
    },
    //TheadとTbodyの内、Tbodyだけスクロールさせる。
    scrollResize: function () {
        var $table = $('table.scroll'),
            $bodyCells = $table.find('tbody tr:first').children(),
            colWidth;
        colWidth = $bodyCells.map(function () {
            return $(this).width();
        }).get();
        $table.find('thead tr').children().each(function (i, v) {
            $(v).width(colWidth[i]);
        });
    },
    //セッションを削除し、トップ画面に戻る。
    logout: function () {
        var sendData = {
            'command': 'logout'
        }
        $.ajax({
            url: '../common/php/ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function (data) {
            location.href = "../";
        })
    },
    //セッションを削除するだけ．．
    removeSession:function() {
        var sendData = {
            'command': 'logout'
        }
        $.ajax({
            url: '../common/php/ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function (data) {
        })
    },

    //SESSIONSTRAGEから既定のテーブルを取得し、画面上に#basicInfoが存在したら選択肢を反映させる。
    setBasicInfo: function () {
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
                        $prefix = $(this).val() === "1" ? 'E' : 'H';
                        $('#basicInfo .classes').setOption(comfn.SS.get('class' + $prefix));
                        $('#basicInfo .grade').setOption(comfn.SS.get('grade' + $prefix));
                        $('#basicInfo .school').setOption(comfn.SS.get('school' + $prefix));
                        $('#basicInfo .curriculum').setOption(comfn.SS.get('curriculum' + $prefix));
                    })
                }
            }
        });
    },
    generateQuestion: function (list, $target) {

        var str = "";
        for (var i = 0; i < list.length; i++) {
            var node = list[i];
            if ($.inArray(node.answerType, ["1", "2"]) >= 0) {






                if (node.answerType == "1") {

                    $hour = (function () {
                        var array=[
                            {'name':'午後7','value':'19'},
                            {'name':'午後8','value':'20'},
                            {'name':'午後9','value':'21'},
                            {'name':'午後10','value':'22'},
                            {'name':'午後11','value':'23'},
                            {'name':'午前0','value':'24'},
                            {'name':'午前1','value':'25'},
                            {'name':'午前2','value':'26'},
                            {'name':'午前3','value':'27'},
                        ]
                        var $dom = $('<select />', {
                            'class': 'hour'
                        });
                        for (var i = 0; i < array.length; i++) {
                            $dom.append("<option value='" + array[i].value + "'>" + array[i].name + "</option>");
                        }
                        return $dom;
                    })();

                    $minute = comfn.getMinute();



                    $str = '' + $hour.get(0).outerHTML + '<ruby><rb>時</rb><rt>じ</rt></ruby>' + $minute.get(0).outerHTML + '<ruby><rb>分</rb><rt>ふん</rt></ruby>';
                } else {


                    $hour = (function () {
                        var array=[
                            {'name':'午前3','value':'3'},
                            {'name':'午前4','value':'4'},
                            {'name':'午前5','value':'5'},
                            {'name':'午前6','value':'6'},
                            {'name':'午前7','value':'7'},
                            {'name':'午前8','value':'8'},
                            {'name':'午前9','value':'9'},
                            {'name':'午前10','value':'11'},
                        ]
                        var $dom = $('<select />', {
                            'class': 'hour'
                        });
                        for (var i = 0; i < array.length; i++) {
                            $dom.append("<option value='" + array[i].value + "'>" + array[i].name + "</option>");
                        }
                        return $dom;
                    })();

                    $minute = comfn.getMinute();


                    $str = '' + $hour.get(0).outerHTML + '<ruby><rb>時</rb><rt>じ</rt></ruby>' + $minute.get(0).outerHTML + '<ruby><rb>分</rb><rt>ふん</rt></ruby>';
                }
            } else if (node.answerType == "3") {
                $str = '<input type="radio" name="' + node.id + '_value" value="1" placeholder="">はい' +
                    '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">いいえ';
            } else if (node.answerType == "4") {
                $str = '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">よい' +
                    '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">よくない';
            } else if (node.answerType == "5") {
                $str = '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">した' +
                    '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">していない';
            } else if (node.answerType == "6") {
                $str = '<input type="radio" name="' + node.id + '_value" value="2" placeholder=""><ruby><rb>食</rb><rt>た</rt></ruby>べた' +
                    '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder=""><ruby><rb>少</rb><rt>すこ</rt></ruby>し<ruby><rb>食</rb><rt>た</rt></ruby>べた' +
                    '<input type="radio" name="' + node.id + '_value" value="0" placeholder=""><ruby><rb>食</rb><rt>た</rt></ruby>べられなかった';
            } else if (node.answerType == "7") {
                $str = '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">0<ruby><rb>回</rb><rt>かい</rt></ruby>' +
                    '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">1<ruby><rb>回</rb><rt>かい</rt></ruby>' +
                    '<input type="radio" name="' + node.id + '_value" value="2" placeholder="">2<ruby><rb>回以上</rb><rt>かいいじょう</rt></ruby>';
            } else if (node.answerType == "8") {
                $str = '<input type="text" name="" value="" placeholder="" />';
            } else if (node.answerType == "9") {
                $str = '<input type="number" name="" value="0" required placeholder="" /> 回';
            } else if (node.answerType == "10") {
                $str ='<select><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select>回';
            } else if (node.answerType == "11") {
                $str = '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">1<ruby><rb>時間以内</rb><rt>じかんいない</rt></ruby>' +
                    '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">3<ruby><rb>時間以内</rb><rt>じかんいない</rt></ruby>' +
                    '<input type="radio" name="' + node.id + '_value" value="2" placeholder="">3<ruby><rb>時間以上</rb><rt>じかんいじょう</rt></ruby>';



            //中学生
            } else if($.inArray(node.answerType, ["21", "22"]) >= 0) {
                $hour = comfn.getHour();
                $minute = comfn.getMinute();
                if (node.answerType == "21") {
                    $str = '午後' + $hour.get(0).outerHTML + '時' + $minute.get(0).outerHTML + '分';
                } else {
                    $str = '午前' + $hour.get(0).outerHTML + '時' + $minute.get(0).outerHTML + '分';
                }


            } else if (node.answerType == "26") {
                $str = '<input type="radio" name="' + node.id + '_value" value="2" placeholder="">食べた' +
                    '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">少し食べた' +
                    '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">食べられなかった';


            } else if (node.answerType == "27") {
                $str = '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">0回' +
                    '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">1回' +
                    '<input type="radio" name="' + node.id + '_value" value="2" placeholder="">2回以上';


            } else if (node.answerType == "31") {
                $str = '<input type="radio" name="' + node.id + '_value" value="0" placeholder="">1時間以内' +
                    '<input type="radio" name="' + node.id + '_value" value="1" checked placeholder="">3時間以内' +
                    '<input type="radio" name="' + node.id + '_value" value="2" placeholder="">3時間以上';
            }











            var $row = ('<tr data="' + node.id +
                '"><td><input type="checkbox" class="check" checked="checked" value="' +
                node.id + '"</td><td>&nbsp;' + node.id +
                '</td><td class="question">' + node.ruby + '</td><td class="answer">' + $str + '</td></tr>')
            $target.append($row);　　
        }


    },
    createAnswerText: function (obj, qNode) {
        if (obj.answerData == "") return {
            answer: '',
            'result': -1,
               stamp:''
        }
        if (qNode.answerType == 1) {
            //何時何分
            var node = obj.answerData.split(',');
            var result = 1;
            var stamp='sleep1color.png';
            if (node[0] >= 21) {
                result = 0;
                stamp='sleep5color.png';
            }
            return {
                answer: node[0] + '時' + node[1] + '分',
                'result': result,
                stamp:stamp
            }
        } else if (qNode.answerType == 2) {
            //何時何分
            var node = obj.answerData.split(',');
            var stamp='sleep1color.png';
            var result = 1;
            if (node[0] >= 7) {
                result = 0;
                stamp='sleep5color.png';
            }
            return {
                answer: node[0] + '時' + node[1] + '分',
                'result': result,
                stamp:stamp
            }
        } else if (qNode.answerType == 9) {
            var result = 1;
            if (obj.answerData < 2) {
                result = 0;
            }
            return {
                answer: obj.answerData + '回',
                'result': result
            }

        } else if (qNode.answerType == 10) {
            var result = 1;
            if (obj.answerData < 1) {
                result = 0;
            }
            return {
                answer: obj.answerData + '回',
                'result': result
            }
        } else if (qNode.answerType == 3) {
            if (obj.answerData == '1') {
                return {
                    answer: 'はい',
                    'result': 1
                }
            } else {
                return {
                    answer: 'いいえ',
                    'result': 0
                }
            }
        } else if (qNode.answerType == 4) {
            if (obj.answerData == '1') {
                return {
                    answer: 'よい',
                    'result': 1
                }
            } else {
                return {
                    answer: 'よくない',
                    'result': 0
                }
            }
        } else if (qNode.answerType == 5) {
            if (obj.answerData == '1') {
                return {
                    answer: 'した',
                    'result': 1
                }
            } else {
                return {
                    answer: 'していない',
                    'result': 0
                }
            }
        } else if (qNode.answerType == 6) {
            if (obj.answerData == '2') {
                return {
                    answer: '食べた',
                    'result': 1,
                    stamp:'eat4color.png'
                }
            } else if (obj.answerData == '1') {
                return {
                    answer: '少し食べた',
                    'result': 1,
                    stamp:'eat2color.png'
                }
            } else {
                return {
                    answer: '食べられなかった',
                    'result': 0,
                    stamp:'eat1color.png'
                }
            }
        } else if (qNode.answerType == 7) {
            if (obj.answerData == '2') {
                return {
                    answer: '二回以上',
                    'result': 1,
                    stamp:'brush5color.png'
                }
            } else if (obj.answerData == '1') {
                return {
                    answer: '一回',
                    'result': 1,
                    stamp:'brush3color.png'
                }
            } else {
                return {
                    answer: '0回',
                    'result': 0,
                    stamp:'brush1color.png'
                }
            }
        } else if (qNode.answerType == 11) {
            if (obj.answerData == '2') {
                return {
                    answer: '3時間以上',
                    'result': 0,
                    stamp:'play2color.png'
                }
            } else if (obj.answerData == '1') {
                return {
                    answer: '3時間以内',
                    'result': 1,
                    stamp:'play4color.png'
                }
            } else {
                return {
                    answer: '30分以内',
                    'result': 1,
                    stamp:'play1color.png'
                }
            }
        } else if (qNode.answerType == 8) {
            return {
                answer: obj.answerData,
                'result': 1
            }


        //中学生
        }else  if (qNode.answerType == 21) {
            //何時何分
            var node = obj.answerData.split(',');
            var result = 1;
            var stamp='sleep1color.png';
            if (node[0] >= 21) {
                result = 0;
                stamp='sleep5color.png';                
            }
            return {
                answer: node[0] + '時' + node[1] + '分',
                'result': result,
                stamp:stamp
            }
        } else if (qNode.answerType == 22) {
            //何時何分
            var node = obj.answerData.split(',');
            var result = 1;
            var stamp='sleep1color.png';
            if (node[0] >= 7) {
                result = 0;
                stamp='sleep5color.png'; 
            }
            return {
                answer: node[0] + '時' + node[1] + '分',
                'result': result,
                stamp:stamp
            }
       } else if (qNode.answerType == 26) {
            if (obj.answerData == '2') {
                return {
                    answer: 'よい',
                    'result': 1,
                    stamp:'eat4color.png'
                }
            } else if (obj.answerData == '1') {
                return {
                    answer: 'まぁまぁ',
                    'result': 1,
                    stamp:'eat2color.png'
                }
            } else {
                return {
                    answer: 'よくない',
                    'result': 0,
                    stamp:'eat1color.png'
                }
            }
        } else if (qNode.answerType == 27) {
            if (obj.answerData == '2') {
                return {
                    answer: 'はい',
                    'result': 1,
                    stamp:'brush5color.png'
                }
            } else if (obj.answerData == '1') {
                return {
                    answer: 'まぁまぁ',
                    'result': 1,
                    stamp:'brush3color.png'
                }
            } else {
                return {
                    answer: 'いいえ',
                    'result': 0,
                    stamp:'brush1color.png'
                }
            }

        } else if (qNode.answerType == 31) {
            if (obj.answerData == '2') {
                return {
                    answer: '3時間以上',
                    'result': 0,
                    stamp:'play2color.png'
                }
            } else if (obj.answerData == '1') {
                return {
                    answer: '3時間以内',
                    'result': 1,
stamp:'play4color.png'
                }
            } else {
                return {
                    answer: '30分以内',
                    'result': 1,
stamp:'play1color.png'
                }
            }
        }


    },
    computeDate: function (dateFrom, addDays) {
        var year = dateFrom.split('-')[0];
        var month = parseInt(dateFrom.split('-')[1], 10);
        var day = parseInt(dateFrom.split('-')[2], 10);
        var dt = new Date(year, month - 1, day);
        var baseSec = dt.getTime();
        var addSec = addDays * 86400000; //日数 * 1日のミリ秒数
        var targetSec = baseSec + addSec;
        dt.setTime(targetSec);
        return dt;
    },
    //二つの日の差分を返す。
    compareDate: function (dateFrom, dateTo) {
        var year1 = dateFrom.split('-')[0];
        var month1 = parseInt(dateFrom.split('-')[1], 10);
        var day1 = parseInt(dateFrom.split('-')[2], 10);
        var year2 = dateTo.split('-')[0];
        var month2 = parseInt(dateTo.split('-')[1], 10);
        var day2 = parseInt(dateTo.split('-')[2], 10);
        var dt1 = new Date(year1, month1 - 1, day1);
        var dt2 = new Date(year2, month2 - 1, day2);
        var diff = dt1 - dt2;
        var diffDay = diff / 86400000; //1日は86400000ミリ秒
        return (diffDay < 0) ? diffDay * -1 : diffDay;
    },
    //htmlタグ付き文字の
    htmlParse:function(str, arrowTag){

        // 配列形式の場合は'|'で結合
        if ((Array.isArray ?
            Array.isArray(arrowTag)
            : Object.prototype.toString.call(arrowTag) === '[object Array]')
        ) {
            arrowTag = arrowTag.join('|');
        }

        // arrowTag が空の場合は全てのHTMLタグを除去する
        arrowTag = arrowTag ? arrowTag : '';

        // パターンを動的に生成
        var pattern = new RegExp('(?!<\\/?(' + arrowTag + ')(>|\\s[^>]*>))<("[^"]*"|\\\'[^\\\']*\\\'|[^\\\'">])*>', 'gim');

        return str.replace(pattern, '');
        }


}


//jquery Extend
$.fn.extend({
    //オブジェクト形式の配列から選択要素を作成する。
    // [{"id":"1","name":"小学校"},{"id":"2","name":"中学校"}]
    setOption: function (options) {


        if (this.length == 0) return;

        this.empty();
        var $option = $();
        for (var i = 0; i < options.length; i++) {
            $option.push(
                $("<option/>", {
                    'value': options[i].id,
                    'text': options[i].name
                })[0]
            )
        }
        this.append($option);
        return this;
    }
});


// 選択状態ごとdomをコピーする
//jquery.clone拡張
(function (original) {
    jQuery.fn.clone = function () {
        var result = original.apply(this, arguments),
            my_textareas = this.find('textarea').add(this.filter('textarea')),
            result_textareas = result.find('textarea').add(result.filter('textarea')),
            my_selects = this.find('select').add(this.filter('select')),
            result_selects = result.find('select').add(result.filter('select'));

        for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
        for (var i = 0, l = my_selects.length; i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;

        return result;
    };
})(jQuery.fn.clone);


//events
$(document)
    .on('click', '#img_logout', function () {
        //ログアウトボタンが押されたらログアウト
        comfn.logout();
    })
    .on('click', '#img_menu', function () {
        //メニューボタンが押されたらメニュー画面
        location.href = '../menu_t/';
    })
    .on('click', '#img_modoru', function () {
        //戻るボタンが押されたら一つ戻る
        history.back();
    });