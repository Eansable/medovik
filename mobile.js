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
            <span class="bucket_price">${this.cake.prices[this.weigth]} byn</span>
          </div>
        </div>
        <div class="summary">
          <h3>Итого:</h3>
          <div class="summary_count">
            Количество
            <span class="span_summary_weight">${this.cake.minWeight}кг</span>
          </div>
          <div class="summary_price">
            Цена
            <span class="summary_price span_summary_price">${this.cake.prices[this.weigth]} byn</span>
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
    this.summaryPrice = this.element.querySelector(".span_summary_price");
    this.summaryWeight = this.element.querySelector(".span_summary_weight");

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
    this.checkWeight();
  }
  minusWeight() {
    this.weigth -= 0.5;
    this.bucketWeight.textContent = this.weigth + "кг";
    this.checkWeight();
  }
  checkWeight() {
    if (this.weigth >= this.cake.maxWeight) {
      this.plusButton.disabled = true;
    } else {
      this.plusButton.disabled = false;
    }
    if (this.weigth <= this.cake.minWeight) {
      this.minusButton.disabled = true;
    } else {
      this.minusButton.disabled = false;
    }
    this.summaryPrice.textContent = `${this.cake.prices[this.weigth]} byn`;
    this.bucketPrice.textContent = `${this.cake.prices[this.weigth]} byn`;
    this.summaryWeight.textContent = `${this.weigth}кг`;
  }
  addToBucket() {
    let order = getOrder();
    const item = {
      cake: this.cake,
      weight: this.weigth,
      price: this.cake.prices[this.weigth],
    };
    order.push(item);
    localStorage.setItem("bucket", JSON.stringify(order));
    updateMenuItem();
    bucketModal.element.classList.remove("active");
  }
  changeCake(newCake) {
    this.cake = newCake;
    this.weigth = this.cake.minWeight;
    this.bucketWeight.textContent = this.weigth + "кг";
    this.bucketPrice.textContent = `${this.cake.prices[this.weigth]} byn`;
    this.modalName.textContent = newCake.name;
    this.modalImage.src = newCake.image;
    this.modalImage.alt = newCake.name;
    this.checkWeight();
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
  token = "7402101933:AAG8R-TlNh9UvQiMCm0S97m5CQ_-5nvQsDI";
  chatId = "-1002231985778";
  api = `https://api.telegram.org/bot${this.token}/sendMessage`;
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

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.pickupPlace = this.pickupCafe;
      const order = getOrder();
      const price = order
        .map((item) => item.price)
        .reduce((acc, price) => acc + price, 0);
      const text = `Заказ с мобильной версии.
Тестовый заказ перезванивать не надо!!!
Имя: ${data.name}
Телефон: ${data.phone}
Тип доставки: ${data.delivery === "delivery" ? "Доставка" : "Самовывоз"}
${data.delivery === "pickup" ? `Место самовывоза: ${data.pickupPlace.shortName}` : ""}
${order.map((item, index) => `${index + 1}: ${item.cake.name}, Цена: ${data.delivery === "delivery" ? item.price : item.price * 0.8}, Количество: ${item.weight}кг`).join("\n")}
Сумма: ${data.delivery === "delivery" ? price : price * 0.8}
`;
      const response = await fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
        }),
      });
      if (response.ok) {
        this.orderSuccess();
        localStorage.setItem("bucket", JSON.stringify([]));
        const historyOrder = localStorage.getItem("historyOrder");
        if (!historyOrder) {
          localStorage.setItem("historyOrder", JSON.stringify([order]));
        } else {
          const history = JSON.parse(historyOrder);
          history.push(order);
          localStorage.setItem("historyOrder", JSON.stringify(history));
        }
      }
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

class TabsElement extends Element {
  constructor() {
    super(
      "div",
      ["contacts_tabs"],
      `
      <header>
        <button class="on_map active">На карте</button>
        <button class="list">Список</button>
        </header>
        <div class="contacts_content">
          <div class="mobile_contacts_map"></div>
          <div class="contacts_list hidden">
            <div class="places_list"></div>

            <div class="contacts_links">
              <a href="#" target="_blank">
                <img src="./img/mobile/instagramm.svg">
              </a>
              <a href="#" target="_blank">
                <img src="./img/mobile/tiktok.svg">
              </a>
              <a href="#" target="_blank">
                <img src="./img/mobile/email.svg">
              </a>
              <a href="#" target="_blank">
                <img src="./img/mobile/yandex.svg">
              </a>
            </div>
            <div class="photo_gallery"></div>
          </div>
        </div>
        </div>
    `,
    );
    this.element.querySelector(".places_list").innerHTML = this.renderPlaces();
    this.element.querySelector(".photo_gallery").innerHTML =
      this.renderGallery();
    this.mapContent = this.element.querySelector(".mobile_contacts_map");
    this.listContent = this.element.querySelector(".contacts_list");
    this.onMapButton = this.element.querySelector(".on_map");
    this.listButton = this.element.querySelector(".list");
    this.onMapButton.addEventListener("click", this.showMap.bind(this));
    this.listButton.addEventListener("click", this.showList.bind(this));
  }
  showMap() {
    this.onMapButton.classList.add("active");
    this.listButton.classList.remove("active");
    this.mapContent.classList.remove("hidden");
    this.listContent.classList.add("hidden");
  }
  showList() {
    this.listContent.classList.remove("hidden");
    this.mapContent.classList.add("hidden");
    this.listButton.classList.add("active");
    this.onMapButton.classList.remove("active");
  }
  initMap() {
    const container = document.querySelector(".mobile_contacts_map");
    container.innerHTML = "";
    const map = new ymaps.Map(container, {
      center: [53.923118, 27.589986],
      zoom: 16,
    });
    map.controls.remove("geolocationControl"); // удаляем геолокацию
    map.controls.remove("searchControl"); // удаляем поиск
    map.controls.remove("trafficControl"); // удаляем контроль трафика
    map.controls.remove("typeSelector"); // удаляем тип
    map.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
    map.controls.remove("zoomControl"); // удаляем контрол зуммирования
    map.controls.remove("rulerControl"); // удаляем контрол правил
    cafes.forEach((cafe) => {
      const marker = new ymaps.Placemark(cafe.coords, {}, markerSetting);
      map.geoObjects.add(marker);
    });
  }
  renderPlaces() {
    let placesHtml = "";
    cafes.forEach((cafe) => {
      placesHtml += `
        <div class="place">
          <img src="./img/mobile/yellowMarker.svg" alt="">
          <div>
            <p>${cafe.name}</h3>
            <div>${cafe.workTime}</div>
          </div>
        </div>
      `;
    });
    return placesHtml;
  }
  renderGallery() {
    let galleryHtml = "";
    cafes.forEach((cafe) => {
      if (cafe.imgUrl)
        galleryHtml += `
          <img src="${cafe.imgUrl}" alt="${cafe.shortName}">
      `;
    });
    return galleryHtml;
  }
}

const updateMenuItem = () => {
  const order = getOrder();
  const bucketNumber = document.querySelector(".bucket_number");
  bucketNumber.textContent = order.length;
  if (!order.length) {
    bucketNumber.classList.add("hidden");
  } else {
    bucketNumber.classList.remove("hidden");
  }
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
Наша цель — подарить каждому гостю незабываемый вкус и радость от каждого кусочка наших медовиков.</p>
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

const markerSetting = {
  iconLayout: "default#image",
  iconImageHref: "./img/marker.png",
};

const cafes = [
  {
    id: 1,
    name: "Ложинская 22-2 (Отдельный вход, здание Дмитриева Кирмаша)",
    shortName: "Ложинская 22-2",
    coords: [53.951694, 27.682236],
    imgUrl: "./img/mobile/contacts/lojinskaya.jpg",
    workTime: `<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`,
  },
  {
    id: 2,
    name: "Якуба Коласа 25/1",
    shortName: "Якуба Коласа 25/1",
    coords: [53.923118, 27.589986],
    imgUrl: "./img/mobile/contacts/kolas.jpg",
    workTime: `<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`,
  },
  {
    id: 3,
    name: "Пр. Независимости 92 (Вход общий с OZ.by)",
    shortName: "Пр. Независимости 92",
    coords: [53.927709, 27.629284],
    imgUrl: "./img/mobile/contacts/independed.jpg",
    workTime: `<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`,
  },
  {
    id: 4,
    name: "Уманская 54 ТЦ Глобо (Главный вход)",
    shortName: "Уманская 54 ТЦ Глобо",
    coords: [53.875219, 27.498267],
    imgUrl: "./img/mobile/contacts/globo.jpg",
    workTime: `<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`,
  },
  {
    id: 5,
    name: "Московская 22",
    shortName: "Московская 22",
    coords: [53.886493, 27.537121],
    imgUrl: "",
    workTime: `<p>Пн-Bc 10:00-21:00</p>`,
  },
];

const medoviki = [
  {
    id: 10,
    name: "Классический",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/classic.jpg",
    color: "#AF7330",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 5,
    name: "Малиновый",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/raspberry.webp",
    color: "#ED6698",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 11,
    name: "Лимонный",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/lemon.jpg",
    color: "#DBD228",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 3,
    name: "Черничный",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/blueberry.webp",
    color: "#3F4974",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 1,
    name: "Кофейный",
    price: 50,
    prices: {
      1: 52,
      1.5: 75,
      2: 96,
      2.5: 122,
      3: 148,
    },
    image: "./img/mobile/cakes/coffee.webp",
    color: "#453628",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 12,
    name: "Солёная карамель",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/caramel.webp",
    color: "#A85101",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 6,
    name: "Двойная вишня",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/cherry.webp",
    color: "#7F092E",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 4,
    name: "Рафаэлло",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/coconut.webp",
    color: "#F6F2DA",
    isLight: true,
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 13,
    name: "Нутелла",
    price: 50,
    prices: {
      1: 58,
      1.5: 88,
      2: 110,
      2.5: 139,
      3: 168,
    },
    image: "./img/mobile/cakes/nutella.jpg",
    color: "#572912",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 9,
    name: "Наполеон",
    price: 50,
    prices: {
      1: 50,
      1.5: 71,
      2: 87,
      2.5: 113,
      3: 139,
    },
    image: "./img/mobile/cakes/napoleon.webp",
    color: "#DE9F65",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 8,
    name: "Наполеон солёная карамель",
    price: 50,
    prices: {
      1: 55,
      1.5: 77,
      2: 93,
      2.5: 122,
      3: 151,
    },
    image: "./img/mobile/cakes/salt-caramel.webp",
    color: "#9A4A00",
    maxWeight: 3,
    minWeight: 1,
  },
  {
    id: 7,
    name: "Чизкейк",
    price: 50,
    prices: {
      1: 69,
      1.5: 102,
    },
    image: "./img/mobile/cakes/cheese.webp",
    color: "#E7BF7B",
    maxWeight: 1.5,
    minWeight: 1,
  },
];

const removeCakeForOrder = (itemId) => {
  const order = getOrder();
  const updatedOrder = order.filter(
    (orderItem) => orderItem.cake.id !== itemId,
  );
  const orderList = document.querySelector(".cards");
  orderList.innerHTML = "";
  updatedOrder.forEach((item) => {
    createCakeCard({ ...item.cake, price: item.price }, orderList, {
      isBucketPage: true,
    });
  });
  const finishOrder = document.querySelector(".bucket_order");
  finishOrder.innerHTML = `<p>Оформить заказ</p>
  <span>
  ${updatedOrder.map((item) => item.weight).reduce((acc, weight) => acc + weight, 0)}кг,
  ${updatedOrder.map((item) => item.price).reduce((acc, price) => acc + price, 0)}byn
  </span>`;
  localStorage.setItem("bucket", JSON.stringify(updatedOrder));
  updateMenuItem();
};

const createCakeCard = (item, page, settings = {}) => {
  const itemHTML = `
    <img src="${item.image}" alt="${item.name}">
    <div class="medovik_info">
      <div>
        <p>${item.name}</p>
        <p>${settings.isBucketPage ? item.price : item.prices[1]} byn</p>
      </div>
      ${
        settings.isBucketPage
          ? `<div class="card_weight">
        <p>Масса</p>
        <p>${item.weight} кг</p>
        </div>`
          : ""
      }
    </div>
  `;
  const heartButton = new Element(
    "button",
    ["heart_button"],
    `<img src="./img/mobile/heart.svg"><img src="./img/mobile/yellowHeart.svg">`,
  );
  heartButton.element.addEventListener(
    "click",
    loveCake(item, settings.isLikedPage ? page : null),
  );

  const medovik = new Element("div", ["medovik"], itemHTML);
  // const weightSelect = medovik.element.querySelector(".card_weight");
  // weightSelect.addEventListener("click", () => {
  //   weightSelect.classList.toggle("open");
  // });
  if (item.isLight) {
    medovik.element.classList.add("light");
  }
  medovik.element.style.backgroundColor = item.color;
  medovik.element.dataset.id = item.id;
  medovik.element.appendChild(heartButton.element);
  const takeToBucket = new Element(
    "button",
    ["button_mobile"],
    settings.isBucketPage ? "Удалить" : "В корзину",
  );
  takeToBucket.element.addEventListener("click", () => {
    if (settings.isBucketPage) {
      removeCakeForOrder(item.id);
    } else {
      bucketModal.show(item);
    }
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
      createCakeCard(item, cardsElem.element, { isLikedPage: true });
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
        createCakeCard(
          { ...item.cake, price: item.price, weight: item.weight },
          orderList,
          {
            isBucketPage: true,
          },
        );
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

const changeMapPage = (child, initMap) => {
  return () => {
    ymaps.ready(initMap.initMap);
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
const contactsTabs = new TabsElement();
contacts.element.appendChild(contactsTabs.element);

const menuItems = [
  {
    icon: "./img/mobile/home.svg",
    activeIcon: "./img/mobile/yellowHome.svg",
    function: changePage(home.element),
  },
  {
    icon: "./img/mobile/heart.svg",
    activeIcon: "./img/mobile/yellowHeart.svg",
    function: changeYourChoicePage(yourChoice.element),
  },
  {
    icon: "./img/mobile/shopping-cart.svg",
    activeIcon: "./img/mobile/yellowShoppingCart.svg",
    function: changeBucketPage(bucket.element),
    isNumber: true,
  },
  {
    icon: "./img/mobile/cake.svg",
    activeIcon: "./img/mobile/yellowCake.svg",
    function: changeListPage(medovikiList.element),
  },
  {
    icon: "./img/mobile/marker.svg",
    activeIcon: "./img/mobile/yellowMarker.svg",
    function: changeMapPage(contacts.element, contactsTabs),
  },
];

menuItems.forEach((item) => {
  const itemHTML = `
    <img src="${item.icon}" alt="Icon">
    <img src="${item.activeIcon}" class="icon-active" alt="Icon">
  `;
  const menuItem = new Element("button", ["mobile_menu_item"], itemHTML);
  if (item.isNumber) {
    const bucket = getOrder();
    const bucketNumber = new Element("span", ["bucket_number"], bucket.length);
    menuItem.element.appendChild(bucketNumber.element);
    if (!bucket.length) {
      bucketNumber.element.classList.add("hidden");
    }
  }
  menuItem.element.addEventListener("click", () => {
    const allMenuItems = menu.element.querySelectorAll(".mobile_menu_item");
    allMenuItems.forEach((button) => button.classList.remove("active"));
    menuItem.element.classList.add("active");
    item.function();
  });
  menu.element.appendChild(menuItem.element);
});

page.element.appendChild(home.element);

content.appendChild(menu.element);
content.appendChild(page.element);
content.appendChild(bucketModal.element);
