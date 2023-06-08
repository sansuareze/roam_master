import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="stays-form"
export default class extends Controller {

  static targets = [ "form", "input", "list" ]

  token = null
  location = null

  connect() {
    console.log("Controller connected")
    this.tripId = this.element.getAttribute("data-trip-id")
    this.getAccessToken()
    this.attachEventListeners()
  }


  getAccessToken(){
    console.log("working")
    const data = {
      'grant_type': 'client_credentials',
      'client_id': 'Nd23iTdbMSx49DNUNSY8nA4vXfPeHWkl',
      'client_secret': 'zHZhhCyoHxCra3Vz'
    }

    const body = new URLSearchParams();
    for (const key in data) {
      body.append(key, data[key]);
    }

    fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })
      .then(response => response.json())
      .then(data => {
         this.token = data.access_token
      })
      .catch(error => {
        console.error(error)
      })
  }

  searchLocation(event) {
    event.preventDefault()
    const location = this.inputTarget.value;
    const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
    fetch(url)
    .then(response => response.json())
    .then(data => {
      const {lat, lon} = data[0];
      this.location = {lat, lon};
      this.getHotels();
    })
    .catch(error => {
      console.error(error)
    })
  }

  addToTrip(event) {
    event.preventDefault();
    const hotelName = event.currentTarget.getAttribute("data-hotel-name");
    const tripId = this.getTripIdFromUrl();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/trips/${tripId}/stays`;

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "authenticity_token";
    csrfInput.value = csrfToken;

    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = "name";
    hiddenField.value = hotelName;

    const tripIdInput = document.createElement("input");
    tripIdInput.type = "hidden";
    tripIdInput.name = "trip_id";
    tripIdInput.value = tripId;

    form.appendChild(csrfInput);
    form.appendChild(hiddenField);
    form.appendChild(tripIdInput);
    document.body.appendChild(form);
    form.submit();
  }

  getTripIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 2]; // Changed index to -2 to get the tripId
  }

  getHotels() {
    const { lat, lon } = this.location;
    const tripId = this.getTripIdFromUrl();
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${lat}&longitude=${lon}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const listContainer = document.querySelector('.hotellist');
        listContainer.innerHTML = '';

        data.data.forEach(hotel => {
          const listItem = document.createElement('li');
          listItem.textContent = hotel.name;

          const link = document.createElement('a');
          link.href = `/trips/${this.tripId}/stays`;
          link.textContent = 'Add to trip';
          link.setAttribute('data-action', 'click->stays-form#addToTrip');
          link.setAttribute('data-hotel-name', hotel.name);

          listItem.appendChild(link);
          listContainer.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  attachEventListeners() {
    const addToTripLinks = document.querySelectorAll(".add-to-trip-link");
    addToTripLinks.forEach((link) => {
      link.addEventListener("click", (event) => this.addToTrip(event));
    });
  }

}
