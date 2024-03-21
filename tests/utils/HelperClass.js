// Generate random strings
// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

// Generate Random Dependent between 0-32
export function generateRandomDependent() {
  const lowerBound = 0;
  const upperBound = 32;
  return Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound;
}

// calculate benefit details of employee based on dependents and store it in array
//0 index for benefits 1 index for net pay
export function paymentDetailsOfEmployee(dependents) {
  // Calculate total benefits
  const annualBenefits = 1000 / 26;
  const dependentBenefits = 500 / 26 * dependents;
  const benefits = Math.round((annualBenefits + dependentBenefits) * 100) / 100;

  // Calculate net pay (assuming gross pay per month is 2000)
  const netPay = Math.round((2000 - benefits) * 100) / 100;

  return [benefits, netPay];
}