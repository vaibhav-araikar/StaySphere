mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// console.log(coordinates);

// // create a default marker
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${listing.location}</h3><p>You'll be here soon!</p>`,
    ),
  )
  .addTo(map);

// Jab ye run hota hai:

// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v11",
// });

// Mapbox library background me kuch aisa karti hai:

// // internal pseudo code
// fetch(styleURL, {
//   headers: {
//     Authorization: mapboxgl.accessToken
//   }
// });

// Yani token pehle hi global object me save ho chuka hai.

// DOubt section
// /*
// ==========================================
// DOUBT CLEARING
// ==========================================

// Question:
// "Humne mapToken sirf upar set kiya hai.
// Niche Map() ya Marker() me mapToken use nahi kiya.
// Phir Mapbox token kaise use kar raha hai?"

// Answer:

// mapboxgl.accessToken = mapToken;

// Ye line Mapbox library ki global setting set karti hai.

// Iske baad Mapbox library ke andar accessToken save ho jata hai.

// Matlab internally kuch aisa ho jata hai:

// mapboxgl = {
//   accessToken: "pk.xxxxxxxxxxxxx"
// }

// Ab jab hum niche:

// new mapboxgl.Map({...})

// ya

// new mapboxgl.Marker()

// banate hain, to Mapbox library khud apna stored
// accessToken use kar leti hai.

// Isliye hume token baar-baar pass karne ki zarurat nahi padti.

// Real-life example:

// const student = {};
// student.name = "Vaibhav";

// Ab baad me student object ke kisi bhi method ko
// student.name mil jayega, kyunki value object ke andar
// already save ho chuki hai.

// Bilkul waise hi:

// mapboxgl.accessToken = mapToken;

// ke baad Mapbox ke sabhi components us token ko
// automatically access kar sakte hain.

// Isliye code me token sirf ek baar set karna padta hai.
// */
