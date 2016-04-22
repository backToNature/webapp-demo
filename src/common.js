$(function () {
        $('body').on('touchmove', function(e) { 
        e.preventDefault(); 
    });
    $('.scroll').on('touchmove', function (e) {
        e.stopPropagation();
    });

    $('.list-item').on('tap', function (e) {
        console.log(223545);
    });

    (function () {
        $('.header-tabs-ul').delegate('li', 'tap', function (e) {
            var $this = $(this);
            $('.header-tabs-ul li').removeClass('active');
            $this.addClass('active');
        });
    }());

    (function () {
        $('.footer-tabs').delegate('li', 'tap', function (e) {
            var $this = $(this);
            $('.footer-tabs li').removeClass('active');
            $this.addClass('active');
        });
    }());
});