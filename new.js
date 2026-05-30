document.getElementById("search-btn").addEventListener("click", async () => {
  const query = document.getElementById("location-search").value;

  if (!query) return;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
  );

  const data = await response.json();

  if (data.length > 0) {
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    map.setView([lat, lon], 15);

    marker.setLatLng([lat, lon]);

    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lon;
  }
});
