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
    arrows: true,
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

// Banner slider vaiables
const b_players = document.querySelectorAll('[data-videoid]');
var b_videos = new Array, sl_curr_ind = 0, b_player;

//https://www.youtube.com/watch?v=M7lc1UVf-VE

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
/*if(!window.YT)var YT={loading:0,loaded:0};if(!window.YTConfig)var YTConfig={host:"https://www.youtube.com"};YT.loading||(YT.loading=1,function(){var o=[];YT.ready=function(n){YT.loaded?n():o.push(n)},window.onYTReady=function(){YT.loaded=1;for(var n=0;n<o.length;n++)try{o[n]()}catch(i){}},YT.setConfig=function(o){for(var n in o)o.hasOwnProperty(n)&&(YTConfig[n]=o[n])}}());
if(this._skiped){
    this.a.contentWindow.postMessage(a,b[c]); 
}
this._skiped = true;*/

/**
 * Banner slider
 */
function controlBSliderVideos(ind) {
    b_videos.forEach(video => {
        video.pauseVideo();
    });

    b_videos[ind].setVolume(0);
    b_videos[ind].playVideo();
}

function onYouTubeIframeAPIReady() {
    b_pagin = document.querySelectorAll('.b-slider-navigation a');
    
    // Navigation between slides
    for (const pagin of b_pagin) {
        pagin.addEventListener('click', function(e) {
            moveToBSlide(this, '.b-slider__item', '#sl-video-');
        })
    }

    // Initialize all videos of banner slider
    Array.from(b_players).forEach(video => {
        // Construct new player on banner slider
        const player = new YT.Player(video.id, { // Targeting video by his random id attribute
            height: window.innerHeight,
            width: window.innerWidth,
            videoId: video.dataset.videoid,
            loop: 1,
            //showinfo: 0, // This parameter will be ignored (after September 25, 2018)
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                autohide: 1,
                showinfo: 0,
                controls: 0
            },
        });
        // Save video id in custom property so we can easily find him later
        player.id = video.id;
        //player.setVolume(0);
        
        // Push YT video object to array for future use
        b_videos.push(player);

        // Play video only of first slide
        controlBSliderVideos(0);
    });
    console.log(b_videos);
}

function moveToBSlide(el, cl_slide, v_prefix) {
    var b_players = document.querySelectorAll(cl_slide), ind = parseInt(el.getAttribute('data-index'));
    //startVideo();
    
    // If slide has no video
    if (typeof b_players[ind] === null) //slide[ind].querySelector(v_prefix+ind).pauseVideo();
        return;
    else {
        controlBSliderVideos(ind);
        //var video = slide[ind].querySelector(v_prefix+ind), video_id = video.getAttribute('data-videoid');
        //console.log(video, video_id);
        //b_player.setVolume(0);
        /*function onYouTubePlayerAPIReady() {
            player = new YT.Player('player', {
                height: '360',
                width: '640',
                videoId: 'M7lc1UVf-VE'
            });
        }*/
    }
}

function connectServicesVisual(node1, node2, path) {
    var n1_child = node1.firstElementChild;
    path.style.top = node1.offsetTop+n1_child.offsetTop+n1_child.offsetHeight/4+'px';
    path.style.left = node1.offsetLeft/2+'px';
    debugger;
}

//(function() {
    // Generate services visual connection
    connectServicesVisual(document.getElementById('s-node-first'), document.getElementById('s-node-last'), document.getElementById('s-chain'));
//})
 
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
