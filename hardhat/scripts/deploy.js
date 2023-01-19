// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");
require("dotenv").config({ path: ".env" });
const {WHITELIST_CONTRACT_ADDRESS, METADATA_URL}=require("../constants/index.js");
async function main() {
 const whiteList=WHITELIST_CONTRACT_ADDRESS;
 const contract=await ethers.getContractFactory("My_NFT");
 const deployedContract=await contract.deploy(METADATA_URL,whiteList);
 await deployedContract.deployed();
 console.log("Address:",deployedContract.address);//0x991851c6E1E13295FF966Ad9De720FB91c7FdAD1
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
