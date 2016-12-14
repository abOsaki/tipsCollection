/*global $ */
function modalFun(thisEvent) {
    'use strict';
    var modal, x, y, w, h;

    // モーダルコンテンツの表示位置を設定する関数
    function modalResize() {
        // ウィンドウの横幅、高さを取得
        w = $(window).width();
        h = $(window).height();
        // モーダルコンテンツの表示位置を取得
        x = (w - $(modal).outerWidth(true)) / 2;
        y = (h - $(modal).outerHeight(true)) / 2;

        // モーダルコンテンツの表示位置を設定
        $(modal).css({
            'left': x + 'px',
            'top': y + 'px'
        });
    }
    //モーダルコンテンツをフェードインする関数
    function modalFadeIn(mFI) {
        // モーダルコンテンツのIDを取得
        modal = '#' + mFI;
        // モーダルコンテンツの表示位置を設定
        modalResize();
        // モーダルコンテンツフェードイン
        $(modal).fadeIn('slow');
    }

    // オーバーレイ用の要素を追加
    $('body').append('<div class="modal-overlay"></div>');
    // オーバーレイをフェードイン
    $('.modal-overlay').fadeIn('slow');
    modalFadeIn($(thisEvent).attr('data-target'));

    // 「.modal-overlay」あるいは「.modal-close」をクリック
    $('.modal-overlay, .modal-close').off().click(function () {
        // モーダルコンテンツとオーバーレイをフェードアウト
        $(modal).fadeOut('slow');
        $('.modal-overlay').fadeOut('slow', function () {
            // オーバーレイを削除
            $('.modal-overlay').remove();
        });
    });

    // 「.modal-move」をクリック
    $('.modal-move').off().click(function () {
        // モーダルコンテンツをフェードアウト
        $(modal).fadeOut('slow');
        // モーダルコンテンツをフェードイン
        modalFadeIn($(this).attr('data-target'));
    });

    // リサイズしたら表示位置を再取得
    $(window).on('resize', function () {
        modalResize();
    });
}