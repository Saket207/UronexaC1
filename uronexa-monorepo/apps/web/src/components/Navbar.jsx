import React, { useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

const Navbar = ({ account, connectWallet, onScrollToTerminal }) => {
    const x = useSpring(0, { stiffness: 100, damping: 10 });
    const y = useSpring(0, { stiffness: 100, damping: 10 });

    const rotateX = useTransform(y, [-20, 20], [20, -20]);
    const rotateY = useTransform(x, [-20, 20], [-20, 20]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };
    return (
        <nav className="glass" style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1200px',
            height: '64px',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#bc13fe',
                    borderRadius: '50%',
                    boxShadow: '0 0 15px #bc13fe'
                }}></div>
                <h1 style={{ fontSize: '1rem', fontWeight: 'bold', letterSpacing: '4px' }}>
                    URONEXA
                </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {account && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="conn-dot"></div>
                        <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '1px' }}>
                            HARDHAT LOCALHOST
                        </span>
                    </div>
                )}
                <button
                    className={`btn-glow ${account ? 'glow-green' : ''}`}
                    onClick={connectWallet}
                    style={{ fontSize: '0.8rem' }}
                >
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                </button>

                <motion.div
                    className="doctor-nav-icon glow-blue-pulse"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={onScrollToTerminal}
                    style={{
                        x, y,
                        rotateX, rotateY,
                        transformStyle: 'preserve-3d',
                        marginLeft: '0.5rem'
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Stethoscope size={20} strokeWidth={2.5} style={{ transform: 'translateZ(10px)' }} />
                </motion.div>
            </div>
        </nav>
    );
};

export default Navbar;
