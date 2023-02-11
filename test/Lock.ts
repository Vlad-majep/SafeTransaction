import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SafeTransaction} from "../typechain-types";

describe("LendingProtocol", function() {
    async function deploy() {
      const [ seller, buyer ] = await ethers.getSigners();
      const SafetxFactory = await ethers.getContractFactory("SafeTransaction");
      const safetx : SafeTransaction = await SafetxFactory.deploy();
      await safetx.deployed();

      return { safetx, seller, buyer }
    }

    it("Cheack does have contract value", async function() {
      const { safetx} = await loadFixture(deploy);

      expect(await safetx.getBalance()).to.eq(100)
    });


  });