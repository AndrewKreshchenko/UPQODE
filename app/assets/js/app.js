// Cache some variables
const path = document.getElementById('s-chain-path'), dot = document.getElementById('s-chain-circle'), // Init chain path and point globally to speed up browser calculation
    players = document.querySelectorAll('[data-videoid]'),
    header = document.querySelector('header'), header_cl = 'header-top--colored';
var sl_curr_ind = 0, player, videos = new Array, paused = true; // Init varuables to control videos
var scale_k, trackPoints = [];


/**
 * Scroll handlers
 */
function getCurrentLength() {
  let centreY = window.innerHeight / 2;
  let trackBounds = () => path.getBoundingClientRect();
  let currentY = centreY - trackBounds.y;
  if (currentY < 0) return 0;
  
  // if currentY is greater that track height, that means the user has scrolled pass the track (and the whole svg) in such case the animation should be completed i.e. the head should be at the final position i.e. at totalLength 
  if (currentY > trackBounds.height) {
      return totalLength;
  }
  
  for (let point of trackPoints) {
    if (point.y >= currentY) {
        return point.length;
    }
  }

  return totalLength;
}
function setScaleFactor() {
    scale_k = document.getElementById('services__chain-path').getBoundingClientRect().width;
}

function setTrackPoints() {
  let divisions = 500, len = path.getTotalLength();
  let unitLength = len/divisions;
  trackPoints = [];
  for (let i = 0; i < divisions; i++) {
    let length = unitLength * i;
    let {x,y} = path.getPointAtLength(length);
    trackPoints.push({x: x, y: y, length});
  }
}

function getCurrentLength() {
    let centreY = window.innerHeight/2;
    let trackBounds = path.getBoundingClientRect();
    let currentY = centreY - trackBounds.y;
    if (currentY < 0)
        return 0;
    // if currentY is greater that track height, that means the user has scrolled pass the track (and the whole svg) in such case the animation should be completed i.e. the head should be at the final position i.e. at totalLength 
    if (currentY > trackBounds.height) {
      return path.getTotalLength();
    }
    for (let p of trackPoints) {
        if (p.y >= currentY) {
            return p.length;
        }
    }
    return path.getTotalLength();
}

function positionServicesPoint() {
    let len = getCurrentLength();
    d = path.getPointAtLength(len);
    dot.setAttribute('cx', d.x);
    dot.setAttribute('cy', d.y);
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

var _scroll = function() {
    const sc = window.scrollY || window.pageYOffset, wh = window.innerHeight;
    if (sc > wh-wh/4 && sc < wh*2) {
        positionServicesPoint();
        if (!header.classList.contains(header_cl))
            header.classList.add(header_cl);
        //if (!paused) {pauseVideos(todo => {})}
    }
    else if (sc < wh-wh/4) {
        if (header.classList.contains(header_cl))
            header.classList.remove(header_cl)
    }
}
// mobile scroll
var _mscroll = function() {
    const sc = window.scrollY || window.pageYOffset, wh = window.innerHeight;
    if (sc > wh-wh/4 && sc < wh*2) {
        if (!header.classList.contains(header_cl))
            header.classList.add(header_cl);
    }
    else if (sc < wh-wh/4) {
        if (header.classList.contains(header_cl))
            header.classList.remove(header_cl)
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
    let el = document.getElementById(e.target.divid).parentElement.children[0], cl = 'b-slider__item-bg--static'
    switch (e.data) {
        case (1):
            el.classList.contains(cl) ? el.classList.remove(cl) : false;
        case YT.PlayerState.PLAYING:
            break;
        case YT.PlayerState.PAUSED:
            break;
        case YT.PlayerState.ENDED:
            e.target.playVideo();
            paused = false;
            break;
    };
};

function controlYTPlayer(i, f) {
    // Take Control of all players
    videos.forEach(video => {
        if (video.getPlayerState() == 1) {
            video.pauseVideo();
        }
        else if (video.getPlayerState() == 2) {
            video.playVideo();
            paused = false;
            return;
        }
    });
    if (f)
        return;

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
    // Set index for next slide
    let ind = obj.dataset.index, len = document.querySelectorAll('.b-slider-navigation li').length;
    
    // If arrow btn was clicked
    if (typeof obj.dataset.index === 'undefined') {
        let prev_ind = document.querySelector('.b-slider-navigation .is-active').dataset.index;
        if (obj.classList == 'next')
            ind = prev_ind++
        else if (obj.classList == 'previous')
            ind = prev_ind--
        else {
            console.warn('Faild to Navigate to another slide.');
            return;
        }
    }

    // Check if video for the slide was already initialized
    if (document.querySelectorAll('[data-videoid]')[ind].tagName == 'IFRAME') {
        controlYTPlayer(ind, true); // false - if video was already initialized for this div
        return;
    }
    
    let arrows = document.querySelector('.b-slider-controls');
    ind == len-1 ? arrows.querySelector('.next').classList.add('endpoint')
        : (ind == 0 ? arrows.querySelector('.previous').classList.add('endpoint')
            : (arrows.querySelector('.endpoint') !== null ? arrows.querySelector('.endpoint').classList.remove('endpoint') : false))

    // Apply changes to slide
    let cl = 'b-slider__item', slide = document.querySelectorAll('.'+cl)[ind];
    if (slide.querySelector('[data-videoid]') === null)
        slide.querySelector('.'+cl+'-bg').classList += ' '+cl+'-bg--static';
    else
        controlYTPlayer(ind, false); // false - if video wasn't initialized for this div 
}

function recalcDimensionYTPlayer() {
    var ww = window.innerWidth, wh = window.innerHeight, video_dim = {};
    let expand = ww/wh*130;
        video_dim.w = ww + expand;
        video_dim.h = wh + 130;
    //if (ww > wh) {}
    return video_dim;
}

// Initialize Banner videos (after has finished downloading the JavaScript for the player API)
// NOTE: It would be better to keep track if onYouTubeIframeAPIReady() will be fired allways after banner slider initialisation
function onYouTubeIframeAPIReady() {
    // Init a video on the first slide
    if (window.innerWidth < 768) {
        document.querySelectorAll('.b-slider__item-wrapper').forEach(el => {
            el.classList += ' b-slider__item-bg--static';
        })
        return;
    }

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
        nodes = services.querySelectorAll('[data-node]'), node1_ch = nodes[0].querySelector('img'),
        c_offset = services.querySelector('.container'), data = {},
        path_el = document.getElementById('s-chain-path');

    data.C_shift = path_.parentElement.offsetHeight/1.5;
    data.inner_shift = node1_ch.offsetWidth;
    data.left_offset = (path_.offsetWidth-c_offset.offsetWidth)/2;
    data.svg_width = c_offset.offsetWidth;
    data.svg_height = c_offset.offsetHeight;

    path_el.parentElement.parentElement.setAttribute('style', 'top: '+nodes[0].offsetTop+'px');
    
    var svg_path = 'M'+(data.left_offset+data.inner_shift/2)+','+data.inner_shift/2+' C'+(data.svg_width-10)+','+(data.svg_height/2-data.C_shift)+' '+(data.svg_width-10)+','+(data.svg_height/2+data.C_shift)+' '+(data.left_offset+data.inner_shift/2)+','+(data.svg_height-data.inner_shift/2);
    
    path_el.parentElement.setAttribute('viewBox', '0 0 '+(data.svg_width+data.inner_shift/2)+' '+data.svg_height);
    path_el.parentElement.setAttribute('width', (data.svg_width+data.inner_shift/2)+'px');
    path_el.parentElement.setAttribute('height', data.svg_height+'px');
    path_el.setAttribute('d', svg_path);

    dot.style.top = data.inner_shift/2+'px';
    dot.style.left = (data.left_offset+data.inner_shift/2)+'px';
}

function moveToTeamSlide(el, is_next) {
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
        // First listener of all after DOMContentLoaded completed
        if (window.innerWidth > 767) {
            buildServicesPath();
            setScaleFactor();
            setTrackPoints();
            window.addEventListener('scroll', _scroll);
        }
        else
            window.addEventListener('scroll', _mscroll);

        document.querySelectorAll('nav li > a').forEach(link => {
            link.addEventListener('click', function() {
                let el = document.querySelector('.header-top'), id = this.getAttribute('href');
                if (id == '#') {
                    scrollTo(document.querySelector('body'));
                    if (el.classList.contains(header_cl))
                        el.classList.remove(header_cl);
                }
                else {
                    scrollTo(document.querySelector(id));
                    if (!el.classList.contains(header_cl))
                        el.classList.add(header_cl);
                }
                
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
            let header_top = document.querySelector('.header-top');
            header_top.classList.add('header-top--mob');
            document.getElementById('hmenu-toggler').addEventListener('click', function() {
                header_top.classList.toggle('opened');
            });
            document.getElementById('c-info-more').addEventListener('click', function() {
                var el = document.getElementById('c-info-more').parentElement;
                if (!el.classList.contains('opened'))
                    el.classList.add('opened');
                this.classList.add('c--hidden');
                document.getElementById('c-info-less').classList.remove('c--hidden');
            });
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