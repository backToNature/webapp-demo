$(function () {
    var adaptive = function () {
        var winHeight = $(window).height();
        var headerHeight = $('.find-header').outerHeight();
        var footerHeight = $('.find-footer').outerHeight() + $('.footer').outerHeight();
        $('.press,.sidebar').height(winHeight);
        $('.find-content').css('max-height', (winHeight - headerHeight - footerHeight) + 'px');
        $('.sidebar-content').css('max-height', (winHeight - headerHeight) + 'px');


        $('.pannel-item').on('tap', function (e) {
            var event, startEvent, startPageX, startPageY;
            $('.press').addClass('active').one('tap', function () {
                $('.press').removeClass('active');
                $('.sidebar').removeClass('active');
            })
            .on('touchstart', function (e) {
                startEvent = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                startPageX = startEvent.pageX;startPageY = startEvent.pageY;
            })
            .on('touchmove', function (e) {
                event = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                var diff = event.pageX - startPageX;
                $('.sidebar').removeClass('ease-in-out');
                if (startPageX < event.pageX) {
                    $('.sidebar').css('transform', 'translate3d('+(diff - 228)+'px,0,0)');
                }
            })
            .on('touchend', function (e) {
                var endEvent = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
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