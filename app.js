'use strict'

//declare object to store all data retrieved by API calls
const STATE = {
  venueSearch: null,
  venueDetails: null,
  venuePhotos: null
};

//declare counter to use when rendering venue search result buttons
let counter = 0;

//make call to retreive venue search data & update STATE object
function getVenueSearchDataFromApi(searchTerm) {
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
function getVenuePhotosFromApi(venueId) {
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
    displayVenuePhotos();
  });
}

  //pass each venue search result through the HTML rendering function & make results section displayable
  function displayVenueSearchData() {
      const results = STATE.venueSearch.venues.map((item) => renderVenueSearchResults(item));
      $('.js-results').html(results);
      $('.js-results').prop('hidden', false);
  }

  //pass each venue photo result through the HTML rendering function & make results displayable
  function displayVenuePhotos() {
    const photos = STATE.venuePhotos.photos.items.map((item) => renderVenuePhotos(item));
    $('.js-results').html(photos);
  }

    //render HTML template for each venue search result
    function renderVenueSearchResults(result) {
      const venueName = result.name;
      const addressArray = result.location.formattedAddress;
      const address = addressArray.join(', ');
      counter++;
      return `
      <div>
        <h2>${venueName}</h2>
        <h3>${address}</h3>
        <button class="js-details-btn-${counter}">Details</button>
      </div>
      <br>
      `
  }

  //render HTML template for each venue photo
  function renderVenuePhotos(result) {
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
  function submitVenue1DetailsButton () {
    $('body').on('click', '.js-details-btn-1', function(event) {
      const venueId = STATE.venueSearch.venues[0].id;
      getVenuePhotosFromApi(venueId);

      //test to see what current value of STATE is
      console.log(STATE);
    });
  }

//document ready functions
  $(submitVenueSearch);
  $(submitVenue1DetailsButton);