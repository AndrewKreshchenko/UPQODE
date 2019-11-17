var mySlider = new TuinSlider("#b-slider",{
    // slider selector
    selector: '.b-slider',

    // Greensock options
    ease: 'SlowMo',
    easeType: 'easeOut',
    duration: 1,

    // pagination & navigation controls
    nextHtml: '>',
    prevHtml: '<',
    paginationHtml: '',
    arrows: false,
    keyboard: true,
    //pagination: true,

    // callback functions
    onLeave: null,
    afterLoad: null
});

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var slide_ind = 0;
var b_player;

//https://www.youtube.com/watch?v=M7lc1UVf-VE

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
/*if(!window.YT)var YT={loading:0,loaded:0};if(!window.YTConfig)var YTConfig={host:"https://www.youtube.com"};YT.loading||(YT.loading=1,function(){var o=[];YT.ready=function(n){YT.loaded?n():o.push(n)},window.onYTReady=function(){YT.loaded=1;for(var n=0;n<o.length;n++)try{o[n]()}catch(i){}},YT.setConfig=function(o){for(var n in o)o.hasOwnProperty(n)&&(YTConfig[n]=o[n])}}());
if(this._skiped){
    this.a.contentWindow.postMessage(a,b[c]); 
}
this._skiped = true;*/

function onYouTubeIframeAPIReady() {
    // Banner slider
    const b_pagination = document.querySelectorAll('.b-slider-navigation a');
    for (const b_pagin of b_pagination) {
        b_pagin.addEventListener('click', function(e) {
            controlBSliderVideos(this, '.b-slider__item', '#sl-video-');
        })
    }
}

function controlBSliderVideos(el, cl_slide, v_prefix) {
    var slide = document.querySelectorAll(cl_slide), ind = parseInt(el.getAttribute('data-index'));
    //startVideo();
    
    b_player.pauseVideo();
    if (typeof slide[ind].querySelector(v_prefix+ind) === null) {
        slide[ind].querySelector(v_prefix+ind).pauseVideo();
        return;
    }
    else {
        var video = slide[ind].querySelector(v_prefix+ind), video_id = video.getAttribute('data-video-id');
        console.log(video, video_id);

        b_player = new YT.Player(video, {
            height: window.innerHeight,
            width: window.innerWidth,
            videoId: video_id,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                autohide: 1,
                showinfo: 0,
                controls: 0,
                setVolume: 0
            }
        });
        /*function onYouTubePlayerAPIReady() {
            player = new YT.Player('player', {
                height: '360',
                width: '640',
                videoId: 'M7lc1UVf-VE'
            });
        }*/
    }
}
 
/*function createVideo(video) {
    var youtubeScriptId = 'youtube-api';
    var youtubeScript = document.getElementById(youtubeScriptId);
    var videoId = video.getAttribute('data-video-id');

    if (youtubeScript === null) {
        var tag = document.createElement('script');
        var firstScript = document.getElementsByTagName('script')[0];

        tag.src = 'https://www.youtube.com/iframe_api';
        tag.id = youtubeScriptId;
        firstScript.parentNode.insertBefore(tag, firstScript);
    }

    window.onYouTubeIframeAPIReady = function() {
        window.player = new window.YT.Player(video, {
        videoId: videoId,
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0
        }
        });
    }
}*/

// 4. The API will call this function when the video player is ready.
function onPlayerReady(e) {
    e.target.setVolume(0);
  e.target.playVideo();
  console.log('fired');
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(e) {
    console.log('fired');
  if (e.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
    console.log('fired');
  player.stopVideo();
}