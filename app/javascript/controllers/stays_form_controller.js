import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["form", "input", "list"];

  token = null;
  location = null;
  tripId = null;

  connect() {
    console.log("just one more step!");
    this.tripId = this.element.getAttribute("data-trip-id");
    console.log("trip id", this.tripId);
    this.getAccessToken();
    this.formTarget.addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.target.hasAttribute("data-stays-form-target")) {
        this.searchLocation(event);
      } else {
        this.addToTrip(event);
      }
    });
  }


  getAccessToken() {
    const data = {
      grant_type: "client_credentials",
      client_id: "Nd23iTdbMSx49DNUNSY8nA4vXfPeHWkl",
      client_secret: "zHZhhCyoHxCra3Vz",
    };

    const body = new URLSearchParams();
    for (const key in data) {
      body.append(key, data[key]);
    }

    fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        this.token = data.access_token;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  searchLocation(event) {
    event.preventDefault();
    const location = this.inputTarget.value;
    const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        this.location = { lat, lon };
        this.getHotels();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  addToTrip(event) {
    event.preventDefault();
    const hotelName = event.currentTarget.getAttribute("data-hotel-name");
    const hotelPrice = event.currentTarget.getAttribute("data-hotel-price");
    const location = this.inputTarget.value;
    const tripId = this.tripId;
    const csrfToken = document.querySelector('input[name="authenticity_token"]').value;

    const data = {
      name: hotelName,
      price: hotelPrice,
      location: location,
      trip_id: tripId
    };

    fetch(`/trips/${tripId}/stays`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Stay added to trip");
          // Redirect to trip show view
          window.location.href = `/trips/${tripId}`;
        } else {
          console.error("Failed to add stay to trip:", response.status);
        }
      })
      .catch((error) => {
        console.error("Failed to add stay to trip:", error);
      });
  }

  getTripIdFromUrl() {
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 2];
  }

  getHotels() {
    const { lat, lon } = this.location;
    const tripId = this.getTripIdFromUrl();
    const url = `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${lat}&longitude=${lon}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const listContainer = this.listTarget;
        listContainer.innerHTML = "";

        const numResults = data.data.length;
        const message = document.createElement("p");
        message.textContent = `You got ${numResults} search results:`;
        message.classList.add("search-message");
        listContainer.appendChild(message);

        data.data.forEach((hotel) => {
          const card = document.createElement("div");
          card.classList.add("card");

          const image = document.createElement("img");
          image.src =
            "https://res.cloudinary.com/dqdghubdw/image/upload/c_scale,w_50,h_50,q_auto,f_auto/v1686306798/marquis-3-min_yp0tq6.jpg";
          image.classList.add("small-image");
          image.alt = hotel.name;
          card.appendChild(image);

          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");

          const title = document.createElement("h6");
          title.classList.add("card-title");
          title.textContent = hotel.name;
          cardBody.appendChild(title);

          const price = Math.floor(Math.random() * (200 - 50 + 1) + 50);
          const priceText = document.createElement("p");
          priceText.textContent = `Price per night: €${price}`;
          cardBody.appendChild(priceText);
          priceText.classList.add("price");

          const link = document.createElement("a");
          link.href = `/trips/${tripId}/stays`;
          link.textContent = "Add to trip";
          link.setAttribute("data-hotel-name", hotel.name);
          link.setAttribute("data-hotel-price", price);
          link.classList.add("btn", "btn-primary", "add-to-trip-link");
          link.setAttribute("data-action", "click->stays-form#addToTrip");
          cardBody.appendChild(link);

          card.appendChild(cardBody);
          listContainer.appendChild(card);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

}
