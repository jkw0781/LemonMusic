let passwordScore = 0;
let usernameEntered = false;
let emailENtered = false;
let passwordConfirmed = false;

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

$('.start').click(() => {
    $('.welcome').animate({ opacity: 0 }, 300, () => {
        $('.welcome').css({ display: 'none' });
        $('.ToS').css({ display: 'block' });
        $('.ToS').animate({ opacity: 1 }, 300);
        $('.ToSDetail').scrollTop(0); 
    });
});

$('.ToScontinueBtn').click(() => {
    $('.ToS').animate({ opacity: 0 }, 300, () => {
        $('.ToS').css({ display: 'none' });
        $('.PP').css({ display: 'block' });
        $('.PP').animate({ opacity: 1 }, 300);
        $('.PPDetail').scrollTop(0); 
    });
});

$('.PPcontinueBtn').click(() => {
    $('.PP').animate({ opacity: 0 }, 300, () => {
        $('.PP').css({ display: 'none' });
        $('.createAccount').css({ display: 'block' });
        $('.createAccount').animate({ opacity: 1 }, 300);
    });
});

$(document).ready(() => {
    $('.welcome').delay(500).animate({ 'opacity': 1, 'top': '50%' }, 1000);
    $('#ToSAgree').prop('checked', false);
});

$('#PPAgree').change(() => {
    if ( $('#PPAgree').prop('checked') == true ) {
        $('.PPAgree').css({ backgroundColor: 'white', color: 'black' });
        $('.PPcontinue i').removeClass('disabled');
    } else {
        $('.PPAgree').css({ backgroundColor: '#555', color: 'white' });
        $('.PPcontinue i').addClass('disabled');
    };
});

$('#ToSAgree').change(() => {
    if ( $('#ToSAgree').prop('checked') == true ) {
        $('.ToSAgree').css({ backgroundColor: 'white', color: 'black' });
        $('.ToScontinue i').removeClass('disabled');
    } else {
        $('.ToSAgree').css({ backgroundColor: '#555', color: 'white' });
        $('.ToScontinue i').addClass('disabled');
    };
});


$('user-field input').focus(function () {
    if ($(this).val() == "") {
        $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
    } else {
        if ($(this).attr('id') == 'passwordField') {
            $('secure-text').css({ display: 'inline-block' })
        }
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' })
            $($(this).parent().children()[0]).css({ color: '#c55b5b' })
        } else {
            if ($(this).attr('id') == 'passwordField') {
                if (passwordScore < 3) {
                    $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' })
                    $($(this).parent().children()[0]).css({ color: '#c55b5b' })
                } else {
                    $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
                    $($(this).parent().children()[0]).css({ color: 'white' })
                }
            } else {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
                $($(this).parent().children()[0]).css({ color: 'white' })
            }
        }
    }
    $(this).on('input', function() {
        if ($(this).val() == "") {
            if ($(this).attr('id') == 'passwordField') {
                $('.progress').children().remove();
                $('secure-text').css({ display: 'none' });
            }
            $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' })
            $($(this).parent().children()[0]).css({ color: 'white' })
        } else {
            if ($(this).attr('id') == 'passwordField') {
                $('secure-text').css({ display: 'inline-block' });
            }
            if (!(this.validity.valid)) {
                $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' })
                $($(this).parent().children()[0]).css({ color: '#c55b5b' });
            } else {
                if ($(this).attr('id') == 'passwordField') {
                    if (passwordScore > 2) {
                        $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
                        $($(this).parent().children()[0]).css({ color: 'white' })
                    } else {
                        $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' })
                        $($(this).parent().children()[0]).css({ color: '#c55b5b' })
                    }
                } else {
                    $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
                    $($(this).parent().children()[0]).css({ color: 'white' })
                }
            }
        }
    });
}).focusout(function() {
    if ($(this).val() == "") {
        $(this).css({ color: '#666', borderBottom: '3px solid #666', animation: 'none' });
    } else {
        if ($(this).attr('id') == 'passwordField') {
            if (!(this.validity.valid)) {
                $(this).css({ color: '#683030', borderBottom: '3px solid #683030', animation: 'none' });
                $($(this).parent().children()[0]).css({ color: '#c55b5b' });
            } else {
                if (passwordScore > 2) {
                    console.log('낮음')
                    $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: 'none' });
                    $($(this).parent().children()[0]).css({ color: 'white' });
                } else {
                    $(this).css({ color: '#683030', borderBottom: '3px solid #683030', animation: 'none' });
                    $($(this).parent().children()[0]).css({ color: '#c55b5b' });
                }
            }
        } else {
            if (!(this.validity.valid)) {
                $(this).css({ color: '#683030', borderBottom: '3px solid #683030', animation: 'none' });
                $($(this).parent().children()[0]).css({ color: '#c55b5b' });
            } else {
                $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: 'none' });
                $($(this).parent().children()[0]).css({ color: 'white' });
            }
        }
    }
});

$('confirm-password input').focus(function() {
    if ($(this).val() !== $('#passwordField').val()) {
        $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' })
        $($(this).parent().children()[0]).css({ color: '#c55b5b' })
    } else {
        $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
        $($(this).parent().children()[0]).css({ color: 'white' })
    }
}).focusout(function() {
    if ($(this).val() !== $('#passwordField').val()) {
        $(this).css({ color: '#683030', borderBottom: '3px solid #683030', animation: 'none' });
    } else {
        $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: 'none' });
    }
});

$('#passwordField').on('input', function() {
    $('#confirmPassword').val('')
    const result = zxcvbn($(this).val());
    passwordScore = result.score;
    $('.progress').children().remove();
    if (passwordScore < 2) {
        $('secure-text').text('너무 약함').css({ color: '#c55b5b' });
    } else if (passwordScore === 2) {
        $('secure-text').text('약함').css({ color: '#c5855b' });
    } else if (passwordScore === 3) {
        $('secure-text').text('적당함').css({ color: '#82c55b' });
    } else {
        $('secure-text').text('강력함').css({ color: '#5bc560' });
    } 

    let progressBar = `<progress-stick></progress-stick>`;
    for ( let i = 0; i < passwordScore + 1; i++) {
        $('.progress').append(progressBar);
        if (i < 2) {
            $('progress-stick').css({ backgroundColor: '#c55b5b' });
        } else if (i === 2) {
            $('progress-stick').css({ backgroundColor: '#c5855b' });
        } else if (i === 3) {
            $('progress-stick').css({ backgroundColor: '#82c55b' });
        } else {
            $('progress-stick').css({ backgroundColor: '#5bc560' });
        }
    }
}).on("keydown", function(event) {
    var keyCode = event.keyCode || event.which;

    if (keyCode === 32) {
        // 입력을 취소합니다.
        event.preventDefault();
     }
});

$('#confirmPassword').on("keydown", function(event) {
    var keyCode = event.keyCode || event.which;

    if (keyCode === 32) {
        // 입력을 취소합니다.
        event.preventDefault();
     }
});

$('confirm-password input').on('input', function() {
    if ($(this).val() !== $('#passwordField').val()) {
        $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' })
        $($(this).parent().children()[0]).css({ color: '#c55b5b' });
        passwordConfirmed = false;
    } else {
        $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
        $($(this).parent().children()[0]).css({ color: 'white' });
        if (passwordScore > 2) {
            passwordConfirmed = true;
        } else {
            passwordConfirmed = false;
        }
    }   
});

$('#userNameField').on('input', function() {
    if ($(this).val() !== '' && this.validity.valid) {
        usernameEntered = true;
    } else {
        usernameEntered = false;
    }
});

$('#emailField').on('input', function() {
    if ($(this).val() !== '' && this.validity.valid) {
        emailENtered = true;
    } else {
        emailENtered = false;
    }
});

function enableCreateAccound() {
    if ( usernameEntered && emailENtered && passwordConfirmed ) {
        $('.create i').removeClass('disabled')
    } else {
        $('.create i').addClass('disabled')
    }
}

$('#userNameField').on('input', () => {
    enableCreateAccound();
});

$('#emailField').on('click', () => {
    $('alert-msg').css({ display: 'none' });
})

$('#emailField').on('input', () => {
    enableCreateAccound();
});

$('#passwordField').on('input', () => {
    enableCreateAccound();
});

$('#confirmPassword').on('input', () => {
    enableCreateAccound();
});