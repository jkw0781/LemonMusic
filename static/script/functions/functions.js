window.addEventListener('message', function (event) {
    if (event.data === 'reloadPage') {
        location.reload(); // 페이지 새로고침
    }
});

/**
 * 
 * @returns 접속한 기기가 모바일 기기인지 확인. true를 반환한다면 모바일. 아니라면 모바일이 아닌 다른 환경에서 접속.
 */
function isMobileDevice() {
    return /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 
 * @param {number} height vh의 기준 높이
 * @param {number} pixel 기준 높이에서 vh값으로 변환할 픽셀값
 * @returns 
 */
 function PixelToVh(height, pixel) {
    return Math.round( ( (pixel / height) * 100 ) * 100 ) / 100
}

function checkQuery(target) {
    return (target).length
}

/**
 * 로컬스토리지에 음악 데이터를 저장합니다. 저장한 데이터는 /webPlayer에서 사용됩니다.
 * 
 * @param {string} title 곡 제목
 * @param {string} artist 곡 아티스트
 * @param {string} length 곡 길이
 * @param {string} thumbnail 곡 아이캐치
 * @param {string} __id 곡 id
 */
function addQuery(title, artist, length, thumbnail, __id) {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };

    var newQueue = {
        "songTitle": title,
        "songArtist": artist,
        "songLength": length,
        "songThumbnail": thumbnail,
        "__id": __id
    }
    lemonWebPlayerQueue.lemonQueue.push(newQueue);
    localStorage.setItem('lemon-web-player-queue', JSON.stringify(lemonWebPlayerQueue));
};

const worker = new Worker("/static/script/functions/worker.js");

/**
 * 
 * @param {String} cookie_name 
 * @param {String} value 
 * @param {*} seconds 
 */
function setCookie(cookie_name, value, seconds) {
    try {
        var expiration = new Date();
        expiration.setTime(expiration.getTime() + (seconds * 1000)); // 초를 밀리초로 변환
        var cookie_value = seconds === 0 ? encodeURIComponent(value) : encodeURIComponent(value) + '; expires=' + expiration.toUTCString();
        document.cookie = cookie_name + '=' + cookie_value + '; SameSite=None; Secure; path=/;';
    }
    catch(err) {
        console.log(err);
    }
};

function getCookieValue(cookieName) {
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
};

function saveToken(rT, expireS) {
    $.getJSON('/static/secret/enKey.json', (res) => {
        try {
            let eToken = CryptoJS.AES.encrypt(rT, res.key).toString();
            setCookie('kakaoAuth', btoa(eToken), expireS); // Base64로 인코딩하여 저장
        } catch (err) {
            console.log(err);
        }
    });
};

/**
 * 플레이어를 엽니다. 이미 열려있다면 재생목록에 곡을 추가합니다.
 * 
 * @param {String} songTitle 곡명
 * @param {String} songArtist 아티스트
 * @param {String} songLength 길이
 * @param {String} songThumbnail 썸네일 이미지 URL
 * @param {String} __id 고유 id
 */
function openLemonPlayer(songTitle, songArtist, songLength, songThumbnail, __id) {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    var cookie = getCookieValue('queue')

    worker.postMessage({
        target: 'functions',
        action: 'openPlayer',
        data: {
            'title': songTitle,
            'artist': songArtist,
            'length': songLength,
            'thumbnail': songThumbnail,
            'id': __id,
            'queueLength': checkQuery(lemonWebPlayerQueue.lemonQueue),
            'cookie': cookie
        }
    });
    worker.onmessage = (e) => {
        if (e.data.action === 'addQuery') {
            openPlayerTab()
            r = e.data.data
            addQuery(r.title, r.artist, r.length, r.thumbnail, r.id);
        } else {
            r = e.data.data
            addQuery(r.title, r.artist, r.length, r.thumbnail, r.id);
        }
    };
};

function openPlayerTab() {
    window.open('/webPlayer', 'lemonPlayer', 'width=550, height=480');
}

function addQueueNotify(title, artist) {
    // 알림 생성
    const notification = new Notification("재생목록에 추가됨", {
        body: `재생목록에 다음 곡이 추가됨: '${artist} - ${title}'`,
        icon: "https://lh3.googleusercontent.com/FzLKj6zFEJna0gRNDeZRH4nuQwEyN-YbCaC-bIGLoia6EhirHUachdvdEdR3VdB7pArgFCW8mtpLPL0=w120-h120-l90-rj",
        badge: "https://lh3.googleusercontent.com/u/0/drive-viewer/AITFw-wniNc-GsINP1dU5L-5PdicP2nIqTnvxBLZhDjtGcftY2SMOCNkvPiMvl95SfEStAo0BBauy-MkS6nOa5IG-QNcjZo7Hw=w1419-h648",
        requireInteraction: true
    });

    setTimeout(() => {
        notification.close();
    }, 10000);
}

function notifyMe() {
    // 알림 생성
    const notification = new Notification("알림 제목", {
        body: "알림 내용이 여기에 들어갑니다.",
        requireInteraction: true
    });

    setTimeout(() => {
        notification.close();
    }, 10000);
}

// /**
//  * 플레이어를 엽니다. 이미 열려있다면 재생목록에 곡을 추가합니다.
//  * 
//  * @param {String} songTitle 곡명
//  * @param {String} songArtist 아티스트
//  * @param {String} songLength 길이
//  * @param {String} songThumbnail 썸네일 이미지 URL
//  * @param {String} __id 고유 id
//  */
// function openLemonPlayer(songTitle, songArtist, songLength, songThumbnail, __id) {
//     const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
//     let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };

//     if ((lemonWebPlayerQueue.lemonQueue).length == 0) {
//         addQuery(songTitle, songArtist, songLength, songThumbnail, __id)
//         lemonPlayer = window.open('/webPlayer', 'lemonPlayer', 'width=550,height=480');
//         storeWindow();
//     } else {
//         try {
//             lemonPlayer.focus();
//         } catch (err) {
//             let lemonPlayer = JSON.parse(sessionStorage.getItem('lemonPlayer'));
//             console.log(lemonPlayer)
//         }
//         const musicData = {
//             'module': 'addQueue',
//             'title': songTitle,
//             'artist': songArtist,
//             'length': songLength,
//             'thumbnail': songThumbnail,
//             '__id': __id
//         }
//         lemonPlayer.postMessage(musicData, '*');
//     }
// };

function getEndpoint(url) {
    let urlArray = url.split('/')
    return urlArray[urlArray.length - 1]
}