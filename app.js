'use strict'

$('.js-header').prop('hidden', false);
$('.js-search-form').prop('hidden', false);

const STATE = {           //declare object to store data retrieved by API calls
  venueSearch: null,
  venuePhotos: null,
  query: null,
};

let counter = 0;        //declare counter for rendering details buttons

function getVenueSearchDataFromApi(searchTerm) {  //retreive venue search data/update STATE object
  STATE.query = searchTerm;                       //store search term in STATE object
  const venueSearchEndpoint = 'https://api.foursquare.com/v2/venues/search'; 
  
  const settings = {                               //parameters for API call
    url: venueSearchEndpoint,
    data: {
      near: `${searchTerm}`,
      v: '20181018',
      client_id: 'P0MLS2UIEUF3FNS21HRUR3HYUPBVRYZ2QR2QTXH1WXR5YKE4',
      client_secret: 'RWKFIU2OXR4TD2IJGEOWXUOFTW3ZMOPFAV4HGKHHNMCIIV2Q',
      categoryId: '4bf58dd8d48988d1e2941735',
      query: 'beach',
      limit: 10
    },
    dataType: 'json',
    type: 'GET'
  };

  $.ajax(settings).then((results) => {        //api call
    STATE.venueSearch = results.response;     //store results in STATE object
    displayVenueSearchData();
  });

  counter = 0;          //reset counter
  console.log(STATE);   //test to see what current value of STATE is
}

function getVenuePhotosFromApi(venueId, name, address) { //retreive venue photo data/update STATE object
  const venuePhotosEndpoint = `https://api.foursquare.com/v2/venues/${venueId}/photos`;

  const settings = {                 //paramters for API call
    url: venuePhotosEndpoint,
    data: {
      v: '20181018',
      client_id: 'P0MLS2UIEUF3FNS21HRUR3HYUPBVRYZ2QR2QTXH1WXR5YKE4',
      client_secret: 'RWKFIU2OXR4TD2IJGEOWXUOFTW3ZMOPFAV4HGKHHNMCIIV2Q',
      limit: 10
    },
    dataType: 'json',
    type: 'GET'
  };
  
  $.ajax(settings).then((results) => {      //API call
    STATE.venuePhotos = results.response;   //store results in STATE object
    displayVenuePhotos(name, address);     //call function - pass in name & address parameters from API call
  });
}

function displayVenueSearchData() {       //pass results through the HTML rendering function
    const results = STATE.venueSearch.venues.map((item) => renderVenueSearchResults(item));
    $('.js-results').html(results);              //display data in HTML section
    $('.js-results').prop('hidden', false);      //remove hidden attribute from HTML section
}

function displayVenuePhotos(name, address) {    //pass results through the HTML rendering function
  const photos = STATE.venuePhotos.photos.items.map((item) => renderVenuePhotos(item)).join('');
  $('.js-results').html(`<h2>${name}</h2><h3>${address}</h3>${photos}
  <div><button class="js-back-btn">Back to results</button></div>`);    //display data in HTML section
}

function renderVenueSearchResults(result) {   //HTML template for each venue search result
  const name = result.name;
  const address = result.location.formattedAddress.join(', ');
  counter++;
  return `
  <div>
    <h2>${name}</h2>
    <h3>${address}</h3>
    <button class="js-details-btn-${counter}">Details</button>
  </div>
  <br>
  `
}

function renderVenuePhotos(result) {  //HTML template for each venue photo
  const prefix = result.prefix;
  const suffix = result.suffix;
  const size = '300x300'
  return `
  <div>
    <img src="${prefix}${size}${suffix}" alt="Beach photo">
  </div>
  `
}

function submitVenueSearch() {              //listen for user submit
  $('.js-search-form').on('submit', function(event) {
    event.preventDefault();
    const userInput = $('.js-input').val();  //get user input
    if (userInput.length <= 0) {
      $('.js-results').html('Please enter a valid postal code');
      $('.js-results').prop('hidden', false);      //remove hidden attribute from HTML section
    } else {
      $('.js-input').val("");
      getVenueSearchDataFromApi(userInput);   //run API call - pass in user input
    }
  });
}

function submitVenue1DetailsButton() {       //listen for user click
  $('body').on('click', '.js-details-btn-1', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[0].id;
    const name = STATE.venueSearch.venues[0].name;
    const address = STATE.venueSearch.venues[0].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);  //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);      //test to see what current value of STATE is
  });
}
  
function submitVenue2DetailsButton() {        //listen for user click
  $('body').on('click', '.js-details-btn-2', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[1].id;
    const name = STATE.venueSearch.venues[1].name;
    const address = STATE.venueSearch.venues[1].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);     //test to see what current value of STATE is
  });
}

function submitVenue3DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-3', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[2].id;
    const name = STATE.venueSearch.venues[2].name;
    const address = STATE.venueSearch.venues[2].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);    //test to see what current value of STATE is
  });
}

function submitVenue4DetailsButton() {      //listen for user click
  $('body').on('click', '.js-details-btn-4', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[3].id;
    const name = STATE.venueSearch.venues[3].name;
    const address = STATE.venueSearch.venues[3].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);    //test to see what current value of STATE is
  });
}

function submitVenue5DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-5', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[4].id;
    const name = STATE.venueSearch.venues[4].name;
    const address = STATE.venueSearch.venues[4].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);     //test to see what current value of STATE is
  });
}

function submitVenue6DetailsButton() {   //listen for user click
  $('body').on('click', '.js-details-btn-6', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[5].id;
    const name = STATE.venueSearch.venues[5].name;
    const address = STATE.venueSearch.venues[5].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);    //test to see what current value of STATE is
  });
}

function submitVenue7DetailsButton() {   //listen for user click
  $('body').on('click', '.js-details-btn-7', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[6].id;
    const name = STATE.venueSearch.venues[6].name;
    const address = STATE.venueSearch.venues[6].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);     //test to see what current value of STATE is
  });
}

function submitVenue8DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-8', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[7].id;
    const name = STATE.venueSearch.venues[7].name;
    const address = STATE.venueSearch.venues[7].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);      //test to see what current value of STATE is
  });
}

function submitVenue9DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-9', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[8].id;
    const name = STATE.venueSearch.venues[8].name;
    const address = STATE.venueSearch.venues[8].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);

    console.log(STATE);     //test to see what current value of STATE is
  });
}

function submitVenue10DetailsButton() {   //listen for user click
  $('body').on('click', '.js-details-btn-10', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[9].id;
    const name = STATE.venueSearch.venues[9].name;
    const address = STATE.venueSearch.venues[9].location.formattedAddress.join(', ');
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    $('.js-header').prop('hidden', true);
    $('.js-search-form').prop('hidden', true);
      
    console.log(STATE);   //test to see what current value of STATE is
  });
}

function submitBackButton() {        //listen for user click
  $('body').on('click', '.js-back-btn', function(event) {
    event.preventDefault();
    getVenueSearchDataFromApi(STATE.query);  //run API call - pass in query from STATE object
    $('.js-header').prop('hidden', false);
    $('.js-search-form').prop('hidden', false);
  })
}

function handleBeachBum() {   //document ready functions
  submitVenueSearch();             
  submitVenue1DetailsButton();
  submitVenue2DetailsButton();
  submitVenue3DetailsButton();
  submitVenue4DetailsButton();
  submitVenue5DetailsButton();
  submitVenue6DetailsButton();
  submitVenue7DetailsButton();
  submitVenue8DetailsButton();
  submitVenue9DetailsButton();
  submitVenue10DetailsButton();
  submitBackButton();
}
  $(handleBeachBum);       //call document ready function