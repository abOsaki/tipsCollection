/*global $, console, alert, comfn, param*/
$(function () {
    'use strict';
    //definition
    var fn = {
        //右テーブルに質問項目を作成する
        generateQuestion: function () {
            $('#table02 tbody').empty();
            var i, node, obj,
                questionList = $('.theme').val().split(','),
                list = comfn.SS.get('question');

            for (i = 0; i < questionList.length; i += 1) {
                node = questionList[i];

                obj = list.filter(function (item, index) {
                    if (item.id == node) {
                        return true;
                    }
                })[0];

                if (obj) {
                    comfn.generateQuestion([obj], $('#table02 tbody'), 'admin',(i+1));
                }
            }

            $('#table02 th,#table02 td').css('border', 'solid 1px #727272');

            //datepicker設定
            $.datepicker.formatDate("yy-mm-dd", new Date(2007, 1 - 1, 26));
            $.datepicker.setDefaults($.datepicker.regional.ja);
            $(".dateFrom").datepicker();
            $(".dateTo").datepicker();
        },
        //モーダルで生徒への質問画面のプレビューを表示する。
        generatePreview: function () {
            if ($('#basicInfo .title').val() == "") {
                comfn.message_ok('未入力', 'タイトルを入力して下さい。', function () {});
                return;
            }

            if ($('#table02 tbody tr').length == 0) {
                comfn.message_ok('未選択', '質問が選択されていません。', function () {});
                return;
            }
            $('#questionBox_prev table thead').html($('#table02 .tableHeader table thead tr').clone(true));
            $('#questionBox_prev table tbody').html($('#table02 .tableHeader table tbody tr .check[type="checkbox"]:checked').closest('tr').clone(true));

            $('#questionBox_prev').dialog({
                modal: true,
                draggable: true,
                width: 1000,
                height: 800,
                buttons: {
                    "問題がないので保存する": function () {
                        fn.packageSave();
                        comfn.message_ok('完了', '保存が完了しました！', function () {
                            $('#questionBox_prev').dialog("close");
                        });
                    },
                    "修正する": function () {
                        $("#questionBox_prev").dialog("close");
                    }
                }
            });
        },
        //右テーブルで選択解除されたら、右テーブルの要素を削除し、左テーブルのチェックを外す。
        affectTable1: function ($this) {
            var value;
            if ($this.is(':checked')) {
                console.log('check');
            } else {
                value = $this.val();
                $this.parent().parent().remove();
                $('#table01').find("tr[data=" + value + "]").find('.check').prop('checked', '');
            }
        },
        packageSave: function () {
            var sendData = {},
                content = [],
                prefix = $("#basicInfo .group").val() === "1" ? 'E' : 'H';

            $('#prevWrapper .scrollBody tr').each(function () {
                content.push($(this).attr('data'));
                sendData.borderine = '123';
            });

            sendData = {
                'command': 'packageSave',
                'param': {
                    sheetID: comfn.takeGET().p || '',
                    author: param.status.USERID,
                    group: $("#basicInfo .group").val(),
                    purpose: $("#basicInfo .theme").val(),
                    title: $('#basicInfo .title').val(),
                    share: $('#basicInfo .share').val(),
                    dateFrom: $('#table02 .dateFrom').val(),
                    dateTo: $('#table02 .dateTo').val(),
                    contents: content.join(',')
                }
            };

            sendData.param['school' + prefix] = $('#basicInfo .school').val();
            sendData.param['grade' + prefix] = $('#basicInfo .grade').val();
            sendData.param['class' + prefix] = $('#basicInfo .grade').val();
            sendData.param['curriculum' + prefix] = "1";


            console.log(sendData);

            //            $.ajax({
            //                url: 'ajax.php',
            //                type: 'POST',
            //                dataType: 'json',
            //                data: JSON.stringify(sendData)
            //            }).done(function (data) {
            //                console.log(data);
            //            }).always(function (data) {
            //                console.log(data);
            //            });
        },
        getSheet: function (sheetID) {
            var sendData,
                obj = {};

            obj.id = sheetID;

            sendData = {
                command: 'sheet',
                param: obj
            };

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                console.log(data);
            }).always(function (data) {
                console.log(data);
            });
        },
        init: function () {
            //ログインチェック
            comfn.loginCheck();
            //SessionStorageの取得とBasicInfoへの値設定
            comfn.setBasicInfo();
            //テーマテーブルを取得しセレクトボックスに反映
            //そのままだと使えないので，配列の形式を変換して格納している
            comfn.getTableMaster({
                table: ['theme'],
                callback: function () {
                    var i, node,
                        array = [],
                        list = comfn.SS.get('theme');
                    for (i = 0; i < list.length; i += 1) {
                        node = list[i];
                        array.push({
                            id: node.question_no,
                            name: node.name
                        });
                    }
                    $('#basicInfo .theme').setOption(array);

                    //Masterテーブルを取得
                    comfn.getTableMaster({
                        table: ['question'],
                        'delete_flag': 'on',
                        callback: function () {

                            param.GET = comfn.takeGET();
                            if (param.GET.p) {
                                //パラメータが存在したら
                                //ajaxで該当のシートを取得し
                                //セレクトボックスのテーマの値を変更し，triggerでchangeイベントをを発火
                                //表示された質問に，チェック項目のステータスと目標，注意ラインを当て込む
                                fn.getSheet(param.GET.p);
                            } else {
                                //パラメータが無かったら新規なので，初期表示
                                $('#basicInfo .theme').trigger('change');
                            }
                        }
                    });
                }
            });
        }
    };

    //events
    $(document).on('click', 'input.select', function () {
        //選択ボタンをクリックされたら配下のチェックボックスを全チェックする
        $(this).parent().find('.check').prop('checked', 'checked').trigger('change');
    }).on('click', '.release', function () {
        //解除ボタンをクリックされたら配下のチェックボックスを全チェックする
        $(this).parent().find('.check').prop('checked', '').trigger('change');
    }).on('click', '#img_kakunin', function () {
        //確認ボタンを押したらモーダルで生徒への質問画面のプレビューを表示する。
        fn.generatePreview();
    }).on('change', '.theme', function () {
        fn.generateQuestion();
    });
    //run
    fn.init();
});