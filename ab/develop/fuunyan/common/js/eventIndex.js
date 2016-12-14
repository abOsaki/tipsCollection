/*global $*/

/*各キャラクター動作*/
$(function () {
    "use strict";

    // 雲1の指定
    $('#cloud').jqFloat({
        width: 0,
        height: 20,
        speed: 1200
    });

    // ねこ4の指定
    $('#cat4').jqFloat({
        width: 0,
        height: 80,
        speed: 1000
    });

    // 鳥4の指定
    $('#bird4').jqFloat({
        width: 300,
        height: 80,
        speed: 700
    });

    // 犬の指定
    $('#dog1').jqFloat({
        width: 7,
        height: 5,
        speed: 200
    });

    // ふぅーにゃんの指定
    $('#nyantaro').jqFloat('stop', {
        width: 5,
        height: 0,
        speed: 10,
        top: 100
    });
    $('#nyantaro').hover(function () {
        $(this).jqFloat('play');
    }, function () {
        $(this).jqFloat('stop');
    });
});