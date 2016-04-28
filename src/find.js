$(function () {

    var div = document.createElement('div');
    function getVendorPropertyName(prop) {
        // Handle unprefixed versions (FF16+, for example)
        if (prop in div.style) return prop;

        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        for (var i=0; i<prefixes.length; ++i) {
          var vendorProp = prefixes[i] + prop_;
          if (vendorProp in div.style) { return vendorProp; }
        }
    }
    var support = {};
    support.transition = getVendorPropertyName('transition');
    var eventNames = {
        'transition':       'transitionend',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition':     'MSTransitionEnd'
    };
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;
    var eventBind = false;
    var adaptive = function () {
        var winHeight = $(window).height();
        var headerHeight = $('.find-header').outerHeight();
        var footerHeight = $('.find-footer').outerHeight() + $('.footer').outerHeight();
        $('.press,.sidebar').height(winHeight);
        $('.find-content').css('max-height', (winHeight - headerHeight - footerHeight) + 'px');
        $('.sidebar-content').css('max-height', (winHeight - headerHeight) + 'px');

        $('.pannel-item').on('tap', function (e) {
            var event, startEvent, startPageX, startPageY, diff;
            var $sidebar = $('.sidebar'), $press = $('.press');
            $sidebar.addClass('active');
            $press.addClass('active show');
            $press.addClass('active').one('tap', function () {
                $press.off('touchmove.drag touchstart.drag touchend.drag');
                if ($press.css('opacity') > 0) {
                    $press.one(transitionEnd, function () {
                        $press.removeClass('active');
                    });
                } else {
                    $press.removeClass('active');
                }
                $press.removeClass('show');
                $sidebar.removeClass('active');
            })
            .on('touchstart.drag', function (e) {
                startEvent = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                startPageX = startEvent.pageX;startPageY = startEvent.pageY;
            })
            .on('touchmove.drag', function (e) {
                event = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                diff = event.pageX - startPageX;
                $sidebar.removeClass('ease-in-out');
                $press.removeClass('ease-in-out-opacity');
                if (startPageX < event.pageX) {
                    $sidebar.css({transform: 'translate3d('+(diff - 228)+'px,0,0)'});
                    $press.css('opacity', 0.2 - (0.2 * diff / 228));
                }
            })
            .on('touchend.drag', function (e) {
                var endEvent = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                $sidebar.addClass('ease-in-out');
                $press.addClass('ease-in-out-opacity');
                $press.css({opacity: ''});
                if (diff > 100) {
                    $sidebar.css({transform: ''}).removeClass('active');
                    $press.off('touchmove.drag touchstart.drag touchend.drag');
                    if (diff/228 >= 1) {
                        $press.removeClass('active');
                    } else {
                        $press.one(transitionEnd, function () {
                            $press.removeClass('active');
                        });
                    }
                    $press.removeClass('show');
                } else {
                    $sidebar.css({transform: ''});
                }
            });
        });
    };

    // window.find_adaptive = adaptive; 

    adaptive();

    $(window).on('resize', function () {
        adaptive();
    });

});