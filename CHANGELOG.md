# Changelog

## October 22, 2026 (night)

### Test keys rotated

- config.js key id updated to the regenerated Razorpay test key (previous key revoked by the owner). Backend Script Properties updated in the live Apps Script project. End-to-end click-test re-run and passed 8:22 PM IST (ticket ADYA-D4FVCV, payment captured Rs 499 via test netbanking, Sheet row verified and removed).


## October 22, 2026 (evening)

### "Why Rs 499" explainer at the fee step

- Premium explainer block added above the payment options: serious read with no credibility filter + detailed team feedback, golden pass to gold features (VC connects, founder community, step-by-step guidance), honest terms (fee buys the read, not admission). Live on the preview; Razorpay test mode unchanged.

## Oct 22, 2026 - Open-lane Rs 499 application fee (Razorpay Standard Checkout)

- The "Apply anyway" (no-invite) journey now collects a one-time Rs 499 review fee before submission; invited founders apply free (backend-enforced, not just frontend copy).
- Razorpay Standard Checkout: order created server-side (Apps Script createfeeorder), checkout.js modal (UPI/cards/netbanking), backend verifies HMAC-SHA256(order_id|payment_id) signature + payment status via Razorpay API + rejects reused payment ids BEFORE writing the application.
- Razorpay keys live in Apps Script Script Properties (RZP_KEY_ID/RZP_KEY_SECRET); only the publishable key_id is in config.js. Secrets never in git.
- Submissions sheet gained columns N-Q: Fee INR, Fee method, UTR / payment ref, Fee status (auto-seeded).
- UPI-UTR manual bridge retained as a hidden fallback (provider switch in config.js).
- Fee mode flag in Code.gs: FEE_MODE 'soft' pre-live, 'enforce' once live keys are in.
- Backend v12 deployed with TEST keys (order creation verified live: test order created successfully from the deployed web app). End-to-end click-test PASSED (22 Oct 19:05 IST): test netbanking payment pay_TqyKq5fwbScPXm verified by the backend (signature + status + amount), Sheet row written with fee columns N-Q ('paid (razorpay captured)'), ack email sent, ticket ADYA-NBG727. Razorpay checkout note: the test bank simulator opens in a popup tab. Live keys after Razorpay KYC clears (1-2 business days).
