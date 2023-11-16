let send = false;

onmessage = (e) => {
    if (e.data.action === 'openPlayer') {
        r = e.data.data
        lemonPlayerWorker(r.title, r.artist, r.length, r.thumbnail, r.id, r.queueLength, r.cookie)
    } else if (e.data.action === 'getList') {
        r = e.data.data
        data = {
            'title': r.title,
            'artist': r.artist,
            'length': r.length,
            'thumbnail': r.thumbnail
        }
        postMessage({ action: 'tossQueueData', data: data })
    };
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
function lemonPlayerWorker(songTitle, songArtist, songLength, songThumbnail, __id, queueLength, cookie) {
    console.log(queueLength, cookie);
    if (queueLength == 0) {
        data = {
            'title': songTitle,
            'artist': songArtist,
            'length': songLength,
            'thumbnail': songThumbnail,
            'id': __id
        }
        postMessage({ action: 'addQuery', data: data})
    } else {
        if ( cookie === 'available' ) {
            const musicData = {
                'title': songTitle,
                'artist': songArtist,
                'length': songLength,
                'thumbnail': songThumbnail,
                'id': __id
            }
            postMessage({ action: 'addQueue', data: musicData });
        } else {
            
        }
    }
};