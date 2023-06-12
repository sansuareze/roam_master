import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="search-api"
export default class extends Controller {
  static targets = ["input", "activityList"]
  token = null
  location = null

  connect() {
    this.getApiKey()
  }

  // GEOCODE API GET LATITUDE AND LONGITUDE WITH
    getLocation() {
      const location = this.inputTarget.value
      const urlAddress = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
      fetch(urlAddress)
        .then(response => response.json())
        .then(data => {
          const { lat, lon } = data[0]
          this.location = { lat, lon }
          this.getRequest()
        })
      }


  // POST REQUEST AMADEUS MADE TO GET TOKEN

  getApiKey() {
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const data = {
      grant_type: "client_credentials",
      client_id: 'oj2NV49C0djaUwfDmLJWUOkf21KbqdoN',
      client_secret: 'w8GP0jc4nxKLQV0G',
    }

    const body = new URLSearchParams();
    for (const key in data) {
      body.append(key, data[key]);
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
      .then(response => response.json())
      .then(data => {
        this.token = data.access_token;
        if (this.location) {
          this.getRequest();
        }
      })
  }

  // GET REQUEST AMADEUS

  getRequest () {
    console.log("requesting final")
    if (!this.token || !this.location) {
      return
    }
    const { lat, lon } = this.location
    const getUrl = `https://test.api.amadeus.com/v1/shopping/activities?latitude=${lat}&longitude=${lon}&radius=1`

    fetch(getUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // Next line retrieve the 25 first results
      const activitiesOptions = data.data.slice(0, 16)
       // Get the activityList element
      activitiesOptions.forEach(activity => {
        const list = document.querySelector(".activity-list")
        list.insertAdjacentHTML("beforeend", `<div class="col-10 offset-1 mt-5 card bg-white p-4 animate__animated animate__backInUp"><h3><b>${activity.name}</b></h3>
        <div class="row">
          <div class="col-md-4">
           <img class="img-fluid" src="${activity.pictures[0]}" />
          </div>
          <div class="col-md-8">
           <p>${activity.description}<p>
           ${activity.price ? `<h4><b>€ ${activity.price.amount}</b></h4>` : ''}
           <a href='/trips/${this.tripId}/activities' class="btn btn-primary add-to-trip-link" data-action="click->stays-form#addToTrip" data-hotel-name="${hotel.name}" style="float:right"> Add to trip </a> </div>
          </div>
          </div>
        </div>`)
      });z
      console.log(this.activityListTarget)
    }
      )
  }

  // ADD TO TRIP

  addToTrip(event) {
    event.preventDefault();
    const activityName = event.currentTarget.getAttribute("data-activity-name");
    const tripId = this.getTripIdFromUrl();

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `/trips/${tripId}/activities`;

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "authenticity_token";
    csrfInput.value = csrfToken;

    const hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = "name";
    hiddenField.value = activityName;

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

  attachEventListeners() {
    const addToTripLinks = document.querySelectorAll(".add-to-trip-link");
    addToTripLinks.forEach((link) => {
      link.addEventListener("click", (event) => this.addToTrip(event));
    });
  }



}
