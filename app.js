'use strict'
//declare object to store all data retrieved by API calls
const STATE = {
  venueSearch: null,
  venueDetails: null,
  venuePhotos: null
};

//declare constants required API URL endpoints
const venueSearchEndpoint = 'https://api.foursquare.com/v2/venues/search';

//make call to retreive venue search data & update STATE object
function getVenueSearchDataFromApi(searchTerm) {
    const settings = {
      url: venueSearchEndpoint,
      data: {
        near: `${searchTerm}`,
        v: '20181018',
        client_id: 'P0MLS2UIEUF3FNS21HRUR3HYUPBVRYZ2QR2QTXH1WXR5YKE4',
        client_secret: 'RWKFIU2OXR4TD2IJGEOWXUOFTW3ZMOPFAV4HGKHHNMCIIV2Q',
        categoryId: '4bf58dd8d48988d1e2941735',
        query: 'beach',
        limit: 20
      },
      dataType: 'json',
      type: 'GET',
    };

    $.ajax(settings).then((results) => {
      STATE.venueSearch = results.response;
      displayVenueSearchData();
    });
    //test to see what current value of STATE is
    console.log(STATE); 
  }

  //render HTML template for each venue search result
  function renderVenueSearchResults(result) {
      const venueName = result.name;
      const addressArray = result.location.formattedAddress;
      const address = addressArray.join(', ');
      return `
      <div>
        <h2>${venueName}</h2>
        <h3>${address}</h3>
        <button class="js-details-btn">Details</button>
      </div>
      <br>
      `
  }

  //pass each venue search result through the HTML rendering function & make results section displayable
  function displayVenueSearchData() {
      const results = STATE.venueSearch.venues.map((item) => renderVenueSearchResults(item));
      $('.js-results').html(results);
      $('.js-results').prop('hidden', false);
  }

  //listen for user input & submit
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

//document ready function
  $(submitVenueSearch);