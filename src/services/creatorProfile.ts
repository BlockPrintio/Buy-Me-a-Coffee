/**
 * Creator Profile Service
 * Manages creator profiles and their support history
 */

export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  walletAddress: string;
  avatar: string;
  coverImage: string;
  category: "developer" | "artist" | "spo" | "educator" | "other";
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
  createdAt: Date;
  totalEarned: number; // in ADA
  totalSupporters: number;
  membershipTiers?: MembershipTier[];
}

export interface MembershipTier {
  id: string;
  name: string;
  priceInAda: number;
  description: string;
  benefits: string[];
  receiptNFT: boolean;
}

export interface Support {
  id: string;
  creatorId: string;
  supporterId: string;
  supporterName: string;
  supporterMessage: string;
  amountInAda: number;
  timestamp: Date;
  transactionHash: string;
  receiptNFTId?: string;
  isPublic: boolean;
}

export class CreatorProfileService {
  private static profiles: Map<string, CreatorProfile> = new Map();
  private static supports: Support[] = [];

  /**
   * Create a new creator profile
   */
  static createProfile(
    data: Omit<
      CreatorProfile,
      "id" | "createdAt" | "totalEarned" | "totalSupporters"
    >,
  ): CreatorProfile {
    const profile: CreatorProfile = {
      ...data,
      id: `creator_${Date.now()}`,
      createdAt: new Date(),
      totalEarned: 0,
      totalSupporters: 0,
    };

    this.profiles.set(profile.id, profile);
    return profile;
  }

  /**
   * Get creator profile by wallet address
   */
  static getProfileByWallet(walletAddress: string): CreatorProfile | null {
    for (const profile of this.profiles.values()) {
      if (profile.walletAddress === walletAddress) {
        return profile;
      }
    }
    return null;
  }

  /**
   * Get creator profile by username
   */
  static getProfileByUsername(username: string): CreatorProfile | null {
    for (const profile of this.profiles.values()) {
      if (profile.username === username) {
        return profile;
      }
    }
    return null;
  }

  /**
   * Update creator profile
   */
  static updateProfile(
    id: string,
    data: Partial<CreatorProfile>,
  ): CreatorProfile | null {
    const profile = this.profiles.get(id);
    if (!profile) return null;

    const updated = { ...profile, ...data, id, createdAt: profile.createdAt };
    this.profiles.set(id, updated);
    return updated;
  }

  /**
   * Record a new support
   */
  static recordSupport(support: Omit<Support, "id">): Support {
    const newSupport: Support = {
      ...support,
      id: `support_${Date.now()}`,
    };

    this.supports.push(newSupport);

    // Update creator stats
    const profile = this.profiles.get(support.creatorId);
    if (profile) {
      profile.totalEarned += support.amountInAda;
      profile.totalSupporters += 1;
    }

    return newSupport;
  }

  /**
   * Get recent supports for a creator
   */
  static getRecentSupports(creatorId: string, limit: number = 10): Support[] {
    return this.supports
      .filter((s) => s.creatorId === creatorId && s.isPublic)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get all supports for a creator (including private)
   */
  static getAllSupports(creatorId: string): Support[] {
    return this.supports
      .filter((s) => s.creatorId === creatorId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Create membership tier
   */
  static createMembershipTier(
    creatorId: string,
    tier: Omit<MembershipTier, "id">,
  ): MembershipTier {
    const profile = this.profiles.get(creatorId);
    if (!profile) throw new Error("Creator not found");

    const newTier: MembershipTier = {
      ...tier,
      id: `tier_${Date.now()}`,
    };

    if (!profile.membershipTiers) {
      profile.membershipTiers = [];
    }

    profile.membershipTiers.push(newTier);
    return newTier;
  }

  /**
   * Get creator stats
   */
  static getStats(creatorId: string): {
    totalEarned: number;
    totalSupporters: number;
    averageSupport: number;
    lastSupport: Support | null;
  } | null {
    const profile = this.profiles.get(creatorId);
    if (!profile) return null;

    const supports = this.getAllSupports(creatorId);
    const lastSupport = supports[0] || null;
    const averageSupport =
      supports.length > 0 ? profile.totalEarned / supports.length : 0;

    return {
      totalEarned: profile.totalEarned,
      totalSupporters: profile.totalSupporters,
      averageSupport,
      lastSupport,
    };
  }

  /**
   * Verify creator wallet (mock - in production would use on-chain verification)
   */
  static verifyWallet(walletAddress: string): boolean {
    // In production, you would:
    // 1. Send a message to sign
    // 2. Verify the signature
    // 3. Confirm wallet ownership
    return /^addr1[a-z0-9]{98,}$/i.test(walletAddress);
  }
}

export default CreatorProfileService;
