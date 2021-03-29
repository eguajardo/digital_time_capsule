init();

async function init() {
  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const timeCapsule = new ethers.Contract(
    Contracts.TimeCapsule.address,
    Contracts.TimeCapsule.abi,
    provider
  )

  let capsuleId = getUrlParameter("capsuleId");
  let txHash = getUrlParameter("txHash");

  console.log("txHash:", txHash);
  if (txHash !== undefined) {
    capsuleId = await verifyTransaction(txHash, timeCapsule, provider);
  }
  
  console.log("capsuleId:", capsuleId);
  if (capsuleId !== undefined) {
    await loadCapsuleLabel(capsuleId, timeCapsule);
    await loadCapsuleContent(capsuleId, timeCapsule);
  }
}

async function verifyTransaction(txHash, timeCapsule, provider) {
  const receipt = await provider.waitForTransaction(txHash);

  console.log("receipt:", receipt);

  let capsuleId;
  receipt.logs.forEach(log => {
    capsuleId = timeCapsule.interface.parseLog(log).args[0].toNumber();
    console.log("log:", capsuleId);
  });

  return capsuleId;
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

    $('#message').val(decryptedMessage);
  } catch(error) {
    console.log("error:", error);

    if (error.data.message.indexOf("ERROR_CAPSULE_LOCKED") >= 0) {
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
  let ipfsMessage;
  for await (const chunk of await ipfs.cat(ipfsPath)) {
    ipfsMessage = utf8decoder.decode(chunk);
  }

  console.log("IPFS message retrieved");
  return ipfsMessage;
}

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