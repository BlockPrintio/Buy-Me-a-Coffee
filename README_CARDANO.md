# Support Ada - Cardano Creator Support Platform

A modern, fully-functional Cardano-native creator support platform inspired by Buy Me a Coffee, but built entirely for the Cardano ecosystem with on-chain verification and native ADA transactions.

## 🚀 Features

### Core Functionality
- **Non-Custodial Wallet Integration** - Connect with Nami, Eternl, Lace, Yoroi, and Typhon wallets
- **Native ADA Transactions** - Send and receive ADA directly on-chain with no intermediaries
- **Creator Pages** - Set up your creator profile in seconds
- **Support Tiers** - Create membership levels with custom benefits
- **On-Chain Receipts** - Supporters can mint NFT proof-of-support receipts
- **Public Support Wall** - Showcase recent supporters with their messages
- **Analytics Dashboard** - Track earnings, supporters, and growth metrics

### Technical Features
- **100% Non-Custodial** - Transactions go directly wallet-to-wallet
- **Smart Contract Integration** - Ready for on-chain verification
- **Multi-Wallet Support** - Works with all major Cardano wallets
- **Real-Time Notifications** - Instant alerts for new supporters
- **Responsive Design** - Beautiful on desktop, tablet, and mobile
- **Dark Theme** - Modern, eye-catching Cardano-themed UI

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Cardano Integration**: Multi-wallet CIP-30 support

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── FeaturesSection.tsx
│   ├── SupportSection.tsx
│   ├── Testimonials.tsx
│   ├── StatsSection.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── WalletConnect.tsx
│   ├── MembershipSection.tsx
│   ├── ShopSection.tsx
│   ├── WallOfLove.tsx
│   └── FinalCTA.tsx
├── services/            # Business logic services
│   ├── cardanoWallet.ts       # Wallet connection & management
│   ├── cardanoTransaction.ts  # Transaction handling
│   └── creatorProfile.ts      # Creator profile management
├── pages/
│   └── LandingPage.tsx
├── App.tsx
├── index.tsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- A Cardano wallet extension (Nami, Eternl, Lace, Yoroi, or Typhon)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Buy-Me-a-Coffee

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The development server will start at `http://localhost:5173`

## 📋 API Reference

### Wallet Service

```typescript
import CardanoWalletService from '@/services/cardanoWallet';

const walletService = new CardanoWalletService();

// Get available wallets
const wallets = CardanoWalletService.getAvailableWallets();

// Connect to a wallet
await walletService.connect('nami');

// Check connection status
const isConnected = await walletService.isConnected();

// Get wallet address
const address = await walletService.getAddress();

// Get balance in ADA
const balanceADA = await walletService.getBalanceInADA();

// Sign data with wallet
const signature = await walletService.signData('message');

// Disconnect wallet
walletService.disconnect();
```

### Transaction Service

```typescript
import CardanoTransactionService from '@/services/cardanoTransaction';

// Convert between ADA and lovelace
const lovelace = CardanoTransactionService.adaToLovelace(5);
const ada = CardanoTransactionService.lovelaceToAda(5000000);

// Calculate transaction fees
const fees = CardanoTransactionService.calculateFee(5);
// Returns: { platformFee, networkFee, totalFee, creatorReceives }

// Get transaction explorer URL
const url = CardanoTransactionService.getTransactionUrl(txHash, true);
```

### Creator Profile Service

```typescript
import CreatorProfileService from '@/services/creatorProfile';

// Create a creator profile
const profile = CreatorProfileService.createProfile({
  username: 'luna_dev',
  displayName: 'Luna Dev',
  bio: 'Plutus smart contract developer',
  walletAddress: 'addr1...',
  avatar: 'https://...',
  coverImage: 'https://...',
  category: 'developer'
});

// Get profile by wallet
const profile = CreatorProfileService.getProfileByWallet(address);

// Record a support transaction
const support = CreatorProfileService.recordSupport({
  creatorId: 'creator_123',
  supporterId: 'supporter_456',
  supporterName: 'Alice',
  supporterMessage: 'Great work!',
  amountInAda: 5,
  timestamp: new Date(),
  transactionHash: 'abc123...',
  isPublic: true
});

// Get recent supports
const supports = CreatorProfileService.getRecentSupports(creatorId, 10);

// Get creator statistics
const stats = CreatorProfileService.getStats(creatorId);
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue-600 to Purple-600 (gradient)
- **Background**: #0A1428 (dark navy)
- **Surface**: #1a1f3a (darker navy)
- **Accent**: Purple-500, Pink-500
- **Text**: White, gray-300, gray-400

### Typography
- **Display**: Space Grotesk (headings)
- **Body**: Plus Jakarta Sans (content)
- **Code**: Monospace

### Component Patterns
- Dark theme with purple/blue accents
- Glassmorphism with backdrop blur
- Smooth Framer Motion animations
- Responsive grid layouts
- Accessible form controls

## 🔐 Security Considerations

### Current Implementation
- No private keys stored on server
- All transactions signed in user's wallet
- CIP-30 wallet standard compliance
- Message signing for verification

### Production Recommendations
1. **Smart Contract Audit** - Have Plutus smart contracts audited before mainnet
2. **Wallet Connection Security** - Implement additional verification for high-value transactions
3. **Rate Limiting** - Add API rate limiting for transaction submissions
4. **Environment Validation** - Verify network ID and validate addresses server-side
5. **Compliance** - Consult legal team regarding creator payments and taxation

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
- **Netlify**: Connect GitHub repo directly
- **GitHub Pages**: `npm run build` and push `dist/` folder
- **Self-hosted**: `npm run build` and serve `dist/` folder

## 📝 Environment Variables

Create a `.env.local` file:

```env
VITE_CARDANO_NETWORK=mainnet
VITE_API_ENDPOINT=https://api.example.com
```

## 🧪 Testing Locally

### On Testnet
1. Switch your wallet to Cardano testnet
2. Get testnet ADA from [testnet faucet](https://testnets.cardano.org/en/testnets/cardano/faucet/)
3. Test transactions on testnet first

### Component Storybook (Optional)
Add Storybook for isolated component testing:
```bash
npx storybook@latest init
```

## 🚀 Future Enhancements

- [ ] Membership subscription recurring payments
- [ ] Digital goods/NFT shop integration
- [ ] Creator analytics dashboard
- [ ] Video content with paid tiers
- [ ] Community features (comments, reactions)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Creator referral program
- [ ] Integration with Project Catalyst
- [ ] DAO governance for platform

## 📚 Resources

- [Cardano Docs](https://docs.cardano.org)
- [CIP-30 Wallet Standard](https://cips.cardano.org/cips/cip30/)
- [Plutus Documentation](https://plutus.readthedocs.io/)
- [Lucid Cardano](https://lucid.spacebudz.com/) - TypeScript Cardano library
- [Blockfrost API](https://blockfrost.io/) - Cardano API

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your Cardano projects!

## 💬 Support

For questions or issues:
- Create an issue on GitHub
- Join the Cardano Discord community
- Check the [FAQ section](/#faq) on the website

## 🙏 Acknowledgments

- Inspired by [Buy Me a Coffee](https://buymeacoffee.com)
- Built for the amazing Cardano ecosystem
- Thanks to all wallet providers for CIP-30 implementation
- Cardano Foundation for excellent documentation

---

**Built with ❤️ for the Cardano community**

Visit: [supportada.io](https://supportada.io) (coming soon)
