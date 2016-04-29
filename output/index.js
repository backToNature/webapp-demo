$(function () {
    var adaptive = function () {
        $('.content').css('max-height', ($(window).height() - $('.header').height() + $('.content-loading').height()) + 'px');
    };
    adaptive();
    window.index_adaptive = adaptive;
    $(window).on('resize', function () {
        adaptive();
    });

    $('.list-item').on('tap', function (e) {
        
    });
    var contentOffset = $('.content').offset().top;
    var pages = new Swiper('.swiper-container', {
        onTouchStart: function (data) {
            // pages.removeSlide(); 
            // if ($('.content').offset().top !== contentOffset) {
            //     pages.lockSwipes();
            // } else {
            //     pages.unlockSwipes();
            // }
        },
        onSlideChangeEnd: function (data) {
            $('.header-tabs-ul li').eq(data.activeIndex).trigger('tap');
        }
    });
    (function () {
        var isMoving = false;
        $('.header-tabs-ul').delegate('li', 'tap', function (e) {
            var $this = $(this),$bottom_select = $('.bottom-select');
            if (isMoving || $this.hasClass('active')) {
                return;
            }
            pages.swipeTo($this.index());
            isMoving = true;
            $('.header-tabs-ul li').removeClass('active theme-blue');
            $bottom_select.css('opacity', 1);
            $this.addClass('theme-blue');
            $bottom_select.css('-webkit-transform', 'translate3d('+$this.offset().left+'px,0,0)');
            $bottom_select.one('webkitTransitionEnd', function (e) {
                $bottom_select.css('opacity', 0);
                $this.addClass('active');
                isMoving = false;
            });
            
        });
    }());
    $('.content').on('scroll', function () {
        $('.content-loading').show();
    });
});