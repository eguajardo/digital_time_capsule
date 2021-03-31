// Based on https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js

import { Contract, ContractFactory } from "@ethersproject/contracts";
import { artifacts, ethers, network } from "hardhat";

async function main() {
  console.log("Deploying to network:", network.name);

  const TimeCapsule: ContractFactory = await ethers.getContractFactory("TimeCapsule");
  const timeCapsule: Contract = await TimeCapsule.deploy();

  await timeCapsule.deployed();

  artifacts

  console.log("Contract Address:", timeCapsule.address);
  console.log("Contract Hash:", timeCapsule.deployTransaction.hash);

  saveFrontEndFiles(timeCapsule);
}

function saveFrontEndFiles(timeCapsule: Contract) {
  const fs = require("fs");
  const javascriptDir = __dirname + "/../frontend/static/js";

  if (!fs.existsSync(javascriptDir)) {
    fs.mkdirSync(javascriptDir);
  }

  const TimeCapsuleArtifact = artifacts.readArtifactSync("TimeCapsule");

  let Contracts = {
    network: network.name,
    TimeCapsule: {
      address: timeCapsule.address,
      abi: TimeCapsuleArtifact.abi
    }
  };

  fs.writeFileSync(
    javascriptDir + "/_contract.js",
    "const Contracts = " + JSON.stringify(Contracts, null, 2) + ";"
  );

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });