/*global $:false, console, alert, adminfn, commonfn*/
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
                adminfn.getTable('anaume', function () {
                    var status = adminfn.param.status,
                        category = status.CATEGORY;

                    adminfn.displayUserInfo();

                    $('#category').setOption(adminfn.SS.get('category'), category, 1);

                    category = category || 1;
                    adminfn.categorySelecter($('#school'), category, 'school', status.SCHOOL);
                    adminfn.categorySelecter($('#grade'), category, 'grade', status.GRADE);
                    adminfn.categorySelecter($('#curriculum'), category, 'curriculum', status.CURRICULUM);
                    adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
                });
            };
            adminfn.loginInfo(callback);
        },
        //問題集検索
        packageSearch: 　 function () {
            var sendData = {
                command: 'packageSearch',
                param: {}
            };
            sendData.param.category = $('#category').val();
            sendData.param.school = $('#school').val();
            sendData.param.grade = $('#grade').val();
            sendData.param.curriculum = $('#curriculum').val();
            sendData.param.unit = $('#unit').val();
            sendData.param.title = $('#title').val();

            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var obj, i,
                    tr = '',
                    $tbody = $('.tBodyView');

                $tbody.empty();
                if (data.length > 0) {
                    for (i = 0; i < data.length; i += 1) {
                        obj = data[i];
                        tr +=
                            '<tr>' +
                            '<td><input type="radio" value="' + obj.Id + '" name="packageID" class="packageID" /></td>' +
                            '<td>' + adminfn.SS.getName('category', obj.Category) + '</td>' +
                            '<td>' + adminfn.SS.getName('school', obj.School) + '</td>' +
                            '<td>' + adminfn.SS.getName('grade', obj.Grade) + '</td>' +
                            '<td>' + adminfn.SS.getName('curriculum', obj.Curriculum) + '</td>' +
                            '<td>' + obj.Unit + '</td>' +
                            '<td>' + obj.Title + '</td>' +
                            '<td>' + obj.Contents.split(',').length + "ページ" + '</td>' +
                            '<td>' + obj.Auther + '</td>' +
                            '<td>' + adminfn.SS.getName('share', obj.Share) + '</td>' +
                            '<td>' + obj.Date + '</td>' +
                            '<td>' + obj.RenewalDate + '</td>' +
                            '</tr>';
                    }
                    $tbody.append(tr);

                } else {
                    console.log('response data 0');
                }

            }).always(function (data) {
                //console.log(data);
            });

        },
        //ソート
        sortCols: function (target) {
            var arrow = $('.sort', target),
                col = $('.tHeadView th').index(target);
            if (!arrow.length) {
                //「target」内の要素が「class="sort"」を持っていなければ
                return false;
            }
            arrow.html(arrow.html() === '▲' ? '▼' : '▲');

            $('.tBodyView').append(
                $('.tBodyView tr').sort(
                    function (a, b) {
                        if (arrow.html() === '▼') {
                            return $(a).children('td').eq(col).text() > $(b).children('td').eq(col).text() ? -1 : 1;
                        } else {
                            return $(a).children('td').eq(col).text() < $(b).children('td').eq(col).text() ? -1 : 1;
                        }
                    }
                )
            );
        },
        //問題集削除
        packageDelete: function () {
            var sendData = {
                command: 'packageDelete',
                param: {}
            };
            sendData.param.id = $("input:radio[name='packageID']:checked").val();
            //console.log(sendData);
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (data.result) {
                    adminfn.alertDialog("結果", data.result);
                    if (data.deleteID) {
                        //IDが返ってきたらこのIDを持つ行を削除
                        $('.packageID[value="' + data.deleteID + '"]').closest('tr').remove();
                    }
                }
            }).always(function (data) {
                //console.log(data);
            });
        }
    };
}());


$(function () {
    'use strict';
    //events
    $(document).on('change', '#category', function () {
        //学校種別切り替え時イベント
        var array, category = $(this).val();

        adminfn.categorySelecter($('#school'), category, 'school');
        adminfn.categorySelecter($('#grade'), category, 'grade');
        adminfn.categorySelecter($('#curriculum'), category, 'curriculum');
    }).on('click', '#button_search', function () {
        fn.packageSearch();
    }).on('change', '#category, #grade, #curriculum', function () {
        adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
    }).on('click', '#button_open', function () {
        //開くボタンでラジオボタンに対応したページへ遷移
        if (!$("input:radio[name='packageID']:checked").val()) {
            //チェックされていないときの処理
            adminfn.alertDialog("", "問題集を選択してください");
        } else {
            var linkId = $("input:radio[name='packageID']:checked").val();
            location.href = "./../workbook/?p=" + linkId;
        }
    }).on('click', '.tHeadView th', function () {
        fn.sortCols(this);
    }).on('click', '#button_delete', function () {
        //削除処理
        adminfn.alertDialog("注意", "選択した問題集を削除します。<br>本当によろしいですか？", fn.packageDelete);
    }).on('click', '.tBodyView tr', function () {
        //設問選択時処理
        var $tr = $(this),
            $input = $tr.find('.packageID');
        $input.prop('checked', false);
        $('.tBodyView tr').removeClass('selectRow');

        //選択用クラスの追加or削除
        if ($tr.hasClass('selectRow')) {
            $tr.removeClass('selectRow');
        } else {
            $tr.addClass('selectRow');
        }

        //チェックボックスのon/off
        if ($tr.hasClass('selectRow')) {
            $input.prop('checked', true);
        } else {
            $input.prop('checked', false);
        }
    });

    //読み込み時処理実行
    fn.init();
});