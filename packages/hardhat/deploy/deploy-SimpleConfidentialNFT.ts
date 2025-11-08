import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const NFT_NAME = "Confidential NFT";
  const NFT_SYMBOL = "cNFT";
  const OWNER_ADDRESS = deployer; // Contract owner address

  const deployedSimpleConfidentialNFT = await deploy("SimpleConfidentialNFT", {
    from: deployer,
    args: [NFT_NAME, NFT_SYMBOL, OWNER_ADDRESS],
    log: true,
  });

  console.log(`SimpleConfidentialNFT contract: `, deployedSimpleConfidentialNFT.address);
};

export default func;
func.id = "deploy_simpleconfidentialnft"; // id required to prevent reexecution
func.tags = ["SimpleConfidentialNFT"];