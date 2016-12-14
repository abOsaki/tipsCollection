/*global $, console, alert, adminfn, commonfn, URL*/
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
    return {
        init: function () {
            var callback = function () {
                adminfn.displayUserInfo();
                adminfn.getTable('anaume', fn.educationOpen);
            };
            adminfn.loginInfo(callback);
            //教材格納一時場所を設定
            adminfn.param.info = {};
            adminfn.param.pages = {};
            fn.changeResolution();
            fn.directionManage('horizon');
        },
        //教材読み込み
        educationOpen: function () {
            var param = adminfn.takeGET(),
                sendData = {
                    command: 'educationOpen',
                    param: param
                };

            $.ajax({
                url: './ajax.php',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(sendData)
            }).done(function (data) {
                var i, ic, array, obj, page,
                    pages;

                adminfn.param.info = data.info;
                array = data.pages;
                for (i = 0, ic = array.length; i < ic; i += 1) {
                    obj = array[i];
                    adminfn.param.pages[obj.id] = {
                        text: obj.textContents,
                        style: obj.textStyle,
                        image: $('<div/>'),
                        fusen: $('<div/>')
                    };
                    fn.laodImage(obj.id, JSON.parse(obj.imageContents));
                    fn.loadFusen(obj.id, JSON.parse(obj.fusen));
                }

                pages = adminfn.param.info.contents.split(',');
                fn.educationView(pages);
                $('#pagesText').html('／' + pages.length);
            });
        },
        educationView: function (pages) {
            var i, ic,
                option = "";
            for (i = 0, ic = pages.length; i < ic; i += 1) {
                option += "<option value=" + pages[i] + ">" + (i + 1) + "</option>";
            }
            $("#pages").empty().append(option);
            fn.jumpPage(pages[0]);
        },
        laodImage: function (page, imageContents) {
            var i, ic, array, obj, callback;
            //画像
            callback = function (data, fileName) {
                var $dom = adminfn.param.pages[page].image,
                    $target = $dom.children('#' + fileName);

                if ($target.attr('data')) {
                    $target.addClass('hyperLinkArea blueLine');
                }

                $target.attr('src', URL.createObjectURL(data)).html();
            };

            array = imageContents;
            for (i = 0, ic = array.length; i < ic; i += 1) {
                obj = array[i];
                adminfn.param.pages[page].image.append(
                    $('<img/>', {
                        id: obj.fileName,
                        name: 'gazou',
                        alt: obj.fileName,
                        style: obj.style,
                        degree: obj.degree
                    }).attr('data', obj.data)
                );
                commonfn.loadImage(obj.fileName, callback);
            }
        },
        loadFusen: function (page, fusen) {
            var i, ic, array, obj;
            //ふせん
            array = fusen;
            for (i = 0, ic = array.length; i < ic; i += 1) {
                obj = array[i];

                adminfn.param.pages[page].fusen.append(
                    $('<img/>', {
                        id: obj.fileName,
                        "class": "fusen_on",
                        name: 'fusen',
                        style: obj.style,
                        src: "./../common/images/fusen_on.png"
                    })
                );
            }
        },
        jumpPage: function (num) {
            //numのページを反映
            $("#textContents").html(adminfn.param.pages[num].text);
            $("#imageContents").html(adminfn.param.pages[num].image);
            $("#imageContents").append(adminfn.param.pages[num].fusen);

            if (adminfn.param.pages[num].style) {
                fn.directionManage('vertical');
                //                $("#textContents").addClass("verticalWriting");
                //                $(".boxView").addClass("verticalWriting");
                //                $("#imageContents").addClass("verticalWriting");
            } else {
                fn.directionManage('horizon');
            }

            fn.fusenSwitch($('#imageContents img[name=fusen]').removeClass('fusen_on'));
        },
        shuffleList: function (arr) {
            // 引数の配列をシャッフル
            //Fisher-Yates
            var i, j, tmp,
                length = arr.length;
            for (i = length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1));
                tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            return arr;
        },
        fusenSwitch: function ($target) {
            if ($target.hasClass('fusen_on')) {
                $target.removeClass('fusen_on').addClass('fusen_off').attr('src', './../common/images/fusen_off.png');
            } else {
                $target.removeClass('fusen_off').addClass('fusen_on').attr('src', './../common/images/fusen_on.png');
            }
        },
        changeResolution: function () {
            //ディスプレイ解像度
            var displayWidth = window.screen.width;
            //描画領域の幅
            var boxViewWidth = $("#viewArea").width();
            var boxViewHeight = $("#viewArea").height();
            //フルHDをベースとして，解像度に合わせ画面内に収まるように
            rate = (boxViewWidth) / 1920;
            $("textContents_wrapper").css("height", boxViewHeight * 0.9);
            $("textContents_wrapper").css("width", boxViewWidth);
            $("imageContents_wrapper").css("height", boxViewHeight * 0.9);
            $("imageContents_wrapper").css("width", boxViewWidth);
            $(".boxView").css({
                transform: 'scale(' + rate + ')'
            });
        },
        syncSize: function ($this) {
            $("#imageContents").css('height', $this[0].scrollHeight);
            $("#imageContents").css('width', $this[0].scrollWidth)
        },
        directionManage: function (rotate) {
            $("#textContents").css({
                'left': "0",
                'right': "0",
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
                if (userAgent.indexOf('chrome') != -1) {
                    $("#textContents").css({
                        'left': '-80px',
                        'right': '80px',
                    })
                }
            } else {
                $("#textContents_wrapper").addClass('textContents_wrapper_horizon').removeClass('textContents_wrapper_vertical');
                $("#textContents").removeClass('textContents_vertical').addClass('textContents_horizon');
                $(".boxView").removeClass('boxView_vertical').addClass('boxView_horizon');
                $("#imageContents_wrapper").addClass('imageContents_wrapper_horizon').removeClass('imageContents_wrapper_vertical');
                $("#imageContents").removeClass('imageContents_vertical').addClass('imageContents_horizon');
            }
            $("#viewArea").height();
            $("#textContents_wrapper").css('height', $("#viewArea").height() * 1 / rate);
            $("#imageContents_wrapper").css('height', $("#viewArea").height() * 1 / rate);
            $(".boxView").css('height', $("#viewArea").height() * 1 / rate);
            fn.syncSize($('#textContents'))
        },
    };
}());


$(function () {
    'use strict';
    //events
    $(document).on('click', '#textContents', function () {
        var selection;
        if (window.getSelection) {
            selection = window.getSelection();
            selection.collapse(document.body, 0);
        } else {
            selection = document.selection.createRange();
            selection.setEndPoint("EndToStart", selection);
            selection.select();
        }
    }).on('change', '#pages', function () {
        //ページ（select要素）変更時イベント
        fn.jumpPage($("#pages").val());
    }).on('click', '#button_shuffle', function () {
        var $target = $(this);
        //シャッフル実行
        if ($target.hasClass('shiffleOff')) {
            $target.removeClass('shiffleOff').addClass('shiffleOn');
            //fn.pageShuffle();
        } else {
            if ($target.hasClass('shiffleOn')) {
                $target.removeClass('shiffleOn');
            }
            $target.addClass('shiffleOff');
            //fn.pageSet(adminfn.param.info.contents);
        }
    }).on('click', '#nextPage', function () {
        var $pages = $('#pages'),
            num = $pages.prop('selectedIndex');
        if (num === $pages.children().length - 1) {
            return false;
        }
        $pages.prop('selectedIndex', num + 1);
        fn.jumpPage($pages.val());
    }).on('click', '#prevPage', function () {
        var $pages = $('#pages'),
            num = $pages.prop('selectedIndex');
        if (num === 0) {
            return false;
        }
        $pages.prop('selectedIndex', num - 1);
        fn.jumpPage($pages.val());
    }).on('click', '#shuffleOn', function () {
        fn.educationView(fn.shuffleList(adminfn.param.info.contents.split(',')));
    }).on('click', '#shuffleOff', function () {
        fn.educationView(adminfn.param.info.contents.split(','));
    }).on('dblclick', '.fusen_on, .fusen_off', function () {
        fn.fusenSwitch($(this));
    });


    $(window).on('resize', function () {
        fn.changeResolution();
    });
    $('#textContents').on('DOMSubtreeModified propertychange', function () {
        fn.syncSize($(this));
    });
    // 画像へのスクロールイベント禁止
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $("#imageContents_wrapper").on(scroll_event, function (e) {
        e.preventDefault();
    });
    //横書き用スクロール同期
    $('#textContents_wrapper').scroll(function () {
        $("#imageContents_wrapper").scrollLeft($('#textContents_wrapper').scrollLeft());
        $("#imageContents_wrapper").scrollTop($('#textContents_wrapper').scrollTop());
    });
    //縦書き用スクロール同期
    $('#textContents').scroll(function () {
        $("#imageContents_wrapper").scrollLeft($('#textContents').scrollLeft());
        $("#imageContents_wrapper").scrollTop($('#textContents').scrollTop());
    });

    //読み込み時処理実行
    fn.init();
});