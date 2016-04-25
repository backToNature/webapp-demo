$(function () {
    $('body').on('touchmove', function(e) { 
        e.preventDefault(); 
    });
    $('.scroll').on('touchmove', function (e) {
        e.stopPropagation();
    });

    (function () {
        $('.footer-tabs').delegate('li', 'tap', function (e) {
            var $this = $(this), page = $this.data('page');
            if ($this.hasClass('active')) {
                return;
            }
            if (page) {
                $('.page').hide();
                $('#page-' + page).show();
                if (window[page + '_adaptive']) {
                    window[page + '_adaptive']();
                }
            }
            $('.footer-tabs li').removeClass('active');
            $this.addClass('active');
        });
    }());
});