import { genarateReturnsArray } from "./src/investmentsGoals";
import { Chart } from 'chart.js/auto';
import { createTable } from "./src/table";

const finalMoneyChat = document.getElementById("final-money-distribution");
const progression = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
    {columnLabel: "Mês", accessor: "month"},
    {columnLabel: "Total Investido", accessor: "investedAmount", format: (numberInfo) => formatCurrencyToTable(numberInfo)},
    {columnLabel: "Rendimento Mensal", accessor: "interestReturns", format: (numberInfo) => formatCurrencyToTable(numberInfo)},
    {columnLabel: "Rendimento Total", accessor: "totalInterestReturns", format: (numberInfo) => formatCurrencyToTable(numberInfo)},    
    {columnLabel: "Quantia Total", accessor: "totalAmount", format: (numberInfo) => formatCurrencyToTable(numberInfo)},
];

function formatCurrencyToTable(value) {
    return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
}

function formatCurrencyToGraph(value) {
    return value.toFixed(2);
}

function renderProgression(event) {

    event.preventDefault();

    if(document.querySelector(".error")) {
        return;
    }

    resetCharts();
    
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

    const finalInvestmentObject = (returnArrays[returnArrays.length -1]);

    doughnutChartReference = new Chart(finalMoneyChat, {
        type: 'doughnut',
        data: {
            labels: [
              'Total Investido',
              'Rendimento',
              'Imposto'
            ],
            datasets: [{
              
              data: [
                formatCurrencyToGraph(finalInvestmentObject.investedAmount),
                formatCurrencyToGraph(finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)),
                formatCurrencyToGraph(finalInvestmentObject.totalInterestReturns * (taxRate / 100)),
              ],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          },
    });

    progressionChartReference = new Chart(progression, {
        type: 'bar',
        data: {
            labels: returnArrays.map((finalInvestmentObject) => finalInvestmentObject.month),
            datasets: [{
                label: 'Total Investido',
                data: returnArrays.map((finalInvestmentObject) => formatCurrencyToGraph(finalInvestmentObject.investedAmount)),
                backgroundColor: 'rgb(255, 99, 132)',
            } , {
                label: 'Retorno do Investimento',
                data: returnArrays.map((finalInvestmentObject) => formatCurrencyToGraph(finalInvestmentObject.interestReturns)),
                backgroundColor: 'rgb(54, 162, 235)',
            }],
        },
         options: {
            responsive: true,
            scales: {
                x: {
                 stacked: true,
                },
                y: {
                 stacked: true
                }
            }
        },
    })

    createTable(columnsArray, returnArrays, 'results-table');
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetCharts() {
    if(!isObjectEmpty(doughnutChartReference) && !isObjectEmpty(progressionChartReference)) {
        doughnutChartReference.destroy();
        progressionChartReference.destroy();
    }
}

function clearForm() {
    
    form['starting-amount'].value = "";
    form['additional-contributions'].value = "";
    form['time-amount'].value = "";
    form['return-rate'].value = "";
    form['tax-rate'].value = "";

    resetCharts();

    const errorInputContainers = document.querySelectorAll(".error");

    for(const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove('error');
        errorInputContainer.parentElement.querySelector('p').remove();
    }
}

function validateInputs(event) {
    
    if(event.target.value === '') {
        return;
    }
    
    const { parentElement } = event.target;
    const grandParentElement = event.target.parentElement.parentElement;
    const inputValue = event.target.value.replace(",",".");
    
    if(!parentElement.classList.contains("error") && (isNaN(inputValue) || Number(inputValue) <= 0)) {

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

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const nextButton = document.getElementById('slide-arrow-next');
const previousButton = document.getElementById('slide-arrow-previous');

nextButton.addEventListener('click', () => {
    carouselEl.scrollLeft += mainEl.clientWidth;
});

previousButton.addEventListener('click', () => {
    carouselEl.scrollLeft -= mainEl.clientWidth;
})

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);