const Contracts = {
  "TimeCapsule": {
    "network": "ropsten",
    "address": "0xf29DB9Ba8867dAe93d02D46df63e8404D161FE8b",
    "abi": [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "CapsuleCreatedEvent",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "summary",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "unlockDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "aesKey",
            "type": "string"
          }
        ],
        "name": "createCapsule",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "getCapsuleContent",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "aesKey",
                "type": "string"
              }
            ],
            "internalType": "struct TimeCapsule.CapsuleContent",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "getCapsuleLabel",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "summary",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "lockDate",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "unlockDate",
                "type": "uint256"
              }
            ],
            "internalType": "struct TimeCapsule.CapsuleLabel",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
};