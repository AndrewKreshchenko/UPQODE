/**
 * Scroll handlers
 */

const players = document.querySelectorAll('[data-videoid]'), ww = window.innerWidth, wh = window.innerHeight;
var sl_curr_ind = 0, player, videos = new Array, paused = true; // Init varuables to control videos
    path = document.getElementById('s-chain-path'), dot = document.getElementById('s-chain-point'); // Init chain path and point globally to speed up browser calculation 

function positionServicesPoint() {
    let k = (document.documentElement.scrollTop+document.body.scrollTop)/(document.documentElement.scrollHeight-document.documentElement.clientHeight),
        len = path.getTotalLength(), d = path.getPointAtLength(k*1.8*len);
    console.log(k);
    //dot.style.transform = 'translate('+ d.x + ',' + d.y + ')';
    dot.setAttribute('transform', 'translate('+d.x+','+d.y+')')
}

const pauseVideos = callback => {
    setTimeout(() => {
        callback ({
            pause: function () {
                videos.forEach(video => {
                    if (video.getPlayerState() == 1) {
                        video.pauseVideo();
                    }
                });
                paused = true;
            }
        }, 500)
    })
}

var scroll_ = {
    'onVideo': function(curr, next, cl) {
        console.log('onVideo');
        if (curr.classList.contains(cl))
            curr.classList.remove('header-top--colored')
    },
    'onServicesVis': function(curr, prev, cl) {
        if (!prev.classList.contains(cl))
            prev.classList += ' header-top--colored'
        
        if (!paused) {
            pauseVideos(todo => {
                console.log(todo.text);
            })
        }
        //positionServicesPoint();
        // && scrolled ? curr.classList += ' header-top--colored': false;
        //scrolled = false;
        //document.querySelector('header').classList -= ' header-top--colored';
        console.log('onServicesVis');
    },
    'onAfter': function(el) {
        console.log('onAfter');
    }
}

// Navigation
function scrollTo(el) {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: el.offsetTop
    });
}

function handleScroll() {
    const sc = window.scrollY || window.pageYOffset;
    //console.log((sc > wh+wh/2));
    //console.log(window.outerHeight);
    if (sc > wh+wh/2) {//positionServicesPoint();}
        document.querySelector('header').classList.contains += ' header-top--colored';
    }
    else {
        document.querySelector('header').classList -= ' header-top--colored';
    }
}

/**
 * Banner slider
 */
// Initialize Banner slider
var banner_slider = new TuinSlider('#b-slider', {
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

//https://www.youtube.com/watch?v=M7lc1UVf-VE

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
/*if(!window.YT)var YT={loading:0,loaded:0};if(!window.YTConfig)var YTConfig={host:"https://www.youtube.com"};YT.loading||(YT.loading=1,function(){var o=[];YT.ready=function(n){YT.loaded?n():o.push(n)},window.onYTReady=function(){YT.loaded=1;for(var n=0;n<o.length;n++)try{o[n]()}catch(i){}},YT.setConfig=function(o){for(var n in o)o.hasOwnProperty(n)&&(YTConfig[n]=o[n])}}());
if(this._skiped){
    this.a.contentWindow.postMessage(a,b[c]); 
}
this._skiped = true;*/

// On Ready Event
// NOTE: Have to set controls (such as setVolume) after 'onReady' event
function onYouTubePlayerReady(e) {
    e.target.unMute();
    e.target.setVolume(0);
    if (e.target.getPlayerState() == 5) {
        e.target.playVideo();
        paused = false;
    }
}

function onPlayerStateChange(e) {
    switch (e.data) {
        case YT.PlayerState.PLAYING:
            break;
        case YT.PlayerState.PAUSED:
            break;
        case YT.PlayerState.ENDED:
            console.log('ended '+e.divid);
            e.target.playVideo();
            paused = false;
            break;
    };
};

function controlYTPlayer(i, f) {
    // Take Control of all players
    videos.forEach(video => {
        if (video.getPlayerState() == 1) {
            console.log('playing');
            video.pauseVideo();
        }
        else if (video.getPlayerState() == 2) {
            console.log('paused');
            video.playVideo();
            paused = false;
            return;
        }
    });

    // If new video - initialize it
    var dim = recalcDimensionYTPlayer();
    const player = new YT.Player(players[i], {
        //showinfo: 0, // This parameter will be ignored (after September 25, 2018)
        height: dim.h,
        width: dim.w,
        videoId: players[i].dataset.videoid,
        loop: 1,
        events: {
            'onReady': onYouTubePlayerReady,
            'onStateChange': onPlayerStateChange,
        },
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            autohide: 1,
            showinfo: 0,
            controls: 0
        },
    });

    player.divid = players[i].getAttribute('id');
    videos.push(player);
}

function onChangeBannerSlide(obj) {
    if (obj.classList.contains('is-active'))
        return
    
    // Set index for next slide
    let ind, len = document.querySelectorAll('.b-slider-navigation li').length;
    if (typeof obj.dataset.index === 'undefined') {
        let prev_ind = document.querySelector('.b-slider-navigation .is-active').dataset.index;

        if (obj.classList == 'next')
            ind = prev_ind++ //prev_ind < len-1 ? ind = prev_ind++ : ind = 1;
        else if (obj.classList == 'previous')
            ind = prev_ind-- //prev_ind > 0 ? ind = prev_ind-- : ind = len-1;
        else {
            console.warn('Faild to Navigate to another slide. Classes of navigation elements might cause problems.');
            return;
        }
    }
    else 
        ind = obj.dataset.index;
    
    let arrows = document.querySelector('.b-slider-controls');
    ind == len-1 ? arrows.querySelector('.next').classList.add('endpoint')
        : (ind == 0 ? arrows.querySelector('.previous').classList.add('endpoint')
            : (arrows.querySelector('.endpoint') !== null ? arrows.querySelector('.endpoint').classList.remove('endpoint') : false))

    // if (arrows.querySelector('.endpoint') !== null )
    //     arrows.querySelector('.endpoint').classList.remove('endpoint');
    // if (ind == len-1)
    //     document.querySelector('.b-slider-controls .next').classList.add('endpoint');
    // else if (ind == 0)
    //     document.querySelector('.b-slider-controls .prev').classList.add('endpoint');

    // Apply changes to slide
    let cl = 'b-slider__item', slide = document.querySelectorAll('.'+cl)[ind];
    if (slide.querySelector('[data-videoid]') === null)
        slide.querySelector('.'+cl+'-bg').classList += ' '+cl+'-bg--static';
    else {
        let bg_el = slide.querySelector('.'+cl+'-bg');
        //bg_el.classList.contains(cl+'-bg--static') ? sbg_el.classList.remove(cl+'-bg--static') : false;
        controlYTPlayer(ind, false); // false - not after scroll event 
    }
}

function recalcDimensionYTPlayer() {
    var video_dim = {}; 
    if (ww > wh) {
        let expand = ww/wh*130;
        video_dim.w = ww + expand;
        video_dim.h = wh + 130;
    }
    else {
        //let k = video_ww      
    }
    return video_dim;
}

// Initialize Banner videos (after has finished downloading the JavaScript for the player API)
// NOTE: It would be better to keep track if onYouTubeIframeAPIReady() will be fired allways after banner slider initialisation
function onYouTubeIframeAPIReady() {
    // // Init a video on the first slide
    // controlYTPlayer(0, false); // false - not after scroll event 

    // // Navigation between slides
    // for (const pagin of document.querySelectorAll('.b-slider-navigation a')) {
    //     pagin.addEventListener('click', function() {
    //         onChangeBannerSlide(this);
    //     })
    // }
    // for (const pagin of document.querySelectorAll('.b-slider-controls > button')) {
    //     pagin.addEventListener('click', function() {
    //         onChangeBannerSlide(this);
    //     })
    // }
}

/**
 * Servies
 */
function buildServicesPath() {
    // Position Service connection path
    var services = document.getElementById('services'), path_ = document.getElementById('s-chain'),
        nodes = services.querySelectorAll('[data-node]'), node1_ch = nodes[0].firstElementChild,
        c_offset = services.querySelector('.container').offsetWidth;
    path_.style.top = nodes[0].offsetTop+node1_ch.offsetTop+node1_ch.offsetHeight/1.5+'px';
    //var w_offset = (window.outerWidth-c_offset)/2;//path.style.left = nodes[0].offsetLeft/2+'px';
    path_.style.width = c_offset-node1_ch.offsetWidth*2+'px';
}

function moveToTeamSlide(el, is_next) {
    // Get index of current slide
    var form = document.getElementById('team-form'), fields = form.children, len = fields.length, // fields - fieldset tags
        checked_el = document.querySelector('[name="team-slide"]:checked'), ind = checked_el.dataset.index;
    is_next ? (ind < len-1 ? ind++ : ind = 1) : (ind > 1 ? ind-- : ind = len-1);
    var ind_sl = ind;
    is_next ? (ind_sl < len-2 ? ind_sl += 2 : ind_sl = 1) : (ind_sl > 2 ? ind_sl -= 2 : ind_sl = len-1);
    console.log(ind+ ' ind');

    // Get Data of next or prev slide (some data of prev and next slide for navigation container from fieldset tags)
    var data = {};
    data.name = fields[ind-1].querySelector('[name="name"]').value;
    data.name_prev = fields[ind-2].querySelector('[name="name"]').value;
    data.name_next = fields[ind].querySelector('[name="name"]').value;
    data.photo_path = fields[ind-1].querySelector('[name="photo"]').value;
    data.photo_path_prev = fields[ind-2].querySelector('[name="photo"]').value;
    data.photo_path_next = fields[ind].querySelector('[name="photo"]').value;
    //is_next ? data.photo_slide = fields[ind].querySelector('[name="photo"]').value : data.photo_slide = fields[ind].querySelector('[name="photo"]').value;
    data.position = fields[ind-1].querySelector('[name="position"]').value;
    data.desc = fields[ind-1].querySelector('[name="desc"]').innerHTML;

    // let social = field.querySelector('[name="social"]').value;
    // data.social = social.split(',').map(function(item) {
    //     return item.trim();
    // });
    //var ind = el.parentNode('.team__nav');
    console.log(ind, data);

    // Change member content and slide
    var container = document.getElementById('team-item'), dir = '../assets/img/team/';
    
    // Change info on navigation
    
    
    container.classList.remove('c--showed');
    container.classList += ' c--hidden';
    container.querySelector('.team__item-title').innerText = data.name;
    container.querySelector('.team__item-position').innerText = data.position;
    container.querySelector('.team__item-description').innerText = data.desc;

    //container.querySelector('.team__nav_photo')

    //social.removeChild(social);
    // var socials = document.querySelectorAll('.team__item-social .link');
    // for (var soc of data.social) {
    //     console.log(soc);
    // }
    container.classList.remove('c--hidden');
    container.classList += ' c--showed'

    // Load image on banner
    checked_el.checked = false;
    if (document.getElementById('team-sel-'+ind) != null)
        document.getElementById('team-sel-'+ind).checked = true;
    else {
        is_next ? document.getElementById('team-sel-1').checked = true:
            document.getElementById('team-sel-'+(len-1)).checked = true
    }
}

/**
 * DOMContentLoaded
 */

// Actions after Page DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load the iFrame Player API code asynchronously.
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/player_api';
    let script_api = document.getElementsByTagName('script')[0];
    script_api.parentNode.insertBefore(tag, script_api);

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        buildServicesPath();
        //window.addEventListener('scroll', handleScroll);

        // const top_ = document.getElementById('b-slider');
        var header = document.querySelector('header'), header_cl = 'header-top--colored', services = document.getElementById('services');
        window.addEventListener('scroll', () => {
            const sc = window.scrollY || window.pageYOffset;
            //console.log((sc > wh+wh/2));
            //console.log(window.outerHeight);
            if (sc > wh-wh/4 && sc < wh*2) {//positionServicesPoint();}
                scroll_.onServicesVis(services, header, header_cl);
                //document.querySelector('header').classList.contains += ' header-top--colored';
            }
            else if (sc > wh*2) {
                scroll_.onAfter(services);
            }
            else {
                scroll_.onVideo(header, services, header_cl);
                //document.querySelector('header').classList -= ' header-top--colored';
            }
        });

        document.querySelectorAll('nav li > a').forEach(link => {
            link.addEventListener('click', function() {
                let id = this.getAttribute('href'); //window.removeEventListener('scroll');
                id == '#' ? scrollTo(document.querySelector('body')) : scrollTo(document.querySelector(id));
                
                if (this.classList.contains('link--header')) {
                    document.querySelector('.menu .active').classList.remove('active');
                    this.classList += ' active'
                }
                
                return false; // instead of prevetDefault
            });
        });

        document.querySelectorAll('.team__nav--next').forEach(sl => {
            sl.addEventListener('click', function() {
                moveToTeamSlide(this, true);
            });
        });
        document.querySelectorAll('.team__nav--prev').forEach(sl => {
            sl.addEventListener('click', function() {
                moveToTeamSlide(this, false);
            });
        });
    }
});
