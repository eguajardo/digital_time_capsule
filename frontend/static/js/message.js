init();

async function init() {
  $('#loading-div').loading('start');

  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const timeCapsule = new ethers.Contract(
    Contracts.TimeCapsule.address,
    Contracts.TimeCapsule.abi,
    provider
  )

  const capsuleId = getUrlParameter("capsuleId");
  
  console.log("capsuleId:", capsuleId);
  if (capsuleId !== undefined) {
    await loadCapsuleLabel(capsuleId, timeCapsule);
    await loadCapsuleContent(capsuleId, timeCapsule);
  }
}

async function loadCapsuleLabel(capsuleId, timeCapsule) {
  try {
    const capsuleLabel = await timeCapsule.getCapsuleLabel(capsuleId);
    console.log("capsuleLabel:", capsuleLabel);

    $('#summary').val(capsuleLabel.summary);
    $('#unlock-date').val(moment.unix(capsuleLabel.unlockDate).format(DATE_TIME_FORMAT));
  } catch(error) {
    console.log("error:", error);
  }
}

async function loadCapsuleContent(capsuleId, timeCapsule) {
  try {
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

    if (error.data.message.indexOf("ERROR_CAPSULE_LOCKED") >= 0) {
      $('#alert-danger').html(`This message is still locked until <span class="font-weight-bold">${$('#unlock-date').val()}</span>`);
      $('#alert-danger').show();
      console.log("Capsule still locked");
    }
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