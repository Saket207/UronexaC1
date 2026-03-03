import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Database, Clock, Hash } from 'lucide-react';

const DoctorsTerminal = ({ provider, contractAbi }) => {
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
            const tx = await provider.getTransaction(txHash);
            if (!tx) {
                setError("Hash not found on local network.");
                setLoading(false);
                return;
            }

            const iface = new ethers.Interface(contractAbi);
            const decoded = iface.parseTransaction({ data: tx.data });

            if (decoded && decoded.name === "mintRecord") {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ padding: '60px 2rem 100px' }}
            id="doctors-terminal"
        >
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                <div className="glass terminal-card tilt-effect">
                    <div style={{ marginBottom: '3rem' }}>
                        <div className="terminal-indicator" style={{ marginBottom: '1rem' }}>
                            <Database size={10} /> HARDHAT_LOCAL_NODE_01
                        </div>
                        <h2 className="glow-cyan" style={{ fontSize: '1.2rem', letterSpacing: '6px', marginBottom: '0.5rem' }}>
                            DECRYPTION TERMINAL
                        </h2>
                        <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '2px' }}>
                            BLOCKCHAIN DIAGNOSTIC AUDIT • SECURE ACCESS ONLY
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <Hash size={18} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
                            <input
                                className="verify-input"
                                style={{ paddingLeft: '3rem' }}
                                placeholder="Enter Transaction Hash (0x...)"
                                value={txHash}
                                onChange={(e) => setTxHash(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn-glow"
                            onClick={handleVerify}
                            disabled={loading}
                            style={{ whiteSpace: 'nowrap', padding: '0 2.5rem' }}
                        >
                            {loading ? 'Decrypting...' : 'Verify Data'}
                        </button>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '2rem' }}
                        >
                            ⚠️ {error}
                        </motion.p>
                    )}

                    {loading && <div className="spinner" style={{ margin: '2rem auto' }}></div>}

                    {decodedData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass"
                            style={{
                                padding: '3rem',
                                borderRadius: '24px',
                                textAlign: 'left',
                                border: '1px solid rgba(0, 240, 255, 0.1)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
                                <ShieldCheck size={200} color="#00ffa3" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                <div>
                                    <div className="triage-label">CONSENSUS BLOCK #</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#00f0ff' }}>
                                        #{decodedData.blockNumber}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="triage-label">INTEGRITY STATUS</div>
                                    <div style={{ color: '#00ffa3', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <ShieldCheck size={16} /> VERIFIED ORIGINAL
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                                <div>
                                    <div className="triage-label">STORED CLINICAL RISK FACTOR</div>
                                    <div style={{ fontSize: '3rem', fontWeight: '900' }}>
                                        {decodedData.riskScore}<span style={{ fontSize: '1rem', color: '#444' }}>/10.0</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="triage-label">REPORT CRYPTOGRAPHIC CID (IPFS)</div>
                                    <div className="receipt-text" style={{ fontSize: '0.75rem', maxWidth: '250px', marginLeft: 'auto' }}>
                                        {decodedData.ipfsHash}
                                    </div>
                                </div>

                                <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '1rem' }}>
                                    <div className="triage-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                        <Clock size={12} /> VERIFICATION TIMESTAMP
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                        {decodedData.timestamp}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default DoctorsTerminal;
