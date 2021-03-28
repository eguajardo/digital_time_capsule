const Contracts = {
  "TimeCapsule": {
    "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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