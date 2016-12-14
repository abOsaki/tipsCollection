/*global $, console, alert, adminfn, commonfn*/
commonfn.loginCheck(
    function () {
        'use strict';
    },
    function () {
        'use strict';
        location.href = "./../index/";
    }
);

var fn = (function () {
    'use strict';
    return {
        //読み込み時処理
        init: function () {
            var callback;
            callback = function () {
                var callback;
                //ログイン情報反映
                callback = function () {
                    adminfn.displayUserInfo();
                };
                adminfn.loginInfo(callback);

                //作成画面生成
                fn.editTable(10);
                $(".tBodyView .largeCategory").setOption(adminfn.SS.get('largeCategory'), null, 1);
                $(".tBodyView .middleCategory").setOption(adminfn.SS.get('middleCategory01'), null, 1);
                $(".tBodyView .date").datepicker().datepicker('setDate', 'today');
                //誤動作防止の為フォーカスを外す
                $(".date").blur();
            };
            adminfn.getTable('tamatebako', callback);
        },
        chiezouInsert: function () {
            var key, title, message, callback,
                sendData, itemObj, sendObjList, saveObj, saveList, j, jl;
            sendObjList = [];
            saveList = ["date", "largeCategory", "middleCategory", "keyword", "content", "cause", "countermeasure"];

            $.each($(".tBodyView").children('tr'), function (index, row) {
                row = $(row);
                saveObj = {};
                for (j = 0, jl = saveList.length; j < jl; j += 1) {
                    key = saveList[j];
                    itemObj = row.find("." + key).val();
                    if (itemObj) {
                        if (key === "date") {
                            itemObj = itemObj.replace(/\//g, "-");
                        } else if (key === "keyword") {
                            itemObj = itemObj.replace(/\r/g, "").replace(/\n/g, ",");
                        }
                        saveObj[key] = itemObj;
                    } else {
                        saveObj[key] = null;
                    }
                }

                if (saveObj.keyword || saveObj.content || saveObj.cause || saveObj.countermeasure) {
                    sendObjList.push(saveObj);
                }
            });
            sendData = {
                "command": "insert",
                "param": sendObjList
            };
            //console.log(JSON.stringify(sendObjList));

            $.ajax({
                url: "./ajax.php",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(sendData)
            }).done(function () {
                title = "";
                message = "正常に保存されました。";
                //保存の際に入力内容をリセット
                callback = fn.init;
                adminfn.alertDialog(title, message, callback);
                //console.log("OK");
            }).fail(function () {
                title = "";
                message = "保存の際にエラーが発生しました。";
                callback = null;
                adminfn.alertDialog(title, message, callback);
                //console.log("fail");
            }).always(function (data) {
                //console.log("complete");
            });
        },

        editTable: function (num) {
            var newHtml, trHtml, i, il;

            //1行分生成
            newHtml = "";
            trHtml +=
                "<tr>" +
                "<td><input type='text' class='date' /><br /><button>カレンダー</button></td>" +
                "<td><select class='largeCategory'></select></td>" +
                "<td><select class='middleCategory'></select></td>" +
                "<td><textarea class='keyword' maxlength='200' placeholder='キーワード毎に改行'></textarea></td>" +
                "<td><textarea class='content' maxlength='200' placeholder='200字以内'></textarea></td>" +
                "<td><textarea class='cause' maxlength='200' placeholder='200字以内'></textarea></td>" +
                "<td><textarea class='countermeasure' maxlength='200' placeholder='200字以内'></textarea></td>" +
                "</tr>";

            for (i = 0, il = num; i < il; i += 1) {
                newHtml += trHtml;
            }
            //まとめて置き換え
            $(".tBodyView").html(newHtml);
        },
        inputChecker: function () {
            var $kw, $ct, $cs, $cm, $ele,
                $tr = $(".tBodyView tr"),
                checkFlag = true;

            $tr.each(function () {
                $kw = $(this).find(".keyword").first();
                $ct = $(this).find(".content").first();
                $cs = $(this).find(".cause").first();
                $cm = $(this).find(".countermeasure").first();

                if ($kw.val() || $ct.val() || $cs.val() || $cm.val()) {
                    $ele = $kw;
                    //キーワード
                    if (!$ele.val()) {
                        $ele.addClass("alertHighlight");
                        checkFlag = false;
                    } else {
                        $ele.removeClass("alertHighlight");
                    }
                    //内容
                    $ele = $ct;
                    if (!$ele.val()) {
                        $ele.addClass("alertHighlight");
                        checkFlag = false;
                    } else {
                        $ele.removeClass("alertHighlight");
                    }
                    //原因
                    $ele = $cs;
                    if (!$ele.val()) {
                        $ele.addClass("alertHighlight");
                        checkFlag = false;
                    } else {
                        $ele.removeClass("alertHighlight");
                    }
                    //対処
                    $ele = $cm;
                    if (!$ele.val()) {
                        $ele.addClass("alertHighlight");
                        checkFlag = false;
                    } else {
                        $ele.removeClass("alertHighlight");
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
    $(document).on("click", "#button_save", function () {
        //保存ボタン
        var title, message, callback;
        message = "";
        if (!fn.inputChecker()) {
            message = "未入力の項目があります。</p><p>";
        }
        title = "";
        message +=
            "保存して入力画面をリフレッシュいたしますがよろしいですか？";
        callback = fn.chiezouInsert;
        adminfn.alertDialog(title, message, callback);
    }).on("change", ".tBodyView .largeCategory", function () {
        //テーブル内中項目
        var $mC;
        $mC = $(this).parents("tr").find(".middleCategory").first();
        commonfn.lCselecter($(this).val(), $mC);
    }).on('click', ".tBodyView button", function () {
        //datepicker
        $(this).parent('td').children('input.hasDatepicker').datepicker('show');
    });

    //読み込み時処理実行
    fn.init();
}());