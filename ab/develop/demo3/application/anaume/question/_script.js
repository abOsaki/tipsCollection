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
        init: function () {
            $("#nav").droppy({
                speed: 100
            });
            var callback = function () {
                adminfn.getTable('anaume', fn.setQuestionInfo);
            };
            adminfn.loginInfo(callback);
        },
        //基本情報
        setQuestionInfo: function () {
            var num = Number(adminfn.takeGET().q);
            adminfn.displayUserInfo();
            if (num) {
                fn.questionOpen(num);
            } else {
                var status = adminfn.param.status,
                    category = status.CATEGORY;
                $('#category').setOption(adminfn.SS.get('category'), category, 1);
                if (Number(category)) {
                    adminfn.categorySelecter($('#school'), category, 'school', status.SCHOOL);
                    adminfn.categorySelecter($('#grade'), category, 'grade', status.GRADE);
                    adminfn.categorySelecter($('#curriculum'), category, 'curriculum', status.CURRICULUM);
                }
                adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
                $('#share').setOption(adminfn.SS.get('share'), 1, 1);
            }
        },
        //教材読み込み
        questionOpen: function (num) {
            var sendData = {
                command: 'questionOpen',
                param: num
            };
            $.ajax({
                url: './ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var obj = data[0],
                    category = obj.category;
                adminfn.categorySelecter($('#school'), category, 'school', obj.SCHOOL);
                adminfn.categorySelecter($('#grade'), category, 'grade', obj.GRADE);
                adminfn.categorySelecter($('#curriculum'), category, 'curriculum', obj.CURRICULUM);
                //objのtextContentsとimageContentsを画面反映？
            });
        },
        paramCheck: function () {
            var obj,
                flag = false,
                param = {},
                message = '';

            param = {
                category: $('#category').val(),
                school: $('#school').val(),
                grade: $('#grade').val(),
                curriculum: $('#curriculum').val(),
                unit: $('#unit').val(),
                title: $('#title').val(),
                share: $('#share').val(),
                textContents: $('#textContents').html(),
                imageContents: $('#imageContents').html(),
                textStyle: $('#textContents').hasClass('verticalWriting') ? 'verticalWriting' : null
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
                flag: flag,
                param: param,
                message: message
            };
            return obj;
        },
        //保存済み設問チェック
        questionExist: function (param, callback) {
            var sendData = {
                command: 'exist',
                param: param
            };

            $.ajax({
                url: './ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                if (data.flag) {
                    callback(param, data.flag);
                } else {
                    callback(param, null);
                }
            });
        },
        //教材保存
        questionSave: function (obj, flag) {
            var array, type, title, btn, sendData, callback;
            if (flag === 'true') {
                title = '設問の上書き保存';
                btn = '上書き保存';
                type = 'update';
            } else if (flag === 'false') {
                title = '設問の新規保存';
                btn = '新規保存';
                type = 'insert';
            } else {
                console.log('save type error');
                return false;
            }

            array = ['category', 'school', 'grade', 'curriculum', 'unit', 'share', 'title'];
            $('#saveModal .infoItem').each(function (num, ele) {
                switch (array[num]) {
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
                command: type,
                param: obj
            };

            //保存ウィンドウ「OK」押下時処理
            callback = function () {
                $(".ui-dialog-content").dialog("close");
                $.ajax({
                    url: './ajax.php',
                    type: 'POST',
                    dataType: 'json',
                    data: JSON.stringify(sendData)
                }).done(function (data) {
                    if (Number(data.result)) {
                        var url = "?q=" + data.result;
                        //URLパラメーター書き換え
                        history.replaceState(null, null, url);
                    }
                    adminfn.alertDialog('', btn + 'が完了しました。', null);
                });
            };

            //保存ウィンドウ
            $("#saveModal").dialog({
                modal: true,
                draggable: false,
                resizable: false,
                width: 'auto',
                height: 'auto',
                title: title,
                dialogClass: 'saveModal',
                buttons: [
                    {
                        text: btn,
                        title: btn,
                        click: callback
                    },
                    {
                        text: 'キャンセル',
                        title: 'キャンセル',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        },
        directionManage: function (rotate) {
            if (rotate == 'vertical') {
                $("#textContents").addClass("verticalWriting");
                $("#boxView").addClass("verticalWriting");
                $("#imageContents").addClass("verticalWriting");
            } else {
                $("#textContents").removeClass("verticalWriting");
                $("#boxView").removeClass("verticalWriting");
                $("#imageContents").removeClass("verticalWriting");
            }
        },
    };
}());
var nodeFactory = (function () {
    return {
        setLineStyle: function (callback) {
            nodeFactory.setNodeStyle($("#textContents p"), callback, false);
            window.getSelection().collapse(document.body, 0);
        },
        setNodeStyle: function (candidateNodes, callback, extractsTextRange) {
            var selection = getSelection();
            if (selection.rangeCount > 0) {
                var range = selection.getRangeAt(0);
                //スタイル適用対象のノードを入れる配列
                var targetNodes = new Array();
                for (var i = 0; i < candidateNodes.length; i++) {
                    var currentRange = document.createRange();
                    currentRange.selectNodeContents(candidateNodes[i]);
                    if (extractsTextRange) {
                        //ノードの範囲をテキストの範囲に狭める
                        currentRange = nodeFactory.getTextRange(currentRange);
                    }
                    if (currentRange.compareBoundaryPoints(Range.START_TO_END, range) > 0 && currentRange.compareBoundaryPoints(Range.END_TO_START, range) < 0) {
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
        getTextRange: function (range) {
            var textRange = range.cloneRange();
            if (textRange.collapsed) {
                //テキストを含んでいない場合
                return textRange;
            }
            //開始位置
            if (range.startContainer.nodeType != Node.TEXT_NODE) {
                var node = range.startContainer;
                node = node.firstChild;
                for (var i = 0; i < range.startOffset; i++) {
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
            } else if (range.startOffset == range.startContainer.length) {
                var node = range.startContainer;
                node = nodeFactory.nextTextNode(node, null);
                textRange.setStart(node, 0);
            }
            //終了位置
            if (range.endContainer.nodeType != Node.TEXT_NODE) {
                var node = range.endContainer;
                node = node.firstChild;
                if (range.endOffset == 0) {
                    node = nodeFactory.prevTextNode(range.endContainer, null);
                } else {
                    for (var i = 0; i < range.endOffset - 1; i++) {
                        node = node.nextSibling;
                    }
                    node = nodeFactory.lastNode(node);
                }
                if (!nodeFactory.isTextNode(node)) {
                    node = nodeFactory.prevTextNode(node, null);
                }
                textRange.setEnd(node, node.length);
            } else if (range.endOffset == 0) {
                var node = range.endContainer;
                node = nodeFactory.prevTextNode(node, null);
                textRange.setEnd(node, node.length);
            }
            return textRange;
        },
        //合理的
        isTextNode: function (node) {
            return (node.nodeType == Node.TEXT_NODE && node.textContent.trim() != "") ? true : false;
        },
        nextTextNode: function (node, endNode) {
            do {
                node = nodeFactory.nextNode(node, true, endNode);
            } while (node != null && !nodeFactory.isTextNode(node));
            return node;
        },
        prevTextNode: function (node, startNode) {
            do {
                node = nodeFactory.prevNode(node, startNode);
            } while (node != null && !nodeFactory.isTextNode(node));
            return node;
        },
        nextNode: function (node, child, endNode) {
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
        prevNode: function (node, startNode) {
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
        lastNode: function (node) {
            while (node.lastChild) {
                node = node.lastChild;
            }
            return node;
        },
        setTextStyle: function (callback) {
            var textContainer = $("#textContents")[0];
            var selection = getSelection();
            if (selection.rangeCount > 0) {
                var range = selection.getRangeAt(0);
                //テキストノードの事前処理
                if (range.startContainer.nodeType == Node.TEXT_NODE) {
                    //テキストノードをRangeの開始点の位置で2つに分ける
                    range.startContainer.splitText(range.startOffset);
                    //選択範囲の開始点をテキストノードの外側にする
                    range.setStartAfter(range.startContainer);
                }
                //終了点についても同じ処理を行う
                if (range.endContainer.nodeType == Node.TEXT_NODE) {
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
                while (currentNode = nodeFactory.nextTextNode(currentNode, textContainer)) {
                    currentRange.selectNode(currentNode);
                    if (currentRange.compareBoundaryPoints(Range.END_TO_START, range) >= 0) {
                        //現在のノードがRangeより完全に後ろにある場合は終了する
                        break;
                    }
                    if (currentRange.compareBoundaryPoints(Range.START_TO_START, range) >= 0 && currentRange.compareBoundaryPoints(Range.END_TO_END, range) <= 0) {
                        //現在のノードがRangeに完全に含まれる場合、このノードにスタイルを適用
                        (function () {
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
        getStyle: function (node, styleName) {
            var textContainer = $("#textContents");
            while (node && node != textContainer) {
                if (node.style && node.style[styleName]) {
                    return node.style[styleName];
                }
                node = node.parentNode;
            }
            return null;
        },
        surroundWithPTag: function () {
            var textContainer = $("#textContents");
            if (textContainer.firstChild.nodeType == Node.TEXT_NODE) {
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
}());
var styleFactory = (function () {
    return {
        textAlign: function (align) {
            nodeFactory.surroundWithPTag();
            nodeFactory.setLineStyle(function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["text-align"] = align;
                }
            });
        },
        lineHeight: function (height) {
            nodeFactory.setLineStyle(function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["line-height"] = height;
                }
            });
        },
        fontSize: function (em) {
            nodeFactory.setLineStyle(function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["font-size"] = em + "em";
                }
            });
        },
        fontWeight: function () {
            nodeFactory.setTextStyle(function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["font-weight"] = (nodeFactory.getStyle(nodes[0], "font-weight") == "bold") ? "normal" : "bold";
                }
            });
            styleFactory.underlineForce();
        },
        fontColor: function (color) {
            nodeFactory.setTextStyle(function (nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].style["color"] = color;
                }
            });
            styleFactory.underlineForce();
        },
        textDecoration: function () {
            var spans = $("#textContents span");
            var underLineSpans = new Array();
            for (var i = 0; i < spans.length; i++) {
                if (spans[i].textContent != "" && spans[i].style["text-decoration"] == "underline") {
                    underLineSpans.push(spans[i]);
                }
            }
            nodeFactory.setNodeStyle(underLineSpans, function (nodes) {
                if (nodes.length > 0) {
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].style["text-decoration"] = "";
                    }
                } else {
                    nodeFactory.setTextStyle(function (targetNodes) {
                        for (var i = 0; i < targetNodes.length; i++) {
                            targetNodes[i].style["text-decoration"] = "underline";
                        }
                    });
                }
            }, true);
        },
        underlineForce: function () {
            var $spans = $("#textContents").find("span[style*='text-decoration']");
            $spans
                .addClass("text-decoration")
                .css("text-decoration", "")
            for (var i = 0; i < $spans.length; i++) {
                //都度，選択範囲を動的生成する
                var element = $spans[i];
                var rng = document.createRange();
                rng.selectNodeContents(element);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(rng);
                nodeFactory.setNodeStyle($spans[i], function (nodes) {
                    nodeFactory.setTextStyle(function (targetNodes) {
                        for (var i = 0; i < targetNodes.length; i++) {
                            targetNodes[i].style["text-decoration"] = "underline";
                        }
                    });
                }, true);
            }
            $('.text-decoration').each(function () {
                $(this).replaceWith($(this).html());
            })
        }
    };
}());
var imageFactory = (function () {
    var mId = null,
        mIdRect, gazouTargetId, gazouRect, rotateHandleRect;
    var gazouY, gazouX, dy, dx,
        moveY = 0,
        moveX = 0,
        prevY = 0,
        prevX = 0,
        angle = 0,
        rad = 0,
        scaleYV = 1.0,
        scaleXV = 1.0,
        handleRe = 1.0,
        rotateHX = 0,
        rotateHY = 0,
        gazouCX = 0,
        gazouCY = 0,
        baseXV = 0,
        baseYV = 0;
    var imgX, imgY, imgR, imgB, imgDY, imgDX;
    selectedImgId = null,
        dragFlag = false,
        scaleFlag = false,
        rotate = {
            x: 0,
            y: 0,
            flag: false
        }


    return {
        upImg: function () {
            var $image = $('#imageContents');
            var $input;
            //Up用のエレメント作成
            $input = $("<input type='file' accept='image/*' style='display:none;'>");
            $input.on("change", function () {
                imageFactory._gazou_sounyu(this.files[0], '"' + $image.attr('id') + '"')
            });
            //一時的に追加し削除
            $image.append($input);
            $input.trigger('click');
            $image.find("#fileUp").remove();
        },
        _gazou_sounyu: function (imgFile) {
            var reader;
            reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onloadend = function () {
                imageFactory._createImage(reader.result, imgFile.name);
            };
        },
        _createImage: function (src, srcFileName) {
            var $image = $('#imageContents');
            var img = new Image();
            img.src = src;
            img.onload = function () {
                var canvas, context, maxSize, rw, rh, blob, imgFileName, handleBox, gazou, gazouBox, handleBox01, handleBox02, handleBox03;
                canvas = $("<canvas>")[0];
                context = canvas.getContext("2d");
                maxSize = 500;
                rw = img.width;
                rh = img.height;
                if (img.width > img.height) {
                    if (img.width > maxSize) {
                        rw = maxSize;
                        rh = img.height * maxSize / img.width;
                    }
                }
                if (img.width < img.height) {
                    if (img.height > maxSize) {
                        rw = img.width * maxSize / img.height;
                        rh = maxSize;
                    }
                }
                context.clearRect(0, 0, 0, 0);
                canvas.width = rw;
                canvas.height = rh;
                context.drawImage(img, 0, 0, rw, rh);
                //一度sessionStorageへ保存
                imgFileName = commonfn.getNowDate() + srcFileName;
                // adminfn.SS.set(imgFileName, canvas.toDataURL("image/png"));
                $handleBox01 = $("<div>", {
                        id: imgFileName + "handle01",
                    })
                    .css({
                        "position": "absolute",
                        "transformOrigin": "left top",
                        "transform": imageFactory._initImgPosition(),
                        "width": rw + "px"
                    })
                $handleBox02 = $("<div>", {
                        id: imgFileName + "handle02",
                    })
                    .css({
                        "position": "absolute",
                        "transformOrigin": "top left",
                        "transform": "scale(1.0)",
                        "width": "100%",
                        "height": "100%"
                    })
                $handleBox03 = $("<div>", {
                        id: imgFileName + "handle03",
                    })
                    .css({
                        "position": "absolute",
                        "transformOrigin": "center center",
                        "transform": "rotate(0deg)",
                    })
                $gazou = $("<img>", {
                        "id": imgFileName,
                        "class": "ui-widget-content",
                        "name": "gazou",
                        "alt": imgFileName,
                    }).css({
                        "box-sizing": "reset",
                        "cursor": "pointer"
                    })
                    .attr("src", URL.createObjectURL(imageFactory._base64toBlob(canvas.toDataURL("image/png"))))
                    // .css("vertical-align","top")
                $handleBox03.append($gazou);
                $handleBox02.append($handleBox03);
                $handleBox01.append($handleBox02);
                //指定IDへ追加
                // $image.append($handleBox01);
                $image.append($gazou);

            };
        },
        _initImgPosition: function () {
            var x = 0,
                y = 0,
                wrapperRect = $(".boxView")[0].getBoundingClientRect(),
                rect = $("#textContents")[0].getBoundingClientRect();
            if ($("#textContents .verticalWriting").length > 0) {
                x = wrapperRect.left - rect.right;
            } else {
                y = wrapperRect.top - rect.top;
            }
            return "translate(" + x + "px," + y + "px)";
        },
        _base64toBlob: function (base64Data) {
            var bin, buffer, blob, i;
            bin = atob(base64Data.replace(/^.*,/, ""));
            buffer = new Uint8Array(bin.length);
            for (i = 0; i < bin.length; i++) {
                buffer[i] = bin.charCodeAt(i);
            }
            blob = new Blob([buffer.buffer], {
                type: "image/png"
            });
            return blob;
        },
        clickImage: function (e) {
            var selectNewImg = false;
            if (window.location.pathname.split("/").pop() === "education.html") {
                return false;
            }
            if (selectedImgId === null) {
                if (e.target.name === "gazou") {
                    selectNewImg = true;
                }
            } else {
                if (e.target.name === "gazou" && e.target.id !== selectedImgId) {
                    selectNewImg = true;
                }
                imageFactory._delHandle(selectedImgId, e);
                selectedImgId = null;
            }
            if (selectNewImg == true) {
                selectedImgId = e.target.id;
                // handleRe = 1.0 / parseFloat(document.getElementById(selectedImgId + "handle02").style.transform.match(/scale\((.*?)\)/)[1]);
                imageFactory._addHandle(selectedImgId);

                $("#imageContents")[0].width =
                    Math.max(
                        $("#textContents")[0].offsetWidth,
                        $(".boxView")[0].offsetWidth);
                $("#imageContents")[0].height =
                    Math.max(
                        $("#textContents")[0].offsetHeight,
                        $(".boxView")[0].offsetHeight);
            }
        },
        _addHandle: function (handleTargetId) {
            $imgHandleTarget = $(document.getElementById(handleTargetId));
            $imgHandleTarget.css("opacity", "0.2");
            $imgHandleTarget.resizable({
                aspectRatio: true
            });
            $(".ui-wrapper").draggable();

            //現在のimageの角度を取得


            $imgHandleTarget.parent()
                .prepend(
                    $("<span>", {
                        "class": "rotate_handle",
                        "text": "●"
                    }).css({
                        "position": "absolute",
                        "cursor": "crosshair",
                        "z-index": "4",


                    }).click(function (e) {
                        rotate.flag = (rotate.flag == true) ? false : true;

                        var degree = imageFactory._getDegree(e);
                        $('.ui-wrapper').transition({
                            opacity: 1,
                            scale: 1
                        }, 0);
                        $('.ui-wrapper').css({
                            rotate: degree + 'deg'
                        });
                        e.stopPropagation();
                    })
                );
            $('.ui-wrapper').css("rotate", $imgHandleTarget.css("rotate"))
            $imgHandleTarget.css({
                "rotate": "0deg"
            })

            $("#imageContents .ui-wrapper").mousemove(function (e) {
                if (rotate.flag) {
                    var degree = imageFactory._getDegree(e);
                    // console.log(e);
                    $('.ui-wrapper').transition({
                        opacity: 1,
                        scale: 1
                    }, 0);
                    $('.ui-wrapper').css({
                        rotate: degree + 'deg'
                    });

                }
            })

        },
        _delHandle: function (handleTargetId, e) {
            var handles, i;
            $imgHandleTarget = $(document.getElementById(handleTargetId));

            //回転フラグストップ
            //現在の角度を画像に反映
            if (rotate.flag) {
                rotate.flag = false;

            }
            var degree = imageFactory._getDegree();
            $imgHandleTarget.css("transform", "scale(1, 1) rotate(" + degree + "deg)");
            $imgHandleTarget.css("opacity", "1");
            $imgHandleTarget.resizable("destroy")
            $(".ui-wrapper").draggable("destroy")



        },

        _getDegree: function (e) {




            e = e || null;

            gazouRect = $imgHandleTarget[0].getBoundingClientRect();

            if (e) {
                rotate.x = e.clientX;
                rotate.y = e.clientY;
                console.log("rotate.x" + rotate.x)
                console.log("rotate.y" + rotate.y)
            }

            if (rotate.x == 0 && rotate.y == 0) {
                return 0;
            }

            　
            var imgPos = {
                "x": gazouRect.left + (gazouRect.width / 2),
                "y": gazouRect.top + (gazouRect.height / 2)
            };
            var mousePos = {
                "x": rotate.x,
                "y": rotate.y
            }
            var radian = Math.atan2((imgPos.y - mousePos.y), (imgPos.x - mousePos.x));

            console.log((radian * 180 / Math.PI) - 90);
            return (radian * 180 / Math.PI) - 90;




        },




        _addRotateHandle: function ($target) {
            var handlePx, $imgHandle;
            $imgHandle = $("<img>", {
                "id": $target.attr("id") + "rotateHandle",
                "class": "rotateHandle"
            }).attr({
                "src": "../images/kaiten.png"
            }).css({

                "height": "30px",
                "margin": "auto",
                "transformOrigin": "center top",
                "transform": "scale(" + handleRe + ")" + " translate(0px,-26px)",
                "right": "0px",
                "left": "0px",
                "position": "absolute",
                "margin": "0 auto",
            })
            $target.parent().append($imgHandle);
        },
        _addScaleHandle: function ($target, scaleId) {
            var imgHandle, handlePx;



            $imgHandle = $("<div>", {
                "id": $target.attr("id") + scaleId,
                "class": "scaleHandle"
            }).css({
                "width": "10px",
                "height": "10px",
                "transform": "scale(1.0, 1.0)",
                "border": "1px solid gray",
                "backgroundColor": "white",
                "position": "absolute",
                "margin": "auto",
                "top": "0",
                "right": "",
                "bottom": "",
                "left": "",
                "transformOrigin": "left top",
                "transform": " scale(" + handleRe + ")" +
                    " translate(" + (($target[0].width + 1.5) / handleRe - 6) + "px, " +
                    (($target[0].height + 1.5) / handleRe - 6) + "px)"
            })


            $target.parent().append($imgHandle);

        },
    }
})();
$(function () {
    'use strict';
    //events
    $(document)
        .on('change', '#category', function () {
            //学校種別切り替え時イベント
            var array, category = $(this).val();
            adminfn.categorySelecter($('#school'), category, 'school');
            adminfn.categorySelecter($('#grade'), category, 'grade');
            adminfn.categorySelecter($('#curriculum'), category, 'curriculum');
        }).on('change', '#category, #grade, #curriculum', function () {
            adminfn.unitSelecter($('#unit'), $('#grade').val(), $('#curriculum').val(), null);
        })
        //dirextion control
    $(document)
        .on('mousedown', '#textyoko', function () {
            fn.directionManage('horizon');
        }).on('mousedown', '#texttate', function () {
            fn.directionManage('vertical');
        })
        //text-align
    $(document)
        .on('mousedown', '#alignleft', function () {
            styleFactory.textAlign('left');
        }).on('mousedown', '#aligncenter', function () {
            styleFactory.textAlign('center');
        }).on('mousedown', '#alignright', function () {
            styleFactory.textAlign('right');
        });
    //line-height
    $(document)
        .on('mousedown', '#lineHeight_normal', function () {
            styleFactory.lineHeight('normal');
        }).on('mousedown', '#lineHeight_2', function () {
            styleFactory.lineHeight(2);
        }).on('mousedown', '#lineHeight_3', function () {
            styleFactory.lineHeight(3);
        }).on('mousedown', '#lineHeight_4', function () {
            styleFactory.lineHeight(4);
        });
    //font-size
    $(document)
        .on('mousedown', '#size_1', function () {
            styleFactory.fontSize('1');
        }).on('mousedown', '#size_2', function () {
            styleFactory.fontSize('2');
        }).on('mousedown', '#size_4', function () {
            styleFactory.fontSize('4');
        }).on('mousedown', '#size_6', function () {
            styleFactory.fontSize('6');
        }).on('mousedown', '#size_8', function () {
            styleFactory.fontSize('8');
        });
    //font-weight,text-decoration,font-color
    $(document)
        .on('click', "#fontWeight", function () {
            styleFactory.fontWeight();
        }).on('click', "#underLine", function () {
            styleFactory.textDecoration();
        }).on('click', "#fontRed", function () {
            styleFactory.fontColor('red')
        }).on('click', "#fontBlue", function () {
            styleFactory.fontColor('blue')
        }).on('click', "#fontBlack", function () {
            styleFactory.fontColor('black')
        })
        //initial
    $(document)
        .on('click', "#insertImage", function () {
            imageFactory.upImg();
        })
    $(document)
        .on('click', "#imageContents", function (e) {
            imageFactory.clickImage(e);
        });

    $(document).on('click', '#button_edit', function () {
        //保存（作成画面ボタン）
        var obj = fn.paramCheck();
        if (obj.flag) {
            fn.questionExist(obj.param, fn.questionSave);
        } else {
            adminfn.alertDialog('未入力項目', obj.message, null);
        }
        //
        //        $('#saveModal').dialog({
        //            modal: true,
        //            draggable: false,
        //            resizable: false,
        //            width: 'auto',
        //            height: 'auto',
        //            title: '保存情報',
        //            dialogClass: 'infoModal',
        //            buttons: [
        //                {
        //                    text: 'O　K',
        //                    title: 'OK',
        //                    click: callback
        //                },
        //                {
        //                    text: 'キャンセル',
        //                    title: 'キャンセル',
        //                    click: function () {
        //                        $(this).dialog('close');
        //                    }
        //                }
        //            ]
        //        });
    })
    fn.init();
});