import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SafeTransaction, SafeTransaction__factory} from "../typechain-types";

describe("LendingProtocol", function() {
    async function deploy() {
      const [ seller, buyer ] = await ethers.getSigners();
      const SafetxFactory = await ethers.getContractFactory("SafeTransaction");
      const safetx : SafeTransaction = await SafetxFactory.deploy({value: 100});
      await safetx.deployed();

      return { safetx, seller, buyer }
    }

    it("Cheack does have contract value", async function() {
      const { safetx } = await loadFixture(deploy);

      expect(await safetx.getBalance()).to.eq(100)
    });

    it("Cheak are buyer pay x2 price", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      expect(await user2.confirmPurchase({value: 100}))
      expect(await safetx.getBalance()).to.eq(200)
    });

    it("To be revert confirmPurchase()", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      expect(await user2.confirmPurchase({value: 100}))
      await expect(user2.confirmPurchase({value: 100})).to.be.revertedWith("Invalid state");
    });

    it("Cheak to comfirmRecieved()", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      expect(await user2.confirmPurchase({value: 100}))
      expect(await user2.comfirmRecieved())
      expect(await safetx.getBalance()).to.eq(150)
    });

    it("Cheak to paySeller()", async function(){
      const { safetx , buyer, seller} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      expect(await user2.confirmPurchase({value: 100}))
      expect(await user2.comfirmRecieved())
      const user1 = safetx.connect(seller)
      expect(await user1.paySeller())
      expect(await safetx.getBalance()).to.eq(0)
    });

    it("To be revert comfirmRecieved() Invalid state", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      await expect(user2.comfirmRecieved()).to.be.revertedWith("Invalid state");
    });

    it("To be revert comfirmRecieved() not buyer", async function(){
      const { safetx , buyer, seller} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      expect(await user2.confirmPurchase({value: 100}))
      const user1 = safetx.connect(seller)
      await expect(user1.comfirmRecieved()).to.be.revertedWith("You are not buyer");
    });

    it("To be revert paySeller() Invalid state", async function(){
      const { safetx , seller} = await loadFixture(deploy);
      const user2 = safetx.connect(seller)

      await expect(user2.paySeller()).to.be.revertedWith("Invalid state");
    });

    it("To be revert paySeller() not seller", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      await expect(user2.paySeller()).to.be.revertedWith("You are not seller");
    });

    it("Cheak abort()", async function(){
      const { safetx , seller} = await loadFixture(deploy);
      const user2 = safetx.connect(seller)

      expect(await user2.abort())
      expect(await safetx.getBalance()).to.eq(0)
    });

    it("To be revert abort() not seller", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      await expect(user2.abort()).to.be.revertedWith("You are not seller");
    });

    it("To be revert abort() Invalid state", async function(){
      const { safetx , seller, buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      expect(await user2.confirmPurchase({value: 100}))
      const user1 = safetx.connect(seller)
      await expect(user1.abort()).to.be.revertedWith("Invalid state")
    });
    it("To be revert confirmPurchase() Pending don't x2 price", async function(){
      const { safetx , buyer} = await loadFixture(deploy);
      const user2 = safetx.connect(buyer)

      await expect(user2.confirmPurchase({value: 50})).to.be.revertedWith("Pending don't x2 price")
    });
});