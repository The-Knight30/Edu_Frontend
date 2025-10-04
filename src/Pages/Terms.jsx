import React from "react";

export default function Terms() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <p>
        By accessing and using <strong>Your Academy</strong>, you agree to the following terms and conditions.
      </p>
      <ul className="list-disc ml-6 mt-3 space-y-2">
        <li>All courses purchased are for personal, non-commercial use only.</li>
        <li>Sharing, reselling, or redistributing course content is strictly prohibited.</li>
        <li>Course access is granted only to the registered user account.</li>
        <li>Prices are subject to change without prior notice.</li>
        <li>We reserve the right to suspend any account violating these terms.</li>
      </ul>
      <p className="mt-4">
        If you have any questions, please contact us at: support@youracademy.com
      </p>
    </div>
  );
}
