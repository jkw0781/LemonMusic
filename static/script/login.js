import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getAuth, updateProfile, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
let Config = {};
let userInfo = {};
let isOptionVisible = false;

$('.Option').click(function () {
    if (!isOptionVisible) {
        $('.options').stop().slideDown(200);
        $('.menuI').removeClass('bi-caret-down-fill');
        $('.menuI').addClass('bi-caret-up-fill');
        isOptionVisible = true;
    } else {
        $('.options').stop().slideUp(200);
        $('.menuI').removeClass('bi-caret-up-fill');
        $('.menuI').addClass('bi-caret-down-fill');
        isOptionVisible = false;
    }
});

$('.OptionUl').mouseleave(function () {
    if (isOptionVisible) {
        $('.options').stop().slideUp(200);
        $('.menuI').removeClass('bi-caret-up-fill');
        $('.menuI').addClass('bi-caret-down-fill');
        isOptionVisible = false;
    }
});

$.getJSON('/static/secret/auth.json', (res) => {
    Config = res.firebaseConfig

    const firebaseConfig = {
        apiKey: Config.apiKey,
        authDomain: Config.authDomain,
        projectId: Config.projectId,
        storageBucket: Config.storageBucket,
        messagingSenderId: Config.messagingSenderId,
        appId: Config.appId,
        measurementId: Config.measurementId
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const database = getDatabase(app);

    const auth = getAuth();

    function userLogin(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                location.reload();
            }).catch((err) => {
                $('#passwordField').removeAttr('disabled');
                if (err.code === 'auth/wrong-password') {
                    $('.login').removeClass('disabled loggingIn');
                    $('#passwordField').css({ color: '', borderBottom: '' });
                    $('.failureALert').css({ display: 'block' });
                    $('.failureALert').text('비밀번호를 다시 확인해주세요.');
                } else if (err.code === 'auth/too-many-requests') {
                    $('.login').removeClass('disabled loggingIn');
                    $('#passwordField').css({ color: '', borderBottom: '' });
                    $('.failureALert').css({ display: 'block' });
                    $('.failureALert').text('비밀번호를 너무 많이 틀렸어요. 잠시 후에 다시 시도해주세요.');
                } else {
                    $('.login').removeClass('disabled loggingIn');
                    $('#passwordField').css({ color: '', borderBottom: '' });
                    $('.failureALert').css({ display: 'block' });
                    $('.failureALert').text('알 수 없는 오류가 발생했어요.');
                }
            });
    };

    function confirmLogin(step) {
        $('.failureALert').css({ display: 'none' });
        if (step == 'emailValid') {
            if ($('.login').hasClass('disabled')) {
                if ($('.login').hasClass('loggingIn')) {

                } else {
                    $('#emailField').addClass('login-failed-animation');
                    $('#emailField').removeClass('login-failed-animation');
                    void $('#emailField')[0].offsetWidth;
                    $('#emailField').addClass('login-failed-animation');
                }
            } else {
                $('#emailField').css({ color: '#444', borderBottom: '3px solid #444' });
                $('#emailField').attr('disabled', 'true');
                $('.login').addClass('disabled loggingIn');
                $('.modalBg').addClass('disabled');
                $.ajax({
                    url: '/auth/user',
                    type: 'POST',
                    data: JSON.stringify({ email: $('#emailField').val() }),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (response) {
                        $('.modalBg').removeClass('disabled');
                        $('#emailField').removeAttr('disabled');
                        if (response.exist) {
                            if (response.verified) {
                                $('.login').attr('id', 'loginToServer');
                                $('#emailField').animate({ opacity: '0' }, 500, () => {
                                    $('#emailField').css({ display: 'none' });
                                    $('#passwordField').css({ display: 'block' });
                                    $('#passwordField').animate({ opacity: '1' }, 500);
                                    $('.back').css({ display: 'block' });
                                    $('.back').animate({ opacity: '1' }, 500);
                                    $('.login').addClass('disabled');
                                    $('#emailField').css({ color: '', borderBottom: '' });
                                });
                            } else {
                                $('.login').removeClass('disabled loggingIn');
                                $('#emailField').css({ color: '', borderBottom: '' });
                                $('.failureALert').css({ display: 'block' });
                                $('.failureALert').text('가입되지 않은 메일이거나 메일 인증이 필요한 계정이에요.')
                            }
                        } else if (!response.exist) {
                            $('.login').removeClass('disabled loggingIn');
                            $('#emailField').css({ color: '', borderBottom: '' });
                            $('.failureALert').css({ display: 'block' });
                            $('.failureALert').text('가입되지 않은 메일이거나 메일 인증이 필요한 계정이에요.')
                        } else {
                            $('.login').removeClass('disabled loggingIn');
                            $('#emailField').css({ color: '', borderBottom: '' });
                            $('.failureALert').css({ display: 'block' });
                            $('.failureALert').text('알 수 없는 오류로 인해 로그인 할 수 없어요.')
                        }
                    },
                    error: function () {
                        $('.login').removeClass('disabled loggingIn');
                        $('.modalBg').removeClass('disabled');
                        $('#emailField').css({ color: '', borderBottom: '' });
                        $('#emailField').removeAttr('disabled');
                        $('.failureALert').css({ display: 'block' });
                        $('.failureALert').text('알 수 없는 오류로 인해 로그인 할 수 없어요.')
                    }
                })
            }
        } else if (step == 'loginToServer') {
            if ($('.login').hasClass('disabled')) {
                if ($('.login').hasClass('loggingIn')) {

                } else {
                    $('#passwordField').addClass('login-failed-animation');
                    $('#passwordField').removeClass('login-failed-animation');
                    void $('#passwordField')[0].offsetWidth;
                    $('#passwordField').addClass('login-failed-animation');
                }
            } else {
                $('.back').animate({ opacity: '0' }, 0, () => {
                    $('.back').css({ display: 'none' });
                });
                $('#passwordField').attr('disabled', 'true');
                $('#passwordField').css({ color: '#444', borderBottom: '3px solid #444' });
                $('.login').addClass('disabled loggingIn');
                $('.modalBg').addClass('disabled');
                userLogin($('#emailField').val(), $('#passwordField').val())
            };
        };
    };

    $('#emailField').focusin(function () {
        $('#emailField').removeClass('login-failed-animation');
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).on('input', function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        };
        if ($(this).val() !== '' && this.validity.valid) {
            $('.login').removeClass('disabled');
        } else {
            $('.login').addClass('disabled');
        }
    }).focusout(function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#a03636', borderBottom: '3px solid #a03636', animation: '' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: '' });
            }
        }
    }).keydown((e) => {
        var keyCode = e.keyCode || e.which;

        if (e.keyCode == 13) {
            $('#emailField').focusout();
            confirmLogin('emailValid');
            setTimeout(function () {
                $('#emailField').focus();
            }, 500)
        }
    });

    $('#passwordField').focusin(function () {
        $('.failureALert').css({ display: 'none' });
        $('.back').css({ display: 'block', opacity: '1' });
        $('#passwordField').removeClass('login-failed-animation');
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).on('input', function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        };
        if ($(this).val() !== '' && this.validity.valid) {
            $('.login').removeClass('disabled');
        } else {
            $('.login').addClass('disabled');
        }
    }).focusout(function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#a03636', borderBottom: '3px solid #a03636', animation: '' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: '' });
            }
        }
    }).keydown((e) => {
        if (e.keyCode == 13) {
            $('#passwordField').focusout();
            confirmLogin('loginToServer');
        }
    });


    $('.login').click(function () {
        confirmLogin($(this).attr('id'));
    });

    $('.back').click(() => {
        $('.login').attr('id', 'emailValid');
        $('#passwordField').animate({ opacity: '0' }, 500, () => {
            $('#passwordField').css({ display: 'none' });
            $('#emailField').css({ display: 'block' });
            $('#emailField').animate({ opacity: '1' });
        });
        $('.back').animate({ opacity: '0' }, 500, () => {
            $('.back').css({ display: 'none' });
        });
    });

    $('.memberLogout').click(function () {
        if ($(this).hasClass('disabled')) {

        } else {
            $(this).addClass('disabled')
            $('.memberInfoBg').addClass('disabled')
            if (getCookieValue('kakaoAuth') != null || getCookieValue('kakaoAuth') != undefined) {
                $.getJSON('/static/secret/authSecret.json', (res) => {
                    const REST_API_KEY = res.Kakao.REST_API_KEY
                    let LOGOUT_REDIRECT_URI = window.location.href.replace(getEndpoint(window.location.href), res.Kakao.LOGOUT_REDIRECT_ENDPOINT)

                    if (getEndpoint(window.location.href) == "") {
                        LOGOUT_REDIRECT_URI = window.location.href + res.Kakao.LOGOUT_REDIRECT_ENDPOINT
                    } else {
                        LOGOUT_REDIRECT_URI = window.location.href.replace(getEndpoint(window.location.href), res.Kakao.LOGOUT_REDIRECT_ENDPOINT)
                    }

                    var _width = '550';
                    var _height = '800';

                    // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
                    var _left = Math.ceil((window.screen.width - _width) / 2);
                    var _top = Math.ceil((window.screen.height - _height) / 2);

                    let kakaoLogout = window.open(`https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`,
                        'kakao logout',
                        'width=' + _width + ', height=' + _height + ', left=' + _left + ', top=' + _top);

                    setInterval(function () {
                        $('.memberLogout').removeClass('disabled');
                        $('.memberInfoBg').removeClass('disabled');
                    }, 1500)
                });
            } else {
                auth.signOut()
                    .then(() => {
                        location.reload();
                    })
                    .catch((err) => {

                    })
            }
        }
    });

    $('#verifyemailField').focusin(function () {
        $('.verifyFailureAlert').css({ display: 'none' });
        $('#verifyemailField').removeClass('login-failed-animation');
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).on('input', function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).focusout(function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#a03636', borderBottom: '3px solid #a03636', animation: '' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: '' });
            }
        }
    });

    $('#verifypasswordField').focusin(function () {
        $('.verifyFailureAlert').css({ display: 'none' });
        $('#verifypasswordField').removeClass('login-failed-animation');
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).on('input', function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).focusout(function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#a03636', borderBottom: '3px solid #a03636', animation: '' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: '' });
            }
        }
    });

    $('#verifyemailField, #verifypasswordField').on('input', function () {
        var emailField = $('#verifyemailField')[0];
        var passwordField = $('#verifypasswordField')[0];

        if (!(emailField.validity.valid)) {
            $('.verifyBtn').addClass('disabled');
        } else {
            if ($(emailField).val() !== '' && emailField.validity.valid) {
                if ($(passwordField).val() !== '' && passwordField.validity.valid) {
                    $('.verifyBtn').removeClass('disabled');
                } else {
                    $('.verifyBtn').addClass('disabled');
                }
            } else {
                $('.verifyBtn').addClass('disabled');
            }
        }
    }).keydown((e) => {
        var emailField = $('#verifyemailField')[0];
        var passwordField = $('#verifypasswordField')[0];
        if (e.keyCode === 13) {
            $('#verifyemailField').focusout();
            $('#verifypasswordField').focusout();
            $('#verifyemailField').removeClass('login-failed-animation-top0');
            $('#verifypasswordField').removeClass('login-failed-animation-top0');
            if ($('.verifyBtn').hasClass('disabled')) {
                if ($(emailField).val() == '' || !(emailField.validity.valid)) {
                    $('#verifyemailField').addClass('login-failed-animation-top0');
                    $('#verifyemailField').removeClass('login-failed-animation-top0');
                    void $('#verifyemailField')[0].offsetWidth;
                    $('#verifyemailField').addClass('login-failed-animation-top0');
                }
                if ($(passwordField).val() == '' || !(passwordField.validity.valid)) {
                    $('#verifypasswordField').addClass('login-failed-animation-top0');
                    $('#verifypasswordField').removeClass('login-failed-animation-top0');
                    void $('#verifypasswordField')[0].offsetWidth;
                    $('#verifypasswordField').addClass('login-failed-animation-top0');
                }
            } else {
                $('.modalBg').addClass('disabled');
                $('.verifyBtn').addClass('disabled');
                $('#verifyemailField').attr('disabled', 'true');
                $('#verifypasswordField').attr('disabled', 'true');
                sendVerificationEmail($(emailField).val(), $(passwordField).val())
            }
        }
    });

    $('.verifyCancelBtn').click(function() {

    });

    $('.verifyBtn').click(function() {
        var emailField = $('#verifyemailField')[0];
        var passwordField = $('#verifypasswordField')[0];
        $('#verifyemailField').focusout();
        $('#verifypasswordField').focusout();
        $('#verifyemailField').removeClass('login-failed-animation-top0');
        $('#verifypasswordField').removeClass('login-failed-animation-top0');
        if ($('.verifyBtn').hasClass('disabled')) {
            if ($(emailField).val() == '' || !(emailField.validity.valid)) {
                $('#verifyemailField').addClass('login-failed-animation-top0');
                $('#verifyemailField').removeClass('login-failed-animation-top0');
                void $('#verifyemailField')[0].offsetWidth;
                $('#verifyemailField').addClass('login-failed-animation-top0');
            }
            if ($(passwordField).val() == '' || !(passwordField.validity.valid)) {
                $('#verifypasswordField').addClass('login-failed-animation-top0');
                $('#verifypasswordField').removeClass('login-failed-animation-top0');
                void $('#verifypasswordField')[0].offsetWidth;
                $('#verifypasswordField').addClass('login-failed-animation-top0');
            }
        } else {
            $('.modalBg').addClass('disabled');
            $('.verifyBtn').addClass('disabled');
            $('#verifyemailField').attr('disabled', 'true');
            $('#verifypasswordField').attr('disabled', 'true');
            sendVerificationEmail($(emailField).val(), $(passwordField).val())
        }
    })

    function sendVerificationEmail(email, password) {
        $.ajax({
            url: '/auth/user',
            type: 'POST',
            data: JSON.stringify({ email: email }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                $('#verifyemailField').removeAttr('disabled');
                $('#verifypasswordField').removeAttr('disabled');
                if (response.exist) {
                    if (response.verified) {
                        $('.verifyBtn').removeClass('disabled');
                        $('.verifyEmail').animate({ opacity: '0' }, 300, () => {
                            $('.verifyEmail').css({ display: 'none' })
                            $('.alreadyVerified').css({ display: 'block' })
                            $('.alreadyVerified').animate({ opacity: '1' }, 600)
                        });
                    } else {
                        signInWithEmailAndPassword(auth, email, password)
                            .then(() => {
                                sendEmailVerification(auth.currentUser)
                                    .then(() => {
                                        auth.signOut()
                                        $('.verifyEmail').animate({ opacity: '0' }, 300, () => {
                                            $('.verifyEmail').css({ display: 'none' })
                                            $('.verifyEmailSent').css({ display: 'block' })
                                            $('.verifyEmailSent').animate({ opacity: '1' }, 600, () => {
                                                let i = 29;

                                                function doSomething() {
                                                    if ( i > 0 ) {
                                                        $('.TimeRemains').text(i);
                                                        i--;
                                                    } else {
                                                        clearInterval(intervalId);
                                                        location.reload();
                                                    }
                                                }
                                                
                                                const intervalId = setInterval(doSomething, 1000);
                                            })
                                        });
                                    })
                                    .catch((err) => {
                                        $('.verifyBtn').removeClass('disabled');
                                        auth.signOut();
                                        $('.verifyFailureAlert').css({ display: 'block' });
                                        $('.verifyFailureAlert').text('서비스에 연결 할 수 없어요.');
                                    })
                            })
                            .catch((err) => {
                                $('.verifyBtn').removeClass('disabled');
                                if (err.code === 'auth/wrong-password') {
                                    $('.verifyFailureAlert').css({ display: 'block' });
                                    $('.verifyFailureAlert').text('비밀번호를 다시 확인해주세요.');
                                } else if (err.code === 'auth/too-many-requests') {
                                    $('.verifyFailureAlert').css({ display: 'block' });
                                    $('.verifyFailureAlert').text('비밀번호를 너무 많이 틀렸어요. 잠시 후에 다시 시도해주세요.');
                                } else {
                                    $('.verifyFailureAlert').css({ display: 'block' });
                                    $('.verifyFailureAlert').text('알 수 없는 오류가 발생했어요.');
                                }
                            })
                    }
                } else if (!response.exist) {
                    $('.verifyBtn').removeClass('disabled');
                    $('.verifyFailureAlert').css({ display: 'block' });
                    $('.verifyFailureAlert').text('사용자 정보를 확인할 수 없어요.');
                } else {
                    $('.verifyFailureAlert').css({ display: 'block' });
                    $('.verifyFailureAlert').text('알 수 없는 오류로 인해 로그인 할 수 없어요.');
                }
            },
            error: function () {
                $('.verifyBtn').removeClass('disabled');
                $('.modalBg').removeClass('disabled');
                $('.failureALert').css({ display: 'block' });
                $('.failureALert').text('알 수 없는 오류로 인해 로그인 할 수 없어요.')
            }
        });
    }

    $('.refreshNow').click(() => {
        location.reload();
    });

    $('#resetPasswordEmailField').focusin(function () {
        $('.resetPasswordFailureAlert').css({ display: 'none' });
        $('#resetPasswordEmailField').removeClass('login-failed-animation');
        if (!(this.validity.valid)) {
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
            }
        }
    }).on('input', function () {
        if (!(this.validity.valid)) {
            $('.sendBtn').addClass('disabled');
            $(this).css({ color: '#c55b5b', animation: 'border-color-invalid 0.3s forwards linear' });
        } else {
            if ($(this).val() == '' ) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
                $('.sendBtn').addClass('disabled');
                return;
            }
            if (this.validity.valid) {
                $(this).css({ color: 'white', animation: 'border-color 0.3s forwards linear' });
                $('.sendBtn').removeClass('disabled');
                return;
            }
        }
    }).focusout(function () {
        if (!(this.validity.valid)) {
            $(this).css({ color: '#a03636', borderBottom: '3px solid #a03636', animation: '' });
        } else {
            if ($(this).val() == '' || this.validity.valid) {
                $(this).css({ color: '#999', borderBottom: '3px solid #666', animation: '' });
            }
        }
    }).keydown((e) => {
        var emailField = $('#resetPasswordEmailField')[0];
        if (e.keyCode === 13) {
            $('#resetPasswordEmailField').focusout();
            $('#resetPasswordEmailField').removeClass('login-failed-animation-top0');
            if ($('.sendBtn').hasClass('disabled')) {
                if ($(emailField).val() == '' || !(emailField.validity.valid)) {
                    $('#resetPasswordEmailField').addClass('login-failed-animation-top0');
                    $('#resetPasswordEmailField').removeClass('login-failed-animation-top0');
                    void $('#resetPasswordEmailField')[0].offsetWidth;
                    $('#resetPasswordEmailField').addClass('login-failed-animation-top0');
                }
                return;
            }
            $('.sendBtn').addClass('disabled');
            $('.modalBg').addClass('disabled');
            $.ajax({
                url: '/auth/user',
                type: 'POST',
                data: JSON.stringify({ email: $(emailField).val() }),
                contentType: 'application/json',
                dataType: 'json',
                success: function (response) {
                    if (response.exist) {
                        sendPasswordResetEmail(auth, $(emailField).val())
                            .then(() => {
                                $('.resetPassword').animate({ opacity: '0' }, 300, () => {
                                    $('.resetPassword').css({ display: 'none' })
                                    $('.resetPasswordEmailSent').css({ display: 'block' })
                                    $('.resetPasswordEmailSent').animate({ opacity: '1' }, 600)
                                });
                            })
                            .catch((error) => {
                                $('.sendBtn').removeClass('disabled');
                                $('.resetPasswordFailureAlert').css({ display: 'block' });
                                $('.resetPasswordFailureAlert').text(`서비스에 연결할 수 없어요. ${error.code}`);
                            });
                        return;
                    }
                    $('.resetPassword').animate({ opacity: '0' }, 300, () => {
                        $('.resetPassword').css({ display: 'none' })
                        $('.resetPasswordEmailSent').css({ display: 'block' })
                        $('.resetPasswordEmailSent').animate({ opacity: '1' }, 600)
                    });
                }
            });
        };
    });

    $('.sendBtn').click(() => {     
        console.log('dsd') 
        var emailField = $('#resetPasswordEmailField')[0];
        $('#resetPasswordEmailField').focusout();
        $('#resetPasswordEmailField').removeClass('login-failed-animation-top0');
        if ($('.sendBtn').hasClass('disabled')) {
            if ($(emailField).val() == '' || !(emailField.validity.valid)) {
                $('#resetPasswordEmailField').addClass('login-failed-animation-top0');
                $('#resetPasswordEmailField').removeClass('login-failed-animation-top0');
                void $('#resetPasswordEmailField')[0].offsetWidth;
                $('#resetPasswordEmailField').addClass('login-failed-animation-top0');
            }
            return;
        }
        $('.sendBtn').addClass('disabled');
        $('.modalBg').addClass('disabled');
        $.ajax({
            url: '/auth/user',
            type: 'POST',
            data: JSON.stringify({ email: $(emailField).val() }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                if (response.exist) {
                    sendPasswordResetEmail(auth, $(emailField).val())
                        .then(() => {
                            $('.resetPassword').animate({ opacity: '0' }, 300, () => {
                                $('.resetPassword').css({ display: 'none' })
                                $('.resetPasswordEmailSent').css({ display: 'block' })
                                $('.resetPasswordEmailSent').animate({ opacity: '1' }, 600)
                            });
                        })
                        .catch((error) => {
                            $('.sendBtn').removeClass('disabled');
                            $('.resetPasswordFailureAlert').css({ display: 'block' });
                            $('.resetPasswordFailureAlert').text(`서비스에 연결할 수 없어요. ${error.code}`);
                        });
                    return;
                }
                $('.resetPassword').animate({ opacity: '0' }, 300, () => {
                    $('.resetPassword').css({ display: 'none' })
                    $('.resetPasswordEmailSent').css({ display: 'block' })
                    $('.resetPasswordEmailSent').animate({ opacity: '1' }, 600)
                });
            }
        });
    });
});