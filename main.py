from fastapi import FastAPI
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import BaseModel
import requests

import json
from ytmusicapi import YTMusic
import yt_dlp

import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("./static/secret/adminKey.json")
firebase_admin.initialize_app(cred)

app = FastAPI(docs_url=None, redoc_url=None)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

def printdata():
    try:
        YTMusic_API = YTMusic(auth='oauth.json', language="ko")
        return YTMusic_API.get_playlist('RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM')
    except:
        print('error')
        YTMusic_API = YTMusic(auth='oauth.json', language="en")
        return  YTMusic_API.get_playlist('RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM')

def fetch_data(top: int, filename: str):
    # 플레이리스트의 노래 목록 가져오기
    try:
        YTMusic_API = YTMusic(auth='oauth.json', language="ko")
        playlist = YTMusic_API.get_playlist('PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m')
    except:
        print('error')
        YTMusic_API = YTMusic(auth='oauth.json', language="en")
        playlist = YTMusic_API.get_playlist('PL4fGSI1pDJn6jXS_Tv_N9B8Z0HTRVJE0m')

    result_dict = {}
    no = 1

    # 노래 목록 출력
    for track in playlist['tracks']:
        if no == top + 1:
            break
        else:
            try: 
                length = track['duration']
            except:
                length = ""
            if len(track['artists']) == 1:
                artists = track['artists'][0]['name']
            else:
                artists = ""
                for i in range(len(track['artists'])):
                    if i < len(track['artists']) - 1:
                        artists += track['artists'][i]['name'] + ", "
                    elif i == len(track['artists']) - 1:
                        artists += track['artists'][i]['name']
            result_dict[str(no)] = {
                'title': track['title'],
                'artist': artists,
                'album': track['album']['name'] if track['album'] is not None else "",
                'thumbnail': track['thumbnails'][-1]['url'],
                "length": length,
                "id": {
                    "video": track['videoId'],
                    "album": track['album']["id"] if track['album'] is not None else "",
                }
            }
        no += 1

    with open(f"static/{filename}.json", "w", encoding="utf-8") as f:
        json.dump(result_dict, f, indent=4, ensure_ascii=False)

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    return RedirectResponse("/")

@app.get('/fetch_data')
def fetchData():
    fetch_data(100, "top_chart")
    return RedirectResponse('topchart')

@app.get('/')
def main():
    fetch_data(5, "summary_chart")
    return FileResponse('./html/index.html')

@app.get('/topchart')
def topchart():
    return FileResponse('./html/top_chart.html')

@app.get('/search')
def search():
    return FileResponse('./html/search.html')

@app.get('/explore')
def explore():
    return FileResponse('./html/explore.html')

@app.get('/about')
def about():
    return FileResponse('./html/about.html')

class GetPlaylist(BaseModel):
    data: str

class GetListIndex(BaseModel):
    data: int

@app.post('/explore/cat01')
def get_list(requested_data: GetPlaylist):
    if requested_data.data == "playlist":
        YTMusic_API = YTMusic(auth='oauth.json', language="ko")
        playlists = [
            "RDCLAK5uy_l7wbVbkC-dG5fyEQQsBfjm_z3dLAhYyvo",
            "RDCLAK5uy_nMqMWmqwZwDvMcqcAohgO_Dp_7zT1nSC8",
            "RDCLAK5uy_m9ty3WvAucm7-5KsKdro9_HnocE8LSS9o",
            "RDCLAK5uy_kRRqnSpfrRZ9OJyTB2IE5WsAqYluG0uYo",
            "RDCLAK5uy_lYPvoz4gPFnKMw_BFojpMk7xRSIqVBkEE",
            "RDCLAK5uy_mjCKq8hnUQJqul0W6YW6x2Ep4P67jQ5Po",
            "RDCLAK5uy_lBfTSdVdgXeN399Mxt2L3C6hLarC1aaN0"
        ]

        data = {}

        for i in range(0, len(playlists)):
            data[str(i)] = YTMusic_API.get_playlist(playlists[i])
        
        return data

@app.post('/explore/list/cat01')
def get_music_list(requested_data: GetListIndex):
    playlists = [
        "RDCLAK5uy_l7wbVbkC-dG5fyEQQsBfjm_z3dLAhYyvo",
        "RDCLAK5uy_nMqMWmqwZwDvMcqcAohgO_Dp_7zT1nSC8",
        "RDCLAK5uy_m9ty3WvAucm7-5KsKdro9_HnocE8LSS9o",
        "RDCLAK5uy_kRRqnSpfrRZ9OJyTB2IE5WsAqYluG0uYo",
        "RDCLAK5uy_lYPvoz4gPFnKMw_BFojpMk7xRSIqVBkEE",
        "RDCLAK5uy_mjCKq8hnUQJqul0W6YW6x2Ep4P67jQ5Po",
        "RDCLAK5uy_lBfTSdVdgXeN399Mxt2L3C6hLarC1aaN0"
    ]

    YTMusic_API = YTMusic(auth='oauth.json', language="ko")
    return YTMusic_API.get_playlist(playlists[requested_data.data])

@app.post('/explore/cat02')
def get_list(requested_data: GetPlaylist):
    if requested_data.data == "playlist":
        YTMusic_API = YTMusic(auth='oauth.json', language="ko")
        playlists = [
            "RDCLAK5uy_lS4dqGRHszluFAbLsV-sHJCqULtBm2Gfw",
            "RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM",
            "RDCLAK5uy_nkjcHIQK0Hgf7ihU25uJc0CEokeGkSNxA",
            "RDCLAK5uy_mWqhoadUUp9crhEkmZZkdExj7YpBuFBEQ",
            "RDCLAK5uy_lN9xj1RQGmBltmvrzTVHMg-vyVt594KYU",
            "RDCLAK5uy_n0f4tLAkNM233wO0yiTEI7467ovnaGbR8",
            "RDCLAK5uy_lz175mC_wAtZHK0hbDqLrxb5J28QbUznQ",
            "RDCLAK5uy_mn7OLm9QvyB230t7RtLWt0BvUmFVlQ-Hc"
        ]

        data = {}

        for i in range(0, len(playlists)):
            data[str(i)] = YTMusic_API.get_playlist(playlists[i])
        
        return data

@app.post('/explore/list/cat02')
def get_music_list(requested_data: GetListIndex):
    playlists = [
        "RDCLAK5uy_lS4dqGRHszluFAbLsV-sHJCqULtBm2Gfw",
        "RDCLAK5uy_mVBAam6Saaqa_DeJRxGkawqqxwPTBrGXM",
        "RDCLAK5uy_nkjcHIQK0Hgf7ihU25uJc0CEokeGkSNxA",
        "RDCLAK5uy_mWqhoadUUp9crhEkmZZkdExj7YpBuFBEQ",
        "RDCLAK5uy_lN9xj1RQGmBltmvrzTVHMg-vyVt594KYU",
        "RDCLAK5uy_n0f4tLAkNM233wO0yiTEI7467ovnaGbR8",
        "RDCLAK5uy_lz175mC_wAtZHK0hbDqLrxb5J28QbUznQ",
        "RDCLAK5uy_mn7OLm9QvyB230t7RtLWt0BvUmFVlQ-Hc"
    ]

    YTMusic_API = YTMusic(auth='oauth.json', language="ko")
    return YTMusic_API.get_playlist(playlists[requested_data.data])

class SearchRequest(BaseModel):
    query: str
    filter: str

@app.post('/search')
def search(search_request: SearchRequest):
    query = search_request.query
    filter = search_request.filter
    # 이후 검색 로직을 구현하고 결과를 반환합니다.
    try:
        YTMusic_API = YTMusic(auth='oauth.json', language="ko")
        search_engine = YTMusic_API.search(query=query, filter=filter, limit=50)
    except:
        YTMusic_API = YTMusic(auth='oauth.json', language="en")
        search_engine = YTMusic_API.search(query=query, filter=filter, limit=50)
    return search_engine

@app.get('/webPlayer')
def webPlayer():
    return FileResponse('./html/webPlayer.html')

class get_live_stream(BaseModel):
    id: str
    
@app.post('/webPlayer/getData')
def get_live_stream(requested_: get_live_stream):
    id = requested_.id
    video_url = 'https://www.youtube.com/watch?v={}'.format(requested_.id)

    # yt_dlp 인스턴스 생성
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    ydl = yt_dlp.YoutubeDL(ydl_opts)

    # 스트림 정보 가져오기
    info_dict = ydl.extract_info(video_url, download=False)
    stream_url = info_dict['url']

    print(f"Stream URL: {stream_url}")
    return stream_url

class get_lyrics(BaseModel):
    videoId: str
    
@app.post('/lyrics')
def get_lyrics(songData: get_lyrics):
    try:
        YTMusic_API = YTMusic(auth='oauth.json', language="ko")
        try:
            return YTMusic_API.get_lyrics(browseId=str(YTMusic_API.get_watch_playlist(videoId=songData.videoId)['lyrics']))['lyrics']
        except:
            return "there's no lyrics"
    except:
        print('error')
        YTMusic_API = YTMusic(auth='oauth.json', language="en")
        try:
            return YTMusic_API.get_lyrics(browseId=str(YTMusic_API.get_watch_playlist(videoId=songData.videoId)['lyrics']))['lyrics']
        except:
            return "there's no lyrics"

@app.get('/register')
def register():
    return FileResponse('./html/register.html')

@app.get('/privacypolicy')
def register():
    return FileResponse('./html/privacypolicy.html')

@app.get('/termsofservice')
def register():
    return FileResponse('./html/termsofservice.html')

class checkUser(BaseModel):
    email: str

@app.post('/auth/user')
def check_user(email: checkUser):
    try:
        user = auth.get_user_by_email(email.email)
        result = {
            'exist': True,
            'verified': user.email_verified
        }
        return result
    except:
        result = {
            'exist': False,
            'verified': False
        }
        return result
    
@app.get('/auth/kakao')
def kakao_auth():
    return FileResponse('./html/auth/kakao/kakaoLogin.html')

@app.get('/auth/kakao/logout')
def kakao_auth():
    return FileResponse('./html/auth/kakao/kakaoLogout.html')

class data(BaseModel):
    t: str

@app.post('/auth/kakao/userData')
def kakaoAuth_load_user_data(res: data):
    # 엑세스 토큰과 API 엔드포인트 URL을 설정합니다.
    access_token = res.t,
    api_url = 'https://kapi.kakao.com/v2/user/me'  # 카카오 사용자 정보 가져오기 엔드포인트 URL

    # HTTP 요청을 보냅니다.
    response = requests.get(api_url, headers={'Authorization': f'Bearer {access_token}'})

    # HTTP 응답을 처리합니다.
    if response.status_code == 200:
        user_info = response.json()  # 응답 데이터를 JSON 형식으로 파싱
        return user_info
    else:
        return "안되는데용"
    
@app.get('/myPage')
def myPage():
    return FileResponse('./html/myPage.html')