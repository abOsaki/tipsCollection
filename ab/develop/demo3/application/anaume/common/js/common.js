/*global $, console, alert, adminfn, URL, FileReader*/
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
        getNowDate: function () {
            var date, year, month, day, hours, minutes, seconds, nowDate;
            date = new Date();
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            hours = date.getHours();
            minutes = date.getMinutes();
            seconds = date.getSeconds();
            nowDate = year + ("0" + month).slice(-2) + ("0" + day).slice(-2) + ("0" + hours).slice(-2) + ("0" + minutes).slice(-2) + ("0" + seconds).slice(-2);

            return nowDate;
        },
        loadImage: function (fileName, callback) {
            //jqueryだとバイナリが扱えない？
            var xmlhr;
            callback = callback || function () {};
            xmlhr = new XMLHttpRequest();
            xmlhr.open('POST', './../common/php/imageLoad.php', true);
            xmlhr.responseType = 'blob';
            xmlhr.onreadystatechange = function () {
                var obj, reader;
                if (xmlhr.readyState === 4) {
                    callback(xmlhr.response, fileName);
                }
            };
            xmlhr.send(fileName);
        }
    };
}());

//events
$(function () {
    'use strict';
    //あなあき、リンクの共通イベント
    $(document).on('click', "#textContents .anaaki", function () {
        var $target = $(this);
        if ($target.hasClass('anaVisible')) {
            $target.removeClass('anaVisible').addClass('anaInvisible');
        } else {
            $target.removeClass('anaInvisible').addClass('anaVisible');
        }
    }).on('dblclick', '.hyperLinkArea', function () {
        var link = $(this).attr('data');
        window.open(link, '_blank');
    });
});