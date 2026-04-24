class Element{element;constructor(e="div",t=[],i=""){let s=document.createElement(e);s.classList.add(t),s.innerHTML=i,this.element=s}restoreHTML(){this.element.innerHTML=""}}const getOrder=()=>{let e=localStorage.getItem("bucket");return e?JSON.parse(e):[]},formatDate=e=>`${e.getFullYear()}-${e.getMonth()}-${e.getDate()}`,months=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",],daysShort=["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];class CalendarElement extends Element{dateString="";currentMonth=new Date().getMonth();selectedDate=new Date;constructor(){super("div",["picker_overlay"],`
      <div class="calendar_element">
      <button class="close-button close-picker-button">
        <img src="./img/mobile/cross.svg">
      </button>
      <p>Выберите дату</p>
      <div class='choose_date_string'>
      </div>
      <div class='choose_month'>
        <div class='month_current'></div>
        <div>
        <button class='month_prev'>
          <img src='./img/mobile/arrow.svg' alt='prev'>
        </button>
        <button class='month_next'>
          <img src='./img/mobile/arrow.svg' alt='next'>
        </button>
        </div>

      </div>
      <div class='calendar_picker'>
        <header>${daysShort.map(e=>`<span>${e}</span>`).join("")}</header>
        <div class='calendar_days'></div>
      </div>
      </div>
      `),this.element.style.display="none",this.chooseDateString=this.element.querySelector(".choose_date_string"),this.monthCurrent=this.element.querySelector(".month_current"),this.monthPrev=this.element.querySelector(".month_prev"),this.monthNext=this.element.querySelector(".month_next"),this.calendarDays=this.element.querySelector(".calendar_days"),this.closeButton=this.element.querySelector(".close-picker-button"),this.closeButton.addEventListener("click",()=>{this.hide()}),this.monthNext.addEventListener("click",()=>{this.changeCurrentMonth(this.currentMonth+1)}),this.monthPrev.addEventListener("click",()=>{this.changeCurrentMonth(this.currentMonth-1)}),this.updateDate()}updateDate(e=new Date){this.dateString=this.formatStringDate(e),this.chooseDateString.innerHTML=this.dateString,this.changeCurrentMonth(e.getMonth()),this.selectedDate=e,this.button&&(this.button.innerHTML=this.format(e)),this.renderDays()}changeCurrentMonth(e){this.currentMonth=e,e<=new Date().getMonth()?this.monthPrev.disabled=!0:this.monthPrev.disabled=!1;let t=new Date;t.setDate(1),t.setMonth(this.currentMonth),this.monthCurrent.innerHTML=this.formatMonth(t),this.renderDays()}renderDays(){let e=new Date(new Date().getFullYear(),this.currentMonth+1,0).getDate(),t=Array(e).fill(0).map((e,t)=>t+1);this.calendarDays.innerHTML="",t.forEach(e=>{let t=new Date;t.setDate(e),t.setMonth(this.currentMonth);let i=formatDate(t)===formatDate(new Date),s=t<new Date,a=formatDate(t)===formatDate(this.selectedDate),n=document.createElement("span");n.textContent=e,i&&n.classList.add("today"),s&&n.classList.add("early"),a&&n.classList.add("selected"),n.style.gridColumnStart=t.getDay()%7+1,s||n.addEventListener("click",e=>{e.stopPropagation(),this.updateDate(t),this.hide()}),this.calendarDays.appendChild(n)})}format(e=this.selectedDate){let t=`${e.getDate()}`.padStart(2,"0"),i=`${e.getMonth()+1}`.padStart(2,"0");return`${t}.${i}.${e.getFullYear()}`}formatMonth(e){return`${months[e.getMonth()]} ${e.getFullYear()}`}formatStringDate(e){return`${daysShort[e.getDay()]}, ${months[e.getMonth()]} ${e.getDate()}`}hide(){this.element.style.display="none"}show(e){this.button=e,this.element.style.display="block"}}class BucketElement extends Element{weigth=1;plusButton;minusButton;addToBucketButton;cake=medoviki[0];constructor(){super("div",["bucket_modal"]),this.element.innerHTML=`
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

    `,this.modalName=this.element.querySelector(".modal_name"),this.modalImage=this.element.querySelector(".modal_image"),this.bucketWeight=this.element.querySelector(".bucket_weight"),this.bucketPrice=this.element.querySelector(".bucket_price"),this.closeButton=this.element.querySelector(".close-button"),this.addToBucketButton=this.element.querySelector(".add_to_bucket"),this.plusButton=this.element.querySelector(".plus-button"),this.minusButton=this.element.querySelector(".minus-button"),this.summaryPrice=this.element.querySelector(".span_summary_price"),this.summaryWeight=this.element.querySelector(".span_summary_weight"),this.addToBucketButton.addEventListener("click",()=>{this.addToBucket()}),this.closeButton.addEventListener("click",()=>{this.hide()}),this.plusButton.addEventListener("click",()=>this.addWeight()),this.minusButton.addEventListener("click",()=>this.minusWeight())}show(e){this.changeCake(e),this.element.classList.add("active")}hide(){this.cake=null,this.weigth=1,this.bucketWeight.textContent=this.weigth+"кг",this.minusButton.disabled=!0,this.element.classList.remove("active")}addWeight(){this.weigth+=.5,this.bucketWeight.textContent=this.weigth+"кг",this.checkWeight()}minusWeight(){this.weigth-=.5,this.bucketWeight.textContent=this.weigth+"кг",this.checkWeight()}checkWeight(){this.weigth>=this.cake.maxWeight?this.plusButton.disabled=!0:this.plusButton.disabled=!1,this.weigth<=this.cake.minWeight?this.minusButton.disabled=!0:this.minusButton.disabled=!1,this.summaryPrice.textContent=`${this.cake.prices[this.weigth]} byn`,this.bucketPrice.textContent=`${this.cake.prices[this.weigth]} byn`,this.summaryWeight.textContent=`${this.weigth}кг`}addToBucket(){let e=getOrder(),t={cake:this.cake,weight:this.weigth,price:this.cake.prices[this.weigth]};e.push(t),localStorage.setItem("bucket",JSON.stringify(e)),updateMenuItem(),bucketModal.element.classList.remove("active")}changeCake(e){this.cake=e,this.weigth=this.cake.minWeight,this.bucketWeight.textContent=this.weigth+"кг",this.bucketPrice.textContent=`${this.cake.prices[this.weigth]} byn`,this.modalName.textContent=e.name,this.modalImage.src=e.image,this.modalImage.alt=e.name,this.checkWeight()}}const input=document.getElementById("phone"),OPERATORS=["29","44","33","25"],MAX_DIGITS=9;function getDigits(e){return e.replace(/\D/g,"")}class OrderElement extends Element{token="7402101933:AAG8R-TlNh9UvQiMCm0S97m5CQ_-5nvQsDI";chatId="-1002231985778";api=`https://api.telegram.org/bot${this.token}/sendMessage`;name="";phone="";deliveryType="delivery";pickupCafe;time="не указано";constructor(){super("div",["order_modal"]),this.element.innerHTML=`
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
          <div class="order_phone_container">+375 <input name="phone" type="tel" placeholder="Телефон" class="order_phone" required></div>
          <button type="button" class="date_picker">Дата доставки <img src="./img/mobile/calendar.svg" alt=""></button>
          <div class="custom-select" id="select">
            <div class="select-header">
              <span class="select-current">Выберите время</span>
              <span class="select-arrow">▼</span>
            </div>

            <div class="select-body">
              <div class="select-item" data-value="1">10:00 - 11:00</div>
              <div class="select-item" data-value="2">11:00 - 12:00</div>
              <div class="select-item" data-value="3">12:00 - 13:00</div>
              <div class="select-item" data-value="4">13:00 - 14:00</div>
              <div class="select-item" data-value="5">14:00 - 15:00</div>
              <div class="select-item" data-value="6">15:00 - 16:00</div>
              <div class="select-item" data-value="7">16:00 - 17:00</div>
              <div class="select-item" data-value="8">17:00 - 18:00</div>
              <div class="select-item" data-value="9">18:00 - 19:00</div>
              <div class="select-item" data-value="10">19:00 - 20:00</div>
            </div>
          </div>
        <div class="delivery_type">
        <label class="radio">
          <input type="radio" name="delivery" value="delivery" checked>
          <span class="radio__custom"></span>
          <span class="radio__text">Доставка (стоимость доставки 5 BYN)</span>
        </label>
          <input name="address" placeholder="Адрес" class="order_address" >

        <label class="radio">
          <input type="radio" name="delivery" value="pickup">
          <span class="radio__custom"></span>
          <span class="radio__text radio__text--pickup">Самовывоз (<span class="font-bold">скидка 20%</span>)</span>
        </label>
        </div>

        <div class="custom-select-pickup hidden">
          <div class="select-header">
            <span class="select-current">Выберите пункт самовывоза</span>
            <span class="select-arrow">▼</span>
          </div>

          <div class="select-cafes">

          </div>
        </div>
        <button class="order_cakes">Оформить заказ</button>

        </form>
        <div class="order_success">
          <span>Ваш заказ оформлен, скоро вам перезвонит наш специалист.</span> <span>Хорошего дня!</span>
        </div>
      </div>
    `,this.form=this.element.querySelector(".order_person_info"),this.radios=document.querySelectorAll('input[name="deliveryType"]'),this.radioPickupText=this.element.querySelector(".radio__text--pickup"),this.inputName=this.element.querySelector(".order_name"),this.inputPhone=this.element.querySelector(".order_phone"),this.inputAddress=this.element.querySelector(".order_address"),this.closeButton=this.element.querySelector(".close-button"),this.orderButton=this.element.querySelector(".order_cakes"),this.orderModalContent=this.element.querySelector(".order_modal_content"),this.picker=new CalendarElement,this.orderModalContent.appendChild(this.picker.element),this.datePicker=this.element.querySelector(".date_picker"),this.datePicker.addEventListener("click",()=>{this.picker.show(this.datePicker)}),this.select=this.element.querySelector(".custom-select"),this.header=this.select.querySelector(".select-header"),this.items=this.select.querySelectorAll(".select-item"),this.current=this.select.querySelector(".select-current"),this.selectPickup=this.element.querySelector(".custom-select-pickup"),this.selectCafes=this.element.querySelector(".select-cafes"),cafes.forEach(e=>{let t=document.createElement("div");t.classList.add("select-item-cafe"),t.textContent=e.name,t.dataset.value=e.id,t.addEventListener("click",t=>{t.stopPropagation(),this.currentPickup.textContent=e.name,this.pickupCafe=e.name,this.selectPickup.dataset.value=e.id,this.selectPickup.classList.remove("open")}),this.selectCafes.appendChild(t)}),this.headerPickup=this.selectPickup.querySelector(".select-header"),this.itemsPickup=this.selectPickup.querySelectorAll(".select-item-cafe"),this.currentPickup=this.selectPickup.querySelector(".select-current"),this.header.addEventListener("click",()=>{this.select.classList.toggle("open")}),this.headerPickup.addEventListener("click",()=>{this.selectPickup.classList.toggle("open")}),this.items.forEach(e=>{e.addEventListener("click",()=>{this.current.textContent=e.textContent,this.time=e.textContent,this.select.dataset.value=e.dataset.value,this.select.classList.remove("open")})}),this.element.addEventListener("click",e=>{this.select.contains(e.target)||this.select.classList.remove("open"),this.selectPickup.contains(e.target)||this.selectPickup.classList.remove("open")}),this.closeButton.addEventListener("click",()=>{this.hide()}),this.inputPhone.addEventListener("input",()=>{let e=getDigits(this.inputPhone.value);if((e=e.slice(0,9)).length>=2){let t=e.slice(0,2);OPERATORS.includes(t)||(e=e.slice(0,2))}this.inputPhone.value=e,this.inputPhone.setSelectionRange(this.inputPhone.value.length,this.inputPhone.value.length)}),this.inputPhone.addEventListener("blur",()=>{let e=getDigits(this.inputPhone.value);9!==e.length&&(this.inputPhone.value="")}),this.form.addEventListener("submit",async e=>{e.preventDefault();let t=new FormData(e.target),i=Object.fromEntries(t.entries());i.pickupPlace=this.pickupCafe;let s=getOrder(),a=this.picker.format(),n=s.map(e=>e.price).reduce((e,t)=>e+t,0),l=`Заказ с мобильной версии.
Имя: ${i.name}
Телефон: +375${i.phone}
Тип доставки: ${"delivery"===i.delivery?"Доставка":"Самовывоз"}
${"pickup"===i.delivery?`Место самовывоза: ${i.pickupPlace}`:`Адрес: ${i.address}`}
Заказ на дату: ${a} время: ${this.time}
${s.map((e,t)=>`${t+1}: ${e.cake.name}, Цена: ${"delivery"===i.delivery?e.price:Math.round(80*e.price)/100}, Количество: ${e.weight}кг`).join("\n")}
Сумма: ${"delivery"===i.delivery?n:Math.round(80*n)/100}
`,r=await fetch(this.api,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:this.chatId,text:l})});if(r.ok){this.orderSuccess(),localStorage.setItem("bucket",JSON.stringify([]));let c=localStorage.getItem("historyOrder");if(c){let o=JSON.parse(c);o.push(s),localStorage.setItem("historyOrder",JSON.stringify(o))}else localStorage.setItem("historyOrder",JSON.stringify([s]))}}),this.form.addEventListener("change",e=>{let t="pickup"===e.target.value;this.inputAddress.classList.toggle("hidden",t),this.selectPickup.classList.toggle("hidden",!t),this.selectCafes.classList.toggle("close",!t)})}show(){this.element.classList.add("active")}hide(){this.name="",this.inputName.value="",this.phone="",this.inputPhone.value="",this.element.classList.remove("active"),this.orderModalContent.classList.remove("message_success")}orderSuccess(){this.orderModalContent.classList.add("message_success")}}class TabsElement extends Element{constructor(){super("div",["contacts_tabs"],`
      <header>
        <button class="on_map active">На карте</button>
        <button class="list">Список</button>
        </header>
        <div class="contacts_content">
          <div class="mobile_contacts_map"></div>
          <div class="contacts_list hidden">
            <div class="places_list"></div>

            <div class="contacts_links">
              <a href="https://www.instagram.com/super_medovik" target="_blank">
                <img src="./img/mobile/instagramm.svg">
              </a>
              <a href="https://www.tiktok.com/@supermedoviki" target="_blank">
                <img src="./img/mobile/tiktok.svg">
              </a>
              <a href="mailto:supermedovik2022@gmail.com" target="_blank">
                <img src="./img/mobile/email.svg">
              </a>
              <a href="https://eda.yandex.by/r/super_medoviki" target="_blank">
                <img src="./img/mobile/yandex.svg">
              </a>
            </div>
            <div class="photo_gallery"></div>
          </div>
        </div>
        </div>
    `),this.element.querySelector(".places_list").innerHTML=this.renderPlaces(),this.element.querySelector(".photo_gallery").innerHTML=this.renderGallery(),this.mapContent=this.element.querySelector(".mobile_contacts_map"),this.listContent=this.element.querySelector(".contacts_list"),this.onMapButton=this.element.querySelector(".on_map"),this.listButton=this.element.querySelector(".list"),this.onMapButton.addEventListener("click",this.showMap.bind(this)),this.listButton.addEventListener("click",this.showList.bind(this))}showMap(){this.onMapButton.classList.add("active"),this.listButton.classList.remove("active"),this.mapContent.classList.remove("hidden"),this.listContent.classList.add("hidden")}showList(){this.listContent.classList.remove("hidden"),this.mapContent.classList.add("hidden"),this.listButton.classList.add("active"),this.onMapButton.classList.remove("active")}initMap(){let e=document.querySelector(".mobile_contacts_map");e.innerHTML="";let t=new ymaps.Map(e,{center:[53.923118,27.589986],zoom:16});t.controls.remove("geolocationControl"),t.controls.remove("searchControl"),t.controls.remove("trafficControl"),t.controls.remove("typeSelector"),t.controls.remove("fullscreenControl"),t.controls.remove("zoomControl"),t.controls.remove("rulerControl"),cafes.forEach(e=>{let i=new ymaps.Placemark(e.coords,{},markerSetting);t.geoObjects.add(i)})}renderPlaces(){let e="";return cafes.forEach(t=>{e+=`
        <div class="place">
          <img src="./img/mobile/yellowMarker.svg" alt="">
          <div>
            <p>${t.name}</h3>
            <div>${t.workTime}</div>
          </div>
        </div>
      `}),e}renderGallery(){let e="";return cafes.forEach(t=>{t.imgUrl&&(e+=`
          <img src="${t.imgUrl}" alt="${t.shortName}">
      `)}),e}}const updateMenuItem=()=>{let e=getOrder(),t=document.querySelector(".bucket_number");t.textContent=e.length,e.length?t.classList.remove("hidden"):t.classList.add("hidden")},homeHTML=`
<header>
  <img src="./img/mobile/logo-with-map.jpg" class="logo_mobile">
  <div>
  <img src="./img/mobile/super-edovik.jpg">
  </div>
</header>
<aside>
<a href="https://www.instagram.com/super_medovik" target="_blank">
<img src="./img/mobile/instagramm.svg">
</a>
<a href="https://www.tiktok.com/@supermedoviki" target="_blank">
<img src="./img/mobile/tiktok.svg">
</a>
<a href="mailto:supermedovik2022@gmail.com" target="_blank">
<img src="./img/mobile/email.svg">
</a>
</aside>
<p>Мы — команда ценителей настоящих домашних десертов.<br>
Наша цель — подарить каждому гостю незабываемый вкус и радость от каждого кусочка наших медовиков.</p>
<div>
<img src="./img/mobile/eco.svg" class="eco">
<p class="eco_text">Благодаря использованию исключительно натуральных ингредиентов,
мы абсолютно уверены в качестве наших десертов</p>
</div>`,loveCake=(e,t)=>i=>{let s=document.querySelectorAll(".medovik"),a;s.forEach(t=>{+t.dataset.id===e.id&&(a=t)});let n=localStorage.getItem("favoritesCake");if(n){let l=JSON.parse(n);l.some(t=>t.id===e.id)?(localStorage.setItem("favoritesCake",JSON.stringify(l.filter(t=>t.id!==e.id))),a.classList.remove("liked")):(l.push(e),localStorage.setItem("favoritesCake",JSON.stringify(l)),a.classList.add("liked"))}else localStorage.setItem("favoritesCake",JSON.stringify([e])),a.classList.add("liked");t&&renderYourChoiceCakes(yourChoice.element)},hasLikedMedovik=e=>{let t=localStorage.getItem("favoritesCake");if(t){let i=JSON.parse(t);return i.some(t=>t.id===e)}},markerSetting={iconLayout:"default#image",iconImageHref:"./img/marker.png"},cafes=[{id:1,name:"Ложинская 22-2 (Отдельный вход, здание Дмитриева Кирмаша)",shortName:"Ложинская 22-2",coords:[53.951694,27.682236],imgUrl:"./img/mobile/contacts/lojinskaya.jpg",workTime:`<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`},{id:2,name:"Якуба Коласа 25/1",shortName:"Якуба Коласа 25/1",coords:[53.923118,27.589986],imgUrl:"./img/mobile/contacts/kolas.jpg",workTime:`<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`},{id:3,name:"Пр. Независимости 92 (Вход общий с OZ.by)",shortName:"Пр. Независимости 92",coords:[53.927709,27.629284],imgUrl:"./img/mobile/contacts/independed.jpg",workTime:`<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`},{id:4,name:"Уманская 54 ТЦ Глобо (Главный вход)",shortName:"Уманская 54 ТЦ Глобо",coords:[53.875219,27.498267],imgUrl:"./img/mobile/contacts/globo.jpg",workTime:`<p>Пн-Сб 9:00-21:00</p>
            <p>Вс 10:00-21:00</p>`},{id:5,name:"Московская 22",shortName:"Московская 22",coords:[53.886493,27.537121],imgUrl:"",workTime:`<p>Пн-Bc 10:00-21:00</p>`},],medoviki=[{id:10,name:"Классический",price:50,prices:{1:52,1.5:75,2:96,2.5:122,3:148},image:"./img/mobile/cakes/classic.jpg",color:"#AF7330",maxWeight:3,minWeight:1},{id:5,name:"Малиновый",price:50,prices:{1:52,1.5:75,2:96,2.5:122,3:148},image:"./img/mobile/cakes/raspberry.webp",color:"#ED6698",maxWeight:3,minWeight:1},{id:11,name:"Лимонный",price:50,prices:{1:52,1.5:75,2:96,2.5:122,3:148},image:"./img/mobile/cakes/lemon.jpg",color:"#DBD228",maxWeight:3,minWeight:1},{id:3,name:"Черничный",price:50,prices:{1:52,1.5:75,2:96,2.5:122,3:148},image:"./img/mobile/cakes/blueberry.webp",color:"#3F4974",maxWeight:3,minWeight:1},{id:1,name:"Кофейный",price:50,prices:{1:52,1.5:75,2:96,2.5:122,3:148},image:"./img/mobile/cakes/coffee.webp",color:"#453628",maxWeight:3,minWeight:1},{id:12,name:"Солёная карамель",price:50,prices:{1:58,1.5:88,2:110,2.5:139,3:168},image:"./img/mobile/cakes/caramel.webp",color:"#A85101",maxWeight:3,minWeight:1},{id:6,name:"Двойная вишня",price:50,prices:{1:58,1.5:88,2:110,2.5:139,3:168},image:"./img/mobile/cakes/cherry.webp",color:"#7F092E",maxWeight:3,minWeight:1},{id:4,name:"Рафаэлло",price:50,prices:{1:58,1.5:88,2:110,2.5:139,3:168},image:"./img/mobile/cakes/coconut.webp",color:"#F6F2DA",isLight:!0,maxWeight:3,minWeight:1},{id:13,name:"Нутелла",price:50,prices:{1:58,1.5:88,2:110,2.5:139,3:168},image:"./img/mobile/cakes/nutella.jpg",color:"#572912",maxWeight:3,minWeight:1},{id:9,name:"Наполеон",price:50,prices:{1:50,1.5:71,2:87,2.5:113,3:139},image:"./img/mobile/cakes/napoleon.webp",color:"#DE9F65",maxWeight:3,minWeight:1},{id:8,name:"Наполеон солёная карамель",price:50,prices:{1:55,1.5:77,2:93,2.5:122,3:151},image:"./img/mobile/cakes/salt-caramel.webp",color:"#9A4A00",maxWeight:3,minWeight:1},{id:7,name:"Чизкейк",price:50,prices:{1:69,1.5:102},image:"./img/mobile/cakes/cheese.webp",color:"#E7BF7B",maxWeight:1.5,minWeight:1},],removeCakeForOrder=e=>{let t=getOrder(),i=t.filter(t=>t.cake.id!==e),s=document.querySelector(".cards");s.innerHTML="",i.forEach(e=>{createCakeCard({...e.cake,price:e.price,weight:e.weight},s,{isBucketPage:!0})});let a=document.querySelector(".bucket_order");a.innerHTML=`<p>Оформить заказ</p>
  <span>
  ${i.map(e=>e.weight).reduce((e,t)=>e+t,0)}кг,
  ${i.map(e=>e.price).reduce((e,t)=>e+t,0)}byn
  </span>`,localStorage.setItem("bucket",JSON.stringify(i)),updateMenuItem()},createCakeCard=(e,t,i={})=>{let s=`
    <img src="${e.image}" alt="${e.name}">
    <div class="medovik_info">
      <div>
        <p>${e.name}</p>
        <p>${i.isBucketPage?e.price:e.prices[1]} byn</p>
      </div>
      ${i.isBucketPage?`<div class="card_weight">
        <p>Масса</p>
        <p>${e.weight} кг</p>
        </div>`:""}
    </div>
  `,a=new Element("button",["heart_button"],'<img src="./img/mobile/heart.svg"><img src="./img/mobile/yellowHeart.svg">');a.element.addEventListener("click",loveCake(e,i.isLikedPage?t:null));let n=new Element("div",["medovik"],s);e.isLight&&n.element.classList.add("light"),n.element.style.backgroundColor=e.color,n.element.dataset.id=e.id,n.element.appendChild(a.element);let l=new Element("button",["button_mobile"],i.isBucketPage?"Удалить":"В корзину");l.element.addEventListener("click",()=>{i.isBucketPage?removeCakeForOrder(e.id):bucketModal.show(e)}),n.element.appendChild(l.element),t.appendChild(n.element),hasLikedMedovik(e.id)&&n.element.classList.add("liked")},bucketModal=new BucketElement;bucketModal.element.addEventListener("click",()=>{bucketModal.hide()});const bucketModalContent=bucketModal.element.querySelector(".bucket_modal_content");bucketModalContent.addEventListener("click",e=>{e.stopPropagation()});const content=document.querySelector(".content_mobile"),menu=new Element("div",["mobile_menu"]),page=new Element("div",["page"]),renderYourChoiceCakes=(e,t)=>{e.innerHTML="<header><h2>Избранное</h2></header>";let i=localStorage.getItem("favoritesCake");if(i){let s=JSON.parse(i),a=new Element("div",["cards"]);s.forEach(e=>{createCakeCard(e,a.element,{isLikedPage:!0})}),e.appendChild(a.element)}},changePage=e=>()=>{page.restoreHTML(),page.element.appendChild(e)},changeYourChoicePage=e=>()=>{renderYourChoiceCakes(e),page.restoreHTML(),page.element.appendChild(e)},changeListPage=e=>()=>{let t=e.querySelectorAll(".medovik");medoviki.forEach(e=>{let i=Array.from(t).find(t=>+t.dataset.id===e.id);i&&(hasLikedMedovik(e.id)?i.classList.add("liked"):i.classList.remove("liked"))}),page.restoreHTML(),page.element.appendChild(e)},changeBucketPage=e=>()=>{let t=e.querySelectorAll(".medovik"),i=getOrder();i.forEach(e=>{let i=Array.from(t).find(t=>+t.dataset.id===e.id);i&&(hasLikedMedovik(e.id)?i.classList.add("liked"):i.classList.remove("liked"))});let s=e.querySelector(".cards");i?.length&&(s.innerHTML="",i.forEach(e=>{createCakeCard({...e.cake,price:e.price,weight:e.weight},s,{isBucketPage:!0})}));let a=e.querySelector(".bucket_order");a.innerHTML=`<p>Оформить заказ</p>
    <span>
    ${i.map(e=>e.weight).reduce((e,t)=>e+t,0)}кг,
    ${i.map(e=>e.price).reduce((e,t)=>e+t,0)}byn
    </span>`,page.restoreHTML(),page.element.appendChild(e)},changeMapPage=(e,t)=>()=>{ymaps.ready(t.initMap),page.restoreHTML(),page.element.appendChild(e)},menuWrapper=new Element("div",["mobile_menu_wrapper"],""),menuInfo=new Element("div",["mobile_menu_info"],`
  <div class="medoviks_article">
    <header>
      <img src="./img/mobile/brand-cake.svg" alt="">
      <img src="./img/mobile/tdesign_cake.svg" alt="">
      <img src="./img/mobile/cake-piece.svg" alt="">
    </header>
      <h2>Главные ингридиенты наших дессертов:</h2>
    <div class="medoviks_article_wrapper">
      <div class="medoviks_article_text text-right">
        <p class="medoviks_article_title">Качество:</p>
        <p>
        Мы используем только натуральные ингридиенты,
        чтобы каждый медовик был настоящим произведением искусства</p>
      </div>
      <div class="medoviks_article_text">
        <p class="medoviks_article_title">Любовь и забота:</p>
        <p>
        Мы готовим каждый медовик с любовью и заботой, как для своих близких.</p>
      </div>
      <div class="medoviks_article_text text-right">
        <p class="medoviks_article_title">Наш опыт:</p>
        <p>
        С 2020 года мы совершенствуем наш рецепт и готовим вкуснейшие напитки.</p>
      </div>
    </div>
    <footer>
    <img src="./img/mobile/brand-cake.svg" alt="">
    <img src="./img/mobile/tdesign_cake.svg" alt="">
    <img src="./img/mobile/cake-piece.svg" alt="">
    </footer>
  </div>
  <h2>Наши адреса:</h2>
  <div class="places_list"></div>

<div class="contacts_links">
  <a href="https://www.instagram.com/super_medovik" target="_blank">
    <img src="./img/mobile/instagramm.svg">
  </a>
  <a href="https://www.tiktok.com/@supermedoviki" target="_blank">
    <img src="./img/mobile/tiktok.svg">
  </a>
  <a href="mailto:supermedovik2022@gmail.com" target="_blank">
    <img src="./img/mobile/email.svg">
  </a>
  <a href="https://eda.yandex.by/r/super_medoviki" target="_blank">
    <img src="./img/mobile/yandex.svg">
  </a>
</div>`),renderPlaces=()=>{let e="";return cafes.forEach(t=>{e+=`
      <div class="place">
        <img src="./img/mobile/yellowMarker.svg" alt="">
        <div>
          <p>${t.name}</h3>
          <div>${t.workTime}</div>
        </div>
      </div>
    `}),e};menuInfo.element.querySelector(".places_list").innerHTML=renderPlaces();const medovikiList=new Element("div",["medoviki_list"],"<header><h2>МЕДОВИКИ:</h2></header>");medoviki.forEach(e=>{createCakeCard(e,medovikiList.element)}),menuWrapper.element.appendChild(medovikiList.element),menuWrapper.element.appendChild(menuInfo.element);const home=new Element("div",["home"],homeHTML),takeOrder=new Element("button",["button_mobile"],"Оформить заказ"),callUs=document.createElement("a");callUs.href="tel:+375339929998",callUs.classList.add("call_us"),callUs.innerHTML="<img src='./img/mobile/phone.svg' /><p>Связаться с нами</p> ",takeOrder.element.addEventListener("click",changePage(medovikiList.element)),home.element.appendChild(takeOrder.element),home.element.appendChild(callUs);const yourChoice=new Element("div",["your_choice"],"<header><h2>Избранное</h2></header>"),bucket=new Element("div",["bucket"],"<header><h2>ВАШ ВЫБОР:</h2></header>"),orderList=new Element("div",["cards"]);bucket.element.appendChild(orderList.element);const order=getOrder(),finishOrder=new Element("button",["bucket_order"],`<p>Оформить заказ</p>
  <span>
  ${order.map(e=>e.weight).reduce((e,t)=>e+t,0)}кг,
  ${order.map(e=>e.price).reduce((e,t)=>e+t,0)}byn
  </span>`);finishOrder.element.addEventListener("click",()=>{orderModal.show()}),bucket.element.appendChild(finishOrder.element);const orderModal=new OrderElement;orderModal.element.addEventListener("click",()=>{orderModal.hide()});const orderModalContent=orderModal.element.querySelector(".order_modal_content");orderModalContent.addEventListener("click",e=>{e.stopPropagation()}),bucket.element.appendChild(orderModal.element);const contacts=new Element("div",["mobile_contacts"],"<h2>Где нас найти:<h2>"),contactsTabs=new TabsElement;contacts.element.appendChild(contactsTabs.element);const menuItems=[{icon:"./img/mobile/home.svg",activeIcon:"./img/mobile/yellowHome.svg",function:changePage(home.element)},{icon:"./img/mobile/heart.svg",activeIcon:"./img/mobile/yellowHeart.svg",function:changeYourChoicePage(yourChoice.element)},{icon:"./img/mobile/shopping-cart.svg",activeIcon:"./img/mobile/yellowShoppingCart.svg",function:changeBucketPage(bucket.element),isNumber:!0},{icon:"./img/mobile/cake.svg",activeIcon:"./img/mobile/yellowCake.svg",function:changeListPage(menuWrapper.element)},{icon:"./img/mobile/marker.svg",activeIcon:"./img/mobile/yellowMarker.svg",function:changeMapPage(contacts.element,contactsTabs)},];menuItems.forEach(e=>{let t=`
    <img src="${e.icon}" alt="Icon">
    <img src="${e.activeIcon}" class="icon-active" alt="Icon">
  `,i=new Element("button",["mobile_menu_item"],t);if(e.isNumber){let s=getOrder(),a=new Element("span",["bucket_number"],s.length);i.element.appendChild(a.element),s.length||a.element.classList.add("hidden")}i.element.addEventListener("click",()=>{let t=menu.element.querySelectorAll(".mobile_menu_item");t.forEach(e=>e.classList.remove("active")),i.element.classList.add("active"),e.function()}),menu.element.appendChild(i.element)}),page.element.appendChild(home.element),content.appendChild(menu.element),content.appendChild(page.element),content.appendChild(bucketModal.element);