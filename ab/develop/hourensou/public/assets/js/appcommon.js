/*************************************
 * アプリケーション共通で使用する処理
 *************************************/

/*
 * 0埋め用の関数
 */
function dateZellFill(number) {
    return ( "0" + number ).substr( -2 ) ;
}

/*
 * プルダウン初期化
 */
function clearOption(select) {
    var idx = select.length;
    for (var i = 0; i < idx ; i++) {
        select.removeChild(select.lastChild);
    }
}
