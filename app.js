'use strict'

$('.js-search-form').prop('hidden', false);  //toggle hidden attribute from HTML section

const STATE = {                              //declare object to store data retrieved by API calls
  venueSearch: null,
  venuePhotos: null,
  venueWeather: null,
  postalCode: null,
};

let counter = 0;                                   //declare counter for rendering details buttons

function getVenueSearchDataFromApi(searchTerm) {       //retreive venue search data/update STATE object
  STATE.postalCode = searchTerm;                       //store search term in STATE object
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

  counter = 0;                                    //reset counter
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
      limit: 10
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

function getVenueWeatherFromApi(venuePostalCode) {        //reteive weather data/update STATE object
  const venueWeatherEndpoint = 'https://api.weatherbit.io/v2.0/forecast/daily';

  const settings = {                                      //parameters for API call
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

  $.ajax(settings).then((results) => {                 //API call
    STATE.venueWeather = results.data;                 //store results in STATE object
    displayVenueWeatherData();                         //call display function
  }).catch(showError); 

  console.log(STATE);                                  //log current value of STATE
}

function displayVenueSearchData() {                //pass search results through the HTML rendering function
    const results = STATE.venueSearch.venues.map((item) => renderVenueSearchData(item));
    $('.js-results').html(results);                //display data in HTML section
    $('.js-results').prop('hidden', false);        //toggle hidden attribute from HTML section
}

function displayVenuePhotos(name, address) {       //pass photo results through the HTML rendering function
  const photos = STATE.venuePhotos.photos.items.map((item) => renderVenuePhotos(item)).join('');
  const photosHtml = `
  <div>
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
  <button class="js-back-btn">Back to results</button> 
  `;

  $('.js-weather').html(weatherHtml);             //display data in HTML section
  $('.js-weather').prop('hidden', false);         //toggle hidden attribute from HTML section
}

function renderVenueWeatherData(day) {             //HTML template for each weather result
  const description = day.weather.description;     //pull weather data from STATE object
  const iconCode = day.weather.icon;
  const highTemp = day.max_temp;
  const lowTemp = day.min_temp;

  let date = day.valid_date;
  let year = date.split('-').shift();               //re-arrange date string format to 'MM-DD-YYYY'
  let monthAndDay = date.split('-').slice(1);
  monthAndDay.push(year);
  let newDate = monthAndDay.join('-');

  const formattedDate =  new Date(newDate);          //convert date string into date object
  const weekday = convertDateToDay(formattedDate);   //retrive weekday, month, year
  const month = formattedDate.getMonth() + 1;
  const dayNum = formattedDate.getDate();
  //TODO remove width & make CSS style for .forecast-img
  return `
  <div class="day">
    <h3>${weekday} ${month}/${dayNum}</h3>
    <img src="images/icons/${iconCode}.png" alt="Weather icon" class="forecast-img" width="50px">
    <p>${description}</p>
    <p>High temp: ${highTemp} °F</p>
    <p>Low temp: ${lowTemp} °F</p>
  </div>
  `
}

function renderVenueSearchData(result) {                         //HTML template for each venue search result
  const name = result.name;
  const address = result.location.formattedAddress.join(', ');  //add spaces to address string
  counter++;                                                    //increment counter - assign individual classes to buttons
  return `
  <div class="search-result">
    <h2>${name}</h2>
    <h3>${address}</h3>
    <button class="js-details-btn-${counter}">Details</button>
  </div>
  <br>
  `
}

function renderVenuePhotos(result) {                          //HTML template for each photo result
  const prefix = result.prefix;
  const suffix = result.suffix;
  const size = '300x300'
  return `
    <img src="${prefix}${size}${suffix}" alt="Beach photo" class="venue-img">
  `
}

function submitVenueSearch() {                                       //listen for user submit
  $('.js-search-form').on('submit', function(event) {
    event.preventDefault();
    const userInput = $('.js-input').val();                          //get user input
    if (userInput.length <= 0) {
      $('.js-message').html('Please enter a valid postal code');     //display message if input is empty
      $('.js-message').prop('hidden', false);                        //toggle hidden attribute from HTML section
    } else {
      $('.js-input').val("");                                        //clear value of input field
      $('.js-message').html('Loading...please wait');
      $('.js-message').prop('hidden', false);                        //toggle hidden attribute from HTML section
      getVenueSearchDataFromApi(userInput);                          //run API call - pass in user input
    }
  });
}

function submitBackButton() {                                     //listen for user click
  $('body').on('click', '.js-back-btn', function(event) {
    event.preventDefault();
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);                      //toggle hidden attribute from HTML sections
    $('.js-photos').prop('hidden', true);
    $('.js-weather').prop('hidden', true);
    getVenueSearchDataFromApi(STATE.postalCode);                 //run API call - pass in postal code from STATE object

  })
}

function submitVenue1DetailsButton() {                             //listen for user click
  $('body').on('click', '.js-details-btn-1', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[0].id;                //retreive venue specific data
    const name = STATE.venueSearch.venues[0].name;
    const address = STATE.venueSearch.venues[0].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[0].location.postalCode;
    
    if (!venuePostalCode) {                                   //if no venue postal code, assign value of original query
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);                    //toggle hidden attribute from HTML sections
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);                   
    getVenuePhotosFromApi(venueId, name, address);            //run API call - pass in venue id, name, address
    getVenueWeatherFromApi(venuePostalCode);                  //run API call - pass in venue postal code
  });
}
  
function submitVenue2DetailsButton() {        
  $('body').on('click', '.js-details-btn-2', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[1].id;
    const name = STATE.venueSearch.venues[1].name;
    const address = STATE.venueSearch.venues[1].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[1].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          
    getVenuePhotosFromApi(venueId, name, address);   
    getVenueWeatherFromApi(venuePostalCode);                        
  });
}

function submitVenue3DetailsButton() {  
  $('body').on('click', '.js-details-btn-3', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[2].id;
    const name = STATE.venueSearch.venues[2].name;
    const address = STATE.venueSearch.venues[2].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[2].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          
    getVenuePhotosFromApi(venueId, name, address);    
    getVenueWeatherFromApi(venuePostalCode);                      
  });
}

function submitVenue4DetailsButton() {      
  $('body').on('click', '.js-details-btn-4', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[3].id;
    const name = STATE.venueSearch.venues[3].name;
    const address = STATE.venueSearch.venues[3].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[3].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);         
    getVenuePhotosFromApi(venueId, name, address);   
    getVenueWeatherFromApi(venuePostalCode);                     
  });
}

function submitVenue5DetailsButton() {   
  $('body').on('click', '.js-details-btn-5', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[4].id;
    const name = STATE.venueSearch.venues[4].name;
    const address = STATE.venueSearch.venues[4].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[4].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);           
    getVenuePhotosFromApi(venueId, name, address);    
    getVenueWeatherFromApi(venuePostalCode);                       
  });
}

function submitVenue6DetailsButton() {  
  $('body').on('click', '.js-details-btn-6', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[5].id;
    const name = STATE.venueSearch.venues[5].name;
    const address = STATE.venueSearch.venues[5].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[5].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          
    getVenuePhotosFromApi(venueId, name, address);   
    getVenueWeatherFromApi(venuePostalCode);                       
  });
}

function submitVenue7DetailsButton() {  
  $('body').on('click', '.js-details-btn-7', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[6].id;
    const name = STATE.venueSearch.venues[6].name;
    const address = STATE.venueSearch.venues[6].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[6].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);        
    getVenuePhotosFromApi(venueId, name, address);  
    getVenueWeatherFromApi(venuePostalCode);                   
  });
}

function submitVenue8DetailsButton() {   
  $('body').on('click', '.js-details-btn-8', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[7].id;
    const name = STATE.venueSearch.venues[7].name;
    const address = STATE.venueSearch.venues[7].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[7].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
  
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);        
    getVenuePhotosFromApi(venueId, name, address);   
    getVenueWeatherFromApi(venuePostalCode);                   
  });
}

function submitVenue9DetailsButton() {    
  $('body').on('click', '.js-details-btn-9', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[8].id;
    const name = STATE.venueSearch.venues[8].name;
    const address = STATE.venueSearch.venues[8].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[8].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }
    
    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);      
    getVenuePhotosFromApi(venueId, name, address);   
    getVenueWeatherFromApi(venuePostalCode);                        
  });
}

function submitVenue10DetailsButton() {   
  $('body').on('click', '.js-details-btn-10', function(event) {
    event.preventDefault();
    const venueId = STATE.venueSearch.venues[9].id;
    const name = STATE.venueSearch.venues[9].name;
    const address = STATE.venueSearch.venues[9].location.formattedAddress.join(', ');
    let venuePostalCode = STATE.venueSearch.venues[9].location.postalCode;
    
    if (!venuePostalCode) {
      venuePostalCode = STATE.postalCode;
    }

    $('.js-results').prop('hidden', true);
    $('.js-message').html('Loading...please wait');
    $('.js-message').prop('hidden', false);          
    getVenuePhotosFromApi(venueId, name, address);    
    getVenueWeatherFromApi(venuePostalCode);                        
  });
}

function showError() {                        //display error
  $('.js-message').prop('hidden', false);     //toggle hidden attribute from HTML section
  $('.js-message').html('There was an error loading the required data. Please check your internet connection')
}

function convertDateToDay(date) {           //retreive day of week string from date
  let stringOfDay = '';
  let numOfDay = date.getDay();

  if (numOfDay === 0) {
    stringOfDay = 'Sunday';
  } else if (numOfDay === 1) {
    stringOfDay = 'Monday';
  } else if (numOfDay === 2) {
    stringOfDay = 'Tuesday';
  } else if (numOfDay ===3) {
    stringOfDay = 'Wednesday';
  } else if (numOfDay === 4) {
    stringOfDay = 'Thursday';
  } else if (numOfDay === 5) {
    stringOfDay = 'Friday';
  } else if (numOfDay === 6) {
    stringOfDay = 'Saturday';
  } 

  return stringOfDay;
}

function handleBeachBum() {            //document ready functions
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
  $(handleBeachBum);                  //call document ready function