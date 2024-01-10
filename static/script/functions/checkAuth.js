import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getAuth, updateProfile, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
let Config = {};
let userInfo = {};
let loadedData = {};

function loadLoginData() {
    if ( getCookieValue('kakaoAuth') != null || getCookieValue('kakaoAuth') != undefined ) {
        $.getJSON('/static/secret/authSecret.json', (res) => {
            $.getJSON('/static/secret/enKey.json', (key) => {
                let token = atob(getCookieValue('kakaoAuth')); // Base64 디코딩
                let decrypted = CryptoJS.AES.decrypt(token, key.key).toString(CryptoJS.enc.Utf8);
                const endpoint = "https://kauth.kakao.com/oauth/token";
                const data = {
                    grant_type: "refresh_token",
                    client_id: res.Kakao.REST_API_KEY,
                    refresh_token: decrypted,
                    client_secret: res.Kakao.CLIENT_SECRET,
                }
                $.ajax({
                    type: 'POST',
                    url: endpoint,
                    data: data,
                    dataType: 'json',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    success: function(response) {
                        $.ajax({
                            url: '/auth/kakao/userData',
                            type: 'POST',
                            data: JSON.stringify({ t: response.access_token }),
                            contentType: 'application/json',
                            dataType: 'JSON',
                            success: function(res) {
                                setCookie('uid', res.id, 0)
                                $('.userIco').addClass('userLoggedIn').removeClass('guest');
                                $('SlideMenu userIco').addClass('userLoggedIn').removeClass('guest');
                                $('.profile-pic').attr('src', res.kakao_account.profile.thumbnail_image_url)
                                let infoHTML = `<div class="OtherNameInfo">
                                                    <img src="/static/icons/loginMethod/kakao.png" alt="kakaoLogin" style="width: 20px" title="카카오 계정으로 로그인했습니다.">
                                                    <p>${res.kakao_account.profile.nickname}</p>
                                                </div>`
                                $('.infoGrid').append(infoHTML)
                                $('.userIco').css({ display: 'block' });
                            },
                            error: function(err) {
                                $('.userIco').addClass('guest').removeClass('userLoggedIn');
                                $('SlideMenu userIco').addClass('guest').removeClass('userLoggedIn');
                                console.warn('로그인 실패: 사용자 정보를 불러오는 데에 실패하였습니다.')
                                $('.userIco').css({ display: 'block' });
                            }
                        });
                    },
                    error: function(err) {
                        $('.userIco').addClass('guest').removeClass('userLoggedIn');
                        $('SlideMenu userIco').addClass('guest').removeClass('userLoggedIn');
                        console.warn('로그인 실패: 토큰 발급에 실패하였습니다.')
                        $('.userIco').css({ display: 'block' });
                    }
                });
            });
        });
    } else {
        $('.userIco').addClass('guest').removeClass('userLoggedIn');
        console.warn('로그인 실패: 로그아웃 된 상태이거나 쿠키가 삭제되었습니다.')
        $('.userIco').css({ display: 'block' });
    };
};

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

    // 사용자 인증 상태 변경 이벤트 구독
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (user.emailVerified) {
                $('.userIco').addClass('userLoggedIn').removeClass('guest');
                const uid = user.uid;
                let infoHTML = `<div class="LemonNameInfo">
                                    <p>${user.displayName}</p>
                                </div>`
                $('.infoGrid').append(infoHTML)
                userInfo = user;
                $('.userIco').css({ display: 'block' });
                setCookie('uid', uid, 0);
            } else {
                userInfo = {};
                $('.userIco').css({ display: 'block' });
            }
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            // ...
        } else {
            loadLoginData();
        }
    });
});