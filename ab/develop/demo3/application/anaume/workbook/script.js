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
        init: function () {
            var callback = function () {
                adminfn.getTable('anaume', fn.setPackageInfo);
            };
            adminfn.loginInfo(callback);
        },
        //基本情報
        setPackageInfo: function () {
            var num = Number(adminfn.takeGET().p),
                status = adminfn.param.status,
                category = status.CATEGORY;

            adminfn.displayUserInfo();

            $('.category').setOption(adminfn.SS.get('category'), category, 1);
            if (Number(category)) {
                adminfn.categorySelecter($('.school'), category, 'school', status.SCHOOL);
                adminfn.categorySelecter($('.grade'), category, 'grade', status.GRADE);
                adminfn.categorySelecter($('.curriculum'), category, 'curriculum', status.CURRICULUM);
            }
            $('.unit').setOption([], 1, 1);
            $('.share').setOption(adminfn.SS.get('share'), 1, 1);

            if (num) {
                fn.workbookOpen(num);
            }
        },
        //教材読み込み
        workbookOpen: function (num) {
            var sendData = {
                command: 'workbookOpen',
                param: num
            };
            $.ajax({
                url: './ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var i, ic, obj, array,
                    html = '',
                    $dom = $('#table02 .tBodyView');

                array = data.result;
                ic = array.length;
                if (ic) {
                    $dom.empty();
                    for (i = 0; i < ic; i += 1) {
                        obj = array[i];
                        html +=
                            '<tr>' +
                            '<td><input type="checkbox" value="' + obj.id + '" class="quesID"></td>' +
                            '<td class="page"></td>' +
                            '<td>' + obj.category + '</td>' +
                            '<td>' + obj.school + '</td>' +
                            '<td>' + obj.grade + '</td>' +
                            '<td>' + obj.curriculum + '</td>' +
                            '<td>' + obj.unit + '</td>' +
                            '<td>' + obj.title + '</td>' +
                            '</tr>';
                    }
                    $dom.html(html);
                    fn.setPageIndex();
                }

                obj = data.info;
                $('#category').setOption(adminfn.SS.get('category'), obj.category, 1);
                adminfn.categorySelecter($('#school'), obj.category, 'school', obj.school);
                adminfn.categorySelecter($('#grade'), obj.category, 'grade', obj.grade);
                adminfn.categorySelecter($('#curriculum'), obj.category, 'curriculum', obj.curriculum);
                adminfn.unitSelecter($('#unit'), obj.grade, obj.curriculum, obj.unit);
                $('#title').val(obj.title);
                $('#share').setOption(adminfn.SS.get('share'), obj.share, 1);

            });
        },
        //設問検索
        questionSearch: function () {
            var obj = {},
                sendData = {};

            $('#table01 .tHeadView select, #table01 .tHeadView input').each(function () {
                obj[$(this).attr('class')] = $(this).val();
            });

            sendData = {
                command: 'questionSearch',
                param: obj
            };

            $.ajax({
                url: './ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var i, ic, obj,
                    html = '',
                    $tbody = $('#table01 .tBodyView');

                $tbody.empty();
                if (data) {
                    for (i = 0, ic = data.length; i < ic; i += 1) {
                        obj = data[i];
                        html +=
                            '<tr>' +
                            '<td><input type="checkbox" value="' + obj.id + '" class="quesID"></td>' +
                            '<td>' + obj.category + '</td>' +
                            '<td>' + obj.school + '</td>' +
                            '<td>' + obj.grade + '</td>' +
                            '<td>' + obj.curriculum + '</td>' +
                            '<td>' + obj.unit + '</td>' +
                            '<td>' + obj.title + '</td>' +
                            '</tr>';
                    }
                    $tbody.html(html);
                }
            });
        },
        //問題集編集（並び替え）
        workbookSort: function () {
            $('#table03 .tBodyView').html($('#table02 .tBodyView tr').clone().removeClass('selectRow'));
            $('#table03 .tBodyView').sortable({
                update: fn.setPageIndex,
                helper: fn.helper1
            });

            $("#editModal").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                width: 'auto',
                height: 'auto',
                title: "設問の並び替え",
                dialogClass: 'editModal'
            });
            $('#editModal .cancel').on('click', function () {
                $("#editModal").dialog("close");
            });
        },
        //ドラッグ中のtr幅の不具合？対応
        helper1: function (e, tr) {
            var $originals = tr.children(),
                $helper = tr.clone();
            $helper.children().each(function (index) {
                $(this).width($originals.eq(index).width());
            });
            return $helper;
        },
        workbookExist: function (param, callback) {
            var sendData = {
                command: 'exist',
                param: param
            };

            $.ajax({
                url: './ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (data.flag) {
                    callback(param, data.flag);
                } else {
                    callback(param, null);
                }
            });
        },
        workbookSave: function (obj, flag) {
            var array, type, title, btn, sendData, callback;
            if (flag === 'true') {
                title = '問題集の上書き保存';
                btn = '上書き保存';
                type = 'update';
            } else if (flag === 'false') {
                title = '問題集の新規保存';
                btn = '新規保存';
                type = 'insert';
            } else {
                console.log('save type error');
                return false;
            }

            array = ['category', 'school', 'grade', 'curriculum', 'unit', 'share', 'title', 'contents'];
            $('#saveModal .infoItem').each(function (num, ele) {
                switch (array[num]) {
                case 'unit':
                    $(this).next('.infoCheck').html($('#unit option[value="' + obj.unit + '"]').text());
                    break;
                case 'title':
                    $(this).next('.infoCheck').html($('#title').val());
                    break;
                case 'contents':
                    $(this).next('.infoCheck').html(obj.contents.length + 'ページ');
                    break;
                default:
                    $(this).next('.infoCheck').html(adminfn.SS.getName(array[num], obj[array[num]]));
                    break;
                }
            });

            sendData = {
                command: type,
                param: obj
            };

            callback = function () {
                $(".ui-dialog-content").dialog("close");
                $.ajax({
                    url: './ajax.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(sendData)
                }).done(function (data) {
                    if (Number(data.result)) {
                        var url = "?p=" + data.result;
                        //URLパラメーター書き換え
                        history.replaceState(null, null, url);
                    }
                    adminfn.alertDialog('', btn + 'が完了しました。', null);
                });
            };

            $("#saveModal").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                width: 'auto',
                height: 'auto',
                title: title,
                dialogClass: 'saveModal',
                buttons: [
                    {
                        text: btn,
                        title: btn,
                        click: callback
                    },
                    {
                        text: 'キャンセル',
                        title: 'キャンセル',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        },
        paramCheck: function () {
            var obj,
                flag = false,
                param = {},
                message = '';

            param = {
                category: $('#category').val(),
                school: $('#school').val(),
                grade: $('#grade').val(),
                curriculum: $('#curriculum').val(),
                unit: $('#unit').val(),
                title: $('#title').val(),
                share: $('#share').val(),
                contents: $('#table03 .quesID').map(function () {
                    return $(this).val();
                }).get()
            };

            if (!param.category) {
                message += '「種別」';
            }
            if (!param.school) {
                message += '「学校」';
            }
            if (!param.grade) {
                message += '「学年」';
            }
            if (!param.curriculum) {
                message += '「教科」';
            }
            if (!param.unit) {
                message += '「テーマ」';
            }
            if (!param.share) {
                message += '「共有範囲」';
            }
            if (message) {
                message += 'が選択されていません。';
            }

            if (!param.title) {
                if (message) {
                    message += '<br/>';
                }
                message += '「タイトル」が入力されていません。';
            }
            if (!message) {
                flag = true;
            }

            obj = {
                flag: flag,
                param: param,
                message: message
            };
            return obj;
        },
        setPageIndex: function () {
            //各行に番号反映
            $('.tBodyView .page').each(function () {
                $(this).html($(this).closest('tr').index() + 1);
            });
        }
    };
}());


$(function () {
    'use strict';
    //events
    $(document).on('change', '#category', function () {
        //学校種別切り替え時イベント(保存用)
        var array, category = $(this).val();

        adminfn.categorySelecter($('#school'), category, 'school');
        adminfn.categorySelecter($('#grade'), category, 'grade');
        adminfn.categorySelecter($('#curriculum'), category, 'curriculum');
    }).on('change', '#category, #grade, #curriculum', function () {
        //単元切替(保存用)
        adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
    }).on('change', '#table01 .category', function () {
        //学校種別切り替え時イベント（検索用）
        var array, category = $(this).val();

        adminfn.categorySelecter($('#table01 .school'), category, 'school');
        adminfn.categorySelecter($('#table01 .grade'), category, 'grade');
        adminfn.categorySelecter($('#table01 .curriculum'), category, 'curriculum');
    }).on('change', '#table01 .category, #table01 .grade, #table01 .curriculum', function () {
        //単元切替（検索用）
        adminfn.unitSelecter($('#table01 .unit'), $('#table01 .grade').val(), $('#table01 .curriculum').val(), null);
    }).on('click', '#button_search', function () {
        //検索ボタン
        fn.questionSearch();
    }).on('click', '#button_sort', function () {
        //作成ボタン
        fn.workbookSort();
    }).on('click', '#button_reset', function () {
        //リセットボタン
        $('#table02 .tBodyView').empty();
    }).on('click', '#button_edit', function () {
        //並び替え後OKボタン

        var callback = function () {
            var obj = fn.paramCheck();
            if (obj.flag) {
                fn.workbookExist(obj.param, fn.workbookSave);
            } else {
                adminfn.alertDialog('未入力項目', obj.message, null);
            }
        };
        $('#pages').html($('#table02 .tBodyView tr').length + 'ページ');

        $('#infoModal').dialog({
            modal: true,
            draggable: false,
            resizable: false,
            width: 'auto',
            height: 'auto',
            title: '保存情報',
            dialogClass: 'infoModal',
            buttons: [
                {
                    text: 'O　K',
                    title: 'OK',
                    click: callback
                },
                {
                    text: 'キャンセル',
                    title: 'キャンセル',
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ]
        });
    }).on('click', '#table01 .tBodyView tr, #table02 .tBodyView tr', function () {
        //設問選択時処理
        var $tr = $(this),
            $input = $tr.find('.quesID');

        //選択用クラスの追加or削除
        if ($tr.hasClass('selectRow')) {
            $tr.removeClass('selectRow');
        } else {
            $tr.addClass('selectRow');
        }

        //追加・削除の結果にともなうチェックボックスのon/off
        if ($tr.hasClass('selectRow')) {
            $input.prop('checked', true);
        } else {
            $input.prop('checked', false);
        }
    }).on('click', '#quesAdd, #quesRm', function () {
        //移動・戻るの操作時
        if (this.id === 'quesAdd') {
            $('#table01 .quesID').each(function () {
                var $clone,
                    $dom = $(this);
                if ($dom.prop('checked')) {
                    $clone = $dom.closest('tr').clone(true);
                    $('#table02 .tBodyView').append($clone);
                    $clone.find('.quesID').closest('td').after('<td class="page"></td>');
                }
            });
        } else if (this.id === 'quesRm') {
            $('#table02 .quesID').each(function (num, ele) {
                var $dom = $(ele);
                if ($dom.prop('checked')) {
                    $dom.closest('tr').remove();
                }
            });
        }
    }).on('click', '.select', function () {
        //全選択・全解除
        var $target = $(this);
        if ($target.hasClass('on')) {
            $target.parent('div').find('.quesID').each(function () {
                $(this).prop('checked', true).closest('tr').addClass('selectRow');
            });
        } else {
            $target.parent('div').find('.quesID').each(function () {
                $(this).prop('checked', false).closest('tr').removeClass('selectRow');
            });
        }
    }).on('click', '#quesAdd, #quesRm, #button_reset', function () {
        var $dom;
        //頁カウント（各処理の部分で実行できるようにしたほうが良い？）
        $('.pages').html('ページ総数：' + $('#table02 .tBodyView tr').length);
        fn.setPageIndex();
    });

    //読み込み時処理実行
    fn.init();
});