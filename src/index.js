import menuItems from './menu';
import './styles.css'
import './variables.css'

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