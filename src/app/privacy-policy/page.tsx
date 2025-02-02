import React from "react"
import MainLayout from "../Layout/MainLayout"

function page() {
  return (
    <div>
      <MainLayout>
        <main style={{ paddingTop: 60 }}>
          <div className="mb-4 pb-4" />
          <section className="privacy-policy container">
            <div className="mw-930">
              <h2 className="page-title">PRIVACY POLICY</h2>
            </div>
            <div className="privacy-policy__content pb-5 mb-5">
              <div className="mw-930">
                <h3 className="mb-4 mt-4">Introduction</h3>
                <p className="fs-6 fw-medium mb-4">
                  At Hanboka, your privacy is of utmost importance to us. This Privacy Policy
                  explains how we collect, use, and protect your information when you use our
                  website.
                </p>

                <h3 className="mb-4">Information We Collect</h3>
                <p className="mb-4">
                  We may collect personal information such as your name, email address, phone
                  number, and payment details when you place an order or sign up for our services.
                </p>

                <h3 className="mb-4">How We Use Your Information</h3>
                <p className="mb-4">
                  The information we collect is used to:
                  <ul>
                    <li>Process your orders and payments</li>
                    <li>Provide customer support</li>
                    <li>Send updates, promotional offers, and notifications</li>
                    <li>Improve our website and services</li>
                  </ul>
                </p>

                <h3 className="mb-4">Data Sharing</h3>
                <p className="mb-4">
                  We do not sell or share your personal information with third parties, except as
                  necessary to process your orders (e.g., payment processors, shipping companies) or
                  comply with legal requirements.
                </p>

                <h3 className="mb-4">Cookies and Tracking</h3>
                <p className="mb-4">
                  We use cookies to improve your browsing experience and analyze website traffic.
                  You can manage your cookie preferences through your browser settings.
                </p>

                <h3 className="mb-4">Data Security</h3>
                <p className="mb-4">
                  We implement strict security measures to protect your personal information from
                  unauthorized access, alteration, or disclosure.
                </p>

                <h3 className="mb-4">Your Rights</h3>
                <p className="mb-4">
                  You have the right to access, update, or delete your personal information. To
                  exercise these rights, please contact us at support@hanboka.com.
                </p>

                <h3 className="mb-4">Changes to This Policy</h3>
                <p className="mb-4">
                  We reserve the right to update this Privacy Policy at any time. Any changes will
                  be posted on this page.
                </p>

                <h3 className="mb-4">Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about our Privacy Policy, please contact us at
                  support@hanboka.com.
                </p>
              </div>
            </div>
          </section>
        </main>
      </MainLayout>
    </div>
  )
}

export default page
