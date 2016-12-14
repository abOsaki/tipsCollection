/*global $, console, alert, adminfn, commonfn*/
var fn = (function () {
    'use strict';
    return {
        hoge: function () {}
    };
}());


//events
(function () {
    'use strict';
    $(document).on('click', '#topIcon', function () {
        commonfn.loginCheck(
            function (data) {
                location.href = data.url;
            },
            function () {
                $('#loginModal').dialog({
                    modal: true,
                    draggable: false,
                    resizable: false,
                    width: 'auto',
                    height: 'auto',
                    title: 'ログイン',
                    buttons: [
                        {
                            text: 'ログイン',
                            title: 'ログイン',
                            click: function () {
                                adminfn.login();
                            }
                        },
                        {
                            text: 'キャンセル',
                            title: 'キャンセル',
                            click: function () {
                                $(this).dialog('close');
                            }
                        }
                    ]
                });
            }
        );
    });
}());