// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title TimeCapsule
 * @dev Capsule message should be encrypted off-chain and stored in IPFS
 * Encrytion key and IPFS hash will be stored in this contract
 * The key is not truly secret, but there is no truly way to store
 * information privately and decentralized in ethereum. This is
 * just so IPFS nodes can't reveal the message without depending
 * on this contract
 */
contract TimeCapsule {

    /**
     * @notice Struct containing the capsule's public information
     */
    struct CapsuleLabel {
        string summary;
        uint256 lockDate;
        uint256 unlockDate;
    }

    /**
     * @notice Struct containing the capsule's locked information
     */
    struct CapsuleContent {
        string ipfsHash;
        string aesKey;
    }

    Counters.Counter private _currentCapsuleCount;

    mapping (uint256 => CapsuleLabel) private _mapCapsulesLabels;
    mapping (uint256 => CapsuleContent) private _mapCapsulesContent;

    event CapsuleCreatedEvent(uint256 id);

    /**
     * @notice Creates a new time capsule
     * @param summary The text that is publicly displayed in the time capsule
     * @param unlockDate A uint specifying the date in unix timestamp format
     * after which the capsule can be unlocked
     * @param ipfsHash A string containing the hash pointing to the message
     * in IPFS
     * @param aesKey A string containing the AES key that decrypts the message
     * @return id of the capsule created
     **/
    function createCapsule(string calldata summary, 
            uint256 unlockDate, 
            string calldata ipfsHash, 
            string calldata aesKey) external returns (uint256) {

        require (unlockDate != 0, "ERROR_ZERO_UNLOCK_DATE");
        require (keccak256(abi.encodePacked(ipfsHash)) != keccak256(abi.encodePacked("")), "ERROR_EMPTY_IPFS");
        require (keccak256(abi.encodePacked(aesKey)) != keccak256(abi.encodePacked("")), "ERROR_EMPTY_AES_KEY");

        CapsuleLabel memory cSummary = CapsuleLabel(summary, block.timestamp, unlockDate);
        CapsuleContent memory cSecret = CapsuleContent(ipfsHash, aesKey);
        
        uint256 id = Counters.current(_currentCapsuleCount);

        _mapCapsulesLabels[id] = cSummary;
        _mapCapsulesContent[id] = cSecret;

        Counters.increment(_currentCapsuleCount);

        emit CapsuleCreatedEvent(id);
        return id;
    }

    /**
     * @notice Gets the capsule label struct composed by the public information
     * summary, lockDate and unlockDate
     * @param id A uint256 representing the capsule ID
     * @return CapsuleLabel struct composed by the public information
     * summary, lockDate and unlockDate
     */
    function getCapsuleLabel(uint256 id) external view returns (CapsuleLabel memory) {
        return (_mapCapsulesLabels[id]);
    }

    /**
     * @notice Gets the capsule content struct composed by the secret information
     * ipfs hash and aes key only if the capsule can be unlocked
     * @param id A uint256 representing the capsule ID
     * @return CapsuleContent struct composed by the secret information
     * ipfs hash and aes key. Reverts with message ERROR_CAPSULE_LOCKED if the current time
     * is not greater than the unlockDate
     */
    function getCapsuleContent(uint256 id) external view returns (CapsuleContent memory) {
        require (block.timestamp >= _mapCapsulesLabels[id].unlockDate, "ERROR_CAPSULE_LOCKED");

        return (_mapCapsulesContent[id]);
    }

}