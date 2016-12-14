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
        packageSearch: function () {
            var sendData = {
                command: 'packageSearch',
                param: {}
            };
            fn.SearchGenerated(sendData);

        },
        //設問検索
        questionSearch: function () {
            var sendData = {
                command: 'questionSearch',
                param: {}
            };
            fn.SearchGenerated(sendData);
        },

        //検索結果を生成
        SearchGenerated: function (sendData) {

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
                var obj, i, checkSelect,
                    tr = '',
                    $tbody = $('.tBodyView');

                $tbody.empty();
                if (data.length > 0) {
                    for (i = 0; i < data.length; i += 1) {
                        obj = data[i];
                        checkSelect = $("input:radio[name='eduType']:checked").val();
                        if (checkSelect === "question") {
                            obj.Contents = "";
                        }
                        obj.length = obj.Contents.split(',').length;
                        tr +=
                            '<tr>' +
                            '<td><input type="radio" value="' + obj.Id + '" name="' + checkSelect + 'ID" class="' + checkSelect + 'ID"/></td>' +
                            '<td>' + adminfn.SS.getName('category', obj.Category) + '</td>' +
                            '<td>' + adminfn.SS.getName('school', obj.School) + '</td>' +
                            '<td>' + adminfn.SS.getName('grade', obj.Grade) + '</td>' +
                            '<td>' + adminfn.SS.getName('curriculum', obj.Curriculum) + '</td>' +
                            '<td>' + obj.Unit + '</td>' +
                            '<td>' + obj.Title + '</td>' +
                            '<td>' + obj.length + "ページ" + '</td>' +
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
        if ($("input:radio[name='eduType']:checked").val() === "question") {
            fn.questionSearch();
        } else {
            fn.packageSearch();
        }
    }).on('change', '#category, #grade, #curriculum', function () {
        adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
    }).on('click', '#button_open', function () {
        //ラジオボタンの選択内容による遷移
        var select, linkId,
            packageId = $("input:radio[name='packageID']:checked").val(),
            questionId = $("input:radio[name='questionID']:checked").val();
        if ($("input:radio[name='eduType']:checked").val() === "question") {
            select = "q";
            linkId = questionId;
        } else {
            select = "p";
            linkId = packageId;
        }
        if (!(linkId)) {
            //チェックされていないときの処理
            adminfn.alertDialog("", "選択してください");
        } else {
            location.href = "./../education/?" + select + "=" + linkId;
        }
    }).on('click', '.tBodyView tr', function () {
        //設問選択時処理
        var $tr = $(this),
            $input = $tr.find('.questionID, .packageID');
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
    }).on('click', '.tHeadView th', function () {
        fn.sortCols(this);
    });

    //読み込み時処理実行
    fn.init();
});