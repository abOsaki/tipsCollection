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
        laodReport: function () {}
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