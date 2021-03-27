import { ethers, network } from "hardhat";

async function main() {
    console.log("Deploying in network:", network.name);

    const TimeCapsule = await ethers.getContractFactory("TimeCapsule");
    const timeCapsule = await TimeCapsule.deploy();

    await timeCapsule.deployed();

    console.log("Contract Address:", timeCapsule.address);
    console.log("Contract Hash:", timeCapsule.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });