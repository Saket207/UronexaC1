# URONEXA: Advanced AI Diagnostic & Blockchain Ledger

Uronexa is a high-fidelity diagnostic platform that uses Computer Vision to analyze urine test strips and stores results immutably on a decentralized ledger.

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd UronexaC1
```

### 2. Setup the AI Backend (Flask)
Navigate to the diagnostic core and install dependencies:
```powershell
cd SMARTurinalysis
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*The app will be running at `http://127.0.0.1:5000/`*

---

## ⛓️ Web3 & Blockchain Setup (Required for "Secure On-Chain")

### 1. Initialize the Hardhat Node
Open a **new terminal** and navigate to the contracts directory:
```powershell
cd uronexa-monorepo/apps/contracts
npm install
npx hardhat node
```
> [!IMPORTANT]
> Keep this terminal open! It is your local blockchain. It provides several test accounts with 10,000 ETH each.

### 2. Deploy the Smart Contract
Open a **third terminal** and run the deployment script:
```powershell
cd uronexa-monorepo/apps/contracts
npx hardhat run scripts/deploy.js --network localhost
```
*Note the **Contract Address** printed (Default: `0x5FbDB2315678afecb367f032d93F642f64180aa3`).*

### 3. Configure MetaMask
1. Open MetaMask > Networks > Add Network > **Add a network manually**.
2. **Network Name**: Hardhat Localhost
3. **RPC URL**: `http://127.0.0.1:8545`
4. **Chain ID**: `31337`
5. **Currency Symbol**: ETH
6. Import an account from the Hardhat terminal using one of the provided **Private Keys**.

---

## 🧪 Verification & Data Checking

### How to check the Ledger?
To see the actual data stored in your smart contract, run this helper script:
```powershell
cd uronexa-monorepo/apps/contracts
npx hardhat run scripts/check_records.js --network localhost
```

### Transaction Receipt
Success records in the UI will display a **Cryptographic Receipt** containing:
- **Transaction Hash**: Unique ID of your medical record.
- **Block Number**: The exact moment your data was frozen in time.

---

## 🛠️ Project Structure
- `/SMARTurinalysis`: Main Flask Application (Port 5000).
- `/uronexa-monorepo/apps/contracts`: Hardhat Backend & Solidity Ledger.
- `/uronexa-monorepo/apps/web`: (Optional) React-based alternative frontend.

---
**Lead Engineer**: Antigravity AI
**Aesthetic**: Clinical Anti-Gravity / Abyssal Blue


