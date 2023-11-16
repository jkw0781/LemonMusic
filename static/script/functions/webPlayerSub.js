/**
 * 
 * @param {String} title 타이틀
 * @param {String} artist 아티스트
 * @param {String} length 길이
 * @param {String} thumbnail 썸네일
 * @param {Number} IndexofQueue 인덱스큐
 */
function addQueue(title, artist, length, thumbnail, IndexofQueue) {
    var trackListTemp = `
    <div class="songFullContainer">
        <div class="song">
            <div class="queueContainer">
                <div class="ImgContainer">
                    <span class="ClicktoPlay">
                        <i class="bi bi-play-fill" onclick="playClicked(this, ${IndexofQueue})"></i>
                        <div class="loading_circle">
                            <div class="circles">
                                <div class="loading"></div>
                                <div class="loading2"></div>
                                <div class="bg"></div>
                            </div>
                        </div>
                    </span>
                    <span class="Playnow">
                        <i class="bi bi-volume-up"></i>
                    </span>
                    <img src="${thumbnail}" alt="queueThumbnail">
                </div>
                <i class="bi bi-x-lg removeQueue" onclick="removeQueue(${IndexofQueue})"></i>
                <div class="queueDetail">
                    <span class="queueTitle">${title}</span>
                    <span class="Detail_">${artist} · ${length}</span>
                </div>
            </div>
        </div>
    </div>
    `
    $('.songQueue').append(trackListTemp);
    if (isStopped) {
        playCertainIndex(IndexofQueue);
    };
};

/**
 * Media Session API 를 사용합니다. 곡 정보를 네비게이터로 전송하는 함수이며, 곡을 재생할 때 마다 호출되어야 합니다.
 * 
 * @param {String} title 제목
 * @param {String} artist 아티스트
 * @param {String} thumbnail 썸네일 url
 */

function setMediaNavigator(title, artist, thumbnail) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: artist,
            artwork: [
                { src: thumbnail, sizes: '512x512', type: 'image/jpeg' },
            ],
        });
    };
};

if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', function () {
        audioPlayer.play();
        PlayBtn.classList.remove('bi-play-fill');
        PlayBtn.classList.add('bi-pause-fill');
    });

    navigator.mediaSession.setActionHandler('pause', function () {
        audioPlayer.pause();
        PlayBtn.classList.remove('bi-pause-fill');
        PlayBtn.classList.add('bi-play-fill');
    });

    navigator.mediaSession.setActionHandler('previoustrack', function () {
        playOther(false, 'prev');
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
        playOther(false, 'next');
    });
}