class Element {
  element;
  constructor(block = "div", classList = [], innerHTML = "") {
    const newElement = document.createElement(block);

    newElement.classList.add(classList);
    newElement.innerHTML = innerHTML;
    this.element = newElement;
  }
  restoreHTML() {
    this.element.innerHTML = "";
  }
}

const homeHTML = `
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

const loveCake = (medovik) => (event) => {
  const savedMedoviksStr = localStorage.getItem("favoritesCake");
  if (savedMedoviksStr) {
    const savedMedoviks = JSON.parse(savedMedoviksStr);
    if (savedMedoviks.some((item) => item.id === medovik.id)) {
      localStorage.setItem(
        "favoritesCake",
        JSON.stringify(savedMedoviks.filter((item) => item.id !== medovik.id)),
      );
    } else {
      savedMedoviks.push(medovik);
      localStorage.setItem("favoritesCake", JSON.stringify(savedMedoviks));
    }
  } else {
    localStorage.setItem("favoritesCake", JSON.stringify([medovik]));
  }
};

const medoviki = [
  {
    id: 1,
    name: "Кофейный",
    price: 50,
    image: "./img/mobile/cakes/coffee.webp",
    color: "#453628",
  },
  {
    id: 12,
    name: "Карамель",
    price: 50,
    image: "./img/mobile/cakes/caramel.webp",
    color: "#A85101",
  },
  {
    id: 3,
    name: "Черничный",
    price: 50,
    image: "./img/mobile/cakes/blueberry.webp",
    color: "#3F4974",
  },
  {
    id: 4,
    name: "Кокос",
    price: 50,
    image: "./img/mobile/cakes/coconut.webp",
    color: "#F6F2DA",
    isLight: true,
  },
  {
    id: 5,
    name: "Малиновый",
    price: 50,
    image: "./img/mobile/cakes/raspberry.webp",
    color: "#ED6698",
  },
  {
    id: 6,
    name: "Вишнёвый",
    price: 50,
    image: "./img/mobile/cakes/cherry.webp",
    color: "#7F092E",
  },
  {
    id: 7,
    name: "Чизкейк",
    price: 50,
    image: "./img/mobile/cakes/cheese.webp",
    color: "#E7BF7B",
  },
  {
    id: 8,
    name: "Солёная карамель",
    price: 50,
    image: "./img/mobile/cakes/salt-caramel.webp",
    color: "#9A4A00",
  },
];

const content = document.querySelector(".content_mobile");

const menu = new Element("div", ["mobile_menu"]);

const page = new Element("div", ["page"]);

const changePage = (child) => {
  return () => {
    page.restoreHTML();
    page.element.appendChild(child);
  };
};

const medovikiList = new Element(
  "div",
  ["medoviki_list"],
  "<header><h2>MEDOVIKI:</h2></header>",
);
medoviki.forEach((item) => {
  const itemHTML = `
    <img src="${item.image}" alt="${item.name}">
    <div class="medovik_info">
      <div>
        <p>${item.name}</p>
        <p>${item.price} byn</p>
      </div>
    </div>
  `;
  const heartButton = new Element(
    "button",
    ["heart_button"],
    `<img src="./img/mobile/heart.svg">`,
  );
  heartButton.element.addEventListener("click", loveCake(item));

  const medovik = new Element("div", ["medovik"], itemHTML);
  medovik.element.style.backgroundColor = item.color;
  medovik.element.dataset.id = item.id;
  medovik.element.appendChild(heartButton.element);
  medovikiList.element.appendChild(medovik.element);
});

const home = new Element("div", ["home"], homeHTML);
const takeOrder = new Element("button", ["button_mobile"], "Оформить заказ");
takeOrder.element.addEventListener("click", changePage(medovikiList.element));
home.element.appendChild(takeOrder.element);

const yourChoice = new Element("div", ["your_choice"], "<h2>YOU LOVE:<h2>");

const bucket = new Element("div", ["bucket"], "<h2>YOUR CHOICE:<h2>");

const contacts = new Element(
  "div",
  ["mobile_contacts"],
  "<h2>WE ARE HERE:<h2>",
);

const menuItems = [
  {
    icon: "./img/mobile/home.svg",
    function: changePage(home.element),
  },
  {
    icon: "./img/mobile/heart.svg",
    function: changePage(yourChoice.element),
  },
  {
    icon: "./img/mobile/shopping-cart.svg",
    function: changePage(bucket.element),
  },
  {
    icon: "./img/mobile/cake.svg",
    function: changePage(medovikiList.element),
  },
  {
    icon: "./img/mobile/marker.svg",
    function: changePage(contacts.element),
  },
];

menuItems.forEach((item) => {
  const itemHTML = `
    <img src="${item.icon}" alt="Icon">
  `;
  const menuItem = new Element("button", ["mobile_menu_item"], itemHTML);
  menuItem.element.addEventListener("click", item.function);
  menu.element.appendChild(menuItem.element);
});

page.element.appendChild(medovikiList.element);

content.appendChild(menu.element);
content.appendChild(page.element);
