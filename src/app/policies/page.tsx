import type { Metadata } from "next";

import { SITE, SITE_PLACE } from "@site";
import { LegalPage } from "@/components/site/legal";
import { Phones } from "@/components/site/ui";
import { CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Policies",
  description: `Cancellation and refund policy, house rules and privacy policy for ${SITE.name}.`,
};

const SECTIONS = [
  { id: "cancellation", label: "Cancellation & refunds" },
  { id: "house-rules", label: "House rules" },
  { id: "privacy", label: "Privacy" },
];

export default function PoliciesPage() {
  return (
    <LegalPage
      eyebrow="Our promise"
      title="Policies & house rules"
      updated="5 October 2026"
      intro={`We truly value your choice to stay with us at ${SITE.name}. Our policies are designed with care — to ensure that every guest experience remains tranquil, fair, and memorable for all who visit.`}
      jump={SECTIONS}
    >
      <h2 id="cancellation" className="scroll-mt-28">1. Cancellation &amp; refund policy</h2>
      <p>
        At {SITE.name}, every reservation is personal. With only a limited number of carefully curated spaces, each
        booking is both a commitment from us and a valued intention from you. While we understand that plans may
        change, our policies are designed to balance flexibility for our guests with the responsibility of keeping our
        retreat running smoothly.
      </p>

      <h3>Flexible cancellation terms</h3>
      <ul>
        <li>
          <strong>Free cancellation:</strong> you may cancel your reservation <strong>up to 7 days before arrival</strong>{" "}
          at no charge.
        </li>
        <li>
          <strong>Late cancellation:</strong> if you need to cancel <strong>within 7 days of arrival</strong>, a{" "}
          <strong>50% charge of the total booking amount</strong> will apply.
        </li>
        <li>
          <strong>Last-minute cancellation or no-show:</strong> cancellations made <strong>within 3 days of arrival</strong>,
          or failure to arrive without notice, will result in a <strong>100% charge of the total booking value</strong>.
        </li>
      </ul>

      <h3>Refunds</h3>
      <ul>
        <li>
          Cancellations <strong>7 or more days before arrival: full refund</strong>.
        </li>
        <li>
          Cancellations <strong>between 3 and 7 days before arrival: 50% refund</strong>.
        </li>
        <li>
          Cancellations <strong>within 3 days of arrival</strong>, or no-shows: <strong>non-refundable</strong>.
        </li>
        <li>
          <strong>Refund processing:</strong> approved refunds will be processed using the{" "}
          <strong>same payment method</strong> used at the time of booking. Please allow{" "}
          <strong>7–14 business days</strong> for the refund to reflect, depending on your bank or payment provider.
        </li>
      </ul>

      <h3>Adjusting your stay</h3>
      <p>
        We are happy to help with <strong>date changes</strong>, subject to availability. Please note that{" "}
        <strong>changes made within 7 days of arrival</strong> are treated as a cancellation and rebooking under the
        same terms above.
      </p>

      <h3>Early departures</h3>
      <p>
        Should you leave earlier than planned, the <strong>full amount of the original reservation still applies</strong>,
        as your space is reserved exclusively for you.
      </p>

      <h3>Group bookings</h3>
      <p>
        For bookings of <strong>three rooms or more</strong>, we kindly request a <strong>30-day notice</strong> for
        cancellations or changes.
      </p>

      <h3>Special rates &amp; offers</h3>
      <p>
        Non-refundable and promotional bookings are <strong>final</strong> and <strong>cannot be modified or cancelled</strong>.
      </p>

      <h3>Unforeseen circumstances</h3>
      <p>
        In the event of unexpected disruptions — such as natural events or travel restrictions — we will do our best to
        offer a <strong>credit or date change for a future stay</strong>.
      </p>

      <h2 id="house-rules" className="scroll-mt-28">2. House rules</h2>
      <p>
        This space is intentionally quiet and reflective. While we welcome all guests, this stay is best suited for
        those who honor peace, mindfulness, and intentional living.
      </p>
      <ul>
        <li>No parties or loud gatherings are allowed.</li>
        <li>Guests are encouraged to enjoy a stay of calm, clarity, and space to be.</li>
        <li>Please respect other guests and the environment.</li>
        <li>Check-in/check-out times, pet policy, and smoking rules (if applicable) should be observed.</li>
      </ul>

      <h2 id="privacy" className="scroll-mt-28">3. Privacy policy</h2>
      <p>
        Every reservation at {SITE.name} is personal, and so is the information you share with us. This section
        explains what we collect when you use our website or stay with us, and how we look after it.
      </p>

      <h3>Who we are</h3>
      <p>
        {SITE.name}, {SITE_PLACE}, {SITE.location.country}.
      </p>

      <h3>What we collect</h3>
      <ul>
        <li>
          <strong>Account details:</strong> your name and email address, and a password if you sign up with email. If
          you choose “Continue with Google”, Google shares your name, email address and profile picture with us.
        </li>
        <li>
          <strong>Booking details:</strong> the apartment, dates, number of guests, extras, your phone number, payment
          method and booking reference.
        </li>
        <li>
          <strong>Messages:</strong> anything you send us by email, phone, WhatsApp or the contact form.
        </li>
      </ul>

      <h3>How we use it</h3>
      <ul>
        <li>To create your account and let you sign in securely.</li>
        <li>To confirm and manage your bookings and send you your access details for your stay.</li>
        <li>To reply to your questions and send emails about your bookings or account.</li>
        <li>To keep the records the law requires.</li>
      </ul>
      <p>We never sell your information or use it for advertising.</p>

      <h3>Cookies</h3>
      <ul>
        <li>
          <strong>Sign-in:</strong> a cookie keeps you signed in until you sign out.
        </li>
        <li>
          <strong>Your trip:</strong> your trip draft, bookings made on this device and preferred currency are saved in
          your browser for convenience.
        </li>
      </ul>
      <p>We don&apos;t use advertising or tracking cookies.</p>

      <h3>Embedded content and services</h3>
      <p>We use a small number of trusted services to run the website, and share only what each one needs:</p>
      <ul>
        <li>
          <strong>Supabase</strong> stores accounts and handles sign-in.
        </li>
        <li>
          <strong>Vercel</strong> hosts the website.
        </li>
        <li>
          <strong>Google</strong>, if you choose to sign in with Google.
        </li>
        <li>
          <strong>MTN and Airtel</strong> process mobile money payments.
        </li>
        <li>
          <strong>WhatsApp</strong>, if you choose to message us there.
        </li>
      </ul>

      <h3>Data retention</h3>
      <ul>
        <li>Your account is kept for as long as it is open. You can ask us to delete it at any time.</li>
        <li>Booking records are kept for as long as tax and accounting rules require, then deleted.</li>
      </ul>

      <h3>Your rights</h3>
      <p>
        Under Uganda&apos;s Data Protection and Privacy Act, 2019, you can request a copy of the personal data we hold
        about you, ask us to correct it, or request erasure, excluding records we must keep for administrative or legal
        reasons. Email <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a> and we&apos;ll respond within 30 days.
      </p>

      <h3>Data security</h3>
      <p>
        Your information travels over encrypted connections, and passwords are stored in hashed form, never in plain
        text. Only the people who manage your bookings can see your booking details.
      </p>

      <h3>Changes to this policy</h3>
      <p>If we change this policy, we&apos;ll update the date at the top of this page.</p>

      <h2>Contact &amp; assistance</h2>
      <p>
        Reservations: <a href={`mailto:${CONFIG.reservationsEmail}`}>{CONFIG.reservationsEmail}</a>
        <br />
        General and privacy requests: <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
        <br />
        Phone: <Phones sep=", " />
      </p>
    </LegalPage>
  );
}
