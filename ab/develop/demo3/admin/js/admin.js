/*global $, console, alert, commonfn*/
var adminfn = (function () {
    'use strict';
    return {
        param: {},
        alertDialog: function (title, message, callback) {
            var $dom;
            //アラートウィンドウ用DOM生成
            $dom = $('<div/>', {
                id: 'alertDialog'
            }).attr('title', title).append(
                $('<p/>').html(message)
            );
            $('body').append($dom);

            $dom.dialog({
                modal: true,
                draggable: false,
                resizable: false
            });
            //callback設定(callbackの有無)
            callback = callback || 'OK';
            if (callback !== 'OK') {
                $dom.dialog({
                    buttons: [
                        {
                            text: 'O　K',
                            title: 'OK',
                            click: function () {
                                callback();
                                $dom.dialog('close');
                            }
                        },
                        {
                            text: 'キャンセル',
                            title: 'キャンセル',
                            click: function () {
                                $dom.dialog('close');
                            }
                        }
                    ]
                });
            } else {
                $dom.dialog({
                    buttons: [
                        {
                            text: 'O　K',
                            title: 'OK',
                            click: function () {
                                $dom.dialog('close');
                            }
                        }
                    ]
                });
            }

            //アラートウィンドウクローズ時DOM削除
            $dom.on('dialogbeforeclose', function (event, ui) {
                $('#alertDialog').remove();
            });
        },
        //ログイン
        login: function () {
            var userID, userPW, loginForm,
                sendData = {},
                error = '';

            //ID、PW、ログインフォームであることのデータを代入
            userID = $('#userID').val();
            userPW = $('#userPW').val();
            loginForm = $('#loginFrm').val();

            //入力確認
            sendData = {};
            error = '';
            if (loginForm) {
                if (!userID) {
                    error += 'ユーザIDが未入力です。';
                }
                if (!userPW) {
                    if (error !== '') {
                        error += '\n';
                    }
                    error += 'パスワードが未入力です。';
                }
            } else {
                error = 'ページの更新を行ってください。';
            }
            if (error) {
                adminfn.alertDialog('ログイン失敗', error);
                return false;
            } else {
                sendData = {
                    command: 'login',
                    param: {
                        userid: userID,
                        password: userPW,
                        login: loginForm
                    }
                };
                $.ajax({
                    url: './../../../admin/php/ajax.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(sendData)
                }).done(function (data) {
                    if (data.flag === 'true') {
                        commonfn.loginCheck(function (data) {
                            location.href = data.url;
                        }, null);
                    } else {
                        adminfn.alertDialog('ログイン失敗', 'ログイン処理に失敗しました。');
                    }
                }).fail(function () {
                    adminfn.alertDialog('ログイン失敗', 'ログイン処理に失敗しました。');
                });
            }
        },
        //ユーザー情報
        loginInfo: function (callback) {
            var sendData = {
                command: 'loginInfo',
                param: null
            };
            callback = callback || function () {};
            $.ajax({
                url: './../../../admin/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                adminfn.param.status = data;
                callback();
            });
        },
        //セッションを削除し、トップ画面に戻る。
        logout: function () {
            var sendData = {
                command: 'logout'
            };
            $.ajax({
                url: './../../../admin/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function () {
                location.href = "./../index/";
            });
        },
        //セッションストレージへのアクセスを行う。
        SS: {
            get: function (key) {
                return JSON.parse(sessionStorage.getItem(key));
            },
            set: function (key, value) {
                sessionStorage.setItem(key, JSON.stringify(value));
            },
            getName: function (key, value) {
                var list, result;
                list = JSON.parse(sessionStorage.getItem(key));
                result = list.filter(function (item, index) {
                    if (item.id === value) {
                        return true;
                    }
                })[0];

                if (result) {
                    return result.name;
                } else {
                    return null;
                }
            }
        },
        //リスト取得
        getTable: function (obj, callback) {
            var sendData = {
                command: 'getTable',
                param: obj
            };

            callback = callback || function () {};
            $.ajax({
                url: './../../../admin/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var key;
                for (key in data) {
                    //自身のプロパティかチェック
                    if (data.hasOwnProperty(key)) {
                        adminfn.SS.set(key, data[key]);
                    }
                }
                callback();
            });
        },
        takeGET: function () {
            var i, kv,
                arg = {},
                pair = location.search.substring(1).split('&');

            for (i = 0; pair[i]; i += 1) {
                kv = pair[i].split('=');
                arg[kv[0]] = kv[1];
            }
            return arg;
        },
        //学校種別の切り替え処理
        categorySelecter: function ($target, category, key, num) {
            var array = [];
            $.each(adminfn.SS.get(key), function (label, obj) {
                if (obj.category === category) {
                    array.push(obj);
                }
            });
            $target.setOption(array, num, 1);
        },
        //単元（テーマ）の切り替え処理
        unitSelecter: function ($unit, grade, curriculum, num) {
            var sendData = {
                command: 'unitSelecter',
                param: {
                    grade: grade,
                    curriculum: curriculum
                }
            };

            $unit.empty();
            $.ajax({
                url: './../../../admin/php/ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                $unit.setOption(data, num, 1);
            });
        },
        displayUserInfo: function () {
            var obj = adminfn.param.status,
                value = '';
            value = adminfn.SS.getName('school', obj.SCHOOL);
            if (value) {
                $('#userSchool').html(value);
            }
            value = adminfn.SS.getName('grade', obj.GRADE);
            if (value) {
                $('#userGrade').html(value);
            }
            value = adminfn.SS.getName('classroom', obj.CLASSROOM);
            if (value) {
                $('#userClassroom').html(value);
            }
            $('#userName').html(obj.DISPLAYNAME + 'さん');
        },
        dateOptions: {
            //「年」のリスト
            year: function (from, to) {
                var i, ic,
                    array = [];
                for (i = 0, ic = to - from; i <= ic; i += 1) {
                    array.push({
                        id: from + i,
                        name: from + i
                    });
                }
                return array;
            },
            //「月」のリスト
            month: function () {
                var i, ic,
                    array = [];
                for (i = 1, ic = 12; i <= ic; i += 1) {
                    array.push({
                        id: i,
                        name: i
                    });
                }
                return array;
            },
            //「日」のリスト
            day: function (year, month) {
                var i, ic,
                    array = [];
                ic = adminfn.getEndMonth(year, month);
                for (i = 1; i <= ic; i += 1) {
                    array.push({
                        id: i,
                        name: i
                    });
                }
                return array;
            },
            //月末日
            getEndMonth: function (year, month) {
                var date = new Date(year, month, 0);
                return date.getDate();
            }
        }
    };
}());

$(function () {
    'use strict';
    //マウスオーバー時に画像切替
    $('img').on({
        'mouseenter': function () {
            $(this).attr('src', $(this).attr('src').replace('_off', '_on'));
        },
        'mouseleave': function () {
            $(this).attr('src', $(this).attr('src').replace('_on', '_off'));
        }
    });

    //jquery Extend
    $.fn.extend({
        //オブジェクト形式の配列から選択要素を作成する。
        setOption: function (options, value, etcFlag) {
            var i, ic,
                $option = $();

            etcFlag = etcFlag || null;
            //etcFlag「1:ハイフン追加」
            if (etcFlag === 1) {
                $option.push(
                    $('<option/>', {
                        'value': '',
                        'text': '--'
                    })[0]
                );
            }

            this.empty();
            if (options) {
                for (i = 0, ic = options.length; i < ic; i += 1) {
                    $option.push(
                        $('<option/>', {
                            'value': options[i].id,
                            'text': options[i].name
                        })[0]
                    );
                }
            }

            this.append($option);
            value = value || null;
            if (value) {
                this.val(value);
                if (!this.val()) {
                    this.prop('selectedIndex', 0);
                }
            }
            return this;
        }
    });

    //events
    $(document).on('click', '#button_logout', function () {
        //ログアウトボタンが押されたらログアウト
        adminfn.logout();
    }).on('click', '#button_menu', function () {
        //メニューボタンが押されたらメニュー画面
        location.href = "./../menu/";
    }).on('click', '#button_modoru', function () {
        //戻るボタンが押されたら一つ戻る
        history.back();
    });
});