$(document).ready(function () {
    $('#themechange').click(function () {

        if ($('body.darkmode').length) {

            $('body').removeClass("darkmode");

            $(this).children('.ficon')
                .removeClass("ficon-sun")
                .addClass("ficon-night");

            $(this).children('span').text("Gece Modu");

        } else {

            $('body').addClass("darkmode");

            $(this).children('.ficon')
                .removeClass("ficon-night")
                .addClass("ficon-sun");

            $(this).children('span').text("Gündüz Modu");
        }

    });

    var countdown = new Date('0 12:58:14');
    setInterval(() => {
        countdown = new Date(countdown - 1000);
        $('#countdown').text(("0" + countdown.getHours()).slice(-2) + ":"
            + ("0" + countdown.getMinutes()).slice(-2) + ":"
            + ("0" + countdown.getSeconds()).slice(-2));
    }, 1000);


    var breakingNews = new Swiper(".breaking-items", {
        slidesPerView: "auto",
        followFinger: !1,
        simulateTouch: !1,
        autoplay: {
            delay: 7000
        }
    });
    var homeTopnews = new Swiper(".home-topnews", {
        slidesPerView: 1,
        slidesPerGroup: 1,
        followFinger: !1,
        simulateTouch: !1,
        speed: 1,
        on: {
            slideChangeTransitionEnd: function (e) {
                $(".topnews-pagination .topnews-pageitem").removeClass("active");
                $(".topnews-pagination .topnews-pageitem").eq($(".home-topnews .swiper-slide-active").index()).addClass("active");
            }
        }
    });
    $(".topnews-pagination .topnews-pageitem").mouseover(function () {
        homeTopnews.slideTo($(this).index())
    });
});