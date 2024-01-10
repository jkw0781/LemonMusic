const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
const audioPlayer = document.getElementById('audioPlayer');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const PlayBtn = document.querySelector('.PlayBtn');
const volumeIco = document.querySelector('.volumeIco');

let queueData = lemonWebPlayerQueue.lemonQueue;
let queueIndex = 0;
let audioVolume = 1;
let isStopped = false;

window.onbeforeunload = confirmExit;
function confirmExit() {
    return "플레이어를 종료하려 합니다.\n플레이어가 종료되면 재생목록이 초기화됩니다.";
}

window.addEventListener('unload', function() {
    localStorage.clear();
    document.cookie = "queue=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

$(document).ready(() => {
    document.cookie = "queue=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkLength();
    $.ajax({
        url: '/webPlayer/getData',
        type: "POST",
        data: JSON.stringify({ id: queueData[0].__id }),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            $('.PlayerSrc').attr('src', decodeURIComponent(response))
            loadSongData(queueData[0].songTitle, queueData[0].songArtist, queueData[0].songThumbnail, true);
            checkLength();
            loadLyrics(queueData[0].__id);
            if ( queueData.length == 0 ) {
                addQueue(queueData[0].songTitle, queueData[0].songArtist, queueData[0].songLength, queueData[0].songThumbnail, 1);
            } else {
                for (let i = 0; i < queueData.length; i++) {
                    addQueue(queueData[i].songTitle, queueData[i].songArtist, queueData[i].songLength, queueData[i].songThumbnail, i +1);
                }
            }
            audioPlayer.load();
            setMediaNavigator(queueData[0].songTitle, queueData[0].songArtist, queueData[0].songThumbnail)
            $($('.songQueue .songFullContainer').children()[0]).addClass('nowPlaying');
            $('.nowPlaying .queueContainer .ImgContainer .Playnow').css({ opacity: 1 });
            $('.nowPlaying .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'none' });
        },
        error: function(error) {
            console.log(error);
        }
    });
})

/**
 * 
 * @param {Boolean} isFinished 버튼 클릭인지, 자동 진행인지 지정.
 * @param {String} pos 'prev' / 'next' :: 이전곡, 다음곡 재생 지정 
 */
function playOther(isFinished, pos) {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    let queueData = lemonWebPlayerQueue.lemonQueue;
    
    if (!isFinished) {
        if (pos === 'next') {
            if (isStopped || queueIndex == queueData.length - 1) {
                $('.PlayBtn').addClass('disabled');
                audioPlayer.pause();
                queueIndex = 0;
                songPlay(0)
            } else {
                $('.PlayBtn').addClass('disabled');
                audioPlayer.pause();
                queueIndex++;
                songPlay(queueIndex)
            }
        } else {
            if( progress.value >= 10.000 ) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                audioPlayer.play();
                PlayBtn.classList.remove('bi-play-fill');
                PlayBtn.classList.add('bi-pause-fill');
            } else {
                if ( queueIndex != 0 ) {
                    $('.PlayBtn').addClass('disabled');
                    audioPlayer.pause();
                    queueIndex--;
                    songPlay(queueIndex);
                } else {

                }
            }
        }
    } else {
        $('.PlayBtn').addClass('disabled');
        audioPlayer.pause();
        queueIndex++;
        songPlay(queueIndex)
    }
    function songPlay(qI) {    
        $.ajax({
            url: '/webPlayer/getData',
            type: "POST",
            data: JSON.stringify({ id: queueData[qI].__id }),
            contentType: "application/json",
            dataType: "json",
            success: function(response) {
                $('.PlayerSrc').attr('src', decodeURIComponent(response))
                loadSongData(queueData[qI].songTitle, queueData[qI].songArtist, queueData[qI].songThumbnail, false)
                checkLength();
                loadLyrics(queueData[qI].__id);
                audioPlayer.load();
                setMediaNavigator(queueData[qI].songTitle, queueData[qI].songArtist, queueData[qI].songThumbnail);
                $('.PlayBtn').removeClass('disabled');
                PlayBtn.classList.remove('bi-play-fill');
                PlayBtn.classList.add('bi-pause-fill');
                $('.songQueue .songFullContainer').children().removeClass('nowPlaying');
                $('.song .queueContainer .ImgContainer .Playnow').css({ opacity: 0 });
                $('.song .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'all' });
                $($('.songQueue .songFullContainer').children()[qI]).addClass('nowPlaying');
                $('.nowPlaying .queueContainer .ImgContainer .Playnow').css({ opacity: 1 });
                $('.nowPlaying .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'none' });
                audioPlayer.play();
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
}

function playCertainIndex(i, isLoadRequired) {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    queueIndex = i - 1;
    let queueData = lemonWebPlayerQueue.lemonQueue;
    
    if (isLoadRequired) {
        let ClickToPlayElement = $($($($($('.songQueue').children()[queueIndex]).children()).children()).children()).children()[0];

        $(ClickToPlayElement).css({ opacity: 1, background: 'rgba(0, 0, 0, 0.6)' });
        $($(ClickToPlayElement).children()[0]).css({ opacity: 0 });
        $($(ClickToPlayElement).children()[1]).css({ opacity: 1 });
    }
    $('.PlayBtn').addClass('disabled');
    PlayBtn.classList.remove('bi-pause-fill');
    PlayBtn.classList.add('bi-play-fill');

    $.ajax({
        url: '/webPlayer/getData',
        type: "POST",
        data: JSON.stringify({ id: queueData[queueIndex].__id }),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            $('.PlayerSrc').attr('src', decodeURIComponent(response))
            loadSongData(queueData[queueIndex].songTitle, queueData[queueIndex].songArtist, queueData[queueIndex].songThumbnail, false)
            checkLength();
            loadLyrics(queueData[queueIndex].__id);
            audioPlayer.load();
            setMediaNavigator(queueData[queueIndex].songTitle, queueData[queueIndex].songArtist, queueData[queueIndex].songThumbnail);
            $('.PlayBtn').removeClass('disabled');
            PlayBtn.classList.remove('bi-play-fill');
            PlayBtn.classList.add('bi-pause-fill');
            $('.songQueue .songFullContainer').children().removeClass('nowPlaying');
            $('.song .queueContainer .ImgContainer .Playnow').css({ opacity: 0 });
            $('.song .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'all' });
            $($('.songQueue .songFullContainer').children()[queueIndex]).addClass('nowPlaying');
            $('.nowPlaying .queueContainer .ImgContainer .Playnow').css({ opacity: 1 });
            $('.nowPlaying .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'none' });
            if (isLoadRequired) {
                let ClickToPlayElement = $($($($($('.songQueue').children()[queueIndex]).children()).children()).children()).children()[0];
                
                $(ClickToPlayElement).css({ opacity: '', background: '' });
                $($(ClickToPlayElement).children()[0]).css({ opacity: '' });
                $($(ClickToPlayElement).children()[1]).css({ opacity: '' });
            }
            audioPlayer.play();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function checkLength() {
    if ($('.songName span').text().length > 10) {
        $('.songName span').css({
            'padding-left': '100%',
            'animation': 'loop 5s linear infinite'
        })
    } else {
        $('.songName span').css({
            'padding-left': '0',
            'animation': 'none'
        });
    };

    if ($('.songName span').text().length > 10) {
        $('.songName span').css({
            'padding-left': '100%',
            'animation': 'loop 5s linear infinite'
        })
    } else {
        $('.songName span').css({
            'padding-left': '0',
            'animation': 'none'
        });
    };
};

audioPlayer.onloadedmetadata = () => {
    $('.cur').text("00:00");
    document.cookie = "queue=available; path=/;";
    audioPlayer.volume = audioVolume;
    progress.max = audioPlayer.duration;
    progress.value = audioPlayer.currentTime;
    let min = Math.floor(audioPlayer.duration / 60);
    let sec = Math.ceil(audioPlayer.duration % 60);
    durMin = min < 10 ? "0" + min : min;
    durSec = sec < 10 ? "0" + sec : sec ;
    $('.dur').text(durMin + ":" + durSec);
    if (!audioPlayer.muted) {
        volume.max = 1;
        volume.value = audioPlayer.volume;
    } else {

    }
}

function loadSongData(songName, songArtist, songThumbnail, isFirstLoaded) {
    $('.songName span').text(songName);
    $('.songArtist span').text(songArtist);
    $('.thumbnail').attr({'src': songThumbnail});
    if (isFirstLoaded) {
        volumeIco.classList.remove('bi-volume-down-fill');
        volumeIco.classList.remove('bi-volume-mute-fill');
        volumeIco.classList.add('bi-volume-up-fill');
    } else {

    }
};

function loadLyrics(videoId) {
    $('.lyricsField').css({ display: 'none' });
    $('.noLyrics').css({ display: 'none' });
    $('.noQueue').css({ display: 'none' });
    $('.lyricsLoading').css({ display: 'block' });
    $.ajax({
        url: '/lyrics',
        type: 'POST',
        data: JSON.stringify({ videoId: videoId }),
        contentType:'application/json',
        dataType: 'json',
        success: function(response) {
            if ( response == `there's no lyrics` ) {
                $('.lyricsLoading').css({ display: 'none' });
                $('.noLyrics').css({ display: 'block' });
            } else {
                console.log(response)
                $('.lyricsLoading').css({ display: 'none' });
                $('.lyricsField').css({ display: 'block' });
                $('.lyricsField').html(response.replace(/\n/g , '<br/>'));
            }
        },
        error: function(err) {
            $('.lyricsLoading').css({ display: 'none' });
            $('.noLyrics').css({ display: 'block' });
        }
    })
}

function playPause() {
    if ( !PlayBtn.classList.contains('disabled') ) {
        if ( PlayBtn.classList.contains('bi-pause-fill') ) {
            audioPlayer.pause();
            PlayBtn.classList.remove('bi-pause-fill');
            PlayBtn.classList.add('bi-play-fill');
        } else if ( PlayBtn.classList.contains('bi-play-fill') ) {  
            audioPlayer.play();
            PlayBtn.classList.remove('bi-play-fill');
            PlayBtn.classList.add('bi-pause-fill');
        };
    };
};

if ( audioPlayer.play() ) {
    isStopped = false;
    setInterval(() => {
        progress.value = audioPlayer.currentTime;
        let cMin = Math.floor(audioPlayer.currentTime / 60);
        let cSec = Math.ceil(audioPlayer.currentTime % 60);
        curMin = cMin < 10 ? "0" + cMin : cMin;
        curSec = cSec < 10 ? "0" + cSec : cSec;
        $('.cur').text(curMin + ":" + curSec);
    }, 500)
}

progress.onchange = () => {
    audioPlayer.play();
    audioPlayer.currentTime = progress.value;
    PlayBtn.classList.remove('bi-play-fill');
    PlayBtn.classList.add('bi-pause-fill');
}

volume.onchange = () => {
    audioPlayer.volume = volume.value;
    audioVolume = volume.value;
    if ( volume.value > 0 && volume.value <= 0.5 ) {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
        }
        volumeIco.classList.remove('bi-volume-up-fill');
        volumeIco.classList.remove('bi-volume-mute-fill');
        volumeIco.classList.add('bi-volume-down-fill');
    } else if ( volume.value == 0 ) {
        volumeIco.classList.remove('bi-volume-up-fill');
        volumeIco.classList.remove('bi-volume-down-fill');
        volumeIco.classList.add('bi-volume-mute-fill');
    } else if ( volume.value >= 0.55 ) {
        if (audioPlayer.muted) {
            audioPlayer.muted = false;
        }
        volumeIco.classList.remove('bi-volume-down-fill');
        volumeIco.classList.remove('bi-volume-mute-fill');
        volumeIco.classList.add('bi-volume-up-fill');
    };
};

function playClicked(e, i) {
    $('.PlayBtn').addClass('disabled');
    audioPlayer.pause()
    $($(e).parent()).css({ opacity: 1, background: 'rgba(0, 0, 0, 0.6)' });
    $($($(e).parent()).children()[0]).css({ opacity: 0 });
    $($($(e).parent()).children()[1]).css({ opacity: 1 });
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };

    let queueData = lemonWebPlayerQueue.lemonQueue;
    queueIndex = i - 1;

    $.ajax({
        url: '/webPlayer/getData',
        type: "POST",
        data: JSON.stringify({ id: queueData[queueIndex].__id }),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            $($(e).parent()).css({ opacity: '', background: '' });
            $($($(e).parent()).children()[0]).css({ opacity: '' });
            $($($(e).parent()).children()[1]).css({ opacity: '' });
            console.log(response);
            $('.PlayerSrc').attr('src', decodeURIComponent(response))
            loadSongData(queueData[queueIndex].songTitle, queueData[queueIndex].songArtist, queueData[queueIndex].songThumbnail, false)
            checkLength();
            loadLyrics(queueData[queueIndex].__id);
            audioPlayer.load();
            setMediaNavigator(queueData[queueIndex].songTitle, queueData[queueIndex].songArtist, queueData[queueIndex].songThumbnail)
            $('.PlayBtn').removeClass('disabled');
            $('.songQueue .songFullContainer').children().removeClass('nowPlaying');
            $('.song .queueContainer .ImgContainer .Playnow').css({ opacity: 0 });
            $('.song .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'all' });
            $($('.songQueue .songFullContainer').children()[queueIndex]).addClass('nowPlaying');
            $('.nowPlaying .queueContainer .ImgContainer .Playnow').css({ opacity: 1 });
            $('.nowPlaying .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'none' });
            PlayBtn.classList.remove('bi-pause-fill');
            PlayBtn.classList.add('bi-pause-fill');
            audioPlayer.play();
        },
        error: function(error) {
            console.log(error);
        }
    });
};

audioPlayer.addEventListener('ended', () => {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    if (queueIndex + 1 == (lemonWebPlayerQueue.lemonQueue).length) {
        if ( $('.loopico i').attr('data-loop') === 'off' ) {
            PlayBtn.classList.remove('bi-pause-fill');
            PlayBtn.classList.add('bi-play-fill');
            isStopped = true;
        } else {
            playCertainIndex(1, false);
        }
    } else {
        playOther(true);
    };
});

$('.volumeIco').click(() => {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        volume.value = audioPlayer.volume;
        if ( audioPlayer.volume > 0 && audioPlayer.volume <= 0.5 ) {
            volumeIco.classList.remove('bi-volume-up-fill');
            volumeIco.classList.remove('bi-volume-mute-fill');
            volumeIco.classList.add('bi-volume-down-fill');
        } else if ( audioPlayer.volume == 0 ) {
            volumeIco.classList.remove('bi-volume-up-fill');
            volumeIco.classList.remove('bi-volume-down-fill');
            volumeIco.classList.add('bi-volume-mute-fill');
        } else if ( audioPlayer.volume >= 0.55 ) {
            volumeIco.classList.remove('bi-volume-down-fill');
            volumeIco.classList.remove('bi-volume-mute-fill');
            volumeIco.classList.add('bi-volume-up-fill');
        };
    } else {
        volumeIco.classList.remove('bi-volume-up-fill');
        volumeIco.classList.remove('bi-volume-down-fill');
        volumeIco.classList.add('bi-volume-mute-fill');
        volume.value = 0;
        audioPlayer.muted = true;
    }
});

$('.loopico').click(() => {
    let target = document.querySelector('.loopico');
    let btnAnimation = target.animate([
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.5)'},
        {background: 'rgba(100, 100, 100, 0.4)'},
        {background: 'rgba(100, 100, 100, 0.3)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'}
    ], 1000);
    if ( $('.loopico i').attr('data-loop') == 'off' ) {
        $('.loopico i').attr('data-loop', 'all');
        $('.loopico i').attr('title', '전체 반복');
        $('.loop').css({ color: 'white' });
    } else if ( $('.loopico i').attr('data-loop') == 'all' ) {
        $('.loopico i').attr('data-loop', 'one');
        $('.loopico i').attr('title', '한 곡 반복');
        $('#audioPlayer').attr('loop', true);
        $('.loopico i').removeClass('bi-repeat');
        $('.loopico i').addClass('bi-repeat-1');
    } else if ( $('.loopico i').attr('data-loop') == 'one' ) {
        $('.loopico i').attr('data-loop', 'off');
        $('.loopico i').attr('title', '반복 안함');
        $('#audioPlayer').attr('loop', false);
        $('.loop').css({ color: 'rgba(255, 255, 255, 0.3)' });
        $('.loopico i').removeClass('bi-repeat-1');
        $('.loopico i').addClass('bi-repeat');
    };
});

$('.shuffleico').click(() => {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    let queueData = lemonWebPlayerQueue.lemonQueue;
    console.log(queueData)

    let target = document.querySelector('.shuffleico');
    let btnAnimation = target.animate([
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.5)'},
        {background: 'rgba(100, 100, 100, 0.4)'},
        {background: 'rgba(100, 100, 100, 0.3)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'}
    ], 1000);

    const array = queueData;
    const tempArr = array[queueIndex];
    array.splice(queueIndex, 1);
    const arrayLength = array.length;

    for (let i = arrayLength -1; i>=0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    array.unshift(tempArr);

    $('.songQueue').children().each((i, e) => {
        if ( i != queueIndex ) {
            $(e).remove();
        } else {
            $($(e).children().children().children().children().children()[0]).attr('onclick', 'playClicked(this, 1)')
            $($(e).children().children().children()[1]).attr('onclick', 'removeQueue(1)')
        }
    });

    for (let i = 1; i <= arrayLength; i++) {
        addQueue(array[i].songTitle, array[i].songArtist, array[i].songLength, array[i].songThumbnail, i + 1)
    }

    queueIndex = 0;
    localStorage.setItem('lemon-web-player-queue', JSON.stringify(lemonWebPlayerQueue));
    console.log(queueData);
});

$('.openYoutubeico').click(() => {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    let queueData = lemonWebPlayerQueue.lemonQueue;

    let target = document.querySelector('.openYoutubeico');
    let btnAnimation = target.animate([
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.5)'},
        {background: 'rgba(100, 100, 100, 0.4)'},
        {background: 'rgba(100, 100, 100, 0.3)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'},
        {background: 'rgba(100, 100, 100, 0.2)'}
    ], 1000)
    window.open("https://youtu.be/" + queueData[queueIndex].__id);
});

$('.currentQueue').click(() => {
    $('.Queue').css({ display: 'block' });
    $('.Lyrics').css({ display: 'none' });
    $('.currentQueue').css({ 'border-bottom': '2px solid white' });
    $('.songLyrics').css({ 'border-bottom': 'none' });
});

$('.songLyrics').click(() => {
    $('.Lyrics').css({ display: 'block' });
    $('.Queue').css({ display: 'none' });
    $('.songLyrics').css({ 'border-bottom': '2px solid white' });
    $('.currentQueue').css({ 'border-bottom': 'none' });
});

function removeQueue(Index) {
    const lemonWebPlayerQueueStr = localStorage.getItem('lemon-web-player-queue');
    let lemonWebPlayerQueue = lemonWebPlayerQueueStr ? JSON.parse(lemonWebPlayerQueueStr) : { lemonQueue: [] };
    let queueData = lemonWebPlayerQueue.lemonQueue;
    
    $('.songQueue').children().each((index, e) => {
        $(e).remove()
    });
    queueData.splice(Index - 1, 1)
    localStorage.setItem('lemon-web-player-queue', JSON.stringify(lemonWebPlayerQueue));

    if ( (Index - 1) != queueIndex ) {
        if ( queueIndex != 0 ) {
            if ( queueIndex > ( Index - 1 ) ) {
                queueIndex--;
            };
        };

        for (let i = 0; i < queueData.length; i++) {
            addQueue(queueData[i].songTitle, queueData[i].songArtist, queueData[i].songLength, queueData[i].songThumbnail, i + 1)
        }

        $('.songQueue .songFullContainer').children().removeClass('nowPlaying');
        $('.song .queueContainer .ImgContainer .Playnow').css({ opacity: 0 });
        $('.song .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'all' });
        $($('.songQueue .songFullContainer').children()[queueIndex]).addClass('nowPlaying');
        $('.nowPlaying .queueContainer .ImgContainer .Playnow').css({ opacity: 1 });
        $('.nowPlaying .queueContainer .ImgContainer .ClicktoPlay i').css({ 'pointer-events': 'none' });
    } else {
        // 재생 중인 음악을 제거했을 때 로직 작성
        audioPlayer.pause();
        for (let i = 0; i < queueData.length; i++) {
            addQueue(queueData[i].songTitle, queueData[i].songArtist, queueData[i].songLength, queueData[i].songThumbnail, i + 1)
        }

        playCertainIndex(Index, true);
    };
};


function openNewLemonPlauer(songPack) {

}