function modalResize(a) {
    "use strict";
    var w, h, x, y;
    w = $(window).width();
    h = $(window).height();
    x = (w - $(a).outerWidth(true)) / 2;
    y = (h - $(a).outerHeight(true)) / 2;
    $(a).css({
        'left': x + 'px',
        'top': y + 'px'
    })
}

function modalView(a) {
    "use strict";
    $('.modal-content').fadeOut('slow');
    modalResize('#' + a);
    $('#' + a).fadeIn('slow');
    $(window).on('resize', function() {
        modalResize('#' + a)
    });
    $('.modal-overlay, .modal-close').off().click(function() {
        $('#' + a).fadeOut('slow');
        $('.modal-overlay').fadeOut('slow', function() {
            $('.modal-overlay').remove()
        })
    })
}

function modalClose() {
    "use strict";
    $('.modal-content').fadeOut('slow');
    $('.modal-overlay').fadeOut('slow', function() {
        $('.modal-overlay').remove()
    })
}

function modalOpen(a) {
    "use strict";
    $('body').append('<div class="modal-overlay"></div>');
    $('.modal-overlay').fadeIn('slow');
    modalView(a)
}
$(function() {
    "use strict";
    $('.modal-open').click(function() {
        var a = $(this).attr('data-target');
        modalOpen(a)
    })
});