const Web3Handler = {

  async getCurrentProvider() {
    if (!window.ethereum) {
      throw "NO_PROVIDER";
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    await ethereum.request({ method: 'eth_requestAccounts' });

    const networkName = (await provider.getNetwork()).name;

    if (networkName !== Contracts.network
        &&  !(networkName === 'unknown'
        && Contracts.network === 'localhost')) {
      console.log("provider:", provider);
      throw "INVALID_NETWORK";
    }

    return provider;
  },

  async getDefaultProvider() {
    let network = Contracts.network;
    if (network === 'localhost') {
      network = "http://localhost:8545"
    }
    const provider = new ethers.getDefaultProvider(network);
    
    console.log(`Getting default provider for netwrok ${Contracts.network}:`, provider);
    return provider;
  },

  async getContract(provider, contractName) {
    return await new ethers.Contract(
      Contracts[contractName].address,
      Contracts[contractName].abi,
      provider
    )
  }
};