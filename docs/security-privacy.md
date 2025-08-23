# Security & privacy baseline (MVP)

- Data minimization: only store required PII (email/UID). No sensitive data in logs.
- Transport security: HTTPS/TLS; HSTS at gateway. No plaintext tokens.
- Client storage: Use Keychain/Keystore for auth tokens; wipe on logout.
- Access control: Verify Firebase tokens at gateway, service-to-service with secrets.
- Compliance: Publish privacy policy; DSAR process; age gating (18+ target).
- Incident response: On-call + critical alerting for auth/PII events.
