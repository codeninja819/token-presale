import hre, { ethers } from "hardhat";
import config from './../hardhat.config';

const TokenCA = "0xB2eadDC5A2EeBBb71e89B70d97ce4f441a4DEf12";

async function main() {
  const now = parseInt((Date.now() / 1000).toFixed(0));
  const Presale = await ethers.getContractFactory("Presale");
  const presale = await Presale.deploy(TokenCA,
    100, ethers.utils.parseEther("0.1"), ethers.utils.parseEther("0.3"), now, now + 1000000);

  await presale.deployed();

  console.log(
    `Presale deployed to ${presale.address}`
  );

  await new Promise(resolve => setTimeout(resolve, 30000));

  await hre.run("verify:verify", {
    address: presale.address,
    constructorArguments: [
      TokenCA,
      100,
      ethers.utils.parseEther("0.1"),
      ethers.utils.parseEther("0.3"),
      now,
      now + 1000000]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
