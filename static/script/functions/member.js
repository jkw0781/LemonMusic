import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";
import { getAuth, updateProfile, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
let Config = {};
let userInfo = {};

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

    $('.createBtn').click(function () {
        $('.loadingSection').css({ display: 'block' });
        register($('#userNameField').val(), $('#emailField').val(), $('#passwordField').val())
    });

    function register(displayName, email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                updateProfile(auth.currentUser, {
                    displayName: displayName
                })
                    .catch((err) => {
                        $('.loadingSection').css({ display: 'none' });
                        $('alert-msg p').html('흠, 뭔가 이상하네요. 다시 한 번 해볼까요?\n문제가 지속되면 앞서 안내된 메일로 문의 주세요.'.replace(/\n/g, '<br/>'));
                        $('alert-msg').css({ display: 'block' });
                    });
                sendEmailVerification(auth.currentUser)
                auth.signOut()
                    .then(() => {
                        $('.loadingSection').css({ display: 'none' });
                        $('.showEmail').text($('#emailField').val())
                        $('.createAccount').animate({ opacity: 0 }, 300, () => {
                            $('.createAccount').css({ display: 'none' });
                            $('.finished').css({ display: 'block' });
                            $('.finished').animate({ opacity: 1 }, 300);
                        });
                    }).catch((err) => {
                        $('.loadingSection').css({ display: 'none' });
                        $('alert-msg p').html('흠, 뭔가 이상하네요. 다시 한 번 해볼까요?\n문제가 지속되면 앞서 안내된 메일로 문의 주세요.'.replace(/\n/g, '<br/>'));
                        $('alert-msg').css({ display: 'block' });
                    })
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    $('.loadingSection').css({ display: 'none' });
                    $('alert-msg p').html('메일 주소가 이미 사용중이에요. 다른 주소로 시도해보세요.\n오류로 판단된다면 개발자에게 문의해주세요.'.replace(/\n/g, '<br/>'));
                    $('alert-msg').css({ display: 'block' });
                } else if (errorCode === 'auth/invalid-email') {
                    $('.loadingSection').css({ display: 'none' });
                    $('alert-msg p').html('유료한 메일 주소를 입력해주세요.');
                    $('alert-msg').css({ display: 'block' });
                }
            });
    }
});