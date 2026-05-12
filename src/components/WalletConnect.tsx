import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Check, AlertCircle, Loader } from "lucide-react";
import CardanoWalletService from "../services/cardanoWallet";

export function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const walletService = new CardanoWalletService();

  const availableWallets = [
    { name: "nami", label: "Nami", icon: "🔐" },
    { name: "eternl", label: "Eternl", icon: "🌊" },
    { name: "lace", label: "Lace", icon: "🎨" },
    { name: "yoroi", label: "Yoroi", icon: "🛡️" },
    { name: "typhon", label: "Typhon", icon: "⚡" },
  ];

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const walletName = localStorage.getItem("connectedWallet") as any;
    if (walletName) {
      try {
        await walletService.connect(walletName);
        const addr = await walletService.getAddress();
        const bal = await walletService.getBalanceInADA();

        if (addr && bal !== null) {
          setConnectedWallet(walletName);
          setAddress(addr);
          setBalance(bal);
        }
      } catch (err) {
        localStorage.removeItem("connectedWallet");
      }
    }
  };

  const handleConnect = async (walletName: any) => {
    setIsConnecting(true);
    setError(null);

    try {
      await walletService.connect(walletName);

      const addr = await walletService.getAddress();
      const bal = await walletService.getBalanceInADA();

      if (addr && bal !== null) {
        setConnectedWallet(walletName);
        setAddress(addr);
        setBalance(bal);
        localStorage.setItem("connectedWallet", walletName);
        setIsOpen(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    setConnectedWallet(null);
    setAddress(null);
    setBalance(null);
    localStorage.removeItem("connectedWallet");
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
          connectedWallet
            ? "bg-green-500/20 border border-green-500/50 text-green-400 hover:border-green-500/80"
            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50"
        }`}
      >
        <Wallet className="w-4 h-4" />
        {connectedWallet ? (
          <>
            <Check className="w-4 h-4" />
            <span className="hidden sm:inline">
              {formatAddress(address || "")}
            </span>
            <span className="sm:hidden">{connectedWallet}</span>
          </>
        ) : (
          "Connect Wallet"
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/50 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Connected State */}
            {connectedWallet ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">Connected</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={handleDisconnect}
                    className="text-xs px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 rounded hover:border-red-500/80 transition-colors"
                  >
                    Disconnect
                  </motion.button>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-gray-400">Wallet</div>
                  <div className="font-mono text-sm text-white break-all">
                    {connectedWallet}
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-gray-400">Address</div>
                  <div className="font-mono text-sm text-white break-all">
                    {address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-1">
                    <div className="text-xs text-gray-400">Balance</div>
                    <div className="text-lg font-bold gradient-text">
                      {balance?.toFixed(2)} ₳
                    </div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 space-y-1">
                    <div className="text-xs text-gray-400">Network</div>
                    <div className="text-lg font-bold text-purple-400">
                      Mainnet
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-400">{error}</span>
                  </motion.div>
                )}

                <h3 className="font-bold text-white mb-3">
                  Select Your Wallet
                </h3>

                <div className="space-y-2">
                  {availableWallets.map((wallet) => (
                    <motion.button
                      key={wallet.name}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleConnect(wallet.name)}
                      disabled={isConnecting}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-colors disabled:opacity-50"
                    >
                      <span className="text-2xl">{wallet.icon}</span>
                      <span className="flex-1 text-left font-semibold text-white">
                        {wallet.label}
                      </span>
                      {isConnecting && (
                        <Loader className="w-4 h-4 animate-spin text-purple-400" />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="text-xs text-gray-500 text-center pt-2">
                  Don't have a Cardano wallet? Install one from the links above.
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
