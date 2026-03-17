const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (isMobile) {
  import("./mobile130326.js");
} else {
  import("./index.js");
}
