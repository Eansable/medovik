const menu = [
    {
        name: "Медовик-кофе",
        activeColor: "coffee",
        photo: "",
        top: "calc(100% - 180px)",
        left: "500px",
    },
    {
        name: "Медовик - соленая карамель",
        activeColor: "salty",
        photo: "",
        top: "calc(100% - 300px)",
        left: "500px",
    },
    {
        name: "Медовик-лимон",
        activeColor: "lemon",
        photo: "",
        top: "400px",
        left: "1140px",
    },
    {
        name: "Медовик - шоколадно-ореховый",
        activeColor: "nut",
        photo: "",
        top: "285px",
        left: "964px",
    },
    {
        name: "Медовик-черника",
        activeColor: "blueberry",
        photo: "",
        top: "175px",
        left: "910px",
    },
    {
        name: "Чизкейк",
        activeColor: "cheese",
        photo: "",
        top: "80px",
        left: "810px",
    },
    {
        name: "Медовик классический",
        activeColor: "classic",
        photo: "",
        top: "80px",
        left: "520px",
    },
    {
        name: "Медовик-кокос",
        activeColor: "coconut",
        photo: "",
        top: "calc(100% - 685px)",
        left: "360px",
    },
    {
        name: "Медовик-малина",
        activeColor: "raspberry",
        photo: "",
        top: "calc(100% - 595px)",
        left: "200px",
    },
    {
        name: "Медовик-вишня",
        activeColor: "cherry",
        photo: "",
        top: "calc(100% - 465px)",
        left: "100px",
    },
    {
        name: "Наполеон",
        activeColor: "napoleon",
        photo: "",
        top: "calc(100% - 360px)",
        left: "79px",
    },
    {
        name: "Наполеон - солёная карамель",
        activeColor: "napoleon_salty",
        photo: "",
        top: "calc(100% - 240px)",
        left: "0px",
    },


]


const overlayModal = document.querySelector(".modal_overlay")
const modal = document.querySelector(".modal")
const buttons = document.querySelectorAll(".order")
const modalButton = document.querySelector(".modal_order")
const form = document.getElementById("order_form")
const menuWrapper = document.querySelector(".menu_wrapper")


// MODAL AND TELEGRAM

const token = "7402101933:AAG8R-TlNh9UvQiMCm0S97m5CQ_-5nvQsDI"
const chatId = "-1002231985778"
const api = `https://api.telegram.org/bot${token}/sendMessage`

const handleClickOverlay = () => {
    overlayModal.classList.remove("open")
}

const openModal = (event) => {
    event.preventDefault()
    overlayModal.classList.add("open")
}

const sendForm = async (event) => {
    const fd = new FormData(form)
    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: `Заказ с сайта. \n Имя: ${fd.get("name")} \n Телефон: ${fd.get("phone")}`
            })
        })
    } catch {

    }
}

overlayModal.addEventListener("click", handleClickOverlay)
modal.addEventListener("click", (event) => {
    event.stopPropagation()
})

buttons.forEach(button => {
    button.addEventListener("click", openModal)
})

modalButton.addEventListener("click", sendForm)


// MENU

