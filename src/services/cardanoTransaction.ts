/**
 * Cardano Transaction Service
 * Handles creation and submission of ADA transactions
 */

interface TransactionDetails {
  recipientAddress: string;
  amountInLovelace: number;
  message?: string;
  receiptNFT?: boolean;
}

export class CardanoTransactionService {
  /**
   * Convert ADA to lovelace
   */
  static adaToLovelace(ada: number): number {
    return Math.round(ada * 1_000_000);
  }

  /**
   * Convert lovelace to ADA
   */
  static lovelaceToAda(lovelace: number): number {
    return lovelace / 1_000_000;
  }

  /**
   * Build a simple ADA transfer transaction
   * In production, this would use a Cardano library like lucid-cardano or cardano-cli
   */
  static buildTransaction(details: TransactionDetails): {
    amount: number;
    recipient: string;
    message?: string;
    receiptNFT: boolean;
  } {
    return {
      amount: CardanoTransactionService.lovelaceToAda(details.amountInLovelace),
      recipient: details.recipientAddress,
      message: details.message,
      receiptNFT: details.receiptNFT || false,
    };
  }

  /**
   * Calculate transaction fee
   * Support Ada takes 2.5% platform fee + network fee (~0.17 ADA)
   */
  static calculateFee(adaAmount: number): {
    platformFee: number;
    networkFee: number;
    totalFee: number;
    creatorReceives: number;
  } {
    const platformFee = adaAmount * 0.025; // 2.5%
    const networkFee = 0.17; // Standard Cardano network fee
    const totalFee = platformFee + networkFee;

    return {
      platformFee,
      networkFee,
      totalFee,
      creatorReceives: adaAmount - totalFee,
    };
  }

  /**
   * Get transaction explorer URL
   */
  static getTransactionUrl(txHash: string, isMainnet: boolean = true): string {
    const explorer = isMainnet ? 'https://cardanoscan.io' : 'https://testnet.cardanoscan.io';
    return `${explorer}/transaction/${txHash}`;
  }

  /**
   * Format transaction for display
   */
  static formatTransaction(txHash: string, amount: number, recipient: string): string {
    return `Sent ${amount} ADA to ${recipient.slice(0, 10)}... | TX: ${txHash.slice(0, 10)}...`;
  }
}

export default CardanoTransactionService;
