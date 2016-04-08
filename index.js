$(function () {
    $('.header-tabs').each(function(){
        $(this).swiper({
            slidesPerView:'auto',
            calculateHeight: true
        })
    });
    $(window).on('resize', function () {
        $('.content').css('height', $(window).height() - 88);
    });
    $('.content').css('height', $(window).height() - 88);

    $('body').on('touchmove', function(e) { 
        e.preventDefault(); 
    });
    $('.scroll').on('touchmove', function (e) {
        e.stopPropagation();
    });

    $('.list-item').on('touchstart', function () {
        $(this).addClass('touchHighLight');
        $(this).prev().css('border-color', '#f7f7f7');
        $(this).one('touchmove.highLight', function () {
            $(this).removeClass('touchHighLight');
            $(this).off('touchend.highLight');
        });
        $(this).one('touchend.highLight', function () {
            $(this).removeClass('touchHighLight');
            $(this).off('touchmove.highLight');
        });
    });

});