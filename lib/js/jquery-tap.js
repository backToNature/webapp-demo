//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
    function isPointerEventType(e, type) {
        return (e.type == 'pointer'+type ||
        e.type.toLowerCase() == 'mspointer'+type)
    }

    function isPrimaryTouch(event){
        return (event.pointerType == 'touch' ||
        event.pointerType == event.MSPOINTER_TYPE_TOUCH)
        && event.isPrimary
    }

    var touch = {}, firstTouch, _isPointerType;
    $(document).ready(function () {
        $(document).on('touchstart MSPointerDown pointerdown', function (e) {
            console.log(e);
            if((_isPointerType = isPointerEventType(e, 'down')) &&
                !isPrimaryTouch(e)) {
                firstTouch = _isPointerType ? e : e.touches[0];
            }
            console.log(firstTouch);
            touch.el = $('tagName' in firstTouch.target ?
              firstTouch.target : firstTouch.target.parentNode);
            console.log(touch);
        });
    });

    ['tap'].forEach(function(eventName){
        $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
    })
})(jQuery)