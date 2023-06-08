import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="stays-form"
export default class extends Controller {

  static targets = [ "form", "input", "list" ]

  token = null
  location = null

  connect() {
    console.log("Controller connected")
    this.getAccessToken()
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

  getHotels(){
    const {lat, lon} = this.location
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${lat}&longitude=${lon}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.listTarget.innerHTML='';
        data.data.forEach((hotel) => {
          //console.log(hotel.name);
          console.log(this.listTarget);
          document.querySelector('.hotellist').insertAdjacentHTML("beforeend", `<li>${hotel.name}</li`);
          //this.listTarget.insertAdjacentHTML("beforeend", '<li>asdasd</li>');
        })

      })
      .catch(error => {
        console.error(error)
      })
  }
}
