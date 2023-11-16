var IsMenuVisible = false;
IsAvailable = true;
var menuLength = $('.SlideMenu').children().length;
var clicked = false;

$('.menuBtn').click(function() {
    if (!IsMenuVisible && IsAvailable) {
        $('.menuBtn').removeClass('Fullwidth_hide');
        $('.stick1').css({animation: 'stickDown 0.5s forwards'})
        $('.stick2').css({animation: 'hideStick 0.5s forwards'})
        $('.stick3').css({animation: 'stickUp 0.5s forwards'})
        $('.SlideMenu').slideDown(200);
        $('.SlideMenu').each(function() {
            IsMenuVisible = true;
            IsAvailable = false;
            for (let i = 0; i < menuLength; i++) {
                    $($(this).children()[i]).stop().delay(50 * ( i + 1 )).animate({opacity: 1});
            }
            setTimeout(function() {
                IsAvailable = true;
            }, 70 * menuLength + 100)
        })
    } else if (IsMenuVisible && IsAvailable) {
        $('.menuBtn').addClass('Fullwidth_hide');
        $('.stick1').css({animation: 'stickDown_R 0.5s forwards'});
        $('.stick2').css({animation: 'hideStick_R 0.5s forwards'});
        $('.stick3').css({animation: 'stickUp_R 0.5s forwards'});
        $('.SlideMenu').each(function() {
            IsMenuVisible = false;
            IsAvailable = false;
            for (let i = 0; i < menuLength + 1; i++)  {
                $($(this).children()[menuLength - i]).stop().delay(20 * i).animate({opacity: 0}, 300);
            }
            setTimeout(function() {
                IsAvailable = true;
            }, 50 * menuLength + 200)
        })
        $('.SlideMenu').delay(30 * menuLength).slideUp(200);
        $('.stick1').css({animation: 'none'})
        $('.stick2').css({animation: 'none'})
        $('.stick3').css({animation: 'none'})
    }
})