import { HardhatUserConfig } from "hardhat/types";

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import * as dotenv from "dotenv";

task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.3", settings: {} }],
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 10000
      },
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/ffb37bda4b4f4641923589a663bdee8f",
      accounts: [process.env.ROPSTEN_ACCOUNT_1!, process.env.ROPSTEN_ACCOUNT_2!, process.env.ROPSTEN_ACCOUNT_3!, process.env.ROPSTEN_ACCOUNT_4!, process.env.ROPSTEN_ACCOUNT_5!]
    }
  }
};
export default config;