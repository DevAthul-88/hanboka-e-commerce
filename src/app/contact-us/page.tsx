import React from "react"
import MainLayout from "../Layout/MainLayout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Contact us page",
}

function page() {
  return (
    <MainLayout>
      <main>
        <div className="mb-4 pb-4" />
        <section className="contact-us container">
          <div className="mw-930">
            <h2 className="page-title">CONTACT US</h2>
          </div>
        </section>
        <section className="google-map">
          <h2 className="d-none">Our Location</h2>
          <div id="map" className="google-map__wrapper">
            {/* Embed Google Map for London */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19805.83130781342!2d-0.13568964996182848!3d51.50986539964961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761bce0333e8e7%3A0x6e6ec2b2d4f24460!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1693759402523!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
        <section className="contact-us container">
          <div className="mw-930">
            <div className="row mb-5">
              <div className="col-lg-6">
                <h3 className="mb-4">Store in London</h3>
                <p className="mb-4">
                  123 Placeholder Street, Suite 101
                  <br />
                  London, United Kingdom
                </p>
                <p className="mb-4">
                  support@hanboka.com
                  <br />
                  +44 20 1234 5678
                </p>
              </div>
              <div className="col-lg-6">
                <h3 className="mb-4">Store in Seoul</h3>
                <p className="mb-4">
                  456 Design Avenue, Suite 202
                  <br />
                  Seoul, South Korea
                </p>
                <p className="mb-4">
                  contact@hanboka.com
                  <br />
                  +82 2 9876 5432
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}

export default page
