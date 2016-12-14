/*global $, console, alert, comfn*/

function setSchoolOptions(pvGroup){
    
    var array = [{
                id: '-1',
                name: '--'
            }];
    
    //小学校の場合
    if (pvGroup == 1) {
        $('#schoolGrade').setOption(array.concat(comfn.SS.get('gradeE')));
        $('#schoolClass').setOption(array.concat(comfn.SS.get('classE')));
    } else {
        //中学校の場合
        $('#schoolGrade').setOption(array.concat(comfn.SS.get('gradeH')));
        $('#schoolClass').setOption(array.concat(comfn.SS.get('classH')));
    }
}

function goMenuGamen(){
    sendData = {'command': 'getSession'};
    //セッションの取得
    $.ajax({
            url: 'ajax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(sendData)
        }).done(function (data) {
            //取得したセッション情報からセッションを保存する
            //ここでセッションストレージに保存しているからログインチェックは不要
            setSessionInfo(data);
            var check = sessionStorage;
            moveUrlWidthParam('../menu_s/');
        });
}

function setSessionInfo(pvData){
    for(var key in pvData){
        var userKey = 'USER_' + key;
        comfn.SS.set(userKey,pvData[key]);
    }
}

//画像の移動を行う
function moveImages(){
    // 雲1の指定
    $('.cloud').jqFloat({
        width: 0,
        height: 20,
        speed: 1200
    });
    // ねこ4の指定
    $('.cat4').jqFloat({
        width: 0,
        height: 80,
        speed: 1000
    });
    // 鳥4の指定
    $('.bird4').jqFloat({
        width: 200,
        height: 80,
        speed: 900
    });
    // 犬の指定
    $('.dog1').jqFloat({
        width: 2,
        height: 5,
        speed: 400
    });
    // ふぅーにゃんの指定
    $('.nyantaro').jqFloat('stop', {
        width: 5,
        height: 0,
        speed: 10
    });
    $('.nyantaro').hover(function () {
        $(this).jqFloat('play');
    }, function () {
        $(this).jqFloat('stop');
    });
}

function setShusekiBango(){
    //出席番号の入力を行う
    //生徒番号生成
    var array = [{
        'id': '-1',
        'name': '--'
    }];
    for (var i = 0; i < 50; i++) {
        array.push({
            'id': i + 1,
            'name': i + 1
        });
    }
    $('#studentNumber').setOption(array);
}

$(function () {
    
    //ファンクションオブジェクト、はあ？
    var fn = {
        init: function () {
            //画像の移動を行う（配置）
            moveImages();
            
            //基本的な情報をセッションストレージに保存（ここで各コンボボックスにも値を入力している）
            comfn.setBasicInfo();
            
            //出席番号のセットを行う
            setShusekiBango();

            //URLパラメタの取得
            param.GET = comfn.takeGET();

            //セッションストレージで何か保存している
            comfn.SS.set('HOME', [{
                id: "1",
                name: window.location.href
            }]);
        },
        
//        groupSearch: function (user) {
//            var sendData = {
//                'command': 'groupSearch',
//                'param': {
//                    "userid": user
//                }
//            }
//            $.ajax({
//                url: 'ajax.php',
//                type: 'POST',
//                dataType: 'json',
//                data: JSON.stringify(sendData)
//            }).done(function (data) {
//                if (data.users.length != 0) {
//                    param.loginData = data;
//                    $('#schoolName').val(comfn.SS.getName('schoolE', param.loginData.users[0].schoolE));
//                    $('#schoolGrade').val(comfn.SS.getName('gradeE', param.loginData.users[0].gradeE));
//                    $('#schoolClass').val(comfn.SS.getName('classE', param.loginData.users[0].classE));
//                } else {
//                    comfn.message_ok('正しくないURL', 'URLを確認してください。', function () {
//                        //ログインイベントを消去
//                        $(document).off('click', '#fuunyan');
//                    });
//                }
//            });
//        },

        studentSearch: function () {
            //「選択して下さい」の時は何もしない
            
            //学年、クラス、出席番号が無効な場合は終了する
            if ($('#studentNumber').val() == '-1' || $('#schoolGrade').val() == '-1' || $('#schoolClass').val() == '-1') {
                $('#additionalForm').hide();
                return;
            }
            //その学校名と学年，クラス，生徒番号を元に，既存ユーザがあるかどうか確認
            var sendData = {
                'command': 'studentSearch',
                'param': {
                    "group": $('#schoolName').attr('group'),
                    
                    //☆☆☆☆最後ここのコメントを外し、したのを消しましょう
                    //"schoolNumber": $('#schoolName').val(),
                    //"schoolNumber": 1,
                    
                    "schoolNumber": $('#schoolName').attr('data'),
                    "schoolGrade": $('#schoolGrade').val(),
                    "schoolClass": $('#schoolClass').val(),
                    "studentNumber": $('#studentNumber').val()
                }
            }
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                //初期化
                if (Number($('input[name="schoolSex"]:checked').val()) >= 0) {
                    $('input[name="schoolSex"]:checked').prop("checked", false);
                }
                if ((data.result && data.result == 'false') ||
                    (data.users && data.users.length == 0)) {
                    param.USERID = "";
                    
                    //$('#additionalForm').show();

                } else {
                    param.USERID = data.users[0].id;
                    $('#additionalForm').hide();
                }
            });
        },
        studentSet: function () {
            //その学校名と学年，クラス，生徒番号を元に，既存ユーザがあるかどうか確認
            var sendData = {
                    'command': 'studentSet',
                    'param': {
                        "group": $('#schoolName').attr('group'),
                        "schoolNumber": $('#schoolName').attr('data'),
                        
                        //☆☆☆☆最後ここのコメントを外し、したのを消しましょう
                        //"schoolNumber": $('#schoolName').val(),
                        //"schoolNumber": 1,
                        
                        "schoolGrade": $('#schoolGrade').val(),
                        "schoolClass": $('#schoolClass').val(),
                        "studentNumber": $('#studentNumber').val(),
                        "sex": 0
                        //"sex": $('input[name="schoolSex"]:checked').val()
                    }
                }
                //console.log(sendData);
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData),
                error: function(e){
                    
                },
                success: function(e){
                    
                }
                
            }).done(function (data) {
                param.USERID = data.id;
                goMenuGamen();

            }).fail(function (data){
                alert('ユーザの登録に失敗しました。 :' + data.responseText)
            });
        },
        login: function () {
            //ID、PW、ログインフォームであることのデータを代入
            var userId = $("#userID").val();
            var userPW = $("#userPW").val();
            var loginForm = $("#loginFrm").val();
            //入力確認
            var sendData = {};
            var error = "";
            if (loginForm) {
                if (!userId) {
                    error += "ユーザIDが未入力です。";
                }
                if (!userPW) {
                    if (error !== "") {
                        error += "\n";
                    }
                    error += "パスワードが未入力です。";
                }
            } else {
                error = "ページの更新を行ってください。";
            }
            if (error) {
                comfn.message('ログイン失敗', error);
                return;
            } else {
                sendData = {
                    'command': 'login',
                    'param': {
                        'userid': userId,
                        'password': userPW,
                        'login': loginForm
                    }
                }
                $.ajax({
                        url: 'ajax.php',
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify(sendData)
                    })
                    .done(function (data) {
                        if (data.flag === "true") {
                            var urlParam = comfn.takeGET();
                            if(urlParam){
                                location.href = data.url;
                                
                            }else{
                                location.href = data.url;
                            }
                            
                        } else {
                            comfn.message('ログイン失敗', "ログイン処理に失敗しました。");
                        }
                    })
                    .fail(function () {
                        comfn.message('ログイン失敗', "ログイン処理に失敗しました。");
                    })
                    .always(function () {
                        console.log("complete");
                    });
            }
        },
        student_login: function () {
            
            //flagの意味1:小学校、2:中学校、3:無し
            var flag = 1;
            //小学校を全て取得しているらしい
            var array = comfn.SS.get('schoolE');
            cvAllSchoolE = comfn.SS.get('schoolE');
            //じゃあ中学校も取得しようよ
            cvAllSchoolH = comfn.SS.get('schoolH');
            //urlのパラメタに設定してある学校コードと比較して、そのコードを持っている学校を取得する（らしい）
            var result = array.filter(function (item, index) {
                if (item.code == param.GET.p) return true;
            });
            //該当する小学校がなかった場合は中学校を取得して、同じことをする
            if (result.length == 0) {
                flag = 2;
                //中学校を全て取得する
                array = comfn.SS.get('schoolH');
                result = array.filter(function (item, index) {
                    if (item.code == param.GET.p) return true;
                });
            }
            //該当する学校が無かった
            if (result.length == 0) {
                flag = 3;
            }
            if (flag == 3) {
                comfn.message_ok('正しくないURL', 'URLを確認してください。', function () {
                    //ログインイベントを消去
                    $(document).off('click', '#fuunyan');
                });
            } else {
                
                $('#schoolName').val(result[result.length - 1].name);
                $('#schoolName').attr('data', result[result.length - 1].id);
                $('#schoolName').attr('group', flag);
                
                //ここで学校の名前をセットする
                //setSchoolNameControl(flag);
                
                /*
                $('#schoolName').val(result[result.length - 1].name);
                $('#schoolName').attr('data', result[result.length - 1].id);
                $('#schoolName').attr('group', flag);
                */

                $('#studentNumber').val('-1');
                array = [{
                    id: '-1',
                    name: '--'
                }];
                
                setSchoolOptions(flag);
                
            }
            $('#modalContents02').dialog({
                modal: true,
                width:500,
                draggable: false,
                buttons: [{
                    text: "はじめる",
                    class: 'fu_button',
                    click: function () {
                        
                        if ($('#schoolGrade').val() == '-1') {
                            comfn.message_ok('未入力（みにゅうりょく）', '<ruby>学年<rt>がくねん<rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでね');
                            return;
                        }
                        if ($('#schoolClass').val() == '-1') {
                            comfn.message_ok('未入力（みにゅうりょく）', 'クラスを<ruby>選<rt>えら</rt></ruby>んでね');
                            return;
                        }
                        if ($('#studentNumber').val() == '-1') {
                            comfn.message_ok('未入力（みにゅうりょく）', '<ruby>出席番号<rt>しゅっせきばんごう<rt></ruby>を<ruby>選<rt>えら</rt></ruby>んでね');
                            return;
                        }
                        if (param.USERID == "") {
                            
                            fn.studentSet();
                        } else {
                            //入手済の場合
                            //そのまま遷移
                            goMenuGamen();
                        }
                    }
                },
                {
                    text: "記録を見る",
                    class: 'fu_button',
                    click: function(){
                        alert(未実装);
                    }
                },
                {
                    text: "キャンセル",
                    class: 'fu_button',
                    click: function () {
                        $(this).dialog('close');
                    }
                }]
            });
        },
        admin_login: function () {
            $('#modalContents01').dialog({
                modal: true,
                draggable: false,
                buttons: [
                    {
                        text: "ログイン",
                        class: 'fu_button',
                        click: function () {
                            fn.login();
                        },
                    },
                    {
                        text: "キャンセル",
                        class: 'fu_button',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }
                ]
            });
        }
    }
    fn.init();

$(document).on('click', '#login_student', function () {
    comfn.removeSession();
    fn.student_login();
}).on("change", "#studentNumber, #schoolGrade, #schoolClass", function () {
    fn.studentSearch();
}).on('click', '#login_admin', function () {
    fn.admin_login();
}).on('change','#group',function(){
    //changeGroup();
});

});