/*global $, console, alert, adminfn*/
var commonfn = (function () {
    'use strict';
    return {
        //ログインチェック
        loginCheck: function (truefn, falsefn) {
            var sendData;
            //callback設定
            //ログイン画面とその他画面での実行処理が異なるため
            truefn = truefn || function () {};
            falsefn = falsefn || function () {};

            sendData = {
                'command': 'loginCheck',
                'param': null
            };

            $.ajax({
                url: './../common/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData),
                //チェックを行ってから他の処理を行うため同期通信(非推奨)
                async: false
            }).done(function (data) {
                if (data.flag === 'true') {
                    truefn(data);
                } else {
                    falsefn();
                }
            }).fail(function () {
                adminfn.alertDialog('通信エラー', '通信エラーが発生しました。<br />ネットワークの接続を確認してください。');
            });
        },
        //タブの切り替え
        viewSwitch: function ($dom) {
            //文字色を初期状態へ
            $('.menuTab').each(function () {
                $(this).css('color', '');
            });
            //選択したタブの文字色を変更
            $dom.css('color', '#fefe00');
            //選択したタブの「id」+「View」のidを持つ要素を可視化
            $('.boxView').css('display', 'none');
            $('#' + $dom.attr('id') + 'View').css('display', 'block');
        },
        //「年」のoptionを生成
        setYearOption: function (from, to, selectYear) {
            var i, ic,
                options = [];
            for (i = 0, ic = to - from; i <= ic; i += 1) {
                options.push({
                    id: from + i,
                    name: from + i
                });
            }
            $('#year').setOption(options, selectYear, null);
        },
        //「月」のoptionを生成
        setMonthOption: function (selectMonth) {
            var i, ic,
                options = [];
            for (i = 1, ic = 12; i <= ic; i += 1) {
                options.push({
                    id: i,
                    name: i
                });
            }
            $('#month').setOption(options, selectMonth, null);
        },
        //「日」のoptionを生成
        setDayOption: function (year, month, selectDay) {
            var i, ic,
                options = [];
            ic = commonfn.getEndMonth(year, month);
            for (i = 1; i <= ic; i += 1) {
                options.push({
                    id: i,
                    name: i
                });
            }
            $('#day').setOption(options, selectDay, null);
        },
        //月末日を取得
        getEndMonth: function (year, month) {
            var date = new Date(year, month, 0);
            //月末の日にちをリターン
            return date.getDate();
        }
    };
}());

(function () {
    'use strict';
    //events
    $(document).on('click', '.menuTab', function () {
        commonfn.viewSwitch($(this));
    });
}());