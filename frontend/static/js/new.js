/**
 * This javascript handles the logic for the "new" page,
 * which allows users to create new capsules
 */

/**
 * Initialize the page
 */
$('#unlock-date').datetimepicker({
  format: DATE_TIME_FORMAT
});

$('#unlock-date').val(moment().format(DATE_TIME_FORMAT));

// Initialize the Markdown editor
var editor = new toastui.Editor({
  el: document.querySelector('#markdown-editor'),
  height: '500px',
  initialEditType: 'wysiwyg',
  placeholder: "super secret message hat won't be visible until the time capsule is unlocked",
  usageStatistics: false
});

/**
 * Posts a capsule. The message goes to IPFS and the rest to Ethereum
 * Values taken from the dom elements
 */
async function postCapsule() {
  const summary = $('#summary').val();
  const unlockDate = moment($('#unlock-date').val(), DATE_TIME_FORMAT).unix();
  
  // Generates a random encryption key and then encrypts the message
  const aesKey = CryptoJS.lib.WordArray.random(16).toString();
  const encryptedMessage = CryptoJS.AES.encrypt(
    editor.getMarkdown(), aesKey
  ).toString();

  try {
    const provider = await Web3Handler.getCurrentProvider();

    const ipfsPath = await postMessageToIPFS(encryptedMessage);
    const tx = await postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey, provider);

    if (tx) {
      // Go to index page and send the tx has as parameter to notify confirmation
      window.location.href = "index.html?txHash=" + tx.hash;
    }
  } catch(error) {
    console.log("error:", error);

    if(error == "NO_PROVIDER") {
      // No wallet found
      displayMessage('#alert-danger', `No wallet detected, do you want to install <a href="https://metamask.io/download.html">MetaMask</a>?`);
    } else if(error === "INVALID_NETWORK") {
      // Wallet is not connected to the expected network
      displayMessage('#alert-danger', `Please verify your wallet is connected to the <strong>${Contracts.network}</strong> network`);
    } else {
      throw error;
    }
  }
}

/**
 * Stores a message in IPFS
 * 
 * @param {string} message The message to store in IPFS
 * @returns the path in IPFS where the message was stored
 */
async function postMessageToIPFS(message) {
  console.log("Posting to IPFS");
  const ipfs = window.IpfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  });  

  // stores the message in IPFS
  const response = await ipfs.add(message);

  console.log("IPFS path:", response.path);
  return response.path;
}

/**
 * Posts the capsule to the smart contract
 * 
 * @param {string} summary The publicly visible text of the capsule
 * @param {number} unlockDate The date in unix timestamp when the capsule can be unlocked
 * @param {string} ipfsPath The path to the IPFS message
 * @param {string} aesKey The encryption key to decrypt the message
 * @param {Web3Provider} provider The web3 provider
 * @returns the transaction hash
 */
async function postCapsuleToBlockchain(summary, unlockDate, ipfsPath, aesKey, provider) {
  console.log("Posting capsule to blockchain");

  const timeCapsule = (await Web3Handler.getContract(provider, 'TimeCapsule'))
    .connect(provider.getSigner());

  // creates the time capsule in the smart contract
  const tx = await timeCapsule.createCapsule(
    summary,
    unlockDate,
    ipfsPath,
    aesKey
  );

  console.log("transaction:", tx);

  return tx;
}