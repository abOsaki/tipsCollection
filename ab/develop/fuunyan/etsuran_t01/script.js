function setSheets(){
    //共通データを取得する
    getCommonData();
}

var cvCommonData;
function getCommonData(pvCallback){
    var sendData = {
        'command': 'getCommonData'
        //'data' : recordData
    };
    
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType:'json',
        data: JSON.stringify(sendData),
        success:function(result)//反応があったら
        {
            var successCheck = result;
        },
        error:function(exception)
        {
            var errorChekck = exception;
        }
    })
    .done(function(data) {
        setCommonData(data);
        setKensakuSelect();
        //setTrBySheets(data);
        getSheetByUser();
    })
}

function setKensakuSelect(){
    /*
    //グループの取得
    var group = document.getElementById("group");
    var test = group.selectedOptions[0];
    */
    
    
    
    
}

function setCommonData(pvCommonData){
    cvCommonData = {};
    
    //ここでユーザの情報も一緒に取得する
    cvCommonData["userSchoolE"] = pvCommonData.userSchoolE;
    cvCommonData["userSchoolH"] = pvCommonData.userSchoolH;
    cvCommonData["userGradeE"] = pvCommonData.userGradeE;
    cvCommonData["userGradeH"] = pvCommonData.userGradeH;
    cvCommonData["userClassE"] = pvCommonData.userClassE;
    cvCommonData["userClassH"] = pvCommonData.userClassH;
    cvCommonData["userGroup"] = pvCommonData.userGroup;
    cvCommonData["authority"] = pvCommonData.authority;
    
    var classEs = {};
    for(var i = 0; i < pvCommonData.classE.length; i++){
        var classE = pvCommonData.classE[i];
        classEs[classE.id] = classE.name;
    }
    cvCommonData["classE"] = classEs;
    
    var classHs = {};
    for(var i = 0; i < pvCommonData.classH.length; i++){
        var classH = pvCommonData.classH[i];
        classHs[classH.id] = classH.name;
    }
    cvCommonData["classH"] = classHs;
    
    var gradeEs = {};
    for(var i = 0; i < pvCommonData.gradeE.length; i++){
        var gradeE = pvCommonData.gradeE[i];
        gradeEs[gradeE.id] = gradeE.name;
    }
    cvCommonData["gradeE"] = gradeEs;
    
    var gradeHs = {};
    for(var i = 0; i < pvCommonData.gradeH.length; i++){
        var gradeH = pvCommonData.gradeH[i];
        gradeHs[gradeH.id] = gradeH.name;
    }
    cvCommonData["gradeH"] = gradeHs;
    
    var schoolEs = {};
    for(var i = 0; i < pvCommonData.schoolE.length; i++){
        var schoolE = pvCommonData.schoolE[i];
        schoolEs[schoolE.id] = schoolE.name;
    }
    cvCommonData["schoolE"] = schoolEs;
    
    var schoolHs = {};
    for(var i = 0; i < pvCommonData.schoolH.length; i++){
        var schoolH = pvCommonData.schoolH[i];
        schoolHs[schoolH.id] = schoolH.name;
    }
    cvCommonData["schoolH"] = schoolHs;
    
    var shares = {};
    for(var i = 0; i < pvCommonData.share.length; i++){
        var share = pvCommonData.share[i];
        shares[share.id] = share.name;
    }
    cvCommonData["share"] = shares;
    
    var groups = {};
    for(var i = 0; i < pvCommonData.group.length; i++){
        var group = pvCommonData.group[i];
        groups[group.id] = group.name;
    }
    cvCommonData["group"] = groups;
}

//ajaxから取得するメソッド
function getSheetByUser(){
    
    var sendData = {
        'command': 'getSheetByUser'
        //'data' : recordData
    };
    $.ajax({
        url: 'ajax.php',
        type: 'POST',
        dataType:'json',
        data: JSON.stringify(sendData),
        success:function(result)//反応があったら
        {
            var successCheck = result;
        },
        error:function(exception)
        {
            var errorChekck = exception;
        }
    })
    .done(function(data) {
        setTrBySheets(data);
    })
}

//取得したでーたからtr挿入していくメソッド
function setTrBySheets(pvSheets){
    var body = document.getElementById("educationListBody");
    for(var i = 0; i < pvSheets.length; i++){
        var taisho = pvSheets[i];
        //ここでフィルタリングをかける
        if(!isSatisfySheet(taisho)){
            continue;
        }
        var tr = getTrBySheet(taisho);
        body.appendChild(tr);
    }
}

function isSatisfySheet(pvSheet){
    //特権管理はすべて見れる
    if(cvCommonData.authority == 1){
        return true;
    }
    
    //その他は自学校のみ
    if(pvSheet.group === "1"){
        return (cvCommonData.userSchoolE == pvSheet.schoolE);
    }else if(pvSheet.group === "2"){
        return (cvCommonData.userSchoolH == pvSheet.schoolH);
    }
}


function getTrBySheet(pvSheet){
    //TR
    var result = document.createElement("tr");
    //先頭
    var sento = document.createElement("td");
    var parent = document.createElement("div");
    var content = document.createElement("div");
    content.className = "bbtn";
    content.textContent = "実施済";
    parent.appendChild(content);
    sento.appendChild(parent);
    
    result.appendChild(sento);
    
    //小学校・中学校
    var group = document.createElement("td");
    var groupText = cvCommonData.group[pvSheet.group];
    group.textContent = groupText;
    result.appendChild(group);
    //学校名
    var school = document.createElement("td");
    var schoolText;
    if(pvSheet.group === "1"){
        schoolText = cvCommonData.schoolE[pvSheet.schoolE];
    }else if(pvSheet.group === "2"){
        schoolText = cvCommonData.schoolH[pvSheet.schoolH];
    }
    school.textContent = schoolText;
    result.appendChild(school);
    
    //学年
    var grade = document.createElement("td");
    var gradeText;
    if(pvSheet.group === "1"){
        gradeText = cvCommonData.gradeE[pvSheet.gradeE];
    }else if(pvSheet.group === "2"){
        gradeText = cvCommonData.gradeH[pvSheet.gradeH];
    }
    grade.textContent = gradeText;
    result.appendChild(grade);
    
    //組
    var classTd = document.createElement("td");
    var classText;
    if(pvSheet.group === "1"){
        classText = cvCommonData.classE[pvSheet.classE];
    }else if(pvSheet.group === "2"){
        classText = cvCommonData.classH[pvSheet.classH];
    }
    classTd.textContent = classText;
    result.appendChild(classTd);
    
    //生活記録
    var title = document.createElement("td");
    title.textContent = pvSheet.title;
    result.appendChild(title);
    
    //権限
    var kengen = document.createElement("td");
    var kengenText = cvCommonData.share[pvSheet.share];
    kengen.textContent = kengenText;
    result.appendChild(kengen);
    
    //閲覧ボタン
    var etsuran = document.createElement("td");
    var etsuranLink = document.createElement("a");
    etsuranLink.className = "view";
    var href = "../etsuran_detail/?p=" + pvSheet.id;
    etsuranLink.href = href;
    etsuranLink.textContent = "閲覧";
    etsuran.appendChild(etsuranLink);
    result.appendChild(etsuran);
    
    return result;
}

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
                        fn.sheetSearch({'command':'sheetSearch','param':""});
                        
                     }
                });
            //シートをセットする
            setSheets();
         },
         sheetSearch: function(senddata){
            //本日質問対象のシートが存在したら、その対象となるパッケージを取得。
            var prefix=$("#basicInfo .group").val()==="1"?'E':'H';
            var sendData= senddata || (function(){
                var obj={
                    'command':'sheetSearch',
                 'param':{
                     'group':$("#basicInfo .group").val(),
                    }
                }

                obj.param["grade"+prefix]=$("#basicInfo .grade").val();
                obj.param["curriculum"+prefix]=$("#basicInfo .curriculum").val();
                return obj;
            })();
                
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType:'json',
                data: JSON.stringify(sendData)
            })
            .done(function(data) {
                if(data){

                    $('#educationListBody').empty();
                    param.sheet=data.sheet;

                    for (var i = 0; i < param.sheet.length; i++) {
                        var obj=param.sheet[i];

                        //検索結果に対し，タイトルで部分一致ものは残す．タイトル項目が空欄の場合は比較を行わない．
                        if($("#basicInfo .title").val()!="" && obj.title.indexOf($("#basicInfo .title").val())==-1)continue;

                        var dateFrom=obj.dateFrom.split(' ')[0].split('-').join('/');
                        var dateTo=obj.dateTo.split(' ')[0].split('-').join('/');
                        var dateFormat = new DateFormat("yyyy/MM/dd");
                        var date = dateFormat.format(new Date()); // Date(現在時刻)をStringに変換

                        var status=(function(){
                            if(date < dateFrom){
                                return '<div class="bbtn">設定中</div>';
                            }else if(dateFrom <= date && date <= dateTo){
                                return '<div class="rbtn">実施中</div>';
                            }else{
                                return '<div class="bbtn">実施済</div>';
                            }
                        })();

                        var configstatus=(function(){
                                if(obj.stopFlag=='1'){
                                    return '<span class="apply">設定</span>';
                                }else{
                                    return '<span class="release">解除</span>';
                                }
                        })();                     

                        var viewstatus=(function(){

                            if(date < dateFrom){
                                return '<span class="viewDisable">閲覧</span>';
                            }else{
                                return '<span class="view">閲覧</span>'
                            }

                        })();       

                        var dateFormat = new DateFormat("yyyy/M/d");


                        if(param.sheet[i].group=='1'){

                          var $row='<tr data="'+obj.sheet_id+'">'+
                                '<td><div id="item1">'+status+'</div></td> '+
                                '<td>'+comfn.SS.getName("group",obj.group)+'</td>'+
                                '<td>'+comfn.SS.getName("schoolE",obj.schoolE)+'</td>'+
                                '<td>'+comfn.SS.getName("gradeE",obj.gradeE)+'</td>'+
                                '<td>'+comfn.SS.getName("classE",obj.classE)+'</td>'+
                                '<td>'+obj.title+'</td>'+
                                '<td><span class="date">'+dateFrom+'~'+dateTo+'</span></td>'+
                                '<td>'+comfn.SS.getName("share",obj.share)+'</td>'+
                                '<td>'+configstatus+'</td>'+
                                '<td>'+viewstatus+'</td>'+
                            '</tr>';
                        }else{
                          var $row='<tr data="'+obj.sheet_id+'">'+
                                '<td><div id="item1">'+status+'</div></td> '+
                                '<td>'+comfn.SS.getName("group",obj.group)+'</td>'+
                                '<td>'+comfn.SS.getName("schoolH",obj.schoolH)+'</td>'+
                                '<td>'+comfn.SS.getName("gradeH",obj.gradeH)+'</td>'+
                                '<td>'+comfn.SS.getName("classH",obj.classH)+'</td>'+
                                '<td>'+obj.title+'</td>'+
                                '<td><span class="date">'+dateFrom+'~'+dateTo+'</span></td>'+
                                '<td>'+comfn.SS.getName("share",obj.share)+'</td>'+
                                '<td>'+configstatus+'</td>'+
                                '<td>'+viewstatus+'</td>'+
                            '</tr>';
                        }

                        $('#educationListBody').append($row);
                    }
                }
            })
        },
        manageStopFlag:function($this,flag){

            //stopFlagを書き換える。
            var sendData = {
                'command':'manageStopFlag',
                'param':{
                    'flag':flag,
                    'where':$this.parent().parent().attr('data')
                }
            }
            $.ajax({
                url: 'ajax.php',
                type: 'POST',
                dataType:'json',
                data: JSON.stringify(sendData)
            }).done(function(){

                if(flag==0){
                   comfn.message_ok('完了','ステータスが設定中になりました。');
                    fn.sheetSearch({'command':'sheetSearch','param':""});
                }else{
                   comfn.message_ok('完了','設定を解除しました。');
                   fn.sheetSearch({'command':'sheetSearch','param':""});
                }

            });


        },
        dateSelect:function($this,id){


            // var sheet = param.sheet.filter(function(item, index){
            //   if (item.sheet_id == id) return true;
            // })[0];



            // var dateTo=(sheet.dateTo).split(' ')[0].split('-').join('/');
            // var dateFrom=(sheet.dateFrom).split(' ')[0].split('-').join('/');


            // $('#dateSearch').find('.dateTo').val(dateTo);
            // $('#dateSearch').find('.dateFrom').val(dateFrom);



            $('#dateSearch').dialog({
                modal: true,
                draggable:false,
                width:500,
                height:300,
                maxheight:300,
            　　　buttons: {
                　　　　"日付を変更": function(){
                        if($('#dateSearch').find('.dateTo').val()=="" ||
                            $('#dateSearch').find('.dateFrom').val()==""){
                            comfn.message_ok('未入力','日付を指定して下さい。');
                            return;
                        }
                        //日付を書き換える。
                        var sendData = {
                            'command':'manageDate',
                            'param':{
                                'id':id,
                                'dateTo':$('#dateSearch').find('.dateTo').val(),
                                'dateFrom':$('#dateSearch').find('.dateFrom').val()
                            }
                        }
                        $.ajax({
                            url: 'ajax.php',
                            type: 'POST',
                            dataType:'json',
                            data: JSON.stringify(sendData)
                        }).done(function(){

                            fn.sheetSearch({'command':'sheetSearch','param':""});
                            comfn.message_ok('完了','日付が更新されました。');

                            $this.text(dateTo+'~'+dateFrom);
                            $('#dateSearch').dialog("close");

                        });


                　　　　},
                　　　　"取り消す": function(){
                         $('#dateSearch').dialog("close");　
                　　　　}

            　　　}
            　})
            $.datepicker.formatDate( "yy-mm-dd", new Date( 2007, 1 - 1, 26 ) );
            $.datepicker.setDefaults( $.datepicker.regional[ "ja" ] );
            $( "#dateSearch .dateFrom").datepicker();
            $( "#dateSearch .dateTo" ).datepicker();
            //誤動作防止の為フォーカスを外す
            $( "#dateSearch .dateFrom").blur();

        }
    }
    //events
    $(document)   .on('click', 'span.date', function() {
        var id=$(this).parent().parent().attr('data');
        fn.dateSelect($(this),id);
    })

    // run
    fn.init();
});
