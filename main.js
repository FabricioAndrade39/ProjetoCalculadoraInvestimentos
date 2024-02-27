import { genarateReturnsArray } from "./src/investmentsGoals";

const form = document.getElementById("investment-form");

function renderProgression(event) {

    event.preventDefault();

    if(document.querySelector(".error")) {
        return;
    }
    
    //const startingAmount = Number(form['startingAmount'].value); outra forma de resolução

    const startingAmount = Number(document.getElementById("starting-amount").value.replace(",","."));
    const additionalContributions = Number(document.getElementById("additional-contributions").value.replace(",","."));
    const timeAmount = Number(document.getElementById("time-amount").value);
    const timeAmountPeriod = document.getElementById("time-amount-period").value;
    const returnRate = Number(document.getElementById("return-rate").value.replace(",","."));
    const returnRatePeriod = document.getElementById("evaluation-period").value;
    const taxRate = Number(document.getElementById("tax-rate").value.replace(",","."));

    const returnArrays = genarateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContributions,
        returnRate,
        returnRatePeriod
    );

    console.log(returnArrays);
}

function validateInputs(event) {
    
    if(event.target.value === '') {
        return;
    }
    
    const { parentElement } = event.target;
    const grandParentElement = event.target.parentElement.parentElement;
    const inputValue = event.target.value.replace(",",".");
    
    if(!parentElement.classList.contains("error") && (isNaN(inputValue) || Number(inputValue)) <= 0) {

        const errorTextElement = document.createElement("p");
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = "Insira um valor numérico e maior que 0"

        parentElement.classList.add('error');
        grandParentElement.appendChild(errorTextElement);
    } else if(parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0) {
        
        parentElement.classList.remove("error");
        grandParentElement.querySelector('p').remove();
    }
}

for(const formElement of form) {
    if(formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInputs);
    }
}

form.addEventListener("submit", renderProgression);