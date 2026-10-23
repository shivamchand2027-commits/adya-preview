# Changelog

## October 24, 2026

### Refund/failure copy: source-backed two-state wording (owner-approved exact words, 24 Oct 03:02 IST)
- Syncs the preview root and recovery/ twin with the LIVE two-state copy: failed-payment line (bank auto-reversal, 7 working days, per Razorpay payments FAQ) and uncertain-after-payment line (do not pay again, FAQ query route, refund typically 5-7 working days after initiation, per Razorpay refunds doc).
- Removes the pre-hardening "auto-refunded by Razorpay" payment_not_verified line, the "No money was taken" fallbacks, and the bare "Connection problem" post-submit catch.

## October 22, 2026 (night, second drop)

### Dynamic per-application UPI QR at the fee step (ships at go-live)

- Backend v13: `createfeeqr` mints a single_use, exactly-Rs 499 UPI QR per applicant (30-min validity); `checkfeeqr` reports paid/expired from the QR entity's payments_amount_received; submissions with feeMethod `upi_qr` are verified server-side (amount + reuse check) before the row is written.
- Frontend QR mode (provider `qr` in config.js): dynamic QR image at the fee step, 4s auto-poll, auto-submit on payment, expired QR regenerates, "Pay by card or netbanking instead" runs the existing checkout as fallback.
- Verified: Razorpay's QR Codes API is live-mode only (test keys get "no Route matched"), so the first real QR mints after KYC activation + live keys. Production stays on the Razorpay checkout (test mode) until the go-live flip.


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

## 23 Oct 2026 - Clarity quick-backs + INP hardening + metrics hygiene

- Hero: added a kicker line above the H1 ("Invitation-only venture network for founders") and rewrote the hero sub-copy to lead with the value stack (direct VC connects, closed founder community, deck-to-decision pathway) so first-time visitors understand Adya's purpose in seconds (targets the 24.1% quick-backs signal from Microsoft Clarity).
- INP/performance hardening: hero background switched from skyline.jpg (135 KB) to skyline.webp (82 KB, saturation baked in); removed the runtime `filter: saturate()` on the background layer; removed backdrop-blur from form inputs and pills (both are known INP contributors on low-end devices); hero image preloaded on the landing page.
- Metrics hygiene: Clarity snippet now skips loading entirely on our own test sessions. Set `?internal=1` on any page to flag the device as internal (persisted in localStorage `adya_internal=1`); `?internal=0` clears it. Real visitor tracking is unchanged.
- robots.txt cleanup verified live: the old `Disallow: /vault.html` and `Disallow: /padhai.html` lines (root cause of those pages not indexing) were already removed; re-indexing requested in Search Console for faq, communities, vault and padhai.

## 23 Oct 2026 - Step 5 polish: SEO, structured data, accessibility

- Sub-pages (faq, communities, vault, padhai) now carry full Open Graph + Twitter Card meta (they previously had none) and per-page WebPage JSON-LD.
- faq.html gained FAQPage structured data (24 Q&A pairs extracted from the live page) for Google rich results.
- Accessibility: skip-to-main-content link on every page (visible on keyboard focus), gold :focus-visible ring for links, buttons, inputs and FAQ summaries, aria-label on the deck-link input.
- Footers: all five pages now carry the same footer; the stale FAQ footer line "No money is collected from applicants" was replaced with the accurate Rs 499 open-application wording (matching the homepage footer that shipped with the fee module).
- Removed stale skyline.jpg preloads (the CSS has used skyline.webp since the INP round); sub-pages now preload the webp hero.
- Verified on the preview site: JSON-LD parses, skip link and footer render, payment flow (form -> pay step) intact.
