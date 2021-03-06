'use strict'

$('.js-search-form').prop('hidden', false);  //toggle hidden attribute from HTML section

const STATE = {                              //declare object to store data retrieved by API calls
  venueSearch: null,
  venuePhotos: null,
  venueWeather: null,
  query: null,
};

function getVenueSearchDataFromApi(searchTerm) {       //retreive venue search data/update STATE object
  STATE.query = searchTerm;                            //store search term in STATE object
  const venueSearchEndpoint = 'https://api.foursquare.com/v2/venues/search'; 
  
  const settings = {                                   //parameters for API call
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

  $.ajax(settings).then((results) => {            //API call
    STATE.venueSearch = results.response;         //store results in STATE object
    displayVenueSearchData();                     //call display function
    $('.js-search-form').prop('hidden', false);   //toggle hidden attribute from HTML sections
    $('.js-message').prop('hidden', true);
  }).catch(showError);                            //display error if call fails

  console.log(STATE);                             //log current value of STATE
}

function getVenuePhotosFromApi(venueId, name, address) {     //retreive venue photo data/update STATE object
  const venuePhotosEndpoint = `https://api.foursquare.com/v2/venues/${venueId}/photos`;

  const settings = {                                        //paramters for API call
    url: venuePhotosEndpoint,
    data: {
      v: '20181018',
      client_id: 'P0MLS2UIEUF3FNS21HRUR3HYUPBVRYZ2QR2QTXH1WXR5YKE4',
      client_secret: 'RWKFIU2OXR4TD2IJGEOWXUOFTW3ZMOPFAV4HGKHHNMCIIV2Q',
    },
    dataType: 'json',
    type: 'GET'
  };
  
  $.ajax(settings).then((results) => {          //API call
    STATE.venuePhotos = results.response;       //store results in STATE object
    displayVenuePhotos(name, address);          //call display function - pass in name & address parameters from API call
    $('.js-search-form').prop('hidden', true);  //toggle hidden attribute from HTML sections
    $('.js-message').prop('hidden', true);
  }).catch(showError);                          //display error if call fails
}

function getVenueWeatherFromApi(lat, long) {        //reteive weather data/update STATE object
  const venueWeatherEndpoint = 'https://api.weatherbit.io/v2.0/forecast/daily';

  const settings = {                                //parameters for API call
    url: venueWeatherEndpoint,
    data: {
      key: '0a4e350d938e4737979ee5d05f620a49',
      lang: 'en',
      lat: `${lat}`,
      lon: `${long}`,
      units: 'I',
      days: 5
    },
    dataType: 'json',
    type: 'GET'
  };

  $.ajax(settings).then((results) => {                 //API call
    STATE.venueWeather = results.data;                 //store results in STATE object
    displayVenueWeatherData();                         //call display function
  }).catch(showError); 

  console.log(STATE);                                  //log current value of STATE
}

function displayVenueSearchData() {                //pass search results through the HTML rendering function
    const results = STATE.venueSearch.venues.map((item, index) => renderVenueSearchData(item, index));
    $('.js-results').html(results);                //display data in HTML section
    $('.js-results').prop('hidden', false);        //toggle hidden attribute from HTML section
}

function displayVenuePhotos(name, address) {       //pass photo results through the HTML rendering function
  const photos = STATE.venuePhotos.photos.items.map((item) => renderVenuePhotos(item)).join('');
  const photosHtml = `
  <div class="photos">
    <h2>${name}</h2>
    <h3>${address}</h3>
    <div>
      ${photos}
    </div>
  </div>`;

  $('.js-photos').html(photosHtml);               //display data in HTML section
  $('.js-photos').prop('hidden', false);          //toggle hidden attribute from HTML section
}

function displayVenueWeatherData() {             //pass weather results through the HTML rendering function
  const weather = STATE.venueWeather.map((item) => renderVenueWeatherData(item)).join('');
  const weatherHtml = `
  <div class="weather">
  ${weather}
  </div>
  <button class="js-back-btn back">Back to results</button> 
  `;

  $('.js-weather').html(weatherHtml);             //display data in HTML section
  $('.js-weather').prop('hidden', false);         //toggle hidden attribute from HTML section
}

function renderVenueWeatherData(day) {             //HTML template for each weather result
  const description = day.weather.description;     //pull weather data from STATE object
  const iconCode = day.weather.icon;
  const highTemp = day.max_temp;
  const lowTemp = day.min_temp;

  let date = new Date(day.valid_date);             //turn date string into date object
  date.setDate(date.getDate() + 1);                //add 1 day to date object to reflect proper date
  const weekday = convertDateToDay(date);          //retrive weekday, month, year
  const month = date.getMonth() + 1;
  const dayNum = date.getDate();
 
  return `
  <div class="day">
    <h3>${weekday}</h3>
    <h3>${month}/${dayNum}</h3>
    <img src="images/icons/${iconCode}.png" alt="Weather icon" class="forecast-img">
    <p>${description}</p>
    <br>
    <p>High: ${highTemp} °F</p>
    <p>Low: ${lowTemp} °F</p>
  </div>
  `
}

function renderVenueSearchData(result,index) {                         //HTML template for each venue search result
  const name = result.name;
  const address = result.location.formattedAddress.join(', ');  //add spaces to address string
  return `
  <div class="search-result">
    <h2>${name}</h2>
    <h3>${address}</h3>
    <button class="js-details-btn details" data-index="${index}">View Weather Info</button>
  </div>
  <br>
  `
}

function renderVenuePhotos(result) {                          //HTML template for each photo result
  const prefix = result.prefix;
  const suffix = result.suffix;
  const size = '250x250'
  return `
    <img src="${prefix}${size}${suffix}" alt="Beach photo" class="venue-img">
  `
}

function submitVenueSearch() {                                       //listen for user submit
  $('.js-search-form').on('submit', function(event) {
    event.preventDefault();
    const userInput = $('.js-input').val();                          //get user input                                                     
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);                        //toggle hidden attribute from HTML section
    getVenueSearchDataFromApi(userInput);                          //run API call - pass in user input
  });
}

function submitBackButton() {                                     //listen for user click
  $('body').on('click', '.js-back-btn', function(event) {
    event.preventDefault();
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);                      //toggle hidden attribute from HTML sections
    $('.js-photos').prop('hidden', true);
    $('.js-weather').prop('hidden', true);
    getVenueSearchDataFromApi(STATE.query);                 //run API call - pass in postal code from STATE object

  })
}

function submitVenueDetailsButton() {                             //listen for user click
  $('body').on('click', '.js-details-btn', function(event) {
    event.preventDefault();
    const index = $(event.target).attr('data-index');            //retreive venue specific data
    const venue = STATE.venueSearch.venues[index];
    const venueId = venue.id;               
    const name = venue.name;
    const address = venue.location.formattedAddress.join(', ');
    const lat = venue.location.lat;
    const long = venue.location.lng;
    
    $('.js-results').prop('hidden', true);                    //toggle hidden attribute from HTML sections
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);                   
    getVenuePhotosFromApi(venueId, name, address);            //run API call - pass in venue id, name, address
    getVenueWeatherFromApi(lat, long);                        //run API call - pass in venue postal code
  });
}

function showError() {                        //display error
  $('.js-message').prop('hidden', false);     //toggle hidden attribute from HTML section
  $('.js-message').html('There was an error loading the requested data')
}

function convertDateToDay(date) {           //retreive day of week string from date
  let stringOfDay = '';
  let numOfDay = date.getDay();

  switch(numOfDay) {
    case 0:
      stringOfDay = 'Sunday';
      break;
    case 1:
      stringOfDay = 'Monday';
      break;
    case 2:
      stringOfDay = 'Tuesday';
      break;
    case 3:
      stringOfDay = 'Wednesday';
      break;
    case 4:
      stringOfDay = 'Thursday';
      break;
    case 5:
      stringOfDay = 'Friday';
      break;
    case 6:
      stringOfDay = 'Saturday';
      break;
  }
  return stringOfDay;
}

function handleBeachBum() {            //document ready functions
  submitVenueSearch();  
  submitBackButton();           
  submitVenueDetailsButton();
}
  $(handleBeachBum);                  //call document ready function