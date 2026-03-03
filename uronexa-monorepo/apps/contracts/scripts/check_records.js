const hre = require("hardhat");

async function main() {
    const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const UronexaLedger = await hre.ethers.getContractAt("UronexaLedger", CONTRACT_ADDRESS);

    // Hardhat doesn't have an easy "get all" unless we add it, but we can check the last 5 records
    // Actually, our UronexaLedger.sol has 'Record[] public records;'
    // But Solidity doesn't return the whole array at once if it's public.

    // Instead, let's just log the total count if we added a counter, or just try to fetch a few.
    console.log("Checking Uronexa Health Ledger...");

    // Get the first Hardhat account to check its records
    const [owner] = await hre.ethers.getSigners();
    console.log(`Querying records for address: ${owner.address}\n`);

    try {
        const history = await UronexaLedger.getHistory(owner.address);

        if (history.length === 0) {
            console.log("No records found for this patient.");
        } else {
            history.forEach((record, i) => {
                console.log(`Record #${i + 1}:`);
                console.log(` - Risk Score: ${Number(record.riskScore) / 100}%`);
                console.log(` - IPFS Hash:  ${record.ipfsHash}`);
                console.log(` - Timestamp:  ${new Date(Number(record.timestamp) * 1000).toLocaleString()}`);
                console.log("----------------------------");
            });
            console.log(`Total Records: ${history.length}`);
        }
    } catch (err) {
        console.error("Error reading from contract:", err.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
