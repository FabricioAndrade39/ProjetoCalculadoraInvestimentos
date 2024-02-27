function convertMonthlyReturnRate(yearlyReturnRate){
    return yearlyReturnRate ** (1/2);
}

export function genarateReturnsArray(startingAmount = 0, timeHorizon = 0, timePeriod = 'monthly', monthlyContribution = 0, returnRate = 0, returnTimeFrame = 'monthly') {
    
    if(!timeHorizon || !startingAmount) {
        throw new Error("Investimento inicial e prazo devem ser preenchidos com valores positivos.");
    }

    const finalReturnRate = returnTimeFrame === 'monthly' ? 1 + returnRate / 100 : convertMonthlyReturnRate(1 + returnRate / 100);

    const finalTimeHorizon = timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

    const referenceInvestmentObject = {
        investedAmount: startingAmount,
        interestReturns: 0,
        totalInterestReturns: 0,
        month: 0,
        totalAmount: startingAmount,
    };

    const returnArrays = [referenceInvestmentObject];

    for (let timeReference = 1; timeReference <= finalTimeHorizon; timeReference++) {
        
        const totalAmount = returnArrays[timeReference - 1].totalAmount * finalReturnRate + monthlyContribution;
        const interestReturns = returnArrays[timeReference - 1].totalAmount * finalReturnRate;
        const investedAmount = startingAmount + monthlyContribution * timeReference;
        const totalInterestReturns = totalAmount - investedAmount;
        
        returnArrays.push({
            investedAmount,
            interestReturns,
            totalInterestReturns,
            month: timeReference,
            totalAmount,
        });
    }
    
    return returnArrays;
}