/**
 * This javascript handles the logic for the "index" page,
 * which allows users to browse through the capsules
 */

init();

/**
 * Initialize the page
 */
async function init() {
  $('#loading-div').loading('start');

  // get the pagination data
  let startIndex = parseInt(getUrlParameter("start"));
  if (isNaN(startIndex)) {
    startIndex = 0; // by default start at the begining
  }
  let elementCount = parseInt(getUrlParameter("count"));
  if (isNaN(elementCount)) {
    elementCount = 5; // display this amount of elements by default
  }
  updatePaginationLinks(startIndex, elementCount);

  // load the web3 relevant objects
  const provider = await Web3Handler.getDefaultProvider();
  const timeCapsule = await Web3Handler.getContract(provider, 'TimeCapsule');

  // If the user came from creating a capsule, then verify the transaction
  let txHash = getUrlParameter("txHash");
  if (txHash !== undefined) {
    console.log("txHash:", txHash);
    verifyTransaction(txHash, timeCapsule, provider);
  }

  // load the capsules into HTML cards
  loadCards(startIndex, elementCount, timeCapsule);
}

/**
 * Veryfy the transaction and display confirmation message when needed
 * 
 * @param {string} txHash The transaction hash
 * @param {Contract} timeCapsule The contract from where to get the logs
 * @param {Web3Provider} provider The web3 provider
 */
async function verifyTransaction(txHash, timeCapsule, provider) {
  // display link to etherscan
  displayMessage('#alert-success', `Capsule has been submitted, we will let you know when the transacction is confirmed. <a href="https://ropsten.etherscan.io/tx/${txHash}" target="_blank">View on Etherscan</a>`);

  const receipt = await provider.waitForTransaction(txHash);

  console.log("receipt:", receipt);
  let capsuleId;
  receipt.logs.forEach(log => {
    capsuleId = timeCapsule.interface.parseLog(log).args[0].toNumber();
  });

  // alert the user the transaction has been confirmed
  displayMessage('#alert-success', `Transaction confirmed. <a href="message.html?capsuleId=${capsuleId}">View Capsule</a>`);
}

/**
 * Updates the pagination links
 * 
 * @param {number} startIndex 
 * @param {number} elementCount 
 */
function updatePaginationLinks(startIndex, elementCount) {
  const nextStart = startIndex + elementCount;
  $(".next-link").attr("href", `index.html?start=${nextStart}&count=${elementCount}`);

  if (startIndex > 0) {
    const prevStart = startIndex - elementCount;
    if (prevStart < 0) {
      prevStart = 0;
    }

    $(".previous-link").attr("href", `index.html?start=${prevStart}&count=${elementCount}`);
  }
}

/**
 * Load the capsule labels in HTML cards
 * 
 * @param {number} startIndex The index of the first card to load
 * @param {number} elementCount The amount of cards to load
 * @param {Contract} timeCapsule The smart contract
 */
async function loadCards(startIndex, elementCount, timeCapsule) {
  let cardListHtml = "";

  for (i = 0; i < elementCount; i++) {
    try {
      const capsuleId = startIndex + i;
      const capsuleLabel = await timeCapsule.getCapsuleLabel(capsuleId);

      // concat html of cards holding capsules information
      cardListHtml += createCardHtml(capsuleId, capsuleLabel);
    } catch(error) {
      console.log("can't load more cards:", error);
      // if error it means that probably there is no more cards to load
      $('#loading-div').loading('stop');
      // disable next link
      $(".next-link").attr("href", null);

      break;
    }
  }

  $('#loading-div').loading('stop');
  $('#card-list').html(cardListHtml);
}

/**
 * Create the html for a card holding capsule information
 * 
 * @param {number} capsuleId The capsule ID
 * @param {object} capsuleLabel The capsule public information
 * @returns the HTML of the card holding the capsule information
 */
function createCardHtml(capsuleId, capsuleLabel) {
  return `
  <a class="no-decorations" href="message.html?capsuleId=${capsuleId}">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-sm-3 text-left">
            <div class="font-weight-bold">
              Creation date
            </div>
            <div>
              ${moment.unix(capsuleLabel.lockDate).format(DATE_TIME_FORMAT)}
            </div>
          </div>
          <div class="col-sm-6 text-center">
            <div class="font-weight-bold">
              Summary
            </div>
            <div>
              ${capsuleLabel.summary}
            </div>
          </div>
          <div class="col-sm-3 text-right">
            <div class="font-weight-bold">
              Unlock date
            </div>
            <div>
              ${moment.unix(capsuleLabel.unlockDate).format(DATE_TIME_FORMAT)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </a>

`
}