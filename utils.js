// ChatGPT-3

function getPercentage(num1, num2) {
  const percentage = ((num2 - num1) / num1) * 100;
  const roundPercentage = Math.round(percentage * 100) / 100;
  if (roundPercentage > 0) {
    return `↑ *${roundPercentage}*%`;
  } else if (roundPercentage < 0) {
    return `↓ *${roundPercentage}*%`;
  }
}

module.exports = { getPercentage };
