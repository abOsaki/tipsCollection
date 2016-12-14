/*global $, console, alert, adminfn, commonfn*/
commonfn.loginCheck(
    function () {
        'use strict';
    },
    function () {
        'use strict';
        location.href = './../index/';
    }
);

var fn = (function () {
    'use strict';
    return {
        //読み込み時処理
        init: function () {
            var callback;
            callback = function () {
                var callback,
                    date = new Date();
                //ログイン情報反映
                callback = function () {
                    adminfn.displayUserInfo();
                };
                adminfn.loginInfo(callback);

                $('#largeCategory').setOption(adminfn.SS.get('largeCategory'), null, 1);
                $('#middleCategory').setOption(adminfn.SS.get('middleCategory01'), null, 1);

                $('#year').setOption(adminfn.dateOptions.year(2016, 2020), date.getFullYear(), null);
                $('#month').setOption(adminfn.dateOptions.month(), date.getMonth() + 1, null);

                fn.editTable();
            };
            adminfn.getTable('tamatebako', callback);
        },
        deleteFlagSwitch: function ($dom) {
            //classNameがdeleteBtn,restoreBtnで切替
            var command = null,
                sendData = {};

            if ($dom.hasClass('deleteBtn')) {
                command = 'delete';
            }
            if ($dom.hasClass('restoreBtn')) {
                command = 'restore';
            }
            if (!command) {
                return false;
            }

            sendData = {
                command: command,
                param: $dom.val()
            };
            //console.log(JSON.stringify(sendData));

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (flag) {
                switch (flag) {
                case 'deleteOK':
                    $dom.attr('class', 'restoreBtn id').text('復元').parents('tr:first').attr('class', 'deleteRow disableHighlight').find('select, input, textarea, button:contains("カレンダー")').attr('disabled', true);
                    break;
                case 'restoreOK':
                    $dom.attr('class', 'deleteBtn id').text('削除').parents('tr:first').removeAttr('class').find('select, input, textarea, button').removeAttr('disabled');
                    break;
                default:
                    return false;
                }
                //console.log("OK");
            }).fail(function () {
                //console.log("fail");
            }).always(function () {
                //console.log("complete");
            });
        },
        fetchNew: function () {
            fn.fetch(null);
        },
        //ほうれんそうからの読み込み
        fetch: function (indexIdList) {
            var sendData = {
                command: 'fetch',
                param: indexIdList
            };
            //console.log(JSON.stringify(sendObjList));

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function () {
                //console.log("OK");
            }).always(function (data) {
                //console.log(data);
            });
        },
        chiezouInsert: function () {
            var key, title, message, saveFlag, callback,
                sendData, itemObj, sendObjList, saveObj, saveList, j, jl;
            saveFlag = false;
            sendObjList = [];
            saveList = ['id', 'date', 'largeCategory', 'middleCategory', 'keyword', 'content', 'cause', 'countermeasure'];
            $.each($('.tBodyView:first').children('tr'), function (index, row) {
                saveFlag = false;
                row = $(row);
                saveObj = {};
                for (j = 0, jl = saveList.length; j < jl; j += 1) {
                    key = saveList[j];
                    itemObj = row.find('.' + key).val();
                    if (itemObj) {
                        if (key === 'date') {
                            itemObj = itemObj.replace(/\//g, '-');
                        } else if (key === 'keyword') {
                            itemObj = itemObj.replace(/\r/g, '').replace(/\n/g, ',');
                        }
                        saveObj[key] = itemObj;
                        //一つでもデータがあれば保存
                        saveFlag = true;
                    } else {
                        saveObj[key] = null;
                    }
                }
                if (saveFlag) {
                    sendObjList.push(saveObj);
                }
            });

            sendData = {
                command: 'insert',
                param: sendObjList
            };

            $.ajax({
                url: "./ajax.php",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(sendData)
            }).done(function () {
                title = '';
                message = '正常に保存されました。';
                callback = null;
                adminfn.alertDialog(title, message, callback);
                //console.log("OK");
            }).fail(function () {
                title = '';
                message = '保存の際にエラーが発生しました。';
                callback = null;
                adminfn.alertDialog(title, message, callback);
                //console.log("fail");
            });
        },

        editTable: function () {
            var seachParam, sendData, yyyy, mm,
                $tBody = $(".tBodyView:first");

            $tBody.empty();
            //日付
            yyyy = $("#year").val();
            mm = ("0" + $("#month").val()).slice(-2);
            seachParam = {
                fromDate: yyyy + "-" + mm + "-00",
                toDate: yyyy + "-" + mm + "-31",
                largeCategory: $("#largeCategory").val() || null,
                middleCategory: $("#middleCategory").val() || null,
                keyword: $("#keyword").val() || null,
                content: $("#content:checked").val() || null,
                cause: $("#cause:checked").val() || null,
                countermeasure: $("#countermeasure:checked").val() || null
            };

            sendData = {
                command: 'search',
                param: seachParam
            };

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (dataList) {
                var $tr, itemHtml, i, il;
                for (i = 0, il = dataList.length; i < il; i += 1) {
                    $tr = $('<tr/>');

                    itemHtml =
                        "<td><input type='text' class='date' /><br /><button>カレンダー</button><br />";

                    //削除ボタン
                    if (dataList[i].deleteFlag) {
                        itemHtml += "<button class='restoreBtn id' value='" + dataList[i].id + "'>復元</button>";
                        $tr.attr("class", "deleteRow");
                    } else {
                        itemHtml += "<button class='deleteBtn id' value='" + dataList[i].id + "'>削除</button>";
                    }

                    //読み込みボタン
                    if (dataList[i].indexID) {
                        //元データが更新されていた場合のみ付加
                        //itemHtml += "<button class='hourensouLoad' value='" + dataList[i].indexID + "'>更新データ</button>";
                    }
                    itemHtml +=
                        "</td>" +
                        "<td><select class='largeCategory'></select></td>" +
                        "<td><select class='middleCategory'></select></td>" +
                        "<td><textarea class='keyword' maxlength='200' placeholder='キーワード毎に改行'>" + dataList[i].keyword.replace(/\,/g, "\r\n") + "</textarea></td>" +
                        "<td><textarea class='content' maxlength='200' placeholder='200字以内'>" + dataList[i].content + "</textarea></td>" +
                        "<td><textarea class='cause' maxlength='200' placeholder='200字以内'>" + dataList[i].cause + "</textarea></td>" +
                        "<td><textarea class='countermeasure' maxlength='200' placeholder='200字以内'>" + dataList[i].countermeasure + "</textarea></td>";
                    $tr.html(itemHtml);
                    $tr.find('.date:first').val(dataList[i].date.replace(/-/g, '/')).datepicker();
                    $tr.find('.largeCategory:first').setOption(adminfn.SS.get('largeCategory'), dataList[i].largeCategory, 1);
                    commonfn.lCselecter(dataList[i].largeCategory, $tr.find('.middleCategory:first')).val(dataList[i].middleCategory);
                    $tBody.append($tr);
                }

                //削除対象行であるならば編集不可
                $('.deleteRow').find('select, input, textarea').attr('disabled', true);
                //console.log("OK");
            });
        },
        inputChecker: function () {
            var $kw, $ct, $cs, $cm, $ele,
                $tr = $('.tBodyView:first tr'),
                checkFlag = true;

            $tr.each(function () {
                $kw = $(this).find(".keyword:first");
                $ct = $(this).find(".content:first");
                $cs = $(this).find(".cause:first");
                $cm = $(this).find(".countermeasure:first");

                if ($kw.val() || $ct.val() || $cs.val() || $cm.val()) {
                    $ele = $kw;
                    //キーワード
                    if (!$ele.val()) {
                        $ele.addClass('alertHighlight');
                        checkFlag = false;
                    } else {
                        $ele.removeClass('alertHighlight');
                    }
                    //内容
                    $ele = $ct;
                    if (!$ele.val()) {
                        $ele.addClass('alertHighlight');
                        checkFlag = false;
                    } else {
                        $ele.removeClass('alertHighlight');
                    }
                    //原因
                    $ele = $cs;
                    if (!$ele.val()) {
                        $ele.addClass('alertHighlight');
                        checkFlag = false;
                    } else {
                        $ele.removeClass('alertHighlight');
                    }
                    //対処
                    $ele = $cm;
                    if (!$ele.val()) {
                        $ele.addClass('alertHighlight');
                        checkFlag = false;
                    } else {
                        $ele.removeClass('alertHighlight');
                    }
                }
            });
            return checkFlag;
        }
    };
}());

(function () {
    'use strict';
    //events
    $(document).on('click', '#button_search', function () {
        //検索実行
        fn.editTable();
    }).on('click', '#button_save', function () {
        //保存処理
        var title, message, callback;
        message = '';
        if (!fn.inputChecker()) {
            message = '未入力の項目があります。</p><p>';
        }
        title = '';
        message += '入力した内容で上書き保存いたしますがよろしいですか？';
        callback = fn.chiezouInsert;
        adminfn.alertDialog(title, message, callback);
    }).on('click', '.deleteBtn, .restoreBtn', function () {
        //削除処理
        var title, message, callback, $dom;
        $dom = $(this);
        title = "";
        if ($dom.hasClass('deleteBtn')) {
            message = 'データを削除しますがよろしいですか？';
        } else if ($dom.hasClass("restoreBtn")) {
            message = 'データを復元しますがよろしいですか？';
        }
        callback = function () {
            fn.deleteFlagSwitch($dom);
        };
        adminfn.alertDialog(title, message, callback);
    }).on('change', '#largeCategory', function () {
        //メニュー内中項目
        commonfn.lCselecter($(this).val(), $('#middleCategory'));
    }).on('change', '.largeCategory', function () {
        //テーブル内中項目
        var $mC = $(this).closest('tr').find('.middleCategory:first');
        commonfn.lCselecter($(this).val(), $mC);
    }).on('click', '.tBodyView button:contains("カレンダー")', function () {
        //datepicker
        $(this).parent('td').children('input.hasDatepicker').datepicker('show');
    });

    //読み込み時処理実行
    fn.init();
}());