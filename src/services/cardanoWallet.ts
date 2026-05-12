/**
 * Cardano Wallet Integration Service
 * Handles multi-wallet support and wallet connections
 */

export interface WalletAPI {
  enable: () => Promise<void>;
  isEnabled: () => Promise<boolean>;
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
  signData: (data: string) => Promise<{ signature: string; key: string }>;
  submitTx: (tx: string) => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
}

export type WalletName = 'nami' | 'eternl' | 'lace' | 'yoroi' | 'typhon';

const WALLET_NAMES: Record<WalletName, string> = {
  nami: 'nami',
  eternl: 'eternl',
  lace: 'lace',
  yoroi: 'yoroi',
  typhon: 'typhon',
};

export class CardanoWalletService {
  private wallet: WalletAPI | null = null;
  private walletName: WalletName | null = null;

  /**
   * Get available wallets
   */
  static getAvailableWallets(): WalletName[] {
    const available: WalletName[] = [];

    if (typeof window !== 'undefined' && window.cardano) {
      Object.keys(WALLET_NAMES).forEach((name) => {
        if (window.cardano[name as WalletName]) {
          available.push(name as WalletName);
        }
      });
    }

    return available;
  }

  /**
   * Connect to a specific wallet
   */
  async connect(walletName: WalletName): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.cardano) {
        throw new Error('Cardano wallets not available. Please install a wallet extension.');
      }

      const walletInterface = window.cardano[walletName];
      if (!walletInterface) {
        throw new Error(`${walletName} wallet not found. Please install it first.`);
      }

      const wallet = await walletInterface.enable();
      if (!wallet) {
        throw new Error('Failed to enable wallet');
      }

      this.wallet = wallet;
      this.walletName = walletName;
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${walletName}:`, error);
      throw error;
    }
  }

  /**
   * Check if wallet is connected
   */
  async isConnected(): Promise<boolean> {
    if (!this.wallet || !this.walletName) return false;

    try {
      return await this.wallet.isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Get connected wallet address
   */
  async getAddress(): Promise<string | null> {
    if (!this.wallet) return null;

    try {
      const addresses = await this.wallet.getUsedAddresses();
      return addresses && addresses.length > 0 ? addresses[0] : null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }

  /**
   * Get wallet balance in lovelace
   */
  async getBalance(): Promise<string | null> {
    if (!this.wallet) return null;

    try {
      const balance = await this.wallet.getBalance();
      return balance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }

  /**
   * Get wallet balance in ADA
   */
  async getBalanceInADA(): Promise<number | null> {
    const balance = await this.getBalance();
    if (!balance) return null;

    return parseInt(balance) / 1_000_000;
  }

  /**
   * Get network ID (0 for testnet, 1 for mainnet)
   */
  async getNetworkId(): Promise<number | null> {
    if (!this.wallet) return null;

    try {
      return await this.wallet.getNetworkId();
    } catch (error) {
      console.error('Error getting network ID:', error);
      return null;
    }
  }

  /**
   * Sign data with wallet
   */
  async signData(message: string): Promise<{ signature: string; key: string } | null> {
    if (!this.wallet) return null;

    try {
      return await this.wallet.signData(message);
    } catch (error) {
      console.error('Error signing data:', error);
      return null;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.wallet = null;
    this.walletName = null;
  }

  /**
   * Get current wallet name
   */
  getWalletName(): WalletName | null {
    return this.walletName;
  }
}

// Declare global window interface for Cardano wallets
declare global {
  interface Window {
    cardano?: {
      [key in WalletName]?: {
        enable: () => Promise<WalletAPI>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}

export default CardanoWalletService;
