/*
  PROMO POPUP (shows once when the homepage loads; clicking it or its
  button redirects to otherservices.html / "More Services")
  ---------------------------------------------------------------
  - enabled: set to false to turn the popup off without deleting anything
  - img: path WITHOUT extension, put a .webp file at this path
  - link: where clicking the image takes the user
  - alt: accessibility text for the image
*/
const promoBanner = {
  enabled: true,
  img: "assets/images/promo-banner", // put promo-banner.webp in assets/images/
  link: "otherservices.html",
  alt: "Check out our other services",
};

/*
  HOME PAGE SERVICES ("#programs" section on index.html)
  ---------------------------------------------------------------
  HOW TO ADD A NEW SERVICE (no HTML/CSS editing needed):
  1. Add a new { ... } object below.
  2. "img" = path to the image WITHOUT extension.
     Put BOTH a .jpg and a .webp file at that path in assets/images/
     (see /scripts/optimize-images.js to auto-generate the .webp).
  3. "title" = text shown under the image.
  4. "link" = where clicking the card should go ("#" if nowhere yet).

  Example of adding a new service:
  {
    img: "assets/images/pic-outstation",
    title: "Outstation Trip Service",
    link: "#"
  },
*/

const homeServices = [
  { img: "assets/images/pic3", title: "Get You Driver Service", link: "#" },
  { img: "assets/images/pic2", title: "Interstate Service", link: "#" },
  { img: "assets/images/pic1", title: "Long Trips", link: "#" },
  { img: "assets/images/pic4", title: "Personal Driver Service", link: "#" },
  { img: "assets/images/pic6", title: "City Roam Service", link: "#" },
  { img: "assets/images/pic5", title: "Airport Drops", link: "#" },

  // TODO(client request): add the new service(s) here.
  // Uncomment and edit the example below once you have the name + image ready.
  // {
  //   img: "assets/images/pic-new-service",
  //   title: "New Service Name",
  //   link: "#"
  // },
];

/*
  "MORE SERVICES" PAGE (otherservices.html)
  Same rules as above.
*/
const moreServices = [
  { img: "assets/images/house-keeper", title: "House Keeper", link: "#" },
  { img: "assets/images/maid", title: "House Maid", link: "#" },
  { img: "assets/images/house-boy", title: "House Boy", link: "#" },
  { img: "assets/images/baby-care", title: "Baby Care", link: "#" },
  { img: "assets/images/cook", title: "Cook", link: "#" },
  { img: "assets/images/nurse", title: "Nurse", link: "#" },

  // TODO(client request): add the new service(s) here, same format as above.
];