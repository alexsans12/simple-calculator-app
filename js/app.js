const formCalc = document.querySelector('.column-one__form');
const columnTwo = document.querySelector('.card-calculator__column-two');
const cardError = document.querySelector('.card-error');
const inputDisplay = document.querySelector('.form__display');
const historyDisplay = document.querySelector('.card-calculator__history-list');
const historyArray = [];


document.addEventListener("DOMContentLoaded", () => {
    formCalc.addEventListener("click", (e) => {
        e.preventDefault();
        const button = e.target;
    
        if(button.tagName.toLowerCase() === "button") {
            const number = button.getAttribute('data-number');
            const operator = button.getAttribute('data-operator');

            if(number || operator)
                addToDisplay(number, operator);
            else {
                if(button.id === "reset")
                    resetDisplay();
                else if(button.id === "delete")
                    deleteCharacter();
                else {
                    if(inputDisplay.value !== '')
                        resolve();
                }
            }
        }
    });

    
    columnTwo.addEventListener("click", (e) => {
        e.preventDefault();

        const button = e.target;

        if(button.tagName.toLowerCase() === "button") {
            if(button.id === "position")
                changePositionColumnOne();
            if(button.id === "history")
                alignLeftHistory();
            if(button.id === "random")
               randomButtons();
        }
    });
});

function addToDisplay(number, operator) {
    if(inputDisplay.classList.contains('answer')) {
        inputDisplay.classList.remove('answer');
        inputDisplay.value = '';
    }

    const displayText = inputDisplay.value;            
    const lastChart = displayText.charAt(displayText.length - 1);

    if(number)
        inputDisplay.value += number;
    else if(operator !== "" && (Number(lastChart) || operator === '(' || operator === ')' || operator === '-')) {
        if(operator === '(' && (Number(lastChart)))
            inputDisplay.value += '*' + operator;
        else
            inputDisplay.value += operator;
    }
}

function resetDisplay() {
    inputDisplay.value = "";
}

function deleteCharacter() {
    const problem = inputDisplay.value;
    inputDisplay.value = problem.slice(0, problem.length - 1);
}

function resolve() {
    const problem = inputDisplay.value;
    let answer;

    try {
        answer = math.evaluate(problem) % 1 === 0 ? math.evaluate(problem) : math.evaluate(problem).toFixed(2) ;   
    } catch (error) {
        showError(error);
        return;
    }

    showAnswer(problem, answer);
}

function showAnswer(problem, answer) {
    inputDisplay.classList.add('answer');
    inputDisplay.value = answer;
    historyArray.push({problem, answer});
    showHistory();
}

function showHistory() {
    emptyHistory();

    historyArray.forEach(item => {
        historyDisplay.innerHTML += `
            <li class="card-calculator__history-list__item">
                <p class="card-calculator__history-list__text">
                    <span
                        class="
                            card-calculator__history-list__text--small
                        "
                        >${item.problem}</span
                    >${item.answer}
                </p>
            </li>
        `;
    });
}

function showError(error) {
    cardError.classList.remove('animate__slideOutUp');
    cardError.classList.add('animate__slideInDown', 'card-error--show');
    cardError.querySelector('p').textContent = error;

    setTimeout(() => {
        cardError.classList.remove('animate__slideInDown');
        cardError.classList.add('animate__slideOutUp');
    }, 3000);
}

function emptyHistory() {
    historyDisplay.textContent = '';
}

function changePositionColumnOne() {
    document.querySelector('.card-calculator__column-one').classList.toggle('card-calculator__column-one--reverse');
}

function alignLeftHistory() {
    document.querySelector('.card-calculator__history').classList.toggle('card-calculator__history--left');
}

function randomButtons() {
    const randomPositions = new Map();
    const buttons = formCalc.querySelectorAll('button');
    buttons.forEach(button => {
        const data = (button.getAttribute('data-number') || button.getAttribute('data-operator')) || button.textContent;
        
        let randomNum = Math.floor(Math.random() * (17 - 0 + 1)) + 0;

        while(randomPositions.get(randomNum)) {
            randomNum = Math.floor(Math.random() * (17 - 0 + 1)) + 0;
        }

        randomPositions.set(randomNum, data);
    });

    for (let index = 0; index < randomPositions.size; index++) {
        const data = randomPositions.get(index);
        const button = buttons[index]; 

        button.textContent = data;
        button.removeAttribute('data-number');
        button.removeAttribute('data-operator');
        
        if(Number(data))
            button.setAttribute('data-number', data);
        else if(!Number(data) && button.id !== '') {
            button.id = '';
        }   
        else if(data === '=')
            button.id = 'resolve';
        else if(data === 'AC')
            button.id = 'reset';
        else
            button.setAttribute('data-operator', data);
    }
}