import menuItems from './menu';
import './styles.css'
import './variables.css'
import cafes from './cafes';


// FIrst screen carusel
class SubCarusel {
    page
    element
    items
    nextButton
    prevButton
    image
    constructor(items) {
        this.page = 1
        this.element = document.createElement("div")
        this.element.classList.add('sub_carusel')
        this.items = items
        this.nextButton = document.createElement("button")
        this.nextButton.addEventListener('click', () => {
            this.nextPage()
        }
        )
        this.prevButton = document.createElement("button")
        this.prevButton.addEventListener('click', () => {
            this.prevPage()
        })
        this.image = document.createElement("img")
        this.renderItem()
    }
    nextPage() {
        this.page === this.items.length ? this.page = 1 : this.page += 1
        this.renderItem()
    }
    prevPage() {
        this.page  === 1 ? this.page = this.items.length : this.page -= 1
        this.renderItem()
    }
    renderItem() {
        const item = this.items[page - 1]
        console.log(item);
        this.element.innerHTML = ''
        this.element.appendChild(this.prevButton)
        this.prevButton.disabled = page === 1
        this.image.src = item.fotoUrl
        this.element.appendChild(this.image)
        this.element.innerHTML += `<p>${item.itemName}</p>`
        this.element.appendChild(this.nextButton)
        this.nextButton.disabled = page === this.items.length
    }
}

const nextMainPage = (event) => {
    if (page === menuItems.length)
        page = 1
    else
        page += 1
    caruselItems.style.marginLeft = `-${(page - 1) * caruselItems.offsetWidth}px`
}

const prevMainPage = (event) => {
    if (page === 1)
        page = menuItems.length
    else
        page -= 1
    caruselItems.style.marginLeft = `-${(page - 1) * caruselItems.offsetWidth}px`
}

let page = 1
const fsCarusel = document.getElementById('first_screen_carusel');
const nextButton = document.getElementById('carusel_next');
const prevButton = document.getElementById('carusel_prev');

nextButton.addEventListener('click', nextMainPage)
prevButton.addEventListener('click', prevMainPage)

const caruselItems = document.createElement('div')
caruselItems.classList.add("carusel_slice")
caruselItems.style.marginLeft = `${(page - 1) * caruselItems.offsetWidth}px`

menuItems.forEach((item, index) => {
    const caruselItem = document.createElement('div')
    caruselItem.classList.add("item")
    caruselItem.innerHTML = `<p>${item.name}</p>`
    const subCarusel = new SubCarusel(item.items)
    caruselItem.appendChild(subCarusel.element)
    caruselItems.appendChild(caruselItem)
})

fsCarusel.appendChild(caruselItems)



// Doors
const nextDoor = document.getElementById('next_door')
nextDoor.addEventListener('click', () => {
    document.querySelector('.about_cafe').classList.add('about_cafe_hidden')
    setTimeout(() => {
        pageDoor + 1 === cafes.length ? renderAboutCafe(0) : renderAboutCafe(pageDoor + 1)
    }, 400)
})

const prevDoor = document.getElementById('prev_door')
prevDoor.addEventListener('click', () => {
    document.querySelector('.about_cafe').classList.add('about_cafe_hidden')
    setTimeout(() => {
        pageDoor === 0 ? renderAboutCafe(cafes.length - 1) : renderAboutCafe(pageDoor - 1)
    }, 400)
})

const nameCafe = document.getElementById('cafe_name')
const aboutCafe = document.getElementById('cafe_about_text')

let pageDoor

const renderAboutCafe = (page) => {
    document.querySelector('.about_cafe').classList.remove('about_cafe_hidden')
    pageDoor = page
    const cafe = cafes[pageDoor]
    nameCafe.innerText = cafe.name
    aboutCafe.innerText = cafe.about
}

renderAboutCafe(0)