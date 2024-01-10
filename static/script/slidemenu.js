$('.SlideMenu li:even').each(function (index, element) {
    $(this).click(function () {
        if ( index < 4 ) {
            if (!$(element).hasClass("disabled")) {
                hide_footer()
                hide_header()
                $('.main_page').animate({ opacity: '0' }, 500, function () {
                    disable('.main_page')
                });
                if (index === 0) {
                    var gradient_color = 'linear-gradient(90deg, lightgreen, rgb(56, 56, 248))';
                    $('.loadingText').text('Chart')
                    $('.subText').text('실시간 노래 차트')
                } else if (index === 1) {
                    var gradient_color = 'linear-gradient(90deg, rgb(193, 100, 255),  rgb(56, 56, 248))';
                    $('.loadingText').text('Search')
                    $('.subText').text('궁금한 노래는 직접 찾아보기')
                } else if (index === 2) {
                    var gradient_color = 'linear-gradient(to right, rgb(235, 160, 141), rgb(56, 56, 248))';
                    $('.loadingText').text('Explore')
                    $('.subText').text('여기에 뭐가 있는지 둘러볼까요?')
                } else {
                    var gradient_color = 'linear-gradient(to right, rgb(255, 119, 119), rgb(56, 56, 248))';
                    $('.loadingText').text('About')
                    $('.subText').text('이 서비스가 궁금하신가요?')
                }
                if ($(window).width() > 800 ) {
                    if ($(window).width() > $(window).height()) {
                        circleAnimate = 'gradient_animation 5s linear infinite, ScaleUp_width 2s forwards'
                    } else {
                        circleAnimate = 'gradient_animation 5s linear infinite, ScaleUp_height 2s forwards'
                    }
                } else {
                    circleAnimate = 'gradient_animation 5s linear infinite, ScaleUp_Mobile 2s forwards'
                }
                $('.circle').css({
                    zIndex: '10000',
                    backgroundImage: gradient_color,
                    animation: circleAnimate
                });
    
                setTimeout(function () {
                    $('.loading').css({ display: 'block', animation: 'slideUp 1s forwards', zIndex: '10001' });
                }, 1500)
                if (index === 0) {
                    setTimeout(function () {
                        window.location.href = '/fetch_data';
                    }, 2500);
                } else if (index === 1) {
                    setTimeout(function () {
                        window.location.href = '/search';
                    }, 2500);
                } else if (index === 2) {
                    setTimeout(function () {
                        window.location.href = '/explore';
                    }, 2500);
                } else {
                    setTimeout(function () {
                        window.location.href = '/about';
                    }, 2500);
                }
            }
        } else {
            if ( index === 4 ) {
                if ( $(e)[0].classList[0] == 'guest' ) {
                    $('.loginModal').css({ display: 'block',
                                        animation: 'showModal 0.5s linear forwards',})
                    isScrollAvailable = false;
                }
            }
        }
    });
});

$('.SlideMenu i').click(function() {
    if ( $(this)[0].classList[0] == 'guest' ) {
        $('.loginModal').css({ display: 'block',
                            animation: 'showModal 0.5s linear forwards',})
        isScrollAvailable = false;
    } else {
        $('.memberModal').css({ display: 'block',
                            animation: 'showModal 0.5s linear forwards',})
        isScrollAvailable = false;
    }
});