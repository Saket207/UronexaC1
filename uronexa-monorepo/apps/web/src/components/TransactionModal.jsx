import React from 'react';

const TransactionModal = ({ state, onClose, txHash = "0x5FbDB...80aa3", blockNumber = 42 }) => {
    if (state === 'idle') return null;

    const renderContent = () => {
        switch (state) {
            case 'preparing':
                return (
                    <>
                        <div className="spinner"></div>
                        <h3 className="glow-cyan" style={{ marginBottom: '1rem', letterSpacing: '2px' }}>PREPARING HASH</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            Generating cryptographic proof of diagnostic data...
                        </p>
                    </>
                );
            case 'signing':
                return (
                    <>
                        <div className="spinner" style={{ borderTopColor: '#bc13fe' }}></div>
                        <h3 style={{ color: '#bc13fe', textShadow: '0 0 10px rgba(188, 19, 254, 0.5)', marginBottom: '1rem', letterSpacing: '2px' }}>AWAITING SIGNATURE</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            Please authorize the transaction in MetaMask...
                        </p>
                    </>
                );
            case 'minting':
                return (
                    <>
                        <div className="spinner"></div>
                        <h3 className="glow-cyan" style={{ marginBottom: '1rem', letterSpacing: '2px' }}>MINTING TO LEDGER</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                            Committing record to Hardhat Local Network...
                        </p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: 'rgba(0, 255, 163, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#00ffa3',
                            fontSize: '2rem',
                            boxShadow: '0 0 20px rgba(0, 255, 163, 0.3)'
                        }}>✓</div>
                        <h3 className="glow-green" style={{ marginBottom: '1.5rem', letterSpacing: '2px' }}>IMMUTABILITY SECURED</h3>

                        <div className="glass" style={{ textAlign: 'left', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', background: 'rgba(0, 255, 163, 0.03)' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Transaction Hash</div>
                                <div className="receipt-text">{txHash}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Block Number</div>
                                    <div className="receipt-text" style={{ color: '#00ffa3' }}>#{blockNumber}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.6rem', color: '#555', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Network</div>
                                    <div className="receipt-text">Hardhat Local</div>
                                </div>
                            </div>
                        </div>

                        <button className="btn-glow btn-glow-green" onClick={onClose} style={{ width: '100%' }}>
                            DISMISS PORTAL
                        </button>
                    </>
                );
            case 'error':
                return (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚠️</div>
                        <h3 style={{ color: '#ff4d4d', marginBottom: '1rem', letterSpacing: '2px' }}>TRANSACTION REJECTED</h3>
                        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '2rem' }}>
                            MetaMask signature failed or network error occurred.
                        </p>
                        <button className="btn-glow" onClick={onClose} style={{ width: '100%', borderColor: '#ff4d4d', color: '#ff4d4d' }}>
                            RETRY
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(5, 11, 20, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(12px)'
        }}>
            <div className="glass" style={{
                width: '90%',
                maxWidth: '450px',
                padding: '3.5rem 2.5rem',
                borderRadius: '32px',
                textAlign: 'center',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default TransactionModal;
