const mapElement = document.getElementById("map");

if (mapElement) {
  const map = L.map("map").setView([coordinates[1], coordinates[0]], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup("StaySphere Listing")
    .openPopup();
}

// dragger for map
marker.on("dragend", () => {
  const pos = marker.getLatLng();

  document.getElementById("latitude").value = pos.lat;

  document.getElementById("longitude").value = pos.lng;
});
