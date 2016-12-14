/*global $, console, alert, adminfn, commonfn, imageFactory*/
/*global getSelection, Range, Node, FileReader, URL, atob, Uint8Array, Blob, FormData*/
commonfn.loginCheck( function () 
{
    'use strict';
},
function () 
{
    'use strict';
    location.href = './../index/';
});
var rate = "";
var fn = (function () 
{
    'use strict';
    return {
        init : function () 
        {
            $("#nav").droppy({
                speed : 100 
            });
            var callback = function () 
            {
                adminfn.getTable('anaume', fn.setQuestionInfo);
            };
            adminfn.loginInfo(callback);
            //画像格納一時場所を設定
            adminfn.param.gazou = {};
            fn.changeResolution();
            fn.directionManage('horizon');
        },
        changeResolution : function ()
        {
            //ディスプレイ解像度
            var displayWidth = window.screen.width;
            //描画領域の幅
            var boxViewWidth = $("#viewArea").width();
            var boxViewHeight = $("#viewArea").height();
            //フルHDをベースとして，解像度に合わせ画面内に収まるように
            rate = (boxViewWidth) / 1920;
            $("textContents_wrapper").css("height", boxViewHeight * 0.9);
            $("textContents_wrapper").css("width",boxViewWidth);
            $("imageContents_wrapper").css("height", boxViewHeight * 0.9);
            $("imageContents_wrapper").css("width",boxViewWidth);
            $(".boxView").css({
                transform : 'scale(' + rate + ')' 
            });
        },
        syncSize : function ($this)
        {
            $("#imageContents").css('height', $this [0].scrollHeight);
            $("#imageContents").css('width', $this [0].scrollWidth) 
        },
        //基本情報
        setQuestionInfo : function () 
        {
            var status, category, num = Number(adminfn.takeGET().q);
            adminfn.displayUserInfo();
            if (num) {
                fn.questionOpen(num);
            }
            else 
            {
                status = adminfn.param.status;
                category = status.CATEGORY;
                $('#category').setOption(adminfn.SS.get('category'), category, 1);
                if (Number(category)) 
                {
                    adminfn.categorySelecter($('#school'), category, 'school', status.SCHOOL);
                    adminfn.categorySelecter($('#grade'), category, 'grade', status.GRADE);
                    adminfn.categorySelecter($('#curriculum'), category, 'curriculum', status.CURRICULUM);
                }
                adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
                $('#share').setOption(adminfn.SS.get('share'), 1, 1);
            }
        },
        //教材読み込み
        questionOpen : function (num) 
        {
            var sendData = {
                command : 'open', param : num 
            };
            $.ajax({
                url : './ajax.php', type : 'POST', dataType : 'json', data : JSON.stringify(sendData) 
            }).done(function (data) 
            {
                var array, obj, i, ic, callback, category = data.category;
                $('#category').setOption(adminfn.SS.get('category'), category, 1);
                adminfn.categorySelecter($('#school'), category, 'school', data.school);
                adminfn.categorySelecter($('#grade'), category, 'grade', data.grade);
                adminfn.categorySelecter($('#curriculum'), category, 'curriculum', data.curriculum);
                adminfn.unitSelecter($('#unit'), data.grade, data.curriculum, data.unit);
                $('#share').setOption(adminfn.SS.get('share'), data.share, 1);
                $('#title').val(data.title);
                $('#textContents').html(data.textContents);
                //調整必要？
                if (data.textStyle) 
                {
                    $("#textContents").removeClass("textContents_horizon").addClass("textContents_vertical");
                    $(".boxView").removeClass("boxView_horizon").addClass("boxView_vertical");
                    $("#imageContents").removeClass("imageContents_horizon").addClass("imageContents_vertical");
                    $("#textContents_wrapper").removeClass("textContents_wrapper_horizon").addClass("textContents_wrapper_vertical");
                    $("#imageContents_wrapper").removeClass("imageContents_wrapper_horizon").addClass("imageContents_wrapper_vertical");
                } else {
                    $("#textContents").removeClass("textContents_vertical").addClass("textContents_horizon");
                    $(".boxView").removeClass("boxView_vertical").addClass("boxView_horizon");
                    $("#imageContents").removeClass("imageContents_vertical").addClass("imageContents_horizon");
                    $("#textContents_wrapper").removeClass("textContents_wrapper_vertical").addClass("textContents_wrapper_horizon");
                    $("#imageContents_wrapper").removeClass("imageContents_wrapper_vertical").addClass("imageContents_wrapper_horizon");
                }
                //画像
                array = JSON.parse(data.imageContents);
                for (i = 0, ic = array.length; i < ic; i += 1) 
                {
                    obj = array[i];
                    $('#imageContents').append($('<img/>', 
                    {
                        id : obj.fileName, "class" : "ui-widget-content", name : 'gazou', alt : obj.fileName, 
                        style : obj.style, degree : obj.degree 
                    }).attr('data', obj.data));
                    callback = function (data, fileName) 
                    {
                        var $target = $('#' + fileName);
                        adminfn.param.gazou[fileName] = data;
                        if ($target.attr('data')) {
                            $target.addClass('hyperLinkArea blueLine');
                        }
                        $target.attr('src', URL.createObjectURL(data));
                    };
                    commonfn.loadImage(obj.fileName, callback);
                }
                //ふせん
                array = JSON.parse(data.fusen);
                for (i = 0, ic = array.length; i < ic; i += 1) 
                {
                    obj = array[i];
                    $('#imageContents').append($('<img/>', 
                    {
                        id : obj.fileName, "class" : "ui-widget-content fusen_on", name : 'fusen', style : obj.style, 
                        src : "./../common/images/fusen_on.png" 
                    }).attr('double', 2));
                }
            }).always(function (data) 
            {
                //console.log(data);
            });
        },
        paramCheck : function () 
        {
            var obj, flag = false, param = {}, message = '';
            param = 
            {
                category : $('#category').val(), school : $('#school').val(), grade : $('#grade').val(), 
                curriculum : $('#curriculum').val(), unit : $('#unit').val(), title : $('#title').val(), 
                share : $('#share').val(), textContents : $('#textContents').html(), imageContents : $('#imageContents img[name=gazou]').map(function () 
                {
                    return {
                        fileName : this.id, style : this.getAttribute('style'), data : this.getAttribute('data'), 
                        degree : imageFactory._getDegree($(this)) 
                    };
                }).get(), fusen : $('#imageContents img[name=fusen]').map(function () 
                {
                    return {
                        fileName : this.id, style : this.getAttribute('style') 
                    };
                }).get(), //付加するクラス名を半角スペース区切りで格納でよい？
                textStyle : $('#textContents').hasClass('textContents_vertical') ? 'verticalWriting' : null 
            };
            if (!param.category) {
                message += '「種別」';
            }
            if (!param.school) {
                message += '「学校」';
            }
            if (!param.grade) {
                message += '「学年」';
            }
            if (!param.curriculum) {
                message += '「教科」';
            }
            if (!param.unit) {
                message += '「テーマ」';
            }
            if (!param.share) {
                message += '「共有範囲」';
            }
            if (message) {
                message += 'が選択されていません。';
            }
            if (!param.title) {
                if (message) {
                    message += '<br/>';
                }
                message += '「タイトル」が入力されていません。';
            }
            if (!message) {
                flag = true;
            }
            obj = {
                flag : flag, param : param, message : message 
            };
            return obj;
        },
        //保存済み設問チェック
        questionExist : function (param, callback) 
        {
            var sendData = {
                command : 'exist', param : param 
            };
            $.ajax({
                url : './ajax.php', type : 'POST', dataType : 'json', data : JSON.stringify(sendData) 
            }).done(function (data) 
            {
                if (data.flag) {
                    callback(param, data.flag);
                }
                else {
                    callback(param, null);
                }
            });
        },
        //教材保存
        questionSave : function (obj, flag) 
        {
            var array, type, title, btn, sendData, callback;
            if (flag === 'true') {
                title = '設問の上書き保存';
                btn = '上書き保存';
                type = 'update';
            }
            else if (flag === 'false') {
                title = '設問の新規保存';
                btn = '新規保存';
                type = 'insert';
            }
            else {
                console.log('save type error');
                return false;
            }
            array = ['category', 'school', 'grade', 'curriculum', 'unit', 'share', 'title'];
            $('#saveModal .infoItem').each(function (num, ele) 
            {
                switch (array[num]) 
                {
                    case 'unit':
                        $(this).next('.infoCheck').html($('#unit option[value="' + obj.unit + '"]').text());
                        break;
                    case 'title':
                        $(this).next('.infoCheck').html($('#title').val());
                        break;
                    default:
                        $(this).next('.infoCheck').html(adminfn.SS.getName(array[num], obj[array[num]]));
                        break;
                }
            });
            sendData = {
                command : type, param : obj 
            };
            //保存ウィンドウ「OK」押下時処理
            callback = function () 
            {
                $(".ui-dialog-content").dialog("close");
                fn.imageSave();
                $.ajax({
                    url : './ajax.php', type : 'POST', dataType : 'json', data : JSON.stringify(sendData) 
                }).done(function (data) 
                {
                    if (Number(data.result)) {
                        var url = "?q=" + data.result;
                        //URLパラメーター書き換え
                        history.replaceState(null, null, url);
                    }
                    adminfn.alertDialog('', btn + 'が完了しました。', null);
                });
            };
            //保存ウィンドウ
            $("#saveModal").dialog(
            {
                modal : true, draggable : false, resizable : false, width : 'auto', height : 'auto', title : title, 
                dialogClass : 'saveModal', buttons : [ {
                    text : btn, title : btn, click : callback 
                },
                {
                    text : 'キャンセル', title : 'キャンセル',
                    click : function () 
                    {
                        $(this).dialog("close");
                    }
                } ] 
            });
        },
        imageSave : function () 
        {
            var i, ic, formData = new FormData(), array = adminfn.param.gazou;
            $.each(array, function (key, value) 
            {
                formData.append('fileName', key);
                formData.append('imgData', value);
                $.ajax(
                {
                    url : './../common/php/imageSave.php', type : 'POST', dataType : 'json', data : formData, 
                    processData : false, contentType : false 
                }).done(function (data) 
                {
                    //console.log(data);
                }).always(function (data) 
                {
                    //console.log(data);
                });
            });
        },
        directionManage : function (rotate) 
        {
            $("#textContents").css({
                'left' : "0", 'right' : "0", 
            });
            if (rotate == 'vertical') {
                $("#textContents_wrapper").removeClass('textContents_wrapper_horizon').addClass('textContents_wrapper_vertical');
                $("#textContents").removeClass('textContents_horizon').addClass('textContents_vertical');
                $(".boxView").removeClass('boxView_horizon').addClass('boxView_vertical');
                $("#imageContents_wrapper").removeClass('imageContents_wrapper_horizon').addClass('imageContents_wrapper_vertical');
                $("#imageContents").removeClass('imageContents_horizon').addClass('imageContents_vertical');
                //writing-modeのCSS解釈がブラウザによって異なる
                //chromeは要件外だが，念のため導入
                var userAgent = window.navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('chrome') != - 1) {
                    $("#textContents").css({
                        'left' : '-80px', 'right' : '80px', 
                    }) 
                }
            }
            else 
            {
                $("#textContents_wrapper").addClass('textContents_wrapper_horizon').removeClass('textContents_wrapper_vertical');
                $("#textContents").removeClass('textContents_vertical').addClass('textContents_horizon');
                $(".boxView").removeClass('boxView_vertical').addClass('boxView_horizon');
                $("#imageContents_wrapper").addClass('imageContents_wrapper_horizon').removeClass('imageContents_wrapper_vertical');
                $("#imageContents").removeClass('imageContents_vertical').addClass('imageContents_horizon');
            }
            $("#viewArea").height();
            $("#textContents_wrapper").css('height', $("#viewArea").height() * 1 / rate);
            $("#imageContents_wrapper").css('height',$("#viewArea").height() * 1 / rate);
            $(".boxView").css('height', $("#viewArea").height() * 1 / rate);
            fn.syncSize($('#textContents')) 
        },
        fusenInsert : function () 
        {
            var fusenID = 'fusen' + commonfn.getNowDate();
            $('#imageContents').append( $("<img/>", 
            {
                "id" : fusenID, "class" : "ui-widget-content fusen_on", "name" : "fusen", "src" : "./../common/images/fusen_on.png" 
            }).css({
                //"box-sizing": "reset",
                //"cursor": "pointer",
                "position" : "absolute" 
            }).attr('double', 2) );
            imageFactory.delFocus();
            imageFactory._addHandle(fusenID);
        },
        fusenSwitch : function ($target) 
        {


            if ($target.hasClass('fusen_on')) 
            {
                $target.removeClass('fusen_on').addClass('fusen_off').attr('src', './../common/images/fusen_off.png');
            }
            else 
            {
                $target.removeClass('fusen_off').addClass('fusen_on').attr('src', './../common/images/fusen_on.png');
            }
        }
    };
}
());
var nodeFactory = (function () 
{
    return {
        setLineStyle : function (callback) 
        {
            nodeFactory.setNodeStyle($("#textContents p"), callback, false);
            window.getSelection().collapse(document.body, 0);
        },
        setNodeStyle : function (candidateNodes, callback, extractsTextRange) 
        {
            var i, ic, currentRange, range, targetNodes, selection = getSelection();
            if (selection.rangeCount > 0) 
            {
                var range = selection.getRangeAt(0);
                //スタイル適用対象のノードを入れる配列
                var targetNodes = new Array();
                for (var i = 0; i < candidateNodes.length; i++) 
                {
                    var currentRange = document.createRange();
                    currentRange.selectNodeContents(candidateNodes[i]);
                    if (extractsTextRange) {
                        //ノードの範囲をテキストの範囲に狭める
                        currentRange = nodeFactory.getTextRange(currentRange);
                    }
                    if (currentRange.compareBoundaryPoints(Range.START_TO_END, range) > 0 && currentRange.compareBoundaryPoints(Range.END_TO_START, 
                    range) < 0) {
                        //現在のノードがRangeの一部または全部を含む場合はスタイル適用対象
                        targetNodes.push(candidateNodes[i]);
                    }
                    if (currentRange.compareBoundaryPoints(Range.END_TO_START, range) >= 0) {
                        //現在のノードがRangeより完全に後ろにある場合は終了する
                        break;
                    }
                }
                callback(targetNodes);
                window.getSelection().collapse(document.body, 0);
            }
        },
        getTextRange : function (range) 
        {
            var textRange = range.cloneRange();
            if (textRange.collapsed) {
                //テキストを含んでいない場合
                return textRange;
            }
            //開始位置
            if (range.startContainer.nodeType != Node.TEXT_NODE) 
            {
                var node = range.startContainer;
                node = node.firstChild;
                for (var i = 0; i < range.startOffset; i++) 
                {
                    node = node.nextSibling;
                    if (!node) {
                        node = nodeFactory.nextNode(range.startContainer.lastChild, false, null);
                        break;
                    }
                }
                if (!nodeFactory.isTextNode(node)) {
                    node = nodeFactory.nextTextNode(node, null);
                }
                textRange.setStart(node, 0);
            }
            else if (range.startOffset == range.startContainer.length) 
            {
                var node = range.startContainer;
                node = nodeFactory.nextTextNode(node, null);
                textRange.setStart(node, 0);
            }
            //終了位置
            if (range.endContainer.nodeType != Node.TEXT_NODE) 
            {
                var node = range.endContainer;
                node = node.firstChild;
                if (range.endOffset == 0) {
                    node = nodeFactory.prevTextNode(range.endContainer, null);
                }
                else 
                {
                    for (var i = 0; i < range.endOffset - 1; i++) {
                        node = node.nextSibling;
                    }
                    node = nodeFactory.lastNode(node);
                }
                if (!nodeFactory.isTextNode(node)) {
                    node = nodeFactory.prevTextNode(node, null);
                }
                textRange.setEnd(node, node.length);
            }
            else if (range.endOffset == 0) 
            {
                var node = range.endContainer;
                node = nodeFactory.prevTextNode(node, null);
                textRange.setEnd(node, node.length);
            }
            return textRange;
        },
        //合理的
        isTextNode : function (node) 
        {
            return (node.nodeType == Node.TEXT_NODE && node.textContent.trim() != "") ? true : false;
        },
        nextTextNode : function (node, endNode) 
        {
            do {
                node = nodeFactory.nextNode(node, true, endNode);
            }
            while (node != null && !nodeFactory.isTextNode(node));
            return node;
        },
        prevTextNode : function (node, startNode) 
        {
            do {
                node = nodeFactory.prevNode(node, startNode);
            }
            while (node != null && !nodeFactory.isTextNode(node));
            return node;
        },
        nextNode : function (node, child, endNode) 
        {
            if (child && node.firstChild) {
                return node.firstChild;
            }
            if (!endNode) {
                endNode = document.body;
            }
            while (node != endNode) {
                if (node.nextSibling) {
                    return node.nextSibling;
                }
                node = node.parentNode;
            }
            return null;
        },
        /**
         * 前の兄弟の最後の子孫を探す。
         * 前の兄弟が子を持たない場合は、前の兄弟を返す
         * そのノード内に兄弟がいない場合は、親を返す
         */
        prevNode : function (node, startNode) 
        {
            if (!startNode) {
                startNode = document.body;
            }
            if (!node.previousSibling) {
                if (node.parentElement == startNode) {
                    return null;
                }
                return node.parentNode;
            }
            return nodeFactory.lastNode(node.previousSibling);
        },
        /**
         * 指定したノードの最後の子孫を探す。
         * 指定したノードが子を持たない場合は、自分自身を返す
         */
        lastNode : function (node) 
        {
            while (node.lastChild) {
                node = node.lastChild;
            }
            return node;
        },
        setTextStyle : function (callback) 
        {
            var textContainer = $("#textContents")[0];
            var selection = getSelection();
            if (selection.rangeCount > 0) 
            {
                var range = selection.getRangeAt(0);
                //テキストノードの事前処理
                if (range.startContainer.nodeType == Node.TEXT_NODE) 
                {
                    //テキストノードをRangeの開始点の位置で2つに分ける
                    range.startContainer.splitText(range.startOffset);
                    //選択範囲の開始点をテキストノードの外側にする
                    range.setStartAfter(range.startContainer);
                }
                //終了点についても同じ処理を行う
                if (range.endContainer.nodeType == Node.TEXT_NODE) 
                {
                    //テキストノードをRangeの終了点の位置で2つに分ける
                    range.endContainer.splitText(range.endOffset);
                    //選択範囲の終了点をテキストノードの外側にする
                    range.setEndAfter(range.endContainer);
                }
                //現在処理中のノードを初期化
                var currentNode = textContainer;
                var currentRange = document.createRange();
                currentRange.selectNode(currentNode);
                //スタイル適用対象のノードを入れる配列
                var targetNodes = new Array();
                while (currentNode = nodeFactory.nextTextNode(currentNode, textContainer)) 
                {
                    currentRange.selectNode(currentNode);
                    if (currentRange.compareBoundaryPoints(Range.END_TO_START, range) >= 0) {
                        //現在のノードがRangeより完全に後ろにある場合は終了する
                        break;
                    }
                    if (currentRange.compareBoundaryPoints(Range.START_TO_START, range) >= 0 && currentRange.compareBoundaryPoints(Range.END_TO_END, 
                    range) <= 0) 
                    {
                        //現在のノードがRangeに完全に含まれる場合、このノードにスタイルを適用
                        (function () 
                        {
                            var node = currentNode;
                            var range = document.createRange();
                            range.selectNode(node);
                            node = $("<span>")[0];
                            range.surroundContents(node);
                            targetNodes.push(node);
                        })();
                    }
                }
                callback(targetNodes);
                //選択状態解除
                window.getSelection().collapse(document.body, 0);
            }
        },
        getStyle : function (node, styleName) 
        {
            var textContainer = $("#textContents");
            while (node && node !== textContainer[0]) 
            {
                if (node.style && node.style[styleName]) {
                    return node.style[styleName];
                }
                node = node.parentNode;
            }
            return null;
        },
        surroundWithPTag : function () 
        {
            var textContainer = $("#textContents")[0];
            if (textContainer.firstChild.nodeType == Node.TEXT_NODE) 
            {
                //要素がテキストノードの場合はpで囲む
                var range = document.createRange();
                range.selectNode(textContainer.firstChild);
                var p = $("<p>");
                range.surroundContents(p);
                var sel = getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    };
}
());
var styleFactory = (function () 
{
    return {
        clearStyle : function () 
        {
            nodeFactory.setLineStyle(function (nodes) 
            {
                var i, ic, text;
                for (i = 0, ic = nodes.length; i < ic; i += 1) 
                {
                    text = nodes[i].textContent;
                    nodes[i].style.cssText = "";
                    while (nodes[i].hasChildNodes()) {
                        nodes[i].removeChild(nodes[i].firstChild);
                    }
                    nodes[i].textContent = text;
                }
            });
        },
        textAlign : function (align) 
        {
            // nodeFactory.surroundWithPTag();
            nodeFactory.setLineStyle(function (nodes) 
            {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["text-align"] = align;
                }
            });
        },
        lineHeight : function (height) 
        {
            nodeFactory.setLineStyle(function (nodes) 
            {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["line-height"] = height;
                }
            });
        },
        fontSize : function (em) 
        {
            nodeFactory.setLineStyle(function (nodes) 
            {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["font-size"] = em + "em";
                }
            });
        },
        fontWeight : function () 
        {
            nodeFactory.setTextStyle(function (nodes) 
            {
                for (var i = 0; i < nodes.length; i++) 
                {
                    nodes[i].style["font-weight"] = (nodeFactory.getStyle(nodes[0], "font-weight") == "bold") ? "normal" : "bold";
                }
            });
            styleFactory.underlineForce();
        },
        fontColor : function (color) 
        {
            nodeFactory.setTextStyle(function (nodes) 
            {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["color"] = color;
                }
            });
            styleFactory.underlineForce();
        },
        textDecoration : function () 
        {
            var spans = $("#textContents span");
            var underLineSpans = new Array();
            for (var i = 0; i < spans.length; i++) 
            {
                if (spans[i].textContent != "" && spans[i].style["text-decoration"] == "underline") {
                    underLineSpans.push(spans[i]);
                }
            }
            nodeFactory.setNodeStyle(underLineSpans, function (nodes) 
            {
                if (nodes.length > 0) {
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].style["text-decoration"] = "";
                    }
                }
                else 
                {
                    nodeFactory.setTextStyle(function (targetNodes) 
                    {
                        for (var i = 0; i < targetNodes.length; i++) {
                            targetNodes[i].style["text-decoration"] = "underline";
                        }
                    });
                }
            }, true);
        },
        underlineForce : function () 
        {
            var $spans = $("#textContents").find("span[style*='text-decoration']");
            $spans.addClass("text-decoration").css("text-decoration", "");
            for (var i = 0;i < $spans.length;i++){
                //都度，選択範囲を動的生成する
                var element = $spans[i];
                var rng = document.createRange();
                rng.selectNodeContents(element);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(rng);
                nodeFactory.setNodeStyle($spans[i], function (nodes) 
                {
                    nodeFactory.setTextStyle(function (targetNodes) 
                    {
                        for (var i = 0; i < targetNodes.length; i++) {
                            targetNodes[i].style["text-decoration"] = "underline";
                        }
                    });
                }, true);
            }
            $('.text-decoration').each(function () 
            {
                $(this).replaceWith($(this).html());
            });
        },
        
        
        anaaki : function () 
        {
            var range, contents, $span, $p, selection = getSelection();
            if (selection.rangeCount > 0) 
            {
                range = selection.getRangeAt(0);
                contents = range.extractContents();
                $span = $('<span/>').addClass('anaaki anaInvisible').text(contents.textContent);
                if (contents.firstChild.nodeName.toLowerCase() === 'p') {
                    //選択範囲が行をまたいでいる場合
                    $p = $('<p/>').append($span);
                    range.insertNode($p[0]);
                }
                else {
                    range.insertNode($span[0]);
                }
            }
        },
        clearAnaaki : function () 
        {
            var i, ic, $span, spans = $('#textContents .anaaki'), anaakiSpans = [];
            for (i = 0, ic = spans.length; i < ic; i += 1) {
                $span = $(spans[i]);
                if ($span.hasClass('anaaki')) {
                    anaakiSpans.push($span[0]);
                }
            }
            nodeFactory.setNodeStyle(anaakiSpans, function (nodes) 
            {
                var i, ic;
                if (nodes.length > 0) {
                    for (i = 0, ic = nodes.length; i < ic; i += 1) {
                        nodes[i].className = '';
                    }
                }
            }, true);
        },
        insertLink : function () 
        {
            var range, contents, span, p, flag = 0, selection = window.getSelection();
            if (selection.rangeCount > 0 || $('#imageContents img[name=gazou]').hasClass('ui-resizable')) 
            {
                //flag 1:テキスト 2:画像
                //テキスト選択時（リンク設置場所準備）
                if ($('#imageContents img[name=gazou]').hasClass('ui-resizable')) {
                    flag = 2;
                }
                else if (selection.rangeCount > 0) {
                    flag = 1;
                }
                if (flag === 1) 
                {
                    range = selection.getRangeAt(0);
                    contents = range.extractContents();
                    span = $("<span/>")[0];
                    span.textContent = contents.textContent;
                    span.className = "hyperLinkArea";
                }
                $("#linkModal").dialog(
                {
                    modal : true, draggable : false, resizable : false, width : 'auto', height : 'auto', 
                    buttons : [ 
                    {
                        text : 'OK', title : 'OK',
                        click : function () 
                        {
                            if (!$("#linkUrl").val().match(/(http|ftp|https)s?:\/\/.+/)) 
                            {
                                adminfn.alertDialog("", "URLが正しくありません。");
                                $("#textContents .hyperLinkArea:not([data])").removeClass('hyperLinkArea');
                            }
                            else 
                            {
                                if (flag === 1) {
                                    span.setAttribute('data', $("#linkUrl").val());
                                }
                                else if (flag === 2) 
                                {
                                    $("img[class *= ui-resizable]").addClass("hyperLinkArea").addClass("blueLine").attr('data', 
                                    $("#linkUrl").val());
                                }
                            }
                            $(this).dialog("close");
                            $("#linkUrl").val("");
                        }
                    },
                    {
                        text : 'キャンセル', title : 'キャンセル',
                        click : function () 
                        {
                            $("#textContents .hyperLinkArea:not([data])").removeClass('hyperLinkArea');
                            $(this).dialog("close");
                            $("#linkUrl").val("");
                        }
                    } ] 
                });
                if (flag === 1) 
                {
                    if (contents.firstChild.nodeName.toLowerCase() === "p") {
                        //選択範囲が行をまたいでいる場合
                        p = $("<p/>")[0];
                        p.appendChild(span);
                        range.insertNode(p);
                    }
                    else {
                        range.insertNode(span);
                    }
                }
            }
        },
        deleteLink : function () 
        {
            var i, ic, title, message, callback, $spans = $("#textContents").find(".hyperLinkArea"), linkSpans = [];
            for (i = 0, ic = $spans.length; i < ic; i += 1) 
            {
                if ($spans[i].textContent !== "" && $spans[i].className === "hyperLinkArea") {
                    linkSpans.push($spans[i]);
                }
            }
            if (!linkSpans.length && !$('#imageContents .ui-resizable[name=gazou]').hasClass('hyperLinkArea')) {
                adminfn.alertDialog('リンク解除', 'リンクが設定されたテキストもしくは画像を選択してください', null);
                return false;
            }
            title = 'リンク解除';
            message = 'URLのリンクを解除します．<br>よろしいですか？';
            callback = function () 
            {
                nodeFactory.setNodeStyle(linkSpans, function (nodes) 
                {
                    var i, ic;
                    if (nodes.length > 0) 
                    {
                        for (i = 0, ic = nodes.length; i < ic; i += 1) {
                            nodes[i].className = "";
                            nodes[i].removeAttribute('data');
                            console.log(nodes[i]);
                        }
                    }
                }, true);
                if (!linkSpans.length) 
                {
                    $("img[class *= ui-resizable]").removeClass("hyperLinkArea").removeClass("blueLine");
                }
            };
            adminfn.alertDialog(title, message, callback);
        }
    };
}
());
var imageFactory = (function () 
{
    var zIndex = 4;
    return {
        upload : function () 
        {
            var $image = $('#imageContents'), $input;
            //Up用のエレメント作成
            $input = $("<input type='file' accept='image/*' style='display:none;'>");
            $input.on("change", function () 
            {
                imageFactory._insert(this.files[0], '"' + $image.attr('id') + '"');
            });
            //一時的に追加し削除
            $image.append($input);
            $input.trigger('click');
        },
        _insert : function (imgFile) 
        {
            var reader;
            reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onloadend = function () 
            {
                imageFactory._create(reader.result, imgFile.name);
            };
        },
        _create : function (src, srcFileName) 
        {
            var $image = $('#imageContents'), img = new Image();
            img.src = src;
            img.onload = function () 
            {
                var canvas, context, maxSize, rw, rh, blob, imgFileName, handleBox, gazou, gazouBox, handleBox01, 
                handleBox02, handleBox03;
                canvas = $("<canvas>")[0];
                context = canvas.getContext("2d");
                maxSize = 500;
                rw = img.width;
                rh = img.height;
                if (img.width > img.height) {
                    if (img.width > maxSize) {
                        rw = maxSize;
                        rh = img.height * maxSize  / img.width;
                    }
                }
                if (img.width < img.height) {
                    if (img.height > maxSize) {
                        rw = img.width * maxSize  / img.height;
                        rh = maxSize;
                    }
                }
                context.clearRect(0, 0, 0, 0);
                canvas.width = rw;
                canvas.height = rh;
                context.drawImage(img, 0, 0, rw, rh);
                imgFileName = 'img' + commonfn.getNowDate() + srcFileName.match(/(.*)(?:\.([^.]+$))/)[1];
                //DB保存用に一時確保
                dataUrl = canvas.toDataURL("image/png");
                blobData = imageFactory._base64toBlob(dataUrl);
                adminfn.param.gazou[imgFileName] = blobData;
                $gazou = $("<img>", {
                    "id" : imgFileName, "class" : "ui-widget-content", "name" : "gazou", "alt" : imgFileName 
                }).css(
                {
                    // "box-sizing": "reset",
                    "cursor" : "pointer", // "z-index": zIndex += 10,
                    "position" : "absolute" 
                }).attr("src", URL.createObjectURL(blobData));
                $image.append($gazou);
                $image.find("input").remove();
            };
        },
        _base64toBlob : function (base64Data) 
        {
            var bin, buffer, blob, i;
            bin = atob(base64Data.replace(/^.*,/, ""));
            buffer = new Uint8Array(bin.length);
            for (i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }
            blob = new Blob([buffer.buffer], {
                type : "image/png" 
            });
            return blob;
        },
        focus : function (e) 
        {
            if (window.location.pathname.split("/").pop() === "education.html") {
                return false;
            }
            if (e.target.id == "") {
                return;
            }
            if (e.target.id == "imageContents")
            {
                //画像を2枚以上配置し，先に配置したほうをドラッグして，後に配置した方に重ねると
                //target.idがImagecontentsになり，エラーとなる不具合
                imageFactory.delFocus();
                return false;
            }
            //アクティブな画像がない場合
            if ($('#imageContents .ui-wrapper').length == 0) {
                imageFactory._addHandle(e.target.id);
            }
            else 
            {
                //アクティブな画像がある
                if ($(document.getElementById(e.target.id)).parent().hasClass('ui-wrapper')) {
                    //クリックした画像がアクティブな場合，delして終了
                    imageFactory._delHandle(e.target.id);
                }
                else 
                {
                    //クリックした画像がアクティブでない場合，クリック画像はアクティブに，その他はdel
                    $('#imageContents .ui-wrapper').each(function () 
                    {
                        imageFactory._delHandle($(this).children("img").attr('id'));
                    });
                    imageFactory._addHandle(e.target.id);
                }
            }
        },
        _addHandle : function (handleTargetId) 
        {
            $target = $(document.getElementById(handleTargetId));
            //ふせんの処理判定
            if ($target.attr('name') === "gazou") {
                flag = true;
            }
            else {
                flag = false;
            }
            
            // $target.css("opacity", "0.2");
            $target.resizable(
            {
                aspectRatio : flag, //containment: "#imageContents"
                resize : function (event)
                {
                    $(this).parent().attr('draggable', 'false');
                    event.stopPropagation();
                }
            });
            var offset = $(viewArea).offset();
            var width = $(viewArea).width();
            var height = $(viewArea).height();
            //生成されるガワだけ使用する．ドラッグ部分は独自実装
            $target.parent().draggable(
            {
                containment : [ offset.left, offset.top, width, height ], stack : "true", drag : function ( event, 
                ui ) {
                    return false;
                },
                start : function ( event, ui )
                {
                    return false;
                }
            });
            $('#imageContents').append($('#imageContents').children('.ui-wrapper'));
            //ふせんをレイヤー上の最上面に表示させる
            $('#imageContents').append($('#imageContents').children('img[name=fusen]'));            
            

            //追従速度を上げるためネイティブで記載
            var func = (function (that)
            {
                if (that.getAttribute('draggable') == 'true')
                {
                    var element = document.getElementById("viewArea");
                    var rect = element.getBoundingClientRect() ;
                    var left = rect.left + window.pageXOffset ;
                    // 要素のX座標
                    var top = rect.top + window.pageYOffset ;
                    // 要素のY座標
                    var wrapper = document.getElementById("imageContents_wrapper");
                    var scrollTop = wrapper.scrollTop;
                    var scrollLeft = wrapper.scrollLeft;
                    var relativeMouseY = that.clientHeight / 2;
                    var relativeMouseX = that.clientWidth / 2;
                    // that.children[handleTargetId].style.top = (event.clientY + scrollTop - (top + (relativeMouseY) * rate)) * (1 / rate) + "px";
                    // that.children[handleTargetId].style.left = (event.clientX + scrollLeft - (left + (relativeMouseX) * rate)) * (1 / rate) + "px";
                    that.style.top = (event.clientY + scrollTop - (top + (relativeMouseY) * rate)) * (1 / rate) + "px";
                    that.style.left = (event.clientX + scrollLeft - (left + (relativeMouseX) * rate)) * (1 / rate) + "px";
                }
            });
            
            $target.parent().on('mousedown', function (event)
            {


                //クリックしたものがリサイズアイコンでない場合，ドラッグスイッチを入れる
                //回転の完了のクリック時も何もしない
                if (event.target.className.indexOf('ui-resizable-se') ==- 1　 && event.target.className.indexOf('rotate_handle') ==- 1 && 　($(event.target).attr('rotate_flag') != "true")) {
                    $(this).attr('draggable', 'true');
                    func(this);
                }
            });
            $target.parent().on('mouseup', function (event)
            {
                $(this).attr('draggable', 'false') 
            });
            //マウスへの追従速度を上げるため，この箇所はネイティブで書く
            $target.parent().on('mousemove', function (event)
            {
                func(this);
            });


            //以下回転に必要な処理のため「ふせん」はここで終了
            if (!flag) 
            {
                //操作するふせん以外をレイヤー上imgの上wrapperの下
                $('.ui-wrapper').before($('#imageContents').children('img[name=fusen]'));
                return false;
            }

            $target.parent() .prepend( $("<span>", {
                "class" : "rotate_handle", "text" : "●" 
            }).css(
            {
                "position" : "absolute", "cursor" : "crosshair", "z-index" : "10", "fontsize" : "20px", 
                "width" : "100%", "left" : 0, "right" : 0 
            }).click(function (e) 
            {
                var rotate_flag = $target.attr("rotate_flag");
                $target.attr("rotate_flag", (rotate_flag == "true") ? "false" : "true");
                var degree = imageFactory._getDegree($target);
                $target.parent().transition({
                    opacity : 1, scale : 1 
                }, 0);
                $target.parent().css({
                    rotate : degree + 'deg' 
                });
                e.stopPropagation();
            }) );
            //ラッパーに角度をつける
            $target.parent().css("rotate", $target.attr("degree"));
            //内部の角度は0に戻す
            $target.css({
                "rotate" : "0deg" 
            });
            $target.parent().mousemove(function (e) 
            {
                var rotate_flag = $target.attr("rotate_flag");
                if (rotate_flag == "true") 
                {
                    var degree = imageFactory._getDegree($target, e);
                    $target.parent().transition({
                        opacity : 1, scale : 1 
                    }, 0);
                    $target.parent().css({
                        rotate : degree + 'deg' 
                    });
                }
            }) 
        },
        _delHandle : function (handleTargetId) 
        {
            var handles, i;
            $target = $(document.getElementById(handleTargetId));
            var rotate_flag = $target.attr("rotate_flag");
            if (rotate_flag == "true") {
                $target.attr("rotate_flag", "false");
            }
            var degree = $target.attr("degree");
            //画像に，外枠の角度を反映
            $target.css("transform", "scale(1, 1) rotate(" + degree + "deg)");
            $target.css("opacity", "1");
            $target.parent().draggable("destroy");
            $target.resizable("destroy");
        },
        _getDegree : function ($target, e) 
        {
            e = e || null;
            var imgRect = $target[0].getBoundingClientRect();
            if (e) {
                $target.attr("rotate_x", e.clientX);
                $target.attr("rotate_y", e.clientY);
            }
            var rotate_x = $target.attr("rotate_x");
            var rotate_y = $target.attr("rotate_y");
            if (rotate_x == 0 && rotate_y == 0) {
                return 0;
            }
            var mousePos = {
                "x" : rotate_x, "y" : rotate_y 
            }
            　 var imgPos = {
                "x" : imgRect.left + (imgRect.width  / 2), "y" : imgRect.top + (imgRect.height  / 2) 
            };
            var radian = Math.atan2((imgPos.y - mousePos.y), (imgPos.x - mousePos.x));
            //現在の角度を格納
            var degree = (radian * 180  / Math.PI) - 90;
            $target.attr("degree", degree);
            return degree;
        },
        del : function (e)
        {
            if (e.keyCode === 46 && $('#imageContents .ui-wrapper').length > 0) 
            {
                delete adminfn.param.gazou[$('#imageContents .ui-wrapper img').attr('id')];
                $('#imageContents .ui-wrapper img').remove();
                $('#imageContents .ui-wrapper').remove();
                //削除効果がテキストコンテントに及ぶのを防ぐ
                e.preventDefault();
            }
        },
        delFocus : function ()
        {
            if ($('#imageContents .ui-wrapper').length > 0)
            {
                $('#imageContents .ui-wrapper').each(function () 
                {
                    imageFactory._delHandle($(this).children("img").attr('id'));
                });
            }
        }
    }
})();
$(function () 
{
    'use strict';
    //events
    $(document) .on('change', '#category', function () 
    {
        //学校種別切り替え時イベント
        var array, category = $(this).val();
        adminfn.categorySelecter($('#school'), category, 'school');
        adminfn.categorySelecter($('#grade'), category, 'grade');
        adminfn.categorySelecter($('#curriculum'), category, 'curriculum');
    }).on('change', '#category, #grade, #curriculum', function () 
    {
        adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
    }).on('click', '#button_edit', function () 
    {
        //保存時フォーカス強制解除
        imageFactory.delFocus();
        //保存（作成画面ボタン）
        var obj = fn.paramCheck();
        if (obj.flag) {
            fn.questionExist(obj.param, fn.questionSave);
        }
        else {
            adminfn.alertDialog('未入力項目', obj.message, null);
        }
    }).on('click', '#fusenInsert', function () 
    {
        fn.fusenInsert();
    }).on('click', '#newCreate', function () 
    {
        var title = '新規作成', message = '編集内容は保存されません<br />内容をリセットしてもよろしいですか', callback = function () 
        {
            $(".boxView").removeClass("verticalWriting");
            $('#textContents').html('<p><br /></p>').removeClass("verticalWriting");
            $('#imageContents').empty().removeClass("verticalWriting");
            adminfn.param.gazou = {};
            $("#textContents");
            history.replaceState(null, null, '');
        };
        adminfn.alertDialog(title, message, callback);
    });
    //dirextion control
    $(document) .on('mousedown', '#textyoko', function () 
    {
        fn.directionManage('horizon');
    }).on('mousedown', '#texttate', function () 
    {
        fn.directionManage('vertical');
    })
    //clearStyle
    $(document) .on('click', '#formatclear', function () 
    {
        styleFactory.clearStyle();
    });
    //text-align
    $(document) .on('mousedown', '#alignleft', function () 
    {
        styleFactory.textAlign('left');
    }).on('mousedown', '#aligncenter', function () 
    {
        styleFactory.textAlign('center');
    }).on('mousedown', '#alignright', function () 
    {
        styleFactory.textAlign('right');
    });
    //line-height
    $(document) .on('mousedown', '#lineHeight_normal', function () 
    {
        styleFactory.lineHeight('normal');
    }).on('mousedown', '#lineHeight_2', function () 
    {
        styleFactory.lineHeight(2);
    }).on('mousedown', '#lineHeight_3', function () 
    {
        styleFactory.lineHeight(3);
    }).on('mousedown', '#lineHeight_4', function () 
    {
        styleFactory.lineHeight(4);
    });
    //font-size
    $(document) .on('mousedown', '#size_1', function () 
    {
        styleFactory.fontSize('1');
    }).on('mousedown', '#size_2', function () 
    {
        styleFactory.fontSize('2');
    }).on('mousedown', '#size_4', function () 
    {
        styleFactory.fontSize('4');
    }).on('mousedown', '#size_6', function () 
    {
        styleFactory.fontSize('6');
    }).on('mousedown', '#size_8', function () 
    {
        styleFactory.fontSize('8');
    });
    //font-weight,text-decoration,font-color
    $(document) .on('click', "#fontWeight", function () 
    {
        styleFactory.fontWeight();
    }).on('click', "#underLine", function () 
    {
        styleFactory.textDecoration();
    }).on('click', "#fontRed", function () 
    {
        styleFactory.fontColor('red');
    }).on('click', "#fontBlue", function () 
    {
        styleFactory.fontColor('blue');
    }).on('click', "#fontBlack", function () 
    {
        styleFactory.fontColor('black');
    });
    //initial
    $(document) .on('click', "#insertImage", function () 
    {
        imageFactory.upload();
    });
    //anaaki,link
    $(document).on('click', "#anaaki", function () 
    {
        if (String(document.getSelection()).length === 0) {
            adminfn.alertDialog("", "テキストを選択してください。");
        }
        else {
            styleFactory.anaaki();
        }
    }).on('click', "#clearAnaaki", function () 
    {
        styleFactory.clearAnaaki();
    }).on('click', "#insertLink", function () 
    {
        if ($("#viewArea img[name=gazou]").hasClass('ui-resizable') || String(document.getSelection()).length !== 0) {
            styleFactory.insertLink();
        }
        else {
            adminfn.alertDialog("", "テキストもしくは画像を選択してください。");
        }
    }).on('click', "#deleteLink", function () 
    {
        styleFactory.deleteLink();
    });
    //画像のフォーカス管理
    $(document) .on('click', "#imageContents", function (e) 
    {
        var $target = $(e.target), dblclick;
        //ダブルクリック識別
        if ($target.attr('name') === 'fusen') {
            dblclick = parseInt($target.attr('double'), 10);
            $target.attr('double', dblclick - 1);
        }
        setTimeout(function () 
        {
            if (parseInt($target.attr('double'), 10) === 0) {
                fn.fusenSwitch($target);
            }
            else 
            {
                //ダブルクリック時「double=2」になって2回目のイベントが入ってくるため、この時以外で実行
                if (parseInt($target.attr('double'), 10) !== 2) {
                    imageFactory.focus(e);
                }
            }
            if ($target.attr('name') === 'fusen') {
                $target.attr('double', 2);
            }
        }, 250);
    });
    //DELでフォーカスな画像を削除
    $(window).keydown(function (e) 
    {
        imageFactory.del(e);
    });
    //テキストにフォーカスしたら，画像のフォーカスを外す
    $(document) .on('focus', "#textContents", function () 
    {
        imageFactory.delFocus();
    });
    //テキストコンテンツエリアへの画像ドロップ禁止
    $(document).on('drop dragover', '#textContents', function (e) 
    {
        e.stopPropagation();
        e.preventDefault();
    });
    $(window).on('resize', function ()
    {
        fn.changeResolution();
    });
    $('#textContents').on('DOMSubtreeModified propertychange', function () 
    {
        fn.syncSize($(this));
    });
    // 画像へのスクロールイベント禁止
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $("#imageContents_wrapper").on(scroll_event, function (e)
    {
        e.preventDefault();
    });
    //横書き用スクロール同期
    $('#textContents_wrapper').scroll( function () 
    {
        $("#imageContents_wrapper").scrollLeft( $('#textContents_wrapper').scrollLeft() );
        $("#imageContents_wrapper").scrollTop( $('#textContents_wrapper').scrollTop() );
    });
    //縦書き用スクロール同期
    $('#textContents').scroll( function () 
    {
        $("#imageContents_wrapper").scrollLeft($('#textContents').scrollLeft() );
        $("#imageContents_wrapper").scrollTop( $('#textContents').scrollTop() );
    });
    fn.init();
});