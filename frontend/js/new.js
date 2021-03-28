const DATE_TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

$('#unlock-date').datetimepicker({
  format: DATE_TIME_FORMAT
});

$('#unlock-date').val(moment().format(DATE_TIME_FORMAT));

async function postCapsule() {
  const summary = $('#summary').val();
  const unlockDate = moment($('#unlock-date').val(), DATE_TIME_FORMAT).unix();
  
  const aesKey = CryptoJS.lib.WordArray.random(16).toString();
  const encryptedMessage = CryptoJS.AES.encrypt(
    $('#message').val(), aesKey
  ).toString();

  const path = await postMessageToIPFS(encryptedMessage);

}

async function postMessageToIPFS(message) {
  const ipfs = window.IpfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  });  

  const response = await ipfs.add(message);

  return response.path;
}