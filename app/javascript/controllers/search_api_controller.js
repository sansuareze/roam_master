import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="search-api"
export default class extends Controller {
  static targets = ["form", "input", "activityList"]
  token = null
  location = null
  tripId = null
  csrfToken = null

  connect() {
    console.log('connected')
    this.tripId = this.element.getAttribute("data-trip-id")
    this.getApiKey()
    this.formTarget.addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.target.hasAttribute("search-api-target")) {
        this.getLocation(event);
      } else {
        this.addToTrip(event);
      }
    });
  }

  // GEOCODE API GET LATITUDE AND LONGITUDE WITH
  getLocation(event) {
    event.preventDefault();
    const location = this.inputTarget.value
    const urlAddress = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
    fetch(urlAddress)
      .then(response => response.json())
      .then(data => {
        const { lat, lon } = data[0]
        this.location = { lat, lon }
        this.getRequest()
      })
      .catch((error) => {
        console.error(error);
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

  getRequest() {
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
        // Next line retrieve the 25 first results
        const activitiesOptions = data.data.slice(0, 16)
        // Get the activityList element
        activitiesOptions.forEach(activity => {
          const list = document.querySelector(".activity-list")
          list.insertAdjacentHTML("beforeend",
          `<div class="col-10 offset-1 mt-5 bg-white p-4 animate__animated animate__backInUp">
            <h3>
              <b>${activity.name}</b>
            </h3>
          <div class="row">
            <div class="col-md-4">
              <img class="img-fluid" src="${activity.pictures[0]}" />
            </div>
            <div class="col-md-8">
              <p>${activity.description}<p>
              ${activity.price ? `<h4><b>€ ${activity.price.amount}</b></h4>` : ''}
              <a href='/trips/${this.tripId}/activities' class="btn btn-primary add-to-trip-link" data-action="click->search-api#addToTrip" data-activity-name="${activity.name}"
              data-activity-cost="${activity.price.amount}"
              data-activity-description="${activity.description}"
              data-activity-img="${activity.pictures[0]}"
              style="float:right">
                Add to trip
              </a>
            </div>
          </div>
          </div>
        </div><div class="col-10 offset-1 mt-5 bg-white p-4 animate__animated animate__backInUp">
            <h3>
              <b>${activity.name}</b>
            </h3>
          <div class="row">
            <div class="col-md-4">
              <img class="img-fluid" src="${activity.pictures[0]}" />
            </div>
            <div class="col-md-8">
              <p>${activity.description}<p>
              ${activity.price ? `<h4><b>€ ${activity.price.amount}</b></h4>` : ''}
              <a href='/trips/${this.tripId}/activities' class="btn btn-primary add-to-trip-link" data-action="click->search-api#addToTrip" data-activity-name="${activity.name}"
              data-activity-cost="${activity.price.amount}"
              data-activity-description="${activity.description}"
              data-activity-img="${activity.pictures[0]}"
              style="float:right">
                Add to trip
              </a>
            </div>
          </div>
          </div>
        </div>`)
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // ADD TO TRIP

  addToTrip(event) {
    event.preventDefault();
    const activityName = event.currentTarget.getAttribute("data-activity-name");
    const activityPrice = event.currentTarget.getAttribute('data-activity-cost');
    const activityDescription = event.currentTarget.getAttribute('data-activity-description');
    const activityImage = event.currentTarget.getAttribute('data-activity-img');
    const tripId = this.tripId;
    this.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); // Fetch the CSRF token from the meta tag

    const data = {
      name: activityName,
      cost: activityPrice,
      description: activityDescription,
      trip_id: tripId,
      image: activityImage
    };

    fetch(`/trips/${tripId}/activities`, { // Change the URL to match your activities controller route
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("activity added to trip");
          window.location.href = `/trips/${tripId}`;
        } else {
          console.error("failed to add activity to trip", response.status);
        }
      })
      .catch((error) => {
        console.log("Failed to add activity to trip", error)
      })
  }


  getTripIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 2]; // Changed index to -2 to get the tripId
  }
}
