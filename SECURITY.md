# Security Policy & Responsible Disclosure

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Principles

1. **No Plaintext Passwords**: All user credentials are protected via salted PBKDF2/Argon2 hashing.
2. **Provider Key Protection**: API keys and secrets for sports providers (Sportradar, Betradar) and payment gateways (Telebirr) are strictly retained server-side and never exposed to client bundles.
3. **Sandbox Isolation**: The platform operates in sandbox mode without real monetary wagering, preventing unauthorized fund access.
4. **Replay & Injection Defense**: Transaction references use nonces and time-window validations.

## Reporting a Vulnerability

To report a vulnerability, please email `security@zenith.arena` with proof-of-concept steps. We aim to acknowledge receipt within 24 hours.
