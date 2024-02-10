import menuItems from './menu';
import './styles.css'
import './variables.css'
import cafes from './cafes';

const nextPage = (event) => {
    if (page === menuItems.length)
        page = 1
    else
        page += 1
    caruselItems.style.marginLeft = `-${(page - 1) * caruselItems.offsetWidth}px`
}

const prevPage = (event) => {
    if (page === 1)
        page = menuItems.length
    else
        page -= 1
    console.log(page);
    caruselItems.style.marginLeft = `-${(page - 1) * caruselItems.offsetWidth}px`
}

let page = 1
const fsCarusel = document.getElementById('first_screen_carusel');
const nextButton = document.getElementById('carusel_next');
const prevButton = document.getElementById('carusel_prev');

nextButton.addEventListener('click', nextPage)
prevButton.addEventListener('click', prevPage)

const caruselItems = document.createElement('div')
caruselItems.classList.add("carusel_slice")
caruselItems.style.marginLeft = `${(page - 1) * caruselItems.offsetWidth}px`

menuItems.forEach((item, index) => {
    const caruselItem = document.createElement('div')
    caruselItem.classList.add("item")
    caruselItem.innerHTML = `<p>${item.name}</p>`
    caruselItems.appendChild(caruselItem)
})

fsCarusel.appendChild(caruselItems)

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