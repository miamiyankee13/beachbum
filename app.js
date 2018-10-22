'use strict'

//declare object to store all data retrieved by API calls
const STATE = {
  venueSearch: null,
  venueDetails: null, //not sure what details to pull, inconsistent data from API
  venuePhotos: null,
  query: null,
};

//declare counter to use when rendering venue search result buttons
let counter = 0;

//make call to retreive venue search data & update STATE object
function getVenueSearchDataFromApi(searchTerm) {
    STATE.query = searchTerm;
    const venueSearchEndpoint = 'https://api.foursquare.com/v2/venues/search'; 
    const settings = {
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

    $.ajax(settings).then((results) => {
      STATE.venueSearch = results.response;
      displayVenueSearchData();
    });

    //reset counter
    counter = 0;

    //test to see what current value of STATE is
    console.log(STATE);
  }

//make call to retreive venue photo data & update STATE object
function getVenuePhotosFromApi(venueId, name, address) {
  const venuePhotosEndpoint = `https://api.foursquare.com/v2/venues/${venueId}/photos`;
  const settings = {
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
  
  $.ajax(settings).then((results) => {
    STATE.venuePhotos = results.response;
    displayVenuePhotos(name, address);
  });
}

  //pass each venue search result through the HTML rendering function & make results section displayable
  function displayVenueSearchData() {
      const results = STATE.venueSearch.venues.map((item) => renderVenueSearchResults(item));
      $('.js-results').html(results);
      $('.js-results').prop('hidden', false);
  }

  //pass each venue photo result through the HTML rendering function & make results displayable
  function displayVenuePhotos(name, address) {
    const photos = STATE.venuePhotos.photos.items.map((item) => renderVenuePhotos(item));
    $('.js-results').html(`<h2>${name}</h2><h3>${address}</h3>${photos}
    <div><button class="js-back-btn">Back to results</button></div>`);
  }

    //render HTML template for each venue search result
    function renderVenueSearchResults(result) {
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

  //render HTML template for each venue photo
  function renderVenuePhotos(result, name, address) {
    const prefix = result.prefix;
    const suffix = result.suffix;
    const size = '500x500'
    return `
    <div>
      <img src="${prefix}${size}${suffix}" alt="Beach photo">
    </div>
    `
  }

  //listen for user search input on submit
  //run venue search API call
  function submitVenueSearch() {
    $('.js-search-form').on('submit', function(event) {
      event.preventDefault();
      const userInput = $('.js-input').val();
      if (userInput.length <= 0) {
        $('.js-results').html('Please enter a search term');
      } else {
        $('.js-input').val("");
        getVenueSearchDataFromApi(userInput);
      }
    });
  }

  //listen for user click on venue 1 button
  //run detail API calls
  function submitVenue1DetailsButton() {
    $('body').on('click', '.js-details-btn-1', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[0].id;
      const name = STATE.venueSearch.venues[0].name;
      const address = STATE.venueSearch.venues[0].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }
  
  //listen for user click on venue 2 button
  //run detail API calls
  function submitVenue2DetailsButton() {
    $('body').on('click', '.js-details-btn-2', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[1].id;
      const name = STATE.venueSearch.venues[1].name;
      const address = STATE.venueSearch.venues[1].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 3 button
  //run detail API calls
  function submitVenue3DetailsButton() {
    $('body').on('click', '.js-details-btn-3', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[2].id;
      const name = STATE.venueSearch.venues[2].name;
      const address = STATE.venueSearch.venues[2].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 4 button
  //run detail API calls
  function submitVenue4DetailsButton() {
    $('body').on('click', '.js-details-btn-4', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[3].id;
      const name = STATE.venueSearch.venues[3].name;
      const address = STATE.venueSearch.venues[3].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 5 button
  //run detail API calls
  function submitVenue5DetailsButton() {
    $('body').on('click', '.js-details-btn-5', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[4].id;
      const name = STATE.venueSearch.venues[4].name;
      const address = STATE.venueSearch.venues[4].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 6 button
  //run detail API calls
  function submitVenue6DetailsButton() {
    $('body').on('click', '.js-details-btn-6', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[5].id;
      const name = STATE.venueSearch.venues[5].name;
      const address = STATE.venueSearch.venues[5].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 7 button
  //run detail API calls
  function submitVenue7DetailsButton() {
    $('body').on('click', '.js-details-btn-7', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[6].id;
      const name = STATE.venueSearch.venues[6].name;
      const address = STATE.venueSearch.venues[6].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 8 button
  //run detail API calls
  function submitVenue8DetailsButton() {
    $('body').on('click', '.js-details-btn-8', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[7].id;
      const name = STATE.venueSearch.venues[7].name;
      const address = STATE.venueSearch.venues[7].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 9 button
  //run detail API calls
  function submitVenue9DetailsButton() {
    $('body').on('click', '.js-details-btn-9', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[8].id;
      const name = STATE.venueSearch.venues[8].name;
      const address = STATE.venueSearch.venues[8].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

    //listen for user click on venue 10 button
  //run detail API calls
  function submitVenue10DetailsButton() {
    $('body').on('click', '.js-details-btn-10', function(event) {
      event.preventDefault();
      const venueId = STATE.venueSearch.venues[9].id;
      const name = STATE.venueSearch.venues[9].name;
      const address = STATE.venueSearch.venues[9].location.formattedAddress.join(', ');
      getVenuePhotosFromApi(venueId, name, address);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

  //listen for user click on back button
  //run original query
  function submitBackButton() {
    $('body').on('click', '.js-back-btn', function(event) {
      event.preventDefault();
      getVenueSearchDataFromApi(STATE.query);
    })
  }

//document ready functions
  $(submitVenueSearch);
  $(submitVenue1DetailsButton);
  $(submitVenue2DetailsButton);
  $(submitVenue3DetailsButton);
  $(submitVenue4DetailsButton);
  $(submitVenue5DetailsButton);
  $(submitVenue6DetailsButton);
  $(submitVenue7DetailsButton);
  $(submitVenue8DetailsButton);
  $(submitVenue9DetailsButton);
  $(submitVenue10DetailsButton);
  $(submitBackButton);