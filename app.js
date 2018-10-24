'use strict'

$('.js-search-form').prop('hidden', false);  //toggle hidden attribute from HTML section

const STATE = {           //declare object to store data retrieved by API calls
  venueSearch: null,
  venuePhotos: null,
  venueWeather: null,
  postalCode: null,
};

let counter = 0;        //declare counter for rendering details buttons

function getVenueSearchDataFromApi(searchTerm) {  //retreive venue search data/update STATE object
  STATE.postalCode = searchTerm;                       //store search term in STATE object
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
    displayVenueSearchData();                  //call display function
    $('.js-search-form').prop('hidden', false);   //toggle hidden attribute from HTML section
    $('.js-message').prop('hidden', true);
  }).catch(showError);

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
    displayVenuePhotos(name, address);      //call display function - pass in name & address parameters from API call
    $('.js-search-form').prop('hidden', true);  //toggle hidden attribute from HTML section
    $('.js-message').prop('hidden', true);
  }).catch(showError);
}

function getVenueWeatherFromApi(venuePostalCode = STATE.postalCode) {  //reteive weather data/update STATE object
  const venueWeatherEndpoint = 'https://api.weatherbit.io/v2.0/forecast/daily';

  const settings = {                //parameters for API call
    url: venueWeatherEndpoint,
    data: {
      key: '0a4e350d938e4737979ee5d05f620a49',
      lang: 'en',
      postal_code: `${venuePostalCode}`,
      units: 'I',
      days: 5
    },
    dataType: 'json',
    type: 'GET'
  };

  $.ajax(settings).then((results) => {   //API call
    STATE.venueWeather = results.data;   //store results in STATE object
    displayVenueWeatherData();          //call display function
  }).catch(showError); 

  console.log(STATE);   //test to see what current value of STATE is
}

function displayVenueSearchData() {       //pass results through the HTML rendering function
    const results = STATE.venueSearch.venues.map((item) => renderVenueSearchData(item));
    $('.js-results').html(results);              //display data in HTML section
    $('.js-results').prop('hidden', false);      //toggle hidden attribute from HTML section
}

function displayVenuePhotos(name, address) {    //pass results through the HTML rendering function
  const photos = STATE.venuePhotos.photos.items.map((item) => renderVenuePhotos(item)).join('');
  const photosHtml = `
  <div>
    <h2>${name}</h2>
    <h3>${address}</h3>
    <div>
      ${photos}
    </div>
    <button class="js-back-btn">Back to results</button>
  </div>`;

  $('.js-results').html(photosHtml);    //display data in HTML section
}

function displayVenueWeatherData() {
  const weather = STATE.venueWeather.map((item) => renderVenueWeatherData(item)).join('');
  const weatherHtml = `
  <div class="weather">
  ${weather}
  </div> 
  `;

  $('.js-back-btn').before(weatherHtml);
}

function renderVenueWeatherData(day) {
  const description = day.weather.description;
  const iconCode = day.weather.icon;
  const highTemp = day.max_temp;
  const lowTemp = day.min_temp;
  const date = day.valid_date;
  return `
  <div class="day">
    <h3>${date}</h3>
    <img src="images/icons/${iconCode}.png" alt="Weather icon">
    <p>${description}</p>
    <p>High temp: ${highTemp} °F</p>
    <p>Low temp: ${lowTemp} °F</p>
  </div>
  `
}

function renderVenueSearchData(result) {   //HTML template for each venue search result
  const name = result.name;
  const address = result.location.formattedAddress.join(', ');
  counter++;                                  //increment counter
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
    <img src="${prefix}${size}${suffix}" alt="Beach photo">
  `
}

function submitVenueSearch() {              //listen for user submit
  $('.js-search-form').on('submit', function(event) {
    event.preventDefault();
    const userInput = $('.js-input').val();  //get user input
    if (userInput.length <= 0) {
      $('.js-message').html('Please enter a valid postal code');
      $('.js-message').prop('hidden', false);      //toggle hidden attribute from HTML section
    } else {
      $('.js-input').val("");
      $('.js-message').html('Loading...please wait');
      $('.js-message').prop('hidden', false);      
      getVenueSearchDataFromApi(userInput);   //run API call - pass in user input
    }
  });
}

function submitBackButton() {        //listen for user click
  $('body').on('click', '.js-back-btn', function(event) {
    event.preventDefault();
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          //toggle hidden attribute from HTML section
    getVenueSearchDataFromApi(STATE.postalCode);  //run API call - pass in postal code from STATE object
  })
}

function submitVenue1DetailsButton() {       //listen for user click
  $('body').on('click', '.js-details-btn-1', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[0].id;
    const name = STATE.venueSearch.venues[0].name;
    const address = STATE.venueSearch.venues[0].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[0].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);  //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}
  
function submitVenue2DetailsButton() {        //listen for user click
  $('body').on('click', '.js-details-btn-2', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[1].id;
    const name = STATE.venueSearch.venues[1].name;
    const address = STATE.venueSearch.venues[1].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[1].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);           //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue3DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-3', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[2].id;
    const name = STATE.venueSearch.venues[2].name;
    const address = STATE.venueSearch.venues[2].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[2].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue4DetailsButton() {      //listen for user click
  $('body').on('click', '.js-details-btn-4', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[3].id;
    const name = STATE.venueSearch.venues[3].name;
    const address = STATE.venueSearch.venues[3].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[3].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue5DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-5', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[4].id;
    const name = STATE.venueSearch.venues[4].name;
    const address = STATE.venueSearch.venues[4].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[4].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);           //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue6DetailsButton() {   //listen for user click
  $('body').on('click', '.js-details-btn-6', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[5].id;
    const name = STATE.venueSearch.venues[5].name;
    const address = STATE.venueSearch.venues[5].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[5].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);           //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue7DetailsButton() {   //listen for user click
  $('body').on('click', '.js-details-btn-7', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[6].id;
    const name = STATE.venueSearch.venues[6].name;
    const address = STATE.venueSearch.venues[6].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[6].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);         //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue8DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-8', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[7].id;
    const name = STATE.venueSearch.venues[7].name;
    const address = STATE.venueSearch.venues[7].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[7].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue9DetailsButton() {    //listen for user click
  $('body').on('click', '.js-details-btn-9', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[8].id;
    const name = STATE.venueSearch.venues[8].name;
    const address = STATE.venueSearch.venues[8].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[8].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);   //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function submitVenue10DetailsButton() {   //listen for user click
  $('body').on('click', '.js-details-btn-10', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[9].id;
    const name = STATE.venueSearch.venues[9].name;
    const address = STATE.venueSearch.venues[9].location.formattedAddress.join(', ');
    const venuePostalCode = STATE.venueSearch.venues[9].location.postalCode;

    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);           //toggle hidden attribute from HTML section
    getVenuePhotosFromApi(venueId, name, address);    //run API call - pass in id, name, address
    getVenueWeatherFromApi(venuePostalCode);                        //run API call
  });
}

function showError() {    //display error
  $('.js-message').prop('hidden', false);    //toggle hidden attribute from HTML section
  $('.js-message').html('There was an error loading the required data. Please check your internet connection')
}

function handleBeachBum() {   //document ready functions
  submitVenueSearch();  
  submitBackButton();           
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
}
  $(handleBeachBum);       //call document ready function