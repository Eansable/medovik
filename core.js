const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  import("./mobile.js");
} else {
  import("./index.js");
}
