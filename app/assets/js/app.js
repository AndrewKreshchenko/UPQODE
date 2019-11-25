// Cache some variables
const path = document.getElementById('s-chain-path'), dot = document.getElementById('s-chain-point'), // Init chain path and point globally to speed up browser calculation
    players = document.querySelectorAll('[data-videoid]'),
    header = document.querySelector('header'), header_cl = 'header-top--colored';
var sl_curr_ind = 0, player, videos = new Array, paused = true; // Init varuables to control videos
    
/**
 * Scroll handlers
 */
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
                console.log('28: '+paused);
            }
        }, 500)
    })
}

var _scroll = function() {
    const sc = window.scrollY || window.pageYOffset, ww = window.innerWidth, wh = window.innerHeight;
    if (sc > wh-wh/4 && sc < wh*2) {
        //positionServicesPoint();
        //console.log('sc');
        if (!header.classList.contains(header_cl))
            header.classList.add(header_cl);
        
        if (!paused) {
            pauseVideos(todo => {
                console.log('44: '+todo.text);
            })
        }
        //document.querySelector('header').classList.contains += ' header-top--colored';
    }
    else if (sc > wh*2) {
        //console.log('onAfter');
    }
    else {
        //console.log('onVideo');
        if (header.classList.contains(header_cl))
            header.classList.remove(header_cl)
        //document.querySelector('header').classList -= ' header-top--colored';
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
    var ww = window.innerWidth, wh = window.innerHeight, video_dim = {};
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
    // Init a video on the first slide
    controlYTPlayer(0, false); // false - not after scroll event 

    // Navigation between slides
    for (const pagin of document.querySelectorAll('.b-slider-navigation a')) {
        pagin.addEventListener('click', function() {
            onChangeBannerSlide(this);
        })
    }
    for (const pagin of document.querySelectorAll('.b-slider-controls > button')) {
        pagin.addEventListener('click', function() {
            onChangeBannerSlide(this);
        })
    }
}

/**
 * Servies
 */
function buildServicesPath() {
    // Position Service connection path
    var services = document.getElementById('services'), path_ = document.getElementById('s-chain'),
        nodes = services.querySelectorAll('[data-node]'), node1_ch = nodes[0].firstElementChild,
        c_offset = services.querySelector('.container'), data = {};

    /*for (let i = 0; i < nodes.length; i++) {
        data[i].mtop = nodes[i].offsetTop;
    }*/
    data.C_shift = path_.parentElement.offsetHeight/1.5;
    data.inner_shift = node1_ch.offsetWidth;
    data.svg_width = c_offset.offsetWidth;
    data.svg_height = c_offset.offsetHeight;
    data.left_offset = path_.offsetLeft+data.inner_shift/4;

    path_.style.top = nodes[0].offsetTop;//+node1_ch.offsetTop+node1_ch.offsetHeight/1.5+'px';
    
    var svg_path = 'M'+data.left_offset+','+(data.inner_shift/2)+' C'+(data.svg_width-10)+','+(data.svg_height/2-data.C_shift)+' '+(data.svg_width-10)+','+(data.svg_height/2+data.C_shift)+' '+data.left_offset+','+(data.svg_height-data.inner_shift);
    
    var path_el = document.getElementById('s-chain-path');
    document.getElementById('s-chain').setAttribute('style', 'top: '+nodes[0].offsetTop+'px');
    path_el.setAttribute('d', svg_path);
    
    //var w_offset = (window.outerWidth-c_offset)/2;//path.style.left = nodes[0].offsetLeft/2+'px';
    //path_.style.width = c_offset.offsetWidth-node1_ch.offsetWidth*2+'px';

    // Draw SVG bezier curve based two bezier controls (C)
    //var svg_opened_tag = '<svg style="position: absolute;z-index: 12;left: -100px;" width="'+data.svg_width+'" height="'+data.svg_height+'" viewBox="0 0 '+data.svg_width+' '+data.svg_height+'">';
    // data.viewBox = '0 0 '+data.svg_width+' '+data.svg_height;
    // data.style='position: absolute;z-index: 12;left: -100px;width:'+data.svg_width+'px; height:'+data.svg_height+'px;';
    
    /*<svg viewBox="0 0 10 10" class="svg-6">
        <path d="M2,5 A 5 25 0 0 1 5 5" />
        <path d="M1,2 C8,2 8,8 1,9" />
    </svg>*/
    //var svg = document.createElement('svg');
    //svg.setAttribute('viewBox', data.viewBox);
    //svg.setAttribute('style', data.style);
    //var svg = svg_opened_tag+svg_path+'</svg>'
    //svg.setAttribute('class', 'b-slider-navigation');
    //svg.innerHTML = svg_path;
    //path_.appendChild(svg);
}

function moveToTeamSlide(el, is_next) {
    // if (is_next && document.getElementById('team-txt-next').className.contains('team__nav--endpoint'))
    //     return;
    // if (!is_next && document.getElementById('team-txt-prev').className.contains('team__nav--endpoint'))
    //     return;

    // Get index of current slide
    var form = document.getElementById('team-form'), fields = form.children, len = fields.length, // fields - fieldset tags
        checked_el = document.querySelector('[data-teamslide]'), ind = checked_el.dataset.teamslide;
    
    // No actions if clicked on endpoints
    if ((is_next && ind == len) || (!is_next && ind == 1))
        return;

    // Get indexes of next and prev and current slides
    is_next ? (ind < len ? ind++: ind = 1) : (ind > 1 ? ind--: ind = len);
    
    var ind_prev = ind-1, ind_next = ind+1; 
    ind_prev = ind_prev < 1 ? ind_prev = len: ind_prev--;
    ind_next = ind_next > len ? ind_next = 1: ind_next++;

    // Get Data of next or prev slide (some data of prev and next slide for navigation container from fieldset tags)
    var data = {}, dir = 'app/assets/img/team/';
    data.name = fields[ind-1].querySelector('[name="name"]').value;
    data.name_prev = fields[ind_prev-1].querySelector('[name="name"]').value;
    data.name_next = fields[ind_next-1].querySelector('[name="name"]').value;
    data.photo_path = dir+fields[ind-1].querySelector('[name="photo"]').value;
    data.photo_path_prev = dir+fields[ind_prev-1].querySelector('[name="photo"]').value;
    data.photo_path_next = dir+fields[ind_next-1].querySelector('[name="photo"]').value;
    //is_next ? data.photo_slide = fields[ind].querySelector('[name="photo"]').value : data.photo_slide = fields[ind].querySelector('[name="photo"]').value;
    data.position = fields[ind-1].querySelector('[name="position"]').value;
    data.desc = fields[ind-1].querySelector('[name="desc"]').innerHTML;
    
    // Change info on description
    var container = document.getElementById('team-item');
    container.classList.remove('c--showed');
    container.classList.add('c--hidden');
    container.querySelector('.team__item-title').innerText = data.name;
    container.querySelector('.team__item-position').innerText = data.position;
    container.querySelector('.team__item-description').innerText = data.desc;

    // Change info on navigation
    if (!isNaN(ind)) {
        let ph_nav_next = container.querySelector('#team-next-photo'), ph_nav_prev = container.querySelector('#team-prev-photo'),
            txt_nav_next = container.querySelector('#team-txt-next'), txt_nav_prev = container.querySelector('#team-txt-prev'),
            cl_end = 'team__nav--endpoint', cl_hide = 'c--hidden';
        if (ind == 1) {
            ph_nav_next.src = data.photo_path_next;
            ph_nav_prev.classList.add(cl_hide);
            txt_nav_prev.classList.add(cl_end);
        }
        else if (ind == len) {
            ph_nav_prev.src = data.photo_path_prev;
            ph_nav_next.classList.add(cl_hide);
            txt_nav_next.classList.add(cl_end);
        }
        else {
            ph_nav_next.src = data.photo_path_next;
            ph_nav_prev.src = data.photo_path_prev;
            if (txt_nav_next.classList.contains(cl_end))
                txt_nav_next.classList.remove(cl_end)
            if (txt_nav_prev.classList.contains(cl_end))
                txt_nav_prev.classList.remove(cl_end)
            if (ph_nav_next.classList.contains(cl_hide))
                ph_nav_next.classList.remove(cl_hide)
            if (ph_nav_prev.classList.contains(cl_hide))
                ph_nav_prev.classList.remove(cl_hide)
        }
    }
    container.classList.remove('c--hidden');
    container.classList.add('c--showed');

    // Change member content and slide
    let images = document.querySelectorAll('.team__slide-item img'),
        active_sl = document.querySelector('[name="team-slide"]:checked'),
        ind_sl = Array.prototype.indexOf.call(document.querySelectorAll('[name="team-slide"]'), active_sl);
    active_sl.checked = false;
    if (is_next) {
        if (ind_sl < images.length-1) {
            ind_sl = ind_sl+2;
            images[ind_sl-1].src = data.photo_path;
            document.getElementById('team-sel-'+ind_sl).checked = true;
        }
        else {
            ind_sl = 1;
            images[0].src = data.photo_path;
            document.getElementById('team-sel-1').checked = true;
        }
    }
    else {
        if (ind_sl > 0) {
            images[ind_sl-1].src = data.photo_path;
            document.getElementById('team-sel-'+ind_sl).checked = true;
        }
        else {
            ind_sl = images.length;
            images[ind_sl-1].src = data.photo_path;
            document.getElementById('team-sel-'+ind_sl).checked = true;
        }
    }
    // Change index
    checked_el.setAttribute('data-teamslide', ind);
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
        window.addEventListener('scroll', _scroll); // First listener of all after DOMContentLoaded completed
        buildServicesPath();

        document.querySelectorAll('nav li > a').forEach(link => {
            link.addEventListener('click', function() {
                //window.removeEventListener('scroll', _scroll, false);

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

        if (window.innerWidth < 768) {
            document.getElementById('c-info-more').addEventListener('click', function() {
                var el = document.getElementById('c-info-more').parentElement;
                if (!el.classList.contains('opened'))
                    el.classList.add('opened');
                this.classList.add('c--hidden');
                document.getElementById('c-info-less').classList.remove('c--hidden');
            });
            document.getElementById('c-info-less').addEventListener('click', function() {
                var el = document.getElementById('c-info-less').parentElement;
                if (el.classList.contains('opened'))
                    el.classList.remove('opened');
                this.classList.add('c--hidden');
                document.getElementById('c-info-more').classList.remove('c--hidden');
            });
        }
    }
});
