import React from "react"
import MainLayout from "../Layout/MainLayout"

function page() {
  return (
    <div>
      <MainLayout>
        <main style={{ paddingTop: 60 }}>
          <div className="mb-4 pb-4" />
          <section className="terms-of-service container">
            <div className="mw-930">
              <h2 className="page-title">TERMS OF SERVICE</h2>
            </div>
            <div className="terms-of-service__content pb-5 mb-5">
              <div className="mw-930">
                <h3 className="mb-4 mt-4">Introduction</h3>
                <p className="fs-6 fw-medium mb-4">
                  Welcome to Hanboka. By using our website, you agree to comply with and be bound by
                  the following Terms of Service. Please review them carefully.
                </p>

                <h3 className="mb-4">Account and Registration</h3>
                <p className="mb-4">
                  To access certain features, you may be required to create an account. You agree to
                  provide accurate and complete information during the registration process.
                </p>

                <h3 className="mb-4">Order and Payment</h3>
                <p className="mb-4">
                  All orders are subject to availability and confirmation of payment. We reserve the
                  right to refuse or cancel any order for any reason.
                </p>

                <h3 className="mb-4">Shipping and Delivery</h3>
                <p className="mb-4">
                  We strive to deliver your order promptly. However, delivery times may vary based
                  on your location and other factors beyond our control.
                </p>

                <h3 className="mb-4">Returns and Refunds</h3>
                <p className="mb-4">
                  If you are not satisfied with your purchase, you may be eligible for a return or
                  refund. Please refer to our Returns Policy for details.
                </p>

                <h3 className="mb-4">Intellectual Property</h3>
                <p className="mb-4">
                  All content on this website, including text, graphics, and logos, is the property
                  of Hanboka and is protected by copyright laws.
                </p>

                <h3 className="mb-4">Limitation of Liability</h3>
                <p className="mb-4">
                  Hanboka is not liable for any indirect, incidental, or consequential damages
                  arising from the use of our website or products.
                </p>

                <h3 className="mb-4">Changes to Terms</h3>
                <p className="mb-4">
                  We reserve the right to update these Terms of Service at any time. Any changes
                  will be posted on this page.
                </p>

                <h3 className="mb-4">Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us at
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
