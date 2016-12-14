$(function () {
    //definition
    var fn = {
            init: function () {
                //ログインチェック
                comfn.loginCheck(function () {
                    // //SessionStorageの取得とBasicInfoへの値設定
                    comfn.setBasicInfo();
                    comfn.setInfo($('.info'));
                    param.GET = comfn.takeGET();
                    
                    var callback = fn.answerSearch;
                    //ここでアンサーのロードを開始する、コールバックにアンサーサーチメソッド
                    comfn.setQuestionAnswer(callback);
                });
            },
            answerSearch: function () {
                var sendData = {
                    'command': 'answerSearch',
                    'param': ""
                }
                $.ajax({
                    url: 'ajax.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(sendData)
                }).done(function (data) {
                    if (data.sheet[0].package != null) {
                        param.answer = data.answer;
                        param.sheet = data.sheet;
                        //イニシャルでは現在の週を表示する
                        fn.showAnswer(fn.getMonday(new Date));
                    } else {
                        comfn.message_ok('一覧表がありません', '今日見れる一覧表はありません。<br>メニューにもどります！', function () {
                            history.back();
                        });
                    }
                });
            },
            showAnswer: function (monday) {
                //行数
                var question = [];
                //質問リストを取得
                for (var i = 0; i < param.sheet[0].child.length; i++) {
                    var node = param.sheet[0].child[i];
                    question.push(node.questionText)
                }
                var question = question.filter(function (x, i, self) {
                    return self.indexOf(x) === i;
                });

                //ユーザリスト
                var userlist = [param.status.USERID];
                for (var k = 0; k < userlist.length; k++) {
                    var $table = $('<table class="kiroku scroll"/>');
                    var user = userlist[k];

                    var userArea = fn.createUserArea($table, user, monday);
                    if (userArea) {
                        $('#box_graph').empty();
                        $('#box_graph').append(userArea);
                    } else {
                        //実質的に１ユーザしかいないので，このユーザが対象期間外ならこの時点で処理は終了でよい
                        return false;
                    }
                }
                fn.fullTraverse();
                comfn.scrollResize();
            },
            getWday: function (date) {
                var weekday = ["日", "月", "火", "水", "木", "金", "土"];
                return weekday[date.getDay()]
            },
            //指定された日の月曜日にあたる日を返す
            getMonday: function (date) {
                var dateFormat = new DateFormat("yyyy-MM-dd");
                //該当週の月曜日
                return (function () {
                    var baseDate = date;
                    for (var i = 0; i < 7; i++) {
                        if (fn.getWday(baseDate) == '月') {
                            break;
                        } else {
                            baseDate.setDate(baseDate.getDate() - 1)
                        }
                    }
                    // console.log(dateFormat.format(baseDate));
                    return dateFormat.format(baseDate);
                })();
            },

            createUserArea: function ($table, user, monday) {
                var dateFormat = new DateFormat("yyyy-MM-dd");
                var sheetStartDate = dateFormat.format(new Date(param.sheet[0].dateFrom.split(' ')[0]));
                var sheetEndDate = dateFormat.format(new Date(param.sheet[0].dateTo.split(' ')[0]));
                var baseDate;
                var baseEndDate;
                var startDate = monday;
                for (var i = 0; i < 7; i++) {
                    //開始日がシートの期間内だったら
                    if (sheetStartDate <= startDate && startDate <= sheetEndDate) {
                        //開始日を格納
                        baseDate = startDate;
                        break;
                    } else {
                        var obj = new Date(startDate)
                        obj.setDate(obj.getDate() + 1);
                        startDate = dateFormat.format(obj);
                    }
                }
                if (!baseDate) {
                    return false;
                }
                var obj = dateFormat.parse(monday);
                obj.setDate(obj.getDate() + 6);
                //その週の日曜日から過去に戻る
                var endDate = dateFormat.format(obj);
                for (var i = 0; i < 7; i++) {
                    //開始日がシートの期間内だったら
                    if (sheetStartDate <= endDate && endDate <= sheetEndDate) {
                        //開始日を格納
                        baseEndDate = endDate;
                        break;
                    } else {
                        var obj = new Date(endDate)
                        obj.setDate(obj.getDate() - 1);
                        endDate = dateFormat.format(obj);
                    }
                }
                var days = comfn.compareDate(baseDate, baseEndDate) + 1;
                var $row = "<thead><tr><td>質問</td>";
                var dateFormat = new DateFormat("M月d日");
                for (var j = 0; j < days; j++) {
                    var date = dateFormat.format(comfn.computeDate(baseDate, j));
                    var wday = fn.getWday(comfn.computeDate(baseDate, j));

                    if (j == 0) {
                        //起算週の情報を格納
                        $row += '<td id="baseDate" data="' + baseDate + '">' + date + '(' + wday + ')</td>'
                    } else {
                        $row += '<td>' + date + '(' + wday + ')</td>'
                    }
                }
                $row += "</tr></thead>";
                $table.prepend($row);
                var dateFormat = new DateFormat("yyyy-MM-dd");
                for (var i = 0; i < param.sheet[0].child.length; i++) {
                    var node = param.sheet[0].child[i];
                    $row = "<tr data='" + (i + 1) + "'>";
                    $row += "<td>" + node.ruby + "</td>";
                    for (var j = 0; j < days; j++) {
                        //本日の日付("yyyy-MM-dd")
                        var date = dateFormat.format(comfn.computeDate(baseDate, j));
                        //日付が合致＋質問番号が合致
                        var answer = param.answer.filter(function (item, index) {
                            if (item.date.indexOf(date) >= 0 && item.question == node.id && item.user == user) return true;
                        })[0]
                        if (answer === undefined) {
                            answer = {
                                'answerData': ""
                            };
                        }
                        var res = comfn.createAnswerText(answer, param.sheet[0].child[i]);
                        var insertClass = "";
                        if (res.result == 0) {
                            insertClass = 'class="stamp"';
                        } else if (res.result == -1) {
                            insertClass = '';
                        } else {
                            insertClass = 'class="stamp"';
                        }
                        $dom = $('<td class="stamp"></td>')
                        if (res.stamp) {
                            $dom.css('background-image', 'url(../common/images/stamp/' + res.stamp + ')')
                        }
                        $row += $dom[0].outerHTML;
                    }
                    $row += "</tr>"
                    $table.append($row);
                    $table.css('width', (days * 60) + 'px');
                }
                return $table;
            },
            fullTraverse: function () {
                var colcount = $('#box_graph table tbody tr:first td').length - 1;
                var rowcount = $('#box_graph table tbody tr').length;
                var $dom = $('<tr/>');
                $dom.append($('<td class="orange"><ruby><rb>全部</rb><rt>ぜんぶ</rt></ruby>の<ruby><rb>質問</rb><rt>しつもん</rt></ruby>に<ruby><rb>回答</rb><rt>かいとう</rt></ruby>したら、コインをゲット！</ruby></td>'));

                for (var i = 1; i < colcount + 1; i++) {
                    var flag = true;
                    for (var j = 0; j < rowcount; j++) {
                        var prop = $("#box_graph tbody tr:nth-child(" + (j + 1) + ") td:nth-child(" + (i + 1) + ")").css('background-image');
                        if (prop == 'none') {
                            flag = false;
                        }
                    }
                    if (flag == true) {
                        $dom.append($('<td class="stamp_coin"></td>'));
                    } else {
                        $dom.append($('<td></td>'));
                    }
                }
                $('#box_graph table tbody').append($dom);
                comfn.scrollResize();
            }
        }

        //events
    $(document).on('click', '.allTable thead', function () {})
    $(document).off('click', '#img_logout');
    $(document).on('click', '#img_logout', function () {
        //ログアウトボタンが押されたらログアウト
        comfn.removeSession();
        moveUrlWidthParam('./../../');
        //window.location.href = "./../../";
        //window.location.href = comfn.SS.getName('HOME', "1");
    });
    $(document).on('click', '#nav_prev', function () {
        var nowWeek = $('#baseDate').attr('data');
        var date = new Date(nowWeek);
        date.setDate(date.getDate() - 7);
        fn.showAnswer(fn.getMonday(date));
    });
    $(document).on('click', '#nav_next', function () {
        var nowWeek = $('#baseDate').attr('data');
        var date = new Date(nowWeek);
        date.setDate(date.getDate() + 7);
        fn.showAnswer(fn.getMonday(date));
    })
    $(document).on('click','.fu_button',function(){
        moveUrlWidthParam('./../menu_s/');
        //window.location.href = './../menu_s/';
    })
    
//    $(document).on('click', '#img_tsugie', function () {
//
//        comfn.removeSession();
//        window.location.href = "./../../";
//        //window.location.href = comfn.SS.getName('HOME', "1");
//        
//        // $('#modalContents01').dialog({
//        //     width: 400,
//        //     modal: true,
//        //     draggable: false,
//        //     buttons: [
//        //         {
//        //             text: "閉じる",
//        //             class: 'fu_button',
//        //             click: function () {　　　　
//        //                 (window.open('', '_self').opener = window).close();
//        //             },
//        //         },
//        //         {
//        //             text: "閉じない",
//        //             class: 'fu_button',
//        //             click: function () {
//        //                 $(this).dialog('close');
//        //             }　
//        //         }
//        //     ]
//        // });
//    });

    // run
    fn.init();
});