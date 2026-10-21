import { CasinoGame, CasinoProviderStatus } from '../types/casino';

export interface GameLaunchRequest {
  gameId: string;
  userId: string;
  currency: 'USD' | 'ETB';
  mode: 'demo' | 'real';
  language: 'en' | 'am' | 'ar';
}

export interface GameLaunchResponse {
  launchUrl: string;
  sessionId: string;
  isSandboxed: boolean;
  provider: string;
  instructions?: string;
}

export interface ICasinoGameProvider {
  id: string;
  name: string;
  getStatus(): Promise<CasinoProviderStatus>;
  getGames(): Promise<CasinoGame[]>;
  requestLaunchUrl(request: GameLaunchRequest): Promise<GameLaunchResponse>;
  isVerifiedConnection(): boolean;
}

/**
 * Spribe Adapter (Crash Games / Aviator)
 * Modular architecture prepared for Spribe API connection when operator agreement is in place.
 */
export class SpribeProviderAdapter implements ICasinoGameProvider {
  id = 'spribe';
  name = 'Spribe Gaming';
  private merchantId: string | null = null;
  private secretKey: string | null = null;

  constructor(merchantId?: string, secretKey?: string) {
    this.merchantId = merchantId || null;
    this.secretKey = secretKey || null;
  }

  isVerifiedConnection(): boolean {
    return Boolean(this.merchantId && this.secretKey);
  }

  async getStatus(): Promise<CasinoProviderStatus> {
    const isConn = this.isVerifiedConnection();
    return {
      id: this.id,
      name: this.name,
      status: isConn ? 'connected' : 'awaiting_agreement',
      activeGames: isConn ? 12 : 0,
      apiProtocol: 'REST / Seamless Wallet',
      latencyMs: isConn ? 38 : 0,
      sandboxMode: !isConn,
      documentationUrl: 'https://spribe.co/docs/seamless-wallet-integration',
    };
  }

  async getGames(): Promise<CasinoGame[]> {
    return [];
  }

  async requestLaunchUrl(request: GameLaunchRequest): Promise<GameLaunchResponse> {
    if (!this.isVerifiedConnection()) {
      return {
        launchUrl: '',
        sessionId: '',
        isSandboxed: true,
        provider: this.name,
        instructions:
          'Spribe API credentials not configured. Official merchant agreement required. Zenith internal playable demo will be launched instead.',
      };
    }
    return {
      launchUrl: `https://stage-game.spribe.io/launcher.html?token=demo_${request.userId}&currency=${request.currency}`,
      sessionId: `SPR-${Date.now()}`,
      isSandboxed: false,
      provider: this.name,
    };
  }
}

/**
 * Pragmatic Play Provider Adapter
 */
export class PragmaticPlayAdapter implements ICasinoGameProvider {
  id = 'pragmatic';
  name = 'Pragmatic Play';
  private secureLogin: string | null = null;

  constructor(secureLogin?: string) {
    this.secureLogin = secureLogin || null;
  }

  isVerifiedConnection(): boolean {
    return Boolean(this.secureLogin);
  }

  async getStatus(): Promise<CasinoProviderStatus> {
    return {
      id: this.id,
      name: this.name,
      status: this.isVerifiedConnection() ? 'connected' : 'awaiting_agreement',
      activeGames: this.isVerifiedConnection() ? 124 : 0,
      apiProtocol: 'REST / Seamless Wallet',
      latencyMs: this.isVerifiedConnection() ? 45 : 0,
      sandboxMode: true,
      documentationUrl: 'https://pragmaticplay.com/integration-specs',
    };
  }

  async getGames(): Promise<CasinoGame[]> {
    return [];
  }

  async requestLaunchUrl(): Promise<GameLaunchResponse> {
    return {
      launchUrl: '',
      sessionId: '',
      isSandboxed: true,
      provider: this.name,
      instructions: 'Pragmatic Play merchant credentials awaiting provider approval.',
    };
  }
}

/**
 * Zenith Original Engine Adapter (In-House Playable Demos)
 */
export class ZenithOriginalsAdapter implements ICasinoGameProvider {
  id = 'zenith_originals';
  name = 'Zenith Originals Engine';

  isVerifiedConnection(): boolean {
    return true;
  }

  async getStatus(): Promise<CasinoProviderStatus> {
    return {
      id: this.id,
      name: this.name,
      status: 'sandbox',
      activeGames: 5,
      apiProtocol: 'WebSocket Stream',
      latencyMs: 8,
      sandboxMode: true,
      documentationUrl: 'internal://zenith.engine/docs',
    };
  }

  async getGames(): Promise<CasinoGame[]> {
    return [];
  }

  async requestLaunchUrl(request: GameLaunchRequest): Promise<GameLaunchResponse> {
    return {
      launchUrl: `internal://games/${request.gameId}`,
      sessionId: `ZEN-ROUND-${Date.now()}`,
      isSandboxed: true,
      provider: this.name,
    };
  }
}
