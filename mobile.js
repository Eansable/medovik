const medoviki = [
  {
    id: 1,
    name: "Кофейный",
    price: 50,
    image: "./img/mobile/cakes/coffee.webp",
  },
];

const content = document.querySelector(".content_mobile");

const menu = document.createElement("div");
menu.classList.add("mobile_menu");

const page = document.createElement("div");
page.classList.add("page");

const changePage = (child) => {
  return () => {
    page.innerText = "";
    page.appendChild(child);
  };
};

const medovikiList = document.createElement("div");
medovikiList.classList.add("medoviki_list");
medovikiList.innerHTML = "<h2>MEDOVIKI:<h2>";

const home = document.createElement("div");
home.classList.add("home");
home.innerHTML = `
<header>
  <img src="./img/mobile/logo-with-map.svg" class="logo_mobile">
  <div>
  <img src="./img/mobile/super-edovik.svg">
  </div>
</header>
<aside>
<a href="#" target="_blank">
<img src="./img/mobile/instagramm.svg">
</a>
<a href="#" target="_blank">
<img src="./img/mobile/tiktok.svg">
</a>
<a href="#" target="_blank">
<img src="./img/mobile/email.svg">
</a>
</aside>
<p>Мы — команда ценителей настоящих домашних десертов.<br>
Наша цель — подарить каждому клиенту незабываемый вкус и радость от каждого кусочка наших медовиков.</p>
<div>
<img src="./img/mobile/eco.svg" class="eco">
<p class="eco_text">Благодаря использованию исключительно натуральных ингредиентов,
мы абсолютно уверены в качестве наших десертов</p>
</div>`;
const takeOrder = document.createElement("button");
takeOrder.classList.add("button_mobile");
takeOrder.innerHTML = "Оформить заказ";
takeOrder.addEventListener("click", changePage(medovikiList));
home.appendChild(takeOrder);

const yourChoice = document.createElement("div");
yourChoice.classList.add("your_choice");
yourChoice.innerHTML = "<h2>YOU LOVE:<h2>";

const bucket = document.createElement("div");
bucket.classList.add("bucket");
bucket.innerHTML = "<h2>YOUR CHOICE:<h2>";

const contacts = document.createElement("div");
contacts.classList.add("mobile_contacts");
contacts.innerHTML = "<h2>WE ARE HERE:<h2>";

const menuItems = [
  {
    icon: "./img/mobile/home.svg",
    function: changePage(home),
  },
  {
    icon: "./img/mobile/heart.svg",
    function: changePage(yourChoice),
  },
  {
    icon: "./img/mobile/shopping-cart.svg",
    function: changePage(bucket),
  },
  {
    icon: "./img/mobile/cake.svg",
    function: changePage(medovikiList),
  },
  {
    icon: "./img/mobile/marker.svg",
    function: changePage(contacts),
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

page.appendChild(home);

content.appendChild(menu);
content.appendChild(page);
