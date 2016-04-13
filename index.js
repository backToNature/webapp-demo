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
        $(this).one('touchend.highLight', function (e) {
            $(this).removeClass('touchHighLight');
            $(this).off('touchmove.highLight');
            console.log(e);
        });
    });
    $(document).on('MSGestureEnd', function (e) {
        console.log(e);
    });

    $('.header-tabs-ul li').on('touchend', function () {
        var $this = $(this);
        var $bottom_select = $('.bottom-select');
        $bottom_select.show();
        var diff = $this.offset().left;
        if (diff + $this.outerWidth() > $(window).width()) {
            var xx = $(window).width() - (diff + $this.outerWidth() - $('.header-tabs-ul li').eq(0).offset().left);
            $('.header-tabs-ul').css('transition-duration', '0.3s')
            .css('transform', 'translate3d('+ xx +'px,0px,0px)');
        }
        if (diff < 0) {
            var firstLeft = $('.header-tabs-ul li').eq(0).offset().left;
            var yy = (parseInt(firstLeft / $this.outerWidth()) * $this.outerWidth());
            // var xx = $(window).width() - (diff + $this.outerWidth());
            $('.header-tabs-ul').css('transition-duration', '0.3s')
            .css('transform', 'translate3d('+ yy +'px,0px,0px)');
        }
        $('.header-tabs-ul li').removeClass('active');
        $this.addClass('noborder').addClass('active');
        $bottom_select.one('webkitTransitionEnd transitionend', function (e) {
            $this.removeClass('noborder');
            $bottom_select.hide();
            console.log(1234);
        });
        $bottom_select.css('transform', 'translate3d('+diff+'px,0px,0px)');
    });

});