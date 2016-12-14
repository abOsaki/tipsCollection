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
                    fn.katuyouLoad();
                };
                adminfn.loginInfo(callback);
            };
            adminfn.getTable('mekurin', callback);
        },
        katuyouLoad: function () {
            //当日の時間割表示
        }
    };
}());

(function () {
    'use strict';
    //events
    $(document).on('change', '', function () {});

    //読み込み時処理実行
    fn.init();
}());