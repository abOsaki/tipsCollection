/*global $, console, alert, comfn, param*/
$(function () {
    "use strict";
    
    //日付をセットするメソッド
    function setDateInfo(dateObj){
        var target = document.getElementById("calender");
        target.value = dateObj.getCalenderValue();
    };
    
    //生徒情報をセットするメソッド
    function setStudentInfo(studentInfo){
        var target = document.getElementById("studentInfo");
        target.textContent = studentInfo;
    };
    
    //definition
    var fn = {
        init: function () {
            //ログインチェック
            comfn.loginCheck(function () {
                //SessionStorageの取得とBasicInfoへの値設定
                comfn.setBasicInfo();
                
                
                //日付取得
                var date = comfn.getTodayDate();
                setDateInfo(date);
                //生徒情報の取得、セット
                var studentInfo = comfn.getStudentInfo();
                setStudentInfo(studentInfo);
                
                //ここで日付情報をセットしている
                //comfn.setInfo($('.info'));
                
                //パラメタを確認して分岐させる
                var flag = comfn.takeGET();
                
                if(flag.menu == "shukaisou"){
                    //周回走の準備
                    var shukaisouObj = new shukaisou(10);
                    shukaisouObj.ready();
                    
                }else{
                    fn.sheetSearch();
                }
            });
        },
        sheetSearch: function () {
            //本日質問対象のシートが存在したら、その対象となるパッケージを取得する。
            var sendData = {
                'command': 'sheetSearch'
            };
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (data.sheet.length > 0) {
                    //質問が存在する
                    
                    //未回答
                    param.sheet = data.sheet[0];
                    fn.generateQuestion();
                    
                    //カレンダーの準備
                    readyCalender();

                } else {
                    //そもそも質問が存在しない
                    comfn.message_ok('質問がありません', '今日の質問はありません。<br>メニューにもどります！', function () {
                        history.back();
                    });
                }
            });
        },
        //質問項目を作成する
        generateQuestion: function () {
            var callback = function(){
                comfn.generateQuestion(param.sheet.child, $('#content .scrollBody'));
            
                var originalHeight = 575;
                var shitsumonContent = document.getElementById("shitsumon");
                var height = parseInt(shitsumonContent.clientHeight);
                var scaleY = height / originalHeight;
                if(scaleY > 1){
                    var containerInput = document.getElementById("baseImg");
                    containerInput.style.transformOrigin = "left top";
                    containerInput.style.transform = 'scale(1,' + scaleY + ')';
                }

                //無駄なチェックボックス等が付くので整形
                $('.scrollBody tr').each(function () {
                    //二度実行することで一番目と二番目を削除
                    $(this).children('td').eq(0).remove();
                    $(this).children('td').eq(0).remove();
                });
            };
            
            comfn.setQuestionAnswer(callback);
            
            /*
            comfn.generateQuestion(param.sheet.child, $('#content .scrollBody'));
            
            var originalHeight = 575;
            var shitsumonContent = document.getElementById("shitsumon");
            var height = parseInt(shitsumonContent.clientHeight);
            var scaleY = height / originalHeight;
            if(scaleY > 1){
                var containerInput = document.getElementById("baseImg");
                containerInput.style.transformOrigin = "left top";
                containerInput.style.transform = 'scale(1,' + scaleY + ')';
            }
            
            //無駄なチェックボックス等が付くので整形
            $('.scrollBody tr').each(function () {
                //二度実行することで一番目と二番目を削除
                $(this).children('td').eq(0).remove();
                $(this).children('td').eq(0).remove();
            });
            */
        },
        //モーダルで生徒への質問画面のプレビューを表示する。
        generatePreview: function () {
            //回答項目をそのままコピー
            $('#questionBox_prev table').html($('#content .scrollBody').clone());
            $.when($('#questionBox_prev').dialog({
                modal: true,
                draggable: true,
                width: 1100,
                height: 850,
                buttons: {
                    "これでいい": function () {
                        fn.answerSave();
                        moveUrlWidthParam('../result_s/');
                        //location.href = "../result_s/";
                    },
                    "やりなおす": function () {
                        $("#questionBox_prev").dialog("close");
                    }
                }
            })).done(function () {
                $('#questionBox_prev .mask').css({
                    'width': $('#questionBox_prev').innerWidth(),
                    'height': $('#questionBox_prev').innerHeight()
                });
            });
        },
        answerSave: function () {
            var i, res, str,
                obj = [],
                flagList = [],
                flag = true,
                sendData = {
                    'command': 'answerSave',
                    'param': {
                        'package': param.sheet["package"],
                        'qa': []
                    }
                };
            //$('#questionBox_prev .scrollBody tr').each(function () {
            //    sendData.param.qa.push(fn.createQa($(this)));
            //})


            $('#content .scrollBody tr').each(function () {
                res = fn.createQa($(this));
                if (res !== false) {
                    sendData.param.qa.push(res);
                    flagList.push(true);
                    $(this).css("background-color", "");
                } else {
                    flagList.push(false);
                    $(this).css("background-color", "#ffedf4");
                }
            });

            for (i = 0; i < flagList.length; i += 1) {
                if (flagList[i] === false) {
                    flag = false;
                    break;
                }
            }

            //            if (flag) {
            //質問と回答の文字列取得
            $('#content .scrollBody tr').each(function () {
                str = "";
                if ($(this).find('select').length > 0) {
                    if ($(this).attr('data') === "1" || $(this).attr('data') === "2") {
                        if ($(this).find('select.hour').val()) {
                            str = $(this).find('.answer').html();
                            str = str
                                .replace(/<label class="select"><select class="hour">(.+?)<\/select><\/label>/g, $(this).find('select.hour option[value="' + $(this).find('select.hour').val() + '"]').text())
                                .replace(/午前/g, '<ruby><rb>午前</rb><rt>ごぜん</rt></ruby>')
                                .replace(/午後/g, '<ruby><rb>午後</rb><rt>ごご</rt></ruby>');
                            if ($(this).find('select.minute').val()) {
                                str = str.replace(/<label class="select"><select class="minute">(.+?)<\/select><\/label>/g, $(this).find('select.minute option[value="' + $(this).find('select.minute').val() + '"]').text());
                            } else {
                                str = str.replace(/<label class="select"><select class="minute">(.+?)<\/select><\/label>/g, '00');
                            }

                            //$(this).find('select').each(function () {
                            //console.log($(this).find('option[value="' + $(this).val() + '"]').text());
                            //});
                        } else {
                            str = '--';
                        }
                    }
                } else if ($(this).find('input').length > 0) {
                    if ($(this).find("input:checked").val()) {
                        //console.log($(this).find('input:checked + .label').remove('rt').html());
                        //console.log($(this).find('input:checked + .label').html().replace(/<rt>(.+?)<\/rt>/g, "").replace(/<\/*ru*by*>/g, ""));
                        str += $(this).find('input:checked + .label').html();
                    } else {
                        str += '--';
                    }
                }
                obj.push({
                    ques: $(this).find('.question').html(),
                    ans: str
                });
            });
            
            //年月日のセットを行う
            
            var dateString = document.getElementById("calender").value;
            
            var year = parseInt(dateString.split("年")[0]);
            var month = parseInt(dateString.split("年")[1]);
            var date = parseInt(dateString.split("月")[1]);
            
            sendData.year = year;
            sendData.month = month;
            sendData.date = date;
            sendData.displayDate = dateString;
            
            sessionStorage.setItem("ANSHTML", JSON.stringify(obj));
            //答えデータのセット
            sessionStorage.setItem("ANSPARAM", JSON.stringify(sendData));
            moveUrlWidthParam('./../input_s2/');
            
            //location.href = "./../input_s2/";

            //$.ajax({
            //    url: 'ajax.php',
            //    type: 'POST',
            //    dataType: 'json',
            //    data: JSON.stringify(sendData)
            //}).done(function (data) {
            //    location.href = "../result_s/";
            //});
            //            } else {
            //                comfn.message_ok('確認（かくにん）', '<ruby>答<rt>こた</rt></ruby>えていない<ruby>項目<rt>こうもく</rt></ruby>があります。', function () {});
            //            }
        },
        createQa: function ($this) {
            //questionId
            var name, type,
                id = $this.attr('data'),
                str = [];
            if ($this.children('td.answer').find('select').length > 0) {
                $this.children('td.answer').find('select').each(function () {
                    str.push($(this).val());
                });
                if (str[0] !== "") {
                    if (str[1] === "") {
                        str[1] = "0";
                    }
                } else {
                    return false;
                }
            } else if ($this.children('td.answer').find('input').length > 0) {
                type = $this.children('td.answer').find('input').attr('type');
                if (type == 'radio') {
                    name = $this.children('td.answer').find('input').attr('name');
                    if ($("[name='" + name + "']:checked").val()) {
                        str.push($("[name='" + name + "']:checked").val());
                    }
                } else {
                    $this.children('td.answer').find('input').each(function () {
                        if ($(this).val()) {
                            str.push($(this).val());
                        }
                    });
                }
                if (str.length <= 0) {
                    return false;
                }
            }
            return {
                id: id,
                value: str.join(',')
            };
        }
    };
    
    function readyCalender(){
        
        var mindate = param.sheet.dateFrom;
        var mindateFormat = new Date(mindate.replace(/-/g, '/'));
        
        $("#calender").datepicker({
            minDate : mindateFormat,
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
    
    //events
    $(document).on('click', '#img_tsugi', function () {
        if(document.getElementById("calender") .value == ""){
            alert("日付が入力されていません、日付を入力してください")
            return;
        }
        
        
        fn.answerSave();
    });
    $(document).off('click', '#img_modoru').on('click', '#img_modoru', function () {
        moveUrlWidthParam('./../menu_s/');
        //location.href = "./../menu_s/";
    });
    
    //run
    fn.init();
    
    //カレンダーの準備
    //readyCalender();
    
});