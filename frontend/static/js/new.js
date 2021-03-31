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

  try {
    const provider = await Web3Handler.getCurrentProvider();

    const ipfsPath = await postMessageToIPFS(encryptedMessage);
    const tx = await postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey, provider);

    if (tx) {
      window.location.href = "index.html?txHash=" + tx.hash;
    }
  } catch(error) {
    console.log("error:", error);

    if(error == "NO_PROVIDER") {
      displayMessage('#alert-danger', `No wallet detected, do you want to install <a href="https://metamask.io/download.html">MetaMask</a>?`);
    } else if(error === "INVALID_NETWORK") {
      displayMessage('#alert-danger', `Please verify your wallet is connected to the <strong>${Contracts.network}</strong> network`);
    } else {
      throw error;
    }
  }
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

async function postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey, provider) {
  console.log("Posting capsule to blockchain");

  const timeCapsule = (await Web3Handler.getContract(provider, 'TimeCapsule'))
    .connect(provider.getSigner());

  const tx = await timeCapsule.createCapsule(
    summary,
    unlockDate,
    ipfsPath,
    aesKey
  );

  console.log("transaction:", tx);

  return tx;
}