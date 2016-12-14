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
        //読み込み時処理
        init: function () {
            var callback;
            callback = function () {
                var callback;
                callback = function () {
                    adminfn.displayUserInfo();
                    fn.jikanwariLoad();
                };
                adminfn.loginInfo(callback);
            };
            adminfn.getTable('mekurin', callback);
        },
        jikanwariSave: function () {
            //保存時の処理
            //保存の際に保存するかどうかのダイアログ表示
            //OK：保存・キャンセル：ダイアログを閉じる
        },
        jikanwariLoad: function () {
            
            var obj = adminfn.param.status;
            console.log(obj);
            
            //セレクトテーブル作成
            var newHtml, trHtml, i, j;
            newHtml = "";
            //1行分生成
            for(i = 0; i < 6; i++){ 
            trHtml +=
                "<td><select class='gradeCategory'></select>" +
                    "<select class='classCategory'></select>" +
                    "<select class='curriculumCategory'></select></td>";
            }//6限目まで
            for (j = 1; j < 7; j++) {
                newHtml += "<tr>" + "<td>" + j + "限目" + "</td>" + trHtml + "</tr>";
            }
            //まとめて置き換え
            $(".tBodyView").html(newHtml);
           
            adminfn.groupSelecter($(".gradeCategory"), obj["GROUP"], "grade");
            adminfn.groupSelecter($(".classCategory"), obj["GROUP"], "class");
            adminfn.groupSelecter($(".curriculumCategory"), obj["GROUP"], "curriculum");
            
        },
        jikanwariSet: function(){
            adminfn.getTable('ostk_mekurin_ara', callback);
            
            if(obj["GRADE"] !== null){
                
            }
            if(obj["CLASS"] !== null){

            }
            if(obj["CURRICULUME"] !== null){

            }
            //時間割画面で最初に時間割が設定されているか確認
            //されていたら初期設定・されてなければ未選択状態
            
        }
    };
}());

(function () {
    'use strict';
    //events
    $(document).on('change', '#button_save', function () {
        fn.jikanwariSave();
    });

    //読み込み時処理実行
    fn.init();
}());