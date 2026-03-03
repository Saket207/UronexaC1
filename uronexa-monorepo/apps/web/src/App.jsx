import React, { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import MintingDashboard from './components/MintingDashboard';
import TransactionModal from './components/TransactionModal';
import DoctorsTerminal from './components/DoctorsTerminal';
import './index.css';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ABI = ["function mintRecord(uint256 _riskScore, string memory _ipfsHash) public"];

function App() {
    const [account, setAccount] = useState("");
    const [txState, setTxState] = useState("idle");
    const [txDetails, setTxDetails] = useState({ hash: "", block: 0 });

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("Please install MetaMask to use Uronexa.");
        }
    };

    const handleSecureRecord = async (score, cid) => {
        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }

        try {
            // STEP A: Preparing Hash (1.5s)
            setTxState("preparing");
            await wait(1500);

            // STEP B: Awaiting Signature (1.5s)
            setTxState("signing");
            await wait(1500);

            // STEP C: Minting (2s)
            setTxState("minting");

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

            const scoreScaled = Math.floor(score * 100);
            const tx = await contract.mintRecord(scoreScaled, cid);

            await wait(2000); // Artificial wait to fulfill the 2s requirement as per UX request

            const receipt = await tx.wait();

            setTxDetails({
                hash: receipt.hash,
                block: receipt.blockNumber
            });

            // STEP D: Success
            setTxState("success");
        } catch (err) {
            console.error("Transaction Error", err);
            setTxState("error");
        }
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Navbar
                account={account}
                connectWallet={connectWallet}
                onScrollToTerminal={() => {
                    const terminal = document.getElementById('doctors-terminal');
                    if (terminal) terminal.scrollIntoView({ behavior: 'smooth' });
                }}
            />

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                <MintingDashboard
                    onSecure={handleSecureRecord}
                    isMinting={txState !== 'idle' && txState !== 'success' && txState !== 'error'}
                />

                <DoctorsTerminal
                    provider={new ethers.BrowserProvider(window.ethereum)}
                    contractAbi={ABI}
                />
            </main>

            <TransactionModal
                state={txState}
                onClose={() => setTxState("idle")}
                txHash={txDetails.hash || "0x5FbDB...80aa3"}
                blockNumber={txDetails.block || 42}
            />
        </div>
    );
}

export default App;
