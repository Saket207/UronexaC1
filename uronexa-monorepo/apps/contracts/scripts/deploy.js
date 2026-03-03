const hre = require("hardhat");

async function main() {
    console.log("Starting deployment of UronexaLedger...");

    const Ledger = await hre.ethers.deployContract("UronexaLedger");
    await Ledger.waitForDeployment();

    console.log("UronexaLedger deployed to:", await Ledger.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
