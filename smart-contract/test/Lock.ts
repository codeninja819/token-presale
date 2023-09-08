import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const now = parseInt((Date.now() / 1000).toFixed(0));
      const Presale = await ethers.getContractFactory("Presale");
      const presale = await Presale.deploy("0x876B333C7395b2f947F08475678fe5a2B737ED76",
        100, ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.3"), now, now + 1000000);

      await presale.deployed();

      console.log(
        `Presale deployed to ${presale.address}`
      );

      const FreeMintToken = await ethers.getContractFactory('FreeMintToken');
      const token = await FreeMintToken.deploy("FreeMintToken", "FMT");
      await token.deployed();

      await token.mint(presale.address, ethers.utils.parseEther("1000000"));
      await presale.buyTokens({ value: ethers.utils.parseEther("0.1") });
    });
  });
});
