function previewQuestions() {
    $('#previewImage').removeAttr('style');
    var d, quesAreaEle, styleTop;
    d = document.getElementById("questionBox");
    quesAreaEle = document.getElementById("questionArea");
    quesAreaEle.style.top = '0px';
    quesAreaEle.style.left = '0px';
    $('#printImg').removeAttr('style');
    $.when((function() {
        $('#print_guideline').hide();
        $('#questionArea').css('overflow', 'visible');
        if ($('#textContents').innerHeight() > $('#textContents').innerWidth()) {
            $('#questionBox').css('height', 'auto');
            $('#questionBox').css('width', 'auto');
            $('#printImg').css('height', $(window).innerHeight() * 0.85)
        } else {
            $('#questionBox').css('height', 'auto');
            $('#questionBox').css('width', $('#textContents').innerWidth());
            $('#printImg').css('max-width', $(window).innerWidth() * 0.65);
            var a = 10;
            var b = $('#textContents').innerHeight() / $('#textContents').innerWidth();
            while ((parseInt($('#printImg').css('width')) * b) > ($(window).innerHeight() - 300)) {
                $('#printImg').css('width', ($(window).innerWidth() - 300) * 0.85 - a);
                a += 10
            }
        }
    })()).done(function() {
        $.when(html2canvas(quesAreaEle, {
            onrendered: function(b) {
                var c, imgEle;
                c = b.toDataURL("image/png");
                $('#printImg').attr('src', "").attr('src', c);
                $.when().done(function() {
                    modalOpen("previewModal");
                    $(window).off('resize').on('resize', function() {
                        var w, h, x, y;
                        w = $(window).width();
                        x = (w - $("#previewModal").outerWidth(true)) / 2;
                        $("#previewModal").css({
                            'left': x + 'px',
                        })
                    })
                }).done(function() {
                    if ($('#print_guideline').attr('data') !== '') {
                        var a = $('#print_guideline').attr('data');
                        $(".setPrintline[data='" + a + "']").trigger('click')
                    } else {
                        $('#printLine').css('opacity', 0)
                    }
                }).done(function() {
                    $('#previewImage').css('width', $("#printImg")[0].clientWidth)
                })
            },
            allowTaint: true,
            background: "#fff"
        })).done(function() {
            $('#questionArea').removeAttr('style');
            $('#questionBox').removeAttr('style');
            $('#print_guideline').show()
        })
    })
}

function printQuestions() {
    if ($('#printLine').css('opacity') == 0) {
        alert('印刷範囲を指定して下さい。');
        return false
    }
    var j = 1;
    $('.modal-content').animate({
        opacity: 0.01,
    }, 1).promise().done(function() {
        if ($('#questionArea').hasClass('verticalWriting')) {
            var a = $('#printImg').width() * j;
            var b = $('#printLine').height * j;
            var c = $("#printImg").width() * j;
            var d = $("#printImg").width() * j - $('#printLine').width() * j;
            $("#printImg").css({
                'position': 'absolute',
                'clip': 'rect(0px ' + a + 'px ' + b + 'px ' + d + 'px)',
                'left': '-' + (parseInt($('#printLine').css('left')) - 20 + 'px')
            })
        } else {
            $("#printImg").height($("#printImg").height() * j);
            $("#printLine").height($("#printLine").height() * j).width($("#printLine").width() * j).css('top', '-' + parseInt($("#printImg").height()) + 'px');
            var a = $('#printLine').width();
            var b = $('#printLine').height();
            $("#printImg").css({
                'position': 'absolute',
                'clip': 'rect(0px ' + a + 'px ' + b + 'px 0px)'
            });
            $('#printLine').css('top', '0')
        }
        var e = (function() {
            if ($('#questionArea').hasClass('verticalWriting')) {
                return $('#printImg').width() - $('#printLine').width()
            } else {
                return 0
            }
        })();
        var f = {
            'size': $('#printLine').attr('size'),
            'rotate': $('#printLine').attr('rotate'),
            'top': 0,
            'left': parseInt($('#printLine').css('left')),
            'w': $('#printImg').width(),
            'h': $('#printImg').height(),
            'printline_w': $('#printLine').width() + 10,
            'printline_h': $('#printLine').height() + 10,
        };
        var g = $('<form id="printform" />').attr('action', "./../pdfconv.php").attr('method', 'post');
        var h = $('<input type="text" name="image" value="' + $("#printImg").attr("src") + '"/>');
        var i = $('<input type="text" name="param" value="' + encodeURIComponent(JSON.stringify(f)) + '"/>');
        g.append(h).append(i);
        $('body').append(g);
        g.submit();
        g.remove();
        $('.modal-content').css('opacity', '1');
        ext_modalClose()
    })
}

function ext_modalClose() {
    $('#printLine').css({
        'width': 0,
        'height': 0
    });
    $("#previewModal").css({
        'left': 0,
        'top': 0
    });
    $("#previewModal").removeAttr('style');
    modalClose("previewModal")
}
$(document).on('click', '.setPrintline', function() {
    var a, height, top, g, zoom;
    if ($('#textContents').innerHeight() > $('#textContents').innerWidth()) {
        zoom = $('#printImg').innerHeight() / $('#textContents').innerHeight()
    } else {
        zoom = $('#printImg').innerWidth() / $('#textContents').innerWidth()
    }
    var b = 0.5;
    var c = 0.646;
    var d = $(this).attr('data');
    if (d == 'a4_portrait') {
        a = (2100 * zoom * c > $('#printImg').outerWidth()) ? $('#printImg').outerWidth() : 2100 * zoom * c;
        height = (2970 * zoom * c > $('#printImg').outerHeight()) ? $('#printImg').outerHeight() : 2970 * zoom * c
    } else if (d == 'b5_portrait') {
        a = (1820 * zoom * c > $('#printImg').outerWidth()) ? $('#printImg').outerWidth() : 1820 * zoom * c;
        height = (2570 * zoom * c > $('#printImg').outerHeight()) ? $('#printImg').outerHeight() : 2570 * zoom * c
    } else if (d == 'a4_landscape') {
        height = (2100 * zoom * c > $('#printImg').outerHeight()) ? $('#printImg').outerHeight() : 2100 * zoom * c;
        a = (2970 * zoom * c > $('#printImg').outerWidth()) ? $('#printImg').outerWidth() : 2970 * zoom * c
    } else if (d == 'b5_landscape') {
        height = (1820 * zoom * c > $('#printImg').outerHeight()) ? $('#printImg').outerHeight() : 1820 * zoom * c;
        a = (2570 * zoom * c > $('#printImg').outerWidth()) ? $('#printImg').outerWidth() : 2570 * zoom * c
    } else {
        b = 0
    }
    var e = d.split('_');
    var f = $('#printLine');
    f.attr('size', e[0]).attr('rotate', e[1]);
    var g;
    if ($('#questionArea').hasClass('verticalWriting')) {
        g = $('#printImg').outerWidth() - a
    } else {
        g = 0
    }
    f.animate({
        'width': a,
        'height': height,
        'opacity': b,
        'left': g
    }, 200, 'swing')
});
$(document).on('click', '.modal-overlay', function() {
    ext_modalClose()
});