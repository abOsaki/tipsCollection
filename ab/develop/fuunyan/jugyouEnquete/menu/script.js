$(function () {
    var fn={

        init:function(){
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


            comfn.loginCheck(function(){

                // $("#menuarea").append('<li><a href="getShortCut.php?gp='+param.status.GROUP+'&pe='+param.status.SCHOOLE+'&ph='+param.status.SCHOOLH+'">・ショートカット</a></li>')

            });
        }
    }
    //events
    $(document).on('click','#fuunyan',function(){
        // 　　$('#modalContents01').dialog({
        //     　　　modal: true,
        //         draggable:false,
        //     　　　buttons: {
        //         　　　　"ログイン": function(){
        //             　　　　 fn.login();
        //         　　　　}
        //     　　　}
        // 　　});
    })
    fn.init();
});
