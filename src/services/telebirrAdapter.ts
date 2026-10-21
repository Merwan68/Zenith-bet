import { WalletTransaction } from '../types/wallet';

export interface TelebirrInitResponse {
  success: boolean;
  transactionRef: string;
  orderId: string;
  qrCodeUrl?: string;
  ussdPromptSent: boolean;
  message: string;
}

export interface TelebirrIntegrationDocs {
  merchantAppId: string;
  apiUrl: string;
  returnUrl: string;
  notifyUrl: string;
  rsaKeyRequired: boolean;
  requiredPrerequisites: string[];
}

/**
 * Telebirr Sandbox Payment Adapter
 * Compliant with Ethio Telecom Telebirr H5/Direct Pay Merchant specifications.
 * Enforces strict sandbox isolation: Never claims real money, never stores user PINs or OTPs.
 */
export class TelebirrSandboxAdapter {
  private static readonly SANDBOX_ENDPOINT = 'https://api.sandbox.telebirr.et/payment/v1/toPaymentUrl';

  public static getPrerequisites(): TelebirrIntegrationDocs {
    return {
      merchantAppId: 'ETHIO_TELECOM_MERCHANT_APP_SANDBOX_DEMO',
      apiUrl: this.SANDBOX_ENDPOINT,
      returnUrl: 'https://zenith.arena/wallet/telebirr/return',
      notifyUrl: 'https://zenith.arena/api/v1/telebirr/ipn-callback',
      rsaKeyRequired: true,
      requiredPrerequisites: [
        '1. Official Merchant Agreement executed with Ethio Telecom Business Solutions.',
        '2. Registered Merchant App ID & Shortcode issued by Telebirr Operations.',
        '3. 2048-bit RSA Public/Private Keypair generated for JSON payload signature verification (SHA256withRSA).',
        '4. Server-to-server IPN (Instant Payment Notification) callback webhook configured with HTTPS TLS 1.3.',
        '5. Webhook listener verifying timestamp freshness (anti-replay within 300s) and nonces.',
        '6. Sandbox test mobile MSISDNs whitelist approved by Telebirr QA engineers.',
      ],
    };
  }

  /**
   * Simulates initiating a Telebirr deposit request in Sandbox mode.
   * Generates a realistic transaction reference and validates basic Ethiopian phone format.
   */
  public static async initiateDeposit(
    phoneNumber: string,
    amountBirr: number
  ): Promise<TelebirrInitResponse> {
    // Validate Ethiopian phone format (e.g. 09XXXXXXXX or 07XXXXXXXX or +251...)
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const ethPhoneRegex = /^(?:\+251|0)?[97]\d{8}$/;

    if (!ethPhoneRegex.test(cleanPhone)) {
      throw new Error('Please enter a valid Ethiopian mobile number (e.g. 0911234567 or 0712345678).');
    }

    if (amountBirr < 10) {
      throw new Error('Minimum sandbox deposit is 10 ETB.');
    }

    if (amountBirr > 100000) {
      throw new Error('Maximum sandbox deposit per transaction is 100,000 ETB.');
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ref = `TB-ETB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ORD-ZN-${Date.now()}`;

    return {
      success: true,
      transactionRef: ref,
      orderId,
      ussdPromptSent: true,
      message: `Simulated USSD push notification sent to ${cleanPhone}. Please approve the transaction in the sandbox prompt.`,
    };
  }

  /**
   * Simulates confirming the sandbox Telebirr transaction after mock user confirmation.
   */
  public static async confirmSandboxPayment(
    reference: string,
    amountBirr: number,
    phoneNumber: string
  ): Promise<WalletTransaction> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'deposit',
      amount: amountBirr,
      currency: 'ETB',
      status: 'completed',
      method: 'Telebirr Sandbox',
      reference,
      description: `Telebirr Sandbox Deposit (${phoneNumber.slice(-4).padStart(phoneNumber.length, '*')})`,
      timestamp: new Date().toISOString(),
      telebirrPhone: phoneNumber,
    };
  }
}
