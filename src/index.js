$(function () {
    var adaptive = function () {
        $('.content').css('max-height', ($(window).height() - $('.header').height()) + 'px');
    };
    adaptive();
    window.index_adaptive = adaptive;
    $(window).on('resize', function () {
        adaptive();
    });

    $('.list-item').on('tap', function (e) {
        
    });

    (function () {
        $('.header-tabs-ul').delegate('li', 'tap', function (e) {
            var $this = $(this);
            $('.header-tabs-ul li').removeClass('active');
            $this.addClass('active');
        });
    }());
});