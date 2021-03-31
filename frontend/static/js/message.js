/**
 * This javascript handles the logic for the "message" page,
 * which allows users to view previously posted capsules
 */

init();

/**
 * Initialize the page
 */
async function init() {
  // load the web3 relevant objects
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

/**
 * Loads the capsule label, i.e. the publicly available information that
 * doesn't depend on unlock status
 * 
 * @param {string} capsuleId The capsule id
 * @param {Contract} timeCapsule The Ethereum contract
 * @returns true if the capsule was loaded succesfully
 */
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

/**
 * Loads the capsule content, i.e. the secret message is revealed if the
 * capsule can be unlocked, otherwise lets the user know until when the
 * capsule can be unlocked
 * 
 * @param {string} capsuleId The capsule id
 * @param {Contract} timeCapsule The Ethereum contract
 */
async function loadCapsuleContent(capsuleId, timeCapsule) {
  try {
    $('#loading-div').loading('start');

    const capsuleContent = await timeCapsule.getCapsuleContent(capsuleId);
    console.log("capsuleContent:", capsuleContent);

    // gets the IPFS stored encrypted message
    const ipfsMessage = await getIpfsMessage(capsuleContent.ipfsHash);

    // use the key stored in the contract to decrypt the message
    const decryptedMessage = CryptoJS.AES.decrypt(
      ipfsMessage,
      capsuleContent.aesKey
    ).toString(CryptoJS.enc.Utf8);

    $('#loading-div').loading('stop');
    $('#markdown-viewer').show();

    // load the message in the Markdown viewer
    new toastui.Editor({
      el: document.querySelector('#markdown-viewer'),
      initialValue: decryptedMessage,
      usageStatistics: false
    });

    // show since when the capsule has been unlocked
    $('#unlock-date-div').show();
  } catch(error) {
    $('#loading-div').loading('stop');
    console.log("error:", error);

    // let the user know until when the capsule will remain locked
    displayMessage('#alert-danger', `This message is still locked until <span class="font-weight-bold">${$('#unlock-date').val()}</span>`)
  }
}

/**
 * Retrieves a message from IPFS
 * 
 * @param {string} ipfsPath The path where the message was stored in IPFS
 * @returns the retrieved message
 */
async function getIpfsMessage(ipfsPath) {
  console.log("Retrieving from IPFS path:", ipfsPath);
  const ipfs = window.IpfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  });

  // load the chunks of data from IPFS, a MUST for large messages
  const utf8decoder = new TextDecoder();
  let ipfsMessage = "";
  for await (const chunk of await ipfs.cat(ipfsPath)) {
    ipfsMessage += utf8decoder.decode(chunk);
  }

  console.log("IPFS message retrieved");
  return ipfsMessage;
}