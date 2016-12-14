/*global $, console, alert, comfn, param*/
$(function () {
    "use strict";
    
    function getDateInfo(){
        var item = sessionStorage.getItem('ANSPARAM')
        var itemObj = JSON.parse(item);
        var result = itemObj.displayDate;
        return result;
    };
    
    function getStudentInfo(){
        return comfn.getStudentInfo();
    };
    
    function setInfo(){
        var dateText = getDateInfo();
        var studentText = getStudentInfo();
        var info = dateText + studentText;
        var div = document.createElement("div");
        div.textContent = info;
        var target = document.getElementById("info");
        target.appendChild(div);
    };
    
    function binderScale(){
        var originalHeight = 400;
        var shitsumonContent = document.getElementById("shitsumon");
        var height = parseInt(shitsumonContent.clientHeight);
        var scaleY = height / originalHeight;
        if(scaleY > 1){
            var containerInput = document.getElementById("baseImg");
            containerInput.style.transformOrigin = "left top";
            containerInput.style.transform = 'scale(1,' + scaleY + ')';
        }
    };
    
    //definition
    var fn = {
        init: function () {
            //ログインチェック
            comfn.loginCheck(function () {
                //SessionStorageの取得とBasicInfoへの値設定
                comfn.setBasicInfo();
                //comfn.setInfo($('.info'));
                setInfo();
                fn.sheetSearch();
                fn.ansHtml();
            });
        },
        ansHtml: function () {
            var obj, i, ic,
                html = '',
                array = JSON.parse(sessionStorage.getItem('ANSHTML'));
            for (i = 0, ic = array.length; i < ic; i += 1) {
                obj = array[i];
                if (obj.ans === "--") {
                    html += '<tr class="alert"><td>' + obj.ques + '</td><td>' + obj.ans + '</td></tr>';
                } else {
                    html += '<tr><td>' + obj.ques + '</td><td>' + obj.ans + '</td></tr>';
                }
            }
            $('#content .scrollBody').html(html);
            binderScale();
            console.log(JSON.parse(sessionStorage.getItem('ANSPARAM')));
        },
        sheetSearch: function () {
            //本日質問対象のシートが存在したら、その対象となるパッケージを取得する。
            var sendData = {
                'command': 'sheetSearch'
            };
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (data.sheet.length > 0) {
                    //質問が存在する
                        //未回答
                        param.sheet = data.sheet[0];
                        //fn.generateQuestion();

                } else {
                    //そもそも質問が存在しない
                    comfn.message_ok('質問がありません', '今日の質問はありません。<br>メニューにもどります！', function () {
                        history.back();
                    });
                }
            });
        },
        answerSave: function () {
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType: 'json',
                //答えデータの取得
                data: sessionStorage.getItem('ANSPARAM')
            }).done(function (data) {
                //チェック
                
                
                moveUrlWidthParam('../result_s/');
                //location.href = "../result_s/";
            });
        }
    };
    //events
    $(document).on('click', '#img_tsugi', function () {
        fn.answerSave();
    });
    //run
    fn.init();
});