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

const loveCake = (medovik, likedPage) => (event) => {
  const cakesElements = document.querySelectorAll(".medovik");
  let cake;
  cakesElements.forEach((elem) => {
    if (+elem.dataset.id === medovik.id) cake = elem;
  });
  const savedMedoviksStr = localStorage.getItem("favoritesCake");
  if (savedMedoviksStr) {
    const savedMedoviks = JSON.parse(savedMedoviksStr);
    if (savedMedoviks.some((item) => item.id === medovik.id)) {
      localStorage.setItem(
        "favoritesCake",
        JSON.stringify(savedMedoviks.filter((item) => item.id !== medovik.id)),
      );
      cake.classList.remove("liked");
    } else {
      savedMedoviks.push(medovik);
      localStorage.setItem("favoritesCake", JSON.stringify(savedMedoviks));
      cake.classList.add("liked");
    }
  } else {
    localStorage.setItem("favoritesCake", JSON.stringify([medovik]));
    cake.classList.add("liked");
  }
  if (likedPage) {
    renderYourChoiceCakes(likedPage);
  }
};

const hasLikedMedovik = (medovikId) => {
  const savedMedoviksStr = localStorage.getItem("favoritesCake");
  if (savedMedoviksStr) {
    const savedMedoviks = JSON.parse(savedMedoviksStr);
    return savedMedoviks.some((item) => item.id === medovikId);
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
let choosedCake;

const renderBucketModalContent = () => {
  if (!choosedCake) return;
  bucketModalContent.innerHTML = `<header>
    ${choosedCake.name}
    <button class="close-button">
    <img src="./img/mobile/cross.svg">
    </button>
    </header>
    <div class="bucket_medovik_info">
      <img src="${choosedCake.image}" alt="${choosedCake.name}">
      <div class="manage_count"> </div>
    </div>
    `;
  const closeButton = bucketModalContent.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    bucketModal.element.classList.remove("active");
  });
};

const createCakeCard = (item, page, isLikedPage = false) => {
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
    `<img src="./img/mobile/heart.svg"><img src="./img/mobile/yellowHeart.svg">`,
  );
  heartButton.element.addEventListener(
    "click",
    loveCake(item, isLikedPage ? page : null),
  );

  const medovik = new Element("div", ["medovik"], itemHTML);
  if (item.isLight) {
    medovik.element.classList.add("light");
  }
  medovik.element.style.backgroundColor = item.color;
  medovik.element.dataset.id = item.id;
  medovik.element.appendChild(heartButton.element);
  const takeToBucket = new Element("button", ["button_mobile"], "В корзину");
  takeToBucket.element.addEventListener("click", () => {
    choosedCake = item;
    bucketModal.element.classList.add("active");
    renderBucketModalContent();
  });
  medovik.element.appendChild(takeToBucket.element);
  page.appendChild(medovik.element);
  if (hasLikedMedovik(item.id)) {
    medovik.element.classList.add("liked");
  }
};

const bucketModal = new Element(
  "div",
  ["bucket_modal"],
  `<div class="bucket_modal_content"></div>`,
);
bucketModal.element.addEventListener("click", () => {
  bucketModal.element.classList.remove("active");
});
const bucketModalContent = bucketModal.element.querySelector(
  ".bucket_modal_content",
);
bucketModalContent.addEventListener("click", (event) => {
  event.stopPropagation();
});

const content = document.querySelector(".content_mobile");

const menu = new Element("div", ["mobile_menu"]);

const page = new Element("div", ["page"]);

const renderYourChoiceCakes = (child) => {
  child.innerHTML =
    "<header><h2>YOU<img src='./img/mobile/yellowHeart.svg' alt=''>:</h2></header>";
  const savedMedoviksStr = localStorage.getItem("favoritesCake");
  if (savedMedoviksStr) {
    const savedMedoviks = JSON.parse(savedMedoviksStr);
    const cardsElem = new Element("div", ["cards"]);
    savedMedoviks.forEach((item) => {
      createCakeCard(item, cardsElem.element, true);
    });
    child.appendChild(cardsElem.element);
  }
};

const changePage = (child) => {
  return () => {
    page.restoreHTML();
    page.element.appendChild(child);
  };
};

const changeYourChoicePage = (child) => {
  return () => {
    renderYourChoiceCakes(child);
    page.restoreHTML();
    page.element.appendChild(child);
  };
};

const changeListPage = (child) => {
  return () => {
    const cakesElements = child.querySelectorAll(".medovik");
    medoviki.forEach((item) => {
      const elem = Array.from(cakesElements).find(
        (elem) => +elem.dataset.id === item.id,
      );
      if (elem) {
        if (hasLikedMedovik(item.id)) {
          elem.classList.add("liked");
        } else {
          elem.classList.remove("liked");
        }
      }
    });
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
  createCakeCard(item, medovikiList.element);
});

const home = new Element("div", ["home"], homeHTML);
const takeOrder = new Element("button", ["button_mobile"], "Оформить заказ");
takeOrder.element.addEventListener("click", changePage(medovikiList.element));
home.element.appendChild(takeOrder.element);

const yourChoice = new Element(
  "div",
  ["your_choice"],
  "<header><h2>YOU<img src='./img/mobile/yellowHeart.svg' alt=''>:</h2></header>",
);

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
    function: changeYourChoicePage(yourChoice.element),
  },
  {
    icon: "./img/mobile/shopping-cart.svg",
    function: changePage(bucket.element),
  },
  {
    icon: "./img/mobile/cake.svg",
    function: changeListPage(medovikiList.element),
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
content.appendChild(bucketModal.element);
