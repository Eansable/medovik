const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  import("./index.js");
} else {
  import("./index.js");
}
