$(function () {
    var adaptive = function () {
        var winHeight = $(window).height();
        var headerHeight = $('.find-header').outerHeight();
        var footerHeight = $('.find-footer').outerHeight() + $('.footer').outerHeight();
        $('.press,.sidebar').height(winHeight);
        $('.find-content').css('max-height', (winHeight - headerHeight - footerHeight) + 'px');
        $('.sidebar-content').css('max-height', (winHeight - headerHeight) + 'px');

        $('.pannel-item').on('tap', function (e) {
            $('.press').addClass('active').one('tap', function () {
                $('.press').removeClass('active');
                $('.sidebar').removeClass('active');
            });
            $('.sidebar').addClass('active');
        });
    };
    window.find_adaptive = adaptive;
    adaptive();
    $(window).on('resize', function () {
        adaptive();
    });

});