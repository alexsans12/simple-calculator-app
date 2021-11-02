const formCalc = document.querySelector(".column-one__form");
const buttons = document.querySelectorAll(".form__button");
const inputDisplay = document.querySelector(".form__display");

document.addEventListener("DOMContentLoaded", () => {
    buttons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(button.id);
            if (button.id === "reset") {
                inputDisplay.value = "";
            } else {
                inputDisplay.value += button.getAttribute("data-item");
                console.log(parseInt(inputDisplay.value));
            }
        });
    });
});
