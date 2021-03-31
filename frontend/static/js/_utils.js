const DATE_TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

/**
 * Gets a parameter from the URL
 * 
 * @param {string} sParam The parameter
 * @returns a string containing the parameter value
 */
function getUrlParameter (sParam) {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split('&');
  let sParameterName;
  let i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
}

/**
 * Displays a message in the dom element with the given selector
 * 
 * @param {string} selector The selector of the dom object to change
 * @param {string} message The message to display
 */
function displayMessage(selector, message) {
  $(selector).html(message);
  $(selector).show();
}