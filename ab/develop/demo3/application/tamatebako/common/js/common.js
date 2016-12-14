/*global $, console, alert, adminfn*/
var commonfn = (function () {
    'use strict';
    return {
        //ログインチェック（利用権限チェック）
        loginCheck: function (truefn, falsefn) {
            var sendData;
            //callback設定
            //ログイン画面とその他画面での実行処理が異なるため
            truefn = truefn || function () {};
            falsefn = falsefn || function () {};

            sendData = {
                command: 'loginCheck',
                param: null
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
        //valueの値で$eleを変化しreturn
        lCselecter: function (value, $ele) {
            $ele.setOption(adminfn.SS.get('middleCategory0' + value), null, 1);
            return $ele;
        }
    };
}());


//events
$(function () {
    'use strict';
    //$(document).on('', '', function () {});
});