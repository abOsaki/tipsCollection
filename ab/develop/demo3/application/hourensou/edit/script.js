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
            var date = new Date(),
                yyyy = date.getFullYear(),
                mm = date.getMonth() + 1,
                dd = date.getDate();

            $('#reportTab').click();

            commonfn.setYearOption(2015, 2020, yyyy);
            commonfn.setMonthOption(mm);
            commonfn.setDayOption(yyyy, mm, dd);

            sessionStorage.clear();
            adminfn.getTable('hourensou', function () {
                var array = [{
                    id: null,
                    name: '【学校種別】'
                }];
                $('#group').setOption($.merge(array, adminfn.SS.get('group')), null, null);

                array = [{
                    id: null,
                    name: '【学校名】'
                }];
                $('#school').setOption(array, null, null);
                fn.editTable();
            });
        },
        editTable: function () {
            //array = confirm.SS.get();
            var i, ic,
                $tbody = $('<tbody/>'),
                array = adminfn.SS.get('timetable');
            for (i = 0, ic = array.length; i < ic; i += 1) {
                $tbody.append(
                    $('<tr/>').append(
                        $('<td/>').append(
                            array[i].name
                        )
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'location'
                        }).setOption(adminfn.SS.get('location'), null, 1))
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'business'
                        }).setOption(adminfn.SS.get('business'), null, 1))
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'businessItem'
                        }).setOption([], null, 1))
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'grade'
                        }).setOption([], null, 1))
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'class'
                        }).setOption([], null, 1))
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'curriculum'
                        }).setOption([], null, 1))
                    ).append(
                        $('<td/>').append($('<select/>', {
                            'class': 'unit'
                        }).setOption([], null, 1))
                    )
                );
            }
            $('#reportBody').append($tbody.children('tr'));
        },
        businessSelecter: function ($business) {
            var $item = $business.closest('tr').find('.businessItem:first'),
                num = Number($business.val());
            switch (num) {
            case 1:
                $item.setOption(adminfn.SS.get('preparationOfLesson'), null, 1);
                break;
            case 2:
                $item.setOption(adminfn.SS.get('lesson'), null, 1);
                break;
            case 3:
                $item.setOption(adminfn.SS.get('lessonAfter'), null, 1);
                break;
            case 4:
                $item.setOption(adminfn.SS.get('trouble'), null, 1);
                break;
            case 5:
                $item.setOption(adminfn.SS.get('maintenance'), null, 1);
                break;
            case 0:
                $item.setOption(adminfn.SS.get('other'), null, 1);
                break;
            default:
                break;
            }
        },
        checkReport: function () {

        },
        checkICT: function () {

        },
        checkDemand: function () {

        },
        getReport: function () {
            var $row,
                $tbody = $('#reportBody'),
                obj = {},
                cols = ['location', 'business', 'businessItem', 'grade', 'class', 'curriculum', 'unit'];

            $.each($tbody.children('tr'), function (index, row) {
                $row = $(row);
                for (i = 0, ic = cols.length; i < ic; i += 1) {
                    key = cols[i];
                    value = $row.find('.' + cols[i]).val();
                    array[key] = value;
                }
            });

        },
        getICT: function () {

        },
        getDemand: function () {

        },
        getReportData: function () {
            var obj = {};

            if (fn.checkReport() && fn.checkICT() && fn.checkDemand()) {
                obj = {
                    report: fn.getReport(),
                    ictReport: fn.getICT(),
                    reportDemand: fn.getDemand()
                };
            } else {
                console.log('check alert');
            }



            //            var obj = {},
            //                list = {
            //                    reportBody: ['location', 'business', 'businessItem', 'grade', 'class', 'curriculum', 'unit'],
            //                    ictBody: [],
            //                    demandBody: []
            //                };
            //
            //            //各報告のtbodyから必要な項目のvalueを収集
            //            $.each(list, function (tbodyName, cols) {
            //                obj[tbodyName] = [];
            //                //一行ごとに収集
            //                $.each($('#' + tbodyName).children('tr'), function (index, row) {
            //                    var i, ic, key, value,
            //                        rowFlag = false, //行内にデータがあるか
            //                        colFlag = false, //各項目の入力条件
            //                        array = [],
            //                        $row = $(row);
            //
            //                    //項目のvalueを収集
            //                    for (i = 0, ic = cols.length; i < ic; i += 1) {
            //                        key = cols[i];
            //                        value = $row.find('.' + cols[i]).val();
            //                        if (!rowFlag && value) {
            //                            rowFlag = true;
            //                        }
            //
            //                        //各項目収集
            //                        array.push({
            //                            key: value
            //                        });
            //                    }
            //
            //                    //業務報告のとき「時間割」を追加
            //                    if (tbodyName === 'reportBody') {
            //                        if (rowFlag) {
            //                            array.unshift({
            //                                timetable: index + 1
            //                            });
            //                        }
            //                        colFlag = fn.reportCheck(array);
            //                    }
            //
            //                    if (rowFlag && colFlag) {
            //                        obj[tbodyName].push(array);
            //                    }
            //                });
            //            });
            //収集データ
            console.log(obj);
            //return obj;
        },
        insertReports: function (data) {
            var sendData = {
                commond: 'save',
                param: data
            };
        }
    };
}());


(function () {
    'use strict';
    //events
    $(document).on('change', '#year, #month', function () {
        commonfn.setDayOption($('#year').val(), $('#month').val(), $('#day').val());
    }).on('click', '.menuTab', function () {
        //一度すべてnone化
        $('#submit, #prevMonthButton, #nextMonthButton, #viewDate').css('display', 'none');
        //表示箇所をinline化
        if ($(this).hasClass('blueTab')) {
            $('#submit').css('display', 'inline');
        } else if ($(this).hasClass('greenTab')) {
            $('#prevMonthButton, #nextMonthButton, #viewDate').css('display', 'inline');
        }
    }).on('change', '#group', function () {
        //学校種別切り替え時イベント
        var array,
            groupID = $(this).val();

        //学校名切替
        array = [{
            id: null,
            name: $('#school option:first').text()
        }];
        $.each(adminfn.SS.get('school'), function (label, obj) {
            if (obj.group === groupID) {
                array.push(obj);
            }
        });
        $('#school').setOption(array, null, null);

        //その他切替
        adminfn.groupSelecter($('.grade'), groupID, 'grade');
        adminfn.groupSelecter($('.class'), groupID, 'class');
        adminfn.groupSelecter($('.curriculum'), groupID, 'curriculum');
    }).on('change', '.business', function () {
        //業務切り替え時イベント
        fn.businessSelecter($(this));
    }).on('click', '#submit', function () {
        fn.inputCheck();
    }).on('click', '#prevMonthButton', function () {

    }).on('click', '#nextMonthButton', function () {

    });

    //読み込み時処理実行
    fn.init();
}());