

$(function () {
    "use strict";
    
//    $('#addBtn').on('click', function () {
//        //質問を保存する
//        saveQuestion();
//    });
    $('#sortData').sortable();
    
    $('#sortData').bind('sortstop',function(){
        // 番号を設定している要素に対しループ処理
        $(this).find('.indexHeader').each(function(idx){
            // タグ内に通し番号を設定（idxは0始まりなので+1する）
            $(this).html(idx+1);
        });
    });
    
});