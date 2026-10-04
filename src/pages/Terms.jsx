import PageIntro from "../components/ui/PageIntro.jsx";
import { BRAND } from "../data/site.js";
import "./Static.css";

const UPDATED = "October 4, 2026";

const SECTIONS = [
  {
    title: "About these terms",
    body: [
      "These terms cover your use of the Kapresco website and any orders you place through it. By browsing, ordering, or creating an account, you agree to them.",
      "Kapresco is a small coffee shop in Mati City, Davao Oriental. We keep things simple and honest — if anything here reads wrong, tell us and we’ll fix it.",
    ],
  },
  {
    title: "Orders and pricing",
    body: [
      "All prices are shown in Philippine pesos and include applicable taxes. Prices may change without notice, but the price shown at checkout is the price you pay.",
      "An order is accepted once we confirm it. If an item is unavailable after you order, we’ll contact you and offer a substitute or a refund for the affected item.",
      "Promo codes can’t be stacked, and we may withdraw an offer at any time. Minimum spend and validity windows are shown with each code.",
    ],
  },
  {
    title: "Delivery and pickup",
    body: [
      "We currently deliver within and around Mati City. Delivery windows are estimates, and traffic or weather can shift them.",
      "Please make sure your address and contact number are accurate. Failed deliveries caused by wrong details may be charged to you.",
      "Pickup orders are held for 30 minutes past the stated ready time. After that, items may be released and the order cancelled.",
    ],
  },
  {
    title: "Payment",
    body: [
      "We accept GCash, Maya, credit and debit cards, and cash on delivery. Card details are handled by our payment provider — we never store full card numbers.",
      "For cash on delivery, please prepare the exact amount where possible. Change above ₱500 may not be available.",
    ],
  },
  {
    title: "Accounts",
    body: [
      "You’re responsible for keeping your login details safe and for activity that happens under your account.",
      "You can update or delete your account at any time. We may suspend accounts used for fraud, abuse, or repeated chargebacks.",
    ],
  },
  {
    title: "Cancellations and refunds",
    body: [
      "You can cancel or change an order any time before it starts preparing. Once your order is preparing, cancellation may not be possible.",
      "If something’s wrong with your order, contact us within 24 hours. We’ll make it right — replacement, credit, or refund, your call.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The Kapresco name, logo, menu descriptions, photography, and site design belong to Kapresco and its licensors. You may not copy or reuse them commercially without written permission.",
    ],
  },
  {
    title: "Liability",
    body: [
      "The site is provided as-is. To the extent the law allows, Kapresco isn’t liable for indirect or consequential losses arising from its use.",
    ],
  },
  {
    title: "Privacy",
    body: [
      "We only collect what we need to serve you: contact details you provide, what you order, and basic site usage. We don’t sell your data.",
      "You can ask us to access, correct, or delete your data at any time by emailing us.",
    ],
  },
  {
    title: "Changes and contact",
    body: [
      "We may update these terms from time to time. The date at the top of this page always reflects the latest version.",
      `Questions? Email ${BRAND.email}, call ${BRAND.phone}, or visit us at ${BRAND.fullAddress}.`,
    ],
  },
];

export default function Terms() {
  return (
    <>
      <PageIntro
        eyebrow="THE FINE PRINT"
        title="Terms and Policies"
        description="Plain-language terms for ordering, paying, and chilling at Kapresco."
        image="/images/coffee-image-7499d99f.png"
      />

      <section className="section">
        <div className="container">
          <article className="prose">
            <p className="prose__updated">Last updated {UPDATED}</p>

            <p className="prose__callout">
              This is a demonstration website. No real orders are fulfilled and no payments are processed — these terms
              exist to show how a live Kapresco site would behave.
            </p>

            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
