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
        previewList: [],
        //読み込み時処理
        init: function () {
            var callback;
            callback = function () {
                var callback;
                callback = function () {
                    adminfn.displayUserInfo();
                };
                adminfn.loginInfo(callback);

                $('#largeCategory').setOption(adminfn.SS.get('largeCategory'), null, 1);
                $('#middleCategory').setOption(adminfn.SS.get('middleCategory01'), null, 1);

            };
            adminfn.getTable('tamatebako', callback);
        },
        previewCount: function (time, idNum) {
            var sendParam, sendData;
            sendParam = {
                viewingTime: time,
                chiezouId: idNum
            };
            sendData = {
                command: 'count',
                param: sendParam
            };

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                console.log('OK');
            });
        },
        previewCheck: {
            sT: 0,
            eT: 0,
            getViewingTime: function () {
                var diff = fn.previewCheck.eT - fn.previewCheck.sT;
                fn.previewCheck.sT = 0;
                fn.previewCheck.eT = 0;
                return diff;
            },
            nowTime: function () {
                var date = new Date();
                return date.getTime();
            },
            startTime: function (idNum) {
                //開始時間
                fn.previewCheck.sT = fn.previewCheck.nowTime();
            },
            endTime: function (idNum) {
                //終了時間
                fn.previewCheck.eT = fn.previewCheck.nowTime();

                //閲覧記録を保存
                fn.previewCount(fn.previewCheck.getViewingTime(), idNum);
            }
        },
        chiezouPreview: function (previewData) {
            $('#naiyouText').html(previewData.content);
            $('#geninText').html(previewData.cause);
            $('#taishoText').html(previewData.countermeasure);

            //閲覧開始
            fn.previewCheck.startTime(previewData.id);

            $('#chiezouModal').dialog({
                modal: true,
                width: 800,
                draggable: false,
                resizable: false,
                buttons: [
                    {
                        text: "戻る",
                        title: "戻る",
                        click: function () {
                            if (previewData.prevNum - 1 >= 0) {
                                //閲覧終了
                                fn.previewCheck.endTime(previewData.id);
                                fn.chiezouPreview(fn.previewList[previewData.prevNum - 1]);
                            }
                        }
                    },
                    {
                        text: "次へ",
                        title: "次へ",
                        click: function () {
                            if (fn.previewList[previewData.prevNum + 1]) {
                                //閲覧終了
                                fn.previewCheck.endTime(previewData.id);
                                fn.chiezouPreview(fn.previewList[previewData.prevNum + 1]);
                            }
                        }
                    },
                    {
                        text: "閉じる",
                        title: "閉じる",
                        click: function () {
                            //閲覧終了
                            fn.previewCheck.endTime(previewData.id);
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        },
        chiezouPreviewEvent: function (e) {
            fn.chiezouPreview(e.data);
        },
        chiezouSearch: function () {
            var seachParam, sendData,
                $tbody = $(".tBodyView:first");

            seachParam = {
                largeCategory: $('#largeCategory').val() || null,
                middleCategory: $('#middleCategory').val() || null,
                keyword: $('#keyword').val()
            };
            //console.log(seachParam);

            sendData = {
                command: 'search',
                param: seachParam
            };


            $tbody.empty();
            $.ajax({
                url: 'ajax.php',
                type: "POST",
                dataType: "json",
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var $newTBodyObj, $trObj,
                    resultList, obj,
                    itemList, itemObj,
                    itemHtml, contentHtml, causeHtml, countermeasureHtml, i, il;
                resultList = [];
                itemList = data;

                //結果反映
                $tbody.empty();
                for (i = 0, il = itemList.length; i < il; i += 1) {
                    itemObj = itemList[i];
                    //console.log(itemObj);

                    //各項目HTML生成
                    contentHtml = '<p>' + itemObj.content.replace(/[\n\r]/g, '</p><p>') + '</p>';
                    causeHtml = '<p>' + itemObj.cause.replace(/[\n\r]/g, '</p><p>') + '</p>';
                    countermeasureHtml = '<p>' + itemObj.countermeasure.replace(/[\n\r]/g, '</p><p>') + '</p>';

                    //1行分生成
                    //対象行クリック時INDEX番号でchiezouPreviewEventを実行
                    itemHtml =
                        '<td>' + contentHtml + '</td>' +
                        '<td>' + causeHtml + '</td>' +
                        '<td>' + countermeasureHtml + '</td>';

                    obj = {
                        prevNum: i,
                        id: itemObj.id,
                        content: contentHtml,
                        cause: causeHtml,
                        countermeasure: countermeasureHtml
                    };
                    //プレビュー用リスト
                    resultList.push(obj);

                    $trObj = $('<tr/>').append(itemHtml).on('click', obj, fn.chiezouPreviewEvent);
                    //tbodyにtrを追加
                    $tbody.append($trObj);
                }
                //プレビュー用に格納
                fn.previewList = resultList;
            });
        }
    };
}());

(function () {
    'use strict';
    //events
    $(document).on('change', '#largeCategory', function () {
        //テーブル内中項目
        commonfn.lCselecter($(this).val(), $('#middleCategory'));
    }).on('click', '#button_search', function () {
        //検索実行
        fn.chiezouSearch();
    });

    //読み込み時処理実行
    fn.init();
}());