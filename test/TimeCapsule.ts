import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "ethers";


describe("TimeCapsule contract", () => {
    let timeCapsule: Contract;

    beforeEach(async () => {
        const signers: SignerWithAddress[] = await ethers.getSigners();
        const timeCapsuleFactory: ContractFactory = await ethers.getContractFactory(
            "TimeCapsule", 
            signers[0]
        );
        timeCapsule = await timeCapsuleFactory.deploy();
        await timeCapsule.deployed();
    })

    it('Creates capsule successfully', async() => {
        const SUMMARY: string = "Some summary";
        const UNLOCK_DATE: number = Math.floor(Date.now() / 1000);
        const IPFS_HASH: string = "IPFS_HASH"
        const AES_KEY: string = "AES_KEY";

        const tx = await timeCapsule.createCapsule(
            SUMMARY,
            UNLOCK_DATE,
            IPFS_HASH,
            AES_KEY
        );

        await expect(tx)
            .to.emit(timeCapsule, "CapsuleCreatedEvent")
            .withArgs(0);
    });

    it('Capsule stores correct info', async() => {
        const SUMMARY: string = "Some summary";
        const UNLOCK_DATE: number = Math.floor(Date.now() / 1000);
        const IPFS_HASH: string = "IPFS_HASH"
        const AES_KEY: string = "AES_KEY";

        await timeCapsule.createCapsule(
            SUMMARY,
            UNLOCK_DATE,
            IPFS_HASH,
            AES_KEY
        );

        const label = await timeCapsule.getCapsuleLabel(0);
        const content = await timeCapsule.getCapsuleContent(0);

        expect(label.summary).to.equal(SUMMARY);
        expect(label.unlockDate.toNumber()).to.equal(UNLOCK_DATE);
        expect(label.lockDate.toNumber()).to.be.greaterThan(UNLOCK_DATE);
        expect(content.ipfsHash).to.equal(IPFS_HASH);
        expect(content.aesKey).to.equal(AES_KEY);
    });

    it('Capsule is locked', async() => {

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const SUMMARY: string = "Some summary";
        const UNLOCK_DATE: number = Math.floor(tomorrow.getTime() / 1000);
        const IPFS_HASH: string = "IPFS_HASH"
        const AES_KEY: string = "AES_KEY";

        await timeCapsule.createCapsule(
            SUMMARY,
            UNLOCK_DATE,
            IPFS_HASH,
            AES_KEY
        );

        await expect(timeCapsule.getCapsuleContent(0))
            .to.be.revertedWith("ERROR_CAPSULE_LOCKED");
    });

    it('Invalid ID for Capsule label', async() => {
        await expect(timeCapsule.getCapsuleLabel(0))
            .to.be.revertedWith("ERROR_INVALID_ID");
    });

    it('Invalid ID for Capsule content', async() => {
        await expect(timeCapsule.getCapsuleContent(0))
            .to.be.revertedWith("ERROR_INVALID_ID");
    });

});