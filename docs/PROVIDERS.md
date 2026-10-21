# Provider Integration Architecture & Prerequisites

This document details the authorized provider-adapter architecture for Zenith Arena, including real third-party protocols, sandbox fallbacks, and the missing prerequisites required for production operation.

---

## 1. Sports Data Providers

### Sportradar Unified Odds Feed
- **Adapter**: `SportradarAdapter` in `src/services/sportsAdapter.ts`
- **Protocol**: RESTful + RabbitMQ AMQP Binary Feed
- **Required Production Credentials**:
  - `SPORTRADAR_API_KEY`: Issued upon contract signing.
  - `SPORTRADAR_NODE_ID`: Required for clustered delivery.
- **Sandbox Fallback**: When API keys are not detected on the server, the system automatically falls back to the calibrated `ZenithDemoProviderAdapter` with verified simulated match statistics.

### Betradar In-Play Match Tracker
- **Adapter**: `BetradarAdapter`
- **Protocol**: WebSocket Live Match Tracker
- **Status**: Live score synchronization with possession and dangerous attack modeling.

---

## 2. Casino Game Providers

### Spribe Gaming (Aviator Crash)
- **Adapter**: `SpribeProviderAdapter` in `src/services/casinoAdapter.ts`
- **Protocol**: Seamless Wallet API (REST Server-to-Server)
- **Integration Workflow**:
  1. Operator generates launch token via `/api/v1/casino/spribe/launch`.
  2. Spribe client iframe requests player balance via `/api/v1/casino/balance`.
  3. Real-time multiplier crash results settled via `/api/v1/casino/settle`.
- **Required Production Prerequisites**:
  - Spribe Merchant ID and Production Secret Key.
  - Whitelisted operator outbound IP addresses.
  - Approved jurisdiction certificate (e.g. MGA, UKGC, or Curacao).
- **Fallback**: The platform provides a 100% playable HTML5 Canvas `CrashGame` demo running directly in the browser with provably fair SHA-256 seed hashing.

### Pragmatic Play
- **Adapter**: `PragmaticPlayAdapter`
- **Protocol**: Direct API / Seamless Wallet
- **Status**: Modular adapter ready; awaiting production merchant agreement.

### Evolution Gaming
- **Adapter**: Live video streaming iframe launcher with staged mock tables.

---

## 3. Telebirr Payment Gateway (Ethio Telecom)

### Overview
Telebirr is Ethiopia's dominant mobile payment service provided by Ethio Telecom. Zenith Arena implements a complete sandbox simulation of the Telebirr Direct Pay H5 and USSD Push API.

### Required Prerequisites for Live Production:
1. **Commercial Contract**: Formal Merchant Agreement executed with Ethio Telecom Enterprise Solutions.
2. **App ID & Shortcode**: Official Shortcode (e.g. 8921) and Merchant Application ID.
3. **RSA Cryptographic Keys**:
   - 2048-bit Private Key for signing JSON deposit request payloads using `SHA256withRSA`.
   - Ethio Telecom Public Certificate for validating incoming IPN callback webhooks.
4. **Webhook Security**: TLS 1.3 encrypted HTTPS endpoint with strict timestamp replay protection (maximum 300s window).
5. **MSISDN Whitelisting**: Telebirr sandbox test numbers certified by Ethio Telecom QA engineers.
