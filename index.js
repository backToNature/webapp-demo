$(function () {
    $('.header-tabs').each(function(){
        $(this).swiper({
            slidesPerView:'auto',
            offsetPxBefore:25,
            offsetPxAfter:10,
            calculateHeight: true
        })
    });
});