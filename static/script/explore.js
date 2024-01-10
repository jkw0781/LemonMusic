$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 100);
});

$(document).ready(() => {
    if ($(window).width() <= 800) {
        chartListHeight = PixelToVh(screen.height, $('.explore_list').height()) - PixelToVh(screen.height, $('.footer_mobile').height() * 1.5) - 18
        $('.resultList').css({ height: `${chartListHeight}vh` })
    }
})

$(window).bind('resizeEnd', function () {
    if ($(window).width() <= 800) {
        chartListHeight = PixelToVh(screen.height, $('.explore_list').height()) - PixelToVh(screen.height, $('.footer_mobile').height() * 1.5) - 18
        $('.resultList').css({ height: `${chartListHeight}vh` })
    }
});

$(document).ready(function() {
    // Cat1
    $.ajax({
        url: '/explore/cat01',
        type: 'POST',
        data: JSON.stringify({ data: "playlist" }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            showPlaylists(response, '.Cat1');
            $('.Cat1 .playlists').children().each(function (index) {
                $(this).click(function () {
                    $('.playlistInfo').remove();
                    $('.resultList').remove();
                    $('.explore_list').css({ display: 'block'})
                    $('.explore_main').animate({ opacity: 0 }, function() {
                        $('.explore_list').animate({ opacity: 1 }, function() {
                            $('.explore_main').css({ display: 'none'})
                        })
                    })
                    $.ajax({
                        url: '/explore/list/cat01',
                        type: 'POST',
                        data: JSON.stringify({ data: index }),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(response) {
                            $('.loading_playlistInfo').css({ display: 'none'});
                            $('.loading_resultList').css({ display: 'none'});
                            $('.prev').css({ display: 'block'});
                            $('.prev').animate({ opacity: 1 });
                            showListDetail(response)
                            if ($(window).width() <= 800) {
                                chartListHeight = PixelToVh(screen.height, $('.explore_list').height()) - (PixelToVh(screen.height, $('.footer_mobile').height()) * 1.5) - 18
                                $('.resultList').css({ height: `${chartListHeight}vh` })
                            }
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    });
                })
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
    // Cat2
    $.ajax({
        url: '/explore/cat02',
        type: 'POST',
        data: JSON.stringify({ data: "playlist" }),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            showPlaylists(response, '.Cat2');
            $('.Cat2 .playlists').children().each(function (index) {
                $(this).click(function () {
                    $('.playlistInfo').remove();
                    $('.resultList').remove();
                    $('.explore_list').css({ display: 'block'})
                    $('.explore_main').animate({ opacity: 0 }, function() {
                        $('.explore_list').animate({ opacity: 1 }, function() {
                            $('.explore_main').css({ display: 'none'})
                        })
                    })
                    $.ajax({
                        url: '/explore/list/cat02',
                        type: 'POST',
                        data: JSON.stringify({ data: index }),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(response) {
                            $('.loading_playlistInfo').css({ display: 'none'});
                            $('.loading_resultList').css({ display: 'none'});
                            $('.prev').css({ display: 'block'});
                            $('.prev').animate({ opacity: 1 });
                            showListDetail(response)
                            if ($(window).width() <= 800) {
                                chartListHeight = PixelToVh(screen.height, $('.explore_list').height()) - (PixelToVh(screen.height, $('.footer_mobile').height()) * 1.5) - 18
                                $('.resultList').css({ height: `${chartListHeight}vh` })
                            }
                        },
                        error: function(error) {
                            console.log(error)
                        }
                    });
                })
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
});

$('.prev').click(function () {
    $('.prev').animate({ opacity: 0 })
    $('.explore_list').animate({ opacity: 0 }, function () {
        $('.explore_main').css({ display: 'block' })
        $('.explore_main').animate({ opacity: 1 }, function() {
            $('.explore_list').css({ display: 'none' })
            $('.prev').css({ display: 'none' })
            $('.loading_playlistInfo').css({ display: 'block'});
            $('.loading_resultList').css({ display: 'block'});
        })
    })
})

function showListDetail(data) {
    resultFrame = $('.explore_list');
    ListFrame = $("<div>").addClass('resultList');

    playlistInfo_temp = `
    <div class="playlistInfo">
        <img src=${data.thumbnails[(data.thumbnails).length - 1].url} alt="playlist_cover">
        <div class="InfoDetail">
            <p class="listName">${data.title}</p>
            <p class="listDescription">${data.description}</p>
            <div class="trackInfo__">
                <span class="trackCount_">${data.trackCount}곡 | </span>
                <span class="listLength">${data.duration}</span>
            </div>
        </div>
    </div>
    `

    for (let i = 0; i < (data.tracks).length; i++) {
        artists = "";
        if (data.tracks[i]['artists'].length > 1) {
            artists = data.tracks[i]['artists'].map(item => item.name).join(", ");
        } else {
            artists = data.tracks[i]['artists'][0]['name'];
        }

        result_detail_temp = `
        <div class="songIndex">
            <p>${String(i + 1)}</p>
        </div>
        <img src="${data.tracks[String(i)]['thumbnails'][(data.tracks[String(i)]['thumbnails']).length - 1]['url']}" alt="thumbnail">
        <div class="songTitle">
            <p>${data.tracks[String(i)].title}</p>
        </div>
        <div class="songArtist">
            <p>${artists}</p>
        </div>
        <div class="songAlbum">
            <p>${data.tracks[String(i)].album?.name ?? ' '}</p>
        </div>
        <div class="songLength">
            <p>${data.tracks[String(i)].duration ?? ' '}</p>
        </div>
        `
        MobileTemplate = `<p class="MobileSongRanking">${String(i + 1)}</p>
        <img class="MobileThumbnail" src="${data.tracks[String(i)]['thumbnails'][(data.tracks[String(i)]['thumbnails']).length - 1]['url']}" alt="Thumbnails">
        <div class="MobileSongDetail">
            <p class="MobileTitle">${data.tracks[String(i)].title}</p>
            <div class="MobileArtistDuration">${artists} · ${data.tracks[String(i)].album?.name ?? ' '}</div>
        </div>`

        infoWrap = $("<div>").addClass('resultInfo').attr('title', '클릭하여 음악을 재생합니다.\n별도의 페이지가 열립니다.').click(function() {
            openLemonPlayer(data.tracks[String(i)].title,
                            data.tracks[i]['artists'].length > 1 ? data.tracks[i]['artists'].map(item => item.name).join(", ") : data.tracks[i]['artists'][0]['name'],
                            data.tracks[String(i)].duration ?? ' ',
                            data.tracks[String(i)]['thumbnails'][(data.tracks[String(i)]['thumbnails']).length - 1]['url'],
                            data.tracks[String(i)].videoId)
        })
        infoWrap.append(result_detail_temp);
        ListFrame.append(infoWrap);
        
        MobileinfoWrap = $("<div>").addClass('MobileSongInfo').attr('title', '클릭하여 유튜브 링크를 엽니다.').click(function() {
            window.open("https://youtu.be/" + data.tracks[String(i)].videoId);
        })
        MobileinfoWrap.append(MobileTemplate);
        ListFrame.append(MobileinfoWrap);
    }

    resultFrame.append(playlistInfo_temp, ListFrame);
}

function showPlaylists(data, cat_) {
    $('.playlist_card').remove();
    for (let i = 0; i < Object.keys(data).length; i++) {
        thumbnail = data[String(i)].thumbnails[(data[String(i)].thumbnails).length - 1].url;
        playlist_template = `
        <div class="_playlist_card">
            <img src="${thumbnail}" alt="playlist_thumbnail">
            <div class="listInfo">
                <p class="title">${data[String(i)].title}</p>
                <p class="description">${data[String(i)].description}</p>
                <p class="trackCountLength">${data[String(i)].trackCount}곡 | ${data[String(i)].duration}</p>
            </div>
        </div>
        `
        $(`${cat_} .playlists`).append(playlist_template)
    }
}

function hide_footer() {
    $('.footer_container').css({animation: 'hide 0.5s forwards'})
}

function hide_header() {
    $('header').css({animation: 'hide 0.5s forwards'})
}

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
    $('.explore_txt').animate({opacity: 0})
    $('.playlists').animate({opacity: 0})
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