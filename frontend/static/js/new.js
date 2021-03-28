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

  const ipfsPath = await postMessageToIPFS(encryptedMessage);
  await postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey);
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

async function postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey) {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const timeCapsule = new ethers.Contract(
    Contracts.TimeCapsule.address,
    Contracts.TimeCapsule.abi,
    provider
  ).connect(signer);

  const tx = await timeCapsule.createCapsule(
    summary,
    unlockDate,
    ipfsPath,
    aesKey
  );
  
  const receipt = await provider.waitForTransaction(tx.hash);

  const filter = timeCapsule.filters.CapsuleCreatedEvent();
  filter.blockHash = receipt.blockHash

  timeCapsule.on(filter, (id, event) => {
    console.log("id:", id.toNumber());
  });
}