import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p>
        At <strong>The Knight</strong>, we respect your privacy and are committed to protecting your personal data.
      </p>
      <ul className="list-disc ml-6 mt-3 space-y-2">
        <li>We collect only necessary information such as your name, email, and phone number for registration and payment purposes.</li>
        <li>Your data is stored securely and not shared with third parties except for payment processing.</li>
        <li>We may send you updates or offers related to your courses.</li>
        <li>You can contact us anytime to request data removal or updates.</li>
      </ul>
      <p className="mt-4">
        For more information, contact: theknightahmedgaber@gmail.com<br />
       
      </p>
    </div>
  );
}
