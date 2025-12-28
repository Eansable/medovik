const content = document.querySelector(".content_mobile");

const menu = document.createElement("div");
menu.classList.add("mobile_menu");

const clickHandler = () => {};

const menuItems = [
  {
    icon: "./img/mobile/home.svg",
    function: clickHandler,
  },
  {
    icon: "./img/mobile/heart.svg",
    function: clickHandler,
  },
  {
    icon: "./img/mobile/shopping-cart.svg",
    function: clickHandler,
  },
  {
    icon: "./img/mobile/cake.svg",
    function: clickHandler,
  },
  {
    icon: "./img/mobile/marker.svg",
    function: clickHandler,
  },
];

menuItems.forEach((item) => {
  const menuItem = document.createElement("button");
  menuItem.classList.add("mobile_menu_item");
  menuItem.innerHTML = `
    <img src="${item.icon}" alt="Icon">
  `;
  menuItem.addEventListener("click", item.function);
  menu.appendChild(menuItem);
});

content.appendChild(menu);
