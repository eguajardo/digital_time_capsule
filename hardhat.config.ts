import { HardhatUserConfig } from "hardhat/types";

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.7.3", settings: {} }],
  },
};
export default config;