$.getJSON('static/top_chart.json', function (data) {
    for (let i = 1; i < Object.values(data).length + 1; i++) {
        var SongRanking = $("<div>").addClass('songRanking');
        var Ranking = $("<p>").text(String(i));
        SongRanking.append(Ranking);

        var Thumbnail = $("<img>").attr('src', data[String(i)]['thumbnail']);

        var SongTitle = $("<div>").addClass('songTitle').addClass('clickable'); 
        var Title = $("<p>").text(data[String(i)]['title']);
        SongTitle.append(Title);

        var SongArtist = $("<div>").addClass('songArtist').addClass('clickable');
        var Artist = $("<p>").text(data[String(i)]['artist']);
        SongArtist.append(Artist);

        var SongAlbum = $("<div>").addClass('songAlbum').addClass('clickable');
        var Album = $("<p>").text(data[String(i)]['album']);
        SongAlbum.append(Album);

        var SongLength = $("<div>").addClass('songLength')
        var Length = $("<p>").text(data[String(i)]['length']);
        SongLength.append(Length);

        var SongInfo = $("<div>").addClass('songInfo').attr('title', '클릭하여 음악을 재생합니다.\n별도의 페이지가 열립니다.').attr('data-uri', data[String(i)]['id']['video']).click(function() {
            openLemonPlayer(data[String(i)]['title'], data[String(i)]['artist'], data[String(i)]['length'], data[String(i)]['thumbnail'], data[String(i)]['id']['video']);
        })
        SongInfo.append(SongRanking, Thumbnail, SongTitle, SongArtist, SongAlbum, SongLength);

        if (i == 1) {
            MobileTemplate = `<p class="MobileSongRanking" style="color: rgb(201, 147, 0); font-weight: bolder;">1</p>
            <img class="MobileThumbnail" src="${data['1']['thumbnail']}" alt="Thumbnails">
            <div class="MobileSongDetail">
                <p class="MobileTitle">${data['1']['title']}</p>
                <div class="MobileArtistDuration">${data['1']['artist']} · ${data['1']['length']}</div>
            </div>`
        } else if (i == 2) {
            MobileTemplate = `<p class="MobileSongRanking" style="color: rgb(155, 155, 155); font-weight: bolder;">1</p>
            <img class="MobileThumbnail" src="${data['2']['thumbnail']}" alt="Thumbnails">
            <div class="MobileSongDetail">
                <p class="MobileTitle">${data['2']['title']}</p>
                <div class="MobileArtistDuration">${data['2']['artist']} · ${data['2']['length']}</div>
            </div>`
        } else if (i == 3) {
            MobileTemplate = `<p class="MobileSongRanking" style="color: rgb(182, 94, 0); font-weight: bolder;">1</p>
            <img class="MobileThumbnail" src="${data['3']['thumbnail']}" alt="Thumbnails">
            <div class="MobileSongDetail">
                <p class="MobileTitle">${data['3']['title']}</p>
                <div class="MobileArtistDuration">${data['3']['artist']} · ${data['3']['length']}</div>
            </div>`
        } else {
            MobileTemplate = `<p class="MobileSongRanking">${String(i)}</p>
            <img class="MobileThumbnail" src="${data[String(i)]['thumbnail']}" alt="Thumbnails">
            <div class="MobileSongDetail">
                <p class="MobileTitle">${data[String(i)]['title']}</p>
                <div class="MobileArtistDuration">${data[String(i)]['artist']} · ${data[String(i)]['length']}</div>
            </div>`
        }

        var MobileSongInfo = $("<div>").addClass('MobileSongInfo').attr('title', '클릭하여 유튜브 링크를 엽니다.').click(function() {
            window.open("https://youtu.be/" + data[String(i)]['id']['video']);
        })

        if (i == 1) {
            MobileSongInfo.css({backgroundColor: 'rgba(201, 147, 0, 0.3)'});
        } else if (i == 2) {
            MobileSongInfo.css({backgroundColor: 'rgba(206, 206, 206, 0.3)'});
        } else if (i == 3) {
            MobileSongInfo.css({backgroundColor: 'rgba(255, 132, 1, 0.3)'});
        } else {
            MobileSongInfo.css({backgroundColor: 'transparent'});
        }

        MobileSongInfo.append(MobileTemplate);

        var horizontalLine = $("<div>").addClass('horizontalLine')

        if (i == 100) {
            $(".chartList").append(SongInfo)
            $(".chartList").append(MobileSongInfo)
        } else {
            $(".chartList").append(SongInfo, horizontalLine)
            $(".chartList").append(MobileSongInfo, horizontalLine)
        }
    }

    top1 = `<div class="top_info">
    <p class="rank">1</p>
    <div class="details">
    <p class="title">${data['1']['title']}</p>
    <p class="artist">${data['1']['artist']}</p>
    <p class="album">${data['1']['album']}</p>
    </div>
    <img class="best_top_album" src="${data['1']['thumbnail']}" alt="top1">
    </div>`;

    top2 = `<div class="top_info">
    <p class="rank">2</p>
    <div class="details">
    <p class="title">${data['2']['title']}</p>
    <p class="artist">${data['2']['artist']}</p>
    <p class="album">${data['2']['album']}</p>
    </div>
    <img class="best_top_album" src="${data['2']['thumbnail']}" alt="top2">
    </div>`;
    
    top3 = `<div class="top_info">
    <p class="rank">3</p>
    <div class="details">
    <p class="title">${data['3']['title']}</p>
    <p class="artist">${data['3']['artist']}</p>
    <p class="album">${data['3']['album']}</p>
    </div>
    <img class="best_top_album" src="${data['3']['thumbnail']}" alt="top3">
    </div>`;

    $('.top_1').append(top1);
    $('.top_2').append(top2);
    $('.top_3').append(top3);
});

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
        $('.loading').animate({opacity: 1})
    }, 1500)
    setTimeout(function() {
        $('.loading').css({animation: 'slideUp 1s forwards', zIndex: '10001'});
    }, 1500)
    $('.chartTxt').animate({opacity: 0})
    $('.chartData').animate({opacity: 0})
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
        animation: circleAnimate
    });
        setTimeout(function() {
            window.location.href = '/';
        }, 2500)
});

let endpoint = 0;
let mouseenter = 0;
var isAnimating = false;

$('.chartList').mouseover(function() {
    mouseenter = true;
}).mouseleave(function() {
    mouseenter = false;
})

$(document).ready(() => {
    if ($(window).width() <= 800) {
        chartListHeight = PixelToVh(screen.height, $('.chartData').height()) - (PixelToVh(screen.height, $('.footer_mobile').height()) * 1.5) - 10
        $('.chartList').css({ height: `${chartListHeight}vh` })
    }
})

$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 100);
});

$(window).bind('resizeEnd', function () {
    if ($(window).width() <= 800) {
        $('.cat_container').css({'animation': 'none'});
        $('.chartList').css({'animation': 'none'});

        chartListHeight = PixelToVh(screen.height, $('.chartData').height()) - PixelToVh(screen.height, $('.footer_mobile').height() * 1.5) - 10
        $('.chartList').css({ height: `${chartListHeight}vh` })
    }
});

$(document).ready(function () {
    document.addEventListener('wheel', function (event) {
        event.preventDefault();

        if (!isMobileDevice() && !isAnimating && $(window).width() >= 800) {
            isAnimating = true;

            if (mouseenter == false) {
                if (event.deltaY > 0) {
                    if (endpoint == 0) {
                        $('.top3').css({ 'animation': 'hideTop3 0.5s ease-in-out forwards' });
                        $('.cat_container').css({ 'animation': 'moveCatContainer 0.5s ease-in-out forwards'});
                        $('.chartList').css({'animation': 'moveChartList 0.5s ease-in-out forwards'});
                        $('.toplistContainer').css({'animation': 'scaledown 0.5s ease-in-out forwards'});
                        endpoint = 1;
                    }
                } else {
                    if (endpoint == 1) {
                        $('.top3').css({ 'animation': 'showTop3 0.5s ease-in-out forwards'});
                        $('.cat_container').css({ 'animation': 'moveCatContainer_reverse 0.5s ease-in-out forwards'});
                        $('.chartList').css({'animation': 'moveChartList_reverse 0.5s ease-in-out forwards'});
                        $('.toplistContainer').css({'animation': 'scaledown_reverse  0.5s ease-in-out forwards'});
                        endpoint = 0;
                    }
                }
            } else {
    
            }

            setTimeout(function () {
                isAnimating = false;
            }, 500);
        }
    })
});

$('.playAll').click(function() {
    songArray = [];
    list = $('.chartList').children()

    for (let i = 0; i < list.length; i++) {
        if ( $(list[i]).hasClass('songInfo') ) {
            console.log($(list[i]).children())
            songInfo = [
                $(list[i]).children()[2].innerText,
                $(list[i]).children()[3].innerText,
                $(list[i]).children()[5].innerText,
                $(list[i]).children()[1].currentSrc,
                $(list[i]).attr('data-uri')
            ]
            openLemonPlayer(songInfo[0], songInfo[1], songInfo[2], songInfo[3], songInfo[4])
        }
    }

    console.log(songArray)
});