import { ethers } from "hardhat";

async function main() {
  const [ owner ] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner.address);

  console.log("Account balance:", (await owner.getBalance()).toString());

  const task = await ethers.getContractFactory("SafeTransaction");
  const contract = await task.deploy({value: 100});


  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});