$(function () {
    var adaptive = function () {
        $('.panel').css('max-height', ($(window).height() - $('.header').height() + $('.content-loading').height()) + 'px');
    };
    adaptive();
    window.index_adaptive = adaptive;
    $(window).on('resize', function () {
        adaptive();
    });

    $('.list-item').on('tap', function (e) {
        
    });
    var contentOffset = $('.panel-index-list').eq(0).offset().top;
    var pages = new Swiper('.swiper-container', {
        onTouchStart: function (data) {
            console.log(124);
        },
        onTouchMove: function (e) {
            if ($('.panel-index-list').eq(0).offset().top > contentOffset) {
                console.log(e);
            } 
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
            pages.slideTo($this.index());
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