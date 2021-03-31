const DATE_TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

function getUrlParameter (sParam) {
  const sPageURL = window.location.search.substring(1)
  const sURLVariables = sPageURL.split('&')
  let sParameterName
  let i

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=')

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1])
    }
  }
}

function displayMessage(selector, message) {
  $(selector).html(message);
  $(selector).show();
}