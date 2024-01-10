$.getJSON('/static/secret/authSecret.json', (res) => {    
    $('.kakaoLogin').click(function() {
        const REST_API_KEY = res.Kakao.REST_API_KEY;
        let REDIRECT_URI = window.location.href.replace(getEndpoint(window.location.href), res.Kakao.REDIRECT_ENDPOINT)
        
        if ( getEndpoint(window.location.href) == "" ) {
            REDIRECT_URI = window.location.href + res.Kakao.REDIRECT_ENDPOINT
        } else {
            REDIRECT_URI = window.location.href.replace(getEndpoint(window.location.href), res.Kakao.REDIRECT_ENDPOINT)
        }

        var _width = '550';
        var _height = '800';

        // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
        var _left = Math.ceil((window.screen.width - _width) / 2);
        var _top = Math.ceil((window.screen.height - _height) / 2);

        let kakaoAuth = window.open(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
            'kakao auth',
            'width=' + _width + ', height=' + _height + ', left=' + _left + ', top=' + _top);
    });
});