import React, { useState } from 'react';
import { ethers } from 'ethers';

const VerificationPortal = ({ provider, contractAbi }) => {
    const [txHash, setTxHash] = useState("");
    const [decodedData, setDecodedData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!txHash.startsWith("0x") || txHash.length !== 66) {
            setError("Invalid Transaction Hash format.");
            setDecodedData(null);
            return;
        }

        setLoading(true);
        setError("");
        setDecodedData(null);

        try {
            // 1. Fetch Transaction
            const tx = await provider.getTransaction(txHash);
            if (!tx) {
                setError("Hash not found on local network.");
                setLoading(false);
                return;
            }

            // 2. Decode Input Data
            const iface = new ethers.Interface(contractAbi);
            const decoded = iface.parseTransaction({ data: tx.data });

            if (decoded && decoded.name === "mintRecord") {
                // 3. Get Block for Timestamp
                const block = await provider.getBlock(tx.blockNumber);

                setDecodedData({
                    blockNumber: tx.blockNumber,
                    riskScore: Number(decoded.args[0]) / 100,
                    ipfsHash: decoded.args[1],
                    timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString()
                });
            } else {
                setError("Transaction is not a Uronexa Ledger record.");
            }
        } catch (err) {
            console.error("Verification Error:", err);
            setError("Hash not found on local network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section style={{ width: '100%', maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
            <div className="glass" style={{ padding: '3rem', borderRadius: '24px', textAlign: 'center' }}>
                <h2 className="glow-cyan" style={{ marginBottom: '1.5rem', fontSize: '1rem', letterSpacing: '4px' }}>
                    ON-CHAIN DIAGNOSTIC VERIFICATION PORTAL
                </h2>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        className="verify-input"
                        placeholder="Enter Local Transaction Hash (0x...)"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                    />
                    <button
                        className="btn-glow"
                        onClick={handleVerify}
                        disabled={loading}
                        style={{ whiteSpace: 'nowrap', padding: '0 2rem' }}
                    >
                        {loading ? 'Consulting Ledger...' : 'View Decoded Data'}
                    </button>
                </div>

                {error && (
                    <p style={{ color: '#ef4444', fontSize: '0.9rem', textShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>
                        ⚠️ {error}
                    </p>
                )}

                {loading && <div className="spinner" style={{ marginTop: '2rem' }}></div>}

                {decodedData && (
                    <div className="results-panel glass" style={{
                        marginTop: '2rem',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'left',
                        background: 'rgba(0, 240, 255, 0.02)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase' }}>Block Number</label>
                                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#00f0ff' }}>#{decodedData.blockNumber}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <label style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase' }}>Status</label>
                                <p style={{ color: '#00ffa3', fontWeight: 'bold' }}>Secured & Verified (Immutably Locked)</p>
                            </div>

                            <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }}></div>

                            <div>
                                <label style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase' }}>Stored Risk Factor</label>
                                <p style={{ fontSize: '1.5rem', fontWeight: '900' }}>{decodedData.riskScore}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <label style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase' }}>IPFS Report CID</label>
                                <p className="receipt-text" style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>{decodedData.ipfsHash}</p>
                            </div>

                            <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '1rem' }}>
                                <small style={{ color: '#444' }}>Verification Timestamp</small>
                                <p style={{ fontSize: '0.85rem', color: '#888' }}>{decodedData.timestamp}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <p style={{ color: '#333', fontSize: '0.75rem', marginTop: '1.5rem', textAlign: 'center' }}>
                Physician UI: Use this portal to audit and verify diagnostic authenticity directly from the Hardhat Local Ledger.
            </p>
        </section>
    );
};

export default VerificationPortal;
