import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const name = "EntryPoint";

const deployEntryPoint: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network } = hre;
  const { deploy } = deployments;

  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  console.log(`Deploying ${name} from ${deployerAddress} on ${network.name}`);

  const entryPoint = await deploy("EntryPoint", {
    from: deployerAddress,
    args: [],
    log: true,
    deterministicDeployment: process.env.SALT ?? true,
    gasLimit: 6e6,
  });

  console.log("EntryPoint deployed to:", entryPoint.address);

  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contract on Etherscan");
    try {
      await hre.run("verify:verify", {
        address: entryPoint.address,
        constructorArguments: [],
      });
      console.log("EntryPoint verified on Etherscan");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  }
};

deployEntryPoint.tags = [name];

export default deployEntryPoint;
