$(document).ready(() => {
    if ($(window).width() <= 800) {
        chartListHeight = PixelToVh(screen.height, $('.searchData').height()) - (PixelToVh(screen.height, $('.footer_mobile').height()) * 1.5) - 10
        $('.resultList').css({ height: `${chartListHeight}vh` })
    };
});

$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('resizeEnd');
    }, 100);
});

$(window).bind('resizeEnd', function () {
    if ($(window).width() <= 800) {
        chartListHeight = PixelToVh(screen.height, $('.searchData').height()) - PixelToVh(screen.height, $('.footer_mobile').height() * 1.5) - 10
        $('.resultList').css({ height: `${chartListHeight}vh` })
    }
});

function search(keyword, filter) {
    $('.noSuchData').css({display: 'none'})
    $('.fetchingDataAlert').css({display: 'inline-block'})
    $.ajax({
        url: '/search',
        type: "POST",
        data: JSON.stringify({ query: keyword, filter: filter }),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            if ( filter === 'songs' ) {
                postResult_song(keyword, response)
            } else if ( filter === 'videos' ) {
                postResult_videos(keyword, response)
            } else {
                postResult_artist(keyword, response)
            }
            $('.NoSpace').text("검색 결과를 보여주고 싶어요... 🥺")
            $('.SuperNarrowDown').text("b" + "a" + + "a" + "a")
            $('#search_filter').removeAttr('disabled');
        },
        error: function(error) {
            console.log(error);
            $('#search_filter').removeAttr('disabled');
        }
    });
}

var stack = 0;

$('#search_btn').click(function() {
    $('.topResult_div').remove();
    $('.artistResult').remove();
    $('.resultInfo').remove();
    $('.MobileSongInfo').remove();
    $('.horizontalLine').remove();
    if ($('.search_input').val() != '') {
        $('#search_filter').attr('disabled', 'true');
        var keyword = $('.search_input').val();
        var filter = $('#search_filter').val();
        search(keyword, filter);
        stack = 0;
    } else {
        console.log(stack)
        if (stack == 0) {
            $('.SearchMsg').text("뭔가 빠진 것 같아요.");
        } else if (stack == 1) {
            $('.SearchMsg').text("다시 한 번 확인해볼까요?");
        } else if (stack == 2) {
            $('.SearchMsg').text("뭘 찾을건데");
        } else if (stack > 2 && stack <= 3) {
            $('.SearchMsg').text("아 ㅋㅋ 싸우자 그냥");
        } else if (stack > 3 && stack <= 10) {
            $('.trollCount').text(`잘못 누른 횟수: ${stack}번`);
            $('.trollCount').css({display: 'block'});
        } else if (stack > 10) {
            $('.trollCount').text(`잘못 누른 횟수: 대충 많음`);
            $('#search_btn').css({display: 'none'});
            $('.SearchMsg').text("검색 하지 마 그냥");
        }
        stack++;
    }
});

$('.search_input').keydown((e) => {
    if ( e.keyCode == 13 ) {
        $('.topResult_div').remove();
        $('.artistResult').remove();
        $('.resultInfo').remove();
        $('.MobileSongInfo').remove();
        $('.MobileVideoInfo').remove();
        $('.horizontalLine').remove();
        if ($('.search_input').val() != '') {
            $('#search_filter').attr('disabled', 'true');
            var keyword = $('.search_input').val();
            var filter = $('#search_filter').val();
            search(keyword, filter);
            stack = 0;
        } else {
            console.log(stack)
            if (stack == 0) {
                alert('뭔가 빠진 것 같아요.')
            } else if (stack == 1) {
                alert("다시 한 번 확인해볼까요?");
            } else if (stack == 2) {
                alert("뭘 찾을건데");
            } else if (stack > 2 && stack <= 3) {
                alert("아 ㅋㅋ 싸우자 그냥");
            } else if (stack > 3 && stack <= 10) {
                alert('나가')
                window.location.href = '/';
            }
            stack++;
        }
    }
})

function postResult_song(keyword, data) {
    if ( data.length == 0 ) {
        $('.SearchMsg').text(`"` + keyword + `"` + " 에 대한 검색 결과")
        $('.fetchingDataAlert').css({display: 'none'})
        $('.noSuchData').css({display: 'inline-block'})
    } else {
        $('.SearchMsg').text(`"` + keyword + `"` + " 에 대한 검색 결과")
        $('.fetchingDataAlert').css({display: 'none'})
        for (let i = 0; i < data.length; i++) {
            artists = "";
            if (data[i]['artists'].length > 1) {
                artists = data[i]['artists'].map(item => item.name).join(", ");
            } else {
                artists = data[i]['artists'][0]['name'];
            }

            song_result = `
            <div class="songIndex">
                <p>${String(i + 1)}</p>
            </div>
            <img src="${data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url']}" alt="thumbnail">
            <div class="songTitle">
                <p>${data[String(i)].title}</p>
            </div>
            <div class="songArtist">
                <p>${artists}</p>
            </div>
            <div class="songAlbum">
                <p>${data[String(i)].album?.name ?? ' '}</p>
            </div>
            <div class="songLength">
                <p>${data[String(i)].duration ?? ' '}</p>
            </div>
            `

            MobileTemplate = `<p class="MobileSongRanking">${String(i + 1)}</p>
                <img class="MobileThumbnail" src="${data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url']}" alt="Thumbnails">
                <div class="MobileSongDetail">
                    <p class="MobileTitle">${data[String(i)]['title']}</p>
                    <div class="MobileArtistDuration">${artists} · ${data[String(i)].duration ?? ' '}</div>
                </div>`

            var fetchResult = $("<div>").addClass('resultInfo').attr('title', '클릭하여 음악을 재생합니다.\n별도의 페이지가 열립니다.').click(function() {
                openLemonPlayer(data[String(i)].title,
                                data[i]['artists'].length > 1 ? data[i]['artists'].map(item => item.name).join(", ") : data[i]['artists'][0]['name'],
                                data[String(i)].duration ?? ' ',
                                data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url'],
                                data[String(i)].videoId);
            })
            fetchResult.append(song_result);

            var MobileSongInfo = $("<div>").addClass('MobileSongInfo').attr('title', '클릭하여 유튜브 링크를 엽니다.').click(function() {
                window.open("https://youtu.be/" + data[String(i)]['id']['video']);
            })
            MobileSongInfo.append(MobileTemplate);

            var horizontalLine = $("<div>").addClass('horizontalLine')

            if (i == data.length - 1) {
                $(".resultList").append(fetchResult)
                $(".resultList").append(MobileSongInfo)
            } else {
                $(".resultList").append(fetchResult, horizontalLine)
                $(".resultList").append(MobileSongInfo, horizontalLine)
            }
        }
    }
}

function postResult_videos(keyword, data) {
    if ( data.length == 0 ) {
        $('.SearchMsg').text(`"` + keyword + `"` + " 에 대한 동영상 검색 결과")
        $('.fetchingDataAlert').css({display: 'none'})
        $('.noSuchData').css({display: 'inline-block'})
    } else {
        $('.SearchMsg').text(`"` + keyword + `"` + " 에 대한 동영상 검색 결과")
        $('.fetchingDataAlert').css({display: 'none'})
        
        for (let i = 0; i < data.length; i++) {
            song_result = `
            <div class="videoIndex">
                <p>${String(i + 1)}</p>
            </div>
            <img src="${data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url']}" alt="thumbnail">
            <div class="videoTitle">
                <p>${data[String(i)].title}</p>
            </div>
            <div class="videoUploader">
                <p>${data[String(i)].artists[0].name}</p>
            </div>
            <div class="videoViewCount">
                <p>${data[String(i)].artists[1].name}</p>
            </div>
            <div class="videoDuration">
                <p>${data[String(i)].duration ?? ' '}</p>
            </div>
            `
    
            MobileTemplate = `<p class="MobileVideoIndex">${String(i + 1)}</p>
                <img class="MobileThumbnail" src="${data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url']}" alt="Thumbnails">
                <div class="MobileVideoDetail">
                    <p class="MobileTitle">${data[String(i)]['title']}</p>
                    <div class="MobileArtistViewCountDuration">${data[String(i)].artists[0].name} · ${data[String(i)].artists[1].name} · ${data[String(i)].duration ?? ' '}</div>
                </div>`
    
            var fetchResult = $("<div>").addClass('resultInfo').attr('title', '클릭하여 음악을 재생합니다.\n별도의 페이지가 열립니다.').click(function() {
                openLemonPlayer(data[String(i)].title,
                                data[String(i)].artists[0].name,
                                data[String(i)].duration ?? ' ',
                                data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url'],
                                data[String(i)].videoId);
            })
            fetchResult.append(song_result);
    
            var MobileSongInfo = $("<div>").addClass('MobileVideoInfo').attr('title', '클릭하여 유튜브 링크를 엽니다.').click(function() {
                window.open("https://youtu.be/" + data[String(i)]['id']['video']);
            })
            MobileSongInfo.append(MobileTemplate);
    
            var horizontalLine = $("<div>").addClass('horizontalLine')
    
            if (i == data.length - 1) {
                $(".resultList").append(fetchResult)
                $(".resultList").append(MobileSongInfo)
            } else {
                $(".resultList").append(fetchResult, horizontalLine)
                $(".resultList").append(MobileSongInfo, horizontalLine)
            }
        }
    }
}

function postResult_artist(keyword, data) {
    var horizontalLine = $("<div>").addClass('horizontalLine')

    if ( data.length == 0 ) {
        $('.SearchMsg').text(`"` + keyword + `"` + " 에 대한 아티스트 검색 결과")
        $('.fetchingDataAlert').css({display: 'none'})
        $('.noSuchData').css({display: 'inline-block'})
    } else {
        $('.SearchMsg').text(`"` + keyword + `"` + " 에 대한 아티스트 검색 결과")
        $('.fetchingDataAlert').css({display: 'none'})
        topResult = `
            <img src="${data['0']['thumbnails'][(data['0']['thumbnails']).length - 1]['url']}" alt="artist_eyecatch">
            <div class="artistName">
                <p>${data['0']['artist']}</p>
            </div>
        `;

        topResultText = '<p class="TopResult">상위 검색결과</p>';

        var topResultBox = $('<div>').addClass('topResult_box').attr('title', '클릭하여 유튜브 링크를 엽니다.').click(function() {
            window.open("https://www.youtube.com/channel/" + data['0'].browseId);
        });

        topResultBox.append(topResult);

        var topresult_div = $("<div>").addClass('topResult_div');

        topresult_div.append(topResultText, topResultBox, horizontalLine);

        $(".resultList").append(topresult_div);

        for (let i = 0; i < data.length; i++) {
            artist_temp = `
                <div class="artistIndex">
                    <p>${String(i + 1)}</p>
                </div>
                <img src="${data[String(i)]['thumbnails'][(data[String(i)]['thumbnails']).length - 1]['url']}" alt="artist_eyecatch">
                <div class="artist_Name">
                    <p>${data[String(i)]['artist']}</p>
                </div>
            `

            var artistResult = $("<div>").addClass('artistResult').attr('title', '클릭하여 아티스트 페이지로 이동합니다.').click(function() {
                window.open("https://www.youtube.com/channel/" + data[String(i)].browseId);
            });

            artistResult.append(artist_temp);

            if (i == data.length - 1) {
                $(".resultList").append(artistResult)
            } else {
                $(".resultList").append(artistResult, horizontalLine)
            }
        }
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
    $('.searchTxt').animate({opacity: 0})
    $('.searchData').animate({opacity: 0})
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