const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  import("./mobile240426.js");
} else {
  import("./index.js");
}
