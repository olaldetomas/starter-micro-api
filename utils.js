// From ChatGPT-3

const getCurrentDate = () => {
  // Get an instance of the Date object
  var date = new Date();

  // Get the month, day and year in 2-digit format
  var month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  var day = date.getDate();
  day = day < 10 ? '0' + day : day;
  var year = date.getFullYear();

  // Get the hour, minutes and seconds in 2-digit format
  var hour = date.getHours();
  hour = hour < 10 ? '0' + hour : hour;
  var minutes = date.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var seconds = date.getSeconds();
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Create and return the date and time string in the desired format
  return (
    month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + ':' + seconds
  );
};

module.exports = { getCurrentDate };
