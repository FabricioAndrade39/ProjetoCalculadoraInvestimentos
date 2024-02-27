import { genarateReturnsArray } from "./src/investmentsGoals";

const calculateButton = document.getElementById("calculate-results");

function renderProgression() {
    const startingAmount = Number(document.getElementById("starting-amount").value);
    const additionalContributions = Number(document.getElementById("additional-contributions").value);
    const timeAmount = Number(document.getElementById("time-amount").value);
    const timeAmountPeriod = document.getElementById("time-amount-period").value;
    const returnRate = Number(document.getElementById("return-rate").value);
    const returnRatePeriod = document.getElementById("evaluation-period").value;
    const taxRate = Number(document.getElementById("tax-rate").value);

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

calculateButton.addEventListener("click", renderProgression);