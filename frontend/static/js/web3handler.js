/**
 * Object with utility methods to handle web3
 */
const Web3Handler = {

  /**
   * Gets the current provider from the user connected wallet.
   * Useful for state changing operations in the blockchain
   * that need a signer
   * 
   * @returns a Web3Provider
   */
  async getCurrentProvider() {
    if (!window.ethereum) {
      // No wallet recognized in browser
      throw "NO_PROVIDER";
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts' });

    const networkName = (await provider.getNetwork()).name;
    if (networkName !== Contracts.network
        &&  !(networkName === 'unknown'
        && Contracts.network === 'localhost')) {

      // Wallet is not connected to the expected network
      throw "INVALID_NETWORK";
    }

    return provider;
  },

  /**
   * Gets a default provider for the configured network.
   * Useful for read-only operations in the blockchain
   * that don't require a signer. This way the user doesn't
   * need to have a wallet to get info from the smart contract
   * 
   * @returns a Web3Provider
   */
  async getDefaultProvider() {
    let network = Contracts.network;
    if (network === 'localhost') {
      network = "http://localhost:8545";
    }
    const provider = new ethers.getDefaultProvider(network);
    
    console.log(`Getting default provider for netwrok ${Contracts.network}:`, provider);
    return provider;
  },

  /**
   * Gets the contract by name
   * 
   * @param {Web3Provider} provider The provider from where to get the contract
   * @param {string} contractName The name of the contract
   * @returns a Contract object form the configured ABI and address
   */
  async getContract(provider, contractName) {
    return await new ethers.Contract(
      Contracts[contractName].address,
      Contracts[contractName].abi,
      provider
    )
  }
};