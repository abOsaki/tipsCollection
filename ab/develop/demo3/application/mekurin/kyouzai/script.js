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
            //時間割画面にで最初に時間割が設定されているか確認
            //されていたら初期設定・されてなければ未選択状態
        },
        selectSwicthView: function () {
            //ログイン情報により担任なら教科のみ選択
            //専科なら学年・クラスを選択
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