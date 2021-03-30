init();

async function init() {
  $('#loading-div').loading('start');

  let startIndex = parseInt(getUrlParameter("start"));
  if (isNaN(startIndex)) {
    startIndex = 0;
  }

  let elementCount = parseInt(getUrlParameter("count"));
  if (isNaN(elementCount)) {
    elementCount = 5; // display this elements by default
  }

  updatePaginationLinks(startIndex, elementCount);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const timeCapsule = await getContract(provider);  

  let txHash = getUrlParameter("txHash");
  if (txHash !== undefined) {
    console.log("txHash:", txHash);
    verifyTransaction(txHash, timeCapsule, provider);
  }

  loadCards(startIndex, elementCount, timeCapsule);
}

async function verifyTransaction(txHash, timeCapsule, provider) {
  updateAlertText(`Capsule has been submitted, we will let you know when the transacction is confirmed. <a href="https://ropsten.etherscan.io/tx/${txHash}" target="_blank">View on Etherscan</a>`);

  const receipt = await provider.waitForTransaction(txHash);

  console.log("receipt:", receipt);
  let capsuleId;
  receipt.logs.forEach(log => {
    capsuleId = timeCapsule.interface.parseLog(log).args[0].toNumber();
  });

  updateAlertText(`Transaction confirmed. <a href="message.html?capsuleId=${capsuleId}">View Capsule</a>`);

}

function updateAlertText(text) {
  $('#alert-success').html(text);
  $('#alert-success').show();
}

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

async function getContract(provider) {
  await window.ethereum.enable();

  return new ethers.Contract(
    Contracts.TimeCapsule.address,
    Contracts.TimeCapsule.abi,
    provider
  )
}

async function loadCards(startIndex, elementCount, timeCapsule) {
  let cardListHtml = "";

  for (i = 0; i < elementCount; i++) {
    try {
      const capsuleId = startIndex + i;
      const capsuleLabel = await timeCapsule.getCapsuleLabel(capsuleId);
      console.log("capsuleId:", capsuleId);
      cardListHtml += createCardHtml(capsuleId, capsuleLabel);
    } catch(error) {
      console.log("error:", error);
      $('#loading-div').loading('stop');
      // disable next link
      $(".next-link").attr("href", null);

      break;
    }
  }

  $('#loading-div').loading('stop');
  $('#card-list').html(cardListHtml);
}

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