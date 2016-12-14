/*global $, console, alert, comfn, param, DateFormat*/

function goGraphGamen(){
    moveUrlWidthParam('./../graph_s/');
}

$(function () {
    //definition
    var fn = {
        init: function () {
            //ログインチェック
            comfn.loginCheck((function () {
                var dateFormat, str, selectnum, output, msg, no;

                //SessionStorageの取得とBasicInfoへの値設定
                comfn.setBasicInfo();
                comfn.setInfo($('.info'));

                dateFormat = new DateFormat("yyyyMMdd");
                str = dateFormat.format(new Date());

                //キャラ固定
                selectnum = (Number(str) + Number(param.status.USERID)) % 74 + 1;
                //キャラ更新のたび変更
                //selectnum = Math.floor(Math.random() * 74);

                selectnum = (("0" + selectnum).slice(-2));
                //console.log(str);
                //console.log(param.status.USERID);
                //console.log(selectnum);

                //output = "<img src='" + "../common/images/mimamori_" + selectnum + ".png'>";
                //$('#box5').html(output);
                $('#box5').css('background-image', 'url(../common/images/mimamori_' + selectnum + '.png)');

                msg = [];
                // 設定開始（メッセージの内容を設定してください）
                msg[0] = 'マイペースでやりましょう';
                msg[1] = '<ruby>気持<rt>きもち</rt></ruby>ちのいいことやりましょう';
                msg[2] = '<ruby>今日<rt>きょう</rt></ruby>はいいことあるかも';
                msg[3] = '<ruby>笑顔<rt>えがお</rt></ruby>がステキ！';
                msg[4] = '<ruby>明日<rt>あした</rt></ruby>もよろしくね';
                msg[5] = '<ruby>今日<rt>きょう</rt></ruby>は<ruby>楽<rt>たの</rt></ruby>しかったかな';
                msg[6] = '<ruby>明日<rt>あした</rt></ruby>も<ruby>楽<rt>たの</rt></ruby>しみだね';
                msg[7] = 'いつもがんばっているね';
                msg[8] = 'みんな<ruby>大好<rt>だいす</rt></ruby>き！';
                msg[9] = 'お<ruby>友<rt>とも</rt></ruby>だちになってね！';
                // 設定終了

                no = Math.floor(Math.random() * msg.length);
                // 表示開始
                $('.speech').html(msg[no]);
            }));
        }
    };
    $(document).on('click', '#img_tsugi', function () {
        goGraphGamen();
//        var param = comfn.takeGET()[0];
//        if(param){
//            location.href = './../graph_s/index/?p=' + param ;
//        }else{
//            location.href = './../graph_s/';
//        }
        
    });
    fn.init();
});