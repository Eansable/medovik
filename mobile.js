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

const getOrder = () => {
  const order = localStorage.getItem("bucket");
  if (!order) {
    return [];
  }
  return JSON.parse(order);
};

class BucketElement extends Element {
  weigth = 1;
  plusButton;
  minusButton;
  addToBucketButton;
  cake = medoviki[0];
  constructor() {
    super("div", ["bucket_modal"]);
    this.element.innerHTML = `
      <div class="bucket_modal_content">
        <header>
          <span class="modal_name">${this.cake.name}</span>
          <button class="close-button">
            <img src="./img/mobile/cross.svg">
          </button>
        </header>
        <div class="bucket_medovik_info">
          <img class="modal_image" src="${this.cake.image}" alt="${this.cake.name}">
          <div class="manage_count">
            <button class="minus-button">-</button>
            <span class="bucket_weight">${this.weigth}кг</span>
            <button class="plus-button">+</button>
            <span class="bucket_price">${this.cake.price} byn</span>
          </div>
        </div>
        <div class="summary">
          <h3>Итого:</h3>
          <div class="summary_count">
            Количество
            <span>${this.weigth}кг</span>
          </div>
          <div class="summary_price">
            Цена
            <span class="summary_price">${this.cake.price} byn</span>
          </div>
        </div>
        <div class="min_order"> Минимальная сумма зазказа 50 руб, или 1 кг торта</div>
        <button class="add_to_bucket"> В корзину </button>
      </div>

    `;
    this.modalName = this.element.querySelector(".modal_name");
    this.modalImage = this.element.querySelector(".modal_image");
    this.bucketWeight = this.element.querySelector(".bucket_weight");
    this.bucketPrice = this.element.querySelector(".bucket_price");
    this.closeButton = this.element.querySelector(".close-button");
    this.addToBucketButton = this.element.querySelector(".add_to_bucket");
    this.plusButton = this.element.querySelector(".plus-button");
    this.minusButton = this.element.querySelector(".minus-button");

    this.addToBucketButton.addEventListener("click", () => {
      this.addToBucket();
    });
    this.closeButton.addEventListener("click", () => {
      this.hide();
    });
    this.plusButton.addEventListener("click", () => this.addWeight());
    this.minusButton.addEventListener("click", () => this.minusWeight());
  }
  show(cake) {
    this.changeCake(cake);
    this.element.classList.add("active");
  }
  hide() {
    this.cake = null;
    this.weigth = 1;
    this.bucketWeight.textContent = this.weigth + "кг";
    this.minusButton.disabled = true;
    this.element.classList.remove("active");
  }
  addWeight() {
    this.weigth += 0.5;
    this.bucketWeight.textContent = this.weigth + "кг";
    this.minusButton.disabled = false;
  }
  minusWeight() {
    if (this.weigth > 1) {
      this.weigth -= 0.5;
      this.bucketWeight.textContent = this.weigth + "кг";
    }
    if (this.weigth === 1) {
      this.minusButton.disabled = true;
    }
  }
  addToBucket() {
    let order = getOrder();
    const item = {
      cake: this.cake,
      weight: this.weigth,
      price: this.cake.price * this.weigth,
    };
    if (order.some((i) => i.cake.id === item.cake.id)) {
      const index = order.findIndex((i) => i.cake.id === item.cake.id);
      order[index] = item;
    } else {
      order.push(item);
    }
    localStorage.setItem("bucket", JSON.stringify(order));
    updateMenuItem();
    bucketModal.element.classList.remove("active");
  }
  changeCake(newCake) {
    this.cake = newCake;
    this.bucketWeight.textContent = this.weigth + "кг";
    this.bucketPrice.textContent = `${this.cake.price} byn`;
    this.modalName.textContent = newCake.name;
    this.modalImage.src = newCake.image;
    this.modalImage.alt = newCake.name;
  }
}

const input = document.getElementById("phone");

const COUNTRY = "375";
const OPERATORS = ["29", "44", "33", "25"];
const MAX_DIGITS = 12;

function getDigits(value) {
  return value.replace(/\D/g, "");
}

function formatPhone(digits) {
  let result = "+375";

  if (digits.length > 3) {
    result += "(" + digits.slice(3, 5);
  }

  if (digits.length > 5) {
    result += ")" + digits.slice(5);
  }

  return result;
}

class OrderElement extends Element {
  name = "";
  phone = "";
  deliveryType = "delivery";
  pickupCafe;
  constructor() {
    super("div", ["order_modal"]);
    this.element.innerHTML = `
      <div class="order_modal_content">
        <header>
          <button class="close-button">
            <img src="./img/mobile/cross.svg">
          </button>
        </header>
        <div class="static_info">
          <h3>Оформить заказ</h3>
          <p>Заполните форму и мы вам перезвоним для того, чтобы принять ваш заказ!</p>
        </div>
        <form class="order_person_info" id="orderForm">
          <input name="name" placeholder="Имя" class="order_name" required >
          <input name="phone" type="tel" placeholder="Телефон" class="order_phone" required>
        <div class="delivery_type">
        <label class="radio">
          <input type="radio" name="delivery" value="delivery" checked>
          <span class="radio__custom"></span>
          <span class="radio__text">Доставка</span>
        </label>

        <label class="radio">
          <input type="radio" name="delivery" value="pickup">
          <span class="radio__custom"></span>
          <span class="radio__text radio__text--pickup">Самовывоз</span>
        </label>
        </div>
        <div class="pickupBlock hidden">
          <span>Выбрать пункт самовывоза</span> <img src="img/mobile/blueArrow.svg" alt="">
          <div class="select-cafes close">

          </div>
        </div>
        <button class="order_cakes">Оформить заказ</button>

        </form>
        <div class="order_success">
          <span>Ваш заказ оформлен, скоро вам перезвонит наш специалист.</span> <span>Хорошего дня!</span>
        </div>
      </div>
    `;
    this.form = this.element.querySelector(".order_person_info");
    this.radios = document.querySelectorAll('input[name="deliveryType"]');
    this.radioPickupText = this.element.querySelector(".radio__text--pickup");
    this.inputName = this.element.querySelector(".order_name");
    this.inputPhone = this.element.querySelector(".order_phone");
    this.closeButton = this.element.querySelector(".close-button");
    this.orderButton = this.element.querySelector(".order_cakes");
    this.pickupBlock = this.element.querySelector(".pickupBlock");

    this.selectCafes = this.element.querySelector(".select-cafes");

    this.pickupBlock.addEventListener("click", (event) => {
      event.stopPropagation();
      this.selectCafes.classList.toggle("close");
    });

    cafes.forEach((cafe) => {
      const cafeElement = document.createElement("div");
      cafeElement.classList.add("cafe");
      cafeElement.textContent = cafe.name;
      cafeElement.addEventListener("click", (event) => {
        event.stopPropagation();
        this.selectPickupCafe(cafe);
      });
      this.selectCafes.appendChild(cafeElement);
    });

    this.closeButton.addEventListener("click", () => {
      this.hide();
    });

    this.inputPhone.addEventListener("focus", () => {
      if (!this.inputPhone.value) {
        this.inputPhone.value = "+375(";
      }
    });

    this.inputPhone.addEventListener("input", () => {
      let digits = getDigits(this.inputPhone.value);

      if (!digits.startsWith(COUNTRY)) {
        digits = COUNTRY + digits;
      }

      digits = digits.slice(0, MAX_DIGITS);

      if (digits.length >= 5) {
        const operator = digits.slice(3, 5);
        if (!OPERATORS.includes(operator)) {
          digits = digits.slice(0, 3);
        }
      }

      this.inputPhone.value = formatPhone(digits);
      this.inputPhone.setSelectionRange(
        this.inputPhone.value.length,
        this.inputPhone.value.length,
      );
    });

    this.inputPhone.addEventListener("blur", () => {
      const digits = getDigits(this.inputPhone.value);

      if (digits.length !== MAX_DIGITS) {
        this.inputPhone.value = "";
      }
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      console.log(data);
    });
    this.form.addEventListener("change", (e) => {
      const isPickup = e.target.value === "pickup";
      this.pickupBlock.classList.toggle("hidden", !isPickup);
      this.selectCafes.classList.toggle("close", !isPickup);
    });
  }
  show() {
    this.element.classList.add("active");
  }
  hide() {
    this.name = "";
    this.inputName.value = "";
    this.phone = "";
    this.inputPhone.value = "";
    this.element.classList.remove("active");
    this.element
      .querySelector(".order_modal_content")
      .classList.remove("message_success");
  }
  selectPickupCafe(cafe) {
    this.pickupCafe = cafe;
    this.selectCafes.classList.add("close");
    this.radioPickupText.innerText = `Самовывоз(${cafe.shortName})`;
  }
  orderSuccess() {
    this.element
      .querySelector(".order_modal_content")
      .classList.add("message_success");
  }
}

const updateMenuItem = () => {
  const order = getOrder();
  const bucketNumber = document.querySelector(".bucket_number");
  bucketNumber.textContent = order.length;
};

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

const cafes = [
  {
    id: 1,
    name: "Ложинская 22-2 (Отдельный вход, здание Дмитриева Кирмаша)",
    shortName: "Ложинская 22-2",
  },
  {
    id: 2,
    name: "Якуба Коласа 25/1",
    shortName: "Якуба Коласа 25/1",
  },
  {
    id: 3,
    name: "Пр. Независимости 92 (Вход общий с OZ.by)",
    shortName: "Пр. Независимости 92",
  },
  {
    id: 4,
    name: "Уманская 54 ТЦ Глобо (Главный вход)",
    shortName: "Уманская 54 ТЦ Глобо",
  },
];

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
    bucketModal.show(item);
  });
  medovik.element.appendChild(takeToBucket.element);
  page.appendChild(medovik.element);
  if (hasLikedMedovik(item.id)) {
    medovik.element.classList.add("liked");
  }
};

const bucketModal = new BucketElement();
bucketModal.element.addEventListener("click", () => {
  bucketModal.hide();
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

const changeBucketPage = (child) => {
  return () => {
    const cakesElements = child.querySelectorAll(".medovik");
    const order = getOrder();
    order.forEach((item) => {
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
    const orderList = child.querySelector(".cards");
    if (order?.length) {
      orderList.innerHTML = "";
      order.forEach((item) => {
        createCakeCard({ ...item.cake, price: item.price }, orderList);
      });
    }
    const finishOrder = child.querySelector(".bucket_order");
    finishOrder.innerHTML = `<p>Оформить заказ</p>
    <span>
    ${order.map((item) => item.weight).reduce((acc, weight) => acc + weight, 0)}кг,
    ${order.map((item) => item.price).reduce((acc, price) => acc + price, 0)}byn
    </span>`;
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

const bucket = new Element(
  "div",
  ["bucket"],
  "<header><h2>YOUR CHOICE:</h2></header>",
);
const orderList = new Element("div", ["cards"]);
bucket.element.appendChild(orderList.element);
const order = getOrder();
const finishOrder = new Element(
  "button",
  ["bucket_order"],
  `<p>Оформить заказ</p>
  <span>
  ${order.map((item) => item.weight).reduce((acc, weight) => acc + weight, 0)}кг,
  ${order.map((item) => item.price).reduce((acc, price) => acc + price, 0)}byn
  </span>`,
);
finishOrder.element.addEventListener("click", () => {
  orderModal.show();
});
bucket.element.appendChild(finishOrder.element);

const orderModal = new OrderElement();
orderModal.element.addEventListener("click", () => {
  orderModal.hide();
});
const orderModalContent = orderModal.element.querySelector(
  ".order_modal_content",
);
orderModalContent.addEventListener("click", (event) => {
  event.stopPropagation();
});
bucket.element.appendChild(orderModal.element);

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
    function: changeBucketPage(bucket.element),
    isNumber: true,
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
  if (item.isNumber) {
    const bucket = getOrder();
    if (bucket?.length)
      menuItem.element.appendChild(
        new Element("span", ["bucket_number"], bucket.length).element,
      );
  }
  menuItem.element.addEventListener("click", item.function);
  menu.element.appendChild(menuItem.element);
});

page.element.appendChild(medovikiList.element);

content.appendChild(menu.element);
content.appendChild(page.element);
content.appendChild(bucketModal.element);
