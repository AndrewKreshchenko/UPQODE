var map;

// Save map markers and locations in function
function getGoogleMapPins() {
    const pins = {
        markers: {
            loc: {
                icon: 'app/assets/img/contacts/marker.svg'
            },
            loc_state: {
                icon: 'app/assets/img/contacts/marker-state.svg',
            },
            loc_state_zoomed: {
                icon: {
                    url: 'app/assets/img/contacts/marker-state.svg'
                }
            }
        },
        features: [
            { // 271 Church St, New York, NY 10013, Сполучені Штати Америки
                position: new google.maps.LatLng(40.719064, -74.005032),
                type: 'loc_state',
                title: 'New York'
            },
            {
                position: new google.maps.LatLng(40.729800, -73.997906),
                type: 'loc',
                title: 'New York'
            },
            { // Financial District, Нью-Йорк, 10038, Сполучені Штати Америки
                position: new google.maps.LatLng(40.720951, -74.013960),
                type: 'loc',
                title: 'New York'
            },
            {
                position: new google.maps.LatLng(40.710737, -74.007521),
                type: 'loc',
                title: 'New York'
            },
            { // Los Angeles
                position: new google.maps.LatLng(33.6687794, -118.545),
                type: 'loc_state_zoomed',
                title: 'Los Angeles',
                center: {lat: 32.6687794,  lng: -118.545}
            },
            { // Detroit
                position: new google.maps.LatLng(42.560132, -83.3412119),
                type: 'loc_state_zoomed',
                title: 'Detroit'
            },
            { // Boston
                position: new google.maps.LatLng(42.3145186, -71.1103704),
                type: 'loc_state_zoomed',
                title: 'Boston'
            },
        ]
    }
    return pins;
}

function initMap() {
    var featureOpts = [{elementType:"geometry",stylers:[{color:"#f5f5f5"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#434343"}]},{featureType:"administrative.land_parcel",elementType:"labels.text.fill",stylers:[{color:"#bdbdbd"}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#eeeeee"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#e5e5e5"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#ffffff"}]},{featureType:"road.arterial",elementType:"labels.text.fill",stylers:[{color:"#757575"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#ebebeb"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#616161"}]},{featureType:"road.local",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]},{featureType:"transit.line",elementType:"geometry",stylers:[{color:"#e5e5e5"},{visibility:"off"}]},{featureType:"transit.station",elementType:"geometry",stylers:[{color:"#eeeeee"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#c9c9c9"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#88eaad"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#9e9e9e"}]}];
    //Create a styled map using the above featureOpts
    var styledMap = new google.maps.StyledMapType(featureOpts,{name: "Styled Map"}); 
    
    var mapProp = {
        center: {lat: 40.7108342, lng: -74.0044315},
        zoom: 14,
        disableDefaultUI: true, // remove controls
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("contacts-map"), mapProp);

    //Set the map to use the styled map
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
    
    //Create a marker pin to add to the map
    var locs = getGoogleMapPins().features;
    for (var i = 0; i < locs.length; i++) {
        var marker = new google.maps.Marker({
            position: locs[i].position,
            icon: getGoogleMapPins().markers[locs[i].type].icon,
            map: map,
            title: locs[i].title,
        })
    }
}

function changeLocation(el) {
    if (el.classList.contains('contacts__item--active'))
        return;

    // Get address from address link
    let contacts = document.getElementById('contacts'),
        active_cl = 'contacts__item--active';
        address = el.querySelector('.link').getAttribute('title'), address_substr = address.slice(0,4);
    
    if (!address_substr.length)
        return;

    // Change active city
    contacts.querySelector('.'+active_cl).classList.remove('contacts__item--active');
    let contacts_item = contacts.querySelector('address > [title^="'+address_substr+'"]').parentElement.parentElement;
    contacts_item.classList += ' '+active_cl;
    document.getElementById('c-schedule_weekdays').innerText = contacts_item.querySelector('[name="schedule_weekdays"]').value;
    document.getElementById('c-schedule_weekends').innerText = contacts_item.querySelector('[name="schedule_weekends"]').value;
    contacts.querySelectorAll('[data-item-address]').forEach(el => {
        el.innerText = address;
    })

    // Change Map location
    if (address_substr.length) {
        let features = getGoogleMapPins().features;
        var feature = features.find(obj => obj.title.startsWith(address_substr));
        var lat = feature.position.lat(), lng = feature.position.lng();
    }

    map.setCenter({
        lat: lat,
        lng: lng
    })
    map.setZoom(7);

    //var myLatlng = new google.maps.LatLng(lat-2, lng-2);
    //marker = [];
    
    marker = new google.maps.Marker({
        position: feature.position,
        icon: getGoogleMapPins().markers[feature.type].icon,
        map: map,
        title: feature.title,
    })
    console.log(feature.center, feature.position.lat(), feature.position.lng());
    if (typeof feature.center != 'undefined')
        map.setCenter(feature.center);

    // var myLatlng = new google.maps.LatLng(34.6687794, -120.645437);
    // var features = getGoogleMapPins();
    // marker = new google.maps.Marker({
    //     position: myLatlng,
    //     icon: {url: '../assets/img/contacts/marker-state.svg'},
    //     map: map
    // })
    //marker.setPosition(myLatlng);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('contacts').querySelectorAll('.contacts__item').forEach(address => {
        address.addEventListener('click', function() {
            changeLocation(this);
        })
    })
})
