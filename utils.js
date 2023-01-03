// From ChatGPT-3

function getPercentage(num1, num2) {
  // Calculamos el porcentaje de cambio entre num1 y num2
  const cambio = ((num2 - num1) / num1) * 100;

  // Devolvemos el porcentaje con formato "x.yy%"
  return cambio.toFixed(2) + '%';
}

module.exports = { getPercentage };
