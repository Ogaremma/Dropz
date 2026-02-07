import hre from "hardhat";
import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying with account:", deployer.address);

    const DropzToken = await ethers.getContractFactory("DropzToken");

    const token = await DropzToken.deploy(
        "Dropz Token",
        "DROPZ",
        1_000_000_000
    );

    await token.waitForDeployment();

    console.log("DropzToken deployed to:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
