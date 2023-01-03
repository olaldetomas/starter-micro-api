// ChatGPT-3

function getPercentage(num1, num2) {
  const percentage = ((num2 - num1) / num1) * 100;

  if (percentage > 0) {
    return `↑ ${percentage}%`;
  } else if (percentage < 0) {
    return `↓ ${percentage}% de decremento`;
  }
}

module.exports = { getPercentage };
