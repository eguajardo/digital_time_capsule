# Digital Time Capsule

This project was created as part of the gitcoin contest https://gitcoin.co/issue/Ideamarket/gitcoin-bounties/17/100025067

## About

The Digital Time Capsule allows you to create messages that remain locked until a predefined time. 

The messages will be encrypted and stored in IPFS, then the corresponding path and encryption keys will be stored in an Ethereum smart contract which keeps track of all time capsules and decides when they can be unlocked. Nothing is really secret in Ethereum but at least this allows for the messages to be unreadable for the IPFS nodes

## Demo

Smart contract is deployed to Ropsten testnetwork at this address: **0xf29DB9Ba8867dAe93d02D46df63e8404D161FE8b**

Working demo fully hosted in IPFS: https://gateway.pinata.cloud/ipfs/QmZFGrrdJ53k9kSZGwFjqhsJY4z2XgmgPyYbgTQAwYkVDP

Video demo (also hosted in IPFS): https://gateway.pinata.cloud/ipfs/QmeZpSTCbJe1qEB8NRAoFWs7X1NP2bvHvU66ndQ53FTEo4

## Run locally

First install everything

```
npm install
```

You will need 3 parallel terminals:

### Terminal 1: Server to host static pages
The site doesn't have any server-side code, however Metamask will require it to be hosted somewhere in order to inject the required javascript. So run the following command:

```
npm run server
```

Pages will be accesible at http://localhost:8080/

### Terminal 2: Hardhat Network
Now it's time to run the Hardhat Network to test locally before going to a testnet/mainet

```
npx hardhat node
```

The terminal will display some accounts which you can use to import them to Metamask for testing

### Terminal 3: Deploy contract
Now that the network is running, you need to deploy the contract to the running Hardhat Network node

```
npx hardhat run scripts/deploy.ts --network localhost
```

## Troubleshoot
- If you execute some transactions in Metamask and then restart the Hardhat Network, you may get some errors trying to process subsequent transactions. This is because Hardhat Network will expect some fresh data but Metamask will continue where it left with the previous instance of the network. This can be solved in two ways:
    * Use a different account that haven't been used before
    * Reinstall metamask. Don't forget to **backup** your seed phrase or you will lose your mainet accounts!
