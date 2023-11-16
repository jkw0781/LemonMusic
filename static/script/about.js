$(document).ready(function() {
    $('.about').scrollTop(0)
});

function hide_footer() {
    $('.footer_container').css({animation: 'hide 0.5s forwards'})
}

function hide_header() {
    $('header').css({animation: 'hide 0.5s forwards'})
}

$('#logo_img').click(function() {
    hide_footer()
    hide_header()
    setTimeout(function() {
        $('.loadingText').text('Home')
        $('.subText').text('홈으로 돌아갈게요. 오래 걸리지 않을거에요.')
        $('.loading').css({ display: 'block'});
        $('.loading').animate({opacity: 1}, 1000)
    }, 1500)
    setTimeout(function() {
        $('.loading').css({animation: 'slideUp 1s forwards', zIndex: '10001'});
    }, 1500)
    $('.about').animate({opacity: 0})
    $('.aboutTxt').animate({opacity: 0})
    $('.cat').animate({opacity: 0})
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
        background: 'linear-gradient(90deg, lightgreen, rgb(56, 56, 248))',
        animation: circleAnimate
    });
        setTimeout(function() {
            window.location.href = '/';
        }, 2500)
});



let options  = {
    root: document.querySelector('.about'),
    threshold: 0.25
}

let observer = new IntersectionObserver((e) => {
    e.forEach((title) => {
        if (title.isIntersecting) {
            $('.cat_menu').removeClass('on');
            $(`#${title.target.classList[1]}`).addClass('on');
        }
    })
}, options)

let catTxt = document.querySelectorAll('.detail')

observer.observe(catTxt[0]);
observer.observe(catTxt[1]);
observer.observe(catTxt[2]);

$('.cat').children().each(function(index, element) {
    $(this).click(function() {
        $('.about').animate({
            scrollTop: $(`.${$(element).attr('id')}`).offset().top - $('.about').offset().top + $('.about').scrollTop()
        }, 'slow');
    })
})

$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 100);
});

$(document).ready(() => {
    if ($(window).width() <= 800) {
        aboutBoxHeight = PixelToVh(screen.height, $('.about').height()) - PixelToVh(screen.height, $('.footer_mobile').height() * 0.2)
        $('.about').css({ height: `${aboutBoxHeight}vh` })
    }
})

$(window).bind('resizeEnd', function () {
    if ($(window).width() <= 800) {
        aboutBoxHeight = PixelToVh(screen.height, $('.about').height()) - PixelToVh(screen.height, $('.footer_mobile').height() * 0.2)
        $('.about').css({ height: `${aboutBoxHeight}vh` })
    } else {
        $('.about').css({ height: `` })
    }
});