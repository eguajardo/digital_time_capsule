$('#unlock-date').datetimepicker({
  format: DATE_TIME_FORMAT
});

$('#unlock-date').val(moment().format(DATE_TIME_FORMAT));

const editor = new toastui.Editor({
  el: document.querySelector('#markdown-editor'),
  height: '500px',
  initialEditType: 'wysiwyg',
  placeholder: "super secret message hat won't be visible until the time capsule is unlocked",
  usageStatistics: false
});

async function postCapsule() {
  const summary = $('#summary').val();
  const unlockDate = moment($('#unlock-date').val(), DATE_TIME_FORMAT).unix();
  
  const aesKey = CryptoJS.lib.WordArray.random(16).toString();
  const encryptedMessage = CryptoJS.AES.encrypt(
    editor.getMarkdown(), aesKey
  ).toString();

  const ipfsPath = await postMessageToIPFS(encryptedMessage);
  const tx = await postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey);

  window.location.href = "index.html?txHash=" + tx.hash;
}

async function postMessageToIPFS(message) {
  console.log("Posting to IPFS");
  const ipfs = window.IpfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  });  

  const response = await ipfs.add(message);

  console.log("IPFS path:", response.path);
  return response.path;
}

async function postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey) {
  console.log("Posting capsule to blockchain");
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

  console.log("transaction:", tx);

  return tx;
}