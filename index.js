const overlayModal = document.querySelector(".modal_overlay")
const modal = document.querySelector(".modal")
const buttons = document.querySelectorAll(".order")
const modalButton = document.querySelector(".modal_order")
const form = document.getElementById("order_form")
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
    console.log(fd);
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
