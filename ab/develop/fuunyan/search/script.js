$(function() {
    //definition
    var fn = {
            init: function() {
              //ログインチェック
                comfn.loginCheck();
                //SessionStorageの取得とBasicInfoへの値設定
                comfn.setBasicInfo();
                //purposeを取得
                comfn.getTableMaster({
                    table:['purpose'],
                    //Selectタグに反映
                    callback:function(){
                        $("#basicInfo .purpose").setOption(comfn.SS.get('purpose'));
                    }
                });
                comfn.scrollResize();
                $("#questionBox_prev select").setOption(comfn.SS.get('share'));
            },
            //本日の質問シートを取得
            packageSearch:function(){
               var prefix=$("#basicInfo .group").val()==="1"?'E':'H';
               var sendData = {
                    'command':'packageSearch',
                    'param':{
                        'group':$("#basicInfo .group").val(),

                    }
                }

                sendData.param["grade"+prefix]=$("#basicInfo .grade").val();
                sendData.param["curriculum"+prefix]=$("#basicInfo .curriculum").val();

                $.ajax({
                    url: 'ajax.php',
                    type: 'POST',
                    dataType:'json',
                    data: JSON.stringify(sendData)
                })
                .done(function(data) {
                    param.package=data.package;
                    $('#searchTable table tbody').empty();
                    if(data.package.length!=0){
                        for (var i = 0; i < data.package.length; i++) {
                            var node=data.package[i];

                            //検索結果に対し，タイトルで部分一致するものは残す．タイトル項目が空欄の場合は比較を行わない．
                            if($("#basicInfo .title").val()!="" && node.title.indexOf($("#basicInfo .title").val())==-1)continue;

                            var $str="<tr data='"+node.id+"'><td class='checkCol'>&nbsp;"+
                            "<input type='radio' name='select' class='radioselect' value='"+node.id+
                            "'></td>"+
                            // "<td class='purposeCol'>&nbsp;"+comfn.SS.getName('purpose',node.purpose)+"</td>"+
                            "<td class='groupCol'>&nbsp;"+
                            comfn.SS.getName('group',node.group)+"</td><td class='gradeCol'>&nbsp;"+
                            comfn.SS.getName(["grade"+prefix],node["grade"+prefix])+"</td><td class='curriculumCol'>&nbsp;"+
                            comfn.SS.getName(["curriculum"+prefix],node["curriculum"+prefix])+"</td><td class='titleCol'>&nbsp;"+
                            node.title+"</td><td class='dateCol'>&nbsp;"+
                            node.date.split(' ')[0]+"</td><td class='renewalDateCol'>&nbsp;"+
                            node.renewalDate.split(' ')[0]+"</td></tr>";
                            $('#searchTable table tbody').append($str)
                        }
                        comfn.scrollResize();
                    }
                })
            },
            //質問項目を作成する
            generateQuestion: function() {
                var $str = "";
                if ($('.radioselect').is(':checked')) {
                    var value = $('.radioselect:checked').val();
                    var list=param.package;
                    var obj = list.filter(function(item, index) {
                        if (item.id == value) return true;
                    })[0];

                    $("#prevWrapper .title").val(obj.title);

                    comfn.generateQuestion(obj.child,$('#questionBox_prev table tbody'));

                    $('.scrollBody tr').each(function(){
                        //二度実行することで一番目と二番目を削除
                        $(this).children('td').eq(0).remove();
                        $(this).children('td').eq(0).remove();
                    })

                }
            },
            //モーダルで生徒への質問画面のプレビューを表示する。
            generatePreview: function() {
                if (!$('.radioselect').is(':checked')) {
                    comfn.message_ok("未選択","質問を選択して下さい。");
                    return;
                }

                //nakamura モック用に，検索結果の編集ボタンを押した場合，取り急ぎシート作成画面に遷移
                location.href="../sakusei_t01/";



                // fn.generateQuestion();
                // comfn.scrollResize();
                // $('#questionBox_prev').dialog({
                //     modal: true,
                //     draggable: true,
                //     width: 1000,
                //     height: 680,
                //     　　buttons: {　　　　
                //         "クエスチョンシートを作成": function() {　
                //             fn.sheetSave();
                //             　　　

                //         },
                //         　　　　"閉じる": function() {　　　　
                //             $("#questionBox_prev").dialog("close");　　　　
                //         }　　　
                //     }
                // });
                // $.datepicker.formatDate( "yy-mm-dd", new Date( 2007, 1 - 1, 26 ) );
                // $.datepicker.setDefaults( $.datepicker.regional[ "ja" ] );
                // $( "#questionBox_prev .dateFrom").datepicker();
                // $( "#questionBox_prev .dateTo" ).datepicker();
                // //誤動作防止の為フォーカスを外す
                // $( "#questionBox_prev .dateFrom").blur();



            },
            sheetSave:function(){

                if($('#questionBox_prev .dateFrom').val()=="" || $('#questionBox_prev .dateTo').val()==""){
                        comfn.message_ok("未選択","日付が選択されていません。");
                        return;
                }

                if($('#questionBox_prev .dateTo').val()<$('#questionBox_prev .dateFrom').val()){
                        comfn.message_ok("入力エラー","終了日付が開始日付より昔に設定されています．");
                        return;
                }


               if($('#questionBox_prev .title').val()==""){
                   comfn.message_ok('未入力','タイトルを入力して下さい。',(function(){}))
                   return;
               }





               var sendData = {
                    'command':'sheetSave',
                    'param':{
                        author:param.status.USERID,
                        dateFrom:$('#questionBox_prev .dateFrom').val(),
                        dateTo:$('#questionBox_prev .dateTo').val(),
                        title:$('#questionBox_prev .title').val(),
                        package:$('.radioselect:checked').val(),
                        share:$('#questionBox_prev .share').val(),
                    }
                }
                $.ajax({
                    url: 'ajax.php',
                    type: 'POST',
                    dataType:'json',
                    data: JSON.stringify(sendData)
                }).done(function(data){

                    comfn.message_ok('完了','保存が完了しました！',(function(){
                        $('#questionBox_prev').dialog("close");
                        fn.packageSearch();
                    }))

                })



            }
        }
    //events
    $(document)   
    .on('click', '#img_edit', function() {


        fn.generatePreview();
   })

    //run
    fn.init();
});
