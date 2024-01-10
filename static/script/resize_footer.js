$(window).on('load', function() {
    if ($(window).width() < $('.main_page').width()) {
        $('footer').css({fontSize: 15 - (($('footer').width() - $(window).width()) / 60) + 'px'})
    }
    if ($(window).width() < $('footer').width()) {
        $('footer').css({fontSize: 15 - (($('footer').width() - $(window).width()) / 60) + 'px'})
    }
})

$(window).on('resize', function() {
    if ($(window).width() < $('footer').width()) {
        $('footer').css({fontSize: 15 - (($('footer').width() - $(window).width()) / 60) + 'px'})
    } else {
        $('footer').css({fontSize: "16px"})
    }
});