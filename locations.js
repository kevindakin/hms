function locationsSearch() {
  const MAX_RADIUS_MILES = 50;

  let searchTimeout;

  const searchInput = document.querySelector('[data-search="input"]');
  const resetButton = document.querySelector('[data-search="reset"]');
  const locationCards = document.querySelectorAll("[data-location-card]");
  const mapEl = document.getElementById("map");

  // Prevent form submission
  const searchForm = searchInput.closest("form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    });
  }

  let map,
    allMarkers = [];

  // Auto-search with debounce
  searchInput.addEventListener("input", function () {
    const value = searchInput.value.trim();

    // Show/hide reset button
    if (value) {
      resetButton.style.display = "flex";
    } else {
      resetButton.style.display = "none";
      resetSearch();
      return;
    }

    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (value.length >= 3) {
        // Only search if 3+ characters
        performSearch(value);
      }
    }, 500); // Wait 500ms after user stops typing
  });

  // Reset functionality
  resetButton.addEventListener("click", function () {
    searchInput.value = "";
    resetButton.style.display = "none";
    resetSearch();
  });

  function performSearch(searchValue) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        address: searchValue,
        componentRestrictions: { country: "US" }, // Restrict to US
      },
      function (results, status) {
        if (status === "OK") {
          const userLocation = results[0].geometry.location;
          const userLat = userLocation.lat();
          const userLng = userLocation.lng();

          filterAndSortLocations(userLat, userLng);
          updateMap(userLat, userLng);
        }
      }
    );
  }

  function filterAndSortLocations(userLat, userLng) {
    const locationsArray = Array.from(locationCards);

    locationsArray.forEach((card) => {
      const locationLat = parseFloat(card.dataset.lat);
      const locationLng = parseFloat(card.dataset.lng);

      const distance = calculateDistance(
        userLat,
        userLng,
        locationLat,
        locationLng
      );

      card.dataset.distance = distance.toFixed(1);

      // Update distance display
      const distanceElement = card.querySelector("[data-location-distance]");
      const distanceWrap = card.querySelector("[data-location-distance-wrap]");

      if (distanceElement) {
        distanceElement.textContent = distance.toFixed(1);
      }

      // Show distance wrapper
      if (distanceWrap) {
        distanceWrap.style.display = "block";
      }

      // Show/hide based on radius
      if (distance <= MAX_RADIUS_MILES) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    // Sort by distance
    const container = locationCards[0].parentElement;

    locationsArray.sort((a, b) => {
      return parseFloat(a.dataset.distance) - parseFloat(b.dataset.distance);
    });

    // Re-append in sorted order
    locationsArray.forEach((card) => {
      container.appendChild(card);
    });
  }

  function updateMap(userLat, userLng) {
    // Get the existing map instance
    const mapEl = document.getElementById("map");
    if (!mapEl || !mapEl.__googleMap) return;

    const map = mapEl.__googleMap;

    map.setCenter({ lat: userLat, lng: userLng });
    map.setZoom(10);
  }

  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  function resetSearch() {
    locationCards.forEach((card) => {
      card.style.display = "block";
      card.dataset.distance = "";

      const distanceElement = card.querySelector("[data-location-distance]");
      const distanceWrap = card.querySelector("[data-location-distance-wrap]");

      if (distanceElement) {
        distanceElement.textContent = "";
      }

      if (distanceWrap) {
        distanceWrap.style.display = "none";
      }
    });

    // Reset map using stored default bounds
    const mapEl = document.getElementById("map");
    if (!mapEl || !mapEl.__googleMap || !mapEl.__defaultBounds) return;

    const map = mapEl.__googleMap;

    map.fitBounds(mapEl.__defaultBounds);

    google.maps.event.addListenerOnce(map, "bounds_changed", function () {
      if (map.getZoom() > 12) {
        map.setZoom(12);
      }
    });
  }
}

function locationsMap() {
  const mapEl = document.getElementById("map");
  const markers = document.querySelectorAll(".map_marker");
  if (!mapEl || markers.length === 0) return;

  const isMobile = window.innerWidth < 768;

  const map = new google.maps.Map(mapEl, {
    zoom: isMobile ? 10 : 12,
    center: { lat: 36.80977, lng: -119.79139 },
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi.park",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi.medical",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "poi.government",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "poi.school",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "administrative.neighborhood",
        elementType: "labels",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "administrative",
        elementType: "labels",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "labels.text",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f9f8f5" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#aee0f4" }],
      },
    ],
  });

  mapEl.__googleMap = map;

  const iconURL =
    "https://cdn.prod.website-files.com/689a40e6adc83910216bba03/68dd79d5d3313e3b841a4df9_map-marker.png";

  const infoWindow = new google.maps.InfoWindow();

  const bounds = new google.maps.LatLngBounds();

  markers.forEach((markerEl) => {
    const lat = parseFloat(markerEl.dataset.lat);
    const lng = parseFloat(markerEl.dataset.lng);
    const title = markerEl.dataset.title || "Location";

    const position = { lat, lng };

    const marker = new google.maps.Marker({
      position: position,
      map,
      title,
      icon: {
        url: iconURL,
        scaledSize: new google.maps.Size(48, 48),
        anchor: new google.maps.Point(24, 48),
      },
    });

    bounds.extend(position);

    marker.addListener("click", () => {
      // Clone the template
      const template = document.querySelector("[data-map-popup-template]");
      const popup = template.cloneNode(true);

      // Show it and remove the template attribute
      popup.style.display = "flex";
      popup.removeAttribute("data-map-popup-template");

      // Get data from marker element
      const address1 = markerEl.dataset.address1 || "";
      const address2 = markerEl.dataset.address2 || "";
      const bookLink = markerEl.dataset.book || "#";
      const slug = markerEl.dataset.slug || "";

      // Populate with data
      const titleEl = popup.querySelector("[data-popup-title]");
      const addressLine1 = popup.querySelector("[data-popup-address-line-1]");
      const addressLine2 = popup.querySelector("[data-popup-address-line-2]");
      const bookButton = popup.querySelector("[data-popup-book]");
      const detailsButton = popup.querySelector("[data-popup-details]");

      if (titleEl) titleEl.textContent = title;
      if (addressLine1) addressLine1.textContent = address1;
      if (addressLine2) addressLine2.textContent = address2;
      if (bookButton) bookButton.href = bookLink;
      if (detailsButton) detailsButton.href = `/location/${slug}`;

      // Set as infoWindow content
      infoWindow.setContent(popup.outerHTML);
      infoWindow.open(map, marker);
    });
  });

  map.fitBounds(bounds);

  // Store the default bounds for reset
  mapEl.__defaultBounds = bounds;

  google.maps.event.addListenerOnce(map, "bounds_changed", function () {
    if (map.getZoom() > 12) {
      map.setZoom(12);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  locationsSearch();
  locationsMap();
});
