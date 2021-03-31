init();

async function init() {
  const provider = await Web3Handler.getDefaultProvider();
  const timeCapsule = await Web3Handler.getContract(provider, 'TimeCapsule');

  const capsuleId = getUrlParameter("capsuleId");
  
  console.log("capsuleId:", capsuleId);
  if (capsuleId !== undefined) {
    if (await loadCapsuleLabel(capsuleId, timeCapsule)) {
      await loadCapsuleContent(capsuleId, timeCapsule);
    }
  }
}

async function loadCapsuleLabel(capsuleId, timeCapsule) {
  try {
    const capsuleLabel = await timeCapsule.getCapsuleLabel(capsuleId);
    console.log("capsuleLabel:", capsuleLabel);

    $('#summary').val(capsuleLabel.summary);
    $('#unlock-date').val(moment.unix(capsuleLabel.unlockDate).format(DATE_TIME_FORMAT));

    $('#form').show();

    return true;
  } catch(error) {
    console.log("error:", error);
    
    $('#loading-div').loading('stop');
  }
}

async function loadCapsuleContent(capsuleId, timeCapsule) {
  try {
    $('#loading-div').loading('start');

    const capsuleContent = await timeCapsule.getCapsuleContent(capsuleId);
    console.log("capsuleContent:", capsuleContent);

    const ipfsMessage = await getIpfsMessage(capsuleContent.ipfsHash);

    const decryptedMessage = CryptoJS.AES.decrypt(
      ipfsMessage,
      capsuleContent.aesKey
    ).toString(CryptoJS.enc.Utf8);

    $('#loading-div').loading('stop');
    $('#markdown-viewer').show();

    new toastui.Editor({
      el: document.querySelector('#markdown-viewer'),
      initialValue: decryptedMessage,
      usageStatistics: false
    });

    $('#unlock-date-div').show();
  } catch(error) {
    $('#loading-div').loading('stop');
    console.log("error:", error);

    displayMessage('#alert-danger', `This message is still locked until <span class="font-weight-bold">${$('#unlock-date').val()}</span>`)

    console.log("Capsule still locked");
  }
}

async function getIpfsMessage(ipfsPath) {
  console.log("Retrieving from IPFS path:", ipfsPath);
  const ipfs = window.IpfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  });

  const utf8decoder = new TextDecoder();
  let ipfsMessage = "";
  for await (const chunk of await ipfs.cat(ipfsPath)) {
    ipfsMessage += utf8decoder.decode(chunk);
  }

  console.log("IPFS message retrieved");
  return ipfsMessage;
}